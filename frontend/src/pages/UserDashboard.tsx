import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Heart, 
  Calendar, 
  Stethoscope, 
  FileText, 
  PlusCircle, 
  Clock, 
  MapPin, 
  Phone,
  AlertCircle,
  CheckCircle2,
  Weight,
  Shield,
  Syringe,
  Activity,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { petsService } from "@/services/pets";
import { appointmentsService } from "@/services/appointments";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import type { Pet, Appointment, MedicalRecord, Vaccination, Document, Medication } from "@/types/api";

// Medical Record Form Component
const MedicalRecordForm = ({ petId, onSuccess }: { petId: string | null; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    date: '',
    condition: '',
    diagnosis: '',
    treatment: '',
    veterinarian: '',
    notes: '',
    medications: [] as Medication[]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) return;

    setIsSubmitting(true);
    try {
      await petsService.addMedicalRecord(petId, formData);
      toast({
        title: "Success",
        description: "Medical record added successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add medical record",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="condition">Condition</Label>
          <Input
            id="condition"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            placeholder="e.g., Ear infection"
            required
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="diagnosis">Diagnosis</Label>
        <Input
          id="diagnosis"
          value={formData.diagnosis}
          onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
          placeholder="Detailed diagnosis"
        />
      </div>
      
      <div>
        <Label htmlFor="treatment">Treatment</Label>
        <Textarea
          id="treatment"
          value={formData.treatment}
          onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
          placeholder="Treatment details"
        />
      </div>
      
      <div>
        <Label htmlFor="veterinarian">Veterinarian</Label>
        <Input
          id="veterinarian"
          value={formData.veterinarian}
          onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
          placeholder="Dr. Smith"
        />
      </div>
      
      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Add Record
        </Button>
      </div>
    </form>
  );
};

// Vaccination Form Component
const VaccinationForm = ({ petId, onSuccess }: { petId: string | null; onSuccess: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    date: '',
    nextDueDate: '',
    administeredBy: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId) return;

    setIsSubmitting(true);
    try {
      await petsService.addVaccination(petId, formData);
      toast({
        title: "Success",
        description: "Vaccination added successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add vaccination",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="vaccine-name">Vaccine Name</Label>
        <Input
          id="vaccine-name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Rabies"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="vaccine-date">Date Administered</Label>
          <Input
            id="vaccine-date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="next-due">Next Due Date</Label>
          <Input
            id="next-due"
            type="date"
            value={formData.nextDueDate}
            onChange={(e) => setFormData({ ...formData, nextDueDate: e.target.value })}
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="administered-by">Administered By</Label>
        <Input
          id="administered-by"
          value={formData.administeredBy}
          onChange={(e) => setFormData({ ...formData, administeredBy: e.target.value })}
          placeholder="Veterinarian name"
        />
      </div>
      
      <div>
        <Label htmlFor="vaccine-notes">Notes</Label>
        <Textarea
          id="vaccine-notes"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Additional notes"
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Add Vaccination
        </Button>
      </div>
    </form>
  );
};

// Document Upload Form Component
const DocumentUploadForm = ({ petId, onSuccess }: { petId: string | null; onSuccess: () => void }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!petId || !selectedFile || !documentType) return;

    setIsSubmitting(true);
    try {
      // First upload the file
      const uploadResult = await petsService.uploadDocument(selectedFile, documentType as Document['documentType'], description);
      
      // Then add the document to the pet
      await petsService.addDocumentToPet(petId, {
        fileName: uploadResult.fileName,
        filePath: uploadResult.filePath,
        fileType: uploadResult.fileType as Document['fileType'],
        documentType: uploadResult.documentType as Document['documentType'],
        description: description
      });
      
      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });
      onSuccess();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="file">Select File</Label>
        <Input
          id="file"
          type="file"
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileSelect}
          required
        />
        <p className="text-xs text-muted-foreground mt-1">
          Supported formats: PDF, Word documents, Images (JPG, PNG)
        </p>
      </div>
      
      <div>
        <Label htmlFor="document-type">Document Type</Label>
        <Select value={documentType} onValueChange={setDocumentType} required>
          <SelectTrigger>
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="vaccination">Vaccination Card</SelectItem>
            <SelectItem value="medical_report">Medical Report</SelectItem>
            <SelectItem value="surgery_report">Surgery Report</SelectItem>
            <SelectItem value="prescription">Prescription</SelectItem>
            <SelectItem value="lab_results">Lab Results</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Brief description of the document"
        />
      </div>
      
      {selectedFile && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm font-medium">Selected file: {selectedFile.name}</p>
          <p className="text-xs text-muted-foreground">
            Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting || !selectedFile || !documentType}>
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Upload Document
        </Button>
      </div>
    </form>
  );
};

