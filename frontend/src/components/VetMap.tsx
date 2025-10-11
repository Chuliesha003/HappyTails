import React, { useMemo } from 'react';
import type { Vet } from '@/types/api';

interface VetMapProps {
  vets: Vet[];
  userLocation?: { lat: number; lng: number };
  onVetClick?: (vet: Vet) => void;
}

const VetMap: React.FC<VetMapProps> = ({ vets, userLocation }) => {
  const mapUrl = useMemo(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyDsyOkInsY4SeT7N7Vzdye_sNjZr7KxCNM';
    
    // Determine map center
    const center = userLocation 
      ? `${userLocation.lat},${userLocation.lng}`
      : '6.9271,79.8612'; // Colombo default
    
    // Build markers string for ONLY our vets from database
    const markerStrings: string[] = [];
    
    // Add user location marker (blue)
    if (userLocation) {
      markerStrings.push(`color:blue|label:Y|${userLocation.lat},${userLocation.lng}`);
    }
    
    // Add vet markers (red) - ONLY from our database
    vets.forEach((vet, index) => {
      const vetLocation = vet.location as any;
      let lat, lng;
      
      // Handle GeoJSON format: { coordinates: [lng, lat] }
      if (vetLocation?.coordinates && Array.isArray(vetLocation.coordinates)) {
        [lng, lat] = vetLocation.coordinates;
      }
      // Handle old format: { lat, lng } or { latitude, longitude }
      else if (vetLocation?.lat && vetLocation?.lng) {
        lat = vetLocation.lat;
        lng = vetLocation.lng;
      }
      else if (vetLocation?.latitude && vetLocation?.longitude) {
        lat = vetLocation.latitude;
        lng = vetLocation.longitude;
      }
      
      if (lat && lng) {
        // Label: A, B, C, etc. (max 26)
        const label = String.fromCharCode(65 + (index % 26));
        markerStrings.push(`color:red|label:${label}|${lat},${lng}`);
      }
    });
    
    // Build final URL - using Static Maps API (shows ONLY our markers, no POI)
    const markers = markerStrings.map(m => `&markers=${encodeURIComponent(m)}`).join('');
    
    return `https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=${center}&zoom=12&maptype=roadmap`;
  }, [vets, userLocation]);

  return (
    <div className="w-full h-[620px] rounded-xl overflow-hidden">
      <iframe
        src={mapUrl}
        className="w-full h-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Map showing nearby veterinary clinics from our database"
        sandbox="allow-scripts allow-same-origin"
      />
      <div className="text-xs text-gray-500 mt-2 px-2">
        Showing {vets.length} registered veterinary clinic{vets.length !== 1 ? 's' : ''} from our database
      </div>
    </div>
  );
};

export default React.memo(VetMap);
