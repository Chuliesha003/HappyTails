import React, { useMemo } from 'react';
import type { Vet } from '@/types/api';

interface VetMapProps {
  vets: Vet[];
  userLocation?: { lat: number; lng: number };
  onVetClick?: (vet: Vet) => void;
}

const DEFAULT_CENTER = '6.9271,79.8612'; // Colombo

const VetMap: React.FC<VetMapProps> = ({ vets, userLocation }) => {
  const mapUrl = useMemo(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

    // Use provided userLocation as center if available, otherwise default
    const center = userLocation ? `${userLocation.lat},${userLocation.lng}` : DEFAULT_CENTER;

    // Collect marker strings for Google Static Maps
    const markerStrings: string[] = [];

    if (userLocation) {
      markerStrings.push(`color:blue|label:U|${userLocation.lat},${userLocation.lng}`);
    }

    // Type guards for possible location shapes returned from backend
    const isGeoJson = (v: unknown): v is { coordinates: unknown[] } => {
      if (typeof v !== 'object' || v === null) return false;
      const r = v as Record<string, unknown>;
      return 'coordinates' in r && Array.isArray(r['coordinates']);
    };

    const isLatLng = (v: unknown): v is { lat: number; lng: number } => {
      if (typeof v !== 'object' || v === null) return false;
      const r = v as Record<string, unknown>;
      return typeof r['lat'] === 'number' && typeof r['lng'] === 'number';
    };

    const isLatLngAlt = (v: unknown): v is { latitude: number; longitude: number } => {
      if (typeof v !== 'object' || v === null) return false;
      const r = v as Record<string, unknown>;
      return typeof r['latitude'] === 'number' && typeof r['longitude'] === 'number';
    };

    vets.forEach((vet, index) => {
      const vetLocation = (vet as unknown as { location?: unknown })?.location;

      let lat: number | undefined;
      let lng: number | undefined;

      if (isGeoJson(vetLocation)) {
        const coords = vetLocation.coordinates;
        lng = Number(coords[0]);
        lat = Number(coords[1]);
      } else if (isLatLng(vetLocation)) {
        lat = vetLocation.lat;
        lng = vetLocation.lng;
      } else if (isLatLngAlt(vetLocation)) {
        lat = vetLocation.latitude;
        lng = vetLocation.longitude;
      }

      if (typeof lat === 'number' && typeof lng === 'number') {
        const label = String.fromCharCode(65 + (index % 26));
        markerStrings.push(`color:red|label:${label}|${lat},${lng}`);
      }
    });

    const encodedMarkers = markerStrings.map(m => `&markers=${encodeURIComponent(m)}`).join('');

    // If no API key present, return an empty string to avoid leaking a default key
    if (!apiKey) {
      // Use an openstreetmap static map as a fallback without markers
      return `https://tile.openstreetmap.org/12/0/0.png`;
    }

    // Build Google Static Maps URL (we use the embed/view API for iframe earlier, but img needs static maps params)
    // Note: Static Maps may require billing; this is a best-effort URL builder for development.
    const base = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(center)}&zoom=12&size=1200x620&maptype=roadmap`;
    return `${base}${encodedMarkers}&key=${apiKey}`;
  }, [vets, userLocation]);

  return (
    <div className="w-full h-[620px] rounded-xl overflow-hidden">
      {mapUrl ? (
        // Static image is simpler to display and avoids iframe sandbox issues
        <img src={mapUrl} alt="Map showing nearby veterinary clinics from our database" className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100">Map unavailable</div>
      )}

      <div className="text-xs text-gray-500 mt-2 px-2">
        Showing {vets.length} registered veterinary clinic{vets.length !== 1 ? 's' : ''} from our database
      </div>
    </div>
  );
};

export default React.memo(VetMap);
