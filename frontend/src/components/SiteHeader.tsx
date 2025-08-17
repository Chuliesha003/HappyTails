import { PawPrint, Stethoscope, BookOpen, CalendarDays, FileText, LogOut } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { to: "/symptom-checker", label: "Symptom Checker", icon: Stethoscope },
  { to: "/vets", label: "Find a Vet", icon: CalendarDays },
  { to: "/pet-records", label: "Pet Records", icon: FileText },
  { to: "/resources", label: "Resources", icon: BookOpen },
  { to: "/vet-dashboard", label: "Vet Dashboard", icon: PawPrint },
];

const SiteHeader = () => {
  const { isRegistered, user, logout, canAccessFeature, getUserRole } = useAuth();
  const userRole = getUserRole();
  
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "text-primary"
      : "text-foreground/70 hover:text-foreground transition-colors";

  // Filter navigation items based on user permissions
  const getVisibleNavItems = () => {
    return navItems.filter(item => {
      // Always show symptom checker and resources
      if (item.to === "/symptom-checker" || item.to === "/resources") {
        return true;
      }
      
      // Check feature access for other items
      const featureMap: Record<string, string> = {
        "/vets": "vet-finder",
        "/pet-records": "pet-records", 
        "/vet-dashboard": "vet-dashboard"
      };
      
      const requiredFeature = featureMap[item.to];
      return requiredFeature ? canAccessFeature(requiredFeature) : false;
    });
  };

  const getRoleBadge = () => {
    const roleColors = {
      'guest': 'bg-gray-100 text-gray-800',
      'basic': 'bg-blue-100 text-blue-800',
      'premium': 'bg-purple-100 text-purple-800',
      'veterinarian': 'bg-green-100 text-green-800'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${roleColors[userRole]}`}>
        {userRole === 'veterinarian' ? 'Vet' : userRole}
      </span>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2">
          <PawPrint className="h-6 w-6 text-primary" aria-hidden />
          <span className="font-brand text-lg font-extrabold tracking-tight">HappyTails</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {getVisibleNavItems().map((item) => (
            <NavLink key={item.to} to={item.to} className={getNavClass}>
              <span className="inline-flex items-center gap-2">
                <item.icon className="h-4 w-4" aria-hidden />
                <span>{item.label}</span>
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {isRegistered() ? (
            <>
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user?.fullName || user?.email}
                </span>
                {getRoleBadge()}
              </div>
              <Button onClick={logout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center gap-2 mr-2">
                {getRoleBadge()}
              </div>
              <Button asChild variant="outline" size="sm">
                <Link to="/get-started" aria-label="Get Started with HappyTails">Get Started</Link>
              </Button>
              <Button asChild variant="brand" size="sm">
                <Link to="/login" aria-label="Login to HappyTails">Login</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default SiteHeader;
