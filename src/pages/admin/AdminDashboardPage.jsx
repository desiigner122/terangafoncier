
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Users, MapPin, GitPullRequest, ShieldCheck as ComplianceIcon, Activity, BarChart, History, FileText, UserPlus, UserCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/spinner';
// TEMPORARILY USING SIMPLE TOAST TO FIX TypeError: nT() is null
import { useToast } from "@/components/ui/use-toast-simple";
import { supabase } from '@/lib/supabaseClient';

const AdminDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [recentActivities, setRecentActivities] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
  const { data: usersData, error: usersError } = await supabase.from('users').select('*', { count: 'exact' });
        if (usersError) throw usersError;

        const { data: parcelsData, error: parcelsError } = await supabase.from('parcels').select('status', { count: 'exact' });
        if (parcelsError) throw parcelsError;

        const { data: requestsData, error: requestsError } = await supabase.from('requests').select('status, request_type', { count: 'exact' });
        if (requestsError) throw requestsError;
        
        const { data: auditLogs, error: auditError } = await supabase.from('audit_logs').select('*, actor:actor_id(full_name)').order('created_at', { ascending: false }).limit(5);
        if (auditError) throw auditError;

        setStats({
          totalUsers: usersData.length,
          unverifiedUsers: usersData.filter(u => u.verification_status === 'unverified').length,
          availableParcels: parcelsData.filter(p => p.status === 'Disponible').length,
          pendingRequests: requestsData.filter(r => r.status === 'pending' && r.request_type === 'parcel_listing').length,
          pendingUserRequests: requestsData.filter(r => r.status === 'pending' && r.request_type === 'account_upgrade').length,
        });
        
        setRecentActivities(auditLogs.map(log => ({
          id: log.id,
          user: log.actor?.full_name || 'Système',
          action: log.details,
          time: new Date(log.created_at).toLocaleString('fr-FR'),
          type: log.action.toLowerCase()
        })));

      } catch (error) {
        console.error("Error fetching admin dashboard data:", error);
        toast({
          title: "Erreur de chargement",
          description: "Impossible de récupérer les données du tableau de bord.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const getIconForActivity = (type) => {
    if (type.includes('user')) return <Users className="h-4 w-4 mr-2 mt-0.5 text-purple-500 flex-shrink-0"/>;
    if (type.includes('parcel')) return <MapPin className="h-4 w-4 mr-2 mt-0.5 text-blue-500 flex-shrink-0"/>;
    if (type.includes('request')) return <UserPlus className="h-4 w-4 mr-2 mt-0.5 text-green-500 flex-shrink-0"/>;
    return <Activity className="h-4 w-4 mr-2 mt-0.5 text-muted-foreground flex-shrink-0"/>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 md:space-y-8 p-4 md:p-6 lg:p-8"
    >
      <h1 className="text-3xl font-bold">Tableau de Bord Super-Administrateur</h1>

      <div className="grid gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Comptes à Vérifier", value: stats.unverifiedUsers, subtext: "Nouveaux inscrits", icon: UserCheck, link: "/admin/user-verifications" },
          { title: "Annonces à Valider", value: stats.pendingRequests, subtext: "Soumissions", icon: GitPullRequest, link: "/admin/system-requests" },
          { title: "Demandes de Rôle", value: stats.pendingUserRequests, subtext: "A traiter", icon: UserPlus, link: "/admin/user-requests" },
          { title: "Utilisateurs Actifs", value: stats.totalUsers, subtext: "Total sur la plateforme", icon: Users, link: "/admin/users" },
        ].map(item => (
          <Card key={item.title} className="hover:shadow-md transition-shadow">
            <Link to={item.link}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                <item.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                <p className="text-xs text-muted-foreground">{item.subtext}</p>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center"><Activity className="mr-2 h-5 w-5"/>Activité Récente</CardTitle>
            <CardDescription>Dernières actions importantes sur la plateforme.</CardDescription>
          </CardHeader>
          <CardContent>
             <ul className="space-y-3">
              {recentActivities.slice(0, 5).map(activity => (
                <li key={activity.id} className="flex items-start space-x-3 text-sm">
                  {getIconForActivity(activity.type)}
                  <div>
                    <span className="font-medium">{activity.user}</span>
                    <span className="text-muted-foreground"> {activity.action}.</span>
                    <span className="text-xs text-muted-foreground block">{activity.time}</span>
                  </div>
                </li>
              ))}
            </ul>
            <Button variant="link" asChild className="p-0 h-auto mt-4 text-sm"><Link to="/admin/audit-log">Voir tout le journal d'audit</Link></Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Accès Rapides</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/users"><Users className="mr-2 h-4 w-4"/>Comptes</Link></Button>
              <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/parcels"><MapPin className="mr-2 h-4 w-4"/>Annonces</Link></Button>
              <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/blog"><FileText className="mr-2 h-4 w-4"/>Blog</Link></Button>
              <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/reports"><BarChart className="mr-2 h-4 w-4"/>Rapports</Link></Button>
              <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/audit-log"><History className="mr-2 h-4 w-4"/>Audit</Link></Button>
               <Button asChild variant="outline" size="sm" className="justify-start"><Link to="/admin/settings"><ComplianceIcon className="mr-2 h-4 w-4"/>Paramètres</Link></Button>
            </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminDashboardPage;