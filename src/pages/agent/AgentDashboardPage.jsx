
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { UserCheck, MapPin, FileText, BarChart2, CalendarDays, MessageSquare, Search, Filter, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from '@/components/ui/badge';

const kpiData = [
  { title: "Demandes à Traiter", value: "5", icon: FileText, trend: "+2", trendColor: "text-yellow-500", unit: "nouvelles" },
  { title: "Parcelles Assignées", value: "12", icon: MapPin, trend: "Stable", trendColor: "text-neutral-500", unit: "actives" },
  { title: "Visites Planifiées (Semaine)", value: "4", icon: CalendarDays, trend: "+1", trendColor: "text-green-500", unit: "visites" },
  { title: "Taux de Conversion (Mois)", value: "15%", icon: BarChart2, trend: "+2%", trendColor: "text-green-500", unit: "" },
];


const AGENT_NAME = 'Bob Martin';

const AgentDashboardPage = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('requests');
  const [agentParcels, setAgentParcels] = useState([]);
  const [agentRequests, setAgentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        // Parcelles assignées à l'agent
        const { data: parcels, error: parcelsError } = await supabase.from('parcels').select('*').eq('agent_assigned', AGENT_NAME).limit(12);
        if (parcelsError) throw parcelsError;
        setAgentParcels(parcels);
        // Demandes assignées à l'agent ou non assignées
        const { data: requests, error: requestsError } = await supabase.from('requests').select('*').or(`agent_assigned.eq.${AGENT_NAME},agent_assigned.is.null`).limit(5);
        if (requestsError) throw requestsError;
        setAgentRequests(requests);
      } catch (err) {
        setFetchError(err.message);
        setAgentParcels([]);
        setAgentRequests([]);
        console.error('Erreur lors du chargement des données agent:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSimulatedAction = (message) => {
    toast({ title: "Action Simulée", description: message });
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'Validée': case 'Traitée': return 'success';
      case 'Rejetée': return 'destructive';
      case 'Nouvelle': return 'warning';
      case 'En cours': default: return 'secondary';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'requests':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Mes Demandes Clients</CardTitle>
              <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 mt-2">
                <Input type="search" placeholder="Rechercher par client, parcelle..." className="max-w-xs" />
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filtrer par type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="visit">Visite</SelectItem>
                    <SelectItem value="buy">Achat</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filtrer par statut" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous statuts</SelectItem>
                    <SelectItem value="nouvelle">Nouvelle</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="traitee">Traitée</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">Chargement...</div>
              ) : fetchError ? (
                <div className="text-center py-8 text-red-600">Erreur : {fetchError}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2 font-semibold">Client</th>
                        <th className="text-left p-2 font-semibold">Parcelle</th>
                        <th className="text-left p-2 font-semibold">Type</th>
                        <th className="text-left p-2 font-semibold">Statut</th>
                        <th className="text-left p-2 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {agentRequests.map((req) => (
                        <tr key={req.id} className="border-b hover:bg-muted/30">
                          <td className="p-2">{req.user_name}</td>
                          <td className="p-2 text-primary hover:underline"><Link to={`/parcelles/${req.parcel_id}`}>{req.parcel_id}</Link></td>
                          <td className="p-2">{req.request_type}</td>
                          <td className="p-2"><Badge variant={getStatusVariant(req.status)}>{req.status}</Badge></td>
                          <td className="p-2 space-x-1">
                            <Button variant="ghost" size="icon" title="Contacter" onClick={() => handleSimulatedAction(`Contacter ${req.user_name}`)}><MessageSquare className="h-4 w-4"/></Button>
                            <Button variant="ghost" size="icon" title="Valider" onClick={() => handleSimulatedAction(`Valider la demande ${req.id}`)}><Check className="h-4 w-4 text-green-600"/></Button>
                            <Button variant="ghost" size="icon" title="Rejeter" onClick={() => handleSimulatedAction(`Rejeter la demande ${req.id}`)}><X className="h-4 w-4 text-red-600"/></Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        );
      case 'parcels':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Mes Parcelles Assignées</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">Chargement...</div>
              ) : fetchError ? (
                <div className="text-center py-8 text-red-600">Erreur : {fetchError}</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {agentParcels.map(p => (
                    <Card key={p.id}>
                      <CardHeader className="p-4">
                        <CardTitle className="text-base text-primary hover:underline"><Link to={`/parcelles/${p.id}`}>{p.name || p.location_name}</Link></CardTitle>
                        <CardDescription>{p.zone}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-4 pt-0 text-xs">
                        <p>Statut: <Badge variant={p.status === 'Disponible' ? 'success' : 'secondary'}>{p.status}</Badge></p>
                        <p>Surface: {p.area_sqm} m²</p>
                        <p>Prix: {new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(p.price)}</p>
                        <Button size="xs" variant="outline" className="mt-2 w-full" onClick={() => handleSimulatedAction(`Gérer la parcelle ${p.id}`)}>Gérer</Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center">
            <UserCheck className="h-8 w-8 mr-3 text-cyan-600"/>
            Tableau de Bord Agent Foncier
          </h1>
          <p className="text-muted-foreground">Gérez vos clients, vos parcelles et vos performances.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-cyan-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <kpi.icon className="h-5 w-5 text-cyan-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{kpi.value} <span className="text-sm text-muted-foreground">{kpi.unit}</span></div>
              {kpi.trend && <p className={`text-xs ${kpi.trendColor}`}>{kpi.trend}</p>}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {['requests', 'parcels'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`${
                activeTab === tab
                  ? 'border-cyan-500 text-cyan-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize`}
            >
              {tab === 'requests' ? 'Demandes Clients' : 'Mes Parcelles'}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-6">
        {renderTabContent()}
      </div>
    </motion.div>
  );
};

export default AgentDashboardPage;
