import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useParams } from 'react-router-dom';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  CreditCard,
  FileText,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Clock,
  Euro
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Helmet } from 'react-helmet-async';

const PromoterNewBuyersPage = () => {
  const [buyers, setBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  // Données simulées de nouveaux acheteurs
  const mockBuyers = [
    {
      id: 1,
      name: 'Aminata Diallo',
      email: 'aminata.diallo@email.com',
      phone: '+33 6 12 34 56 78',
      location: 'Paris, France',
      type: 'Diaspora',
      landPurchased: 'Terrain 500mÂ² - Saly',
      purchaseAmount: 25000000, // FCFA
      purchaseDate: '2024-09-01',
      status: 'Construction planifiée',
      interests: ['Construction résidentielle', 'Villa moderne', 'Piscine'],
      budget: '80-120M FCFA',
      timeline: 'Q1 2025',
      notes: 'Intéressée par nos services de construction clé en main pour une villa moderne avec piscine.',
      avatar: '/api/YOUR_API_KEY/60/60'
    },
    {
      id: 2,
      name: 'Omar Ndiaye',
      email: 'omar.ndiaye@email.com',
      phone: '+1 514 123 4567',
      location: 'Montréal, Canada',
      type: 'Diaspora',
      landPurchased: 'Terrain 800mÂ² - Almadies',
      purchaseAmount: 45000000,
      purchaseDate: '2024-08-15',
      status: 'Études en cours',
      interests: ['Immeuble R+3', 'Commercial', 'Locatif'],
      budget: '200-300M FCFA',
      timeline: 'Q2 2025',
      notes: 'Projet d\'immeuble mixte (commercial RDC + résidentiel). Demande devis complet.',
      avatar: '/api/YOUR_API_KEY/60/60'
    },
    {
      id: 3,
      name: 'Fatou Ba',
      email: 'fatou.ba@email.com',
      phone: '+221 77 123 45 67',
      location: 'Dakar, Sénégal',
      type: 'Particulier',
      landPurchased: 'Terrain 400mÂ² - VDN',
      purchaseAmount: 32000000,
      purchaseDate: '2024-09-10',
      status: 'Prêt Ï  commencer',
      interests: ['Villa familiale', 'Architecture moderne', 'Jardin'],
      budget: '60-90M FCFA',
      timeline: 'Immédiat',
      notes: 'Villa familiale moderne pour famille de 5 personnes. Priorité sur jardin et espaces ouverts.',
      avatar: '/api/YOUR_API_KEY/60/60'
    },
    {
      id: 4,
      name: 'Moussa Sarr',
      email: 'moussa.sarr@email.com',
      phone: '+49 30 12345678',
      location: 'Berlin, Allemagne',
      type: 'Diaspora',
      landPurchased: 'Terrain 600mÂ² - Mbour',
      purchaseAmount: 18000000,
      purchaseDate: '2024-08-30',
      status: 'Recherche financement',
      interests: ['Maison traditionnelle', 'Style sénégalais', 'Cour'],
      budget: '45-70M FCFA',
      timeline: 'Q3 2025',
      notes: 'Maison traditionnelle sénégalaise modernisée. Cherche partenariat bancaire.',
      avatar: '/api/YOUR_API_KEY/60/60'
    }
  ];

  useEffect(() => {
    // Simulation du chargement des données
    setTimeout(() => {
      setBuyers(mockBuyers);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Prêt Ï  commencer':
        return 'bg-green-100 text-green-800';
      case 'Construction planifiée':
        return 'bg-blue-100 text-blue-800';
      case 'Études en cours':
        return 'bg-yellow-100 text-yellow-800';
      case 'Recherche financement':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Nouveaux Acheteurs - Dashboard Promoteur | Teranga Foncier</title>
        <meta name="description" content="Consultez la liste des nouveaux acheteurs de terrains intéressés par vos services de construction." />
      </Helmet>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard">
              <Button variant="outline" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour Dashboard
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Nouveaux Acheteurs</h1>
              <p className="text-gray-600">Prospects ayant récemment acheté un terrain</p>
            </div>
          </div>
          <Badge className="bg-emerald-100 text-emerald-800">
            {buyers.length} nouveaux prospects
          </Badge>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Prospects</p>
                  <p className="text-2xl font-bold">{buyers.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Prêts Ï  commencer</p>
                  <p className="text-2xl font-bold">
                    {buyers.filter(b => b.status === 'Prêt Ï  commencer').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Euro className="w-8 h-8 text-emerald-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Budget moyen</p>
                  <p className="text-2xl font-bold">85M</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-orange-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Timeline moyen</p>
                  <p className="text-2xl font-bold">6 mois</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Liste des acheteurs */}
        <div className="grid gap-6">
          {buyers.map((buyer) => (
            <motion.div
              key={buyer.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <img
                        src={buyer.avatar}
                        alt={buyer.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">{buyer.name}</h3>
                          <Badge variant="secondary">{buyer.type}</Badge>
                          <Badge className={getStatusColor(buyer.status)}>
                            {buyer.status}
                          </Badge>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2" />
                            {buyer.email}
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2" />
                            {buyer.phone}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {buyer.location}
                          </div>
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            Acheté le {new Date(buyer.purchaseDate).toLocaleDateString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">
                        {buyer.budget}
                      </p>
                      <p className="text-sm text-gray-600">Budget construction</p>
                    </div>
                  </div>

                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Terrain acheté</h4>
                        <p className="text-sm text-gray-600">{buyer.landPurchased}</p>
                        <p className="text-sm font-medium text-emerald-600">
                          {formatCurrency(buyer.purchaseAmount)}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Intérêts construction</h4>
                        <div className="flex flex-wrap gap-1">
                          {buyer.interests.map((interest, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {interest}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
                      <p className="text-sm text-gray-600">{buyer.notes}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex space-x-3">
                    <Button className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Appeler
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Mail className="w-4 h-4 mr-2" />
                      Envoyer Email
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      Proposer Devis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Message si aucun acheteur */}
        {buyers.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <User className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun nouvel acheteur</h3>
              <p className="text-gray-600">
                Les nouveaux acheteurs de terrains intéressés par vos services apparaîtront ici.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default PromoterNewBuyersPage;
