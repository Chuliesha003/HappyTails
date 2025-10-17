import React, { useEffect, useMemo, useRef, useState } from "react";
import { GoogleMap, MarkerF, InfoWindowF, useJsApiLoader } from "@react-google-maps/api";
import { api } from "@/lib/api";

// Vets page component

type Vet = {
  id: string;
  name: string;
  clinicName?: string;
  specialization?: string[];
  yearsExperience?: number;
  address?: string;
  phoneNumber?: string;
  location?: { type: "Point"; coordinates: [number, number] }; // [lng, lat]
};

const libs: ("places")[] = ["places"];
const MAP_STYLE: React.CSSProperties = { width: "100%", height: "520px", borderRadius: 16 };

const redDot =
  "https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png"; // simple red marker icon

export default function Vets() {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY!,
    libraries: libs,
  });

  const [center, setCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [vets, setVets] = useState<Vet[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [locError, setLocError] = useState<string | null>(null);

  const mapRef = useRef<google.maps.Map | null>(null);

  const mapOptions = useMemo<google.maps.MapOptions>(() => ({
    clickableIcons: false,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: false,
    gestureHandling: "greedy",
  }), []);

  const fit = (c: { lat: number; lng: number }, list: Vet[]) => {
    if (!mapRef.current) return;
    const bounds = new google.maps.LatLngBounds();
    bounds.extend(c);
    list.forEach(v => {
      const coords = v.location?.coordinates;
      if (coords && coords.length === 2) {
        bounds.extend(new google.maps.LatLng(coords[1], coords[0]));
      }
    });
    mapRef.current.fitBounds(bounds, 64);
  };

  const fetchVets = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      const data = await api.get<Vet[]>("/api/vets/nearby", {
        params: { latitude: lat, longitude: lng, maxDistance: 25 },
      });
      setVets(data || []);
      setTimeout(() => fit({ lat, lng }, data || []), 0);
    } catch (e: unknown) {
      console.error("Failed to load vets", e);
    } finally {
      setLoading(false);
    }
  };

  const useMyLocation = () => {
    setLocError(null);
    navigator.geolocation.getCurrentPosition(
      pos => {
        const c = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setCenter(c);
        fetchVets(c.lat, c.lng);
      },
      err => setLocError(err.message || "Unable to get your location"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Optional: initial fallback (city center) if user hasn'"'"'t clicked the button yet
  useEffect(() => {
    if (!center) {
      const fallback = { lat: 6.9271, lng: 79.8612 }; // Colombo
      setCenter(fallback);
      // don'"'"'t fetch until user allows location (UX choice)
    }
  }, [center]);

  const onMapLoad = (m: google.maps.Map) => (mapRef.current = m);

  const handleListClick = (v: Vet) => {
    setActiveId(v.id);
    const coords = v.location?.coordinates;
    if (coords && mapRef.current) {
      const latLng = { lat: coords[1], lng: coords[0] };
      mapRef.current.panTo(latLng);
      mapRef.current.setZoom(Math.max(mapRef.current.getZoom() || 14, 15));
    }
  };

  if (loadError) return <div className="p-4 text-red-600">Maps failed to load.</div>;
  if (!isLoaded) return <div className="p-4">Loading map</div>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_520px] gap-6">
      {/* LEFT: Map + controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <button
            className="px-4 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition"
            onClick={useMyLocation}
          >
             Use my current location
          </button>
          {loading && <span className="text-sm text-gray-500">Loading nearby vets</span>}
          {locError && <span className="text-sm text-red-600">{locError}</span>}
        </div>

        <GoogleMap
          onLoad={onMapLoad}
          center={center!}
          zoom={12}
          mapContainerStyle={MAP_STYLE}
          options={mapOptions}
        >
          {/* user marker */}
          {center && (
            <MarkerF
              position={center}
              title="You are here"
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#3b82f6",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
              zIndex={1000}
            />
          )}

          {/* vet markers */}
          {vets.map((v) => {
            const coords = v.location?.coordinates;
            if (!coords) return null;
            const pos = { lat: coords[1], lng: coords[0] };
            const isActive = activeId === v.id;
            return (
              <MarkerF
                key={v.id}
                position={pos}
                onClick={() => setActiveId(v.id)}
                icon={redDot}
                title={v.name}
                zIndex={isActive ? 999 : 1}
              >
                {isActive && (
                  <InfoWindowF onCloseClick={() => setActiveId(null)}>
                    <div style={{ maxWidth: 240 }}>
                      <div style={{ fontWeight: 700 }}>{v.name}</div>
                      {v.clinicName && <div>{v.clinicName}</div>}
                      {v.specialization?.length ? (
                        <div style={{ fontSize: 12, color: "#6b7280" }}>
                          {v.specialization.join(", ")}
                        </div>
                      ) : null}
                      {v.address && <div style={{ marginTop: 6 }}>{v.address}</div>}
                      {v.phoneNumber && (
                        <a
                          href={`tel:${v.phoneNumber}`}
                          style={{ color: "#ef4444", fontWeight: 600, display: "inline-block", marginTop: 6 }}
                        >
                          {v.phoneNumber}
                        </a>
                      )}
                    </div>
                  </InfoWindowF>
                )}
              </MarkerF>
            );
          })}
        </GoogleMap>
      </div>

      {/* RIGHT: List */}
      <aside className="space-y-4 max-h-[520px] overflow-auto pr-1">
        {vets.map((v) => (
          <article
            key={v.id}
            onMouseEnter={() => setActiveId(v.id)}
            onClick={() => handleListClick(v)}
            className={`rounded-2xl border p-4 cursor-pointer transition ${
              activeId === v.id ? "border-pink-500 shadow-md" : "border-gray-200 hover:shadow"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-lg font-semibold">{v.name}</h3>
              <span className="text-xs px-2 py-1 rounded-full bg-green-50 text-green-700">Verified</span>
            </div>
            {v.specialization?.length ? (
              <div className="text-gray-600 text-sm mt-1">{v.specialization.join(", ")}</div>
            ) : null}
            {typeof v.yearsExperience === "number" && (
              <div className="text-gray-500 text-xs mt-1">{v.yearsExperience} years experience</div>
            )}
            {v.address && (
              <div className="mt-2 text-sm"> {v.address}</div>
            )}
            {v.phoneNumber && (
              <div className="mt-1 text-sm"> {v.phoneNumber}</div>
            )}
            <div className="mt-3">
              <button className="px-4 py-2 rounded-full bg-pink-500 text-white hover:bg-pink-600">
                Book Appointment
              </button>
            </div>
          </article>
        ))}

        {!loading && vets.length === 0 && (
          <div className="text-sm text-gray-500">No vets found. Click "Use my current location".</div>
        )}
      </aside>
    </div>
  );
}
