import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Edit, Plus, Trash2, AlertCircle, Loader2, X, FileText, CreditCard, Paperclip, Download, Camera } from "lucide-react";
import { petsService } from "@/services/pets";
import { toast } from "@/hooks/use-toast";
import type { Pet, MedicalRecord, VaccineCard, FileAttachment } from "@/types/api";

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
  // Medical fields to keep
  medicalRecords: MedicalRecord[];
  vaccineCards: VaccineCard[];
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
  const [showVaccineCardForm, setShowVaccineCardForm] = useState(false);
  
  const [currentMedicalRecord, setCurrentMedicalRecord] = useState<MedicalRecord | null>(null);
  const [currentVaccineCard, setCurrentVaccineCard] = useState<VaccineCard | null>(null);
  
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
    vaccineCards: [],
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
      vaccineCards: [],
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
        vaccineCards: formData.vaccineCards.length ? formData.vaccineCards : undefined,
        specialNeeds: formData.specialNeeds?.trim() || undefined,
      };

      if (editingPetId) {
        // Update existing pet
        console.log('Updating existing pet:', editingPetId);
        const updated = await petsService.updatePet(editingPetId, petData);
        
        // Upload photo if provided
        if (formData.photoFile) {
          console.log('Uploading new photo for pet:', editingPetId);
          await petsService.uploadPhoto(editingPetId, formData.photoFile);
          console.log('Photo uploaded, refreshing pet data');
          // Refresh pet data to get updated photo URL
          const refreshedPet = await petsService.getPetById(editingPetId);
          setPets(prev => prev.map(p => p.id === editingPetId ? refreshedPet : p));
          console.log('Pet data refreshed with new photo');
        } else {
          console.log('No new photo to upload');
          setPets(prev => prev.map(p => p.id === editingPetId ? updated : p));
        }
        
        toast({
          title: "Success",
          description: `${formData.name}'s information has been updated.`
        });
      } else {
        // Create new pet
        const newPet = await petsService.createPet(petData);
        
        // Upload photo if provided
        if (formData.photoFile) {
          await petsService.uploadPhoto(newPet.id, formData.photoFile);
          // Refresh pet data to get updated photo URL
          const refreshedPet = await petsService.getPetById(newPet.id);
          setPets(prev => [...prev.filter(p => p.id !== newPet.id), refreshedPet]);
        } else {
          setPets(prev => [...prev, newPet]);
        }
        
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
      vaccineCards: pet.vaccineCards || [],
      specialNeeds: pet.specialNeeds || '',
      photoUrl: pet.photoUrl || '',
      photoFile: null
    });
    setEditingPetId(pet.id);
    
    // Scroll to the form at the top with smooth animation
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
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
      notes: '',
      attachments: []
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

  const handleAddVaccineCard = () => {
    setCurrentVaccineCard({
      cardNumber: '',
      issueDate: '',
      expiryDate: '',
      issuingAuthority: '',
      notes: '',
      attachments: []
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'medical' | 'vaccine') => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: `${file.name} is larger than 10MB. Please choose a smaller file.`,
          variant: "destructive"
        });
        continue;
      }

      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Invalid file type",
          description: `${file.name} is not a supported file type. Please upload PDF, Word documents, or images.`,
          variant: "destructive"
        });
        continue;
      }

      try {
        // For now, we'll create a temporary URL. In a real app, you'd upload to a server
        const fileUrl = URL.createObjectURL(file);
        const attachment: FileAttachment = {
          fileName: file.name,
          fileUrl: fileUrl,
          fileType: file.type,
          uploadedAt: new Date().toISOString()
        };

        if (type === 'medical' && currentMedicalRecord) {
          setCurrentMedicalRecord(prev => prev ? {
            ...prev,
            attachments: [...(prev.attachments || []), attachment]
          } : null);
        } else if (type === 'vaccine' && currentVaccineCard) {
          setCurrentVaccineCard(prev => prev ? {
            ...prev,
            attachments: [...(prev.attachments || []), attachment]
          } : null);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        toast({
          title: "Upload failed",
          description: `Failed to upload ${file.name}. Please try again.`,
          variant: "destructive"
        });
      }
    }
  };

  const removeAttachment = (type: 'medical' | 'vaccine', index: number) => {
    if (type === 'medical' && currentMedicalRecord) {
      setCurrentMedicalRecord(prev => prev ? {
        ...prev,
        attachments: prev.attachments?.filter((_, i) => i !== index) || []
      } : null);
    } else if (type === 'vaccine' && currentVaccineCard) {
      setCurrentVaccineCard(prev => prev ? {
        ...prev,
        attachments: prev.attachments?.filter((_, i) => i !== index) || []
      } : null);
    }
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
            {/* Profile Picture - First Step */}
            <div className="flex justify-center mb-6">
              <div className="space-y-4">
                <Label className="text-center block">Pet Photo</Label>
                <div className="flex flex-col items-center space-y-4">
                  {/* Profile Picture Upload */}
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-dashed border-gray-300 hover:border-primary transition-colors duration-200 overflow-hidden bg-gray-50">
                      {formData.photoUrl ? (
                        <img
                          src={formData.photoUrl}
                          alt="Pet preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-purple-100">
                          <div className="text-center">
                            <div className="text-4xl mb-2">🐾</div>
                            <div className="text-xs text-gray-500">Add Photo</div>
                          </div>
                        </div>
                      )}

                      {/* Upload Overlay */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center rounded-full cursor-pointer group">
                        <label htmlFor="petPhoto" className="cursor-pointer">
                          <div className="bg-white bg-opacity-90 rounded-full p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
                            <Camera className="h-6 w-6 text-gray-700" />
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Hidden File Input */}
                    <input
                      id="petPhoto"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      key={editingPetId || 'new'} // Force reset when switching pets
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        console.log('File selected:', file?.name, 'Size:', file?.size);
                        if (file) {
                          setFormData(prev => ({
                            ...prev,
                            photoFile: file,
                            photoUrl: URL.createObjectURL(file)
                          }));
                          console.log('Photo preview updated');
                        }
                      }}
                    />
                  </div>

                  {/* Upload Instructions */}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      Click the paw print to upload a photo of your pet
                    </p>
                    <p className="text-xs text-gray-500">
                      Max 10MB • JPG, PNG, GIF supported
                    </p>
                  </div>

                  {/* Remove Photo Button */}
                  {formData.photoUrl && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          photoFile: null,
                          photoUrl: ""
                        }));
                        // Reset file input
                        const fileInput = document.getElementById('petPhoto') as HTMLInputElement;
                        if (fileInput) fileInput.value = '';
                      }}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4 mr-2" />
                      Remove Photo
                    </Button>
                  )}
                </div>
              </div>
            </div>

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
                          {record.attachments && record.attachments.length > 0 && (
                            <div className="space-y-2">
                              <span className="font-medium text-sm">Attachments:</span>
                              <div className="space-y-1">
                                {record.attachments.map((attachment, attIndex) => (
                                  <div key={attIndex} className="flex items-center gap-2">
                                    <Paperclip className="h-4 w-4" />
                                    <a
                                      href={attachment.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline"
                                    >
                                      {attachment.fileName}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
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
                          {card.attachments && card.attachments.length > 0 && (
                            <div className="space-y-2">
                              <span className="font-medium text-sm">Attachments:</span>
                              <div className="space-y-1">
                                {card.attachments.map((attachment, attIndex) => (
                                  <div key={attIndex} className="flex items-center gap-2">
                                    <Paperclip className="h-4 w-4" />
                                    <a
                                      href={attachment.fileUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-600 hover:underline"
                                    >
                                      {attachment.fileName}
                                    </a>
                                  </div>
                                ))}
                              </div>
                            </div>
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

      {/* Add Pet Button */}
      <div className="max-w-3xl mx-auto flex justify-center">
        <Button type="submit" size="lg" onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              {editingPetId ? "Updating..." : "Adding Pet..."}
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              {editingPetId ? "Update Pet" : "Add Pet"}
            </>
          )}
        </Button>
      </div>

      {/* Medical Record Form Modal */}
      {showMedicalForm && currentMedicalRecord && (
        <Dialog open={showMedicalForm} onOpenChange={setShowMedicalForm}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {formData.medicalRecords.includes(currentMedicalRecord) ? 'Edit Medical Record' : 'Add Medical Record'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
              <div className="space-y-2">
                <Label htmlFor="medicalAttachments">Attachments</Label>
                <Input
                  id="medicalAttachments"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, 'medical')}
                />
                <p className="text-sm text-muted-foreground">
                  Upload PDF, Word documents, or images (max 10MB each)
                </p>
                {currentMedicalRecord.attachments && currentMedicalRecord.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Attachments:</Label>
                    {currentMedicalRecord.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-sm">{attachment.fileName}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => removeAttachment('medical', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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

      {/* Vaccine Card Form Modal */}
      {showVaccineCardForm && currentVaccineCard && (
        <Dialog open={showVaccineCardForm} onOpenChange={setShowVaccineCardForm}>
          <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {formData.vaccineCards.includes(currentVaccineCard) ? 'Edit Vaccine Card' : 'Add Vaccine Card'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
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
              <div className="space-y-2">
                <Label htmlFor="vaccineCardAttachments">Attachments</Label>
                <Input
                  id="vaccineCardAttachments"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileUpload(e, 'vaccine')}
                />
                <p className="text-sm text-muted-foreground">
                  Upload PDF, Word documents, or images (max 10MB each)
                </p>
                {currentVaccineCard.attachments && currentVaccineCard.attachments.length > 0 && (
                  <div className="space-y-2">
                    <Label>Current Attachments:</Label>
                    {currentVaccineCard.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 border rounded">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-sm">{attachment.fileName}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => removeAttachment('vaccine', index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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
                      <AvatarImage src={pet.photoUrl} alt={pet.name} />
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
