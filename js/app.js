/* ============================================
   KisanConnect - Core Application JS
   Language switching, TTS, utilities
   ============================================ */

/* --- Language System --- */
const App = {
  lang: localStorage.getItem('kc_lang') || 'en',

  t(key) {
    if (typeof TRANSLATIONS !== 'undefined' && TRANSLATIONS[key]) {
      return TRANSLATIONS[key][this.lang] || TRANSLATIONS[key]['en'] || key;
    }
    return key;
  },

  setLang(lang) {
    this.lang = lang;
    localStorage.setItem('kc_lang', lang);
    this.updateAllText();
  },

  toggleLang() {
    this.setLang(this.lang === 'en' ? 'hi' : 'en');
  },

  updateAllText() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = this.t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      el.placeholder = this.t(key);
    });
    const langBtn = document.querySelector('.lang-toggle');
    if (langBtn) {
      langBtn.textContent = this.lang === 'en' ? 'हिन्दी' : 'English';
    }
  },

  init() {
    this.updateAllText();
  }
};

/* --- Text-to-Speech System --- */
const Voice = {
  speaking: false,

  speak(text, lang) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferred = voices.find(v => v.lang.startsWith(lang === 'hi' ? 'hi' : 'en'));
    if (preferred) utterance.voice = preferred;

    utterance.onstart = () => {
      this.speaking = true;
      document.querySelectorAll('.voice-btn').forEach(b => b.classList.add('speaking'));
    };
    utterance.onend = () => {
      this.speaking = false;
      document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('speaking'));
    };

    window.speechSynthesis.speak(utterance);
  },

  speakKey(key) {
    const text = App.t(key);
    this.speak(text, App.lang);
  },

  stop() {
    window.speechSynthesis.cancel();
    this.speaking = false;
    document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('speaking'));
  }
};

/* Load voices */
if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
}

/* --- Session Management --- */
const Session = {
  set(user) {
    localStorage.setItem('kc_session', JSON.stringify(user));
  },

  get() {
    const data = localStorage.getItem('kc_session');
    return data ? JSON.parse(data) : null;
  },

  clear() {
    localStorage.removeItem('kc_session');
  },

  isLoggedIn() {
    return !!this.get();
  },

  requireAuth(allowedRoles) {
    const user = this.get();
    if (!user) {
      window.location.href = 'login.html';
      return null;
    }
    if (allowedRoles && !allowedRoles.includes(user.role)) {
      window.location.href = 'index.html';
      return null;
    }
    return user;
  }
};

/* --- Cart Management --- */
const Cart = {
  get() {
    const data = localStorage.getItem('kc_cart');
    return data ? JSON.parse(data) : [];
  },

  add(item) {
    const cart = this.get();
    const existing = cart.find(c => c.id === item.id);
    const addQty = item.qty || item.minPurchase || 1;
    const maxPurchase = item.maxPurchase || item.quantity || 999999;
    let limitReached = false;
    if (existing) {
      const nextQty = (existing.qty || addQty) + addQty;
      existing.qty = Math.min(nextQty, maxPurchase);
      if (nextQty > maxPurchase) {
        limitReached = true;
      }
    } else {
      cart.push({ ...item, qty: Math.min(addQty, maxPurchase) });
    }
    localStorage.setItem('kc_cart', JSON.stringify(cart));
    this.updateBadge();
    Toast.show(limitReached ? 'Maximum purchase limit reached for one order' : App.t('add_to_cart') + '!', limitReached ? 'error' : 'success');
  },

  remove(id) {
    const cart = this.get().filter(c => c.id !== id);
    localStorage.setItem('kc_cart', JSON.stringify(cart));
    this.updateBadge();
  },

  clear() {
    localStorage.setItem('kc_cart', JSON.stringify([]));
    this.updateBadge();
  },

  total() {
    return this.get().reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0);
  },

  count() {
    return this.get().reduce((sum, item) => sum + (item.qty || 1), 0);
  },

  updateBadge() {
    document.querySelectorAll('.cart-count').forEach(el => {
      const count = this.count();
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

/* --- Toast Notifications --- */
const Toast = {
  show(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
};

/* --- Animated Counter --- */
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const counter = setInterval(() => {
    start += step;
    if (start >= target) {
      element.textContent = formatNumber(target);
      clearInterval(counter);
    } else {
      element.textContent = formatNumber(Math.floor(start));
    }
  }, 16);
}

function formatNumber(num) {
  if (num >= 100000) return (num / 100000).toFixed(1) + 'L';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString('en-IN');
}

/* --- SVG Icons --- */
const Icons = {
  leaf: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.9C15.5 4.9 17 3.5 19 2c1 2 2 4.5 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  cart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.36-5.43H5.12"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  package: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  wallet: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/></svg>',
  truck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 18V2H4a2 2 0 0 0-2 2v16"/><path d="M14 6h4l4 4v8"/><circle cx="7" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M14 18H9"/><path d="M2 18h3"/></svg>',
  shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
  star: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  volume: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg>',
  barChart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>',
  settings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
  logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>',
  heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  bank: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M3 10h18"/><path d="M12 3a9 9 0 0 0-9 9"/><path d="M12 3a9 9 0 0 1 9 9"/><path d="M3 10l9-7 9 7"/></svg>',
  upi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
  cash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  verified: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#16a34a"/></svg>',
  crop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a10 10 0 0 0 0 20"/><path d="M12 2a10 10 0 0 1 0 20"/><path d="M2 12h20"/></svg>',
  order: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  earnings: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>'
};

/* --- Crop SVG Illustrations --- */
const CropSVGs = {
  potato: `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="45" rx="28" ry="22" fill="#D4A574" stroke="#8B6914" stroke-width="2"/><ellipse cx="30" cy="40" rx="5" ry="3" fill="#C4956A" opacity="0.6"/><ellipse cx="50" cy="48" rx="4" ry="2.5" fill="#C4956A" opacity="0.6"/><ellipse cx="38" cy="52" rx="3" ry="2" fill="#C4956A" opacity="0.5"/><path d="M35 25c0-8 5-15 5-15s5 7 5 15" stroke="#22c55e" stroke-width="2" fill="#4ade80"/></svg>`,
  onion: `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="48" rx="22" ry="24" fill="#FDE68A" stroke="#D97706" stroke-width="2"/><path d="M40 24c0-8 0-16 0-16" stroke="#22c55e" stroke-width="2"/><path d="M36 26c-4-6-2-14-2-14" stroke="#4ade80" stroke-width="1.5"/><path d="M44 26c4-6 2-14 2-14" stroke="#4ade80" stroke-width="1.5"/><ellipse cx="40" cy="48" rx="14" ry="16" fill="#FEF3C7" opacity="0.5"/></svg>`,
  wheat: `<svg viewBox="0 0 80 80" fill="none"><path d="M40 70V20" stroke="#D97706" stroke-width="3"/><path d="M40 20c-8-4-14-12-14-12s8 2 14 8c6-6 14-8 14-8s-6 8-14 12z" fill="#FDE68A" stroke="#D97706" stroke-width="1.5"/><path d="M40 35c-6-3-10-9-10-9s6 1.5 10 6c4-4.5 10-6 10-6s-4 6-10 9z" fill="#FDE68A" stroke="#D97706" stroke-width="1.5"/><path d="M40 50c-5-2.5-8-7-8-7s5 1 8 5c3-4 8-5 8-5s-3 4.5-8 7z" fill="#FDE68A" stroke="#D97706" stroke-width="1.5"/></svg>`,
  soyabean: `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="40" cy="45" rx="18" ry="24" fill="#86efac" stroke="#16a34a" stroke-width="2"/><ellipse cx="40" cy="45" rx="10" ry="16" fill="#4ade80" opacity="0.5"/><circle cx="35" cy="38" r="3" fill="#16a34a" opacity="0.4"/><circle cx="45" cy="42" r="2.5" fill="#16a34a" opacity="0.4"/><circle cx="38" cy="52" r="2.5" fill="#16a34a" opacity="0.4"/><path d="M35 23c0-6 5-13 5-13s5 7 5 13" stroke="#22c55e" stroke-width="2" fill="#4ade80"/></svg>`,
  pulses: `<svg viewBox="0 0 80 80" fill="none"><ellipse cx="30" cy="50" rx="12" ry="10" fill="#FDE68A" stroke="#D97706" stroke-width="2"/><ellipse cx="50" cy="45" rx="12" ry="10" fill="#FBBF24" stroke="#D97706" stroke-width="2"/><ellipse cx="40" cy="60" rx="10" ry="8" fill="#F59E0B" stroke="#D97706" stroke-width="2"/><circle cx="28" cy="48" r="2" fill="#D97706" opacity="0.3"/><circle cx="52" cy="43" r="2" fill="#D97706" opacity="0.3"/><circle cx="38" cy="58" r="2" fill="#D97706" opacity="0.3"/></svg>`,
  tomato: `<svg viewBox="0 0 80 80" fill="none"><circle cx="40" cy="45" r="24" fill="#ef4444" stroke="#dc2626" stroke-width="2"/><circle cx="40" cy="45" r="16" fill="#f87171" opacity="0.4"/><path d="M32 22c4-6 8-8 8-8s4 2 8 8" stroke="#22c55e" stroke-width="2" fill="#4ade80"/><path d="M36 22c2-4 4-5 4-5s2 1 4 5" stroke="#16a34a" stroke-width="1.5" fill="#86efac"/></svg>`,
  rice: `<svg viewBox="0 0 80 80" fill="none"><path d="M40 70V25" stroke="#D97706" stroke-width="3"/><path d="M40 25c-10-5-18-15-18-15s10 3 18 10c8-7 18-10 18-10s-8 10-18 15z" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1.5"/><path d="M40 40c-8-4-14-11-14-11s8 2 14 8c6-6 14-8 14-8s-6 7-14 11z" fill="#f3f4f6" stroke="#9ca3af" stroke-width="1.5"/></svg>`,
  carrot: `<svg viewBox="0 0 80 80" fill="none"><path d="M40 25L30 70c0 0 10 5 20 0L40 25z" fill="#f97316" stroke="#ea580c" stroke-width="2"/><path d="M35 25c-5-8-3-18-3-18" stroke="#22c55e" stroke-width="2"/><path d="M40 25c0-10 0-18 0-18" stroke="#16a34a" stroke-width="2.5"/><path d="M45 25c5-8 3-18 3-18" stroke="#22c55e" stroke-width="2"/><line x1="35" y1="40" x2="45" y2="38" stroke="#ea580c" stroke-width="1" opacity="0.3"/><line x1="34" y1="50" x2="44" y2="48" stroke="#ea580c" stroke-width="1" opacity="0.3"/></svg>`
};

/* --- Delivery Vehicle SVG --- */
const DeliverySVG = `<svg viewBox="0 0 200 100" fill="none" class="delivery-vehicle">
  <rect x="20" y="40" width="100" height="45" rx="8" fill="#22c55e"/>
  <rect x="120" y="25" width="60" height="60" rx="6" fill="#16a34a"/>
  <rect x="130" y="32" width="40" height="25" rx="4" fill="#bbf7d0"/>
  <circle cx="55" cy="90" r="12" fill="#404040"/><circle cx="55" cy="90" r="6" fill="#a3a3a3"/>
  <circle cx="150" cy="90" r="12" fill="#404040"/><circle cx="150" cy="90" r="6" fill="#a3a3a3"/>
  <path d="M10 55h10v20H10z" fill="#f59e0b"/>
</svg>`;

/* --- Star Rating Utilities --- */
function renderStars(rating, size = 16) {
  let html = '<span class="star-rating-display">';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += `<svg class="star filled" viewBox="0 0 24 24" width="${size}" height="${size}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#fbbf24" stroke="#fbbf24" stroke-width="1"/></svg>`;
    } else if (i - 0.5 <= rating) {
      html += `<svg class="star half" viewBox="0 0 24 24" width="${size}" height="${size}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="#fcd34d" stroke="#fcd34d" stroke-width="1"/></svg>`;
    } else {
      html += `<svg class="star" viewBox="0 0 24 24" width="${size}" height="${size}"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="none" stroke="#d4d4d4" stroke-width="1"/></svg>`;
    }
  }
  html += '</span>';
  return html;
}

function renderInteractiveStars(containerId, currentRating = 0) {
  const container = document.getElementById(containerId);
  if (!container) return;
  let html = '<span class="star-rating">';
  for (let i = 1; i <= 5; i++) {
    html += `<svg class="star ${i <= currentRating ? 'filled' : ''}" viewBox="0 0 24 24" width="28" height="28" onclick="setStarRating('${containerId}', ${i})" style="cursor:pointer"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="${i <= currentRating ? '#fbbf24' : 'none'}" stroke="${i <= currentRating ? '#fbbf24' : '#d4d4d4'}" stroke-width="1"/></svg>`;
  }
  html += '</span>';
  container.innerHTML = html;
}

const _starRatings = {};
function setStarRating(containerId, rating) {
  _starRatings[containerId] = rating;
  renderInteractiveStars(containerId, rating);
}
function getStarRating(containerId) { return _starRatings[containerId] || 0; }

/* --- Trust Score Utilities --- */
function renderTrustBar(score, showLabel = true) {
  const cls = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
  return `
    <div style="display:flex;align-items:center;gap:8px">
      ${showLabel ? `<span style="font-weight:700;font-size:0.9rem;color:${score >= 70 ? 'var(--primary-600)' : score >= 40 ? 'var(--warning-600)' : 'var(--error-500)'}">${score}%</span>` : ''}
      <div class="trust-bar" style="flex:1">
        <div class="trust-bar-fill ${cls}" style="width:${score}%"></div>
      </div>
    </div>
  `;
}

function getFarmerById(id) {
  return DEMO_FARMERS.find(f => f.id === id);
}

function getFarmerRating(farmerId) {
  const reviews = DEMO_REVIEWS.filter(r => r.farmerId === farmerId);
  if (reviews.length === 0) return 0;
  return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
}

function getFarmerReviews(farmerId) {
  return DEMO_REVIEWS.filter(r => r.farmerId === farmerId);
}

/* --- Mini Stars for Review Ratings --- */
function renderMiniStars(rating) {
  let html = '<span class="mini-stars">';
  for (let i = 1; i <= 5; i++) {
    html += `<svg class="mini-star" viewBox="0 0 24 24" width="12" height="12"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="${i <= rating ? '#fbbf24' : 'none'}" stroke="${i <= rating ? '#fbbf24' : '#d4d4d4'}" stroke-width="1"/></svg>`;
  }
  html += '</span>';
  return html;
}

/* --- Init on DOM Ready --- */
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  Cart.updateBadge();
});
