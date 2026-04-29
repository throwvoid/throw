/* ── Particles ──────────────────────────────────── */
(function () {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }

  function randomStar() {
    return { x: Math.random() * W, y: Math.random() * H,
             r: Math.random() * 1.1 + 0.15,
             alpha: Math.random() * 0.45 + 0.08,
             speed: Math.random() * 0.12 + 0.025,
             drift: (Math.random() - 0.5) * 0.08 };
  }

  function initStars() { stars = Array.from({ length: 120 }, randomStar); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const s of stars) {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${s.alpha})`;
      ctx.fill();
      s.y -= s.speed; s.x += s.drift;
      s.alpha += (Math.random() - 0.5) * 0.008;
      s.alpha = Math.max(0.04, Math.min(0.55, s.alpha));
      if (s.y < -4) Object.assign(s, randomStar(), { y: H + 4 });
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); initStars(); });
  resize(); initStars(); draw();
})();

/* ── Music (autoplay on first interaction) ────────── */
const audio     = document.getElementById('bgMusic');
const playIcon  = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const songTitle = document.getElementById('song-title');

const src  = audio.getAttribute('src') || 'song.mp3';
const name = src.split('/').pop().replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
songTitle.textContent = name || 'Unknown Track';

let playing = false;
let autoStarted = false;

function startAudio() {
  if (autoStarted) return;
  autoStarted = true;
  audio.play().then(() => {
    playing = true;
    playIcon.style.display  = 'none';
    pauseIcon.style.display = '';
  }).catch(() => {});
}

// Trigger on ANY user interaction
['click','keydown','touchstart','scroll','mousemove'].forEach(ev => {
  document.addEventListener(ev, startAudio, { once: true, passive: true });
});

function toggleMusic() {
  if (playing) {
    audio.pause();
    playIcon.style.display  = '';
    pauseIcon.style.display = 'none';
  } else {
    audio.play().catch(() => {});
    playIcon.style.display  = 'none';
    pauseIcon.style.display = '';
  }
  playing = !playing;
  autoStarted = true;
}

/* ── Status Cycle ─────────────────────────────────── */
const statuses = [
  { key: 'online', label: 'ONLINE' },
  { key: 'idle',   label: 'IDLE'   },
  { key: 'dnd',    label: 'DND'    },
  { key: 'error',  label: 'ERROR'  },
];

let statusIdx = 0;
const badge    = document.getElementById('statusBadge');
const dot      = document.getElementById('statusDot');
const textEl   = document.getElementById('statusText');

function cycleStatus() {
  statusIdx = (statusIdx + 1) % statuses.length;
  const next = statuses[statusIdx];

  // animate text out
  textEl.classList.add('out');

  // add scan line flash
  const scan = document.createElement('span');
  scan.className = 'scan';
  badge.appendChild(scan);
  setTimeout(() => scan.remove(), 500);

  setTimeout(() => {
    // swap
    badge.dataset.status = next.key;
    textEl.textContent   = next.label;
    textEl.classList.remove('out');
    textEl.classList.add('in');

    requestAnimationFrame(() => requestAnimationFrame(() => {
      textEl.classList.remove('in');
    }));
  }, 220);
}

// Set initial state
badge.dataset.status = statuses[0].key;

// Cycle every 4 seconds
setInterval(cycleStatus, 4000);

/* ── Cursor glow ────────────────────────────────── */
const glow = document.createElement('div');
Object.assign(glow.style, {
  position: 'fixed', pointerEvents: 'none', zIndex: '5',
  width: '200px', height: '200px', borderRadius: '50%',
  background: 'radial-gradient(circle, rgba(255,255,255,0.035) 0%, transparent 70%)',
  transform: 'translate(-50%,-50%)',
  transition: 'opacity 0.4s',
  opacity: '0',
});
document.body.appendChild(glow);
document.addEventListener('mousemove', e => { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; glow.style.opacity = '1'; });
document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });

/* ── Staggered social link entrance ─────────────── */
document.querySelectorAll('.social-btn').forEach((el, i) => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(14px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease, border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease';
  setTimeout(() => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; }, 700 + i * 110);
});
