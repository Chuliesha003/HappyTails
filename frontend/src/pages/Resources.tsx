import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

const articles = {
  nutrition: [
    { title: "Balanced Diets for Puppies & Kittens", type: "Article" },
    { title: "Hydration & Summer Heat Tips", type: "Video" },
  ],
  training: [
    { title: "Gentle Crate Training Basics", type: "Article" },
    { title: "Clicker Training 101", type: "Video" },
  ],
  diseases: [
    { title: "Recognizing Parvovirus Early", type: "Article" },
    { title: "Diabetes in Cats – Owner’s Guide", type: "Article" },
  ],
};

const ResourceList = ({ items }: { items: { title: string; type: string }[] }) => (
  <div className="grid gap-4 md:grid-cols-2">
    {items.map((it) => (
      <Card key={it.title}>
        <CardHeader>
          <CardTitle className="text-base">{it.title}</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{it.type}</span>
          <Button variant="brand" size="sm">Open</Button>
        </CardContent>
      </Card>
    ))}
  </div>
);

const Resources = () => {
  return (
    <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
      <Helmet>
        <title>Learning Resources – HappyTails</title>
        <meta name="description" content="Browse articles and videos on nutrition, training, and common diseases for pets." />
        <link rel="canonical" href="/resources" />
      </Helmet>

      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Learning Resources</h1>
        <p className="text-muted-foreground">Friendly, vetted content to keep your companions healthy and happy.</p>
      </header>

      <Tabs defaultValue="nutrition" className="space-y-6">
        <TabsList>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="training">Training</TabsTrigger>
          <TabsTrigger value="diseases">Diseases</TabsTrigger>
        </TabsList>
        <TabsContent value="nutrition">
          <ResourceList items={articles.nutrition} />
        </TabsContent>
        <TabsContent value="training">
          <ResourceList items={articles.training} />
        </TabsContent>
        <TabsContent value="diseases">
          <ResourceList items={articles.diseases} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
