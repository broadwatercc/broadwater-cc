/* =====================================================================
   BROADWATER CRICKET CLUB — SITE DATA
   ---------------------------------------------------------------------
   Club details and team information (captains, divisions, photos).
   Fixtures and results live in js/matches.js, which the Play-Cricket
   script (tools/update_fixtures.py) rewrites automatically.
   ===================================================================== */

const CLUB = {
  name: "Broadwater Cricket Club",
  founded: 1771,
  ground: "Broadwater Green",
  address: "Broadwater Green, Worthing, West Sussex",   // add postcode
  mapQuery: "Broadwater Green, Worthing",
  email: "secretary@example.com",                       // replace
  playCricket: "https://broadwater.play-cricket.com/home",
  facebook: "",      // e.g. "https://www.facebook.com/..."  (leave "" to hide)
  instagram: "",
  x: ""
};

/* ---------------------------------------------------------------------
   TEAMS
   key  : used in js/matches.js and in each page's data-team attribute
   --------------------------------------------------------------------- */
const TEAMS = {
  "1st-xi": {
    name: "1st XI",
    group: "saturday",
    page: "first-xi.html",
    image: "images/team-1st.jpg",
    league: "Sussex Cricket League",
    division: "Division to be confirmed",
    day: "Saturdays, April to September",
    captain: "Captain's name",
    viceCaptain: "Vice-captain's name",
    blurb: "The club's flagship side, playing 50-over league cricket in the Sussex Cricket League. Home matches are played on Broadwater Green, Worthing's only public cricket ground."
  },
  "2nd-xi": {
    name: "2nd XI",
    group: "saturday",
    page: "second-xi.html",
    image: "images/team-2nd.jpg",
    league: "Sussex Cricket League",
    division: "Division to be confirmed",
    day: "Saturdays, April to September",
    captain: "Captain's name",
    viceCaptain: "Vice-captain's name",
    blurb: "A mix of experienced club cricketers and players stepping up from the 3rd XI and juniors, competing in the Sussex Cricket League."
  },
  "3rd-xi": {
    name: "3rd XI",
    group: "saturday",
    page: "third-xi.html",
    image: "images/team-3rd.jpg",
    league: "Sussex Cricket League",
    division: "Division to be confirmed",
    day: "Saturdays, April to September",
    captain: "Captain's name",
    viceCaptain: "Vice-captain's name",
    blurb: "Competitive league cricket with a friendly edge. The 3rd XI is where many of our juniors play their first adult cricket, alongside players returning to the game."
  },
  "sunday": {
    name: "Sunday XI",
    group: "other",
    page: "other-teams.html#sunday",
    image: "images/sunday.jpg",
    league: "Friendlies",
    division: "",
    day: "Sundays, May to September",
    captain: "Captain's name",
    blurb: "Friendly cricket against clubs from across Sussex and touring sides. Ideal if you can't commit every week, are new to the club, or just enjoy a relaxed game and a drink afterwards."
  },
  "t20": {
    name: "Midweek T20",
    group: "other",
    page: "other-teams.html#t20",
    image: "images/t20.jpg",
    league: "T20 competition to be confirmed",
    division: "",
    day: "Weekday evenings, May to August",
    captain: "Captain's name",
    blurb: "Fast, short-format cricket on summer evenings. Twenty overs a side, usually done before sunset."
  },
  "u15": {
    name: "Under 15s",
    group: "junior",
    page: "juniors.html#u15",
    image: "images/u15.jpg",
    league: "Junior league to be confirmed",
    day: "Training night to be confirmed",
    captain: "Team manager's name",
    blurb: "Hard-ball cricket for players in school Years 9 and 10. Strong players are given chances in the adult sides."
  },
  "u13": {
    name: "Under 13s",
    group: "junior",
    page: "juniors.html#u13",
    image: "images/u13.jpg",
    league: "Junior league to be confirmed",
    day: "Training night to be confirmed",
    captain: "Team manager's name",
    blurb: "League and friendly matches for players in school Years 7 and 8, with a focus on developing all-round skills."
  },
  "u12": {
    name: "Under 12s",
    group: "junior",
    page: "juniors.html#u12",
    image: "images/u12.jpg",
    league: "Junior league to be confirmed",
    day: "Training night to be confirmed",
    captain: "Team manager's name",
    blurb: "A first taste of competitive hard-ball cricket for players in school Years 6 and 7."
  }
};
