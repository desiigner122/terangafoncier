import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  CreditCard, 
  Home, 
  Car, 
  Briefcase, 
  GraduationCap,
  Smartphone,
  Globe,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Target,
  Award,
  Settings,
  Download,
  Upload,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Lock,
  FileText,
  Send,
  Receipt,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BanqueProduits = () => {
  const [produits, setProduits] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Simulation des produits bancaires
  useEffect(() => {
    const mockProduits = [
      {
        id: 1,
        name: 'Crédit Immobilier Teranga',
        category: 'immobilier',
        type: 'Crédit',
        description: 'Crédit immobilier spécialisé pour l\'acquisition de terrains et biens fonciers',
        taux: 8.5,
        dureeMax: 25,
        montantMin: 5000000,
        montantMax: 100000000,
        clientsActifs: 145,
        revenusGeneres: 2500000000,
        status: 'active',
        performance: 92,
        risqueLevel: 'faible',
        dateCreation: new Date('2024-01-15'),
        features: ['Taux préférentiel diaspora', 'Garantie TerangaChain', 'Évaluation IA'],
        conditions: {
          apportPersonnel: 20,
          revenuMinimal: 500000,
          ageMax: 65
        }
      },
      {
        id: 2,
        name: 'Compte Épargne Digital',
        category: 'epargne',
        type: 'Épargne',
        description: 'Compte d\'épargne numérique avec taux avantageux',
        taux: 5.2,
        montantMin: 50000,
        montantMax: 50000000,
        clientsActifs: 2340,
        revenusGeneres: 180000000,
        status: 'active',
        performance: 88,
        risqueLevel: 'très faible',
        dateCreation: new Date('2023-11-10'),
        features: ['Mobile Banking', 'Taux progressif', 'Virement instantané'],
        conditions: {
          depotMinimal: 50000,
          fraisTenue: 0,
          retraitGratuit: 5
        }
      },
      {
        id: 3,
        name: 'Prêt Auto Flex',
        category: 'automobile',
        type: 'Crédit',
        description: 'Financement automobile avec conditions flexibles',
        taux: 9.8,
        dureeMax: 7,
        montantMin: 2000000,
        montantMax: 25000000,
        clientsActifs: 89,
        revenusGeneres: 450000000,
        status: 'active',
        performance: 85,
        risqueLevel: 'moyen',
        dateCreation: new Date('2024-03-20'),
        features: ['Assurance incluse', 'Report paiement', 'Remboursement anticipé'],
        conditions: {
          apportPersonnel: 15,
          ageVehicule: 5,
          assuranceObligatoire: true
        }
      },
      {
        id: 4,
        name: 'Crédit Entrepreneur',
        category: 'professionnel',
        type: 'Crédit',
        description: 'Financement pour entrepreneurs et PME',
        taux: 11.5,
        dureeMax: 10,
        montantMin: 1000000,
        montantMax: 50000000,
        clientsActifs: 67,
        revenusGeneres: 890000000,
        status: 'active',
        performance: 78,
        risqueLevel: 'élevé',
        dateCreation: new Date('2024-02-05'),
        features: ['Période grâce', 'Conseil business', 'Suivi personnalisé'],
        conditions: {
          businessPlan: true,
          garantie: 'réelle',
          experienceMin: 2
        }
      },
      {
        id: 5,
        name: 'Bourse Étudiant',
        category: 'education',
        type: 'Crédit',
        description: 'Prêt étudiant pour financer les études supérieures',
        taux: 4.5,
        dureeMax: 15,
        montantMin: 500000,
        montantMax: 10000000,
        clientsActifs: 234,
        revenusGeneres: 120000000,
        status: 'active',
        performance: 95,
        risqueLevel: 'faible',
        dateCreation: new Date('2023-09-01'),
        features: ['Taux étudiant', 'Report après diplôme', 'Bourse partenaires'],
        conditions: {
          ageMax: 30,
          inscription: 'required',
          cautionParentale: true
        }
      },
      {
        id: 6,
        name: 'Carte Gold Diaspora',
        category: 'cartes',
        type: 'Carte',
        description: 'Carte bancaire premium pour la diaspora africaine',
        taux: 0,
        fraisAnnuel: 25000,
        clientsActifs: 456,
        revenusGeneres: 340000000,
        status: 'active',
        performance: 90,
        risqueLevel: 'faible',
        dateCreation: new Date('2024-01-01'),
        features: ['Sans frais international', 'Assurance voyage', 'Conciergerie'],
        conditions: {
          revenuMinimal: 1000000,
          depotGarantie: 0,
          residence: 'diaspora'
        }
      }
    ];
    setProduits(mockProduits);
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      immobilier: Home,
      epargne: Wallet,
      automobile: Car,
      professionnel: Briefcase,
      education: GraduationCap,
      cartes: CreditCard
    };
    return icons[category] || Package;
  };

  const getCategoryColor = (category) => {
    const colors = {
      immobilier: 'bg-blue-100 text-blue-800',
      epargne: 'bg-green-100 text-green-800',
      automobile: 'bg-purple-100 text-purple-800',
      professionnel: 'bg-orange-100 text-orange-800',
      education: 'bg-indigo-100 text-indigo-800',
      cartes: 'bg-pink-100 text-pink-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getRisqueColor = (risque) => {
    const colors = {
      'très faible': 'text-green-600',
      'faible': 'text-blue-600',
      'moyen': 'text-yellow-600',
      'élevé': 'text-red-600'
    };
    return colors[risque] || 'text-gray-600';
  };

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(montant);
  };

  const filteredProduits = produits.filter(produit => {
    const matchesSearch = produit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          produit.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || produit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Statistiques générales
  const totalClients = produits.reduce((sum, p) => sum + p.clientsActifs, 0);
  const totalRevenus = produits.reduce((sum, p) => sum + p.revenusGeneres, 0);
  const performanceMoyenne = produits.reduce((sum, p) => sum + p.performance, 0) / produits.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="h-8 w-8 mr-3 text-blue-600" />
            Produits Bancaires
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez votre gamme de produits et services bancaires
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Produit
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produits Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{produits.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clients Total</p>
                <p className="text-2xl font-bold text-gray-900">{totalClients.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Revenus Générés</p>
                <p className="text-2xl font-bold text-gray-900">{formatMontant(totalRevenus)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Performance Moy.</p>
                <p className="text-2xl font-bold text-gray-900">{performanceMoyenne.toFixed(1)}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par catégorie..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  <SelectItem value="immobilier">Immobilier</SelectItem>
                  <SelectItem value="epargne">Épargne</SelectItem>
                  <SelectItem value="automobile">Automobile</SelectItem>
                  <SelectItem value="professionnel">Professionnel</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="cartes">Cartes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProduits.map((produit) => {
          const IconComponent = getCategoryIcon(produit.category);
          
          return (
            <motion.div
              key={produit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(produit.category)}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{produit.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {produit.type} • {produit.category}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={produit.status === 'active' ? 'default' : 'secondary'}>
                      {produit.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {produit.description}
                  </p>
                  
                  {/* Métriques clés */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Taux</p>
                      <p className="font-medium">
                        {produit.taux ? `${produit.taux}%` : formatMontant(produit.fraisAnnuel)}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Clients</p>
                      <p className="font-medium">{produit.clientsActifs}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Performance</p>
                      <div className="flex items-center space-x-2">
                        <Progress value={produit.performance} className="h-2 flex-1" />
                        <span className="font-medium">{produit.performance}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-500">Risque</p>
                      <p className={`font-medium ${getRisqueColor(produit.risqueLevel)}`}>
                        {produit.risqueLevel}
                      </p>
                    </div>
                  </div>
                  
                  {/* Montants */}
                  {produit.montantMin && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Plage de financement</p>
                      <p className="text-sm font-medium">
                        {formatMontant(produit.montantMin)} - {formatMontant(produit.montantMax)}
                      </p>
                    </div>
                  )}
                  
                  {/* Features principales */}
                  <div className="flex flex-wrap gap-1">
                    {produit.features.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {produit.features.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{produit.features.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      Créé le {produit.dateCreation.toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredProduits.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm ? 'Aucun produit ne correspond à votre recherche.' : 'Commencez par créer votre premier produit bancaire.'}
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un produit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BanqueProduits;