import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect, useCallback } from "react";
import { Search, BookOpen, AlertCircle, Calendar, User, Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { resourcesService } from "@/services/resources";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ArticleForm from "@/components/ArticleForm";
import type { Article } from "@/types/api";
import ArticleModal from "@/components/ArticleModal";

const Resources = () => {
  const { user, isAdmin } = useAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [openArticle, setOpenArticle] = useState<Article | null>(null);
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);

  useEffect(() => {
    loadArticles();
  }, []);

  const filterArticles = useCallback(() => {
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
  }, [articles, searchTerm, selectedCategory]);

  useEffect(() => {
    filterArticles();
  }, [filterArticles]);

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

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recently";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Admin functions
  const handleDeleteArticle = async (articleId: string) => {
    if (!window.confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    try {
      await resourcesService.deleteArticle(articleId);
      setArticles(prev => prev.filter(article => article.id !== articleId));
      toast({
        title: "Success",
        description: "Article deleted successfully.",
      });
    } catch (error) {
      console.error('Failed to delete article:', error);
      toast({
        title: "Error",
        description: "Failed to delete article. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleTogglePublish = async (articleId: string, currentlyPublished: boolean) => {
    try {
      const updated = await resourcesService.togglePublishArticle(articleId, !currentlyPublished);
      setArticles(prev => prev.map(article => (article.id === articleId ? updated : article)));
      toast({
        title: "Success",
        description: `Article ${!currentlyPublished ? 'published' : 'unpublished'} successfully.`,
      });
    } catch (error) {
      console.error('Failed to toggle publish status:', error);
      toast({
        title: "Error",
        description: "Failed to update article status. Please try again.",
        variant: "destructive"
      });
    }
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
        {isAdmin() && (
          <div className="flex justify-center mt-4">
            <ArticleForm onSuccess={loadArticles} />
          </div>
        )}
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
                  {(article.images && article.images.length > 0) || article.imageUrl ? (
                    <div className="w-full h-40 mb-3 overflow-hidden rounded-md">
                      <img src={article.images && article.images.length > 0 ? article.images[0] : article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
                    </div>
                  ) : null}

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {article.content.substring(0, 220)}...
                  </p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4 mt-auto">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{article.authorName || article.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(article.createdAt)}</span>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={async () => {
                      try {
                        setIsArticleModalOpen(true);
                        // fetch full article (images, full content)
                        const full = await resourcesService.getArticleById(article.id);
                        setOpenArticle(full);
                      } catch (err) {
                        console.error('Failed to load article:', err);
                        toast({ title: 'Error', description: 'Failed to load article. Please try again.', variant: 'destructive' });
                        setIsArticleModalOpen(false);
                      }
                    }}
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read More
                  </Button>

                  {isAdmin() && (
                    <div className="flex gap-2 mt-3">
                      <ArticleForm
                        article={article}
                        onSuccess={loadArticles}
                        trigger={
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        }
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTogglePublish(article.id, article.published)}
                        className={article.published ? "text-orange-600" : "text-green-600"}
                      >
                        {article.published ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteArticle(article.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
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
