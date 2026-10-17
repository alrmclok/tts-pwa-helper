const THEMES = [
  ['light', 'Light'],
  ['dark', 'Dark'],
  ['pure-light', 'Pure Light'],
  ['pure-dark', 'Pure Dark'],
  ['mono-sepia', 'Mono Sepia'],

  ['orange-light', 'Orange light'],
  ['orange-dark', 'Orange dark'],
  ['amber-light', 'Amber light'],
  ['amber-dark', 'Amber dark'],
  ['green-light', 'Green light'],
  ['green-dark', 'Green dark'],
  ['emerald-light', 'Emerald light'],
  ['emerald-dark', 'Emerald dark'],
  ['teal-light', 'Teal light'],
  ['teal-dark', 'Teal dark'],
  ['blue-light', 'Blue light'],
  ['blue-dark', 'Blue dark'],
  ['indigo-light', 'Indigo light'],
  ['indigo-dark', 'Indigo dark'],
  ['purple-light', 'Purple light'],
  ['purple-dark', 'Purple dark'],
  ['rose-light', 'Rose light'],
  ['rose-dark', 'Rose dark'],
  ['crimson-light', 'Crimson light'],
  ['crimson-dark', 'Crimson dark'],

  ['sunset', 'Sunset'],
  ['midnight', 'Midnight'],
  ['cyberpunk', 'Cyberpunk'],
  ['matrix', 'Matrix'],
  ['internet-rule', 'Internet Rule']
];

