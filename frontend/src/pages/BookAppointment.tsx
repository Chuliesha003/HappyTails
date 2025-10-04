import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Phone, Mail, FileText, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { appointmentsService } from "@/services/appointments";
import { petsService } from "@/services/pets";
import { useAuth } from "@/contexts/AuthContext";
import type { Pet } from "@/types/api";

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    petId: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    notes: ""
  });

  const vetId = searchParams.get("vetId");
  const vetName = searchParams.get("vetName") || "Veterinary Clinic";

  // Load user's pets on mount
  useEffect(() => {
    const loadPets = async () => {
      try {
        setIsLoadingPets(true);
        const userPets = await petsService.getAllPets();
        setPets(userPets);
        
        // Auto-select first pet if available
        if (userPets.length > 0) {
          setFormData(prev => ({ ...prev, petId: userPets[0].id }));
        }
      } catch (err) {
        console.error('Failed to load pets:', err);
        toast({
          title: "Error",
          description: "Failed to load your pets. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoadingPets(false);
      }
    };

    loadPets();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.petId || !formData.appointmentDate || !formData.reason) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (!vetId) {
      toast({
        title: "Invalid Vet",
        description: "No veterinarian selected. Please select a vet first.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      await appointmentsService.createAppointment({
        vetId,
        petId: formData.petId,
        date: formData.appointmentDate,
        time: formData.appointmentTime || '09:00',
        reason: formData.reason,
        notes: formData.notes || undefined
      });

      toast({
        title: "Appointment Booked!",
        description: `Your appointment at ${vetName} has been scheduled successfully. You will receive a confirmation email shortly.`
      });

      // Redirect to user dashboard
      setTimeout(() => {
        navigate("/user-dashboard");
      }, 1500);
    } catch (err) {
      console.error('Failed to book appointment:', err);
      setError('Failed to book appointment. Please try again.');
      toast({
        title: "Booking Failed",
        description: "Could not book the appointment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <Helmet>
        <title>Book Appointment - HappyTails</title>
        <meta name="description" content="Book an appointment with your chosen veterinarian" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Book <span className="text-pink-600">Appointment</span>
            </h1>
            <p className="text-lg text-gray-600">
              Schedule an appointment at <span className="font-semibold text-pink-600">{vetName}</span>
            </p>
          </div>

          <Card className="shadow-lg border-pink-100">
            <CardHeader className="bg-gradient-to-r from-pink-500 to-pink-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Appointment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {/* Error Message */}
              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-red-700">
                  <AlertCircle className="h-5 w-5" />
                  <p>{error}</p>
                </div>
              )}

              {/* Loading State */}
              {isLoadingPets ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-pink-500" />
                  <p className="mt-2 text-gray-600">Loading your pets...</p>
                </div>
              ) : pets.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You don't have any pets registered yet.</p>
                  <Button 
                    type="button"
                    onClick={() => navigate("/pet-records")}
                    className="bg-pink-500 hover:bg-pink-600"
                  >
                    Add a Pet First
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Pet Selection */}
                  <div>
                    <Label htmlFor="petId" className="flex items-center gap-2 mb-2">
                      <span className="text-pink-500">🐾</span>
                      Select Pet *
                    </Label>
                    <select 
                      id="petId"
                      value={formData.petId}
                      onChange={(e) => handleInputChange("petId", e.target.value)}
                      required
                      className="flex h-10 w-full rounded-md border border-pink-200 bg-background px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
                    >
                      <option value="">Select a pet</option>
                      {pets.map(pet => (
                        <option key={pet.id} value={pet.id}>
                          {pet.name} ({pet.species} - {pet.breed})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* User Info Display */}
                  {user && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-pink-50 rounded-md">
                      <div>
                        <Label className="text-xs text-gray-600">Your Name</Label>
                        <p className="font-medium">{user.fullName}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Email</Label>
                        <p className="font-medium">{user.email}</p>
                      </div>
                    </div>
                  )}

                {/* Appointment Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appointmentDate" className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-pink-500" />
                      Preferred Date *
                    </Label>
                    <Input
                      id="appointmentDate"
                      type="date"
                      value={formData.appointmentDate}
                      onChange={(e) => handleInputChange("appointmentDate", e.target.value)}
                      required
                      className="border-pink-200 focus:border-pink-400"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="appointmentTime" className="flex items-center gap-2 mb-2">
                      <Clock className="h-4 w-4 text-pink-500" />
                      Preferred Time
                    </Label>
                    <select 
                      id="appointmentTime"
                      value={formData.appointmentTime}
                      onChange={(e) => handleInputChange("appointmentTime", e.target.value)}
                      className="flex h-10 w-full rounded-md border border-pink-200 bg-background px-3 py-2 text-sm focus:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:ring-opacity-50"
                    >
                      <option value="">Select time</option>
                      <option value="09:00">9:00 AM</option>
                      <option value="10:00">10:00 AM</option>
                      <option value="11:00">11:00 AM</option>
                      <option value="14:00">2:00 PM</option>
                      <option value="15:00">3:00 PM</option>
                      <option value="16:00">4:00 PM</option>
                    </select>
                  </div>
                </div>

                  {/* Reason for Visit */}
                  <div>
                    <Label htmlFor="reason" className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-pink-500" />
                      Reason for Visit *
                    </Label>
                    <Input
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => handleInputChange("reason", e.target.value)}
                      placeholder="e.g., Routine checkup, vaccination, health concern..."
                      required
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  {/* Additional Notes */}
                  <div>
                    <Label htmlFor="notes" className="flex items-center gap-2 mb-2">
                      <FileText className="h-4 w-4 text-pink-500" />
                      Additional Notes
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      placeholder="Any specific concerns, symptoms, or requests..."
                      rows={4}
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>

                  {/* Submit Buttons */}
                  <div className="flex gap-4 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate("/vets")}
                      className="flex-1 border-pink-300 text-pink-600 hover:bg-pink-50"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-pink-500 hover:bg-pink-600 text-white shadow-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Booking...
                        </>
                      ) : (
                        "Book Appointment"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
