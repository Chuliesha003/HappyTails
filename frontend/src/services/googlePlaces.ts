import type { Vet } from '@/types/api';

/**
 * Search for real veterinary clinics near a location using Google Maps Places API
 */
export const searchNearbyVetsFromGoogle = async (
  latitude: number,
  longitude: number,
  radiusMeters: number = 50000 // 50km default
): Promise<Vet[]> => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('Google Maps API key is missing');
      return [];
    }

    // Use backend proxy endpoint to avoid exposing API key and CORS issues
    const proxyUrl = `/api/vets/google-nearby?latitude=${latitude}&longitude=${longitude}&radiusMeters=${radiusMeters}`;
    console.log('[GooglePlaces] Proxy request URL:', proxyUrl);
    const response = await fetch(proxyUrl);
    console.log('[GooglePlaces] proxy response.ok:', response.ok, 'status:', response.status);
    const data = await response.json();
    console.log('[GooglePlaces] proxy API status:', data.success ? 'OK' : 'ERROR', 'count:', data.count || 0);

    if (!data || !data.vets || data.vets.length === 0) {
      console.log('[GooglePlaces] Proxy returned no results');
      return [];
    }

    // The proxy returns vet-like objects. Normalize to our Vet type and return.
    const vets: Vet[] = (data.vets as unknown[]).map((p, index) => {
      const place = p as Record<string, unknown>;
      const placeId = (place.place_id as string) || (place.id as string) || `google-proxy-${index}`;
      const name = (place.name as string) || (place.clinicName as string) || 'Veterinary Clinic';
      const phone = (place.phoneNumber as string) || (place.formatted_phone_number as string) || 'N/A';
      const loc = place.location as Record<string, unknown> | undefined;
      const coords = (loc && Array.isArray(loc.coordinates)) ? (loc.coordinates as unknown[]) : undefined;
      const lng = coords ? (coords[0] as number) : (place.lng as number) || 0;
      const lat = coords ? (coords[1] as number) : (place.lat as number) || 0;

      const locRec = loc as Record<string, unknown> | undefined;
      const locationObj = locRec && Array.isArray(locRec.coordinates)
        ? { type: 'Point', coordinates: locRec.coordinates as [number, number], address: (locRec.address as string) || '', city: (locRec.city as string) || '' }
        : { type: 'Point', coordinates: [lng, lat], address: (place.vicinity as string) || '', city: (place.city as string) || '' };

      return {
        id: placeId,
        name,
        email: (place.email as string) || null,
        phoneNumber: phone,
        clinicName: name,
        specialization: (place.specialization as string[]) || ['General Practice'],
        licenseNumber: (place.licenseNumber as string) || null,
        yearsOfExperience: (place.yearsOfExperience as number) || 0,
        qualifications: (place.qualifications as unknown[]) || [],
        location: locationObj,
        address: (place.address as string) || (place.vicinity as string) || '',
        city: (place.city as string) || '',
        availability: (place.availability as unknown[]) || [],
        consultationFee: (place.consultationFee as number) || 0,
        bio: (place.bio as string) || '',
        languages: (place.languages as string[]) || ['Sinhala', 'English'],
        services: (place.services as string[]) || ['Veterinary Care'],
        rating: (place.rating as number) || 0,
        isVerified: Boolean(place.isVerified) || false,
        isActive: Boolean(place.isActive) || false,
      } as unknown as Vet;
    });

    return vets;
  } catch (error) {
    console.error('Error fetching vets from Google Places:', error);
    return [];
  }
};
