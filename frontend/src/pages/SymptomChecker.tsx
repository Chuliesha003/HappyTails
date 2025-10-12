import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { Brain, AlertCircle, Sparkles, Heart, Stethoscope, PawPrint } from "lucide-react";
import { symptomsService } from "@/services/symptoms";
import type { SymptomAnalysisResponse } from "@/types/api";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
      let data: SymptomAnalysisResponse;
      if (photo) {
        data = await symptomsService.analyzeSymptomsWithPhoto(symptomText, photo, petType, petAge ? Number(petAge) : undefined);
      } else {
        data = await symptomsService.analyzeSymptoms({ symptoms: symptomText, petType, petAge: petAge ? Number(petAge) : undefined });
      }

      // Render structured panel and also build a short guidance list for the sidebar
      setStructured(data);
      const guidance: string[] = [];
      if (data.overallUrgency === 'high') {
        guidance.push("� URGENT: Symptoms may indicate a serious issue. Seek veterinary care promptly.");
      }
      data.conditions.slice(0, 3).forEach(c => {
        if (c.firstAidTips?.length) guidance.push(`🩺 ${c.name}: ${c.firstAidTips[0]}`);
        else guidance.push(`🩺 ${c.name}: see recommendations`);
      });
      setResults(guidance);
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Failed to analyze symptoms.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
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

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Input Section */}
          <section className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-pink-100 transition hover:shadow-xl">
              <CardHeader className="bg-gradient-to-r from-pink-500 to-purple-600 text-white">
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
                    className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                  >
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
            <Card className="border-blue-100 bg-gradient-to-br from-blue-50 to-white">
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
          </section>

          {/* Results Sidebar */}
          <aside>
            <Card className="shadow-lg border-purple-100 sticky top-24">
              <CardHeader className="bg-gradient-to-br from-purple-100 to-pink-100">
                <CardTitle className="flex items-center gap-2 text-purple-900">
                  <Heart className="h-5 w-5 text-pink-600" />
                  AI Guidance
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {results === null ? (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 mx-auto text-pink-300 mb-3" />
                    <p className="text-sm text-gray-600">
                      Select symptoms or describe what's happening, then press <strong>Check Symptoms</strong> to see guidance.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {results.map((r, i) => (
                      <div 
                        key={i} 
                        className={`p-4 rounded-lg ${
                          r.includes("URGENT") 
                            ? "bg-red-50 border-2 border-red-300" 
                            : "bg-gradient-to-br from-pink-50 to-purple-50 border border-pink-200"
                        }`}
                      >
                        <p className={`text-sm ${r.includes("URGENT") ? "text-red-900 font-semibold" : "text-gray-800"}`}>
                          {r}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs text-gray-500 text-center">
                    🚑 <strong>Emergency?</strong> Contact your local emergency vet immediately.
                  </p>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>

        {/* Structured results list */}
        {structured && (
          <div className="max-w-5xl mx-auto mt-10 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900">Possible conditions</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {structured.conditions.map((c, idx) => (
                <Card key={idx} className="border-pink-100">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{c.name}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${c.urgency === 'high' ? 'bg-red-100 text-red-700' : c.urgency === 'moderate' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>{c.urgency.toUpperCase()}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-gray-700">{c.description}</p>
                    {c.firstAidTips?.length ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">First-aid tips</div>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                          {c.firstAidTips.slice(0,3).map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    ) : null}
                    {c.recommendations?.length ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">Recommendations</div>
                        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
                          {c.recommendations.slice(0,3).map((t, i) => <li key={i}>{t}</li>)}
                        </ul>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
