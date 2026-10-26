#!/usr/bin/env python3
"""
Broadwater Cricket Club - Play-Cricket fixtures and results sync
================================================================

Pulls the club's fixtures and results from the Play-Cricket API and writes:

    js/matches.js          read by every page of the website
    calendar/all.ics       phone calendar with every team's matches
    calendar/<team>.ics    one calendar per team (1st-xi.ics, u13.ics ...)

Only uses Python's standard library, so there is nothing to install.

Usage (run from the website folder, or anywhere - paths are relative to this file):

    python tools/update_fixtures.py               # sync this season
    python tools/update_fixtures.py --season 2027 # sync a particular season
    python tools/update_fixtures.py --list-teams  # show Play-Cricket team names and ids

Before the first run:
    1. Get an API token from Play-Cricket (see README.txt).
    2. Put your site id in tools/settings.json.
    3. Put the token in tools/api_token.txt  (or set the environment
       variable PLAYCRICKET_API_TOKEN). Never upload the token to the web.
"""

import argparse
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

TOOLS_DIR = os.path.dirname(os.path.abspath(__file__))
SITE_DIR = os.path.dirname(TOOLS_DIR)
SETTINGS_FILE = os.path.join(TOOLS_DIR, "settings.json")
TOKEN_FILE = os.path.join(TOOLS_DIR, "api_token.txt")
MATCHES_JS = os.path.join(SITE_DIR, "js", "matches.js")
CALENDAR_DIR = os.path.join(SITE_DIR, "calendar")

API_BASE = "https://play-cricket.com/api/v2/"

# Words Play-Cricket uses for a team, mapped to our website's team keys.
# Checked in order; the first pattern that matches the team name wins.
# Add explicit ids in settings.json ("team_ids") if a name doesn't match.
DEFAULT_TEAM_PATTERNS = [
    (r"\b(u|under)\s*-?\s*15", "u15"),
    (r"\b(u|under)\s*-?\s*13", "u13"),
    (r"\b(u|under)\s*-?\s*14", "u14"),
    (r"t\s*20|20\s*/\s*20|twenty", "t20"),
    (r"sunday", "sunday"),
    (r"\b1st\b|first", "1st-xi"),
    (r"\b2nd\b|second", "2nd-xi"),
    (r"\b3rd\b|third", "3rd-xi"),
]

# How long each type of match lasts, in hours (used for calendar entries).
MATCH_LENGTH_HOURS = {"1st-xi": 7, "2nd-xi": 7, "3rd-xi": 6, "sunday": 5,
                      "t20": 3, "u15": 3, "u14": 3, "u13": 3}

TEAM_NAMES = {"1st-xi": "1st XI", "2nd-xi": "2nd XI", "3rd-xi": "3rd XI",
              "sunday": "Sunday XI", "t20": "Midweek T20",
              "u15": "Under 15s", "u14": "Under 14s", "u13": "Under 13s"}


# --------------------------------------------------------------------------
# Settings and API
# --------------------------------------------------------------------------
def load_settings():
    if not os.path.exists(SETTINGS_FILE):
        sys.exit(f"Can't find {SETTINGS_FILE}. It should be in the tools folder.")
    with open(SETTINGS_FILE, encoding="utf-8") as f:
        settings = json.load(f)
    if not str(settings.get("site_id", "")).strip():
        sys.exit("Add your Play-Cricket site id to tools/settings.json first.")
    return settings


def load_token():
    token = os.environ.get("PLAYCRICKET_API_TOKEN", "").strip()
    if not token and os.path.exists(TOKEN_FILE):
        with open(TOKEN_FILE, encoding="utf-8") as f:
            token = f.read().strip()
    if not token:
        sys.exit("No API token found. Put it in tools/api_token.txt "
                 "or set the PLAYCRICKET_API_TOKEN environment variable.")
    return token


def api_get(endpoint, params):
    """Call a Play-Cricket API endpoint and return the decoded JSON."""
    url = API_BASE + endpoint + "?" + urllib.parse.urlencode(params)
    request = urllib.request.Request(url, headers={"User-Agent": "BroadwaterCC-website-sync"})
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        if e.code in (401, 403):
            sys.exit("Play-Cricket refused the API token. Check tools/api_token.txt.")
        sys.exit(f"Play-Cricket returned an error ({e.code}) for {endpoint}.")
    except urllib.error.URLError as e:
        sys.exit(f"Couldn't reach Play-Cricket: {e.reason}")


