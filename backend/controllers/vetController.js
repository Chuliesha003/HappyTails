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
    const { licenseNumbers } = req.query;

    // Build query
    const query = { isActive: true };

    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    // Allow fetching specific vets by license numbers (comma-separated or array)
    if (licenseNumbers) {
      const list = Array.isArray(licenseNumbers) ? licenseNumbers : String(licenseNumbers).split(',').map(s => s.trim()).filter(Boolean);
      if (list.length) {
        query.licenseNumber = { $in: list };
      }
    }

    if (specialization) {
      query.specialization = { $in: [new RegExp(specialization, 'i')] };
    }

    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { clinicName: new RegExp(search, 'i') },
        { 'location.city': new RegExp(search, 'i') },
        { specialization: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    if (verified !== undefined) {
      query.isVerified = verified === 'true';
    }

    const vets = await Vet.find(query)
      .select('-password -__v')
      .sort({ rating: -1, createdAt: -1 })
      .limit(100);

    console.log(`[VET_GET_ALL] Found ${vets.length} vets matching criteria`);
    res.json(vets.map(vet => vet.toSafeObject ? vet.toSafeObject() : vet));
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

    console.log(`[VET_NEARBY] lat=${lat}, lng=${lng}, radius=${maxDistanceKm}km - searching database and Google Places`);

    // First, search for vets in our database within the radius
    let dbVets = [];
    try {
      dbVets = await Vet.findNearby(lng, lat, maxDistanceKm);
      console.log(`[VET_NEARBY] Found ${dbVets.length} vets in database within ${maxDistanceKm}km`);
    } catch (dbErr) {
      console.warn('[VET_NEARBY] Database search failed:', dbErr.message);
    }

    // If we have enough vets from database, return them
    if (dbVets.length >= 10) {
      return res.json(dbVets.map(vet => vet.toSafeObject()));
    }

    // Otherwise, supplement with Google Places results
    let placesVets = [];
    try {
      placesVets = await placesNearby(lat, lng, maxDistanceKm);
      console.log(`[VET_NEARBY] Found ${placesVets.length} vets from Google Places`);
    } catch (placesErr) {
      console.warn('[VET_NEARBY] Google Places search failed:', placesErr.message);
    }

    // Combine database vets and Google Places vets, removing duplicates by name/location
    const combinedVets = [...dbVets.map(vet => vet.toSafeObject())];
    const existingNames = new Set(combinedVets.map(v => v.clinicName?.toLowerCase() || v.name?.toLowerCase()));

    for (const placeVet of placesVets) {
      const placeName = placeVet.clinicName?.toLowerCase() || placeVet.name?.toLowerCase();
      if (!existingNames.has(placeName)) {
        combinedVets.push(placeVet);
        existingNames.add(placeName);
      }
    }

    console.log(`[VET_NEARBY] Returning ${combinedVets.length} total vets (${dbVets.length} from DB, ${placesVets.length} from Places)`);
    return res.json(combinedVets);
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
