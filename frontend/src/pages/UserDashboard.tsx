import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Heart, 
  Calendar, 
  Stethoscope, 
  FileText, 
  PlusCircle, 
  Clock, 
  MapPin, 
  Phone,
  AlertCircle,
  CheckCircle2,
  Weight,
  Shield,
  Syringe,
  Activity,
  Loader2
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { petsService } from "@/services/pets";
import { appointmentsService } from "@/services/appointments";
import { toast } from "@/hooks/use-toast";
import type { Pet, Appointment } from "@/types/api";

const UserDashboard = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingPets, setIsLoadingPets] = useState(true);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);

  useEffect(() => {
    loadPets();
    loadAppointments();
  }, []);

  const loadPets = async () => {
    try {
      setIsLoadingPets(true);
      const data = await petsService.getAllPets();
      setPets(data);
    } catch (error) {
      console.error('Failed to load pets:', error);
      toast({
        title: "Error",
        description: "Failed to load pets. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPets(false);
    }
  };

  const loadAppointments = async () => {
    try {
      setIsLoadingAppointments(true);
      const data = await appointmentsService.getUpcomingAppointments();
      setAppointments(data);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const recentActivity = [
    ...appointments.slice(0, 2).map(appointment => ({
      action: `Appointment scheduled for ${appointment.petId}`,
      date: formatDate(appointment.date)
    })),
    ...pets.slice(0, 1).map(pet => ({
      action: `${pet.name} profile updated`,
      date: "Recently"
    }))
  ].slice(0, 3);

  const healthMetrics = pets.map(pet => ({
    metric: `${pet.name}'s Health Score`,
    value: Math.min(100, Math.max(0, 
      (pet.medicalHistory?.length || 0) * 10 + 
      (pet.vaccinations?.length || 0) * 5 + 
      (pet.prescriptions?.filter(p => p.status === 'Active').length || 0) * 15
    )),
    color: "bg-green-500"
  }));

  // Get active medications from all pets
  const activeMedications = pets.flatMap(pet => 
    (pet.prescriptions || [])
      .filter(prescription => prescription.status === 'Active')
      .map(prescription => ({
        petName: pet.name,
        ...prescription
      }))
  ).slice(0, 5); // Limit to 5 most recent

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, hsl(310 60% 99%), hsl(330 60% 98%), hsl(297 30% 97%))' }}>
      <Helmet>
        <title>User Dashboard - HappyTails</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <Card style={{ background: 'linear-gradient(135deg, hsl(297 64% 28%), hsl(327 100% 47%))', color: 'white', border: 'none' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">Welcome back to HappyTails! 🐾</h1>
                <p className="text-pink-100">Keep track of your pets' health and well-being</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-pink-100">You have</p>
                <p className="text-xl font-bold">{pets.length} pets</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Pet Profiles & Appointments */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* My Pets Section */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-pink-500" />
                  My Pets
                </CardTitle>
                <Button size="sm" asChild>
                  <Link to="/pet-records">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Pet
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingPets ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center space-x-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                          <div className="flex-1 space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                        </div>
                        <Skeleton className="h-20 w-full" />
                      </div>
                    ))}
                  </div>
                ) : pets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No pets added yet</p>
                    <Button size="sm" className="mt-4" asChild>
                      <Link to="/pet-records">Add Your First Pet</Link>
                    </Button>
                  </div>
                ) : (
                  pets.map((pet) => (
                    <div key={pet.id} className="p-4 border rounded-lg space-y-3">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={pet.photoUrl} alt={pet.name} />
                          <AvatarFallback className="bg-pink-100 text-pink-600">
                            {pet.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{pet.name}</h3>
                          <p className="text-sm text-muted-foreground">{pet.breed} • {pet.age} years old</p>
                        </div>
                        <Badge className="bg-green-100 text-green-800">
                          {pet.species}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Weight className="h-4 w-4 text-gray-500" />
                          <span>{pet.weight} kg</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-gray-500" />
                          <span className="capitalize">{pet.gender}</span>
                        </div>
                        {pet.color && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-500">🎨</span>
                            <span>{pet.color}</span>
                          </div>
                        )}
                        {pet.medicalHistory && pet.medicalHistory.length > 0 && (
                          <div className="flex items-center gap-2 col-span-2">
                            <FileText className="h-4 w-4 text-gray-500" />
                            <span className="text-xs">
                              {pet.medicalHistory.length} medical record{pet.medicalHistory.length !== 1 ? 's' : ''}
                              {pet.medicalHistory.length === 1 && ` - ${pet.medicalHistory[0].condition}`}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <Link to="/pet-records">View Full Profile</Link>
                        </Button>
                        <Button size="sm" className="flex-1" asChild>
                          <Link to="/vets">Book Appointment</Link>
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  Upcoming Appointments
                </CardTitle>
                <Button size="sm" asChild>
                  <Link to="/vets">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Book New
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoadingAppointments ? (
                  <div className="space-y-4">
                    {[1, 2].map(i => (
                      <div key={i} className="p-4 border rounded-lg space-y-2">
                        <Skeleton className="h-5 w-32" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-3/4" />
                      </div>
                    ))}
                  </div>
                ) : appointments.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No upcoming appointments</p>
                    <Button size="sm" className="mt-4" asChild>
                      <Link to="/vets">Book Your First Appointment</Link>
                    </Button>
                  </div>
                ) : (
                  appointments.map((appointment) => (
                    <div key={appointment.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold">{appointment.petId}</h3>
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{formatDate(appointment.date)} at {appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Stethoscope className="h-4 w-4" />
                          <span>Dr. {appointment.vetId}</span>
                        </div>
                        <div className="flex items-center gap-2 col-span-2">
                          <FileText className="h-4 w-4" />
                          <span>{appointment.reason}</span>
                        </div>
                        {appointment.notes && (
                          <div className="flex items-center gap-2 col-span-2 text-xs">
                            <span className="font-medium">Notes:</span>
                            <span>{appointment.notes}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card style={{ background: 'linear-gradient(135deg, hsl(341 85% 74% / 0.1), hsl(297 64% 28% / 0.05))', borderColor: 'hsl(297 64% 28% / 0.2)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2" style={{ color: 'hsl(297 64% 28%)' }}>
                  <PlusCircle className="h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" size="sm" asChild>
                  <Link to="/book-appointment">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Vet Visit
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                  <Link to="/symptom-checker">
                    <Stethoscope className="w-4 h-4 mr-2" />
                    Symptom Checker
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                  <Link to="/pet-records">
                    <FileText className="w-4 h-4 mr-2" />
                    Add Health Record
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                  <Link to="/vets">
                    <MapPin className="w-4 h-4 mr-2" />
                    Find Nearby Vets
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Health Tracking */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-green-500" />
                  Health Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {healthMetrics.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No pets to track</p>
                ) : (
                  healthMetrics.map((metric, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{metric.metric}</span>
                        <span className="text-muted-foreground">{metric.value}%</span>
                      </div>
                      <Progress value={metric.value} className="h-2" />
                    </div>
                  ))
                )}
                
                {pets.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                    <div className="text-center p-2 bg-blue-50 rounded">
                      <p className="font-semibold text-blue-600">Total Pets</p>
                      <p className="text-blue-500">{pets.length}</p>
                    </div>
                    <div className="text-center p-2 bg-green-50 rounded">
                      <p className="font-semibold text-green-600">Active Meds</p>
                      <p className="text-green-500">
                        {pets.reduce((total, pet) => 
                          total + (pet.prescriptions?.filter(p => p.status === 'Active').length || 0), 0
                        )}
                      </p>
                    </div>
                    <div className="text-center p-2 bg-yellow-50 rounded">
                      <p className="font-semibold text-yellow-600">Records</p>
                      <p className="text-yellow-500">
                        {pets.reduce((total, pet) => 
                          total + (pet.medicalHistory?.length || 0), 0
                        )}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medications */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Syringe className="h-5 w-5 text-red-500" />
                  Active Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {activeMedications.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Syringe className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No active medications</p>
                  </div>
                ) : (
                  activeMedications.map((medication, index) => (
                    <div key={index} className="p-3 border rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{medication.petName} - {medication.medicationName}</p>
                          <p className="text-xs text-muted-foreground">
                            {medication.dosage} • {medication.frequency}
                            {medication.refillsRemaining > 0 && ` • ${medication.refillsRemaining} refills left`}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                          {medication.status}
                        </Badge>
                      </div>
                    </div>
                  ))
                )}
                
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/pet-records">Manage Medications</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No recent activity</p>
                    <p className="text-xs">Book an appointment or add a pet to get started</p>
                  </div>
                ) : (
                  recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start gap-3 text-sm">
                      <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-muted-foreground text-xs">{activity.date}</p>
                      </div>
                    </div>
                  ))
                )}
                <Button variant="outline" className="w-full" size="sm" asChild>
                  <Link to="/pet-records">View All Records</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
