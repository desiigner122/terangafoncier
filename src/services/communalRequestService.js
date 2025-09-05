import { supabase } from '@/lib/supabase';

/**
 * Service de gestion des demandes communales
 * Gère le business model et les revenus du secteur communal
 */
export class CommunalRequestService {
  
  // Types de demandes avec tarification
  static REQUEST_TYPES = {
    terrain_municipal: {
      title: "Terrain Municipal",
      basePrice: 50000,
      breakdown: {
        dossier: 15000,
        commission: 25000,
        instruction: 10000
      },
      commissionRate: 0.30 // 30% pour Teranga Foncier
    },
    permis_construire: {
      title: "Permis de Construire",
      basePrice: 90000,
      breakdown: {
        dossier: 20000,
        commission: 30000,
        geometre: 40000
      },
      commissionRate: 0.33 // 33% pour Teranga Foncier
    },
    terrain_agricole: {
      title: "Terrain Agricole",
      basePrice: 50000,
      breakdown: {
        dossier: 10000,
        commission: 15000,
        expertise: 25000
      },
      commissionRate: 0.30 // 30% pour Teranga Foncier
    }
  };

  // Plans d'abonnement mairies
  static SUBSCRIPTION_PLANS = {
    basic: {
      name: "Mairie Basic",
      monthlyPrice: 75000,
      maxRequests: 50,
      features: ['basic_interface', 'email_support', 'monthly_reports']
    },
    premium: {
      name: "Mairie Premium",
      monthlyPrice: 150000,
      maxRequests: -1, // Illimité
      features: ['advanced_dashboard', 'phone_support', 'geolocation', 'priority_processing']
    },
    enterprise: {
      name: "Mairie Enterprise", 
      monthlyPrice: 300000,
      maxRequests: -1, // Illimité
      features: ['api_integration', 'multi_users', 'dedicated_manager', 'custom_interface']
    }
  };

  /**
   * Créer une nouvelle demande communale
   */
  static async createCommunalRequest(requestData) {
    try {
      const { 
        type, 
        citizenId, 
        communeId, 
        description, 
        location,
        documents 
      } = requestData;

      // Validation du type de demande
      if (!this.REQUEST_TYPES[type]) {
        throw new Error(`Type de demande invalide: ${type}`);
      }

      const requestType = this.REQUEST_TYPES[type];
      
      // Calcul des montants
      const totalAmount = requestType.basePrice;
      const tfCommission = Math.round(totalAmount * requestType.commissionRate);
      const communeAmount = totalAmount - tfCommission;

      // Création de la demande
      const { data: request, error } = await supabase
        .from('communal_requests')
        .insert({
          type,
          citizen_id: citizenId,
          commune_id: communeId,
          description,
          location,
          status: 'en_attente',
          total_amount: totalAmount,
          tf_commission: tfCommission,
          commune_amount: communeAmount,
          documents: documents || [],
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Créer la transaction de paiement
      await this.createPaymentTransaction(request.id, totalAmount, requestType.breakdown);

      // Notifier la commune
      await this.notifyCommuneNewRequest(communeId, request.id);

      return {
        success: true,
        request,
        paymentBreakdown: requestType.breakdown,
        totalAmount
      };

    } catch (error) {
      console.error('Erreur création demande communale:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Créer transaction de paiement
   */
  static async createPaymentTransaction(requestId, amount, breakdown) {
    try {
      const { error } = await supabase
        .from('communal_payments')
        .insert({
          request_id: requestId,
          total_amount: amount,
          breakdown: breakdown,
          status: 'pending',
          payment_method: 'mobile_money',
          created_at: new Date().toISOString()
        });

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erreur création transaction:', error);
      return false;
    }
  }

  /**
   * Traiter le paiement d'une demande
   */
  static async processPayment(requestId, paymentData) {
    try {
      const { method, transactionId, phoneNumber } = paymentData;

      // Mettre à jour le statut de paiement
      const { error: paymentError } = await supabase
        .from('communal_payments')
        .update({
          status: 'completed',
          transaction_id: transactionId,
          phone_number: phoneNumber,
          paid_at: new Date().toISOString()
        })
        .eq('request_id', requestId);

      if (paymentError) throw paymentError;

      // Mettre à jour le statut de la demande
      const { error: requestError } = await supabase
        .from('communal_requests')
        .update({
          status: 'paye',
          paid_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (requestError) throw requestError;

      // Enregistrer les revenus
      await this.recordRevenue(requestId);

      return { success: true };
    } catch (error) {
      console.error('Erreur traitement paiement:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Enregistrer les revenus dans les analytics
   */
  static async recordRevenue(requestId) {
    try {
      // Récupérer les détails de la demande
      const { data: request } = await supabase
        .from('communal_requests')
        .select('*')
        .eq('id', requestId)
        .single();

      if (!request) return;

      // Enregistrer dans les revenus
      await supabase
        .from('revenue_analytics')
        .insert({
          source: 'communal_request',
          source_id: requestId,
          amount: request.tf_commission,
          category: 'commission',
          subcategory: request.type,
          commune_id: request.commune_id,
          date: new Date().toISOString().split('T')[0]
        });

      return true;
    } catch (error) {
      console.error('Erreur enregistrement revenus:', error);
      return false;
    }
  }

  /**
   * Abonner une commune à un plan
   */
  static async subscribeCommune(communeId, planType, duration = 12) {
    try {
      if (!this.SUBSCRIPTION_PLANS[planType]) {
        throw new Error(`Plan d'abonnement invalide: ${planType}`);
      }

      const plan = this.SUBSCRIPTION_PLANS[planType];
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(startDate.getMonth() + duration);

      const totalAmount = plan.monthlyPrice * duration;

      const { data: subscription, error } = await supabase
        .from('commune_subscriptions')
        .insert({
          commune_id: communeId,
          plan_type: planType,
          monthly_price: plan.monthlyPrice,
          max_requests: plan.maxRequests,
          features: plan.features,
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString(),
          total_amount: totalAmount,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;

      // Enregistrer le revenu d'abonnement
      await supabase
        .from('revenue_analytics')
        .insert({
          source: 'commune_subscription',
          source_id: subscription.id,
          amount: totalAmount,
          category: 'subscription',
          subcategory: planType,
          commune_id: communeId,
          date: new Date().toISOString().split('T')[0]
        });

      return {
        success: true,
        subscription,
        totalAmount
      };

    } catch (error) {
      console.error('Erreur abonnement commune:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Calculer les revenus communaux
   */
  static async calculateCommunalRevenue(period = 'month') {
    try {
      let dateFilter;
      const now = new Date();
      
      switch (period) {
        case 'day':
          dateFilter = now.toISOString().split('T')[0];
          break;
        case 'month':
          const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
          dateFilter = startOfMonth.toISOString().split('T')[0];
          break;
        case 'year':
          const startOfYear = new Date(now.getFullYear(), 0, 1);
          dateFilter = startOfYear.toISOString().split('T')[0];
          break;
      }

      // Revenus des commissions
      const { data: commissions } = await supabase
        .from('revenue_analytics')
        .select('amount')
        .eq('category', 'commission')
        .gte('date', dateFilter);

      // Revenus des abonnements
      const { data: subscriptions } = await supabase
        .from('revenue_analytics')
        .select('amount')
        .eq('category', 'subscription')
        .gte('date', dateFilter);

      const commissionTotal = commissions?.reduce((sum, r) => sum + r.amount, 0) || 0;
      const subscriptionTotal = subscriptions?.reduce((sum, r) => sum + r.amount, 0) || 0;

      return {
        commissions: commissionTotal,
        subscriptions: subscriptionTotal,
        total: commissionTotal + subscriptionTotal,
        period
      };

    } catch (error) {
      console.error('Erreur calcul revenus:', error);
      return {
        commissions: 0,
        subscriptions: 0,
        total: 0,
        period,
        error: error.message
      };
    }
  }

  /**
   * Obtenir les statistiques des demandes communales
   */
  static async getCommunalStats() {
    try {
      // Nombre total de demandes
      const { count: totalRequests } = await supabase
        .from('communal_requests')
        .select('*', { count: 'exact', head: true });

      // Demandes par statut
      const { data: statusStats } = await supabase
        .from('communal_requests')
        .select('status')
        .then(({ data }) => {
          const stats = {};
          data?.forEach(r => {
            stats[r.status] = (stats[r.status] || 0) + 1;
          });
          return { data: stats };
        });

      // Communes actives
      const { count: activeCommunes } = await supabase
        .from('commune_subscriptions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      // Revenus mensuels
      const monthlyRevenue = await this.calculateCommunalRevenue('month');

      return {
        totalRequests: totalRequests || 0,
        statusBreakdown: statusStats || {},
        activeCommunes: activeCommunes || 0,
        monthlyRevenue: monthlyRevenue.total,
        totalCommunes: 557 // Total communes au Sénégal
      };

    } catch (error) {
      console.error('Erreur statistiques communales:', error);
      return {
        totalRequests: 0,
        statusBreakdown: {},
        activeCommunes: 0,
        monthlyRevenue: 0,
        totalCommunes: 557,
        error: error.message
      };
    }
  }

  /**
   * Notifier une commune d'une nouvelle demande
   */
  static async notifyCommuneNewRequest(communeId, requestId) {
    try {
      // Créer notification pour la commune
      await supabase
        .from('notifications')
        .insert({
          recipient_type: 'commune',
          recipient_id: communeId,
          title: 'Nouvelle demande communale',
          message: `Une nouvelle demande (#${requestId}) nécessite votre attention`,
          type: 'new_request',
          data: { requestId },
          created_at: new Date().toISOString()
        });

      return true;
    } catch (error) {
      console.error('Erreur notification commune:', error);
      return false;
    }
  }

  /**
   * Valider une demande par la commune
   */
  static async validateRequest(requestId, communeUserId, decision, comments = '') {
    try {
      const status = decision === 'approve' ? 'approuve' : 'rejete';
      
      const { error } = await supabase
        .from('communal_requests')
        .update({
          status,
          validated_by: communeUserId,
          validation_comments: comments,
          validated_at: new Date().toISOString()
        })
        .eq('id', requestId);

      if (error) throw error;

      // Notifier le citoyen
      const { data: request } = await supabase
        .from('communal_requests')
        .select('citizen_id')
        .eq('id', requestId)
        .single();

      if (request) {
        await supabase
          .from('notifications')
          .insert({
            recipient_type: 'user',
            recipient_id: request.citizen_id,
            title: `Demande ${status}`,
            message: `Votre demande #${requestId} a été ${status}`,
            type: 'request_update',
            data: { requestId, status },
            created_at: new Date().toISOString()
          });
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur validation demande:', error);
      return { success: false, error: error.message };
    }
  }
}

export default CommunalRequestService;
