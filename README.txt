TEA GAMES – site folder
=======================
GAMES:  Tea Strike, Tea Fusion, Tea Blocks, Tea Match (match-3), Tea Mahjong (mahjong solitaire),
        Tea Solitaire (Klondike), Tea Checkers (Chinese Checkers vs computer), Tea Words (daily word),
        Spin the Wheel, Photo Studio.
LEADERBOARD: Strike, Fusion, Blocks, Match, Mahjong and Solitaire submit scores.
  !! One-time Worker update: the Worker must know the three new scored games.
     Cloudflare dashboard > Workers > tea-leaderboard > Edit code > replace everything with
     worker-index.js (sent next to this zip) > Deploy. Until then the new games play fine
     but their scores are refused ("unknown game").
TIPS: set your Ko-fi/PayPal links once in support.js.

Upload EVERYTHING in this folder together (same folder on your host / GitHub Pages):
  index.html           landing page (start here)
  tea-strike.html  tea-fusion.html  tea-blocks.html  spin-wheel.html
  photo-studio.html    players/you load photos, crop, save
  sw.js  manifest.webmanifest  icon-*.png   = offline + "install app" support

OFFLINE
  After the first visit the games open and play with no signal. When the device is online
  again, the files refresh in the background and the new version appears on the next open.
  Scores earned offline are kept and sent to the leaderboard automatically once online.
  To push a new release to everybody at once, change VERSION in sw.js (e.g. tea-games-v2).
  Needs https (GitHub Pages / WordPress host are fine). Opening files straight from a phone's
  file manager works for playing but not for offline caching.

PHOTOS
  Open photo-studio.html, tap a circle, pick a photo, drag/zoom, "Use this photo".
  Photos stay on that device (works offline). "Save pack file" makes teapack.json.
  Put teapack.json in this folder to make every player see YOUR photos (empty slots keep emoji).
  Only use photos you own or have permission for.

STORE APPS LATER (Capacitor)
  npm i @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios
  npx cap init "Tea Games" com.weeatea.games --web-dir=site
  npx cap add android ; npx cap add ios ; npx cap sync
  - Everything is bundled in the app, so it works offline; the leaderboard needs internet only for ranks.
  - Put teapack.json in site/ before `cap sync` (the in-app browser has its own storage, so photos
    saved in the website's Photo Studio do not carry over).
  - Cloudflare Worker setting ALLOWED_ORIGINS must then include the app origins:
    https://localhost,capacitor://localhost  (plus your website address).
  - AdSense does not run inside store apps; use AdMob there.
  - Apple may reject apps that are only a website in a wrapper; keep the games self-contained
    (they are) and add some native touch (icon, splash, haptics) before submitting.
