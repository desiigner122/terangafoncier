/**
 * CRITICAL BUG FIX: Seller Acceptance Notification
 * When seller accepts a purchase request, buyer must see it immediately
 * 
 * Issue: Buyer doesn't see seller acceptance status
 * Solution: Update purchase_cases status properly + real-time subscription
 * 
 * @author Teranga Foncier Team
 * @date October 17, 2025
 */

import { supabase } from '@/lib/supabaseClient';
import NotificationService from './NotificationService';
import AdvancedCaseTrackingService from './AdvancedCaseTrackingService';

export class SellerAcceptanceService {
  /**
   * FIXED: Handle seller accepting a purchase request
   * This MUST update the case status visible to buyer
   */
  static async handleSellerAcceptance(caseId, sellerId) {
    try {
      console.log(`✅ Seller ${sellerId} accepting case ${caseId}`);

      // STEP 1: Get the case (simple query, no relationships)
      let { data: caseData, error: getCaseError } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('id', caseId)
        .eq('seller_id', sellerId)
        .single();

      if (getCaseError) throw getCaseError;

      // Get buyer info separately
      if (caseData?.buyer_id) {
        const { data: buyer } = await supabase
          .from('profiles')
          .select('id, email, user_metadata')
          .eq('id', caseData.buyer_id)
          .single();
        
        if (buyer) {
          caseData.buyer = buyer;
        }
      }

      // STEP 2: Update case status to "seller_accepted" 
      // This is the KEY FIX - use a real status that buyer can see
      const { data: updatedCase, error: updateError } = await supabase
        .from('purchase_cases')
        .update({
          status: 'seller_accepted',  // <-- BUYER WILL SEE THIS
          seller_status: 'accepted',
          seller_response_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseId)
        .select()
        .single();

      if (updateError) throw updateError;

      console.log('✅ Case status updated to seller_accepted');

      // STEP 3: Create system message showing acceptance
      const { error: msgError } = await supabase
        .from('purchase_case_messages')
        .insert({
          case_id: caseId,
          sender_id: sellerId,
          message: `Le vendeur a accepté votre demande d'achat!`,
          message_type: 'system',
          metadata: {
            event: 'seller_acceptance',
            timestamp: new Date().toISOString(),
          },
        });

      if (msgError) console.warn('Message creation warning:', msgError);

      // STEP 4: Log to timeline
      await AdvancedCaseTrackingService.logTimelineEvent(
        caseId,
        'status_change',
        'Seller accepted the purchase request',
        {
          old_status: caseData.status,
          new_status: 'seller_accepted',
          seller_id: sellerId,
        }
      );

      // STEP 5: Notify buyer immediately
      await NotificationService.sendNotification({
        userId: caseData.buyer_id,
        title: '✅ Demande d\'achat acceptée!',
        message: `Le vendeur a accepté votre demande d'achat pour le dossier #${caseData.case_number}. Prochaine étape: vérification légale.`,
        type: 'seller_acceptance',
        data: {
          case_id: caseId,
          case_number: caseData.case_number,
          action_url: `/acheteur/cases/${caseData.case_number}`,
        },
      });

      console.log('✅ Buyer notification sent');

      // STEP 6: Create initial tasks for next phase
      await AdvancedCaseTrackingService.createTask(caseId, {
        title: 'Vérification légale du bien',
        description: 'Vérification juridique complète du bien immobilier',
        task_type: 'verification',
        priority: 'high',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        metadata: {
          stage: 'legal_verification',
          created_by: 'system',
        },
      });

      // STEP 7: Add surveyor as participant
      const { data: surveyorParticipant } = await supabase
        .from('purchase_case_participants')
        .select('*')
        .eq('case_id', caseId)
        .eq('role', 'surveyor')
        .maybeSingle();

      if (!surveyorParticipant) {
        // Create a placeholder surveyor participant
        await AdvancedCaseTrackingService.addParticipant(
          caseId,
          null,
          'surveyor',
          {
            full_name: 'À assigner',
            email: 'surveyor@teranga.sn',
            metadata: { status: 'pending_assignment' },
          }
        );
      }

      console.log('✅ Seller acceptance completed successfully');
      return updatedCase;

    } catch (error) {
      console.error('❌ Error handling seller acceptance:', error);
      throw error;
    }
  }

  /**
   * Get buyer's current case status view
   * This is what the buyer sees in their dashboard
   */
  static async getBuyerCaseStatus(caseId, buyerId) {
    try {
      const { data, error } = await supabase
        .from('purchase_cases')
        .select(`
          id,
          case_number,
          status,
          seller_status,
          buyer_status,
          buyer_id,
          seller_id,
          agreed_price,
          created_at,
          updated_at,
          seller_response_date
        `)
        .eq('id', caseId)
        .eq('buyer_id', buyerId)
        .single();

      if (error) throw error;

      // IMPORTANT: The buyer sees the case status directly
      // If seller accepted, status should be 'seller_accepted'
      return {
        ...data,
        seller_has_accepted: data.status === 'seller_accepted' || data.seller_status === 'accepted',
        visible_status: data.status,
      };

    } catch (error) {
      console.error('❌ Error fetching buyer case status:', error);
      return null;
    }
  }

  /**
   * Get seller's case status view
   * Shows what seller can see and what actions they can take
   */
  static async getSellerCaseStatus(caseId, sellerId) {
    try {
      const { data, error } = await supabase
        .from('purchase_cases')
        .select(`
          id,
          case_number,
          status,
          seller_status,
          buyer_status,
          buyer_id,
          seller_id,
          agreed_price,
          created_at,
          updated_at,
          seller_response_date
        `)
        .eq('id', caseId)
        .eq('seller_id', sellerId)
        .single();

      if (error) throw error;

      return {
        ...data,
        can_accept: data.status === 'initiated' || data.status === 'buyer_verification',
        can_decline: data.status === 'initiated' || data.status === 'buyer_verification',
        already_accepted: data.seller_status === 'accepted',
      };

    } catch (error) {
      console.error('❌ Error fetching seller case status:', error);
      return null;
    }
  }

  /**
   * Verify that buyer can see the acceptance
   * Use this for testing/debugging
   */
  static async verifyCaseVisibility(caseId, buyerId, sellerId) {
    try {
      const buyerView = await this.getBuyerCaseStatus(caseId, buyerId);
      const sellerView = await this.getSellerCaseStatus(caseId, sellerId);

      return {
        case_id: caseId,
        buyer_sees_accepted: buyerView?.seller_has_accepted || false,
        seller_sees_accepted: sellerView?.already_accepted || false,
        buyer_status: buyerView?.status,
        seller_status: sellerView?.seller_status,
        sync_status: buyerView?.status === 'seller_accepted' ? 'SYNCED' : 'MISMATCH',
      };
    } catch (error) {
      console.error('❌ Error verifying case visibility:', error);
      return null;
    }
  }
}

export default SellerAcceptanceService;
