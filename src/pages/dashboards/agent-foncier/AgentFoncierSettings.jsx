import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings,
  User,
  Shield,
  Bell,
  Map,
  Brain,
  Blocks,
  CreditCard,
  Save,
  Eye,
  EyeOff,
  Camera,
  MapPin,
  FileText,
  Calculator
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';

const AgentFoncierSettings = () => {
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const [settings, setSettings] = useState({
    // Profil
    fullName: 'Moussa Diallo',
    email: 'moussa.diallo@teranga.com',
    phone: '+221 77 123 45 67',
    specialisation: 'Évaluation Foncière',
    certification: 'Agent Foncier Certifié',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    evaluationAlerts: true,
    documentAlerts: true,
    clientAlerts: true,
    
    // Géolocalisation
    autoLocation: true,
    precisionGPS: 'high',
    saveTrajectories: false,
    shareLocation: true,
    
    // IA et Blockchain
    aiAssistance: true,
    predictiveAnalysis: true,
    blockchainValidation: false,
    smartContracts: false,
    
    // Abonnement
    currentPlan: 'Professionnel',
    nextBilling: '2025-10-26',
    usage: {
      evaluations: 85,
      documents: 68,
      clients: 45
    }
  });

  const plans = [
    {
      name: 'Essentiel',
      price: '25,000',
      features: ['50 évaluations/mois', 'Support email', 'Rapports de base'],
      current: false
    },
    {
      name: 'Professionnel',
      price: '75,000',
      features: ['200 évaluations/mois', 'IA intégrée', 'Support prioritaire', 'Analytics avancés'],
      current: true
    },
    {
      name: 'Expert',
      price: '150,000',
      features: ['Évaluations illimitées', 'Blockchain', 'API access', 'Support dédié'],
      current: false
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Paramètres Agent Foncier</h1>
          <p className="text-gray-600">Configuration et préférences</p>
        </div>
        <Button className="bg-green-600 hover:bg-green-700">
          <Save className="h-4 w-4 mr-2" />
          Sauvegarder
        </Button>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profil">Profil</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="geolocalisation">Géolocalisation</TabsTrigger>
          <TabsTrigger value="ia-blockchain">IA & Blockchain</TabsTrigger>
          <TabsTrigger value="securite">Sécurité</TabsTrigger>
          <TabsTrigger value="abonnement">Abonnement</TabsTrigger>
        </TabsList>

        <TabsContent value="profil" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Informations Personnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom Complet
                  </label>
                  <input
                    type="text"
                    value={settings.fullName}
                    onChange={(e) => setSettings({...settings, fullName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Professionnel
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({...settings, email: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({...settings, phone: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Informations Professionnelles
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Spécialisation
                  </label>
                  <select
                    value={settings.specialisation}
                    onChange={(e) => setSettings({...settings, specialisation: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  >
                    <option>Évaluation Foncière</option>
                    <option>Cadastre et Topographie</option>
                    <option>Gestion Immobilière</option>
                    <option>Expertise Judiciaire</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Certification
                  </label>
                  <input
                    type="text"
                    value={settings.certification}
                    onChange={(e) => setSettings({...settings, certification: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div className="pt-4">
                  <Button variant="outline" className="w-full">
                    <Camera className="h-4 w-4 mr-2" />
                    Changer la Photo de Profil
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Préférences de Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications par Email</h4>
                  <p className="text-sm text-gray-600">Recevoir les notifications importantes par email</p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Notifications SMS</h4>
                  <p className="text-sm text-gray-600">Recevoir les alertes urgentes par SMS</p>
                </div>
                <Switch
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => setSettings({...settings, smsNotifications: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertes d'Évaluation</h4>
                  <p className="text-sm text-gray-600">Notifications pour nouvelles demandes d'évaluation</p>
                </div>
                <Switch
                  checked={settings.evaluationAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, evaluationAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertes Documents</h4>
                  <p className="text-sm text-gray-600">Notifications pour documents en attente</p>
                </div>
                <Switch
                  checked={settings.documentAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, documentAlerts: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Alertes Clients</h4>
                  <p className="text-sm text-gray-600">Notifications pour nouveaux clients</p>
                </div>
                <Switch
                  checked={settings.clientAlerts}
                  onCheckedChange={(checked) => setSettings({...settings, clientAlerts: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geolocalisation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Paramètres de Géolocalisation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Localisation Automatique</h4>
                  <p className="text-sm text-gray-600">Détecter automatiquement votre position</p>
                </div>
                <Switch
                  checked={settings.autoLocation}
                  onCheckedChange={(checked) => setSettings({...settings, autoLocation: checked})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Précision GPS
                </label>
                <select
                  value={settings.precisionGPS}
                  onChange={(e) => setSettings({...settings, precisionGPS: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                >
                  <option value="low">Basse (100m)</option>
                  <option value="medium">Moyenne (10m)</option>
                  <option value="high">Élevée (1m)</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Sauvegarder les Trajets</h4>
                  <p className="text-sm text-gray-600">Enregistrer vos déplacements pour analyse</p>
                </div>
                <Switch
                  checked={settings.saveTrajectories}
                  onCheckedChange={(checked) => setSettings({...settings, saveTrajectories: checked})}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Partager la Position</h4>
                  <p className="text-sm text-gray-600">Permettre aux clients de voir votre position</p>
                </div>
                <Switch
                  checked={settings.shareLocation}
                  onCheckedChange={(checked) => setSettings({...settings, shareLocation: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ia-blockchain" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Intelligence Artificielle
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Assistant IA</h4>
                    <p className="text-sm text-gray-600">Aide à l'évaluation automatique</p>
                  </div>
                  <Switch
                    checked={settings.aiAssistance}
                    onCheckedChange={(checked) => setSettings({...settings, aiAssistance: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Analyse Prédictive</h4>
                    <p className="text-sm text-gray-600">Prédictions de marché IA</p>
                  </div>
                  <Switch
                    checked={settings.predictiveAnalysis}
                    onCheckedChange={(checked) => setSettings({...settings, predictiveAnalysis: checked})}
                  />
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Nouvelle :</strong> IA générative pour rédaction automatique de rapports
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Blocks className="h-5 w-5 mr-2" />
                  Blockchain
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Validation Blockchain</h4>
                    <p className="text-sm text-gray-600">Sécuriser les documents par blockchain</p>
                  </div>
                  <Switch
                    checked={settings.blockchainValidation}
                    onCheckedChange={(checked) => setSettings({...settings, blockchainValidation: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Smart Contracts</h4>
                    <p className="text-sm text-gray-600">Contrats intelligents automatiques</p>
                  </div>
                  <Switch
                    checked={settings.smartContracts}
                    onCheckedChange={(checked) => setSettings({...settings, smartContracts: checked})}
                  />
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <strong>Bêta :</strong> Fonctionnalités blockchain en test
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="securite" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Sécurité du Compte
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mot de Passe Actuel
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nouveau Mot de Passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le Mot de Passe
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              <Button className="bg-green-600 hover:bg-green-700">
                Mettre à Jour le Mot de Passe
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="abonnement" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Abonnement Actuel
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Plan:</span>
                  <Badge className="bg-green-100 text-green-800">
                    {settings.currentPlan}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Prochaine facturation:</span>
                  <span className="text-sm text-gray-600">{settings.nextBilling}</span>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Évaluations</span>
                      <span className="text-sm font-medium">{settings.usage.evaluations}%</span>
                    </div>
                    <Progress value={settings.usage.evaluations} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Documents</span>
                      <span className="text-sm font-medium">{settings.usage.documents}%</span>
                    </div>
                    <Progress value={settings.usage.documents} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Clients</span>
                      <span className="text-sm font-medium">{settings.usage.clients}%</span>
                    </div>
                    <Progress value={settings.usage.clients} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Plans Disponibles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {plans.map((plan) => (
                    <div 
                      key={plan.name}
                      className={`p-4 border rounded-lg ${plan.current ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{plan.name}</h4>
                        <div className="text-right">
                          <span className="text-lg font-bold">{plan.price}</span>
                          <span className="text-sm text-gray-600"> XOF/mois</span>
                        </div>
                      </div>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {plan.features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                      {plan.current && (
                        <Badge className="mt-2 bg-green-100 text-green-800">Plan Actuel</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgentFoncierSettings;