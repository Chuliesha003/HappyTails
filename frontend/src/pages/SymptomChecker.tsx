import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Brain, AlertCircle, Sparkles, Heart, Stethoscope, PawPrint } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { symptomsService } from "@/services/symptoms";
import type { SymptomAnalysisResponse } from "@/types/api";

// Define the AI response condition type
interface AICondition {
  name?: string;
  rationale?: string;
}
import SymptomCheckHistory from "@/components/SymptomCheckHistory";

// Simple symptom definitions — these would normally come from an API
const SYMPTOMS = [
  { id: "loss_appetite", label: "Loss of appetite", icon: "🍽️" },
  { id: "vomiting", label: "Vomiting", icon: "🤢" },
  { id: "diarrhea", label: "Diarrhea", icon: "💩" },
  { id: "lethargy", label: "Lethargy / low energy", icon: "😴" },
  { id: "coughing", label: "Coughing or sneezing", icon: "🤧" },
  { id: "limping", label: "Limping or favoring a limb", icon: "🦴" },
  { id: "scratching", label: "Excessive scratching", icon: "✋" },
  { id: "urination_changes", label: "Changes in urination", icon: "💧" },
  { id: "breathing_difficulty", label: "Difficulty breathing", icon: "😮‍💨" },
  { id: "eye_discharge", label: "Eye discharge or redness", icon: "👁️" },
];

