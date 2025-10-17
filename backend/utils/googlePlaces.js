const axios = require('axios');

// Use the new Places API
const GOOGLE_PLACES_NEW_API = 'https://places.googleapis.com/v1/places:searchNearby';

function kmToMeters(km) {
  const n = parseFloat(km);
  if (Number.isNaN(n)) return 50000; // default 50km
  return Math.max(100, Math.min(50000, Math.round(n * 1000)));
}

/**
 * Search nearby veterinary clinics/hospitals using Google Places (New API)
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

  // Use the new Places API with searchNearby
  const requestBody = {
    includedTypes: ['veterinary_care'],
    maxResultCount: 20,
    locationRestriction: {
      circle: {
        center: {
          latitude: lat,
          longitude: lng,
        },
        radius: radius,
      },
    },
  };

  const headers = {
    'Content-Type': 'application/json',
    'X-Goog-Api-Key': apiKey,
    'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.types',
  };

  try {
    const { data } = await axios.post(GOOGLE_PLACES_NEW_API, requestBody, { headers });
    
    if (!data.places) {
      return [];
    }

    const results = data.places.filter((p) => {
    const types = Array.isArray(p.types) ? p.types : [];
    // Strictly ensure the place is for animals: must include 'veterinary_care'
    if (!types.includes('veterinary_care')) return false;
    
    // Must include vet-specific keywords in name
    const name = (p.displayName?.text || '').toLowerCase();
    const address = (p.formattedAddress || '').toLowerCase();
    const text = `${name} ${address}`;
    
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
    const lat = p.location?.latitude;
    const lng = p.location?.longitude;
    return {
      id: p.id,
      name: p.displayName?.text || 'Veterinary Clinic',
      phoneNumber: '', // requires Place Details; omitted to reduce quota usage
      clinicName: p.displayName?.text || 'Veterinary Clinic',
      address: p.formattedAddress || '',
      rating: p.rating,
      reviewCount: p.userRatingCount,
      isVerified: false,
      specialization: 'Veterinary Care',
      location: lat != null && lng != null ? {
        type: 'Point',
        coordinates: [lng, lat],
        address: p.formattedAddress || '',
        city: undefined,
        state: undefined,
        zipCode: undefined,
        country: undefined,
      } : undefined,
    };
  });
  } catch (error) {
    console.error('[GOOGLE_PLACES_ERROR] API call failed:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      url: GOOGLE_PLACES_NEW_API,
      apiKeyPresent: !!apiKey,
      apiKeyPrefix: apiKey ? apiKey.substring(0, 10) + '...' : 'none'
    });
    
    // Re-throw with more context
    const err = new Error(`Google Places error: ${error.response?.data?.error?.message || error.message}`);
    err.code = 'GOOGLE_PLACES_ERROR';
    err.details = error.response?.data?.error?.message;
    throw err;
  }
}

module.exports = {
  searchNearbyVets,
};
