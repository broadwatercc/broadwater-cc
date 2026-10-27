/* =====================================================================
   PHOTO FOCUS - which part of each photo stays in view when it's cropped
   ---------------------------------------------------------------------
   Easiest way to change these: open  www.broadwatercc.co.uk/photo-focus.html
   click on each photo, then copy the result and paste it over this
   whole file on GitHub.

   Each line is:   "photo file name": "left-right% top-bottom%",
     "50% 0%"   keeps the top        "50% 100%"  keeps the bottom
     "0% 50%"   keeps the left       "100% 50%"  keeps the right
     "50% 50%"  keeps the middle (the normal setting)
   ===================================================================== */

const PHOTO_FOCUS = {
  "hero.jpg": "50% 50%",
  "green.jpg": "52% 72%",
  "BCCStumpsKit.JPG": "49% 72%",
  "team-1st.jpg": "49% 30%",
  "team-2nd.jpg": "52% 47%",
  "team-3rd.jpg": "49% 43%",
  "sunday.jpg": "50% 30%",
  "t20.jpg": "50% 30%",
  "juniors.jpg": "37% 28%",
  "u15.jpg": "51% 32%",
  "u13.jpg": "47% 40%",
  "u12.jpg": "50% 30%",
  "history-hero.jpg": "52% 9%",
  "history-1771.jpg": "50% 50%",
  "history-team.jpg": "51% 14%"
};
