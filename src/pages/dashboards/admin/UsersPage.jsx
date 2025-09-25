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
  Brain
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { OpenAIService } from '../../../services/ai/OpenAIService';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [aiInsights, setAiInsights] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newThisMonth: 0,
    suspendedUsers: 0
  });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Fonctions CRUD pour la gestion des utilisateurs
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
    console.log('Affichage détails utilisateur:', user.name);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditFormData({
      firstName: user.firstName || user.name?.split(' ')[0] || '',
      lastName: user.lastName || user.name?.split(' ')[1] || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'Particulier',
      status: user.status || 'active'
    });
    setShowEditModal(true);
    console.log('Édition utilisateur:', user.name);
  };

  const handleSaveEdit = () => {
    if (selectedUser) {
      const updatedUsers = users.map(u => 
        u.id === selectedUser.id 
          ? { 
              ...u, 
              firstName: editFormData.firstName,
              lastName: editFormData.lastName,
              name: `${editFormData.firstName} ${editFormData.lastName}`,
              email: editFormData.email,
              phone: editFormData.phone,
              role: editFormData.role,
              status: editFormData.status
            }
          : u
      );
      setUsers(updatedUsers);
      setShowEditModal(false);
      setSelectedUser(null);
      setEditFormData({});
      console.log('Utilisateur modifié avec succès');
    }
  };

  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
    console.log('Suppression utilisateur:', user.name);
  };

  const confirmDeleteUser = () => {
    if (selectedUser) {
      setUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
      setFilteredUsers(prevUsers => prevUsers.filter(u => u.id !== selectedUser.id));
      console.log('Utilisateur supprimé:', selectedUser.name);
      setShowDeleteModal(false);
      setSelectedUser(null);
    }
  };

  const handleSuspendUser = (user) => {
    const updatedUsers = users.map(u => 
      u.id === user.id 
        ? { ...u, status: u.status === 'suspended' ? 'active' : 'suspended' }
        : u
    );
    setUsers(updatedUsers);
    // Le filtrage se fera automatiquement via useEffect
    console.log('Utilisateur suspendu/réactivé:', user.name);
  };

  const handleVerifyUser = (user) => {
    const updatedUsers = users.map(u => 
      u.id === user.id 
        ? { ...u, verified: !u.verified }
        : u
    );
    setUsers(updatedUsers);
    // Le filtrage se fera automatiquement via useEffect
    console.log('Utilisateur vérifié/non-vérifié:', user.name);
  };

  const handleExportUsers = () => {
    const dataStr = JSON.stringify(filteredUsers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'utilisateurs_teranga.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    console.log('Export utilisateurs effectué');
  };

  const handleBulkAction = (action) => {
    console.log('Action en masse:', action);
    // TODO: Implémenter actions en masse
  };

  const handleSendEmail = (user) => {
    console.log('Envoi email à:', user.email);
    // TODO: Implémenter envoi d'email
  };



  useEffect(() => {
    loadUsers();
    generateAIInsights();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, searchTerm, selectedFilter]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Données mockup utilisateurs réalistes
      const mockUsers = [
        {
          id: 1,
          firstName: 'Amadou',
          lastName: 'Diallo',
          email: 'amadou.diallo@email.com',
          phone: '+221 77 123 4567',
          role: 'Particulier',
          status: 'active',
          location: 'Dakar, Sénégal',
          joinDate: '2024-01-15',
          lastLogin: '2024-03-15T10:30:00Z',
          propertiesCount: 3,
          transactionsCount: 12,
          verified: true,
          rating: 4.8,
          totalSpent: 45000000
        },
        {
          id: 2,
          firstName: 'Fatou',
          lastName: 'Seck',
          email: 'fatou.seck@email.com',
          phone: '+221 76 987 6543',
          role: 'Promoteur',
          status: 'active',
          location: 'Thiès, Sénégal',
          joinDate: '2023-11-20',
          lastLogin: '2024-03-14T15:45:00Z',
          propertiesCount: 15,
          transactionsCount: 48,
          verified: true,
          rating: 4.9,
          totalSpent: 125000000
        },
        {
          id: 3,
          firstName: 'Mamadou',
          lastName: 'Ba',
          email: 'mamadou.ba@email.com',
          phone: '+221 75 456 7890',
          role: 'Investisseur',
          status: 'suspended',
          location: 'Saint-Louis, Sénégal',
          joinDate: '2024-02-10',
          lastLogin: '2024-03-10T08:20:00Z',
          propertiesCount: 8,
          transactionsCount: 24,
          verified: false,
          rating: 3.2,
          totalSpent: 85000000
        },
        {
          id: 4,
          firstName: 'Aissatou',
          lastName: 'Ndiaye',
          email: 'aissatou.ndiaye@email.com',
          phone: '+221 78 321 0987',
          role: 'Vendeur Particulier',
          status: 'active',
          location: 'Mbour, Sénégal',
          joinDate: '2024-03-01',
          lastLogin: '2024-03-15T12:15:00Z',
          propertiesCount: 2,
          transactionsCount: 5,
          verified: true,
          rating: 4.5,
          totalSpent: 15000000
        }
      ];

      setUsers(mockUsers);
      
      // Calcul des statistiques
      const totalUsers = mockUsers.length;
      const activeUsers = mockUsers.filter(u => u.status === 'active').length;
      const newThisMonth = mockUsers.filter(u => {
        const joinDate = new Date(u.joinDate);
        const now = new Date();
        return joinDate.getMonth() === now.getMonth() && joinDate.getFullYear() === now.getFullYear();
      }).length;
      const suspendedUsers = mockUsers.filter(u => u.status === 'suspended').length;

      setStats({ totalUsers, activeUsers, newThisMonth, suspendedUsers });
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = async () => {
    try {
      // Simulation insights IA - En production, appel API OpenAI
      setAiInsights([
        'Pic d\'inscriptions détecté cette semaine (+35%)',
        '3 utilisateurs nécessitent une vérification manuelle',
        'Taux de conversion promoteurs: 23% (optimal)',
        'Zone Dakar: 67% des nouveaux utilisateurs'
      ]);
    } catch (error) {
      console.error('Erreur génération insights IA:', error);
    }
  };

  const applyFilters = () => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.phone && user.phone.includes(searchTerm))
      );
    }

    switch (selectedFilter) {
      case 'active':
        filtered = filtered.filter(u => u.status === 'active');
        break;
      case 'suspended':
        filtered = filtered.filter(u => u.status === 'suspended');
        break;
      case 'unverified':
        filtered = filtered.filter(u => !u.verified);
        break;
      case 'promoteurs':
        filtered = filtered.filter(u => u.role === 'Promoteur');
        break;
      default:
        break;
    }

    setFilteredUsers(filtered);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getRoleColor = (role) => {
    const colors = {
      'Particulier': 'bg-blue-100 text-blue-800',
      'Promoteur': 'bg-purple-100 text-purple-800',
      'Investisseur': 'bg-green-100 text-green-800',
      'Vendeur Particulier': 'bg-orange-100 text-orange-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': 'bg-green-100 text-green-800',
      'suspended': 'bg-red-100 text-red-800',
      'pending': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="text-gray-600 mt-1">Gérez tous les utilisateurs de la plateforme</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline"
            onClick={handleExportUsers}
            title="Exporter la liste des utilisateurs"
          >
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button
            onClick={() => console.log('Créer nouvel utilisateur')}
            className="bg-red-600 hover:bg-red-700"
            title="Créer un nouvel utilisateur"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Nouvel Utilisateur
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Utilisateurs</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
                <p className="text-3xl font-bold text-green-600">{stats.activeUsers}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Nouveaux ce mois</p>
                <p className="text-3xl font-bold text-purple-600">{stats.newThisMonth}</p>
              </div>
              <UserPlus className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspendus</p>
                <p className="text-3xl font-bold text-red-600">{stats.suspendedUsers}</p>
              </div>
              <UserX className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {aiInsights.length > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-2">
              <Brain className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg text-blue-900">Insights IA TerangaFoncier</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {aiInsights.map((insight, index) => (
                <div key={index} className="flex items-center space-x-2 text-sm text-blue-800">
                  <CheckCircle className="h-4 w-4" />
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0 md:space-x-4">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrer par..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les utilisateurs</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="suspended">Suspendus</SelectItem>
                  <SelectItem value="unverified">Non vérifiés</SelectItem>
                  <SelectItem value="promoteurs">Promoteurs</SelectItem>
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={loadUsers}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Utilisateurs ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Chargement...</span>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {user.firstName[0]}{user.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="flex items-center space-x-3">
                          <h3 className="font-semibold text-gray-900">
                            {user.firstName} {user.lastName}
                          </h3>
                          {user.verified && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-sm text-gray-600">{user.rating}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Mail className="h-3 w-3" />
                            <span>{user.email}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span>{user.phone}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3" />
                            <span>{user.location}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          <Badge className={getStatusColor(user.status)}>
                            {user.status === 'active' ? 'Actif' : 
                             user.status === 'suspended' ? 'Suspendu' : 'En attente'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6">
                      <div className="text-right text-sm">
                        <p className="font-semibold text-gray-900">
                          {formatCurrency(user.totalSpent)}
                        </p>
                        <p className="text-gray-600">
                          {user.propertiesCount} propriétés
                        </p>
                        <p className="text-gray-600">
                          {user.transactionsCount} transactions
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewUser(user)}
                          title="Voir détails"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditUser(user)}
                          title="Éditer utilisateur"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleSuspendUser(user)}
                          className={user.status === 'suspended' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}
                          title={user.status === 'suspended' ? 'Réactiver' : 'Suspendre'}
                        >
                          {user.status === 'suspended' ? <UserCheck className="h-3 w-3" /> : <Ban className="h-3 w-3" />}
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDeleteUser(user)}
                          className="text-red-600 hover:bg-red-50"
                          title="Supprimer utilisateur"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de visualisation */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
            <DialogDescription>
              Informations complètes sur l'utilisateur sélectionné
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Nom complet</Label>
                  <p className="text-sm text-gray-900">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Email</Label>
                  <p className="text-sm text-gray-900">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Téléphone</Label>
                  <p className="text-sm text-gray-900">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Rôle</Label>
                  <Badge className={getRoleColor(selectedUser.role)}>
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Statut</Label>
                  <Badge className={getStatusColor(selectedUser.status)}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Localisation</Label>
                  <p className="text-sm text-gray-900">{selectedUser.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Date d'inscription</Label>
                  <p className="text-sm text-gray-900">{new Date(selectedUser.joinDate).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Propriétés</Label>
                  <p className="text-sm text-gray-900">{selectedUser.propertiesCount} propriétés</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Transactions</Label>
                  <p className="text-sm text-gray-900">{selectedUser.transactionsCount} transactions</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Total dépensé</Label>
                  <p className="text-sm text-gray-900">{formatCurrency(selectedUser.totalSpent)}</p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewModal(false)}>Fermer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal d'édition */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
            <DialogDescription>
              Modifiez les informations de l'utilisateur
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">Prénom</Label>
                <Input
                  id="firstName"
                  value={editFormData.firstName || ''}
                  onChange={(e) => setEditFormData(prev => ({...prev, firstName: e.target.value}))}
                />
              </div>
              <div>
                <Label htmlFor="lastName">Nom</Label>
                <Input
                  id="lastName"
                  value={editFormData.lastName || ''}
                  onChange={(e) => setEditFormData(prev => ({...prev, lastName: e.target.value}))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editFormData.email || ''}
                onChange={(e) => setEditFormData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Téléphone</Label>
              <Input
                id="phone"
                value={editFormData.phone || ''}
                onChange={(e) => setEditFormData(prev => ({...prev, phone: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="role">Rôle</Label>
              <Select value={editFormData.role || 'Particulier'} onValueChange={(value) => setEditFormData(prev => ({...prev, role: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Particulier">Particulier</SelectItem>
                  <SelectItem value="Promoteur">Promoteur</SelectItem>
                  <SelectItem value="Investisseur">Investisseur</SelectItem>
                  <SelectItem value="Vendeur Particulier">Vendeur Particulier</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select value={editFormData.status || 'active'} onValueChange={(value) => setEditFormData(prev => ({...prev, status: value}))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="suspended">Suspendu</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Annuler
            </Button>
            <Button onClick={handleSaveEdit}>Sauvegarder</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de confirmation de suppression */}
      <AlertDialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
              Cette action ne peut pas être annulée. Cela supprimera définitivement l'utilisateur
              <strong> {selectedUser?.name}</strong> et toutes ses données associées.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteUser}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersPage;