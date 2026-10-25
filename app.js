/* ============================================================
   ArnoiPhone · 系统与 App 逻辑
   ============================================================ */
(() => {
'use strict';

const $ = s => document.querySelector(s);
const SCREEN = $('#screen');
const PHONE  = $('#phone');
const HOME   = $('#homeL');
const APP    = $('#appL');
const LOCK   = $('#lockL');
const PINL   = $('#pinL');
const OV     = $('#ov');

const PIN_CODE = '0707';      // 锁屏密码
const EASE = 'cubic-bezier(.32,.72,0,1)';

let view = 'lock';        // lock | pin | home | app
let SC = 1;
let pin = '';
let curApp = null;
let callTimer = null, callIv = null;
let curConvo = null;   // 当前打开的聊天页 { src, c, pg, msgs, syncNeed }
let xNew = [];         // 待展示的 X 日记更新（按更新先后，越后面越新）

/* ---------- 工具 ---------- */
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const timeStr = d => pad(d.getHours()) + ':' + pad(d.getMinutes());
const clockNow = () => { const d = new Date(); return timeStr(d); };
const monthDay = d => `${d.getMonth() + 1}月${d.getDate()}日`;
const weekday = d => '星期' + '日一二三四五六'[d.getDay()];
const vib = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) {} };
const relRect = el => {
  const s = SCREEN.getBoundingClientRect(), r = el.getBoundingClientRect();
  return { x: (r.left - s.left) / SC, y: (r.top - s.top) / SC, w: r.width / SC, h: r.height / SC };
};

/* ---------- 图标 ---------- */
const BACK = '<svg viewBox="0 0 12 20" aria-hidden="true"><path d="M10 2 2 10l8 8" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const FLASH = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M6 3h12l-6 7h5l-9 11 2-8H6l4-10Z"/></svg>';
const CAMERA = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M4 8h3l1.5-2h7L17 8h3v11H4Z"/><circle cx="12" cy="13.2" r="3.4"/></svg>';
const PHONE_ICON = '<svg viewBox="0 0 60 60" width="30" height="30" aria-hidden="true"><path fill="currentColor" d="M22.6 16.8c-1.1-1.1-2.9-1.2-4.1-.2l-3.1 2.6c-1.7 1.4-2.2 3.8-1.3 5.8 4.6 10.2 12.5 18.1 22.7 22.7 2 .9 4.4.4 5.8-1.3l2.6-3.1c1-1.2.9-3-.2-4.1l-5.3-5.3c-1.1-1.1-2.9-1.1-4 .1l-2 2.2a33.8 33.8 0 0 1-9.1-9.1l2.2-2c1.2-1.1 1.2-2.9.1-4l-4.3-4.3Z"/></svg>';
const INFO = '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.6v.1" stroke-linecap="round"/></svg>';
const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5S3.9 15.6 2.1 10.8C.9 7.4 2.8 4 6.2 4c2 0 3.5 1.1 4.4 2.5h2.8C14.3 5.1 15.8 4 17.8 4c3.4 0 5.3 3.4 4.1 6.8-1.8 4.8-9.9 9.7-9.9 9.7Z"/></svg>';
const REPOST = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9V7a2 2 0 0 1 2-2h11l-3-3M20 15v2a2 2 0 0 1-2 2H7l3 3"/></svg>';
const DM_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round"><path d="M21.5 2.5 10.8 13.2"/><path d="M21.5 2.5 14.8 21.5l-4-8.3-8.3-4Z"/></svg>';
const CLOSE_X = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>';
const LOCK_ICON = '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7.5 10V8a4.5 4.5 0 0 1 9 0v2H18a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1h1.5Zm1.8 0h5.4V8a2.7 2.7 0 0 0-5.4 0v2Z"/></svg>';
const PERSON_AV = '<svg viewBox="0 0 24 24" width="46" height="46" fill="#8b98a5" aria-hidden="true"><circle cx="12" cy="8.2" r="4.3"/><path d="M3.6 21.2c0-4.5 3.8-7.2 8.4-7.2s8.4 2.7 8.4 7.2Z"/></svg>';
/* 默认头像（与 X 私密账号一致的人形剪影）；有 img 时用照片 */
const DEF_AV = '<svg viewBox="0 0 24 24" class="defav" fill="#ececee" aria-hidden="true"><circle cx="12" cy="8.2" r="4.3"/><path d="M3.6 21.2c0-4.5 3.8-7.2 8.4-7.2s8.4 2.7 8.4 7.2Z"/></svg>';
const avIn = c => c.img ? `<img loading="lazy" decoding="async" src="${c.img}" alt="">` : DEF_AV;
const avBg = c => c.img ? '#e5e5ea' : '#c7c7cc';

const ICONS = {
  wechat: `<svg viewBox="0 0 60 60" width="40" height="40" aria-hidden="true">
    <path fill="#fff" d="M25.5 15C16.4 15 9 20.9 9 28.1c0 4.1 2.3 7.8 6 10.2l-1.5 5.2 5.8-3.1c1.9.6 4 1 6.2 1 .8 0 1.6-.1 2.4-.2-.9-1.8-1.4-3.8-1.4-5.9 0-6.6 6.4-12 14.3-12 .3 0 .6 0 .9.1C39.4 18.9 33 15 25.5 15Z"/>
    <path fill="#fff" opacity=".92" d="M45 25c-7 0-12.7 4.5-12.7 10.1 0 3.2 1.9 6 4.8 7.8l-1.2 3.9 4.4-2.4c1.5.5 3.1.8 4.7.8 7 0 12.7-4.5 12.7-10.1S52 25 45 25Z"/>
    <circle cx="20" cy="25.5" r="1.9" fill="#20c463"/><circle cx="31" cy="25.5" r="1.9" fill="#20c463"/>
    <circle cx="41" cy="34.6" r="1.7" fill="#f6d94a"/><circle cx="49" cy="34.6" r="1.7" fill="#f6d94a"/>
  </svg>`,
  kakao: `<svg viewBox="0 0 60 60" width="44" height="44" aria-hidden="true"><path fill="#3c1e1e" d="M30 13c-10.8 0-19.5 6.7-19.5 15 0 4.9 3.1 9.2 7.8 12l-2 7.3 8.2-4.5c1.8.4 3.6.6 5.5.6 10.8 0 19.5-6.7 19.5-15S40.8 13 30 13Z"/></svg>`,
  instagram: `<svg viewBox="0 0 60 60" width="40" height="40" aria-hidden="true"><rect x="13" y="13" width="34" height="34" rx="11" fill="none" stroke="#fff" stroke-width="3.4"/><circle cx="30" cy="30" r="8.4" fill="none" stroke="#fff" stroke-width="3.4"/><circle cx="41.5" cy="18.5" r="2.4" fill="#fff"/></svg>`,
  x: `<svg viewBox="0 0 60 60" width="38" height="38" aria-hidden="true"><path fill="#fff" d="M14 14h7.2l9.6 12.9L41 14h5L33 29.6 47 46h-7.2L29.3 32.4 18 46h-5l13.6-16.4L14 14Z"/></svg>`,
  photos: '<div class="pinwheel"></div>',
  phone: `<svg viewBox="0 0 60 60" width="38" height="38" aria-hidden="true"><path fill="#fff" d="M22.6 16.8c-1.1-1.1-2.9-1.2-4.1-.2l-3.1 2.6c-1.7 1.4-2.2 3.8-1.3 5.8 4.6 10.2 12.5 18.1 22.7 22.7 2 .9 4.4.4 5.8-1.3l2.6-3.1c1-1.2.9-3-.2-4.1l-5.3-5.3c-1.1-1.1-2.9-1.1-4 .1l-2 2.2a33.8 33.8 0 0 1-9.1-9.1l2.2-2c1.2-1.1 1.2-2.9.1-4l-4.3-4.3Z"/></svg>`,
  messages: `<svg viewBox="0 0 60 60" width="40" height="40" aria-hidden="true"><path fill="#fff" d="M30 14c-9.9 0-18 6.4-18 14.4 0 4.4 2.6 8.4 6.8 11l-1.7 5.6 6.3-3.4c2.1.7 4.3 1 6.6 1 9.9 0 18-6.4 18-14.2S39.9 14 30 14Z"/></svg>`,
  maps: `<svg viewBox="0 0 60 60" width="46" height="46" aria-hidden="true">
    <path d="M6 17l16-6 16 6 16-6v32l-16 6-16-6-16 6V17Z" fill="#dff3dc"/>
    <path d="M22 11v38M38 17v38" stroke="#bfe3b8" stroke-width="1.6"/>
    <path d="M6 23c10 4 14 12 24 10s14-8 24-6" stroke="#5aa9e6" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <circle cx="24" cy="33" r="2.6" fill="#ff3b30"/>
  </svg>`,
  settings: `<svg viewBox="0 0 60 60" width="44" height="44" aria-hidden="true">
    <path fill="#4a4a4f" d="M26.4 9h7.2l1 5.4 4.6 1.9 4.3-3.5 5.1 5.1-3.5 4.3 1.9 4.6 5.4 1v7.2l-5.4 1-1.9 4.6 3.5 4.3-5.1 5.1-4.3-3.5-4.6 1.9-1 5.4h-7.2l-1-5.4-4.6-1.9-4.3 3.5-5.1-5.1 3.5-4.3-1.9-4.6-5.4-1v-7.2l5.4-1 1.9-4.6L9.2 20l5.1-5.1 4.3 3.5 4.6-1.9Z"/>
    <circle cx="30" cy="30" r="6.6" fill="#d3d3d8"/>
  </svg>`,
  weather: `<svg viewBox="0 0 60 60" width="46" height="46" aria-hidden="true">
    <circle cx="39" cy="20" r="7" fill="#ffd60a"/>
    <path d="M14 41a7 7 0 0 1 1.7-13.8 10.5 10.5 0 0 1 20.1 2.4A6.6 6.6 0 0 1 48 41Z" fill="#fff"/>
  </svg>`,
  clock: `<svg viewBox="0 0 60 60" width="44" height="44" aria-hidden="true">
    <circle cx="30" cy="30" r="21" fill="#1c1c1e"/>
    <g stroke="#fff" stroke-width="1.6" stroke-linecap="round">
      <path d="M30 12.5v2.4M30 45.1v2.4M12.5 30h2.4M45.1 30h2.4"/>
    </g>
    <path d="M30 30V20.5M30 30l8 5.5" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/>
  </svg>`,
  calendar: `<svg viewBox="0 0 60 60" width="42" height="42" aria-hidden="true">
    <rect x="8" y="10" width="44" height="40" rx="7" fill="#fff"/>
    <path d="M8 17a7 7 0 0 1 7-7h30a7 7 0 0 1 7 7v4H8Z" fill="#ff3b30"/>
    <text x="30" y="45" text-anchor="middle" font-size="21" font-weight="600" fill="#1c1c1e" font-family="-apple-system,BlinkMacSystemFont,'Helvetica Neue',sans-serif">24</text>
  </svg>`
};

