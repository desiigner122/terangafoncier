/**
 * UnifiedCaseTrackingService.js
 * 
 * Service unifié pour gérer le suivi de dossier d'achat avec TOUS les acteurs:
 * - Acheteur (Buyer)
 * - Vendeur (Seller) 
 * - Notaire
 * - Agent Foncier (FACULTATIF)
 * - Géomètre (FACULTATIF)
 * 
 * Détecte automatiquement le rôle de l'utilisateur et adapte les données/permissions
 */

import { supabase } from './supabaseClient';

class UnifiedCaseTrackingService {
  
  /**
   * Résoudre un case_number ou UUID en UUID réel
   * @param {string} caseIdentifier - UUID ou case_number (ex: TF-20251021-0002)
   * @returns {Promise<string|null>} - UUID du dossier ou null
   */
  async resolveCaseId(caseIdentifier) {
    try {
      // Si c'est déjà un UUID (format: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      if (uuidRegex.test(caseIdentifier)) {
        return caseIdentifier;
      }

      // Sinon, c'est un case_number, on cherche l'UUID
      const { data, error } = await supabase
        .from('purchase_cases')
        .select('id')
        .eq('case_number', caseIdentifier)
        .single();

      if (error || !data) {
        console.error('Dossier introuvable avec case_number:', caseIdentifier, error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Erreur resolveCaseId:', error);
      return null;
    }
  }

  /**
   * Détecter le rôle de l'utilisateur dans un dossier spécifique
   * @param {string} caseIdentifier - UUID ou case_number du dossier
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<string|null>} - 'buyer', 'seller', 'notaire', 'agent', 'geometre', ou null
   */
  async detectUserRole(caseIdentifier, userId) {
    try {
      // Résoudre le case_number en UUID si nécessaire
      const caseId = await this.resolveCaseId(caseIdentifier);
      if (!caseId) return null;

      const { data: purchaseCase, error } = await supabase
        .from('purchase_cases')
        .select('buyer_id, seller_id, notaire_id, agent_foncier_id, geometre_id')
        .eq('id', caseId)
        .single();

      if (error) throw error;
      if (!purchaseCase) return null;

      // Vérifier le rôle
      if (purchaseCase.buyer_id === userId) return 'buyer';
      if (purchaseCase.seller_id === userId) return 'seller';
      if (purchaseCase.notaire_id === userId) return 'notaire';
      if (purchaseCase.agent_foncier_id === userId) return 'agent';
      if (purchaseCase.geometre_id === userId) return 'geometre';

      return null; // Utilisateur pas impliqué dans ce dossier
    } catch (error) {
      console.error('Erreur détection rôle:', error);
      return null;
    }
  }

  /**
   * Récupérer toutes les informations du dossier avec tous les participants
   * @param {string} caseIdentifier - UUID ou case_number du dossier
   * @param {string} userId - ID de l'utilisateur connecté
   * @returns {Promise<Object>} - Objet complet avec dossier, participants, permissions
   */
  async getCaseWithAllParticipants(caseIdentifier, userId) {
    try {
      // 0. Résoudre le case_number en UUID si nécessaire
      const caseId = await this.resolveCaseId(caseIdentifier);
      if (!caseId) {
        throw new Error('Dossier introuvable');
      }

      // 1. Détecter le rôle
      const userRole = await this.detectUserRole(caseId, userId);
      if (!userRole) {
        throw new Error('Vous n\'êtes pas autorisé à voir ce dossier');
      }

      // 2. Récupérer le dossier complet
      const { data: purchaseCase, error: caseError } = await supabase
        .from('purchase_cases')
        .select(`
          *,
          buyer:buyer_id (
            id,
            full_name,
            email,
            phone,
            avatar_url
          ),
          seller:seller_id (
            id,
            full_name,
            email,
            phone,
            avatar_url
          ),
          notaire:notaire_id (
            id,
            full_name,
            email,
            phone,
            avatar_url
          ),
          agent:agent_foncier_id (
            id,
            full_name,
            email,
            phone,
            avatar_url
          ),
          geometre:geometre_id (
            id,
            full_name,
            email,
            phone,
            avatar_url
          ),
          parcelle:parcelle_id (*)
        `)
        .eq('id', caseId)
        .single();

      if (caseError) throw caseError;

      // 3. Récupérer profils détaillés (notaire, agent, géomètre)
      let notaireProfile = null;
      let agentProfile = null;
      let geometreProfile = null;

      if (purchaseCase.notaire_id) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', purchaseCase.notaire_id)
          .eq('role', 'notaire')
          .single();
        notaireProfile = data;
      }

      if (purchaseCase.agent_foncier_id && purchaseCase.has_agent) {
        const { data } = await supabase
          .from('agent_foncier_profiles')
          .select('*')
          .eq('id', purchaseCase.agent_foncier_id)
          .single();
        agentProfile = data;
      }

      if (purchaseCase.geometre_id && purchaseCase.has_surveying) {
        const { data } = await supabase
          .from('geometre_profiles')
          .select('*')
          .eq('id', purchaseCase.geometre_id)
          .single();
        geometreProfile = data;
      }

      // 4. Récupérer la mission de bornage si applicable
      let surveyingMission = null;
      if (purchaseCase.has_surveying) {
        const { data } = await supabase
          .from('surveying_missions')
          .select('*')
          .eq('case_id', caseId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        surveyingMission = data;
      }

      // 5. Calculer les permissions selon le rôle
      const permissions = this.calculatePermissions(userRole, purchaseCase);

      // 6. Retourner l'objet complet
      return {
        purchaseCase,
        userRole,
        participants: {
          buyer: purchaseCase.buyer,
          seller: purchaseCase.seller,
          notaire: purchaseCase.notaire,
          agent: purchaseCase.agent,
          geometre: purchaseCase.geometre
        },
        profiles: {
          notaire: notaireProfile,
          agent: agentProfile,
          geometre: geometreProfile
        },
        surveyingMission,
        permissions,
        hasAgent: purchaseCase.has_agent,
        hasSurveying: purchaseCase.has_surveying
      };

    } catch (error) {
      console.error('Erreur getCaseWithAllParticipants:', error);
      throw error;
    }
  }

  /**
   * Calculer les permissions selon le rôle
   * @param {string} userRole - Rôle de l'utilisateur
   * @param {Object} purchaseCase - Données du dossier
   * @returns {Object} - Objet des permissions
   */
  calculatePermissions(userRole, purchaseCase) {
    const basePermissions = {
      canViewCase: true,
      canSendMessage: true,
      canViewDocuments: true,
      canViewTimeline: true,
      canViewPayments: false,
      canUploadDocument: false,
      canEditCase: false,
      canApproveNotaire: false,
      canChooseAgent: false,
      canRequestSurveying: false,
      canValidateContract: false,
      canConfirmPayment: false,
      canGenerateContract: false,
      canVerifyDocuments: false,
      canScheduleAppointment: false,
      canAcceptMission: false,
      canUploadSurveyingResults: false
    };

    switch (userRole) {
      case 'buyer':
        return {
          ...basePermissions,
          canViewPayments: true,
          canUploadDocument: true,
          canApproveNotaire: !purchaseCase.notaire_id,
          canChooseAgent: !purchaseCase.has_agent,
          canRequestSurveying: !purchaseCase.has_surveying,
          canConfirmPayment: true
        };

      case 'seller':
        return {
          ...basePermissions,
          canViewPayments: true,
          canUploadDocument: true,
          canApproveNotaire: !purchaseCase.notaire_id,
          canValidateContract: ['contract_draft', 'contract_review'].includes(purchaseCase.status),
          canConfirmPayment: true
        };

      case 'notaire':
        return {
          ...basePermissions,
          canViewPayments: true,
          canUploadDocument: true,
          canEditCase: true,
          canGenerateContract: ['document_audit', 'contract_preparation'].includes(purchaseCase.status),
          canVerifyDocuments: true,
          canScheduleAppointment: true,
          canValidateContract: true
        };

      case 'agent':
        return {
          ...basePermissions,
          canViewPayments: true,
          canUploadDocument: true,
          canScheduleAppointment: true
        };

      case 'geometre':
        return {
          ...basePermissions,
          canAcceptMission: true,
          canUploadSurveyingResults: true,
          canScheduleAppointment: true
        };

      default:
        return basePermissions;
    }
  }

  /**
   * L'acheteur choisit un agent foncier
   * @param {string} caseId - ID du dossier
   * @param {string} agentId - ID de l'agent choisi
   * @param {number} commissionRate - Taux de commission négocié (%)
   * @returns {Promise<Object>}
   */
  async chooseAgent(caseId, agentId, commissionRate = 5.0) {
    try {
      // 1. Vérifier que l'agent existe et est disponible
      const { data: agent, error: agentError } = await supabase
        .from('agent_foncier_profiles')
        .select('*')
        .eq('id', agentId)
        .single();

      if (agentError || !agent) {
        throw new Error('Agent introuvable');
      }

      if (!agent.is_available) {
        throw new Error('Cet agent n\'est pas disponible actuellement');
      }

      // 2. Récupérer le prix de la parcelle pour calculer la commission
      const { data: purchaseCase } = await supabase
        .from('purchase_cases')
        .select('final_price, parcelle:parcelle_id(price)')
        .eq('id', caseId)
        .single();

      const price = purchaseCase.final_price || purchaseCase.parcelle?.price || 0;
      const commission = price * (commissionRate / 100);

      // 3. Assigner l'agent au dossier
      const { data, error } = await supabase
        .from('purchase_cases')
        .update({
          agent_foncier_id: agentId,
          has_agent: true,
          agent_assigned_at: new Date().toISOString(),
          agent_commission: commission,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur chooseAgent:', error);
      throw error;
    }
  }

  /**
   * L'acheteur demande un bornage par géomètre
   * @param {string} caseId - ID du dossier
   * @param {string} geometreId - ID du géomètre choisi
   * @param {string} missionType - Type de mission ('complete', 'bornage', 'plan', etc.)
   * @returns {Promise<Object>}
   */
  async requestSurveying(caseId, geometreId, missionType = 'complete') {
    try {
      // 1. Vérifier que le géomètre existe et est disponible
      const { data: geometre, error: geometreError } = await supabase
        .from('geometre_profiles')
        .select('*')
        .eq('id', geometreId)
        .single();

      if (geometreError || !geometre) {
        throw new Error('Géomètre introuvable');
      }

      if (!geometre.is_available) {
        throw new Error('Ce géomètre n\'est pas disponible actuellement');
      }

      // 2. Récupérer les infos du dossier
      const { data: purchaseCase } = await supabase
        .from('purchase_cases')
        .select('buyer_id, parcelle_id')
        .eq('id', caseId)
        .single();

      // 3. Calculer le tarif selon le type de mission
      let quotedFee = 0;
      switch (missionType) {
        case 'complete':
          quotedFee = geometre.complete_mission_fee || 150000;
          break;
        case 'bornage':
          quotedFee = geometre.bornage_fee || 100000;
          break;
        case 'plan':
          quotedFee = geometre.plan_fee || 50000;
          break;
        case 'certificat':
          quotedFee = geometre.certificate_fee || 30000;
          break;
        default:
          quotedFee = geometre.complete_mission_fee || 150000;
      }

      // 4. Créer la mission de bornage
      const { data: mission, error: missionError } = await supabase
        .from('surveying_missions')
        .insert({
          case_id: caseId,
          geometre_id: geometreId,
          parcelle_id: purchaseCase.parcelle_id,
          requested_by: purchaseCase.buyer_id,
          mission_type: missionType,
          status: 'pending',
          quoted_fee: quotedFee,
          requested_at: new Date().toISOString()
        })
        .select()
        .single();

      if (missionError) throw missionError;

      // 5. Mettre à jour le dossier
      const { data: updatedCase, error: updateError } = await supabase
        .from('purchase_cases')
        .update({
          geometre_id: geometreId,
          has_surveying: true,
          geometre_assigned_at: new Date().toISOString(),
          geometre_fees: quotedFee,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId)
        .select()
        .single();

      if (updateError) throw updateError;

      return { success: true, mission, purchaseCase: updatedCase };
    } catch (error) {
      console.error('Erreur requestSurveying:', error);
      throw error;
    }
  }

  /**
   * Rechercher des agents disponibles
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise<Array>}
   */
  async searchAvailableAgents(filters = {}) {
    try {
      let query = supabase
        .from('agent_foncier_profiles')
        .select(`
          *,
          profile:id (
            id,
            full_name,
            avatar_url,
            email,
            phone
          )
        `)
        .eq('is_available', true)
        .eq('is_verified', true);

      // Filtre par région
      if (filters.region) {
        query = query.eq('agency_region', filters.region);
      }

      // Filtre par rating minimum
      if (filters.minRating) {
        query = query.gte('rating', filters.minRating);
      }

      // Ordre: meilleur rating d'abord, puis moins de dossiers actifs
      query = query
        .order('rating', { ascending: false })
        .order('active_cases_count', { ascending: true })
        .limit(filters.limit || 10);

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erreur searchAvailableAgents:', error);
      return [];
    }
  }

  /**
   * Rechercher des géomètres disponibles
   * @param {Object} filters - Filtres de recherche
   * @returns {Promise<Array>}
   */
  async searchAvailableGeometres(filters = {}) {
    try {
      let query = supabase
        .from('geometre_profiles')
        .select(`
          *,
          profile:id (
            id,
            full_name,
            avatar_url,
            email,
            phone
          )
        `)
        .eq('is_available', true)
        .eq('is_verified', true);

      // Filtre par rating minimum
      if (filters.minRating) {
        query = query.gte('rating', filters.minRating);
      }

      // Filtre par équipement
      if (filters.hasDrone) {
        query = query.eq('has_drone', true);
      }

      // Ordre: meilleur rating d'abord, puis moins de missions actives
      query = query
        .order('rating', { ascending: false })
        .order('active_missions_count', { ascending: true })
        .limit(filters.limit || 10);

      const { data, error } = await query;
      if (error) throw error;

      return data || [];
    } catch (error) {
      console.error('Erreur searchAvailableGeometres:', error);
      return [];
    }
  }

  /**
   * Le géomètre accepte une mission
   * @param {string} missionId - ID de la mission
   * @param {Date} scheduledDate - Date prévue pour la visite terrain
   * @returns {Promise<Object>}
   */
  async acceptSurveyingMission(missionId, scheduledDate = null) {
    try {
      const updateData = {
        status: 'accepted',
        accepted_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      if (scheduledDate) {
        updateData.scheduled_date = scheduledDate;
      }

      const { data, error } = await supabase
        .from('surveying_missions')
        .update(updateData)
        .eq('id', missionId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur acceptSurveyingMission:', error);
      throw error;
    }
  }

  /**
   * Le géomètre décline une mission
   * @param {string} missionId - ID de la mission
   * @param {string} reason - Raison du refus
   * @returns {Promise<Object>}
   */
  async declineSurveyingMission(missionId, reason = '') {
    try {
      const { data, error } = await supabase
        .from('surveying_missions')
        .update({
          status: 'declined',
          geometre_notes: reason,
          updated_at: new Date().toISOString()
        })
        .eq('id', missionId)
        .select()
        .single();

      if (error) throw error;

      // Libérer le géomètre du dossier
      const { data: mission } = await supabase
        .from('surveying_missions')
        .select('case_id')
        .eq('id', missionId)
        .single();

      if (mission) {
        await supabase
          .from('purchase_cases')
          .update({
            geometre_id: null,
            has_surveying: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', mission.case_id);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur declineSurveyingMission:', error);
      throw error;
    }
  }

  /**
   * Uploader les résultats du bornage
   * @param {string} missionId - ID de la mission
   * @param {Object} results - Résultats du bornage
   * @returns {Promise<Object>}
   */
  async uploadSurveyingResults(missionId, results) {
    try {
      const { data, error } = await supabase
        .from('surveying_missions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          plan_url: results.planUrl,
          certificate_url: results.certificateUrl,
          photos_urls: results.photosUrls || [],
          gps_coordinates: results.gpsCoordinates,
          surface_measured: results.surfaceMeasured,
          perimeter_measured: results.perimeterMeasured,
          final_fee: results.finalFee,
          geometre_notes: results.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', missionId)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le dossier
      const { data: mission } = await supabase
        .from('surveying_missions')
        .select('case_id')
        .eq('id', missionId)
        .single();

      if (mission) {
        await supabase
          .from('purchase_cases')
          .update({
            surveying_completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', mission.case_id);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur uploadSurveyingResults:', error);
      throw error;
    }
  }

  /**
   * Créer une review pour un agent
   * @param {string} agentId - ID de l'agent
   * @param {string} caseId - ID du dossier
   * @param {string} reviewerId - ID du reviewer
   * @param {string} reviewerRole - 'buyer' ou 'seller'
   * @param {Object} reviewData - Données de la review
   * @returns {Promise<Object>}
   */
  async createAgentReview(agentId, caseId, reviewerId, reviewerRole, reviewData) {
    try {
      const { data, error } = await supabase
        .from('agent_reviews')
        .insert({
          agent_id: agentId,
          case_id: caseId,
          reviewer_id: reviewerId,
          reviewer_role: reviewerRole,
          rating: reviewData.rating,
          communication_rating: reviewData.communicationRating,
          professionalism_rating: reviewData.professionalismRating,
          responsiveness_rating: reviewData.responsivenessRating,
          negotiation_skills_rating: reviewData.negotiationSkillsRating,
          comment: reviewData.comment,
          would_recommend: reviewData.wouldRecommend
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur createAgentReview:', error);
      throw error;
    }
  }

  /**
   * Créer une review pour un géomètre
   * @param {string} geometreId - ID du géomètre
   * @param {string} missionId - ID de la mission
   * @param {string} reviewerId - ID du reviewer
   * @param {Object} reviewData - Données de la review
   * @returns {Promise<Object>}
   */
  async createGeometreReview(geometreId, missionId, reviewerId, reviewData) {
    try {
      const { data, error } = await supabase
        .from('geometre_reviews')
        .insert({
          geometre_id: geometreId,
          mission_id: missionId,
          reviewer_id: reviewerId,
          rating: reviewData.rating,
          accuracy_rating: reviewData.accuracyRating,
          professionalism_rating: reviewData.professionalismRating,
          timeliness_rating: reviewData.timelinessRating,
          communication_rating: reviewData.communicationRating,
          comment: reviewData.comment,
          would_recommend: reviewData.wouldRecommend
        })
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur createGeometreReview:', error);
      throw error;
    }
  }

  /**
   * Récupérer toutes les reviews d'un agent
   * @param {string} agentId - ID de l'agent
   * @returns {Promise<Array>}
   */
  async getAgentReviews(agentId) {
    try {
      const { data, error } = await supabase
        .from('agent_reviews')
        .select(`
          *,
          reviewer:reviewer_id (
            full_name,
            avatar_url
          )
        `)
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur getAgentReviews:', error);
      return [];
    }
  }

  /**
   * Récupérer toutes les reviews d'un géomètre
   * @param {string} geometreId - ID du géomètre
   * @returns {Promise<Array>}
   */
  async getGeometreReviews(geometreId) {
    try {
      const { data, error } = await supabase
        .from('geometre_reviews')
        .select(`
          *,
          reviewer:reviewer_id (
            full_name,
            avatar_url
          )
        `)
        .eq('geometre_id', geometreId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erreur getGeometreReviews:', error);
      return [];
    }
  }

  /**
   * Confirmer le paiement de la commission agent
   * @param {string} caseId - ID du dossier
   * @returns {Promise<Object>}
   */
  async confirmAgentCommissionPayment(caseId) {
    try {
      const { data, error } = await supabase
        .from('purchase_cases')
        .update({
          agent_commission_paid: true,
          agent_commission_paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId)
        .select()
        .single();

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      console.error('Erreur confirmAgentCommissionPayment:', error);
      throw error;
    }
  }

  /**
   * Confirmer le paiement des frais géomètre
   * @param {string} missionId - ID de la mission
   * @returns {Promise<Object>}
   */
  async confirmGeometrePayment(missionId) {
    try {
      const { data, error } = await supabase
        .from('surveying_missions')
        .update({
          paid: true,
          paid_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', missionId)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour aussi le dossier
      const { data: mission } = await supabase
        .from('surveying_missions')
        .select('case_id')
        .eq('id', missionId)
        .single();

      if (mission) {
        await supabase
          .from('purchase_cases')
          .update({
            geometre_fees_paid: true,
            geometre_fees_paid_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', mission.case_id);
      }

      return { success: true, data };
    } catch (error) {
      console.error('Erreur confirmGeometrePayment:', error);
      throw error;
    }
  }

  /**
   * Mettre à jour le statut d'un dossier
   * @param {string} caseId - UUID du dossier
   * @param {string} newStatus - Nouveau statut (voir WorkflowStatusService)
   * @returns {Promise<object>}
   */
  async updateCaseStatus(caseId, newStatus) {
    try {
      const { data, error } = await supabase
        .from('purchase_cases')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', caseId)
        .select()
        .single();

      if (error) throw error;

      // Log history
      await supabase.from('purchase_case_history').insert({
        case_id: caseId,
        previous_status: data.status,
        new_status: newStatus,
        status: newStatus,
        updated_by: (await supabase.auth.getUser()).data.user?.id || 'system',
        notes: `Status updated to ${newStatus}`
      });

      return { success: true, data };
    } catch (error) {
      console.error('Erreur updateCaseStatus:', error);
      throw error;
    }
  }
}

// Export singleton
const unifiedCaseTrackingService = new UnifiedCaseTrackingService();
export default unifiedCaseTrackingService;
