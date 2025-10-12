// controllers/vetController.js
const Vet = require('../models/Vet');

/* ---------------------- helpers ---------------------- */
function pickNumber(...vals) {
  for (const v of vals) {
    const n = parseFloat(v);
    if (!Number.isNaN(n)) return n;
  }
  return NaN;
}
function toSafe(v) {
  return v.toSafeObject ? v.toSafeObject() : v;
}

/* ------------------ GET /api/vets -------------------- */
async function getAllVets(req, res) {
  try {
    const { city, specialization, search, verified } = req.query;
    const filter = { isActive: true };

    if (verified === 'true') filter.isVerified = true;
    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (specialization) filter.specialization = { $in: [new RegExp(specialization, 'i')] };
    if (search) filter.$text = { $search: search };

    const vets = await Vet.find(filter).limit(100).sort({ rating: -1, createdAt: -1 });
    res.json(vets.map(toSafe));
  } catch (err) {
    console.error('[VET_GET_ALL_ERROR]', err);
    res.status(500).json({ error: 'Failed to fetch veterinarians' });
  }
}

/* ------------- GET /api/vets/nearby ------------------ */
/* Accepts BOTH:
   - latitude, longitude, maxDistance (km)
   - lat, lng, radius (km)
*/
async function searchNearbyVets(req, res) {
  try {
    const lat = pickNumber(req.query.latitude, req.query.lat);
    const lng = pickNumber(req.query.longitude, req.query.lng);
    const maxDistanceKm = pickNumber(req.query.maxDistance, req.query.radius) || 50;

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: 'Latitude/longitude required' });
    }

    console.log(`[VET_NEARBY] lat=${lat}, lng=${lng}, radius=${maxDistanceKm}km`);

    // NOTE: Vet.findNearby expects (lng, lat, km)
    const vets = await Vet.findNearby(lng, lat, maxDistanceKm);

    res.json(vets.map(toSafe));
  } catch (err) {
    console.error('[VET_NEARBY_ERROR]', err);
    res.status(500).json({ error: 'Failed to search nearby veterinarians' });
  }
}

/* ------------- GET /api/vets/specializations --------- */
async function getSpecializations(_req, res) {
  try {
    const specs = await Vet.distinct('specialization', { isActive: true });
    res.json(specs.filter(Boolean).sort());
  } catch (err) {
    console.error('[VET_SPECIALIZATIONS_ERROR]', err);
    res.status(500).json({ error: 'Failed to load specializations' });
  }
}

/* ---------------- GET /api/vets/cities --------------- */
async function getCities(_req, res) {
  try {
    const cities = await Vet.distinct('location.city', { isActive: true });
    res.json({ cities: cities.filter(Boolean).sort() });
  } catch (err) {
    console.error('[VET_CITIES_ERROR]', err);
    res.status(500).json({ error: 'Failed to load cities' });
  }
}

/* ---------------- GET /api/vets/:id ------------------ */
async function getVetById(req, res) {
  try {
    const vet = await Vet.findById(req.params.id);
    if (!vet) return res.status(404).json({ error: 'Veterinarian not found' });
    res.json(vet.toSafeObject(true));
  } catch (err) {
    console.error('[VET_BY_ID_ERROR]', err);
    res.status(500).json({ error: 'Failed to fetch veterinarian' });
  }
}

/* ---------------- POST /api/vets --------------------- */
async function createVet(req, res) {
  try {
    const vet = new Vet(req.body);
    await vet.save();
    res.status(201).json(vet.toSafeObject());
  } catch (err) {
    console.error('[VET_CREATE_ERROR]', err);
    res.status(400).json({ error: err.message });
  }
}

/* ---------------- PUT /api/vets/:id ------------------ */
async function updateVet(req, res) {
  try {
    const vet = await Vet.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!vet) return res.status(404).json({ error: 'Veterinarian not found' });
    res.json(vet.toSafeObject());
  } catch (err) {
    console.error('[VET_UPDATE_ERROR]', err);
    res.status(500).json({ error: 'Failed to update veterinarian' });
  }
}

/* ------------- DELETE /api/vets/:id ------------------ */
async function deleteVet(req, res) {
  try {
    const vet = await Vet.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!vet) return res.status(404).json({ error: 'Veterinarian not found' });
    res.json({ message: 'Veterinarian deactivated successfully' });
  } catch (err) {
    console.error('[VET_DELETE_ERROR]', err);
    res.status(500).json({ error: 'Failed to delete veterinarian' });
  }
}

/* ------------- POST /api/vets/:id/reviews ------------ */
async function addReview(req, res) {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;
    const vet = await Vet.findById(req.params.id);
    if (!vet) return res.status(404).json({ error: 'Veterinarian not found' });

    await vet.addReview(userId, rating, comment);
    res.json({ message: 'Review added successfully', vet: vet.toSafeObject(true) });
  } catch (err) {
    console.error('[VET_ADD_REVIEW_ERROR]', err);
    res.status(500).json({ error: 'Failed to add review' });
  }
}

/* ------------- GET /api/vets/google-nearby ------------- */
async function searchNearbyVetsGoogle(req, res) {
  try {
    const lat = pickNumber(req.query.latitude, req.query.lat);
    const lng = pickNumber(req.query.longitude, req.query.lng);
    const radiusMeters = parseInt(req.query.radiusMeters || req.query.radius || '50000', 10);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return res.status(400).json({ error: 'Latitude/longitude required' });
    }

    const apiKey = process.env.GOOGLE_MAPS_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'Google Maps API key not configured on server' });

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radiusMeters}&type=veterinary_care&key=${apiKey}`;
    const fetch = require('node-fetch');
    const resp = await fetch(url);
    const data = await resp.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      console.error('[GOOGLE_PLACES_ERROR]', data.status, data.error_message);
      return res.status(502).json({ error: 'Google Places API error', details: data.error_message || data.status });
    }

    const vets = (data.results || []).map((place) => {
      const lat = place.geometry?.location?.lat || 0;
      const lng = place.geometry?.location?.lng || 0;
      return {
        id: place.place_id,
        name: place.name,
        phoneNumber: place.formatted_phone_number || null,
        clinicName: place.name,
        location: {
          type: 'Point',
          coordinates: [lng, lat],
          address: place.vicinity || '',
          city: (place.vicinity || '').split(',').pop()?.trim() || '',
        },
        address: place.vicinity || '',
        rating: place.rating || 0,
        isVerified: place.business_status === 'OPERATIONAL',
      };
    });

    return res.json({ success: true, count: vets.length, vets });
  } catch (err) {
    console.error('[VET_GOOGLE_NEARBY_ERROR]', err);
    return res.status(500).json({ error: 'Failed to fetch from Google Places' });
  }
}

module.exports = {
  getAllVets,
  searchNearbyVets,
  getSpecializations,
  getCities,
  getVetById,
  createVet,
  updateVet,
  deleteVet,
  addReview,
  searchNearbyVetsGoogle,
};