const APPS = {
  wechat:    { label: '微信', dock: true },
  kakao:     { label: 'KakaoTalk', dock: true },
  messages:  { label: '短信', dock: true },
  phone:     { label: '电话', dock: true },
  instagram: { label: 'Instagram' },
  x:         { label: 'X' },
  photos:    { label: '相册' },
  maps:      { label: '地图' },
  settings:  { label: '设置' },
  weather:   { label: '天气' },
  clock:     { label: '时钟' },
  calendar:  { label: '日历' }
};
const GRID_ORDER = ['instagram', 'x', 'photos', 'maps', 'settings', 'weather', 'clock', 'calendar'];
const DOCK_ORDER = ['phone', 'messages', 'wechat', 'kakao'];
let REMINDERS = ['卡丁车企划书终审', '团建采购审批'];   // 「ㅇㅇ酒店1105，晚21：00」待指示后再加回
const CHECK = '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 6.5"/></svg>';

/* ---------- 状态栏 / Home 条 ---------- */
function setChrome(mode) {   // mode: 'light' = 白色图标, 'dark' = 黑色图标
  $('#sb').classList.toggle('dark', mode === 'dark');
  $('#hb').classList.toggle('dark', mode === 'dark');
}
function setCrumb(on) {
  $('#sb').classList.toggle('crumb', on);
}

/* ---------- 锁屏 ---------- */
function renderLock() {
  const d = new Date();
  $('#lkc').innerHTML = `
    <div class="lk-date">${monthDay(d)} ${weekday(d)}</div>
    <div class="lk-time" id="lkt">${timeStr(d)}</div>
    <button class="lk-btn" style="left:44px" onclick="event.stopPropagation();App.toast('手电筒')">${FLASH}</button>
    <button class="lk-btn" style="right:44px" onclick="event.stopPropagation();App.toast('相机待接入')">${CAMERA}</button>
    <div class="lk-hint">向上轻扫以打开</div>`;
  $('#sbTime').textContent = timeStr(d);
}

/* 锁屏上滑 / 点击 */
(function lockDrag() {
  const el = $('#lkc');
  let y0 = null, dy = 0;
  el.addEventListener('pointerdown', e => {
    if (view !== 'lock' || e.target.closest('button')) return;
    y0 = e.clientY; dy = 0; el.setPointerCapture(e.pointerId);
  });
  el.addEventListener('pointermove', e => {
    if (y0 === null) return;
    dy = Math.min(0, (e.clientY - y0) / SC);
    el.style.transform = `translateY(${dy}px)`;
    el.style.opacity = 1 + dy / 520;
  });
  el.addEventListener('pointerup', e => {
    if (y0 === null) return;
    const d = dy; y0 = null;
    el.style.transform = ''; el.style.opacity = '';
    if (d < -70 || (Math.abs(d) < 8 && !e.target.closest('button'))) goPin();
  });
  /* 点击兜底（部分浏览器/自动化环境不派发完整 pointerup） */
  el.addEventListener('click', e => {
    if (view === 'lock' && !e.target.closest('button')) goPin();
  });
})();

/* ---------- 密码 ---------- */
function goPin() {
  if (view !== 'lock') return;
  view = 'pin'; pin = '';
  $('#wallLock').classList.add('dim');
  PINL.style.display = 'flex';
  renderPin();
  LOCK.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, fill: 'forwards' })
      .onfinish = () => { LOCK.style.visibility = 'hidden'; };
  PINL.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }],
    { duration: 340, easing: EASE });
  setChrome('light');
}

const LETTERS = ['', 'ABC', 'DEF', 'GHI', 'JKL', 'MNO', 'PQRS', 'TUV', 'WXYZ'];
function renderPin() {
  PINL.innerHTML = `
    <div class="pt">输入密码</div>
    <div class="pdots" id="dots">${[0, 1, 2, 3].map(i => `<i class="${i < pin.length ? 'on' : ''}"></i>`).join('')}</div>
    <div class="pkeys">
      ${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<button class="pk" onclick="App.pinKey('${n}')"><b>${n}</b><small>${LETTERS[n - 1]}</small></button>`).join('')}
      <span></span>
      <button class="pk" onclick="App.pinKey('0')"><b>0</b><small></small></button>
      <span></span>
    </div>
    <div class="pbot">
      <button onclick="App.toast('紧急呼叫不可用')">紧急情况</button>
      <button id="pdel" onclick="App.pinAction()">${pin ? '删除' : '取消'}</button>
    </div>`;
}
function paintPinDots() {
  const d = $('#dots');
  if (d) d.innerHTML = [0, 1, 2, 3].map(i => `<i class="${i < pin.length ? 'on' : ''}"></i>`).join('');
  const b = $('#pdel');
  if (b) b.textContent = pin ? '删除' : '取消';
}
function pinKey(n) {
  if (pin.length >= 4 || view !== 'pin') return;
  pin += n; vib(8); paintPinDots();
  if (pin.length === 4) {
    setTimeout(() => {
      if (pin === PIN_CODE) unlock();
      else {
        const d = $('#dots');
        d.classList.add('shake'); vib([60, 40, 60]);
        setTimeout(() => { pin = ''; paintPinDots(); }, 440);
      }
    }, 110);
  }
}
function pinAction() {
  if (pin) { pin = pin.slice(0, -1); paintPinDots(); return; }
  pinCancel();
}
function pinCancel() {
  view = 'lock'; pin = '';
  PINL.animate([{ opacity: 1 }, { opacity: 0, transform: 'translateY(24px)' }], { duration: 240, fill: 'forwards' })
      .onfinish = () => { PINL.style.display = 'none'; PINL.innerHTML = ''; };
  $('#wallLock').classList.remove('dim');
  LOCK.style.visibility = 'visible';
  LOCK.style.opacity = '1';
  setChrome('light');
}

/* ---------- 解锁 ---------- */
function unlock() {
  view = 'home'; pin = '';
  PINL.style.display = 'none'; PINL.innerHTML = '';
  LOCK.style.visibility = 'hidden';
  $('#wallLock').classList.remove('dim');
  const wl = $('#wallLock');
  wl.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 480, fill: 'forwards' })
    .onfinish = () => { wl.style.opacity = '0'; };
  renderHome();
  HOME.style.visibility = 'visible';
  HOME.animate([{ transform: 'scale(1.14)', opacity: 0 }, { transform: 'none', opacity: 1 }],
    { duration: 520, easing: EASE });
  [...HOME.querySelectorAll('.app')].forEach((el, i) =>
    el.animate([{ transform: 'scale(.76)', opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 420, delay: 40 + i * 18, easing: 'cubic-bezier(.2,1.1,.3,1)', fill: 'backwards' }));
  setChrome('light');
  syncXGate();
}

/* ---------- 桌面 ---------- */
const appBtn = id => `<button class="app" data-app="${id}" onclick="App.open('${id}',this)">
  <div class="ic ic-${id}">${ICONS[id]}</div><span class="lbl">${APPS[id].label}</span>
</button>`;

function renderHome() {
  HOME.innerHTML = `
    <div class="hgrid">
      <div class="widget">
        <div class="wghead"><span class="wgico">${CHECK}</span><b>提醒事项</b><small>${REMINDERS.length}</small></div>
        ${REMINDERS.map(t => `<div class="wgtodo"><i></i><span>${esc(t)}</span></div>`).join('')}
      </div>
      ${GRID_ORDER.map(appBtn).join('')}
    </div>
    <div class="dots"><i class="on"></i><i></i></div>
    <div class="dock">${DOCK_ORDER.map(appBtn).join('')}</div>`;
}

/* 提醒事项最上方插入一条（剧本 gate:'home' 回到桌面后触发） */
function addReminder(text) {
  REMINDERS.unshift(text);
  const wg = HOME.querySelector('.widget');
  if (!wg) return;
  const div = document.createElement('div');
  div.className = 'wgtodo new';
  div.innerHTML = `<i></i><span>${esc(text)}</span>`;
  wg.insertBefore(div, wg.children[1] || null);
  const cnt = wg.querySelector('small');
  if (cnt) cnt.textContent = REMINDERS.length;
  div.animate([
    { opacity: 0, transform: 'translateY(-8px) scale(.96)' },
    { opacity: 1, transform: 'none' }
  ], { duration: 460, easing: 'cubic-bezier(.2,1.1,.3,1)' });
  vib([16, 60, 16]);
}

/* ---------- 页面切换 ---------- */
function open(id, el) {
  if (view !== 'home') return;
  if (!VIEWS[id]) { toast('暂未接入'); return; }
  const v = VIEWS[id]();
  const pg = document.createElement('div');
  pg.className = 'page ' + (v.cls || '');
  pg.innerHTML = v.html;
  APP.appendChild(pg);
  syncRowNeed();

  const icon = el ? el.querySelector('.ic') || el : null;
  const r = icon ? relRect(icon) : { x: 165, y: 400, w: 62, h: 62 };
  const W = SCREEN.clientWidth, H = SCREEN.clientHeight;
  const s = Math.max(W / r.w, H / r.h) * 1.02;
  const dx = r.x + r.w / 2 - W / 2, dy = r.y + r.h / 2 - H / 2;

  pg.animate([
    { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 0, borderRadius: '52px' },
    { transform: 'none', opacity: 1, borderRadius: '0px' }
  ], { duration: 460, easing: EASE, fill: 'backwards' });

  curApp = id; view = 'app';
  setChrome(id === 'x' ? 'light' : 'dark');
  setCrumb(true);
  if (v.init) v.init(pg);
  syncXGate();
  if (id === 'x') revealXDiary(pg);
}

function close() {
  if (view !== 'app') return;
  curConvo = null;
  releaseGate();
  clearTimeout(callTimer); clearInterval(callIv);
  const icon = HOME.querySelector(`.app[data-app="${curApp}"] .ic`);
  const r = icon ? relRect(icon) : { x: 165, y: 400, w: 62, h: 62 };
  const W = SCREEN.clientWidth, H = SCREEN.clientHeight;
  const s = Math.max(W / r.w, H / r.h) * 1.02;
  const dx = r.x + r.w / 2 - W / 2, dy = r.y + r.h / 2 - H / 2;

  const pages = [...APP.children];
  const top = pages[pages.length - 1];
  pages.forEach(p => {
    p.style.pointerEvents = 'none';
    if (p !== top) p.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' });
  });
  top.animate([
    { transform: 'none', opacity: 1 },
    { transform: `translate(${dx}px,${dy}px) scale(${s})`, opacity: 0 }
  ], { duration: 420, easing: EASE, fill: 'forwards' })
    .onfinish = () => pages.forEach(p => p.remove());

  view = 'home'; curApp = null;
  setChrome('light');
  setCrumb(false);
  OV.innerHTML = '';
  syncXGate();
  applyHomeGate();
}

function home() {
  if (view !== 'app') return;
  if (OV.querySelector('.viewer')) { closeViewer(); return; }
  if (OV.querySelector('.sv')) { closeStory(); return; }
  close();
}

function back() {
  if (view !== 'app') return;
  const pages = [...APP.children];
  const top = pages[pages.length - 1];
  if (top && top.classList.contains('callpage')) { endCall(top); return; }
  if (pages.length > 1) {
    popPage(top);
    setChrome(curApp === 'x' ? 'light' : 'dark');
  } else {
    close();
  }
}

function popPage(pg) {
  if (curConvo && curConvo.pg === pg) curConvo = null;
  releaseGate();
  pg.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateX(100%)', opacity: .6 }],
    { duration: 320, easing: EASE, fill: 'forwards' }).onfinish = () => pg.remove();
}

/* ---------- 微信 / KakaoTalk / 短信 ---------- */
const chatRow = (src, c, i) => `
  <div class="row" data-src="${src}" data-name="${esc(c.name)}" onclick="App.chat('${src}',${i})">
    <div class="av${c.group ? ' grp' : ''}" style="background:${avBg(c)}">${avIn(c)}</div>
    <div class="rinfo">
      <div class="rtop"><b>${esc(c.name)}</b><small>${esc(c.time)}</small></div>
      <div class="rbot"><span>${esc(c.preview)}</span>${c.unread ? `<i class="bdg">${c.unread}</i>` : ''}</div>
    </div>
  </div>`;

const bubbleHTML = m => `<div class="mrow ${m.me ? 'me' : 'them'}">
  ${m.from ? `<div class="bfrom">${esc(m.from)}</div>` : ''}${m.img
    ? `<div class="bb imgb"><img loading="lazy" decoding="async" src="${m.img}" alt=""></div>`
    : `<div class="bb">${esc(m.text)}</div>`}<div class="mt">${esc(m.time || '')}</div></div>`;

const I_HOME = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M3.5 10.5 12 3.4l8.5 7.1V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1Z"/></svg>';
const I_SEARCH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"/><path d="m16.2 16.2 4 4"/></svg>';
const I_PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M12 8v8M8 12h8"/></svg>';
const I_REELS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M3.5 8.5h17M8.5 3.5l4 5M14.5 3.5l4 5"/><path d="m10.5 12 5 3-5 3Z"/></svg>';
const I_ME = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="9.5" r="3"/><path d="M5.8 19.2c.7-3.2 3.1-4.8 6.2-4.8s5.5 1.6 6.2 4.8"/></svg>';
const I_BELL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Z"/><path d="M10 18.5a2 2 0 0 0 4 0"/></svg>';
const I_MAIL = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="m4 7.5 8 5.5 8-5.5"/></svg>';

const WEI_TABS = [['微信', 0], ['通讯录', 1], ['发现', 2], ['我', 3]];
const WEI_ICONS = [
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3.4C6.9 3.4 3 6.8 3 10.9c0 2.3 1.3 4.4 3.4 5.8L5.6 19.4l3.1-1.7c1 .3 2.1.4 3.3.4 5.1 0 9.1-3.4 9.1-7.6S17.1 3.4 12 3.4Z"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="8" r="3.6"/><path d="M4.5 20c.6-3.6 3.5-5.7 7.5-5.7s6.9 2.1 7.5 5.7"/></svg>',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="8.6"/><path d="m15.6 8.4-2 5.2-5.2 2 2-5.2Z"/></svg>',
  I_ME
];
const IG_TABS = [['主页', 0], ['搜索', 1], ['发布', 2], ['Reels', 3], ['我', 4]];
const IG_ICONS = [I_HOME, I_SEARCH, I_PLUS, I_REELS, I_ME];
const X_TABS = [['主页', 0], ['搜索', 1], ['通知', 2], ['私信', 3]];
const X_ICONS = [I_HOME, I_SEARCH, I_BELL, I_MAIL];

const tabbar = (items, active, dark, icons) => `<div class="tabbar${dark ? ' dark' : ''}">${items.map(([label, i]) =>
  `<div class="${i === active ? 'on' : ''}">${(icons || WEI_ICONS)[i]}<span>${label}</span></div>`).join('')}</div>`;

const VIEWS = {};

VIEWS.wechat = () => ({
  cls: 'wx',
  html: `
    <div class="nav"><span class="navL">编辑</span><div class="ttl">微信</div><span class="navR">＋</span></div>
    <div class="scroll">
      <div class="searchbar">搜索</div>
      ${DATA.wechat.map((c, i) => chatRow('wechat', c, i)).join('')}
    </div>
    ${tabbar(WEI_TABS, 0)}`
});

VIEWS.kakao = () => ({
  cls: 'kk',
  html: `
    <div class="nav"><span class="navL"></span><div class="ttl">KakaoTalk</div><span class="navR">＋</span></div>
    <div class="scroll">
      <div class="searchbar">검색</div>
      ${DATA.kakao.map((c, i) => chatRow('kakao', c, i)).join('')}
    </div>`
});

VIEWS.messages = () => ({
  cls: 'sms',
  html: `
    <div class="nav"><span class="navL"></span><div class="ttl">信息</div><span class="navR">＋</span></div>
    <div class="scroll">
      <div class="searchbar">搜索</div>
      ${DATA.sms.map((c, i) => chatRow('sms', c, i)).join('')}
    </div>`
});

/* ---------- 聊天 ---------- */
function openChat(src, i) { openConvo(src, DATA[src][i]); }

function openConvo(src, c) {
  if (!c || view !== 'app') return;
  const pg = document.createElement('div');
  pg.className = 'page chat-page ' + src;
  pg.innerHTML = `
    <div class="nav">
      <button class="back">${BACK}<span>返回</span></button>
      <div class="ttl">${esc(c.name)}</div>
      <span></span>
    </div>
    <div class="msgs">${c.members ? `<div class="sysmsg"><b>${esc(c.name)}</b><span>${c.members.length} 位成员 · ${c.members.map(esc).join('、')}</span></div>` : ''}${c.msgs.map(bubbleHTML).join('')}</div>
    <div class="inputbar">
      <input id="msgIn" type="text" placeholder="发消息…" autocomplete="off">
      <button class="send">发送</button>
    </div>`;
  APP.appendChild(pg);
  pg.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: 340, easing: EASE });

  const msgs = pg.querySelector('.msgs');
  const bar = pg.querySelector('.inputbar');
  msgs.scrollTop = msgs.scrollHeight;
  /* 图片加载完成后再次贴底，避免最后一条被输入栏挡住 */
  pg.querySelectorAll('.imgb img').forEach(im => {
    if (!im.complete) im.addEventListener('load', () => { msgs.scrollTop = msgs.scrollHeight; });
  });
  pg.querySelector('.back').onclick = () => { if (curConvo && curConvo.pg === pg) curConvo = null; popPage(pg); };
  setChrome('dark');

  /* 轮到自己发消息时，输入框闪烁提醒（对方发信息时不闪烁） */
  const syncNeed = () => {
    bar.classList.toggle('need', !!(playPending && playPending.name === c.name));
  };
  syncNeed();
  curConvo = { src, c, pg, msgs, syncNeed };
  /* gate:'open'：Arno 解锁并进入这个会话后，剧本继续 */
  if (openGate && openGate.src === src && openGate.name === c.name) {
    openGate = null;
    clearTimeout(playTimer);
    playTimer = setTimeout(playStep, 900);
  }

  /* 进入会话即清除未读红点 */
  c.unread = 0;
  patchRow(src, c);

  const inp = pg.querySelector('#msgIn');
  inp.addEventListener('input', () => bar.classList.remove('need'));

  /* 剧情播放：轮到 Arno 时，点击输入框自动键入预设台词 */
  let typing = false;
  const sendPlayImg = s => {
    const t = clockNow();
    c.msgs.push({ me: true, img: s.img, time: t });
    msgs.insertAdjacentHTML('beforeend', bubbleHTML({ me: true, img: s.img, time: t }));
    msgs.scrollTop = msgs.scrollHeight;
    playPending = null;
    syncNeed();
    syncRowNeed();
    playIdx++;
    playTimer = setTimeout(playStep, 800);
  };
  const tryAutoType = () => {
    if (!playPending || typing || playPending.name !== c.name) return;
    const s = playPending;
    if (s.img && !s.text) { sendPlayImg(s); return; }
    typing = true;
    inp.readOnly = true;
    bar.classList.remove('need');
    inp.value = '';
    let k = 0;
    const iv = setInterval(() => {
      if (!document.body.contains(inp)) { clearInterval(iv); typing = false; return; }
      inp.value = s.text.slice(0, ++k);
      if (k >= s.text.length) { clearInterval(iv); typing = false; inp.readOnly = false; }
    }, 70);
  };
  inp.addEventListener('focus', tryAutoType);
  inp.addEventListener('click', tryAutoType);

  const doSend = () => {
    const text = inp.value.trim();
    if (!text || typing) return;
    const t = clockNow();
    c.msgs.push({ me: true, text, time: t });
    msgs.insertAdjacentHTML('beforeend', bubbleHTML({ me: true, text, time: t }));
    inp.value = '';
    msgs.scrollTop = msgs.scrollHeight;

    /* 播放模式：发出预设台词后继续推进队列；自由聊天则走自动回复 */
    if (playPending && playPending.name === c.name && text === playPending.text) {
      playPending = null;
      syncNeed();
      syncRowNeed();
      playIdx++;
      playTimer = setTimeout(playStep, 800);
      return;
    }
    syncNeed();

    if (c.reply) {
      const typ = document.createElement('div');
      typ.className = 'mrow them';
      typ.innerHTML = '<div class="bb typing"><i></i><i></i><i></i></div>';
      setTimeout(() => { msgs.appendChild(typ); msgs.scrollTop = msgs.scrollHeight; }, 450);
      setTimeout(() => {
        typ.remove();
        const rt = clockNow();
        c.msgs.push({ me: false, text: c.reply, time: rt });
        msgs.insertAdjacentHTML('beforeend', bubbleHTML({ me: false, text: c.reply, time: rt }));
        msgs.scrollTop = msgs.scrollHeight;
        syncNeed();
      }, 1700);
    }
  };
  pg.querySelector('.send').onclick = doSend;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doSend(); } });
  /* 播放模式轮到我时不自动聚焦，保留输入框闪烁提醒 */
  setTimeout(() => { if (document.body.contains(inp) && !playPending) inp.focus(); }, 420);
}

/* ---------- Instagram ---------- */
let igVisible = [];   // 当前已出现在信息流里的帖子下标（默认空，按指令弹出）
const igPosts = () => igVisible.map(i => ({ p: DATA.instagram.posts[i], i }));

VIEWS.instagram = () => ({
  cls: 'ig',
  html: `
    <div class="nav"><span class="navL"></span><div class="ttl brand">Instagram</div>
      <span class="navR"><button class="igdm" aria-label="私信" onclick="App.dms()">${DM_ICON}</button></span></div>
    <div class="scroll">
      <div class="stories">${DATA.instagram.stories.map((s, i) => `
        <div class="story" onclick="App.story(${i})"><div class="ring"><div class="in" style="background:${avBg(s)}">${avIn(s)}</div></div><span>${esc(s.name)}</span></div>`).join('')}
      </div>
      ${igPosts().map(({ p, i }) => `
        <div class="post">
          <div class="top">
            <div class="av round" style="background:#e5e5ea"><img loading="lazy" decoding="async" src="${p.uimg || DATA.ownerAv}" alt=""></div>
            <div><b>${esc(p.user)}</b><small>${[p.place, p.time].filter(Boolean).map(esc).join(' · ')}</small></div>
          </div>
          <div class="ph" style="background:${p.g || '#000'}">${p.imgs ? `
            <img class="pimg" src="${p.imgs[0]}" data-pi="${i}" data-ci="0" draggable="false" alt="">
            ${p.imgs.length > 1 ? `
              <button class="psl l" aria-label="上一张" onclick="App.pslide(${i},-1)"></button>
              <button class="psl r" aria-label="下一张" onclick="App.pslide(${i},1)"></button>
              <div class="pcnt">1/${p.imgs.length}</div>
              <div class="phdots">${p.imgs.map((_, k) => `<i class="${k ? '' : 'on'}"></i>`).join('')}</div>` : ''}` : '照片待添加'}</div>
          <div class="acts">
            <button class="like" data-n="${p.likes}" onclick="App.like(this)">${HEART}<b>${p.likes}</b></button>
            <button onclick="App.comments(${i})">${INFO}<b>${p.comments}</b></button>
          </div>
          ${p.likedBy ? `<div class="likedby"><b>${esc(p.likedBy)}</b> 赞过</div>` : ''}
          ${p.caption || p.comments ? `<div class="cap">${p.caption ? `<b>${esc(p.user)}</b>${esc(p.caption)}` : ''}
            ${p.comments ? `<span class="cm" onclick="App.comments(${i})">查看全部 ${p.comments} 条评论</span>` : ''}</div>` : ''}
        </div>`).join('')}
    </div>
    ${tabbar(IG_TABS, 0, false, IG_ICONS)}`
});

/* 帖子逐条弹出：弹窗 + 震动，点弹窗进 Instagram */
function refreshIG(scrollToLast) {
  const pg = [...APP.querySelectorAll('.page.ig')].pop();
  if (!pg) return;
  pg.innerHTML = VIEWS.instagram().html;
  if (!scrollToLast) return;
  const posts = pg.querySelectorAll('.post'), sc = pg.querySelector('.scroll');
  const last = posts[posts.length - 1];
  if (last && sc) sc.scrollTop = last.offsetTop - 66;
}
/* 点弹窗：进 Instagram 并滚到这条帖子 */
let igPopIdx = -1;   // 最近弹窗提示的帖子下标
function igTap() {
  if (view === 'lock' || view === 'pin') return;
  if (curApp === 'instagram') {
    const pg = [...APP.querySelectorAll('.page.ig')].pop();
    const k = igVisible.indexOf(igPopIdx);
    const posts = pg && pg.querySelectorAll('.post'), sc = pg && pg.querySelector('.scroll');
    const tgt = posts && posts[k >= 0 ? k : posts.length - 1];
    if (tgt && sc) sc.scrollTo({ top: tgt.offsetTop - 66, behavior: 'smooth' });
    return;
  }
  if (view === 'home') { open('instagram'); return; }
  close();
  setTimeout(() => { if (view === 'home') open('instagram'); }, 460);
}
function igBanner(i) {
  const p = DATA.instagram.posts[i];
  igPopIdx = i;
  vib([16, 55, 16]);
  showBanner('igchat', { name: p.user }, p.caption ? p.caption : '发布了新的帖子', igTap);
}
function igNext() {
  const next = igVisible.length ? Math.max(...igVisible) + 1 : 0;
  if (next >= DATA.instagram.posts.length) return;
  igVisible.push(next);
  igVisible.sort((a, b) => a - b);
  refreshIG(true);
  igBanner(next);
}

/* 编号 → 数组下标（信息流顺序与编号不是同一件事） */
const igIndex = n => DATA.instagram.posts.findIndex(p => p.no === n);

/* 指定弹出第 n 条帖子：信息流只保留这一条 */
function igShow(n) {
  const i = igIndex(n);
  if (i < 0) return;
  igVisible = [i];
  refreshIG(true);
  igBanner(i);
}

/* 剧本条目：信息流只保留 list 里的帖子，并弹窗提示第 pop 条 */
function igApply(list, pop) {
  igVisible = (list || []).map(igIndex).filter(i => i >= 0).sort((a, b) => a - b);
  refreshIG(false);
  const i = pop ? igIndex(pop) : -1;
  if (i >= 0) igBanner(i);
}

/* 评论区 */
const cmtHTML = c => `<div class="cmt">
  <div class="av round" style="background:${avBg(c)}">${avIn(c)}</div>
  <div class="cbody"><div class="cl"><b>${esc(c.user)}</b><span>${esc(c.time)}</span></div>
    <div class="ct">${c.replyTo ? `<i class="rto">回复 @${esc(c.replyTo)}：</i>` : ''}${esc(c.text)}</div><div class="cf">回复 · ${c.likes || 0} 个赞</div></div>
</div>`;

function openComments(i) {
  const p = DATA.instagram.posts[i];
  if (!p || view !== 'app') return;
  p.commentList = p.commentList || [];
  const pg = document.createElement('div');
  pg.className = 'page comments';
  pg.innerHTML = `
    <div class="nav"><button class="back">${BACK}<span>返回</span></button><div class="ttl">评论</div><span></span></div>
    <div class="scroll" id="cmtScroll">
      <div class="cpost"><div class="cph" style="background:${p.g || '#000'}">${p.imgs ? `<img loading="lazy" decoding="async" src="${p.imgs[0]}" alt="">` : ''}</div>
        <div class="ccap"><b>${esc(p.user)}</b>${esc(p.caption)}</div></div>
      <div class="cmtlist" id="cmtList">${p.commentList.map(cmtHTML).join('')}</div>
    </div>
    <div class="inputbar"><input id="cmtIn" type="text" placeholder="添加评论…" autocomplete="off"><button class="send">发布</button></div>`;
  APP.appendChild(pg);
  pg.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: 340, easing: EASE });
  pg.querySelector('.back').onclick = () => popPage(pg);
  setChrome('dark');

  const list = pg.querySelector('#cmtList');
  const sc = pg.querySelector('#cmtScroll');
  const inp = pg.querySelector('#cmtIn');
  const send = () => {
    const text = inp.value.trim();
    if (!text) return;
    const c = { user: 'arno', color: '#4a90e2', img: DATA.ownerAv, text, time: '现在', likes: 0 };
    p.commentList.push(c);
    p.comments = p.commentList.length;
    list.insertAdjacentHTML('beforeend', cmtHTML(c));
    inp.value = '';
    sc.scrollTop = sc.scrollHeight;
  };
  pg.querySelector('.send').onclick = send;
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); send(); } });
}

/* 私信列表 */
function dmsList() {
  if (view !== 'app') return;
  const pg = document.createElement('div');
  pg.className = 'page dm-list';
  pg.innerHTML = `
    <div class="nav"><button class="back">${BACK}<span>返回</span></button><div class="ttl">私信</div><span></span></div>
    <div class="scroll">
      <div class="dmhead"><div class="av round" style="background:#e5e5ea"><img loading="lazy" decoding="async" src="${DATA.ownerAv}" alt=""></div><b>arno</b></div>
      ${DATA.instagram.dms.map((d, i) => `
        <div class="row" data-src="igchat" data-name="${esc(d.name)}" onclick="App.dm(${i})">
          <div class="av round" style="background:${avBg(d)}">${avIn(d)}</div>
          <div class="rinfo"><div class="rtop"><b>${esc(d.name)}</b><small>${esc(d.time)}</small></div>
            <div class="rbot"><span>${esc(d.preview)}</span>${d.unread ? `<i class="bdg">${d.unread}</i>` : ''}</div></div>
        </div>`).join('')}
    </div>`;
  APP.appendChild(pg);
  pg.animate([{ transform: 'translateX(100%)' }, { transform: 'none' }], { duration: 340, easing: EASE });
  pg.querySelector('.back').onclick = () => popPage(pg);
  setChrome('dark');
}

/* 快拍查看器 */
let storyIdx = 0, storyFrame = 0, storyTm = null;
function story(i) {
  if (view !== 'app') return;
  storyIdx = i; storyFrame = 0;
  renderStory();
  setChrome('light');
}
function renderStory() {
  const s = DATA.instagram.stories[storyIdx];
  if (!s) return closeStory();
  const f = s.frames[storyFrame];
  OV.innerHTML = `
    <div class="sv">
      <div class="svbars">${s.frames.map((_, k) =>
        `<i class="${k < storyFrame ? 'done' : k === storyFrame ? 'act' : ''}"><span></span></i>`).join('')}</div>
      <div class="svhead">
        <div class="av round" style="background:${avBg(s)}">${avIn(s)}</div>
        <b>${esc(s.name)}</b><small>${s.time ? esc(s.time) + ' · ' : ''}${storyFrame + 1}/${s.frames.length}</small>
        <button class="svx" aria-label="关闭" onclick="App.closeStory()">${CLOSE_X}</button>
      </div>
      <div class="svimg" style="background:${f.g || '#000'}">${f.img ? `<img class="svphoto" src="${f.img}" alt="">` : ''}<div class="svtxt">${esc(f.text || '')}</div>
        ${f.comments ? `<div class="svcmts">${f.comments.map(c => `
          <div class="svcmt"><div class="av round" style="background:${avBg(c)}">${avIn(c)}</div><span><b>${esc(c.user)}</b>${esc(c.text)}</span></div>`).join('')}</div>` : ''}
      </div>
      <button class="svhit l" aria-label="上一条" onclick="App.storyPrev()"></button>
      <button class="svhit r" aria-label="下一条" onclick="App.storyNext()"></button>
    </div>`;
  dotStory();
}
function dotStory() {
  clearInterval(storyTm);
  storyTm = setInterval(() => storyNext(), 5000);
}
function storyNext() {
  const s = DATA.instagram.stories[storyIdx];
  if (storyFrame < s.frames.length - 1) { storyFrame++; renderStory(); return; }
  if (storyIdx < DATA.instagram.stories.length - 1) { storyIdx++; storyFrame = 0; renderStory(); return; }
  closeStory();
}
function storyPrev() {
  if (storyFrame > 0) { storyFrame--; renderStory(); return; }
  if (storyIdx > 0) { storyIdx--; storyFrame = DATA.instagram.stories[storyIdx].frames.length - 1; renderStory(); return; }
  closeStory();
}
function closeStory() {
  clearInterval(storyTm); storyTm = null;
  OV.innerHTML = '';
  setChrome('dark');
}

/* ---------- X ---------- */
VIEWS.x = () => {
  const u = DATA.x.profile;
  const lockTip = `App.toast('私密账号 · 仅自己可见')`;
  return {
    cls: 'x dark',
    html: `
      <div class="nav"><span class="navL"></span><div class="ttl">个人主页</div><span class="navR"></span></div>
      <div class="scroll">
        <div class="xbanner"></div>
        <div class="xhead"><div class="xav">${PERSON_AV}</div></div>
        <div class="xid">
          <div class="xname">${esc(u.name)}<span class="xlockico">${LOCK_ICON}</span></div>
          <div class="xhandle">${esc(u.handle)}</div>
        </div>
        <div class="xlockrow">${LOCK_ICON}<span>私密账号 · 你的日记只有你能看到</span></div>
        <div class="xbio">${esc(u.bio)}</div>
        <div class="xstats">
          <span><b>${u.posts}</b> 帖子</span>
          <span><b>${u.followers}</b> 关注者</span>
          <span><b>${u.following}</b> 正在关注</span>
        </div>
        <div class="xtabs">
          <button class="on">日记</button>
          <button onclick="${lockTip}">回复</button>
          <button onclick="${lockTip}">媒体</button>
          <button onclick="${lockTip}">喜欢</button>
        </div>
        ${DATA.x.diary.map(d => `
          <div class="xditem${xNew.indexOf(d) >= 0 ? ' nx' : ''}">
            <div class="xdmeta">${LOCK_ICON}<span>仅自己可见</span><span class="xdate">${esc(d.date)}</span></div>
            <div class="xdtext">${esc(d.text)}</div>
          </div>`).join('')}
      </div>`
  };
};

/* ---------- 相册 ---------- */
VIEWS.photos = () => ({
  cls: 'photos',
  html: `
    <div class="nav"><span class="navL"></span><div class="ttl">相册</div><span class="navR">选择</span></div>
    <div class="scroll">
      <div class="pmeta">最近项目 · ${DATA.photos.length} 张</div>
      <div class="pgrid">${DATA.photos.map((p, i) => `
        <div class="ptile" onclick="App.photo(${i})"><img loading="lazy" decoding="async" src="${p.img}" alt=""></div>`).join('')}
      </div>
    </div>`
});

function photo(i) {
  const p = DATA.photos[i];
  if (!p) return;
  OV.innerHTML = `
    <div class="viewer">
      <div class="vtop"><button class="vclose" onclick="App.closeViewer()">关闭</button><span>${i + 1} / ${DATA.photos.length}</span></div>
      <div class="vi"><img class="vimg" src="${p.img}" alt=""></div>
    </div>`;
  setChrome('light');
}
function closeViewer() {
  OV.innerHTML = '';
  setChrome(curApp === 'x' ? 'light' : 'dark');
}

/* ---------- 电话 ---------- */
VIEWS.phone = () => {
  const uniq = [];
  DATA.recents.forEach(r => { if (!uniq.find(x => x.name === r.name)) uniq.push(r); });
  return {
    cls: 'phone',
    html: `
      <div class="nav"><span class="navL"></span><div class="ttl">电话</div><span class="navR">＋</span></div>
      <div class="seg"><button class="on" data-pane="recent">最近</button><button data-pane="contacts">联系人</button></div>
      <div class="scroll" id="phonePane">${DATA.recents.map(r => `
        <div class="row" onclick="App.call('${esc(r.name)}','${r.color}')">
          <div class="ic2">${PHONE_ICON}</div>
          <div class="rinfo">
            <div class="rtop"><b>${esc(r.name)}</b><small>${esc(r.time)}</small></div>
            <div class="rbot"><span>${esc(r.type)}</span></div>
          </div>
          <span style="color:#c7c7cc">${INFO}</span>
        </div>`).join('')}
      </div>`,
    init(pg) {
      const pane = pg.querySelector('#phonePane');
      const recentHTML = pane.innerHTML;
      const contactsHTML = uniq.map(c => `
        <div class="row" onclick="App.call('${esc(c.name)}','${c.color}')">
          <div class="av round" style="background:${avBg(c)}">${avIn(c)}</div>
          <div class="rinfo"><div class="rtop"><b>${esc(c.name)}</b></div></div>
        </div>`).join('');
      pg.querySelectorAll('.seg button').forEach(b => {
        b.onclick = () => {
          pg.querySelectorAll('.seg button').forEach(x => x.classList.remove('on'));
          b.classList.add('on');
          pane.innerHTML = b.dataset.pane === 'recent' ? recentHTML : contactsHTML;
        };
      });
    }
  };
};

function call(name, color) {
  if (view !== 'app' || APP.querySelector('.callpage')) return;
  const pg = document.createElement('div');
  pg.className = 'page callpage';
  pg.innerHTML = `
    <div class="ctop">
      <div class="cav" style="background:${color}">${esc(name[0])}</div>
      <h2>${esc(name)}</h2>
      <div class="st">正在呼叫…</div>
    </div>
    <button class="cbtn" aria-label="挂断">${PHONE_ICON}</button>`;
  APP.appendChild(pg);
  pg.animate([{ opacity: 0, transform: 'scale(1.06)' }, { opacity: 1, transform: 'none' }],
    { duration: 300, easing: EASE });
  setChrome('light');

  pg.querySelector('.cbtn').onclick = () => endCall(pg);
  callTimer = setTimeout(() => {
    const st = pg.querySelector('.st');
    if (!st) return;
    let s = 0;
    st.textContent = '00:00';
    callIv = setInterval(() => {
      s++;
      st.textContent = pad(Math.floor(s / 60)) + ':' + pad(s % 60);
    }, 1000);
  }, 1800);
}

function endCall(pg) {
  clearTimeout(callTimer); clearInterval(callIv);
  pg.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 240, fill: 'forwards' })
    .onfinish = () => pg.remove();
  setChrome(curApp === 'x' ? 'light' : 'dark');
}

/* ---------- 点赞 ---------- */
function like(btn, hard) {
  const on = btn.classList.toggle('on');
  const n = +btn.dataset.n || 0;
  btn.querySelector('b').textContent = n + (on ? 1 : 0);
  vib(6);
}

/* 帖子多图切换 */
function pslide(i, dir) {
  const p = DATA.instagram.posts[i];
  const img = document.querySelector(`.pimg[data-pi="${i}"]`);
  if (!img || !p.imgs) return;
  const n = p.imgs.length;
  const ci = (+img.dataset.ci + dir + n) % n;
  img.dataset.ci = ci;
  img.src = p.imgs[ci];
  const ph = img.closest('.ph');
  const cnt = ph.querySelector('.pcnt');
  if (cnt) cnt.textContent = `${ci + 1}/${n}`;
  ph.querySelectorAll('.phdots i').forEach((d, k) => d.classList.toggle('on', k === ci));
}

/* 帖子多图：左右滑动切换 */
let phDrag = null;
SCREEN.addEventListener('pointerdown', e => {
  const img = e.target.closest('.pimg');
  if (!img) return;
  const p = DATA.instagram.posts[+img.dataset.pi];
  if (!p || !p.imgs || p.imgs.length < 2) return;
  phDrag = { pi: +img.dataset.pi, x0: e.clientX, dx: 0 };
});
addEventListener('pointermove', e => { if (phDrag) phDrag.dx = e.clientX - phDrag.x0; });
addEventListener('pointerup', () => {
  if (!phDrag) return;
  const d = phDrag;
  phDrag = null;
  if (Math.abs(d.dx) > 42) pslide(d.pi, d.dx < 0 ? 1 : -1);
  if (Math.abs(d.dx) > 8) {
    const kill = ev => { ev.stopPropagation(); ev.preventDefault(); };
    SCREEN.addEventListener('click', kill, { capture: true, once: true });
    setTimeout(() => SCREEN.removeEventListener('click', kill, { capture: true }), 60);
  }
});

/* ---------- 剧情播放 ---------- */
let playQ = [], playIdx = 0, playPending = null, playOn = false, playTimer = null, playStarted = false;
let playGate = false;   // gate:'back' 时停下，等 Arno 自己返回聊天列表
let homeGate = null;    // gate:'home' 时停下，等 Arno 自己回到桌面再执行
let openGate = null;    // gate:'open' 时停下，等 Arno 解锁并进入指定会话再继续

const PLAY_APP = {
  wechat: ['微信', ICONS.wechat, 'wechat', '#07c160'],
  kakao:  ['KakaoTalk', ICONS.kakao, 'kakao', '#fee500'],
  sms:    ['短信', ICONS.messages, 'messages', '#34c759'],
  igchat: ['Instagram', ICONS.instagram, 'instagram', 'radial-gradient(circle at 28% 108%,#ffd776 0%,#f56040 32%,#c13584 58%,#6228d7 100%)']
};

function findConvo(src, name) {
  const arr = src === 'igchat' ? DATA.instagram.dms : DATA[src];
  if (!arr) return null;
  const i = arr.findIndex(c => c.name === name);
  return i < 0 ? null : { c: arr[i], i };
}

/* 顶部弹窗提醒 */
let bannerTm = null;
function showBanner(src, c, text, onTap) {
  const meta = PLAY_APP[src] || ['', '', ''];
  let b = $('#banner');
  if (!b) {
    b = document.createElement('div');
    b.id = 'banner';
    SCREEN.appendChild(b);
  }
  b.innerHTML = `
    <div class="bic" style="background:${meta[3]}">${meta[1]}</div>
    <div class="btx">
      <div class="bh"><b>${esc(meta[0])}</b><span>现在</span></div>
      <div class="bn">${esc(c.name)}</div>
      <div class="bt">${esc(text)}</div>
    </div>`;
  b.onclick = () => { hideBanner(); onTap && onTap(); };
  /* 锁屏上的弹窗下移，避免盖住时间 */
  b.classList.toggle('lk', view === 'lock' || view === 'pin');
  b.classList.remove('on'); void b.offsetWidth; b.classList.add('on');
  vib(12);
  clearTimeout(bannerTm);
  bannerTm = setTimeout(hideBanner, 2600);
}
function hideBanner() { const b = $('#banner'); if (b) b.classList.remove('on'); }

/* 轮到 Arno 时，聊天列表里对应的会话闪黄光；对方发信息 / 剧本暂停时熄灭 */
function syncRowNeed() {
  APP.querySelectorAll('.row.need').forEach(r => r.classList.remove('need'));
  if (!playPending) return;
  const r = [...APP.querySelectorAll('.row')].find(x =>
    x.dataset.src === playPending.src && x.dataset.name === playPending.name);
  if (r) r.classList.add('need');
}

/* ---------- X 日记更新（均为私密） ---------- */
let xArmed = false;
let playWaitX = false;   // 剧本暂停，等 Arno 进入 X 看完新日记再继续

/* 新增一条日记：插入列表最上方（越新的越靠上）；
   界面不在主屏幕时先让「返回键」闪烁，回到桌面后 X 图标闪黑光 */
function xDiaryUpdate(post) {
  if (!post) return;
  DATA.x.diary.unshift(post);
  DATA.x.profile.posts = (DATA.x.profile.posts || 0) + 1;
  xNew.push(post);
  xArmed = true;
  syncXGate();
  /* 已经停在 X 里：直接重绘主页并播放跳出动画 */
  if (view === 'app' && curApp === 'x') {
    const pg = [...APP.querySelectorAll('.page.x')].pop();
    if (pg) { pg.innerHTML = VIEWS.x().html; revealXDiary(pg); }
  }
}

/* 闪烁目标：在 App 内 → 状态栏「‹ 主页」；在桌面 → X 图标外框 */
function syncXGate() {
  const onApp = xArmed && view === 'app';
  $('#sbHome').classList.toggle('needx', onApp);
  const ic = HOME.querySelector('.app[data-app="x"] .ic');
  if (ic) ic.classList.toggle('xglow', xArmed && view === 'home');
}

/* 进入 X 后，更新的日记自下而上逐条跳出 */
function revealXDiary(pg) {
  if (!xArmed) return;
  const items = [...pg.querySelectorAll('.xditem.nx')];
  xArmed = false;
  const pending = xNew.slice();
  xNew = [];
  syncXGate();
  items.forEach((el, i) => {
    /* 列表靠下的先出现：DOM 越靠后延迟越小 */
    const delay = 470 + (items.length - 1 - i) * 190;
    el.animate([
      { opacity: 0, transform: 'translateY(24px) scale(.94)' },
      { opacity: 1, transform: 'none' }
    ], { duration: 430, delay, easing: 'cubic-bezier(.2,1.1,.3,1)', fill: 'backwards' });
  });
  if (pending.length) setTimeout(() => vib([14, 60, 14]), 470);
  /* 剧本正等着看日记：看完后继续下一步 */
  if (playWaitX) { playWaitX = false; playTimer = setTimeout(playStep, 1700); }
}

/* 同步聊天列表里的预览/时间/未读 */
function patchRow(src, c) {
  [...APP.querySelectorAll('.row')].forEach(r => {
    if (src && r.dataset.src !== src) return;
    const nm = r.querySelector('.rtop b');
    if (!nm || nm.textContent !== c.name) return;
    const sm = r.querySelector('.rtop small');
    if (sm) sm.textContent = c.time;
    const pv = r.querySelector('.rbot span');
    if (pv) pv.textContent = c.preview;
    let bdg = r.querySelector('.bdg');
    if (c.unread) {
      if (!bdg) { bdg = document.createElement('i'); bdg.className = 'bdg'; r.querySelector('.rbot').appendChild(bdg); }
      bdg.textContent = c.unread;
    } else if (bdg) bdg.remove();
  });
}

function openToConvo(src, i) {
  const meta = PLAY_APP[src];
  if (!meta || view === 'lock' || view === 'pin') return;
  const app = meta[2];
  if (view === 'home') { open(app); setTimeout(() => openStep(src, i), 480); return; }
  if (view !== 'app') return;
  if (curApp === app) { openStep(src, i); return; }
  /* 弹窗来自另一个 App：先退出当前 App，再打开目标 App 的会话 */
  close();
  setTimeout(() => {
    if (view !== 'home') return;
    open(app);
    setTimeout(() => openStep(src, i), 480);
  }, 470);
}
function openStep(src, i) {
  if (src === 'igchat') openConvo('igchat', DATA.instagram.dms[i]);
  else openChat(src, i);
}

function playStart() {
  if (!DATA.play || !DATA.play.length) { toast('还没有剧本内容'); return; }
  playQ = DATA.play.slice();
  playIdx = 0; playOn = true; playPending = null; playGate = false; playWaitX = false;
  homeGate = null; openGate = null; $('#hb').classList.remove('needh');
  playStep();
}
function playStop() {
  playOn = false; playPending = null; playGate = false; playWaitX = false;
  homeGate = null; openGate = null; $('#hb').classList.remove('needh');
  clearTimeout(playTimer); syncRowNeed();
  APP.querySelectorAll('.back.blink').forEach(b => b.classList.remove('blink'));
}

/* gate:'back' 之后，Arno 返回聊天列表 → 继续剧本 */
function releaseGate() {
  if (!playGate) return;
  playGate = false;
  APP.querySelectorAll('.back.blink').forEach(b => b.classList.remove('blink'));
  clearTimeout(playTimer);
  playTimer = setTimeout(playStep, 700);
}

/* gate:'home' 之后，Arno 回到桌面 → 执行对应动作（加提醒事项）并继续剧本 */
function applyHomeGate() {
  if (!homeGate) return;
  const g = homeGate;
  homeGate = null;
  $('#hb').classList.remove('needh');
  if (g.reminder) addReminder(g.reminder);
  clearTimeout(playTimer);
  playTimer = setTimeout(playStep, 1100);
}

function playStep() {
  if (!playOn) return;
  if (playIdx >= playQ.length) {
    playOn = false; playPending = null;
    syncRowNeed();
    return;
  }
  const s = playQ[playIdx];

  /* 聊天结束：返回键闪烁，等 Arno 自己返回列表 */
  if (s.gate === 'back') {
    playIdx++;
    playPending = null;
    syncRowNeed();
    const back = (curConvo && curConvo.src === s.src && curConvo.c.name === s.name)
      ? curConvo.pg.querySelector('.back') : null;
    if (back) {
      playGate = true;
      back.classList.add('blink');
      return;
    }
    playTimer = setTimeout(playStep, 500);
    return;
  }

  /* 回到桌面：Home 条闪烁，Arno 回到桌面后再加提醒事项 */
  if (s.gate === 'home') {
    playIdx++;
    playPending = null;
    syncRowNeed();
    homeGate = { reminder: s.reminder || '' };
    if (view === 'home') {
      playTimer = setTimeout(applyHomeGate, 600);
    } else {
      $('#hb').classList.add('needh');
    }
    return;
  }

  /* 等 Arno 解锁并进入指定会话后再继续（第一步群聊：弹窗后停留在锁屏） */
  if (s.gate === 'open') {
    playIdx++;
    playPending = null;
    syncRowNeed();
    openGate = { src: s.src, name: s.name };
    if (curConvo && curConvo.src === s.src && curConvo.c.name === s.name) {
      openGate = null;
      playTimer = setTimeout(playStep, 700);
    }
    return;
  }

  /* Instagram 信息流更新：只保留指定帖子，并弹窗提示 */
  if (s.igshow) {
    igApply(s.igshow, s.igpop);
    playIdx++;
    playPending = null;
    syncRowNeed();
    /* 留足时间让 Arno 看到并点开弹窗，再继续下一段 */
    playTimer = setTimeout(playStep, 3000);
    return;
  }

  /* X 日记更新：写入并等待 Arno 自己回到桌面进入 X 查看 */
  if (s.xpost) {
    playIdx++;
    playPending = null;
    syncRowNeed();
    const nx = playQ[playIdx];
    /* 连续多条日记：先一起写入，最后一条再等 Arno 去 X 查看 */
    playWaitX = !(nx && nx.xpost);
    xDiaryUpdate(s.xpost);
    if (!playWaitX) playTimer = setTimeout(playStep, 1400);
    return;
  }

  const f = findConvo(s.src, s.name);
  if (!f) { playIdx++; playTimer = setTimeout(playStep, 100); return; }

  if (s.me) {
    /* 轮到 Arno：仅输入框闪蓝，不弹任何提示 */
    playPending = s;
    syncRowNeed();
    if (curConvo && curConvo.c === f.c) curConvo.syncNeed();
    return;
  }

  /* 对方 / 群成员消息 */
  const t = s.time || clockNow();
  const m = { me: false, text: s.text, time: t };
  if (s.img) m.img = s.img;
  if (s.from) m.from = s.from;
  f.c.msgs.push(m);
  f.c.preview = s.img ? '［图片］' : (s.from ? s.from + '：' : '') + s.text;
  f.c.time = t;

  if (curConvo && curConvo.c === f.c) {
    curConvo.msgs.insertAdjacentHTML('beforeend', bubbleHTML(m));
    curConvo.msgs.scrollTop = curConvo.msgs.scrollHeight;
    curConvo.syncNeed();
  } else {
    f.c.unread = (f.c.unread || 0) + 1;
    patchRow(s.src, f.c);
    showBanner(s.src, f.c, s.img ? '［图片］' : (s.from ? s.from + '：' : '') + s.text, () => {
      f.c.unread = 0;
      openToConvo(s.src, f.i);
    });
  }
  playIdx++;
  const nx = playQ[playIdx];
  syncRowNeed();
  playTimer = setTimeout(playStep, nx && !nx.me ? 1200 : 700);
}

/* ---------- Toast ---------- */
let toastTm = null;
function toast(msg) {
  const el = $('#toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTm);
  toastTm = setTimeout(() => el.classList.remove('on'), 1600);
}

/* ---------- 尺寸 ---------- */
function fit() {
  const mob = innerWidth <= 540;
  PHONE.classList.toggle('mob', mob);
  if (mob) {
    PHONE.style.width = innerWidth + 'px';
    PHONE.style.height = innerHeight + 'px';
    PHONE.style.transform = '';
    SC = 1;
  } else {
    PHONE.style.width = '393px';
    PHONE.style.height = '852px';
    SC = Math.min((innerHeight - 48) / 852, (innerWidth - 48) / 393, 1.1);
    PHONE.style.transform = `scale(${SC})`;
  }
}

/* ---------- 时钟 ---------- */
function tick() {
  const d = new Date();
  const t = timeStr(d);
  const lkt = $('#lkt');
  if (lkt) lkt.textContent = t;
  $('#sbTime').textContent = t;
  const ld = document.querySelector('.lk-date');
  if (ld) ld.textContent = `${monthDay(d)} ${weekday(d)}`;
}

/* ---------- 启动 ---------- */
function boot() {
  const w = DATA.wallpaper || {};
  if (w.home) $('#wallHome').style.backgroundImage = `url("${w.home}")`;
  if (w.lock) $('#wallLock').style.backgroundImage = `url("${w.lock}")`;

  renderLock();
  fit();
  setChrome('light');
  tick();
  setInterval(tick, 10000);

  /* 有剧本时，开机（锁屏状态）即开始播放，KakaoTalk 弹窗会出现在锁屏上 */
  if (!playStarted && DATA.play && DATA.play.length) {
    playStarted = true;
    setTimeout(playStart, 1800);
  }

  $('#hb').addEventListener('click', () => {
    if (view === 'app') home();
  });
  addEventListener('resize', fit);
  addEventListener('orientationchange', () => setTimeout(fit, 120));
}

window.App = {
  open, back, home, chat: openChat, call, like, photo, closeViewer,
  comments: openComments, dms: dmsList, dm: i => openConvo('igchat', DATA.instagram.dms[i]),
  story, storyNext, storyPrev, closeStory, pslide,
  playStart, playStop, igNext, igShow, xDiary: xDiaryUpdate,
  pinKey, pinAction, pinCancel, goPin, toast
};

boot();
})();
