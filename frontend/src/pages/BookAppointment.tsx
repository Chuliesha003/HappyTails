import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, Phone, Mail, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useNavigate, useSearchParams } from "react-router-dom";

const BookAppointment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    petOwnerName: "",
    petName: "",
    email: "",
    phone: "",
    appointmentDate: "",
    appointmentTime: "",
    reason: "",
    notes: ""
  });

  const vetId = searchParams.get("vetId");
  const vetName = searchParams.get("vetName") || "Veterinary Clinic";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.petOwnerName || !formData.petName || !formData.email || !formData.phone || !formData.appointmentDate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    // Simulate booking success
    toast({
      title: "Appointment Booked!",
      description: `Your appointment at ${vetName} has been scheduled successfully. You will receive a confirmation email shortly.`
    });

    // Redirect back to vets page after a delay
    setTimeout(() => {
      navigate("/vets");
    }, 2000);
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
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Pet Owner Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="petOwnerName" className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-pink-500" />
                      Pet Owner Name *
                    </Label>
                    <Input
                      id="petOwnerName"
                      value={formData.petOwnerName}
                      onChange={(e) => handleInputChange("petOwnerName", e.target.value)}
                      placeholder="Your full name"
                      required
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="petName" className="flex items-center gap-2 mb-2">
                      <span className="text-pink-500">🐾</span>
                      Pet Name *
                    </Label>
                    <Input
                      id="petName"
                      value={formData.petName}
                      onChange={(e) => handleInputChange("petName", e.target.value)}
                      placeholder="Your pet's name"
                      required
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                      <Mail className="h-4 w-4 text-pink-500" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="your.email@example.com"
                      required
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone" className="flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-pink-500" />
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      placeholder="+94 XX XXX XXXX"
                      required
                      className="border-pink-200 focus:border-pink-400"
                    />
                  </div>
                </div>

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
                    Reason for Visit
                  </Label>
                  <Input
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => handleInputChange("reason", e.target.value)}
                    placeholder="e.g., Routine checkup, vaccination, health concern..."
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
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-pink-500 hover:bg-pink-600 text-white shadow-lg"
                  >
                    Book Appointment
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default BookAppointment;
