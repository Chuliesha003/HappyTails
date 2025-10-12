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
import ArticleModal from "@/components/ArticleModal";
import type { Article } from "@/types/api";
import { resolveArticleImage } from '@/lib/assets';

const FALLBACK_DATA_URI =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
       <rect width='100%' height='100%' fill='#f3f4f6'/>
       <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle'
             font-family='Inter,system-ui,sans-serif' font-size='28' fill='#9ca3af'>
         Image unavailable
       </text>
     </svg>`
  );

function SafeImg({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      // ❗ prevent endless onError loops
      onError={(e) => {
        const img = e.currentTarget as HTMLImageElement;
        if (img.dataset.fallbackApplied === 'true') return;
        img.dataset.fallbackApplied = 'true';
        img.src = FALLBACK_DATA_URI;       // guaranteed to load
      }}
      // Optional: ensure the browser doesn't block it for CORS
      crossOrigin="anonymous"
      referrerPolicy="no-referrer"
    />
  );
}

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
        <h1 className="text-4xl font-bold text-gray-900">Pet Care Articles</h1>
        <p className="text-gray-600">Comprehensive resources for pet health and wellness.</p>
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredArticles.map((article) => {
              const imgSrc = article.imageUrl
                ? resolveArticleImage(article.imageUrl)
                : resolveArticleImage(`${article.category}-${(article.id || article.title || '1').toString().length % 8 + 1}.jpg`);

              return (
                <article key={article.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                  <div className="w-full h-48 bg-gray-100 overflow-hidden">
                    <SafeImg
                      src={imgSrc}
                      alt={article.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{article.category}</span>
                    {article.published && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Published
                      </span>
                    )}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">{article.title}</h2>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.content.substring(0, 220)}...
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>By {article.authorName || article.author}</span>
                    <span>{formatDate(article.createdAt)}</span>
                  </div>
                  <button
                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium py-2 px-4 rounded-md transition-colors duration-200"
                    onClick={async () => {
                      try {
                        setIsArticleModalOpen(true);
                        const full = await resourcesService.getArticleById(article.id);
                        setOpenArticle(full);
                      } catch (err) {
                        console.error('Failed to load article:', err);
                        toast({ title: 'Error', description: 'Failed to load article. Please try again.', variant: 'destructive' });
                        setIsArticleModalOpen(false);
                      }
                    }}
                  >
                    Read Full Article
                  </button>
                  {isAdmin() && (
                    <div className="flex gap-2 mt-3">
                      <ArticleForm
                        article={article}
                        onSuccess={loadArticles}
                        trigger={
                          <button className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-1 px-3 rounded text-sm transition-colors">
                            Edit
                          </button>
                        }
                      />
                      <button
                        className={`flex-1 font-medium py-1 px-3 rounded text-sm transition-colors ${article.published ? "bg-orange-50 hover:bg-orange-100 text-orange-700" : "bg-green-50 hover:bg-green-100 text-green-700"}`}
                        onClick={() => handleTogglePublish(article.id, article.published)}
                      >
                        {article.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-700 font-medium py-1 px-3 rounded text-sm transition-colors"
                        onClick={() => handleDeleteArticle(article.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
              );
            })}
          </div>
        )}
      </Tabs>
    </div>
  );
};

export default Resources;
