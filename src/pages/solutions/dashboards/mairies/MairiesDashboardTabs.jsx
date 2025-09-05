
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { 
  Map, 
  Users, 
  Download, 
  Search, 
  Eye
} from 'lucide-react';

const CadastreMapSimulation = ({ onAction }) => (
  <div className="h-full bg-gradient-to-br from-blue-50 to-sky-100 dark:from-blue-900/30 dark:to-sky-800/30 rounded-lg p-4 flex flex-col items-center justify-center shadow-inner">
    <Map className="h-12 w-12 text-blue-600 dark:text-blue-400 mb-3" />
    <p className="text-sm font-semibold text-blue-800 dark:text-blue-200">Cadastre Numérique de la Commune</p>
    <p className="text-xs text-center mt-1 text-blue-700 dark:text-blue-300">Visualisation des parcelles, zones et plans d'urbanisme (simulation).</p>
    <img className="w-full h-auto mt-2 rounded" alt="Simulation de carte de cadastre avec parcelles colorées" src="https://images.unsplash.com/photo-1695673016023-7429b730b364" />
    <Button asChild variant="link" size="sm" className="mt-2 text-xs p-0 h-auto text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
        <Link to="/dashboard/cadastre">Explorer le Cadastre Interactif</Link>
    </Button>
  </div>
);

const taxData = [
    { name: 'Jan', 'Taxe Foncière': 4000000, 'Timbres': 240000 },
    { name: 'Fev', 'Taxe Foncière': 3000000, 'Timbres': 139800 },
    { name: 'Mar', 'Taxe Foncière': 2000000, 'Timbres': 980000 },
    { name: 'Avr', 'Taxe Foncière': 2780000, 'Timbres': 390800 },
    { name: 'Mai', 'Taxe Foncière': 1890000, 'Timbres': 480000 },
    { name: 'Juin', 'Taxe Foncière': 2390000, 'Timbres': 380000 },
];

export const OverviewTab = ({ kpiData, onAction }) => (
  <>
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {kpiData.map((kpi, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow border-l-4 border-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
            <kpi.icon className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{kpi.value} <span className="text-sm text-muted-foreground">{kpi.unit}</span></div>
            {kpi.trend && <p className={`text-xs ${kpi.trendColor}`}>{kpi.trend}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
    <div className="grid gap-6 lg:grid-cols-5 mt-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center"><Map className="mr-2 h-5 w-5"/>Cadastre Numérique</CardTitle>
          <CardDescription>Accès rapide au plan cadastral.</CardDescription>
        </CardHeader>
        <CardContent>
          <CadastreMapSimulation onAction={onAction} />
        </CardContent>
      </Card>
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center"><Users className="mr-2 h-5 w-5"/>Suivi des Recettes Fiscales</CardTitle>
          <CardDescription>Visualisation des taxes foncières et autres impôts locaux (simulation).</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={taxData}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${new Intl.NumberFormat('fr-FR', { notation: 'compact', compactDisplay: 'short' }).format(value)}`}/>
              <Tooltip wrapperClassName="!bg-background !border-border" contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}} formatter={(value) => new Intl.NumberFormat('fr-SN').format(value) + ' FCFA'}/>
              <Legend iconType="circle" />
              <Bar dataKey="Taxe Foncière" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Timbres" fill="#84cc16" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  </>
);

export const RequestsTab = ({ requests, users, onOpenInstructionModal, onAction }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Nouvelle': return <Badge variant="default">Nouvelle</Badge>;
      case 'En instruction': case 'En cours': return <Badge variant="warning">{status}</Badge>;
      case 'Approuvée': case 'Délivré': case 'Traitée': return <Badge variant="success">{status}</Badge>;
      case 'Rejetée': return <Badge variant="destructive">Rejetée</Badge>;
      case 'En médiation': return <Badge variant="secondary">En médiation</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion des Demandes Administratives</CardTitle>
        <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-2 mt-2">
          <div className="relative w-full sm:w-auto sm:flex-grow">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Rechercher par réf, demandeur..." className="pl-8 w-full sm:w-[300px]" />
          </div>
          <Select onValueChange={(val) => onAction(`Filtre par type : ${val}`)}>
            <SelectTrigger className="w-full sm:w-[180px]"><SelectValue placeholder="Filtrer par type" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous types</SelectItem>
              <SelectItem value="pc">Permis de Construire</SelectItem>
              <SelectItem value="dia">DIA</SelectItem>
              <SelectItem value="acquisition">Demande de Terrain</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => onAction("Génération du rapport des demandes au format CSV.")}><Download className="mr-2 h-4 w-4"/>Exporter</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Référence</th>
                <th className="text-left p-2 font-semibold">Type</th>
                <th className="text-left p-2 font-semibold">Demandeur</th>
                <th className="text-left p-2 font-semibold">Statut</th>
                <th className="text-left p-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => {
                const user = users.find(u => u.id === req.user_id);
                return (
                  <tr key={req.id} className="border-b hover:bg-muted/30">
                    <td className="p-2 font-medium">{req.id}</td>
                    <td className="p-2 capitalize">{req.request_type}</td>
                    <td className="p-2">{user?.name || 'N/A'}</td>
                    <td className="p-2">{getStatusBadge(req.status)}</td>
                    <td className="p-2 space-x-1">
                      <Button variant="default" size="sm" onClick={() => onOpenInstructionModal(req)}>
                        <Eye className="mr-2 h-4 w-4" /> Instruire
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export const LandManagementTab = ({ parcels }) => {
  const getStatusBadge = (status) => {
    switch(status) {
      case 'Attribution sur demande': return <Badge variant="info">{status}</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestion du Foncier Communal</CardTitle>
        <CardDescription>Liste des terrains appartenant à la commune.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-semibold">Référence</th>
                <th className="text-left p-2 font-semibold">Localisation</th>
                <th className="text-left p-2 font-semibold">Surface (m²)</th>
                <th className="text-left p-2 font-semibold">Statut</th>
                <th className="text-left p-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map(p => (
                <tr key={p.id} className="border-b hover:bg-muted/30">
                  <td className="p-2 font-medium">{p.id}</td>
                  <td className="p-2">{p.location_name}</td>
                  <td className="p-2">{p.area_sqm}</td>
                  <td className="p-2">{getStatusBadge(p.status)}</td>
                  <td className="p-2">
                    <Button asChild variant="link" size="sm" className="p-0 h-auto"><Link to={`/parcelles/${p.id}`}>Voir Détails</Link></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};
