import { PawPrint, Stethoscope, BookOpen, CalendarDays, FileText } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const navItems = [
  { to: "/symptom-checker", label: "Symptom Checker", icon: Stethoscope },
  { to: "/vets", label: "Find a Vet", icon: CalendarDays },
  { to: "/pet-records", label: "Pet Records", icon: FileText },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/vet-dashboard", label: "Vet Dashboard", icon: PawPrint },
];

const SiteHeader = () => {
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-primary"
      : "text-foreground/70 hover:text-foreground transition-colors";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <PawPrint className="h-6 w-6 text-primary" aria-hidden />
          <span className="font-brand text-lg font-extrabold tracking-tight">HappyTails</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={getNavClass}>
              <span className="inline-flex items-center gap-2">
                <item.icon className="h-4 w-4" aria-hidden />
                <span>{item.label}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild variant="brand" size="sm">
            <Link to="/login" aria-label="Login to HappyTails">Login</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
