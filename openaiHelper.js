// openaiHelper.js
// Luna's AI helpers (front-end only, no real secret keys here)

const systemPrompt = `
You are Luna, a warm, gentle, emotionally supportive AI companion.
You speak with empathy, kindness, and understanding.
Your goal is to comfort users, help them feel safe, and support them emotionally.
You ask thoughtful follow-up questions, listen actively, and never judge.
Use soft, uplifting language and light emojis (🌿✨💛🌙) but do not overuse them.
Do NOT repeat the same sentence twice.
Do NOT give medical advice.
Respond like a real supportive friend who cares.
Adjust your tone based on user mood:
- If sad: be warm, grounding, gentle.
- If anxious: be calming, slow-paced, reassuring.
- If overwhelmed: break things into small steps.
- If happy: celebrate, encourage, uplift.
`;

export async function getLunaAIResponse({ messages, mood }) {
  const lastUserMessage =
    (messages || []).filter(m => m.role === 'user').slice(-1)[0]?.content || '';

  if (mood === 'sad') {
    return "It sounds like your heart is carrying a lot right now 💛 You don’t have to fix anything — I’m right here with you. What feels heaviest today?";
  }
  if (mood === 'anxious') {
    return "Let’s take a slow breath together 🌿 In… and out… You’re safe in this moment. What’s worrying you most right now?";
  }
  if (mood === 'overwhelmed') {
    return "When everything feels too much, we’ll take it gently. What’s one tiny thing we can focus on first?";
  }
  if (mood === 'happy') {
    return "I love hearing this ✨ What’s one moment today that brought you that brightness?";
  }

  if (!lastUserMessage) {
    return "Hi, I’m Luna 🌙 I’m really glad you’re here. How are you feeling right now?";
  }

  return "Thank you for sharing that with me 💛 What part of that feels most important to you right now?";
}

export async function getMoodAIResponse(mood) {
  switch (mood) {
    case 'happy':
      return "I’m so glad you’re feeling brighter today ✨ Hold onto the small wins.";
    case 'okay':
      return "‘Okay’ still counts as progress 🌿 You showed up for yourself today.";
    case 'sad':
      return "It’s okay to feel sad 💛 You’re not alone here.";
    case 'anxious':
      return "Let’s slow things down gently. You’re safe right now 🌿";
    default:
      return "Whatever you're feeling, I’m here with you 🌙";
  }
}

export function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-GB';
    msg.rate = 1;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  } catch {}
}

let recognition = null;

export function startVoiceInput(onText, onEnd) {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert('Voice input not supported.');
    if (onEnd) onEnd();
    return;
  }
  recognition = new SpeechRecognition();
  recognition.lang = 'en-GB';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = e => {
    const transcript = e.results[0][0].transcript;
    onText(transcript);
  };
  recognition.onend = () => onEnd && onEnd();
  recognition.onerror = () => onEnd && onEnd();
  recognition.start();
}

export function stopVoiceInput() {
  if (recognition) recognition.stop();
}