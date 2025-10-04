/**
 * PAGE UTILISATEURS ADMIN - MODERNISÉE AVEC DONNÉES RÉELLES + IA + BLOCKCHAIN
 * 
 * Cette page utilise le GlobalAdminService pour afficher uniquement des données réelles
 * et intègre les préparations pour l'IA et la Blockchain.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Edit3,
  Trash2,
  Eye,
  Shield,
  Ban,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Download,
  Upload,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  UserCheck,
  UserX,
  Settings,
  RefreshCw,
  Brain,
  Crown,
  Building2,
  DollarSign,
  Database,
  Zap,
  TrendingUp,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ModernAdminSidebar from '@/components/admin/ModernAdminSidebar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'react-hot-toast';
import globalAdminService from '@/services/GlobalAdminService';

const ModernUsersPage = () => {
  // États principaux - UNIQUEMENT DONNÉES RÉELLES
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États UI
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // États IA et Blockchain
  const [aiInsights, setAiInsights] = useState([]);
  const [blockchainStatus, setBlockchainStatus] = useState({});

  // ============================================================================
  // CHARGEMENT DES DONNÉES RÉELLES
  // ============================================================================

  const loadRealData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Chargement des utilisateurs réels...');
      
      // Charger utilisateurs et statistiques en parallèle
      const [usersResult, statsResult] = await Promise.all([
        globalAdminService.getAllUsers(),
        globalAdminService.getUserStats()
      ]);

      if (usersResult.success) {
        setUsers(usersResult.data);
        setFilteredUsers(usersResult.data);
        console.log(`✅ ${usersResult.data.length} utilisateurs réels chargés`);
      } else {
        throw new Error(usersResult.error);
      }

      if (statsResult.success) {
        setUserStats(statsResult.data);
        console.log('✅ Statistiques utilisateurs chargées');
      }

      // Charger les insights IA
      await loadAIInsights();
      
      // Charger le statut Blockchain
      await loadBlockchainStatus();

    } catch (error) {
      console.error('❌ Erreur chargement utilisateurs:', error);
      setError(error.message);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const loadAIInsights = async () => {
    try {
      // Générer des insights IA basés sur les vraies données
      const insights = [
        {
          type: 'growth',
          title: 'Croissance utilisateurs',
          value: `+${userStats.growthRate || 0}%`,
          trend: 'up',
          description: 'Croissance ce mois'
        },
        {
          type: 'engagement',
          title: 'Engagement IA',
          value: `${userStats.aiEngagement || 0}`,
          trend: 'stable',
          description: 'Utilisateurs actifs avec IA'
        },
        {
          type: 'completion',
          title: 'Profils complets',
          value: `${Math.floor((userStats.activeUsers / userStats.totalUsers) * 100) || 0}%`,
          trend: 'up',
          description: 'Profils utilisateurs complétés'
        }
      ];
      
      setAiInsights(insights);
    } catch (error) {
      console.error('Erreur insights IA:', error);
    }
  };

  const loadBlockchainStatus = async () => {
    try {
      const blockchainData = await globalAdminService.prepareBlockchainIntegration();
      setBlockchainStatus({
        totalUsers: userStats.totalUsers || 0,
        blockchainUsers: blockchainData.features.propertyNFTs ? 0 : 0,
        readyForBlockchain: userStats.activeUsers || 0
      });
    } catch (error) {
      console.error('Erreur statut blockchain:', error);
    }
  };

  // ============================================================================
  // FILTRAGE ET RECHERCHE
  // ============================================================================

  useEffect(() => {
    let filtered = users;

    // Filtrage par terme de recherche
    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrage par statut
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(user => {
        switch (selectedFilter) {
          case 'active': return user.status === 'active';
          case 'pending': return user.status === 'pending';
          case 'suspended': return user.status === 'suspended';
          case 'verified': return user.emailConfirmed;
          case 'unverified': return !user.emailConfirmed;
          case 'admin': return user.role === 'admin';
          case 'banque': return user.role === 'banque';
          case 'particulier': return user.role === 'particulier';
          default: return true;
        }
      });
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedFilter]);

  // ============================================================================
  // ACTIONS UTILISATEURS - FONCTIONNELLES
  // ============================================================================

  const handleUpdateUserStatus = async (userId, newStatus) => {
    try {
      const result = await globalAdminService.updateUserStatus(userId, newStatus);
      
      if (result.success) {
        toast.success(result.message);
        await loadRealData(); // Recharger les données
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const result = await globalAdminService.deleteUser(userId);
      
      if (result.success) {
        toast.success(result.message);
        setShowDeleteModal(false);
        await loadRealData(); // Recharger les données
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleExportUsers = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Nom,Email,Rôle,Statut,Date création,Score IA\n"
      + filteredUsers.map(user => 
          `${user.name},${user.email},${user.role},${user.status},${new Date(user.createdAt).toLocaleDateString()},${user.aiScore}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Export des utilisateurs lancé');
  };

  // ============================================================================
  // CHARGEMENT INITIAL
  // ============================================================================

  useEffect(() => {
    loadRealData();
  }, []);

  // ============================================================================
  // COMPOSANTS DE RENDU
  // ============================================================================

  const renderStatsCards = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Total Users */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
              <p className="text-3xl font-bold text-blue-600">
                {loading ? '...' : userStats.totalUsers?.toLocaleString() || 0}
              </p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
              <p className="text-3xl font-bold text-green-600">
                {loading ? '...' : userStats.activeUsers?.toLocaleString() || 0}
              </p>
            </div>
            <UserCheck className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Signups */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nouveaux (7j)</p>
              <p className="text-3xl font-bold text-purple-600">
                {loading ? '...' : userStats.recentSignups?.toLocaleString() || 0}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>

      {/* AI Engagement */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Engagement IA</p>
              <p className="text-3xl font-bold text-orange-600">
                {loading ? '...' : userStats.aiEngagement?.toLocaleString() || 0}
              </p>
            </div>
            <Brain className="h-8 w-8 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFiltersAndActions = () => (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion des Utilisateurs
            </CardTitle>
            <CardDescription>
              {filteredUsers.length} utilisateur(s) trouvé(s) • Données réelles uniquement
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadRealData} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Button onClick={handleExportUsers} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Recherche */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher par nom ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Filtre */}
          <Select value={selectedFilter} onValueChange={setSelectedFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filtrer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les utilisateurs</SelectItem>
              <SelectItem value="active">Actifs</SelectItem>
              <SelectItem value="pending">En attente</SelectItem>
              <SelectItem value="suspended">Suspendus</SelectItem>
              <SelectItem value="verified">Vérifiés</SelectItem>
              <SelectItem value="unverified">Non vérifiés</SelectItem>
              <SelectItem value="admin">Administrateurs</SelectItem>
              <SelectItem value="banque">Banques</SelectItem>
              <SelectItem value="particulier">Particuliers</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Actif' },
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      suspended: { color: 'bg-red-100 text-red-800', label: 'Suspendu' },
      deleted: { color: 'bg-gray-100 text-gray-800', label: 'Supprimé' }
    };

    const config = statusConfig[status] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: 'bg-purple-100 text-purple-800', icon: Crown },
      banque: { color: 'bg-blue-100 text-blue-800', icon: Building2 },
      particulier: { color: 'bg-gray-100 text-gray-800', icon: Users }
    };

    const config = roleConfig[role] || roleConfig.particulier;
    const Icon = config.icon;
    
    return (
      <Badge className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {role}
      </Badge>
    );
  };

  const renderUsersTable = () => (
    <Card>
      <CardHeader>
        <CardTitle>Liste des Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin mr-2" />
            <span>Chargement des utilisateurs réels...</span>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-8 text-red-600">
            <AlertCircle className="h-6 w-6 mr-2" />
            <span>Erreur: {error}</span>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-gray-500">
            <Users className="h-6 w-6 mr-2" />
            <span>Aucun utilisateur trouvé</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Utilisateur</th>
                  <th className="text-left py-3 px-4">Rôle</th>
                  <th className="text-left py-3 px-4">Statut</th>
                  <th className="text-left py-3 px-4">Score IA</th>
                  <th className="text-left py-3 px-4">Inscription</th>
                  <th className="text-right py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.emailConfirmed && (
                            <CheckCircle className="h-3 w-3 text-green-600 inline ml-1" />
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="py-4 px-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${user.aiScore}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{user.aiScore}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowViewModal(true);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleUpdateUserStatus(
                            user.id, 
                            user.status === 'active' ? 'suspended' : 'active'
                          )}
                        >
                          {user.status === 'active' ? 
                            <Ban className="h-4 w-4 text-red-600" /> : 
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          }
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderAIInsights = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Insights IA
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium">{insight.title}</h4>
                <TrendingUp className={`h-4 w-4 ${
                  insight.trend === 'up' ? 'text-green-600' : 
                  insight.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                }`} />
              </div>
              <p className="text-2xl font-bold text-blue-600">{insight.value}</p>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  // ============================================================================
  // MODALES
  // ============================================================================

  const renderViewModal = () => (
    <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Détails Utilisateur</DialogTitle>
        </DialogHeader>
        {selectedUser && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                  {selectedUser.avatar}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                <p className="text-gray-600">{selectedUser.email}</p>
                <div className="flex gap-2 mt-2">
                  {getRoleBadge(selectedUser.role)}
                  {getStatusBadge(selectedUser.status)}
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Score IA</label>
                <p className="text-lg font-semibold">{selectedUser.aiScore}/100</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email vérifié</label>
                <p className="text-lg font-semibold">
                  {selectedUser.emailConfirmed ? '✅ Oui' : '❌ Non'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Profil complet</label>
                <p className="text-lg font-semibold">
                  {selectedUser.profileComplete ? '✅ Oui' : '❌ Non'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Date d'inscription</label>
                <p className="text-lg font-semibold">
                  {new Date(selectedUser.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Section Blockchain (préparation) */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">État Blockchain</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Adresse Wallet</label>
                  <p className="text-sm">{selectedUser.blockchainAddress || 'Non connecté'}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Transactions Blockchain</label>
                  <p className="text-sm">{selectedUser.blockchainTransactions || 0}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );

  const renderDeleteModal = () => (
    <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer l'utilisateur</AlertDialogTitle>
          <AlertDialogDescription>
            Êtes-vous sûr de vouloir supprimer {selectedUser?.name} ? 
            Cette action ne peut pas être annulée.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            onClick={() => handleDeleteUser(selectedUser?.id)}
            className="bg-red-600 hover:bg-red-700"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  // ============================================================================
  // RENDU PRINCIPAL
  // ============================================================================

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <ModernAdminSidebar stats={{
        newUsers: userStats.newUsers || 0,
        pendingProperties: 0,
        pendingTransactions: 0
      }} />
      
      {/* Contenu principal */}
      <div className="flex-1 p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
            <p className="text-gray-600">
              Administrez tous les utilisateurs avec des données réelles • IA • Blockchain
            </p>
          </div>
          <Badge variant="outline" className="text-green-600 border-green-600">
            <Database className="h-3 w-3 mr-1" />
            Données Réelles
          </Badge>
        </div>

        {/* Stats Cards */}
        {renderStatsCards()}

        {/* AI Insights */}
        {renderAIInsights()}

        {/* Filters and Actions */}
        {renderFiltersAndActions()}

        {/* Users Table */}
        {renderUsersTable()}

        {/* Modales */}
        {renderViewModal()}
        {renderDeleteModal()}
      </div>
    </div>
  );
};

export default ModernUsersPage;