import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Activity, Settings, Database, TrendingUp, Shield, FileText, AlertTriangle, Calendar, BarChart3, Clock, Globe } from "lucide-react";

const AdminDashboard = () => {
  const systemStats = {
    totalUsers: 1247,
    activeUsers: 892,
    newRegistrations: 23,
    totalAppointments: 3429,
    todayAppointments: 47,
    guestUsage: 156,
    systemUptime: '99.8%'
  };

  const recentUsers = [
    { id: 1, email: "sarah.johnson@email.com", role: "Registered", joinDate: "2024-01-15", status: "Active", pets: 2, lastLogin: "2 hours ago" },
    { id: 2, email: "mike.wilson@gmail.com", role: "Registered", joinDate: "2024-01-14", status: "Active", pets: 1, lastLogin: "1 day ago" },
    { id: 3, email: "emma.davis@example.com", role: "Registered", joinDate: "2024-01-13", status: "Pending", pets: 0, lastLogin: "Never" },
    { id: 4, email: "pet.lover@test.com", role: "Registered", joinDate: "2024-01-12", status: "Active", pets: 3, lastLogin: "5 hours ago" }
  ];

  const systemAlerts = [
    { type: "warning", message: "High server load detected", time: "2 hours ago" },
    { type: "info", message: "New vet registration pending approval", time: "4 hours ago" },
    { type: "success", message: "Backup completed successfully", time: "6 hours ago" }
  ];

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
        <Card>
          <CardContent className="flex items-center p-6">
            <Users className="h-8 w-8 text-blue-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Total Users</p>
              <p className="text-2xl font-bold">{systemStats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600">+{systemStats.newRegistrations} this week</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Activity className="h-8 w-8 text-green-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Active Users</p>
              <p className="text-2xl font-bold">{systemStats.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Calendar className="h-8 w-8 text-purple-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">Appointments</p>
              <p className="text-2xl font-bold">{systemStats.totalAppointments.toLocaleString()}</p>
              <p className="text-xs text-blue-600">{systemStats.todayAppointments} today</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center p-6">
            <Globe className="h-8 w-8 text-pink-500" />
            <div className="ml-4">
              <p className="text-sm font-medium text-muted-foreground">System Uptime</p>
              <p className="text-2xl font-bold">{systemStats.systemUptime}</p>
              <p className="text-xs text-green-600">Last 30 days</p>
            </div>
          </CardContent>
        </Card>
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Pets</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.role === 'Admin' ? 'default' : 'secondary'}
                          className={user.role === 'Admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{user.pets} pets</span>
                      </TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">{user.lastLogin}</span>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'Active' ? 'default' : 'secondary'}
                          className={user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">View</Button>
                          {user.status === 'Pending' && (
                            <Button size="sm" variant="default">Approve</Button>
                          )}
                          <Button size="sm" variant="outline">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
              {systemAlerts.map((alert, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-3 p-4 rounded-lg border ${
                    alert.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                    alert.type === 'info' ? 'bg-blue-50 border-blue-200' :
                    'bg-green-50 border-green-200'
                  }`}
                >
                  <div className={`p-2 rounded-full ${
                    alert.type === 'warning' ? 'bg-yellow-500' :
                    alert.type === 'info' ? 'bg-blue-500' :
                    'bg-green-500'
                  }`}>
                    <AlertTriangle className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
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
