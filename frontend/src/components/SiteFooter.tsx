import { Link } from "react-router-dom";
import { PawPrint } from "lucide-react";

const SiteFooter = () => {
  return (
    <footer className="bg-gradient-primary">
      <div className="container mx-auto px-4 md:px-6 py-10 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <PawPrint className="h-5 w-5 text-white" aria-hidden />
            <span className="font-brand text-lg font-extrabold tracking-tight text-white">HappyTails</span>
          </div>
          <p className="text-sm text-white/90">
            Friendly care for every companion. Manage health, book vets, and learn with confidence.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/symptom-checker">AI Symptom Checker</Link></li>
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/vets">Find a Veterinarian</Link></li>
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/book-appointment">Book Appointment</Link></li>
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/pet-records">Pet Profiles & Records</Link></li>
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/resources">Learning Resources</Link></li>
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/about">About Us</Link></li>
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/faq">FAQ/Help Center</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/privacy">Privacy Policy</Link></li>
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/terms">Terms of Service</Link></li>
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/cookies">Cookie Policy</Link></li>
            <li><Link className="text-white/90 hover:text-white hover:underline" to="/accessibility">Accessibility Statement</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-semibold text-white">Contact</h4>
          <ul className="space-y-2 text-sm text-white/90">
            <li>Email: hello@happytails.app</li>
            <li>Phone: +94 11 123 4567</li>
            <li>Address: 123 Pet Care Lane, Colombo 00500, Sri Lanka</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/20 py-4 text-center text-xs text-white/80">© {new Date().getFullYear()} HappyTails. All rights reserved.</div>
    </footer>
  );
};

export default SiteFooter;
