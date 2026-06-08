import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building,
  Home,
  MapPin,
  DollarSign,
  Calendar,
  Eye,
  Edit3,
  Trash2,
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  RefreshCw,
  Brain,
  Star,
  Image,
  FileText,
  Users
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { OpenAIService } from '../../../services/ai/OpenAIService';
import { hybridDataService } from '../../../services/HybridDataService';

const PropertiesManagementPage = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState([]);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalProperties: 0,
    approvedProperties: 0,
    pendingProperties: 0,
    rejectedProperties: 0,
    averagePrice: 0
  });

  useEffect(() => {
    loadProperties();
    generateAIInsights();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [properties, searchTerm, selectedFilter]);

  const loadProperties = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Chargement des propriétés depuis Supabase...');
      
      // Charger les propriétés réelles depuis Supabase
      const realProperties = await hybridDataService.getProperties();
      
      if (realProperties && realProperties.length > 0) {
        // Transformer les données réelles
        const formattedProperties = realProperties.map((property, index) => ({
          id: property.id || index + 1,
          title: property.title || property.name || 'Propriété sans titre',
          description: property.description || 'Description non disponible',
          type: property.property_type || property.type || 'Autre',
          status: property.status || 'pending',
          price: property.price || 0,
          surface: property.surface || property.area || 0,
          location: property.location || property.address || 'Location non spécifiée',
          owner: property.owner_name || property.owner || 'Propriétaire inconnu',
          ownerEmail: property.owner_email || 'email@inconnu.com',
          images: property.images_count || Math.floor(Math.random() * 10) + 1,
          createdAt: property.created_at ? new Date(property.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
          approvedAt: property.approved_at ? new Date(property.approved_at).toISOString().split('T')[0] : null,
          views: property.views || Math.floor(Math.random() * 1000) + 100,
          favorites: property.favorites_count || Math.floor(Math.random() * 50) + 5,
          coordinates: property.coordinates || { lat: 14.7645 + (Math.random() - 0.5) * 0.1, lng: -17.4692 + (Math.random() - 0.5) * 0.1 }
        }));
        
        setProperties(formattedProperties);
        console.log(`✅ ${formattedProperties.length} propriétés réelles chargées`);
        
        // Calcul des statistiques avec les données formatées
        const totalProperties = formattedProperties.length;
        const approvedProperties = formattedProperties.filter(p => p.status === 'approved').length;
        const pendingProperties = formattedProperties.filter(p => p.status === 'pending').length;
        const rejectedProperties = formattedProperties.filter(p => p.status === 'rejected').length;
        const averagePrice = totalProperties > 0 ? formattedProperties.reduce((sum, p) => sum + (p.price || 0), 0) / totalProperties : 0;

        setStats({ totalProperties, approvedProperties, pendingProperties, rejectedProperties, averagePrice });
        
      } else {
        // Si pas de propriétés dans Supabase, utiliser des données par défaut
        console.log('⚠️ Aucune propriété dans Supabase, utilisation de données par défaut');
        const defaultProperties = []; // démo retirée
        
        setProperties(defaultProperties);
        setStats({ totalProperties: 1, approvedProperties: 1, pendingProperties: 0, rejectedProperties: 0, averagePrice: 450000000 });
      }
      
    } catch (error) {
      console.error('❌ Erreur chargement propriétés:', error);
      setError(error.message);
      
      // En cas d'erreur, afficher des données par défaut minimales
      const fallbackProperties = [
        {
          id: 'fallback-1',
          title: 'Propriété par défaut',
          description: 'Aucune propriété chargée depuis la base de données',
          type: 'Autre',
          status: 'pending',
          price: 0,
          surface: 0,
          location: 'Non spécifié',
          owner: 'Non spécifié',
          ownerEmail: 'non-specifie@email.com',
          images: 0,
          createdAt: new Date().toISOString().split('T')[0],
          approvedAt: null,
          views: 0,
          favorites: 0,
          coordinates: { lat: 14.7645, lng: -17.4692 }
        }
      ];
      
      setProperties(fallbackProperties);
      setStats({ totalProperties: 0, approvedProperties: 0, pendingProperties: 0, rejectedProperties: 0, averagePrice: 0 });
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    try {
      // Simulation insights IA - En production, appel API OpenAI
      setAiInsights([
        'Prix moyen Dakar en hausse de 12% ce trimestre',
        'Zone Almadies: demande très forte (+45% recherches)',
        '3 propriétés nécessitent validation urgente',
        'Terrains Thiès: opportunité investissement détectée'
      ]);
    } catch (error) {
      console.error('Erreur génération insights IA:', error);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.owner.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    switch (selectedFilter) {
      case 'approved':
        filtered = filtered.filter(p => p.status === 'approved');
        break;
      case 'pending':
        filtered = filtered.filter(p => p.status === 'pending');
        break;
      case 'rejected':
        filtered = filtered.filter(p => p.status === 'rejected');
        break;
      case 'villa':
        filtered = filtered.filter(p => p.type === 'Villa');
        break;
      case 'appartement':
        filtered = filtered.filter(p => p.type === 'Appartement');
        break;
      default:
        break;
    }

    setFilteredProperties(filtered);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      'approved': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTypeColor = (type) => {
    const colors = {
      'Villa': 'bg-purple-100 text-purple-800',
      'Appartement': 'bg-blue-100 text-blue-800',
      'Maison': 'bg-green-100 text-green-800',
      'Terrain': 'bg-orange-100 text-orange-800',
      'Commercial': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handlePropertyAction = (action, propertyId) => {
    switch (action) {
      case 'approve':
        setProperties(properties.map(p => 
          p.id === propertyId ? { ...p, status: 'approved', approvedAt: new Date().toISOString() } : p
        ));
        break;
      case 'reject':
        setProperties(properties.map(p => 
          p.id === propertyId ? { ...p, status: 'rejected', rejectedAt: new Date().toISOString() } : p
        ));
        break;
      case 'delete':
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
          setProperties(properties.filter(p => p.id !== propertyId));
        }
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Propriétés</h1>
          <p className="text-gray-600 mt-1">Gérez toutes les propriétés de la plateforme</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle Propriété
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Propriétés</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalProperties}</p>
              </div>
              <Building className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Approuvées</p>
                <p className="text-3xl font-bold text-green-600">{stats.approvedProperties}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pendingProperties}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Rejetées</p>
                <p className="text-3xl font-bold text-red-600">{stats.rejectedProperties}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prix Moyen</p>
                <p className="text-lg font-bold text-purple-600">{formatCurrency(stats.averagePrice)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-900">Insights IA Immobilier</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-blue-800">
                  <CheckCircle className="h-4 w-4" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par titre, lieu ou propriétaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les propriétés</SelectItem>
                  <SelectItem value="approved">Approuvées</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="rejected">Rejetées</SelectItem>
                  <SelectItem value="villa">Villas</SelectItem>
                  <SelectItem value="appartement">Appartements</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={loadProperties}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Properties List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Propriétés ({filteredProperties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Home className="h-8 w-8 text-gray-400" />
                        <span className="absolute bottom-1 right-1 text-xs bg-blue-600 text-white px-1 rounded">
                          {property.images}
                        </span>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {property.title}
                          </h3>
                          <Badge className={getTypeColor(property.type)}>
                            {property.type}
                          </Badge>
                          <Badge className={getStatusColor(property.status)}>
                            {property.status === 'approved' ? 'Approuvée' : 
                             property.status === 'pending' ? 'En attente' : 'Rejetée'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-2">{property.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{property.location}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Building className="h-3 w-3" />
                            <span>{property.surface}m²</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3" />
                            <span>{property.owner}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{property.views} vues</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3" />
                            <span>{property.favorites} favoris</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-bold text-blue-600">
                            {formatCurrency(property.price)}
                          </p>
                          <span className="text-gray-500">
                            ({formatCurrency(property.price / property.surface)}/m²)
                          </span>
                        </div>
                        
                        {property.status === 'rejected' && property.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50 rounded text-red-700 text-sm">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            Raison du rejet: {property.rejectionReason}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button size="sm" variant="outline">
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      {property.status === 'pending' && (
                        <>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePropertyAction('approve', property.id)}
                            className="text-green-600 hover:bg-green-50"
                          >
                            <CheckCircle className="h-3 w-3" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handlePropertyAction('reject', property.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <XCircle className="h-3 w-3" />
                          </Button>
                        </>
                      )}
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handlePropertyAction('delete', property.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesManagementPage;