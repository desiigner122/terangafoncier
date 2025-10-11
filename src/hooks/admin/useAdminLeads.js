/**
 * ========================================
 * useAdminLeads - Hook pour gestion Leads & Marketing
 * ========================================
 * Date: 10 Octobre 2025
 * Utilise: MarketingService
 */

import { useState, useEffect, useCallback } from 'react';
import MarketingService from '@/services/admin/MarketingService';

export function useAdminLeads() {
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Charger tous les leads (avec filtres)
   */
  const loadLeads = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    const result = await MarketingService.getLeads(filters);
    
    if (result.success) {
      setLeads(result.leads);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Créer un lead
   */
  const createLead = useCallback(async (leadData) => {
    setLoading(true);
    setError(null);
    
    const result = await MarketingService.createLead(leadData);
    
    if (result.success) {
      setLeads(prev => [result.lead, ...prev]);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Mettre à jour le statut d'un lead
   */
  const updateLeadStatus = useCallback(async (leadId, status) => {
    setLoading(true);
    setError(null);
    
    const result = await MarketingService.updateLeadStatus(leadId, status);
    
    if (result.success) {
      setLeads(prev => prev.map(l => l.id === leadId ? result.lead : l));
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Assigner un lead à un team member
   */
  const assignLead = useCallback(async (leadId, userId) => {
    setLoading(true);
    setError(null);
    
    const result = await MarketingService.assignLead(leadId, userId);
    
    if (result.success) {
      setLeads(prev => prev.map(l => l.id === leadId ? result.lead : l));
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Ajouter des notes à un lead
   */
  const addNotes = useCallback(async (leadId, notes) => {
    const result = await MarketingService.addNotes(leadId, notes);
    
    if (result.success) {
      setLeads(prev => prev.map(l => l.id === leadId ? result.lead : l));
    }
    
    return result;
  }, []);

  /**
   * Supprimer un lead
   */
  const deleteLead = useCallback(async (leadId) => {
    setLoading(true);
    setError(null);
    
    const result = await MarketingService.deleteLead(leadId);
    
    if (result.success) {
      setLeads(prev => prev.filter(l => l.id !== leadId));
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Charger statistiques leads
   */
  const loadStats = useCallback(async () => {
    const result = await MarketingService.getLeadsStats();
    
    if (result.success) {
      setStats(result.stats);
    }
    
    return result;
  }, []);

  /**
   * Charger team members
   */
  const loadTeamMembers = useCallback(async (filters = {}) => {
    const result = await MarketingService.getTeamMembers(filters);
    return result;
  }, []);

  /**
   * Créer un team member
   */
  const createTeamMember = useCallback(async (memberData) => {
    const result = await MarketingService.createTeamMember(memberData);
    return result;
  }, []);

  /**
   * Mettre à jour un team member
   */
  const updateTeamMember = useCallback(async (memberId, updates) => {
    const result = await MarketingService.updateTeamMember(memberId, updates);
    return result;
  }, []);

  /**
   * Supprimer un team member
   */
  const deleteTeamMember = useCallback(async (memberId) => {
    const result = await MarketingService.deleteTeamMember(memberId);
    return result;
  }, []);

  /**
   * Tracker un événement
   */
  const trackEvent = useCallback(async (eventData) => {
    const result = await MarketingService.trackEvent(eventData);
    return result;
  }, []);

  /**
   * Charger événements
   */
  const loadEvents = useCallback(async (filters = {}) => {
    const result = await MarketingService.getEvents(filters);
    return result;
  }, []);

  /**
   * Récupérer paramètres UTM
   */
  const getUTMParams = useCallback(() => {
    return MarketingService.getUTMParams();
  }, []);

  // Auto-charger leads au montage (optionnel)
  useEffect(() => {
    // loadLeads(); // Décommenter si besoin
    // loadStats(); // Décommenter si besoin
  }, []);

  return {
    // State
    leads,
    stats,
    loading,
    error,
    
    // Leads
    loadLeads,
    createLead,
    updateLeadStatus,
    assignLead,
    addNotes,
    deleteLead,
    loadStats,
    
    // Team Members
    loadTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember,
    
    // Events
    trackEvent,
    loadEvents,
    
    // Utils
    getUTMParams
  };
}
