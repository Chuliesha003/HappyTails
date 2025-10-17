const axios = require('axios');

const GOOGLE_PLACES_BASE = 'https://maps.googleapis.com/maps/api/place';

function kmToMeters(km) {
  const n = parseFloat(km);
  if (Number.isNaN(n)) return 50000; // default 50km
  return Math.max(100, Math.min(50000, Math.round(n * 1000)));
}

/**
 * Search nearby veterinary clinics/hospitals using Google Places
 * @param {number} lat
 * @param {number} lng
 * @param {number} radiusKm
 * @returns {Promise<Array>} simplified vet-like objects
 */
async function searchNearbyVets(lat, lng, radiusKm = 50) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    const err = new Error('Google Maps API key is not configured');
    err.code = 'NO_GOOGLE_API_KEY';
    throw err;
  }

  const radius = kmToMeters(radiusKm);

  // Nearby Search for type=veterinary_care around location
  const url = `${GOOGLE_PLACES_BASE}/nearbysearch/json`;

  const params = {
    key: apiKey,
    location: `${lat},${lng}`,
    radius,
    type: 'veterinary_care',
    keyword: 'veterinarian animal pet',
  };

  const { data } = await axios.get(url, { params });
  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    const err = new Error(`Google Places error: ${data.status}`);
    err.code = 'GOOGLE_PLACES_ERROR';
    err.details = data.error_message;
    throw err;
  }

  const results = (Array.isArray(data.results) ? data.results : []).filter((p) => {
    const types = Array.isArray(p.types) ? p.types : [];
    // Strictly ensure the place is for animals: must include 'veterinary_care'
    if (!types.includes('veterinary_care')) return false;
    
    // Must include vet-specific keywords in name
    const name = (p.name || '').toLowerCase();
    const vicinity = (p.vicinity || p.formatted_address || '').toLowerCase();
    const text = `${name} ${vicinity}`;
    
    // Must have at least one vet indicator
    const vetKeywords = ['vet', 'animal', 'pet', 'clinic', 'hospital'];
    const hasVetKeyword = vetKeywords.some((kw) => text.includes(kw));
    if (!hasVetKeyword) return false;
    
    // Exclude obvious human-only categories by name
    const humanHints = ['dental', 'children', 'maternity', 'gynecolog', 'cardiolog', 'orthopedic', 'skin clinic', 'cosmetic', 'human', 'eye hospital', 'pharmacy', 'doctor', 'physician', 'surgeon', 'medical center', 'health center'];
    const hasHumanHint = humanHints.some((h) => text.includes(h));
    if (hasHumanHint) return false;
    
    return true;
  });

  // Map to a Vet-like shape consumed by the frontend
  return results.map((p) => {
    const lat = p.geometry?.location?.lat;
    const lng = p.geometry?.location?.lng;
    return {
      id: p.place_id,
      name: p.name,
      phoneNumber: '', // requires Place Details; omitted to reduce quota usage
      clinicName: p.name,
      address: p.vicinity || p.formatted_address || '',
      rating: p.rating,
      reviewCount: p.user_ratings_total,
      isVerified: false,
      specialization: 'Veterinary Care',
      location: lat != null && lng != null ? {
        type: 'Point',
        coordinates: [lng, lat],
        address: p.vicinity || p.formatted_address || '',
        city: undefined,
        state: undefined,
        zipCode: undefined,
        country: undefined,
      } : undefined,
    };
  });
}

module.exports = {
  searchNearbyVets,
};
