/**
 * Advanced Case Tracking Service
 * Complete workflow management with participants, fees, tasks, documents
 * Real-time updates and notifications
 * @author Teranga Foncier Team
 * @date October 17, 2025
 */

import { supabase } from '@/lib/supabaseClient';
import NotificationService from './NotificationService';

export class AdvancedCaseTrackingService {
  // ==========================================
  // PARTICIPANTS MANAGEMENT
  // ==========================================

  /**
   * Add a participant to a case (notary, surveyor, agent, lawyer, etc)
   */
  static async addParticipant(caseId, userId, role, contactInfo = {}) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_participants')
        .insert({
          case_id: caseId,
          user_id: userId,
          role,
          email: contactInfo.email,
          phone: contactInfo.phone,
          full_name: contactInfo.full_name,
          status: 'invited',
          metadata: {
            invited_at: new Date().toISOString(),
            ...contactInfo.metadata,
          },
        })
        .select()
        .single();

      if (error) throw error;

      // Log timeline event
      await this.logTimelineEvent(caseId, 'participant_added', 
        `${role} added to case`, 
        { role, user_id: userId }
      );

      // Send notification
      await NotificationService.notifyParticipantInvitation(caseId, userId, role);

      return data;
    } catch (error) {
      console.error('❌ Error adding participant:', error);
      throw error;
    }
  }

  /**
   * Accept participation in a case
   */
  static async acceptParticipation(caseId, userId) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_participants')
        .update({
          status: 'accepted',
          joined_at: new Date().toISOString(),
        })
        .eq('case_id', caseId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;

      await this.logTimelineEvent(caseId, 'participant_added', 
        `Participant accepted invitation`, 
        { user_id: userId }
      );

      return data;
    } catch (error) {
      console.error('❌ Error accepting participation:', error);
      throw error;
    }
  }

  /**
   * Get all participants in a case
   * FIX: Supabase REST API doesn't support nested auth.users relationships
   * Query participants without user metadata (only participant data)
   */
  static async getCaseParticipants(caseId) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_participants')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching participants:', error);
      return [];
    }
  }

  // ==========================================
  // FEES MANAGEMENT
  // ==========================================

  /**
   * Create a fee for a case
   */
  static async createFee(caseId, feeData) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_fees')
        .insert({
          case_id: caseId,
          fee_type: feeData.fee_type,
          amount: feeData.amount,
          currency: feeData.currency || 'CFA',
          description: feeData.description,
          status: 'quoted',
          due_date: feeData.due_date,
          participant_id: feeData.participant_id,
          metadata: feeData.metadata || {},
        })
        .select()
        .single();

      if (error) throw error;

      await this.logTimelineEvent(caseId, 'fee_created', 
        `${feeData.fee_type} fee created: ${feeData.amount} CFA`, 
        feeData
      );

      return data;
    } catch (error) {
      console.error('❌ Error creating fee:', error);
      throw error;
    }
  }

  /**
   * Get total fees for a case
   */
  static async getCaseFees(caseId) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_fees')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching fees:', error);
      return [];
    }
  }

  /**
   * Calculate total fees
   */
  static async getTotalFees(caseId) {
    try {
      const fees = await this.getCaseFees(caseId);
      return fees.reduce((sum, fee) => sum + parseFloat(fee.amount || 0), 0);
    } catch (error) {
      console.error('❌ Error calculating total fees:', error);
      return 0;
    }
  }

  /**
   * Mark fee as paid
   */
  static async markFeeAsPaid(feeId, paymentInfo = {}) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_fees')
        .update({
          status: 'paid',
          paid_date: new Date().toISOString(),
          payment_method: paymentInfo.payment_method,
          payment_reference: paymentInfo.payment_reference,
        })
        .eq('id', feeId)
        .select()
        .single();

      if (error) throw error;

      // Get case to log event
      const fee = data;
      await this.logTimelineEvent(fee.case_id, 'payment_received', 
        `Payment received for ${fee.fee_type}`, 
        { fee_id: feeId, amount: fee.amount }
      );

      return data;
    } catch (error) {
      console.error('❌ Error marking fee as paid:', error);
      throw error;
    }
  }

  // ==========================================
  // TASKS MANAGEMENT
  // ==========================================

  /**
   * Create a task for a case
   */
  static async createTask(caseId, taskData) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_tasks')
        .insert({
          case_id: caseId,
          title: taskData.title,
          description: taskData.description,
          task_type: taskData.task_type,
          assigned_to: taskData.assigned_to,
          participant_id: taskData.participant_id,
          due_date: taskData.due_date,
          priority: taskData.priority || 'medium',
          status: 'pending',
          metadata: taskData.metadata || {},
        })
        .select()
        .single();

      if (error) throw error;

      await this.logTimelineEvent(caseId, 'task_completed', 
        `New task: ${taskData.title}`, 
        taskData
      );

      return data;
    } catch (error) {
      console.error('❌ Error creating task:', error);
      throw error;
    }
  }

  /**
   * Get tasks for a case
   */
  static async getCaseTasks(caseId) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_tasks')
        .select('*')
        .eq('case_id', caseId)
        .order('due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching tasks:', error);
      return [];
    }
  }

  /**
   * Update task status
   */
  static async updateTaskStatus(taskId, status, notes = '') {
    try {
      const updateData = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === 'in_progress') {
        updateData.started_at = new Date().toISOString();
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
        if (notes) {
          updateData.completion_notes = notes;
        }
      }

      const { data, error } = await supabase
        .from('purchase_case_tasks')
        .update(updateData)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;

      // Log event
      await this.logTimelineEvent(data.case_id, 'task_completed', 
        `Task "${data.title}" marked as ${status}`, 
        { task_id: taskId, status }
      );

      return data;
    } catch (error) {
      console.error('❌ Error updating task:', error);
      throw error;
    }
  }

  // ==========================================
  // DOCUMENTS MANAGEMENT
  // ==========================================

  /**
   * Add a document to a case
   */
  static async addDocument(caseId, documentData, fileUrl) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_documents')
        .insert({
          case_id: caseId,
          document_type: documentData.document_type,
          title: documentData.title,
          description: documentData.description,
          file_url: fileUrl,
          file_size: documentData.file_size,
          file_type: documentData.file_type,
          storage_path: documentData.storage_path,
          uploaded_by: documentData.uploaded_by,
          status: 'uploaded',
          metadata: documentData.metadata || {},
        })
        .select()
        .single();

      if (error) throw error;

      await this.logTimelineEvent(caseId, 'document_uploaded', 
        `Document uploaded: ${documentData.title}`, 
        documentData
      );

      return data;
    } catch (error) {
      console.error('❌ Error adding document:', error);
      throw error;
    }
  }

  /**
   * Get documents for a case
   */
  static async getCaseDocuments(caseId) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_documents')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching documents:', error);
      return [];
    }
  }

  /**
   * Verify a document
   */
  static async verifyDocument(documentId, verifiedBy, isVerified, notes = '') {
    try {
      const { data, error } = await supabase
        .from('purchase_case_documents')
        .update({
          is_verified: isVerified,
          verified_by: verifiedBy,
          verified_at: new Date().toISOString(),
          verification_notes: notes,
          status: isVerified ? 'verified' : 'rejected',
        })
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;

      await this.logTimelineEvent(data.case_id, 'document_uploaded', 
        `Document ${isVerified ? 'verified' : 'rejected'}: ${data.title}`, 
        { document_id: documentId, is_verified: isVerified }
      );

      return data;
    } catch (error) {
      console.error('❌ Error verifying document:', error);
      throw error;
    }
  }

  // ==========================================
  // TIMELINE & AUDIT TRAIL
  // ==========================================

  /**
   * Log a timeline event
   */
  static async logTimelineEvent(caseId, eventType, title, details = {}) {
    try {
      // Récupérer l'utilisateur actuel
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('purchase_case_timeline')
        .insert({
          case_id: caseId,
          event_type: eventType,
          title,
          description: JSON.stringify(details),
          metadata: details,
          triggered_by: user?.id || null,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error logging timeline event:', error);
        throw error;
      }
      
      console.log('✅ Timeline event logged:', eventType, title);
      return data;
    } catch (error) {
      console.error('❌ Error logging timeline event:', error);
      return null;
    }
  }

  /**
   * Get case timeline
   */
  static async getCaseTimeline(caseId) {
    try {
      const { data, error } = await supabase
        .from('purchase_case_timeline')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('❌ Error fetching timeline:', error);
      return [];
    }
  }

  // ==========================================
  // CASE SUMMARY
  // ==========================================

  /**
   * Get complete case summary
   */
  static async getCompleteCaseSummary(caseId) {
    try {
      const [caseData, participants, fees, tasks, documents, timeline] = await Promise.all([
        this.getCaseData(caseId),
        this.getCaseParticipants(caseId),
        this.getCaseFees(caseId),
        this.getCaseTasks(caseId),
        this.getCaseDocuments(caseId),
        this.getCaseTimeline(caseId),
      ]);

      const totalFees = await this.getTotalFees(caseId);

      return {
        case: caseData,
        participants,
        fees,
        total_fees: totalFees,
        tasks,
        documents,
        timeline,
        stats: {
          total_participants: participants.length,
          completed_tasks: tasks.filter(t => t.status === 'completed').length,
          total_tasks: tasks.length,
          verified_documents: documents.filter(d => d.is_verified).length,
          total_documents: documents.length,
          paid_fees: fees.filter(f => f.status === 'paid').length,
          total_fee_amount: totalFees,
        },
      };
    } catch (error) {
      console.error('❌ Error getting case summary:', error);
      throw error;
    }
  }

  /**
   * Get case data
   */
  static async getCaseData(caseId) {
    try {
      const { data, error } = await supabase
        .from('purchase_cases')
        .select('*')
        .eq('id', caseId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('❌ Error fetching case:', error);
      return null;
    }
  }

  // ==========================================
  // WORKFLOW TRANSITIONS
  // ==========================================

  /**
   * Handle seller acceptance of a purchase request
   */
  static async handleSellerAcceptance(caseId, sellerId) {
    try {
      // Update case status
      const { data: updatedCase, error: caseError } = await supabase
        .from('purchase_cases')
        .update({
          seller_status: 'accepted',
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseId)
        .eq('seller_id', sellerId)
        .select()
        .single();

      if (caseError) throw caseError;

      // Log event
      await this.logTimelineEvent(caseId, 'status_change', 
        'Seller accepted the purchase request', 
        { old_status: 'pending', new_status: 'accepted' }
      );

      // Notify buyer
      await NotificationService.notifyBuyerOfSellerAcceptance(caseId);

      // Create initial tasks for surveyor
      await this.createTask(caseId, {
        title: 'Property Survey',
        description: 'Professional property survey and measurement',
        task_type: 'measurement',
        priority: 'high',
        metadata: { stage: 'survey' },
      });

      return updatedCase;
    } catch (error) {
      console.error('❌ Error handling seller acceptance:', error);
      throw error;
    }
  }

  /**
   * Notify all case participants of a status change
   */
  static async notifyAllParticipants(caseId, message) {
    try {
      const participants = await this.getCaseParticipants(caseId);
      
      const notifications = participants.map(p =>
        NotificationService.sendNotification({
          user_id: p.user_id,
          title: 'Case Update',
          message,
          type: 'case_update',
          data: { case_id: caseId, role: p.role },
        })
      );

      await Promise.all(notifications);
    } catch (error) {
      console.error('❌ Error notifying participants:', error);
    }
  }
}

export default AdvancedCaseTrackingService;
