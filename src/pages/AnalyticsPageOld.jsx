import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthProvider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BarChart, 
  Users, 
  Eye, 
  MousePointerClick, 
  Globe, 
  TrendingUp, 
  TrendingDown, 
  FileCheck, 
  DollarSign
} from 'lucide-react';
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { LoadingSpinner } from '@/components/ui/spinner';
import { RoleProtectedRoute } from '@/components/layout/ProtectedRoute';
import { supabase } from '@/lib/supabaseClient';

// Mock data (can be replaced with API calls)
const adminData = {
  kpis: [
    { title: 'Visiteurs (7j)', value: '2,870', trend: '+15.2%', trendUp: true, icon: Users },
    { title: 'Nouveaux Comptes', value: '125', trend: '+5.1%', trendUp: true, icon: Users },
    { title: 'Annonces Postées', value: '45', trend: '+8.3%', trendUp: true, icon: FileCheck },
    { title: 'Transactions (sim)', value: '12', trend: '-2.5%', trendUp: false, icon: DollarSign },
  ],
  visitsData: [ { name: 'Lun', Visites: 220 }, { name: 'Mar', Visites: 310 }, { name: 'Mer', Visites: 280 }, { name: 'Jeu', Visites: 450 }, { name: 'Ven', Visites: 410 }, { name: 'Sam', Visites: 580 }, { name: 'Dim', Visites: 620 }],
  sourceData: [ { name: 'Google', value: 45 }, { name: 'Réseaux Sociaux', value: 25 }, { name: 'Direct', value: 20 }, { name: 'Référents', value: 10 } ],
};

const mairieData = {
  kpis: [
    { title: 'Demandes Reçues', value: '32', trend: '+3', trendUp: true, icon: FileCheck },
    { title: 'Dossiers Traités', value: '25', trend: '78%', trendUp: true, icon: FileCheck },
    { title: 'Terrains Attribués', value: '8', trend: '+1 ce mois', trendUp: true, icon: Globe },
    { title: 'Visites de Page', value: '1,200', trend: '+10%', trendUp: true, icon: Eye },
  ],
  requestsByMonth: [ { name: 'Jan', Demandes: 5 }, { name: 'Fév', Demandes: 8 }, { name: 'Mar', Demandes: 12 }, { name: 'Avr', Demandes: 7 } ],
  requestsStatus: [ { name: 'En cours', value: 7 }, { name: 'Approuvées', value: 20 }, { name: 'Rejetées', value: 5 } ],
};

const vendeurData = {
  kpis: [
    { title: 'Vues (30j)', value: '1,540', trend: '+20%', trendUp: true, icon: Eye },
    { title: 'Demandes Reçues', value: '18', trend: '+4', trendUp: true, icon: FileCheck },
    { title: 'Taux de Contact', value: '1.2%', trend: '+0.2%', trendUp: true, icon: MousePointerClick },
    { title: 'Ventes (sim)', value: '2', trend: '', trendUp: true, icon: DollarSign },
  ],
  viewsByParcel: [ { name: 'Terrain Saly', Vues: 850 }, { name: 'Villa Dakar', Vues: 520 }, { name: 'Champ Thiès', Vues: 170 } ],
  demandsOrigin: [ { name: 'Diaspora', value: 60 }, { name: 'Local', value: 40 } ],
};

const COLORS = {
  admin: ['#0ea5e9', '#22c55e', '#f97316', '#6b7280'],
  mairie: ['#f97316', '#22c55e', '#ef4444'],
  vendeur: ['#8b5cf6', '#3b82f6'],
};

const AnalyticsPageComponent = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading based on role
    setTimeout(() => {
      if (!user) return;
      if (user.role === 'Admin') setData(adminData);
      else if (user.role === 'Mairie') setData(mairieData);
      else if (user.role.includes('Vendeur')) setData(vendeurData);
      else setData(adminData); // Fallback for other roles for now
      setLoading(false);
    }, 500);
  }, [user]);

  if (loading || !user) {
    return <div className="flex items-center justify-center h-[calc(100vh-200px)]"><LoadingSpinner size="large"/></div>;
  }

  const getRoleKey = () => {
      if (!user?.role) return 'admin';
      if (user.role.toLowerCase().includes('vendeur')) return 'vendeur';
      if (user.role.toLowerCase() === 'mairie') return 'mairie';
      return 'admin';
  }

  if (!data) {
     return <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <p className="text-muted-foreground">Aucune donnée d'analyse disponible pour votre rôle.</p>
     </div>;
  }

  const roleKey = getRoleKey();
  const renderData = roleKey === 'vendeur' ? vendeurData : roleKey === 'mairie' ? mairieData : adminData;
  const colors = COLORS[roleKey];


  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="container mx-auto py-12 px-4 space-y-8">
      <div>
        <h1 className="text-3xl font-bold flex items-center"><BarChart className="mr-3 h-8 w-8 text-primary"/>Analyse d'Audience ({user.role})</h1>
        <p className="text-muted-foreground">Aperçu de vos performances et de votre engagement (données simulées).</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {renderData.kpis.map(kpi => (
          <Card key={kpi.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                  <div className="text-2xl font-bold">{kpi.value}</div>
                  {kpi.trend && <p className={`text-xs flex items-center ${kpi.trendUp ? 'text-green-500' : 'text-red-500'}`}>
                    {kpi.trendUp ? <TrendingUp className="h-3 w-3 mr-1"/> : <TrendingDown className="h-3 w-3 mr-1"/>}
                    {kpi.trend}
                  </p>}
              </CardContent>
          </Card>
        ))}
      </div>
      
      {roleKey === 'admin' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <Card className="lg:col-span-3">
                <CardHeader><CardTitle>Visites sur 7 jours</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={renderData.visitsData}>
                            <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false}/>
                            <Tooltip wrapperClassName="!bg-background !border-border" />
                            <Bar dataKey="Visites" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader><CardTitle>Sources du Trafic</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={renderData.sourceData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                                {renderData.sourceData.map((_, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      )}

      {roleKey === 'mairie' && (
         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <Card className="lg:col-span-3">
                <CardHeader><CardTitle>Demandes par mois</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={renderData.requestsByMonth}>
                            <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false}/>
                            <Tooltip wrapperClassName="!bg-background !border-border" />
                            <Bar dataKey="Demandes" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader><CardTitle>Statut des Dossiers</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={renderData.requestsStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" label>
                                {renderData.requestsStatus.map((_, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      )}

      {roleKey === 'vendeur' && (
         <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <Card className="lg:col-span-3">
                <CardHeader><CardTitle>Vues par Annonce</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={renderData.viewsByParcel} layout="vertical">
                            <XAxis type="number" stroke="#888" fontSize={12} tickLine={false} axisLine={false}/>
                            <YAxis type="category" dataKey="name" width={80} stroke="#888" fontSize={12} tickLine={false} axisLine={false}/>
                            <Tooltip wrapperClassName="!bg-background !border-border" />
                            <Bar dataKey="Vues" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardHeader><CardTitle>Origine des Demandes</CardTitle></CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={renderData.demandsOrigin} dataKey="value" nameKey="name" cx="50%" cy="50%" label>
                                {renderData.demandsOrigin.map((_, index) => <Cell key={`cell-${index}`} fill={colors[index]} />)}
                            </Pie>
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
      )}

    </motion.div>
  );
};

const AnalyticsPage = () => (
    <RoleProtectedRoute allowedRoles={['Admin', 'Mairie', 'Vendeur Particulier', 'Vendeur Pro']}>
        <AnalyticsPageComponent />
    </RoleProtectedRoute>
);

export default AnalyticsPage;