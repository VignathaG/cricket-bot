# Bailer — Cricket Rules Bot (Session 5 Assignment)

## What this is
- `index.html` — the frontend chat UI (cricket pitch / scoreboard themed)
- `api/chat.js` — Vercel serverless function that calls Azure OpenAI with a fixed system prompt restricting the bot to cricket **rules** only

## Deploy steps

1. Push this folder to a new GitHub repo (or drag-and-drop deploy on vercel.com).
2. In Vercel, import the project.
3. Go to **Project Settings → Environment Variables** and add these four (values from your mentor):
   - `AZURE_OPENAI_KEY`
   - `AZURE_OPENAI_ENDPOINT`  (must end with a trailing slash, e.g. `https://faqbot.openai.azure.com/`)
   - `AZURE_OPENAI_DEPLOYMENT`
   - `AZURE_OPENAI_API_VERSION`
4. Deploy. Vercel auto-detects the `api/chat.js` file as a serverless function — no extra config needed.

**Never commit the actual key values into `index.html`, `chat.js`, or a `.env` file that gets pushed to GitHub.** They only live in Vercel's Environment Variables dashboard.

## What to submit
- Screenshot of the deployed bot (URL will be something like `cricket-bot-yourname.vercel.app`)
- Screenshot of `api/chat.js` showing the system prompt (this satisfies "your custom system prompt")
- One screenshot showing an in-scope question answered correctly (e.g. "What counts as LBW?")
- One screenshot showing an out-of-scope question declined (e.g. "What's the capital of France?" or "Who won the last IPL?")