def fetch_season(settings, token, season):
    params = {"site_id": settings["site_id"], "season": season, "api_token": token}
    fixtures = api_get("matches.json", params).get("matches", [])
    results = api_get("result_summary.json", params).get("result_summary", [])
    return fixtures, results


# --------------------------------------------------------------------------
# Turning Play-Cricket data into the website's format
# --------------------------------------------------------------------------
def our_club_id(settings):
    return str(settings.get("club_id") or settings["site_id"])


def team_key_for(team_id, team_name, settings):
    """Work out which website team a Play-Cricket team belongs to."""
    explicit = settings.get("team_ids", {})
    for key, ids in explicit.items():
        if str(team_id) in [str(i) for i in (ids if isinstance(ids, list) else [ids])]:
            return key
    name = (team_name or "").lower()
    for pattern, key in DEFAULT_TEAM_PATTERNS:
        if re.search(pattern, name):
            return key
    return None


def pc_date(text):
    """'24/04/2027' -> '2027-04-24'"""
    return datetime.strptime(text, "%d/%m/%Y").strftime("%Y-%m-%d")


def innings_score(innings):
    if not innings or innings.get("runs", "") == "":
        return ""
    runs = innings.get("runs")
    wickets = str(innings.get("wickets", "")).strip()
    overs = str(innings.get("overs", "")).strip()
    score = str(runs) if wickets in ("10", "") else f"{runs}-{wickets}"
    if innings.get("declared"):
        score += "d"
    return f"{score} ({overs})" if overs else score


def result_from_summary(summary, our_team_id):
    """Return (W/L/D/T/A/C, summary text) from our team's point of view."""
    code = (summary.get("result") or "").strip().upper()
    applied_to = str(summary.get("result_applied_to") or "")
    description = summary.get("result_description") or ""

    if code in ("W", "L"):
        if applied_to and applied_to != str(our_team_id):
            code = "L" if code == "W" else "W"
    elif code in ("D", "T", "A", "C"):
        pass
    elif code in ("CON", "CONCEDED"):
        code = "W" if applied_to == str(our_team_id) else "L"
    elif code in ("N", "NR", "ABANDONED"):
        code = "A"
    elif code == "":
        return "", ""
    else:
        # Unknown code - show Play-Cricket's own wording rather than guess
        return "D", clean_description(description) or code

    return code, describe_margin(code, summary, our_team_id) or clean_description(description)


def clean_description(text):
    # "Broadwater CC - 1st XI - Win 20pts" -> "Win"; drop points
    text = re.sub(r"\s*-?\s*\d+(\.\d+)?\s*pts?\b", "", text, flags=re.I).strip(" -")
    return text.split(" - ")[-1] if " - " in text else text


def describe_margin(code, summary, our_team_id):
    labels = {"D": "Drawn", "T": "Match tied", "A": "Abandoned", "C": "Cancelled"}
    if code in labels:
        return labels[code]
    innings = summary.get("innings") or []
    if len(innings) != 2:
        return ""
    batted_first = str(summary.get("batted_first") or "")
    if batted_first and str(innings[1].get("team_batting_id")) == batted_first:
        innings = [innings[1], innings[0]]
    first, second = innings[0], innings[1]
    try:
        r1, r2 = int(first["runs"]), int(second["runs"])
        w2 = int(second.get("wickets") or 0)
    except (KeyError, ValueError, TypeError):
        return ""
    verb = "Won" if code == "W" else "Lost"
    if r2 > r1:                              # side batting second won
        return f"{verb} by {10 - w2} wicket{'s' if 10 - w2 != 1 else ''}"
    if r1 > r2:                              # side batting first won
        return f"{verb} by {r1 - r2} run{'s' if r1 - r2 != 1 else ''}"
    return ""


