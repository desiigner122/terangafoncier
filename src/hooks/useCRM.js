/**
 * ================================================
 * useCRM Hook - Gestion de l'état du CRM
 * ================================================
 * Gère:
 * - Contacts
 * - Affaires
 * - Activités
 * - Statistiques
 * ================================================
 */

import { useState, useCallback, useEffect } from 'react';
import CRMService from '@/services/CRMService';

export const useCRM = () => {
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==================== CONTACTS ====================

  const fetchContacts = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.getContacts(filters);
      if (result.success) {
        setContacts(result.contacts);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addContact = useCallback(async (contactData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.createContact(contactData);
      if (result.success) {
        setContacts(prev => [result.contact, ...prev]);
        return result.contact;
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateContact = useCallback(async (contactId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.updateContact(contactId, updates);
      if (result.success) {
        setContacts(prev => 
          prev.map(c => c.id === contactId ? result.contact : c)
        );
        return result.contact;
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteContact = useCallback(async (contactId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.deleteContact(contactId);
      if (result.success) {
        setContacts(prev => prev.filter(c => c.id !== contactId));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== AFFAIRES ====================

  const fetchDeals = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.getDeals(filters);
      if (result.success) {
        setDeals(result.deals);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDeal = useCallback(async (dealData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.createDeal(dealData);
      if (result.success) {
        setDeals(prev => [result.deal, ...prev]);
        return result.deal;
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateDeal = useCallback(async (dealId, updates) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.updateDeal(dealId, updates);
      if (result.success) {
        setDeals(prev => 
          prev.map(d => d.id === dealId ? result.deal : d)
        );
        return result.deal;
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const moveDeal = useCallback(async (dealId, newStage) => {
    try {
      const result = await CRMService.moveDealToStage(dealId, newStage);
      if (result.success) {
        setDeals(prev => 
          prev.map(d => d.id === dealId ? { ...d, stage: newStage } : d)
        );
        return result.deal;
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const deleteDeal = useCallback(async (dealId) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.deleteDeal(dealId);
      if (result.success) {
        setDeals(prev => prev.filter(d => d.id !== dealId));
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== ACTIVITÉS ====================

  const fetchActivities = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.getActivities(filters);
      if (result.success) {
        setActivities(result.activities);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addActivity = useCallback(async (activityData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.addActivity(activityData);
      if (result.success) {
        setActivities(prev => [result.activity, ...prev]);
        return result.activity;
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== STATISTIQUES ====================

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await CRMService.getCRMStats();
      if (result.success) {
        setStats(result.stats);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // ==================== EXPORT ====================

  const exportContacts = useCallback(async () => {
    try {
      const result = await CRMService.exportContactsToCSV(contacts);
      if (result.success) {
        console.log('✅ Export contacts réussi');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
  }, [contacts]);

  return {
    // State
    contacts,
    deals,
    activities,
    stats,
    loading,
    error,

    // Contacts methods
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,

    // Deals methods
    fetchDeals,
    addDeal,
    updateDeal,
    moveDeal,
    deleteDeal,

    // Activities methods
    fetchActivities,
    addActivity,

    // Stats methods
    fetchStats,

    // Export methods
    exportContacts,

    // Clear error
    clearError: () => setError(null)
  };
};

export default useCRM;
