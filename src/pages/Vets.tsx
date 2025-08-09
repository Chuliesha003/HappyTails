import { Helmet } from "react-helmet-async";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface Vet {
  name: string; rating: number; specialties: string[]; address: string;
}

const mockVets: Vet[] = [
  { name: "Paws & Care Clinic", rating: 4.8, specialties: ["Dental", "Dermatology"], address: "123 Meadow St" },
  { name: "Downtown Vet Center", rating: 4.6, specialties: ["Surgery", "Exotics"], address: "45 River Ave" },
  { name: "Oakwood Animal Hospital", rating: 4.9, specialties: ["Emergency", "Cardiology"], address: "78 Oakwood Rd" },
];

const Rating = ({ value }: { value: number }) => (
  <div className="flex items-center gap-1 text-accent" aria-label={`Rating ${value} out of 5`}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < Math.round(value) ? "fill-current" : ""}`} />
    ))}
    <span className="ml-1 text-xs text-muted-foreground">{value.toFixed(1)}</span>
  </div>
);

const Vets = () => {
  const [params] = useSearchParams();
  const q = params.get("q") || "";
  const [selected, setSelected] = useState<Vet | null>(null);

  const filtered = useMemo(() => {
    if (!q) return mockVets;
    return mockVets.filter((v) => v.name.toLowerCase().includes(q.toLowerCase()));
  }, [q]);

  const onBook = () => {
    toast({ title: "Appointment requested", description: `${selected?.name} will confirm shortly.` });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 grid gap-6 lg:grid-cols-3">
      <Helmet>
        <title>Find & Book Vets – HappyTails</title>
        <meta name="description" content="Search nearby veterinary clinics, view ratings and specialties, and request appointments." />
        <link rel="canonical" href="/vets" />
      </Helmet>

      <div className="lg:col-span-2">
        <div className="relative w-full overflow-hidden rounded-xl border">
          <iframe
            title="Map of veterinarians near me"
            src={`https://www.google.com/maps?q=${encodeURIComponent(q || "veterinarian")}&output=embed`}
            className="h-[420px] w-full"
            loading="lazy"
          />
        </div>
      </div>

      <div className="space-y-4">
        {filtered.map((v) => (
          <Card key={v.name}>
            <CardHeader className="space-y-1">
              <CardTitle className="flex items-center justify-between">
                <span>{v.name}</span>
                <Rating value={v.rating} />
              </CardTitle>
              <div className="flex flex-wrap gap-2">
                {v.specialties.map((s) => (
                  <Badge key={s} variant="secondary">{s}</Badge>
                ))}
              </div>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{v.address}</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="cta" onClick={() => setSelected(v)}>Book Appointment</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Request an Appointment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">Clinic: <span className="text-foreground">{selected?.name}</span></p>
                    <div className="grid gap-2 sm:grid-cols-2">
                      <Button variant="brand">Tomorrow 10:00</Button>
                      <Button variant="brand">Tomorrow 14:00</Button>
                      <Button variant="brand">Fri 09:30</Button>
                      <Button variant="brand">Mon 16:15</Button>
                    </div>
                    <Button variant="cta" onClick={onBook}>Confirm Request</Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Vets;
