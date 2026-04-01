
/* main.js — Main Page (v2 — all bugs fixed) */
(function () {
  'use strict';

  /* ══════════════════════════════════
     THEME
     ══════════════════════════════════ */
  var saved = localStorage.getItem('rz-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
  setThemeIcon(saved);

  document.getElementById('themeToggle').addEventListener('click', function () {
    var cur  = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('rz-theme', next);
    setThemeIcon(next);
  });
  function setThemeIcon(t) {
    var el = document.getElementById('themeIcon');
    if (el) el.textContent = t === 'dark' ? '💡' : '🌙';
  }

  /* ══════════════════════════════════
     STICKY NAV SHADOW ON SCROLL
     ══════════════════════════════════ */
  var floatingNav = document.getElementById('floatingNav');
  window.addEventListener('scroll', function () {
    if (floatingNav) floatingNav.classList.toggle('shadow', window.scrollY > 10);
  }, { passive: true });

  /* ══════════════════════════════════
     SIDE MENU
     ══════════════════════════════════ */
  var menuBtn      = document.getElementById('menuBtn');
  var sideMenu     = document.getElementById('sideMenu');
  var menuBackdrop = document.getElementById('menuBackdrop');

  function openMenu() {
    if (!sideMenu) return;
    sideMenu.classList.add('open');
    menuBackdrop.classList.add('show');
    menuBtn.classList.add('menu-active');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!sideMenu) return;
    sideMenu.classList.remove('open');
    menuBackdrop.classList.remove('show');
    menuBtn.classList.remove('menu-active');
    document.body.style.overflow = '';
  }
  menuBtn.addEventListener('click', function () {
    sideMenu.classList.contains('open') ? closeMenu() : openMenu();
  });
  menuBackdrop.addEventListener('click', closeMenu);

  /* Menu action buttons */
  document.getElementById('shareBtn').addEventListener('click', function () {
    closeMenu();
    if (navigator.share) {
      navigator.share({ title:'Projek Razik', text:'Belajar HTML bareng Razik!', url:location.href }).catch(function(){});
    } else {
      try { navigator.clipboard.writeText(location.href); showToast('📋 Link berhasil disalin!'); }
      catch(e) { showToast('🔗 Salin dari address bar!'); }
    }
  });
  document.getElementById('resetBtn').addEventListener('click', function () {
    closeMenu();
    window.scrollTo({ top:0, behavior:'smooth' });
    showToast('🔄 Balik ke atas!');
  });
  document.getElementById('exitBtn').addEventListener('click', function () {
    closeMenu();
    window.location.href = 'index.html';
  });

  /* ══════════════════════════════════
     SCROLL REVEAL
     ══════════════════════════════════ */
  var revealEls = document.querySelectorAll('.reveal-item');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('revealed'); });
  }

  /* ══════════════════════════════════
     GALLERY AUTO-SCROLL
     ══════════════════════════════════ */
  var IMGS = ['img/1.png','img/2.png','img/3.png','img/4.png','img/5.png'];

  var track    = document.getElementById('galleryTrack');
  var viewport = document.getElementById('galleryViewport');
  var gUp      = document.getElementById('gUp');
  var gPauseBtn= document.getElementById('gPause');
  var gDown    = document.getElementById('gDown');
  var speedLbl = document.getElementById('gSpeedLabel');
  var dots     = document.querySelectorAll('.g-dot');

  var scrollY   = 0;
  var direction = 1;     // 1 = down, -1 = up
  var speed     = 0.6;
  var isPaused  = false;
  var activeDot = 0;
  var rafId     = null;

  var SPEED_NORMAL = 0.6;
  var SPEED_FAST   = 1.8;
  var SPEED_TURBO  = 4.0;

  function maxScroll() {
    if (!track || !viewport) return 0;
    return Math.max(0, track.scrollHeight - viewport.offsetHeight);
  }
  function itemH() {
    var img = track ? track.querySelector('.gallery-item img') : null;
    return img ? img.offsetHeight : 240;
  }

  function galleryTick() {
    if (!isPaused && track) {
      var ms = maxScroll();
      scrollY += speed * direction;

      if (direction === 1 && scrollY >= ms) {
        scrollY = ms; direction = -1; updateSpeedLabel();
      } else if (direction === -1 && scrollY <= 0) {
        scrollY = 0; direction = 1; updateSpeedLabel();
      }

      track.style.transform = 'translateY(' + (-scrollY).toFixed(2) + 'px)';

      var ih = itemH();
      if (ih > 0) {
        var newDot = Math.max(0, Math.min(Math.floor((scrollY + ih * 0.4) / ih), IMGS.length - 1));
        if (newDot !== activeDot) { activeDot = newDot; updateDots(); }
      }
    }
    rafId = requestAnimationFrame(galleryTick);
  }

  function updateDots() {
    dots.forEach(function (d, i) { d.classList.toggle('active', i === activeDot); });
  }
  function updateSpeedLabel() {
    if (!speedLbl) return;
    if (isPaused) { speedLbl.textContent = '⏸ PAUSE'; return; }
    var sym = direction > 0 ? '▼' : '▲';
    var lbl = speed <= SPEED_NORMAL ? 'AUTO' : speed <= SPEED_FAST ? 'FAST' : 'TURBO';
    speedLbl.textContent = sym + ' ' + lbl;
  }

  /* ▲ up btn */
  gUp.addEventListener('click', function () {
    if (isPaused) { isPaused = false; gPauseBtn.innerHTML = '&#9646;&#9646;'; }
    if (direction === 1) { direction = -1; speed = SPEED_NORMAL; }
    else { speed = speed < SPEED_FAST ? SPEED_FAST : SPEED_TURBO; }
    updateSpeedLabel();
  });
  /* ▼ down btn */
  gDown.addEventListener('click', function () {
    if (isPaused) { isPaused = false; gPauseBtn.innerHTML = '&#9646;&#9646;'; }
    if (direction === -1) { direction = 1; speed = SPEED_NORMAL; }
    else { speed = speed < SPEED_FAST ? SPEED_FAST : SPEED_TURBO; }
    updateSpeedLabel();
  });
  /* pause btn */
  gPauseBtn.addEventListener('click', function () {
    isPaused = !isPaused;
    if (!isPaused) speed = SPEED_NORMAL;
    gPauseBtn.innerHTML = isPaused ? '&#9654;' : '&#9646;&#9646;';
    updateSpeedLabel();
  });
  /* dot click */
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      var idx = parseInt(this.getAttribute('data-dot'), 10);
      scrollY = idx * itemH();
      activeDot = idx; updateDots();
    });
  });

  /* Start gallery after layout */
  if (track) {
    setTimeout(function () { galleryTick(); updateSpeedLabel(); }, 400);
  }

  /* ══════════════════════════════════
     LIGHTBOX — completely rewritten
     ══════════════════════════════════ */
  var lightbox  = document.getElementById('lightbox');
  var lbImgEl   = document.getElementById('lightbox-img');
  var lbSpinner = document.getElementById('lbSpinner');
  var lbCounter = document.getElementById('lbCounter');
  var lbClose   = document.getElementById('lbClose');
  var lbPrev    = document.getElementById('lbPrev');
  var lbNext    = document.getElementById('lbNext');

  var lbIdx     = 0;
  var lbSavedPause = false;

  /* -- Open lightbox with a specific image index -- */
  function lbOpen(idx) {
    lbIdx = ((idx % IMGS.length) + IMGS.length) % IMGS.length;

    /* Pause gallery */
    lbSavedPause = isPaused;
    isPaused = true;
    gPauseBtn.innerHTML = '&#9654;';
    updateSpeedLabel();

    /* Show lightbox shell first */
    lightbox.classList.add('lb-active');
    document.body.style.overflow = 'hidden';

    /* Reset image state */
    lbImgEl.classList.remove('lb-img-ready');
    lbImgEl.src = '';
    lbImgEl.style.opacity = '0';
    lbImgEl.style.transform = 'scale(0.85)';

    /* Show spinner */
    lbSpinner.classList.remove('hidden');

    /* Preload image then show */
    var temp = new Image();
    temp.onload = function () {
      lbSpinner.classList.add('hidden');
      lbImgEl.src = temp.src;
      lbImgEl.style.transition = '';
      /* Force reflow so transition triggers */
      void lbImgEl.offsetWidth;
      lbImgEl.style.transition = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease';
      lbImgEl.style.opacity    = '1';
      lbImgEl.style.transform  = 'scale(1)';
      lbImgEl.classList.add('lb-img-ready');
      lbCounter.textContent = (lbIdx + 1) + ' / ' + IMGS.length;
    };
    temp.onerror = function () {
      /* If image fails, show placeholder text */
      lbSpinner.classList.add('hidden');
      lbImgEl.alt = '⚠ Gambar ' + (lbIdx + 1) + ' tidak ditemukan.\nPastikan file img/' + (lbIdx+1) + '.png ada.';
      lbImgEl.style.transition = 'opacity 0.35s';
      lbImgEl.style.opacity    = '0.6';
      lbImgEl.style.transform  = 'scale(1)';
      lbCounter.textContent = (lbIdx + 1) + ' / ' + IMGS.length;
    };
    temp.src = IMGS[lbIdx];
  }

  /* -- Close lightbox -- */
  function lbClose2() {
    lightbox.classList.remove('lb-active');
    document.body.style.overflow = '';
    /* Restore gallery state */
    isPaused = lbSavedPause;
    gPauseBtn.innerHTML = isPaused ? '&#9654;' : '&#9646;&#9646;';
    updateSpeedLabel();
    /* Clean image after transition */
    setTimeout(function () {
      lbImgEl.src = '';
      lbImgEl.classList.remove('lb-img-ready');
      lbImgEl.style.transition = '';
      lbImgEl.style.opacity    = '0';
      lbImgEl.style.transform  = 'scale(0.85)';
    }, 400);
  }

  /* -- Step to prev/next image -- */
  function lbStep(dir) {
    lbIdx = ((lbIdx + dir) + IMGS.length) % IMGS.length;
    /* Slide out */
    lbImgEl.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
    lbImgEl.style.opacity    = '0';
    lbImgEl.style.transform  = dir > 0 ? 'scale(0.8) translateX(-30px)' : 'scale(0.8) translateX(30px)';
    setTimeout(function () {
      lbImgEl.src = '';
      lbImgEl.classList.remove('lb-img-ready');
      lbSpinner.classList.remove('hidden');
      var temp = new Image();
      temp.onload = function () {
        lbSpinner.classList.add('hidden');
        lbImgEl.src = temp.src;
        lbImgEl.style.transition = '';
        void lbImgEl.offsetWidth;
        lbImgEl.style.transform  = dir > 0 ? 'scale(0.8) translateX(30px)' : 'scale(0.8) translateX(-30px)';
        void lbImgEl.offsetWidth;
        lbImgEl.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.3s ease';
        lbImgEl.style.opacity    = '1';
        lbImgEl.style.transform  = 'scale(1) translateX(0)';
        lbCounter.textContent    = (lbIdx + 1) + ' / ' + IMGS.length;
      };
      temp.onerror = function () {
        lbSpinner.classList.add('hidden');
        lbImgEl.style.transition = 'opacity 0.3s';
        lbImgEl.style.opacity    = '0.5';
        lbImgEl.style.transform  = 'scale(1)';
        lbCounter.textContent    = (lbIdx + 1) + ' / ' + IMGS.length;
      };
      temp.src = IMGS[lbIdx];
    }, 200);
  }

  /* -- Attach click to gallery items -- */
  document.querySelectorAll('.gallery-item').forEach(function (item) {
    item.addEventListener('click', function (e) {
      e.stopPropagation();
      lbOpen(parseInt(this.getAttribute('data-idx'), 10));
    });
    /* Keyboard access */
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lbOpen(parseInt(this.getAttribute('data-idx'), 10));
      }
    });
  });

  lbClose.addEventListener('click',  lbClose2);
  lbPrev.addEventListener('click',   function () { lbStep(-1); });
  lbNext.addEventListener('click',   function () { lbStep(1);  });

  /* Close on backdrop click */
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) lbClose2();
  });

  /* Keyboard navigation */
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('lb-active')) return;
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   lbStep(-1);
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown')  lbStep(1);
    if (e.key === 'Escape') lbClose2();
  });

  /* Swipe in lightbox */
  var lbSwipeX = 0;
  lightbox.addEventListener('touchstart', function(e){ lbSwipeX = e.touches[0].clientX; }, {passive:true});
  lightbox.addEventListener('touchend',   function(e){
    var dx = e.changedTouches[0].clientX - lbSwipeX;
    if (Math.abs(dx) > 55) lbStep(dx < 0 ? 1 : -1);
  }, {passive:true});

  /* ══════════════════════════════════
     TOAST
     ══════════════════════════════════ */
  var toastEl = document.getElementById('toast');
  var toastTid = null;
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTid);
    toastTid = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }

  /* ══════════════════════════════════
     EASTER EGG #1 — Click title 5x → Fireworks
     ══════════════════════════════════ */
  var pageHeader = document.getElementById('pageHeader');
  var clickCount = 0, clickTid = null;

  pageHeader.addEventListener('click', function () {
    clickCount++;
    clearTimeout(clickTid);
    if (clickCount >= 5) {
      clickCount = 0;
      launchFireworks();
      showToast('🎆 Easter Egg #1 aktif! Yeay!');
    } else {
      showToast('✨ ' + clickCount + '/5 — lanjutin!');
      clickTid = setTimeout(function () { clickCount = 0; }, 3000);
    }
  });

  /* ── Fireworks Engine ── */
  var fwCanvas = document.getElementById('fw-canvas');
  var fwCtx = null, fwParts = [], fwRaf = null;
  var PALETTE = ['#4fffda','#ff5f87','#ffd700','#b4a7f5','#ff9f43','#00d2d3','#ff6b9d','#a8ff78'];

  function launchFireworks() {
    fwCanvas.width  = window.innerWidth;
    fwCanvas.height = window.innerHeight;
    fwCanvas.style.display = 'block';
    fwCtx = fwCanvas.getContext('2d');
    fwParts = [];
    for (var i = 0; i < 8; i++) {
      (function(ii) {
        setTimeout(function () {
          burst(
            window.innerWidth  * (0.15 + Math.random() * 0.7),
            window.innerHeight * (0.1  + Math.random() * 0.4)
          );
        }, ii * 290);
      })(i);
    }
    if (fwRaf) cancelAnimationFrame(fwRaf);
    fwLoop();
    setTimeout(function () {
      cancelAnimationFrame(fwRaf);
      if (fwCtx) fwCtx.clearRect(0,0,fwCanvas.width,fwCanvas.height);
      fwCanvas.style.display = 'none';
      fwParts = [];
    }, 4800);
  }
  function burst(x, y) {
    for (var i = 0; i < 70; i++) {
      var angle = (i / 70) * Math.PI * 2;
      var sp    = 2 + Math.random() * 4.5;
      fwParts.push({
        x:x, y:y, vx:Math.cos(angle)*sp, vy:Math.sin(angle)*sp-1,
        life:1, decay:0.012+Math.random()*0.012,
        color:PALETTE[i%PALETTE.length], size:1.5+Math.random()*2.5,
        trail:[]
      });
    }
  }
  function fwLoop() {
    if (!fwCtx) return;
    fwCtx.clearRect(0,0,fwCanvas.width,fwCanvas.height);
    fwParts = fwParts.filter(function(p){ return p.life > 0; });
    fwParts.forEach(function(p) {
      p.trail.push({x:p.x,y:p.y,a:p.life});
      if (p.trail.length > 5) p.trail.shift();
      p.trail.forEach(function(tr,ti) {
        fwCtx.beginPath();
        fwCtx.arc(tr.x,tr.y,p.size*.45,0,Math.PI*2);
        fwCtx.fillStyle = p.color;
        fwCtx.globalAlpha = tr.a*.25*(ti/p.trail.length);
        fwCtx.fill();
      });
      fwCtx.save();
      fwCtx.globalAlpha = Math.max(0,p.life);
      fwCtx.shadowColor = p.color; fwCtx.shadowBlur = 8;
      fwCtx.fillStyle = p.color;
      fwCtx.beginPath(); fwCtx.arc(p.x,p.y,p.size,0,Math.PI*2); fwCtx.fill();
      fwCtx.restore();
      p.vy += 0.055; p.vx *= .984; p.vy *= .984;
      p.x += p.vx; p.y += p.vy; p.life -= p.decay;
    });
    fwRaf = requestAnimationFrame(fwLoop);
  }

  /* ══════════════════════════════════
     EASTER EGG #2 — Swipe left on gallery → Secret msg
     ══════════════════════════════════ */
  var galleryContainer = document.getElementById('galleryContainer');
  var secretMsg   = document.getElementById('secretMsg');
  var ee2Shown    = false;
  var swipeStartX = 0, swipeStartY = 0;

  galleryContainer.addEventListener('touchstart', function(e) {
    swipeStartX = e.touches[0].clientX;
    swipeStartY = e.touches[0].clientY;
  }, {passive:true});

  galleryContainer.addEventListener('touchend', function(e) {
    var dx = e.changedTouches[0].clientX - swipeStartX;
    var dy = e.changedTouches[0].clientY - swipeStartY;
    if (dx < -70 && Math.abs(dx) > Math.abs(dy) * 1.4) showSecretMsg();
  }, {passive:true});

  /* Also dblclick for desktop testing */
  galleryContainer.addEventListener('dblclick', showSecretMsg);

  function showSecretMsg() {
    if (ee2Shown) return;
    ee2Shown = true;
    secretMsg.classList.add('show');
    showToast('🤫 Easter Egg #2 ketemu!');
    setTimeout(function () {
      secretMsg.classList.remove('show');
      setTimeout(function () { ee2Shown = false; }, 500);
    }, 5500);
  }

  /* ══════════════════════════════════
     EASTER EGG #3 — Press & hold footer 2s → Matrix rain
     ══════════════════════════════════ */
  var pageFooter  = document.getElementById('pageFooter');
  var matrixCanvas= document.getElementById('matrix-canvas');
  var matrixPopup = document.getElementById('matrixPopup');
  var mCtx        = null;
  var mRaf        = null;
  var holdTid     = null;
  var ee3Active   = false;

  function startHold() {
    holdTid = setTimeout(function () { triggerMatrix(); }, 2000);
  }
  function cancelHold() {
    clearTimeout(holdTid);
  }

  pageFooter.addEventListener('mousedown',  startHold);
  pageFooter.addEventListener('touchstart', startHold,  {passive:true});
  pageFooter.addEventListener('mouseup',    cancelHold);
  pageFooter.addEventListener('mouseleave', cancelHold);
  pageFooter.addEventListener('touchend',   cancelHold, {passive:true});
  pageFooter.addEventListener('touchcancel',cancelHold, {passive:true});

  function triggerMatrix() {
    if (ee3Active) return;
    ee3Active = true;
    showToast('🔴 Easter Egg #3: SISTEM DIRETAS!');

    matrixCanvas.width  = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    matrixCanvas.classList.add('mc-active');
    mCtx = matrixCanvas.getContext('2d');

    /* Matrix rain */
    var cols   = Math.floor(window.innerWidth / 16);
    var drops  = [];
    for (var i = 0; i < cols; i++) drops[i] = Math.random() * -50;
    var mChars = 'アイウエオカキクケコ01RAZIK</>HTML{}';

    function drawMatrix() {
      mCtx.fillStyle = 'rgba(0,0,0,0.05)';
      mCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      mCtx.font = '14px Space Mono, monospace';
      for (var c = 0; c < cols; c++) {
        var ch = mChars[Math.floor(Math.random() * mChars.length)];
        var x  = c * 16;
        var y  = drops[c] * 16;
        /* Alternate accent colors */
        if (Math.random() > 0.95) {
          mCtx.fillStyle = '#ffffffdd';
        } else if (Math.random() > 0.5) {
          mCtx.fillStyle = '#4fffda';
        } else {
          mCtx.fillStyle = '#4fffda66';
        }
        mCtx.fillText(ch, x, y);
        if (y > matrixCanvas.height && Math.random() > 0.975) drops[c] = 0;
        else drops[c] += 0.6;
      }
      mRaf = requestAnimationFrame(drawMatrix);
    }
    drawMatrix();

    /* Show popup after short delay */
    setTimeout(function () { matrixPopup.classList.add('show'); }, 300);

    /* Auto stop after 5s */
    setTimeout(function () {
      cancelAnimationFrame(mRaf);
      matrixCanvas.classList.remove('mc-active');
      matrixPopup.classList.remove('show');
      setTimeout(function () {
        mCtx.clearRect(0,0,matrixCanvas.width,matrixCanvas.height);
        ee3Active = false;
      }, 450);
    }, 5000);
  }

  /* ══════════════════════════════════
     RESIZE — clamp gallery scroll
     ══════════════════════════════════ */
  window.addEventListener('resize', function () {
    var ms = maxScroll();
    if (scrollY > ms) scrollY = ms;
    if (mCtx) {
      matrixCanvas.width  = window.innerWidth;
      matrixCanvas.height = window.innerHeight;
    }
  }, {passive:true});

})();