export default function SymptomChecker() {
  const { isAdmin } = useAuth();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<string[] | null>(null);
  const [structured, setStructured] = useState<SymptomAnalysisResponse | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [petType, setPetType] = useState<string>("dog");
  const [petAge, setPetAge] = useState<string>("");
  const [historyRefreshKey, setHistoryRefreshKey] = useState<number>(0);
  const [rateLimited, setRateLimited] = useState<{ message: string; retryAfterSeconds?: number } | null>(null);
  const [cooldownLeft, setCooldownLeft] = useState<number | null>(null);

  const toggle = (id: string) => {
    setSelected((s) => ({ ...s, [id]: !s[id] }));
  };

  const reset = () => {
    setSelected({});
    setResults(null);
    setQuery("");
  };

  // Submit to backend Gemini (image + text) and display structured results
  const analyze = async () => {
    setLoading(true);
    setResults(null);
    setStructured(null);
    try {
      const chosen = Object.keys(selected).filter((k) => selected[k]);
      const symptomText = [query, ...chosen.map((id) => SYMPTOMS.find(s => s.id === id)?.label || id)].filter(Boolean).join("; ");
      if (!symptomText.trim() && !photo) {
        toast({
          title: "Oops! No input",
          description: "Please select symptoms, type a description, or upload a photo.",
          variant: "destructive"
        });
        return;
      }

      // Call backend analyze which also persists the SymptomCheck
      let result;
      if (photo) {
        result = await symptomsService.analyzeSymptomsWithPhoto(symptomText, photo, petType, petAge ? Number(petAge) : undefined);
      } else {
        result = await symptomsService.analyzeSymptoms({
          petType,
          symptoms: symptomText,
          petAge: petAge ? Number(petAge) : undefined
        });
      }

      if (!result.ok) {
        throw new Error(result.error || 'AI analysis failed');
      }

      // Transform the response to match our expected format
      const data: SymptomAnalysisResponse = {
        conditions: Array.isArray(result.data.conditions)
          ? result.data.conditions.map((c: AICondition | string) => ({
              name: typeof c === 'string' ? c : c.name || 'Unknown condition',
              urgency: result.data.overallUrgency === 'high' ? 'high' :
                      result.data.overallUrgency === 'moderate' ? 'moderate' : 'low',
              description: typeof c === 'object' && c.rationale ? c.rationale : 'Further evaluation needed',
              firstAidTips: Array.isArray(result.data.careTips) ? result.data.careTips.slice(0, 3) : [],
              recommendations: []
            }))
          : [{
              name: 'Analysis completed',
              urgency: result.data.overallUrgency === 'high' ? 'high' :
                      result.data.overallUrgency === 'moderate' ? 'moderate' : 'low',
              description: 'Please review the care tips below',
              firstAidTips: Array.isArray(result.data.careTips) ? result.data.careTips.slice(0, 3) : [],
              recommendations: []
            }],
        overallUrgency: result.data.overallUrgency === 'high' ? 'high' :
                       result.data.overallUrgency === 'moderate' ? 'moderate' : 'low',
        disclaimerShown: true
      };

    // Render structured panel and also build a short guidance list for the sidebar
    setStructured(data);
      const guidance: string[] = [];
      if (data.overallUrgency === 'high') {
        guidance.push("🚨 URGENT: Symptoms may indicate a serious issue. Seek veterinary care promptly.");
      }
      data.conditions.slice(0, 3).forEach(c => {
        if (c.firstAidTips?.length) guidance.push(`🩺 ${c.name}: ${c.firstAidTips[0]}`);
        else guidance.push(`🩺 ${c.name}: see recommendations`);
      });
      setResults(guidance);
    // Trigger history reload (SymptomCheckHistory will refetch when key changes)
    setHistoryRefreshKey((k) => k + 1);
    toast({ title: 'Analysis saved', description: 'Your AI analysis has been saved to your account.', variant: 'default' });
    } catch (err) {
      console.error(err);
      // Detect rate limit (429) or backend usage-limit messages
      const status = err?.response?.status;
      const serverMsg = err?.response?.data?.message || err?.message || '';

      if (status === 429 || /usage limit/i.test(serverMsg) || /AI service usage limit/i.test(serverMsg)) {
        // Get Retry-After header if provided (in seconds)
        const retryAfterHeader = err?.response?.headers?.['retry-after'];
        let retrySeconds: number | undefined;
        if (retryAfterHeader) {
          const parsed = parseInt(retryAfterHeader, 10);
          if (!isNaN(parsed)) retrySeconds = parsed;
        }

        const friendly = serverMsg || '🐾 Our AI assistant has reached its limit. Please try again in about an hour.';
        setRateLimited({ message: friendly, retryAfterSeconds: retrySeconds });
        if (retrySeconds) setCooldownLeft(retrySeconds);

        toast({ title: 'Notice', description: friendly, variant: 'default' });
      } else {
        toast({ title: "Error", description: "Failed to analyze symptoms.", variant: "destructive" });
      }
    } finally {
      setLoading(false);
    }
  };

  // cooldown timer effect
  useState(() => {
    let interval: number | undefined;
    if (cooldownLeft && cooldownLeft > 0) {
      interval = window.setInterval(() => {
        setCooldownLeft((c) => (c ? c - 1 : null));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  });

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(310 60% 99%), hsl(297 30% 97%), hsl(330 60% 98%))' }}>
      <Helmet>
        <title>AI Symptom Checker – HappyTails</title>
        <meta name="description" content="Check your pet's symptoms with our AI-powered tool and get helpful guidance." />
      </Helmet>

      <div className="container mx-auto px-4 md:px-6 py-12 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <Brain className="h-10 w-10 text-pink-600" />
            <Sparkles className="h-6 w-6 text-purple-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            AI <span className="text-pink-600">Symptom Checker</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe what's happening with your furry friend, and we'll help guide you on the next steps. 🐾
          </p>
        </header>

        <div className="max-w-6xl mx-auto">
          {/* Main Input Section */}
          <section className="space-y-6">
            <Card className="shadow-lg border-pink-100 transition hover:shadow-xl">
              <CardHeader style={{ background: 'linear-gradient(135deg, hsl(297 64% 28%), hsl(327 100% 47%))', color: 'white' }}>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Tell us what's wrong
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Describe the symptoms
                  </label>
                  <Input 
                    placeholder="e.g., My dog has been vomiting and not eating for 2 days" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    className="h-12 text-base border-pink-200 focus:ring-pink-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-sm text-gray-700">Pet type</Label>
                    <Select value={petType} onValueChange={setPetType}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Choose pet" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm text-gray-700">Age (years)</Label>
                    <Input type="number" min={0} step="0.1" value={petAge} onChange={(e) => setPetAge(e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm text-gray-700">Upload a photo (optional)</Label>
                    <Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} className="mt-1" />
                    {photo && (
                      <div className="text-xs text-green-700 bg-green-50 rounded px-2 py-1 mt-2 inline-block">Selected: {photo.name}</div>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <label className="text-sm font-medium text-gray-700 mb-3 block flex items-center gap-2">
                    <PawPrint className="h-4 w-4 text-pink-500" />
                    Or select common symptoms
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {SYMPTOMS.map((s) => (
                      <label 
                        key={s.id} 
                        className={`flex items-center gap-3 p-3 rounded-lg border-2 cursor-pointer transition ${
                          selected[s.id] 
                            ? "border-pink-500 bg-pink-50" 
                            : "border-gray-200 hover:border-pink-300 hover:bg-pink-50/50"
                        }`}
                      >
                        <Checkbox 
                          checked={!!selected[s.id]} 
                          onCheckedChange={() => toggle(s.id)}
                          className="data-[state=checked]:bg-pink-600 data-[state=checked]:border-pink-600"
                        />
                        <span className="text-xl">{s.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{s.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={reset} 
                    disabled={loading}
                    className="border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    Reset
                  </Button>
                  <Button 
                    onClick={analyze} 
                    disabled={loading}
                    className="w-full" style={{ background: 'linear-gradient(135deg, hsl(297 64% 28%), hsl(327 100% 47%))', color: 'white' }}>
                    {loading ? (
                      <>
                        <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Brain className="h-4 w-4 mr-2" />
                        Check Symptoms
                      </>
                    )}
                  </Button>
                  {isAdmin() && (
                    <Button 
                      variant="ghost" 
                      onClick={() => toast({ title: "Admin Panel", description: "Admin features coming soon!" })}
                      className="text-gray-600"
                    >
                      Admin Tools
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Info Card */}
            <Card style={{ borderColor: 'hsl(297 64% 28% / 0.2)', background: 'linear-gradient(135deg, hsl(341 85% 74% / 0.1), hsl(0 0% 100%))' }}>
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">How this works</h3>
                    <p className="text-sm text-gray-600">
                      Our AI symptom checker uses simple heuristics to suggest possible concerns. This is <strong>not a diagnosis</strong>. Always consult a veterinarian for a definitive diagnosis and treatment plan.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Results */}
            {structured && (
              <Card className="shadow-lg border-pink-100">
                <CardHeader style={{ background: 'linear-gradient(135deg, hsl(297 64% 28%), hsl(327 100% 47%))', color: 'white' }}>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI Analysis Results
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm font-medium text-gray-700">Overall Urgency:</span>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        structured.overallUrgency === 'high' 
                          ? 'bg-red-100 text-red-800' 
                          : structured.overallUrgency === 'moderate' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {structured.overallUrgency.toUpperCase()}
                      </span>
                    </div>
                    
                    {structured.overallUrgency === 'high' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                        <div className="flex items-center gap-2 text-red-800 font-semibold mb-2">
                          <AlertCircle className="h-5 w-5" />
                          URGENT: Seek Veterinary Care Immediately
                        </div>
                        <p className="text-red-700 text-sm">
                          The symptoms described may indicate a serious condition requiring immediate professional attention.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Possible Conditions</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {structured.conditions.map((c, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{c.name}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              c.urgency === 'high' ? 'bg-red-100 text-red-700' : 
                              c.urgency === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 
                              'bg-green-100 text-green-700'
                            }`}>
                              {c.urgency}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-700 mb-3">{c.description}</p>
                          
                          {c.firstAidTips?.length > 0 && (
                            <div className="mb-3">
                              <div className="text-sm font-medium text-gray-900 mb-1">First Aid Tips:</div>
                              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                {c.firstAidTips.map((tip, i) => <li key={i}>{tip}</li>)}
                              </ul>
                            </div>
                          )}
                          
                          {c.recommendations?.length > 0 && (
                            <div>
                              <div className="text-sm font-medium text-gray-900 mb-1">Recommendations:</div>
                              <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                                {c.recommendations.map((tip, i) => <li key={i}>{tip}</li>)}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="text-sm font-semibold text-blue-900 mb-1">Important Disclaimer</h4>
                          <p className="text-sm text-blue-800">
                            This AI analysis is for informational purposes only and should not replace professional veterinary advice. 
                            Always consult a licensed veterinarian for proper diagnosis and treatment.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>

        {/* AI Analysis History */}
        {rateLimited && (
          <div className="mb-6">
            <Alert variant="destructive">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-red-700 mt-0.5" />
                <div>
                  <AlertTitle>AI temporarily unavailable</AlertTitle>
                  <AlertDescription>
                    <div className="text-sm">You've reached the AI usage limit. Please try again in about an hour.</div>
                    {cooldownLeft !== null && (
                      <div className="mt-2 text-xs text-muted-foreground">Retry in {Math.max(1, Math.ceil(cooldownLeft / 60))} minute(s)</div>
                    )}
                    <div className="mt-2 text-xs">
                      <a href="mailto:support@happytails.com" className="underline">Contact support</a> if you need help.
                    </div>
                  </AlertDescription>
                </div>
              </div>
            </Alert>
          </div>
        )}
        <div className="mt-12">
          <SymptomCheckHistory refreshKey={historyRefreshKey} />
        </div>
      </div>
    </div>
  );
}