import { Wedding } from '@/types/wedding';
import { Vendor } from '@/types/vendor';
import { Guest } from '@/types/guest';
import { CognitoAuth } from '@/lib/cognito-auth';

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

export interface StreamingChatResponse {
  type: 'start' | 'content' | 'end' | 'error';
  content?: string;
  agent?: string;
  suggestions?: Array<{ label: string; path: string }>;
  error?: string;
}

export interface StrandsWorkflowResponse<T = unknown> {
  success: boolean;
  data: T;
  analysis?: Record<string, unknown>;
  logistics?: Record<string, unknown>;
  validation?: Record<string, unknown>;
  workflowId?: string;
}

export interface StreamingWorkflowChunk {
  type: 'workflow_start' | 'step_complete' | 'workflow_complete' | 'error';
  step?: string;
  data?: Record<string, unknown>;
  progress?: number;
  error?: string;
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private cognitoAuth: CognitoAuth;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.cognitoAuth = new CognitoAuth();
  }

  async setAuthToken(token: string) {
    this.token = token;
  }

  private async getAuthToken(): Promise<string | null> {
    console.log('Getting auth token...')
    
    if (this.token && !this.cognitoAuth.isTokenExpired(this.token)) {
      console.log('Using cached token')
      return this.token;
    }

    try {
      const storedToken = this.cognitoAuth.getIdToken();
      console.log('Stored token exists:', !!storedToken)
      
      if (storedToken && !this.cognitoAuth.isTokenExpired(storedToken)) {
        console.log('Using stored token')
        this.token = storedToken;
        return this.token;
      }
      
      console.log('Token expired or not found, checking refresh token')
      // Token expired, try to refresh
      if (this.cognitoAuth.getRefreshToken()) {
        console.log('Attempting to refresh token')
        const newToken = await this.refreshAuthToken();
        return newToken;
      }
      
      console.log('No valid token or refresh token found')
      return null;
    } catch (error) {
      console.error('Failed to get auth token:', error);
      return null;
    }
  }

  private async refreshAuthToken(): Promise<string> {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      const newIdToken = data.data.id_token;
      
      localStorage.setItem('idToken', newIdToken);
      localStorage.setItem('accessToken', data.data.access_token);
      
      this.token = newIdToken;
      return newIdToken;
    } catch (error) {
      console.error('Failed to refresh auth token:', error);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('idToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/auth/login';
      throw error;
    }
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

    // Get auth token - required for all API calls
    const token = await this.getAuthToken();
    if (!token) {
      console.warn('No auth token available, redirecting to login');
      this.redirectToLogin();
      throw new Error('Authentication required');
    }
    
    headers['Authorization'] = `Bearer ${token}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      // Handle 401 Unauthorized - try to refresh token once
      if (response.status === 401 && retryCount === 0) {
        console.log('Received 401, attempting token refresh');
        try {
          const newToken = await this.refreshAuthToken();
          headers['Authorization'] = `Bearer ${newToken}`;
          
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });
          
          if (retryResponse.ok) {
            const retryData = await retryResponse.json();
            return {
              success: true,
              data: retryData.data,
              count: retryData.count
            };
          } else if (retryResponse.status === 401) {
            console.error('Still unauthorized after token refresh');
            this.redirectToLogin();
            throw new Error('Authentication failed');
          }
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          this.redirectToLogin();
          throw new Error('Authentication failed');
        }
      }
      
      if (response.status === 401) {
        console.error('Unauthorized access, redirecting to login');
        this.redirectToLogin();
        throw new Error('Authentication required');
      }
      
      if (response.status === 403) {
        console.error('Access forbidden');
        throw new Error('Access denied. Please check your permissions.');
      }

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
    console.log('Fetching dashboard for wedding ID:', id);
    console.log('API URL:', `${this.baseURL}/weddings/${id}/dashboard`);
    
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
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

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

  // Strands AI-powered methods
  async getGuestsWithAnalysis(weddingId: string): Promise<StrandsWorkflowResponse> {
    const response = await this.request<Record<string, unknown>>(`/weddings/${weddingId}/guests`);
    return response as StrandsWorkflowResponse;
  }

  async updateRSVPWithWorkflow(guestId: string, rsvpData: {
    rsvpStatus: 'pending' | 'attending' | 'declined';
    dietaryRestrictions?: string;
    plusOne?: boolean;
  }): Promise<StrandsWorkflowResponse> {
    const response = await this.request<Record<string, unknown>>(`/guests/${guestId}/rsvp`, {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    });
    return response as StrandsWorkflowResponse;
  }

  async createSeatingPlan(weddingId: string, data: {
    phaseId: string;
    venueLayout: Record<string, unknown>;
    preferences: Record<string, unknown>;
  }): Promise<StrandsWorkflowResponse> {
    const response = await this.request<Record<string, unknown>>(`/weddings/${weddingId}/seating-plan`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response as StrandsWorkflowResponse;
  }

  async streamGuestInquiry(guestId: string, inquiry: string, urgency: string = 'medium'): Promise<ReadableStream<Uint8Array>> {
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/guests/${guestId}/inquiry`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ inquiry, urgency }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body for streaming');
    }

    return response.body;
  }

  async bulkGuestOperations(weddingId: string, data: {
    operation: string;
    guestIds: string[];
    data: Record<string, unknown>;
  }): Promise<StrandsWorkflowResponse> {
    const response = await this.request<Record<string, unknown>>(`/weddings/${weddingId}/guests/bulk`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response as StrandsWorkflowResponse;
  }

  async getGuestAnalytics(weddingId: string): Promise<StrandsWorkflowResponse> {
    const response = await this.request<Record<string, unknown>>(`/weddings/${weddingId}/guests/analytics`);
    return response as StrandsWorkflowResponse;
  }

  async optimizeWedding(weddingId: string, goals: { goals: string[] }): Promise<StrandsWorkflowResponse> {
    const response = await this.request<Record<string, unknown>>(`/weddings/${weddingId}/optimize`, {
      method: 'POST',
      body: JSON.stringify(goals),
    });
    return response as StrandsWorkflowResponse;
  }

  async streamWeddingChat(weddingId: string, message: string): Promise<ReadableStream<Uint8Array>> {
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/weddings/${weddingId}/chat/stream`, {
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

  async searchVendorsWithAI(weddingId: string, criteria: {
    category: string;
    budget: number;
    location: string;
    preferences: Record<string, unknown>;
  }): Promise<StrandsWorkflowResponse> {
    const response = await this.request<Record<string, unknown>>(`/weddings/${weddingId}/vendors/search`, {
      method: 'POST',
      body: JSON.stringify(criteria),
    });
    return response as StrandsWorkflowResponse;
  }

  async negotiateContract(vendorId: string, data: {
    weddingId: string;
    terms: Record<string, unknown>;
    budget: number;
  }): Promise<StrandsWorkflowResponse> {
    const response = await this.request<Record<string, unknown>>(`/vendors/${vendorId}/negotiate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response as StrandsWorkflowResponse;
  }

  async coordinateVendors(weddingId: string, data: {
    eventDate: string;
    timeline: Record<string, unknown>;
  }): Promise<StrandsWorkflowResponse> {
    const response = await this.request<Record<string, unknown>>(`/weddings/${weddingId}/vendors/coordinate`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response as StrandsWorkflowResponse;
  }

  async streamVendorChat(vendorId: string, data: {
    message: string;
    weddingId: string;
  }): Promise<ReadableStream<Uint8Array>> {
    const token = await this.getAuthToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}/vendors/${vendorId}/chat/stream`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body for streaming');
    }

    return response.body;
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