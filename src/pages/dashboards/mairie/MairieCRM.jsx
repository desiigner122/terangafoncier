import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Star, 
  Search, 
  Filter, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  Target,
  Activity,
  FileText,
  Briefcase,
  Home,
  Landmark,
  TreePine,
  UserCheck,
  Archive,
  Download,
  Share2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MairieCRM = ({ dashboardStats }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);

  // Données CRM simulées pour la mairie
  const [contacts, setContacts] = useState([
    {
      id: 1,
      name: 'Association Les Verts',
      type: 'association',
      email: 'contact@lesverts-commune.org',
      phone: '+221 77 123 45 67',
      score: 85,
      status: 'active',
      lastContact: '2024-01-15',
      projects: ['Aménagement Parc Central', 'Zone Verte Quartier Nord'],
      value: 0, // Associations n'ont pas de valeur commerciale
      priority: 'high',
      avatar: null,
      address: 'Quartier Résidentiel Nord',
      notes: 'Très actifs dans les projets environnementaux communaux'
    },
    {
      id: 2,
      name: 'Entreprise BTP Sénégal',
      type: 'entreprise',
      email: 'direction@btpsenegal.com',
      phone: '+221 33 987 65 43',
      score: 92,
      status: 'active',
      lastContact: '2024-01-20',
      projects: ['Construction École Primaire', 'Rénovation Mairie'],
      value: 45000000, // CFA
      priority: 'high',
      avatar: null,
      address: 'Zone Industrielle',
      notes: 'Partenaire privilégié pour les grands travaux communaux'
    },
    {
      id: 3,
      name: 'M. Amadou Diallo',
      type: 'citoyen',
      email: 'amadou.diallo@email.com',
      phone: '+221 76 654 32 10',
      score: 68,
      status: 'prospect',
      lastContact: '2024-01-10',
      projects: ['Demande Parcelle Résidentielle'],
      value: 8500000, // CFA
      priority: 'medium',
      avatar: null,
      address: 'Quartier Centre-Ville',
      notes: 'Citoyen exemplaire, membre conseil de quartier'
    },
    {
      id: 4,
      name: 'Coopérative Agricole Locale',
      type: 'cooperative',
      email: 'info@coopagri-locale.sn',
      phone: '+221 77 456 78 90',
      score: 76,
      status: 'active',
      lastContact: '2024-01-18',
      projects: ['Extension Zone Agricole', 'Marché Hebdomadaire'],
      value: 12000000, // CFA
      priority: 'medium',
      avatar: null,
      address: 'Zone Agricole Communale',
      notes: 'Important pour le développement économique local'
    },
    {
      id: 5,
      name: 'Mme Fatou Sow',
      type: 'citoyen',
      email: 'fatou.sow@gmail.com',
      phone: '+221 78 123 45 67',
      score: 72,
      status: 'active',
      lastContact: '2024-01-12',
      projects: ['Autorisation Commerce Local'],
      value: 3500000, // CFA
      priority: 'low',
      avatar: null,
      address: 'Quartier Marché',
      notes: 'Commerçante locale, très impliquée communauté'
    }
  ]);

  const [crmStats, setCrmStats] = useState({
    totalContacts: contacts.length,
    activeProjects: 12,
    monthlyInteractions: 89,
    conversionRate: 78,
    citizenSatisfaction: 85,
    pendingRequests: 15
  });

  // Filtrage des contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || contact.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getTypeIcon = (type) => {
    switch (type) {
      case 'entreprise': return Building2;
      case 'association': return Users;
      case 'cooperative': return TreePine;
      case 'citoyen': return Home;
      default: return Users;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'entreprise': return 'bg-blue-100 text-blue-800';
      case 'association': return 'bg-green-100 text-green-800';
      case 'cooperative': return 'bg-purple-100 text-purple-800';
      case 'citoyen': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const ContactCard = ({ contact, onClick }) => {
    const TypeIcon = getTypeIcon(contact.type);
    
    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => onClick(contact)}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <TypeIcon className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {contact.name}
                  </CardTitle>
                  <CardDescription className="flex items-center space-x-2 mt-1">
                    <Badge className={`text-xs ${getTypeColor(contact.type)}`}>
                      {contact.type}
                    </Badge>
                    <Badge className={`text-xs ${getPriorityColor(contact.priority)}`}>
                      {contact.priority}
                    </Badge>
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">
                  Score: {contact.score}%
                </div>
                <Progress value={contact.score} className="w-16 h-2 mt-1" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span className="truncate">{contact.email}</span>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                <span>{contact.phone}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{contact.address}</span>
              </div>

              <div className="pt-2 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Projets actifs:</span>
                  <Badge variant="outline" className="text-xs">
                    {contact.projects.length}
                  </Badge>
                </div>
                
                {contact.value > 0 && (
                  <div className="flex items-center justify-between text-sm mt-1">
                    <span className="text-gray-600">Valeur:</span>
                    <span className="font-semibold text-green-600">
                      {(contact.value / 1000000).toFixed(1)}M CFA
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-gray-500">
                  Dernier contact: {new Date(contact.lastContact).toLocaleDateString('fr-FR')}
                </span>
                <Badge 
                  className={`text-xs ${
                    contact.status === 'active' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {contact.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques CRM */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Contacts</p>
                  <p className="text-2xl font-bold text-blue-900">{crmStats.totalContacts}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Projets Actifs</p>
                  <p className="text-2xl font-bold text-green-900">{crmStats.activeProjects}</p>
                </div>
                <Target className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Satisfaction Citoyens</p>
                  <p className="text-2xl font-bold text-purple-900">{crmStats.citizenSatisfaction}%</p>
                </div>
                <Star className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Interactions/Mois</p>
                  <p className="text-2xl font-bold text-orange-900">{crmStats.monthlyInteractions}</p>
                </div>
                <Activity className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-teal-600" />
            <span>Gestion des Relations Communales</span>
          </CardTitle>
          <CardDescription>
            Gérez les relations avec citoyens, entreprises, associations et coopératives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant={filterType === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterType('all')}
                size="sm"
              >
                Tous
              </Button>
              <Button
                variant={filterType === 'citoyen' ? 'default' : 'outline'}
                onClick={() => setFilterType('citoyen')}
                size="sm"
              >
                Citoyens
              </Button>
              <Button
                variant={filterType === 'entreprise' ? 'default' : 'outline'}
                onClick={() => setFilterType('entreprise')}
                size="sm"
              >
                Entreprises
              </Button>
              <Button
                variant={filterType === 'association' ? 'default' : 'outline'}
                onClick={() => setFilterType('association')}
                size="sm"
              >
                Associations
              </Button>
              <Button
                variant={filterType === 'cooperative' ? 'default' : 'outline'}
                onClick={() => setFilterType('cooperative')}
                size="sm"
              >
                Coopératives
              </Button>
            </div>
          </div>

          {/* Liste des contacts */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            {filteredContacts.map((contact) => (
              <ContactCard
                key={contact.id}
                contact={contact}
                onClick={setSelectedContact}
              />
            ))}
          </motion.div>

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun contact trouvé</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-teal-50 to-teal-100">
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold text-teal-900 mb-2">Nouveau Contact</h3>
              <p className="text-sm text-teal-700">Ajouter un citoyen, entreprise ou association</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Rapport CRM</h3>
              <p className="text-sm text-blue-700">Générer rapport d'activité mensuel</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Planifier Réunion</h3>
              <p className="text-sm text-purple-700">Organiser rencontre avec parties prenantes</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MairieCRM;