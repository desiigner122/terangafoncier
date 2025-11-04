import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Building2,
  Users,
  MessageSquare,
  BarChart3,
  Settings,
  Plus,
  Star,
  Eye,
  Phone,
  Mail,
  MapPin,
  DollarSign,
  TrendingUp,
  Edit,
  Share2,
  Bell,
  Search,
  Filter,
  Calendar,
  Activity,
  Crown,
  Zap,
  Brain,
  Menu,
  X,
  ChevronRight,
  RefreshCw,
  ChevronDown,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const INITIAL_VENDEUR_DATA = {
  profile: {
    name: '',
    status: 'Vendeur',
    rating: 0,
    totalSales: 0,
    avatar: '',
    badge: 'starter'
  },
  stats: {
    totalProperties: 0,
    activeListings: 0,
    soldThisMonth: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    previousMonthRevenue: 0,
    revenueGrowth: 0,
    monthlyViews: 0,
    totalInquiries: 0,
    inquiriesThisWeek: 0,
    pendingRequests: 0,
    newLeads: 0,
    conversionRate: 0,
    averageSaleDuration: null,
    engagementRate: 0
  },
  properties: [],
  prospects: []
};

const PROSPECT_STATUS_LABELS = {
  hot: 'Chaud',
  warm: 'Tiède',
  cold: 'Froid',
  prospect: 'Prospect',
  customer: 'Client',
  lead: 'Lead',
  new: 'Nouveau'
};

const PROPERTY_STATUS_LABELS = {
  active: 'Actif',
  pending: 'En attente',
  pending_verification: 'En vérification',
  pending_validation: 'En vérification',
  negotiation: 'En négociation',
  in_negotiation: 'En négociation',
  sold: 'Vendu',
  suspended: 'Suspendu',
  archived: 'Archivé',
  draft: 'Brouillon'
};

const DEFAULT_PROPERTY_IMAGE = 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop';

const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'XOF',
  minimumFractionDigits: 0
});

const formatCurrency = (amount = 0) => {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return currencyFormatter.format(safeAmount);
};

const formatBudgetRange = (min, max) => {
  if (!min && !max) return 'Budget non défini';
  if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  if (min) return `≥ ${formatCurrency(min)}`;
  return `≤ ${formatCurrency(max)}`;
};

const resolveAvatar = (name) => {
  const label = name || 'Vendeur';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(label)}&background=f97316&color=fff`;
};

const resolvePropertyImage = (images) => {
  if (Array.isArray(images) && images.length > 0) {
    const first = images[0];
    if (typeof first === 'string') {
      if (first.startsWith('http')) return first;
      if (first.startsWith('data:')) return first;
    }
    if (first?.url) return first.url;
  }
  return DEFAULT_PROPERTY_IMAGE;
};

const mapPropertyStatus = (status) => {
  if (!status) return 'Actif';
  const key = typeof status === 'string' ? status.toLowerCase() : status;
  return PROPERTY_STATUS_LABELS[key] || PROPERTY_STATUS_LABELS[status] || 'Actif';
};

const mapProspectStatus = (status) => {
  if (!status) return 'Prospect';
  const key = typeof status === 'string' ? status.toLowerCase() : status;
  return PROSPECT_STATUS_LABELS[key] || PROSPECT_STATUS_LABELS[status] || 'Prospect';
};

const computePriority = (requestsCount, statusLabel) => {
  if (statusLabel === 'En négociation' || statusLabel === 'Vendu') return 'high';
  if (requestsCount >= 10) return 'high';
  if (requestsCount >= 4) return 'medium';
  return 'low';
};

const getStatusColor = (status) => {
  const colors = {
    'Actif': 'bg-green-100 text-green-800',
    'En attente': 'bg-yellow-100 text-yellow-800',
    'En vérification': 'bg-yellow-100 text-yellow-800',
    'En négociation': 'bg-yellow-100 text-yellow-800',
    'Vendu': 'bg-blue-100 text-blue-800',
    'Suspendu': 'bg-gray-100 text-gray-800',
    'Archivé': 'bg-slate-100 text-slate-800',
    'Brouillon': 'bg-slate-100 text-slate-800',
    'Chaud': 'bg-red-100 text-red-800',
    'Tiède': 'bg-yellow-100 text-yellow-800',
    'Froid': 'bg-blue-100 text-blue-800',
    'Prospect': 'bg-indigo-100 text-indigo-800',
    'Client': 'bg-emerald-100 text-emerald-800',
    'Lead': 'bg-purple-100 text-purple-800',
    'Nouveau': 'bg-slate-100 text-slate-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

const getPriorityColor = (priority) => {
  const colors = {
    high: 'border-l-red-500',
    medium: 'border-l-yellow-500',
    low: 'border-l-green-500'
  };
  return colors[priority] || 'border-l-gray-500';
};

const VendeurDashboardModern = () => {
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [vendeurData, setVendeurData] = useState(INITIAL_VENDEUR_DATA);
  const [unreadMessages, setUnreadMessages] = useState(0);

  const loadVendeurData = useCallback(async ({ skipSpinner = false } = {}) => {
    if (!user?.id) {
      return;
    }

    if (skipSpinner) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const [
        propertiesResult,
        dealsResult,
        contactsResult,
        unreadMessagesResult
      ] = await Promise.all([
        supabase
          .from('properties')
          .select('id,title,property_type,status,verification_status,price,surface,location,city,region,views_count,favorites_count,contact_requests_count,images,created_at,updated_at,published_at,ai_analysis,blockchain_verified,gps_verified')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false }),
        supabase
          .from('crm_deals')
          .select('id,title,value,stage,created_at,updated_at')
          .eq('user_id', user.id),
        supabase
          .from('crm_contacts')
          .select('id,name,first_name,last_name,email,phone,status,score,avatar_url,interests,budget_min,budget_max,budget_range,created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(12),
        supabase
          .from('messages')
          .select('id', { count: 'exact', head: true })
          .eq('recipient_id', user.id)
          .eq('status', 'sent')
          .is('read_at', null)
      ]);

      const { data: propertiesData, error: propertiesError } = propertiesResult;
      const { data: dealsData, error: dealsError } = dealsResult;
      const { data: contactsData, error: contactsError } = contactsResult;
      const { error: unreadMessagesError, count: unreadMessagesCount } = unreadMessagesResult;

      if (propertiesError) throw propertiesError;

      const properties = propertiesData || [];
      const deals = dealsError ? [] : (dealsData || []);
      if (dealsError) console.warn('Erreur chargement deals vendeur:', dealsError);
      const contacts = contactsError ? [] : (contactsData || []);
      if (contactsError) console.warn('Erreur chargement contacts vendeur:', contactsError);

      if (unreadMessagesError) {
        console.warn('Erreur chargement messages non lus:', unreadMessagesError);
      } else {
        setUnreadMessages(unreadMessagesCount || 0);
      }

      const propertyIds = properties.map(prop => prop.id).filter(Boolean);
      let requests = [];

      if (propertyIds.length > 0) {
        const { data: purchaseRequests, error: purchaseError } = await supabase
          .from('purchase_requests')
          .select('id,property_id,status,created_at')
          .in('property_id', propertyIds);

        if (!purchaseError && Array.isArray(purchaseRequests)) {
          requests = purchaseRequests;
        } else if (purchaseError && purchaseError.code !== 'PGRST116') {
          console.warn('Erreur purchase_requests:', purchaseError);
        }

        try {
          const { data: inquiriesData, error: inquiriesError } = await supabase
            .from('property_inquiries')
            .select('id,property_id,status,created_at')
            .in('property_id', propertyIds);

          if (!inquiriesError && Array.isArray(inquiriesData)) {
            const existing = new Set(requests.map(req => req.id));
            inquiriesData.forEach(inquiry => {
              if (!existing.has(inquiry.id)) {
                requests.push(inquiry);
              }
            });
          } else if (inquiriesError && inquiriesError.code !== 'PGRST116') {
            console.warn('Erreur property_inquiries:', inquiriesError);
          }
        } catch (fetchError) {
          console.warn('Table property_inquiries indisponible:', fetchError);
        }
      }

        const requestsByProperty = new Map();
        requests.forEach(req => {
          if (!req?.property_id) return;
          const list = requestsByProperty.get(req.property_id) || [];
          list.push(req);
          requestsByProperty.set(req.property_id, list);
        });

        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);

        const totalViews = properties.reduce((sum, prop) => sum + (prop.views_count || 0), 0);
        const totalInquiries = Array.from(requestsByProperty.values()).reduce((sum, list) => sum + list.length, 0);
        const inquiriesThisWeek = requests.filter(req => req?.created_at && new Date(req.created_at) >= weekAgo).length;
        const pendingRequests = requests.filter(req => {
          const status = (req?.status || '').toLowerCase();
          return ['pending', 'waiting_response', 'nouvelle', 'new', 'en_attente'].includes(status);
        }).length;
        const newLeads = inquiriesThisWeek;

        const mappedProperties = properties.map(prop => {
          const propertyRequests = requestsByProperty.get(prop.id) || [];
          const requestCount = propertyRequests.length || prop.contact_requests_count || 0;
          const statusLabel = mapPropertyStatus(prop.status);

          return {
            id: prop.id,
            title: prop.title || 'Annonce sans titre',
            location: prop.location || [prop.city, prop.region].filter(Boolean).join(', ') || 'Localisation à définir',
            price: prop.price || 0,
            size: prop.surface ? `${prop.surface} m²` : 'Surface non renseignée',
            status: statusLabel,
            views: prop.views_count || 0,
            inquiries: requestCount,
            photos: Array.isArray(prop.images) ? prop.images.length : 0,
            type: prop.property_type ? prop.property_type.charAt(0).toUpperCase() + prop.property_type.slice(1) : 'Propriété',
            priority: computePriority(requestCount, statusLabel),
            image: resolvePropertyImage(prop.images),
            datePosted: prop.published_at || prop.created_at || null
          };
        });

        const wonStages = ['won', 'completed', 'closed_won', 'gagné', 'termine'];
        const wonDeals = deals.filter(deal => wonStages.includes((deal.stage || '').toLowerCase()));
        const totalSales = wonDeals.length;
        const totalRevenue = wonDeals.reduce((sum, deal) => sum + (deal.value || 0), 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const closedThisMonth = wonDeals.filter(deal => {
          const closedAt = new Date(deal.updated_at || deal.created_at || now);
          return closedAt >= startOfMonth;
        });

        const monthlyRevenue = closedThisMonth.reduce((sum, deal) => sum + (deal.value || 0), 0);

        const previousMonthRevenue = wonDeals
          .filter(deal => {
            const closedAt = new Date(deal.updated_at || deal.created_at || now);
            return closedAt >= startOfPrevMonth && closedAt <= endOfPrevMonth;
          })
          .reduce((sum, deal) => sum + (deal.value || 0), 0);

        const revenueGrowth = previousMonthRevenue > 0
          ? Math.round(((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100)
          : (monthlyRevenue > 0 ? 100 : 0);

        const soldProperties = properties.filter(prop => (prop.status || '').toLowerCase() === 'sold');
        const soldThisMonthFromProperties = soldProperties.filter(prop => {
          const updatedAt = new Date(prop.updated_at || prop.created_at || now);
          return updatedAt >= startOfMonth;
        }).length;

        const soldThisMonth = Math.max(soldThisMonthFromProperties, closedThisMonth.length);

        const averageSaleDuration = soldProperties.length > 0
          ? Math.round(
              soldProperties.reduce((total, prop) => {
                const createdAt = new Date(prop.created_at || now);
                const updatedAt = new Date(prop.updated_at || now);
                return total + Math.max(0, (updatedAt - createdAt) / (1000 * 60 * 60 * 24));
              }, 0) / soldProperties.length
            )
          : null;

        const conversionRate = totalViews > 0
          ? Math.round((totalInquiries / totalViews) * 100)
          : 0;

        const engagementRate = totalViews > 0
          ? Math.min(100, Math.round((totalInquiries / totalViews) * 100))
          : 0;

        const mappedProspects = contacts.map(contact => {
          const name =
            contact.name ||
            [contact.first_name, contact.last_name].filter(Boolean).join(' ').trim() ||
            contact.email ||
            'Prospect';

          const budgetMin = contact.budget_min || contact.budget_range?.min || null;
          const budgetMax = contact.budget_max || contact.budget_range?.max || null;

          return {
            id: contact.id,
            name,
            email: contact.email || '—',
            phone: contact.phone || '—',
            avatar: contact.avatar_url || resolveAvatar(name),
            interest: Array.isArray(contact.interests) && contact.interests.length > 0
              ? contact.interests[0]
              : 'Projet immobilier',
            budget: formatBudgetRange(budgetMin, budgetMax),
            score: contact.score != null ? Math.round(contact.score) : 60,
            status: mapProspectStatus(contact.status)
          };
        }).slice(0, 5);

        const metadata = profile?.metadata || profile?.profile_metadata || {};
        const displayName =
          profile?.full_name ||
          metadata?.full_name ||
          [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() ||
          user?.user_metadata?.full_name ||
          (user?.email ? user.email.split('@')[0] : null) ||
          'Vendeur Teranga';

        const baseStatus =
          metadata?.seller_status ||
          profile?.role_label ||
          profile?.user_type ||
          (totalRevenue > 0 ? 'Vendeur Pro' : 'Nouveau vendeur');

        const rating = (() => {
          const raw = metadata?.seller_rating ?? profile?.seller_rating ?? 4.7;
          const numeric = Number(raw);
          if (!Number.isFinite(numeric)) return 4.7;
          return Math.min(5, Math.max(0, Math.round(numeric * 10) / 10));
        })();

        const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || resolveAvatar(displayName);

        const badge = (() => {
          if (totalRevenue >= 500_000_000) return 'platinum';
          if (totalRevenue >= 200_000_000) return 'gold';
          if (totalRevenue >= 50_000_000) return 'silver';
          if (totalRevenue > 0) return 'bronze';
          return 'starter';
        })();

        setVendeurData({
          profile: {
            name: displayName,
            status: totalRevenue >= 500_000_000 ? 'Vendeur Elite' : baseStatus,
            rating,
            totalSales,
            avatar: avatarUrl,
            badge
          },
          stats: {
            totalProperties: properties.length,
            activeListings: properties.filter(prop => (prop.status || '').toLowerCase() === 'active').length,
            soldThisMonth,
            totalRevenue,
            monthlyRevenue,
            previousMonthRevenue,
            revenueGrowth,
            monthlyViews: totalViews,
            totalInquiries,
            inquiriesThisWeek,
            pendingRequests,
            newLeads,
            conversionRate,
            averageSaleDuration,
            engagementRate
          },
          properties: mappedProperties,
          prospects: mappedProspects
        });
      } catch (err) {
        console.error('Erreur chargement dashboard vendeur:', err);
        setError('Impossible de charger vos données vendeur pour le moment. Merci de réessayer.');
      } finally {
        if (skipSpinner) {
          setRefreshing(false);
        } else {
          setLoading(false);
        }
      }
    }, [user, profile]);

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    loadVendeurData();
  }, [user?.id, loadVendeurData]);

  const handleRefresh = async () => {
    await loadVendeurData({ skipSpinner: true });
  };

  const navigation = [
    { id: 'dashboard', name: 'Tableau de bord', icon: Home, badge: null },
    { id: 'properties', name: 'Mes Biens', icon: Building2, badge: vendeurData.stats.activeListings },
    { id: 'crm', name: 'CRM Prospects', icon: Users, badge: vendeurData.prospects.length },
  { id: 'communication', name: 'Communication', icon: MessageSquare, badge: unreadMessages || null },
    { id: 'analytics', name: 'Analytics', icon: BarChart3, badge: null },
    { id: 'settings', name: 'Paramètres', icon: Settings, badge: null }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="w-16 h-16 border-4 border-orange-200 border-t-orange-500 rounded-full mx-auto mb-4"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          />
          <p className="text-gray-600 font-medium">Chargement de votre espace vendeur...</p>
  </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 flex items-center justify-center p-6">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-xl max-w-md text-center space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900">Oups !</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => loadVendeurData()}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:from-orange-600 hover:to-red-600 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  const pendingNotifications = Math.min(99, unreadMessages);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
        </AnimatePresence>

        <motion.div
          className={`fixed left-0 top-0 h-full w-80 bg-white/80 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
          initial={false}
          animate={{ x: isSidebarOpen ? 0 : -320 }}
        >
          <div className="p-6 border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={vendeurData.profile.avatar}
                    alt={vendeurData.profile.name}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-orange-200"
                  />
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="w-3 h-3 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{vendeurData.profile.name}</h3>
                  <p className="text-sm text-orange-600 font-medium">{vendeurData.profile.status}</p>
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(vendeurData.profile.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-gray-600">
                {vendeurData.profile.rating} ({vendeurData.profile.totalSales} ventes)
              </span>
            </div>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-white/60 hover:text-orange-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </div>
                {item.badge ? (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    activeTab === item.id
                      ? 'bg-white/20 text-white'
                      : 'bg-orange-100 text-orange-600'
                  }`}>
                    {item.badge}
                  </span>
                ) : null}
              </motion.button>
            ))}
          </nav>

          <div className="m-4 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl">
            <div className="flex items-center space-x-2 mb-2">
              <Brain className="w-5 h-5 text-purple-600" />
              <span className="font-semibold text-purple-800">Assistant IA</span>
            </div>
            <p className="text-sm text-purple-700 mb-3">
              Optimisez vos annonces avec l'intelligence artificielle
            </p>
            <button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
              <Zap className="w-4 h-4 inline mr-1" />
              Analyser maintenant
            </button>
          </div>
        </motion.div>

        <div className="lg:ml-80">
          <motion.header
            className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-30"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            <div className="px-6 py-4">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      Dashboard Vendeur
                    </h1>
                    <p className="text-gray-600">Gérez vos biens et prospects efficacement</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/60 border border-gray-200 rounded-lg hover:bg-white transition-colors disabled:opacity-60"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                    <span>{refreshing ? 'Actualisation…' : 'Actualiser'}</span>
                  </button>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Rechercher..."
                      className="pl-10 pr-4 py-2 bg-white/60 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  {/* Messages dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative">
                        <MessageSquare className="w-5 h-5" />
                        {unreadMessages > 0 && (
                          <Badge className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                            {unreadMessages > 9 ? '9+' : unreadMessages}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <div className="px-3 py-2 font-medium">Messages récents</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled>
                        <span className="text-sm text-slate-600">Aucun message récent</span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setActiveTab('communication')}>
                        Voir tous les messages
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Notifications dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="relative">
                        <Bell className="w-5 h-5" />
                        {pendingNotifications > 0 && (
                          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs min-w-[18px] h-[18px] flex items-center justify-center p-0">
                            {pendingNotifications > 9 ? '9+' : pendingNotifications}
                          </Badge>
                        )}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-80">
                      <div className="px-3 py-2 font-medium">Notifications</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem disabled>
                        <span className="text-sm text-slate-600">Aucune notification récente</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Profile menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-orange-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-xs">V</span>
                        </div>
                        <ChevronDown className="h-3 w-3" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <div className="px-3 py-2 border-b">
                        <p className="text-sm font-medium">Vendeur</p>
                      </div>
                      <DropdownMenuItem 
                        onClick={() => setActiveTab('settings')}
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Paramètres</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </motion.header>

          <div className={activeTab === 'communication' ? '' : 'p-6'}>
            {activeTab === 'dashboard' && <DashboardContent vendeurData={vendeurData} formatCurrency={formatCurrency} />}
            {activeTab === 'properties' && (
              <PropertiesContent
                properties={vendeurData.properties}
                formatCurrency={formatCurrency}
                getStatusColor={getStatusColor}
                getPriorityColor={getPriorityColor}
              />
            )}
            {activeTab === 'crm' && <CRMContent />}
            {activeTab === 'communication' && (
              <CommunicationContent onUnreadChange={setUnreadMessages} />
            )}
            {activeTab === 'analytics' && <AnalyticsContent vendeurData={vendeurData} formatCurrency={formatCurrency} />}
            {activeTab === 'settings' && <SettingsContent />}
          </div>
        </div>
      </div>
    );
  };

// Composant Dashboard
const DashboardContent = ({ vendeurData, formatCurrency }) => (
  <div className="space-y-6">
    {/* Statistiques */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Biens Actifs</p>
            <p className="text-3xl font-bold text-orange-600">{vendeurData.stats.activeListings}</p>
            <p className="text-sm text-green-600">+2 ce mois</p>
          </div>
          <div className="bg-orange-100 p-3 rounded-xl">
            <Building2 className="w-8 h-8 text-orange-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Ventes Mois</p>
            <p className="text-3xl font-bold text-green-600">{vendeurData.stats.soldThisMonth}</p>
            <p className="text-sm text-green-600">+15% vs prev</p>
          </div>
          <div className="bg-green-100 p-3 rounded-xl">
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Vues Mois</p>
            <p className="text-3xl font-bold text-blue-600">{vendeurData.stats.monthlyViews}</p>
            <p className="text-sm text-green-600">+8% vs prev</p>
          </div>
          <div className="bg-blue-100 p-3 rounded-xl">
            <Eye className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </motion.div>

      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Revenus</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(vendeurData.stats.totalRevenue)}</p>
            <p className="text-sm text-green-600">+12% vs prev</p>
          </div>
          <div className="bg-purple-100 p-3 rounded-xl">
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </motion.div>
    </div>

    {/* Biens récents et prospects */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Biens récents */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Biens Performants</h3>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {vendeurData.properties.slice(0, 3).map((property) => (
            <div key={property.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <img
                src={property.image}
                alt={property.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{property.title}</h4>
                <p className="text-sm text-gray-600">{property.location}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-orange-600 font-bold">{formatCurrency(property.price)}</span>
                  <span className="text-xs text-gray-500">• {property.views} vues</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Prospects chauds */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Prospects Chauds</h3>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        <div className="space-y-4">
          {vendeurData.prospects.map((prospect) => (
            <div key={prospect.id} className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <img
                src={prospect.avatar}
                alt={prospect.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-800">{prospect.name}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    prospect.status === 'Chaud' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {prospect.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{prospect.interest}</p>
                <p className="text-sm text-orange-600 font-medium">{prospect.budget}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

// Composant Properties
const PropertiesContent = ({ properties, formatCurrency, getStatusColor, getPriorityColor }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">Mes Biens Immobiliers</h2>
      <div className="flex space-x-3">
        <button className="flex items-center space-x-2 px-4 py-2 bg-white/60 border border-gray-200 rounded-lg hover:bg-white transition-colors">
          <Filter className="w-4 h-4" />
          <span>Filtrer</span>
        </button>
        <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all">
          <Plus className="w-4 h-4" />
          <span>Ajouter</span>
        </button>
      </div>
    </div>

    <div className="grid gap-6">
      {properties.map((property, index) => (
        <motion.div
          key={property.id}
          className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border-l-4 ${getPriorityColor(property.priority)} border-t border-r border-b border-white/20`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start space-x-6">
            <img
              src={property.image}
              alt={property.title}
              className="w-32 h-24 rounded-xl object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{property.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {property.location}
                    </span>
                    <span>{property.size}</span>
                    <span>{property.type}</span>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(property.status)}`}>
                  {property.status}
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">{formatCurrency(property.price)}</p>
                  <p className="text-xs text-gray-500">Prix</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">{property.views}</p>
                  <p className="text-xs text-gray-500">Vues</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">{property.inquiries}</p>
                  <p className="text-xs text-gray-500">Demandes</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-purple-600">{property.photos}</p>
                  <p className="text-xs text-gray-500">Photos</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors">
                    <Eye className="w-4 h-4" />
                    <span>Voir</span>
                  </button>
                  <button className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span>Partager</span>
                  </button>
                </div>
                <div className="text-sm text-gray-500">
                  Publié le {new Date(property.datePosted || '2024-03-10').toLocaleDateString('fr-FR')}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Composant Prospects
const ProspectsContent = ({ prospects, getStatusColor }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-800">Gestion des Prospects</h2>
      <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg">
        <Plus className="w-4 h-4" />
        <span>Nouveau Prospect</span>
      </button>
    </div>

    <div className="grid gap-6">
      {prospects.map((prospect, index) => (
        <motion.div
          key={prospect.id}
          className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start space-x-6">
            <img
              src={prospect.avatar}
              alt={prospect.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{prospect.name}</h3>
                  <p className="text-gray-600">{prospect.interest}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prospect.status)}`}>
                    {prospect.status}
                  </span>
                  <div className="flex items-center space-x-1 text-yellow-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{prospect.score}/100</span>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-semibold text-orange-600">{prospect.budget}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{prospect.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Téléphone</p>
                  <p className="font-medium">{prospect.phone}</p>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Appeler</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </button>
                <button className="flex items-center space-x-1 px-3 py-1.5 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>RDV</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Composant Messages (placeholder)
const MessagesContent = () => (
  <div className="text-center py-12">
    <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Centre de Messages</h3>
    <p className="text-gray-600">Fonctionnalité en cours de développement</p>
  </div>
);

// Composant Analytics (placeholder)
const AnalyticsContent = ({ vendeurData, formatCurrency }) => (
  <div className="space-y-6">
    <h2 className="text-2xl font-bold text-gray-800">Analytics & Performance</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Performance Globale</h3>
          <TrendingUp className="w-5 h-5 text-green-500" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Taux de conversion</span>
            <span className="font-semibold">12.5%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Temps moyen vente</span>
            <span className="font-semibold">45 jours</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Satisfaction client</span>
            <span className="font-semibold">4.9/5</span>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Revenus</h3>
          <DollarSign className="w-5 h-5 text-green-500" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Ce mois</span>
            <span className="font-semibold">{formatCurrency(45000000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Mois dernier</span>
            <span className="font-semibold">{formatCurrency(38000000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Évolution</span>
            <span className="font-semibold text-green-600">+18%</span>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800">Activité</h3>
          <Activity className="w-5 h-5 text-blue-500" />
        </div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-600">Vues totales</span>
            <span className="font-semibold">{vendeurData.stats.monthlyViews}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Nouvelles demandes</span>
            <span className="font-semibold">{vendeurData.stats.inquiriesThisWeek}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Taux d'engagement</span>
            <span className="font-semibold">8.4%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Composant CRM
const CRMContent = () => (
  <div className="-m-6">
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <VendeurCRM />
    </Suspense>
  </div>
);

// Composant Communication
const CommunicationContent = ({ onUnreadChange }) => (
  <div className="-m-6 h-screen">
    <Suspense fallback={
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    }>
      <VendeurCommunication onUnreadChange={onUnreadChange} />
    </Suspense>
  </div>
);

// Composant Settings (placeholder)
const SettingsContent = () => (
  <div className="text-center py-12">
    <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-800 mb-2">Paramètres</h3>
    <p className="text-gray-600">Configuration du compte en cours de développement</p>
  </div>
);

export default VendeurDashboardModern;