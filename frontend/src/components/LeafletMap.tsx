import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Vet } from '@/types/api';

// Fix Leaflet default marker icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LeafletMapProps {
  vets: Vet[];
  userLocation?: { lat: number; lng: number };
  onVetClick?: (vet: Vet) => void;
}

const LeafletMap: React.FC<LeafletMapProps> = ({ vets, userLocation, onVetClick }) => {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize map
    const defaultCenter: [number, number] = userLocation 
      ? [userLocation.lat, userLocation.lng] 
      : [6.9271, 79.8612]; // Colombo, Sri Lanka

    const map = L.map(mapContainerRef.current).setView(defaultCenter, 12);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add user location marker if available
    if (userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
          shadowUrl: iconShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).addTo(map);
      
      userMarker.bindPopup('<strong>Your Location</strong>');
    }

    // Add vet markers
    vets.forEach((vet) => {
      if (vet.location?.coordinates && Array.isArray(vet.location.coordinates)) {
        const [lng, lat] = vet.location.coordinates;
        
        // Create custom red marker for vets
        const vetMarker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: iconShadow,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
          })
        }).addTo(map);

        // Create popup content
        const popupContent = `
          <div style="font-family: sans-serif;">
            <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${vet.name}</h3>
            <p style="margin: 4px 0; font-size: 14px;">📞 ${vet.phoneNumber}</p>
            <p style="margin: 4px 0; font-size: 13px; color: #666;">📍 ${vet.address}, ${vet.city}</p>
            ${vet.specialization 
              ? `<p style="margin: 4px 0; font-size: 13px; color: #666;">🏥 ${vet.specialization}</p>` 
              : ''}
            ${vet.experience 
              ? `<p style="margin: 4px 0; font-size: 13px; color: #666;">⭐ ${vet.experience} years experience</p>` 
              : ''}
          </div>
        `;

        vetMarker.bindPopup(popupContent);

        // Add click event
        if (onVetClick) {
          vetMarker.on('click', () => onVetClick(vet));
        }
      }
    });

    // Fit bounds to show all markers
    if (vets.length > 0) {
      const bounds = L.latLngBounds(
        vets
          .filter(vet => vet.location?.coordinates && Array.isArray(vet.location.coordinates))
          .map(vet => {
            const [lng, lat] = vet.location.coordinates;
            return [lat, lng] as [number, number];
          })
      );
      
      if (userLocation) {
        bounds.extend([userLocation.lat, userLocation.lng]);
      }
      
      map.fitBounds(bounds, { padding: [50, 50] });
    }

    mapRef.current = map;

    // Cleanup
    return () => {
      map.remove();
    };
  }, [vets, userLocation, onVetClick]);

  return (
    <div 
      ref={mapContainerRef} 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '500px',
        borderRadius: '8px'
      }} 
    />
  );
};

export default LeafletMap;
