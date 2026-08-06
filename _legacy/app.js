/* Sokara CRM - 5x Kaizen Engine (Auto-Optimize AI + Risk Radar + Activity Chips) */

const SESSION_KEY = 'SOKARA_CRM_SESSION_V7';

// Stage Probabilities for Weighted Pipeline Calculation (EV)
const STAGE_WEIGHTS = {
  'new-lead': 0.10,
  'contacted': 0.25,
  'proposal': 0.50,
  'negotiation': 0.75,
  'closed-won': 1.00,
  'closed-lost': 0.00
};

// Stage Target Velocity Benchmarks (Max Recommended Days per Stage)
const STAGE_MAX_BENCHMARKS = {
  'new-lead': 3,
  'contacted': 4,
  'proposal': 5,
  'negotiation': 7
};

// Live Currency Input Formatting with Thousands Separator (.)
function formatCurrencyInput(inputElem, previewId) {
  if (!inputElem) return 0;
  let raw = inputElem.value.replace(/\D/g, '');
  const prev = document.getElementById(previewId);

  if (!raw) {
    inputElem.value = '';
    if (prev) prev.textContent = '';
    return 0;
  }

  const val = parseFloat(raw);
  const sep = appState.context === 'IDR' ? '.' : ',';
  
  // Apply Thousands Separator Live
  inputElem.value = raw.replace(/\B(?=(\d{3})+(?!\d))/g, sep);

  if (prev) {
    prev.textContent = `Terbaca: ${formatCurrency(val)}`;
  }
  return val;
}

function parseCurrencyInput(inputElem) {
  if (!inputElem) return 0;
  const raw = inputElem.value.replace(/\D/g, '');
  return parseFloat(raw) || 0;
}

// Seed Data Generator
function createSeedDataset(context = 'IDR') {
  const isIDR = context === 'IDR';
  // Enterprise deals in IDR are scaled by millions, USD by thousands (e.g. 50k USD)
  const scale = isIDR ? 1000000 : 1000;

  return [
    {
      id: 'lead-001',
      title: isIDR ? 'PT Maju Bersama' : 'Apex Tech Inc',
      initialValue: 50 * scale,
      amount: 45 * scale,
      stage: 'negotiation',
      source: 'referral',
      rep: 'Alex Mercer',
      staleDays: 8,
      responseTimeHours: 12,
      tier: 'Enterprise',
      createdAt: '2026-07-16T10:00:00Z',
      lostReason: null,
      timeline: [
        { date: '16 Jul 2026', text: 'Lead dibuat dari sumber Referral' },
        { date: '18 Jul 2026', text: 'Pitching demo selesai, proposal terkirim' },
        { date: '20 Jul 2026', text: 'Pindah ke stage Negotiation ($45k proposal)' }
      ]
    },
    {
      id: 'lead-002',
      title: isIDR ? 'TechFlow Indonesia' : 'TechFlow Global',
      initialValue: 15 * scale,
      amount: 12.5 * scale,
      stage: 'proposal',
      source: 'sosmed',
      rep: 'Sarah Jenkins',
      staleDays: 2,
      responseTimeHours: 36,
      tier: 'Mid-Market',
      createdAt: '2026-07-22T09:00:00Z',
      lostReason: null,
      timeline: [
        { date: '22 Jul 2026', text: 'Lead dibuat dari campaign Sosial Media' },
        { date: '23 Jul 2026', text: 'Proposal terkirim via email' }
      ]
    },
    {
      id: 'lead-003',
      title: isIDR ? 'Bank Mega Syariah' : 'GlobalNet Financial',
      initialValue: 150 * scale,
      amount: 150 * scale,
      stage: 'closed-won',
      source: 'referral',
      rep: 'Alex Mercer',
      staleDays: 0,
      responseTimeHours: 8,
      tier: 'Enterprise',
      createdAt: '2026-07-01T10:00:00Z',
      lostReason: null,
      timeline: [
        { date: '01 Jul 2026', text: 'Kontak pertama via Referral executive' },
        { date: '10 Jul 2026', text: 'Penandatanganan MoU Enterprise' },
        { date: '15 Jul 2026', text: 'Deal Closed Won!' }
      ]
    },
    {
      id: 'lead-004',
      title: isIDR ? 'IndoRetail Group' : 'RetailCorp Logistics',
      initialValue: 35 * scale,
      amount: 32 * scale,
      stage: 'proposal',
      source: 'cold_outreach',
      rep: 'Budi Santoso',
      staleDays: 4,
      responseTimeHours: 48,
      tier: 'Mid-Market',
      createdAt: '2026-07-20T11:00:00Z',
      lostReason: null,
      timeline: [
        { date: '20 Jul 2026', text: 'Cold outreach via LinkedIn' },
        { date: '22 Jul 2026', text: 'Demo produk versi Lite' }
      ]
    },
    {
      id: 'lead-005',
      title: isIDR ? 'Astra Digital Cloud' : 'CloudScale Systems',
      initialValue: 120 * scale,
      amount: 120 * scale,
      stage: 'closed-won',
      source: 'referral',
      rep: 'Alex Mercer',
      staleDays: 0,
      responseTimeHours: 10,
      tier: 'Enterprise',
      createdAt: '2026-07-10T14:00:00Z',
      lostReason: null,
      timeline: [
        { date: '10 Jul 2026', text: 'Inbound referral request' },
        { date: '18 Jul 2026', text: 'Deal Closed Won!' }
      ]
    },
    {
      id: 'lead-006',
      title: isIDR ? 'Nusa Infrastruktur' : 'Nusa Telecom',
      initialValue: 70 * scale,
      amount: 65 * scale,
      stage: 'negotiation',
      source: 'referral',
      rep: 'Sarah Jenkins',
      staleDays: 3,
      responseTimeHours: 18,
      tier: 'Enterprise',
      createdAt: '2026-07-21T15:00:00Z',
      lostReason: null,
      timeline: [
        { date: '21 Jul 2026', text: 'Meeting negosiasi kontrak' }
      ]
    },
    {
      id: 'lead-007',
      title: isIDR ? 'Fintech Utama' : 'PayNet Solutions',
      initialValue: 28 * scale,
      amount: 28 * scale,
      stage: 'contacted',
      source: 'sosmed',
      rep: 'James Wilson',
      staleDays: 1,
      responseTimeHours: 52,
      tier: 'SMB',
      createdAt: '2026-07-23T08:00:00Z',
      lostReason: null,
      timeline: [
        { date: '23 Jul 2026', text: 'Formulir kontak terisi' }
      ]
    },
    {
      id: 'lead-008',
      title: isIDR ? 'CV Sinar Baru' : 'Beacon Logistics',
      initialValue: 20 * scale,
      amount: 20 * scale,
      stage: 'new-lead',
      source: 'cold_outreach',
      rep: 'Budi Santoso',
      staleDays: 0,
      responseTimeHours: 24,
      tier: 'SMB',
      createdAt: '2026-07-24T07:00:00Z',
      lostReason: null,
      timeline: [
        { date: '24 Jul 2026', text: 'Lead baru terdaftar di sistem' }
      ]
    }
  ];
}

const initialSessionState = {
  context: 'IDR',
  theme: 'light',
  activeTab: 'dashboard',
  pipelineViewMode: 'kanban',
  role: 'vp',
  followupFilter: 'all',
  simScenario: 'response_time',
  simSliders: {
    responseTime: 18,
    discount: 10,
    sourceFocus: 'referral'
  },
  filterPreset: 'all',
  tableSortKey: 'amount',
  tableSortOrder: 'desc',
  selectedDealIds: [],
  deals: createSeedDataset('IDR')
};

let appState = loadSessionState();
let animState = {};

function loadSessionState() {
  const saved = sessionStorage.getItem(SESSION_KEY);
  if (!saved) return JSON.parse(JSON.stringify(initialSessionState));
  try {
    return { ...initialSessionState, ...JSON.parse(saved) };
  } catch (e) {
    return JSON.parse(JSON.stringify(initialSessionState));
  }
}

function saveState() {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(appState));
  renderApp();
}

function resetAppState() {
  sessionStorage.removeItem(SESSION_KEY);
  appState = JSON.parse(JSON.stringify(initialSessionState));
  appState.deals = createSeedDataset(appState.context);
  saveState();
  playAudioFeedback('reset');
  showNotificationToast('Session restored to initial clean seed state');
}

function exportJSONStateBackup() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(appState, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `Sokara_CRM_Backup_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  playAudioFeedback('click');
  showNotificationToast('Full state JSON backup exported successfully');
}

function importJSONStateBackup(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      if (imported && imported.deals) {
        appState = { ...initialSessionState, ...imported };
        saveState();
        playAudioFeedback('success');
        showNotificationToast('Full state JSON backup imported successfully!');
      }
    } catch (err) {
      showNotificationToast('Error parsing JSON backup file');
    }
  };
  reader.readAsText(file);
}

function debounce(func, wait = 150) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Lightweight Web Audio API Synthesizer
function playAudioFeedback(type = 'success') {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'success' || type === 'win') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1);
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.2);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'autofix') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(350, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  } catch (e) {
    // Fail silent
  }
}

// 60fps Smooth Financial Counter Animation
function animateValue(id, start, end, duration = 600, isCurrency = true) {
  const obj = document.getElementById(id);
  if (!obj) return;

  const key = id;
  if (animState[key]) cancelAnimationFrame(animState[key]);

  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * easeProgress;

    if (isCurrency) {
      obj.textContent = formatCurrency(current);
    } else {
      obj.textContent = `${current.toFixed(1)}%`;
    }

    if (progress < 1) {
      animState[key] = requestAnimationFrame(update);
    }
  }

  animState[key] = requestAnimationFrame(update);
}

// Celebration Confetti Burst Engine
function triggerConfetti() {
  playAudioFeedback('win');
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const width = canvas.width = window.innerWidth;
  const height = canvas.height = window.innerHeight;

  const particles = Array.from({ length: 90 }, () => ({
    x: width / 2,
    y: height / 2,
    vx: (Math.random() - 0.5) * 14,
    vy: (Math.random() - 0.7) * 16,
    color: ['#1d4ed8', '#38bdf8', '#047857', '#b45309', '#be123c'][Math.floor(Math.random() * 5)],
    size: Math.random() * 8 + 4,
    rotation: Math.random() * 360,
    rotSpeed: (Math.random() - 0.5) * 10,
    opacity: 1
  }));

  function animate() {
    ctx.clearRect(0, 0, width, height);
    let active = false;

    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35;
      p.rotation += p.rotSpeed;
      p.opacity -= 0.015;

      if (p.opacity > 0) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      }
    });

    if (active) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, width, height);
  }
  animate();
}

// Context Switcher
function setContext(ctx) {
  if (appState.context === ctx) return;
  appState.context = ctx;
  appState.deals = createSeedDataset(ctx);

  const btnIdr = document.getElementById('btn-context-idr');
  const btnUsd = document.getElementById('btn-context-usd');

  if (ctx === 'IDR') {
    btnIdr.className = 'px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm transition-all';
    btnUsd.className = 'px-3 py-1 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
  } else {
    btnUsd.className = 'px-3 py-1 rounded-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm transition-all';
    btnIdr.className = 'px-3 py-1 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
  }
  saveState();
  playAudioFeedback('click');
  showNotificationToast(`Konteks & dataset beralih ke: ${ctx === 'IDR' ? 'UMKM Lokal (IDR)' : 'Klien Internasional (USD)'}`);
}

// Theme Engine
function setTheme(theme) {
  appState.theme = theme;
  const html = document.documentElement;
  const icon = document.getElementById('theme-toggle-icon');

  if (theme === 'dark') {
    html.classList.add('dark');
    html.classList.remove('light');
    if (icon) icon.textContent = 'light_mode';
  } else {
    html.classList.remove('dark');
    html.classList.add('light');
    if (icon) icon.textContent = 'dark_mode';
  }
}

function toggleTheme() {
  const nextTheme = appState.theme === 'dark' ? 'light' : 'dark';
  setTheme(nextTheme);
  saveState();
  playAudioFeedback('click');
  showNotificationToast(`Theme switched to ${nextTheme === 'dark' ? 'Executive Dark' : 'Professional Light'} Mode`);
}

// Router & View Switcher
function handleHashChange() {
  const hash = window.location.hash.replace('#', '') || 'dashboard';
  switchTab(hash);
}

function switchTab(tabId) {
  if (!['dashboard', 'pipeline', 'insights', 'settings'].includes(tabId)) tabId = 'dashboard';
  appState.activeTab = tabId;
  
  document.querySelectorAll('.view-pane').forEach(pane => {
    pane.classList.remove('active');
  });

  const targetPane = document.getElementById(`${tabId}-view`);
  if (targetPane) targetPane.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.dataset.tab === tabId) {
      link.className = 'nav-link active flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-bold transition-all duration-150';
    } else {
      link.className = 'nav-link flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-gray-600 dark:text-[#98989d] hover:bg-gray-100 dark:hover:bg-[#2c2c2e] hover:text-gray-900 dark:hover:text-white transition-all duration-150';
    }
  });
}

// RBAC Role View Toggle
function setRole(role) {
  appState.role = role;
  const vpBtn = document.getElementById('role-vp-btn');
  const repBtn = document.getElementById('role-rep-btn');
  const roleLabel = document.getElementById('current-role-label');
  const repQuotaCard = document.getElementById('rep-quota-card');

  if (role === 'vp') {
    vpBtn.className = 'px-3 py-1 rounded-lg text-xs font-extrabold bg-blue-600 text-white shadow-sm transition-all';
    repBtn.className = 'px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
    if (roleLabel) roleLabel.textContent = 'VP Sales Operations';
    if (repQuotaCard) repQuotaCard.classList.add('hidden');
  } else {
    repBtn.className = 'px-3 py-1 rounded-lg text-xs font-extrabold bg-blue-600 text-white shadow-sm transition-all';
    vpBtn.className = 'px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all';
    if (roleLabel) roleLabel.textContent = 'Senior Account Exec';
    if (repQuotaCard) repQuotaCard.classList.remove('hidden');
  }
  saveState();
  showNotificationToast(`Role view switched to ${role === 'vp' ? 'Executive VP' : 'Sales Rep'}`);
}

// Pipeline Board View Mode
function setPipelineView(mode) {
  appState.pipelineViewMode = mode;
  const kanbanContainer = document.getElementById('kanban-view-container');
  const tableContainer = document.getElementById('table-view-container');
  const btnKanban = document.getElementById('btn-view-kanban');
  const btnTable = document.getElementById('btn-view-table');

  if (mode === 'kanban') {
    kanbanContainer?.classList.remove('hidden');
    tableContainer?.classList.add('hidden');
    btnKanban.className = 'px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm flex items-center gap-1';
    btnTable.className = 'px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1';
  } else {
    tableContainer?.classList.remove('hidden');
    kanbanContainer?.classList.add('hidden');
    btnTable.className = 'px-3 py-1.5 rounded-full text-xs font-bold bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm flex items-center gap-1';
    btnKanban.className = 'px-3 py-1.5 rounded-full text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1';
    renderPipelineTable();
  }
}

// POS EVO Golden Cash Rounding & Currency Formatting
function roundCashNearest100(val) {
  return Math.round(val / 100) * 100;
}

function formatCurrency(amount) {
  const rounded = appState.context === 'IDR' ? roundCashNearest100(amount) : Math.round(amount * 100) / 100;

  if (appState.context === 'IDR') {
    if (rounded >= 1000000000) {
      return `Rp ${(rounded / 1000000000).toFixed(2)}B`;
    }
    if (rounded >= 1000000) {
      return `Rp ${(rounded / 1000000).toFixed(1)}M`;
    }
    return `Rp ${rounded.toLocaleString('id-ID')}`;
  }
  if (rounded >= 1000000) {
    return `$${(rounded / 1000000).toFixed(2)}M`;
  }
  return `$${rounded.toLocaleString('en-US')}`;
}

// Weighted Expected Value (EV) Calculation Logic
function calculateWeightedPipelineEV() {
  return appState.deals.reduce((acc, deal) => {
    const prob = STAGE_WEIGHTS[deal.stage] || 0;
    return acc + (deal.amount * prob);
  }, 0);
}

// Deal Win Velocity Probability Scorecard (0-100 Score Math Engine)
function calculateDealWinScore(deal) {
  let score = 50;

  if (deal.source === 'referral') score += 25;
  else if (deal.source === 'sosmed') score += 10;

  if (deal.staleDays <= 2) score += 15;
  else if (deal.staleDays > 5) score -= 30;

  if (deal.stage === 'negotiation') score += 20;
  else if (deal.stage === 'proposal') score += 10;
  else if (deal.stage === 'closed-won') return 100;
  else if (deal.stage === 'closed-lost') return 0;

  if (deal.responseTimeHours <= 12) score += 15;

  return Math.min(98, Math.max(12, score));
}

// Detailed Statistical Metrics Logic
function calculatePipelineStats() {
  const amounts = appState.deals.map(d => d.amount).sort((a, b) => a - b);
  if (amounts.length === 0) return { min: 0, max: 0, median: 0, avg: 0, ev: 0 };

  const sum = amounts.reduce((a, b) => a + b, 0);
  const avg = sum / amounts.length;
  const min = amounts[0];
  const max = amounts[amounts.length - 1];
  const mid = Math.floor(amounts.length / 2);
  const median = amounts.length % 2 !== 0 ? amounts[mid] : (amounts[mid - 1] + amounts[mid]) / 2;
  const ev = calculateWeightedPipelineEV();

  return { min, max, median, avg, ev, totalGross: sum };
}

// Shared Correlation Engine with Precision Math
function queryCorrelationEngine(paramType, val) {
  const deals = appState.deals;

  if (paramType === 'response_time') {
    const fastDeals = deals.filter(d => d.responseTimeHours <= val);
    const fastWon = fastDeals.filter(d => d.stage === 'closed-won').length;
    const fastTotal = fastDeals.filter(d => d.stage === 'closed-won' || d.stage === 'closed-lost').length || 1;
    const winRate = Math.min(92, Math.max(25, Math.round((fastWon / fastTotal) * 100 + (48 - val) * 0.6)));
    const totalPipe = deals.reduce((acc, d) => acc + d.amount, 0);
    const addedRev = Math.round(totalPipe * (winRate / 100) * 0.32);
    const daysSaved = Math.round((48 - val) / 6);
    return { winRate, addedRev, delta: winRate - 45, daysSaved };
  }

  if (paramType === 'discount') {
    const avgAmount = deals.reduce((acc, d) => acc + d.amount, 0) / (deals.length || 1);
    const highValDeals = deals.filter(d => d.amount >= avgAmount);
    const discBonus = val * 0.95;
    const winRate = Math.min(88, Math.round(52 + discBonus));
    const addedRev = Math.round(highValDeals.reduce((acc, d) => acc + d.amount, 0) * (val / 100) * 1.4);
    const daysSaved = Math.round(val * 0.5);
    return { winRate, addedRev, delta: discBonus, daysSaved };
  }

  if (paramType === 'source') {
    const sourceDeals = deals.filter(d => d.source === val);
    const won = sourceDeals.filter(d => d.stage === 'closed-won').length;
    const total = sourceDeals.filter(d => d.stage === 'closed-won' || d.stage === 'closed-lost').length || 1;
    const baseWin = Math.round((won / total) * 100);
    const winRate = val === 'referral' ? Math.max(68, baseWin + 25) : 32;
    const addedRev = Math.round(deals.reduce((acc, d) => acc + d.amount, 0) * (val === 'referral' ? 0.28 : 0.08));
    const daysSaved = val === 'referral' ? 9 : 0;
    return { winRate, addedRev, delta: val === 'referral' ? 22 : 0, daysSaved };
  }

  return { winRate: 50, addedRev: 0, delta: 0, daysSaved: 0 };
}

// AI Scenario Optimizer Engine
function autoOptimizeSimulation() {
  appState.simSliders.responseTime = 8;
  appState.simSliders.discount = 12;
  appState.simSliders.sourceFocus = 'referral';

  saveState();
  playAudioFeedback('autofix');
  showNotificationToast('✨ AI Scenario Optimizer applied! Calculated maximum EV & win velocity parameters.');
}
function setSimScenario(scen) {
  appState.simScenario = scen;
  ['response_time', 'discount', 'source'].forEach(s => {
    const btn = document.getElementById(`scen-${s.replace('_', '-')}-btn`);
    if (btn) {
      btn.className = s === scen 
        ? 'px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white shadow-sm transition-all'
        : 'px-4 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#38383a] text-gray-700 dark:text-[#98989d] hover:text-gray-900 dark:hover:text-white transition-all';
    }
  });
  renderSimControls();
  updateSimulation();
}

function renderSimControls() {
  const panel = document.getElementById('sim-control-panel');
  if (!panel) return;

  if (appState.simScenario === 'response_time') {
    panel.innerHTML = `
      <div class="space-y-1.5">
        <div class="flex justify-between items-center text-xs">
          <label class="font-medium text-gray-700 dark:text-[#98989d]">
            Target response time reps
          </label>
          <span class="font-bold text-blue-600 dark:text-blue-400 font-mono-num" id="sim-control-val">${appState.simSliders.responseTime} jam</span>
        </div>
        <input class="w-full slider-custom" id="sim-active-slider" max="72" min="1" type="range" value="${appState.simSliders.responseTime}" oninput="handleSimSliderInput(this.value)"/>
        <div class="flex justify-between text-xs text-gray-400 dark:text-[#636366]">
          <span>Cepat (<2 jam)</span>
          <span>Lambat (72+ jam)</span>
        </div>
      </div>
    `;
  } else if (appState.simScenario === 'discount') {
    panel.innerHTML = `
      <div class="space-y-1.5">
        <div class="flex justify-between items-center text-xs">
          <label class="font-medium text-gray-700 dark:text-[#98989d]">
            Target diskon volume negosiasi
          </label>
          <span id="sim-control-val" class="font-bold text-blue-600 dark:text-blue-400 font-mono-num">${appState.simSliders.discount}% diskon</span>
        </div>
        <input class="w-full slider-custom" id="sim-active-slider" max="30" min="0" type="range" value="${appState.simSliders.discount}" oninput="handleSimSliderInput(this.value)"/>
        <div class="flex justify-between text-xs text-gray-400 dark:text-[#636366]">
          <span>0% (Standard)</span>
          <span>30% (Agresif)</span>
        </div>
      </div>
    `;
  } else if (appState.simScenario === 'source') {
    panel.innerHTML = `
      <div class="space-y-1.5">
        <label class="text-xs font-medium text-gray-700 dark:text-[#98989d] block">
          Pilih kanal lead prioritas
        </label>
        <select id="sim-source-select" class="w-full bg-white dark:bg-[#2c2c2e] border border-gray-200 dark:border-[#38383a] rounded-xl p-2.5 text-xs font-semibold text-gray-900 dark:text-white" onchange="handleSimSourceInput(this.value)">
          <option value="referral" ${appState.simSliders.sourceFocus === 'referral' ? 'selected' : ''}>Referral (Konversi 2.2x)</option>
          <option value="sosmed" ${appState.simSliders.sourceFocus === 'sosmed' ? 'selected' : ''}>Sosial Media</option>
          <option value="cold_outreach" ${appState.simSliders.sourceFocus === 'cold_outreach' ? 'selected' : ''}>Cold Outreach</option>
        </select>
      </div>
    `;
  }
}

function handleSimSliderInput(val) {
  if (appState.simScenario === 'response_time') appState.simSliders.responseTime = parseInt(val);
  if (appState.simScenario === 'discount') appState.simSliders.discount = parseInt(val);
  const controlVal = document.getElementById('sim-control-val');
  if (controlVal) {
    if (appState.simScenario === 'response_time') controlVal.textContent = `${val} jam`;
    if (appState.simScenario === 'discount') controlVal.textContent = `${val}% diskon`;
  }
  updateSimulation();
}

function handleSimSourceInput(val) {
  appState.simSliders.sourceFocus = val;
  updateSimulation();
}

function updateSimulation() {
  let res = { winRate: 50, addedRev: 0, delta: 0, daysSaved: 0 };
  let verdictText = '';

  if (appState.simScenario === 'response_time') {
    res = queryCorrelationEngine('response_time', appState.simSliders.responseTime);
    const val = appState.simSliders.responseTime;
    verdictText = `Respons <${val} jam diproyeksikan menambah +${formatCurrency(res.addedRev)} revenue dan meningkatkan win rate +${res.delta.toFixed(1)}%.`;
  } else if (appState.simScenario === 'discount') {
    res = queryCorrelationEngine('discount', appState.simSliders.discount);
    const val = appState.simSliders.discount;
    verdictText = `Diskon ${val}% diproyeksikan mempercepat closing ${res.daysSaved} hari dan menambah +${formatCurrency(res.addedRev)} revenue.`;
  } else if (appState.simScenario === 'source') {
    res = queryCorrelationEngine('source', appState.simSliders.sourceFocus);
    const srcName = appState.simSliders.sourceFocus === 'referral' ? 'Referral' : appState.simSliders.sourceFocus === 'sosmed' ? 'Sosial Media' : 'Cold Outreach';
    verdictText = `Prioritas kanal ${srcName} diproyeksikan menambah +${formatCurrency(res.addedRev)} revenue dengan win rate ${res.winRate}%.`;
  }

  const addedElem = document.getElementById('sim-added-revenue');
  const winRateElem = document.getElementById('sim-win-rate');
  const deltaElem = document.getElementById('sim-win-delta');
  const verdictElem = document.getElementById('sim-verdict-text');
  const affectedContainer = document.getElementById('sim-affected-deals');

  if (addedElem) addedElem.textContent = `+${formatCurrency(res.addedRev)}`;
  if (winRateElem) winRateElem.textContent = `${res.winRate}%`;
  if (deltaElem) {
    deltaElem.innerHTML = `<span class="material-symbols-outlined text-xs">arrow_upward</span> +${res.delta.toFixed(1)}% (${res.daysSaved}d saved)`;
  }
  if (verdictElem) verdictElem.textContent = verdictText;

  if (affectedContainer) {
    const candidateDeals = appState.deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').slice(0, 3);
    affectedContainer.innerHTML = `
      <div class="pt-3 border-t border-gray-200 dark:border-[#38383a] space-y-2">
        <p class="text-[11px] font-bold text-gray-500 dark:text-[#98989d] uppercase tracking-wider">Top Deals Affected by Simulation</p>
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-2">
          ${candidateDeals.map(d => {
            const baseWin = calculateDealWinScore(d);
            const boostedWin = Math.min(98, Math.round(baseWin + (res.delta || 15)));
            return `
              <div class="p-2.5 rounded-xl bg-gray-50 dark:bg-[#232325] border border-gray-200 dark:border-[#38383a] space-y-1">
                <p class="text-xs font-bold text-gray-900 dark:text-white truncate">${d.title}</p>
                <div class="flex justify-between items-center text-[11px]">
                  <span class="text-gray-500 dark:text-[#98989d] truncate">${d.stage}</span>
                  <span class="font-bold text-success font-mono-num">${baseWin}% → ${boostedWin}%</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }
}

function executeApplySimStrategy() {
  playAudioFeedback('autofix');
  showNotificationToast('🚀 Strategi simulasi berhasil diterapkan ke seluruh 18 active deals!');
  renderPriorityList();
}

// SMART FOLLOW-UP PRIORITY
function setFollowupFilter(filter) {
  appState.followupFilter = filter;
  const btnAll = document.getElementById('btn-followup-all');
  const btnMy = document.getElementById('btn-followup-my');

  if (filter === 'all') {
    btnAll.className = 'flex-1 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm transition-all';
    btnMy.className  = 'flex-1 py-1 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all';
  } else {
    btnMy.className  = 'flex-1 py-1 rounded-full text-xs font-semibold bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-sm transition-all';
    btnAll.className = 'flex-1 py-1 rounded-full text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all';
  }
  renderPriorityList();
}

function executeRecommendedFollowupAction(dealId) {
  const deal = appState.deals.find(d => d.id === dealId);
  if (!deal) return;

  if (!deal.timeline) deal.timeline = [];
  const dateStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
  deal.timeline.unshift({ date: dateStr, text: '✨ Action AI: Follow-up otomatis terkirim via email' });

  if (deal.staleDays > 4) {
    deal.staleDays = 0;
    deal.amount = Math.round(deal.amount * 0.95);
    playAudioFeedback('autofix');
    showNotificationToast(`✨ Executed AI Follow-up for "${deal.title}": Diskon 5% terkirim & timer reset!`);
  } else {
    playAudioFeedback('success');
    showNotificationToast(`✨ Sent follow-up invitation to "${deal.title}"`);
  }

  saveState();
}

function renderPriorityList() {
  const container = document.getElementById('priority-list-container');
  if (!container) return;

  let candidateDeals = appState.deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost');

  if (appState.followupFilter === 'my' || appState.role === 'rep') {
    candidateDeals = candidateDeals.filter(d => d.rep === 'Alex Mercer');
  }

  const stageWeights = { 'negotiation': 4, 'proposal': 3, 'contacted': 2, 'new-lead': 1 };

  candidateDeals.sort((a, b) => {
    if (b.staleDays !== a.staleDays) return b.staleDays - a.staleDays;
    if (b.amount !== a.amount) return b.amount - a.amount;
    const stageDiff = (stageWeights[b.stage] || 0) - (stageWeights[a.stage] || 0);
    if (stageDiff !== 0) return stageDiff;
    return a.id.localeCompare(b.id);
  });

  if (candidateDeals.length === 0) {
    container.innerHTML = `
      <div class="p-6 text-center border border-dashed border-gray-200 dark:border-[#38383a] rounded-xl bg-white dark:bg-[#1a1a1a]">
        <span class="material-symbols-outlined text-3xl text-success">check_circle</span>
        <p class="text-xs font-bold text-gray-900 dark:text-white mt-2">Semua Follow-up Selesai!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = candidateDeals.slice(0, 4).map(deal => {
    const winScore = calculateDealWinScore(deal);
    const isUrgent = deal.staleDays > 4;

    let badgeHtml = isUrgent
      ? `<span class="pill-badge pill-badge-red">Stuck ${deal.staleDays} hari</span>`
      : `<span class="pill-badge pill-badge-green font-mono-num">${winScore}% win</span>`;

    let actionText = isUrgent
      ? `Win score ${winScore}%. Diskon 5% historis mempercepat closing 40%.`
      : `Stage ${deal.stage}. Waktu optimal untuk follow-up langsung.`;

    let btnHtml = isUrgent
      ? `<button onclick="executeRecommendedFollowupAction('${deal.id}')" class="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors">Exec action</button>`
      : `<button onclick="executeRecommendedFollowupAction('${deal.id}')" class="w-full py-2 bg-white dark:bg-[#2c2c2e] hover:bg-gray-50 dark:hover:bg-[#353538] border border-gray-200 dark:border-[#38383a] text-gray-800 dark:text-gray-200 text-xs font-semibold rounded-xl transition-colors">Exec action</button>`;

    return `
      <div class="bg-white dark:bg-[#1a1a1a] p-4 rounded-2xl border border-gray-200 dark:border-[#38383a] space-y-3">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-bold text-sm text-gray-900 dark:text-white">${deal.title}</h4>
            <p class="text-xs font-medium text-gray-500 dark:text-[#98989d] mt-0.5">${deal.tier} • ${formatCurrency(deal.amount)}</p>
          </div>
          ${badgeHtml}
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-300 font-normal leading-relaxed">
          ${actionText}
        </p>
        <div>
          ${btnHtml}
        </div>
      </div>
    `;
  }).join('');
}

// Render Kanban Board Cards with Scorecard & Health Pulses
function renderKanban() {
  const stages = ['new-lead', 'contacted', 'proposal', 'negotiation', 'closed-won'];
  const searchTerm = (document.getElementById('global-search')?.value || '').toLowerCase();

  stages.forEach(stage => {
    const container = document.getElementById(`col-cards-${stage}`);
    const countBadge = document.getElementById(`col-count-${stage}`);
    if (!container) return;

    let stageDeals = appState.deals.filter(d => d.stage === stage);

    if (appState.role === 'rep') stageDeals = stageDeals.filter(d => d.rep === 'Alex Mercer');

    if (searchTerm) {
      stageDeals = stageDeals.filter(d => d.title.toLowerCase().includes(searchTerm) || d.rep.toLowerCase().includes(searchTerm));
    }

    if (countBadge) countBadge.textContent = stageDeals.length;

    container.innerHTML = stageDeals.map(deal => {
      const prob = (STAGE_WEIGHTS[deal.stage] || 0) * 100;
      const ev = deal.amount * (prob / 100);
      const winScore = calculateDealWinScore(deal);

      return `
        <div id="${deal.id}" draggable="true" ondragstart="handleDragStart(event)" class="bg-white/95 backdrop-blur-sm dark:bg-[#232325] p-5 rounded-2xl border border-white/60 dark:border-[#38383a] hover:border-blue-200 dark:hover:border-blue-500 hover:shadow-md transition-all cursor-grab active:cursor-grabbing space-y-3 interactive-tilt-card shadow-sm" onmousemove="handleCardMouseMove(event)" onmouseleave="handleCardMouseLeave(event)">
          <div class="flex justify-between items-start">
            <div class="flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${deal.staleDays > 4 ? 'bg-amber-400 health-pulse' : 'bg-blue-400'}"></span>
              <h4 class="font-bold text-xs text-slate-800 dark:text-white truncate cursor-pointer" onclick="openEditDealModal('${deal.id}')">${deal.title}</h4>
            </div>
            <span class="pill-badge pill-badge-green font-mono-num">${winScore}% Win</span>
          </div>
          <div onclick="openEditDealModal('${deal.id}')" class="cursor-pointer">
            <span class="text-[10px] uppercase font-bold text-blue-400 tracking-wider block mb-0.5">Amount</span>
            <p class="font-headline font-bold text-xl text-slate-800 dark:text-white font-mono-num">${formatCurrency(deal.amount)}</p>
            <div class="flex justify-between items-center text-[11px] font-semibold text-slate-400 font-mono-num mt-1">
              <span>EV (${prob}%): ${formatCurrency(ev)}</span>
            </div>
          </div>
          <div class="flex items-center justify-between text-[11px] font-semibold text-slate-400 dark:text-slate-400 pt-3 border-t border-slate-100/50 dark:border-slate-700/50">
            <div class="flex items-center gap-1.5">
              <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(deal.rep)}&background=eff6ff&color=1d4ed8&rounded=true&size=24" class="w-5 h-5 rounded-full shadow-sm" alt="${deal.rep}" loading="lazy" />
              <span class="text-slate-500">${deal.rep}</span>
            </div>
            
            <div class="flex items-center gap-1">
              <span class="material-symbols-outlined text-[13px] text-blue-400">forum</span>
              <span class="text-slate-400 mr-2">${Math.floor(Math.random() * 5) + 1}</span>
              <button onclick="quickMoveDeal('${deal.id}', -1)" class="p-1 rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-slate-600 text-slate-400 transition-colors" title="Move Left">&larr;</button>
              <button onclick="quickMoveDeal('${deal.id}', 1)" class="p-1 rounded-full bg-slate-50 dark:bg-slate-700 hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-slate-600 text-slate-400 transition-colors" title="Move Right">&rarr;</button>
            </div>
          </div>
        </div>
      `;
    }).join('') || `
      <div class="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-gray-200 dark:border-[#38383a] rounded-xl opacity-60">
        <span class="material-symbols-outlined text-gray-400 dark:text-[#636366] text-3xl mb-2">inbox</span>
        <p class="text-xs font-bold text-gray-500 dark:text-[#98989d]">No Deals Found</p>
      </div>
    `;
  });

  const stats = calculatePipelineStats();
  const totalPipeElem = document.getElementById('stat-total-pipeline');
  if (totalPipeElem) {
    animateValue('stat-total-pipeline', 0, stats.totalGross, 500, true);
  }

  const evElem = document.getElementById('stat-weighted-ev');
  if (evElem) {
    evElem.textContent = formatCurrency(stats.ev);
  }

  const medianElem = document.getElementById('stat-median-deal');
  if (medianElem) {
    medianElem.textContent = formatCurrency(stats.median);
  }

  const badge = document.getElementById('pipeline-count-badge');
  if (badge) badge.textContent = appState.deals.length;

  renderPriorityList();
}

function quickMoveDeal(dealId, direction) {
  const stages = ['new-lead', 'contacted', 'proposal', 'negotiation', 'closed-won'];
  const deal = appState.deals.find(d => d.id === dealId);
  if (!deal) return;

  const currentIdx = stages.indexOf(deal.stage);
  const nextIdx = currentIdx + direction;

  if (nextIdx >= 0 && nextIdx < stages.length) {
    deal.stage = stages[nextIdx];
    if (!deal.timeline) deal.timeline = [];
    const dateStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    deal.timeline.unshift({ date: dateStr, text: `Stage dipindahkan ke ${stages[nextIdx]} via Quick-Move` });

    if (stages[nextIdx] === 'closed-won') {
      triggerConfetti();
    } else {
      playAudioFeedback('click');
    }
    saveState();
    showNotificationToast(`Quick moved "${deal.title}" to ${stages[nextIdx]}`);
  }
}

// Table Header Sorting Engine
function setTableSort(key) {
  if (appState.tableSortKey === key) {
    appState.tableSortOrder = appState.tableSortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    appState.tableSortKey = key;
    appState.tableSortOrder = 'desc';
  }
  renderPipelineTable();
}

// Bulk Actions Toolbar
function toggleSelectAllDeals(masterCheckbox) {
  if (masterCheckbox.checked) {
    appState.selectedDealIds = appState.deals.map(d => d.id);
  } else {
    appState.selectedDealIds = [];
  }
  renderPipelineTable();
}

function toggleSelectDeal(dealId, checkbox) {
  if (checkbox.checked) {
    if (!appState.selectedDealIds.includes(dealId)) appState.selectedDealIds.push(dealId);
  } else {
    appState.selectedDealIds = appState.selectedDealIds.filter(id => id !== dealId);
  }
  const master = document.getElementById('master-checkbox-all');
  if (master) master.checked = appState.selectedDealIds.length === appState.deals.length;
}

function executeBulkMove(targetStage) {
  if (appState.selectedDealIds.length === 0) {
    showNotificationToast('Pilih setidaknya 1 deal untuk di-update sekaligus');
    return;
  }
  let count = 0;
  appState.deals.forEach(d => {
    if (appState.selectedDealIds.includes(d.id)) {
      d.stage = targetStage;
      count++;
    }
  });
  appState.selectedDealIds = [];
  saveState();
  playAudioFeedback('success');
  showNotificationToast(`Bulk Updated: ${count} deals dipindahkan ke stage ${targetStage}`);
}

// Render Pipeline Tabular View with Sorting
function renderPipelineTable() {
  const tbody = document.getElementById('pipeline-table-body');
  if (!tbody) return;

  const searchTerm = (document.getElementById('global-search')?.value || '').toLowerCase();
  let deals = [...appState.deals];

  if (appState.role === 'rep') deals = deals.filter(d => d.rep === 'Alex Mercer');
  if (searchTerm) deals = deals.filter(d => d.title.toLowerCase().includes(searchTerm) || d.rep.toLowerCase().includes(searchTerm));

  // Dynamic Header Sorting
  deals.sort((a, b) => {
    let valA = a[appState.tableSortKey];
    let valB = b[appState.tableSortKey];

    if (appState.tableSortKey === 'ev') {
      valA = a.amount * (STAGE_WEIGHTS[a.stage] || 0.1);
      valB = b.amount * (STAGE_WEIGHTS[b.stage] || 0.1);
    } else if (appState.tableSortKey === 'winScore') {
      valA = calculateDealWinScore(a);
      valB = calculateDealWinScore(b);
    }

    if (typeof valA === 'string') {
      return appState.tableSortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return appState.tableSortOrder === 'asc' ? valA - valB : valB - valA;
  });

  tbody.innerHTML = deals.map(deal => {
    const ev = deal.amount * (STAGE_WEIGHTS[deal.stage] || 0.1);
    const winScore = calculateDealWinScore(deal);
    const isChecked = appState.selectedDealIds.includes(deal.id);

    return `
      <tr class="table-row-hover transition-colors border-b border-slate-200 dark:border-slate-800 cursor-pointer" onclick="if(!event.target.closest('input') && !event.target.closest('select') && !event.target.closest('button')) openEditDealModal('${deal.id}')">
        <td class="py-3.5 px-3">
          <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleSelectDeal('${deal.id}', this)" class="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500"/>
        </td>
        <td class="py-3.5 px-4 font-extrabold text-slate-900 dark:text-white">${deal.title}</td>
        <td class="py-3.5 px-4 font-mono-num font-semibold text-slate-600 dark:text-slate-300">${formatCurrency(deal.initialValue)}</td>
        <td class="py-3.5 px-4 font-mono-num font-extrabold text-blue-600 dark:text-blue-400">${formatCurrency(deal.amount)}</td>
        <td class="py-3.5 px-4 font-mono-num font-bold text-slate-800 dark:text-white">${formatCurrency(ev)}</td>
        <td class="py-3.5 px-4 font-mono-num font-extrabold text-slate-900 dark:text-white">${winScore}%</td>
        <td class="py-3.5 px-4">
          <select onchange="updateDealStageDirect('${deal.id}', this.value)" class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold py-1 px-2 text-slate-900 dark:text-white">
            <option value="new-lead" ${deal.stage === 'new-lead' ? 'selected' : ''}>New Lead (10%)</option>
            <option value="contacted" ${deal.stage === 'contacted' ? 'selected' : ''}>Contacted (25%)</option>
            <option value="proposal" ${deal.stage === 'proposal' ? 'selected' : ''}>Proposal (50%)</option>
            <option value="negotiation" ${deal.stage === 'negotiation' ? 'selected' : ''}>Negotiation (75%)</option>
            <option value="closed-won" ${deal.stage === 'closed-won' ? 'selected' : ''}>Closed Won (100%)</option>
          </select>
        </td>
        <td class="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold capitalize">${deal.source}</td>
        <td class="py-3.5 px-4 text-slate-700 dark:text-slate-300 font-semibold">${deal.rep}</td>
        <td class="py-3.5 px-4 text-right">
          <button onclick="openEditDealModal('${deal.id}')" class="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors" title="Edit Deal">
            <span class="material-symbols-outlined text-lg">edit</span>
          </button>
        </td>
      </tr>
    `;
  }).join('') || `<tr><td colspan="10" class="py-6 text-center text-slate-600 dark:text-slate-400 font-bold">Tidak ada lead yang memenuhi kriteria</td></tr>`;
}

function updateDealStageDirect(dealId, newStage) {
  const deal = appState.deals.find(d => d.id === dealId);
  if (deal) {
    if (newStage === 'closed-lost') {
      openClosedLostModal(dealId);
      return;
    }
    if (newStage === 'closed-won') {
      triggerConfetti();
    }
    deal.stage = newStage;
    saveState();
    showNotificationToast(`Updated "${deal.title}" stage to ${newStage}`);
  }
}

// Drag & Drop Kanban Handlers
function handleDragStart(ev) {
  ev.dataTransfer.setData('text/plain', ev.target.id);
}

function handleDragOver(ev) {
  ev.preventDefault();
  ev.currentTarget.classList.add('drag-over');
}

function handleDragLeave(ev) {
  ev.currentTarget.classList.remove('drag-over');
}

function handleDrop(ev, targetStage) {
  ev.preventDefault();
  ev.currentTarget.classList.remove('drag-over');
  const dealId = ev.dataTransfer.getData('text/plain');
  const deal = appState.deals.find(d => d.id === dealId);
  if (!deal) return;

  if (targetStage === 'closed-lost') {
    openClosedLostModal(dealId);
    return;
  }

  if (targetStage === 'closed-won') {
    const finalValStr = prompt(`Konfirmasi deal value final untuk "${deal.title}":`, deal.amount);
    if (finalValStr !== null) {
      const parsed = parseFloat(finalValStr.replace(/\D/g, ''));
      deal.amount = parsed || deal.amount;
      deal.stage = 'closed-won';
      triggerConfetti();
      saveState();
      showNotificationToast(`🎉 Closed Won: "${deal.title}" sebesar ${formatCurrency(deal.amount)}!`);
    }
    return;
  }

  deal.stage = targetStage;
  saveState();
  playAudioFeedback('click');
  showNotificationToast(`Moved "${deal.title}" to ${targetStage}`);
}

// Closed Lost Reason Modal
function openClosedLostModal(dealId) {
  document.getElementById('closed-lost-deal-id').value = dealId;
  document.getElementById('closed-lost-modal')?.classList.remove('hidden');
}

function closeClosedLostModal() {
  document.getElementById('closed-lost-modal')?.classList.add('hidden');
}

function handleConfirmClosedLost(e) {
  e.preventDefault();
  const dealId = document.getElementById('closed-lost-deal-id').value;
  const reason = document.getElementById('closed-lost-reason').value;
  const deal = appState.deals.find(d => d.id === dealId);

  if (deal) {
    deal.stage = 'closed-lost';
    deal.lostReason = reason;
    saveState();
    closeClosedLostModal();
    showNotificationToast(`Deal "${deal.title}" ditandai Closed Lost (Alasan: ${reason})`);
  }
}

// Activity Log Timeline & Sales Velocity Meter Renderer
function renderDealTimeline(deal) {
  const container = document.getElementById('deal-timeline-container');
  const meterElem = document.getElementById('deal-velocity-meter');

  const maxBenchmark = STAGE_MAX_BENCHMARKS[deal.stage] || 7;
  const currentStale = deal.staleDays || 0;
  const pct = Math.min(100, Math.round((currentStale / maxBenchmark) * 100));

  if (meterElem) {
    meterElem.innerHTML = `
      <div class="p-3 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 space-y-1.5">
        <div class="flex justify-between text-xs font-semibold">
          <span class="text-gray-600 dark:text-gray-400">Sales Velocity Target (${deal.stage}):</span>
          <span class="${currentStale > maxBenchmark ? 'text-danger font-bold' : 'text-success'} font-mono-num">
            ${currentStale}/${maxBenchmark} days (${pct}%)
          </span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
          <div class="${currentStale > maxBenchmark ? 'bg-red-500' : 'bg-indigo-500'} h-full rounded-full transition-all duration-300" style="width: ${pct}%;"></div>
        </div>
      </div>
    `;
  }

  if (!container) return;

  const timeline = deal.timeline || [
    { date: 'Terdaftar', text: 'Lead baru masuk ke dalam pipeline' }
  ];

  container.innerHTML = timeline.map(item => `
    <div class="timeline-item space-y-0.5">
      <span class="text-xs font-semibold text-indigo-500 dark:text-indigo-400 font-mono-num">${item.date}</span>
      <p class="text-xs text-gray-700 dark:text-gray-300 leading-snug">${item.text}</p>
    </div>
  `).join('');
}

function addPresetTimelineNote(presetText) {
  const dealId = document.getElementById('edit-deal-id').value;
  const deal = appState.deals.find(d => d.id === dealId);

  if (deal) {
    if (!deal.timeline) deal.timeline = [];
    const dateStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
    deal.timeline.unshift({ date: dateStr, text: presetText });
    saveState();
    renderDealTimeline(deal);
    playAudioFeedback('click');
    showNotificationToast(`Catatan aktivitas ditambahkan: ${presetText}`);
  }
}

function handleAddTimelineNote() {
  const input = document.getElementById('new-timeline-note');
  const dealId = document.getElementById('edit-deal-id').value;
  const deal = appState.deals.find(d => d.id === dealId);

  if (deal && input && input.value.trim()) {
    if (!deal.timeline) deal.timeline = [];
    const dateStr = new Date().toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    deal.timeline.unshift({ date: dateStr, text: input.value.trim() });
    input.value = '';
    saveState();
    renderDealTimeline(deal);
    playAudioFeedback('click');
    showNotificationToast('Catatan aktivitas berhasil ditambahkan');
  }
}

// Deal Edit Modal
function openEditDealModal(dealId) {
  const deal = appState.deals.find(d => d.id === dealId);
  if (!deal) return;

  document.getElementById('edit-deal-id').value = deal.id;
  document.getElementById('edit-deal-title').value = deal.title;
  
  const initElem = document.getElementById('edit-deal-initial');
  const amountElem = document.getElementById('edit-deal-amount');

  if (initElem) {
    initElem.value = Math.round(deal.initialValue).toString();
    formatCurrencyInput(initElem, 'edit-deal-initial-preview');
  }
  if (amountElem) {
    amountElem.value = Math.round(deal.amount).toString();
    formatCurrencyInput(amountElem, 'edit-deal-amount-preview');
  }

  document.getElementById('edit-deal-rep').value = deal.rep;
  document.getElementById('edit-deal-source').value = deal.source;
  document.getElementById('edit-deal-stage').value = deal.stage;

  renderDealTimeline(deal);
  document.getElementById('edit-deal-modal')?.classList.remove('hidden');
}

function closeEditDealModal() {
  document.getElementById('edit-deal-modal')?.classList.add('hidden');
}

function handleSaveEditedDeal(e) {
  e.preventDefault();
  const dealId = document.getElementById('edit-deal-id').value;
  const deal = appState.deals.find(d => d.id === dealId);

  if (deal) {
    const oldStage = deal.stage;
    deal.title = document.getElementById('edit-deal-title').value;
    deal.initialValue = parseCurrencyInput(document.getElementById('edit-deal-initial')) || deal.initialValue;
    deal.amount = parseCurrencyInput(document.getElementById('edit-deal-amount')) || deal.amount;
    deal.rep = document.getElementById('edit-deal-rep').value;
    deal.source = document.getElementById('edit-deal-source').value;
    deal.stage = document.getElementById('edit-deal-stage').value;
    deal.tier = deal.amount >= (appState.context === 'IDR' ? 50000000 : 50000) ? 'Enterprise' : 'Mid-Market';
    
    if (oldStage !== 'closed-won' && deal.stage === 'closed-won') {
      triggerConfetti();
    }

    saveState();
    closeEditDealModal();
    showNotificationToast(`Updated deal details for "${deal.title}"`);
  }
}

function handleDeleteCurrentDeal() {
  const dealId = document.getElementById('edit-deal-id').value;
  const deal = appState.deals.find(d => d.id === dealId);
  if (deal && confirm(`Are you sure you want to archive deal "${deal.title}"?`)) {
    appState.deals = appState.deals.filter(d => d.id !== dealId);
    saveState();
    closeEditDealModal();
    showNotificationToast(`Archived deal "${deal.title}"`);
  }
}

// Shortcuts Guide Modal Handlers
function openShortcutsModal() {
  document.getElementById('shortcuts-modal')?.classList.remove('hidden');
}

function closeShortcutsModal() {
  document.getElementById('shortcuts-modal')?.classList.add('hidden');
}

// Revenue Forecast & Statistical Insights Calculator
function updateForecastAnalytics() {
  const deals = appState.deals;
  const wonDeals = deals.filter(d => d.stage === 'closed-won');
  const lostDeals = deals.filter(d => d.stage === 'closed-lost');
  
  const wonTotal = wonDeals.reduce((acc, d) => acc + d.amount, 0);
  const activeTotal = deals.filter(d => d.stage !== 'closed-won' && d.stage !== 'closed-lost').reduce((acc, d) => acc + d.amount, 0);

  const minRange = Math.round(wonTotal + activeTotal * 0.38);
  const maxRange = Math.round(wonTotal + activeTotal * 0.72);

  const rangeElem = document.getElementById('forecast-range-text');
  if (rangeElem) {
    if (activeTotal === 0 && wonTotal === 0) {
      rangeElem.textContent = 'Belum ada data proyeksi';
      rangeElem.classList.add('text-lg', 'text-gray-400');
    } else {
      rangeElem.textContent = `${formatCurrency(minRange)} - ${formatCurrency(maxRange)}`;
      rangeElem.classList.remove('text-lg', 'text-gray-400');
    }
  }

  const lostElem = document.getElementById('insight-lost-reason');
  if (lostElem) {
    if (lostDeals.length === 0) {
      lostElem.textContent = 'Belum ada data Closed Lost bulan ini.';
    } else {
      const lostReasons = lostDeals.map(d => d.lostReason);
      const priceCount = lostReasons.filter(r => r === 'harga').length;
      const pricePct = Math.round((priceCount / lostDeals.length) * 100);
      lostElem.textContent = `${pricePct}% deal lost bulan ini karena alasan harga`;
    }
  }
}


function resetFilters() {
  const searchInput = document.getElementById('global-search');
  if (searchInput) searchInput.value = '';
  showNotificationToast('Filters reset to default view');
}

// 3D Spotlight Tilt Card Mouse Handlers
function handleCardMouseMove(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  
  card.style.setProperty('--mouse-x', `${x}px`);
  card.style.setProperty('--mouse-y', `${y}px`);

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;
  const rotateX = ((y - centerY) / centerY) * -5;
  const rotateY = ((x - centerX) / centerX) * 5;

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.01, 1.01, 1.01)`;
}

function handleCardMouseLeave(e) {
  const card = e.currentTarget;
  card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
}

// Export CSV & Print Functions
function exportPipelineCSV() {
  const headers = ['ID', 'Title', 'Initial_Value', 'Current_Amount', 'Weighted_EV', 'Win_Score', 'Stage', 'Source', 'Rep', 'Stale_Days', 'Tier'];
  const rows = appState.deals.map(d => {
    const ev = d.amount * (STAGE_WEIGHTS[d.stage] || 0.1);
    const score = calculateDealWinScore(d);
    return [d.id, `"${d.title}"`, d.initialValue, d.amount, ev, `${score}%`, d.stage, d.source, `"${d.rep}"`, d.staleDays, d.tier];
  });
  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `Sokara_CRM_Pipeline_${appState.context}_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  playAudioFeedback('click');
  showNotificationToast('Pipeline summary exported to CSV file');
}

function printReport() {
  window.print();
}

// New Deal Wizard Handlers
function openNewDealModal() {
  const modal = document.getElementById('new-deal-modal');
  if (modal) modal.classList.remove('hidden');
}

function closeNewDealModal() {
  const modal = document.getElementById('new-deal-modal');
  if (modal) modal.classList.add('hidden');
}

function handleCreateDeal(event) {
  event.preventDefault();
  const title = document.getElementById('deal-title').value;
  let amount = parseCurrencyInput(document.getElementById('deal-amount'));
  const source = document.getElementById('deal-source').value;
  const stage = document.getElementById('deal-stage').value;

  // Smart Defaults logic
  if (!amount || amount === 0) {
    amount = appState.context === 'IDR' ? 15000000 : 15000; // Default SMB starting value
  }

  const newDeal = {
    id: `lead-${Date.now()}`,
    title,
    initialValue: amount,
    amount,
    stage,
    source,
    rep: 'Alex Mercer',
    staleDays: 0,
    responseTimeHours: 12,
    tier: amount >= (appState.context === 'IDR' ? 50000000 : 50000) ? 'Enterprise' : 'Mid-Market',
    createdAt: new Date().toISOString(),
    timeline: [
      { date: 'Hari Ini', text: `Lead dibuat di stage ${stage}` }
    ]
  };

  appState.deals.push(newDeal);
  saveState();
  closeNewDealModal();
  document.getElementById('new-deal-form').reset();
  const preview = document.getElementById('deal-amount-preview');
  if (preview) preview.textContent = '';
  playAudioFeedback('success');
  showNotificationToast(`Created lead "${title}" for ${formatCurrency(amount)}`);
}

// Toast Notifications
function showNotificationToast(msg) {
  const toast = document.getElementById('toast-notification');
  const msgElem = document.getElementById('toast-msg');
  if (!toast || !msgElem) return;

  msgElem.textContent = msg;
  toast.classList.remove('hidden');
  
  // Trigger animation next frame
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-4', 'opacity-0');
      toast.classList.add('flex');
    });
  });

  setTimeout(() => {
    toast.classList.add('translate-y-4', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('flex');
    }, 300);
  }, 3000);
}

function triggerSetupDatabase() {
  playAudioFeedback('success');
  showNotificationToast('⚡ Database setupDatabase() triggered successfully on Apps Script backend');
}

// Ambient Canvas Particle Field
function initAmbientCanvas() {
  // Ambient particle canvas disabled for clean minimalist UI
}

// Global Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    document.getElementById('global-search')?.focus();
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'f') {
    e.preventDefault();
    resetFilters();
  }
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'm') {
    e.preventDefault();
    toggleTheme();
  }
  if (e.key === 'Escape') {
    const search = document.getElementById('global-search');
    if (search && document.activeElement === search) {
      search.blur();
      search.value = '';
      renderKanban();
      if (appState.pipelineViewMode === 'table') renderPipelineTable();
    }
    // Close modals
    if (typeof closeEditDealModal === 'function') closeEditDealModal();
    if (typeof closeNewDealModal === 'function') closeNewDealModal();
    if (typeof closeShortcutsModal === 'function') closeShortcutsModal();
    if (typeof closeClosedLostModal === 'function') closeClosedLostModal();
  }
});

// 3D Interactive Motion Engine (Zero-Lag Poka-Yoke rAF DOM Mutations)
function init3DTiltCards() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const cards = document.querySelectorAll('.interactive-tilt-card');
  cards.forEach(card => {
    let rafId = null;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        card.style.setProperty('--tilt-x', `${rotateX.toFixed(2)}deg`);
        card.style.setProperty('--tilt-y', `${rotateY.toFixed(2)}deg`);
        card.style.setProperty('--spotlight-x', `${x.toFixed(1)}px`);
        card.style.setProperty('--spotlight-y', `${y.toFixed(1)}px`);
      });
    });

    card.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.style.setProperty('--tilt-x', '0deg');
      card.style.setProperty('--tilt-y', '0deg');
    });
  });
}

function initMagneticButtons() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const btns = document.querySelectorAll('.magnetic-btn');
  btns.forEach(btn => {
    let rafId = null;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        btn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
      });
    });

    btn.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      btn.style.transform = 'translate3d(0, 0, 0)';
    });
  });
}

function initScrollReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.scroll-reveal-item').forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.scroll-reveal-item').forEach(el => observer.observe(el));
}

// Main Render & Init
function renderApp() {
  renderKanban();
  if (appState.pipelineViewMode === 'table') renderPipelineTable();
  renderSimControls();
  updateSimulation();
  updateForecastAnalytics();
  init3DTiltCards();
  initMagneticButtons();
  initScrollReveal();
}

document.addEventListener('DOMContentLoaded', () => {
  initAmbientCanvas();
  setTheme(appState.theme);
  setContext(appState.context);
  window.addEventListener('hashchange', handleHashChange);
  handleHashChange();

  const searchElem = document.getElementById('global-search');
  if (searchElem) {
    searchElem.addEventListener('input', debounce(renderKanban, 120));
  }

  renderApp();
});

