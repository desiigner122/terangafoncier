import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX, 
  Shield, 
  Settings, 
  Edit, 
  Trash2, 
  Ban, 
  UnBan, 
  Search, 
  Filter, 
  Download, 
  Eye, 
  Clock, 
  AlertTriangle, 
  CheckCircle
} from 'lucide-react';

const ROLES_CONFIG = {
  admin: {
    name: "Administrateur",
    color: "bg-red-500",
    permissions: ["all"],
    description: "Accès complet au système"
  },
  agent_foncier: {
    name: "Agent Foncier",
    color: "bg-blue-500", 
    permissions: ["parcelles", "verification", "FileTexts"],
    description: "Gestion des terrains et vérifications"
  },
  banque: {
    name: "Banque",
    color: "bg-green-500",
    permissions: ["credits", "evaluations", "portfolio"],
    description: "Gestion financière et crédits"
  },
  particulier: {
    name: "Particulier",
    color: "bg-purple-500",
    permissions: ["profile", "parcelles_view", "transactions"],
    description: "Utilisateur standard"
  },
  vendeur: {
    name: "Vendeur",
    color: "bg-orange-500",
    permissions: ["parcelles", "listings", "marketing"],
    description: "Vente de terrains"
  },
  investisseur: {
    name: "Investisseur", 
    color: "bg-yellow-500",
    permissions: ["portfolio", "analytics", "opportunities"],
    description: "Investissement immobilier"
  },
  notaire: {
    name: "Notaire",
    color: "bg-indigo-500",
    permissions: ["contracts", "signatures", "legal_docs"],
    description: "Actes juridiques"
  },
  geometre: {
    name: "Géomètre",
    color: "bg-teal-500",
    permissions: ["measurements", "maps", "certifications"],
    description: "Mesures et topographie"
  }
};

