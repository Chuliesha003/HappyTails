import { Helmet } from "react-helmet-async";
import { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Star, MapPin, Phone, Clock, Navigation, Search, AlertCircle, CheckCircle } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { vetsService } from "@/services/vets";
import type { Vet } from "@/types/api";
import LeafletMap from "@/components/LeafletMap";

const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

const Vets = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [selected, setSelected] = useState<Vet | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number, address?: string} | null>(null);
  const [searchTerm, setSearchTerm] = useState(q);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [vets, setVets] = useState<Vet[]>([]);
  const [isLoadingVets, setIsLoadingVets] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user's current location and fetch nearby vets
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setUserLocation(location);
          setIsLoadingVets(true);
          setError(null);
          
          try {
            // Try to get address from coordinates using reverse geocoding
            const addressResponse = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${location.lat}&longitude=${location.lng}&localityLanguage=en`);
            const addressData = await addressResponse.json();
            const address = addressData.city && addressData.countryName ? `${addressData.city}, ${addressData.countryName}` : 'Unknown location';
            
            setUserLocation(prev => ({
              ...prev!,
              address
            }));
            
            toast({
              title: "📍 Location detected",
              description: `Found you at ${address}. Searching for nearby veterinarians...`
            });

            // Fetch nearby vets from backend
            const vetsList = await vetsService.searchNearbyVets(location.lat, location.lng, 50);
            setVets(vetsList);
            
            toast({
              title: "🏥 Vets found", 
              description: `Found ${vetsList.length} veterinarian${vetsList.length !== 1 ? 's' : ''} near you`
            });
          } catch (error) {
            console.error('Error fetching data:', error);
            setError('Failed to fetch veterinarians. Please try again.');
            setUserLocation(prev => ({ ...prev!, address: 'Location detected' }));
            
            toast({
              title: "Error",
              description: "Failed to fetch veterinarians. Please try again.",
              variant: "destructive"
            });
          } finally {
            setIsLoadingVets(false);
          }
        },
        async (error) => {
          console.error("Location error:", error);
          setLocationError("Unable to access your location. Showing all available vets.");
          
          // Default to fetching all vets without location
          setIsLoadingVets(true);
          
          try {
            const vetsList = await vetsService.getAllVets();
            setVets(vetsList);
            
            toast({
              title: "Location access denied",
              description: "Showing all available veterinarians",
              variant: "destructive"
            });
          } catch (error) {
            console.error('Error fetching vets:', error);
            setError('Failed to fetch veterinarians. Please try again.');
          } finally {
            setIsLoadingVets(false);
          }
        }
      );
    } else {
      setLocationError("Geolocation not supported");
      setIsLoadingVets(true);
      
      // Fetch all vets if geolocation not supported
      vetsService.getAllVets()
        .then(setVets)
        .catch((err) => {
          console.error('Error fetching vets:', err);
          setError('Failed to fetch veterinarians. Please try again.');
        })
        .finally(() => setIsLoadingVets(false));
    }
  }, []);

  const filtered = useMemo(() => {
    if (!searchTerm) return vets;
    return vets.filter(vet => {
      const vetLocation = vet.location as any;
      const address = vetLocation?.address || vet.address || '';
      const city = vetLocation?.city || vet.city || '';
      const specialization = Array.isArray(vet.specialization) 
        ? vet.specialization.join(' ') 
        : vet.specialization || '';
      
      return vet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        specialization.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [vets, searchTerm]);

  const onBook = (vetId?: string, vetName?: string) => { 
    // Create booking URL with vet information
    const bookingUrl = `/book-appointment?vetId=${vetId || 'unknown'}&vetName=${encodeURIComponent(vetName || 'Veterinary Clinic')}`;
    
    // Redirect to booking page
    window.location.href = bookingUrl;
  };

  return (
    <>
      <Helmet>
        <title>Find & Book Vets - HappyTails</title>
        <meta name="description" content="Find and book appointments with trusted veterinarians near you" />
      </Helmet>
      
      <div className="min-h-screen bg-white">
        <div className="container mx-auto px-4 py-6 max-w-7xl">

          {/* Location Error Banner */}
          {locationError && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">{locationError}</p>
                </div>
              </div>
            </div>
          )}

          {/* 50/50 responsive split: stack on small screens */}
          <div className="flex flex-col lg:flex-row gap-6 min-h-[620px]">
            
            {/* Left Side - Map Section */}
            <div className="order-1 lg:order-none lg:w-1/2 min-w-0 lg:sticky lg:top-24 self-start">
              <Card className="h-full shadow-sm border border-purple-100">
                <CardContent className="p-0">
                  <div className="relative w-full overflow-hidden rounded-xl h-[620px]">
                    {/* Leaflet map showing ONLY our vet data from database - NO API KEY NEEDED */}
                    <LeafletMap 
                      vets={filtered}
                      userLocation={userLocation || undefined}
                      onVetClick={(vet) => setSelected(vet)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Side - Clinic List Section */}
            <div className="order-2 lg:order-none lg:w-1/2 min-w-0">
              <div className="space-y-4 lg:max-h-[620px] lg:overflow-y-auto pr-1">
                {/* Error Message */}
                {error && !isLoadingVets && (
                  <Card className="border-destructive">
                    <CardContent className="pt-6 pb-6">
                      <div className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <p>{error}</p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {isLoadingVets ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i}>
                        <CardContent className="p-4 space-y-3">
                          <Skeleton className="h-6 w-3/4" />
                          <Skeleton className="h-4 w-1/2" />
                          <Skeleton className="h-4 w-2/3" />
                          <Skeleton className="h-10 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="text-4xl mb-4">🏥</div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No veterinarians found</h3>
                      <p className="text-gray-600">Try adjusting your search or check your location.</p>
                    </CardContent>
                  </Card>
                ) : (
                  filtered.map((vet) => {
                    const vetLocation = vet.location as any;
                    const address = vetLocation?.address || vet.address || '';
                    const city = vetLocation?.city || vet.city || '';
                    const state = vetLocation?.state || vet.state || '';
                    const zipCode = vetLocation?.zipCode || vet.zipCode || '';
                    const specialization = Array.isArray(vet.specialization) 
                      ? vet.specialization.join(', ') 
                      : vet.specialization || '';
                    const experience = (vet as any).yearsOfExperience || vet.experience;
                    const verified = (vet as any).isVerified || vet.verified;
                    
                    return (
                      <Card 
                        key={vet.id} 
                        className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-pink-300 shadow-sm border border-pink-100 rounded-lg bg-white"
                        onClick={() => setSelected(vet)}
                      >
                        <CardContent className="p-4">
                          <div className="mb-3">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-bold text-gray-900">{vet.name}</h3>
                              {verified && (
                                <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Verified
                                </Badge>
                              )}
                            </div>
                            {specialization && (
                              <p className="text-sm text-gray-600 mt-1">{specialization}</p>
                            )}
                            {experience && (
                              <p className="text-xs text-gray-500 mt-1">{experience} years experience</p>
                            )}
                          </div>
                          
                          <div className="space-y-2 mb-3">
                            <div className="flex items-center gap-2 text-gray-600">
                              <MapPin className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-sm">{address}, {city}{state ? `, ${state}` : ''} {zipCode}</span>
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Phone className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="text-sm">{vet.phoneNumber}</span>
                            </div>
                          </div>

                          <div className="flex justify-end">
                            <Button 
                              onClick={(e) => {
                                e.stopPropagation();
                                onBook(vet.id, vet.name);
                              }}
                              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-full font-medium shadow-md transition-all duration-200 hover:shadow-lg text-sm"
                            >
                              Book Appointment
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                )}
              </div>
            </div>

          </div>

          {/* Selected Vet Modal */}
          {selected && (() => {
            const vetLocation = selected.location as any;
            const address = vetLocation?.address || selected.address || '';
            const city = vetLocation?.city || selected.city || '';
            const state = vetLocation?.state || selected.state || '';
            const zipCode = vetLocation?.zipCode || selected.zipCode || '';
            const specialization = Array.isArray(selected.specialization) 
              ? selected.specialization.join(', ') 
              : selected.specialization || '';
            const experience = (selected as any).yearsOfExperience || selected.experience;
            const verified = (selected as any).isVerified || selected.verified;
            
            return (
              <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      {selected.name}
                      {verified && (
                        <Badge className="bg-green-100 text-green-700">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4">
                    {specialization && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Specialization</h4>
                        <p className="text-sm text-gray-600">{specialization}</p>
                      </div>
                    )}
                    
                    {experience && (
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Experience</h4>
                        <p className="text-sm text-gray-600">{experience} years</p>
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{address}, {city}{state ? `, ${state}` : ''} {zipCode}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{selected.phoneNumber}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => window.open(`tel:${selected.phoneNumber}`, '_self')}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call Now
                      </Button>
                      {selected.location && selected.location.coordinates && (
                        <Button 
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const [lng, lat] = selected.location!.coordinates;
                            const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
                            window.open(url, '_blank');
                          }}
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        onClick={() => onBook(selected.id, selected.name)}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        Book Appointment
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            );
          })()}
        </div>
      </div>
    </>
  );
};

export default Vets;
