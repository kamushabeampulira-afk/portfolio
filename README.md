# Kamushabe Ampulira - AI-Powered Portfolio

A modern, dark-themed developer portfolio featuring a RAG (Retrieval-Augmented Generation) AI chatbot that can answer questions about my skills, experience, and projects in real-time.

## 🚀 Live Demo
*(Add your live links here once deployed)*
- **Frontend:** [https://your-portfolio-link.vercel.app](https://your-portfolio-link.vercel.app)
- **Backend API:** [https://your-backend-link.onrender.com](https://your-backend-link.onrender.com)

## 📸 Screenshots
*(Add a screenshot of your website and chatbot here to make your README stand out)*
- Home Page: `![Home Page](./frontend/assets/home-screenshot.png)`
- AI Chatbot: `![Chatbot](./frontend/assets/chatbot-screenshot.png)`

## ✨ Features
- **Modern Dark UI:** Built with custom CSS, featuring Emerald Green accents and smooth scroll animations.
- **RAG AI Chatbot:** A custom-trained AI assistant that uses Retrieval-Augmented Generation to accurately answer questions based *only* on my provided portfolio data.
- **Fully Responsive:** Optimized for mobile, tablet, and desktop viewing.
- **Project Showcase:** Highlighting full-stack, AI, and IoT projects.

## 🛠️ Tech Stack
**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- Google Fonts (Inter, Space Grotesk)
- Font Awesome (Icons)

**Backend (Chatbot):**
- Node.js & Express.js
- LangChain (RAG implementation)
- Transformers.js (local embeddings)
- OpenRouter (LLM generation)
- Pinecone (Vector Database)

## 📂 Project Structure
```text
kamushabe-portfolio/
│
├── frontend/                  # Portfolio Website
│   ├── index.html             # Main UI
│   ├── style.css              # Dark theme styling
│   ├── script.js              # Chat UI & scroll animations
│   └── assets/                # Images & CV
│
├── backend/                   # RAG Chatbot Server
│   ├── data/
│   │   └── PORTFOLIO_INFO.txt # Personal context data
│   ├── ingest.js              # Script to embed data into Pinecone
│   ├── server.js              # Express API for the chatbot
│   ├── package.json           # Backend dependencies
│   └── .env.example           # Environment variables template
│
└── README.md