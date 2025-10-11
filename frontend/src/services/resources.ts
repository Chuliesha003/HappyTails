import api, { handleApiError, type ApiResponse } from '@/lib/api';
import type { Article, CreateArticleRequest, PaginationParams } from '@/types/api';

// Backend DTOs (subset) to type responses without using any
type ApiUserRef = { fullName?: string; email?: string } | string | null | undefined;
type ApiArticle = {
  _id?: string;
  id?: string;
  slug?: string;
  title: string;
  content: string;
  category: Article['category'];
  author?: ApiUserRef;
  authorName?: string;
  imageUrl?: string;
  images?: string[];
  tags?: string[];
  isPublished?: boolean;
  published?: boolean;
  createdAt?: string;
  updatedAt?: string;
};
type ApiArticlesResponse = ApiResponse<ApiArticle[]> & { pagination?: unknown };
type ApiArticleResponse = ApiResponse<ApiArticle>;

// Normalize backend article to frontend Article shape
const mapApiArticle = (a: ApiArticle): Article => {
  let authorStr = '';
  if (typeof a.author === 'string') authorStr = a.author;
  else if (a.author && typeof a.author === 'object') authorStr = a.author.fullName || a.author.email || '';
  else authorStr = a.authorName || '';

  return {
    id: a.id || a._id || a.slug,
    title: a.title,
    content: a.content,
    category: a.category,
    author: authorStr,
  authorName: a.authorName || authorStr,
  imageUrl: a.imageUrl,
  images: a.images || [],
    tags: a.tags || [],
    published: typeof a.published === 'boolean' ? a.published : !!a.isPublished,
    createdAt: a.createdAt,
    updatedAt: a.updatedAt,
  };
};

// Resources Service
export const resourcesService = {
  /**
   * Get all articles with optional pagination and filters
   */
  getAllArticles: async (params?: PaginationParams & { category?: string; search?: string }): Promise<ApiResponse<Article[]> & { pagination?: unknown }> => {
    try {
      const response = await api.get<ApiArticlesResponse>(
        '/resources',
        params as Record<string, unknown>
      );
      return {
        ...response,
        data: (response.data || []).map(mapApiArticle),
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single article by ID
   */
  getArticleById: async (id: string): Promise<Article> => {
    try {
      const response = await api.get<ApiArticleResponse>(`/resources/${id}`);
      return mapApiArticle(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get articles by category
   */
  getArticlesByCategory: async (category: string, params?: PaginationParams): Promise<Article[]> => {
    try {
      const response = await api.get<ApiArticlesResponse>(`/resources/category/${category}`, params as Record<string, unknown>);
      return (response.data || []).map(mapApiArticle);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Search articles
   */
  searchArticles: async (query: string, params?: PaginationParams): Promise<Article[]> => {
    try {
      const response = await api.get<ApiArticlesResponse>(
        '/resources',
        { search: query, ...(params || {}) } as Record<string, unknown>
      );
      return (response.data || []).map(mapApiArticle);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new article (admin only)
   */
  createArticle: async (data: CreateArticleRequest): Promise<Article> => {
    try {
      const response = await api.post<ApiArticleResponse>('/resources', data);
      return mapApiArticle(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an article (admin only)
   */
  updateArticle: async (id: string, data: Partial<CreateArticleRequest>): Promise<Article> => {
    try {
  const response = await api.put<ApiArticleResponse>(`/resources/${id}`, data);
      return mapApiArticle(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete an article (admin only)
   */
  deleteArticle: async (id: string): Promise<void> => {
    try {
      await api.delete(`/resources/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Publish/unpublish an article (admin only)
   */
  togglePublishArticle: async (id: string, _published: boolean): Promise<Article> => {
    try {
      const response = await api.patch<ApiArticleResponse>(
        `/resources/${id}/publish`,
        {}
      );
      return mapApiArticle(response.data);
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default resourcesService;
