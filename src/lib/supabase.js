// Migration vers Express API - Supabase complètement désactivé
import { unifiedAuth } from '@/services/UnifiedAuthService';
import { api } from '@/config/api';

console.warn('🔄 Supabase remplacé par Express API + UnifiedAuth - Migration terminée');

// Compatibilité avec l'ancienne interface Supabase
export const supabase = {
  auth: {
    getSession: () => unifiedAuth.getSession(),
    getUser: async () => {
      const user = unifiedAuth.getCurrentUser();
      return { data: { user }, error: null };
    },
    signInWithPassword: async ({ email, password }) => {
      const result = await unifiedAuth.signIn(email, password);
      return { 
        data: result.user ? { user: result.user } : null, 
        error: result.error 
      };
    },
    signOut: () => unifiedAuth.signOut(),
    onAuthStateChange: (callback) => unifiedAuth.onAuthStateChange(callback)
  },
  
  // Remplacer les appels DB par les appels API
  from: (table) => ({
    select: async (columns = '*', options = {}) => {
      try {
        // Mapper les tables vers les endpoints API
        const tableEndpoints = {
          'profiles': 'users',
          'properties': 'properties', 
          'transactions': 'transactions',
          'communal_requests': 'communal/requests',
          'notifications': 'communications/notifications',
          'messages': 'communications/messages'
        };
        
        const endpoint = tableEndpoints[table] || table;
        const data = await api.get(`/${endpoint}`);
        
        if (options.count === 'exact') {
          return { data, count: data?.length || 0, error: null };
        }
        
        return { data, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    
    insert: async (data) => {
      try {
        const tableEndpoints = {
          'profiles': 'users',
          'properties': 'properties',
          'transactions': 'transactions', 
          'communal_requests': 'communal/requests'
        };
        
        const endpoint = tableEndpoints[table] || table;
        const result = await api.post(`/${endpoint}`, data);
        return { data: result, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },
    
    update: async (data) => ({
      eq: async (column, value) => {
        try {
          const tableEndpoints = {
            'profiles': 'users',
            'properties': 'properties',
            'transactions': 'transactions'
          };
          
          const endpoint = tableEndpoints[table] || table;
          const result = await api.put(`/${endpoint}/${value}`, data);
          return { data: result, error: null };
        } catch (error) {
          return { data: null, error };
        }
      }
    }),
    
    delete: () => ({
      eq: async (column, value) => {
        try {
          const tableEndpoints = {
            'profiles': 'users',
            'properties': 'properties',
            'transactions': 'transactions'
          };
          
          const endpoint = tableEndpoints[table] || table;
          await api.delete(`/${endpoint}/${value}`);
          return { data: null, error: null };
        } catch (error) {
          return { data: null, error };
        }
      }
    }),
    
    // Chainable methods pour compatibilité
    eq: function(column, value) {
      this._filters = this._filters || [];
      this._filters.push({ column, operator: 'eq', value });
      return this;
    },
    
    gte: function(column, value) {
      this._filters = this._filters || [];
      this._filters.push({ column, operator: 'gte', value });
      return this;
    },
    
    single: function() {
      this._single = true;
      return this;
    }
  })
};

export const createClient = () => supabase;
export default supabase;
