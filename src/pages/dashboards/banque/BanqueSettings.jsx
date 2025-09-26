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
  CheckCircle
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
    }
  });

  const handleSaveSettings = () => {
    window.safeGlobalToast({
      title: "Paramètres sauvegardés",
      description: "Configuration bancaire mise à jour avec succès",
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="banking">Services Banking</TabsTrigger>
          <TabsTrigger value="preferences">Préférences</TabsTrigger>
          <TabsTrigger value="api">API & Intégrations</TabsTrigger>
        </TabsList>

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
      </Tabs>
    </div>
  );
};

export default BanqueSettings;