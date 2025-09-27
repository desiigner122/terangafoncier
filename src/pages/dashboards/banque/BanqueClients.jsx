import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  MoreHorizontal, 
  Eye, 
  Edit, 
  Trash2,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  TrendingUp,
  Calendar,
  Download,
  Upload,
  FileText,
  Star,
  Clock,
  AlertTriangle,
  CheckCircle,
  X,
  UserPlus,
  Building2,
  Briefcase,
  Smartphone,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BanqueClients = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedClient, setSelectedClient] = useState(null);
  const [showClientModal, setShowClientModal] = useState(false);

  // Simulation des données clients
  useEffect(() => {
    const mockClients = [
      {
        id: 1,
        firstName: 'Amadou',
        lastName: 'Diallo',
        email: 'amadou.diallo@email.com',
        phone: '+221 77 123 45 67',
        address: '125 Rue de la République, Dakar',
        status: 'active',
        accountType: 'premium',
        balance: '2,500,000',
        creditScore: 850,
        joinDate: '2023-01-15',
        lastActivity: '2024-09-25',
        totalTransactions: 145,
        avatar: null,
        nationality: 'Sénégalaise',
        profession: 'Entrepreneur',
        company: 'DialloCorp SARL',
        monthlyIncome: '1,200,000',
        creditLimit: '5,000,000',
        loans: [
          { type: 'Immobilier', amount: '25,000,000', status: 'active' },
          { type: 'Auto', amount: '8,000,000', status: 'completed' }
        ]
      },
      {
        id: 2,
        firstName: 'Fatou',
        lastName: 'Sene',
        email: 'fatou.sene@diaspora.fr',
        phone: '+33 6 12 34 56 78',
        address: '45 Avenue des Champs, Paris, France',
        status: 'active',
        accountType: 'diaspora',
        balance: '750,000',
        creditScore: 720,
        joinDate: '2023-05-20',
        lastActivity: '2024-09-26',
        totalTransactions: 89,
        avatar: null,
        nationality: 'Franco-Sénégalaise',
        profession: 'Ingénieure',
        company: 'Tech Solutions',
        monthlyIncome: '4,500 EUR',
        creditLimit: '2,000,000',
        loans: []
      },
      {
        id: 3,
        firstName: 'Moussa',
        lastName: 'Ba',
        email: 'moussa.ba@entreprise.sn',
        phone: '+221 70 987 65 43',
        address: '88 Zone Industrielle, Thiès',
        status: 'pending',
        accountType: 'business',
        balance: '12,000,000',
        creditScore: 780,
        joinDate: '2024-01-10',
        lastActivity: '2024-09-24',
        totalTransactions: 234,
        avatar: null,
        nationality: 'Sénégalaise',
        profession: 'Directeur Commercial',
        company: 'Industries Ba & Fils',
        monthlyIncome: '2,800,000',
        creditLimit: '15,000,000',
        loans: [
          { type: 'Professionnel', amount: '45,000,000', status: 'active' }
        ]
      },
      {
        id: 4,
        firstName: 'Aissatou',
        lastName: 'Ndiaye',
        email: 'aissatou.ndiaye@email.com',
        phone: '+221 76 555 44 33',
        address: '12 Cité Keur Gorgui, Dakar',
        status: 'suspended',
        accountType: 'standard',
        balance: '125,000',
        creditScore: 650,
        joinDate: '2022-11-30',
        lastActivity: '2024-09-20',
        totalTransactions: 56,
        avatar: null,
        nationality: 'Sénégalaise',
        profession: 'Commerçante',
        company: 'Boutique Aissatou',
        monthlyIncome: '350,000',
        creditLimit: '500,000',
        loans: []
      },
      {
        id: 5,
        firstName: 'Omar',
        lastName: 'Fall',
        email: 'omar.fall@usa.com',
        phone: '+1 555 123 4567',
        address: '789 Brooklyn Ave, New York, USA',
        status: 'active',
        accountType: 'diaspora',
        balance: '3,200,000',
        creditScore: 820,
        joinDate: '2023-08-12',
        lastActivity: '2024-09-26',
        totalTransactions: 178,
        avatar: null,
        nationality: 'Américano-Sénégalaise',
        profession: 'Consultant IT',
        company: 'Fall Consulting LLC',
        monthlyIncome: '8,500 USD',
        creditLimit: '8,000,000',
        loans: [
          { type: 'Investissement', amount: '15,000,000', status: 'active' }
        ]
      }
    ];
    setClients(mockClients);
    setFilteredClients(mockClients);
  }, []);

  // Filtrage des clients
  useEffect(() => {
    let filtered = clients;

    if (searchTerm) {
      filtered = filtered.filter(client =>
        `${client.firstName} ${client.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.phone.includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(client => client.status === filterStatus);
    }

    setFilteredClients(filtered);
  }, [clients, searchTerm, filterStatus]);

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      suspended: 'bg-red-100 text-red-800 border-red-200',
      inactive: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || colors.inactive;
  };

  const getAccountTypeColor = (type) => {
    const colors = {
      premium: 'bg-purple-100 text-purple-800',
      business: 'bg-blue-100 text-blue-800',
      diaspora: 'bg-green-100 text-green-800',
      standard: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.standard;
  };

  const getCreditScoreColor = (score) => {
    if (score >= 800) return 'text-green-600';
    if (score >= 700) return 'text-blue-600';
    if (score >= 600) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleViewClient = (client) => {
    setSelectedClient(client);
    setShowClientModal(true);
  };

  const handleAddClient = () => {
    window.safeGlobalToast({
      title: "Nouveau client",
      description: "Fonction d'ajout de client disponible prochainement",
      variant: "info"
    });
  };

  const exportClients = () => {
    window.safeGlobalToast({
      title: "Export en cours",
      description: "Liste des clients exportée avec succès",
      variant: "success"
    });
  };

  const stats = {
    total: clients.length,
    active: clients.filter(c => c.status === 'active').length,
    pending: clients.filter(c => c.status === 'pending').length,
    suspended: clients.filter(c => c.status === 'suspended').length,
    totalBalance: clients.reduce((sum, c) => sum + parseInt(c.balance.replace(/,/g, '')), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-blue-600" />
            Gestion des Clients
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez votre portefeuille client et leurs informations bancaires
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button onClick={exportClients} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={handleAddClient}>
            <UserPlus className="h-4 w-4 mr-2" />
            Nouveau Client
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Actifs</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Suspendus</p>
                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Solde Global</p>
                <p className="text-lg font-bold text-purple-600">
                  {(stats.totalBalance / 1000000).toFixed(1)}M XOF
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par statut..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les clients</SelectItem>
                  <SelectItem value="active">Actifs</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="suspended">Suspendus</SelectItem>
                  <SelectItem value="inactive">Inactifs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher un client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des clients */}
      <div className="grid grid-cols-1 gap-4">
        {filteredClients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={client.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                        {client.firstName[0]}{client.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {client.firstName} {client.lastName}
                        </h3>
                        <Badge className={`text-xs ${getStatusColor(client.status)}`}>
                          {client.status === 'active' ? 'Actif' :
                           client.status === 'pending' ? 'En attente' :
                           client.status === 'suspended' ? 'Suspendu' : 'Inactif'}
                        </Badge>
                        <Badge className={`text-xs ${getAccountTypeColor(client.accountType)}`}>
                          {client.accountType === 'premium' ? 'Premium' :
                           client.accountType === 'business' ? 'Business' :
                           client.accountType === 'diaspora' ? 'Diaspora' : 'Standard'}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {client.email}
                        </div>
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {client.phone}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {client.address.split(',')[0]}
                        </div>
                        <div className="flex items-center">
                          <Briefcase className="h-4 w-4 mr-2" />
                          {client.profession}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3 text-sm">
                        <div>
                          <span className="text-gray-500">Solde: </span>
                          <span className="font-semibold text-green-600">{client.balance} XOF</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Score: </span>
                          <span className={`font-semibold ${getCreditScoreColor(client.creditScore)}`}>
                            {client.creditScore}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Transactions: </span>
                          <span className="font-semibold">{client.totalTransactions}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dernière activité: </span>
                          <span className="font-semibold">{client.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewClient(client)}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun client trouvé</h3>
            <p className="text-gray-600">
              {searchTerm ? 'Aucun client ne correspond à votre recherche.' : 'Commencez par ajouter des clients à votre portefeuille.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Modal détails client */}
      {showClientModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">
                  Détails Client - {selectedClient.firstName} {selectedClient.lastName}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowClientModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <Tabs defaultValue="profile" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="profile">Profil</TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                  <TabsTrigger value="loans">Crédits</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>
                
                <TabsContent value="profile" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Informations Personnelles</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Nom complet</label>
                          <p className="text-sm">{selectedClient.firstName} {selectedClient.lastName}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Email</label>
                          <p className="text-sm">{selectedClient.email}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Téléphone</label>
                          <p className="text-sm">{selectedClient.phone}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Adresse</label>
                          <p className="text-sm">{selectedClient.address}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Nationalité</label>
                          <p className="text-sm">{selectedClient.nationality}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-semibold text-lg">Informations Professionnelles</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="text-sm font-medium text-gray-600">Profession</label>
                          <p className="text-sm">{selectedClient.profession}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Entreprise</label>
                          <p className="text-sm">{selectedClient.company}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Revenus mensuels</label>
                          <p className="text-sm font-semibold text-green-600">{selectedClient.monthlyIncome}</p>
                        </div>
                        <div>
                          <label className="text-sm font-medium text-gray-600">Score de crédit</label>
                          <p className={`text-sm font-semibold ${getCreditScoreColor(selectedClient.creditScore)}`}>
                            {selectedClient.creditScore}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="transactions">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Historique des transactions disponible prochainement</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="loans">
                  <div className="space-y-4">
                    {selectedClient.loans.length > 0 ? (
                      selectedClient.loans.map((loan, index) => (
                        <Card key={index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h5 className="font-medium">{loan.type}</h5>
                                <p className="text-sm text-gray-600">Montant: {loan.amount} XOF</p>
                              </div>
                              <Badge className={loan.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                                {loan.status === 'active' ? 'Actif' : 'Terminé'}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun crédit en cours</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
                
                <TabsContent value="documents">
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">Gestion documentaire disponible prochainement</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BanqueClients;
