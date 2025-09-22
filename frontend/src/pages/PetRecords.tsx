import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const PetRecords = () => {
  const [petData, setPetData] = useState<{
    name: string;
    breed: string;
    age: string;
    weight: string;
    gender: string;
  } | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    breed: "",
    age: "",
    weight: "",
    gender: ""
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.breed && formData.age && formData.weight && formData.gender) {
      setPetData(formData);
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
        <p className="text-muted-foreground">Add your pet's information to get started.</p>
      </header>

      {/* Pet Information Form */}
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Add Pet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="petName">Pet Name</Label>
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
                <Label htmlFor="breed">Breed</Label>
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
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="text"
                  placeholder="e.g., 3 years"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Weight</Label>
                <Input
                  id="weight"
                  type="text"
                  placeholder="e.g., 4.5 kg"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="gender">Gender</Label>
                <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex justify-center pt-4">
              <Button type="submit" className="w-full md:w-auto px-8">
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Pet Details Section - Only show after form submission */}
      {petData && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Pet Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback>
                    {petData.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{petData.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {petData.breed} • {petData.age} • {petData.gender.charAt(0)}
                  </p>
                </div>
              </div>
              <Separator />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Name</span>
                  <span className="text-muted-foreground">{petData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span>Age</span>
                  <span className="text-muted-foreground">{petData.age}</span>
                </div>
                <div className="flex justify-between">
                  <span>Gender</span>
                  <span className="text-muted-foreground">{petData.gender}</span>
                </div>
                <div className="flex justify-between">
                  <span>Breed</span>
                  <span className="text-muted-foreground">{petData.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span>Weight</span>
                  <span className="text-muted-foreground">{petData.weight}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default PetRecords;