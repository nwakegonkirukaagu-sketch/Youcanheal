// your_script.js
// Consolidated front-end logic for YouCanHeal. This file wires up Supabase auth,
// Luna chat, voice helpers, mood tracker, habit helpers, and local persistence.

import {
  getLunaAIResponse,
  getMoodAIResponse,
  speakText,
  startVoiceInput,
  stopVoiceInput
} from './openaiHelper.js';

import {
  ensureSupabase,
  saveMoodToSupabase,
  loadServerMoodHistory
} from './supabaseHelper.js';

const MAX_MEMORY = 10;
const lunaConversationHistory = [];
const state = {
  typingBubble: null,
  totalSteps: 0,
  moodHistory: [],
  growthEntries: []
};

// -------------------------
// CHAT HELPERS
// -------------------------
function pushToMemory(role, content) {
  lunaConversationHistory.push({ role, content });
  if (lunaConversationHistory.length > MAX_MEMORY) {
    lunaConversationHistory.splice(0, lunaConversationHistory.length - MAX_MEMORY);
  }
}

function createBubble(text, role) {
  const bubble = document.createElement('div');
  bubble.style.margin = '0.45rem 0';
  bubble.style.textAlign = role === 'user' ? 'right' : 'left';
  const bg = role === 'user' ? 'var(--lavender-dark)' : 'var(--mint)';
  const color = role === 'user' ? '#fff' : '#2e2e4d';
  bubble.innerHTML = `<span style="display:inline-block;padding:0.65rem 0.95rem;border-radius:14px;background:${bg};color:${color};">${text}</span>`;
  return bubble;
}

function appendMessage(container, text, role = 'luna') {
  if (!container) return;
  container.appendChild(createBubble(text, role));
  container.scrollTop = container.scrollHeight;
}

function showTyping(container) {
  if (!container) return null;
  const dotWrap = document.createElement('div');
  dotWrap.className = 'typing-indicator';
  dotWrap.innerHTML = '<div class="dot"></div><div class="dot"></div><div class="dot"></div>';
  container.appendChild(dotWrap);
  container.scrollTop = container.scrollHeight;
  return dotWrap;
}

function detectMoodFromText(text) {
  const lower = (text || '').toLowerCase();
  if (lower.includes('sad') || lower.includes('down') || lower.includes('cry')) return 'sad';
  if (lower.includes('anxious') || lower.includes('panic')) return 'anxious';
  if (lower.includes('overwhelm')) return 'overwhelmed';
  if (lower.includes('happy') || lower.includes('good')) return 'happy';
  return 'neutral';
}

// -------------------------
// LUNA CHAT
// -------------------------
function initLunaWidget() {
  const bubble = document.getElementById('lunaBubble');
  const modal = document.getElementById('lunaModal');
  const closeBtn = document.getElementById('lunaClose');
  const input = document.getElementById('lunaInput');
  const sendBtn = document.getElementById('lunaSend');
  const messages = document.getElementById('lunaMessages');
  const micButton = document.getElementById('lunaMicBtn');

  if (!bubble || !modal || !input || !sendBtn || !messages) return;

  const openModal = () => {
    modal.style.display = 'flex';
    if (!messages.childElementCount) {
      appendMessage(messages, "Hi love, I'm Luna 🌙 What’s on your heart?", 'luna');
    }
    input.focus();
  };

  const closeModal = () => {
    modal.style.display = 'none';
    stopVoiceInput();
  };

  const handleSend = async () => {
    const text = input.value.trim();
    if (!text) return;
    appendMessage(messages, text, 'user');
    pushToMemory('user', text);
    input.value = '';

    state.typingBubble?.remove();
    state.typingBubble = showTyping(messages);

    const reply = await getLunaAIResponse({
      messages: lunaConversationHistory,
      mood: detectMoodFromText(text)
    });

    state.typingBubble?.remove();
    appendMessage(messages, reply, 'luna');
    pushToMemory('assistant', reply);
    speakText(reply);
  };

  bubble.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  sendBtn.addEventListener('click', handleSend);
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  });

  micButton?.addEventListener('click', () => {
    micButton.disabled = true;
    micButton.textContent = '🎙️ Listening…';
    startVoiceInput(text => {
      input.value = text;
      micButton.disabled = false;
      micButton.textContent = '🎤';
      handleSend();
    }, () => {
      micButton.disabled = false;
      micButton.textContent = '🎤';
    });
  });
}

// -------------------------
// MAGIC LINK AUTH
// -------------------------
function initMagicLinkAuth() {
  const emailInput = document.getElementById('emailInput');
  const sendBtn = document.getElementById('sendMagicLinkBtn');
  const helpBtn = document.getElementById('openMagicStatus');
  const statusEl = document.getElementById('magicStatus');

  if (!emailInput || !sendBtn || !statusEl) return;

  helpBtn?.addEventListener('click', () => {
    alert('Magic link tips:\n• Double-check your email spelling\n• Check spam / promotions\n• Link expires in 5 minutes\n• Email must match your Supabase auth settings');
  });

  sendBtn.addEventListener('click', async () => {
    const email = emailInput.value.trim();
    if (!email || !email.includes('@')) {
      statusEl.textContent = 'Please enter a valid email.';
      statusEl.style.color = '#c62828';
      return;
    }

    statusEl.textContent = 'Sending secure magic link…';
    statusEl.style.color = '';

    const supabase = await ensureSupabase();
    if (!supabase) {
      statusEl.textContent = 'Supabase client unavailable on this page.';
      statusEl.style.color = '#c62828';
      return;
    }

    try {
      const redirectTo = `${window.location.origin}${window.location.pathname}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          shouldCreateUser: true
        }
      });

      if (error) throw error;

      statusEl.textContent = `Magic link sent to ${email}. Check spam if needed.`;
      statusEl.style.color = '#1b5e20';
    } catch (err) {
      console.error('Magic link error', err);
      statusEl.textContent = err.message || 'Unable to send link right now.';
      statusEl.style.color = '#c62828';
    }
  });
}

// -------------------------
// GENTLE BOOST + HABITS
// -------------------------
function initGentleBoost() {
  const boosts = [
    'Take three slow breaths 🌿',
    'Roll your shoulders and stretch softly 🌸',
    'Sip water mindfully 💧',
    'Note one thing you’re grateful for 🌼'
  ];

  const boostText = document.getElementById('boostText');
  const getBtn = document.getElementById('getBoostBtn');
  const markBtn = document.getElementById('markDoneBtn');
  const snoozeBtn = document.getElementById('snoozeBtn');

  if (!boostText || !getBtn) return;

  getBtn.addEventListener('click', () => {
    const pick = boosts[Math.floor(Math.random() * boosts.length)];
    boostText.textContent = pick;
    markBtn && (markBtn.style.display = 'inline-block');
    snoozeBtn && (snoozeBtn.style.display = 'inline-block');
  });

  markBtn?.addEventListener('click', () => {
    boostText.textContent = 'Beautiful work. Your effort matters ✨';
    markBtn.style.display = 'none';
    snoozeBtn && (snoozeBtn.style.display = 'none');
  });

  snoozeBtn?.addEventListener('click', () => {
    boostText.textContent = 'Reminder snoozed. Tap again anytime.';
    markBtn.style.display = 'none';
    snoozeBtn.style.display = 'none';
  });
}

function initStepTracker() {
  const input = document.getElementById('stepInput');
  const addBtn = document.getElementById('addStepsBtn');
  const totalEl = document.getElementById('stepCount');
  if (!input || !addBtn || !totalEl) return;

  const loadSteps = () => {
    state.totalSteps = Number(localStorage.getItem('ych-steps')) || 0;
    totalEl.textContent = state.totalSteps.toString();
  };

  loadSteps();

  addBtn.addEventListener('click', () => {
    const value = parseInt(input.value, 10);
    if (!Number.isFinite(value) || value <= 0) {
      alert('Please enter a positive number of steps.');
      return;
    }
    state.totalSteps += value;
    localStorage.setItem('ych-steps', state.totalSteps);
    totalEl.textContent = state.totalSteps.toString();
    input.value = '';
  });
}

// -------------------------
// MOOD TRACKER
// -------------------------
function initMoodTracker() {
  const moodButtons = document.querySelectorAll('.mood-btn');
  const logEl = document.getElementById('moodLog');
  if (!moodButtons.length || !logEl) return;

  const loadLocal = () => {
    state.moodHistory = JSON.parse(localStorage.getItem('ych-moods') || '[]');
    renderMoodHistory(logEl);
  };

  const handleMoodClick = async mood => {
    state.moodHistory.push({ mood, ts: new Date().toISOString() });
    state.moodHistory = state.moodHistory.slice(-30);
    localStorage.setItem('ych-moods', JSON.stringify(state.moodHistory));
    renderMoodHistory(logEl);

    saveMoodToSupabase(mood);
    const response = await getMoodAIResponse(mood);
    logEl.textContent += `\nLuna: ${response}`;
  };

  moodButtons.forEach(btn => {
    btn.addEventListener('click', () => handleMoodClick(btn.dataset.mood));
  });

  loadLocal();
  preloadServerMoods(logEl);
}

function renderMoodHistory(targetEl) {
  if (!targetEl) return;
  if (!state.moodHistory.length) {
    targetEl.textContent = 'No moods logged yet.';
    return;
  }
  const latest = state.moodHistory.map(entry => `${entry.mood} (${new Date(entry.ts).toLocaleDateString()})`);
  targetEl.textContent = `Logged moods: ${latest.join(', ')}`;
}

async function preloadServerMoods(targetEl) {
  const moods = await loadServerMoodHistory(5);
  if (!moods?.length || !targetEl) return;
  targetEl.textContent += `\nRecent secure logs: ${moods
    .map(m => `${m.mood} (${new Date(m.created_at).toLocaleString()})`)
    .join(', ')}`;
}

// -------------------------
// GROWTH TRACKER
// -------------------------
function initGrowthTracker() {
  const saveBtn = document.getElementById('saveGrowthBtn');
  const list = document.getElementById('growthList');
  const weightInput = document.getElementById('weightInput');
  const heightInput = document.getElementById('heightInput');
  const milestoneInput = document.getElementById('milestoneInput');
  if (!saveBtn || !list || !weightInput || !heightInput || !milestoneInput) return;

  const loadEntries = () => {
    state.growthEntries = JSON.parse(localStorage.getItem('ych-growth') || '[]');
    renderGrowthEntries(list);
  };

  saveBtn.addEventListener('click', () => {
    const weight = weightInput.value.trim();
    const height = heightInput.value.trim();
    const milestone = milestoneInput.value.trim();
    if (!weight && !height && !milestone) {
      alert('Add at least one detail before saving.');
      return;
    }

    const id = globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function'
      ? globalThis.crypto.randomUUID()
      : Date.now().toString();

    state.growthEntries.unshift({
      id,
      weight,
      height,
      milestone,
      ts: new Date().toISOString()
    });
    state.growthEntries = state.growthEntries.slice(0, 30);
    localStorage.setItem('ych-growth', JSON.stringify(state.growthEntries));
    renderGrowthEntries(list);
    [weightInput, heightInput, milestoneInput].forEach(el => (el.value = ''));
  });

  loadEntries();
}

function renderGrowthEntries(list) {
  list.innerHTML = '';
  if (!state.growthEntries.length) {
    list.innerHTML = '<li>No entries yet.</li>';
    return;
  }
  state.growthEntries.forEach(entry => {
    const item = document.createElement('li');
    const parts = [];
    if (entry.weight) parts.push(`${entry.weight}kg`);
    if (entry.height) parts.push(`${entry.height}cm`);
    if (entry.milestone) parts.push(entry.milestone);
    item.textContent = `📏 ${parts.join(' • ')} — ${new Date(entry.ts).toLocaleDateString()}`;
    list.appendChild(item);
  });
}

// -------------------------
// DARK MODE
// -------------------------
function initDarkModeToggle() {
  const toggle = document.getElementById('darkModeToggle');
  if (!toggle) return;

  const stored = localStorage.getItem('ych-dark-mode');
  const prefersDark = window.matchMedia
    ? window.matchMedia('(prefers-color-scheme: dark)').matches
    : false;
  const initial = stored ? stored === '1' : prefersDark;

  const apply = isDark => {
    document.body.classList.toggle('dark-mode', isDark);
    toggle.textContent = isDark ? '☀️ Light mode' : '🌙 Dark mode';
    localStorage.setItem('ych-dark-mode', isDark ? '1' : '0');
  };

  apply(initial);
  toggle.addEventListener('click', () => apply(!document.body.classList.contains('dark-mode')));
}

// -------------------------
// INIT
// -------------------------
export function initYouCanHeal() {
  initMagicLinkAuth();
  initGentleBoost();
  initStepTracker();
  initMoodTracker();
  initGrowthTracker();
  initLunaWidget();
  initDarkModeToggle();
}

if (document.readyState === 'complete' || document.readyState === 'interactive') {
  initYouCanHeal();
} else {
  document.addEventListener('DOMContentLoaded', initYouCanHeal);
}