def build_matches(fixtures, results, settings, unmapped):
    club_id = our_club_id(settings)
    subdomain = settings.get("play_cricket_subdomain", "broadwater")
    results_by_id = {str(r.get("id")): r for r in results}

    # Results sometimes include matches the fixtures list doesn't, so use both
    all_ids = {str(m.get("id")): m for m in fixtures}
    for rid, r in results_by_id.items():
        all_ids.setdefault(rid, r)

    matches = []
    for match_id, m in all_ids.items():
        if str(m.get("status", "")).lower() == "deleted":
            continue
        home = str(m.get("home_club_id")) == club_id
        away = str(m.get("away_club_id")) == club_id
        if not (home or away):
            continue
        side = "home" if home else "away"
        other = "away" if home else "home"
        our_team_id = str(m.get(f"{side}_team_id"))
        our_team_name = m.get(f"{side}_team_name", "")
        key = team_key_for(our_team_id, our_team_name, settings)
        if not key:
            unmapped.add(f"{our_team_name} (id {our_team_id})")
            continue

        opp_club = (m.get(f"{other}_club_name") or "").strip()
        opp_team = (m.get(f"{other}_team_name") or "").strip()
        opponent = f"{opp_club} {opp_team}".strip()

        entry = {
            "id": match_id,
            "team": key,
            "date": pc_date(m["match_date"]),
            "time": m.get("match_time") or "",
            "opponent": opponent,
            "venue": "H" if home else "A",
            "competition": m.get("competition_name") or m.get("competition_type") or "",
            "ground": m.get("ground_name") or "",
            "result": "", "us": "", "them": "", "summary": "",
            "scorecard": f"https://{subdomain}.play-cricket.com/website/results/{match_id}",
        }

        summary = results_by_id.get(match_id)
        if summary:
            code, text = result_from_summary(summary, our_team_id)
            entry["result"], entry["summary"] = code, text
            for inn in summary.get("innings") or []:
                if str(inn.get("team_batting_id")) == our_team_id:
                    entry["us"] = innings_score(inn)
                else:
                    entry["them"] = innings_score(inn)
        matches.append(entry)

    matches.sort(key=lambda e: (e["date"], e["time"], e["team"]))
    return matches


# --------------------------------------------------------------------------
# Writing files
# --------------------------------------------------------------------------
def write_matches_js(matches, calendars_written):
    stamp = datetime.now().strftime("%d %B %Y, %H:%M")
    lines = [
        "/* =====================================================================",
        "   BROADWATER CRICKET CLUB - FIXTURES AND RESULTS",
        "   Generated by tools/update_fixtures.py from Play-Cricket.",
        "   Don't edit by hand: changes are overwritten on the next sync.",
        "   ===================================================================== */",
        "",
        "const SAMPLE_DATA = false;",
        f"const LAST_SYNC = {json.dumps(stamp)};",
        f"const CALENDAR_FILES = {'true' if calendars_written else 'false'};",
        "",
        "const MATCHES = [",
    ]
    lines += ["  " + json.dumps(m, ensure_ascii=False) + "," for m in matches]
    if matches:
        lines[-1] = lines[-1].rstrip(",")
    lines.append("];")
    with open(MATCHES_JS, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def ics_escape(text):
    return (str(text).replace("\\", "\\\\").replace(";", "\\;")
            .replace(",", "\\,").replace("\n", "\\n"))


def ics_fold(line):
    """iCalendar lines must be no longer than 75 bytes."""
    raw = line.encode("utf-8")
    if len(raw) <= 75:
        return line
    parts, current = [], b""
    for ch in line:
        b = ch.encode("utf-8")
        if len(current) + len(b) > (75 if not parts else 74):
            parts.append(current.decode("utf-8"))
            current = b""
        current += b
    parts.append(current.decode("utf-8"))
    return "\r\n ".join(parts)


LONDON_VTIMEZONE = [
    "BEGIN:VTIMEZONE", "TZID:Europe/London",
    "BEGIN:DAYLIGHT", "TZOFFSETFROM:+0000", "TZOFFSETTO:+0100", "TZNAME:BST",
    "DTSTART:19700329T010000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU", "END:DAYLIGHT",
    "BEGIN:STANDARD", "TZOFFSETFROM:+0100", "TZOFFSETTO:+0000", "TZNAME:GMT",
    "DTSTART:19701025T020000", "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU", "END:STANDARD",
    "END:VTIMEZONE",
]


def build_ics(matches, calendar_name, home_ground):
    now = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")
    out = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Broadwater Cricket Club//Fixtures//EN",
           "CALSCALE:GREGORIAN", "METHOD:PUBLISH",
           f"X-WR-CALNAME:{ics_escape(calendar_name)}", "X-WR-TIMEZONE:Europe/London",
           "REFRESH-INTERVAL;VALUE=DURATION:PT12H", "X-PUBLISHED-TTL:PT12H"]
    out += LONDON_VTIMEZONE
    for m in matches:
        team = TEAM_NAMES.get(m["team"], m["team"])
        start = datetime.strptime(f"{m['date']} {m['time'] or '13:00'}", "%Y-%m-%d %H:%M")
        end = start + timedelta(hours=MATCH_LENGTH_HOURS.get(m["team"], 5))
        where = m.get("ground") or (home_ground if m["venue"] == "H" else m["opponent"])
        title = f"Broadwater {team} v {m['opponent']} ({'H' if m['venue'] == 'H' else 'A'})"
        if m.get("result"):
            title += f" - {m['summary'] or m['result']}"
        notes = [m.get("competition") or ""]
        if m.get("us"):
            notes.append(f"Broadwater {m['us']} v {m['them']}")
        if m.get("scorecard"):
            notes.append(m["scorecard"])
        uid = f"pc-{m['id']}@broadwatercc" if m.get("id") else \
              f"{m['team']}-{m['date']}-{re.sub(r'[^a-z0-9]', '', m['opponent'].lower())}@broadwatercc"
        out += ["BEGIN:VEVENT", f"UID:{uid}", f"DTSTAMP:{now}",
                f"DTSTART;TZID=Europe/London:{start:%Y%m%dT%H%M%S}",
                f"DTEND;TZID=Europe/London:{end:%Y%m%dT%H%M%S}",
                f"SUMMARY:{ics_escape(title)}",
                f"LOCATION:{ics_escape(where)}",
                f"DESCRIPTION:{ics_escape(chr(10).join(n for n in notes if n))}"]
        if m.get("result") in ("A", "C"):
            out.append("STATUS:CANCELLED")
        out.append("END:VEVENT")
    out.append("END:VCALENDAR")
    return "\r\n".join(ics_fold(line) for line in out) + "\r\n"


