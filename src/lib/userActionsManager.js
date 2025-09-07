// Mock UserActionsManager for Admin Dashboard
// Replaces Supabase functionality with local mock data

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

  // Mock some initial actions for testing
  async seedMockData() {
    const mockActions = [
      {
        userId: 'user_1',
        action: 'login',
        details: { method: 'email' }
      },
      {
        userId: 'user_2',
        action: 'profile_update',
        details: { fields: ['name', 'email'] }
      },
      {
        userId: 'user_1',
        action: 'terrain_view',
        details: { terrainId: 'terrain_123' }
      },
      {
        userId: 'user_3',
        action: 'purchase_initiated',
        details: { terrainId: 'terrain_456', amount: 5000000 }
      },
      {
        userId: 'user_2',
        action: 'logout',
        details: {}
      }
    ];

    for (const action of mockActions) {
      await this.logUserAction(action.userId, action.action, action.details);
    }
  }

  // Search users - Mock implementation for admin dashboard
  async searchUsers(query = '', options = {}) {
    // Mock user data for the admin dashboard
    const mockUsers = [
      {
        id: 'user_1',
        name: 'Amadou Diallo',
        email: 'amadou.diallo@email.com',
        role: 'Particulier',
        status: 'active',
        verification_status: 'verified',
        created_at: '2024-01-15T10:30:00Z',
        last_login: '2024-01-20T14:15:00Z',
        phone: '+221771234567'
      },
      {
        id: 'user_2', 
        name: 'Fatou Seck',
        email: 'fatou.seck@email.com',
        role: 'Vendeur Pro',
        status: 'active',
        verification_status: 'pending',
        created_at: '2024-01-16T09:20:00Z',
        last_login: '2024-01-19T16:45:00Z',
        phone: '+221771234568'
      },
      {
        id: 'user_3',
        name: 'Moussa Ba',
        email: 'moussa.ba@email.com', 
        role: 'Agent Foncier',
        status: 'active',
        verification_status: 'verified',
        created_at: '2024-01-17T11:10:00Z',
        last_login: '2024-01-21T08:30:00Z',
        phone: '+221771234569'
      },
      {
        id: 'user_4',
        name: 'Aïssatou Ndiaye',
        email: 'aissatou.ndiaye@email.com',
        role: 'Banque',
        status: 'inactive',
        verification_status: 'verified',
        created_at: '2024-01-18T13:45:00Z',
        last_login: '2024-01-18T15:20:00Z',
        phone: '+221771234570'
      },
      {
        id: 'user_5',
        name: 'Ibrahim Touré',
        email: 'ibrahim.toure@email.com',
        role: 'Mairie',
        status: 'active',
        verification_status: 'rejected',
        created_at: '2024-01-19T16:30:00Z',
        last_login: '2024-01-20T12:10:00Z',
        phone: '+221771234571'
      }
    ];

    // Filter by query if provided
    let filtered = mockUsers;
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.role.toLowerCase().includes(searchTerm)
      );
    }

    // Apply additional filters
    if (options.role) {
      filtered = filtered.filter(user => user.role === options.role);
    }
    
    if (options.status) {
      filtered = filtered.filter(user => user.status === options.status);
    }
    
    if (options.verification_status) {
      filtered = filtered.filter(user => user.verification_status === options.verification_status);
    }

    return {
      data: filtered,
      count: filtered.length,
      total: mockUsers.length
    };
  }

  // Get user statistics for admin dashboard
  async getUserStats() {
    const mockStats = {
      total_users: 1247,
      active_users: 1089,
      inactive_users: 158,
      verified_users: 892,
      pending_verification: 234,
      rejected_verification: 121,
      roles_distribution: {
        'Particulier': 456,
        'Vendeur Particulier': 234,
        'Vendeur Pro': 187,
        'Agent Foncier': 89,
        'Banque': 67,
        'Notaire': 45,
        'Mairie': 34,
        'Géomètre': 28,
        'Investisseur': 76,
        'Promoteur': 23,
        'Agriculteur': 8
      },
      recent_registrations: {
        today: 12,
        this_week: 89,
        this_month: 234
      },
      activity_summary: {
        active_today: 156,
        active_this_week: 678,
        active_this_month: 1089
      }
    };

    return mockStats;
  }

  // Cleanup
  async cleanup() {
    this.actions = [];
    this.listeners.clear();
  }
}

// Create singleton instance
const userActionsManager = new UserActionsManager();

// Initialize with mock data
userActionsManager.seedMockData();

export default userActionsManager;
