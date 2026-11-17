const express = require("express");
const cors = require("cors");
const { ChatOpenAI } = require("@langchain/openai");
const { PineconeStore } = require("@langchain/pinecone");
const { Pinecone } = require("@pinecone-database/pinecone");
const LocalEmbeddings = require("./LocalEmbeddings");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Setup Vector Database
const pinecone = new Pinecone({ apiKey: process.env.PINECONE_API_KEY });
const pineconeIndex = pinecone.Index("portfolio-index");

// Setup Chat Model (Using OpenRouter)
const model = new ChatOpenAI({
  temperature: 0.2,
  modelName: "google/gemini-3.7-flash",
  maxTokens: 1024,
  configuration: {
    baseURL: "https://openrouter.ai/api/v1",
    defaultHeaders: {
      "HTTP-Referer": "http://localhost:5000",
      "X-Title": "Kamushabe Portfolio",
    },
    apiKey: process.env.OPENROUTER_API_KEY,
  },
});

app.post("/api/chat", async (req, res) => {
  const { question } = req.body;

  try {
    const embeddings = new LocalEmbeddings();
    const vectorStore = await PineconeStore.fromExistingIndex(
      embeddings,
      { pineconeIndex },
    );

    // 1. Retrieve relevant context from your resume
    const relevantDocs = await vectorStore.similaritySearch(question, 3);
    const context = relevantDocs.map((doc) => doc.pageContent).join("\n\n");

    // 2. Generate response
    const prompt = `
      You are the AI assistant for Kamushabe Ampulira's portfolio.
      Answer the user's question accurately based ONLY on the context provided below.
      If the answer is not in the context, politely say you don't know and suggest they contact Kamushabe directly.
      Keep your answers concise, professional, and friendly.

      Context: ${context}

      Question: ${question}
    `;

    const response = await model.invoke(prompt);
    res.json({ answer: response.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to process chat request." });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
