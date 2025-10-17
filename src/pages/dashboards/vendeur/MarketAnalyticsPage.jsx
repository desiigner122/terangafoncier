import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { 
  TrendingUp,
  TrendingDown,
  Download,
  DollarSign,
  Home,
  MapPin,
  Activity,
  Calendar,
  Target,
  Clock,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { format, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import pdfGenerator from '@/services/pdfGenerator';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

// Enregistrer les composants Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

/**
 * Page analytics marché avec graphiques et prédictions IA
 */
const MarketAnalyticsPage = () => {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('6months');
  const [selectedZone, setSelectedZone] = useState('all');
  const [propertyType, setPropertyType] = useState('all');
  const [loading, setLoading] = useState(true);
  const [baseData, setBaseData] = useState({ properties: [], transactions: [] });
  const [zoneOptions, setZoneOptions] = useState([]);
  const [typeOptions, setTypeOptions] = useState([]);
  const [analytics, setAnalytics] = useState({
    monthLabels: [],
    priceSeries: [],
    listingSeries: [],
    salesSeries: [],
    zoneDistribution: []
  });
  const [kpis, setKpis] = useState({
    avgPrice: 0,
    avgPricePerSqm: 0,
    totalListings: 0,
    avgSaleTime: 0,
    demandLevel: 'Faible',
    trend: 'steady',
    priceChange: 0
  });
  const [predictions, setPredictions] = useState({
    nextMonth: {
      price: 0,
      confidence: 60,
      trend: 'Stabilité attendue'
    },
    bestZones: [],
    bestTime: 'Données insuffisantes',
    recommendation: 'Ajoutez vos premières propriétés pour générer des insights marché.'
  });
  const [insights, setInsights] = useState({ highlights: [], alerts: [] });

  const months = timeRange === '3months' ? 3 : timeRange === '6months' ? 6 : 12;

  const getZoneLabel = (property) => property?.region || property?.city || property?.location || 'Zone non spécifiée';

  useEffect(() => {
    if (!user) return;
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!user) return;
    buildAnalytics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseData, timeRange, selectedZone, propertyType]);

  const mapTerrainToProperty = (terrain) => ({
    id: terrain.id,
    title: terrain.title || terrain.titre || 'Terrain',
    price: Number(terrain.price ?? terrain.prix ?? 0),
    surface: Number(terrain.surface ?? terrain.superficie ?? 0),
    status: terrain.status || terrain.statut || null,
    property_type: terrain.property_type || terrain.type_terrain || 'Terrain',
    city: terrain.city || terrain.ville || null,
    region: terrain.region || terrain.departement || null,
    location: terrain.location || terrain.localisation || null,
    views_count: Number(terrain.views_count ?? terrain.vues ?? 0),
    favorites_count: Number(terrain.favorites_count ?? terrain.favoris ?? 0),
    contact_requests_count: Number(terrain.contact_requests_count ?? terrain.demandes_contact ?? 0),
    created_at: terrain.created_at,
    updated_at: terrain.updated_at,
    published_at: terrain.published_at,
    verification_status: terrain.verification_status || terrain.statut_verification || null,
    owner_id: terrain.owner_id || terrain.vendeur_id || user?.id
  });

  const fetchData = async () => {
    try {
      setLoading(true);

      let properties = [];
      const { data: propertiesData, error: propertiesError } = await supabase
        .from('properties')
        .select(`
          id,
          title,
          price,
          surface,
          status,
          property_type,
          city,
          region,
          location,
          views_count,
          favorites_count,
          contact_requests_count,
          created_at,
          updated_at,
          published_at,
          verification_status,
          owner_id
        `)
        .eq('owner_id', user.id);

      if (propertiesError) {
        console.warn('[MarketAnalytics] Fallback vers terrains:', propertiesError.message);
        const { data: terrainsData, error: terrainsError } = await supabase
          .from('terrains')
          .select(`
            id,
            titre,
            prix,
            superficie,
            statut,
            type_terrain,
            ville,
            region,
            localisation,
            vues,
            favoris,
            demandes_contact,
            created_at,
            updated_at,
            published_at,
            verification_status,
            vendeur_id
          `)
          .eq('vendeur_id', user.id);

        if (terrainsError) {
          throw terrainsError;
        }

        properties = (terrainsData || []).map(mapTerrainToProperty);
      } else {
        properties = propertiesData || [];
      }

      let transactions = [];
      const propertyIds = properties.map(prop => prop.id);

      if (propertyIds.length > 0) {
        const { data: transactionData, error: txError } = await supabase
          .from('transactions')
          .select('id, property_id, status, amount, created_at, updated_at, completion_date')
          .in('property_id', propertyIds);

        if (txError) {
          console.warn('[MarketAnalytics] Échec chargement transactions:', txError.message);
        } else {
          transactions = transactionData || [];
        }
      }

      setBaseData({
        properties,
        transactions
      });

      const uniqueZones = Array.from(new Set((properties || [])
        .map(getZoneLabel)
        .filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
      setZoneOptions(uniqueZones);

      if (selectedZone !== 'all' && !uniqueZones.some(zone => zone.toLowerCase() === selectedZone.toLowerCase())) {
        setSelectedZone('all');
      }

      const uniqueTypes = Array.from(new Set((properties || [])
        .map(prop => prop?.property_type || 'Autre')
        .filter(Boolean)))
        .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }));
      setTypeOptions(uniqueTypes);

      if (propertyType !== 'all' && !uniqueTypes.some(type => type.toLowerCase() === propertyType.toLowerCase())) {
        setPropertyType('all');
      }
    } catch (error) {
      console.error('Erreur chargement analytics vendeur:', error);
      toast.error('Impossible de charger les analytics marché.');
    } finally {
      setLoading(false);
    }
  };

  const buildRecommendation = (demandLevel, trend, avgInquiries) => {
    if (demandLevel === 'Élevée' && trend === 'up') {
      return 'Le marché est favorable. Profitez-en pour mettre en avant vos propriétés premium et renforcer vos campagnes.';
    }
    if (trend === 'down') {
      return 'Les prix sont en baisse. Envisagez des promotions ciblées et optimisez vos annonces (IA, photos, blockchain).';
    }
    if (avgInquiries < 1) {
      return 'Les demandes sont faibles. Ajoutez plus de contenu et partagez vos annonces sur les réseaux pour augmenter la visibilité.';
    }
    return 'Maintenez vos efforts commerciaux et surveillez vos métriques pour saisir rapidement les opportunités.';
  };

  const buildAnalytics = () => {
    const properties = baseData.properties || [];
    const transactions = baseData.transactions || [];

    const completedStatuses = new Set(['completed', 'finalized', 'closed', 'paid', 'success']);

    const zoneMatches = (prop) => {
      if (selectedZone === 'all') return true;
      return getZoneLabel(prop).toLowerCase() === selectedZone.toLowerCase();
    };

    const typeMatches = (prop) => {
      if (propertyType === 'all') return true;
      const type = prop?.property_type || 'Autre';
      return type.toLowerCase() === propertyType.toLowerCase();
    };

    const filteredProperties = properties.filter(prop => zoneMatches(prop) && typeMatches(prop));
    const filteredPropertyIds = new Set(filteredProperties.map(prop => prop.id));
    const filteredTransactions = transactions.filter(tx => filteredPropertyIds.has(tx.property_id));

    const startOfCurrentMonth = new Date();
    startOfCurrentMonth.setDate(1);
    startOfCurrentMonth.setHours(0, 0, 0, 0);
    const startDate = subMonths(startOfCurrentMonth, months - 1);

    const monthLabels = [];
    const priceSeries = [];
    const listingSeries = [];
    const salesSeries = [];
    const zoneCountMap = new Map();

    const totalPrice = filteredProperties.reduce((sum, prop) => sum + (Number(prop.price) || 0), 0);
    const totalSurface = filteredProperties.reduce((sum, prop) => sum + (Number(prop.surface) || 0), 0);
    const totalInquiries = filteredProperties.reduce((sum, prop) => sum + (Number(prop.contact_requests_count) || 0), 0);
    const avgInquiries = filteredProperties.length > 0 ? totalInquiries / filteredProperties.length : 0;

    filteredProperties.forEach(prop => {
      const zoneLabel = getZoneLabel(prop);
      zoneCountMap.set(zoneLabel, (zoneCountMap.get(zoneLabel) || 0) + 1);
    });

    for (let i = 0; i < months; i++) {
      const monthStart = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 1);

      monthLabels.push(format(monthStart, 'MMM yyyy', { locale: fr }));

      const monthlyProps = filteredProperties.filter(prop => {
        const createdAt = new Date(prop.created_at || prop.published_at || prop.updated_at);
        return createdAt >= monthStart && createdAt < monthEnd;
      });

      const monthlyTransactions = filteredTransactions.filter(tx => {
        const txDate = new Date(tx.completion_date || tx.updated_at || tx.created_at);
        return txDate >= monthStart && txDate < monthEnd && completedStatuses.has((tx.status || '').toLowerCase());
      });

      const monthlyPriceTotal = monthlyProps.reduce((sum, prop) => sum + (Number(prop.price) || 0), 0);
      const monthlySurfaceTotal = monthlyProps.reduce((sum, prop) => sum + (Number(prop.surface) || 0), 0);
      const avgPricePerSqm = monthlySurfaceTotal > 0
        ? monthlyPriceTotal / monthlySurfaceTotal
        : monthlyProps.length > 0
          ? monthlyPriceTotal / monthlyProps.length
          : 0;

      priceSeries.push(Math.round(avgPricePerSqm) || 0);
      listingSeries.push(monthlyProps.length);
      salesSeries.push(monthlyTransactions.length);
    }

    const avgPrice = filteredProperties.length > 0 ? totalPrice / filteredProperties.length : 0;
    const avgPricePerSqm = totalSurface > 0 ? totalPrice / totalSurface : 0;

    const completedTransactions = filteredTransactions.filter(tx => completedStatuses.has((tx.status || '').toLowerCase()));
    const propertyById = new Map(filteredProperties.map(prop => [prop.id, prop]));
    const saleDurations = completedTransactions.map(tx => {
      const referenceProp = propertyById.get(tx.property_id);
      if (!referenceProp) return null;
      const start = new Date(referenceProp.created_at || referenceProp.published_at || referenceProp.updated_at);
      const end = new Date(tx.completion_date || tx.updated_at || tx.created_at);
      if (Number.isNaN(start.valueOf()) || Number.isNaN(end.valueOf()) || end < start) return null;
      return (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
    }).filter(Boolean);

    const avgSaleTime = saleDurations.length > 0
      ? Math.round(saleDurations.reduce((sum, value) => sum + value, 0) / saleDurations.length)
      : 0;

    const demandLevel = avgInquiries >= 5 ? 'Élevée' : avgInquiries >= 2 ? 'Modérée' : 'Faible';

    const firstPrice = priceSeries.find(value => value > 0) || 0;
    const lastPrice = [...priceSeries].reverse().find(value => value > 0) || 0;
    const priceChangeValue = firstPrice > 0 ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0;
    const priceChange = Number(priceChangeValue.toFixed(1));
    const trend = priceChange > 1 ? 'up' : priceChange < -1 ? 'down' : 'steady';

    const zoneDistribution = Array.from(zoneCountMap.entries())
      .map(([zone, count]) => ({ zone, count }))
      .sort((a, b) => b.count - a.count);

    setAnalytics({
      monthLabels,
      priceSeries,
      listingSeries,
      salesSeries,
      zoneDistribution
    });

    setKpis({
      avgPrice,
      avgPricePerSqm,
      totalListings: filteredProperties.length,
      avgSaleTime,
      demandLevel,
      trend,
      priceChange: Number.isFinite(priceChange) ? priceChange : 0
    });

    const basePrice = lastPrice || avgPricePerSqm;
    const predictedPrice = basePrice ? basePrice * (1 + (priceChange / 100) * 0.6) : 0;
    const bestZones = zoneDistribution.slice(0, 3).map(item => item.zone);
    const bestSalesIndex = salesSeries.reduce((best, value, idx) => {
      if (value > best.value) {
        return { value, idx };
      }
      return best;
    }, { value: -Infinity, idx: 0 });

    const bestTime = bestSalesIndex.value > 0
      ? monthLabels[bestSalesIndex.idx]
      : 'Données insuffisantes';

    const confidenceBase = Math.min(95, 55 + filteredProperties.length * 3 + completedTransactions.length * 5);

    setPredictions({
      nextMonth: {
        price: Math.round(predictedPrice),
        confidence: Math.max(50, Math.round(confidenceBase)),
        trend: trend === 'up' ? 'Hausse probable' : trend === 'down' ? 'Baisse possible' : 'Stabilité attendue'
      },
      bestZones: bestZones.length > 0 ? bestZones : [],
      bestTime,
      recommendation: buildRecommendation(demandLevel, trend, avgInquiries)
    });

    const highlights = [];
    if (zoneDistribution.length > 0) {
      const topZone = zoneDistribution[0];
      highlights.push(`Zone la plus active : ${topZone.zone} (${topZone.count} bien${topZone.count > 1 ? 's' : ''})`);
    }
    if (salesSeries.some(value => value > 0)) {
      const maxSales = Math.max(...salesSeries);
      const bestMonthIdx = salesSeries.indexOf(maxSales);
      highlights.push(`Période la plus dynamique : ${monthLabels[bestMonthIdx]} (${maxSales} vente${maxSales > 1 ? 's' : ''})`);
    }
    if (avgInquiries >= 2) {
      highlights.push(`Demandes moyennes par bien : ${avgInquiries.toFixed(1)}`);
    }

    const alerts = [];
    if (filteredProperties.length === 0) {
      alerts.push('Ajoutez vos premières propriétés pour générer des analytics fiables.');
    }
    if (priceChange < 0) {
      alerts.push(`Prix moyens en baisse (${priceChange}%). Ajustez votre stratégie tarifaire.`);
    }
    if (avgInquiries < 1 && filteredProperties.length > 0) {
      alerts.push('Peu de demandes entrantes : renforcez la promotion (photos, IA, réseaux).');
    }
    if (avgSaleTime > 60) {
      alerts.push(`Délai de vente long (~${avgSaleTime} jours). Optimisez vos annonces et relances.`);
    }
    if (completedTransactions.length === 0 && filteredProperties.length > 0) {
      alerts.push('Aucune vente finalisée sur la période : suivez vos dossiers actifs et relancez vos prospects.');
    }

    setInsights({
      highlights,
      alerts
    });
  };

  // Options des graphiques
  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  const zoneColors = useMemo(() => [
    'rgba(249, 115, 22, 0.8)',
    'rgba(59, 130, 246, 0.8)',
    'rgba(147, 51, 234, 0.8)',
    'rgba(16, 185, 129, 0.8)',
    'rgba(239, 68, 68, 0.8)',
    'rgba(107, 114, 128, 0.8)'
  ], []);

  const priceData = useMemo(() => {
    const labels = analytics.monthLabels.length > 0 ? analytics.monthLabels : [''];
    const dataPoints = analytics.priceSeries.length > 0 ? analytics.priceSeries : [0];
    return {
      labels,
      datasets: [
        {
          label: 'Prix moyen/m²',
          data: dataPoints,
          borderColor: 'rgb(249, 115, 22)',
          backgroundColor: 'rgba(249, 115, 22, 0.1)',
          tension: 0.4,
        },
      ],
    };
  }, [analytics.monthLabels, analytics.priceSeries]);

  const salesData = useMemo(() => {
    const labels = analytics.monthLabels.length > 0 ? analytics.monthLabels : [''];
    const salesPoints = analytics.salesSeries.length > 0 ? analytics.salesSeries : [0];
    const listingPoints = analytics.listingSeries.length > 0 ? analytics.listingSeries : [0];
    return {
      labels,
      datasets: [
        {
          label: 'Ventes',
          data: salesPoints,
          backgroundColor: 'rgba(59, 130, 246, 0.8)',
        },
        {
          label: 'Annonces',
          data: listingPoints,
          backgroundColor: 'rgba(147, 51, 234, 0.8)',
        },
      ],
    };
  }, [analytics.monthLabels, analytics.salesSeries, analytics.listingSeries]);

  const zonesData = useMemo(() => {
    if (analytics.zoneDistribution.length === 0) {
      return {
        labels: ['Aucune donnée'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['rgba(148, 163, 184, 0.6)'],
          },
        ],
      };
    }

    return {
      labels: analytics.zoneDistribution.map(item => item.zone),
      datasets: [
        {
          data: analytics.zoneDistribution.map(item => item.count),
          backgroundColor: analytics.zoneDistribution.map((_, idx) => zoneColors[idx % zoneColors.length]),
        },
      ],
    };
  }, [analytics.zoneDistribution, zoneColors]);

  const exportReport = async () => {
    try {
      await pdfGenerator.generateMarketAnalysis({
        averagePrice: Math.round(kpis.avgPrice || 0),
        totalProperties: kpis.totalListings || 0,
        demand: kpis.demandLevel,
        trend: kpis.trend === 'up' ? 'Croissante' : kpis.trend === 'down' ? 'Décroissante' : 'Stable',
        priceChange: kpis.priceChange,
        bestZones: predictions.bestZones,
        bestTime: predictions.bestTime
      });
      toast.success('Rapport exporté avec succès');
    } catch (error) {
      console.error('Erreur export PDF:', error);
      toast.error('Erreur lors de l\'export du rapport');
    }
  };

  const priceChangePositive = (kpis.priceChange || 0) >= 0;
  const PriceTrendIcon = priceChangePositive ? TrendingUp : TrendingDown;
  const formattedAvgPrice = ((kpis.avgPrice || 0) / 1_000_000).toFixed(1);
  const formattedAvgPricePerSqm = ((kpis.avgPricePerSqm || 0) / 1000).toFixed(0);
  const formattedSaleTime = kpis.avgSaleTime || 0;
  const bestZonesForDisplay = predictions.bestZones.length > 0 ? predictions.bestZones : ['Aucune donnée'];
  const hasProperties = (baseData.properties?.length || 0) > 0;
  const hasTransactions = (baseData.transactions?.length || 0) > 0;
  const hasAnalyticsData = hasProperties || hasTransactions;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4">
        <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
        <p className="text-gray-500">Chargement des analytics marché...</p>
      </div>
    );
  }

  if (!hasAnalyticsData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analyse du Marché
            </h1>
            <p className="text-gray-600 mt-2">
              Ajoutez vos premières propriétés pour débloquer les analytics marché.
            </p>
          </div>
          <Button onClick={fetchData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recharger
          </Button>
        </div>

        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <Activity className="w-10 h-10 text-orange-500 mx-auto" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">Aucune donnée disponible</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Publiez une annonce ou finalisez une transaction pour voir les tendances du marché, les prédictions IA et les insights personnalisés apparaître ici.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={fetchData} variant="outline">
                Actualiser les données
              </Button>
              <Button asChild className="bg-orange-600 hover:bg-orange-700">
                <a href="/dashboard/vendeur/annonces">Ajouter une propriété</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analyse du Marché
          </h1>
          <p className="text-gray-600 mt-2">
            Tendances, prédictions IA et insights du marché immobilier
          </p>
        </div>
        <Button onClick={exportReport} className="bg-orange-600 hover:bg-orange-700">
          <Download className="w-4 h-4 mr-2" />
          Exporter PDF
        </Button>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Période" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3months">3 derniers mois</SelectItem>
                <SelectItem value="6months">6 derniers mois</SelectItem>
                <SelectItem value="12months">12 derniers mois</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedZone} onValueChange={setSelectedZone}>
              <SelectTrigger>
                <SelectValue placeholder="Zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les zones</SelectItem>
                {zoneOptions.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={propertyType} onValueChange={setPropertyType}>
              <SelectTrigger>
                <SelectValue placeholder="Type de bien" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                {typeOptions.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* KPIs principaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Prix Moyen</div>
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold">
              {formattedAvgPrice}M
            </div>
            <div className="flex items-center text-sm mt-2">
              <PriceTrendIcon
                className={`w-4 h-4 mr-1 ${priceChangePositive ? 'text-green-600' : 'text-red-600'}`}
              />
              <span className={`${priceChangePositive ? 'text-green-600' : 'text-red-600'} font-medium`}>
                {priceChangePositive ? '+' : ''}{Math.abs(kpis.priceChange || 0).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Prix/m²</div>
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold">
              {formattedAvgPricePerSqm}K
            </div>
            <div className="text-sm text-gray-600 mt-2">XOF</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Annonces Actives</div>
              <Home className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold">
              {Number(kpis.totalListings || 0).toLocaleString('fr-FR')}
            </div>
            <div className="text-sm text-gray-600 mt-2">propriétés</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm text-gray-600">Temps de Vente</div>
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold">{formattedSaleTime}</div>
            <div className="text-sm text-gray-600 mt-2">jours en moyenne</div>
            <div className="text-xs text-gray-500 mt-2">Demande : {kpis.demandLevel}</div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Évolution des prix */}
        <Card>
          <CardHeader>
            <CardTitle>Évolution des Prix</CardTitle>
            <CardDescription>Prix moyen par m² sur {months} mois</CardDescription>
          </CardHeader>
          <CardContent>
            <Line data={priceData} options={lineOptions} />
          </CardContent>
        </Card>

        {/* Volume de ventes */}
        <Card>
          <CardHeader>
            <CardTitle>Volume d'Activité</CardTitle>
            <CardDescription>Ventes vs Annonces</CardDescription>
          </CardHeader>
          <CardContent>
            <Bar data={salesData} options={barOptions} />
          </CardContent>
        </Card>
      </div>

      {/* Répartition par zone */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Répartition par Zone</CardTitle>
            <CardDescription>Part de marché par quartier</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <Doughnut data={zonesData} options={doughnutOptions} />
            </div>
          </CardContent>
        </Card>

        {/* Prédictions IA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-purple-600" />
              Prédictions IA
            </CardTitle>
            <CardDescription>Analyse prédictive du marché</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Prédiction prix */}
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Prévision Mois Prochain</span>
                <Badge className="bg-purple-600">{predictions.nextMonth.confidence}% confiance</Badge>
              </div>
              <div className="text-2xl font-bold text-purple-600">
                {(predictions.nextMonth.price / 1000000).toFixed(1)}M XOF
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {predictions.nextMonth.trend}
              </div>
            </div>

            {/* Zones chaudes */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Zones à Forte Demande</div>
              <div className="flex flex-wrap gap-2">
                {bestZonesForDisplay.map((zone) => (
                  <Badge
                    key={zone}
                    variant="outline"
                    className={zone === 'Aucune donnée'
                      ? 'bg-slate-100 text-slate-600 border-slate-200'
                      : 'bg-orange-50 text-orange-700 border-orange-200'}
                  >
                    {zone !== 'Aucune donnée' && <MapPin className="w-3 h-3 mr-1" />}
                    {zone}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Meilleure période */}
            <div>
              <div className="text-sm font-medium text-gray-700 mb-2">Meilleure Période de Vente</div>
              <div className="flex items-center text-sm text-gray-900">
                <Calendar className="w-4 h-4 mr-2 text-blue-600" />
                {predictions.bestTime}
              </div>
            </div>

            {/* Recommandation */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="font-medium text-green-900 mb-1">Recommandation IA</div>
                  <div className="text-sm text-green-800">
                    {predictions.recommendation}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Insights supplémentaires */}
      <Card>
        <CardHeader>
          <CardTitle>Insights Détaillés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">🔥 Points Chauds</h3>
              {insights.highlights.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Ajoutez des données pour générer des insights.
                </p>
              ) : (
                <ul className="space-y-2">
                  {insights.highlights.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-600 mr-2">•</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">⚠️ Points d'Attention</h3>
              {insights.alerts.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aucune alerte particulière sur la période.
                </p>
              ) : (
                <ul className="space-y-2">
                  {insights.alerts.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalyticsPage;
