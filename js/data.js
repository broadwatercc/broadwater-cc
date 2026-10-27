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
  mapLat: 50.8299,
  mapLon: -0.3790,
  email: "info@broadwatercc.co.uk",
  website: "https://www.broadwatercc.co.uk/",
  playCricket: "https://broadwater.play-cricket.com/home",
  facebook: "https://www.facebook.com/p/Broadwater-Cricket-Club-100057381673063/?locale=en_GB",  
  instagram: "https://www.instagram.com/broadwatercc/",
  };

/* ---------------------------------------------------------------------
   TEAMS
   key   : used in js/matches.js
   focus : which part of the photo to keep in view in the banner at the
           top of the team page, e.g. "center 15%" keeps the top of the
           photo (faces), "center 50%" the middle, "center 90%" the bottom and in each page's data-team attribute
   --------------------------------------------------------------------- */
const TEAMS = {
  "1st-xi": {
    name: "1st XI",
    group: "saturday",
    page: "first-xi.html",
    image: "images/team-1st.jpg",
    focus: "center 25%",
    league: "Sussex Cricket League",
    division: "5 West",
    day: "Saturdays, April to September",
    captain: "Chris Green",
    viceCaptain: "Ben Challen",
    blurb: "The club's flagship side, playing 45-over league cricket in the Sussex Cricket League. Home matches are played on Broadwater Green, Worthing's only public cricket ground."
  },
  "2nd-xi": {
    name: "2nd XI",
    group: "saturday",
    page: "second-xi.html",
    image: "images/team-2nd.jpg",
    focus: "center 15%",
    league: "Sussex Cricket League",
    division: "9 West",
    day: "Saturdays, April to September",
    captain: "Ryan Silverthorn",
    viceCaptain: "Josh Blakey",
    blurb: "A mix of experienced club cricketers and players stepping up from the 3rd XI and juniors, competing in the Sussex Cricket League."
  },
  "3rd-xi": {
    name: "3rd XI",
    group: "saturday",
    page: "third-xi.html",
    image: "images/team-3rd.jpg",
    focus: "center 15%",
    league: "Sussex Cricket League",
    division: "12 West",
    day: "Saturdays, April to September",
    captain: "Nick Pottinger",
    viceCaptain: "Jonathan Hill",
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
    captain: "Jonathan Hill",
    blurb: "Friendly cricket against clubs from across Sussex and touring sides. Ideal if you can't commit every week, are new to the club, or just enjoy a relaxed game and a drink afterwards."
  },
  "t20": {
    name: "Midweek T20",
    group: "other",
    page: "other-teams.html#t20",
    image: "images/t20.jpg",
    league: "T20 competition to be confirmed",
    division: "Sussex Slam",
    day: "Weekday evenings, May to August",
    captain: "Dave Hall",
    blurb: "Fast, short-format cricket on summer evenings. Twenty overs a side, usually done before sunset."
  },
  "u15": {
    name: "Under 15s",
    group: "junior",
    page: "juniors.html#u15",
    image: "images/u15.jpg",
    league: "Sussex Junior Cricket League West Area",
    day: "Wednesday evenings",
    captain: "Jonathan Hill",
    blurb: "Hard-ball cricket for players in school Years 9 and 10. Some players are given chances in the adult sides."
  },
  "u14": {
    name: "Under 14s",
    group: "junior",
    page: "juniors.html#u14",
    image: "images/u14.jpg",
    league: "Sussex Junior Cricket League West Area",
    day: "Wednesday evenings",
    captain: "Dave Hall",
    blurb: "League and friendly matches for players in school Years 8 and 9, building on the skills learned at Under 13."
  },
  "u13": {
    name: "Under 13s",
    group: "junior",
    page: "juniors.html#u13",
    image: "images/u13.jpg",
    league: "Sussex Junior Cricket League West Area",
    day: "Wednesday evenings",
    captain: "Dave Hall",
    blurb: "Competitive hard-ball cricket for players in school Years 7 and 8, with a focus on developing all-round skills."
  }
};