(() => {
const $ = s => document.querySelector(s);
const TTS = 'speechSynthesis' in window;
const DEF = {
  theme: 'light', voice: '', rate: 1, pitch: 1, volume: 1, cssRotate: false,
  phrases: `# Greetings
Hi! Nice to meet you.
Thank you!
# Photos
Can I take a photo with you?
Yes, you can take a photo!
Which pose would you like?
# Help
I can't talk much, so I'm using this app.
Please speak a bit slower.
Yes
No
Sorry`
};
let S = { ...DEF };
try { S = { ...DEF, ...JSON.parse(localStorage.getItem('sayit') || '{}') }; } catch (e) {}
const save = () => { try { localStorage.setItem('sayit', JSON.stringify(S)); } catch (e) {} };

const T = $('#text'), SP = $('#speak'), VW = $('#view'), V = $('#viewer'),
      ST = $('#stage'), BOX = $('#viewBox'), VT = $('#vt'), C = $('#closeView');

/* theme */
function applyTheme() {
  document.documentElement.dataset.theme = S.theme;
  $('meta[name=theme-color]').content =
    getComputedStyle(document.documentElement).getPropertyValue('--bg').trim();
}

const themeName = v => (THEMES.find(t => t[0] === v) || [0, v])[1];

function tile(v) {
  const b = document.createElement('button');
  b.className = 'tile'; b.dataset.theme = v;
  b.innerHTML = '<b class="pv"><em>Aa</em><i></i><i></i><i></i></b><span></span>';
  b.lastChild.textContent = themeName(v);
  return b;
}
function openThemes() { renderThemes(); $('#themePicker').hidden = false; }
function closeThemes() { $('#themePicker').hidden = true; }

function renderThemes() {
  // current theme + Change button
  const cur = $('#themeCur'); cur.textContent = '';
  const now = tile(S.theme); now.classList.add('now'); now.onclick = openThemes;
  cur.append(now);

  // lightbox grid
  const box = $('#themes'); box.textContent = '';
  THEMES.forEach(([v]) => {
    const b = tile(v);
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', v === S.theme);
    b.onclick = () => { S.theme = v; save(); applyTheme(); renderThemes(); closeThemes(); };
    box.append(b);
  });
}
$('#themeClose').onclick = closeThemes;
$('#themePicker').onclick = e => { if (e.target.id === 'themePicker') closeThemes(); };
addEventListener('keydown', e => { if (e.key === 'Escape') closeThemes(); });

/* phrases */
function renderPhrases() {
  const box = $('#phrases'); box.textContent = '';
  let chips = null;
  S.phrases.split('\n').map(l => l.trim()).filter(Boolean).forEach(l => {
    if (l[0] === '#') {
      const h = document.createElement('h2');
      h.textContent = l.replace(/^#+\s*/, ''); box.append(h); chips = null; return;
    }
    if (!chips) { chips = document.createElement('div'); chips.className = 'chips'; box.append(chips); }
    const b = document.createElement('button');
    b.className = 'phrase'; b.textContent = l;
    b.onclick = () => { T.value = l; sync(); };
    chips.append(b);
  });
  if (!box.children.length) box.innerHTML = '<p class="empty">No phrases yet. Add some in Settings.</p>';
}

/* speech */
let cur = null, talking = false;
function setSpeaking(on) {
  talking = on;
  SP.querySelector('.lbl').textContent = on ? 'Stop' : 'Speak';
  SP.querySelector('.icon').className = 'icon ' + (on ? 'i-stop' : 'i-speak');
  sync();
}
function say(txt) {
  if (!TTS || !txt.trim()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(txt);
  const v = speechSynthesis.getVoices().find(v => v.voiceURI === S.voice);
  if (v) { u.voice = v; u.lang = v.lang; }
  u.rate = S.rate; u.pitch = S.pitch; u.volume = S.volume;
  u.onend = u.onerror = () => { if (cur === u) setSpeaking(false); };
  cur = u; setSpeaking(true);
  speechSynthesis.speak(u);
}
SP.onclick = () => {
  navigator.vibrate?.(15);
  if (TTS && (speechSynthesis.speaking || speechSynthesis.pending)) { cur = null; speechSynthesis.cancel(); setSpeaking(false); }
  else say(T.value);
};
function sync() { const e = !T.value.trim(); SP.disabled = e && !talking; VW.disabled = e; }
T.oninput = sync;
$('#clear').onclick = () => { T.value = ''; sync(); T.focus(); };

/* view */
let inView = false, force = false, fs = false, wl = null, ft;
function ping() {
  C.classList.remove('faded'); clearTimeout(ft);
  ft = setTimeout(() => C.classList.add('faded'), 500);
}
V.addEventListener('pointerdown', ping);

function fit() {
  if (!inView) return;
  const W = innerWidth, H = innerHeight, rot = force && H > W;
  ST.style.cssText = rot
    ? `inset:auto;left:0;top:0;width:${H}px;height:${W}px;transform-origin:0 0;transform:translateX(${W}px) rotate(90deg)`
    : '';
  const maxH = BOX.clientHeight - 56;
  let lo = 14, hi = 700;
  while (hi - lo > 2) {
    const m = (lo + hi) >> 1; VT.style.fontSize = m + 'px';
    if (VT.offsetHeight <= maxH) lo = m; else hi = m;
  }
  VT.style.fontSize = lo + 'px';
}
addEventListener('resize', fit);

async function wake() { try { wl = await navigator.wakeLock.request('screen'); } catch (e) {} }
document.addEventListener('visibilitychange', () => { if (inView && document.visibilityState === 'visible') wake(); });

async function openView() {
  const t = T.value.trim(); if (!t) return;
  VT.textContent = t; V.hidden = false; inView = true; force = false;
  history.pushState({ v: 1 }, '');
  if (S.cssRotate) force = true;
  else {
    try { if (!document.fullscreenElement) { await V.requestFullscreen(); fs = true; } } catch (e) {}
    try { await screen.orientation.lock('landscape'); } catch (e) { force = true; }
  }
  fit(); setTimeout(fit, 300); wake(); ping();
}
function closeView(fromPop) {
  if (!inView) return;
  inView = false; force = false; V.hidden = true; ST.style.cssText = '';
  try { screen.orientation.unlock(); } catch (e) {}
  if (fs && document.fullscreenElement) document.exitFullscreen().catch(() => {});
  fs = false;
  if (wl) { wl.release().catch(() => {}); wl = null; }
  if (!fromPop && history.state && history.state.v) history.back();
}
VW.onclick = openView;
VT.onclick = () => say(T.value);
C.onclick = () => closeView(false);
addEventListener('popstate', () => closeView(true));

/* settings */
let VOICES = [];
const vLabel = v => `${v.name} (${v.lang})`;

function loadVoices() {
  if (!TTS) return;
  VOICES = speechSynthesis.getVoices().slice()
    .sort((a, b) => a.lang.localeCompare(b.lang) || a.name.localeCompare(b.name));
  renderVoices();
}
function renderVoices() {
  const cur = VOICES.find(v => v.voiceURI === S.voice);
  $('#voiceCur').textContent = cur ? vLabel(cur) : 'Phone default';

  const box = $('#voices'); box.textContent = '';
  [['', 'Phone default'], ...VOICES.map(v => [v.voiceURI, vLabel(v)])].forEach(([uri, name]) => {
    const b = document.createElement('button');
    b.className = 'vopt'; b.textContent = name;
    b.setAttribute('role', 'radio');
    b.setAttribute('aria-checked', uri === S.voice || (!cur && !uri));
    b.onclick = () => { S.voice = uri; save(); renderVoices(); closeVoices(); };
    box.append(b);
  });
}
function openVoices() {
  $('#voicePicker').hidden = false;
  $('#voices [aria-checked=true]')?.scrollIntoView({ block: 'center' });
}
function closeVoices() { $('#voicePicker').hidden = true; }

$('#voiceCur').onclick = openVoices;
$('#voiceClose').onclick = closeVoices;
$('#voicePicker').onclick = e => { if (e.target.id === 'voicePicker') closeVoices(); };
addEventListener('keydown', e => { if (e.key === 'Escape') closeVoices(); });

if (TTS) speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();
renderVoices();

function bindRange(id) {
  const el = $('#' + id), o = $('#' + id + 'O');
  const show = v => o.textContent = id === 'rate' ? (+v).toFixed(1) + '×' : v;
  el.value = S[id]; show(S[id]);
  el.oninput = () => { S[id] = +el.value; show(el.value); save(); };
}
['rate', 'pitch', 'volume'].forEach(bindRange);
$('#phraseEdit').value = S.phrases;
$('#phraseEdit').oninput = e => { S.phrases = e.target.value; save(); renderPhrases(); };
$('#cssRotate').checked = S.cssRotate;
$('#cssRotate').onchange = e => { S.cssRotate = e.target.checked; save(); };
$('#test').onclick = () => say('Hello! This is how I sound.');
$('#openSettings').onclick = () => { $('#settings').hidden = false; };
$('#done').onclick = () => { $('#settings').hidden = true; };

renderThemes(); applyTheme(); renderPhrases(); sync();
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
})();
