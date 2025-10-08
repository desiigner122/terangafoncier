/**
 * VENDEUR PROPERTIES REAL DATA - VERSION MODERNISÉE AVEC NOUVEAUX COMPOSANTS
 * Gestion complète des propriétés du vendeur avec IA et Blockchain
 * ✅ EmptyState, LoadingState, StatsCard, BulkActions, AdvancedFilters, Notifications
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, BarChart3, Eye, Heart, MessageSquare,
  Edit, Trash2, Star, TrendingUp, Calendar, MapPin, Home,
  Building2, CheckCircle, Clock, XCircle, Sparkles, Zap,
  MoreVertical, ExternalLink, Copy, Share2, Camera, Download,
  Archive, RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// 🆕 NOUVEAUX COMPOSANTS MODERNISÉS
import EmptyState from '@/components/ui/EmptyState';
import LoadingState from '@/components/ui/LoadingState';
import StatsCard from '@/components/ui/StatsCard';
import BulkActions, { useBulkSelection } from '@/components/ui/BulkActions';
import AdvancedFilters from '@/components/ui/AdvancedFilters';
import { notify } from '@/components/ui/NotificationToast';

// 🆕 SEMAINE 3 - Import modals workflows
import PhotoUploadModal from '@/components/dialogs/PhotoUploadModal';

const VendeurPropertiesRealData = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  
  // 🆕 SEMAINE 3 - State pour PhotoUploadModal
  const [photoUploadOpen, setPhotoUploadOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);

  // 🆕 BULK SELECTION
  const {
    selectedIds,
    toggleSelection,
    selectAll,
    deselectAll,
    isSelected,
    selectedCount
  } = useBulkSelection();

  // Charger les propriétés du vendeur depuis Supabase
  useEffect(() => {
    if (user) {
      loadProperties();
      setupRealtimeSubscription();
    }
    
    return () => {
      // Cleanup subscriptions
      supabase.channel('properties_changes').unsubscribe();
    };
  }, [user]);

  const loadProperties = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          description,
          property_type,
          status,
          verification_status,
          price,
          surface,
          location,
          city,
          region,
          images,
          features,
          ai_analysis,
          blockchain_verified,
          blockchain_network,
          views_count,
          favorites_count,
          contact_requests_count,
          is_featured,
          created_at,
          updated_at,
          published_at
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Formater les données
      const formattedProperties = data.map(prop => ({
        id: prop.id,
        title: prop.title,
        type: prop.property_type,
        status: prop.status,
        verificationStatus: prop.verification_status,
        price: prop.price,
        location: prop.location || `${prop.city}, ${prop.region}`,
        area: prop.surface,
        images: Array.isArray(prop.images) ? prop.images.length : 0,
        imageUrl: Array.isArray(prop.images) && prop.images.length > 0 ? prop.images[0] : null,
        views: prop.views_count || 0,
        favorites: prop.favorites_count || 0,
        inquiries: prop.contact_requests_count || 0,
        createdAt: prop.created_at,
        lastModified: prop.updated_at || prop.created_at,
        featured: prop.is_featured || false,
        aiOptimized: prop.ai_analysis && Object.keys(prop.ai_analysis).length > 0,
        blockchainVerified: prop.blockchain_verified || false,
        blockchainNetwork: prop.blockchain_network,
        completion: calculateCompletion(prop)
      }));

      setProperties(formattedProperties);
      setFilteredProperties(formattedProperties);
    } catch (error) {
      console.error('Erreur chargement propriétés:', error);
      notify.error('Erreur lors du chargement de vos propriétés');
    } finally {
      setLoading(false);
    }
  };

  // 🆕 REAL-TIME SUPABASE SUBSCRIPTION
  const setupRealtimeSubscription = () => {
    const subscription = supabase
      .channel('properties_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'properties',
          filter: `owner_id=eq.${user.id}`
        },
        (payload) => {
          switch (payload.eventType) {
            case 'INSERT':
              notify.success('✨ Nouvelle propriété ajoutée !');
              loadProperties();
              break;
            case 'UPDATE':
              notify.info('🔄 Propriété mise à jour');
              loadProperties();
              break;
            case 'DELETE':
              notify.warning('🗑️ Propriété supprimée');
              loadProperties();
              break;
          }
        }
      )
      .subscribe();

    return subscription;
  };

  // Calculer le pourcentage de complétion
  const calculateCompletion = (property) => {
    let score = 0;
    const checks = [
      property.title,
      property.description,
      property.price,
      property.surface,
      property.location,
      property.images && property.images.length >= 3,
      property.features && Object.keys(property.features).length > 0,
      property.ai_analysis && Object.keys(property.ai_analysis).length > 0
    ];

    checks.forEach(check => {
      if (check) score += 12.5;
    });

    return Math.round(score);
  };

  // Supprimer une propriété
  const handleDelete = async (propertyId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) return;

    await notify.promise(
      supabase.from('properties').delete().eq('id', propertyId),
      {
        loading: 'Suppression en cours...',
        success: 'Propriété supprimée avec succès !',
        error: 'Erreur lors de la suppression'
      }
    );

    loadProperties();
  };

  // 🆕 BULK DELETE
  const handleBulkDelete = async (selectedItems) => {
    if (!confirm(`Supprimer ${selectedItems.length} propriété(s) ?`)) return;

    await notify.promise(
      Promise.all(
        selectedItems.map(id =>
          supabase.from('properties').delete().eq('id', id)
        )
      ),
      {
        loading: `Suppression de ${selectedItems.length} propriété(s)...`,
        success: `${selectedItems.length} propriété(s) supprimée(s) !`,
        error: 'Erreur lors de la suppression'
      }
    );

    deselectAll();
    loadProperties();
  };

  // 🆕 BULK EXPORT
  const handleBulkExport = (selectedItems) => {
    const data = properties.filter(p => selectedItems.includes(p.id));
    exportToCSV(data);
    notify.success(`${selectedItems.length} propriété(s) exportée(s) !`);
  };

  // 🆕 EXPORT TO CSV
  const exportToCSV = (data) => {
    const exportData = data.map(property => ({
      'Titre': property.title,
      'Type': property.type,
      'Prix (FCFA)': property.price,
      'Surface (m²)': property.area,
      'Ville': property.location,
      'Statut': property.status,
      'Vues': property.views,
      'Favoris': property.favorites,
      'Demandes': property.inquiries,
      'Date création': new Date(property.createdAt).toLocaleDateString('fr-FR')
    }));

    const headers = Object.keys(exportData[0]).join(',');
    const rows = exportData.map(row => 
      Object.values(row).map(val => `"${val}"`).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `proprietes_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  // Dupliquer une propriété
  const handleDuplicate = async (property) => {
    await notify.promise(
      (async () => {
        const { data: original } = await supabase
          .from('properties')
          .select('*')
          .eq('id', property.id)
          .single();

        const { id, created_at, updated_at, published_at, views_count, favorites_count, contact_requests_count, ...duplicateData } = original;

        const { data, error } = await supabase
          .from('properties')
          .insert([{
            ...duplicateData,
            title: `${duplicateData.title} (Copie)`,
            status: 'pending_verification',
            verification_status: 'pending',
            is_featured: false
          }])
          .select()
          .single();

        if (error) throw error;
        return data;
      })(),
      {
        loading: 'Duplication en cours...',
        success: 'Propriété dupliquée avec succès !',
        error: 'Erreur lors de la duplication'
      }
    );

    loadProperties();
  };

  // Activer/désactiver la mise en avant
  const toggleFeatured = async (propertyId, currentFeatured) => {
    await notify.promise(
      supabase
        .from('properties')
        .update({ 
          is_featured: !currentFeatured,
          featured_until: !currentFeatured ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() : null
        })
        .eq('id', propertyId),
      {
        loading: 'Mise à jour...',
        success: currentFeatured ? 'Propriété retirée de la mise en avant' : 'Propriété mise en avant !',
        error: 'Erreur lors de la mise à jour'
      }
    );

    loadProperties();
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    pending_verification: 'bg-yellow-100 text-yellow-800',
    suspended: 'bg-red-100 text-red-800',
    sold: 'bg-blue-100 text-blue-800'
  };

  const statusLabels = {
    active: 'Actif',
    pending_verification: 'En attente',
    suspended: 'Suspendu',
    sold: 'Vendu'
  };

  const verificationStatusColors = {
    verified: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    in_progress: 'bg-blue-100 text-blue-800',
    rejected: 'bg-red-100 text-red-800'
  };

  const verificationStatusLabels = {
    verified: 'Vérifié',
    pending: 'En attente',
    in_progress: 'En cours',
    rejected: 'Rejeté'
  };

  // 🆕 CONFIGURATION FILTRES AVANCÉS
  const filters = [
    {
      name: 'search',
      label: 'Recherche',
      type: 'text',
      placeholder: 'Rechercher par titre ou ville...'
    },
    {
      name: 'property_type',
      label: 'Type de bien',
      type: 'select',
      options: [
        { value: 'terrain', label: 'Terrain' },
        { value: 'villa', label: 'Villa' },
        { value: 'appartement', label: 'Appartement' },
        { value: 'immeuble', label: 'Immeuble' },
        { value: 'bureau', label: 'Bureau' }
      ],
      placeholder: 'Tous les types'
    },
    {
      name: 'status',
      label: 'Statut',
      type: 'select',
      options: [
        { value: 'active', label: 'Active' },
        { value: 'pending_verification', label: 'En attente' },
        { value: 'suspended', label: 'Suspendue' },
        { value: 'sold', label: 'Vendue' }
      ],
      placeholder: 'Tous les statuts'
    },
    {
      name: 'price',
      label: 'Prix (FCFA)',
      type: 'range',
      placeholderMin: 'Prix min',
      placeholderMax: 'Prix max'
    },
    {
      name: 'surface',
      label: 'Surface (m²)',
      type: 'range',
      placeholderMin: 'Surface min',
      placeholderMax: 'Surface max'
    },
    {
      name: 'created_at',
      label: 'Date de création',
      type: 'date',
      placeholder: 'Sélectionner une date'
    }
  ];

  const filterPresets = [
    {
      label: 'Nouveautés (7j)',
      filters: {
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    },
    {
      label: 'Actives uniquement',
      filters: { status: 'active' }
    },
    {
      label: 'Prix > 50M',
      filters: { price_min: '50000000' }
    },
    {
      label: 'Grande surface',
      filters: { surface_min: '500' }
    }
  ];

  // 🆕 APPLIQUER FILTRES AVANCÉS
  const applyFilters = (appliedFilters) => {
    let filtered = [...properties];

    if (appliedFilters.search) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(appliedFilters.search.toLowerCase()) ||
        p.location.toLowerCase().includes(appliedFilters.search.toLowerCase())
      );
    }

    if (appliedFilters.property_type) {
      filtered = filtered.filter(p => p.type === appliedFilters.property_type);
    }

    if (appliedFilters.status) {
      filtered = filtered.filter(p => p.status === appliedFilters.status);
    }

    if (appliedFilters.price_min) {
      filtered = filtered.filter(p => p.price >= parseFloat(appliedFilters.price_min));
    }

    if (appliedFilters.price_max) {
      filtered = filtered.filter(p => p.price <= parseFloat(appliedFilters.price_max));
    }

    if (appliedFilters.surface_min) {
      filtered = filtered.filter(p => p.area >= parseFloat(appliedFilters.surface_min));
    }

    if (appliedFilters.surface_max) {
      filtered = filtered.filter(p => p.area <= parseFloat(appliedFilters.surface_max));
    }

    if (appliedFilters.created_at) {
      const filterDate = new Date(appliedFilters.created_at);
      filtered = filtered.filter(p => new Date(p.createdAt) >= filterDate);
    }

    setFilteredProperties(filtered);
    notify.success(`${filtered.length} propriété(s) trouvée(s)`);
  };

  // 🆕 BULK ACTIONS CONFIGURATION
  const bulkActions = [
    {
      label: 'Supprimer',
      icon: Trash2,
      variant: 'destructive',
      onClick: handleBulkDelete
    },
    {
      label: 'Exporter',
      icon: Download,
      onClick: handleBulkExport
    },
    {
      label: 'Archiver',
      icon: Archive,
      onClick: async (selectedItems) => {
        await notify.promise(
          Promise.all(
            selectedItems.map(id =>
              supabase.from('properties').update({ status: 'suspended' }).eq('id', id)
            )
          ),
          {
            loading: 'Archivage en cours...',
            success: `${selectedItems.length} propriété(s) archivée(s)`,
            error: 'Erreur lors de l\'archivage'
          }
        );
        deselectAll();
        loadProperties();
      }
    }
  ];

  // Filtrage (si pas de filtres avancés appliqués)
  const displayProperties = filteredProperties.length > 0 || properties.length === 0 
    ? filteredProperties 
    : properties.filter(property => {
        const matchesFilter = activeFilter === 'all' || property.status === activeFilter;
        const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             property.location.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
      });

  // Tri
  const sortedProperties = [...displayProperties].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'views':
        return b.views - a.views;
      case 'price-high':
        return b.price - a.price;
      case 'price-low':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  // Statistiques
  const stats = {
    total: properties.length,
    active: properties.filter(p => p.status === 'active').length,
    pending: properties.filter(p => p.status === 'pending_verification').length,
    sold: properties.filter(p => p.status === 'sold').length,
    totalViews: properties.reduce((sum, p) => sum + p.views, 0),
    totalInquiries: properties.reduce((sum, p) => sum + p.inquiries, 0)
  };

  // 🆕 LOADING STATE MODERNE
  if (loading) {
    return <LoadingState type="skeleton" rows={5} message="Chargement de vos propriétés..." />;
  }

  // 🆕 EMPTY STATE MODERNE
  if (properties.length === 0) {
    return (
      <EmptyState
        icon={Building2}
        title="Aucune propriété"
        description="Vous n'avez pas encore ajouté de propriété. Commencez maintenant pour attirer des acheteurs !"
        actions={[
          {
            label: "Ajouter une propriété",
            icon: Plus,
            onClick: () => navigate('/vendeur/add-property'),
            variant: 'default'
          },
          {
            label: "Guide de démarrage",
            icon: Sparkles,
            onClick: () => navigate('/guide'),
            variant: 'outline'
          }
        ]}
      />
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header avec titre et action principale */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes Propriétés</h1>
          <p className="text-gray-600 mt-1">
            Gérez et optimisez vos annonces immobilières
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={() => exportToCSV(properties)}
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter tout
          </Button>
          <Link to="/vendeur/add-property">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une Propriété
            </Button>
          </Link>
        </div>
      </div>

      {/* 🆕 STATS CARDS MODERNES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Total"
          value={stats.total}
          icon={Building2}
          color="blue"
          onClick={() => setActiveFilter('all')}
        />
        <StatsCard
          title="Actives"
          value={stats.active}
          icon={CheckCircle}
          color="green"
          trend={{ value: 12, direction: 'up' }}
          description="vs mois dernier"
          onClick={() => setActiveFilter('active')}
        />
        <StatsCard
          title="En attente"
          value={stats.pending}
          icon={Clock}
          color="yellow"
          onClick={() => setActiveFilter('pending_verification')}
        />
        <StatsCard
          title="Vendues"
          value={stats.sold}
          icon={Star}
          color="purple"
          onClick={() => setActiveFilter('sold')}
        />
        <StatsCard
          title="Total Vues"
          value={stats.totalViews}
          icon={Eye}
          color="blue"
          description={`${stats.totalInquiries} demandes`}
        />
      </div>

      {/* 🆕 BARRE D'ACTIONS ET FILTRES */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-3 flex-wrap">
          <AdvancedFilters
            filters={filters}
            presets={filterPresets}
            onApplyFilters={applyFilters}
            onResetFilters={() => {
              setFilteredProperties(properties);
              notify.info('Filtres réinitialisés');
            }}
          />
          
          <Button
            variant="outline"
            onClick={() => loadProperties()}
            size="sm"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualiser
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          {sortedProperties.length} propriété(s)
          {selectedCount > 0 && ` · ${selectedCount} sélectionnée(s)`}
        </div>
      </div>

      {/* 🆕 LISTE DE PROPRIÉTÉS AVEC CHECKBOXES */}
      {sortedProperties.length === 0 ? (
        <EmptyState
          icon={Home}
          title="Aucune propriété trouvée"
          description={searchTerm || activeFilter !== 'all'
            ? 'Essayez de modifier vos filtres pour voir plus de résultats'
            : 'Commencez par ajouter votre première propriété'}
          actions={[
            {
              label: "Ajouter une Propriété",
              icon: Plus,
              onClick: () => navigate('/vendeur/add-property')
            }
          ]}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {sortedProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gray-200">
                  {property.imageUrl ? (
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  
                  {/* 🆕 CHECKBOX POUR BULK SELECTION */}
                  <div className="absolute top-2 left-2">
                    <div className="bg-white/90 backdrop-blur-sm rounded p-1">
                      <Checkbox
                        checked={isSelected(property.id)}
                        onCheckedChange={() => toggleSelection(property.id)}
                        className="h-5 w-5"
                      />
                    </div>
                  </div>

                  {/* Badges overlay */}
                  <div className="absolute top-2 left-14 flex flex-col gap-2">
                    {property.featured && (
                      <Badge className="bg-yellow-500">
                        <Star className="h-3 w-3 mr-1" />
                        En vedette
                      </Badge>
                    )}
                    {property.aiOptimized && (
                      <Badge className="bg-purple-500">
                        <Sparkles className="h-3 w-3 mr-1" />
                        IA
                      </Badge>
                    )}
                    {property.blockchainVerified && (
                      <Badge className="bg-orange-500">
                        <Zap className="h-3 w-3 mr-1" />
                        Blockchain
                      </Badge>
                    )}
                  </div>

                  {/* Menu */}
                  <div className="absolute top-2 right-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="secondary" className="bg-white/90">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          // 🔍 DEBUG COMPLET: Vérifier property.id avant navigation
                          console.group('🔍 DEBUG EDIT PROPERTY - DÉTAILLÉ');
                          console.log('Property ID:', property.id);
                          console.log('Property ID Type:', typeof property.id);
                          console.log('Property Title:', property.title);
                          console.log('Property Object:', JSON.stringify(property, null, 2));
                          console.log('Target URL:', `/vendeur/edit-property/${property.id}`);
                          console.log('Current Location:', window.location.href);
                          console.log('User ID:', user?.id);
                          console.groupEnd();
                          
                          if (!property.id) {
                            console.error('❌ ERROR: property.id est undefined ou null!');
                            alert('❌ Erreur: ID de la propriété manquant.\n\nOuvrez la console (F12) pour plus de détails.');
                            return;
                          }
                          
                          // Vérifier que property.id est un UUID valide
                          const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
                          if (!uuidRegex.test(property.id)) {
                            console.error('❌ ERROR: property.id n\'est pas un UUID valide:', property.id);
                            alert(`❌ Erreur: ID invalide (${property.id}).\n\nFormat attendu: UUID.\nVoir console (F12) pour détails.`);
                            return;
                          }
                          
                          console.log('✅ ID valide, navigation en cours vers:', `/vendeur/edit-property/${property.id}`);
                          
                          // Navigation vers page d'édition
                          navigate(`/vendeur/edit-property/${property.id}`);
                        }}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedProperty(property);
                          setPhotoUploadOpen(true);
                        }}>
                          <Camera className="h-4 w-4 mr-2" />
                          Gérer les photos
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          // Ouvrir dans nouvel onglet pour voir l'annonce publique
                          window.open(`/parcelle/${property.id}`, '_blank');
                        }}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Voir l'annonce
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicate(property)}>
                          <Copy className="h-4 w-4 mr-2" />
                          Dupliquer
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleFeatured(property.id, property.featured)}>
                          <Star className="h-4 w-4 mr-2" />
                          {property.featured ? 'Retirer la mise en avant' : 'Mettre en avant'}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDelete(property.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Content */}
                <CardContent className="pt-4">
                  <div className="mb-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{property.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {property.location}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {parseInt(property.price).toLocaleString('fr-FR')} FCFA
                      </p>
                      <p className="text-sm text-gray-600">{property.area} m²</p>
                    </div>
                    <Badge className={statusColors[property.status]}>
                      {statusLabels[property.status]}
                    </Badge>
                  </div>

                  {/* Verification Status */}
                  {property.verificationStatus !== 'verified' && (
                    <div className="mb-3">
                      <Badge className={verificationStatusColors[property.verificationStatus]}>
                        {verificationStatusLabels[property.verificationStatus]}
                      </Badge>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                    <div className="bg-gray-50 rounded p-2">
                      <Eye className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                      <p className="text-xs font-semibold">{property.views}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <Heart className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                      <p className="text-xs font-semibold">{property.favorites}</p>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <MessageSquare className="h-4 w-4 mx-auto text-gray-600 mb-1" />
                      <p className="text-xs font-semibold">{property.inquiries}</p>
                    </div>
                  </div>

                  {/* Completion */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-gray-600">Complétion</span>
                      <span className="font-semibold">{property.completion}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all"
                        style={{ width: `${property.completion}%` }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* 🆕 BULK ACTIONS BAR */}
      <BulkActions
        selectedItems={selectedIds}
        totalItems={properties.length}
        onSelectAll={() => selectAll(properties)}
        onDeselectAll={deselectAll}
        actions={bulkActions}
        position="fixed"
      />

      {/* 🆕 SEMAINE 3 - Photo Upload Modal */}
      <PhotoUploadModal
        open={photoUploadOpen}
        onOpenChange={setPhotoUploadOpen}
        propertyId={selectedProperty?.id}
        onUploadComplete={() => {
          loadProperties();
          notify.success('Photos uploadées avec succès !');
        }}
      />
    </div>
  );
};

export default VendeurPropertiesRealData;
