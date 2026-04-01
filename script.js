/* script.js — Landing Page */
(function () {
  'use strict';

  /* ── THEME ── */
  var saved = localStorage.getItem('rz-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  setIcon(saved);

  document.getElementById('themeToggle').addEventListener('click', function () {
    var cur  = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rz-theme', next);
    setIcon(next);
  });
  function setIcon(t) {
    var el = document.getElementById('themeIcon');
    if (el) el.textContent = t === 'dark' ? '💡' : '🌙';
  }

  /* ── LOADING SCREEN ── */
  var loadEl   = document.getElementById('loading-screen');
  var pctEl    = document.getElementById('loaderPct');
  var start    = Date.now();
  var DURATION = 2600;

  (function tick() {
    var p    = Math.min((Date.now() - start) / DURATION, 1);
    var ease = 1 - Math.pow(1 - p, 3);
    if (pctEl) pctEl.textContent = Math.floor(ease * 100) + '%';
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      setTimeout(function () {
        loadEl.classList.add('hide');
        setTimeout(function () { loadEl.style.display = 'none'; }, 750);
      }, 180);
    }
  })();

  /* ── NAV SHADOW ON SCROLL ── */
  var nav = document.querySelector('.floating-nav');
  window.addEventListener('scroll', function () {
    if (nav) nav.classList.toggle('shadow', window.scrollY > 10);
  }, { passive: true });

  /* ── PENCET BUTTON ── */
  var pencetBtn  = document.getElementById('pencetBtn');
  var fragOverlay = document.getElementById('fragOverlay');
  var going = false;

  pencetBtn.addEventListener('click', function () {
    if (going) return;
    going = true;
    pencetBtn.disabled = true;

    document.body.classList.add('glitching');
    setTimeout(function () {
      document.body.classList.remove('glitching');
      runFragmentation();
    }, 460);
  });

  function runFragmentation() {
    fragOverlay.style.display = 'block';
    var tW = 36, tH = 36;
    var cols = Math.ceil(window.innerWidth  / tW) + 1;
    var rows = Math.ceil(window.innerHeight / tH) + 1;
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
    var frag = document.createDocumentFragment();

    for (var r = 0; r < rows; r++) {
      for (var c = 0; c < cols; c++) {
        var tile  = document.createElement('div');
        var tx_r  = (c * tW + tW / 2) - cx;
        var ty_r  = (r * tH + tH / 2) - cy;
        var len   = Math.sqrt(tx_r * tx_r + ty_r * ty_r) || 1;
        var dist  = 160 + Math.random() * 220;
        var tx    = (tx_r / len) * dist * (0.6 + Math.random() * 0.8);
        var ty2   = (ty_r / len) * dist * (0.6 + Math.random() * 0.8);
        var rot   = (Math.random() - 0.5) * 600;
        var delay = Math.random() * 0.28;
        tile.style.cssText = [
          'position:fixed', 'width:'+(tW+1)+'px', 'height:'+(tH+1)+'px',
          'left:'+(c*tW)+'px', 'top:'+(r*tH)+'px',
          'background:var(--bg)', 'border:1px solid rgba(79,255,218,0.05)',
          'z-index:9990',
          'animation:fragTile 0.72s '+delay.toFixed(3)+'s cubic-bezier(.55,0,1,.45) forwards'
        ].join(';');
        tile.style.setProperty('--tx',  tx.toFixed(1)+'px');
        tile.style.setProperty('--ty',  ty2.toFixed(1)+'px');
        tile.style.setProperty('--rot', rot.toFixed(1)+'deg');
        frag.appendChild(tile);
      }
    }
    fragOverlay.appendChild(frag);
    setTimeout(function () { window.location.href = 'main.html'; }, 1200);
  }

})();