const UserRoleManagement = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'particulier',
    status: 'active',
    region: '',
    departement: '',
    commune: '',
    address: ''
  });

  // Chargement temps réel des utilisateurs
  useEffect(() => {
    loadUsers();
    
    // Écoute des changements en temps réel
    const subscription = supabase
      .channel('users_changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'users'
      }, (payload) => {
        console.log('🔄 Changement utilisateur:', payload);
        loadUsers(); // Recharger la liste
        toast.success('Liste utilisateurs mise à jour automatiquement');
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Filtrage des utilisateurs
  useEffect(() => {
    let filtered = users;

    if (searchTerm) {
      filtered = filtered.filter(user => 
        user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
      );
    }

    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(user => user.status === selectedStatus);
    }

    setFilteredUsers(filtered);
  }, [users, searchTerm, selectedRole, selectedStatus]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Erreur chargement utilisateurs:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{
          ...formData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
        .select();

      if (error) throw error;
      
      toast.success('Utilisateur créé avec succès');
      setIsDialogOpen(false);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Erreur création utilisateur:', error);
      toast.error('Erreur lors de la création de l\'utilisateur');
    }
  };

  const handleUpdateUser = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...formData,
          updated_at: new Date().toISOString()
        })
        .eq('id', editingUser.id)
        .select();

      if (error) throw error;
      
      toast.success('Utilisateur mis à jour avec succès');
      setIsDialogOpen(false);
      setEditingUser(null);
      resetForm();
      loadUsers();
    } catch (error) {
      console.error('Erreur mise à jour utilisateur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleBanUser = async (userId, banned = true) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ 
          status: banned ? 'banned' : 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) throw error;
      
      toast.success(`Utilisateur ${banned ? 'banni' : 'débanni'} avec succès`);
      loadUsers();
    } catch (error) {
      console.error('Erreur bannissement:', error);
      toast.error('Erreur lors du bannissement');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
    
    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId);

      if (error) throw error;
      
      toast.success('Utilisateur supprimé avec succès');
      loadUsers();
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      role: 'particulier',
      status: 'active',
      region: '',
      departement: '',
      commune: '',
      address: ''
    });
  };

  const openEditDialog = (user) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'particulier',
      status: user.status || 'active',
      region: user.region || '',
      departement: user.departement || '',
      commune: user.commune || '',
      address: user.address || ''
    });
    setIsDialogOpen(true);
  };

  const getRoleConfig = (role) => ROLES_CONFIG[role] || ROLES_CONFIG.particulier;

  const getStatusBadge = (status) => {
    const configs = {
      active: { color: 'bg-green-500', icon: CheckCircle, text: 'Actif' },
      banned: { color: 'bg-red-500', icon: Ban, text: 'Banni' },
      pending: { color: 'bg-yellow-500', icon: Clock, text: 'En attente' },
      suspended: { color: 'bg-orange-500', icon: AlertTriangle, text: 'Suspendu' }
    };
    
    const config = configs[status] || configs.active;
    const Icon = config.icon;
    
    return (
      <Badge className={`${config.color} text-white`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.text}
      </Badge>
    );
  };

  const exportUsers = () => {
    const csv = [
      ['Nom', 'Email', 'Téléphone', 'Rôle', 'Statut', 'Région', 'Date création'],
      ...filteredUsers.map(user => [
        user.full_name,
        user.email,
        user.phone,
        getRoleConfig(user.role).name,
        user.status,
        user.region,
        new Date(user.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = FileText.createElement('a');
    a.href = url;
    a.download = `utilisateurs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Utilisateurs</h1>
          <p className="text-muted-foreground">
            Gérez les utilisateurs, rôles et permissions en temps réel
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={exportUsers} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exporter
          </Button>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => { setEditingUser(null); resetForm(); }}>
                <UserPlus className="w-4 h-4 mr-2" />
                Ajouter Utilisateur
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? 'Modifier' : 'Créer'} un utilisateur
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations de l'utilisateur
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Nom complet</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    placeholder="Jean Dupont"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="jean@example.com"
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="+221 77 123 45 67"
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Rôle</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value) => setFormData({...formData, role: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(ROLES_CONFIG).map(([key, config]) => (
                        <SelectItem key={key} value={key}>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${config.color}`} />
                            {config.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="region">Région</Label>
                  <Input
                    id="region"
                    value={formData.region}
                    onChange={(e) => setFormData({...formData, region: e.target.value})}
                    placeholder="Dakar"
                  />
                </div>
                
                <div>
                  <Label htmlFor="departement">Département</Label>
                  <Input
                    id="departement"
                    value={formData.departement}
                    onChange={(e) => setFormData({...formData, departement: e.target.value})}
                    placeholder="Dakar"
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Adresse complète..."
                  />
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                  {editingUser ? 'Mettre à jour' : 'Créer'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Rechercher par nom, email ou téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                {Object.entries(ROLES_CONFIG).map(([key, config]) => (
                  <SelectItem key={key} value={key}>
                    {config.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="banned">Banni</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-3xl font-bold">{users.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actifs</p>
                <p className="text-3xl font-bold text-green-600">
                  {users.filter(u => u.status === 'active').length}
                </p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Bannis</p>
                <p className="text-3xl font-bold text-red-600">
                  {users.filter(u => u.status === 'banned').length}
                </p>
              </div>
              <UserX className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Rôles</p>
                <p className="text-3xl font-bold text-purple-600">
                  {new Set(users.map(u => u.role)).size}
                </p>
              </div>
              <Shield className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Liste des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Liste des utilisateurs avec synchronisation temps réel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => {
                const roleConfig = getRoleConfig(user.role);
                
                return (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full ${roleConfig.color} flex items-center justify-center text-white font-bold`}>
                        {user.full_name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold">{user.full_name || 'Sans nom'}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={`${roleConfig.color} text-white`}>
                            {roleConfig.name}
                          </Badge>
                          {getStatusBadge(user.status)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      {user.status === 'banned' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBanUser(user.id, false)}
                          className="text-green-600"
                        >
                          <UnBan className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleBanUser(user.id, true)}
                          className="text-red-600"
                        >
                          <Ban className="w-4 h-4" />
                        </Button>
                      )}
                      
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRoleManagement;

