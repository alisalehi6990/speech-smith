# Speech Smith Backend

This is the backend for **Speech Smith**—a fully offline, AI-powered conversational data extraction engine. It powers the conversational form by managing sessions, extracting fields using a local LLM (Llama3), and transcribing audio with Whisper—all running locally for maximum privacy.

## ✨ Features
- Local LLM (Llama3) for smart, context-aware question generation and field extraction
- Whisper for speech-to-text, running locally (no cloud APIs)
- Session management for multi-turn conversations
- REST API for frontend integration
- 100% offline: No data leaves your machine

## 🛠️ API Endpoints
- `POST /api/conversation/start` – Start a new conversation with a list of required fields
- `POST /api/conversation/answer` – Submit an answer and get the next question or completion
- `POST /api/process` – Upload audio and extract fields in one step

See `swagger.js` for full API documentation.

## 🏗️ Architecture
- Node.js/Express server
- Integrates with local Llama3 and Whisper via Docker
- Modular services for conversation, audio, and session management

## 🚀 Running Locally

```bash
cd backend
npm install
npm run dev
```

- The backend runs at [http://localhost:3001](http://localhost:3001)
- Requires Llama3 and Whisper services (see Docker Compose in project root)

## 🧪 Running Tests

```bash
npm test
```

## 🤝 Contributing
Pull requests and issues are welcome!

---

**Author:** Ali Salehi  
[GitHub: alisalehi6990](https://github.com/alisalehi6990) 