import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Building2, 
  UserCheck,
  Network,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Star,
  Shield,
  Award,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Eye,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const GeometrePartenaires = () => {
  const [activeTab, setActiveTab] = useState('notaires');

  // Données des partenaires par catégorie
  const partenaires = {
    notaires: [
      {
        id: 1,
        name: 'Me Fatou Sow Sarr',
        office: 'Étude Notariale Centrale',
        location: 'Plateau, Dakar',
        email: 'contact@etude-centrale.sn',
        phone: '+221 33 821 45 67',
        collaborations: 15,
        rating: 4.9,
        specialities: ['Foncier', 'Immobilier', 'Succession'],
        lastProject: 'Lotissement VDN',
        status: 'active'
      },
      {
        id: 2,
        name: 'Me Abdou Karim Diop',
        office: 'SCP Diop & Associés',
        location: 'Almadies, Dakar',
        email: 'diop.associes@notaire.sn',
        phone: '+221 33 864 32 10',
        collaborations: 23,
        rating: 4.8,
        specialities: ['Urbanisme', 'Cadastre'],
        lastProject: 'Complexe Cité Keur Gorgui',
        status: 'active'
      }
    ],
    bureaux: [
      {
        id: 3,
        name: 'Bureau d\'Études TEKNIKA',
        type: 'Ingénierie & VRD',
        location: 'Sacré-Cœur, Dakar',
        email: 'contact@teknika.sn',
        phone: '+221 77 654 32 18',
        collaborations: 8,
        rating: 4.7,
        specialities: ['VRD', 'Assainissement', 'Routes'],
        lastProject: 'Aménagement Zone Industrielle',
        status: 'active'
      },
      {
        id: 4,
        name: 'CONSULTING PLUS',
        type: 'Études Techniques',
        location: 'Mermoz, Dakar',
        email: 'info@consultingplus.sn',
        phone: '+221 78 432 65 91',
        collaborations: 12,
        rating: 4.6,
        specialities: ['Géotechnique', 'Environnement'],
        lastProject: 'Étude impact environnemental',
        status: 'prospect'
      }
    ],
    entreprises: [
      {
        id: 5,
        name: 'EIFFAGE Sénégal',
        type: 'BTP & Construction',
        location: 'Zone Industrielle, Dakar',
        email: 'senegal@eiffage.com',
        phone: '+221 33 832 45 67',
        collaborations: 6,
        rating: 4.8,
        specialities: ['Gros œuvre', 'Infrastructure'],
        lastProject: 'Autoroute à péage Dakar-Diamniadio',
        status: 'active'
      },
      {
        id: 6,
        name: 'Groupe CCBM',
        type: 'Matériaux & Construction',
        location: 'Rufisque',
        email: 'contact@ccbm.sn',
        phone: '+221 33 954 78 32',
        collaborations: 4,
        rating: 4.5,
        specialities: ['Béton', 'Préfabriqué'],
        lastProject: 'Centre commercial Sea Plaza',
        status: 'active'
      }
    ]
  };

  const stats = [
    {
      title: 'Partenaires Actifs',
      value: '18',
      change: '+2',
      changeType: 'positive',
      icon: UserCheck,
      description: 'Ce trimestre'
    },
    {
      title: 'Collaborations',
      value: '67',
      change: '+8',
      changeType: 'positive',
      icon: Network,
      description: 'Cette année'
    },
    {
      title: 'Note Moyenne',
      value: '4.7/5',
      change: '+0.1',
      changeType: 'positive',
      icon: Star,
      description: 'Satisfaction'
    },
    {
      title: 'CA Partenariat',
      value: '85M FCFA',
      change: '+22%',
      changeType: 'positive',
      icon: TrendingUp,
      description: 'Revenus indirects'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderPartenaireCard = (partenaire) => (
    <Card key={partenaire.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex items-center gap-4 flex-1">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-900">{partenaire.name}</h3>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-medium text-yellow-600">{partenaire.rating}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-2">
                {partenaire.office || partenaire.type} • {partenaire.location}
              </p>
              <div className="flex flex-wrap gap-1 mb-2">
                {partenaire.specialities.map((spec, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {partenaire.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {partenaire.phone}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Collaborations</p>
              <p className="text-lg font-bold text-blue-600">{partenaire.collaborations}</p>
            </div>
            <Badge className={getStatusColor(partenaire.status)}>
              {partenaire.status === 'active' ? 'Actif' : 
               partenaire.status === 'prospect' ? 'Prospect' : 'Inactif'}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Collaborer
            </Button>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-sm">
            <span className="text-gray-500">Dernière collaboration : </span>
            <span className="font-medium text-gray-900">{partenaire.lastProject}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
            Réseau Partenaires Professionnels
          </h1>
          <p className="text-gray-600 mt-2">
            Collaboration avec Notaires, Bureaux d'études et Entreprises BTP
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau Partenaire
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <span className={`text-sm font-medium ${
                        stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change}
                      </span>
                      <span className="text-sm text-gray-500 ml-2">{stat.description}</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </motion.div>

      {/* Onglets Partenaires */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Tabs defaultValue="notaires" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="notaires" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Notaires ({partenaires.notaires.length})
            </TabsTrigger>
            <TabsTrigger value="bureaux" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Bureaux d'Études ({partenaires.bureaux.length})
            </TabsTrigger>
            <TabsTrigger value="entreprises" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              Entreprises BTP ({partenaires.entreprises.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notaires" className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Études Notariales Partenaires</h3>
              <p className="text-sm text-gray-600">Collaboration pour les actes authentiques et certifications foncières</p>
            </div>
            <div className="grid gap-6">
              {partenaires.notaires.map(renderPartenaireCard)}
            </div>
          </TabsContent>

          <TabsContent value="bureaux" className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Bureaux d'Études Techniques</h3>
              <p className="text-sm text-gray-600">Partenariat pour les études d'ingénierie et projets techniques</p>
            </div>
            <div className="grid gap-6">
              {partenaires.bureaux.map(renderPartenaireCard)}
            </div>
          </TabsContent>

          <TabsContent value="entreprises" className="space-y-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Entreprises BTP & Construction</h3>
              <p className="text-sm text-gray-600">Collaboration pour la réalisation des projets d'aménagement</p>
            </div>
            <div className="grid gap-6">
              {partenaires.entreprises.map(renderPartenaireCard)}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default GeometrePartenaires;