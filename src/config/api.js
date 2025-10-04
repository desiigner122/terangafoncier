// Configuration API pour remplacer Supabase par Express Backend
const API_BASE_URL = 'http://localhost:3000/api';

// Configuration des endpoints API
export const API_ENDPOINTS = {
  // Authentication
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    profile: '/auth/profile',
    refresh: '/auth/refresh',
    verify: '/auth/verify'
  },

  // Users Management
  users: {
    list: '/users',
    profile: '/users/profile',
    update: '/users/profile',
    delete: '/users',
    search: '/users/search',
    roles: '/users/roles',
    permissions: '/users/permissions'
  },

  // Properties
  properties: {
    list: '/properties',
    details: '/properties',
    create: '/properties',
    update: '/properties',
    delete: '/properties',
    search: '/properties/search',
    featured: '/properties/featured',
    nearby: '/properties/nearby',
    images: '/properties/images'
  },

  // Transactions
  transactions: {
    list: '/transactions',
    create: '/transactions',
    update: '/transactions',
    history: '/transactions/history',
    stats: '/transactions/stats'
  },

  // Financial
  financial: {
    payments: '/financial/payments',
    invoices: '/financial/invoices',
    commissions: '/financial/commissions',
    revenue: '/financial/revenue',
    analytics: '/financial/analytics'
  },

  // Communications
  communications: {
    messages: '/communications/messages',
    notifications: '/communications/notifications',
    broadcasts: '/communications/broadcasts',
    templates: '/communications/templates'
  },

  // Communal Requests
  communal: {
    requests: '/communal/requests',
    subscriptions: '/communal/subscriptions',
    revenue: '/communal/revenue',
    stats: '/communal/stats'
  },

  // File uploads
  files: {
    upload: '/files/upload',
    delete: '/files/delete',
    list: '/files/list'
  },

  // Dashboard data
  dashboard: {
    admin: '/dashboard/admin',
    agent: '/dashboard/agent',
    particulier: '/dashboard/particulier',
    notaire: '/dashboard/notaire',
    geometre: '/dashboard/geometre',
    banque: '/dashboard/banque',
    stats: '/dashboard/stats'
  }
};

// Client API avec gestion des tokens
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  // Headers par défaut
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  // GET request
  async get(endpoint, params = {}) {
    try {
      const url = new URL(this.baseURL + endpoint);
      Object.keys(params).forEach(key => {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      });

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('API GET Error:', error);
      throw error;
    }
  }

  // POST request
  async post(endpoint, data = {}) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('API POST Error:', error);
      throw error;
    }
  }

  // PUT request
  async put(endpoint, data = {}) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(data)
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('API PUT Error:', error);
      throw error;
    }
  }

  // DELETE request
  async delete(endpoint) {
    try {
      const response = await fetch(this.baseURL + endpoint, {
        method: 'DELETE',
        headers: this.getHeaders()
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('API DELETE Error:', error);
      throw error;
    }
  }

  // Upload file
  async uploadFile(endpoint, file, additionalData = {}) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      Object.keys(additionalData).forEach(key => {
        formData.append(key, additionalData[key]);
      });

      const headers = {};
      if (this.token) {
        headers.Authorization = `Bearer ${this.token}`;
      }

      const response = await fetch(this.baseURL + endpoint, {
        method: 'POST',
        headers,
        body: formData
      });

      return await this.handleResponse(response);
    } catch (error) {
      console.error('API Upload Error:', error);
      throw error;
    }
  }

  // Gérer la réponse API
  async handleResponse(response) {
    const contentType = response.headers.get('content-type');
    let data;

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      // Token expiré
      if (response.status === 401) {
        this.handleTokenExpired();
      }
      
      const error = new Error(data.message || `HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  // Gérer l'expiration du token
  handleTokenExpired() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('local_auth_user');
    this.token = null;
    
    // Rediriger vers la page de connexion si pas déjà dessus
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
  }

  // Définir le token d'authentification
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Obtenir le token actuel
  getToken() {
    return this.token;
  }
}

// Instance globale du client API
export const apiClient = new ApiClient();

// Helper functions for common operations
export const api = {
  // Authentication
  login: (credentials) => apiClient.post(API_ENDPOINTS.auth.login, credentials),
  register: (userData) => apiClient.post(API_ENDPOINTS.auth.register, userData),
  logout: () => apiClient.post(API_ENDPOINTS.auth.logout),
  getProfile: () => apiClient.get(API_ENDPOINTS.auth.profile),

  // Properties
  getProperties: (params) => apiClient.get(API_ENDPOINTS.properties.list, params),
  getProperty: (id) => apiClient.get(`${API_ENDPOINTS.properties.details}/${id}`),
  createProperty: (data) => apiClient.post(API_ENDPOINTS.properties.create, data),
  updateProperty: (id, data) => apiClient.put(`${API_ENDPOINTS.properties.update}/${id}`, data),
  deleteProperty: (id) => apiClient.delete(`${API_ENDPOINTS.properties.delete}/${id}`),

  // Transactions
  getTransactions: (params) => apiClient.get(API_ENDPOINTS.transactions.list, params),
  createTransaction: (data) => apiClient.post(API_ENDPOINTS.transactions.create, data),

  // Dashboard
  getDashboardData: (role) => apiClient.get(`${API_ENDPOINTS.dashboard[role]}`),
  getStats: () => apiClient.get(API_ENDPOINTS.dashboard.stats),

  // File uploads
  uploadFile: (file, type) => apiClient.uploadFile(API_ENDPOINTS.files.upload, file, { type }),

  // Communal requests
  getCommunalRequests: (params) => apiClient.get(API_ENDPOINTS.communal.requests, params),
  createCommunalRequest: (data) => apiClient.post(API_ENDPOINTS.communal.requests, data),
  getCommunalStats: () => apiClient.get(API_ENDPOINTS.communal.stats)
};

export default apiClient;