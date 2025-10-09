/**
 * EXTENSION NOTAIRESUPABASESERVICE - NOUVELLES MÉTHODES
 * À ajouter dans src/services/NotaireSupabaseService.js
 * 
 * Copier/coller ces méthodes à la fin de la classe NotaireSupabaseService
 * (avant le dernier accolade de fermeture de la classe)
 */

// =====================================================
// SUPPORT & TICKETS
// =====================================================

/**
 * Récupérer les tickets de support d'un utilisateur
 */
static async getSupportTickets(userId, filters = {}) {
  try {
    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        responses_count:support_ticket_responses(count),
        assigned_profile:profiles!support_tickets_assigned_to_fkey(
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    // Filtres
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.priority) query = query.eq('priority', filters.priority);
    if (filters.category) query = query.eq('category', filters.category);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getSupportTickets:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer un nouveau ticket de support
 */
static async createSupportTicket(userId, ticketData) {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert({
        user_id: userId,
        title: ticketData.title,
        description: ticketData.description,
        category: ticketData.category || 'question',
        priority: ticketData.priority || 'medium',
        tags: ticketData.tags || []
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Créer notification automatique
    await this.createNotification(userId, {
      title: 'Ticket créé',
      message: `Votre ticket "${ticketData.title}" a été créé et sera traité prochainement`,
      type: 'success',
      category: 'support'
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Erreur createSupportTicket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour un ticket de support
 */
static async updateSupportTicket(ticketId, updates) {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur updateSupportTicket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Répondre à un ticket de support
 */
static async respondToTicket(ticketId, userId, message, isStaff = false) {
  try {
    // Créer la réponse
    const { data: response, error: responseError } = await supabase
      .from('support_ticket_responses')
      .insert({
        ticket_id: ticketId,
        user_id: userId,
        message,
        is_staff: isStaff
      })
      .select()
      .single();
    
    if (responseError) throw responseError;
    
    // Mettre à jour le ticket
    await supabase
      .from('support_tickets')
      .update({
        status: isStaff ? 'in_progress' : 'waiting_response',
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId);
    
    return { success: true, data: response };
  } catch (error) {
    console.error('Erreur respondToTicket:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Fermer un ticket de support
 */
static async closeSupportTicket(ticketId) {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .update({
        status: 'closed',
        closed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', ticketId)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur closeSupportTicket:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// ABONNEMENTS & FACTURATION
// =====================================================

/**
 * Récupérer tous les plans d'abonnement
 */
static async getSubscriptionPlans() {
  try {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getSubscriptionPlans:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer l'abonnement actif d'un utilisateur
 */
static async getUserSubscription(userId) {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        plan:subscription_plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
    return { success: true, data: data || null };
  } catch (error) {
    console.error('Erreur getUserSubscription:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer un nouvel abonnement
 */
static async createSubscription(userId, planId, billingCycle = 'monthly') {
  try {
    // Récupérer le plan
    const { data: plan } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('id', planId)
      .single();
    
    if (!plan) throw new Error('Plan introuvable');
    
    // Calculer les dates
    const startDate = new Date();
    const endDate = new Date();
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    
    // Créer l'abonnement
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: planId,
        status: 'active',
        billing_cycle: billingCycle,
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
        next_billing_date: endDate.toISOString()
      })
      .select()
      .single();
    
    if (subError) throw subError;
    
    // Créer la facture
    const amount = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;
    await this.createInvoice(userId, subscription.id, amount, 'pending');
    
    return { success: true, data: subscription };
  } catch (error) {
    console.error('Erreur createSubscription:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Changer de plan d'abonnement
 */
static async changeSubscriptionPlan(userId, newPlanId) {
  try {
    // Récupérer l'abonnement actuel
    const { data: currentSub } = await this.getUserSubscription(userId);
    if (!currentSub) throw new Error('Aucun abonnement actif');
    
    // Mettre à jour l'abonnement
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({
        plan_id: newPlanId,
        updated_at: new Date().toISOString()
      })
      .eq('id', currentSub.id)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur changeSubscriptionPlan:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Annuler un abonnement
 */
static async cancelSubscription(subscriptionId, reason = '') {
  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancellation_reason: reason,
        cancelled_at: new Date().toISOString(),
        auto_renew: false
      })
      .eq('id', subscriptionId)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur cancelSubscription:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer les factures d'un utilisateur
 */
static async getInvoices(userId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getInvoices:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer une facture
 */
static async createInvoice(userId, subscriptionId, amount, status = 'pending') {
  try {
    // Générer numéro de facture
    const invoiceNumber = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const { data, error } = await supabase
      .from('invoices')
      .insert({
        user_id: userId,
        subscription_id: subscriptionId,
        invoice_number: invoiceNumber,
        amount,
        status,
        currency: 'XOF',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 jours
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur createInvoice:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// NOTIFICATIONS
// =====================================================

/**
 * Récupérer les notifications d'un utilisateur
 */
static async getNotifications(userId, filters = {}) {
  try {
    let query = supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (filters.is_read !== undefined) query = query.eq('is_read', filters.is_read);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.type) query = query.eq('type', filters.type);
    
    if (filters.limit) query = query.limit(filters.limit);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getNotifications:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer une notification
 */
static async createNotification(userId, notificationData) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: notificationData.title,
        message: notificationData.message,
        type: notificationData.type || 'info',
        category: notificationData.category || 'system',
        priority: notificationData.priority || 'normal',
        action_url: notificationData.action_url,
        action_label: notificationData.action_label,
        icon: notificationData.icon,
        metadata: notificationData.metadata || {}
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur createNotification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Marquer une notification comme lue
 */
static async markNotificationAsRead(notificationId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', notificationId)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur markNotificationAsRead:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Marquer toutes les notifications comme lues
 */
static async markAllNotificationsAsRead(userId) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({
        is_read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('is_read', false);
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur markAllNotificationsAsRead:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Supprimer une notification
 */
static async deleteNotification(notificationId) {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', notificationId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erreur deleteNotification:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer les préférences de notification
 */
static async getNotificationPreferences(userId) {
  try {
    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return { success: true, data: data || null };
  } catch (error) {
    console.error('Erreur getNotificationPreferences:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour les préférences de notification
 */
static async updateNotificationPreferences(userId, preferences) {
  try {
    const { data, error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: userId,
        ...preferences,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur updateNotificationPreferences:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// VISIOCONFÉRENCE
// =====================================================

/**
 * Récupérer les réunions vidéo d'un notaire
 */
static async getVideoMeetings(notaireId, filters = {}) {
  try {
    let query = supabase
      .from('video_meetings')
      .select('*')
      .eq('notaire_id', notaireId)
      .order('scheduled_at', { ascending: true });
    
    if (filters.status) query = query.eq('status', filters.status);
    if (filters.upcoming) {
      query = query.gte('scheduled_at', new Date().toISOString());
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getVideoMeetings:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer une réunion vidéo
 */
static async createVideoMeeting(notaireId, meetingData) {
  try {
    // Générer meeting_id unique
    const meetingId = `meet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const { data, error } = await supabase
      .from('video_meetings')
      .insert({
        notaire_id: notaireId,
        title: meetingData.title,
        description: meetingData.description,
        scheduled_at: meetingData.scheduled_at,
        duration_minutes: meetingData.duration_minutes || 60,
        meeting_id: meetingId,
        meeting_url: `https://meet.jit.si/${meetingId}`,
        provider: meetingData.provider || 'jitsi',
        participants: meetingData.participants || [],
        recording_enabled: meetingData.recording_enabled || false
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Créer notifications pour participants
    if (meetingData.participants && meetingData.participants.length > 0) {
      for (const participant of meetingData.participants) {
        if (participant.user_id) {
          await this.createNotification(participant.user_id, {
            title: 'Nouvelle réunion programmée',
            message: `Vous êtes invité à "${meetingData.title}" le ${new Date(meetingData.scheduled_at).toLocaleString('fr-FR')}`,
            type: 'info',
            category: 'meeting',
            action_url: `/notaire/visio`,
            action_label: 'Voir la réunion'
          });
        }
      }
    }
    
    return { success: true, data };
  } catch (error) {
    console.error('Erreur createVideoMeeting:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour une réunion vidéo
 */
static async updateVideoMeeting(meetingId, updates) {
  try {
    const { data, error } = await supabase
      .from('video_meetings')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', meetingId)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur updateVideoMeeting:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Supprimer une réunion vidéo
 */
static async deleteVideoMeeting(meetingId) {
  try {
    const { error } = await supabase
      .from('video_meetings')
      .delete()
      .eq('id', meetingId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erreur deleteVideoMeeting:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// E-LEARNING
// =====================================================

/**
 * Récupérer les cours e-learning
 */
static async getELearningCourses(filters = {}) {
  try {
    let query = supabase
      .from('elearning_courses')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.difficulty) query = query.eq('difficulty', filters.difficulty);
    if (filters.is_featured) query = query.eq('is_featured', true);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getELearningCourses:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer les inscriptions d'un utilisateur
 */
static async getUserEnrollments(userId) {
  try {
    const { data, error } = await supabase
      .from('course_enrollments')
      .select(`
        *,
        course:elearning_courses(*)
      `)
      .eq('user_id', userId)
      .order('enrolled_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getUserEnrollments:', error);
    return { success: false, error: error.message };
  }
}

/**
 * S'inscrire à un cours
 */
static async enrollInCourse(userId, courseId) {
  try {
    const { data, error } = await supabase
      .from('course_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        progress_percentage: 0
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Créer notification
    await this.createNotification(userId, {
      title: 'Inscription réussie',
      message: 'Vous êtes maintenant inscrit au cours',
      type: 'success',
      category: 'elearning'
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Erreur enrollInCourse:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour la progression d'un cours
 */
static async updateCourseProgress(enrollmentId, lessonId, progressData) {
  try {
    // Mettre à jour ou créer la progression de la leçon
    const { data: lessonProgress, error: progressError } = await supabase
      .from('course_progress')
      .upsert({
        enrollment_id: enrollmentId,
        lesson_id: lessonId,
        completed: progressData.completed || false,
        completed_at: progressData.completed ? new Date().toISOString() : null,
        time_spent_minutes: progressData.time_spent_minutes || 0,
        last_position_seconds: progressData.last_position_seconds || 0,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (progressError) throw progressError;
    
    // Calculer le pourcentage global
    const { data: allProgress } = await supabase
      .from('course_progress')
      .select('completed')
      .eq('enrollment_id', enrollmentId);
    
    if (allProgress) {
      const completedCount = allProgress.filter(p => p.completed).length;
      const totalCount = allProgress.length;
      const percentage = Math.round((completedCount / totalCount) * 100);
      
      // Mettre à jour l'inscription
      await supabase
        .from('course_enrollments')
        .update({
          progress_percentage: percentage,
          last_accessed_at: new Date().toISOString()
        })
        .eq('id', enrollmentId);
    }
    
    return { success: true, data: lessonProgress };
  } catch (error) {
    console.error('Erreur updateCourseProgress:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// MARKETPLACE
// =====================================================

/**
 * Récupérer les produits marketplace
 */
static async getMarketplaceProducts(filters = {}) {
  try {
    let query = supabase
      .from('marketplace_products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });
    
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.is_featured) query = query.eq('is_featured', true);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getMarketplaceProducts:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer une commande marketplace
 */
static async createMarketplaceOrder(userId, orderData) {
  try {
    // Générer numéro de commande
    const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    const { data, error } = await supabase
      .from('marketplace_orders')
      .insert({
        user_id: userId,
        order_number: orderNumber,
        total_amount: orderData.total_amount,
        items: orderData.items,
        status: 'pending',
        payment_method: orderData.payment_method
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur createMarketplaceOrder:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer les achats d'un utilisateur
 */
static async getUserPurchases(userId) {
  try {
    const { data, error } = await supabase
      .from('user_purchases')
      .select(`
        *,
        product:marketplace_products(*)
      `)
      .eq('user_id', userId)
      .order('purchased_at', { ascending: false });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getUserPurchases:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// API CADASTRE
// =====================================================

/**
 * Rechercher des données cadastrales
 */
static async searchCadastralData(userId, searchParams) {
  try {
    // Vérifier le cache d'abord
    if (searchParams.parcel_number) {
      const cached = await this.getCachedParcel(searchParams.parcel_number);
      if (cached.success && cached.data) {
        return { success: true, data: cached.data, cached: true };
      }
    }
    
    // TODO: Intégrer l'API Cadastre du Sénégal ici
    // Pour l'instant, simuler une recherche
    const mockResults = {
      parcels: [],
      count: 0
    };
    
    // Enregistrer la recherche
    const { data, error } = await supabase
      .from('cadastral_searches')
      .insert({
        user_id: userId,
        search_type: searchParams.search_type,
        search_query: searchParams,
        results: mockResults,
        results_count: mockResults.count,
        status: 'completed'
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data: mockResults };
  } catch (error) {
    console.error('Erreur searchCadastralData:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer une parcelle du cache
 */
static async getCachedParcel(parcelNumber) {
  try {
    const { data, error } = await supabase
      .from('cadastral_parcels_cache')
      .select('*')
      .eq('parcel_number', parcelNumber)
      .gte('cache_expires_at', new Date().toISOString())
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return { success: true, data: data || null };
  } catch (error) {
    console.error('Erreur getCachedParcel:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer l'historique des recherches cadastrales
 */
static async getCadastralSearchHistory(userId, limit = 10) {
  try {
    const { data, error } = await supabase
      .from('cadastral_searches')
      .select('*')
      .eq('user_id', userId)
      .order('searched_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getCadastralSearchHistory:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// MULTI-OFFICE
// =====================================================

/**
 * Récupérer les bureaux d'un notaire
 */
static async getNotaireOffices(notaireId) {
  try {
    const { data, error } = await supabase
      .from('notaire_offices')
      .select('*')
      .eq('notaire_id', notaireId)
      .order('is_primary', { ascending: false })
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getNotaireOffices:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer un bureau
 */
static async createOffice(notaireId, officeData) {
  try {
    // Générer slug
    const slug = officeData.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    const { data, error } = await supabase
      .from('notaire_offices')
      .insert({
        notaire_id: notaireId,
        name: officeData.name,
        slug: `${slug}-${Date.now()}`,
        address: officeData.address,
        city: officeData.city,
        phone: officeData.phone,
        email: officeData.email,
        manager_name: officeData.manager_name,
        is_primary: officeData.is_primary || false
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur createOffice:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Mettre à jour un bureau
 */
static async updateOffice(officeId, updates) {
  try {
    const { data, error } = await supabase
      .from('notaire_offices')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', officeId)
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur updateOffice:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Supprimer un bureau
 */
static async deleteOffice(officeId) {
  try {
    const { error } = await supabase
      .from('notaire_offices')
      .delete()
      .eq('id', officeId);
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Erreur deleteOffice:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// CENTRE D'AIDE
// =====================================================

/**
 * Récupérer les articles d'aide
 */
static async getHelpArticles(category = null) {
  try {
    let query = supabase
      .from('help_articles')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    
    if (category) query = query.eq('category', category);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getHelpArticles:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Rechercher dans les articles d'aide
 */
static async searchHelpArticles(searchQuery) {
  try {
    const { data, error } = await supabase
      .from('help_articles')
      .select('*')
      .eq('is_published', true)
      .or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
      .limit(10);
    
    if (error) throw error;
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur searchHelpArticles:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Récupérer les questions FAQ
 */
static async getFAQItems(category = null) {
  try {
    let query = supabase
      .from('faq_items')
      .select('*')
      .eq('is_published', true)
      .order('order_index', { ascending: true });
    
    if (category) query = query.eq('category', category);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getFAQItems:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Voter pour l'utilité d'un contenu
 */
static async voteHelpful(userId, contentType, contentId, isHelpful) {
  try {
    const { data, error } = await supabase
      .from('help_feedback')
      .upsert({
        user_id: userId,
        content_type: contentType,
        content_id: contentId,
        is_helpful: isHelpful
      })
      .select()
      .single();
    
    if (error) throw error;
    
    // Mettre à jour le compteur sur l'article/FAQ
    const tableName = contentType === 'article' ? 'help_articles' : 'faq_items';
    const fieldName = isHelpful ? 'helpful_count' : 'unhelpful_count';
    
    await supabase.rpc('increment_counter', {
      table_name: tableName,
      record_id: contentId,
      field_name: fieldName
    });
    
    return { success: true, data };
  } catch (error) {
    console.error('Erreur voteHelpful:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// FINANCIER
// =====================================================

/**
 * Récupérer les transactions financières
 */
static async getFinancialTransactions(notaireId, filters = {}) {
  try {
    let query = supabase
      .from('financial_transactions')
      .select('*')
      .eq('notaire_id', notaireId)
      .order('transaction_date', { ascending: false });
    
    if (filters.type) query = query.eq('transaction_type', filters.type);
    if (filters.category) query = query.eq('category', filters.category);
    if (filters.start_date) query = query.gte('transaction_date', filters.start_date);
    if (filters.end_date) query = query.lte('transaction_date', filters.end_date);
    
    const { data, error } = await query;
    if (error) throw error;
    
    return { success: true, data: data || [] };
  } catch (error) {
    console.error('Erreur getFinancialTransactions:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Créer une transaction financière
 */
static async createFinancialTransaction(notaireId, transactionData) {
  try {
    const { data, error } = await supabase
      .from('financial_transactions')
      .insert({
        notaire_id: notaireId,
        office_id: transactionData.office_id,
        transaction_type: transactionData.transaction_type,
        category: transactionData.category,
        amount: transactionData.amount,
        description: transactionData.description,
        transaction_date: transactionData.transaction_date || new Date().toISOString().split('T')[0],
        payment_method: transactionData.payment_method,
        status: 'completed'
      })
      .select()
      .single();
    
    if (error) throw error;
    return { success: true, data };
  } catch (error) {
    console.error('Erreur createFinancialTransaction:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Obtenir les statistiques financières
 */
static async getFinancialStats(notaireId, period = 'monthly') {
  try {
    // Calculer la date de début selon la période
    const startDate = new Date();
    if (period === 'monthly') {
      startDate.setMonth(startDate.getMonth() - 1);
    } else if (period === 'yearly') {
      startDate.setFullYear(startDate.getFullYear() - 1);
    }
    
    const { data: transactions, error } = await supabase
      .from('financial_transactions')
      .select('*')
      .eq('notaire_id', notaireId)
      .gte('transaction_date', startDate.toISOString().split('T')[0]);
    
    if (error) throw error;
    
    // Calculer les statistiques
    const stats = {
      total_revenue: transactions?.filter(t => t.transaction_type === 'revenue').reduce((sum, t) => sum + t.amount, 0) || 0,
      total_expenses: transactions?.filter(t => t.transaction_type === 'expense').reduce((sum, t) => sum + t.amount, 0) || 0,
      net_profit: 0,
      transaction_count: transactions?.length || 0,
      by_category: {}
    };
    
    stats.net_profit = stats.total_revenue - stats.total_expenses;
    
    // Grouper par catégorie
    transactions?.forEach(t => {
      if (!stats.by_category[t.category]) {
        stats.by_category[t.category] = 0;
      }
      stats.by_category[t.category] += t.transaction_type === 'revenue' ? t.amount : -t.amount;
    });
    
    return { success: true, data: stats };
  } catch (error) {
    console.error('Erreur getFinancialStats:', error);
    return { success: false, error: error.message };
  }
}

// =====================================================
// FIN DES NOUVELLES MÉTHODES
// =====================================================
