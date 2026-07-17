import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  PieChart,
  BarChart3,
  Target,
  ArrowUpRight,
  Percent,
  MapPin,
  Layers,
  Wallet,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import StatsService from '@/services/StatsService';

// Libellés / couleurs par type d'investissement réel (investments.type)
const TYPE_META = {
  terrain: { label: 'Foncier', color: 'bg-purple-500' },
  immobilier: { label: 'Immobilier', color: 'bg-blue-500' },
  projet: { label: 'Projet', color: 'bg-green-500' }
};

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jui', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];

const InvestisseurAnalytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState(null);
  const [market, setMarket] = useState([]);

  useEffect(() => {
    if (!user?.id) return;

    const loadAnalytics = async () => {
      setLoading(true);
      try {
        const [investmentsRes, marketData] = await Promise.all([
          supabase
            .from('investments')
            // Jointure vers properties pour obtenir la région réelle
            .select('id, title, type, amount, current_value, roi, status, invested_at, properties(region, city)')
            .eq('investor_id', user.id),
          StatsService.getRegionMarket()
        ]);

        const investments = investmentsRes?.data || [];
        setAnalytics(computeAnalytics(investments));
        setMarket(Array.isArray(marketData) ? marketData : []);
      } catch (error) {
        console.error('Erreur chargement analytics investisseur:', error);
        setAnalytics(computeAnalytics([]));
        setMarket([]);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, [user?.id]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(Number(amount) || 0);
  };

  if (loading) {
    return (
      <div className="w-full h-full bg-white p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Analyse des performances en cours...</p>
        </div>
      </div>
    );
  }

  const a = analytics || {};
  const hasData = (a.count || 0) > 0;

  return (
    <div className="w-full h-full bg-white p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Portfolio</h1>
            <p className="text-gray-600">Analyse détaillée de vos performances d'investissement</p>
          </div>
        </div>

        {/* KPIs Overview — agrégats réels investments */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">Plus/Moins-value Totale</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {hasData ? formatCurrency(a.totalGain) : '—'}
                  </p>
                  {hasData && (
                    <div className="flex items-center mt-1">
                      <ArrowUpRight className={`h-4 w-4 ${a.returnRate >= 0 ? 'text-green-500' : 'text-red-500'}`} />
                      <span className={`text-sm ${a.returnRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {a.returnRate >= 0 ? '+' : ''}{a.returnRate.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
                <TrendingUp className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">Meilleur ROI</p>
                  <p className="text-2xl font-bold text-green-900">
                    {a.best ? `${Number(a.best.roi).toFixed(1)}%` : '—'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {a.best ? a.best.title : 'Aucun investissement'}
                  </p>
                </div>
                <Target className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">Valeur du Portefeuille</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {hasData ? formatCurrency(a.totalValue) : '—'}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Investi : {hasData ? formatCurrency(a.totalInvested) : '—'}
                  </p>
                </div>
                <Wallet className="h-10 w-10 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-orange-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-orange-600 font-medium">Actifs Actifs</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {a.activeCount || 0}
                    <span className="text-base font-medium text-gray-400"> / {a.count || 0}</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Investissements en portefeuille
                  </p>
                </div>
                <Activity className="h-10 w-10 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs Analytics */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="sectors">Secteurs</TabsTrigger>
            <TabsTrigger value="regions">Régions</TabsTrigger>
            <TabsTrigger value="market">Marché</TabsTrigger>
          </TabsList>

          {/* Onglet Performance */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                    Activité d'Investissement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {a.timeline && a.timeline.length > 0 ? (
                    <div className="space-y-4">
                      {a.timeline.map((t, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium">{t.label}</p>
                            <p className="text-sm text-gray-600">
                              {t.count} investissement{t.count > 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">
                              {formatCurrency(t.invested)}
                            </p>
                            <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                              <div
                                className="bg-blue-500 h-2 rounded-full transition-all"
                                style={{ width: `${a.timelineMax ? (t.invested / a.timelineMax) * 100 : 0}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 py-8 text-center">
                      Aucune activité d'investissement enregistrée.
                    </p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Percent className="h-5 w-5 mr-2 text-purple-600" />
                    Métriques Clés
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {hasData ? (
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Taux de Rendement Moyen</span>
                          <span className="font-semibold">{a.returnRate.toFixed(1)}%</span>
                        </div>
                        <Progress value={Math.max(0, Math.min(100, a.returnRate))} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Diversification (secteurs)</span>
                          <span className="font-semibold">{a.diversification}%</span>
                        </div>
                        <Progress value={a.diversification} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Part d'Actifs Actifs</span>
                          <span className="font-semibold">{a.activeShare}%</span>
                        </div>
                        <Progress value={a.activeShare} className="h-2" />
                      </div>

                      <div className="pt-2 border-t">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Nombre de secteurs investis</span>
                          <span className="font-semibold">{a.sectors.length}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 py-8 text-center">
                      Aucune métrique disponible pour le moment.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Onglet Secteurs */}
          <TabsContent value="sectors" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PieChart className="h-5 w-5 mr-2 text-green-600" />
                  Répartition par Secteurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                {a.sectors && a.sectors.length > 0 ? (
                  <div className="space-y-4">
                    {a.sectors.map((sector, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded ${sector.color}`} />
                            <span className="font-medium">{sector.name}</span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{sector.percentage}%</p>
                            <p className="text-sm text-gray-600">{formatCurrency(sector.value)}</p>
                          </div>
                        </div>
                        <Progress value={sector.percentage} className="h-2" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-8 text-center">
                    Aucun investissement à répartir par secteur.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Régions */}
          <TabsContent value="regions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                  Performance par Région
                </CardTitle>
              </CardHeader>
              <CardContent>
                {a.regions && a.regions.length > 0 ? (
                  <div className="space-y-4">
                    {a.regions.map((region, index) => (
                      <div key={index} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-lg">{region.name}</h3>
                            <p className="text-sm text-gray-600">
                              {region.investments} investissement{region.investments > 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold ${region.roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {region.roi >= 0 ? '+' : ''}{region.roi.toFixed(1)}%
                            </p>
                            <p className="text-sm text-gray-600">ROI</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Valeur totale</span>
                          <span className="font-semibold">{formatCurrency(region.value)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-8 text-center">
                    Aucune région rattachée à vos investissements.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Marché — prix réels par région (StatsService.getRegionMarket) */}
          <TabsContent value="market" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Layers className="h-5 w-5 mr-2 text-blue-600" />
                  Marché Foncier par Région
                </CardTitle>
              </CardHeader>
              <CardContent>
                {market && market.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="py-2 pr-4 font-medium">Région</th>
                          <th className="py-2 px-4 font-medium text-right">Prix moyen</th>
                          <th className="py-2 px-4 font-medium text-right">Prix / m²</th>
                          <th className="py-2 px-4 font-medium text-right">Biens</th>
                          <th className="py-2 pl-4 font-medium text-right">Vérifiés</th>
                        </tr>
                      </thead>
                      <tbody>
                        {market
                          .slice()
                          .sort((x, y) => (y.avgPricePerM2 || 0) - (x.avgPricePerM2 || 0))
                          .map((m, index) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-3 pr-4 font-medium text-gray-900">{m.region}</td>
                              <td className="py-3 px-4 text-right">{formatCurrency(m.avgPrice)}</td>
                              <td className="py-3 px-4 text-right">
                                {m.avgPricePerM2 ? `${formatCurrency(m.avgPricePerM2)}/m²` : '—'}
                              </td>
                              <td className="py-3 px-4 text-right text-gray-600">{m.count}</td>
                              <td className="py-3 pl-4 text-right">
                                <Badge className="bg-green-100 text-green-800 text-xs">
                                  {m.verificationRate ?? 0}%
                                </Badge>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                    <p className="text-xs text-gray-400 mt-4 flex items-center">
                      <BarChart3 className="h-3 w-3 mr-1" />
                      Prix moyens calculés à partir des biens actifs de la plateforme.
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-8 text-center">
                    Données de marché bientôt disponibles.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

/**
 * Calcule tous les agrégats analytics à partir des investissements réels.
 * Aucune valeur fabriquée : tout dérive des lignes investments (filtrées investor_id en amont).
 */
function computeAnalytics(investments) {
  const list = Array.isArray(investments) ? investments : [];

  const num = (v) => Number(v) || 0;
  const valueOf = (inv) => num(inv.current_value) || num(inv.amount);

  const count = list.length;
  const activeCount = list.filter((i) => i.status === 'active').length;
  const totalInvested = list.reduce((s, i) => s + num(i.amount), 0);
  const totalValue = list.reduce((s, i) => s + valueOf(i), 0);
  const totalGain = totalValue - totalInvested;
  const returnRate = totalInvested > 0 ? (totalGain / totalInvested) * 100 : 0;
  const activeShare = count > 0 ? Math.round((activeCount / count) * 100) : 0;

  // Meilleur ROI réel
  let best = null;
  list.forEach((i) => {
    if (i.roi == null) return;
    if (!best || num(i.roi) > num(best.roi)) {
      best = { title: i.title || 'Investissement', roi: num(i.roi) };
    }
  });

  // Répartition par secteur (investments.type) pondérée par la valeur
  const sectorMap = {};
  list.forEach((i) => {
    const meta = TYPE_META[i.type] || { label: i.type || 'Autre', color: 'bg-gray-400' };
    if (!sectorMap[i.type]) {
      sectorMap[i.type] = { name: meta.label, color: meta.color, value: 0 };
    }
    sectorMap[i.type].value += valueOf(i);
  });
  const sectors = Object.values(sectorMap)
    .map((s) => ({
      ...s,
      percentage: totalValue > 0 ? Math.round((s.value / totalValue) * 100) : 0
    }))
    .sort((x, y) => y.value - x.value);

  // Indice de diversification (Herfindahl inversé) sur les parts de secteur
  const shares = sectors.map((s) => (totalValue > 0 ? s.value / totalValue : 0));
  const hhi = shares.reduce((sum, sh) => sum + sh * sh, 0);
  const diversification = sectors.length > 0 ? Math.round((1 - hhi) * 100) : 0;

  // Performance par région (via properties.region joint)
  const regionMap = {};
  list.forEach((i) => {
    const region = i.properties?.region || 'Non renseignée';
    if (!regionMap[region]) {
      regionMap[region] = { name: region, investments: 0, value: 0, invested: 0 };
    }
    regionMap[region].investments += 1;
    regionMap[region].value += valueOf(i);
    regionMap[region].invested += num(i.amount);
  });
  const regions = Object.values(regionMap)
    .map((r) => ({
      name: r.name,
      investments: r.investments,
      value: r.value,
      roi: r.invested > 0 ? ((r.value - r.invested) / r.invested) * 100 : 0
    }))
    .sort((x, y) => y.value - x.value);

  // Timeline réelle : activité groupée par mois d'investissement (invested_at)
  const timelineMap = {};
  list.forEach((i) => {
    if (!i.invested_at) return;
    const d = new Date(i.invested_at);
    if (isNaN(d.getTime())) return;
    const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
    if (!timelineMap[key]) {
      timelineMap[key] = {
        key,
        label: `${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`,
        invested: 0,
        count: 0
      };
    }
    timelineMap[key].invested += num(i.amount);
    timelineMap[key].count += 1;
  });
  const timeline = Object.values(timelineMap).sort((x, y) => x.key.localeCompare(y.key));
  const timelineMax = timeline.reduce((m, t) => Math.max(m, t.invested), 0);

  return {
    count,
    activeCount,
    activeShare,
    totalInvested,
    totalValue,
    totalGain,
    returnRate,
    best,
    sectors,
    diversification,
    regions,
    timeline,
    timelineMax
  };
}

export default InvestisseurAnalytics;
