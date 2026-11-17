# Kamushabe Ampulira - AI-Powered Portfolio

A modern, dark-themed developer portfolio featuring a RAG (Retrieval-Augmented Generation) AI chatbot that can answer questions about my skills, experience, and projects in real-time.

## 🚀 Live Demo
- **Frontend:** [https://portfolio-frontend-9y4j.onrender.com](https://portfolio-frontend-9y4j.onrender.com)
- **Backend API:** [https://portfolio-sti8.onrender.com](https://portfolio-sti8.onrender.com)

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
├── render.yaml                    # Render Blueprint (both services)
└── README.md

## 🚀 Deploying to Render

The repo includes a [`render.yaml`](./render.yaml) Blueprint that creates both the API and the static site.

1. Push all changes to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New → Blueprint** and select this repository.
3. When prompted, fill in these secrets (they are **not** stored in the repo):
   - `PINECONE_API_KEY` — from [Pinecone](https://app.pinecone.io/)
   - `OPENROUTER_API_KEY` — from [OpenRouter](https://openrouter.ai/keys)
4. Click **Apply**. Render creates:
   - `portfolio-api` → `https://portfolio-api.onrender.com`
   - `portfolio-frontend` → `https://portfolio-frontend.onrender.com`
5. Verify the API is healthy at `https://portfolio-api.onrender.com/api/health` (expect `{"status":"ok"}`).

### Populate the Pinecone index

The chatbot needs the portfolio data embedded in Pinecone once before it can answer questions. Run this locally (not on Render):

```bash
cd backend
cp .env.example .env   # Windows: copy .env.example .env
# Fill in PINECONE_API_KEY and OPENROUTER_API_KEY in .env
npm install
npm run ingest
```

The index is created automatically with the correct 384 dimensions if it doesn't exist yet.

> Note: on the Render free plan the API sleeps after inactivity, so the first chat request after a wake-up can be slow while the local embedding model downloads/loads. Upgrade the plan if that's noticeable.

### Local development

```bash
cd backend
npm install
cp .env.example .env   # Windows: copy .env.example .env
npm start              # API at http://localhost:5000
```

Then open `frontend/index.html` in a browser. `frontend/config.js` automatically points the chat UI at `localhost:5000` during local development and at the deployed Render API in production. If you rename the Render web service, update the URL in `frontend/config.js`.