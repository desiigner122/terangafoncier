
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/spinner';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { User, MapPin, FileCheck } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';

const getActionBadge = (action) => {
  const lowerAction = action.toLowerCase();
  if (lowerAction.includes('create') || lowerAction.includes('add')) {
    return <Badge variant="success">Création</Badge>;
  }
  if (lowerAction.includes('update') || lowerAction.includes('approve')) {
    return <Badge variant="default">Mise à jour</Badge>;
  }
  if (lowerAction.includes('delete') || lowerAction.includes('reject') || lowerAction.includes('ban')) {
    return <Badge variant="destructive">Suppression/Rejet</Badge>;
  }
  if (lowerAction.includes('submit') || lowerAction.includes('list')) {
    return <Badge variant="outline">Soumission</Badge>;
  }
  return <Badge variant="secondary">{action}</Badge>;
};

const getEntityIcon = (entity) => {
    switch(entity) {
        case 'User': return <User className="h-4 w-4 text-blue-500" />;
        case 'Parcel': return <MapPin className="h-4 w-4 text-green-500" />;
        case 'Request': return <FileCheck className="h-4 w-4 text-purple-500" />;
        default: return null;
    }
}

const AdminAuditLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ searchTerm: '', user: '', action: '', entity: '' });
  const { toast } = useToast();

  useEffect(() => {
    const fetchAuditLogs = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('audit_logs')
            .select('*, actor:actor_id(full_name)')
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error("Error fetching audit logs:", error);
            toast({ title: 'Erreur', description: 'Impossible de charger le journal d\'audit.', variant: 'destructive' });
        } else {
            setLogs(data.map(log => ({
                ...log,
                user: log.actor?.full_name || 'Système',
                timestamp: new Date(log.created_at),
                details: log.details?.message || log.action,
                entity: log.entity_type,
                entityId: log.entity_id,
            })));
        }
        setLoading(false);
    };
    fetchAuditLogs();
  }, [toast]);
  
  const handleFilterChange = (key, value) => {
      setFilters(prev => ({...prev, [key]: value}));
  };

  const filteredLogs = useMemo(() => logs.filter(log => {
      return (
          (filters.searchTerm === '' || log.user.toLowerCase().includes(filters.searchTerm.toLowerCase()) || log.details.toLowerCase().includes(filters.searchTerm.toLowerCase())) &&
          (filters.user === '' || log.user === filters.user) &&
          (filters.action === '' || log.action === filters.action) &&
          (filters.entity === '' || log.entity === filters.entity)
      );
  }), [logs, filters]);
  
  const uniqueUsers = useMemo(() => [...new Set(logs.map(log => log.user))].sort(), [logs]);
  const uniqueActions = useMemo(() => [...new Set(logs.map(log => log.action))].sort(), [logs]);
  const uniqueEntities = useMemo(() => [...new Set(logs.map(log => log.entity))].filter(Boolean).sort(), [logs]);


  if (loading) return <div className="flex items-center justify-center h-full"><LoadingSpinner size="large" /></div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-12 px-4"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Journal d'Audit</h1>
        <p className="text-muted-foreground">Suivez les actions importantes réalisées sur la plateforme.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Rechercher..." className="pl-8" value={filters.searchTerm} onChange={e => handleFilterChange('searchTerm', e.target.value)} />
            </div>
            <Select onValueChange={value => handleFilterChange('user', value === 'all' ? '' : value)} value={filters.user}>
                <SelectTrigger><SelectValue placeholder="Filtrer par utilisateur" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Tous les utilisateurs</SelectItem>
                    {uniqueUsers.map(user => <SelectItem key={user} value={user}>{user}</SelectItem>)}
                </SelectContent>
            </Select>
             <Select onValueChange={value => handleFilterChange('action', value === 'all' ? '' : value)} value={filters.action}>
                <SelectTrigger><SelectValue placeholder="Filtrer par action" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toutes les actions</SelectItem>
                     {uniqueActions.map(action => <SelectItem key={action} value={action}>{action}</SelectItem>)}
                </SelectContent>
            </Select>
            <Select onValueChange={value => handleFilterChange('entity', value === 'all' ? '' : value)} value={filters.entity}>
                <SelectTrigger><SelectValue placeholder="Filtrer par entité" /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toutes les entités</SelectItem>
                     {uniqueEntities.map(entity => <SelectItem key={entity} value={entity}>{entity}</SelectItem>)}
                </SelectContent>
            </Select>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Date & Heure</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Utilisateur</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Action</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase">Détails</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-gray-200 dark:divide-gray-700">
                {filteredLogs.map((log) => (
                  <tr key={log.id}>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                        {format(log.timestamp, 'd MMMM yyyy, HH:mm:ss', { locale: fr })}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{log.user}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{getActionBadge(log.action)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                        <div className="flex items-center">
                           {getEntityIcon(log.entity)}
                           <span className="ml-2">{log.details} {log.entityId && `(${log.entityId.substring(0,8)})`}</span>
                        </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {filteredLogs.length === 0 && <p className="text-center p-8 text-muted-foreground">Aucun enregistrement trouvé pour ces filtres.</p>}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminAuditLogPage;