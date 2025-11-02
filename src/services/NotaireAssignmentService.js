import { supabase } from '@/lib/supabaseClient';

/**
 * 🎯 NotaireAssignmentService
 * Service pour gérer l'attribution des notaires aux dossiers de vente
 * 
 * Workflow:
 * 1. Acheteur/Vendeur propose un notaire (ou système auto)
 * 2. Les 2 parties doivent approuver le choix
 * 3. Notaire a 24h pour accepter/refuser
 * 4. Si accepté → Notaire assigné au dossier
 */

class NotaireAssignmentService {
  
  /**
   * 🔍 Trouver les meilleurs notaires pour un dossier
   * Algorithme de scoring intelligent
   */
  static async findBestNotaires(caseId, options = {}) {
    try {
      const { limit = 3, autoSelect = false } = options;
      
      // 1. Récupérer infos du dossier
      const { data: purchaseCase, error: caseError } = await supabase
        .from('purchase_cases')
        .select(`
          *,
          parcelle:parcels(
            id,
            title,
            region,
            commune,
            latitude,
            longitude
          )
        `)
        .eq('id', caseId)
        .single();
      
      if (caseError) throw caseError;
      
      // 2. Récupérer tous les notaires disponibles
      const { data: notaires, error: notairesError } = await supabase
        .from('notaire_profiles')
        .select(`
          *,
          profile:profiles(
            id,
            email,
            full_name,
            avatar_url,
            phone
          )
        `)
        .eq('is_available', true)
        .eq('is_accepting_cases', true)
        .lt('current_cases_count', supabase.ref('max_concurrent_cases'));
      
      if (notairesError) throw notairesError;
      
      if (!notaires || notaires.length === 0) {
        return { 
          success: false, 
          error: 'Aucun notaire disponible pour le moment',
          data: [] 
        };
      }
      
      // 3. Calculer score pour chaque notaire
      const scoredNotaires = notaires.map(notaire => {
        const score = this.calculateNotaireScore(notaire, purchaseCase);
        const distance = this.calculateDistance(
          notaire.office_latitude,
          notaire.office_longitude,
          purchaseCase.parcelle?.latitude,
          purchaseCase.parcelle?.longitude
        );
        
        return {
          ...notaire,
          score,
          distance: distance ? parseFloat(distance.toFixed(2)) : null,
          capacity_percentage: (notaire.current_cases_count / notaire.max_concurrent_cases * 100).toFixed(0),
          available_slots: notaire.max_concurrent_cases - notaire.current_cases_count
        };
      });
      
      // 4. Trier par score décroissant
      const bestNotaires = scoredNotaires
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
      
      // 5. Si auto-select demandé, proposer directement le meilleur
      if (autoSelect && bestNotaires.length > 0) {
        await this.proposeNotaire(caseId, bestNotaires[0].id, {
          proposedBy: 'system',
          score: bestNotaires[0].score,
          distance: bestNotaires[0].distance,
          reason: 'Attribution automatique - Meilleur score'
        });
      }
      
      return { success: true, data: bestNotaires };
      
    } catch (error) {
      console.error('Erreur findBestNotaires:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 🧮 Calculer le score d'un notaire (0-100)
   */
  static calculateNotaireScore(notaire, purchaseCase) {
    let score = 100;
    
    // 1. DISTANCE (-2 points par km, max -50 points)
    if (notaire.office_latitude && notaire.office_longitude && 
        purchaseCase.parcelle?.latitude && purchaseCase.parcelle?.longitude) {
      const distance = this.calculateDistance(
        notaire.office_latitude,
        notaire.office_longitude,
        purchaseCase.parcelle.latitude,
        purchaseCase.parcelle.longitude
      );
      score -= Math.min(distance * 2, 50);
    }
    
    // 2. CHARGE DE TRAVAIL (-30 points si saturé)
    const loadPercentage = notaire.current_cases_count / notaire.max_concurrent_cases;
    score -= loadPercentage * 30;
    
    // 3. RATING (+20 si ≥4.5 étoiles)
    if (notaire.rating >= 4.5) {
      score += 20;
    } else if (notaire.rating >= 4.0) {
      score += 10;
    } else if (notaire.rating >= 3.5) {
      score += 5;
    }
    
    // 4. EXPÉRIENCE (+15 si >30 jours moyenne)
    if (notaire.average_completion_days && notaire.average_completion_days <= 30) {
      score += 15;
    } else if (notaire.average_completion_days && notaire.average_completion_days <= 45) {
      score += 8;
    }
    
    // 5. SPÉCIALISATION (+10 si spécialiste terrain)
    if (notaire.specializations && notaire.specializations.includes('terrain')) {
      score += 10;
    }
    
    // 6. NOMBRE DE DOSSIERS COMPLÉTÉS (+10 si >50)
    if (notaire.total_cases_completed > 50) {
      score += 10;
    } else if (notaire.total_cases_completed > 20) {
      score += 5;
    }
    
    // 7. VÉRIFICATION (+5 si vérifié)
    if (notaire.is_verified) {
      score += 5;
    }
    
    // 8. RÉGION (+15 si même région)
    if (notaire.office_region === purchaseCase.parcelle?.region) {
      score += 15;
    }
    
    // 9. TEMPS DE RÉPONSE (+10 si <6h moyenne)
    if (notaire.average_response_hours && notaire.average_response_hours <= 6) {
      score += 10;
    }
    
    return Math.max(0, Math.round(score));
  }
  
  /**
   * 📐 Calculer distance entre 2 points GPS (formule Haversine)
   * Retourne la distance en kilomètres
   */
  static calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    
    const R = 6371; // Rayon de la Terre en km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance;
  }
  
  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }
  
  /**
   * 📤 Proposer un notaire pour un dossier
   */
  static async proposeNotaire(caseId, notaireId, options = {}) {
    try {
      const { 
        proposedBy = null, 
        proposedByRole = 'system',
        score = null,
        distance = null,
        reason = '',
        quotedFee = null
      } = options;
      
      // Vérifier si déjà proposé
      const { data: existing } = await supabase
        .from('notaire_case_assignments')
        .select('id')
        .eq('case_id', caseId)
        .eq('notaire_id', notaireId)
        .in('status', ['pending', 'buyer_approved', 'seller_approved', 'both_approved'])
        .single();
      
      if (existing) {
        return { 
          success: false, 
          error: 'Ce notaire a déjà été proposé pour ce dossier' 
        };
      }
      
      // Créer l'assignment
      const { data: assignment, error } = await supabase
        .from('notaire_case_assignments')
        .insert({
          case_id: caseId,
          notaire_id: notaireId,
          proposed_by: proposedBy,
          proposed_by_role: proposedByRole,
          status: 'pending',
          assignment_score: score,
          distance_km: distance,
          assignment_reason: reason,
          quoted_fee: quotedFee,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24h
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // TODO: Envoyer notification (à implémenter)
      // await NotificationService.send({...});
      
      return { success: true, data: assignment };
      
    } catch (error) {
      console.error('Erreur proposeNotaire:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * ✅ Acheteur/Vendeur approuve un notaire
   */
  static async approveNotaire(assignmentId, userId, role) {
    try {
      // role = 'buyer' ou 'seller'
      const updateField = role === 'buyer' ? 'buyer_approved' : 'seller_approved';
      const updateDateField = role === 'buyer' ? 'buyer_approved_at' : 'seller_approved_at';
      
      const { data, error } = await supabase
        .from('notaire_case_assignments')
        .update({
          [updateField]: true,
          [updateDateField]: new Date().toISOString()
        })
        .eq('id', assignmentId)
        .select()
        .single();
      
      if (error) throw error;
      
      // Si les 2 ont approuvé, le trigger va mettre status = 'both_approved'
      // TODO: Envoyer notification au notaire si both_approved
      
      return { success: true, data };
      
    } catch (error) {
      console.error('Erreur approveNotaire:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * ✅ Notaire accepte le dossier
   */
  static async acceptAssignment(assignmentId, notaireId, options = {}) {
    try {
      const { quotedFee = null, feeBreakdown = {}, notes = '' } = options;
      
      // 1. Mettre à jour l'assignment
      const { data: assignment, error: updateError } = await supabase
        .from('notaire_case_assignments')
        .update({ 
          status: 'notaire_accepted',
          notaire_status: 'accepted',
          notaire_responded_at: new Date().toISOString(),
          quoted_fee: quotedFee,
          fee_breakdown: feeBreakdown,
          notaire_notes: notes
        })
        .eq('id', assignmentId)
        .eq('notaire_id', notaireId)
        .eq('status', 'both_approved') // Peut accepter que si les 2 parties ont approuvé
        .select('case_id')
        .single();
      
      if (updateError) throw updateError;
      
      // 2. Assigner le notaire au dossier
      const { error: caseError } = await supabase
        .from('purchase_cases')
        .update({
          notaire_id: notaireId,
          notaire_accepted_at: new Date().toISOString(),
          notaire_fees: quotedFee,
          status: 'notary_assigned'
        })
        .eq('id', assignment.case_id);
      
      if (caseError) throw caseError;
      
      // 3. Incrémenter le compteur du notaire
      const { error: incrementError } = await supabase.rpc(
        'increment_notaire_cases', 
        { p_notaire_id: notaireId }
      );
      
      if (incrementError) {
        console.warn('Erreur increment notaire cases:', incrementError);
      }
      
      // TODO: Envoyer notifications aux parties
      
      return { success: true, data: assignment };
      
    } catch (error) {
      console.error('Erreur acceptAssignment:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * ❌ Notaire refuse le dossier
   */
  static async declineAssignment(assignmentId, notaireId, reason = '') {
    try {
      const { data, error } = await supabase
        .from('notaire_case_assignments')
        .update({ 
          status: 'notaire_declined',
          notaire_status: 'declined',
          notaire_responded_at: new Date().toISOString(),
          notaire_decline_reason: reason
        })
        .eq('id', assignmentId)
        .eq('notaire_id', notaireId)
        .select()
        .single();
      
      if (error) throw error;
      
      // TODO: Suggérer un autre notaire automatiquement
      
      return { success: true, data };
      
    } catch (error) {
      console.error('Erreur declineAssignment:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 📋 Récupérer les assignments d'un dossier
   */
  static async getCaseAssignments(caseId) {
    try {
      const { data, error } = await supabase
        .from('notaire_case_assignments')
        .select(`
          *,
          notaire:profiles!notaire_case_assignments_notaire_id_fkey(
            id,
            full_name,
            email,
            avatar_url
          ),
          notaire_profile:notaire_profiles(
            office_name,
            office_region,
            office_address,
            rating,
            reviews_count,
            specializations
          )
        `)
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return { success: true, data: data || [] };
      
    } catch (error) {
      console.error('Erreur getCaseAssignments:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 📋 Récupérer les assignments en attente pour un notaire
   */
  static async getPendingAssignments(notaireId) {
    try {
      const { data, error } = await supabase
        .from('notaire_case_assignments')
        .select(`
          *,
          purchase_case:purchase_cases(
            id,
            case_number,
            purchase_price,
            status,
            buyer:profiles!purchase_cases_buyer_id_fkey(id, full_name, email),
            seller:profiles!purchase_cases_seller_id_fkey(id, full_name, email),
            parcelle:parcels(id, title, region, commune, surface)
          )
        `)
        .eq('notaire_id', notaireId)
        .eq('status', 'both_approved')
        .eq('notaire_status', 'pending')
        .gt('expires_at', new Date().toISOString())
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      return { success: true, data: data || [] };
      
    } catch (error) {
      console.error('Erreur getPendingAssignments:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * ⭐ Créer une review pour un notaire
   */
  static async createReview(caseId, notaireId, reviewerId, reviewData) {
    try {
      const { data, error } = await supabase
        .from('notaire_reviews')
        .insert({
          case_id: caseId,
          notaire_id: notaireId,
          reviewer_id: reviewerId,
          reviewer_role: reviewData.reviewer_role, // 'buyer' ou 'seller'
          rating: reviewData.rating,
          professionalism_rating: reviewData.professionalism_rating,
          communication_rating: reviewData.communication_rating,
          speed_rating: reviewData.speed_rating,
          expertise_rating: reviewData.expertise_rating,
          comment: reviewData.comment,
          would_recommend: reviewData.would_recommend,
          status: 'published'
        })
        .select()
        .single();
      
      if (error) throw error;
      
      // Le trigger va auto-update la note moyenne du notaire
      
      return { success: true, data };
      
    } catch (error) {
      console.error('Erreur createReview:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 📊 Récupérer les reviews d'un notaire
   */
  static async getNotaireReviews(notaireId, limit = 10) {
    try {
      const { data, error } = await supabase
        .from('notaire_reviews')
        .select(`
          *,
          reviewer:profiles!notaire_reviews_reviewer_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          case:purchase_cases(
            case_number,
            completed_at
          )
        `)
        .eq('notaire_id', notaireId)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit);
      
      if (error) throw error;
      
      return { success: true, data: data || [] };
      
    } catch (error) {
      console.error('Erreur getNotaireReviews:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * 🔍 Rechercher des notaires avec filtres
   */
  static async searchNotaires(filters = {}) {
    try {
      let query = supabase
        .from('notaire_profiles')
        .select(`
          *,
          profile:profiles(
            id,
            email,
            full_name,
            avatar_url
          )
        `)
        .eq('is_available', true);
      
      if (filters.region) {
        query = query.eq('office_region', filters.region);
      }
      
      if (filters.minRating) {
        query = query.gte('rating', filters.minRating);
      }
      
      if (filters.hasAvailableSlots) {
        query = query.lt('current_cases_count', supabase.ref('max_concurrent_cases'));
      }
      
      if (filters.specialization) {
        query = query.contains('specializations', [filters.specialization]);
      }
      
      query = query.order('rating', { ascending: false })
                   .order('reviews_count', { ascending: false });
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return { success: true, data: data || [] };
      
    } catch (error) {
      console.error('Erreur searchNotaires:', error);
      return { success: false, error: error.message };
    }
  }
}

export default NotaireAssignmentService;
