const request = require('supertest');
const app = require('../../server');
const SymptomCheck = require('../../models/SymptomCheck');
const { connect, closeDatabase, clearDatabase } = require('../helpers/db');

describe('Symptom Checker Integration', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('should analyze symptoms, persist normalized AI response and raw AI JSON', async () => {
    const res = await request(app)
      .post('/api/symptom-checker/analyze')
      .send({ petType: 'Dog', symptoms: 'coughing and sneezing' })
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.symptomCheckId).toBeDefined();

    const doc = await SymptomCheck.findById(res.body.symptomCheckId).lean();
    expect(doc).toBeDefined();
    expect(doc.aiResponse).toBeDefined();
    // rawAI should be present (from geminiService.rawParsed)
    expect(doc.aiResponse.rawAI).toBeDefined();
    // urgencyLevel should be one of allowed enums
    expect(['low','medium','high','emergency']).toContain(doc.aiResponse.urgencyLevel);
    // possibleConditions should be an array with normalized items
    expect(Array.isArray(doc.aiResponse.possibleConditions)).toBe(true);
    if (doc.aiResponse.possibleConditions.length > 0) {
      const c = doc.aiResponse.possibleConditions[0];
      expect(c.name).toBeDefined();
      expect(['low','moderate','high','emergency','low','medium']).toContain(c.severity || '');
    }
  });
});
