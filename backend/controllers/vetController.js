// controllers/vetController.js
const Vet = require('../models/Vet');
const { searchNearbyVets: placesNearby } = require('../utils/googlePlaces');

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
    
    // No mock data - return empty array or error message
    console.log('[VET_GET_ALL] Mock data disabled - use /api/vets/nearby with location');
    res.json([]);
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

    console.log(`[VET_NEARBY] lat=${lat}, lng=${lng}, radius=${maxDistanceKm}km - using Google Places only`);
    
    // Always use Google Places live data (no mock/DB data)
    const live = await placesNearby(lat, lng, maxDistanceKm);
    return res.json(live.map(toSafe));
  } catch (err) {
    console.error('[VET_NEARBY_ERROR] Full error details:', {
      message: err.message,
      code: err.code,
      response: err.response?.data,
      stack: err.stack
    });
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
};
