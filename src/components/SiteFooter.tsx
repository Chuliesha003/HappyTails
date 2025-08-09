import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-primary" aria-hidden />
            <span className="font-brand text-lg font-extrabold tracking-tight">HappyTails</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Friendly care for every companion. Manage health, book vets, and learn with confidence.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-foreground">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:underline" to="/symptom-checker">AI Symptom Checker</Link></li>
            <li><Link className="hover:underline" to="/vets">Find a Veterinarian</Link></li>
            <li><Link className="hover:underline" to="/pet-records">Pet Profiles & Records</Link></li>
            <li><Link className="hover:underline" to="/resources">Learning Resources</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-foreground">For Clinics</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="hover:underline" to="/vet-dashboard">Clinic Dashboard</Link></li>
            <li><a className="hover:underline" href="#">Getting Started</a></li>
            <li><a className="hover:underline" href="#">Pricing</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-foreground">Contact</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Email: hello@happytails.app</li>
            <li>Phone: (555) 123-TAIL</li>
            <li>Mon–Fri: 9am–6pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} HappyTails. All rights reserved.</div>
    </footer>
  );
};

export default SiteFooter;
