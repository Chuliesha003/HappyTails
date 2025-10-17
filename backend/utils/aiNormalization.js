/**
 * Normalize AI analysis object into shape expected by SymptomCheck.aiResponse
 * This is intentionally minimal because we prefer the AI to emit exact enums.
 */
function mapUrgencyToEnum(u) {
  if (!u) return 'medium';
  const s = String(u).toLowerCase();
  if (s === 'emergency' || s === 'critical') return 'emergency';
  if (s === 'high') return 'high';
  if (s === 'moderate' || s === 'medium') return 'medium';
  if (s === 'low') return 'low';
  return 'medium';
}

function normalizeConditions(conditions = [], overallUrgency = 'medium') {
  if (!Array.isArray(conditions)) return [];
  return conditions.slice(0, 10).map((c, idx) => ({
    name: c.name || `Condition ${idx + 1}`,
    severity: mapUrgencyToEnum(c.severity || c.urgency || overallUrgency),
    confidence: typeof c.confidence === 'number' ? c.confidence : undefined,
    description: c.summary || c.description || '',
    recommendations: c.immediateCare || c.recommendations || [],
  }));
}

module.exports = {
  mapUrgencyToEnum,
  normalizeConditions,
};
