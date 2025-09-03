import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle, UserCheck, Search, Filter, Edit3, Trash2, Briefcase, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import LoadingSpinner from '@/components/ui/spinner';

const initialSampleAgents = [
  { id: 'AGT001', name: 'Amina Diallo', email: 'amina.diallo@teranga.sn', zone: 'Dakar - Plateau', activeParcels: 12, totalSales: 5, performanceScore: 85, status: 'actif' },
  { id: 'AGT002', name: 'Moussa Faye', email: 'moussa.faye@teranga.sn', zone: 'Thiès - Ville', activeParcels: 8, totalSales: 3, performanceScore: 78, status: 'actif' },
  { id: 'AGT003', name: 'Fatou Ndiaye', email: 'fatou.ndiaye@teranga.sn', zone: 'Saly - Zone Touristique', activeParcels: 15, totalSales: 7, performanceScore: 92, status: 'actif' },
  { id: 'AGT004', name: 'Ibrahim Fall', email: 'ibrahim.fall@teranga.sn', zone: 'Diamniadio - Pôle Urbain', activeParcels: 5, totalSales: 1, performanceScore: 60, status: 'inactif' },
];

const AdminAgentsPage = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  // toast remplacÃ© par window.safeGlobalToast

  useEffect(() => {
    const timer = setTimeout(() => {
      setAgents(initialSampleAgents);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const filteredAgents = agents.filter(agent => {
    return (
      (agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || agent.email.toLowerCase().includes(searchTerm.toLowerCase()) || agent.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (zoneFilter === 'all' || agent.zone.toLowerCase().includes(zoneFilter.toLowerCase())) &&
      (statusFilter === 'all' || agent.status === statusFilter)
    );
  });

  const handleSimulatedAction = (actionMessage, agentName = "") => {
    window.safeGlobalToast({
      title: "Action (Simulation)",
      description: agentName ? `${actionMessage} pour l'agent ${agentName}.` : actionMessage,
    });
  };
  
  const handleDeleteAgent = (agentId) => {
     setAgents(prev => prev.filter(a => a.id !== agentId));
     handleSimulatedAction(`Agent ${agentId} supprimé.`);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center text-primary">
            <UserCheck className="mr-3 h-8 w-8"/>Gestion des Agents Fonciers
          </h1>
          <p className="text-muted-foreground">Supervisez, ajoutez ou modifiez les profils des agents.</p>
        </div>
        <Button onClick={() => handleSimulatedAction("Ouverture du formulaire d'ajout d'agent.")}>
          <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un Nouvel Agent
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Filtres et Recherche</CardTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            <div className="relative">
               <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
               <Input 
                  placeholder="Rechercher par nom, email, ID..." 
                  className="pl-8 h-10" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
               <SelectTrigger className="h-10"><SelectValue placeholder="Filtrer par zone" /></SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">Toutes les zones</SelectItem>
                  <SelectItem value="Dakar - Plateau">Dakar - Plateau</SelectItem>
                  <SelectItem value="Thiès - Ville">Thiès - Ville</SelectItem>
                  <SelectItem value="Saly - Zone Touristique">Saly - Zone Touristique</SelectItem>
                  <SelectItem value="Diamniadio - Pôle Urbain">Diamniadio - Pôle Urbain</SelectItem>
               </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
               <SelectTrigger className="h-10"><SelectValue placeholder="Filtrer par statut" /></SelectTrigger>
               <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="actif">Actif</SelectItem>
                  <SelectItem value="inactif">Inactif</SelectItem>
               </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Liste des Agents ({filteredAgents.length})</CardTitle>
          <CardDescription>Gérez les agents fonciers de la plateforme et leurs performances.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nom</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Contact</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Zone</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">Statut</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider text-center">Performances</th>
                  <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-background divide-y divide-border">
                {filteredAgents.map((agent) => (
                  <tr key={agent.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap">
                       <div className="text-sm font-medium text-foreground">{agent.name}</div>
                       <div className="text-xs text-muted-foreground">ID: {agent.id}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{agent.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">{agent.zone}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                       <Badge variant={agent.status === 'actif' ? 'success' : 'secondary'}>{agent.status}</Badge>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground text-center">
                       <div className="flex flex-col items-center">
                          <span>{agent.activeParcels} parcelles</span>
                          <span className="text-xs">{agent.totalSales} ventes | Score: {agent.performanceScore}%</span>
                       </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-1">
                      <Button variant="ghost" size="icon" onClick={() => handleSimulatedAction("Modification", agent.name)} title="Modifier l'agent">
                         <Edit3 className="h-4 w-4"/>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" title="Supprimer l'agent">
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Supprimer l'agent {agent.name} ?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Cette action est irréversible. Les données de performance pourraient être archivées.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDeleteAgent(agent.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                              Oui, Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
           {filteredAgents.length === 0 && <p className="text-center text-muted-foreground py-8">Aucun agent ne correspond à vos critères de recherche.</p>}
        </CardContent>
         <CardFooter className="border-t pt-4">
            <p className="text-xs text-muted-foreground">Total agents: {agents.length}</p>
         </CardFooter>
      </Card>
    </motion.div>
  );
};

export default AdminAgentsPage;
