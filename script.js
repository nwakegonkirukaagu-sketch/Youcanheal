// --- System Prompt ---
const SYSTEM_PROMPT = `You are Luna, a gentle, supportive AI companion for wellbeing and new parents. Respond with empathy, encouragement, and practical tips. Keep replies short, warm, and positive.`;

// --- Mood Detector ---
function detectMood(text) {
  const lower = text.toLowerCase();
  if (lower.includes('sad') || lower.includes('down')) return 'sad';
  if (lower.includes('happy') || lower.includes('good')) return 'happy';
  if (lower.includes('anxious') || lower.includes('worried')) return 'anxious';
  if (lower.includes('okay') || lower.includes('fine')) return 'okay';
  return 'neutral';
}

// --- Conversation Memory ---
const conversation = [
  { role: 'system', content: SYSTEM_PROMPT }
];

function addMessage(role, content) {
  conversation.push({ role, content });
  if (conversation.length > 12) conversation.splice(1, conversation.length - 12); // keep last 12
}

// --- OpenAI Request ---
async function fetchLunaReply(userText) {
  addMessage('user', userText);
  const apiKey = window.OPENAI_API_KEY || '';
  const url = 'https://api.openai.com/v1/chat/completions';
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  const body = JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: conversation,
    max_tokens: 120,
    temperature: 0.7
  });
  const res = await fetch(url, { method: 'POST', headers, body });
  const data = await res.json();
  const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, Luna is having trouble responding.';
  addMessage('assistant', reply);
  return reply;
}

// --- Chat Bubble Functions ---
function displayUserMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble user";
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function displayLunaMessage(text) {
  const chatBox = document.getElementById("chat-box");
  const bubble = document.createElement("div");
  bubble.className = "chat-bubble luna";
  bubble.textContent = text;
  chatBox.appendChild(bubble);
  chatBox.scrollTop = chatBox.scrollHeight;
}
