import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Search, BookOpen, AlertCircle, Calendar, User } from "lucide-react";
import { resourcesService } from "@/services/resources";
import { toast } from "@/hooks/use-toast";
import type { Article } from "@/types/api";

const Resources = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    loadArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [articles, searchTerm, selectedCategory]);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await resourcesService.getAllArticles({ limit: 100 });
      setArticles(response.data);
    } catch (error) {
      console.error('Failed to load articles:', error);
      setError('Failed to load articles. Please try again.');
      toast({
        title: "Error",
        description: "Failed to load articles. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredArticles(filtered);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const categories = ["all", ...new Set(articles.map(a => a.category))];

  return (
    <div className="container mx-auto px-4 md:px-6 py-10 space-y-8">
      <Helmet>
        <title>Learning Resources – HappyTails</title>
        <meta name="description" content="Browse articles and videos on nutrition and common diseases for pets." />
        <link rel="canonical" href="/resources" />
      </Helmet>

      <header className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Learning Resources</h1>
        <p className="text-muted-foreground">Friendly, vetted content to keep your companions healthy and happy.</p>
      </header>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
        <TabsList className="flex-wrap h-auto">
          {categories.map(category => (
            <TabsTrigger key={category} value={category} className="capitalize">
              {category === "all" ? "All Articles" : category}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Error State */}
        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6 pb-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-10 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try adjusting your search terms" : "No articles available in this category yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => (
              <Card key={article.id} className="flex flex-col hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge className="capitalize">{article.category}</Badge>
                    {article.published && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Published
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {article.content.substring(0, 150)}...
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 mt-auto">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="w-full">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read More
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Resources;
