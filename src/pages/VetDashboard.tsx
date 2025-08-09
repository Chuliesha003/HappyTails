import { Helmet } from "react-helmet-async";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const VetDashboard = () => {
  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Profile saved", description: "Your clinic profile has been updated." });
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
      <Helmet>
        <title>Veterinary Dashboard – HappyTails</title>
        <meta name="description" content="Manage appointments, view pet records, and edit your clinic profile." />
        <link rel="canonical" href="/vet-dashboard" />
      </Helmet>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Clinic Dashboard</h1>
        <p className="text-muted-foreground">Stay organized and deliver great care.</p>
      </header>

      <Tabs defaultValue="appointments" className="space-y-6">
        <TabsList>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="records">Pet Records</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="appointments" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Upcoming</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pet</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Luna (Cat)</TableCell>
                    <TableCell>Alex M.</TableCell>
                    <TableCell>Fri 10:00</TableCell>
                    <TableCell>Annual Checkup</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Rex (Dog)</TableCell>
                    <TableCell>Sam P.</TableCell>
                    <TableCell>Mon 14:15</TableCell>
                    <TableCell>Vaccination</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Recent Records</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
              <div className="rounded-md border p-4">Rex • Surgery notes uploaded</div>
              <div className="rounded-md border p-4">Luna • Blood test results updated</div>
              <div className="rounded-md border p-4">Milo • Vaccination added</div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader><CardTitle>Clinic Profile</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={onSave} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Clinic Name</label>
                  <Input defaultValue="Paws & Care Clinic" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input defaultValue="(555) 123-TAIL" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input defaultValue="123 Meadow St" />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" variant="brand">Save Changes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VetDashboard;
