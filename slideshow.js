(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const audio = $('slideshowAudio'), musicButton = $('slideshowMusic');
  const songs = [{src:'music-open.mp3',name:'Music Open'},{src:'enchanted.mp3',name:'Enchanted — Joseph William Morgan'}];
  let songIndex = 0;
  audio.volume = .55;
  function syncMusic() {
    musicButton.textContent = audio.paused ? '♫ Phát nhạc' : 'Ⅱ Tạm dừng nhạc';
    musicButton.setAttribute('aria-label', audio.paused ? 'Phát nhạc slideshow' : 'Tạm dừng nhạc slideshow');
  }
  function startMusic() {audio.play().catch(() => {$('slideshowTrack').textContent = 'Chạm Phát nhạc để nghe cùng album';syncMusic();});}
  musicButton.addEventListener('click', () => {if (audio.paused) startMusic(); else audio.pause();});
  audio.addEventListener('play', () => {$('slideshowTrack').textContent = `${songs[songIndex].name} · ${songIndex + 1} / 2`;syncMusic();});
  audio.addEventListener('pause',syncMusic);
  audio.addEventListener('ended', () => {songIndex=(songIndex+1)%songs.length;audio.src=songs[songIndex].src;startMusic();});
  audio.addEventListener('error', () => {$('slideshowTrack').textContent='Chưa tải được nhạc. Bạn thử tải lại trang nhé.';});
  startMusic();
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let slides = window.WEDDING_SLIDES.slice(0, 10);
  let current = 0, playing = !reduced.matches, timer = 0, settleTimer = 0, moving = false, urls = [];
  const track = $('track'), filmstrip = $('filmstrip');
  const pad = n => String(n).padStart(2, '0');
  function placeholder(index) {
    const node = document.createElement('div'); node.className = 'placeholder';
    const heart = document.createElement('span'); heart.className = 'placeholder__heart'; heart.textContent = '♡'; heart.setAttribute('aria-hidden', 'true');
    const name = document.createElement('strong'); name.textContent = 'Dành cho khoảnh khắc của mình';
    const label = document.createElement('small'); label.textContent = `KHUNG ẢNH ${pad(index + 1)} · CHỜ ẢNH CƯỚI`;
    node.append(heart, name, label); return node;
  }
  function makeSlide(slide, index, clone = false) {
    const article = document.createElement('div'); article.className = 'slide'; article.setAttribute('role', 'group'); article.setAttribute('aria-roledescription', 'ảnh'); article.setAttribute('aria-label', `${index + 1} / ${slides.length}: ${slide.caption}`);
    if (clone) article.dataset.clone = 'true';
    const figure = document.createElement('figure'); figure.className = 'note-frame';
    const photo = document.createElement('div'); photo.className = 'photo';
    if (slide.src) {
      const img = new Image(); img.alt = slide.note || slide.caption; img.src = slide.src; img.decoding = 'async';
      img.addEventListener('error', () => {photo.replaceChildren(placeholder(index));}); photo.append(img);
    } else photo.append(placeholder(index));
    const caption = document.createElement('figcaption'), title = document.createElement('span'), note = document.createElement('span'), number = document.createElement('span');
    title.className = 'caption'; title.textContent = slide.caption;
    note.className = 'caption-note'; note.textContent = slide.note || 'Hải Nam & Phương Thúy · 25.03.2027'; title.append(note);
    number.className = 'frame-number'; number.textContent = pad(index + 1); caption.append(title, number); figure.append(photo, caption); article.append(figure); return article;
  }
  function schedule() {
    clearTimeout(timer); $('progress').classList.remove('running');
    $('play').innerHTML = playing ? 'Ⅱ <span>Tạm dừng</span>' : '▶ <span>Tiếp tục</span>';
    $('play').setAttribute('aria-label', playing ? 'Tạm dừng slideshow' : 'Phát slideshow');
    if (!playing || document.hidden || slides.length < 2) return;
    void $('progress').offsetWidth;
    $('progress').classList.add('running');
    timer = setTimeout(() => go(current + 1), 3000);
  }
  function sync(manual = false) {
    $('current').textContent = pad(current + 1); $('total').textContent = pad(slides.length);
    const next = (current + 1) % slides.length;
    $('next-label').textContent = `Tiếp theo · ${pad(next + 1)}`;
    [...filmstrip.children].forEach((thumb, index) => {
      thumb.setAttribute('aria-current', String(index === current)); thumb.classList.toggle('is-next', index === next && slides.length > 1);
      thumb.querySelector('small').textContent = `${pad(index + 1)}${index === next && slides.length > 1 ? ' · TIẾP' : ''}`;
      thumb.setAttribute('aria-label', `Xem ảnh ${index + 1}: ${slides[index].caption}${index === next ? ', ảnh tiếp theo' : ''}`);
    });
    [...track.children].forEach((slide, index) => slide.setAttribute('aria-hidden', String(index !== current + 1)));
    const thumb = filmstrip.children[next];
    if (thumb) filmstrip.scrollTo({left:Math.max(0, thumb.offsetLeft - filmstrip.offsetLeft - filmstrip.clientWidth / 2 + thumb.clientWidth / 2), behavior:reduced.matches ? 'instant' : 'smooth'});
    if (manual) $('announcement').textContent = `Ảnh ${current + 1} trên ${slides.length}: ${slides[current].caption}`;
  }
  function settle() {
    clearTimeout(settleTimer); track.classList.add('no-transition'); track.style.transform = `translateX(-${(current + 1) * 100}%)`; moving = false;
  }
  function go(target, manual = false) {
    if (moving || slides.length < 2) return;
    const physical = target < 0 ? 0 : target >= slides.length ? slides.length + 1 : target + 1;
    current = (target + slides.length) % slides.length;
    track.classList.add('no-transition'); void track.offsetWidth; track.classList.remove('no-transition');
    track.style.transform = `translateX(-${physical * 100}%)`; moving = true; sync(manual); schedule();
    if (reduced.matches) settle(); else settleTimer = setTimeout(settle, 700);
  }
  track.addEventListener('transitionend', event => {if (event.target === track && event.propertyName === 'transform') settle();});
  function build() {
    clearTimeout(settleTimer); current = 0; moving = false;
    track.replaceChildren(makeSlide(slides.at(-1), slides.length - 1, true), ...slides.map((slide, index) => makeSlide(slide, index)), makeSlide(slides[0], 0, true));
    filmstrip.replaceChildren();
    slides.forEach((slide, index) => {
      const thumb = document.createElement('button'); thumb.type = 'button'; thumb.className = 'thumb';
      const image = document.createElement('span'); image.className = 'thumb__image';
      if (slide.src) {const img = new Image(); img.alt = ''; img.src = slide.src; img.addEventListener('error', () => {image.textContent = '♡';}); image.append(img);} else image.textContent = '♡';
      const label = document.createElement('small'); thumb.append(image, label); thumb.addEventListener('click', () => {if (index === current) schedule(); else go(index, true);}); filmstrip.append(thumb);
    });
    ['prev','next','play'].forEach(id => {$(id).disabled = slides.length < 2;});
    settle(); sync(); schedule();
  }
  $('prev').addEventListener('click', () => go(current - 1, true));
  $('next').addEventListener('click', () => go(current + 1, true));
  $('play').addEventListener('click', () => {playing = !playing; schedule();});
  document.addEventListener('visibilitychange', schedule);
  reduced.addEventListener('change', () => {if (reduced.matches) {playing = false; settle(); schedule();}});
  document.addEventListener('keydown', event => {
    if (event.target.closest('button,a,input') || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key === 'ArrowRight') {event.preventDefault(); go(current + 1, true);}
    if (event.key === 'ArrowLeft') {event.preventDefault(); go(current - 1, true);}
    if (event.code === 'Space') {event.preventDefault(); playing = !playing; schedule();}
  });
  let touch = null;
  $('viewport').addEventListener('pointerdown', event => {if (event.pointerType === 'touch') touch = {x:event.clientX,y:event.clientY};});
  $('viewport').addEventListener('pointerup', event => {if (!touch) return; const dx = event.clientX - touch.x, dy = event.clientY - touch.y; touch = null; if (Math.abs(dx) > 35 && Math.abs(dx) > Math.abs(dy)) go(current + (dx < 0 ? 1 : -1), true);});
  $('viewport').addEventListener('pointercancel', () => {touch = null;});
  $('fullscreen').hidden = !document.fullscreenEnabled;
  $('fullscreen').addEventListener('click', async () => {
    try {if (document.fullscreenElement) await document.exitFullscreen(); else await document.body.requestFullscreen();}
    catch { $('picker-status').textContent = 'Trình duyệt chưa cho phép toàn màn hình.'; }
  });
  document.addEventListener('fullscreenchange', () => {$('fullscreen').innerHTML = document.fullscreenElement ? 'Thu nhỏ <span aria-hidden="true">⛶</span>' : 'Toàn màn hình <span aria-hidden="true">⛶</span>';});
  $('photos').addEventListener('change', async event => {
    const chosen = [...event.target.files]; if (!chosen.length) return;
    clearTimeout(timer); $('progress').classList.remove('running');
    const supported = chosen.filter(file => /^image\/(jpeg|png|webp|avif)$/.test(file.type)).slice(0, 10);
    $('picker-status').textContent = 'Đang chuẩn bị ảnh…';
    const loaded = await Promise.all(supported.map(async file => {
      const src = URL.createObjectURL(file), img = new Image(); img.src = src;
      try {await img.decode(); return {src, caption:file.name.replace(/\.[^.]+$/, '').replace(/[_-]+/g, ' '), note:'Hải Nam & Phương Thúy · 25.03.2027'};}
      catch {URL.revokeObjectURL(src); return null;}
    }));
    const valid = loaded.filter(Boolean);
    if (valid.length) {
      urls.forEach(URL.revokeObjectURL); urls = valid.map(photo => photo.src); slides = valid;
      playing = !reduced.matches; build();
      $('photo-help').textContent = 'Ảnh được trình chiếu trực tiếp từ máy, không tải lên mạng. Tải lại trang sẽ trở về album mặc định.';
      $('picker-status').textContent = `Đã sẵn sàng ${valid.length} ảnh.${chosen.length > valid.length ? ' Chỉ nhận tối đa 10 ảnh JPG, PNG, WebP hoặc AVIF đọc được.' : ''}`;
    } else { $('picker-status').textContent = 'Chưa đọc được ảnh. Hãy chọn ảnh JPG, PNG, WebP hoặc AVIF.'; schedule(); }
    event.target.value = '';
  });
  addEventListener('pagehide', () => clearTimeout(timer));
  addEventListener('pageshow', schedule);
  build();
})();
