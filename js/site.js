/* Broadwater CC — shared header, footer and fixtures rendering.
   You shouldn't need to edit this file: match data lives in data.js,
   and the menu is built from the NAV list below. */

const NAV = [
  { label: "Home", href: "index.html", page: "home" },
  { label: "History", href: "history.html", page: "history" },
  { label: "Saturday XIs", page: "saturday", children: [
      { label: "1st XI", href: "first-xi.html" },
      { label: "2nd XI", href: "second-xi.html" },
      { label: "3rd XI", href: "third-xi.html" } ] },
  { label: "Sunday & T20", href: "other-teams.html", page: "other" },
  { label: "Juniors", href: "juniors.html", page: "juniors" },
  { label: "Fixtures & results", href: "fixtures.html", page: "fixtures" }
];

const RESULT_TEXT = { W: "Won", L: "Lost", D: "Drawn", T: "Tied", A: "Abandoned", C: "Cancelled" };

/* ---------- helpers ---------- */
function el(tag, attrs = {}, html = "") {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (html) e.innerHTML = html;
  return e;
}
function esc(s) {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" }[c]));
}
function parseDate(m) { return new Date(m.date + "T" + (m.time || "12:00")); }
function fmtDate(m, opts = { weekday: "short", day: "numeric", month: "short" }) {
  return parseDate(m).toLocaleDateString("en-GB", opts);
}
function played(m) { return m.result !== ""; }
// A match counts as a fixture until its day is over; after that it shows
// under results ("Awaiting result") even if the score isn't in yet.
function upcoming(m) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  return !played(m) && new Date(m.date + "T23:59") >= today;
}
function teamName(key) { return TEAMS[key] ? TEAMS[key].name : key; }

function getMatches({ team = null, teams = null, mode = "all", limit = 0 } = {}) {
  let list = MATCHES.filter(m =>
    (!team || m.team === team) && (!teams || teams.includes(m.team)));
  if (mode === "results") list = list.filter(m => !upcoming(m)).sort((a, b) => parseDate(b) - parseDate(a));
  else if (mode === "fixtures") list = list.filter(upcoming).sort((a, b) => parseDate(a) - parseDate(b));
  else list = list.sort((a, b) => parseDate(a) - parseDate(b));
  return limit ? list.slice(0, limit) : list;
}

/* ---------- header & footer ---------- */
function buildHeader() {
  const current = document.body.dataset.page;
  const header = el("header", { class: "site-header" });
  const items = NAV.map(item => {
    const active = item.page === current ? ' aria-current="page"' : "";
    if (item.children) {
      const sub = item.children.map(c => `<li><a href="${c.href}">${c.label}</a></li>`).join("");
      return `<li class="has-sub"><button class="sub-toggle" aria-expanded="false"${active}>${item.label}<span class="caret" aria-hidden="true"></span></button><ul class="sub">${sub}</ul></li>`;
    }
    return `<li><a href="${item.href}"${active}>${item.label}</a></li>`;
  }).join("");

  header.innerHTML = `
    <div class="header-inner">
      <a class="brand" href="index.html">
        <img src="images/logo.png" alt="" width="44" height="44">
        <span class="brand-text"><span class="brand-name">Broadwater</span><span class="brand-sub">Cricket Club, est. 1771</span></span>
      </a>
      <button class="menu-toggle" aria-expanded="false" aria-controls="site-nav">Menu</button>
      <nav id="site-nav" aria-label="Main"><ul>${items}</ul>
        <a class="btn btn-gold nav-cta" href="index.html#join">Join the club</a>
      </nav>
    </div>`;
  document.body.prepend(header);

  const toggle = header.querySelector(".menu-toggle");
  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("nav-open");
    toggle.setAttribute("aria-expanded", open);
  });
  header.querySelectorAll(".sub-toggle").forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      const li = btn.parentElement;
      const open = li.classList.toggle("open");
      btn.setAttribute("aria-expanded", open);
    });
  });
  document.addEventListener("click", () => header.querySelectorAll(".has-sub.open").forEach(li => {
    li.classList.remove("open"); li.querySelector("button").setAttribute("aria-expanded", "false");
  }));

  // Solid header once scrolled (home page hero sits under a transparent header)
  const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 40);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

function buildFooter() {
  const socials = [["Facebook", CLUB.facebook], ["Instagram", CLUB.instagram], ["X", CLUB.x]]
    .filter(([, url]) => url)
    .map(([n, url]) => `<li><a href="${url}" rel="noopener">${n}</a></li>`).join("");
  const footer = el("footer", { class: "site-footer" });
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-brand">
        <img src="images/logo.png" alt="Broadwater Cricket Club crest" width="72" height="72">
        <p class="footer-name">Broadwater Cricket Club</p>
        <p class="footer-tag">Worthing's oldest cricket club. Playing on ${esc(CLUB.ground)} since ${CLUB.founded}.</p>
      </div>
      <div>
        <h2 class="footer-h">Teams</h2>
        <ul>
          <li><a href="first-xi.html">1st XI</a></li>
          <li><a href="second-xi.html">2nd XI</a></li>
          <li><a href="third-xi.html">3rd XI</a></li>
          <li><a href="other-teams.html">Sunday XI and T20</a></li>
          <li><a href="juniors.html">Juniors</a></li>
        </ul>
      </div>
      <div>
        <h2 class="footer-h">Club</h2>
        <ul>
          <li><a href="history.html">Our history</a></li>
          <li><a href="fixtures.html">Fixtures and results</a></li>
          <li><a href="${CLUB.playCricket}" rel="noopener">Play-Cricket scorecards</a></li>
          ${socials}
        </ul>
      </div>
      <div>
        <h2 class="footer-h">Find us</h2>
        <p>${esc(CLUB.address)}</p>
        <p><a href="mailto:${CLUB.email}">${esc(CLUB.email)}</a></p>
      </div>
    </div>
    <p class="footer-base">&copy; ${new Date().getFullYear()} Broadwater Cricket Club</p>`;
  document.body.append(footer);
}

/* ---------- match tables ---------- */
function matchRow(m, showTeam) {
  const isPlayed = played(m);
  const venue = m.venue === "H" ? "Home" : "Away";
  const awaiting = !isPlayed && !upcoming(m);
  const badge = isPlayed
    ? `<span class="res res-${m.result}">${RESULT_TEXT[m.result] || m.result}</span>`
    : awaiting ? `<span class="res res-A">Awaiting result</span>`
    : `<span class="res res-up">${esc(m.time)}</span>`;
  const scores = isPlayed && m.us
    ? `<span class="score"><b>Broadwater ${esc(m.us)}</b><span class="v">v</span>${esc(m.them)}</span>`
    : "";
  const summary = isPlayed ? esc(m.summary) : awaiting ? "" : esc(m.competition);
  const link = isPlayed && m.scorecard && m.result !== "A" && m.result !== "C"
    ? ` <a class="card-link" href="${m.scorecard}" rel="noopener">Scorecard</a>` : "";
  return `
    <tr>
      <td class="c-date"><span class="d">${fmtDate(m)}</span><span class="y">${parseDate(m).getFullYear()}</span></td>
      ${showTeam ? `<td class="c-team">${esc(teamName(m.team))}</td>` : ""}
      <td class="c-opp"><span class="opp">${esc(m.opponent)}</span><span class="ha ha-${m.venue}">${venue}</span>${scores}</td>
      <td class="c-res">${badge}<span class="sum">${summary}${link}</span></td>
    </tr>`;
}

function renderTable(container, opts) {
  const list = getMatches(opts);
  const showTeam = !opts.team;
  if (!list.length) {
    container.innerHTML = `<p class="empty">${opts.mode === "fixtures"
      ? "Next season's fixtures haven't been published yet. They'll appear here once the league releases them."
      : "No results yet this season."}</p>`;
    return;
  }
  container.innerHTML = `
    <table class="matches">
      <thead><tr><th scope="col">Date</th>${showTeam ? '<th scope="col">Team</th>' : ""}<th scope="col">Opposition</th><th scope="col">${opts.mode === "fixtures" ? "Start" : "Result"}</th></tr></thead>
      <tbody>${list.map(m => matchRow(m, showTeam)).join("")}</tbody>
    </table>`;
}

function sampleNotice() {
  if (SAMPLE_DATA) return `<p class="sample-note">Sample fixtures shown. Run the Play-Cricket script, or edit <code>js/matches.js</code>, to show real ones.</p>`;
  return LAST_SYNC ? `<p class="sync-note">Updated from Play-Cricket ${esc(LAST_SYNC)}</p>` : "";
}

/* ---------- phone calendars ----------
   Any element with data-calendar gets "Add to my calendar" buttons.
   Optional data-team="1st-xi" limits it to one team. */
const MATCH_HOURS = { "1st-xi": 7, "2nd-xi": 7, "3rd-xi": 6, sunday: 5, t20: 3, u15: 3, u13: 3, u12: 3 };

function icsEscape(s) { return String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n"); }
function icsStamp(d) { // local wall-clock time, used with TZID=Europe/London
  const p = n => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}00`;
}
function icsFold(line) {
  const out = []; let cur = "";
  for (const ch of line) { if ((cur + ch).length > (out.length ? 74 : 75)) { out.push(cur); cur = ""; } cur += ch; }
  out.push(cur); return out.join("\r\n ");
}
function buildICS(matches, name) {
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, "");
  const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Broadwater Cricket Club//Fixtures//EN",
    "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${icsEscape(name)}`,
    "BEGIN:VTIMEZONE", "TZID:Europe/London",
    "BEGIN:DAYLIGHT", "TZOFFSETFROM:+0000", "TZOFFSETTO:+0100", "TZNAME:BST", "DTSTART:19700329T010000", "RRULE:FREQ=YEARLY;BYMONTH=3;BYDAY=-1SU", "END:DAYLIGHT",
    "BEGIN:STANDARD", "TZOFFSETFROM:+0100", "TZOFFSETTO:+0000", "TZNAME:GMT", "DTSTART:19701025T020000", "RRULE:FREQ=YEARLY;BYMONTH=10;BYDAY=-1SU", "END:STANDARD",
    "END:VTIMEZONE"];
  matches.forEach(m => {
    const start = parseDate(m);
    const end = new Date(start.getTime() + (MATCH_HOURS[m.team] || 5) * 3600000);
    const where = m.ground || (m.venue === "H" ? CLUB.address : m.opponent);
    const uid = m.id ? `pc-${m.id}@broadwatercc` : `${m.team}-${m.date}-${m.opponent.toLowerCase().replace(/[^a-z0-9]/g, "")}@broadwatercc`;
    const notes = [m.competition, m.scorecard].filter(Boolean).join("\n");
    lines.push("BEGIN:VEVENT", `UID:${uid}`, `DTSTAMP:${now}`,
      `DTSTART;TZID=Europe/London:${icsStamp(start)}`, `DTEND;TZID=Europe/London:${icsStamp(end)}`,
      `SUMMARY:${icsEscape(`Broadwater ${teamName(m.team)} v ${m.opponent} (${m.venue})`)}`,
      `LOCATION:${icsEscape(where)}`, `DESCRIPTION:${icsEscape(notes)}`, "END:VEVENT");
  });
  lines.push("END:VCALENDAR");
  return lines.map(icsFold).join("\r\n") + "\r\n";
}

