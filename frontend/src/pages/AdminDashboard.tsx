import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Activity, Settings, Database, TrendingUp, Shield, FileText, AlertTriangle, Calendar, BarChart3, Clock, Globe, Loader2, CheckCircle, XCircle, Ban, Heart, Search, Trash2, UserCog, RefreshCw } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadUsers();
  }, [currentPage, roleFilter, searchQuery]);

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
      const params: any = { 
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
    </div>
  );
};

export default AdminDashboard;
