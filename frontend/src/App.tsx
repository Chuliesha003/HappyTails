import React, { Component, useState, ErrorInfo } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { GuestLimitBanner } from "@/components/GuestLimitBanner";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Vets from "./pages/Vets";
import PetRecords from "./pages/PetRecords";
import Resources from "./pages/Resources";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import BookAppointment from "./pages/BookAppointment";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";

// Inline SymptomChecker to avoid import issues
interface Result {
  condition: string;
  urgency: "Low" | "Moderate" | "High";
  tips: string;
}

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { canUseSymptomChecker, incrementGuestUsage, isGuest, guestUsageCount, maxGuestUsage } = useAuth();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canUseSymptomChecker()) {
      toast({ 
        title: "Limit reached", 
        description: "Sign up for unlimited symptom checks!",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Increment usage for guest users
    if (isGuest()) {
      incrementGuestUsage();
    }
    
    // Demo results
    const mock: Result[] = [
      { condition: "Allergic Dermatitis", urgency: "Low", tips: "Use a cone to prevent scratching. Mild oatmeal bath can soothe itching. Monitor for worsening symptoms." },
      { condition: "Gastroenteritis", urgency: "Moderate", tips: "Hydration is key. Offer small sips of water and bland food. Watch for dehydration signs." },
      { condition: "Foreign Object Ingestion", urgency: "High", tips: "Avoid inducing vomiting. Seek urgent veterinary care immediately. Do not give food or water." },
    ];
    setResults(mock);
    
    const remaining = maxGuestUsage - (guestUsageCount + 1);
    const message = isGuest() && remaining > 0 
      ? `Results ready! ${remaining} free check${remaining !== 1 ? 's' : ''} remaining.`
      : "Results ready! Here are some possible conditions and first‑aid tips.";
      
    toast({ 
      title: "Analysis Complete", 
      description: message
    });

    setIsAnalyzing(false);
  };

  const urgencyColor = (u: Result["urgency"]) =>
    u === "High" ? "destructive" : u === "Moderate" ? "default" : "secondary";

  const urgencyIcon = (u: Result["urgency"]) => {
    if (u === "High") return "🚨";
    if (u === "Moderate") return "⚠️";
    return "ℹ️";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100">
      <div className="container mx-auto px-4 md:px-6 py-8 space-y-8">
        <Helmet>
          <title>AI Symptom Checker – HappyTails</title>
          <meta name="description" content="Input symptoms or upload a pet photo to see possible conditions, urgency, and first‑aid tips." />
          <link rel="canonical" href="/symptom-checker" />
        </Helmet>

        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4 shadow-lg">
            <span className="text-3xl">🔍</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            AI Symptom Checker
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Describe your pet's symptoms or upload a photo. Our AI will analyze and suggest possible conditions with care recommendations.
          </p>
        </div>

        {/* Guest Usage Banner */}
        <GuestLimitBanner feature="symptom-checker" />

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Input Form */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span>📝</span> Tell us about your pet
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={onSubmit} className="space-y-6">
                <div>
                  <label htmlFor="symptoms" className="block text-sm font-semibold mb-3 text-gray-700">
                    🐾 Describe your pet's symptoms in detail
                  </label>
                  <Textarea
                    id="symptoms"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="Example: My golden retriever has been limping on her front left paw for 2 days. She seems to be in pain when walking and keeps licking the paw area..."
                    rows={6}
                    required
                    className="resize-none border-2 focus:border-purple-400 transition-colors"
                  />
                  <div className="text-xs text-gray-500 mt-2">
                    💡 Include: Duration, behavior changes, eating habits, energy levels
                  </div>
                </div>

                <div>
                  <label htmlFor="photo" className="block text-sm font-semibold mb-3 text-gray-700">
                    📸 Upload a photo (optional)
                  </label>
                  <div className="border-2 border-dashed border-purple-300 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
                    <Input
                      id="photo"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFileName(e.target.files?.[0]?.name || null)}
                      className="hidden"
                    />
                    <label htmlFor="photo" className="cursor-pointer">
                      <div className="text-4xl mb-2">📷</div>
                      <div className="text-sm font-medium text-purple-600">
                        Click to upload or drag and drop
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        PNG, JPG up to 10MB
                      </div>
                    </label>
                  </div>
                  {fileName && (
                    <div className="flex items-center gap-2 mt-3 p-2 bg-green-50 rounded-lg">
                      <span className="text-green-600">✅</span>
                      <span className="text-sm font-medium text-green-700">Selected: {fileName}</span>
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-200 shadow-lg" 
                  disabled={!symptoms.trim() || !canUseSymptomChecker() || isAnalyzing}
                >
                  {isAnalyzing ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Analyzing symptoms...
                    </div>
                  ) : !canUseSymptomChecker() ? (
                    "Free Limit Reached - Please Sign Up"
                  ) : (
                    <div className="flex items-center gap-2">
                      <span>🔍</span> Analyze Symptoms
                    </div>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-xl">
                <span>💡</span> Quick Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <span className="text-2xl">🚨</span>
                  <div>
                    <div className="font-semibold text-red-600">Emergency Signs</div>
                    <div className="text-sm text-gray-600">Difficulty breathing, seizures, unconsciousness, severe bleeding</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">📋</span>
                  <div>
                    <div className="font-semibold text-purple-600">Be Specific</div>
                    <div className="text-sm text-gray-600">Include duration, frequency, and any recent changes</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">📸</span>
                  <div>
                    <div className="font-semibold text-green-600">Photo Tips</div>
                    <div className="text-sm text-gray-600">Clear lighting, multiple angles, show affected area</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">👨‍⚕️</span>
                  <div>
                    <div className="font-semibold text-purple-600">Remember</div>
                    <div className="text-sm text-gray-600">This is a screening tool. Always consult a veterinarian for diagnosis</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Section */}
        {results.length > 0 && (
          <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">📊 Analysis Results</h2>
              <p className="text-gray-600">Based on the symptoms described, here are possible conditions:</p>
            </div>
            
            <div className="grid gap-6">
              {results.map((result, idx) => (
                <Card key={idx} className={`shadow-lg border-l-4 transform hover:scale-[1.02] transition-all duration-200 ${
                  result.urgency === 'High' ? 'border-l-red-500 bg-red-50' :
                  result.urgency === 'Moderate' ? 'border-l-yellow-500 bg-yellow-50' :
                  'border-l-green-500 bg-green-50'
                }`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl flex items-center gap-2">
                        <span className="text-2xl">{urgencyIcon(result.urgency)}</span>
                        {result.condition}
                      </CardTitle>
                      <Badge variant={urgencyColor(result.urgency)} className="px-3 py-1 text-sm font-semibold">
                        {result.urgency} Priority
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-gray-700 leading-relaxed">{result.tips}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>⏱️</span>
                        <span>Recommended action: {
                          result.urgency === 'High' ? 'Seek immediate veterinary care' :
                          result.urgency === 'Moderate' ? 'Schedule vet appointment within 24-48 hours' :
                          'Monitor and schedule routine vet visit if symptoms persist'
                        }</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-xl font-semibold mb-2">🏥 Next Steps</div>
                <p className="mb-4">Ready to book an appointment with a trusted veterinarian?</p>
                <Button className="bg-white text-purple-600 hover:bg-gray-100 font-semibold px-6 py-2">
                  Find a Vet Near You
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
import { AuthProvider } from "./contexts/AuthContext";
import { withAuth } from "./components/withAuth";

const queryClient = new QueryClient();

// Create protected versions of components with feature requirements
const ProtectedVets = withAuth(Vets, { requiredFeature: 'vet-finder' });
const ProtectedPetRecords = withAuth(PetRecords, { requiredFeature: 'pet-records' });
const ProtectedAdminDashboard = withAuth(AdminDashboard, { requiredFeature: 'admin-dashboard' });
const ProtectedUserDashboard = withAuth(UserDashboard, { requiredFeature: 'user-dashboard' });

const AppContent = () => {
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/get-started';

  return (
    <>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/symptom-checker" element={<SymptomChecker />} />
        <Route path="/vets" element={<ProtectedVets />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/pet-records" element={<ProtectedPetRecords />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/admin-dashboard" element={<ProtectedAdminDashboard />} />
        <Route path="/user-dashboard" element={<ProtectedUserDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideFooter && <SiteFooter />}
    </>
  );
};

// Error boundary to show runtime errors instead of a white screen
class ErrorBoundary extends Component<{ children?: React.ReactNode }, { error: Error | null; info: ErrorInfo | null }>{
  constructor(props: { children?: React.ReactNode }) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console and store for display
    console.error('Uncaught error in App:', error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24 }}>
          <h1 style={{ color: '#b91c1c' }}>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f3f3f3', padding: 12 }}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
