// src/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApplianceService {
  static async getAppliances(params?: {
    search?: string;
    status?: string;
    category?: string;
    limit?: number;
    offset?: number;
  }) {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          searchParams.append(key, String(value));
        }
      });
    }
    
    const response = await fetch(`${API_BASE_URL}/appliances?${searchParams}`);
    return response.json();
  }

  static async createAppliance(appliance: {
    name: string;
    brand?: string;
    model?: string;
    serialNumber?: string;
    purchaseDate: string;
    purchaseLocation?: string;
    warrantyMonths: number;
    supportContactId?: string;
    notes?: string;
    category?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/appliances`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appliance)
    });
    return response.json();
  }

  static async updateAppliance(id: string, appliance: Partial<any>) {
    const response = await fetch(`${API_BASE_URL}/appliances/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appliance)
    });
    return response.json();
  }

  static async deleteAppliance(id: string) {
    const response = await fetch(`${API_BASE_URL}/appliances/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  }

  static async getApplianceStats() {
    const response = await fetch(`${API_BASE_URL}/appliances/stats`);
    return response.json();
  }
}