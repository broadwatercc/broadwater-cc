/* =====================================================================
   BCC NEWS - club news posts and the Instagram feed
   ---------------------------------------------------------------------
   TO ADD A POST: copy the example block below (from { to },), paste it
   at the TOP of the list, just under  const NEWS = [  and fill it in.
   Newest posts go first.

   id     : a short name for the post's own link, lower case, no spaces,
            e.g. "awards-night-2026"  (the link becomes news.html#awards-night-2026)
   date   : "YYYY-MM-DD"
   title  : the headline
   image  : a photo file name in the images folder, e.g. "awards.jpg"
            (leave as "" for no photo)
   alt    : a few words describing the photo, for screen readers
   text   : the story. Keep it between the two ` marks. Leave a blank
            line between paragraphs. Apostrophes and quotes are fine.

   Example (copy from here):

    {
      id: "awards-night-2026",
      date: "2026-09-20",
      title: "End of season awards",
      image: "awards.jpg",
      alt: "Players holding their trophies in the clubhouse",
      text: `First paragraph here.

Second paragraph here.`
    },

   ===================================================================== */

const NEWS = [
  {
      id: "awards-night-2026",
      date: "2026-10-27",
      title: "End of season awards dinner",
      image: "menu.png",
      alt: "Menu",
      text: `Our annual end of season awards meal is coming up on Friday, November 13th @Efes Town

If you haven't chosen your menu options yet, text Jonathan - number on the original Instagram post.`
    },
  {
    id: "new-website",
    date: "2026-10-26",
    title: "Welcome to our new website",
    image: "",
    alt: "",
    text: `Broadwater Cricket Club finally has a home online. You'll find fixtures and results for every team, information on our Saturday, Sunday, T20 and junior sides, and the story of the club since 1771.

Club news will appear on this page, and our latest Instagram posts are shown below. If you have photos or news you'd like to share, email info@broadwatercc.co.uk.`
  }

];


/* ---------------------------------------------------------------------
   INSTAGRAM FEED (via Behold - see README for setup)
   Paste your Behold JSON feed address between the quotes, e.g.
   "https://feeds.behold.so/AbCdEf123456". Leave "" to hide the photos
   and show just the "Follow us" button.
   --------------------------------------------------------------------- */
const INSTAGRAM = {
  feedUrl: "https://feeds.behold.so/h2cmvZRvGkdMWBwjsDQS",
  profile: "https://www.instagram.com/broadwatercc/",
  handle: "@broadwatercc"
};