def write_calendars(matches, settings):
    os.makedirs(CALENDAR_DIR, exist_ok=True)
    ground = settings.get("home_ground", "Broadwater Green, Worthing")
    files = {"all": ("Broadwater CC - all teams", matches)}
    for key, name in TEAM_NAMES.items():
        files[key] = (f"Broadwater CC - {name}", [m for m in matches if m["team"] == key])
    for filename, (title, team_matches) in files.items():
        with open(os.path.join(CALENDAR_DIR, f"{filename}.ics"), "w", encoding="utf-8", newline="") as f:
            f.write(build_ics(team_matches, title, ground))
    return len(files)


# --------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser(description="Sync Broadwater CC fixtures from Play-Cricket.")
    parser.add_argument("--season", type=int, help="season to fetch (default: this year)")
    parser.add_argument("--list-teams", action="store_true", help="list our Play-Cricket teams and stop")
    args = parser.parse_args()

    settings = load_settings()
    token = load_token()
    season = args.season or datetime.now().year

    # Over the winter, also pick up next season's fixtures as soon as they're published
    seasons = [season]
    if not args.season and datetime.now().month >= 10:
        seasons.append(season + 1)

    fixtures, results = [], []
    for s in seasons:
        f, r = fetch_season(settings, token, s)
        print(f"Season {s}: {len(f)} fixtures, {len(r)} results from Play-Cricket")
        fixtures += f
        results += r

    if args.list_teams:
        club_id, seen = our_club_id(settings), {}
        for m in fixtures + results:
            for side in ("home", "away"):
                if str(m.get(f"{side}_club_id")) == club_id:
                    seen[str(m.get(f"{side}_team_id"))] = m.get(f"{side}_team_name")
        for tid, name in sorted(seen.items(), key=lambda x: x[1] or ""):
            print(f"  {name:<25} id {tid:<10} -> {team_key_for(tid, name, settings) or 'NOT MAPPED'}")
        return

    unmapped = set()
    matches = build_matches(fixtures, results, settings, unmapped)
    if not matches:
        sys.exit("No Broadwater matches found - matches.js left unchanged. "
                 "Check site_id and club_id in tools/settings.json.")

    count = write_calendars(matches, settings)
    write_matches_js(matches, calendars_written=True)
    played = sum(1 for m in matches if m["result"])
    print(f"Wrote js/matches.js: {len(matches)} matches ({played} results, {len(matches) - played} fixtures)")
    print(f"Wrote {count} calendar files to calendar/")
    if unmapped:
        print("Skipped matches for teams the website doesn't know about:")
        for name in sorted(unmapped):
            print(f"  {name}  - add its id to team_ids in tools/settings.json to include it")


if __name__ == "__main__":
    main()
