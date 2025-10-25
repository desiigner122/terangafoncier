/**
 * Page Mes Achats - Version Refonte Moderne 2025
 * Liste des demandes d'achat avec design moderne et synchronisation temps réel
 * @author Teranga Foncier Team
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Clock, CheckCircle, XCircle, Eye, ArrowRight, MessageSquare,
  DollarSign, Calendar, Filter, Search, Download, Home, Building2,
  MapPin, TrendingUp, AlertCircle, Plus, Users, Phone, Mail, Package,
  ChevronRight, Star, Briefcase, FileCheck, ClipboardList, Sparkles,
  Activity, BarChart3, Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { cn } from '@/lib/utils';
import WorkflowStatusService from '@/services/WorkflowStatusService';
import RealtimeNotificationService from '@/services/RealtimeNotificationService';

const ParticulierMesAchatsRefonte = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [purchaseCases, setPurchaseCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    completed: 0,
    pending: 0
  });

  useEffect(() => {
    if (user) {
      loadPurchaseCases();
      setupRealtimeSubscriptions();
    }

    return () => {
      RealtimeNotificationService.unsubscribeAll();
    };
  }, [user]);

  useEffect(() => {
    filterCases();
  }, [searchTerm, activeFilter, purchaseCases]);

  const loadPurchaseCases = async () => {
    try {
      setLoading(true);
      console.log('🚀 [DEBUG] Exécution de loadPurchaseCases - Version 3');
      console.log('👤 User ID:', user.id);

      // Charger TOUS les dossiers d'abord (sans filtre) pour diagnostiquer
      const { data: allCases, error: allCasesError } = await supabase
        .from('purchase_cases')
        .select('id, buyer_id, case_number, created_at');
      
      console.log('📊 Tous les dossiers (sans filtre):', { count: allCases?.length, error: allCasesError });

      // Maintenant charger les dossiers filtrés avec les relations
      const { data: casesData, error: casesError } = await supabase
        .from('purchase_cases')
        .select(`
          id,
          buyer_id,
          seller_id,
          case_number,
          status,
          offered_price,
          created_at,
          request:requests!purchase_cases_request_id_fkey (
            id,
            user_id,
            property_id,
            offered_price,
            created_at
          ),
          property:parcels!purchase_cases_parcelle_id_fkey (
            id,
            title,
            name,
            location,
            price,
            surface,
            status
          ),
          seller:profiles!purchase_cases_seller_id_fkey (
            id,
            full_name,
            first_name,
            last_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('buyer_id', user.id)
        .order('created_at', { ascending: false });

      if (casesError) {
        console.error('❌ Erreur chargement dossiers:', casesError);
        toast.error('Erreur lors du chargement: ' + casesError?.message);
        setLoading(false);
        return;
      }

      console.log('📋 Dossiers chargés pour user:', { userId: user.id, count: casesData?.length, data: casesData });
      setPurchaseCases(casesData || []);
      calculateStats(casesData || []);
      setLoading(false);
    } catch (error) {
      console.error('❌ Erreur globale:', error);
      toast.error('Erreur inattendue: ' + error?.message);
      setLoading(false);
    }
  };

  const setupRealtimeSubscriptions = () => {
    try {
      // Subscribe to purchase_cases changes
      const subscription = supabase
        .channel('purchase_cases_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'purchase_cases',
            filter: `buyer_id=eq.${user.id}`
          },
          (payload) => {
            console.log('📡 [REALTIME] Changement dossier:', payload);
            toast.info('Liste mise à jour');
            loadPurchaseCases();
          }
        )
        .subscribe();

      console.log('✅ Realtime subscriptions activées');
    } catch (error) {
      console.error('Erreur setup realtime:', error);
    }
  };

  const calculateStats = (cases) => {
    const total = cases.length;
    const active = cases.filter(c => 
      !['completed', 'cancelled', 'archived'].includes(c.status)
    ).length;
    const completed = cases.filter(c => c.status === 'completed').length;
    const pending = cases.filter(c => 
      ['initiated', 'pending', 'waiting_response'].includes(c.status)
    ).length;

    setStats({ total, active, completed, pending });
  };

  const filterCases = () => {
    let filtered = [...purchaseCases];

    // Filter by status
    if (activeFilter !== 'all') {
      filtered = filtered.filter(c => {
        if (activeFilter === 'active') {
          return !['completed', 'cancelled', 'archived'].includes(c.status);
        }
        if (activeFilter === 'completed') {
          return c.status === 'completed';
        }
        if (activeFilter === 'pending') {
          return ['initiated', 'pending', 'waiting_response'].includes(c.status);
        }
        return true;
      });
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(c => 
        c.case_number?.toLowerCase().includes(term) ||
        c.property?.title?.toLowerCase().includes(term) ||
        c.property?.name?.toLowerCase().includes(term) ||
        c.property?.location?.toLowerCase().includes(term) ||
        c.seller?.full_name?.toLowerCase().includes(term)
      );
    }

    setFilteredCases(filtered);
  };

  const getStatusInfo = (status) => {
    const label = WorkflowStatusService.getLabel(status) || status || 'Inconnu';
    const colorClass = WorkflowStatusService.getColor(status) || 'bg-gray-100 text-gray-800';
    
    // Map color class to simple color name for backward compatibility
    let color = 'gray';
    if (colorClass.includes('blue')) color = 'blue';
    else if (colorClass.includes('green')) color = 'green';
    else if (colorClass.includes('red')) color = 'red';
    else if (colorClass.includes('purple')) color = 'purple';
    else if (colorClass.includes('yellow')) color = 'yellow';
    
    return {
      label,
      color,
      icon: AlertCircle
    };
  };

  const getProgressPercentage = (status) => {
    return WorkflowStatusService.calculateProgressFromStatus(status) || 0;
  };

  const formatPrice = (price) => {
    if (!price) return 'Prix non défini';
    return `${price.toLocaleString('fr-FR')} FCFA`;
  };

  const navigateToCaseDetail = (caseItem) => {
    // Utiliser case_number si disponible, sinon l'id
    const identifier = caseItem.case_number || caseItem.id;
    navigate(`/acheteur/dossier/${identifier}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Chargement de vos achats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header moderne avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Briefcase className="w-8 h-8" />
                Mes Achats
              </h1>
              <p className="text-blue-100 mt-2">
                Suivez toutes vos demandes d'achat de propriétés en temps réel
              </p>
            </div>
            <Button
              onClick={() => navigate('/acheteur/recherche')}
              size="lg"
              className="bg-white text-blue-600 hover:bg-blue-50"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nouvelle demande
            </Button>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border-none bg-white/10 backdrop-blur-sm text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Total</p>
                    <p className="text-3xl font-bold mt-1">{stats.total}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/10 backdrop-blur-sm text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">En cours</p>
                    <p className="text-3xl font-bold mt-1">{stats.active}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/10 backdrop-blur-sm text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">Complétés</p>
                    <p className="text-3xl font-bold mt-1">{stats.completed}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-white/10 backdrop-blur-sm text-white">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm">En attente</p>
                    <p className="text-3xl font-bold mt-1">{stats.pending}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                    <Clock className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Barre de recherche et filtres */}
        <Card className="border-none shadow-lg mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Rechercher par numéro, propriété, localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant={activeFilter === 'all' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('all')}
                  size="sm"
                >
                  Tous
                </Button>
                <Button
                  variant={activeFilter === 'active' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('active')}
                  size="sm"
                >
                  Actifs
                </Button>
                <Button
                  variant={activeFilter === 'pending' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('pending')}
                  size="sm"
                >
                  En attente
                </Button>
                <Button
                  variant={activeFilter === 'completed' ? 'default' : 'outline'}
                  onClick={() => setActiveFilter('completed')}
                  size="sm"
                >
                  Complétés
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liste des dossiers */}
        {filteredCases.length === 0 ? (
          <Card className="border-none shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || activeFilter !== 'all' 
                  ? 'Aucun dossier trouvé'
                  : 'Aucun achat en cours'
                }
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm || activeFilter !== 'all'
                  ? 'Essayez de modifier vos filtres de recherche'
                  : 'Commencez par rechercher une propriété qui vous intéresse'
                }
              </p>
              {!searchTerm && activeFilter === 'all' && (
                <Button onClick={() => navigate('/acheteur/recherche')}>
                  <Search className="w-4 h-4 mr-2" />
                  Rechercher une propriété
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence>
              {filteredCases.map((caseItem, index) => {
                const statusInfo = getStatusInfo(caseItem.status);
                const StatusIcon = statusInfo.icon;
                const progress = getProgressPercentage(caseItem.status);
                const property = caseItem.property;
                const seller = caseItem.seller;

                return (
                  <motion.div
                    key={caseItem.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card 
                      className="border-none shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                      onClick={() => navigateToCaseDetail(caseItem)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                          {/* Image de la propriété */}
                          <div className="md:w-48 h-32 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {property?.image_url || property?.photo_url ? (
                              <img
                                src={property.image_url || property.photo_url}
                                alt={property.title || property.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-12 h-12 text-gray-300" />
                              </div>
                            )}
                          </div>

                          {/* Détails du dossier */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                                    {property?.title || property?.name || 'Propriété'}
                                  </h3>
                                  <Badge 
                                    variant="secondary"
                                    className={cn(
                                      "font-medium",
                                      statusInfo.color === 'green' && "bg-green-100 text-green-800",
                                      statusInfo.color === 'blue' && "bg-blue-100 text-blue-800",
                                      statusInfo.color === 'yellow' && "bg-yellow-100 text-yellow-800",
                                      statusInfo.color === 'red' && "bg-red-100 text-red-800",
                                      statusInfo.color === 'purple' && "bg-purple-100 text-purple-800"
                                    )}
                                  >
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {statusInfo.label}
                                  </Badge>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                                  <div className="flex items-center gap-1">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="font-medium">{caseItem.case_number}</span>
                                  </div>
                                  {property?.location && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="w-4 h-4 text-green-600" />
                                      <span>{property.location}</span>
                                    </div>
                                  )}
                                  {(property?.area || property?.size || property?.surface) && (
                                    <div className="flex items-center gap-1">
                                      <Package className="w-4 h-4 text-orange-600" />
                                      <span>{property.area || property.size || property.surface} m²</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    <span>
                                      {format(new Date(caseItem.created_at), 'dd MMM yyyy', { locale: fr })}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 mb-3">
                                  <div className="text-2xl font-bold text-blue-600">
                                    {formatPrice(caseItem.offered_price || property?.price)}
                                  </div>
                                  {seller && (
                                    <div className="flex items-center gap-2">
                                      <Avatar className="w-6 h-6">
                                        <AvatarImage src={seller.avatar_url} />
                                        <AvatarFallback className="text-xs">
                                          {seller.full_name?.charAt(0) || 'V'}
                                        </AvatarFallback>
                                      </Avatar>
                                      <span className="text-sm text-gray-600">
                                        {seller.full_name || `${seller.first_name} ${seller.last_name}`}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Progress bar */}
                                <div className="space-y-2">
                                  <div className="flex items-center justify-between text-xs">
                                    <span className="text-gray-500">Progression</span>
                                    <span className="font-medium text-gray-700">{Math.round(progress)}%</span>
                                  </div>
                                  <Progress value={progress} className="h-2" />
                                </div>
                              </div>

                              {/* Actions */}
                              <Button
                                variant="ghost"
                                size="icon"
                                className="flex-shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigateToCaseDetail(caseItem);
                                }}
                              >
                                <ChevronRight className="w-5 h-5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default ParticulierMesAchatsRefonte;
