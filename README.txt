BROADWATER CRICKET CLUB WEBSITE
===============================

Open index.html in a browser to view the site. No server or database is
needed: it's plain HTML, CSS and JavaScript, so it can be uploaded to any
web host (e.g. GitHub Pages, Netlify, or the club's own hosting).

PAGES
  index.html        Home page
  history.html      Club history timeline
  first-xi.html     1st XI  } fixtures, results, captain, season record
  second-xi.html    2nd XI  }
  third-xi.html     3rd XI  }
  other-teams.html  Sunday XI and midweek T20
  juniors.html      Under 15s, Under 13s, Under 12s (tabs)
  fixtures.html     All fixtures and results, filterable by team

FILES YOU EDIT
  js/data.js        Club details, captains, divisions, team descriptions
  js/matches.js     Fixtures and results (written by the Play-Cricket
                    script, or edit by hand until the script is set up)


PULLING FIXTURES AND RESULTS FROM PLAY-CRICKET
---------------------------------------------
tools/update_fixtures.py fetches the club's fixtures and results from the
Play-Cricket API and rewrites js/matches.js and the calendar/ folder.
It only uses Python's standard library (Python 3.8 or later).

1. Get an API token
   A main Play-Cricket admin or committee member must contact the
   Play-Cricket help desk to request API access for the club. They sign
   an agreement on the club's behalf and the ECB then issues a token.
   The API is meant for overnight/after-play syncing, not live scores.

2. Fill in tools/settings.json
   "site_id"  the club's Play-Cricket site id (ask the help desk when
              you request the token if you can't find it)
   "club_id"  leave blank unless the help desk says it differs from
              the site id

3. Save the token
   Put it, on its own, in a new file: tools/api_token.txt
   (or set an environment variable called PLAYCRICKET_API_TOKEN).
   NEVER upload api_token.txt to the website.

4. Check the teams are recognised
       python tools/update_fixtures.py --list-teams
   Each Play-Cricket team is matched to a website team by its name
   (1st XI, 2nd XI, 3rd XI, Sunday, T20, U15, U13, U12). If one says
   NOT MAPPED, add its id to "team_ids" in settings.json, e.g.
       "t20": [123456]

5. Run it
       python tools/update_fixtures.py
   From October onwards it also fetches next season, so fixtures appear
   as soon as the league publishes them. Use --season 2027 to fetch a
   particular season. Then upload js/matches.js and the calendar folder.

Running it automatically
   If the site is hosted on GitHub Pages, .github/workflows/update-fixtures.yml
   runs the script every night and on Saturday and Sunday evenings, then
   publishes the changes. Add the token as a repository secret called
   PLAYCRICKET_API_TOKEN (Settings > Secrets and variables > Actions).
   Otherwise, run the script by hand after each weekend, or schedule it
   with Windows Task Scheduler.


PHONE CALENDARS
---------------
Every fixtures table has a "Fixtures in your calendar" box.
  Download calendar file   adds the upcoming matches to a phone once.
                           Works straight away, even with sample data.
  Subscribe on this phone  appears once the site is online and the
                           Play-Cricket script has run. The phone then
                           keeps itself up to date as fixtures change.
Calendars are available for all teams or any single team.


REPLACING PHOTOS
----------------
Every placeholder in images/ says what it's for and its ideal size.
Save your photo over it with the SAME file name (e.g. hero.jpg).
Landscape photos work best for hero.jpg; portrait for team-1st/2nd/3rd.jpg
and green.jpg. Keep files under ~500 KB each so pages load quickly.
Photos of juniors need parental consent before publishing.


WHAT NOT TO UPLOAD TO A NORMAL WEB HOST
  tools/api_token.txt   (the secret token)
  The rest of tools/ and .github/ are harmless but not needed online.


STILL TO FILL IN
  - Postcode and email (js/data.js, CLUB section)
  - League divisions and captains (js/data.js, TEAMS section)
  - Sponsor logos (index.html, "Our sponsors" section)
  - Junior training night, team managers, Welfare Officer (juniors.html)
  - Club stories for the 20th century (history.html); check the history
    facts with the club before publishing
  - Sunday/T20 captains and formats (other-teams.html)
