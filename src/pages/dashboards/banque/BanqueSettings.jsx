import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, 
  Save, 
  Key, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard,
  Smartphone,
  Users,
  TrendingUp,
  Database,
  Zap,
  Eye,
  Lock,
  AlertTriangle,
  CheckCircle,
  FileText,
  Download,
  Building2,
  MapPin,
  Phone,
  Mail,
  Upload,
  Image,
  CreditCard as CreditCardIcon,
  Crown,
  Gem,
  Star as StarIcon,
  Check,
  X,
  Calendar as CalendarIcon,
  Users as UsersIcon,
  Zap as ZapIcon,
  Infinity,
  ArrowUpCircle,
  ShoppingCart,
  Receipt as ReceiptIcon,
  HelpCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const BanqueSettings = ({ dashboardStats = {} }) => {
  const [settings, setSettings] = useState({
    banking: {
      kycAutomation: true,
      scoringIA: true,
      apiBanking: true,
      diasporaMarket: true,
      nftGuarantees: true,
      realTimeAnalytics: true,
      complianceAuto: true
    },
    preferences: {
      language: 'fr',
      currency: 'XOF',
      timezone: 'Africa/Dakar',
      theme: 'light'
    },
    bankInfo: {
      name: 'Banque Atlantique',
      fullName: 'Banque Atlantique du Sénégal',
      registrationNumber: 'BAS-2024-001',
      licence: 'BCE-SN-2024-045',
      address: '125 Avenue Léopold Sédar Senghor, Dakar',
      city: 'Dakar',
      country: 'Sénégal',
      postalCode: '10200',
      phone: '+221 33 823 45 67',
      email: 'info@atlantique-bank.sn',
      website: 'www.atlantique-bank.sn',
      logo: null,
      director: 'Amadou Ba',
      foundedYear: '2018',
      capital: '15 000 000 000 XOF',
      employees: 450,
      branches: 35
    },
    abonnement: {
      planActuel: 'enterprise',
      dateDebut: new Date('2024-01-01'),
      dateFin: new Date('2025-01-01'),
      status: 'actif',
      autoRenouvellement: true,
      factureMensuelle: 2500000,
      utilisateursInclus: 50,
      utilisateursUtilises: 32,
      fonctionnalitesUtilisees: [
        'TerangaChain Banking',
        'IA Scoring Crédit',
        'KYC Automatisé',
        'Analytics Avancées',
        'Support Premium'
      ],
      historiqueFactures: [
        {
          date: new Date('2024-09-01'),
          montant: 2500000,
          status: 'payée',
          reference: 'FACT-2024-09-001'
        },
        {
          date: new Date('2024-08-01'),
          montant: 2500000,
          status: 'payée',
          reference: 'FACT-2024-08-001'
        },
        {
          date: new Date('2024-07-01'),
          montant: 2500000,
          status: 'payée',
          reference: 'FACT-2024-07-001'
        }
      ]
    }
  });

  const handleSaveSettings = () => {
    window.safeGlobalToast({
      title: "Paramètres sauvegardés",
      description: "Configuration bancaire mise à jour avec succès",
      variant: "success"
    });
  };

  const handleUpgradePlan = (planName, price) => {
    window.safeGlobalToast({
      title: "Demande d'upgrade envoyée",
      description: `Votre demande d'upgrade vers ${planName} (${price}K XOF/mois) a été transmise à notre équipe commerciale.`,
      variant: "success"
    });
  };

  const handleDownloadInvoice = (reference) => {
    window.safeGlobalToast({
      title: "Téléchargement en cours",
      description: `Téléchargement de la facture ${reference}...`,
      variant: "success"
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Paramètres Bancaires</h2>
          <p className="text-gray-600 mt-1">
            Configuration et préférences du système bancaire avancé
          </p>
        </div>
        
        <Button onClick={handleSaveSettings} className="mt-4 lg:mt-0">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      {/* Statut système */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">API Banking</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium">Connecté</span>
                </div>
              </div>
              <div className="text-green-500">
                <Database className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">KYC Automatisé</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium">Actif</span>
                </div>
              </div>
              <div className="text-blue-500">
                <Eye className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scoring IA</p>
                <div className="flex items-center mt-1">
                  <Zap className="h-4 w-4 text-yellow-500 mr-1" />
                  <span className="text-sm font-medium">98% précision</span>
                </div>
              </div>
              <div className="text-yellow-500">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">TerangaChain</p>
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm font-medium">Synchronisé</span>
                </div>
              </div>
              <div className="text-purple-500">
                <Shield className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="banking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-8">
          <TabsTrigger value="bankinfo">Informations Banque</TabsTrigger>
          <TabsTrigger value="abonnement">Abonnement</TabsTrigger>
          <TabsTrigger value="banking">Services Banking</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="api">API & Intégrations</TabsTrigger>
          <TabsTrigger value="team">Équipe & Rôles</TabsTrigger>
          <TabsTrigger value="logs">Logs & Audit</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
        </TabsList>

        <TabsContent value="bankinfo" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Informations générales */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2" />
                  Informations Générales
                </CardTitle>
                <CardDescription>
                  Informations de base de votre institution bancaire
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="bankName">Nom de la banque</Label>
                    <Input
                      id="bankName"
                      value={settings.bankInfo.name}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankInfo: { ...prev.bankInfo, name: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="fullName">Dénomination complète</Label>
                    <Input
                      id="fullName"
                      value={settings.bankInfo.fullName}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankInfo: { ...prev.bankInfo, fullName: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="regNumber">N° d'enregistrement</Label>
                      <Input
                        id="regNumber"
                        value={settings.bankInfo.registrationNumber}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          bankInfo: { ...prev.bankInfo, registrationNumber: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="licence">Licence bancaire</Label>
                      <Input
                        id="licence"
                        value={settings.bankInfo.licence}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          bankInfo: { ...prev.bankInfo, licence: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="director">Directeur Général</Label>
                    <Input
                      id="director"
                      value={settings.bankInfo.director}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankInfo: { ...prev.bankInfo, director: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="foundedYear">Année de création</Label>
                      <Input
                        id="foundedYear"
                        value={settings.bankInfo.foundedYear}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          bankInfo: { ...prev.bankInfo, foundedYear: e.target.value }
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="employees">Employés</Label>
                      <Input
                        id="employees"
                        type="number"
                        value={settings.bankInfo.employees}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          bankInfo: { ...prev.bankInfo, employees: parseInt(e.target.value) }
                        }))}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="branches">Agences</Label>
                      <Input
                        id="branches"
                        type="number"
                        value={settings.bankInfo.branches}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          bankInfo: { ...prev.bankInfo, branches: parseInt(e.target.value) }
                        }))}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="capital">Capital social</Label>
                    <Input
                      id="capital"
                      value={settings.bankInfo.capital}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankInfo: { ...prev.bankInfo, capital: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Coordonnées et contact */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Coordonnées & Contact
                </CardTitle>
                <CardDescription>
                  Informations de contact et localisation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input
                    id="address"
                    value={settings.bankInfo.address}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      bankInfo: { ...prev.bankInfo, address: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={settings.bankInfo.city}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankInfo: { ...prev.bankInfo, city: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      value={settings.bankInfo.postalCode}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        bankInfo: { ...prev.bankInfo, postalCode: e.target.value }
                      }))}
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="country">Pays</Label>
                  <Select 
                    value={settings.bankInfo.country}
                    onValueChange={(value) => setSettings(prev => ({
                      ...prev,
                      bankInfo: { ...prev.bankInfo, country: value }
                    }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sénégal">Sénégal</SelectItem>
                      <SelectItem value="Mali">Mali</SelectItem>
                      <SelectItem value="Burkina Faso">Burkina Faso</SelectItem>
                      <SelectItem value="Côte d'Ivoire">Côte d'Ivoire</SelectItem>
                      <SelectItem value="Ghana">Ghana</SelectItem>
                      <SelectItem value="Togo">Togo</SelectItem>
                      <SelectItem value="Bénin">Bénin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="phone" className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    Téléphone principal
                  </Label>
                  <Input
                    id="phone"
                    value={settings.bankInfo.phone}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      bankInfo: { ...prev.bankInfo, phone: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    Email officiel
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.bankInfo.email}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      bankInfo: { ...prev.bankInfo, email: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label htmlFor="website" className="flex items-center">
                    <Globe className="h-4 w-4 mr-2" />
                    Site web
                  </Label>
                  <Input
                    id="website"
                    value={settings.bankInfo.website}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      bankInfo: { ...prev.bankInfo, website: e.target.value }
                    }))}
                    className="mt-1"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Logo de la banque */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Image className="h-5 w-5 mr-2" />
                Logo et Identité Visuelle
              </CardTitle>
              <CardDescription>
                Gérez le logo et l'identité visuelle de votre banque
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-6">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    {settings.bankInfo.logo ? (
                      <img 
                        src={settings.bankInfo.logo} 
                        alt="Logo banque" 
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <Building2 className="h-12 w-12 text-white" />
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="space-y-2">
                    <Label>Logo de la banque</Label>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" className="flex items-center">
                        <Upload className="h-4 w-4 mr-2" />
                        Télécharger un logo
                      </Button>
                      {settings.bankInfo.logo && (
                        <Button 
                          variant="ghost" 
                          className="text-red-600"
                          onClick={() => setSettings(prev => ({
                            ...prev,
                            bankInfo: { ...prev.bankInfo, logo: null }
                          }))}
                        >
                          Supprimer
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Formats acceptés: PNG, JPG, SVG. Taille recommandée: 200x200px
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abonnement" className="space-y-6">
          {/* Statut abonnement actuel */}
          <Card className="border-l-4 border-l-green-500 bg-green-50/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center text-green-800">
                    <Crown className="h-6 w-6 mr-2" />
                    Plan Enterprise - Actif
                  </CardTitle>
                  <CardDescription className="text-green-600">
                    Abonnement valide jusqu'au {settings.abonnement.dateFin.toLocaleDateString('fr-FR')}
                  </CardDescription>
                </div>
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  {settings.abonnement.status.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border">
                  <UsersIcon className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{settings.abonnement.utilisateursUtilises}</p>
                  <p className="text-sm text-gray-600">sur {settings.abonnement.utilisateursInclus} utilisateurs</p>
                  <Progress value={(settings.abonnement.utilisateursUtilises / settings.abonnement.utilisateursInclus) * 100} className="mt-2" />
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border">
                  <CreditCardIcon className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{(settings.abonnement.factureMensuelle / 1000000).toFixed(1)}M</p>
                  <p className="text-sm text-gray-600">XOF / mois</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border">
                  <CalendarIcon className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{Math.ceil((settings.abonnement.dateFin - new Date()) / (1000 * 60 * 60 * 24))}</p>
                  <p className="text-sm text-gray-600">jours restants</p>
                </div>
                
                <div className="text-center p-4 bg-white rounded-lg border">
                  <ZapIcon className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900">{settings.abonnement.fonctionnalitesUtilisees.length}</p>
                  <p className="text-sm text-gray-600">fonctionnalités actives</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plans d'abonnement disponibles */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-900 flex items-center">
              <ShoppingCart className="h-5 w-5 mr-2" />
              Plans d'Abonnement Disponibles
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Plan Starter */}
              <Card className="relative">
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Building2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl">Starter</CardTitle>
                  <CardDescription>Parfait pour débuter</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">750K</span>
                    <span className="text-gray-600 ml-1">XOF/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Jusqu'à 10 utilisateurs</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Gestion de base des crédits</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>KYC manuel</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Support par email</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span>TerangaChain Banking</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-400">
                      <X className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                      <span>IA Scoring</span>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => handleUpgradePlan('Starter', '750')}
                  >
                    Sélectionner Starter
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Professional */}
              <Card className="relative border-2 border-blue-500">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">POPULAIRE</Badge>
                </div>
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Gem className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle className="text-xl">Professional</CardTitle>
                  <CardDescription>Pour banques en croissance</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">1.5M</span>
                    <span className="text-gray-600 ml-1">XOF/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Jusqu'à 25 utilisateurs</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Gestion avancée des crédits</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>KYC automatisé</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>TerangaChain Banking</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Analytics de base</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Support téléphonique</span>
                    </div>
                  </div>
                  <Button 
                    className="w-full"
                    onClick={() => handleUpgradePlan('Professional', '1500')}
                  >
                    Passer à Professional
                  </Button>
                </CardContent>
              </Card>

              {/* Plan Enterprise (actuel) */}
              <Card className="relative border-2 border-green-500 bg-green-50/30">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-green-500 text-white">ACTUEL</Badge>
                </div>
                <CardHeader className="text-center pb-2">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Crown className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Enterprise</CardTitle>
                  <CardDescription>Solution complète</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-gray-900">2.5M</span>
                    <span className="text-gray-600 ml-1">XOF/mois</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Jusqu'à 50 utilisateurs</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Toutes les fonctionnalités</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>IA Scoring Crédit</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Analytics avancées</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Support premium 24/7</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                      <span>Formation personnalisée</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" disabled>
                    Plan Actuel
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Paramètres d'abonnement */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  Paramètres d'Abonnement
                </CardTitle>
                <CardDescription>
                  Gérez vos préférences de facturation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Renouvellement automatique</Label>
                    <p className="text-sm text-gray-500">
                      Renouvellez automatiquement votre abonnement
                    </p>
                  </div>
                  <Switch 
                    checked={settings.abonnement.autoRenouvellement}
                    onCheckedChange={(checked) => 
                      setSettings(prev => ({
                        ...prev,
                        abonnement: { ...prev.abonnement, autoRenouvellement: checked }
                      }))
                    }
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Méthode de paiement</Label>
                  <Select defaultValue="mobile">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mobile">Mobile Money</SelectItem>
                      <SelectItem value="bank">Virement bancaire</SelectItem>
                      <SelectItem value="card">Carte bancaire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Fréquence de facturation</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mensuel</SelectItem>
                      <SelectItem value="quarterly">Trimestriel (-5%)</SelectItem>
                      <SelectItem value="yearly">Annuel (-15%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Button className="w-full">
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer les paramètres
                </Button>
              </CardContent>
            </Card>

            {/* Historique des factures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ReceiptIcon className="h-5 w-5 mr-2" />
                  Historique des Factures
                </CardTitle>
                <CardDescription>
                  Vos dernières factures et paiements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {settings.abonnement.historiqueFactures.map((facture, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">
                          {(facture.montant / 1000000).toFixed(1)}M XOF
                        </p>
                        <p className="text-sm text-gray-500">
                          {facture.date.toLocaleDateString('fr-FR')} • {facture.reference}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={
                          facture.status === 'payée' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }>
                          {facture.status}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDownloadInvoice(facture.reference)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <Button variant="outline" className="w-full mt-4">
                  Voir toutes les factures
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Support et assistance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <HelpCircle className="h-5 w-5 mr-2" />
                Support Abonnement
              </CardTitle>
              <CardDescription>
                Besoin d'aide avec votre abonnement ?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center justify-center">
                  <Phone className="h-4 w-4 mr-2" />
                  Contacter le support
                </Button>
                <Button variant="outline" className="flex items-center justify-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email commercial
                </Button>
                <Button variant="outline" className="flex items-center justify-center">
                  <ArrowUpCircle className="h-4 w-4 mr-2" />
                  Demander upgrade
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banking" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Services Bancaires Avancés
              </CardTitle>
              <CardDescription>
                Configuration des services bancaires spécialisés basés sur la solution Teranga
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        KYC Automatisé
                      </Label>
                      <p className="text-sm text-gray-500">
                        Vérification d'identité automatique avec IA
                      </p>
                    </div>
                    <Switch 
                      checked={settings.banking.kycAutomation}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          banking: { ...prev.banking, kycAutomation: checked }
                        }))
                      }
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Scoring Crédit IA
                      </Label>
                      <p className="text-sm text-gray-500">
                        Évaluation intelligente des risques de crédit
                      </p>
                    </div>
                    <Switch 
                      checked={settings.banking.scoringIA}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          banking: { ...prev.banking, scoringIA: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <Users className="h-4 w-4 mr-2" />
                        Marché Diaspora
                      </Label>
                      <p className="text-sm text-gray-500">
                        Services spécialisés pour la diaspora sénégalaise
                      </p>
                    </div>
                    <Switch 
                      checked={settings.banking.diasporaMarket}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          banking: { ...prev.banking, diasporaMarket: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <Shield className="h-4 w-4 mr-2" />
                        Garanties NFT
                      </Label>
                      <p className="text-sm text-gray-500">
                        Garanties tokenisées sur TerangaChain
                      </p>
                    </div>
                    <Switch 
                      checked={settings.banking.nftGuarantees}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          banking: { ...prev.banking, nftGuarantees: checked }
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <Database className="h-4 w-4 mr-2" />
                        API Banking
                      </Label>
                      <p className="text-sm text-gray-500">
                        Interface de programmation bancaire
                      </p>
                    </div>
                    <Switch 
                      checked={settings.banking.apiBanking}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          banking: { ...prev.banking, apiBanking: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <Zap className="h-4 w-4 mr-2" />
                        Analytics Temps Réel
                      </Label>
                      <p className="text-sm text-gray-500">
                        Tableau de bord et métriques en direct
                      </p>
                    </div>
                    <Switch 
                      checked={settings.banking.realTimeAnalytics}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          banking: { ...prev.banking, realTimeAnalytics: checked }
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className="flex items-center">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Conformité Automatique
                      </Label>
                      <p className="text-sm text-gray-500">
                        Vérification réglementaire automatisée
                      </p>
                    </div>
                    <Switch 
                      checked={settings.banking.complianceAuto}
                      onCheckedChange={(checked) => 
                        setSettings(prev => ({
                          ...prev,
                          banking: { ...prev.banking, complianceAuto: checked }
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="h-5 w-5 mr-2" />
                Préférences Générales
              </CardTitle>
              <CardDescription>
                Configuration de base de votre environnement bancaire
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <Select value={settings.preferences.language}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="wo">Wolof</SelectItem>
                      <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Devise principale</Label>
                  <Select value={settings.preferences.currency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="XOF">FCFA (XOF)</SelectItem>
                      <SelectItem value="EUR">Euro (EUR)</SelectItem>
                      <SelectItem value="USD">Dollar US (USD)</SelectItem>
                      <SelectItem value="GBP">Livre Sterling (GBP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <Select value={settings.preferences.timezone}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Africa/Dakar">Dakar (GMT+0)</SelectItem>
                      <SelectItem value="Europe/Paris">Paris (GMT+1)</SelectItem>
                      <SelectItem value="America/New_York">New York (GMT-5)</SelectItem>
                      <SelectItem value="Africa/Casablanca">Casablanca (GMT+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="theme">Thème d'interface</Label>
                  <Select value={settings.preferences.theme}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Clair</SelectItem>
                      <SelectItem value="dark">Sombre</SelectItem>
                      <SelectItem value="auto">Automatique</SelectItem>
                      <SelectItem value="high-contrast">Contraste élevé</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Key className="h-5 w-5 mr-2" />
                API Banking & Intégrations
              </CardTitle>
              <CardDescription>
                Configuration des API et intégrations avec les partenaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiEndpoint">Point de terminaison API</Label>
                  <Input
                    id="apiEndpoint"
                    defaultValue="https://api.banque-atlantique.sn"
                    placeholder="https://api.votre-banque.com"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="apiKey">Clé API de production</Label>
                  <Input
                    id="apiKey"
                    type="password"
                    defaultValue="ba_live_****************************"
                    placeholder="Votre clé API sécurisée"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="webhookUrl">URL Webhook</Label>
                  <Input
                    id="webhookUrl"
                    defaultValue="https://teranga-foncier.sn/webhooks/banking"
                    placeholder="https://votre-site.com/webhooks"
                  />
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" className="flex-1">
                    Tester connexion
                  </Button>
                  <Button variant="outline">
                    Générer nouvelle clé
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Intégrations Partenaires</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Teranga Foncier</Label>
                        <p className="text-sm text-gray-500">Plateforme immobilière</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Connecté</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>TerangaChain</Label>
                        <p className="text-sm text-gray-500">Blockchain privée</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Synchronisé</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Réseau Notaires</Label>
                        <p className="text-sm text-gray-500">Intégration notariale</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Actif</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Banque Centrale (BCEAO)</Label>
                        <p className="text-sm text-gray-500">Reporting réglementaire</p>
                      </div>
                      <Badge className="bg-yellow-100 text-yellow-800">En attente</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Équipe & Rôles */}
        <TabsContent value="team" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Gestion de l'Équipe Bancaire
              </CardTitle>
              <CardDescription>
                Membres de l'équipe, rôles et permissions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">MD</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Mamadou Diallo</p>
                        <p className="text-sm text-gray-500">Directeur Crédit</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge className="bg-green-100 text-green-800">Admin</Badge>
                      <Badge variant="outline" className="ml-2">Actif</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-purple-600">AS</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Aïssatou Sow</p>
                        <p className="text-sm text-gray-500">Analyste Risque</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge className="bg-blue-100 text-blue-800">Analyste</Badge>
                      <Badge variant="outline" className="ml-2">Actif</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-orange-600">ON</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Omar Ndiaye</p>
                        <p className="text-sm text-gray-500">Chargé Clientèle</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge className="bg-yellow-100 text-yellow-800">Commercial</Badge>
                      <Badge variant="outline" className="ml-2">Actif</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-green-600">FT</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Fatou Thiam</p>
                        <p className="text-sm text-gray-500">Responsable KYC</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge className="bg-indigo-100 text-indigo-800">Compliance</Badge>
                      <Badge variant="outline" className="ml-2">Actif</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-red-600">IB</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Ibrahim Ba</p>
                        <p className="text-sm text-gray-500">Expert Blockchain</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge className="bg-purple-100 text-purple-800">Tech</Badge>
                      <Badge variant="outline" className="ml-2">Actif</Badge>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-teal-600">KD</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Khadija Diouf</p>
                        <p className="text-sm text-gray-500">Auditrice Interne</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Badge className="bg-gray-100 text-gray-800">Audit</Badge>
                      <Badge variant="outline" className="ml-2">Actif</Badge>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Ajouter membre
                  </Button>
                  <Button variant="outline">
                    Gérer permissions
                  </Button>
                  <Button variant="outline">
                    Export équipe
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs & Audit */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Logs & Audit Trail
              </CardTitle>
              <CardDescription>
                Historique des actions et traçabilité complète
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex space-x-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les actions</SelectItem>
                      <SelectItem value="credit">Crédits</SelectItem>
                      <SelectItem value="kyc">KYC</SelectItem>
                      <SelectItem value="admin">Administration</SelectItem>
                      <SelectItem value="api">API Banking</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Export logs
                  </Button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Crédit approuvé - 85M FCFA</p>
                          <p className="text-sm text-gray-500">Amadou Diallo • Client: Fatou Sarr</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">Il y a 5 min</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">KYC automatisé complété</p>
                          <p className="text-sm text-gray-500">Système IA • Client: Moussa Thiam</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">Il y a 12 min</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Score de risque recalculé</p>
                          <p className="text-sm text-gray-500">Aïssatou Sow • Score: 87.3</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">Il y a 23 min</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Transaction blockchain enregistrée</p>
                          <p className="text-sm text-gray-500">TerangaChain • Hash: 0x4f2a...</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">Il y a 35 min</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Tentative de connexion bloquée</p>
                          <p className="text-sm text-gray-500">Système sécurité • IP: 185.23.45.67</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">Il y a 1h</span>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="font-medium text-gray-900">Rapport mensuel généré</p>
                          <p className="text-sm text-gray-500">Khadija Diouf • 245 crédits traités</p>
                        </div>
                      </div>
                      <span className="text-sm text-gray-400">Il y a 2h</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Portfolio */}
        <TabsContent value="portfolio" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2" />
                Portfolio Bancaire
              </CardTitle>
              <CardDescription>
                Vue d'ensemble du portefeuille de crédits et investissements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-600 font-medium">Encours Total</p>
                      <p className="text-2xl font-bold text-blue-900">245.8M FCFA</p>
                      <p className="text-sm text-blue-600">+12.3% ce mois</p>
                    </div>
                    <CreditCard className="h-10 w-10 text-blue-600" />
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-600 font-medium">Crédits Sains</p>
                      <p className="text-2xl font-bold text-green-900">228.1M FCFA</p>
                      <p className="text-sm text-green-600">92.8% du portfolio</p>
                    </div>
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-orange-600 font-medium">NPL Ratio</p>
                      <p className="text-2xl font-bold text-orange-900">2.1%</p>
                      <p className="text-sm text-orange-600">Excellent niveau</p>
                    </div>
                    <AlertTriangle className="h-10 w-10 text-orange-600" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Répartition par Type de Crédit</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-blue-500 rounded"></div>
                      <span className="text-sm font-medium">Crédit Terrain</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Progress value={65} className="w-24" />
                      <span className="text-sm text-gray-600">159.8M FCFA (65%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-green-500 rounded"></div>
                      <span className="text-sm font-medium">Crédit Construction</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Progress value={25} className="w-24" />
                      <span className="text-sm text-gray-600">61.5M FCFA (25%)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 bg-purple-500 rounded"></div>
                      <span className="text-sm font-medium">Crédit Diaspora</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Progress value={10} className="w-24" />
                      <span className="text-sm text-gray-600">24.5M FCFA (10%)</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Top 5 Clients</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Amadou Diallo</span>
                      <span className="text-sm text-gray-600">18.5M FCFA</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Société TERANGA SA</span>
                      <span className="text-sm text-gray-600">15.2M FCFA</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Fatou Sarr</span>
                      <span className="text-sm text-gray-600">12.8M FCFA</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Moussa Thiam</span>
                      <span className="text-sm text-gray-600">11.3M FCFA</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Aïcha Sow</span>
                      <span className="text-sm text-gray-600">9.7M FCFA</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900">Métriques Clés</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Taux d'approbation</span>
                      <span className="text-sm text-green-600 font-semibold">82.1%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Délai moyen traitement</span>
                      <span className="text-sm text-blue-600 font-semibold">4.2 jours</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Score IA moyen</span>
                      <span className="text-sm text-purple-600 font-semibold">87.3/100</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Satisfaction client</span>
                      <span className="text-sm text-yellow-600 font-semibold">4.7/5</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">ROI Portfolio</span>
                      <span className="text-sm text-green-600 font-semibold">8.5%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BanqueSettings;