const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config/config');

let genAI;
let model;

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
    model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    console.log('✅ Gemini AI initialized successfully');
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
    if (!model) {
      initializeGemini();
    }

    if (!model) {
      throw new Error('Gemini AI is not initialized. Please check your API key.');
    }

    const { petType, symptoms, duration, severity, additionalInfo } = symptomData;

    // Construct detailed prompt for veterinary symptom analysis
    const prompt = `
You are a veterinary assistant AI helping pet owners understand their pet's symptoms. 
Provide helpful, educational information but always remind users to consult a real veterinarian for proper diagnosis and treatment.

Pet Information:
- Type: ${petType}
- Symptoms: ${symptoms}
- Duration: ${duration || 'Not specified'}
- Severity: ${severity || 'Not specified'}
${additionalInfo ? `- Additional Info: ${additionalInfo}` : ''}

Please provide:
1. Possible Causes: List 3-5 potential causes for these symptoms (from most to least likely)
2. Severity Assessment: Rate the urgency (Low/Moderate/High/Emergency)
3. Immediate Care: What the owner can do right now
4. When to See a Vet: Clear guidance on when professional help is needed
5. Prevention Tips: How to prevent similar issues in the future

Important: Always emphasize that this is educational information only and not a substitute for professional veterinary care.

Format your response in a clear, structured manner with bullet points.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const analysisText = response.text();

    // Parse the response into structured data
    const analysis = {
      rawAnalysis: analysisText,
      petType,
      symptoms,
      timestamp: new Date().toISOString(),
      disclaimer: 'This analysis is for educational purposes only. Please consult a licensed veterinarian for proper diagnosis and treatment.',
    };

    // Try to extract severity level
    const severityMatch = analysisText.match(/(?:urgency|severity)[:\s]*(Low|Moderate|High|Emergency)/i);
    if (severityMatch) {
      analysis.urgency = severityMatch[1];
    }

    return analysis;
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
