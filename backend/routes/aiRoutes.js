const express = require('express');
const multer = require('multer');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// 🔹 Simple health check
router.get('/ping', (req, res) => res.json({ ok: true, where: '/api/ai/ping' }));

// 🔹 File upload setup (8 MB limit, memory storage)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 }, // 8MB
});

// 🔹 Verify API key
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ GEMINI_API_KEY missing - please add it to backend/.env and restart the server.');
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/* ======================================================
   🧪 DEBUG ROUTE — List Models (Raw Google API)
   ====================================================== */
router.get('/list-models', async (req, res) => {
  try {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      return res.status(500).json({ ok: false, error: 'Missing GEMINI_API_KEY' });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`;
    const r = await fetch(url);
    const text = await r.text();

    console.log('[LIST_MODELS_STATUS]', r.status, r.statusText);
    console.log('[LIST_MODELS_BODY_FIRST_1K]', text.slice(0, 1000)); // prevent spamming console

    res.status(r.status).type('application/json').send(text);
  } catch (err) {
    console.error('[LIST_MODELS_ERROR]', err);
    res.status(500).json({ ok: false, error: String(err) });
  }
});

/* ======================================================
   🧠 AI SYMPTOM ANALYZER — Text + Optional Image
   ====================================================== */
router.post('/symptoms', upload.single('photo'), async (req, res) => {
  try {
    const apiKeyPresent = !!process.env.GEMINI_API_KEY;
    console.log('[AI_SYMPTOMS] API Key present:', apiKeyPresent);

    if (!apiKeyPresent) {
      return res.status(500).json({ ok: false, error: 'GEMINI_API_KEY not configured on server' });
    }

    const { symptoms, petType, age } = req.body;
    if (!symptoms && !req.file) {
      return res.status(400).json({ ok: false, error: 'Provide symptoms text or an image.' });
    }

    const MODEL_NAME = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    console.log('[AI_SYMPTOMS] using model:', MODEL_NAME, { hasFile: !!req.file, petType, age });

    // Build AI request
    const parts = [
      {
        text: `You are a veterinary triage assistant. Return JSON only with schema:
{
  "conditions": [{"name": string, "rationale": string}],
  "overallUrgency": "low" | "moderate" | "high",
  "careTips": [string],
  "disclaimer": string
}
Pet type: ${petType || 'Unknown'}
Age: ${age || 'Unknown'}
Symptoms: ${symptoms || 'N/A'}`
      },
    ];

    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const mimeType = req.file.mimetype || 'image/jpeg';
      parts.push({ inlineData: { data: base64, mimeType } });
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
      },
    });

    const text = result?.response?.text?.();
    console.log('[AI_SYMPTOMS] Raw response length:', text?.length ?? 'n/a');

    let data;
    try { data = JSON.parse(text); }
    catch { data = { rawText: text }; }

    return res.json({ ok: true, model: MODEL_NAME, data });
  } catch (err) {
    console.error('[AI_SYMPTOMS_ERROR]', {
      name: err?.name,
      message: err?.message,
      code: err?.code || err?.status,
      statusCode: err?.statusCode,
      data: err?.response?.data,
      stack: (err?.stack || '').split('\n').slice(0, 5).join('\n'),
    });
    return res.status(500).json({ ok: false, error: 'AI analysis failed', details: err?.message });
  }
});

module.exports = router;
