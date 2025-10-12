import React from 'react';
import { GoogleMap, MarkerF, useJsApiLoader } from '@react-google-maps/api';
import type { Vet } from '@/types/api';

interface VetGoogleMapProps {
  vets: Vet[];
  userLocation?: { lat: number; lng: number };
  onVetClick?: (vet: Vet) => void;
}

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: '500px',
  borderRadius: '8px',
};

const VetGoogleMap: React.FC<VetGoogleMapProps> = ({ vets, userLocation, onVetClick }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'happytails-google-map',
    googleMapsApiKey: apiKey || '',
  });

  // Default to Colombo if no user location
  const center = userLocation || { lat: 6.9271, lng: 79.8612 };

  if (!apiKey) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-8">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">⚠️ Google Maps API Key Missing</p>
          <p className="text-sm text-gray-600">
            Add VITE_GOOGLE_MAPS_API_KEY to your .env file
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg p-8">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-2">❌ Failed to load Google Maps</p>
          <p className="text-sm text-gray-600">{loadError.message}</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={userLocation ? 13 : 12}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
        zoomControl: true,
      }}
    >
      {/* User location marker - Blue */}
      {userLocation && (
        <MarkerF
          position={userLocation}
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new google.maps.Size(40, 40),
          }}
          title="Your Location"
        />
      )}

      {/* Vet markers - Red */}
      {vets.map((vet) => {
        const coords = vet.location?.coordinates;
        if (!coords || !Array.isArray(coords) || coords.length < 2) return null;
        
        const [lng, lat] = coords; // MongoDB stores as [longitude, latitude]
        
        return (
          <MarkerF
            key={vet.id}
            position={{ lat, lng }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              scaledSize: new google.maps.Size(40, 40),
            }}
            title={vet.name}
            onClick={() => onVetClick?.(vet)}
          />
        );
      })}
    </GoogleMap>
  );
};

export default VetGoogleMap;
