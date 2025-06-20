# Speech Smith Frontend

This is the React-based frontend for **Speech Smith**—a fully offline, AI-powered conversational form builder. It interacts with the backend to collect structured data from users via natural conversation, supporting both voice and text input.

## ✨ Features
- Conversational UI for smart, context-aware data collection
- Microphone, file upload, and text input support
- Real-time waveform and activity indicators
- Embeddable as a React component in other projects
- Modern, responsive design (Tailwind CSS)

## 🧩 Main Components
- `ConversationalForm/` – The core conversational form logic and UI
- `Waveform/` – Displays live audio waveform during recording
- `ActivityIndicator/` – Shows LLM/speech processing activity

## 🚀 Getting Started

```bash
cd frontend
npm install
npm run dev
```

- The app runs at [http://localhost:5173](http://localhost:5173)
- Make sure the backend is running for full functionality

## 🛠️ Customization
- To embed the form in your own app, import `ConversationalForm` from `src/components/ConversationalForm`.
- Update styles via Tailwind CSS in `index.css` and `App.css`.

## 🤝 Contributing
Pull requests and issues are welcome!

---

**Author:** Ali Salehi  
[GitHub: alisalehi6990](https://github.com/alisalehi6990)
