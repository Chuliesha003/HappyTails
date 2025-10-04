import api, { handleApiError } from '@/lib/api';
import type { Article, CreateArticleRequest, PaginationParams, PaginatedResponse } from '@/types/api';

// Resources Service
export const resourcesService = {
  /**
   * Get all articles with optional pagination and filters
   */
  getAllArticles: async (params?: PaginationParams & { category?: string; search?: string }): Promise<PaginatedResponse<Article>> => {
    try {
      const response = await api.get<PaginatedResponse<Article>>('/resources/articles', params as Record<string, unknown>);
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get a single article by ID
   */
  getArticleById: async (id: string): Promise<Article> => {
    try {
      const response = await api.get<{ article: Article }>(`/resources/articles/${id}`);
      return response.article;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get articles by category
   */
  getArticlesByCategory: async (category: string, params?: PaginationParams): Promise<Article[]> => {
    try {
      const response = await api.get<{ articles: Article[] }>(
        `/resources/articles/category/${category}`,
        params as Record<string, unknown>
      );
      return response.articles;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Search articles
   */
  searchArticles: async (query: string, params?: PaginationParams): Promise<Article[]> => {
    try {
      const response = await api.get<{ articles: Article[] }>(
        '/resources/articles/search',
        { q: query, ...params } as Record<string, unknown>
      );
      return response.articles;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Create a new article (admin only)
   */
  createArticle: async (data: CreateArticleRequest): Promise<Article> => {
    try {
      const response = await api.post<{ article: Article }>('/resources/articles', data);
      return response.article;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Update an article (admin only)
   */
  updateArticle: async (id: string, data: Partial<CreateArticleRequest>): Promise<Article> => {
    try {
      const response = await api.put<{ article: Article }>(`/resources/articles/${id}`, data);
      return response.article;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Delete an article (admin only)
   */
  deleteArticle: async (id: string): Promise<void> => {
    try {
      await api.delete(`/resources/articles/${id}`);
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Publish/unpublish an article (admin only)
   */
  togglePublishArticle: async (id: string, published: boolean): Promise<Article> => {
    try {
      const response = await api.patch<{ article: Article }>(
        `/resources/articles/${id}/publish`,
        { published }
      );
      return response.article;
    } catch (error) {
      throw handleApiError(error);
    }
  },
};

export default resourcesService;
