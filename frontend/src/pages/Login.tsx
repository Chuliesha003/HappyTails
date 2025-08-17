import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PawPrint } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from || "/";

  // Demo email addresses for testing
  const demoEmails = [
    { email: 'vet@happytails.com', role: 'Veterinarian', color: 'text-green-600' },
    { email: 'premium@test.com', role: 'Premium', color: 'text-purple-600' },
    { email: 'user@test.com', role: 'Basic', color: 'text-blue-600' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    
    const success = await login(email, password || 'demo123');
    if (success) {
      navigate(from, { replace: true });
    } else {
      setError("Login failed. Please try again.");
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setError("");
    
    const success = await login(demoEmail, 'demo123');
    if (success) {
      navigate(from, { replace: true });
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
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your account to continue caring for your pets
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (optional for demo)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                For demo: Any password works, or leave blank
              </p>
            </div>
            <Button type="submit" className="w-full" variant="brand" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          {/* Demo Email Options */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-sm text-gray-700 mb-3">🎯 Email-Based Role System</h4>
            <div className="space-y-2">
              {demoEmails.map((demo, index) => (
                <button
                  key={index}
                  onClick={() => handleDemoLogin(demo.email)}
                  className="w-full text-left p-2 rounded-md hover:bg-white border border-gray-200 hover:border-gray-300 transition-colors"
                  disabled={isLoading}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium">{demo.email}</div>
                      <div className={`text-xs ${demo.color}`}>{demo.role} Access</div>
                    </div>
                    <div className="text-xs text-gray-500">Click to login</div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-3">
              💡 Your access level is determined by your email address. Any unlisted email gets Basic access.
            </p>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          <div className="mt-4 text-center text-sm">
            <Link to="/forgot-password" className="text-primary hover:underline">
              Forgot your password?
            </Link>
          </div>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/get-started" className="text-primary hover:underline">
              Sign up
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

export default Login;
