/**
 * ==========================================================
 * 🔔 TERANGA INTELLIGENT NOTIFICATIONS SERVICE
 * Service de notifications intelligentes avec push notifications
 * ==========================================================
 */

import { supabase } from '@/lib/supabaseClient';
import { terangaAIService } from './TerangaAIService.js';

class TerangaIntelligentNotifications {
  constructor() {
    // Utilise l'instance Supabase partagée
    this.supabase = supabase;

    // Configuration des notifications
    this.notificationConfig = {
      enablePushNotifications: true,
      enableEmailNotifications: true,
      enableSMSNotifications: false,
      intelligentFiltering: true,
      priorityLevels: ['low', 'medium', 'high', 'urgent'],
      categories: [
        'property_alert',
        'price_change',
        'document_verification',
        'fraud_alert',
        'system_update',
        'payment_reminder',
        'ai_insight',
        'blockchain_security'
      ]
    };

    // État du service
    this.isInitialized = false;
    this.pushSubscription = null;
    this.userPreferences = {};
    this.notificationQueue = [];
    
    // Statistiques
    this.stats = {
      totalSent: 0,
      deliveredCount: 0,
      openRate: 0,
      clickRate: 0
    };
  }

  /**
   * 🚀 Initialiser le service de notifications
   */
  async initialize(userId) {
    try {
      console.log('🔔 Initialisation service notifications...');
      
      this.userId = userId;
      
      // Charger les préférences utilisateur
      await this.loadUserPreferences();
      
      // Initialiser les push notifications si supportées
      if ('serviceWorker' in navigator && 'PushManager' in window) {
        await this.initializePushNotifications();
      }
      
      // Démarrer l'écoute des événements temps réel
      this.startRealtimeListeners();
      
      this.isInitialized = true;
      console.log('✅ Service notifications initialisé');
      
      return true;

    } catch (error) {
      console.error('❌ Erreur initialisation notifications:', error);
      throw error;
    }
  }

  /**
   * 📱 Initialiser les push notifications
   */
  async initializePushNotifications() {
    try {
      // Enregistrer le service worker
      const registration = await navigator.serviceWorker.register('/sw.js');
      
      // Demander permission pour les notifications
      const permission = await Notification.requestPermission();
      
      if (permission === 'granted') {
        // S'abonner aux push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            import.meta.env.VITE_VAPID_PUBLIC_KEY || 'demo-key'
          )
        });
        
        this.pushSubscription = subscription;
        
        // Sauvegarder la souscription
        await this.savePushSubscription(subscription);
        
