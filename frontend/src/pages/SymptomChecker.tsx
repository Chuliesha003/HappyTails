import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";

interface Result {
  condition: string;
  urgency: "Low" | "Moderate" | "High";
  tips: string;
}

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [results, setResults] = useState<Result[]>([]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo results
    const mock: Result[] = [
      { condition: "Allergic Dermatitis", urgency: "Low", tips: "Use a cone to prevent scratching. Mild oatmeal bath can soothe itching." },
      { condition: "Gastroenteritis", urgency: "Moderate", tips: "Hydration is key. Offer small sips of water and bland food." },
      { condition: "Foreign Object Ingestion", urgency: "High", tips: "Avoid inducing vomiting. Seek urgent veterinary care." },
    ];
    setResults(mock);
    toast({ title: "Results ready", description: "Here are some possible conditions and first‑aid tips." });
  };

  const urgencyColor = (u: Result["urgency"]) =>
    u === "High" ? "destructive" : u === "Moderate" ? "default" : "secondary";

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
      <Helmet>
        <title>AI Symptom Checker – HappyTails</title>
        <meta name="description" content="Input symptoms or upload a pet photo to see possible conditions, urgency, and first‑aid tips." />
        <link rel="canonical" href="/symptom-checker" />
      </Helmet>

      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">AI Symptom Checker</h1>
        <p className="text-muted-foreground">Describe what you see. We’ll suggest possibilities—then book a vet visit if needed.</p>
      </header>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium">Symptoms</label>
              <Textarea
                placeholder="e.g., Vomiting since yesterday, lethargic, not eating"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={6}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Upload Photo (optional)</label>
              <Input type="file" accept="image/*" onChange={(e) => setFileName(e.target.files?.[0]?.name ?? null)} />
              {fileName && <p className="text-xs text-muted-foreground">Selected: {fileName}</p>}
              <Button type="submit" variant="cta" className="w-full">Check Symptoms</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <section className="grid gap-4 md:grid-cols-3">
          {results.map((r, i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{r.condition}</span>
                  <Badge variant={urgencyColor(r.urgency)}>{r.urgency}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{r.tips}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      )}
    </div>
  );
};

export default SymptomChecker;
