import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const pets = [
    {
      id: 1,
      name: "Buddy",
      type: "Dog",
      breed: "Golden Retriever",
      age: "3 years",
      weight: "32 kg",
      lastVisit: "2024-01-10",
      nextVaccination: "2024-04-15",
      healthStatus: "Excellent",
      microchipId: "982000123456789",
      vetName: "Dr. Sarah Johnson"
    },
    {
      id: 2,
      name: "Luna",
      type: "Cat",
      breed: "Persian",
      age: "2 years",
      weight: "4.2 kg",
      lastVisit: "2023-12-20",
      nextVaccination: "2024-02-20",
      healthStatus: "Good",
      microchipId: "982000987654321",
      vetName: "Dr. Mark Chen"
    }
  ];

  const upcomingAppointments = [
    {
      id: 1,
      petName: "Buddy",
      type: "Annual Checkup",
      date: "2024-01-20",
      time: "10:30 AM",
      vet: "Dr. Sarah Johnson",
      clinic: "Downtown Vet Clinic",
      status: "Confirmed"
    },
    {
      id: 2,
      petName: "Luna",
      type: "Vaccination",
      date: "2024-02-05",
      time: "2:15 PM",
      vet: "Dr. Mark Chen",
      clinic: "PetCare Plus",
      status: "Pending"
    }
  ];

  const recentActivity = [
    { action: "Buddy's vaccination completed", date: "3 days ago" },
    { action: "Luna's weight recorded: 4.2 kg", date: "1 week ago" },
    { action: "Appointment booked for Buddy", date: "2 weeks ago" },
    { action: "Health profile updated for Luna", date: "3 weeks ago" }
  ];

  const healthMetrics = [
    { metric: "Weight Tracking", value: 85, color: "bg-blue-500" },
    { metric: "Activity Level", value: 92, color: "bg-green-500" },
    { metric: "Mood Assessment", value: 78, color: "bg-yellow-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <Helmet>
        <title>User Dashboard - HappyTails</title>
      </Helmet>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Welcome Header */}
        <Card className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0">
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
                {pets.map((pet) => (
                  <div key={pet.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-pink-100 text-pink-600">
                          {pet.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{pet.name}</h3>
                        <p className="text-sm text-muted-foreground">{pet.breed} • {pet.age}</p>
                      </div>
                      <Badge 
                        variant={pet.healthStatus === 'Excellent' ? 'default' : 'secondary'}
                        className={pet.healthStatus === 'Excellent' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                      >
                        {pet.healthStatus}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Weight className="h-4 w-4 text-gray-500" />
                        <span>{pet.weight}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-gray-500" />
                        <span>{pet.microchipId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4 text-gray-500" />
                        <span>{pet.vetName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Syringe className="h-4 w-4 text-gray-500" />
                        <span>Next: {pet.nextVaccination}</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1" asChild>
                        <Link to="/pet-records">View Full Profile</Link>
                      </Button>
                      <Button size="sm" className="flex-1" asChild>
                        <Link to="/book-appointment">Book Appointment</Link>
                      </Button>
                    </div>
                  </div>
                ))}
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
                  <Link to="/book-appointment">
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Book New
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{appointment.petName}</h3>
                      <Badge variant={appointment.status === 'Confirmed' ? 'default' : 'secondary'}>
                        {appointment.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>{appointment.date} at {appointment.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        <span>{appointment.vet}</span>
                      </div>
                      <div className="flex items-center gap-2 col-span-2">
                        <MapPin className="h-4 w-4" />
                        <span>{appointment.clinic} - {appointment.type}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
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
                {healthMetrics.map((metric, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{metric.metric}</span>
                      <span className="text-muted-foreground">{metric.value}%</span>
                    </div>
                    <Progress value={metric.value} className="h-2" />
                  </div>
                ))}
                
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <p className="font-semibold text-blue-600">Weight</p>
                    <p className="text-blue-500">32.1 kg</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded">
                    <p className="font-semibold text-green-600">Activity</p>
                    <p className="text-green-500">High</p>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <p className="font-semibold text-yellow-600">Mood</p>
                    <p className="text-yellow-500">Happy</p>
                  </div>
                </div>
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
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">Buddy - Heartworm Prevention</p>
                      <p className="text-xs text-muted-foreground">Monthly tablet</p>
                    </div>
                    <Badge variant="outline" className="text-xs">Due in 5 days</Badge>
                  </div>
                </div>
                
                <div className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-sm">Luna - Flea Treatment</p>
                      <p className="text-xs text-muted-foreground">Topical application</p>
                    </div>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Completed</Badge>
                  </div>
                </div>
                
                <Button variant="outline" className="w-full" size="sm">
                  Add Medication
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3 text-sm">
                    <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-muted-foreground text-xs">{activity.date}</p>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View All Activity
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
