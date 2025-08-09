import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    quote:
      "HappyTails makes vet visits a breeze. Booking is fast and records are all in one place!",
    name: "Alex & Luna",
    role: "Pet Parent",
  },
  {
    quote:
      "The dashboard helps our clinic stay organized and provide better care to every pet.",
    name: "Dr. Kim",
    role: "Veterinarian",
  },
  {
    quote:
      "The AI checker gave us quick guidance before our appointment—so reassuring!",
    name: "Sam & Pepper",
    role: "Pet Parent",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-card">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold">Loved by pet owners and vets</h2>
          <p className="mt-2 text-muted-foreground">Real stories from our caring community</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card key={i} className="h-full">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-1 text-accent">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm">“{t.quote}”</blockquote>
                <div className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">{t.name}</span> • {t.role}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
