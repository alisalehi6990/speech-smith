# 🗣️ Speech Smith – Local AI Conversational Form Builder

A fully offline, AI-powered conversational assistant that asks questions and extracts structured data from voice or text input. Built from scratch for privacy, flexibility, and local-first use—no cloud APIs required.

---

**Author:** Ali Salehi  
[GitHub: alisalehi6990](https://github.com/alisalehi6990)  
Email: alisalehi6990@gmail.com

---

## 🧩 Features

- 💬 Conversational form: Extracts structured data by asking smart, context-aware questions
- 🎙️ Accepts microphone, file upload, or typed input
- 🧠 Powered by local LLMs (Llama3.1) & Whisper (via Docker)
- 🛡️ 100% offline: No data ever leaves your machine
- 📥 Embeddable as a React component
- 🐳 Fully containerized (Docker + Docker Compose)

## 🧱 Architecture

- **Frontend:** React + Vite (see `frontend/`)
- **Backend:** Node.js/Express, local LLM (Llama3), Whisper for speech-to-text (see `backend/`)
- **Dockerized:** All services run locally via Docker Compose

## 🚀 How to Run Locally

```bash
git clone https://github.com/alisalehi6990/speech-smith.git
cd speech-smith
docker-compose up --build
```

- Access the frontend at [http://localhost:5173](http://localhost:5173)
- Backend API runs at [http://localhost:3001](http://localhost:3001)

## 🤝 Contributing
Pull requests and issues are welcome! See individual READMEs in `frontend/` and `backend/` for more details.

---

© 2024 Ali Salehi

## 🚀 Try It Out

[Live Demo](https://yourdemo.link)  – Powered by PlayWithDocker

## 🧱 How to Run Locally

```bash
git clone https://github.com/alisalehi6990/speech-smith.git
cd speech-smith
docker-compose up --build