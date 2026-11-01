/* صدای وارونه: ظاهر صفحه (فونت و استایل) در همین فایل ساخته می‌شود و HTML فقط ساختار را دارد. */
(() => {
  'use strict';

  const FONT_URL = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@500&family=Vazirmatn:wght@400;500;700;800&display=swap';
  const CSS = `
/* Layout: one column shaped like a tape deck. A waveform display on top, a rotating reel
   with the record button as its hub, then the two playback buttons. The reel turns clockwise
   while recording or playing normally and counter-clockwise while playing in reverse. */
:root {
  --bg: #E9EDF5;
  --surface: #FFFFFF;
  --ink: #17213A;
  --muted: #58647E;
  --line: #D3DAE8;
  --wave: #A3AEC6;
  --rev: #0B7A84;
  --rev-ink: #FFFFFF;
  --rec: #D93A45;
  --font-ui: "Vazirmatn", Tahoma, "Segoe UI", system-ui, sans-serif;
  --font-mono: "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace;
  color-scheme: light;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0E141C;
    --surface: #161E29;
    --ink: #E7EDF5;
    --muted: #97A3B8;
    --line: #2A3647;
    --wave: #566680;
    --rev: #2BB5C0;
    --rev-ink: #06222A;
    --rec: #F0555E;
    color-scheme: dark;
  }
}

* { box-sizing: border-box; }
[hidden] { display: none !important; }
html, body { margin: 0; }
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-ui);
  font-size: 16px;
  line-height: 1.7;
  min-height: 100vh;
  min-height: 100dvh;
  padding-top: max(24px, env(safe-area-inset-top, 0px));
  padding-bottom: max(24px, env(safe-area-inset-bottom, 0px));
  padding-left: max(16px, env(safe-area-inset-left, 0px));
  padding-right: max(16px, env(safe-area-inset-right, 0px));
  display: flex;
  justify-content: center;
  align-items: flex-start;
}
.app {
  width: 100%;
  max-width: 440px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
h1 { margin: 0; font-size: 32px; font-weight: 800; line-height: 1.4; text-wrap: balance; }
.sub { margin: 2px 0 0; color: var(--muted); font-size: 15px; }

/* Display */
.display {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 14px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.meta { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.status { display: inline-flex; align-items: center; gap: 8px; font-size: 14px; font-weight: 500; color: var(--muted); min-width: 0; }
.dot { width: 9px; height: 9px; border-radius: 50%; background: var(--line); flex: none; }
[data-state="recording"] .dot { background: var(--rec); animation: blink 1s ease-in-out infinite; }
[data-state="fwd"] .dot, [data-state="rev"] .dot { background: var(--rev); }
.counter {
  direction: ltr;
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 15px;
  font-variant-numeric: tabular-nums;
}
.total { color: var(--muted); font-size: 13px; }
canvas { display: block; width: 100%; height: 120px; direction: ltr; }

/* Controls */
.controls { display: flex; flex-direction: column; align-items: stretch; gap: 14px; }
.deck { position: relative; width: 176px; height: 176px; margin: 4px auto 0; }
.reel { position: absolute; inset: 0; width: 100%; height: 100%; will-change: transform; }
.rec {
  position: absolute;
  inset: 0;
  margin: auto;
  width: 84px;
  height: 84px;
  border: 0;
  border-radius: 50%;
  background: var(--rec);
  color: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;
  transition: transform .15s ease;
}
.rec:active { transform: scale(.95); }
.rec:disabled { opacity: .5; cursor: progress; }
.rec svg { width: 34px; height: 34px; }
.rec.is-rec { animation: pulse 1.4s ease-out infinite; }
.rec-label { margin: 0; text-align: center; font-weight: 700; font-size: 15px; }

.row { display: grid; grid-template-columns: 1.35fr 1fr; gap: 12px; }
.btn {
  height: 58px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  font-family: var(--font-ui);
  font-size: 16px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  transition: transform .15s ease, background-color .15s ease;
}
.btn svg { width: 22px; height: 22px; flex: none; }
.btn:active:not(:disabled) { transform: scale(.97); }
.btn.primary { background: var(--rev); color: var(--rev-ink); border-color: transparent; }
.btn.on:not(.primary) { border-color: var(--rev); color: var(--rev); }
.btn.primary.on { box-shadow: 0 0 0 4px color-mix(in srgb, var(--rev) 28%, transparent); }
.btn:disabled { opacity: .4; cursor: not-allowed; }
.row.even { grid-template-columns: 1fr 1fr; }
.btn.sm { height: 50px; font-size: 15px; gap: 8px; }
.btn.sm svg { width: 20px; height: 20px; }

.notice {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  border: 1px solid var(--rec);
  background: var(--surface);
  font-size: 14px;
  line-height: 1.9;
}
.aux { display: flex; justify-content: center; }
.link {
  background: none;
  border: 0;
  padding: 8px 12px;
  color: var(--rev);
  font-family: var(--font-ui);
  font-size: 15px;
  font-weight: 500;
  text-decoration: underline;
  text-underline-offset: 5px;
  cursor: pointer;
}
.link:disabled { opacity: .4; cursor: not-allowed; }
.foot { margin: 0; text-align: center; color: var(--muted); font-size: 13px; line-height: 1.9; }

button:focus-visible { outline: 3px solid var(--rev); outline-offset: 3px; }

@keyframes blink { 50% { opacity: .35; } }
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--rec) 50%, transparent); }
  100% { box-shadow: 0 0 0 20px transparent; }
}
@media (prefers-reduced-motion: reduce) {
  .rec.is-rec, [data-state="recording"] .dot { animation: none; }
  .rec.is-rec { box-shadow: 0 0 0 8px color-mix(in srgb, var(--rec) 35%, transparent); }
}
`;

  const font = document.createElement('link');
  font.rel = 'stylesheet';
  font.href = FONT_URL;
  document.head.appendChild(font);

  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.appendChild(style);

  const initApp = () => {
  'use strict';

  const $ = (id) => document.getElementById(id);
  const el = {
    status: $('status'), pos: $('pos'), total: $('total'), cv: $('wave'), reel: $('reel'),
    rec: $('rec'), recLabel: $('recLabel'), icMic: $('icMic'), icStop: $('icStop'),
    rev: $('revBtn'), revPlay: $('revPlay'), revStop: $('revStop'), revText: $('revText'),
    fwd: $('fwdBtn'), fwdPlay: $('fwdPlay'), fwdStop: $('fwdStop'), fwdText: $('fwdText'),
    dlOrig: $('dlOrig'), dlRev: $('dlRev'),
    notice: $('notice'), pick: $('pick'), file: $('file')
  };

  const MAX_SEC = 180;
  const MIN_SEC = 0.3;
  const BAR = 3, GAP = 3, STEP = BAR + GAP;

  const STATUS = {
    idle: 'آماده‌ی ضبط',
    recording: 'در حال ضبط…',
    busy: 'در حال آماده‌سازی…',
    ready: 'صدا آماده است',
    fwd: 'پخش عادی',
    rev: 'پخش وارونه'
  };
  const MSG = {
    denied: 'اجازه‌ی استفاده از میکروفون داده نشد. دسترسی را در تنظیمات مرورگر فعال کن و دوباره امتحان کن.',
    nomic: 'میکروفونی پیدا نشد. یک میکروفون وصل کن یا یک فایل صوتی انتخاب کن.',
    unsupported: 'این محیط اجازه‌ی ضبط نمی‌دهد. صفحه را مستقیم در Chrome، Edge، Firefox یا Safari باز کن، یا یک فایل صوتی انتخاب کن.',
    short: 'صدا خیلی کوتاه بود. دوباره امتحان کن.',
    decode: 'این فایل خوانده نشد. فرمت‌هایی مثل MP3، WAV، M4A و OGG را امتحان کن.'
  };

  let ctx = null, stream = null, micSrc = null, analyser = null, tbuf = null;
  let recorder = null, chunks = [];
  let original = null, reversed = null, peaks = null, stampStr = '';
  let state = 'idle';
  let playNode = null, playBuf = null, playStart = 0, playToken = 0;
  let recStart = 0, liveBars = [], liveMax = 0, lastPush = 0;
  let raf = 0, lastT = 0, angle = 0, speed = 0;
  let colors = {};
  let cssW = 0, cssH = 0, dpr = 1;

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  const g = el.cv.getContext('2d');

  /* ---------- helpers ---------- */
  const show = (node, on) => node.toggleAttribute('hidden', !on);

  function fmt(t) {
    t = Math.max(0, t);
    const m = Math.floor(t / 60), s = Math.floor(t % 60), d = Math.floor((t * 10) % 10);
    return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0') + '.' + d;
  }

  function readColors() {
    const s = getComputedStyle(document.documentElement);
    const v = (n) => s.getPropertyValue(n).trim();
    colors = { wave: v('--wave'), line: v('--line'), rec: v('--rec'), rev: v('--rev'), ink: v('--ink') };
  }

  function ensureCtx() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
    }
    return ctx;
  }

  function pickMime() {
    if (!window.MediaRecorder || !MediaRecorder.isTypeSupported) return '';
    const list = ['audio/webm;codecs=opus', 'audio/mp4', 'audio/ogg;codecs=opus', 'audio/webm'];
    for (const m of list) { if (MediaRecorder.isTypeSupported(m)) return m; }
    return '';
  }

  function notice(key) { el.notice.textContent = MSG[key]; el.notice.hidden = false; }
  function clearNotice() { el.notice.hidden = true; el.notice.textContent = ''; }

  /* ---------- audio ---------- */
  function decode(ab) {
    return new Promise((resolve, reject) => {
      const p = ctx.decodeAudioData(ab, resolve, reject);
      if (p && p.catch) p.catch(reject);
    });
  }

  // Copies every channel and flips it end to start.
  function makeReversed(buf) {
    const out = ctx.createBuffer(buf.numberOfChannels, buf.length, buf.sampleRate);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const dst = out.getChannelData(c);
      dst.set(buf.getChannelData(c));
      dst.reverse();
    }
    return out;
  }

  function computePeaks(buf, n) {
    const len = buf.length, out = new Float32Array(n);
    for (let c = 0; c < buf.numberOfChannels; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < n; i++) {
        const s = Math.floor(i * len / n), e = Math.max(s + 1, Math.floor((i + 1) * len / n));
        const stride = Math.max(1, Math.floor((e - s) / 64));
        let m = 0;
        for (let j = s; j < e; j += stride) { const v = Math.abs(d[j]); if (v > m) m = v; }
        if (m > out[i]) out[i] = m;
      }
    }
    let max = 0;
    for (let i = 0; i < n; i++) if (out[i] > max) max = out[i];
    if (max > 0) for (let i = 0; i < n; i++) out[i] = Math.pow(out[i] / max, 0.8);
    return out;
  }

  async function loadBlob(blob) {
    setState('busy');
    try {
      const ab = await blob.arrayBuffer();
      const buf = await decode(ab);
      if (buf.duration < MIN_SEC) {
        notice('short');
        setState(original ? 'ready' : 'idle');
        return;
      }
      original = buf;
      reversed = makeReversed(buf);
      stampStr = makeStamp();
      peaks = null;
      setState('ready');
    } catch (e) {
      notice('decode');
      setState(original ? 'ready' : 'idle');
    }
  }

  /* ---------- download (WAV, 16-bit) ---------- */
  function encodeWav(buf) {
    const ch = buf.numberOfChannels, rate = buf.sampleRate, n = buf.length;
    const bytes = n * ch * 2;
    const ab = new ArrayBuffer(44 + bytes);
    const v = new DataView(ab);
    const str = (o, s) => { for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    str(0, 'RIFF'); v.setUint32(4, 36 + bytes, true); str(8, 'WAVE');
    str(12, 'fmt '); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, ch, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * ch * 2, true);
    v.setUint16(32, ch * 2, true); v.setUint16(34, 16, true);
    str(36, 'data'); v.setUint32(40, bytes, true);
    const data = [];
    for (let c = 0; c < ch; c++) data.push(buf.getChannelData(c));
    let o = 44;
    for (let i = 0; i < n; i++) {
      for (let c = 0; c < ch; c++) {
        const s = Math.max(-1, Math.min(1, data[c][i]));
        v.setInt16(o, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        o += 2;
      }
    }
    return new Blob([ab], { type: 'audio/wav' });
  }

  function makeStamp() {
    const d = new Date(), p = (x) => String(x).padStart(2, '0');
    return d.getFullYear() + p(d.getMonth() + 1) + p(d.getDate()) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
  }

  function saveWav(buf, prefix) {
    if (!buf) return;
    const url = URL.createObjectURL(encodeWav(buf));
    const a = document.createElement('a');
    a.href = url;
    a.download = prefix + '-' + stampStr + '.wav';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  }

  /* ---------- recording ---------- */
  function cleanupMic() {
    if (stream) { stream.getTracks().forEach((t) => t.stop()); stream = null; }
    if (micSrc) { try { micSrc.disconnect(); } catch (e) {} micSrc = null; }
    analyser = null;
  }

  async function startRecording() {
    stopPlayback(true);
    clearNotice();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || typeof MediaRecorder === 'undefined') {
      notice('unsupported');
      return;
    }
    ensureCtx();
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      notice(e && e.name === 'NotFoundError' ? 'nomic' : (e && e.name === 'NotAllowedError' ? 'denied' : 'unsupported'));
      return;
    }
    try { await ctx.resume(); } catch (e) {}
    micSrc = ctx.createMediaStreamSource(stream);
    analyser = ctx.createAnalyser();
    analyser.fftSize = 1024;
    tbuf = new Uint8Array(analyser.fftSize);
    micSrc.connect(analyser); // not routed to the speakers, so no feedback

    const mime = pickMime();
    try {
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    } catch (e) {
      cleanupMic();
      notice('unsupported');
      return;
    }
    chunks = [];
    liveBars = [];
    liveMax = 0;
    lastPush = 0;
    recorder.ondataavailable = (e) => { if (e.data && e.data.size) chunks.push(e.data); };
    recorder.onstop = async () => {
      const type = (recorder && recorder.mimeType) || 'audio/webm';
      cleanupMic();
      const blob = new Blob(chunks, { type });
      chunks = [];
      await loadBlob(blob);
    };
    recorder.start(200);
    recStart = performance.now();
    setState('recording');
  }

  function stopRecording() {
    if (state !== 'recording') return;
    setState('busy');
    try { recorder.stop(); } catch (e) { cleanupMic(); setState(original ? 'ready' : 'idle'); }
  }

  /* ---------- playback ---------- */
  async function play(mode) {
    if (!original) return;
    if (state === mode) { stopPlayback(); return; }
    stopPlayback(true);
    try { await ctx.resume(); } catch (e) {}
    const buf = mode === 'rev' ? reversed : original;
    const node = ctx.createBufferSource();
    node.buffer = buf;
    node.connect(ctx.destination);
    const token = ++playToken;
    node.onended = () => {
      if (token === playToken) { playNode = null; setState('ready'); }
    };
    playNode = node;
    playBuf = buf;
    playStart = ctx.currentTime;
    node.start();
    setState(mode);
  }

  function stopPlayback(silent) {
    if (playNode) {
      const n = playNode;
      playToken++;
      playNode = null;
      n.onended = null;
      try { n.stop(); } catch (e) {}
      try { n.disconnect(); } catch (e) {}
    }
    if (!silent && (state === 'fwd' || state === 'rev')) setState('ready');
  }

  /* ---------- drawing ---------- */
  function resize() {
    dpr = window.devicePixelRatio || 1;
    const r = el.cv.getBoundingClientRect();
    cssW = r.width;
    cssH = r.height;
    el.cv.width = Math.round(cssW * dpr);
    el.cv.height = Math.round(cssH * dpr);
    peaks = null;
    draw();
  }

  const barCount = () => Math.max(8, Math.floor((cssW + GAP) / STEP));
  const barX = (i, n) => (cssW - (n * STEP - GAP)) / 2 + i * STEP;

  function drawBar(x, a, color) {
    const h = Math.max(3, a * (cssH - 12));
    const y = (cssH - h) / 2;
    g.fillStyle = color;
    if (g.roundRect) { g.beginPath(); g.roundRect(x, y, BAR, h, BAR / 2); g.fill(); }
    else g.fillRect(x, y, BAR, h);
  }

  // head: null, or { pos: 0..1 across the recording, rev: boolean }
  function draw(head) {
    if (!cssW) return;
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.clearRect(0, 0, cssW, cssH);
    const n = barCount();

    if (state === 'recording') {
      const bars = liveBars.slice(-n);
      const off = n - bars.length;
      for (let i = 0; i < off; i++) drawBar(barX(i, n), 0, colors.line);
      for (let i = 0; i < bars.length; i++) drawBar(barX(off + i, n), bars[i], colors.rec);
      return;
    }
    if (!original) {
      for (let i = 0; i < n; i++) drawBar(barX(i, n), 0, colors.line);
      return;
    }
    if (!peaks || peaks.length !== n) peaks = computePeaks(original, n);
    const start = barX(0, n), width = n * STEP - GAP;
    for (let i = 0; i < n; i++) {
      const x = barX(i, n);
      let col = colors.wave;
      if (head) {
        const frac = (x + BAR / 2 - start) / width;
        const played = head.rev ? frac >= head.pos : frac <= head.pos;
        if (played) col = colors.rev;
      }
      drawBar(x, peaks[i], col);
    }
    if (head) {
      const px = Math.min(start + width, Math.max(start, start + head.pos * width));
      g.fillStyle = colors.ink;
      g.fillRect(px - 1, 4, 2, cssH - 8);
    }
  }

  /* ---------- animation loop ---------- */
  function tick(t) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (t - (lastT || t)) / 1000);
    lastT = t;

    const target = reduce.matches ? 0 : ({ recording: 90, fwd: 150, rev: -150 }[state] || 0);
    speed += (target - speed) * Math.min(1, dt * 6);
    angle = (angle + speed * dt) % 360;
    el.reel.style.transform = 'rotate(' + angle.toFixed(2) + 'deg)';

    if (state === 'recording') {
      const elapsed = (performance.now() - recStart) / 1000;
      el.pos.textContent = fmt(elapsed);
      analyser.getByteTimeDomainData(tbuf);
      let p = 0;
      for (let i = 0; i < tbuf.length; i++) { const v = Math.abs(tbuf[i] - 128) / 128; if (v > p) p = v; }
      if (p > liveMax) liveMax = p;
      const now = performance.now();
      if (now - lastPush >= 50) {
        liveBars.push(Math.min(1, Math.pow(liveMax * 1.6, 0.7)));
        liveMax = 0;
        lastPush = now;
      }
      draw();
      if (elapsed >= MAX_SEC) stopRecording();
    } else if (state === 'fwd' || state === 'rev') {
      const prog = Math.min(1, (ctx.currentTime - playStart) / playBuf.duration);
      const pos = state === 'fwd' ? prog : 1 - prog;
      el.pos.textContent = fmt(pos * original.duration);
      draw({ pos, rev: state === 'rev' });
    } else if (Math.abs(speed) < 0.5) {
      cancelAnimationFrame(raf);
      raf = 0; lastT = 0; speed = 0;
    }
  }
  function startLoop() { if (!raf) raf = requestAnimationFrame(tick); }

  /* ---------- state -> UI ---------- */
  function setState(s) {
    state = s;
    document.body.dataset.state = s;
    const has = !!original, recording = s === 'recording', busy = s === 'busy';

    el.status.textContent = STATUS[s];
    const recName = recording ? 'توقف ضبط' : (has ? 'ضبط دوباره' : 'شروع ضبط');
    el.recLabel.textContent = recName;
    el.rec.setAttribute('aria-label', recName);
    el.rec.classList.toggle('is-rec', recording);
    el.rec.disabled = busy;
    show(el.icMic, !recording);
    show(el.icStop, recording);

    const canPlay = has && !recording && !busy;
    el.rev.disabled = !canPlay;
    el.fwd.disabled = !canPlay;
    el.dlOrig.disabled = !canPlay;
    el.dlRev.disabled = !canPlay;
    el.rev.classList.toggle('on', s === 'rev');
    el.fwd.classList.toggle('on', s === 'fwd');
    show(el.revPlay, s !== 'rev'); show(el.revStop, s === 'rev');
    show(el.fwdPlay, s !== 'fwd'); show(el.fwdStop, s === 'fwd');
    el.revText.textContent = s === 'rev' ? 'توقف' : 'پخش وارونه';
    el.fwdText.textContent = s === 'fwd' ? 'توقف' : 'پخش عادی';
    el.pick.disabled = recording || busy;

    if (recording) el.total.textContent = '/ ' + fmt(MAX_SEC);
    else el.total.textContent = has ? '/ ' + fmt(original.duration) : '';
    if (s === 'idle' || s === 'ready') el.pos.textContent = fmt(0);

    if (recording || s === 'fwd' || s === 'rev') startLoop();
    draw();
  }

  /* ---------- events ---------- */
  el.rec.addEventListener('click', () => { if (state === 'recording') stopRecording(); else startRecording(); });
  el.rev.addEventListener('click', () => play('rev'));
  el.fwd.addEventListener('click', () => play('fwd'));
  el.dlOrig.addEventListener('click', () => saveWav(original, 'recording'));
  el.dlRev.addEventListener('click', () => saveWav(reversed, 'recording-reversed'));
  el.pick.addEventListener('click', () => el.file.click());
  el.file.addEventListener('change', () => {
    const f = el.file.files && el.file.files[0];
    el.file.value = '';
    if (!f) return;
    stopPlayback(true);
    clearNotice();
    try { ensureCtx(); } catch (e) { notice('unsupported'); return; }
    loadBlob(f);
  });

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => { readColors(); draw(); });
  new ResizeObserver(resize).observe(el.cv);

  readColors();
  resize();
  setState('idle');
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initApp);
  else initApp();
})();
