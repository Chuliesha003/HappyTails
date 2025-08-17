import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PawPrint } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const GetStarted = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || "/";

  // Get predicted role based on email
  const getPredictedRole = (email: string) => {
    const emailLower = email.toLowerCase();
    if (emailLower.includes('vet@happytails.com') || emailLower.includes('dr.') || emailLower.includes('admin@')) {
      return { role: 'Veterinarian', color: 'text-green-600', features: 'Full access to all features' };
    }
    if (emailLower.includes('premium@') || emailLower.includes('john.doe@') || emailLower.includes('sarah.wilson@')) {
      return { role: 'Premium', color: 'text-purple-600', features: 'Access to most features' };
    }
    return { role: 'Basic', color: 'text-blue-600', features: 'Essential features included' };
  };

  const predictedRole = email ? getPredictedRole(email) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    // Basic validation
    if (!fullName || !email || !petName || !petType) {
      setError("Please fill in all required fields");
      return;
    }

    const success = await register({
      fullName,
      email,
      petName,
      petType,
      password: password || 'demo123' // Default password for demo
    });

    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="font-brand text-2xl font-extrabold tracking-tight">HappyTails</span>
          </div>
          <CardTitle className="text-2xl">Get Started</CardTitle>
          <CardDescription>
            Create your account and start managing your pet's health today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {predictedRole && (
                <div className="p-2 bg-gray-50 rounded-md border">
                  <div className="text-xs text-gray-600">Account Level:</div>
                  <div className={`text-sm font-medium ${predictedRole.color}`}>
                    {predictedRole.role} • {predictedRole.features}
                  </div>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="petName">Pet Name *</Label>
              <Input
                id="petName"
                type="text"
                placeholder="Enter your pet's name"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="petType">Pet Type *</Label>
              <Select value={petType} onValueChange={setPetType} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select pet type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Dog</SelectItem>
                  <SelectItem value="cat">Cat</SelectItem>
                  <SelectItem value="rabbit">Rabbit</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password (optional for demo)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                For demo: Leave blank to use default password
              </p>
            </div>
            
            <Button type="submit" className="w-full" variant="brand" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Email Role Information */}
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-sm text-blue-800 mb-2">🎯 Email-Based Access Levels</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>• <strong>Veterinarian emails</strong> (vet@, dr.*, admin@): Full access</div>
              <div>• <strong>Premium emails</strong> (premium@, john.doe@, etc.): Most features</div>
              <div>• <strong>Other emails</strong>: Basic access with essential features</div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
          
          <div className="mt-6 text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:underline">
              ← Back to home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GetStarted;
