import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Edit, Plus, Trash2, AlertCircle, Loader2, X, FileText, Syringe, Pill, CreditCard, Stethoscope, Scissors } from "lucide-react";
import { petsService } from "@/services/pets";
import { toast } from "@/hooks/use-toast";
import type { Pet, MedicalRecord, Vaccination, Medication, VaccineCard, MedicalReport, Surgery, Prescription } from "@/types/api";

interface FormData {
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  species: string;
  color: string;
  medicalHistory: string;
  allergies: string;
  // New medical fields
  medicalRecords: MedicalRecord[];
  vaccinations: Vaccination[];
  medications: Medication[];
  vaccineCards: VaccineCard[];
  medicalReports: MedicalReport[];
  surgeries: Surgery[];
  prescriptions: Prescription[];
  specialNeeds: string;
  photoUrl: string;
  photoFile: File | null;
}

const PetRecords = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Medical form states
  const [showMedicalForm, setShowMedicalForm] = useState(false);
  const [showVaccinationForm, setShowVaccinationForm] = useState(false);
  const [showMedicationForm, setShowMedicationForm] = useState(false);
  const [showVaccineCardForm, setShowVaccineCardForm] = useState(false);
  const [showMedicalReportForm, setShowMedicalReportForm] = useState(false);
  const [showSurgeryForm, setShowSurgeryForm] = useState(false);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  
  const [currentMedicalRecord, setCurrentMedicalRecord] = useState<MedicalRecord | null>(null);
  const [currentVaccination, setCurrentVaccination] = useState<Vaccination | null>(null);
  const [currentMedication, setCurrentMedication] = useState<Medication | null>(null);
  const [currentVaccineCard, setCurrentVaccineCard] = useState<VaccineCard | null>(null);
  const [currentMedicalReport, setCurrentMedicalReport] = useState<MedicalReport | null>(null);
  const [currentSurgery, setCurrentSurgery] = useState<Surgery | null>(null);
  const [currentPrescription, setCurrentPrescription] = useState<Prescription | null>(null);
  
  const [formData, setFormData] = useState<FormData>({
    name: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    species: "",
    color: "",
    medicalHistory: "",
    allergies: "",
    medicalRecords: [],
    vaccinations: [],
    medications: [],
    vaccineCards: [],
    medicalReports: [],
    surgeries: [],
    prescriptions: [],
    specialNeeds: "",
    photoUrl: "",
    photoFile: null
  });

  // Load pets from backend on mount
  useEffect(() => {
    loadPets();
  }, []);

  const loadPets = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await petsService.getAllPets();
      setPets(data);
    } catch (err) {
      console.error('Failed to load pets:', err);
      setError('Failed to load pets. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load pets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      breed: "",
      age: "",
      weight: "",
      gender: "",
      species: "",
      color: "",
      medicalHistory: "",
      allergies: "",
      medicalRecords: [],
      vaccinations: [],
      medications: [],
      vaccineCards: [],
      medicalReports: [],
      surgeries: [],
      prescriptions: [],
      specialNeeds: "",
      photoUrl: "",
      photoFile: null
    });
    setEditingPetId(null);
    setError(null); // Clear any error messages
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const requiredOk = !!(formData.name && formData.species && formData.breed && formData.age && formData.weight && formData.gender);
    if (!requiredOk) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // Normalize fields to match backend expectations
      const genderNormalized = formData.gender === 'male' ? 'Male' : formData.gender === 'female' ? 'Female' : 'Unknown';
      const allergiesArray = (formData.allergies || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const petData = {
        name: formData.name.trim(),
        species: formData.species || 'Dog',
        breed: formData.breed.trim(),
        age: Number(formData.age),
        weight: Number(formData.weight),
        gender: genderNormalized as 'Male' | 'Female' | 'Unknown',
        color: formData.color?.trim() || undefined,
        allergies: allergiesArray.length ? allergiesArray : undefined,
        medicalRecords: formData.medicalRecords.length ? formData.medicalRecords : undefined,
        vaccinations: formData.vaccinations.length ? formData.vaccinations : undefined,
        medications: formData.medications.length ? formData.medications : undefined,
        specialNeeds: formData.specialNeeds?.trim() || undefined,
      };

      if (editingPetId) {
        // Update existing pet
        const updated = await petsService.updatePet(editingPetId, petData);
        setPets(prev => prev.map(p => p.id === editingPetId ? updated : p));
        toast({
          title: "Success",
          description: `${formData.name}'s information has been updated.`
        });
      } else {
        // Create new pet
        const newPet = await petsService.createPet(petData);
        setPets(prev => [...prev, newPet]);
        toast({
          title: "Success",
          description: `${formData.name} has been added to your pets.`
        });
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save pet:', err);
      const action = editingPetId ? 'update' : 'add';
      
      // Extract error message from API error
      let errorMessage = `Failed to ${action} pet.`;
      if (err && typeof err === 'object' && 'message' in err) {
        errorMessage = (err as { message: string }).message;
      }
      
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditPet = (pet: Pet) => {
    setFormData({
      name: pet.name,
      breed: pet.breed,
      age: String(pet.age),
      weight: String(pet.weight),
      gender: (pet.gender || '').toLowerCase(),
      species: pet.species,
      color: pet.color || '',
      medicalHistory: '',
      allergies: Array.isArray(pet.allergies) ? pet.allergies.join(', ') : (pet.allergies as unknown as string) || '',
      medicalRecords: pet.medicalHistory || [],
      vaccinations: pet.vaccinations || [],
      medications: pet.medications || [],
      vaccineCards: pet.vaccineCards || [],
      medicalReports: pet.medicalReports || [],
      surgeries: pet.surgeries || [],
      prescriptions: pet.prescriptions || [],
      specialNeeds: pet.specialNeeds || '',
      photoUrl: pet.photoUrl || '',
      photoFile: null
    });
    setEditingPetId(pet.id);
  };

  const handleDeletePet = async (petId: string, petName: string) => {
    if (!confirm(`Are you sure you want to delete ${petName}?`)) {
      return;
    }

    try {
      await petsService.deletePet(petId);
      setPets(prev => prev.filter(p => p.id !== petId));
      toast({
        title: "Success",
        description: `${petName} has been removed.`
      });
    } catch (err) {
      console.error('Failed to delete pet:', err);
      toast({
        title: "Error",
        description: "Failed to delete pet. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleCancelEdit = () => resetForm();

  // Medical record management functions
  const handleAddMedicalRecord = () => {
    setCurrentMedicalRecord({
      date: new Date().toISOString().split('T')[0],
      condition: '',
      diagnosis: '',
      treatment: '',
      veterinarian: '',
      notes: ''
    });
    setShowMedicalForm(true);
  };

  const handleEditMedicalRecord = (record: MedicalRecord) => {
    setCurrentMedicalRecord(record);
    setShowMedicalForm(true);
  };

  const handleSaveMedicalRecord = () => {
    if (!currentMedicalRecord) return;
    
    const updatedRecords = [...formData.medicalRecords];
    const existingIndex = updatedRecords.findIndex(r => r === currentMedicalRecord);
    
    if (existingIndex >= 0) {
      updatedRecords[existingIndex] = currentMedicalRecord;
    } else {
      updatedRecords.push(currentMedicalRecord);
    }
    
    setFormData(prev => ({ ...prev, medicalRecords: updatedRecords }));
    setCurrentMedicalRecord(null);
    setShowMedicalForm(false);
  };

  const handleDeleteMedicalRecord = (index: number) => {
    const updatedRecords = formData.medicalRecords.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, medicalRecords: updatedRecords }));
  };

  // Vaccination management functions
  const handleAddVaccination = () => {
    setCurrentVaccination({
      name: '',
      date: new Date().toISOString().split('T')[0],
      nextDueDate: '',
      administeredBy: '',
      notes: ''
    });
    setShowVaccinationForm(true);
  };

  const handleEditVaccination = (vaccination: Vaccination) => {
    setCurrentVaccination(vaccination);
    setShowVaccinationForm(true);
  };

  const handleSaveVaccination = () => {
    if (!currentVaccination) return;
    
    const updatedVaccinations = [...formData.vaccinations];
    const existingIndex = updatedVaccinations.findIndex(v => v === currentVaccination);
    
    if (existingIndex >= 0) {
      updatedVaccinations[existingIndex] = currentVaccination;
    } else {
      updatedVaccinations.push(currentVaccination);
    }
    
    setFormData(prev => ({ ...prev, vaccinations: updatedVaccinations }));
    setCurrentVaccination(null);
    setShowVaccinationForm(false);
  };

  const handleDeleteVaccination = (index: number) => {
    const updatedVaccinations = formData.vaccinations.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, vaccinations: updatedVaccinations }));
  };

  // Medication management functions
  const handleAddMedication = () => {
    setCurrentMedication({
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      notes: ''
    });
    setShowMedicationForm(true);
  };

  const handleEditMedication = (medication: Medication) => {
    setCurrentMedication(medication);
    setShowMedicationForm(true);
  };

  const handleSaveMedication = () => {
    if (!currentMedication) return;
    
    const updatedMedications = [...formData.medications];
    const existingIndex = updatedMedications.findIndex(m => m === currentMedication);
    
    if (existingIndex >= 0) {
      updatedMedications[existingIndex] = currentMedication;
    } else {
      updatedMedications.push(currentMedication);
    }
    
    setFormData(prev => ({ ...prev, medications: updatedMedications }));
    setCurrentMedication(null);
    setShowMedicationForm(false);
  };

  const handleDeleteMedication = (index: number) => {
    const updatedMedications = formData.medications.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, medications: updatedMedications }));
  };

  const handleAddVaccineCard = () => {
    setCurrentVaccineCard({
      cardNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      notes: ''
    });
    setShowVaccineCardForm(true);
  };

  const handleEditVaccineCard = (vaccineCard: VaccineCard) => {
    setCurrentVaccineCard(vaccineCard);
    setShowVaccineCardForm(true);
  };

  const handleSaveVaccineCard = () => {
    if (!currentVaccineCard) return;
    
    const updatedVaccineCards = [...formData.vaccineCards];
    const existingIndex = updatedVaccineCards.findIndex(vc => vc === currentVaccineCard);
    
    if (existingIndex >= 0) {
      updatedVaccineCards[existingIndex] = currentVaccineCard;
    } else {
      updatedVaccineCards.push(currentVaccineCard);
    }
    
    setFormData(prev => ({ ...prev, vaccineCards: updatedVaccineCards }));
    setCurrentVaccineCard(null);
    setShowVaccineCardForm(false);
  };

  const handleDeleteVaccineCard = (index: number) => {
    const updatedVaccineCards = formData.vaccineCards.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, vaccineCards: updatedVaccineCards }));
  };

  const handleAddMedicalReport = () => {
    setCurrentMedicalReport({
      reportType: '',
      reportDate: '',
      veterinarian: '',
      diagnosis: '',
      findings: ''
    });
    setShowMedicalReportForm(true);
  };

  const handleEditMedicalReport = (medicalReport: MedicalReport) => {
    setCurrentMedicalReport(medicalReport);
    setShowMedicalReportForm(true);
  };

  const handleSaveMedicalReport = () => {
    if (!currentMedicalReport) return;
    
    const updatedMedicalReports = [...formData.medicalReports];
    const existingIndex = updatedMedicalReports.findIndex(mr => mr === currentMedicalReport);
    
    if (existingIndex >= 0) {
      updatedMedicalReports[existingIndex] = currentMedicalReport;
    } else {
      updatedMedicalReports.push(currentMedicalReport);
    }
    
    setFormData(prev => ({ ...prev, medicalReports: updatedMedicalReports }));
    setCurrentMedicalReport(null);
    setShowMedicalReportForm(false);
  };

  const handleDeleteMedicalReport = (index: number) => {
    const updatedMedicalReports = formData.medicalReports.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, medicalReports: updatedMedicalReports }));
  };

  const handleAddSurgery = () => {
    setCurrentSurgery({
      surgeryType: '',
      surgeryDate: '',
      surgeon: '',
      anesthesia: '',
      complications: '',
      notes: ''
    });
    setShowSurgeryForm(true);
  };

  const handleEditSurgery = (surgery: Surgery) => {
    setCurrentSurgery(surgery);
    setShowSurgeryForm(true);
  };

  const handleSaveSurgery = () => {
    if (!currentSurgery) return;
    
    const updatedSurgeries = [...formData.surgeries];
    const existingIndex = updatedSurgeries.findIndex(s => s === currentSurgery);
    
    if (existingIndex >= 0) {
      updatedSurgeries[existingIndex] = currentSurgery;
    } else {
      updatedSurgeries.push(currentSurgery);
    }
    
    setFormData(prev => ({ ...prev, surgeries: updatedSurgeries }));
    setCurrentSurgery(null);
    setShowSurgeryForm(false);
  };

  const handleDeleteSurgery = (index: number) => {
    const updatedSurgeries = formData.surgeries.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, surgeries: updatedSurgeries }));
  };

  const handleAddPrescription = () => {
    setCurrentPrescription({
      medicationName: '',
      prescriptionDate: '',
      prescribingVet: '',
      dosage: '',
      frequency: '',
      duration: '',
      instructions: ''
    });
    setShowPrescriptionForm(true);
  };

  const handleEditPrescription = (prescription: Prescription) => {
    setCurrentPrescription(prescription);
    setShowPrescriptionForm(true);
  };

  const handleSavePrescription = () => {
    if (!currentPrescription) return;
    
    const updatedPrescriptions = [...formData.prescriptions];
    const existingIndex = updatedPrescriptions.findIndex(p => p === currentPrescription);
    
    if (existingIndex >= 0) {
      updatedPrescriptions[existingIndex] = currentPrescription;
    } else {
      updatedPrescriptions.push(currentPrescription);
    }
    
    setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
    setCurrentPrescription(null);
    setShowPrescriptionForm(false);
  };

  const handleDeletePrescription = (index: number) => {
    const updatedPrescriptions = formData.prescriptions.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, prescriptions: updatedPrescriptions }));
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
      <Helmet>
        <title>Pet Profile & Health Records – HappyTails</title>
        <meta name="description" content="Add and view your pet's information and health records." />
        <link rel="canonical" href="/pet-records" />
      </Helmet>

      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Pet Profile & Health Records</h1>
        <p className="text-muted-foreground">
          {editingPetId ? "Update your pet's information" : "Add your pet's information to get started."}
        </p>
      </header>

      {/* Error Message */}
      {error && !isLoading && (
        <Card className="max-w-3xl mx-auto border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pet Information Form */}
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {editingPetId ? (
              <>
                <Edit className="h-5 w-5" />
                Update Pet Information
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                Add Pet Information
              </>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="petName">Pet Name *</Label>
                <Input
                  id="petName"
                  type="text"
                  placeholder="Enter pet name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <select
                  id="species"
                  value={formData.species}
                  onChange={(e) => handleInputChange("species", e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  required
                >
                  <option value="">Select Species</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="breed">Breed *</Label>
                <Input
                  id="breed"
                  type="text"
                  placeholder="Enter breed"
                  value={formData.breed}
                  onChange={(e) => handleInputChange("breed", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  type="text"
                  placeholder="Enter color/markings"
                  value={formData.color}
                  onChange={(e) => handleInputChange("color", e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Age (years) *</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg) *</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter weight"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="medicalHistory">Medical History</Label>
                <Input
                  id="medicalHistory"
                  type="text"
                  placeholder="Any previous surgeries, conditions, or treatments"
                  value={formData.medicalHistory}
                  onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Input
                  id="allergies"
                  type="text"
                  placeholder="Food allergies, medication allergies, etc."
                  value={formData.allergies}
                  onChange={(e) => handleInputChange("allergies", e.target.value)}
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {editingPetId ? "Updating..." : "Adding..."}
                  </>
                ) : (
                  editingPetId ? "Update Pet" : "Add Pet"
                )}
              </Button>
              {editingPetId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Medical Records Section */}
      {
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Medical Records
              </span>
              <Button type="button" size="sm" onClick={handleAddMedicalRecord}>
                <Plus className="h-4 w-4 mr-2" />
                Add Record
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.medicalRecords.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No medical records added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.medicalRecords.map((record, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{record.condition}</h4>
                            <span className="text-sm text-muted-foreground">
                              {record.date ? new Date(record.date).toLocaleDateString() : ''}
                            </span>
                          </div>
                          {record.diagnosis && (
                            <p className="text-sm">
                              <span className="font-medium">Diagnosis:</span> {record.diagnosis}
                            </p>
                          )}
                          {record.treatment && (
                            <p className="text-sm">
                              <span className="font-medium">Treatment:</span> {record.treatment}
                            </p>
                          )}
                          {record.veterinarian && (
                            <p className="text-sm">
                              <span className="font-medium">Veterinarian:</span> {record.veterinarian}
                            </p>
                          )}
                          {record.notes && (
                            <p className="text-sm">
                              <span className="font-medium">Notes:</span> {record.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditMedicalRecord(record)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteMedicalRecord(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      }

      {/* Vaccinations Section */}
      {
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Syringe className="h-5 w-5" />
                Vaccinations
              </span>
              <Button type="button" size="sm" onClick={handleAddVaccination}>
                <Plus className="h-4 w-4 mr-2" />
                Add Vaccination
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.vaccinations.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No vaccinations added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.vaccinations.map((vaccination, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{vaccination.name}</h4>
                            <span className="text-sm text-muted-foreground">
                              {vaccination.date ? new Date(vaccination.date).toLocaleDateString() : ''}
                            </span>
                          </div>
                          {vaccination.nextDueDate && (
                            <p className="text-sm">
                              <span className="font-medium">Next Due:</span> {new Date(vaccination.nextDueDate).toLocaleDateString()}
                            </p>
                          )}
                          {vaccination.administeredBy && (
                            <p className="text-sm">
                              <span className="font-medium">Administered by:</span> {vaccination.administeredBy}
                            </p>
                          )}
                          {vaccination.notes && (
                            <p className="text-sm">
                              <span className="font-medium">Notes:</span> {vaccination.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditVaccination(vaccination)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteVaccination(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      }

      {/* Medications Section */}
      {
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Medications
              </span>
              <Button type="button" size="sm" onClick={handleAddMedication}>
                <Plus className="h-4 w-4 mr-2" />
                Add Medication
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.medications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No medications added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.medications.map((medication, index) => (
                  <Card key={index} className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold">{medication.name}</h4>
                          {medication.dosage && (
                            <p className="text-sm">
                              <span className="font-medium">Dosage:</span> {medication.dosage}
                            </p>
                          )}
                          {medication.frequency && (
                            <p className="text-sm">
                              <span className="font-medium">Frequency:</span> {medication.frequency}
                            </p>
                          )}
                          {medication.duration && (
                            <p className="text-sm">
                              <span className="font-medium">Duration:</span> {medication.duration}
                            </p>
                          )}
                          {medication.notes && (
                            <p className="text-sm">
                              <span className="font-medium">Notes:</span> {medication.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditMedication(medication)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteMedication(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      }

      {/* Vaccine Cards Section */}
      {
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Vaccine Cards
              </span>
              <Button type="button" size="sm" onClick={handleAddVaccineCard}>
                <Plus className="h-4 w-4 mr-2" />
                Add Card
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.vaccineCards.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No vaccine cards added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.vaccineCards.map((card, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{card.cardNumber || 'No Card Number'}</h4>
                          <p className="text-sm text-muted-foreground">
                            Issued: {card.issueDate} {card.expiryDate && `| Expires: ${card.expiryDate}`}
                          </p>
                          {card.issuingAuthority && (
                            <p className="text-sm text-muted-foreground">Authority: {card.issuingAuthority}</p>
                          )}
                          {card.notes && (
                            <p className="text-sm">{card.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditVaccineCard(card)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteVaccineCard(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      }

      {/* Medical Reports Section */}
      {
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Stethoscope className="h-5 w-5" />
                Medical Reports
              </span>
              <Button type="button" size="sm" onClick={handleAddMedicalReport}>
                <Plus className="h-4 w-4 mr-2" />
                Add Report
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.medicalReports.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No medical reports added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.medicalReports.map((report, index) => (
                  <Card key={index} className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{report.reportType}</h4>
                          <p className="text-sm text-muted-foreground">
                            Date: {report.reportDate} | Vet: {report.veterinarian}
                          </p>
                          {report.diagnosis && (
                            <p className="text-sm">Diagnosis: {report.diagnosis}</p>
                          )}
                          {report.findings && (
                            <p className="text-sm">{report.findings}</p>
                          )}
                          {report.notes && (
                            <p className="text-sm">{report.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditMedicalReport(report)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteMedicalReport(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      }

      {/* Surgeries Section */}
      {
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Scissors className="h-5 w-5" />
                Surgeries
              </span>
              <Button type="button" size="sm" onClick={handleAddSurgery}>
                <Plus className="h-4 w-4 mr-2" />
                Add Surgery
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.surgeries.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No surgeries added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.surgeries.map((surgery, index) => (
                  <Card key={index} className="border-l-4 border-l-red-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{surgery.surgeryType}</h4>
                          <p className="text-sm text-muted-foreground">
                            Date: {surgery.surgeryDate} | Surgeon: {surgery.surgeon}
                          </p>
                          {surgery.anesthesia && (
                            <p className="text-sm">Anesthesia: {surgery.anesthesia}</p>
                          )}
                          {surgery.complications && (
                            <p className="text-sm text-red-600">Complications: {surgery.complications}</p>
                          )}
                          {surgery.notes && (
                            <p className="text-sm">{surgery.notes}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditSurgery(surgery)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteSurgery(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      }

      {/* Prescriptions Section */}
      {
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Pill className="h-5 w-5" />
                Prescriptions
              </span>
              <Button type="button" size="sm" onClick={handleAddPrescription}>
                <Plus className="h-4 w-4 mr-2" />
                Add Prescription
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {formData.prescriptions.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No prescriptions added yet.
              </p>
            ) : (
              <div className="space-y-4">
                {formData.prescriptions.map((prescription, index) => (
                  <Card key={index} className="border-l-4 border-l-orange-500">
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h4 className="font-semibold">{prescription.medicationName}</h4>
                          <p className="text-sm text-muted-foreground">
                            Date: {prescription.prescriptionDate} | Vet: {prescription.prescribingVet}
                          </p>
                          <p className="text-sm">Dosage: {prescription.dosage} | Frequency: {prescription.frequency}</p>
                          {prescription.duration && (
                            <p className="text-sm">Duration: {prescription.duration}</p>
                          )}
                          {prescription.instructions && (
                            <p className="text-sm">{prescription.instructions}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditPrescription(prescription)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeletePrescription(index)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      }

      {/* Medical Record Form Modal */}
      {showMedicalForm && currentMedicalRecord && (
        <Dialog open={showMedicalForm} onOpenChange={setShowMedicalForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {formData.medicalRecords.includes(currentMedicalRecord) ? 'Edit Medical Record' : 'Add Medical Record'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicalDate">Date *</Label>
                <Input
                  id="medicalDate"
                  type="date"
                  value={currentMedicalRecord.date}
                  onChange={(e) => setCurrentMedicalRecord(prev => prev ? {...prev, date: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="condition">Condition *</Label>
                <Input
                  id="condition"
                  type="text"
                  placeholder="e.g., Ear infection, Broken leg"
                  value={currentMedicalRecord.condition}
                  onChange={(e) => setCurrentMedicalRecord(prev => prev ? {...prev, condition: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  type="text"
                  placeholder="Veterinarian's diagnosis"
                  value={currentMedicalRecord.diagnosis}
                  onChange={(e) => setCurrentMedicalRecord(prev => prev ? {...prev, diagnosis: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="treatment">Treatment</Label>
                <Input
                  id="treatment"
                  type="text"
                  placeholder="Prescribed treatment or procedure"
                  value={currentMedicalRecord.treatment}
                  onChange={(e) => setCurrentMedicalRecord(prev => prev ? {...prev, treatment: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="veterinarian">Veterinarian</Label>
                <Input
                  id="veterinarian"
                  type="text"
                  placeholder="Veterinarian name"
                  value={currentMedicalRecord.veterinarian}
                  onChange={(e) => setCurrentMedicalRecord(prev => prev ? {...prev, veterinarian: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicalNotes">Notes</Label>
                <Textarea
                  id="medicalNotes"
                  placeholder="Additional notes or observations"
                  value={currentMedicalRecord.notes}
                  onChange={(e) => setCurrentMedicalRecord(prev => prev ? {...prev, notes: e.target.value} : null)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowMedicalForm(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveMedicalRecord}>
                Save Record
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Vaccination Form Modal */}
      {showVaccinationForm && currentVaccination && (
        <Dialog open={showVaccinationForm} onOpenChange={setShowVaccinationForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {formData.vaccinations.includes(currentVaccination) ? 'Edit Vaccination' : 'Add Vaccination'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="vaccinationName">Vaccine Name *</Label>
                <Input
                  id="vaccinationName"
                  type="text"
                  placeholder="e.g., Rabies, DHPP"
                  value={currentVaccination.name}
                  onChange={(e) => setCurrentVaccination(prev => prev ? {...prev, name: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaccinationDate">Date Administered *</Label>
                <Input
                  id="vaccinationDate"
                  type="date"
                  value={currentVaccination.date}
                  onChange={(e) => setCurrentVaccination(prev => prev ? {...prev, date: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nextDueDate">Next Due Date</Label>
                <Input
                  id="nextDueDate"
                  type="date"
                  value={currentVaccination.nextDueDate}
                  onChange={(e) => setCurrentVaccination(prev => prev ? {...prev, nextDueDate: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="administeredBy">Administered By</Label>
                <Input
                  id="administeredBy"
                  type="text"
                  placeholder="Veterinarian or clinic name"
                  value={currentVaccination.administeredBy}
                  onChange={(e) => setCurrentVaccination(prev => prev ? {...prev, administeredBy: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaccinationNotes">Notes</Label>
                <Textarea
                  id="vaccinationNotes"
                  placeholder="Additional notes or side effects"
                  value={currentVaccination.notes}
                  onChange={(e) => setCurrentVaccination(prev => prev ? {...prev, notes: e.target.value} : null)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowVaccinationForm(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveVaccination}>
                Save Vaccination
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Medication Form Modal */}
      {showMedicationForm && currentMedication && (
        <Dialog open={showMedicationForm} onOpenChange={setShowMedicationForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {formData.medications.includes(currentMedication) ? 'Edit Medication' : 'Add Medication'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicationName">Medication Name *</Label>
                <Input
                  id="medicationName"
                  type="text"
                  placeholder="e.g., Heartgard, Antibiotics"
                  value={currentMedication.name}
                  onChange={(e) => setCurrentMedication(prev => prev ? {...prev, name: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input
                  id="dosage"
                  type="text"
                  placeholder="e.g., 10mg, 1 tablet"
                  value={currentMedication.dosage}
                  onChange={(e) => setCurrentMedication(prev => prev ? {...prev, dosage: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Input
                  id="frequency"
                  type="text"
                  placeholder="e.g., Once daily, Twice weekly"
                  value={currentMedication.frequency}
                  onChange={(e) => setCurrentMedication(prev => prev ? {...prev, frequency: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  type="text"
                  placeholder="e.g., 7 days, Ongoing"
                  value={currentMedication.duration}
                  onChange={(e) => setCurrentMedication(prev => prev ? {...prev, duration: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicationNotes">Notes</Label>
                <Textarea
                  id="medicationNotes"
                  placeholder="Instructions, side effects, or other notes"
                  value={currentMedication.notes}
                  onChange={(e) => setCurrentMedication(prev => prev ? {...prev, notes: e.target.value} : null)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowMedicationForm(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveMedication}>
                Save Medication
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Vaccine Card Form Modal */}
      {showVaccineCardForm && currentVaccineCard && (
        <Dialog open={showVaccineCardForm} onOpenChange={setShowVaccineCardForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {formData.vaccineCards.includes(currentVaccineCard) ? 'Edit Vaccine Card' : 'Add Vaccine Card'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  type="text"
                  placeholder="Vaccine card number"
                  value={currentVaccineCard.cardNumber}
                  onChange={(e) => setCurrentVaccineCard(prev => prev ? {...prev, cardNumber: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issueDate">Issue Date *</Label>
                <Input
                  id="issueDate"
                  type="date"
                  value={currentVaccineCard.issueDate}
                  onChange={(e) => setCurrentVaccineCard(prev => prev ? {...prev, issueDate: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={currentVaccineCard.expiryDate}
                  onChange={(e) => setCurrentVaccineCard(prev => prev ? {...prev, expiryDate: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Input
                  id="issuingAuthority"
                  type="text"
                  placeholder="Clinic or authority name"
                  value={currentVaccineCard.issuingAuthority}
                  onChange={(e) => setCurrentVaccineCard(prev => prev ? {...prev, issuingAuthority: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vaccineCardNotes">Notes</Label>
                <Textarea
                  id="vaccineCardNotes"
                  placeholder="Additional notes"
                  value={currentVaccineCard.notes}
                  onChange={(e) => setCurrentVaccineCard(prev => prev ? {...prev, notes: e.target.value} : null)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowVaccineCardForm(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveVaccineCard}>
                Save Vaccine Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Medical Report Form Modal */}
      {showMedicalReportForm && currentMedicalReport && (
        <Dialog open={showMedicalReportForm} onOpenChange={setShowMedicalReportForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {formData.medicalReports.includes(currentMedicalReport) ? 'Edit Medical Report' : 'Add Medical Report'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reportType">Report Type *</Label>
                <Input
                  id="reportType"
                  type="text"
                  placeholder="e.g., Blood Test, X-Ray, Ultrasound"
                  value={currentMedicalReport.reportType}
                  onChange={(e) => setCurrentMedicalReport(prev => prev ? {...prev, reportType: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportDate">Report Date *</Label>
                <Input
                  id="reportDate"
                  type="date"
                  value={currentMedicalReport.reportDate}
                  onChange={(e) => setCurrentMedicalReport(prev => prev ? {...prev, reportDate: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="veterinarian">Veterinarian *</Label>
                <Input
                  id="veterinarian"
                  type="text"
                  placeholder="Veterinarian name"
                  value={currentMedicalReport.veterinarian}
                  onChange={(e) => setCurrentMedicalReport(prev => prev ? {...prev, veterinarian: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Input
                  id="diagnosis"
                  type="text"
                  placeholder="Diagnosis or findings"
                  value={currentMedicalReport.diagnosis}
                  onChange={(e) => setCurrentMedicalReport(prev => prev ? {...prev, diagnosis: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="findings">Findings</Label>
                <Textarea
                  id="findings"
                  placeholder="Detailed findings or results"
                  value={currentMedicalReport.findings}
                  onChange={(e) => setCurrentMedicalReport(prev => prev ? {...prev, findings: e.target.value} : null)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportNotes">Notes</Label>
                <Textarea
                  id="reportNotes"
                  placeholder="Additional notes"
                  value={currentMedicalReport.notes}
                  onChange={(e) => setCurrentMedicalReport(prev => prev ? {...prev, notes: e.target.value} : null)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowMedicalReportForm(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveMedicalReport}>
                Save Medical Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Surgery Form Modal */}
      {showSurgeryForm && currentSurgery && (
        <Dialog open={showSurgeryForm} onOpenChange={setShowSurgeryForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {formData.surgeries.includes(currentSurgery) ? 'Edit Surgery' : 'Add Surgery'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="surgeryType">Surgery Type *</Label>
                <Input
                  id="surgeryType"
                  type="text"
                  placeholder="e.g., Spay, Dental Cleaning, Tumor Removal"
                  value={currentSurgery.surgeryType}
                  onChange={(e) => setCurrentSurgery(prev => prev ? {...prev, surgeryType: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surgeryDate">Surgery Date *</Label>
                <Input
                  id="surgeryDate"
                  type="date"
                  value={currentSurgery.surgeryDate}
                  onChange={(e) => setCurrentSurgery(prev => prev ? {...prev, surgeryDate: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surgeon">Surgeon *</Label>
                <Input
                  id="surgeon"
                  type="text"
                  placeholder="Veterinarian or surgeon name"
                  value={currentSurgery.surgeon}
                  onChange={(e) => setCurrentSurgery(prev => prev ? {...prev, surgeon: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="anesthesia">Anesthesia</Label>
                <Input
                  id="anesthesia"
                  type="text"
                  placeholder="Type of anesthesia used"
                  value={currentSurgery.anesthesia}
                  onChange={(e) => setCurrentSurgery(prev => prev ? {...prev, anesthesia: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="complications">Complications</Label>
                <Textarea
                  id="complications"
                  placeholder="Any complications during or after surgery"
                  value={currentSurgery.complications}
                  onChange={(e) => setCurrentSurgery(prev => prev ? {...prev, complications: e.target.value} : null)}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="surgeryNotes">Notes</Label>
                <Textarea
                  id="surgeryNotes"
                  placeholder="Recovery instructions, follow-up care, etc."
                  value={currentSurgery.notes}
                  onChange={(e) => setCurrentSurgery(prev => prev ? {...prev, notes: e.target.value} : null)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowSurgeryForm(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSaveSurgery}>
                Save Surgery
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Prescription Form Modal */}
      {showPrescriptionForm && currentPrescription && (
        <Dialog open={showPrescriptionForm} onOpenChange={setShowPrescriptionForm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {formData.prescriptions.includes(currentPrescription) ? 'Edit Prescription' : 'Add Prescription'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="medicationName">Medication Name *</Label>
                <Input
                  id="medicationName"
                  type="text"
                  placeholder="Name of the medication"
                  value={currentPrescription.medicationName}
                  onChange={(e) => setCurrentPrescription(prev => prev ? {...prev, medicationName: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prescriptionDate">Prescription Date *</Label>
                <Input
                  id="prescriptionDate"
                  type="date"
                  value={currentPrescription.prescriptionDate}
                  onChange={(e) => setCurrentPrescription(prev => prev ? {...prev, prescriptionDate: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prescribingVet">Prescribing Vet *</Label>
                <Input
                  id="prescribingVet"
                  type="text"
                  placeholder="Veterinarian who prescribed"
                  value={currentPrescription.prescribingVet}
                  onChange={(e) => setCurrentPrescription(prev => prev ? {...prev, prescribingVet: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prescriptionDosage">Dosage *</Label>
                <Input
                  id="prescriptionDosage"
                  type="text"
                  placeholder="e.g., 10mg, 1 tablet"
                  value={currentPrescription.dosage}
                  onChange={(e) => setCurrentPrescription(prev => prev ? {...prev, dosage: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="frequency">Frequency *</Label>
                <Input
                  id="frequency"
                  type="text"
                  placeholder="e.g., Once daily, Twice weekly"
                  value={currentPrescription.frequency}
                  onChange={(e) => setCurrentPrescription(prev => prev ? {...prev, frequency: e.target.value} : null)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  type="text"
                  placeholder="e.g., 7 days, Ongoing"
                  value={currentPrescription.duration}
                  onChange={(e) => setCurrentPrescription(prev => prev ? {...prev, duration: e.target.value} : null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Textarea
                  id="instructions"
                  placeholder="Special instructions or notes"
                  value={currentPrescription.instructions}
                  onChange={(e) => setCurrentPrescription(prev => prev ? {...prev, instructions: e.target.value} : null)}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowPrescriptionForm(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={handleSavePrescription}>
                Save Prescription
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">My Pets</h2>
            <p className="text-muted-foreground">Loading your pets...</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                  </div>
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pet Details Display */}
      {!isLoading && pets.length > 0 && (
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl font-bold">My Pets</h2>
            <p className="text-muted-foreground">Manage your pets' information and records</p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <Card key={pet.id} className="relative">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {pet.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold">{pet.name}</h3>
                      <p className="text-muted-foreground">
                        {pet.species} • {pet.breed}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditPet(pet)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Age:</span>
                      <div className="font-medium">{pet.age} years</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Weight:</span>
                      <div className="font-medium">{pet.weight} kg</div>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Gender:</span>
                      <div className="font-medium capitalize">{pet.gender}</div>
                    </div>
                    {pet.color && (
                      <div>
                        <span className="text-muted-foreground">Color:</span>
                        <div className="font-medium">{pet.color}</div>
                      </div>
                    )}
                  </div>
                  
                  {Array.isArray(pet.medicalHistory) && pet.medicalHistory.length > 0 && (
                    <div>
                      <span className="text-muted-foreground text-sm">Medical History:</span>
                      <ul className="text-sm mt-1 list-disc list-inside space-y-1">
                        {pet.medicalHistory.slice(0, 3).map((rec, idx) => (
                          <li key={idx}>
                            {rec.date ? new Date(rec.date).toLocaleDateString() + ': ' : ''}
                            {rec.condition}
                            {rec.notes ? ` — ${rec.notes}` : ''}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {Array.isArray(pet.allergies) && pet.allergies.length > 0 && (
                    <div>
                      <span className="text-muted-foreground text-sm">Allergies:</span>
                      <div className="text-sm mt-1">{pet.allergies.join(', ')}</div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleEditPet(pet)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDeletePet(pet.id, pet.name)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && pets.length === 0 && (
        <Card className="max-w-3xl mx-auto">
          <CardContent className="pt-6 pb-6 text-center">
            <p className="text-muted-foreground">
              No pets added yet. Add your first pet using the form above!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PetRecords;
