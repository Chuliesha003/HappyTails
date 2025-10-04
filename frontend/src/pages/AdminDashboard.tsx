import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Activity, Settings, Database, TrendingUp, Shield, FileText, AlertTriangle, Calendar, BarChart3, Clock, Globe, Loader2, CheckCircle, XCircle, Ban, Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { adminService } from "@/services/admin";
import { toast } from "@/hooks/use-toast";
import type { User, AdminStats } from "@/types/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [processingUserId, setProcessingUserId] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
    loadUsers();
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

  const loadUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const data = await adminService.getAllUsers({ limit: 100 });
      setUsers(data.users);
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
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System Status</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Recent User Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Registered</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">{user.email}</TableCell>
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
                          <div className="flex gap-2">
                            <select
                              value={user.role}
                              onChange={(e) => handleUpdateRole(user._id, e.target.value as 'user' | 'vet' | 'admin')}
                              disabled={processingUserId === user._id}
                              className="text-sm border rounded px-2 py-1 disabled:opacity-50"
                            >
                              <option value="user">User</option>
                              <option value="vet">Vet</option>
                              <option value="admin">Admin</option>
                            </select>
                            <Button 
                              size="sm" 
                              variant={user.isBanned ? "outline" : "secondary"}
                              onClick={() => handleToggleBan(user._id, user.isBanned)}
                              disabled={processingUserId === user._id}
                            >
                              {processingUserId === user._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : user.isBanned ? (
                                "Unban"
                              ) : (
                                "Ban"
                              )}
                            </Button>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => handleDeleteUser(user._id)}
                              disabled={processingUserId === user._id}
                            >
                              {processingUserId === user._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                "Delete"
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Usage Statistics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span>Symptom Checker Uses</span>
                  <span className="font-bold">2,847</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Vet Searches</span>
                  <span className="font-bold">1,234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Pet Records Created</span>
                  <span className="font-bold">892</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Appointments Booked</span>
                  <span className="font-bold">445</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Growth Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>User Growth</span>
                    <span className="text-green-600">+12.5%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Feature Usage</span>
                    <span className="text-blue-600">+8.3%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Retention Rate</span>
                    <span className="text-purple-600">89.2%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '89%' }}></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Peak Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-pink-600">2-4 PM</div>
                  <div className="text-sm text-muted-foreground">Highest Activity</div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Morning (6-12)</span>
                    <span>245 users</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Afternoon (12-6)</span>
                    <span>467 users</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Evening (6-12)</span>
                    <span>312 users</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Night (12-6)</span>
                    <span>89 users</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New user registration</p>
                  <p className="text-xs text-muted-foreground">sarah.jones@email.com joined the platform</p>
                  <p className="text-xs text-muted-foreground">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Appointment booked</p>
                  <p className="text-xs text-muted-foreground">mike.wilson@gmail.com scheduled appointment for Buddy</p>
                  <p className="text-xs text-muted-foreground">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Symptom check completed</p>
                  <p className="text-xs text-muted-foreground">Guest user analyzed symptoms for digestive issues</p>
                  <p className="text-xs text-muted-foreground">8 minutes ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Pet profile updated</p>
                  <p className="text-xs text-muted-foreground">pet.lover@test.com updated Luna's vaccination records</p>
                  <p className="text-xs text-muted-foreground">12 minutes ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                System Alerts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground py-8">
                No active system alerts
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span>Connection Status</span>
                  <Badge className="bg-green-100 text-green-800">Healthy</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Storage Usage</span>
                  <span>68% (3.2GB)</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Backup</span>
                  <span>2 hours ago</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  System Logs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="p-2 bg-gray-50 rounded text-xs font-mono">
                  [INFO] User login: admin@happytails.com
                </div>
                <div className="p-2 bg-gray-50 rounded text-xs font-mono">
                  [INFO] Appointment booked: #A1234
                </div>
                <div className="p-2 bg-gray-50 rounded text-xs font-mono">
                  [INFO] Symptom checker used: Guest user
                </div>
                <Button variant="outline" size="sm" className="mt-2">
                  View Full Logs
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold">User Management</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Auto-approve new users</span>
                      <Button size="sm" variant="outline">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Require email verification</span>
                      <Button size="sm" variant="outline">Enabled</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Guest usage limit</span>
                      <Button size="sm" variant="outline">2 uses</Button>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="font-semibold">System Features</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>Symptom checker AI</span>
                      <Button size="sm" variant="outline">Active</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Appointment booking</span>
                      <Button size="sm" variant="outline">Active</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Maintenance mode</span>
                      <Button size="sm" variant="outline">Disabled</Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t">
                <Button className="bg-pink-500 hover:bg-pink-600">Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
