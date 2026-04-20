# 🤖 Scotty AI (Gemini Edition)

A professional AI chatbot powered by **Google Gemini** (FREE), built for Render deployment.

---

## ✅ Step 1 — Get Your FREE Gemini API Key

1. Go to 👉 https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click **"Create API Key"**
4. Copy the key — you'll need it in Step 4

---

## ✅ Step 2 — Push to GitHub

1. Create a new repo on GitHub (can be private)
2. Upload all these project files to it

---

## ✅ Step 3 — Deploy on Render

1. Go to https://render.com → Sign up (free)
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Set these settings:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** Node

---

## ✅ Step 4 — Add API Key on Render

In your Render service settings → **Environment**:
- Key: `GEMINI_API_KEY`
- Value: *(paste your key from Step 1)*

Click **Save Changes** → your bot redeploys automatically 🚀

---

## 💻 Run Locally

```bash
npm install
cp .env.example .env
# Edit .env and paste your GEMINI_API_KEY
npm start
```

Open http://localhost:3000

---

Built by Scotty 🔥
