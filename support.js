/* ONE place to set your tip/donation links for every game and the landing page.
   Fill in the url fields you want; an empty url hides that button; with none filled, nothing shows. */
window.TEA_SUPPORT = {
  note: 'These games are free. If you enjoy them, a small tip keeps them going.',
  links: [
    {label: '☕ Buy me a coffee on Ko-fi', url: 'https://ko-fi.com/weeattea'},   // e.g. 'https://ko-fi.com/weeattea'
    {label: 'Sponsor on GitHub',          url: 'https://github.com/sponsors/usm-sg/'},   // e.g. 'https://github.com/sponsors/yourname'
    {label: 'PayPal',                     url: 'https://www.paypal.me/MOESG1234'}    // e.g. 'https://paypal.me/yourname'
  ],
  contact: ''                                          // e.g. 'mailto:you@example.com' or a Telegram link
};
(function(){
  var S = window.TEA_SUPPORT;
  /* Apple does not allow outside tip links inside iOS apps, so hide them in store-app builds. */
  var native = !!(window.Capacitor && Capacitor.isNativePlatform && Capacitor.isNativePlatform());
  window.TeaSupport = {
    links: function(){ return native ? [] : S.links.filter(function(l){ return l.url; }); },
    url: function(){ var l = this.links(); return l.length ? l[0].url : null; },
    /* small "☕ Tip" button for game-over screens; returns null when no link is set */
    button: function(cls){
      var u = this.url(); if(!u) return null;
      var b = document.createElement('button'); b.className = cls || 'btn alt'; b.textContent = '☕ Tip';
      b.onclick = function(){ window.open(u, '_blank', 'noopener'); };
      return b;
    }
  };
})();
