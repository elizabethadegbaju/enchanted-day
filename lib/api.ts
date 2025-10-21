import { Wedding, Vendor, Guest } from '@/types';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
  count?: number;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    }

  async setAuthToken(token: string) {
    this.token = token;
  }

  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Add any additional headers from options
    if (options.headers) {
      const additionalHeaders = options.headers as Record<string, string>;
      Object.assign(headers, additionalHeaders);
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        const apiError: ApiError = {
          code: data.code || 'API_ERROR',
          message: data.error || data.message || `HTTP error! status: ${response.status}`,
          details: data.details
        };

        return {
          success: false,
          error: apiError
        };
      }

      return {
        success: true,
        data: data.data,
        count: data.count
      };
    } catch (error) {
      console.error('API request failed:', error);
      
      // Check if it's an auth-related error
      if (error instanceof Error && 
          (error.message.includes('Authentication') || 
           error.message.includes('Unauthorized'))) {
        this.redirectToLogin();
      }
      
      const apiError: ApiError = {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network request failed'
      };

      return {
        success: false,
        error: apiError
      };
    }
  }

  private redirectToLogin(): void {
    // Clear any stored tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('idToken');
    localStorage.removeItem('refreshToken');
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  }

  // Public method for direct API access
  async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, options)
  }

  // Wedding endpoints
  async getWeddings(): Promise<Wedding[]> {
    const response = await this.request<Wedding[]>('/weddings');
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch weddings');
    }
    return response.data || [];
  }

  async getWedding(id: string): Promise<Wedding> {
    const response = await this.request<Wedding>(`/weddings/${id}`);
    if (!response.success) {
      throw new Error(response.error?.message || 'Failed to fetch wedding');
    }
    if (!response.data) {
      throw new Error('Wedding not found');
    }
    return response.data;
  }

  async createWedding(wedding: Partial<Wedding>): Promise<Wedding> {
    const response = await this.request<Wedding>('/weddings', {
      method: 'POST',
      body: JSON.stringify(wedding),
    });
    if (!response.data) {
      throw new Error('Failed to create wedding');
    }
    return response.data;
  }

  async updateWedding(id: string, updates: Partial<Wedding>): Promise<Wedding> {
    const response = await this.request<Wedding>(`/weddings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!response.data) {
      throw new Error('Failed to update wedding');
    }
    return response.data;
  }

  async deleteWedding(id: string): Promise<void> {
    await this.request(`/weddings/${id}`, {
      method: 'DELETE',
    });
  }

  async getWeddingDashboard(id: string): Promise<Record<string, unknown>> {

    
    const response = await this.request<Record<string, unknown>>(`/weddings/${id}/dashboard`);
    
    if (!response.success) {
      console.error('Dashboard API failed:', response.error);
      throw new Error(response.error?.message || 'Failed to fetch wedding dashboard');
    }
    
    return response.data || {};
  }

  async chatWithAI(weddingId: string, message: string): Promise<Record<string, unknown>> {
    const response = await this.request<Record<string, unknown>>(`/weddings/${weddingId}/ai-chat`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
    return response.data || {};
  }

  async streamChatWithAI(weddingId: string, message: string): Promise<ReadableStream<Uint8Array>> {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    const response = await fetch(`${this.baseURL}/weddings/${weddingId}/ai-chat/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body for streaming');
    }

    return response.body;
  }

  // Vendor endpoints
  async getVendors(weddingId: string): Promise<Vendor[]> {
    const response = await this.request<Vendor[]>(`/weddings/${weddingId}/vendors`);
    return response.data || [];
  }

  async getVendor(id: string): Promise<Vendor> {
    const response = await this.request<Vendor>(`/vendors/${id}`);
    if (!response.data) {
      throw new Error('Vendor not found');
    }
    return response.data;
  }

  async createVendor(weddingId: string, vendor: Partial<Vendor>): Promise<Vendor> {
    const response = await this.request<Vendor>(`/weddings/${weddingId}/vendors`, {
      method: 'POST',
      body: JSON.stringify(vendor),
    });
    if (!response.data) {
      throw new Error('Failed to create vendor');
    }
    return response.data;
  }

  async updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor> {
    const response = await this.request<Vendor>(`/vendors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!response.data) {
      throw new Error('Failed to update vendor');
    }
    return response.data;
  }

  async deleteVendor(id: string): Promise<void> {
    await this.request(`/vendors/${id}`, {
      method: 'DELETE',
    });
  }

  async searchVendors(criteria: {
    category?: string;
    location?: string;
    budget?: number;
    rating?: number;
  }): Promise<Vendor[]> {
    const response = await this.request<Vendor[]>('/vendors/search', {
      method: 'POST',
      body: JSON.stringify(criteria),
    });
    return response.data || [];
  }

  // Guest endpoints
  async getGuests(weddingId: string): Promise<Guest[]> {
    const response = await this.request<Guest[]>(`/weddings/${weddingId}/guests`);
    return response.data || [];
  }

  async getGuest(id: string): Promise<Guest> {
    const response = await this.request<Guest>(`/guests/${id}`);
    if (!response.data) {
      throw new Error('Guest not found');
    }
    return response.data;
  }

  async createGuest(weddingId: string, guest: Partial<Guest>): Promise<Guest> {
    const response = await this.request<Guest>(`/weddings/${weddingId}/guests`, {
      method: 'POST',
      body: JSON.stringify(guest),
    });
    if (!response.data) {
      throw new Error('Failed to create guest');
    }
    return response.data;
  }

  async updateGuest(id: string, updates: Partial<Guest>): Promise<Guest> {
    const response = await this.request<Guest>(`/guests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    if (!response.data) {
      throw new Error('Failed to update guest');
    }
    return response.data;
  }

  async deleteGuest(id: string): Promise<void> {
    await this.request(`/guests/${id}`, {
      method: 'DELETE',
    });
  }

  async updateRSVP(guestId: string, rsvpData: {
    rsvpStatus: 'pending' | 'accepted' | 'declined';
    dietaryRestrictions?: string;
    plusOne?: boolean;
  }): Promise<Guest> {
    const response = await this.request<Guest>(`/guests/${guestId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    });
    if (!response.data) {
      throw new Error('Failed to update RSVP');
    }
    return response.data;
  }

  // Media endpoints
  async getMediaAssets(weddingId: string): Promise<Record<string, unknown>[]> {
    const response = await this.request<Record<string, unknown>[]>(`/weddings/${weddingId}/media`);
    return response.data || [];
  }

  async uploadMedia(weddingId: string, mediaData: Record<string, unknown>): Promise<Record<string, unknown>> {
    const response = await this.request<Record<string, unknown>>(`/weddings/${weddingId}/media/upload`, {
      method: 'POST',
      body: JSON.stringify(mediaData),
    });
    return response.data || {};
  }

  async deleteMedia(id: string): Promise<void> {
    await this.request(`/media/${id}`, {
      method: 'DELETE',
    });
  }

  async getPresignedUrl(id: string): Promise<{ url: string; expiresIn: number }> {
    const response = await this.request<{ url: string; expiresIn: number }>(`/media/${id}/presigned-url`);
    if (!response.data) {
      throw new Error('Failed to get presigned URL');
    }
    return response.data;
  }
}

export const apiClient = new ApiClient(API_BASE_URL || '');
export default apiClient;

// Utility function to parse streaming JSON responses
export function parseStreamingResponse(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<Record<string, unknown>, void, unknown> {
  return (async function* () {
    const decoder = new TextDecoder();
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              yield JSON.parse(data);
            } catch (e) {
              console.warn('Failed to parse streaming data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  })();
}

// Utility for parsing Strands streaming responses
export function parseStrandsStream(reader: ReadableStreamDefaultReader<Uint8Array>): AsyncGenerator<StreamingWorkflowChunk, void, unknown> {
  return (async function* () {
    const decoder = new TextDecoder();
    let buffer = '';
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const data = trimmed.slice(6);
            if (data === '[DONE]') {
              return;
            }
            try {
              yield JSON.parse(data) as StreamingWorkflowChunk;
            } catch (e) {
              console.warn('Failed to parse Strands streaming data:', data);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  })();
}