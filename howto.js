/* Tea Games — "How to play" demos. Adds a ❓ button + animated mini-demos to every game.
   Game is detected from the page file name (tea-match.html -> "tea-match").
   Optional: window.TEA_HOWTO_POS = 'bl' | 'br' | 'tl' | 'tr' (default 'bl'). */
(function () {
  if (window.TeaHowto) return;
  var W = 280, H = 180;
  var G = (location.pathname.split('/').pop() || 'index').replace(/\.html?$/, '');

  /* ---------- scene helpers ----------
     els: {id:{t:'emoji', x,y, s:size px, bg, w,h, o, r, z, c:'class'}}
     steps: [[ms, id, {props}], ...]   loop: total ms before restarting */
  function grid(p, rows, cols, ox, oy, cell, items, bg) {
    var o = {}, i = 0;
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++, i++)
      o[p + i] = { t: items[i] || '', x: ox + c * cell, y: oy + r * cell, w: cell - 4, h: cell - 4, s: cell * 0.62, bg: items[i] === '' ? 'transparent' : bg };
    return o;
  }
  function merge() { var o = {}; for (var i = 0; i < arguments.length; i++) for (var k in arguments[i]) o[k] = arguments[i][k]; return o; }
  var HAND = { t: '👆', s: 30, x: 0, y: 0, o: 0, z: 9 };
  var CARD = '#fffdf6', TILE = '#f6e7c1';

  var SCENES = {};

  SCENES['tea-strike'] = [
    { cap: 'Drag your finger (or use ← → / A D) to move. Your ship fires by itself!',
      els: { e1: { t: '🍔', x: 56, y: 8, s: 34 }, e2: { t: '🍟', x: 190, y: 8, s: 34 }, ship: { t: '🚀', x: 56, y: 130, s: 34 }, b1: { t: '•', x: 70, y: 124, s: 22, o: 0 }, b2: { t: '•', x: 204, y: 124, s: 22, o: 0 }, hand: merge(HAND, { x: 70, y: 150, o: 0.9 }) },
      steps: [[300, 'b1', { o: 1 }], [350, 'b1', { y: 30 }], [850, 'e1', { t: '💥', s: 44 }], [900, 'b1', { o: 0 }], [1000, 'e1', { o: 0 }],
        [1300, 'ship', { x: 190 }], [1300, 'hand', { x: 204 }], [1900, 'b2', { o: 1 }], [1950, 'b2', { y: 30 }], [2450, 'e2', { t: '💥', s: 44 }], [2500, 'b2', { o: 0 }], [2600, 'e2', { o: 0 }]], loop: 3600 },
    { cap: 'Grab ⭐ power-ups for stronger shots. Every 5 levels a BOSS appears — keep shooting!',
      els: { boss: { t: '🍕', x: 100, y: 10, s: 70 }, bar: { t: '', x: 70, y: 100, w: 140, h: 10, bg: '#e74c3c' }, star: { t: '⭐', x: 60, y: 40, s: 28 }, ship: { t: '🚀', x: 60, y: 130, s: 34 } },
      steps: [[300, 'star', { y: 120 }], [1000, 'star', { o: 0 }], [1000, 'ship', { s: 44 }], [1500, 'bar', { w: 90 }], [2000, 'bar', { w: 40 }], [2500, 'bar', { w: 4 }], [2800, 'boss', { t: '💥', s: 80 }]], loop: 3800 }
  ];

  SCENES['tea-fusion'] = [
    { cap: 'Swipe (or arrow keys / WASD) — every tile slides as far as it can.',
      els: merge(grid('c', 1, 4, 20, 60, 60, ['🥟', '', '🥟', ''], '#5a3b22'), { hand: merge(HAND, { x: 70, y: 120, o: 0.9 }) }),
      steps: [[400, 'hand', { x: 190 }], [400, 'c0', { x: 200 }], [400, 'c2', { x: 200 }], [1100, 'c0', { t: '🍜', s: 44, o: 1 }], [1100, 'c2', { o: 0 }], [1000, 'hand', { o: 0 }]], loop: 2800 },
    { cap: 'Two of the SAME food merge into the next one. Keep merging toward the top of the chain!',
      els: { a: { t: '🍵', x: 40, y: 60, s: 40 }, b: { t: '🍵', x: 90, y: 60, s: 40 }, plus: { t: '=', x: 138, y: 64, s: 30 }, r: { t: '🥟', x: 180, y: 60, s: 40, o: 0 }, n: { t: '🥟 + 🥟 → 🍜 + 🍜 → …', x: 20, y: 130, s: 16, w: 240 } },
      steps: [[600, 'r', { o: 1, s: 52 }], [1400, 'r', { s: 40 }]], loop: 3200 }
  ];

  SCENES['tea-blocks'] = [
    { cap: 'Blocks fall. Use ◀ ▶ to move and ⟳ to rotate (or ← → ↑ on a keyboard).',
      els: merge(grid('g', 1, 6, 40, 140, 32, ['', '', '', '', '', ''], 'transparent'),
        { f1: { t: '', x: 40, y: 140, w: 28, h: 28, bg: '#e67e22' }, f2: { t: '', x: 72, y: 140, w: 28, h: 28, bg: '#e67e22' }, f3: { t: '', x: 168, y: 140, w: 28, h: 28, bg: '#e67e22' }, f4: { t: '', x: 200, y: 140, w: 28, h: 28, bg: '#e67e22' },
          p1: { t: '', x: 104, y: 10, w: 28, h: 28, bg: '#3498db' }, p2: { t: '', x: 136, y: 10, w: 28, h: 28, bg: '#3498db' }, hint: { t: '◀   ▶   ⟳   ⤓', x: 50, y: 70, s: 20, w: 180 } }),
      steps: [[300, 'p1', { y: 60 }], [300, 'p2', { y: 60 }], [900, 'p1', { y: 100 }], [900, 'p2', { y: 100 }], [1500, 'p1', { y: 140 }], [1500, 'p2', { y: 140 }]], loop: 3300 },
    { cap: 'Fill a whole row with no gaps to clear it and score. ⤓ drops the block instantly.',
      els: { r1: { t: '', x: 40, y: 120, w: 28, h: 28, bg: '#e67e22' }, r2: { t: '', x: 72, y: 120, w: 28, h: 28, bg: '#3498db' }, r3: { t: '', x: 104, y: 120, w: 28, h: 28, bg: '#2ecc71' }, r4: { t: '', x: 136, y: 120, w: 28, h: 28, bg: '#e74c3c' }, r5: { t: '', x: 168, y: 120, w: 28, h: 28, bg: '#9b59b6' }, r6: { t: '', x: 200, y: 120, w: 28, h: 28, bg: '#f1c40f' }, pop: { t: '+100!', x: 90, y: 70, s: 26, o: 0, w: 100 } },
      steps: [[900, 'r1', { o: 0, s: 1 }], [900, 'r2', { o: 0 }], [900, 'r3', { o: 0 }], [900, 'r4', { o: 0 }], [900, 'r5', { o: 0 }], [900, 'r6', { o: 0 }], [900, 'pop', { o: 1, y: 50 }]], loop: 2800 }
  ];

  SCENES['tea-match'] = [
    { cap: 'SWAP two neighbours to line up 3 or more of the same food.',
      els: merge(grid('m', 1, 4, 30, 60, 56, ['🍜', '🍜', '🍵', '🍜'], '#3a2a6b'), { hand: merge(HAND, { x: 140, y: 120, o: 0.9 }) }),
      steps: [[400, 'm2', { x: 142 }], [400, 'm3', { x: 86 }], [400, 'hand', { x: 130 }], [1100, 'm0', { o: 0, s: 1.4 }], [1100, 'm1', { o: 0 }], [1100, 'm3', { o: 0 }], [1100, 'hand', { o: 0 }]], loop: 2800 },
    { cap: '4 in a row → striped candy that clears a whole line.',
      els: merge(grid('m', 1, 5, 12, 60, 52, ['🥟', '🥟', '🥟', '🥟', '🍜'], '#3a2a6b'), { n: { t: '✨ striped!', x: 70, y: 130, s: 20, w: 140, o: 0 } }),
      steps: [[700, 'm0', { o: 0 }], [700, 'm1', { o: 0 }], [700, 'm2', { o: 0 }], [700, 'm3', { t: '🥟', bg: '#f1c40f' }], [1000, 'n', { o: 1 }], [1800, 'm3', { s: 1.3 }], [1800, 'm4', { o: 0 }]], loop: 3400 },
    { cap: '5 in a row → 🍵 Tea Bomb. Swap it with any food to clear every one of that food!',
      els: merge(grid('m', 1, 5, 12, 60, 52, ['🍵', '🥟', '🍜', '🥟', '🍜'], '#3a2a6b'), {}),
      steps: [[500, 'm0', { x: 64 }], [500, 'm1', { x: 12 }], [1300, 'm1', { o: 0 }], [1300, 'm3', { o: 0 }], [1300, 'm0', { o: 0 }]], loop: 3000 }
  ];

  SCENES['tea-mahjong'] = [
    { cap: 'Tap two matching tiles that are FREE (nothing on top, open on the left or right).',
      els: merge(grid('t', 1, 4, 24, 55, 58, ['🍜', '🥟', '🥟', '🍜'], TILE), { hand: merge(HAND, { x: 70, y: 120, o: 0.9 }) }),
      steps: [[500, 't1', { y: 48, bg: '#ffd966' }], [800, 'hand', { x: 160 }], [1100, 't2', { y: 48, bg: '#ffd966' }], [1700, 't1', { o: 0 }], [1700, 't2', { o: 0 }], [1700, 'hand', { o: 0 }]], loop: 3000 },
    { cap: 'A tile covered by another can’t be picked yet — clear the top ones first. Clear the whole board to win!',
      els: { low: { t: '🍵', x: 100, y: 70, w: 54, h: 54, s: 34, bg: '#d8c89a' }, top: { t: '🍜', x: 112, y: 58, w: 54, h: 54, s: 34, bg: TILE, z: 2 }, x: { t: '🚫', x: 112, y: 24, s: 24, o: 0, z: 5 } },
      steps: [[400, 'x', { o: 1 }], [1500, 'top', { o: 0 }], [1500, 'x', { o: 0 }], [1700, 'low', { bg: TILE }]], loop: 3200 }
  ];

  SCENES['tea-solitaire'] = [
    { cap: 'Build down in alternating colours: a red 6 goes on a black 7.',
      els: { a: { t: '7♠', x: 60, y: 40, w: 54, h: 76, s: 22, bg: CARD, c: 'blk' }, b: { t: '6♥', x: 170, y: 60, w: 54, h: 76, s: 22, bg: CARD, c: 'red' }, hand: merge(HAND, { x: 180, y: 100, o: 0.9 }) },
      steps: [[600, 'b', { x: 60, y: 62 }], [600, 'hand', { x: 70, y: 102 }], [1800, 'hand', { o: 0 }]], loop: 3000 },
    { cap: 'Tap the deck to draw. Move Aces up first, then build each suit A → K to win.',
      els: { d: { t: '🂠', x: 30, y: 50, w: 54, h: 76, s: 40, bg: '#2f6fb0' }, f: { t: 'A♦', x: 190, y: 50, w: 54, h: 76, s: 22, bg: CARD, c: 'red', o: 0.4 }, g: { t: 'A♦', x: 100, y: 50, w: 54, h: 76, s: 22, bg: CARD, c: 'red', o: 0 } },
      steps: [[500, 'g', { o: 1 }], [1100, 'g', { x: 190 }], [1100, 'f', { o: 1 }], [1500, 'g', { o: 0 }]], loop: 3000 }
  ];

  SCENES['tea-checkers'] = [
    { cap: 'Tap one of your marbles, then a highlighted hole next to it — or HOP over a neighbour.',
      els: { a: { t: '', x: 40, y: 80, w: 24, h: 24, bg: '#e74c3c', c: 'dot' }, b: { t: '', x: 100, y: 80, w: 24, h: 24, bg: '#3498db', c: 'dot' }, h1: { t: '', x: 70, y: 80, w: 24, h: 24, bg: 'rgba(255,255,255,.3)', c: 'dot' }, h2: { t: '', x: 130, y: 80, w: 24, h: 24, bg: 'rgba(255,255,255,.3)', c: 'dot' }, n: { t: 'hop!', x: 90, y: 40, s: 18, o: 0 } },
      steps: [[700, 'a', { x: 130 }], [700, 'n', { o: 1 }], [2000, 'n', { o: 0 }]], loop: 3000 },
    { cap: 'Chain several hops in one turn. Be first to move all 10 marbles into the opposite corner!',
      els: { a: { t: '', x: 20, y: 120, w: 24, h: 24, bg: '#e74c3c', c: 'dot' }, b: { t: '', x: 70, y: 90, w: 24, h: 24, bg: '#3498db', c: 'dot' }, c: { t: '', x: 130, y: 60, w: 24, h: 24, bg: '#2ecc71', c: 'dot' }, goal: { t: '🏁', x: 210, y: 20, s: 30 } },
      steps: [[600, 'a', { x: 95, y: 65 }], [1400, 'a', { x: 190, y: 20 }], [2200, 'goal', { s: 40 }]], loop: 3200 }
  ];

  SCENES['tea-words'] = [
    { cap: 'Guess the hidden 5-letter food word in 6 tries. Type, then press Enter.',
      els: merge(grid('w', 1, 5, 20, 60, 48, ['', '', '', '', ''], '#3a3a3c'), {}),
      steps: [[300, 'w0', { t: 'M' }], [550, 'w1', { t: 'O' }], [800, 'w2', { t: 'H' }], [1050, 'w3', { t: 'I' }], [1300, 'w4', { t: 'N' }]], loop: 3600 },
    { cap: '🟩 right letter, right place · 🟨 right letter, wrong place · ⬛ not in the word.',
      els: merge(grid('w', 1, 5, 20, 60, 48, ['T', 'E', 'A', 'S', 'E'], '#3a3a3c'), {}),
      steps: [[500, 'w0', { bg: '#538d4e' }], [800, 'w1', { bg: '#b59f3b' }], [1100, 'w2', { bg: '#3a3a3c' }], [1400, 'w3', { bg: '#538d4e' }], [1700, 'w4', { bg: '#3a3a3c' }]], loop: 3600 }
  ];


  SCENES['fortune-tea'] = [
    { cap: 'Tap the bamboo cup (or shake your phone) to draw a fortune stick. You get one free “Today’s Fortune” every day.',
      els: { cup: { t: '🏺', x: 110, y: 70, s: 70 }, st: { t: '🎋', x: 130, y: 60, s: 36, o: 0 }, hand: merge(HAND, { x: 160, y: 120, o: 0.9 }) },
      steps: [[300, 'cup', { r: -14 }], [800, 'cup', { r: 12 }], [1300, 'cup', { r: 0 }], [1500, 'st', { o: 1, y: 20 }], [1500, 'hand', { o: 0 }]], loop: 3600 },
    { cap: 'Read your fortune, lucky number and lucky food. Collect all 30 sticks in the Fortune Book!',
      els: { c: { t: '📜 Stick No. 7', x: 50, y: 40, w: 180, h: 60, s: 18, bg: '#fff8e6', c: 'blk' }, n: { t: '🔢 Lucky 42 · 🍜', x: 60, y: 120, s: 16, w: 160 } },
      steps: [[700, 'c', { bg: '#ffe9a8' }], [1500, 'n', { o: 0.5 }]], loop: 3000 }
  ];
  SCENES['chinlone'] = [
    { cap: 'Tap the cane ball to keep it in the air. Tap left of the ball to send it right, right of it to send it left.',
      els: { ball: { t: '🏐', x: 120, y: 30, s: 44 }, p: { t: '💃', x: 124, y: 120, s: 40 }, hand: merge(HAND, { x: 128, y: 80, o: 0.9 }) },
      steps: [[500, 'ball', { y: 90 }], [700, 'hand', { y: 88 }], [1100, 'ball', { y: 20, x: 170 }], [1100, 'hand', { o: 0 }], [1900, 'ball', { y: 90, x: 170 }], [1900, 'p', { x: 170 }]], loop: 3600 },
    { cap: 'Don’t let the ball touch the ground! Every 10 touches earns a “Beautiful!” — it speeds up the longer you rally.',
      els: { ball: { t: '🏐', x: 120, y: 20, s: 44 }, t: { t: 'Beautiful!', x: 90, y: 70, s: 22, w: 100, o: 0 } },
      steps: [[300, 'ball', { y: 110 }], [1000, 't', { o: 1, y: 50 }]], loop: 3000 }
  ];
  SCENES['yangon-dash'] = [
    { cap: 'Tap the left or right side of the screen (or swipe / ← →) to change lane in your tuk-tuk.',
      els: { l1: { t: '', x: 93, y: 0, w: 3, h: 180, bg: '#999' }, l2: { t: '', x: 186, y: 0, w: 3, h: 180, bg: '#999' }, bus: { t: '🚌', x: 130, y: -20, s: 36 }, car: { t: '🛺', x: 130, y: 130, s: 36 }, hand: merge(HAND, { x: 30, y: 140, o: 0.9 }) },
      steps: [[300, 'bus', { y: 90 }], [500, 'car', { x: 36 }], [500, 'hand', { o: 0 }], [900, 'bus', { y: 200 }]], loop: 2800 },
    { cap: 'Grab 🍵 tea and 🍜 noodles for points. Hit a bus, dog or roadworks and the run ends!',
      els: { tea: { t: '🍵', x: 40, y: -10, s: 32 }, noo: { t: '🍜', x: 130, y: -50, s: 32 }, car: { t: '🛺', x: 40, y: 130, s: 36 }, pt: { t: '+10', x: 60, y: 90, s: 20, o: 0 } },
      steps: [[300, 'tea', { y: 125 }], [900, 'tea', { o: 0 }], [900, 'pt', { o: 1, y: 70 }], [1500, 'car', { x: 130 }], [1600, 'noo', { y: 125 }]], loop: 3400 }
  ];
  SCENES['myanmar-memory'] = [
    { cap: 'Flip two cards. If the foods match, they stay open.',
      els: merge(grid('k', 1, 4, 20, 60, 56, ['🍵', '🍵', '🍵', '🍵'], '#c4872f'), {}),
      steps: [[500, 'k0', { t: '🍜', bg: '#fff8e6' }], [1000, 'k2', { t: '🍜', bg: '#c9f3c4' }], [1000, 'k0', { bg: '#c9f3c4' }]], loop: 3000 },
    { cap: 'Wrong pair? You lose a try. Run out of tries and it’s over — each level has more cards and fewer spare tries.',
      els: merge(grid('k', 1, 4, 20, 60, 56, ['🍵', '🍵', '🍵', '🍵'], '#c4872f'), { n: { t: 'Tries left: 4', x: 80, y: 130, s: 18, w: 120 } }),
      steps: [[500, 'k1', { t: '🥭', bg: '#fff8e6' }], [800, 'k3', { t: '🍌', bg: '#ffd0d0' }], [1500, 'k1', { t: '🍵', bg: '#c4872f' }], [1500, 'k3', { t: '🍵', bg: '#c4872f' }], [1500, 'n', { t: 'Tries left: 3' }]], loop: 3400 }
  ];

  SCENES['spin-wheel'] = [
    { cap: 'Tap SPIN and see which food the wheel lands on!',
      els: { w: { t: '🎡', x: 100, y: 40, s: 90 }, p: { t: '▼', x: 130, y: 6, s: 22 } },
      steps: [[300, 'w', { r: 1080 }]], loop: 3200 }
  ];

  /* ---------- UI ---------- */
  var css = '.thw-btn{position:fixed;z-index:99990;width:40px;height:40px;border-radius:50%;border:2px solid rgba(255,255,255,.7);background:rgba(20,16,40,.85);color:#fff;font:700 20px system-ui,sans-serif;cursor:pointer;box-shadow:0 3px 10px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;-webkit-tap-highlight-color:transparent;padding:0}' +
    '.thw-btn.pulse,.thw-pulse{animation:thwp 1.2s ease-in-out infinite}@keyframes thwp{50%{transform:scale(1.18);box-shadow:0 0 0 8px rgba(255,200,60,.35)}}' +
    '.thw-home{font-size:18px}.thw-home.ask{width:auto;border-radius:20px;padding:0 12px;font-size:13px;background:#c0392b}' +
    '.thw-tip{position:fixed;z-index:99990;background:#fff;color:#222;font:600 13px system-ui,sans-serif;padding:8px 12px;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.4);cursor:pointer;max-width:200px}' +
    '.thw-back{position:fixed;inset:0;z-index:99995;display:none;align-items:center;justify-content:center;background:rgba(5,8,18,.82);padding:14px;font-family:system-ui,"Segoe UI",sans-serif}' +
    '.thw-box{background:#1d1a33;color:#fff;border-radius:18px;padding:16px;width:100%;max-width:340px;box-shadow:0 10px 40px rgba(0,0,0,.6);text-align:center}' +
    '.thw-box h3{margin:0 0 10px;font-size:17px}.thw-stage{position:relative;width:' + W + 'px;height:' + H + 'px;margin:0 auto;background:linear-gradient(#2b2552,#1a1636);border-radius:14px;overflow:hidden;max-width:100%}' +
    '.thw-el{position:absolute;display:flex;align-items:center;justify-content:center;line-height:1;transition:left .45s ease,top .45s ease,opacity .35s,transform .45s,background .3s,width .5s,font-size .3s;border-radius:9px;font-weight:800;color:#fff;white-space:nowrap}' +
    '.thw-el.red{color:#d22}.thw-el.blk{color:#111}.thw-el.dot{border-radius:50%}' +
    '.thw-cap{min-height:54px;margin:12px 0 8px;font-size:14px;line-height:1.4;color:#e8e4ff}' +
    '.thw-dots{display:flex;gap:6px;justify-content:center;margin-bottom:10px}.thw-dots i{width:8px;height:8px;border-radius:50%;background:#555}.thw-dots i.on{background:#ffc83c}' +
    '.thw-row{display:flex;gap:8px;justify-content:center}.thw-row button{flex:1;border:0;border-radius:11px;padding:10px;font:700 14px system-ui,sans-serif;cursor:pointer;background:#3b3566;color:#fff}.thw-row button.go{background:#ffb02e;color:#2a1a00}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var slides = SCENES[G]; if (!slides) return;
  var back, stage, capEl, dotsEl, nextBtn, prevBtn, idx = 0, timers = [], loopT, key = 'teahow_' + G;

  function clearT() { timers.forEach(clearTimeout); timers = []; clearTimeout(loopT); }
  function styleEl(d, p) {
    if (p.x != null) d.style.left = p.x + 'px'; if (p.y != null) d.style.top = p.y + 'px';
    if (p.w != null) d.style.width = p.w + 'px'; if (p.h != null) d.style.height = p.h + 'px';
    if (p.s != null) { if (p.s <= 3) d.style.transform = 'scale(' + p.s + ') rotate(' + (d._r || 0) + 'deg)', d._sc = p.s; else d.style.fontSize = p.s + 'px'; }
    if (p.o != null) d.style.opacity = p.o; if (p.bg != null) d.style.background = p.bg;
    if (p.t != null) d.textContent = p.t; if (p.z != null) d.style.zIndex = p.z;
    if (p.r != null) { d._r = p.r; d.style.transition = 'transform 2.4s cubic-bezier(.2,.8,.2,1)'; d.style.transform = 'rotate(' + p.r + 'deg)'; }
  }
  function play() {
    clearT(); var sl = slides[idx]; stage.innerHTML = ''; var map = {};
    Object.keys(sl.els).forEach(function (k) {
      var p = sl.els[k]; if (p.t == null && !('x' in p)) p = p;
      var d = document.createElement('div'); d.className = 'thw-el' + (p.c ? ' ' + p.c : ''); d.style.fontSize = '24px'; stage.appendChild(d); map[k] = d;
      styleEl(d, p.s != null && p.s <= 3 ? Object.assign({}, p) : p);
    });
    // reset hand etc. visible state already applied; schedule steps
    sl.steps.forEach(function (s) { timers.push(setTimeout(function () { styleEl(map[s[1]], s[2]); }, s[0])); });
    loopT = setTimeout(play, sl.loop);
    capEl.textContent = sl.cap; prevBtn.style.visibility = idx ? 'visible' : 'hidden';
    nextBtn.textContent = idx === slides.length - 1 ? 'Got it ✓' : 'Next ▶';
    dotsEl.innerHTML = slides.map(function (_, i) { return '<i class="' + (i === idx ? 'on' : '') + '"></i>'; }).join('');
  }
  function build() {
    back = document.createElement('div'); back.className = 'thw-back';
    back.innerHTML = '<div class="thw-box"><h3>🎮 How to play</h3><div class="thw-stage"></div><div class="thw-cap"></div><div class="thw-dots"></div><div class="thw-row"><button class="pv">◀ Back</button><button class="go nx">Next ▶</button></div></div>';
    document.body.appendChild(back);
    stage = back.querySelector('.thw-stage'); capEl = back.querySelector('.thw-cap'); dotsEl = back.querySelector('.thw-dots');
    prevBtn = back.querySelector('.pv'); nextBtn = back.querySelector('.nx');
    prevBtn.onclick = function () { if (idx) { idx--; play(); } };
    nextBtn.onclick = function () { if (idx < slides.length - 1) { idx++; play(); } else close(); };
    back.addEventListener('click', function (e) { if (e.target === back) close(); });
  }
  function open() { if (!back) build(); idx = 0; back.style.display = 'flex'; play(); try { localStorage.setItem(key, '1'); } catch (e) { } hideTip(); btn.classList.remove('pulse','thw-pulse'); }
  function close() { clearT(); if (back) back.style.display = 'none'; }
  var btn, tip;
  function hideTip() { if (tip) { tip.remove(); tip = null; } }
  function place(el, off) {
    var pos = window.TEA_HOWTO_POS || ({ 'fortune-tea': 'tr' }[G]) || 'bl', m = 12;
    el.style[pos[0] === 't' ? 'top' : 'bottom'] = (m + (off || 0)) + 'px'; el.style[pos[1] === 'l' ? 'left' : 'right'] = m + 'px';
  }
  function init() {
    var own = G === 'tea-words' ? document.getElementById('helpBtn') : null;   // Tea Words already has a ? button: reuse it
    if (own) { btn = own; btn.addEventListener('click', function (e) { e.stopImmediatePropagation(); e.preventDefault(); open(); }, true); }
    else { btn = document.createElement('button'); btn.className = 'thw-btn'; btn.textContent = '?'; btn.title = 'How to play'; btn.setAttribute('aria-label', 'How to play');
    place(btn); btn.onclick = open; document.body.appendChild(btn); }
    // Home button (phones / store apps may have no back button)
    var home = document.createElement('button'); home.className = 'thw-btn thw-home'; home.textContent = '🏠'; home.title = 'All games'; home.setAttribute('aria-label', 'Back to all games');
    var pos = window.TEA_HOWTO_POS || ({ 'fortune-tea': 'tr' }[G]) || 'bl', hm = 12 + 48;
    if (own) { home.style.top = '8px'; home.style.left = '58px'; }              // Tea Words: next to its own ? button
    else { home.style[pos[0] === 't' ? 'top' : 'bottom'] = '12px'; home.style[pos[1] === 'l' ? 'left' : 'right'] = hm + 'px'; }
    var askT; home.onclick = function () {
      if (home.classList.contains('ask')) { location.href = 'index.html'; return; }
      home.classList.add('ask'); home.textContent = 'Exit?'; clearTimeout(askT);
      askT = setTimeout(function () { home.classList.remove('ask'); home.textContent = '🏠'; }, 2500);
    };
    document.body.appendChild(home);
    var seen = false; try { seen = !!localStorage.getItem(key); } catch (e) { }
    if (!seen) {
      btn.classList.add(own ? 'thw-pulse' : 'pulse');
      setTimeout(function () { if (!document.body.contains(btn) || back && back.style.display === 'flex') return; tip = document.createElement('div'); tip.className = 'thw-tip'; tip.textContent = '👋 New here? Tap ? to watch how to play'; if (own) { tip.style.top = '56px'; tip.style.left = '12px'; } else place(tip, 50); tip.onclick = open; document.body.appendChild(tip); setTimeout(hideTip, 7000); }, 1200);
    }
  }
  window.TeaHowto = { open: open, close: close, game: G };
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);
})();
