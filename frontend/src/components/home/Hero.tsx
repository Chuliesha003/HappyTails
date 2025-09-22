import { useNavigate } from "react-router-dom";
import { useState } from "react";
import heroPets from "@/assets/hero-pets-real.jpeg";
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

      <div className="container mx-auto grid items-center gap-10 px-4 md:px-6 py-16 lg:py-20 md:grid-cols-2">
        <div className="space-y-6 animate-fade-in">
          <h1 className="font-sans text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-foreground">
            Caring for Every Tail
          </h1>
          <p className="font-brand text-lg md:text-xl text-foreground/80 leading-relaxed max-w-lg">
            Book trusted veterinarians, check symptoms with AI, and keep your pet's health records in one friendly place.
          </p>

          <form onSubmit={onSearch} className="flex w-full max-w-xl items-center gap-2 pt-4">
            <Input
              aria-label="Search veterinarians near you"
              placeholder="Find a Veterinarian"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="h-12 text-base"
            />
            <Button type="submit" variant="cta" size="lg" className="h-12 px-6 whitespace-nowrap">
              Find a Vet
            </Button>
          </form>
        </div>

        <div className="relative animate-fade-in">
          <div className="aspect-[16/9] overflow-hidden rounded-xl">
            <img
              src={heroPets}
              alt="Adorable group of puppies and kittens sitting together - black and white puppies with orange and gray kittens"
              className="w-full h-full object-cover rounded-xl shadow-elevated transition-transform duration-300 hover:scale-105"
              loading="eager"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-white/20" aria-hidden />
        </div>
      </div>
    </section>
  );
};

export default Hero;
