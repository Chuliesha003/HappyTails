import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, CalendarDays, FileText, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const features = [
  {
    title: "AI Symptom Checker",
    icon: Brain,
    desc: "Describe symptoms or upload a photo to get possible conditions and first-aid tips.",
    to: "/symptom-checker",
  },
  {
    title: "Vet Appointment Booking",
    icon: CalendarDays,
    desc: "Find nearby clinics, view ratings and specialties, and book instantly.",
    to: "/vets",
  },
  {
    title: "Pet Health Records",
    icon: FileText,
    desc: "Keep vaccinations, documents, and reminders organized in one place.",
    to: "/pet-records",
  },
  {
    title: "Educational Resources",
    icon: BookOpen,
    desc: "Learn with curated articles and videos on nutrition, training, and diseases.",
    to: "/resources",
  },
];

const FeatureGrid = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="font-brand text-3xl font-bold">Everything you need, in one place</h2>
          <p className="font-brand mt-2 text-muted-foreground">Playful yet professional tools for pet parents and clinics.</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <Card key={f.title} className="transition hover:shadow-elevated">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <f.icon className="h-6 w-6 text-primary" aria-hidden />
                  <CardTitle>{f.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{f.desc}</p>
                <Button asChild variant="brand" size="sm">
                  <Link to={f.to}>Explore</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureGrid;