const UserDashboard = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  
  // Expanded form states
  const [expandedPetId, setExpandedPetId] = useState<string | null>(null);
  const [activeForm, setActiveForm] = useState<'medical' | 'vaccination' | 'document' | null>(null);

  useEffect(() => {
    loadPets();
    loadAppointments();
  }, []);

  const loadPets = async () => {
    try {
      setIsLoadingPets(true);
      const data = await petsService.getAllPets();
      setPets(data);
    } catch (error) {
      console.error('Failed to load pets:', error);
      toast({
        title: "Error",
        description: "Failed to load pets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPets(false);
    }
  };

  const loadAppointments = async () => {
    try {
      setIsLoadingAppointments(true);
      const data = await appointmentsService.getUpcomingAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet ? pet.name : petId;
  };

  const getVetName = (vetId: string) => {
    // For now, just return the vetId as the backend might not provide vet names
    // In a real app, you'd fetch vet data or have it included in the appointment
    return `Dr. ${vetId}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getHealthMetrics = () => {
    if (pets.length === 0) {
      return [
        { metric: "Weight Tracking", value: 0, color: "bg-gray-500" },
        { metric: "Medical Records", value: 0, color: "bg-gray-500" },
        { metric: "Vaccinations", value: 0, color: "bg-gray-500" }
      ];
    }

    const totalPets = pets.length;
    const petsWithWeight = pets.filter(pet => pet.weight).length;
    const petsWithMedicalRecords = pets.filter(pet => pet.medicalHistory && pet.medicalHistory.length > 0).length;
    const petsWithVaccinations = pets.filter(pet => pet.vaccinations && pet.vaccinations.length > 0).length;

    return [
      { 
        metric: "Weight Tracking", 
        value: Math.round((petsWithWeight / totalPets) * 100), 
        color: "bg-blue-500" 
      },
      { 
        metric: "Medical Records", 
        value: Math.round((petsWithMedicalRecords / totalPets) * 100), 
        color: "bg-green-500" 
      },
      { 
        metric: "Vaccinations", 
        value: Math.round((petsWithVaccinations / totalPets) * 100), 
        color: "bg-yellow-500" 
      }
    ];
  };

  const getActiveMedications = () => {
    const medications = [];
    
    pets.forEach(pet => {
      if (pet.medications && Array.isArray(pet.medications)) {
        pet.medications.forEach(med => {
          medications.push({
            petName: pet.name,
            medication: med,
            petId: pet.id
          });
        });
      }
    });
    
    return medications;
  };

  const getRecentActivity = () => {
    const activities = [];
    
    // Add recent appointments
    appointments.slice(0, 2).forEach(appointment => {
      activities.push({
        action: `Appointment scheduled for ${getPetName(appointment.petId)}`,
        date: formatDate(appointment.date),
        type: 'appointment'
      });
    });
    
    // Add recent pet additions/updates
    pets.slice(0, 2).forEach(pet => {
      activities.push({
        action: `Pet profile updated for ${pet.name}`,
        date: pet.updatedAt ? formatDate(pet.updatedAt) : 'Recently',
        type: 'pet'
      });
    });
    
    // Add dashboard access
    activities.push({
      action: "Dashboard accessed",
      date: "Just now",
      type: 'system'
    });
    
    return activities.slice(0, 5); // Limit to 5 most recent
  };

  const getAverageWeight = () => {
    const petsWithWeight = pets.filter(pet => pet.weight);
    if (petsWithWeight.length === 0) return "0.0 kg";
    
    const totalWeight = petsWithWeight.reduce((sum, pet) => sum + (pet.weight || 0), 0);
    const average = totalWeight / petsWithWeight.length;
    return `${average.toFixed(1)} kg`;
  };

  const getActivityLevel = () => {
    const petsWithRecords = pets.filter(pet => 
      (pet.medicalHistory && pet.medicalHistory.length > 0) || 
      (pet.vaccinations && pet.vaccinations.length > 0)
    );
    
    if (petsWithRecords.length === 0) return "Low";
    if (petsWithRecords.length >= pets.length * 0.7) return "High";
    return "Medium";
  };

  const getMoodAssessment = () => {
    const totalAppointments = appointments.length;
    const upcomingAppointments = appointments.filter(apt => 
      new Date(apt.date) > new Date()
    ).length;
    
    if (totalAppointments === 0) return "Unknown";
    if (upcomingAppointments > 0) return "Active Care";
    return "Well Maintained";
  };

  // Handler functions for adding records
  const handleAddMedicalRecord = (petId: string) => {
    if (expandedPetId === petId && activeForm === 'medical') {
      setExpandedPetId(null);
      setActiveForm(null);
    } else {
      setExpandedPetId(petId);
      setActiveForm('medical');
    }
  };

  const handleAddVaccination = (petId: string) => {
    if (expandedPetId === petId && activeForm === 'vaccination') {
      setExpandedPetId(null);
      setActiveForm(null);
    } else {
      setExpandedPetId(petId);
      setActiveForm('vaccination');
    }
  };

  const handleUploadDocument = (petId: string) => {
    if (expandedPetId === petId && activeForm === 'document') {
      setExpandedPetId(null);
      setActiveForm(null);
    } else {
      setExpandedPetId(petId);
      setActiveForm('document');
    }
  };

  const healthMetrics = getHealthMetrics();
  const activeMedications = getActiveMedications();
  const recentActivity = getRecentActivity();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Helmet>
        <title>User Dashboard - HappyTails</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome back to HappyTails! 🐾</h1>
                <p className="text-pink-100">Keep track of your pets' health and well-being</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-pink-100">You have</p>
                <p className="text-xl font-bold">{pets.length} pets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Debug: Reveal forms for first pet - only shown in dev */}
        {import.meta.env.DEV && pets.length > 0 && (
          <div className="container mx-auto px-4 mt-2">
            <Button size="sm" onClick={() => { setExpandedPetId(pets[0].id); setActiveForm('medical'); }} className="mr-2">Reveal Medical Form (First Pet)</Button>
            <Button size="sm" onClick={() => { setExpandedPetId(pets[0].id); setActiveForm('vaccination'); }} className="mr-2">Reveal Vaccine Form (First Pet)</Button>
            <Button size="sm" onClick={() => { setExpandedPetId(pets[0].id); setActiveForm('document'); }}>Reveal Document Upload (First Pet)</Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Pet Profiles & Appointments */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* My Pets Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  My Pets
                </CardTitle>
                <Button size="sm" asChild>
                  <Link to="/pet-records">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Pet
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingPets ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ))}
                  </div>
                ) : pets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No pets added yet</p>
                    <Button size="sm" className="mt-4" asChild>
                      <Link to="/pet-records">Add Your First Pet</Link>
                    </Button>
                  </div>
                ) : (
                  pets.map((pet) => (
                    <div key={pet.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback className="bg-pink-100 text-pink-600">
                            {pet.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{pet.name}</h3>
                          <p className="text-sm text-muted-foreground">{pet.breed} • {pet.age} years old</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {pet.species}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Weight className="h-4 w-4 text-gray-500" />
                          <span>{pet.weight} kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-gray-500" />
                          <span className="capitalize">{pet.gender}</span>
                        </div>
                        {pet.color && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">🎨</span>
                            <span>{pet.color}</span>
                          </div>
                        )}
                        {pet.medicalHistory && Array.isArray(pet.medicalHistory) && pet.medicalHistory.length > 0 && (
                          <div className="flex items-center gap-2 col-span-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-xs">
                              {pet.medicalHistory.length === 1 
                                ? `${pet.medicalHistory[0].condition} (${new Date(pet.medicalHistory[0].date).toLocaleDateString()})`
                                : `${pet.medicalHistory.length} medical records`
                              }
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link to="/pet-records">View Full Profile</Link>
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <Link to="/book-appointment">Book Appointment</Link>
                        </Button>
                      </div>

                      {/* Pet Records Management */}
                      <div className="border-t pt-3 mt-3">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Add Records</p>
                        <div className="grid grid-cols-3 gap-2">
                          <Button 
                            variant={expandedPetId === pet.id && activeForm === 'medical' ? "default" : "outline"} 
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleAddMedicalRecord(pet.id)}
                          >
                            <FileText className="h-3 w-3 mr-1" />
                            Medical
                          </Button>
                          <Button 
                            variant={expandedPetId === pet.id && activeForm === 'vaccination' ? "default" : "outline"}
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleAddVaccination(pet.id)}
                          >
                            <Shield className="h-3 w-3 mr-1" />
                            Vaccine
                          </Button>
                          <Button 
                            variant={expandedPetId === pet.id && activeForm === 'document' ? "default" : "outline"}
                            size="sm" 
                            className="text-xs"
                            onClick={() => handleUploadDocument(pet.id)}
                          >
                            <PlusCircle className="h-3 w-3 mr-1" />
                            Document
                          </Button>
                        </div>

                        {/* Expandable Forms */}
                        {expandedPetId === pet.id && (
                          <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                            {activeForm === 'medical' && (
                              <MedicalRecordForm 
                                petId={pet.id} 
                                onSuccess={() => {
                                  setExpandedPetId(null);
                                  setActiveForm(null);
                                  loadPets(); // Refresh pets data
                                }}
                              />
                            )}
                            {activeForm === 'vaccination' && (
                              <VaccinationForm 
                                petId={pet.id} 
                                onSuccess={() => {
                                  setExpandedPetId(null);
                                  setActiveForm(null);
                                  loadPets(); // Refresh pets data
                                }}
                              />
                            )}
                            {activeForm === 'document' && (
                              <DocumentUploadForm 
                                petId={pet.id} 
                                onSuccess={() => {
                                  setExpandedPetId(null);
                                  setActiveForm(null);
                                  loadPets(); // Refresh pets data
                                }}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Appointments
                </CardTitle>
                <Button size="sm" asChild>
                  <Link to="/book-appointment">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Book New
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingAppointments ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="p-4 border rounded-lg space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No upcoming appointments</p>
                    <Button size="sm" className="mt-4" asChild>
                      <Link to="/vets">Book Your First Appointment</Link>
                    </Button>
                  </div>
                ) : (
                  appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{getPetName(appointment.petId)}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(appointment.date)} at {appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          <span>{getVetName(appointment.vetId)}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <FileText className="h-4 w-4" />
                          <span>{appointment.reason}</span>
                        </div>
                        {appointment.notes && (
                          <div className="flex items-center gap-2 col-span-2 text-xs">
                            <span className="font-medium">Notes:</span>
                            <span>{appointment.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <PlusCircle className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" size="sm" asChild>
                  <Link to="/book-appointment">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Vet Visit
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                  <Link to="/symptom-checker">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Symptom Checker
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                  <Link to="/pet-records">
                    <FileText className="w-4 h-4 mr-2" />
                    Add Health Record
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                  <Link to="/vets">
                    <MapPin className="w-4 h-4 mr-2" />
                    Find Nearby Vets
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Health Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Health Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.metric}</span>
                      <span className="text-muted-foreground">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
                
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="font-semibold text-blue-600">Avg Weight</p>
                    <p className="text-blue-500">{getAverageWeight()}</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="font-semibold text-green-600">Activity</p>
                    <p className="text-green-500">{getActivityLevel()}</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <p className="font-semibold text-yellow-600">Status</p>
                    <p className="text-yellow-500">{getMoodAssessment()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Syringe className="h-5 w-5 text-red-500" />
                  Active Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeMedications.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Syringe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No active medications</p>
                  </div>
                ) : (
                  activeMedications.slice(0, 3).map((item, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{item.petName} - {item.medication.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.medication.dosage && `Dosage: ${item.medication.dosage}`}
                            {item.medication.frequency && ` • ${item.medication.frequency}`}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Active
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
                
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/pet-records">Manage Medications</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-muted-foreground text-xs">{activity.date}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/pet-records">View All Records</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Medical Record Form Modal - REMOVED: Using expandable forms instead */}
        {/* Vaccination Form Modal - REMOVED: Using expandable forms instead */}
        {/* Document Upload Modal - REMOVED: Using expandable forms instead */}
      </div>
    </div>
  );
};

export default UserDashboard;
