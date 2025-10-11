import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Users, Activity, Settings, Database, TrendingUp, Shield, FileText, AlertTriangle, Calendar, BarChart3, Clock, Globe, Loader2, CheckCircle, XCircle, Ban, Heart, Search, Trash2, UserCog, RefreshCw } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { adminService } from "@/services/admin";
import { toast } from "@/hooks/use-toast";
import type { User, AdminStats, Appointment, Vet, Article, Pet, Medication } from "@/types/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [vets, setVets] = useState<Vet[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(false);
  const [isLoadingVets, setIsLoadingVets] = useState(false);
  const [isLoadingArticles, setIsLoadingArticles] = useState(false);
  const [isLoadingPets, setIsLoadingPets] = useState(false);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [appointmentStatusFilter, setAppointmentStatusFilter] = useState<string>("all");
  const [vetFilter, setVetFilter] = useState<string>("all");
  const [appointmentSearchQuery, setAppointmentSearchQuery] = useState("");
  const [petSearchQuery, setPetSearchQuery] = useState("");
  const [petSpeciesFilter, setPetSpeciesFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [appointmentCurrentPage, setAppointmentCurrentPage] = useState(1);
  const [appointmentTotalPages, setAppointmentTotalPages] = useState(1);
  const [petCurrentPage, setPetCurrentPage] = useState(1);
  const [petTotalPages, setPetTotalPages] = useState(1);
  const [isPetDialogOpen, setIsPetDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [petFormData, setPetFormData] = useState({
    name: '',
    species: '',
    breed: '',
    age: '',
    dateOfBirth: '',
    weight: '',
    gender: '',
    color: '',
    microchipId: '',
    owner: '',
    allergies: '',
    medications: '',
    specialNeeds: '',
    photoUrl: ''
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const data = await adminService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const loadUsers = useCallback(async () => {
    try {
      setIsLoadingUsers(true);
      const params: { page: number; limit: number; role?: string; search?: string } = { 
        page: currentPage, 
        limit: 20
      };
      
      if (roleFilter && roleFilter !== 'all') {
        params.role = roleFilter;
      }
      
      if (searchQuery) {
        params.search = searchQuery;
      }
      
      const data = await adminService.getAllUsers(params);
      setUsers(data.users);
      setTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingUsers(false);
    }
  }, [currentPage, roleFilter, searchQuery]);

  const loadAppointments = useCallback(async () => {
    try {
      setIsLoadingAppointments(true);
      const params: { page: number; limit: number; status?: string; search?: string } = { 
        page: appointmentCurrentPage, 
        limit: 20
      };
      
      if (appointmentStatusFilter && appointmentStatusFilter !== 'all') {
        params.status = appointmentStatusFilter;
      }
      
      if (appointmentSearchQuery) {
        params.search = appointmentSearchQuery;
      }
      
      const data = await adminService.getAllAppointments(params);
      setAppointments(data.data);
      setAppointmentTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load appointments:', error);
      toast({
        title: "Error",
        description: "Failed to load appointments.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingAppointments(false);
    }
  }, [appointmentCurrentPage, appointmentStatusFilter, appointmentSearchQuery]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  useEffect(() => {
    loadAppointments();
  }, [loadAppointments]);

  const loadVets = useCallback(async () => {
    try {
      setIsLoadingVets(true);
      const data = await adminService.getAllVets({ page: 1, limit: 20 });
      setVets(data.vets);
    } catch (error) {
      console.error('Failed to load vets:', error);
      toast({
        title: "Error",
        description: "Failed to load vets.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingVets(false);
    }
  }, []);

  const loadArticles = useCallback(async () => {
    try {
      setIsLoadingArticles(true);
      const data = await adminService.getAllArticles({ page: 1, limit: 20 });
      setArticles(data.articles);
    } catch (error) {
      console.error('Failed to load articles:', error);
      toast({
        title: "Error",
        description: "Failed to load articles.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingArticles(false);
    }
  }, []);

  const loadPets = useCallback(async () => {
    try {
      setIsLoadingPets(true);
      const params: { page: number; limit: number; species?: string; search?: string; isActive?: string } = { 
        page: petCurrentPage, 
        limit: 20
      };
      
      if (petSpeciesFilter && petSpeciesFilter !== 'all') {
        params.species = petSpeciesFilter;
      }
      
      if (petSearchQuery) {
        params.search = petSearchQuery;
      }
      
      params.isActive = 'all'; // Show all pets by default
      
      const data = await adminService.getAllPets(params);
      setPets(data.pets);
      setPetTotalPages(data.pagination?.totalPages || 1);
    } catch (error) {
      console.error('Failed to load pets:', error);
      toast({
        title: "Error",
        description: "Failed to load pets.",
        variant: "destructive"
      });
    } finally {
      setIsLoadingPets(false);
    }
  }, [petCurrentPage, petSpeciesFilter, petSearchQuery]);

  const handleCreatePet = async (petData: {
    name: string;
    species: string;
    breed: string;
    age?: number;
    ageUnit?: string;
    dateOfBirth?: string;
    weight?: number;
    weightUnit?: string;
    gender?: string;
    color?: string;
    microchipId?: string;
    owner: string;
    allergies?: string[];
    medications?: Medication[];
    specialNeeds?: string;
    photoUrl?: string;
  }) => {
    try {
      await adminService.createPet(petData);
      await loadPets();
      toast({
        title: "Success",
        description: "Pet created successfully."
      });
    } catch (error) {
      console.error('Failed to create pet:', error);
      toast({
        title: "Error",
        description: "Failed to create pet.",
        variant: "destructive"
      });
    }
  };

  const handleUpdatePet = async (petId: string, petData: Partial<{
    name: string;
    species: string;
    breed: string;
    age?: number;
    ageUnit?: string;
    dateOfBirth?: string;
    weight?: number;
    weightUnit?: string;
    gender?: string;
    color?: string;
    microchipId?: string;
    allergies?: string[];
    medications?: Medication[];
    specialNeeds?: string;
    photoUrl?: string;
    isActive?: boolean;
  }>) => {
    try {
      await adminService.updatePet(petId, petData);
      await loadPets();
      toast({
        title: "Success",
        description: "Pet updated successfully."
      });
    } catch (error) {
      console.error('Failed to update pet:', error);
      toast({
        title: "Error",
        description: "Failed to update pet.",
        variant: "destructive"
      });
    }
  };

  const handleDeletePet = async (petId: string) => {
    if (!confirm('Are you sure you want to delete this pet? This action cannot be undone.')) {
      return;
    }

    try {
      await adminService.deletePet(petId);
      await loadPets();
      toast({
        title: "Success",
        description: "Pet deleted successfully."
      });
    } catch (error) {
      console.error('Failed to delete pet:', error);
      toast({
        title: "Error",
        description: "Failed to delete pet.",
        variant: "destructive"
      });
    }
  };

  const handleTogglePetStatus = async (petId: string) => {
    try {
      await adminService.togglePetStatus(petId);
      await loadPets();
      toast({
        title: "Success",
        description: "Pet status updated successfully."
      });
    } catch (error) {
      console.error('Failed to toggle pet status:', error);
      toast({
        title: "Error",
        description: "Failed to update pet status.",
        variant: "destructive"
      });
    }
  };

  const openPetDialog = (pet?: Pet) => {
    if (pet) {
      // Editing existing pet
      setEditingPet(pet);
      setPetFormData({
        name: pet.name || '',
        species: pet.species || '',
        breed: pet.breed || '',
        age: pet.age ? `${pet.age} ${pet.ageUnit || 'years'}` : '',
        dateOfBirth: pet.dateOfBirth || '',
        weight: pet.weight ? `${pet.weight} ${pet.weightUnit || 'lbs'}` : '',
        gender: pet.gender || '',
        color: pet.color || '',
        microchipId: pet.microchipId || '',
        owner: typeof pet.owner === 'object' ? pet.owner.id : pet.owner || '',
        allergies: Array.isArray(pet.allergies) ? pet.allergies.join(', ') : '',
        medications: Array.isArray(pet.medications) ? pet.medications.map(m => `${m.name} (${m.dosage})`).join(', ') : '',
        specialNeeds: pet.specialNeeds || '',
        photoUrl: pet.photoUrl || ''
      });
    } else {
      // Creating new pet
      setEditingPet(null);
      setPetFormData({
        name: '',
        species: '',
        breed: '',
        age: '',
        dateOfBirth: '',
        weight: '',
        gender: '',
        color: '',
        microchipId: '',
        owner: '',
        allergies: '',
        medications: '',
        specialNeeds: '',
        photoUrl: ''
      });
    }
    setIsPetDialogOpen(true);
  };

  const closePetDialog = () => {
    setIsPetDialogOpen(false);
    setEditingPet(null);
    setPetFormData({
      name: '',
      species: '',
      breed: '',
      age: '',
      dateOfBirth: '',
      weight: '',
      gender: '',
      color: '',
      microchipId: '',
      owner: '',
      allergies: '',
      medications: '',
      specialNeeds: '',
      photoUrl: ''
    });
  };

  const handlePetFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Parse simple inputs into complex data structure
      const petData = {
        name: petFormData.name,
        species: petFormData.species,
        breed: petFormData.breed,
        owner: petFormData.owner,
        // Parse age (e.g., "3 years" -> age: 3, ageUnit: "years")
        ...(petFormData.age && (() => {
          const ageMatch = petFormData.age.match(/^(\d+)\s*(years?|months?|weeks?|days?)?$/i);
          if (ageMatch) {
            return {
              age: parseInt(ageMatch[1]),
              ageUnit: ageMatch[2] || 'years'
            };
          }
          return { age: parseInt(petFormData.age) || undefined };
        })()),
        // Parse weight (e.g., "15 lbs" -> weight: 15, weightUnit: "lbs")
        ...(petFormData.weight && (() => {
          const weightMatch = petFormData.weight.match(/^(\d+(?:\.\d+)?)\s*(lbs?|kg|grams?|ounces?)?$/i);
          if (weightMatch) {
            return {
              weight: parseFloat(weightMatch[1]),
              weightUnit: weightMatch[2] || 'lbs'
            };
          }
          return { weight: parseFloat(petFormData.weight) || undefined };
        })()),
        dateOfBirth: petFormData.dateOfBirth || undefined,
        gender: petFormData.gender || undefined,
        color: petFormData.color || undefined,
        microchipId: petFormData.microchipId || undefined,
        // Parse allergies (comma-separated -> array)
        allergies: petFormData.allergies ? petFormData.allergies.split(',').map(a => a.trim()).filter(a => a) : undefined,
        // Parse medications (simple text for now - could be enhanced later)
        medications: petFormData.medications ? [{ name: petFormData.medications, dosage: 'As prescribed' }] : undefined,
        specialNeeds: petFormData.specialNeeds || undefined,
        photoUrl: petFormData.photoUrl || undefined
      };

      if (editingPet) {
        await handleUpdatePet(editingPet.id, petData);
      } else {
        await handleCreatePet(petData);
      }
      
      closePetDialog();
    } catch (error) {
      console.error('Failed to save pet:', error);
      toast({
        title: "Error",
        description: "Failed to save pet.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateRole = async (userId: string, newRole: 'user' | 'vet' | 'admin') => {
    try {
      setProcessingUserId(userId);
      await adminService.updateUserRole(userId, newRole);
      await loadUsers();
      toast({
        title: "Success",
        description: `User role updated to ${newRole}.`
      });
    } catch (error) {
      console.error('Failed to update role:', error);
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleToggleBan = async (userId: string, currentlyBanned: boolean) => {
    try {
      setProcessingUserId(userId);
      await adminService.toggleUserBan(userId, !currentlyBanned);
      await loadUsers();
      toast({
        title: "Success",
        description: currentlyBanned ? "User unbanned successfully." : "User banned successfully."
      });
    } catch (error) {
      console.error('Failed to toggle ban:', error);
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive"
      });
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessingUserId(userId);
      await adminService.deleteUser(userId);
      await loadUsers();
      toast({
        title: "Success",
        description: "User deleted successfully."
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user.",
        variant: "destructive"
      });
    } finally {
      setProcessingUserId(null);
    }
  };

  const handleVerifyVet = async (vetId: string) => {
    try {
      await adminService.toggleVetVerification(vetId);
      await loadVets();
      toast({
        title: "Success",
        description: "Veterinarian verified successfully."
      });
    } catch (error) {
      console.error('Failed to verify vet:', error);
      toast({
        title: "Error",
        description: "Failed to verify veterinarian.",
        variant: "destructive"
      });
    }
  };

  const handleToggleArticlePublish = async (articleId: string) => {
    try {
      await adminService.toggleArticlePublish(articleId);
      await loadArticles();
      toast({
        title: "Success",
        description: "Article status updated successfully."
      });
    } catch (error) {
      console.error('Failed to toggle article publish:', error);
      toast({
        title: "Error",
        description: "Failed to update article status.",
        variant: "destructive"
      });
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'vet':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
      <Helmet>
        <title>Admin Dashboard – HappyTails</title>
        <meta name="description" content="Manage users, system settings, and monitor platform performance." />
        <link rel="canonical" href="/admin-dashboard" />
      </Helmet>

      <header className="space-y-2">
        <h1 className="font-brand text-3xl font-bold">Admin Dashboard</h1>
        <p className="font-brand text-muted-foreground">Manage and monitor the HappyTails platform.</p>
      </header>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {isLoadingStats ? (
          <>
            {[1, 2, 3, 4].map(i => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </>
        ) : stats ? (
          <>
            <Card>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Registered</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <Shield className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Vets</p>
                  <p className="text-2xl font-bold">{stats.totalVets.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Verified professionals</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <Calendar className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Appointments</p>
                  <p className="text-2xl font-bold">{stats.totalAppointments.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">All time</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="flex items-center p-6">
                <Heart className="h-8 w-8 text-pink-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-muted-foreground">Total Pets</p>
                  <p className="text-2xl font-bold">{stats.totalPets.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Registered pets</p>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card className="col-span-4">
            <CardContent className="p-6 text-center text-muted-foreground">
              Failed to load statistics
            </CardContent>
          </Card>
        )}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="pets">Pet Management</TabsTrigger>
          <TabsTrigger value="vets">Vet Management</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Manage registered users and their roles
                  </CardDescription>
                </div>
                <Button onClick={() => loadUsers()} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={roleFilter} onValueChange={(value) => {
                  setRoleFilter(value);
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="user">Users</SelectItem>
                    <SelectItem value="vet">Vets</SelectItem>
                    <SelectItem value="admin">Admins</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* User Table */}
              {isLoadingUsers ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : users.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.fullName || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{user.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant="secondary"
                            className={getRoleBadgeColor(user.role)}
                          >
                            {user.role.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(user.createdAt)}
                          </span>
                        </TableCell>
                        <TableCell>
                          {user.isBanned ? (
                            <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                              <Ban className="h-3 w-3" />
                              Banned
                            </Badge>
                          ) : (
                            <Badge variant="default" className="flex items-center gap-1 w-fit bg-green-100 text-green-800">
                              <CheckCircle className="h-3 w-3" />
                              Active
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-end">
                            <Select
                              value={user.role}
                              onValueChange={(value) => handleUpdateRole(user._id, value as 'user' | 'vet' | 'admin')}
                              disabled={processingUserId === user._id}
                            >
                              <SelectTrigger className="w-[110px] h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="user">User</SelectItem>
                                <SelectItem value="vet">Vet</SelectItem>
                                <SelectItem value="admin">Admin</SelectItem>
                              </SelectContent>
                            </Select>
                            <Button 
                              size="sm" 
                              variant={user.isBanned ? "outline" : "secondary"}
                              onClick={() => handleToggleBan(user._id, user.isBanned || false)}
                              disabled={processingUserId === user._id}
                              title={user.isBanned ? "Unban user" : "Ban user"}
                            >
                              {processingUserId === user._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Ban className="h-4 w-4" />
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={processingUserId === user._id}
                              title="Delete user permanently"
                            >
                              {processingUserId === user._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No users found</p>
              )}

              {/* Pagination */}
              {!isLoadingUsers && users.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Appointment Management
                  </CardTitle>
                  <CardDescription>
                    View and manage all appointments across the platform
                  </CardDescription>
                </div>
                <Button onClick={() => loadAppointments()} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by user, vet, or pet..."
                    value={appointmentSearchQuery}
                    onChange={(e) => {
                      setAppointmentSearchQuery(e.target.value);
                      setAppointmentCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={appointmentStatusFilter} onValueChange={(value) => {
                  setAppointmentStatusFilter(value);
                  setAppointmentCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                    <SelectItem value="no-show">No Show</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Appointments Table */}
              {isLoadingAppointments ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : appointments.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Pet</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Vet</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment) => (
                      <TableRow key={appointment.id}>
                        <TableCell className="font-medium">
                          {appointment.pet?.name || 'N/A'} ({appointment.pet?.species || ''})
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {appointment.user?.fullName || 'N/A'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {appointment.vet?.name || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(appointment.date).toLocaleDateString()}</div>
                            <div className="text-muted-foreground">
                              {appointment.time}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              appointment.status === 'confirmed' ? 'default' :
                              appointment.status === 'completed' ? 'secondary' :
                              appointment.status === 'cancelled' ? 'destructive' :
                              'outline'
                            }
                          >
                            {appointment.status.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No appointments found</p>
              )}

              {/* Pagination */}
              {!isLoadingAppointments && appointments.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {appointmentCurrentPage} of {appointmentTotalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAppointmentCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={appointmentCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setAppointmentCurrentPage(prev => Math.min(appointmentTotalPages, prev + 1))}
                      disabled={appointmentCurrentPage === appointmentTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Pet Management
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Manage pets registered in the system
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => loadPets()} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button size="sm" onClick={() => openPetDialog()}>
                    <Heart className="h-4 w-4 mr-2" />
                    Add Pet
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filter Bar */}
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, breed, or species..."
                    value={petSearchQuery}
                    onChange={(e) => {
                      setPetSearchQuery(e.target.value);
                      setPetCurrentPage(1);
                    }}
                    className="pl-10"
                  />
                </div>
                <Select value={petSpeciesFilter} onValueChange={(value) => {
                  setPetSpeciesFilter(value);
                  setPetCurrentPage(1);
                }}>
                  <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Species</SelectItem>
                    <SelectItem value="Dog">Dog</SelectItem>
                    <SelectItem value="Cat">Cat</SelectItem>
                    <SelectItem value="Bird">Bird</SelectItem>
                    <SelectItem value="Rabbit">Rabbit</SelectItem>
                    <SelectItem value="Hamster">Hamster</SelectItem>
                    <SelectItem value="Guinea Pig">Guinea Pig</SelectItem>
                    <SelectItem value="Fish">Fish</SelectItem>
                    <SelectItem value="Reptile">Reptile</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pets Table */}
              {isLoadingPets ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : pets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Species</TableHead>
                      <TableHead>Breed</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pets.map((pet) => (
                      <TableRow key={pet.id}>
                        <TableCell className="font-medium">{pet.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{pet.species}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{pet.breed}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {typeof pet.owner === 'object' ? pet.owner.fullName : 'Unknown'}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {pet.age ? `${pet.age} ${pet.ageUnit || 'years'}` : 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={pet.isActive ? 'default' : 'secondary'}
                            className={pet.isActive ? 'bg-green-100 text-green-800' : ''}
                          >
                            {pet.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => openPetDialog(pet)}>
                              View
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => openPetDialog(pet)}>
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant={pet.isActive ? 'secondary' : 'default'}
                              onClick={() => handleTogglePetStatus(pet.id)}
                            >
                              {pet.isActive ? 'Deactivate' : 'Activate'}
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleDeletePet(pet.id)}>
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No pets found</p>
                  <Button size="sm">
                    <Heart className="h-4 w-4 mr-2" />
                    Add First Pet
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {!isLoadingPets && pets.length > 0 && (
                <div className="flex items-center justify-between mt-6">
                  <p className="text-sm text-muted-foreground">
                    Page {petCurrentPage} of {petTotalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPetCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={petCurrentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPetCurrentPage(prev => Math.min(petTotalPages, prev + 1))}
                      disabled={petCurrentPage === petTotalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vets" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Veterinarian Management
                  </CardTitle>
                  <CardDescription>
                    Manage vet accounts and verification status
                  </CardDescription>
                </div>
                <Button onClick={() => loadVets()} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Vets Table */}
              {isLoadingVets ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : vets.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Clinic</TableHead>
                      <TableHead>License</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {vets.map((vet) => (
                      <TableRow key={vet.id}>
                        <TableCell className="font-medium">{vet.name}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{vet.email}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{vet.clinicName || 'N/A'}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{vet.licenseNumber || 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Badge 
                              variant={vet.verified ? 'default' : 'outline'}
                              className={vet.verified ? 'bg-green-100 text-green-800' : ''}
                            >
                              {vet.verified ? 'Verified' : 'Pending'}
                            </Badge>
                            <Badge 
                              variant={vet.active ? 'secondary' : 'destructive'}
                            >
                              {vet.active ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {!vet.verified && (
                              <Button 
                                size="sm" 
                                variant="default"
                                onClick={() => handleVerifyVet(vet.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              View Details
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p className="text-center text-muted-foreground py-8">No veterinarians found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Content Management
                  </CardTitle>
                  <CardDescription>
                    Manage articles, resources, and platform content
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => loadArticles()} variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </Button>
                  <Button size="sm">
                    <FileText className="h-4 w-4 mr-2" />
                    New Article
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Articles Table */}
              {isLoadingArticles ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : articles.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {articles.map((article) => (
                      <TableRow key={article.id}>
                        <TableCell className="font-medium max-w-xs truncate" title={article.title}>
                          {article.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {article.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {article.authorName || 'Unknown'}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={article.published ? 'default' : 'secondary'}
                            className={article.published ? 'bg-green-100 text-green-800' : ''}
                          >
                            {article.published ? 'Published' : 'Draft'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(article.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              Edit
                            </Button>
                            <Button 
                              size="sm" 
                              variant={article.published ? 'secondary' : 'default'}
                              onClick={() => handleToggleArticlePublish(article.id)}
                            >
                              {article.published ? 'Unpublish' : 'Publish'}
                            </Button>
                            <Button size="sm" variant="destructive">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No articles found</p>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    Create First Article
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Platform Overview
              </CardTitle>
              <CardDescription>
                Real-time statistics from the database
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-20 w-full" />
                </div>
              ) : stats ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground">User Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Total Users</span>
                        <span className="font-bold text-lg">{stats.totalUsers}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Active Users (30 days)</span>
                        <span className="font-bold text-lg">{stats.activeUsers || 0}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">New Users (Last 7 Days)</span>
                        <span className="font-bold text-lg">{typeof stats.recentUsers === 'number' ? stats.recentUsers : 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground">Platform Statistics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Total Vets</span>
                        <span className="font-bold text-lg">{stats.totalVets}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Total Pets</span>
                        <span className="font-bold text-lg">{stats.totalPets}</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm">Total Appointments</span>
                        <span className="font-bold text-lg">{stats.totalAppointments}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No analytics data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                System Information
              </CardTitle>
              <CardDescription>
                Platform status and information
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingStats ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : stats ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground">Database Statistics</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Total Users</span>
                          <span className="font-semibold">{stats.totalUsers}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Total Vets</span>
                          <span className="font-semibold">{stats.totalVets}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Total Pets</span>
                          <span className="font-semibold">{stats.totalPets}</span>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Total Appointments</span>
                          <span className="font-semibold">{stats.totalAppointments}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-sm text-muted-foreground">System Status</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">API Status</span>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Online
                          </Badge>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Database</span>
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Connected
                          </Badge>
                        </div>
                        <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm">Pending Appointments</span>
                          <span className="font-semibold">{stats.pendingAppointments || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No system data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Quick Actions
              </CardTitle>
              <CardDescription>
                Common administrative tasks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={() => loadStats()} variant="outline" className="justify-start">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Statistics
                </Button>
                <Button onClick={() => loadUsers()} variant="outline" className="justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  Reload User List
                </Button>
              </div>
              <div className="pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  For advanced settings and system configuration, please contact the system administrator.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Pet Form Dialog */}
      <Dialog open={isPetDialogOpen} onOpenChange={setIsPetDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5" />
              {editingPet ? 'Edit Pet' : 'Add New Pet'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handlePetFormSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pet-name">Pet Name *</Label>
                <Input
                  id="pet-name"
                  value={petFormData.name}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter pet name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet-species">Species *</Label>
                <Select value={petFormData.species} onValueChange={(value) => setPetFormData(prev => ({ ...prev, species: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select species" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dog">Dog</SelectItem>
                    <SelectItem value="Cat">Cat</SelectItem>
                    <SelectItem value="Bird">Bird</SelectItem>
                    <SelectItem value="Rabbit">Rabbit</SelectItem>
                    <SelectItem value="Hamster">Hamster</SelectItem>
                    <SelectItem value="Guinea Pig">Guinea Pig</SelectItem>
                    <SelectItem value="Fish">Fish</SelectItem>
                    <SelectItem value="Reptile">Reptile</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet-breed">Breed</Label>
                <Input
                  id="pet-breed"
                  value={petFormData.breed}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, breed: e.target.value }))}
                  placeholder="Enter breed (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet-age">Age</Label>
                <Input
                  id="pet-age"
                  value={petFormData.age}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="e.g., 3 years, 6 months, 2 weeks"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet-weight">Weight</Label>
                <Input
                  id="pet-weight"
                  value={petFormData.weight}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="e.g., 15 lbs, 7 kg, 200 grams"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet-gender">Gender</Label>
                <Select value={petFormData.gender} onValueChange={(value) => setPetFormData(prev => ({ ...prev, gender: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Unknown">Unknown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet-color">Color</Label>
                <Input
                  id="pet-color"
                  value={petFormData.color}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, color: e.target.value }))}
                  placeholder="e.g., Brown, White, Black & White"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet-owner">Owner ID *</Label>
                <Input
                  id="pet-owner"
                  value={petFormData.owner}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, owner: e.target.value }))}
                  placeholder="Enter owner user ID"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet-microchip">Microchip ID</Label>
                <Input
                  id="pet-microchip"
                  value={petFormData.microchipId}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, microchipId: e.target.value }))}
                  placeholder="Enter microchip ID (optional)"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet-birthdate">Date of Birth</Label>
                <Input
                  id="pet-birthdate"
                  type="date"
                  value={petFormData.dateOfBirth}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, dateOfBirth: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pet-photo">Photo URL</Label>
                <Input
                  id="pet-photo"
                  value={petFormData.photoUrl}
                  onChange={(e) => setPetFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                  placeholder="Enter photo URL (optional)"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pet-allergies">Allergies</Label>
              <Textarea
                id="pet-allergies"
                value={petFormData.allergies}
                onChange={(e) => setPetFormData(prev => ({ ...prev, allergies: e.target.value }))}
                placeholder="Enter allergies separated by commas (e.g., Chicken, Beef, Dairy)"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pet-medications">Medications</Label>
              <Textarea
                id="pet-medications"
                value={petFormData.medications}
                onChange={(e) => setPetFormData(prev => ({ ...prev, medications: e.target.value }))}
                placeholder="Enter medications (e.g., Heartworm prevention, Flea treatment)"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pet-special-needs">Special Needs</Label>
              <Textarea
                id="pet-special-needs"
                value={petFormData.specialNeeds}
                onChange={(e) => setPetFormData(prev => ({ ...prev, specialNeeds: e.target.value }))}
                placeholder="Enter any special needs or care instructions"
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closePetDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingPet ? 'Update Pet' : 'Create Pet'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminDashboard;
