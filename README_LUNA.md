# 🌙 Luna AI Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env` and add your OpenAI API key:
```bash
cp .env.example .env
```

Edit `.env` file:
```env
OPENAI_API_KEY=your_actual_openai_api_key_here
SESSION_SECRET=luna-youcanhaeal-secret-2024
PORT=5000
NODE_ENV=development
```

### 3. Start the Server
```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

### 4. Access Luna
- Open your browser to `http://localhost:5000`
- Or serve your HTML files and ensure they connect to `http://localhost:5000/api/luna-chat`

## API Endpoints

### 🌙 Chat with Luna
**POST** `/api/luna-chat`
```json
{
  "message": "Hello Luna, I'm feeling anxious today",
  "userName": "Sarah" // optional
}
```

**Response:**
```json
{
  "reply": "I hear that you're feeling anxious, Sarah. Take a gentle breath with me 🌙 You're safe right here, right now.",
  "isCrisisResponse": false,
  "conversationLength": 2
}
```

### 🔄 Reset Conversation
**POST** `/api/luna-reset`
Clears the user's conversation history from the session.

### ❤️ Health Check
**GET** `/api/health`
Returns server status and session information.

## Features

### ✅ **Persistent Sessions**
- Each user maintains their conversation history across browser sessions
- Sessions last 24 hours by default
- Automatic memory management (keeps last 10 messages)

### ✅ **Crisis Detection**
- Real-time monitoring for crisis keywords
- Immediate response with professional resources
- Special styling for crisis responses in UI

### ✅ **Fallback System**
- Backend unavailable? Falls back to local AI
- Local AI unavailable? Shows empathetic error messages
- Graceful degradation ensures users are never left hanging

### ✅ **Empathetic AI**
- Specialized personality for mental health and parenting support
- Temperature 0.7 for warm, human-like responses
- Comprehensive system prompts for consistent empathy

## Development Notes

### Session Management
- Uses `express-session` with memory store (production should use Redis/DB)
- Session cookies are HTTP-only for security
- CORS configured for local development origins

### Crisis Resources Provided
- Crisis Text Line: Text HOME to 741741
- National Suicide Prevention Lifeline: 988
- SAMHSA Helpline: 1-800-662-4357
- Emergency Services: 911

### Production Deployment
1. Set `NODE_ENV=production`
2. Use a strong `SESSION_SECRET`
3. Configure `COOKIE_SECURE=true` for HTTPS
4. Use external session store (Redis/MongoDB)
5. Set up proper CORS origins

## File Structure
```
├── server.js           # Main backend server
├── package.json        # Dependencies
├── .env               # Environment variables
├── .env.example       # Environment template
├── index.html         # Frontend (with Luna integration)
├── openaiHelper.js    # Local AI fallback
└── README_LUNA.md     # This file
```

## Troubleshooting

**CORS Issues:**
- Ensure your frontend origin is in the CORS whitelist
- Check that `credentials: 'include'` is set in fetch requests

**Session Not Persisting:**
- Verify cookies are enabled in browser
- Check that `credentials: 'include'` is used in all API calls

**OpenAI Errors:**
- Verify `OPENAI_API_KEY` is correctly set in `.env`
- Check API key has sufficient credits/permissions

**Luna Not Responding:**
- Check server logs for errors
- Verify backend is running on port 5000
- Test the `/api/health` endpoint

## 🌙 Luna is ready to provide empathetic, persistent conversations! 💛