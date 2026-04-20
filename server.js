require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Init Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAMcLdApOcooDqRlBR-uN_ecdGXu-4Ca1c');

const SYSTEM_PROMPT = `You are Scotty AI, a highly intelligent, friendly, and professional AI assistant.
You are knowledgeable, helpful, and always provide accurate, thoughtful responses.
You speak in a clear, engaging way and adapt your tone to the user's needs.
For technical questions, be precise and detailed.
For casual conversations, be warm and personable.
Always be genuinely helpful and honest.
Your creator is Scotty.`;

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Scotty AI is running!' });
});

// Chat endpoint with streaming
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Invalid messages format' });
    }

    // Set up SSE streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });

    // Convert messages to Gemini format
    // Gemini uses 'user' and 'model' roles
    const history = messages.slice(0, -1).map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const lastMessage = messages[messages.length - 1].content;

    // Start chat with history
    const chat = model.startChat({ history });

    // Stream response
    const result = await chat.sendMessageStream(lastMessage);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Chat error:', error);
    const msg = error.message || 'Something went wrong';

    if (!res.headersSent) {
      return res.status(500).json({ error: msg });
    }

    res.write(`data: ${JSON.stringify({ error: msg })}\n\n`);
    res.end();
  }
});

// Catch-all route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🤖 Scotty AI running on port ${PORT}`);
});
