import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PetRecords = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
      <Helmet>
        <title>Pet Profile & Health Records – HappyTails</title>
        <meta name="description" content="View pet details, vaccination status, uploaded documents, and health reminders." />
        <link rel="canonical" href="/pet-records" />
      </Helmet>

      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Pet Profile & Health Records</h1>
        <p className="text-muted-foreground">All your companion’s information—organized and accessible.</p>
      </header>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Pet Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback>LM</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">Luna</p>
                <p className="text-sm text-muted-foreground">Cat • 3 years • F</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Breed</span><span className="text-muted-foreground">British Shorthair</span></div>
              <div className="flex justify-between"><span>Weight</span><span className="text-muted-foreground">4.1 kg</span></div>
              <div className="flex justify-between"><span>Microchip</span><span className="text-muted-foreground">Yes</span></div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Vaccinations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Rabies</span><Badge variant="secondary">Up to date</Badge></div>
            <div className="flex items-center justify-between"><span>FVRCP</span><Badge variant="secondary">Up to date</Badge></div>
            <div className="flex items-center justify-between"><span>FeLV</span><Badge variant="secondary">Due in 2 months</Badge></div>
          </CardContent>
        </Card>

        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Documents</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span>Last vet visit.pdf</span><Button size="sm" variant="outline">View</Button></div>
            <div className="flex items-center justify-between"><span>Vaccination record.pdf</span><Button size="sm" variant="outline">View</Button></div>
            <div className="flex items-center justify-between"><span>Insurance policy.pdf</span><Button size="sm" variant="outline">View</Button></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reminders</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 text-sm">
          <div className="rounded-md border p-4">Annual wellness check • <span className="text-muted-foreground">in 3 weeks</span></div>
          <div className="rounded-md border p-4">Flea/Tick preventive • <span className="text-muted-foreground">due next week</span></div>
          <div className="rounded-md border p-4">Dental cleaning • <span className="text-muted-foreground">overdue</span></div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PetRecords;
