import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { Edit, Plus } from "lucide-react";

interface PetData {
  id: string;
  name: string;
  breed: string;
  age: string;
  weight: string;
  gender: string;
  species: string;
  color: string;
  medicalHistory: string;
  allergies: string;
}

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
}

const PetRecords = () => {
  const [pets, setPets] = useState<PetData[]>([]);
  const [editingPetId, setEditingPetId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    breed: "",
    age: "",
    weight: "",
    gender: "",
    species: "",
    color: "",
    medicalHistory: "",
    allergies: ""
  });

  // Load pets from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('petRecords');
    if (saved) {
      try {
        const parsed: PetData[] = JSON.parse(saved);
        if (Array.isArray(parsed)) setPets(parsed);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error('Failed to parse petRecords from localStorage', e);
      }
    }
  }, []);

  // Persist pets to localStorage
  useEffect(() => {
    if (pets.length) localStorage.setItem('petRecords', JSON.stringify(pets));
    else localStorage.removeItem('petRecords');
  }, [pets]);

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
      allergies: ""
    });
    setEditingPetId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const requiredOk = !!(formData.name && formData.breed && formData.age && formData.weight && formData.gender);
    if (!requiredOk) return;

    if (editingPetId) {
      setPets(prev => 
        prev.map(p => p.id === editingPetId ? { ...formData, id: editingPetId } as PetData : p)
      );
    } else {
      const newPet: PetData = {
        ...formData,
        id: Date.now().toString()
      };
      setPets(prev => [...prev, newPet]);
    }
    resetForm();
  };

  const handleEditPet = (pet: PetData) => {
    setFormData({
      name: pet.name,
      breed: pet.breed,
      age: pet.age,
      weight: pet.weight,
      gender: pet.gender,
      species: pet.species,
      color: pet.color,
      medicalHistory: pet.medicalHistory,
      allergies: pet.allergies
    });
    setEditingPetId(pet.id);
  };

  const handleCancelEdit = () => resetForm();

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
                <Label htmlFor="species">Species</Label>
                <Input
                  id="species"
                  type="text"
                  placeholder="e.g., Dog, Cat, Bird"
                  value={formData.species}
                  onChange={(e) => handleInputChange("species", e.target.value)}
                />
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
                <Label htmlFor="weight">Weight (lbs) *</Label>
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
              <Button type="submit" className="flex-1">
                {editingPetId ? "Update Pet" : "Add Pet"}
              </Button>
              {editingPetId && (
                <Button type="button" variant="outline" onClick={handleCancelEdit}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pet Details Display */}
      {pets.length > 0 && (
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
                      <div className="font-medium">{pet.weight} lbs</div>
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
                  
                  {pet.medicalHistory && (
                    <div>
                      <span className="text-muted-foreground text-sm">Medical History:</span>
                      <div className="text-sm mt-1">{pet.medicalHistory}</div>
                    </div>
                  )}
                  
                  {pet.allergies && (
                    <div>
                      <span className="text-muted-foreground text-sm">Allergies:</span>
                      <div className="text-sm mt-1">{pet.allergies}</div>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleEditPet(pet)}
                    className="w-full"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Update Pet Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PetRecords;
