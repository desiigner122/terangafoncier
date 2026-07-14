// UserActionsManager for Admin Dashboard
// Journal d'actions en mémoire + recherche/statistiques utilisateurs via Supabase (table profiles)

import { supabase } from './supabaseClient';

class UserActionsManager {
  constructor() {
    this.actions = [];
    this.listeners = new Set();
  }

  // Initialize the manager
  async initialize() {
    console.log('UserActionsManager initialized');
    return true;
  }

  // Create a new user action record
  async logUserAction(userId, action, details = {}) {
    const actionRecord = {
      id: Date.now().toString(),
      userId,
      action,
      details,
      timestamp: new Date().toISOString(),
      metadata: {
        userAgent: navigator.userAgent,
        ip: 'localhost',
        ...details.metadata
      }
    };

    this.actions.unshift(actionRecord);
    
    // Keep only last 1000 actions
    if (this.actions.length > 1000) {
      this.actions = this.actions.slice(0, 1000);
    }

    // Notify listeners
    this.notifyListeners('action_logged', actionRecord);
    
    return actionRecord;
  }

  // Get user actions with filtering
  async getUserActions(userId, options = {}) {
    let filtered = this.actions.filter(action => action.userId === userId);
    
    if (options.action) {
      filtered = filtered.filter(action => action.action === options.action);
    }
    
    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }
    
    return filtered;
  }

  // Get all actions with optional filtering
  async getAllActions(options = {}) {
    let filtered = [...this.actions];
    
    if (options.userId) {
      filtered = filtered.filter(action => action.userId === options.userId);
    }
    
    if (options.action) {
      filtered = filtered.filter(action => action.action === options.action);
    }
    
    if (options.startDate) {
      filtered = filtered.filter(action => 
        new Date(action.timestamp) >= new Date(options.startDate)
      );
    }
    
    if (options.endDate) {
      filtered = filtered.filter(action => 
        new Date(action.timestamp) <= new Date(options.endDate)
      );
    }
    
    if (options.limit) {
      filtered = filtered.slice(0, options.limit);
    }
    
    return filtered;
  }

  // Get action statistics
  async getActionStats(timeframe = '7d') {
    const now = new Date();
    const days = parseInt(timeframe.replace('d', ''));
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000));
    
    const recentActions = this.actions.filter(action => 
      new Date(action.timestamp) >= startDate
    );

    const stats = {
      total: recentActions.length,
      byAction: {},
      byUser: {},
      dailyCount: {}
    };

    recentActions.forEach(action => {
      // Count by action type
      stats.byAction[action.action] = (stats.byAction[action.action] || 0) + 1;
      
      // Count by user
      stats.byUser[action.userId] = (stats.byUser[action.userId] || 0) + 1;
      
      // Count by day
      const day = action.timestamp.split('T')[0];
      stats.dailyCount[day] = (stats.dailyCount[day] || 0) + 1;
    });

    return stats;
  }

  // Subscribe to action events
  subscribe(callback) {
    this.listeners.add(callback);
    
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners
  notifyListeners(event, data) {
    this.listeners.forEach(callback => {
      try {
        callback(event, data);
      } catch (error) {
        console.error('Error in UserActionsManager listener:', error);
      }
    });
  }

  // Search users - interroge la table profiles réelle (Supabase)
  async searchUsers(query = '', options = {}) {
    try {
      let request = supabase
        .from('profiles')
        .select('id, full_name, nom, email, role, is_active, is_verified, created_at, phone', { count: 'exact' });

      if (query) {
        const term = `%${query}%`;
        request = request.or(`full_name.ilike.${term},nom.ilike.${term},email.ilike.${term}`);
      }

      if (options.role) {
        request = request.eq('role', options.role);
      }

      if (options.status === 'active') {
        request = request.eq('is_active', true);
      } else if (options.status === 'inactive') {
        request = request.eq('is_active', false);
      }

      if (options.verification_status === 'verified') {
        request = request.eq('is_verified', true);
      } else if (options.verification_status === 'pending') {
        request = request.eq('is_verified', false);
      }

      if (options.limit) {
        request = request.limit(options.limit);
      }

      const { data, count, error } = await request;

      if (error) {
        console.error('Erreur searchUsers (profiles):', error);
        return { data: [], count: 0, total: 0 };
      }

      const users = (data || []).map(profile => ({
        id: profile.id,
        name: profile.full_name || profile.nom || '',
        email: profile.email || '',
        role: profile.role || '',
        status: profile.is_active === false ? 'inactive' : 'active',
        verification_status: profile.is_verified ? 'verified' : 'pending',
        created_at: profile.created_at,
        phone: profile.phone || ''
      }));

      return {
        data: users,
        count: users.length,
        total: count ?? users.length
      };
    } catch (error) {
      console.error('Erreur searchUsers:', error);
      return { data: [], count: 0, total: 0 };
    }
  }

  // Get user statistics for admin dashboard - calculées à partir de profiles réel
  async getUserStats() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, role, is_active, is_verified, created_at');

      if (error) {
        console.error('Erreur getUserStats (profiles):', error);
        return {
          total_users: 0,
          active_users: 0,
          inactive_users: 0,
          verified_users: 0,
          pending_verification: 0,
          rejected_verification: 0,
          roles_distribution: {},
          recent_registrations: { today: 0, this_week: 0, this_month: 0 },
          activity_summary: { active_today: 0, active_this_week: 0, active_this_month: 0 }
        };
      }

      const profiles = data || [];
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const startOfMonth = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const roles_distribution = profiles.reduce((acc, p) => {
        const role = p.role || 'non_defini';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
      }, {});

      const countSince = (since) => profiles.filter(p => p.created_at && new Date(p.created_at) >= since).length;

      return {
        total_users: profiles.length,
        active_users: profiles.filter(p => p.is_active !== false).length,
        inactive_users: profiles.filter(p => p.is_active === false).length,
        verified_users: profiles.filter(p => p.is_verified === true).length,
        pending_verification: profiles.filter(p => p.is_verified !== true).length,
        rejected_verification: 0,
        roles_distribution,
        recent_registrations: {
          today: countSince(startOfToday),
          this_week: countSince(startOfWeek),
          this_month: countSince(startOfMonth)
        },
        activity_summary: {
          active_today: 0,
          active_this_week: 0,
          active_this_month: 0
        }
      };
    } catch (error) {
      console.error('Erreur getUserStats:', error);
      return {
        total_users: 0,
        active_users: 0,
        inactive_users: 0,
        verified_users: 0,
        pending_verification: 0,
        rejected_verification: 0,
        roles_distribution: {},
        recent_registrations: { today: 0, this_week: 0, this_month: 0 },
        activity_summary: { active_today: 0, active_this_week: 0, active_this_month: 0 }
      };
    }
  }

  // Cleanup
  async cleanup() {
    this.actions = [];
    this.listeners.clear();
  }
}

// Create singleton instance
const userActionsManager = new UserActionsManager();

export default userActionsManager;
