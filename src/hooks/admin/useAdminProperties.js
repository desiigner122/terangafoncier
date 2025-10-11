import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

/**
 * Hook personnalisé pour la gestion des propriétés
 * Récupère et gère toutes les propriétés de la plateforme
 */
export const useAdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all', // all, pending, verified, rejected
    type: 'all',
    reported: false,
    searchTerm: ''
  });

  // Fonction pour récupérer toutes les propriétés
  const fetchProperties = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });

      // Appliquer les filtres
      if (filters.status !== 'all') {
        query = query.eq('verification_status', filters.status);
      }

      if (filters.type !== 'all') {
        query = query.eq('type', filters.type);
      }

      if (filters.reported) {
        query = query.eq('reported', true);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) throw fetchError;

      // Appliquer la recherche côté client
      let filteredData = data || [];
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredData = filteredData.filter(prop => 
          prop.title?.toLowerCase().includes(searchLower) ||
          prop.address?.toLowerCase().includes(searchLower) ||
          prop.city?.toLowerCase().includes(searchLower) ||
          prop.owner?.name?.toLowerCase().includes(searchLower)
        );
      }

      setProperties(filteredData);
    } catch (err) {
      console.error('Erreur lors de la récupération des propriétés:', err);
      setError(err.message);
      toast.error('Erreur lors du chargement des propriétés');
    } finally {
      setLoading(false);
    }
  };

  // Approuver une propriété
  const approveProperty = async (propertyId) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Mettre à jour la propriété
      const { error: updateError } = await supabase
        .from('properties')
        .update({ verification_status: 'verified' })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      // Logger l'action
      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'property_approved',
        target_id: propertyId,
        target_type: 'property'
      });

      // Créer notification pour le propriétaire
      const property = properties.find(p => p.id === propertyId);
      if (property?.owner_id) {
        await supabase.from('admin_notifications').insert({
          admin_id: property.owner_id,
          type: 'property_approved',
          title: 'Propriété approuvée',
          message: `Votre propriété "${property.title}" a été approuvée`,
          data: { property_id: propertyId }
        });
      }

      toast.success('Propriété approuvée avec succès');
      await fetchProperties();
    } catch (err) {
      console.error('Erreur lors de l\'approbation:', err);
      toast.error('Erreur lors de l\'approbation de la propriété');
    }
  };

  // Rejeter une propriété
  const rejectProperty = async (propertyId, reason) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Mettre à jour la propriété
      const { error: updateError } = await supabase
        .from('properties')
        .update({ 
          verification_status: 'rejected',
          rejection_reason: reason || 'Non conforme aux critères'
        })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      // Logger l'action
      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'property_rejected',
        target_id: propertyId,
        target_type: 'property',
        details: { reason }
      });

      // Créer notification pour le propriétaire
      const property = properties.find(p => p.id === propertyId);
      if (property?.owner_id) {
        await supabase.from('admin_notifications').insert({
          admin_id: property.owner_id,
          type: 'property_rejected',
          title: 'Propriété rejetée',
          message: `Votre propriété "${property.title}" a été rejetée: ${reason}`,
          data: { property_id: propertyId, reason }
        });
      }

      toast.success('Propriété rejetée');
      await fetchProperties();
    } catch (err) {
      console.error('Erreur lors du rejet:', err);
      toast.error('Erreur lors du rejet de la propriété');
    }
  };

  // Mettre en avant une propriété
  const featureProperty = async (propertyId, days = 30) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      const featuredUntil = new Date();
      featuredUntil.setDate(featuredUntil.getDate() + days);

      // Mettre à jour la propriété
      const { error: updateError } = await supabase
        .from('properties')
        .update({ 
          featured: true,
          featured_until: featuredUntil.toISOString()
        })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      // Logger l'action
      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'property_featured',
        target_id: propertyId,
        target_type: 'property',
        details: { days }
      });

      toast.success(`Propriété mise en avant pour ${days} jours`);
      await fetchProperties();
    } catch (err) {
      console.error('Erreur lors de la mise en avant:', err);
      toast.error('Erreur lors de la mise en avant de la propriété');
    }
  };

  // Retirer la mise en avant
  const unfeatureProperty = async (propertyId) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Mettre à jour la propriété
      const { error: updateError } = await supabase
        .from('properties')
        .update({ 
          featured: false,
          featured_until: null
        })
        .eq('id', propertyId);

      if (updateError) throw updateError;

      // Logger l'action
      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'property_unfeatured',
        target_id: propertyId,
        target_type: 'property'
      });

      toast.success('Mise en avant retirée');
      await fetchProperties();
    } catch (err) {
      console.error('Erreur:', err);
      toast.error('Erreur lors du retrait de la mise en avant');
    }
  };

  // Supprimer une propriété
  const deleteProperty = async (propertyId) => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();

      // Logger l'action AVANT la suppression
      await supabase.from('admin_actions').insert({
        admin_id: currentUser.id,
        action_type: 'property_deleted',
        target_id: propertyId,
        target_type: 'property'
      });

      // Supprimer la propriété
      const { error: deleteError } = await supabase
        .from('properties')
        .delete()
        .eq('id', propertyId);

      if (deleteError) throw deleteError;

      toast.success('Propriété supprimée avec succès');
      await fetchProperties();
    } catch (err) {
      console.error('Erreur lors de la suppression:', err);
      toast.error('Erreur lors de la suppression de la propriété');
    }
  };

  // Charger les propriétés au montage et lors des changements de filtres
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  return {
    properties,
    loading,
    error,
    filters,
    setFilters,
    approveProperty,
    rejectProperty,
    featureProperty,
    unfeatureProperty,
    deleteProperty,
    refetch: fetchProperties
  };
};

export default useAdminProperties;
