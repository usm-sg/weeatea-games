/* Tea Games hub — daily streak, badges, and game unlocks (by streak, rewarded ads, or supporter pass).
   Loaded by the landing page and every game. All progress lives in localStorage (works offline).

   CONFIGURE (edit here, or set window.TEA_UNLOCKS / TEA_ADS / TEA_PASS before this script):
   - UNLOCKS: games not listed are free. "any" = the player needs to satisfy ANY ONE rule.
       {ads:N}    watch N rewarded ads (only offered when a rewarded-ad provider exists, see TEA_ADS)
       {streak:N} play on N days in a row
       {pass:1}   supporter pass (one-time purchase code)
   - TEA_ADS: in a store app, set  window.TEA_ADS = { rewarded: () => Promise<boolean> }  (e.g. AdMob rewarded video;
       resolve true only when the ad was fully watched). On the plain website there is no provider, so ad rules are hidden.
   - TEA_PASS: { url: 'https://ko-fi.com/…', codes: ['<sha256 of each valid code>'] }  (make hashes with  python3 pwa/make_code.py CODE)
     Codes are checked on the device, which is fine for a small project; for stronger protection verify in your Worker. */
(function () {
  if (window.TeaHub) return;
  var UNLOCKS = window.TEA_UNLOCKS || {
    'yangon-dash':    { any: [{ ads: 3 }, { streak: 3 }, { pass: 1 }] },
    'myanmar-memory': { any: [{ ads: 2 }, { streak: 2 }, { pass: 1 }] }
  };
  var PASS = window.TEA_PASS || { url: '', codes: [] };
  var NAMES = { 'tea-strike': 'Tea Strike', 'tea-fusion': 'Tea Fusion', 'tea-blocks': 'Tea Blocks', 'tea-match': 'Tea Match', 'tea-mahjong': 'Tea Mahjong', 'tea-solitaire': 'Tea Solitaire', 'tea-checkers': 'Tea Checkers', 'tea-words': 'Tea Words', 'fortune-tea': 'Fortune Tea', 'chinlone': 'Chinlone', 'yangon-dash': 'Yangon Dash', 'myanmar-memory': 'Myanmar Memory' };
  var BADGES = {
    first: ['🌱', 'First Sip', 'Played your first game'],
    s3: ['🔥', 'Warm Cup', '3-day streak'], s7: ['☕', 'Weekly Brew', '7-day streak'], s30: ['🏵️', 'Tea Master', '30-day streak'],
    e4: ['🧭', 'Explorer', 'Tried 4 different games'], e8: ['🗺️', 'Globetrotter', 'Tried 8 different games'],
    pass: ['💛', 'Supporter', 'Unlocked the supporter pass']
  };
  var KEY = 'tea_hub_v1', S;
  function today(d) { d = d || new Date(); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }
  function dayDiff(a, b) { return Math.round((new Date(b + 'T00:00:00') - new Date(a + 'T00:00:00')) / 864e5); }
  function load() { try { S = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { S = {}; }
    S.streak = S.streak || 0; S.best = S.best || 0; S.last = S.last || ''; S.games = S.games || {}; S.badges = S.badges || {}; S.ads = S.ads || {}; S.unlocked = S.unlocked || {}; S.pass = !!S.pass; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { } }
  load();

  var toastQ = [];
  function toast(msg) {
    toastQ.push(msg); if (toastQ.length > 1) return; (function next() {
      if (!toastQ.length) return; var d = document.createElement('div'); d.className = 'thub-toast'; d.textContent = toastQ[0]; document.body.appendChild(d);
      setTimeout(function () { d.style.opacity = 0; }, 2600); setTimeout(function () { d.remove(); toastQ.shift(); next(); }, 3000);
    })();
  }
  function award(id) { if (S.badges[id]) return; S.badges[id] = today(); save(); var b = BADGES[id]; if (b) toast(b[0] + ' Badge: ' + b[1]); }
  function checkBadges() {
    var n = Object.keys(S.games).length;
    if (n >= 1) award('first'); if (S.streak >= 3) award('s3'); if (S.streak >= 7) award('s7'); if (S.streak >= 30) award('s30');
    if (n >= 4) award('e4'); if (n >= 8) award('e8'); if (S.pass) award('pass');
  }
  function visit(game) {
    var t = today();
    if (S.last !== t) { S.streak = (S.last && dayDiff(S.last, t) === 1) ? S.streak + 1 : 1; S.last = t; if (S.streak > S.best) S.best = S.streak; }
    if (game) S.games[game] = (S.games[game] || 0) + (S.lastGame === game + t ? 0 : 1), S.lastGame = game + t;
    save(); autoUnlock(); checkBadges();
  }
  function adsAvailable() { return !!(window.TEA_ADS && typeof window.TEA_ADS.rewarded === 'function'); }
  function rules(game) { var u = UNLOCKS[game]; return u ? u.any.filter(function (r) { return !r.ads || adsAvailable(); }) : []; }
  function met(game, r) {
    if (r.streak) return S.streak >= r.streak; if (r.ads) return (S.ads[game] || 0) >= r.ads; if (r.pass) return S.pass; return false;
  }
  function autoUnlock() { Object.keys(UNLOCKS).forEach(function (g) { if (!S.unlocked[g] && UNLOCKS[g].any.some(function (r) { return (r.ads && !adsAvailable()) ? false : met(g, r); })) { S.unlocked[g] = today(); save(); toast('🔓 Unlocked: ' + (NAMES[g] || g)); } }); }
  function locked(game) { return !!UNLOCKS[game] && !S.unlocked[game] && !(S.pass); }
  function sha256(s) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(s).trim().toUpperCase())).then(function (b) {
      return Array.prototype.map.call(new Uint8Array(b), function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); });
  }
  function redeem(code) {
    return sha256(code).then(function (h) { if (PASS.codes.indexOf(h) >= 0) { S.pass = true; save(); autoUnlock(); checkBadges(); return true; } return false; });
  }
  function describe(r) { return r.ads ? ('Watch ' + r.ads + ' short ad' + (r.ads > 1 ? 's' : '')) : r.streak ? ('Play ' + r.streak + ' days in a row') : 'Supporter pass'; }
  function progress(game, r) { return r.ads ? Math.min(S.ads[game] || 0, r.ads) + '/' + r.ads : r.streak ? Math.min(S.streak, r.streak) + '/' + r.streak : ''; }

  /* ---------- unlock dialog ---------- */
  var css = '.thub-toast{position:fixed;left:50%;top:14px;transform:translateX(-50%);z-index:100001;background:#fff;color:#222;font:700 14px system-ui,sans-serif;padding:10px 16px;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.45);transition:opacity .4s;max-width:88vw;text-align:center}' +
    '.thub-back{position:fixed;inset:0;z-index:100000;display:flex;align-items:center;justify-content:center;background:rgba(5,8,18,.85);padding:14px;font-family:system-ui,"Segoe UI",sans-serif}' +
    '.thub-box{background:#241a10;color:#fbeed8;border:1px solid #4a3220;border-radius:18px;padding:18px;width:100%;max-width:340px;text-align:center;box-shadow:0 10px 40px rgba(0,0,0,.6)}' +
    '.thub-box h3{margin:0 0 4px;font-size:20px}.thub-box p{margin:0 0 12px;font-size:13px;opacity:.8}' +
    '.thub-opt{display:flex;justify-content:space-between;align-items:center;gap:8px;background:#33251a;border-radius:12px;padding:10px 12px;margin-bottom:8px;font-size:14px;text-align:left}' +
    '.thub-opt.done{outline:2px solid #6fcf6f}.thub-opt b{color:#e8a33d}.thub-opt button,.thub-btn{border:0;border-radius:10px;padding:8px 12px;font:700 13px system-ui,sans-serif;background:#e8a33d;color:#2b1704;cursor:pointer;text-decoration:none;display:inline-block}' +
    '.thub-code{display:flex;gap:6px;margin:8px 0}.thub-code input{flex:1;min-width:0;border-radius:10px;border:1px solid #4a3220;background:#150e08;color:#fff;padding:8px;font-size:14px}' +
    '.thub-x{background:#3a2a1b!important;color:#fbeed8!important;margin-top:6px}.thub-msg{min-height:16px;font-size:12px;color:#ffd24d;margin-top:4px}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  function dialog(game, onChange) {
    var back = document.createElement('div'); back.className = 'thub-back';
    function render() {
      var rs = rules(game), h = '<div class="thub-box"><h3>🔒 ' + (NAMES[game] || game) + '</h3><p>Unlock this game any one way:</p>';
      rs.forEach(function (r, i) {
        var done = met(game, r);
        h += '<div class="thub-opt' + (done ? ' done' : '') + '"><span><b>' + describe(r) + '</b>' + (progress(game, r) ? '<br><small>Progress ' + progress(game, r) + '</small>' : '') + '</span>' +
          (r.ads ? '<button data-ad="1">▶ Watch ad</button>' : r.pass && PASS.url ? '<a class="thub-btn" target="_blank" rel="noopener" href="' + PASS.url + '">Get pass</a>' : '') + '</div>';
      });
      if (rs.some(function (r) { return r.pass; })) h += '<div class="thub-code"><input id="thubCode" placeholder="Supporter code" autocapitalize="characters"><button class="thub-btn" id="thubGo">Redeem</button></div>';
      h += '<div class="thub-msg" id="thubMsg"></div><button class="thub-btn thub-x" id="thubClose">Close</button></div>';
      back.innerHTML = h;
      var ad = back.querySelector('[data-ad]');
      if (ad) ad.onclick = function () {
        ad.disabled = true; var msg = back.querySelector('#thubMsg'); msg.textContent = 'Loading ad…';
        Promise.resolve().then(function () { return window.TEA_ADS.rewarded(); }).then(function (ok) {
          if (ok) { S.ads[game] = (S.ads[game] || 0) + 1; save(); autoUnlock(); if (!locked(game)) { back.remove(); onChange && onChange(); return; } }
          else msg.textContent = 'Ad not completed — no reward.';
          render();
        }).catch(function () { msg.textContent = 'No ad available right now. Try again later.'; ad.disabled = false; });
      };
      var go = back.querySelector('#thubGo');
      if (go) go.onclick = function () { redeem(back.querySelector('#thubCode').value).then(function (ok) { if (ok) { back.remove(); onChange && onChange(); } else back.querySelector('#thubMsg').textContent = 'That code isn’t valid.'; }); };
      back.querySelector('#thubClose').onclick = function () { back.remove(); };
    }
    render(); document.body.appendChild(back);
  }

  window.TeaHub = {
    state: function () { return S; }, badges: BADGES, names: NAMES, unlocks: UNLOCKS,
    visit: visit, locked: locked, dialog: dialog, redeem: redeem, rules: rules, describe: describe, progress: progress,
    need: function (g) { var rs = rules(g); return rs.length ? rs.map(describe).join(' · ') : 'Supporter pass'; },
    reset: function () { try { localStorage.removeItem(KEY); } catch (e) { } S = {}; load(); save(); }
  };

  /* ---------- on a game page: count the visit and gate locked games ---------- */
  var G = (location.pathname.split('/').pop() || '').replace(/\.html?$/, '');
  if (NAMES[G]) {
    var run = function () {
      if (locked(G)) {
        visit(null);
        var gate = document.createElement('div'); gate.className = 'thub-back'; gate.style.background = 'rgba(5,8,18,.97)';
        gate.innerHTML = '<div class="thub-box"><h3>🔒 ' + NAMES[G] + '</h3><p>This game is locked. Unlock it by: ' + window.TeaHub.need(G) + '</p><button class="thub-btn" id="gUn">Unlock options</button> <a class="thub-btn thub-x" href="index.html">← All games</a></div>';
        document.body.appendChild(gate); gate.querySelector('#gUn').onclick = function () { dialog(G, function () { gate.remove(); visit(G); }); };
      } else visit(G);
    };
    if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
  } else visit(null);
})();
