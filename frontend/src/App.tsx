import React, { Component, ErrorInfo } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Vets from "./pages/Vets";
import PetRecords from "./pages/PetRecords";
import Resources from "./pages/Resources";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import Login from "./pages/Login";
import GetStarted from "./pages/GetStarted";
import BookAppointment from "./pages/BookAppointment";
import SiteHeader from "./components/SiteHeader";
import SiteFooter from "./components/SiteFooter";
import SymptomCheckerPage from "./pages/SymptomChecker";
import { withAuth } from "./components/withAuth";
import { withRole } from "./components/withRole";

const queryClient = new QueryClient();

// Create protected versions of components with authentication and role requirements
const ProtectedPetRecords = withAuth(PetRecords);
const ProtectedUserDashboard = withAuth(UserDashboard);
const ProtectedBookAppointment = withAuth(BookAppointment);
const ProtectedAdminDashboard = withRole(AdminDashboard, { allowedRoles: ['admin'] });

const AppContent = () => {
  const location = useLocation();

  const hideFooter = location.pathname === '/login' || location.pathname === '/get-started';

  return (
    <>
      <SiteHeader />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/get-started" element={<GetStarted />} />
  <Route path="/symptom-checker" element={<SymptomCheckerPage />} />
        <Route path="/vets" element={<Vets />} />
        <Route path="/resources" element={<Resources />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/pet-records" element={<ProtectedPetRecords />} />
        <Route path="/book-appointment" element={<ProtectedBookAppointment />} />
        <Route path="/user-dashboard" element={<ProtectedUserDashboard />} />
        
        {/* Admin-only routes */}
        <Route path="/admin-dashboard" element={<ProtectedAdminDashboard />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!hideFooter && <SiteFooter />}
    </>
  );
};

// Error boundary to show runtime errors instead of a white screen
class ErrorBoundary extends Component<{ children?: React.ReactNode }, { error: Error | null; info: ErrorInfo | null }>{
  constructor(props: { children?: React.ReactNode }) {
    super(props);
    this.state = { error: null, info: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log to console and store for display
    console.error('Uncaught error in App:', error, info);
    this.setState({ error, info });
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24 }}>
          <h1 style={{ color: '#b91c1c' }}>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f3f3f3', padding: 12 }}>{this.state.info?.componentStack}</pre>
        </div>
      );
    }

    return this.props.children as React.ReactElement;
  }
}

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>

            <AppContent />
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
