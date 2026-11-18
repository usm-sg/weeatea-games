/* Tea Games — light / dark theme. Light is the default.
   Switch with TeaTheme.set('dark'|'light') (the home page has a button). Choice is saved on the device.
   Loaded in <head> of every page so canvas games can read window.TEA_LIGHT before they start. */
(function () {
  if (window.TeaTheme) return;
  var mode = 'light'; try { mode = localStorage.getItem('tea_theme') === 'dark' ? 'dark' : 'light'; } catch (e) { }
  window.TEA_LIGHT = mode === 'light';
  var G = (location.pathname.split('/').pop() || 'index').replace(/\.html?$/, '');

  var INK = '#3a2410', DIM = '#7a5f40', ORANGE = '#c2570a', CREAM = '#fff4de', PANEL = '#fffaf0', LINE = '#e6d2b0';
  var COMMON =
    /* how-to + hub dialogs */
    '.thw-btn{background:rgba(255,250,240,.95)!important;color:' + INK + '!important;border-color:#d9b98f!important}' +
    '.thw-home.ask{background:#c0392b!important;color:#fff!important}' +
    '.thw-tip{border:1px solid #e6d2b0}' +
    '.thw-box{background:' + PANEL + '!important;color:' + INK + '!important}.thw-cap{color:#5b4630!important}' +
    '.thw-row button{background:#eadbc4!important;color:' + INK + '!important}.thw-row button.go{background:#ffb02e!important;color:#2a1a00!important}' +
    '.thw-dots i{background:#d9c7a8!important}.thw-dots i.on{background:#e8722a!important}' +
    '.thw-back,.thub-back{background:rgba(255,244,222,.88)!important}' +
    '.thub-box{background:' + PANEL + '!important;color:' + INK + '!important;border-color:' + LINE + '!important}.thub-box p{color:#6b5236}' +
    '.thub-opt{background:#f6e8d0!important}.thub-opt b{color:' + ORANGE + '!important}' +
    '.thub-code input{background:#fff!important;color:#222!important;border-color:#e0c9a4!important}' +
    '.thub-x{background:#eadbc4!important;color:' + INK + '!important}';

  /* the three original games share one palette */
  var ORIG =
    'html,body{background:linear-gradient(#cfeaff,#fff1d6)!important}' +
    '#overlay{background:radial-gradient(ellipse at center,rgba(255,250,236,.9),rgba(255,236,200,.96))!important;color:' + INK + '!important}' +
    '#overlay h1{color:' + ORANGE + '!important;text-shadow:0 2px 0 rgba(255,255,255,.8)!important}' +
    '#overlay .sub,.howto{color:#5b4630!important}#overlay .stat,.howto li b{color:' + ORANGE + '!important}' +
    '.legend div{color:#5b4630!important}#hint{color:#8a6a46!important}' +
    'button.btn.alt{background:linear-gradient(#a9b9e8,#7d92cf)!important;box-shadow:0 6px 0 #5a6ca8!important}' +
    '.scorebox,.panel{background:#fffaf0!important;color:' + INK + '!important;box-shadow:0 2px 8px rgba(120,80,20,.15)}' +
    '.scorebox .label,.panel .label{color:#8a6a46!important}.scorebox .value,.panel .value,#topbar h1{color:' + ORANGE + '!important}' +
    '#grid{background:#f0dcb8!important}.cellbg{background:rgba(120,80,20,.1)!important}' +
    '.demo .box{background:rgba(120,80,20,.1)!important}.demo .plus,.demo .eq{color:#8a6a46!important}' +
    '#chain .arrow{color:#b79a72!important}' +
    'canvas#next{background:#f6e8d0!important}canvas#board{background:#fff6e4!important;box-shadow:0 8px 24px rgba(120,80,20,.25)!important}' +
    '#touchControls button{background:rgba(120,80,20,.14)!important;color:' + INK + '!important}' +
    '.pill{background:rgba(255,250,240,.78)!important;color:' + INK + '!important;text-shadow:none!important;border-color:rgba(120,80,20,.25)!important}.pill b{color:' + ORANGE + '!important}' +
    '#hearts span{filter:none!important}#stage{box-shadow:0 6px 24px rgba(120,80,20,.3)!important}';

  var CSS = {
    'tea-strike': ORIG, 'tea-fusion': ORIG, 'tea-blocks': ORIG,

    'tea-match':
      ':root{--ink:#3a1f5a;--dim:#6b4f8f}' +
      'body{background:linear-gradient(160deg,#ffd6ea 0%,#ffeec2 45%,#c9f2ec 100%)!important}' +
      'body::before{opacity:.5}' +
      '#overlay{background:radial-gradient(circle at 50% 40%,rgba(255,238,250,.94),rgba(255,247,214,.97))!important;color:#3a1f5a!important}' +
      '#overlay h1{color:#c2570a!important;text-shadow:0 3px 0 #ffd9a8!important}.sub{color:#5b4580!important}' +
      '.stat{color:#c2570a!important;text-shadow:0 3px 0 #ffd9a8!important}' +
      '.pill{background:rgba(255,255,255,.72)!important;border-color:rgba(255,255,255,.95)!important;box-shadow:0 4px 12px rgba(120,60,140,.18)!important}' +
      '.pill b{color:#c2570a!important;text-shadow:none!important}.pill small{color:#8a6aa8!important}' +
      '#how,.how,#overlay .how{background:rgba(255,255,255,.7)!important;color:#3a1f5a!important;border-color:rgba(120,60,140,.2)!important}' +
      '#overlay [style*="background"]{color:#3a1f5a}',

    'tea-mahjong':
      ':root{--bg:#e9f7ee;--panel:#ffffff;--ink:#16382a;--dim:#4f7a64;--gold:#c2570a}' +
      'html,body{background:radial-gradient(circle at 50% 30%,#d5f3e2,#9bd9b6)!important}' +
      '#overlay{background:rgba(233,250,241,.94)!important;color:#16382a!important}.sub{color:#35604b!important}' +
      '.btn.alt{background:#8fd0aa!important;color:#0f3a28!important;box-shadow:0 4px 0 #5fa982!important}',

    'tea-solitaire':
      ':root{--felt:#6fcb9d;--felt2:#46ad7b;--ink:#0f3a28;--gold:#8a3d05}' +
      '#overlay{background:rgba(233,250,241,.95)!important;color:#0f3a28!important}.sub{color:#35604b!important}',

    'tea-checkers':
      ':root{--bg:#fff4e0;--panel:#ffffff;--ink:#3a2410;--dim:#7a5f40;--gold:#c2570a;--jade:#0f9a6c}' +
      'html,body{background:radial-gradient(circle at 50% 40%,#fff3da,#ffd9a3)!important}' +
      '#overlay{background:rgba(255,244,224,.94)!important;color:#3a2410!important}.sub{color:#5b4630!important}' +
      '.btn.alt{background:#eadbc4!important;color:#3a2410!important;box-shadow:0 3px 0 #cdb89a!important}',

    'tea-words':
      ':root{--bg:#fff8ec;--panel:#ffffff;--ink:#2a1a0c;--dim:#7a5f40;--no:#a89c8c;--key:#e4d8c6}' +
      '.tile{border-color:#d3c8b8!important}.tile.f{border-color:#8a7a68!important}' +
      '.tile.ok,.tile.mid,.tile.no{color:#fff!important}.k.ok,.k.mid{color:#fff!important}.k.no{background:#cfc5b6!important;color:#8c7f72!important}' +
      '#modal{background:rgba(255,244,222,.92)!important}.btn.alt{background:#eadbc4!important;color:#2a1a0c!important;box-shadow:0 3px 0 #cdb89a!important}',

    'spin-wheel':
      ':root{--bg:#fff7e8;--card:#ffffff;--card2:#f6ead2;--line:rgba(120,80,20,.16);--txt:#2a1a0c;--mut:#7a5f40;--acc:#d9620a;--acc2:#ff9a3d}',

    'index':
      ':root{--bg:#fff4de;--card:#fffaf0;--ink:#3a2410;--acc:#c2570a}' +
      'a.g,#strip div,#badges span{border-color:#e6d2b0!important;box-shadow:0 2px 8px rgba(120,80,20,.1)}' +
      'a.g .req{color:#b4540a!important}',

    'fortune-tea':
      ':root{--ink:#3a2410;--dim:#7a5f40;--gold:#c2570a}' +
      'html,body{background:radial-gradient(circle at 50% 20%,#fff0c8,#ffd391 85%)!important}' +
      '.btn.alt{background:#eadbc4!important;color:#3a2410!important;box-shadow:0 4px 0 #cdb89a!important}' +
      '#book div{background:#f3dfb0!important;color:#9a7a4a!important}#book div.on{background:#ffb02e!important;color:#3a2410!important}' +
      '.small{color:#8a6a46!important}',

    'chinlone':
      ':root{--ink:#3a2410;--dim:#7a5f40;--gold:#c2570a}html,body{background:#bfe6ff!important}' +
      '#hud div{background:rgba(255,250,240,.78)!important}#hud small{color:#8a6a46!important}' +
      '#overlay{background:rgba(255,248,230,.93)!important;color:#3a2410!important}.sub{color:#5b4630!important}.stat{color:#c2570a!important}' +
      '.btn.alt{background:#8fd0aa!important;color:#0f3a28!important;box-shadow:0 4px 0 #5fa982!important}',

    'yangon-dash':
      ':root{--ink:#3a2410;--dim:#7a5f40;--gold:#c2570a}html,body{background:#9fd98b!important}' +
      '#hud div{background:rgba(255,250,240,.82)!important}#hud small{color:#8a6a46!important}' +
      '#overlay{background:rgba(255,248,230,.93)!important;color:#3a2410!important}.sub{color:#5b4630!important}.stat{color:#c2570a!important}' +
      '.btn.alt{background:#eadbc4!important;color:#3a2410!important;box-shadow:0 4px 0 #cdb89a!important}',

    'myanmar-memory':
      ':root{--ink:#3a1f5a;--dim:#6b4f8f;--gold:#c2570a}' +
      'html,body{background:radial-gradient(circle at 50% 20%,#ffe3f1,#dccbff 85%)!important}' +
      '.box{background:rgba(255,255,255,.75)!important}.box small{color:#8a6aa8!important}' +
      '#overlay{background:rgba(250,240,255,.94)!important;color:#3a1f5a!important}.sub{color:#5b4580!important}.stat{color:#c2570a!important}' +
      '.btn.alt{background:#d9c6f5!important;color:#3a1f5a!important;box-shadow:0 4px 0 #b49be0!important}'
  };

  function css() {
    var s = document.createElement('style'); s.id = 'tea-theme-css';
    s.textContent = (COMMON + (CSS[G] || '')).replace(/:root\{/g, 'html.tea-light{'); (document.head || document.documentElement).appendChild(s);
    var m = document.querySelector('meta[name=theme-color]'); if (m) m.setAttribute('content', '#fff4de');
  }
  if (window.TEA_LIGHT) { document.documentElement.classList.add('tea-light'); css(); }
  window.TeaTheme = {
    mode: mode,
    set: function (m) { try { localStorage.setItem('tea_theme', m === 'dark' ? 'dark' : 'light'); } catch (e) { } location.reload(); },
    toggle: function () { this.set(window.TEA_LIGHT ? 'dark' : 'light'); }
  };
})();
