const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

let genAI;
let model;
let visionModel;

/**
 * Initialize Gemini AI
 */
const initializeGemini = () => {
  try {
    if (!config.gemini.apiKey || config.gemini.apiKey === 'your_gemini_api_key_here') {
      console.warn('⚠️  Gemini API key not configured. Symptom checker will not work.');
      return null;
    }

    genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    const modelName = config.gemini.model || 'gemini-1.5-flash';
    model = genAI.getGenerativeModel({ model: modelName });
    visionModel = genAI.getGenerativeModel({ model: modelName });

    console.log(`✅ Gemini AI initialized successfully with model: ${modelName}`);
    return model;
  } catch (error) {
    console.error('❌ Gemini AI initialization error:', error.message);
    return null;
  }
};

/**
 * Analyze pet symptoms using Gemini AI
 * @param {Object} symptomData - Symptom information
 * @returns {Promise<Object>} Analysis result
 */
const analyzeSymptoms = async (symptomData) => {
  try {
    if (!model || !visionModel) {
      initializeGemini();
    }

    if (!model || !visionModel) {
      throw new Error('Gemini AI is not initialized. Please check your API key.');
    }

    const { petType, symptoms, duration, severity, additionalInfo, imageBase64, imageMimeType } = symptomData;

    // Construct detailed prompt for veterinary symptom analysis
    // Ask the model to return structured JSON describing each detected condition and overall guidance.
    const prompt = `
You are a veterinary assistant AI. Produce ONLY valid JSON (no extra text) that exactly matches the following JSON Schema and uses the enum values specified.

JSON Schema (example):
{
  "urgencyLevel": "low|medium|high|emergency",
  "summary": "Short summary sentence for the owner",
  "conditions": [
    {
      "name": "Condition name",
      "likelihoodRank": 1,
      "summary": "Short description",
      "severity": "low|medium|high|emergency",
      "confidence": 0,
      "immediateCare": ["list of steps"],
      "redFlags": ["list of red flag signs"],
      "prevention": ["list of prevention tips"],
      "whatToTellVet": "one-line summary to copy to vet"
    }
  ],
  "recommendations": ["string"]
}

Rules:
- Use the exact enum values for 'urgencyLevel' and each condition's 'severity': one of: low, medium, high, emergency.
- Return up to 3 conditions in the 'conditions' array.
- All fields should be plain text (no markdown). Keep summaries concise (1-2 sentences).
- Do NOT include any explanatory text outside the JSON. The response must be parseable JSON.

Patient details:
- Type: ${petType}
- Symptoms: ${symptoms}
- Duration: ${duration || 'Not specified'}
- Severity: ${severity || 'Not specified'}
${additionalInfo ? `- Additional Info: ${additionalInfo}` : ''}
`;

    let result;
    if (imageBase64 && imageMimeType) {
      // Use vision model with image + text
      result = await visionModel.generateContent([
        { text: prompt },
        {
          inlineData: {
            data: imageBase64,
            mimeType: imageMimeType,
          },
        },
      ]);
    } else {
      result = await model.generateContent(prompt);
    }
    const response = await result.response;
    const analysisText = response.text();

    // The model should return only JSON. Parse it robustly.
    let parsed;
    try {
      parsed = JSON.parse(analysisText);
    } catch (err) {
      // Some models may include stray text. Try to extract the first JSON object in the text.
      const match = analysisText.match(/\{[\s\S]*\}/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('AI returned non-JSON response');
      }
    }

    // Minimal validation and return both raw text and parsed object for traceability.
    const normalized = {
      rawText: analysisText,
      rawParsed: parsed,
      petType,
      symptoms,
      timestamp: new Date().toISOString(),
      disclaimer: 'This analysis is for educational purposes only. Please consult a licensed veterinarian for proper diagnosis and treatment.',
      // Keep the top-level fields for backwards compatibility (map urgencyLevel if provided)
      urgencyLevel: parsed.urgencyLevel || parsed.overallUrgency || 'medium',
      summary: parsed.summary || '',
      conditions: Array.isArray(parsed.conditions) ? parsed.conditions.slice(0,3) : [],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations : [],
    };

    return normalized;
  } catch (error) {
    console.error('Gemini AI analysis error:', error);
    
    if (error.message?.includes('API key')) {
      throw new Error('Gemini API key is invalid or not configured');
    }
    
    if (error.message?.includes('quota')) {
      throw new Error('API quota exceeded. Please try again later.');
    }
    
    throw new Error(`Symptom analysis failed: ${error.message}`);
  }
};

/**
 * Get general pet health advice using Gemini AI
 * @param {String} question - Pet health question
 * @param {String} petType - Type of pet
 * @returns {Promise<Object>} AI response
 */
const getPetHealthAdvice = async (question, petType = 'general pet') => {
  try {
    if (!model) {
      initializeGemini();
    }

    if (!model) {
      throw new Error('Gemini AI is not initialized. Please check your API key.');
    }

    const prompt = `
You are a knowledgeable veterinary assistant. Answer the following pet health question with accurate, helpful information.

Pet Type: ${petType}
Question: ${question}

Provide a clear, concise answer. Include:
- Direct answer to the question
- Any important warnings or precautions
- When to consult a veterinarian if relevant

Keep the response under 300 words and always remind users to consult a professional veterinarian for specific medical advice.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const adviceText = response.text();

    return {
      question,
      petType,
      advice: adviceText,
      timestamp: new Date().toISOString(),
      disclaimer: 'This is general educational information. Always consult a licensed veterinarian for medical advice.',
    };
  } catch (error) {
    console.error('Gemini AI advice error:', error);
    throw new Error(`Failed to get health advice: ${error.message}`);
  }
};

/**
 * Generate emergency assessment
 * @param {Object} emergencyData - Emergency information
 * @returns {Promise<Object>} Emergency assessment
 */
const assessEmergency = async (emergencyData) => {
  try {
    if (!model) {
      initializeGemini();
    }

    if (!model) {
      throw new Error('Gemini AI is not initialized. Please check your API key.');
    }

    const { petType, symptoms, vitalSigns } = emergencyData;

    const prompt = `
You are an emergency veterinary triage assistant. Assess the following situation and provide immediate guidance.

Pet Type: ${petType}
Symptoms: ${symptoms}
${vitalSigns ? `Vital Signs: ${JSON.stringify(vitalSigns)}` : ''}

Provide:
1. Emergency Level: (Low/Moderate/High/CRITICAL)
2. Immediate Actions: What to do RIGHT NOW
3. Transport Instructions: How to safely transport the pet
4. What NOT to do
5. Expected timeline for seeking help

Be clear, direct, and prioritize pet safety. If this is a life-threatening emergency, make that very clear.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const assessmentText = response.text();

    return {
      assessment: assessmentText,
      petType,
      timestamp: new Date().toISOString(),
      emergencyContact: 'Call your nearest emergency veterinary clinic immediately if this is a critical situation.',
    };
  } catch (error) {
    console.error('Gemini AI emergency assessment error:', error);
    throw new Error(`Emergency assessment failed: ${error.message}`);
  }
};

module.exports = {
  initializeGemini,
  analyzeSymptoms,
  getPetHealthAdvice,
  assessEmergency,
};
