/* =====================================================================
   BROADWATER CRICKET CLUB — FIXTURES AND RESULTS
   ---------------------------------------------------------------------
   THIS FILE IS OVERWRITTEN by tools/update_fixtures.py each time it pulls
   from Play-Cricket. If you aren't using the script yet, you can edit
   it by hand. The matches below are invented samples.
   ===================================================================== */

const SAMPLE_DATA = true;        // shows a "sample fixtures" notice when true
const LAST_SYNC = "";            // when the script last ran
const CALENDAR_FILES = false;    // true once the script has written calendar/*.ics

/* ---------------------------------------------------------------------
   MATCHES
   One line per match. Leave result as "" for a fixture not yet played.

   team       : a key from TEAMS above
   date       : "YYYY-MM-DD"
   time       : start time, e.g. "13:00"
   opponent   : opposition club and team
   venue      : "H" (home) or "A" (away)
   competition: e.g. "League", "Cup", "Friendly"
   result     : "W" won, "L" lost, "D" drawn, "T" tied,
                "A" abandoned, "C" cancelled, or "" if not yet played
   us / them  : scores, e.g. "214-6 (45)"   (leave "" if not played)
   summary    : short line, e.g. "Won by 34 runs"
   scorecard  : link to the Play-Cricket scorecard (optional)
   ground     : ground name (optional; home games default to Broadwater Green)
   id         : Play-Cricket match id (filled in by the script)
   --------------------------------------------------------------------- */
const MATCHES = [
  // ---- 1st XI ----
  { team:"1st-xi", date:"2026-05-02", time:"13:00", opponent:"Downland Rovers 1st XI", venue:"H", competition:"League", result:"W", us:"214-6 (45)", them:"180 (41.2)", summary:"Won by 34 runs", scorecard:"" },
  { team:"1st-xi", date:"2026-05-16", time:"13:00", opponent:"Harbourside 1st XI", venue:"A", competition:"League", result:"L", us:"156 (38.4)", them:"159-3 (31)", summary:"Lost by 7 wickets", scorecard:"" },
  { team:"1st-xi", date:"2026-06-06", time:"13:00", opponent:"Chalk Hill 1st XI", venue:"H", competition:"League", result:"W", us:"241-8 (50)", them:"198 (46.1)", summary:"Won by 43 runs", scorecard:"" },
  { team:"1st-xi", date:"2026-07-11", time:"13:00", opponent:"Weald Park 1st XI", venue:"A", competition:"League", result:"D", us:"187-9 (50)", them:"160-8 (50)", summary:"Winning draw", scorecard:"" },
  { team:"1st-xi", date:"2026-08-22", time:"13:00", opponent:"Saltmarsh 1st XI", venue:"H", competition:"League", result:"W", us:"143-4 (29.3)", them:"142 (39)", summary:"Won by 6 wickets", scorecard:"" },
  { team:"1st-xi", date:"2027-04-24", time:"13:00", opponent:"Downland Rovers 1st XI", venue:"A", competition:"League", result:"", us:"", them:"", summary:"", scorecard:"" },
  { team:"1st-xi", date:"2027-05-01", time:"13:00", opponent:"Harbourside 1st XI", venue:"H", competition:"League", result:"", us:"", them:"", summary:"", scorecard:"" },

  // ---- 2nd XI ----
  { team:"2nd-xi", date:"2026-05-02", time:"13:00", opponent:"Downland Rovers 2nd XI", venue:"A", competition:"League", result:"L", us:"132 (35.2)", them:"201-7 (45)", summary:"Lost by 69 runs", scorecard:"" },
  { team:"2nd-xi", date:"2026-05-16", time:"13:00", opponent:"Harbourside 2nd XI", venue:"H", competition:"League", result:"W", us:"188-5 (42)", them:"187 (44.5)", summary:"Won by 5 wickets", scorecard:"" },
  { team:"2nd-xi", date:"2026-06-06", time:"13:00", opponent:"Chalk Hill 2nd XI", venue:"A", competition:"League", result:"A", us:"", them:"", summary:"Abandoned, rain", scorecard:"" },
  { team:"2nd-xi", date:"2026-07-11", time:"13:00", opponent:"Weald Park 2nd XI", venue:"H", competition:"League", result:"W", us:"205-9 (45)", them:"170 (40.3)", summary:"Won by 35 runs", scorecard:"" },
  { team:"2nd-xi", date:"2026-08-22", time:"13:00", opponent:"Saltmarsh 2nd XI", venue:"A", competition:"League", result:"W", us:"166-2 (30)", them:"162 (43)", summary:"Won by 8 wickets", scorecard:"" },
  { team:"2nd-xi", date:"2027-04-24", time:"13:00", opponent:"Downland Rovers 2nd XI", venue:"H", competition:"League", result:"", us:"", them:"", summary:"", scorecard:"" },
  { team:"2nd-xi", date:"2027-05-01", time:"13:00", opponent:"Harbourside 2nd XI", venue:"A", competition:"League", result:"", us:"", them:"", summary:"", scorecard:"" },

  // ---- 3rd XI ----
  { team:"3rd-xi", date:"2026-05-09", time:"13:30", opponent:"Chalk Hill 3rd XI", venue:"H", competition:"League", result:"W", us:"170-7 (40)", them:"121 (33.4)", summary:"Won by 49 runs", scorecard:"" },
  { team:"3rd-xi", date:"2026-06-13", time:"13:30", opponent:"Saltmarsh 3rd XI", venue:"A", competition:"League", result:"L", us:"98 (28.1)", them:"99-4 (19.2)", summary:"Lost by 6 wickets", scorecard:"" },
  { team:"3rd-xi", date:"2026-07-18", time:"13:30", opponent:"Weald Park 3rd XI", venue:"H", competition:"League", result:"T", us:"154 (39.5)", them:"154 (40)", summary:"Match tied", scorecard:"" },
  { team:"3rd-xi", date:"2026-08-29", time:"13:30", opponent:"Harbourside 3rd XI", venue:"A", competition:"League", result:"W", us:"137-6 (36)", them:"136 (38.2)", summary:"Won by 4 wickets", scorecard:"" },
  { team:"3rd-xi", date:"2027-05-08", time:"13:30", opponent:"Chalk Hill 3rd XI", venue:"A", competition:"League", result:"", us:"", them:"", summary:"", scorecard:"" },

  // ---- Sunday XI ----
  { team:"sunday", date:"2026-05-24", time:"14:00", opponent:"Wandering Gulls CC", venue:"H", competition:"Friendly", result:"W", us:"190-6 (35)", them:"151 (33)", summary:"Won by 39 runs", scorecard:"" },
  { team:"sunday", date:"2026-07-05", time:"14:00", opponent:"Old Pavilion XI", venue:"A", competition:"Friendly", result:"D", us:"176-8 (35)", them:"140-9 (35)", summary:"Drawn", scorecard:"" },
  { team:"sunday", date:"2026-08-16", time:"14:00", opponent:"Coastal Tourists CC", venue:"H", competition:"Friendly", result:"L", us:"133 (30.2)", them:"134-5 (27)", summary:"Lost by 5 wickets", scorecard:"" },
  { team:"sunday", date:"2027-05-16", time:"14:00", opponent:"Wandering Gulls CC", venue:"A", competition:"Friendly", result:"", us:"", them:"", summary:"", scorecard:"" },

  // ---- Midweek T20 ----
  { team:"t20", date:"2026-06-03", time:"18:00", opponent:"Harbourside T20", venue:"H", competition:"T20", result:"W", us:"161-4 (20)", them:"138-7 (20)", summary:"Won by 23 runs", scorecard:"" },
  { team:"t20", date:"2026-06-24", time:"18:00", opponent:"Chalk Hill T20", venue:"A", competition:"T20", result:"L", us:"119-9 (20)", them:"120-2 (14.3)", summary:"Lost by 8 wickets", scorecard:"" },
  { team:"t20", date:"2026-07-15", time:"18:00", opponent:"Saltmarsh T20", venue:"H", competition:"T20", result:"W", us:"144-6 (19.1)", them:"143-8 (20)", summary:"Won by 4 wickets", scorecard:"" },
  { team:"t20", date:"2027-06-02", time:"18:00", opponent:"Harbourside T20", venue:"A", competition:"T20", result:"", us:"", them:"", summary:"", scorecard:"" },

  // ---- Juniors ----
  { team:"u15", date:"2026-06-10", time:"18:00", opponent:"Downland Rovers U15", venue:"H", competition:"League", result:"W", us:"121-5 (20)", them:"98 (19.2)", summary:"Won by 23 runs", scorecard:"" },
  { team:"u15", date:"2027-05-12", time:"18:00", opponent:"Chalk Hill U15", venue:"A", competition:"League", result:"", us:"", them:"", summary:"", scorecard:"" },
  { team:"u13", date:"2026-06-17", time:"18:00", opponent:"Weald Park U13", venue:"A", competition:"League", result:"L", us:"88 (18.4)", them:"89-3 (14)", summary:"Lost by 7 wickets", scorecard:"" },
  { team:"u13", date:"2027-05-19", time:"18:00", opponent:"Saltmarsh U13", venue:"H", competition:"League", result:"", us:"", them:"", summary:"", scorecard:"" },
  { team:"u12", date:"2026-07-01", time:"18:00", opponent:"Harbourside U12", venue:"H", competition:"League", result:"W", us:"102-6 (20)", them:"95 (20)", summary:"Won by 7 runs", scorecard:"" },
  { team:"u12", date:"2027-05-26", time:"18:00", opponent:"Downland Rovers U12", venue:"A", competition:"League", result:"", us:"", them:"", summary:"", scorecard:"" }
];
