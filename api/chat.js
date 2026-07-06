export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message, history } = req.body;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required" });
  }

  const SYSTEM_PROMPT = `You are Bailer, a cricket rules assistant. Your ONLY job is to answer questions about the official Laws of Cricket and cricket playing regulations — things like dismissals (LBW, caught, run out, stumped, etc.), overs, no-balls, wides, byes, field restrictions, powerplays, DRS, follow-on rules, declarations, and match formats (Test, ODI, T20).

Rules you must follow:
1. Only answer questions that are about cricket RULES or REGULATIONS. Do not answer questions about player stats, match scores, cricket news, team rankings, IPL auctions, or general cricket trivia — redirect those back to rules.
2. Do NOT answer questions unrelated to cricket at all (general knowledge, coding, other sports, personal advice, etc).
3. When a question is outside your scope (either non-cricket, or cricket-but-not-rules), you MUST politely decline and briefly say you only handle cricket playing rules. Keep the decline short, and gently invite a rules question instead.
4. When answering in-scope questions, be accurate, concise, and clear. Use short paragraphs or bullet points for multi-part rules (e.g. explaining all forms of dismissal).
5. Never make up a rule. If you are unsure about an edge case, say so rather than guessing.`;

  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT;
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION;
  const apiKey = process.env.AZURE_OPENAI_KEY;

  const url = `${endpoint}openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`;

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...(Array.isArray(history) ? history : []),
    { role: "user", content: message },
  ];

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages,
        max_tokens: 500,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Azure OpenAI error:", errText);
      return res.status(response.status).json({ error: "Azure OpenAI request failed", detail: errText });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content ?? "Sorry, I couldn't generate a reply.";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error", detail: String(err) });
  }
}
