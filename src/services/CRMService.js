/**
 * ================================================
 * CRMService - Gestion complète du CRM
 * ================================================
 * Integration Supabase pour:
 * - Contacts
 * - Affaires (Deals)
 * - Activités
 * - Tâches
 * ================================================
 */

import { supabase } from '@/lib/supabaseClient';

class CRMService {
  // ==================== CONTACTS ====================

  /**
   * Récupérer tous les contacts avec filtres
   */
  async getContacts(filters = {}) {
    try {
      let query = supabase
        .from('crm_contacts')
        .select(`
          *,
          activities:crm_activities(count),
          deals:crm_deals(count)
        `)
        .order('created_at', { ascending: false });

      // Filtrer par statut
      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      // Filtrer par type de rôle
      if (filters.role) {
        query = query.eq('role', filters.role);
      }

      // Filtrer par assigné
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }

      // Recherche full-text
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,email.ilike.%${filters.search}%,phone.ilike.%${filters.search}%`);
      }

      // Limiter résultats
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, contacts: data || [] };
    } catch (error) {
      console.error('❌ Erreur getContacts:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Créer un nouveau contact
   */
  async createContact(contactData) {
    try {
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('crm_contacts')
        .insert({
          name: contactData.name,
          email: contactData.email,
          phone: contactData.phone,
          role: contactData.role || 'Particulier',
          company: contactData.company || null,
          location: contactData.location || null,
          status: contactData.status || 'prospect',
          score: contactData.score || 0,
          interests: contactData.interests || [],
          notes: contactData.notes || '',
          assigned_to: contactData.assigned_to || userData?.user?.id,
          avatar_url: contactData.avatar_url || null,
          source: contactData.source || 'manual',
          tags: contactData.tags || [],
          custom_fields: contactData.custom_fields || {},
          last_contact_date: new Date().toISOString(),
          contact_frequency: contactData.contact_frequency || 'monthly'
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Contact créé:', data);
      return { success: true, contact: data };
    } catch (error) {
      console.error('❌ Erreur createContact:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour un contact
   */
  async updateContact(contactId, updates) {
    try {
      const { data, error } = await supabase
        .from('crm_contacts')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, contact: data };
    } catch (error) {
      console.error('❌ Erreur updateContact:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer un contact
   */
  async deleteContact(contactId) {
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .delete()
        .eq('id', contactId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('❌ Erreur deleteContact:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== AFFAIRES (DEALS) ====================

  /**
   * Récupérer tous les affaires avec leur contact
   */
  async getDeals(filters = {}) {
    try {
      let query = supabase
        .from('crm_deals')
        .select(`
          *,
          contact:crm_contacts(id, name, email, phone),
          activities:crm_activities(count)
        `)
        .order('expected_close_date', { ascending: true });

      // Filtrer par étape
      if (filters.stage) {
        query = query.eq('stage', filters.stage);
      }

      // Filtrer par contact
      if (filters.contact_id) {
        query = query.eq('contact_id', filters.contact_id);
      }

      // Filtrer par assigné
      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, deals: data || [] };
    } catch (error) {
      console.error('❌ Erreur getDeals:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Créer une nouvelle affaire
   */
  async createDeal(dealData) {
    try {
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('crm_deals')
        .insert({
          title: dealData.title,
          contact_id: dealData.contact_id,
          value: dealData.value || 0,
          stage: dealData.stage || 'Prospection',
          probability: dealData.probability || 0,
          expected_close_date: dealData.expected_close_date,
          assigned_to: dealData.assigned_to || userData?.user?.id,
          description: dealData.description || '',
          notes: dealData.notes || '',
          custom_fields: dealData.custom_fields || {},
          documents: dealData.documents || []
        })
        .select()
        .single();

      if (error) throw error;

      console.log('✅ Affaire créée:', data);
      return { success: true, deal: data };
    } catch (error) {
      console.error('❌ Erreur createDeal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour une affaire (notamment stage pour Kanban)
   */
  async updateDeal(dealId, updates) {
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', dealId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, deal: data };
    } catch (error) {
      console.error('❌ Erreur updateDeal:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Déplacer une affaire dans le pipeline (pour Kanban)
   */
  async moveDealToStage(dealId, stage) {
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .update({
          stage,
          updated_at: new Date().toISOString()
        })
        .eq('id', dealId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, deal: data };
    } catch (error) {
      console.error('❌ Erreur moveDealToStage:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer une affaire
   */
  async deleteDeal(dealId) {
    try {
      const { error } = await supabase
        .from('crm_deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('❌ Erreur deleteDeal:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== ACTIVITÉS ====================

  /**
   * Ajouter une activité (appel, email, réunion, note)
   */
  async addActivity(activityData) {
    try {
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('crm_activities')
        .insert({
          contact_id: activityData.contact_id,
          deal_id: activityData.deal_id || null,
          type: activityData.type, // 'call', 'email', 'meeting', 'note', 'task'
          title: activityData.title,
          description: activityData.description,
          outcome: activityData.outcome || null,
          scheduled_date: activityData.scheduled_date || null,
          completed_date: activityData.completed_date || null,
          created_by: userData?.user?.id,
          duration_minutes: activityData.duration_minutes || null,
          participants: activityData.participants || [],
          attachments: activityData.attachments || []
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, activity: data };
    } catch (error) {
      console.error('❌ Erreur addActivity:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer activités d'un contact
   */
  async getActivities(filters = {}) {
    try {
      let query = supabase
        .from('crm_activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (filters.contact_id) {
        query = query.eq('contact_id', filters.contact_id);
      }

      if (filters.deal_id) {
        query = query.eq('deal_id', filters.deal_id);
      }

      if (filters.type) {
        query = query.eq('type', filters.type);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, activities: data || [] };
    } catch (error) {
      console.error('❌ Erreur getActivities:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== TÂCHES ====================

  /**
   * Créer une tâche
   */
  async createTask(taskData) {
    try {
      const { data: userData } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('crm_tasks')
        .insert({
          title: taskData.title,
          description: taskData.description || '',
          contact_id: taskData.contact_id || null,
          deal_id: taskData.deal_id || null,
          assigned_to: taskData.assigned_to || userData?.user?.id,
          due_date: taskData.due_date,
          priority: taskData.priority || 'medium',
          status: taskData.status || 'open',
          category: taskData.category || 'follow-up',
          created_by: userData?.user?.id
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, task: data };
    } catch (error) {
      console.error('❌ Erreur createTask:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer les tâches
   */
  async getTasks(filters = {}) {
    try {
      let query = supabase
        .from('crm_tasks')
        .select(`
          *,
          contact:crm_contacts(id, name, email),
          deal:crm_deals(id, title)
        `)
        .order('due_date', { ascending: true });

      if (filters.status) {
        query = query.eq('status', filters.status);
      }

      if (filters.assigned_to) {
        query = query.eq('assigned_to', filters.assigned_to);
      }

      if (filters.priority) {
        query = query.eq('priority', filters.priority);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, tasks: data || [] };
    } catch (error) {
      console.error('❌ Erreur getTasks:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Mettre à jour une tâche
   */
  async updateTask(taskId, updates) {
    try {
      const { data, error } = await supabase
        .from('crm_tasks')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, task: data };
    } catch (error) {
      console.error('❌ Erreur updateTask:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== RAPPORTS & STATS ====================

  /**
   * Récupérer les statistiques CRM
   */
  async getCRMStats() {
    try {
      // Total des contacts
      const { data: contactsData } = await supabase
        .from('crm_contacts')
        .select('id, status');

      // Total des affaires et valeur
      const { data: dealsData } = await supabase
        .from('crm_deals')
        .select('id, value, stage, probability');

      // Calculer les stats
      const stats = {
        totalContacts: contactsData?.length || 0,
        prospects: contactsData?.filter(c => c.status === 'prospect').length || 0,
        leads: contactsData?.filter(c => c.status === 'lead').length || 0,
        clients: contactsData?.filter(c => c.status === 'client').length || 0,
        totalDeals: dealsData?.length || 0,
        totalValue: dealsData?.reduce((sum, d) => sum + (d.value || 0), 0) || 0,
        pipelineValue: dealsData?.reduce((sum, d) => sum + ((d.value || 0) * (d.probability / 100)), 0) || 0,
        averageDealSize: dealsData?.length ? (dealsData.reduce((sum, d) => sum + (d.value || 0), 0) / dealsData.length) : 0
      };

      return { success: true, stats };
    } catch (error) {
      console.error('❌ Erreur getCRMStats:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer le pipeline par étape
   */
  async getPipelineByStage() {
    try {
      const { data, error } = await supabase
        .from('crm_deals')
        .select('stage, value, probability');

      if (error) throw error;

      const pipeline = {};
      data.forEach(deal => {
        if (!pipeline[deal.stage]) {
          pipeline[deal.stage] = { value: 0, count: 0 };
        }
        pipeline[deal.stage].value += deal.value || 0;
        pipeline[deal.stage].count += 1;
      });

      return { success: true, pipeline };
    } catch (error) {
      console.error('❌ Erreur getPipelineByStage:', error);
      return { success: false, error: error.message };
    }
  }

  // ==================== EXPORTS ====================

  /**
   * Exporter les contacts en CSV
   */
  async exportContactsToCSV(contacts) {
    try {
      const headers = ['Nom', 'Email', 'Téléphone', 'Rôle', 'Statut', 'Localisation', 'Score'];
      const rows = contacts.map(c => [
        c.name,
        c.email,
        c.phone,
        c.role,
        c.status,
        c.location,
        c.score
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `contacts-${new Date().toISOString().split('T')[0]}.csv`;
      link.click();

      return { success: true };
    } catch (error) {
      console.error('❌ Erreur exportContactsToCSV:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new CRMService();
