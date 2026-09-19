(() => {
  'use strict';
  const travelMap = document.querySelector('.travel-map');
  if (travelMap && 'IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    travelMap.classList.add('is-animated');
    new IntersectionObserver(entries => {
      entries.forEach(entry => travelMap.classList.toggle('is-visible', entry.isIntersecting));
    }, {threshold: 0.15}).observe(travelMap);
  }
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  // Reuse the real RSVP form so validation, saved input and submission stay in sync.
  const rsvpForm = document.getElementById('rsvpForm');
  const rsvpContent = rsvpForm.parentElement;
  const rsvpHome = document.createComment('RSVP form home');
  rsvpContent.before(rsvpHome);
  const invitationAlert = document.createElement('dialog');
  invitationAlert.className = 'invitation-alert';
  invitationAlert.setAttribute('aria-labelledby', 'invitation-alert-title');
  invitationAlert.setAttribute('aria-describedby', 'invitation-alert-description');
  invitationAlert.innerHTML = `
    <button class="invitation-alert__close" type="button" aria-label="Đóng lời mời xác nhận">×</button>
    <header class="invitation-alert__heading">
      <img class="invitation-alert__logo" src="picture/LOGO.svg" width="72" height="72" alt="">
      <p>HẢI NAM &amp; PHƯƠNG THÚY</p>
      <h2 id="invitation-alert-title">Hẹn bạn ngày chung vui</h2>
      <p id="invitation-alert-description">Bạn sẽ đến chung vui cùng chúng mình chứ?<br>Để lại lời hồi đáp để chúng mình đón tiếp bạn chu đáo nhé.</p>
    </header>
    <div class="rsvp invitation-alert__content"></div>
    <button class="invitation-alert__later" type="button">Để mình xem thiệp trước</button>`;
  document.body.append(invitationAlert);
  const closeAlert = () => invitationAlert.close();
  invitationAlert.querySelector('.invitation-alert__close').addEventListener('click', closeAlert);
  invitationAlert.querySelector('.invitation-alert__later').addEventListener('click', closeAlert);
  invitationAlert.addEventListener('close', () => {
    rsvpHome.after(rsvpContent);
    document.body.classList.remove('rsvp-alert-open');
  });
  ['wheel','touchstart','touchmove','touchend'].forEach(type => invitationAlert.addEventListener(type, event => event.stopPropagation(), {passive:true}));
  function showInvitationAlert() {
    if (!document.getElementById('rsvpDone').hidden || rsvpForm.querySelector('button[type="submit"]').disabled) return;
    const otherDialog = document.querySelector('dialog[open]');
    if (otherDialog) {
      otherDialog.addEventListener('close', showInvitationAlert, {once:true});
      return;
    }
    invitationAlert.querySelector('.invitation-alert__content').append(rsvpContent);
    document.body.classList.add('rsvp-alert-open');
    invitationAlert.showModal();
    invitationAlert.querySelector('.invitation-alert__close').focus({preventScroll:true});
  }
  document.getElementById('openBtn').addEventListener('click', () => {
    setTimeout(showInvitationAlert, 10000);
  }, {once:true});
  // A small, fixed pool of decorative flowers and butterflies follows the viewport.
  document.getElementById('openBtn').addEventListener('click', () => {
    const garden = document.createElement('div');
    garden.className = 'wedding-garden';
    garden.setAttribute('aria-hidden', 'true');
    const flower = '<svg viewBox="0 0 40 40" fill="currentColor"><g opacity=".8"><ellipse cx="20" cy="12" rx="5" ry="9"/><ellipse cx="20" cy="12" rx="5" ry="9" transform="rotate(72 20 20)"/><ellipse cx="20" cy="12" rx="5" ry="9" transform="rotate(144 20 20)"/><ellipse cx="20" cy="12" rx="5" ry="9" transform="rotate(216 20 20)"/><ellipse cx="20" cy="12" rx="5" ry="9" transform="rotate(288 20 20)"/></g><circle cx="20" cy="20" r="3" fill="#c9ac6b"/></svg>';
    const butterfly = '<svg viewBox="0 0 40 40" fill="currentColor"><g class="garden-wings"><path d="M20 20C5-3 0 8 6 20c-9 13 7 20 14 3C27 40 43 33 34 20 40 8 35-3 20 20Z" opacity=".8"/></g><path d="M20 16v12m0-11-4-6m4 6 4-6" fill="none" stroke="#b28b43" stroke-width="1.2" stroke-linecap="round"/></svg>';
    for (let i = 0; i < 16; i++) {
      const particle = document.createElement('i');
      particle.className = i % 3 === 0 ? 'garden-particle garden-particle--butterfly' : 'garden-particle';
      particle.style.cssText = `--x:${5 + (i * 37 % 90)}%;--duration:${20 + (i % 5) * 3}s;--delay:${i * 1.1}s;--drift:${i % 2 ? 45 : -45}px;--size:${18 + (i % 4) * 4}px;--turn:${i % 2 ? 140 : -120}deg;color:${i % 3 ? '#e9c9b3' : '#e5c77e'}`;
      if (i % 3 === 0) particle.style.color = '#f3a6c3';
      particle.innerHTML = i % 3 === 0 ? butterfly : flower;
      garden.append(particle);
    }
    document.body.append(garden);
    const pauseGarden = () => garden.classList.toggle('is-paused', document.hidden);
    document.addEventListener('visibilitychange', pauseGarden);
    pauseGarden();
  }, {once:true});
  const dock = document.querySelector('.wedding-dock');
  const menuToggle = document.getElementById('dockMore');
  const menu = document.getElementById('dockMenu');
  document.getElementById('dockMusicSlot').prepend(document.getElementById('musicWidget'));
  function closeMenu(returnFocus = false) {
    menu.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) menuToggle.focus();
  }
  menuToggle.addEventListener('click', () => {
    const open = menu.hidden;
    menu.hidden = !open; menuToggle.setAttribute('aria-expanded', String(open));
    document.getElementById('musicPanel').hidden = true;
    document.getElementById('musicSettings').setAttribute('aria-expanded', 'false');
  });
  document.getElementById('musicSettings').addEventListener('click', () => closeMenu());
  dock.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    closeMenu();
    const target = link.hash ? document.querySelector(link.hash) : null;
    if (target) {target.setAttribute('tabindex', '-1'); target.focus({preventScroll:true});}
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) closeMenu(true);
  });
  document.addEventListener('pointerdown', event => {if (!dock.contains(event.target)) closeMenu();});
  dock.addEventListener('focusout', event => {if (event.relatedTarget && !dock.contains(event.relatedTarget)) closeMenu();});
  ['wheel','touchstart','touchmove','touchend'].forEach(type => dock.addEventListener(type, event => event.stopPropagation(), {passive:true}));
  const navLinks = [...dock.querySelectorAll('a')];
  let navFrame = 0;
  function updateNav() {
    const marker = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + innerHeight * .2;
    let currentId = '';
    document.querySelectorAll('#main > [id]').forEach(section => {
      if (section.getBoundingClientRect().top <= marker) currentId = section.id;
    });
    navLinks.forEach(link => {
      if (link.hash === '#' + currentId) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    navFrame = 0;
  }
  addEventListener('scroll', () => {if (!navFrame) navFrame = requestAnimationFrame(updateNav);}, {passive:true});
  addEventListener('resize', updateNav); updateNav();
  const footer = document.querySelector('.foot');
  let spotFrame = 0, spotX = 0, spotY = 0;
  footer.addEventListener('pointermove', event => {
    const bounds = footer.getBoundingClientRect();
    spotX = event.clientX - bounds.left; spotY = event.clientY - bounds.top;
    footer.classList.add('is-spotlit');
    if (!spotFrame) spotFrame = requestAnimationFrame(() => {
      footer.style.setProperty('--spot-x', `${spotX}px`);
      footer.style.setProperty('--spot-y', `${spotY}px`);
      spotFrame = 0;
    });
  }, {passive:true});
  ['pointerleave','pointercancel'].forEach(type => footer.addEventListener(type, () => footer.classList.remove('is-spotlit')));
  footer.addEventListener('pointerup', event => {if (event.pointerType !== 'mouse') footer.classList.remove('is-spotlit');});
  const heroTitle = document.querySelector('.hero__title');
  const portraits = document.createElement('div');
  portraits.className = 'hero__portraits hero__portraits--couple';
  const portrait = document.createElement('figure');
  portrait.className = 'hero__portrait hero__portrait--couple';
  portrait.innerHTML = '<button type="button" aria-label="Xem lớn ảnh cưới"><img src="wedding-couple.jpg" alt="Ảnh cưới của cô dâu và chú rể" width="1536" height="1024" fetchpriority="high"></button>';
  portraits.append(portrait);
  heroTitle.after(portraits);
  portraits.before(document.querySelector('.hero__logo'));
  const intro = document.querySelector('.intro');
  intro.id = 'loi-moi';
  const cue = document.createElement('a');
  cue.className = 'hero__scroll'; cue.href = '#loi-moi';
  cue.innerHTML = 'CÙNG ĐỌC LỜI MỜI<span aria-hidden="true">↓</span>';
  document.querySelector('.hero .wrap').append(cue);
  document.getElementById('openBtn').addEventListener('click', () => {
    document.body.classList.add('invitation-enter');
    setTimeout(() => document.body.classList.remove('invitation-enter'), 8000);
    if (reduced.matches) return;
    const sparks = document.createElement('div');
    sparks.className = 'opening-sparks'; sparks.setAttribute('aria-hidden', 'true');
    for (let i = 0; i < 22; i++) {
      const spark = document.createElement('i');
      spark.style.cssText = `--x:${15 + Math.random() * 70}%;--delay:${Math.random() * .6}s;--drift:${Math.random() * 150 - 75}px`;
      sparks.append(spark);
    }
    document.body.append(sparks); setTimeout(() => sparks.remove(), 3200);
  }, {once:true});

  const chapters = [...document.querySelectorAll('.chapter')];
  chapters.forEach(chapter => {
    const caption = chapter.querySelector('figcaption');
    if (caption) caption.textContent = chapter.querySelector('.chapter__year small').textContent;
    chapter.querySelectorAll('.chapter__photo img').forEach(photo => {
      // Keep a clean named placeholder until the couple supplies each image.
      photo.addEventListener('error', () => {photo.hidden = true;});
      photo.addEventListener('load', () => {photo.hidden = false;});
      if (photo.complete && !photo.naturalWidth) photo.hidden = true;
    });
  });
  const qr = document.querySelector('.gift__qr img');
  qr.addEventListener('error', () => {qr.hidden = true;});
  if (qr.complete && !qr.naturalWidth) qr.hidden = true;
  const story = document.querySelector('.story__list');
  const connector = document.createElementNS('http://www.w3.org/2000/svg','svg');
  connector.classList.add('story-connector');connector.setAttribute('aria-hidden','true');
  const route = document.createElementNS('http://www.w3.org/2000/svg','polyline');
  connector.append(route);story.prepend(connector);
  function drawJourney() {
    const bounds = story.getBoundingClientRect();
    connector.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    route.setAttribute('points', chapters.map(chapter => {
      const marker = chapter.querySelector('.chapter__year').getBoundingClientRect();
      return `${marker.left + marker.width / 2 - bounds.left},${marker.top + marker.height / 2 - bounds.top}`;
    }).join(' '));
  }
  new ResizeObserver(drawJourney).observe(story);
  document.fonts.ready.then(drawJourney);
  let scheduled = false;
  function updateStory() {
    const rect = story.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, (innerHeight * .65 - rect.top) / rect.height));
    story.style.setProperty('--story-progress', `${progress * 100}%`);
    scheduled = false;
  }
  addEventListener('scroll', () => {if (!scheduled) {scheduled = true; requestAnimationFrame(updateStory);}}, {passive:true});
  addEventListener('resize', updateStory); updateStory();

  const captions = ['Chân dung Hải Nam', 'Một mùa hoa, một lời hẹn', 'Phương Thúy — một chút dịu dàng', 'Ngày mình chung đôi', 'Cùng đi qua những mùa thương', 'Một chút dịu dàng', 'Mái nhà của chúng mình', 'Giữ lại từng kỷ niệm', 'Những ngày bình yên', 'Ánh sáng của nhau', 'Thương nhau dài lâu', 'Hẹn bạn ngày chung vui'];
  const photos = [];
  document.querySelectorAll('.plate').forEach((plate, index) => {
    plate.querySelector('figcaption').textContent = captions[index] || 'Kỷ niệm của chúng mình';
    const img = plate.querySelector('img');
    if (!img) return;
    img.alt = img.alt || captions[index]; img.loading = 'lazy';
    const position = photos.length;
    photos.push({src:img.getAttribute('src'), alt:img.alt, caption:captions[index]});
    const button = document.createElement('button'); button.type = 'button'; button.className = 'album-open';
    button.setAttribute('aria-label', `Xem lớn: ${captions[index]}`); button.innerHTML = '<span aria-hidden="true">↗</span>';
    button.addEventListener('click', () => showPhoto(position)); plate.append(button);
  });
  document.querySelector('.album__note').textContent = 'Chạm vào ảnh để xem lớn. Những khung minh họa đang chờ thêm kỷ niệm của chúng mình.';
  const dialog = document.createElement('dialog'); dialog.className = 'photo-viewer';
  dialog.setAttribute('aria-label', 'Album ảnh');
  dialog.innerHTML = '<button type="button" class="photo-close" aria-label="Đóng ảnh">×</button><button type="button" class="photo-prev" aria-label="Ảnh trước">‹</button><img alt=""><p></p><button type="button" class="photo-next" aria-label="Ảnh tiếp theo">›</button>';
  document.body.append(dialog);
  let current = 0, origin, startX;
  function renderPhoto() {
    const photo = photos[current]; const img = dialog.querySelector('img');
    img.src = photo.src; img.alt = photo.alt; dialog.querySelector('p').textContent = photo.caption;
    dialog.querySelectorAll('.photo-prev,.photo-next').forEach(button => {button.hidden = photos.length < 2;});
  }
  function showPhoto(index) {
    current = index; origin = document.activeElement; renderPhoto();
    document.body.classList.add('photo-viewing'); dialog.showModal(); dialog.querySelector('.photo-close').focus();
  }
  function step(direction) {current = (current + direction + photos.length) % photos.length; renderPhoto();}
  const couplePhotoIndex = photos.length;
  photos.push({src:'wedding-couple.jpg', alt:'Ảnh cưới của cô dâu và chú rể', caption:'Hải Nam & Phương Thúy'});
  portrait.querySelector('button').addEventListener('click', () => showPhoto(couplePhotoIndex));
  dialog.querySelector('.photo-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('.photo-prev').addEventListener('click', () => step(-1));
  dialog.querySelector('.photo-next').addEventListener('click', () => step(1));
  dialog.addEventListener('close', () => {document.body.classList.remove('photo-viewing'); if (origin) origin.focus({preventScroll:true});});
  dialog.addEventListener('click', event => {if (event.target === dialog) dialog.close();});
  dialog.addEventListener('keydown', event => {if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {event.preventDefault();step(event.key === 'ArrowRight' ? 1 : -1);}});
  dialog.addEventListener('touchstart', event => {startX = event.touches.length === 1 ? event.touches[0].clientX : null;}, {passive:true});
  dialog.addEventListener('touchend', event => {if (startX !== null && event.changedTouches.length) {const dx = event.changedTouches[0].clientX - startX;if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);}startX = null;}, {passive:true});
  // The underlying page has custom wheel/touch navigation; keep it out of the viewer.
  ['wheel','touchstart','touchmove','touchend'].forEach(type => dialog.addEventListener(type, event => event.stopPropagation(), {passive:true}));
  const audio = document.getElementById('weddingAudio'), launch = document.getElementById('musicLaunch');
  function syncRecord() {launch.classList.toggle('is-playing', !audio.paused);}
  audio.addEventListener('play', syncRecord); audio.addEventListener('pause', syncRecord); syncRecord();
  // Observe individual blocks so long sections animate throughout their length.
  const motionTargets = [...document.querySelectorAll('.hero__date-top,.hero__title,.hero__portrait,.hero__grid,.hero__when,.hero__where,.count,.hero__scroll,.intro .rule,.intro p,.intro__quote,.intro__seal,.intro__journey,.sec-head,.chapter,.event,.venue > *,.map,.plate,.album__note,.notes .note,.rsvp__box,.rsvp .legend,.rsvp .field,.rsvp .seg,.rsvp__foot,.foot .wrap--narrow > *')];
  motionTargets.forEach((el, index) => {
    const type = el.matches('.map,.hero__portrait,.plate,.rsvp__box') ? 'zoom'
      : el.matches('.chapter,.event,.note') ? (index % 2 ? 'left' : 'right') : 'rise';
    el.dataset.motion = type;
  });
  // Pause decorative loops whenever their section leaves the viewport.
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => entry.target.classList.toggle('section-active', entry.isIntersecting));
    });
    document.querySelectorAll('#main > header,#main > section,#main > footer').forEach(el => sectionObserver.observe(el));
  }
  let motionObserver;
  function configureMotion() {
    if (motionObserver) motionObserver.disconnect();
    motionTargets.forEach(el => el.classList.remove('motion-ready','motion-visible'));
    if (reduced.matches || !('IntersectionObserver' in window)) return;
    motionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('motion-visible');
        else if (entry.boundingClientRect.bottom <= 0 || entry.boundingClientRect.top >= innerHeight) entry.target.classList.remove('motion-visible');
      });
    }, {threshold:0,rootMargin:'0px 0px -32px 0px'});
    motionTargets.forEach((el,index) => {
      // Replace the earlier one-time chapter reveal with this repeatable system.
      el.classList.remove('fade-ready');
      el.style.setProperty('--motion-delay', `${el.matches('.plate,.event,.note') ? index % 3 * 70 : 0}ms`);
      el.classList.add('motion-ready'); motionObserver.observe(el);
    });
  }
  configureMotion(); reduced.addEventListener('change',configureMotion);
})();