        console.log('✅ Push notifications activées');
        return true;
      } else {
        console.log('⚠️ Permission notifications refusée');
        return false;
      }
      
    } catch (error) {
      console.error('❌ Erreur init push notifications:', error);
      return false;
    }
  }

  /**
   * 👤 Charger les préférences utilisateur
   */
  async loadUserPreferences() {
    try {
      const { data, error } = await this.supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', this.userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      this.userPreferences = data || {
        user_id: this.userId,
        push_enabled: true,
        email_enabled: true,
        sms_enabled: false,
        categories: {
          property_alert: true,
          price_change: true,
          document_verification: true,
          fraud_alert: true,
          system_update: false,
          payment_reminder: true,
          ai_insight: true,
          blockchain_security: true
        },
        quiet_hours: {
          start: '22:00',
          end: '08:00'
        },
        frequency_limits: {
          max_per_hour: 5,
          max_per_day: 20
        }
      };
      
      // Créer les préférences si elles n'existent pas
      if (!data) {
        await this.saveUserPreferences();
      }
      
    } catch (error) {
      console.error('❌ Erreur chargement préférences:', error);
    }
  }

  /**
   * 💾 Sauvegarder les préférences utilisateur
   */
  async saveUserPreferences() {
    try {
      const { error } = await this.supabase
        .from('notification_preferences')
        .upsert(this.userPreferences);
      
      if (error) throw error;
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde préférences:', error);
    }
  }

  /**
   * 📲 Sauvegarder la souscription push
   */
  async savePushSubscription(subscription) {
    try {
      const { error } = await this.supabase
        .from('push_subscriptions')
        .upsert({
          user_id: this.userId,
          subscription: subscription,
          created_at: new Date().toISOString()
        });
      
      if (error) throw error;
      
    } catch (error) {
      console.error('❌ Erreur sauvegarde subscription:', error);
    }
  }

  /**
   * ⚡ Démarrer l'écoute des événements temps réel
   */
  startRealtimeListeners() {
    // Écouter les nouveaux messages
    this.supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications',
        filter: `recipient_id=eq.${this.userId}`
      }, (payload) => {
        this.handleRealtimeNotification(payload.new);
      })
      .subscribe();

    // Écouter les changements de prix des propriétés suivies
    this.supabase
      .channel('price_alerts')
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'annonces'
      }, (payload) => {
        this.handlePriceChangeAlert(payload.old, payload.new);
      })
      .subscribe();

    // Écouter les alertes de sécurité blockchain
    this.supabase
      .channel('security_alerts')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'blockchain_sync_data',
        filter: 'document_type=eq.fraud_pattern'
      }, (payload) => {
        this.handleSecurityAlert(payload.new);
      })
      .subscribe();
  }

  /**
   * 🔔 Créer une notification intelligente
   */
  async createIntelligentNotification(data) {
    try {
      // Analyser le contexte avec l'IA
      const intelligentData = await this.analyzeNotificationContext(data);
      
      // Vérifier si la notification doit être envoyée
      const shouldSend = await this.shouldSendNotification(intelligentData);
      
      if (!shouldSend) {
        console.log('📵 Notification filtrée par l\'IA');
        return false;
      }

      // Personnaliser le contenu avec l'IA
      const personalizedContent = await this.personalizeContent(intelligentData);
      
      // Créer la notification
      const notification = {
        id: this.generateNotificationId(),
        user_id: this.userId,
        category: intelligentData.category,
        priority: intelligentData.priority,
        title: personalizedContent.title,
        message: personalizedContent.message,
        data: intelligentData.data,
        created_at: new Date().toISOString(),
        read: false,
        delivered: false,
        clicked: false,
        ai_score: intelligentData.aiScore,
        personalization_level: personalizedContent.personalizationLevel
      };

      // Sauvegarder en base
      await this.saveNotification(notification);
      
      // Envoyer selon les préférences
      await this.sendNotification(notification);
      
      return notification;

    } catch (error) {
      console.error('❌ Erreur création notification:', error);
      throw error;
    }
  }

  /**
   * 🤖 Analyser le contexte avec l'IA
   */
  async analyzeNotificationContext(data) {
    try {
      // Déterminer la priorité avec l'IA
      const priority = await this.determinePriority(data);
      
      // Calculer le score d'importance
      const aiScore = await this.calculateImportanceScore(data);
      
      // Déterminer le meilleur moment pour envoyer
      const optimalTiming = await this.findOptimalSendingTime();
      
      return {
        ...data,
        priority,
        aiScore,
        optimalTiming,
        category: data.category || 'general',
        personalizedContent: true
      };

    } catch (error) {
      console.error('❌ Erreur analyse IA:', error);
      return data;
    }
  }

  /**
   * 🎯 Déterminer la priorité avec l'IA
   */
  async determinePriority(data) {
    try {
      // Critères de priorité
      const priorityCriteria = {
        // Urgence élevée
        fraud_alert: 'urgent',
        security_breach: 'urgent',
        payment_overdue: 'high',
        
        // Priorité élevée
        price_drop_favorite: 'high',
        document_ready: 'high',
        transaction_complete: 'high',
        
        // Priorité moyenne
        property_match: 'medium',
        market_update: 'medium',
        ai_insight: 'medium',
        
        // Priorité faible
        newsletter: 'low',
        marketing: 'low',
        tip: 'low'
      };

      const basePriority = priorityCriteria[data.type] || 'medium';
      
      // Ajustement intelligent basé sur le comportement utilisateur
      const userBehavior = await this.getUserBehaviorPattern();
      
      if (userBehavior.highEngagement && basePriority === 'low') {
        return 'medium';
      }
      
      if (userBehavior.lowEngagement && basePriority === 'high') {
        return 'medium';
      }
      
      return basePriority;

    } catch (error) {
      console.error('❌ Erreur détermination priorité:', error);
      return 'medium';
    }
  }

  /**
   * 📊 Calculer le score d'importance
   */
  async calculateImportanceScore(data) {
    try {
      let score = 0;
      
      // Facteurs de base
      const typeScores = {
        'fraud_alert': 100,
        'security_breach': 95,
        'payment_overdue': 85,
        'price_drop_favorite': 80,
        'document_ready': 75,
        'property_match': 70,
        'transaction_complete': 70,
        'market_update': 50,
        'ai_insight': 45,
        'newsletter': 20,
        'marketing': 15
      };
      
      score += typeScores[data.type] || 50;
      
      // Personnalisation basée sur l'activité
      const userActivity = await this.getUserActivityLevel();
      if (userActivity === 'high') score += 15;
      if (userActivity === 'low') score -= 10;
      
      // Facteur temporel
      const timeRelevance = this.calculateTimeRelevance(data);
      score *= timeRelevance;
      
      // Normaliser entre 0 et 100
      return Math.min(100, Math.max(0, score));

    } catch (error) {
      console.error('❌ Erreur calcul score:', error);
      return 50;
    }
  }

  /**
   * ⏰ Trouver le moment optimal d'envoi
   */
  async findOptimalSendingTime() {
    try {
      // Analyser les patterns d'activité utilisateur
      const { data: activityData } = await this.supabase
        .from('user_activity_log')
        .select('timestamp')
        .eq('user_id', this.userId)
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (!activityData || activityData.length === 0) {
        return { immediate: true, optimal: new Date() };
      }
      
      // Calculer les heures d'activité préférées
      const hourActivity = {};
      activityData.forEach(activity => {
        const hour = new Date(activity.timestamp).getHours();
        hourActivity[hour] = (hourActivity[hour] || 0) + 1;
      });
      
      // Trouver les heures de pic
      const peakHours = Object.entries(hourActivity)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));
      
      const currentHour = new Date().getHours();
      const isOptimalTime = peakHours.includes(currentHour);
      
      return {
        immediate: isOptimalTime,
        optimal: isOptimalTime ? new Date() : this.getNextOptimalTime(peakHours),
        peakHours
      };

    } catch (error) {
      console.error('❌ Erreur calcul timing optimal:', error);
      return { immediate: true, optimal: new Date() };
    }
  }

  /**
   * 🎨 Personnaliser le contenu
   */
  async personalizeContent(data) {
    try {
      // Récupérer le profil utilisateur
      const userProfile = await this.getUserProfile();
      
      // Templates personnalisés
      const templates = {
        property_alert: {
          formal: {
            title: "Nouvelle propriété correspondant à vos critères",
            message: "Une propriété de {surface} m² à {location} est disponible pour {price} FCFA."
          },
          casual: {
            title: "🏠 Nouveau bien qui pourrait vous intéresser !",
            message: "Salut {firstName} ! J'ai trouvé un {propertyType} de {surface} m² à {location} pour {price} FCFA. Ça vous tente ?"
          },
          professional: {
            title: "Opportunité d'investissement - {location}",
            message: "Investissement potentiel : {propertyType} {surface} m² à {location}. ROI estimé : {roi}%. Analyse complète disponible."
          }
        },
        price_change: {
          formal: {
            title: "Changement de prix - Propriété surveillée",
            message: "Le prix de la propriété à {location} est passé de {oldPrice} à {newPrice} FCFA."
          },
          casual: {
            title: "💰 Baisse de prix sur votre propriété favorite !",
            message: "Bonne nouvelle {firstName} ! Le prix à {location} a baissé de {priceChange} FCFA !"
          }
        },
        ai_insight: {
          formal: {
            title: "Analyse de marché - {location}",
            message: "Notre IA prédit une {trend} des prix de {percentage}% à {location} dans les 3 prochains mois."
          },
          casual: {
            title: "🤖 Conseil IA personnalisé",
            message: "Psst {firstName} ! Notre IA pense que c'est {timing} pour {action} à {location}. Confidence : {confidence}%"
          }
        }
      };
      
      // Déterminer le style de communication
      const communicationStyle = userProfile.communication_style || 'casual';
      const template = templates[data.category]?.[communicationStyle] || templates[data.category]?.casual;
      
      if (!template) {
        return {
          title: data.title || 'Nouvelle notification',
          message: data.message || 'Vous avez reçu une nouvelle notification.',
          personalizationLevel: 'none'
        };
      }
      
      // Remplacer les variables
      const personalizedTitle = this.replaceVariables(template.title, { ...data.data, ...userProfile });
      const personalizedMessage = this.replaceVariables(template.message, { ...data.data, ...userProfile });
      
      return {
        title: personalizedTitle,
        message: personalizedMessage,
        personalizationLevel: 'high'
      };

    } catch (error) {
      console.error('❌ Erreur personnalisation contenu:', error);
      return {
        title: data.title || 'Nouvelle notification',
        message: data.message || 'Notification',
        personalizationLevel: 'none'
      };
    }
  }

  /**
   * ✅ Vérifier si la notification doit être envoyée
   */
  async shouldSendNotification(data) {
    try {
      // Vérifier les préférences utilisateur
      if (!this.userPreferences.categories[data.category]) {
        return false;
      }

      // Vérifier les heures de silence
      if (!this.isWithinActiveHours()) {
        return false;
      }

      // Vérifier les limites de fréquence
      if (!(await this.checkFrequencyLimits())) {
        return false;
      }

      // Vérifier le score IA minimum
      if (data.aiScore < 30) {
        return false;
      }

      // Filtre anti-spam intelligent
      if (await this.isLikelySpam(data)) {
        return false;
      }

      return true;

    } catch (error) {
      console.error('❌ Erreur vérification envoi:', error);
      return false;
    }
  }

  /**
   * 📤 Envoyer la notification
   */
  async sendNotification(notification) {
    try {
      const promises = [];

      // Push notification
      if (this.userPreferences.push_enabled && this.pushSubscription) {
        promises.push(this.sendPushNotification(notification));
      }

      // Email notification
      if (this.userPreferences.email_enabled && notification.priority !== 'low') {
        promises.push(this.sendEmailNotification(notification));
      }

      // SMS notification (urgences seulement)
      if (this.userPreferences.sms_enabled && notification.priority === 'urgent') {
        promises.push(this.sendSMSNotification(notification));
      }

      const results = await Promise.allSettled(promises);
      
      // Mettre à jour le statut
      const delivered = results.some(result => result.status === 'fulfilled');
      await this.updateNotificationStatus(notification.id, { delivered });

      this.stats.totalSent++;
      if (delivered) this.stats.deliveredCount++;

      console.log(`✅ Notification ${notification.id} envoyée`);
      return true;

    } catch (error) {
      console.error('❌ Erreur envoi notification:', error);
      return false;
    }
  }

  /**
   * 📱 Envoyer push notification
   */
  async sendPushNotification(notification) {
    try {
      if (!this.pushSubscription) {
        throw new Error('Pas de subscription push');
      }

      const pushData = {
        title: notification.title,
        body: notification.message,
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        data: {
          id: notification.id,
          category: notification.category,
          url: notification.data?.url || '/dashboard'
        },
        actions: [
          {
            action: 'view',
            title: 'Voir',
            icon: '/view-icon.png'
          },
          {
            action: 'dismiss',
            title: 'Ignorer'
          }
        ]
      };

      // Simuler l'envoi (en production, utiliser un service push comme FCM)
      console.log('📱 Push notification:', pushData);
      
      // Envoyer via le service worker
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(pushData.title, pushData);
      }

      return true;

    } catch (error) {
      console.error('❌ Erreur push notification:', error);
      throw error;
    }
  }

  /**
   * 📧 Envoyer notification email
   */
  async sendEmailNotification(notification) {
    try {
      // En production, utiliser un service d'email comme SendGrid, Mailgun, etc.
      console.log('📧 Email notification:', {
        to: this.userPreferences.email,
        subject: notification.title,
        body: notification.message
      });

      // Simuler l'envoi
      return new Promise(resolve => setTimeout(resolve, 1000));

    } catch (error) {
      console.error('❌ Erreur email notification:', error);
      throw error;
    }
  }

  /**
   * 💬 Envoyer notification SMS
   */
  async sendSMSNotification(notification) {
    try {
      // En production, utiliser un service SMS comme Twilio
      console.log('💬 SMS notification:', {
        to: this.userPreferences.phone,
        message: `${notification.title}: ${notification.message}`
      });

      // Simuler l'envoi
      return new Promise(resolve => setTimeout(resolve, 500));

    } catch (error) {
      console.error('❌ Erreur SMS notification:', error);
      throw error;
    }
  }

  /**
   * 🔧 Méthodes utilitaires
   */
  generateNotificationId() {
    return 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  async saveNotification(notification) {
    const { error } = await this.supabase
      .from('notifications')
      .insert(notification);
    
    if (error) throw error;
  }

  async updateNotificationStatus(id, updates) {
    const { error } = await this.supabase
      .from('notifications')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  }

  replaceVariables(template, variables) {
    return template.replace(/{(\w+)}/g, (match, key) => {
      return variables[key] || match;
    });
  }

  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * 📊 Gestionnaires d'événements temps réel
   */
  async handleRealtimeNotification(notification) {
    if (this.isInitialized) {
      await this.sendNotification(notification);
    }
  }

  async handlePriceChangeAlert(oldData, newData) {
    if (oldData.price !== newData.price) {
      await this.createIntelligentNotification({
        type: 'price_change',
        category: 'price_change',
        data: {
          propertyId: newData.id,
          location: newData.location,
          oldPrice: oldData.price,
          newPrice: newData.price,
          priceChange: Math.abs(newData.price - oldData.price),
          changeType: newData.price > oldData.price ? 'increase' : 'decrease'
        }
      });
    }
  }

  async handleSecurityAlert(alertData) {
    await this.createIntelligentNotification({
      type: 'security_breach',
      category: 'blockchain_security',
      priority: 'urgent',
      data: {
        alertType: alertData.document_type,
        details: alertData.details,
        timestamp: alertData.sync_timestamp
      }
    });
  }

  /**
   * 📈 Obtenir les statistiques
   */
  getStats() {
    return {
      ...this.stats,
      openRate: this.stats.totalSent > 0 ? (this.stats.openRate / this.stats.totalSent * 100).toFixed(1) : 0,
      clickRate: this.stats.totalSent > 0 ? (this.stats.clickRate / this.stats.totalSent * 100).toFixed(1) : 0,
      deliveryRate: this.stats.totalSent > 0 ? (this.stats.deliveredCount / this.stats.totalSent * 100).toFixed(1) : 0
    };
  }
}

// Instance singleton
export const intelligentNotifications = new TerangaIntelligentNotifications();
export default TerangaIntelligentNotifications;
