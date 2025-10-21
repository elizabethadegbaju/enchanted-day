import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';
import type { Wedding, Guest, Vendor, OverallBudget, BudgetCategory, WeddingForComponents } from '@/types';

// Generate the Amplify Data client
const client = generateClient<Schema>();

export class AmplifyDataClient {
  // Wedding operations
  async getWeddings() {
    try {
      const { data: weddings, errors } = await client.models.Wedding.list();
      if (errors) {
        console.error('Errors fetching weddings:', errors);
        throw new Error('Failed to fetch weddings');
      }
      return weddings || [];
    } catch (error) {
      console.error('Failed to fetch weddings:', error);
      throw error;
    }
  }

  async getWedding(id: string) {
    try {
      const { data: wedding, errors } = await client.models.Wedding.get({ id });
      if (errors) {
        console.error('Errors fetching wedding:', errors);
        throw new Error('Failed to fetch wedding');
      }
      if (!wedding) {
        throw new Error('Wedding not found');
      }
      return wedding;
    } catch (error) {
      console.error('Failed to fetch wedding:', error);
      throw error;
    }
  }

  async createWedding(weddingData: {
    user_id: string;
    couple_names: string[];
    wedding_type: 'SINGLE_EVENT' | 'MULTI_PHASE';
    status: 'PLANNING' | 'CONFIRMED' | 'COMPLETED';
    phases: any[];
    overall_budget: any;
    cultural_traditions: string[];
    days_until_wedding: number;
    overall_progress: number;
  }) {
    try {
      const { data: wedding, errors } = await client.models.Wedding.create(weddingData);
      if (errors) {
        console.error('Errors creating wedding:', errors);
        throw new Error('Failed to create wedding');
      }
      if (!wedding) {
        throw new Error('Failed to create wedding');
      }
      return wedding;
    } catch (error) {
      console.error('Failed to create wedding:', error);
      throw error;
    }
  }

  async updateWedding(id: string, updates: Partial<Wedding>) {
    try {
      const { data: wedding, errors } = await client.models.Wedding.update({
        id,
        ...updates
      });
      if (errors) {
        console.error('Errors updating wedding:', errors);
        throw new Error('Failed to update wedding');
      }
      if (!wedding) {
        throw new Error('Failed to update wedding');
      }
      return wedding;
    } catch (error) {
      console.error('Failed to update wedding:', error);
      throw error;
    }
  }

  async deleteWedding(id: string) {
    try {
      const { data, errors } = await client.models.Wedding.delete({ id });
      if (errors) {
        console.error('Errors deleting wedding:', errors);
        throw new Error('Failed to delete wedding');
      }
      return data;
    } catch (error) {
      console.error('Failed to delete wedding:', error);
      throw error;
    }
  }

  async getWeddingForComponents(id: string): Promise<WeddingForComponents> {
    try {
      const wedding = await this.getWedding(id);
      const overallBudget = await this.getOverallBudget(id);
      // Import the transform function here to avoid circular dependency
      const { transformWeddingForComponents } = await import('@/types');
      return transformWeddingForComponents(wedding);
    } catch (error) {
      console.error('Failed to fetch wedding for components:', error);
      throw error;
    }
  }

  // Budget operations
  async getBudgetCategories(weddingId: string) {
    try {
      const { data: categories, errors } = await client.models.BudgetCategory.list({
        filter: { wedding_id: { eq: weddingId } }
      });
      if (errors) {
        console.error('Errors fetching budget categories:', errors);
        throw new Error('Failed to fetch budget categories');
      }
      return categories || [];
    } catch (error) {
      console.error('Failed to fetch budget categories:', error);
      throw error;
    }
  }

  // Note: OverallBudget is a custom type, not a model in the enhanced schema
  // Budget information is stored as part of the Wedding model
  async getOverallBudget(weddingId: string) {
    try {
      // Get budget data from the wedding model instead
      const wedding = await this.getWedding(weddingId);
      return wedding?.overall_budget || null;
    } catch (error) {
      console.error('Failed to fetch budget:', error);
      throw error;
    }
  }

  // For backward compatibility with existing components
  async getGuests() {
    console.warn('getGuests() called without weddingId - using mock data');
    return [];
  }

  async getVendors() {
    console.warn('getVendors() called without weddingId - using mock data');
    return [];
  }
}

// Export a singleton instance
export const amplifyDataClient = new AmplifyDataClient();

export default amplifyDataClient;