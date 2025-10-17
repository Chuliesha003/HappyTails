const { normalizeConditions, mapUrgencyToEnum } = require('../../utils/aiNormalization');

describe('AI Normalization Util', () => {
  test('mapUrgencyToEnum maps known values correctly', () => {
    expect(mapUrgencyToEnum('emergency')).toBe('emergency');
    expect(mapUrgencyToEnum('critical')).toBe('emergency');
    expect(mapUrgencyToEnum('high')).toBe('high');
    expect(mapUrgencyToEnum('moderate')).toBe('medium');
    expect(mapUrgencyToEnum('medium')).toBe('medium');
    expect(mapUrgencyToEnum('low')).toBe('low');
    expect(mapUrgencyToEnum(undefined)).toBe('medium');
  });

  test('normalizeConditions produces required shape', () => {
    const input = [
      { name: 'Test Condition', severity: 'high', confidence: 85, summary: 'Short desc', immediateCare: ['Do X'] },
    ];

    const normalized = normalizeConditions(input, 'medium');
    expect(Array.isArray(normalized)).toBe(true);
    expect(normalized[0].name).toBe('Test Condition');
    expect(normalized[0].severity).toBe('high');
    expect(normalized[0].confidence).toBe(85);
    expect(normalized[0].description).toBe('Short desc');
    expect(Array.isArray(normalized[0].recommendations)).toBe(true);
  });
});
