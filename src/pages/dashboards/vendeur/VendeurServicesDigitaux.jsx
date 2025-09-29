import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Zap,
  Video,
  PenTool,
  Upload,
  FileText,
  Camera,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle,
  Eye,
  Download,
  Share2,
  Users,
  Monitor,
  Smartphone,
  Wifi,
  Cloud,
  Lock,
  Activity,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VendeurServicesDigitaux = () => {
  const [activeTab, setActiveTab] = useState('signature');
  
  // Données des services digitalisés
  const [digitalData] = useState({
    stats: {
      documentsSignes: 25,
      visitesVirtuelles: 8,
      contractsGeneres: 12,
      clientsConnectes: 15
    },
    
    recentActivities: [
      {
        id: 1,
        type: 'signature',
        title: 'Avant-contrat Villa Almadies',
        client: 'Amadou Diallo',
        status: 'Signé',
        date: '2024-09-26',
        time: '14:30',
        platform: 'DocuSign'
      },
      {
        id: 2,
        type: 'visite',
        title: 'Visite virtuelle Terrain Thiès',
        client: 'Fatou Seck',
        status: 'Programmée',
        date: '2024-09-27',
        time: '10:00',
        platform: 'Zoom'
      },
      {
        id: 3,
        type: 'document',
        title: 'Upload certificat foncier',
        client: 'Moussa Kane',
        status: 'Traité',
        date: '2024-09-25',
        time: '16:45',
        platform: 'OCR Scanner'
      }
    ],
    
    services: [
      {
        id: 'signature',
        name: 'Signature Électronique',
        description: 'Signez vos contrats à distance en toute sécurité',
        icon: PenTool,
        color: 'blue',
        features: ['Juridiquement valide', 'Traçabilité complète', 'Multi-signataires'],
        usage: 25,
        status: 'Actif'
      },
      {
        id: 'visite',
        name: 'Visites Virtuelles',
        description: 'Présentez vos biens par vidéoconférence HD',
        icon: Video,
        color: 'green',
        features: ['Qualité 4K', 'Enregistrement', 'Partage d\'écran'],
        usage: 8,
        status: 'Actif'
      },
      {
        id: 'ocr',
        name: 'Scanner OCR',
        description: 'Numérisez et analysez vos documents automatiquement',
        icon: Camera,
        color: 'purple',
        features: ['Reconnaissance texte', 'Validation auto', 'Archivage cloud'],
        usage: 15,
        status: 'Actif'
      },
      {
        id: 'contrats',
        name: 'Génération Contrats',
        description: 'Créez des contrats personnalisés automatiquement',
        icon: FileText,
        color: 'orange',
        features: ['Templates légaux', 'Personnalisation', 'Export PDF'],
        usage: 12,
        status: 'Actif'
      }
    ]
  });

  const getStatusColor = (status) => {
    const colors = {
      'Signé': 'bg-green-100 text-green-800',
      'Programmée': 'bg-blue-100 text-blue-800',
      'Traité': 'bg-purple-100 text-purple-800',
      'En cours': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getServiceColor = (color) => {
    const colors = {
      'blue': 'from-blue-500 to-blue-600',
      'green': 'from-green-500 to-green-600',
      'purple': 'from-purple-500 to-purple-600',
      'orange': 'from-orange-500 to-orange-600'
    };
    return colors[color] || 'from-gray-500 to-gray-600';
  };

  const ActivityCard = ({ activity }) => (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h4 className="font-semibold">{activity.title}</h4>
              <Badge className={getStatusColor(activity.status)}>
                {activity.status}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-1">Client: {activity.client}</p>
            <p className="text-gray-500 text-xs">
              {activity.date} à {activity.time} • {activity.platform}
            </p>
          </div>
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ServiceCard = ({ service }) => {
    const IconComponent = service.icon;
    
    return (
      <Card className="hover:shadow-lg transition-all duration-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4 mb-4">
            <div className={`bg-gradient-to-r ${getServiceColor(service.color)} p-3 rounded-lg`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{service.name}</h3>
                <Badge className="bg-green-100 text-green-800">
                  {service.status}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-3">{service.description}</p>
              
              {/* Features */}
              <div className="flex flex-wrap gap-1 mb-4">
                {service.features.map((feature, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
              
              {/* Usage stats */}
              <div className="flex items-center justify-between text-sm mb-3">
                <span className="text-gray-500">Utilisations ce mois:</span>
                <span className="font-semibold">{service.usage}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button className="flex-1">
              <Zap className="w-4 h-4 mr-2" />
              Utiliser
            </Button>
            <Button variant="outline">
              <Activity className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques des services digitaux */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <PenTool className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{digitalData.stats.documentsSignes}</div>
            <div className="text-sm text-gray-600">Documents signés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Video className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{digitalData.stats.visitesVirtuelles}</div>
            <div className="text-sm text-gray-600">Visites virtuelles</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{digitalData.stats.contractsGeneres}</div>
            <div className="text-sm text-gray-600">Contrats générés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{digitalData.stats.clientsConnectes}</div>
            <div className="text-sm text-gray-600">Clients connectés</div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets des services digitaux */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="signature">Signature</TabsTrigger>
          <TabsTrigger value="visites">Visites</TabsTrigger>
          <TabsTrigger value="scanner">Scanner</TabsTrigger>
          <TabsTrigger value="contrats">Contrats</TabsTrigger>
        </TabsList>

        <TabsContent value="signature" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5" />
                Signature Électronique Sécurisée
              </CardTitle>
              <CardDescription>
                Signez vos documents à distance avec validité juridique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Nouveau Document</h4>
                      <p className="text-sm text-gray-600">Préparer signature</p>
                    </div>
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">Glissez votre document PDF</p>
                  </div>
                  <Button className="w-full">
                    <Upload className="w-4 h-4 mr-2" />
                    Choisir document
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Lock className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Sécurité</h4>
                      <p className="text-sm text-gray-600">Certificat SSL/TLS</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Chiffrement end-to-end</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Horodatage certifié</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span>Audit trail complet</span>
                    </div>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visites" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Visites Virtuelles HD
              </CardTitle>
              <CardDescription>
                Présentez vos biens par vidéoconférence haute qualité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4 text-center">
                  <Monitor className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Écran HD</h4>
                  <p className="text-sm text-gray-600">Qualité 4K disponible</p>
                </Card>
                
                <Card className="p-4 text-center">
                  <Smartphone className="w-12 h-12 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Multi-plateforme</h4>
                  <p className="text-sm text-gray-600">PC, mobile, tablette</p>
                </Card>
                
                <Card className="p-4 text-center">
                  <Cloud className="w-12 h-12 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Enregistrement</h4>
                  <p className="text-sm text-gray-600">Sauvegarde automatique</p>
                </Card>
              </div>

              <div className="flex justify-center gap-4">
                <Button>
                  <Video className="w-4 h-4 mr-2" />
                  Programmer visite
                </Button>
                <Button variant="outline">
                  <Calendar className="w-4 h-4 mr-2" />
                  Planning
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scanner" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Scanner OCR Intelligent
              </CardTitle>
              <CardDescription>
                Numérisez et analysez vos documents automatiquement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center mb-6">
                <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Scanner de Documents
                </h3>
                <p className="text-gray-600 mb-4">
                  PDF, JPG, PNG - Reconnaissance de texte automatique
                </p>
                <Button>
                  <Upload className="w-4 h-4 mr-2" />
                  Scanner document
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="bg-blue-100 p-3 rounded-lg w-fit mx-auto mb-2">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Reconnaissance OCR</h4>
                  <p className="text-sm text-gray-600">Extraction automatique du texte</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-green-100 p-3 rounded-lg w-fit mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold">Validation</h4>
                  <p className="text-sm text-gray-600">Vérification automatique</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-purple-100 p-3 rounded-lg w-fit mx-auto mb-2">
                    <Cloud className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold">Archivage</h4>
                  <p className="text-sm text-gray-600">Stockage sécurisé cloud</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contrats" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Génération de Contrats
              </CardTitle>
              <CardDescription>
                Créez des contrats personnalisés automatiquement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Templates Disponibles</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Avant-contrat de vente</span>
                      <Button size="sm" variant="outline">Utiliser</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Contrat de réservation</span>
                      <Button size="sm" variant="outline">Utiliser</Button>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">Compromis de vente</span>
                      <Button size="sm" variant="outline">Utiliser</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-3">Nouveau Contrat</h4>
                  <div className="space-y-3">
                    <Button className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Créer contrat personnalisé
                    </Button>
                    <Button className="w-full" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Mes contrats
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Services disponibles */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Tous les Services Digitaux</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {digitalData.services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      </div>

      {/* Activités récentes */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Activité Récente</h3>
        <div className="space-y-3">
          {digitalData.recentActivities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendeurServicesDigitaux;