import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  BarChart3, 
  UserCheck, 
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LoadingSpinner } from '@/components/ui/spinner';
import AddUserWizard from './components/AddUserWizard';
import UserActions from './components/UserActions';
import userActionsManager from '@/lib/userActionsManager';

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedVerification, setSelectedVerification] = useState('');
  const [error, setError] = useState(null);

  // Rôles disponibles
  const ROLES = [
    'Particulier', 'Vendeur Particulier', 'Vendeur Pro', 'Mairie', 
    'Banque', 'Notaire', 'Agent Foncier', 'Géomètre', 'Investisseur', 
    'Promoteur', 'Agriculteur'
  ];

  // Charger les utilisateurs et statistiques
  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Charger les utilisateurs
      const searchResult = await userActionsManager.searchUsers('', {
        role: selectedRole || undefined,
        status: selectedStatus || undefined,
        verification_status: selectedVerification || undefined
      });

      if (searchResult.success) {
        setUsers(searchResult.users);
        setFilteredUsers(searchResult.users);
      } else {
        throw new Error(searchResult.message);
      }

      // Charger les statistiques
      const statsResult = await userActionsManager.getUserStats();
      if (statsResult.success) {
        setStats(statsResult.stats);
      }

    } catch (error) {
      console.error('Erreur chargement données:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Recherche et filtrage
  useEffect(() => {
    let filtered = users;

    // Recherche textuelle
    if (searchQuery) {
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone?.includes(searchQuery)
      );
    }

    setFilteredUsers(filtered);
  }, [users, searchQuery]);

  // Charger les données au montage et lors des changements de filtres
  useEffect(() => {
    loadData();
  }, [selectedRole, selectedStatus, selectedVerification]);

  // Gestionnaires d'événements
  const handleUserAdded = (newUser) => {
    setUsers(prev => [newUser, ...prev]);
    loadData(); // Recharger pour mettre à jour les stats
  };

  const handleUserUpdated = (updatedUser) => {
    setUsers(prev => prev.map(user => 
      user.id === updatedUser.id ? { ...user, ...updatedUser } : user
    ));
    loadData(); // Recharger pour mettre à jour les stats
  };

  const handleUserDeleted = (deletedUserId) => {
    setUsers(prev => prev.filter(user => user.id !== deletedUserId));
    loadData(); // Recharger pour mettre à jour les stats
  };

  const clearFilters = () => {
    setSelectedRole('');
    setSelectedStatus('');
    setSelectedVerification('');
    setSearchQuery('');
  };

  // Fonction pour formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Affichage conditionnel en cas d'erreur
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-red-600 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Erreur de chargement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={loadData} className="w-full">
              Réessayer
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-2">Gérez tous les comptes utilisateurs de la plateforme</p>
        </div>
        
        <Button 
          onClick={() => setIsAddUserOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Ajouter un utilisateur
        </Button>
      </div>

      {/* Cartes de statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Utilisateurs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                +{stats.recent} cette semaine
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vérifiés</CardTitle>
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.byVerification.verified || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Comptes approuvés
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">En attente</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.byVerification.pending || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                À vérifier
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bannis</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {stats.byStatus.banned || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Comptes suspendus
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Recherche et Filtres
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Rechercher par nom, email, téléphone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {ROLES.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_status">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="banned">Banni</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={selectedVerification} onValueChange={setSelectedVerification}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrer par vérification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all_verifications">Toutes les vérifications</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="verified">Vérifié</SelectItem>
                <SelectItem value="rejected">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(selectedRole || selectedStatus || selectedVerification || searchQuery) && (
            <div className="mt-4 flex justify-between items-center">
              <p className="text-sm text-gray-600">
                {filteredUsers.length} utilisateur(s) trouvé(s)
              </p>
              <Button variant="outline" size="sm" onClick={clearFilters}>
                Effacer les filtres
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Tableau des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
          <CardDescription>
            Gérez et modérez tous les comptes utilisateurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <LoadingSpinner />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun utilisateur trouvé
              </h3>
              <p className="text-gray-600">
                Aucun utilisateur ne correspond à vos critères de recherche.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Localisation</TableHead>
                    <TableHead>Date d'inscription</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.full_name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          {user.phone && (
                            <div className="text-sm text-gray-400">{user.phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{user.commune || 'N/A'}</div>
                          <div className="text-gray-500">{user.region || 'N/A'}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <UserActions
                          user={user}
                          onUserUpdated={handleUserUpdated}
                          onUserDeleted={handleUserDeleted}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'ajout d'utilisateur */}
      <AddUserWizard
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        onUserAdded={handleUserAdded}
      />
    </div>
  );
};

export default AdminUsersPage;