function renderCalendars() {
  document.querySelectorAll("[data-calendar]").forEach(box => {
    const key = box.dataset.team || "";
    const label = key ? teamName(key) : "all teams";
    const upcoming = getMatches({ team: key || null, mode: "fixtures" });
    const file = key || "all";

    // Subscribing keeps a phone up to date; only possible once the site is online
    // and the Play-Cricket script has written the calendar files.
    let subscribe = "";
    if (CALENDAR_FILES && location.protocol.startsWith("http")) {
      const url = new URL(`calendar/${file}.ics`, location.href);
      const webcal = url.href.replace(/^https?:/, "webcal:");
      subscribe = `
        <a class="btn btn-navy" href="${webcal}">Subscribe on this phone</a>
        <details class="cal-help"><summary>Other ways to subscribe</summary>
          <p>In Google Calendar on a computer, choose <b>Other calendars</b>, then <b>From URL</b>, and paste:</p>
          <p><code>${esc(url.href)}</code></p>
          <p>Subscribed calendars update by themselves when fixtures change.</p>
        </details>`;
    }

    box.innerHTML = `
      <div class="cal-box">
        <div class="cal-text">
          <h2>Fixtures in your calendar</h2>
          <p>${subscribe ? "Subscribe to keep your phone up to date automatically, or add" : "Add"} ${upcoming.length ? `the ${upcoming.length} upcoming match${upcoming.length === 1 ? "" : "es"} for ${label}` : `fixtures for ${label}`} to your phone's calendar.</p>
        </div>
        <div class="cal-actions">
          ${subscribe}
          <button class="btn ${subscribe ? "btn-outline" : "btn-navy"}" type="button" ${upcoming.length ? "" : "disabled"}>${upcoming.length ? "Download calendar file" : "No fixtures to add yet"}</button>
        </div>
      </div>`;

    const btn = box.querySelector("button");
    btn.addEventListener("click", () => {
      const ics = buildICS(upcoming, `Broadwater CC - ${key ? teamName(key) : "all teams"}`);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      a.download = `broadwater-${file}.ics`;
      document.body.append(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    });
  });
}

/* Any element with data-matches="results|fixtures|all" gets a table.
   Optional: data-team="1st-xi" or data-teams="u15,u13,u12", data-limit="5" */
function renderAllTables() {
  document.querySelectorAll("[data-matches]").forEach(c => {
    renderTable(c, {
      mode: c.dataset.matches,
      team: c.dataset.team || null,
      teams: c.dataset.teams ? c.dataset.teams.split(",") : null,
      limit: +c.dataset.limit || 0
    });
  });
  document.querySelectorAll("[data-sample-note]").forEach(c => c.innerHTML = sampleNotice());
}

/* ---------- tabs ---------- */
function initTabs() {
  document.querySelectorAll(".tabs").forEach(tabs => {
    const buttons = tabs.querySelectorAll('[role="tab"]');
    const select = id => buttons.forEach(b => {
      const on = b.id === id;
      b.setAttribute("aria-selected", on);
      b.tabIndex = on ? 0 : -1;
      document.getElementById(b.getAttribute("aria-controls")).hidden = !on;
    });
    buttons.forEach((b, i) => {
      b.addEventListener("click", () => select(b.id));
      b.addEventListener("keydown", e => {
        const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!d) return;
        const next = buttons[(i + d + buttons.length) % buttons.length];
        next.focus(); select(next.id);
      });
    });
    // open a tab from the URL hash, e.g. juniors.html#u13
    const fromHash = location.hash && tabs.querySelector(`[data-hash="${location.hash.slice(1)}"]`);
    if (fromHash) select(fromHash.id);
  });
}

/* ---------- team pages (first-xi.html etc.) ---------- */
function renderTeamPage() {
  const key = document.body.dataset.team;
  if (!key || !TEAMS[key]) return;
  const t = TEAMS[key];
  document.querySelectorAll("[data-t]").forEach(n => {
    const v = t[n.dataset.t];
    if (v) n.textContent = v; else if (n.dataset.hideEmpty !== undefined) n.closest("[data-row]")?.remove();
  });
  document.querySelectorAll("[data-t-img]").forEach(n => n.style.backgroundImage = `url("${t.image}")`);
  document.querySelectorAll("[data-matches], [data-calendar]").forEach(n => n.dataset.team = key);

  // season summary from results
  let res = getMatches({ team: key, mode: "results" }).filter(played);
  const season = res.length ? parseDate(res[0]).getFullYear() : null;
  res = res.filter(m => parseDate(m).getFullYear() === season);
  const title = document.querySelector(".season-board h2");
  if (title && season) title.textContent = `${season} season`;
  const count = r => res.filter(m => m.result === r).length;
  const sum = document.querySelector("[data-season]");
  if (sum) sum.innerHTML = [["Played", res.length], ["Won", count("W")], ["Lost", count("L")], ["Drawn", count("D") + count("T")]]
    .map(([l, n]) => `<div class="plate"><span class="n">${n}</span><span class="l">${l}</span></div>`).join("");
}

/* ---------- home page scoreboard ---------- */
function renderScoreboard() {
  const board = document.querySelector("[data-scoreboard]");
  if (!board) return;
  const last = getMatches({ teams: ["1st-xi", "2nd-xi", "3rd-xi"], mode: "results" }).filter(played)[0];
  const next = getMatches({ mode: "fixtures", limit: 1 })[0];
  let html = "";
  if (last) {
    html += `
      <div class="board-row">
        <p class="board-label">Latest result, ${esc(teamName(last.team))}</p>
        <p class="board-teams">Broadwater <span>v</span> ${esc(last.opponent.replace(/ (1st|2nd|3rd) XI$/, ""))}</p>
        <div class="board-scores">
          <div class="plate"><span class="n">${esc(last.us.split(" ")[0] || "–")}</span><span class="l">Broadwater</span></div>
          <div class="plate"><span class="n">${esc(last.them.split(" ")[0] || "–")}</span><span class="l">Opposition</span></div>
        </div>
        <p class="board-sum">${esc(last.summary)}, ${fmtDate(last, { day: "numeric", month: "long" })}</p>
      </div>`;
  }
  if (next) {
    html += `
      <div class="board-row board-next">
        <p class="board-label">Next match, ${esc(teamName(next.team))}</p>
        <p class="board-teams">${next.venue === "H" ? "Broadwater <span>v</span> " + esc(next.opponent) : esc(next.opponent) + " <span>v</span> Broadwater"}</p>
        <p class="board-sum">${fmtDate(next, { weekday: "long", day: "numeric", month: "long" })}, ${esc(next.time)}</p>
      </div>`;
  }
  board.innerHTML = html + `<a class="board-link" href="fixtures.html">All fixtures and results</a>`;
}

/* ---------- fixtures page filter ---------- */
function initFixturesFilter() {
  const sel = document.getElementById("team-filter");
  if (!sel) return;
  sel.innerHTML = `<option value="">All teams</option>` +
    Object.entries(TEAMS).map(([k, t]) => `<option value="${k}">${t.name}</option>`).join("");
  const apply = () => {
    document.querySelectorAll("[data-matches], [data-calendar]").forEach(c => {
      if (sel.value) c.dataset.team = sel.value; else delete c.dataset.team;
    });
    renderAllTables();
    renderCalendars();
  };
  sel.addEventListener("change", apply);
}

/* ---------- map ---------- */
function renderMap() {
  document.querySelectorAll("[data-map]").forEach(m => {
    m.innerHTML = `<iframe title="Map showing ${esc(CLUB.ground)}" loading="lazy"
      src="https://maps.google.com/maps?q=${encodeURIComponent(CLUB.mapQuery)}&z=16&output=embed"></iframe>`;
  });
  document.querySelectorAll("[data-club]").forEach(n => { n.textContent = CLUB[n.dataset.club]; });
  document.querySelectorAll("[data-club-mail]").forEach(n => { n.href = "mailto:" + CLUB.email; if (!n.textContent.trim()) n.textContent = CLUB.email; });
}

document.addEventListener("DOMContentLoaded", () => {
  buildHeader();
  renderTeamPage();
  initFixturesFilter();
  renderAllTables();
  renderCalendars();
  renderScoreboard();
  renderMap();
  initTabs();
  buildFooter();
  requestAnimationFrame(() => document.body.classList.add("ready"));
});
