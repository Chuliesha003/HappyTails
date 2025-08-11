import { useNavigate } from "react-router-dom";
import { useState } from "react";
import heroPets from "@/assets/hero-pets.jpg";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const onSearch = (e?: React.FormEvent) => {
    e?.preventDefault();
    navigate(`/vets?q=${encodeURIComponent(q)}`);
  };

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-80" aria-hidden>
        <div className="h-full w-full bg-gradient-primary" />
        <div className="absolute inset-0 mix-blend-soft-light" />
      </div>

      <div className="container mx-auto grid items-center gap-10 px-4 md:px-6 py-16 md:grid-cols-2">
        <div className="space-y-6 animate-fade-in">
          <h1 className="font-brand text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Caring for every tail, one health at a time
          </h1>
          <p className="text-lg text-foreground/80">
            Book trusted veterinarians, check symptoms with AI, and keep your pet’s health records in one friendly place.
          </p>

          <form onSubmit={onSearch} className="flex w-full max-w-xl items-center gap-2">
            <Input
              aria-label="Search veterinarians near you"
              placeholder="Find a Veterinarian"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-12"
            />
            <Button type="submit" variant="cta" size="lg" className="h-12 px-6">
              Find a Veterinarian
            </Button>
          </form>
        </div>

        <div className="relative">
          <img
            src={heroPets}
            alt="Illustration of happy pets: dogs, cats, and exotic animals"
            className="w-full rounded-xl shadow-elevated"
            loading="eager"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/20" aria-hidden />
        </div>
      </div>
    </section>
  );
};

export default Hero;
