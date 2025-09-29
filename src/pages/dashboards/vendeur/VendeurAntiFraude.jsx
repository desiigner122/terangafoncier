import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield,
  Scan,
  FileCheck,
  AlertTriangle,
  CheckCircle,
  Upload,
  Eye,
  Download,
  Clock,
  MapPin,
  Database,
  Lock,
  Zap,
  Camera,
  FileText,
  Search,
  Filter,
  Award,
  Activity,
  Brain
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const VendeurAntiFraude = () => {
  const [activeTab, setActiveTab] = useState('scanner');
  
  // Données de vérification anti-fraude
  const [verificationData] = useState({
    stats: {
      totalScanned: 15,
      verified: 12,
      suspicious: 2,
      pending: 1,
      securityScore: 98
    },
    
    recentScans: [
      {
        id: 1,
        propertyRef: 'ALM-001',
        title: 'Titre Foncier - Villa Almadies',
        scanDate: '2024-09-26',
        status: 'Vérifié',
        score: 98,
        riskLevel: 'Aucun',
        aiAnalysis: 'Document authentique, signatures valides',
        blockchain: true,
        gpsVerified: true
      },
      {
        id: 2,
        propertyRef: 'THI-007',
        title: 'Acte de Vente - Terrain Thiès',
        scanDate: '2024-09-25',
        status: 'Suspect',
        score: 45,
        riskLevel: 'Élevé',
        aiAnalysis: 'Incohérences détectées dans les dates',
        blockchain: false,
        gpsVerified: false,
        alerts: ['Signature suspecte', 'Référence cadastrale introuvable']
      },
      {
        id: 3,
        propertyRef: 'SAL-003',
        title: 'Permis de Construire - Saly',
        scanDate: '2024-09-24',
        status: 'En cours',
        score: null,
        riskLevel: 'En analyse',
        aiAnalysis: 'Analyse IA en cours...',
        blockchain: false,
        gpsVerified: true
      }
    ]
  });

  const getStatusColor = (status) => {
    const colors = {
      'Vérifié': 'bg-green-100 text-green-800',
      'Suspect': 'bg-red-100 text-red-800',
      'En cours': 'bg-yellow-100 text-yellow-800',
      'Rejeté': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRiskColor = (risk) => {
    const colors = {
      'Aucun': 'text-green-600',
      'Faible': 'text-yellow-600',
      'Élevé': 'text-red-600',
      'En analyse': 'text-blue-600'
    };
    return colors[risk] || 'text-gray-600';
  };

  const DocumentScanCard = ({ scan }) => (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">{scan.title}</h3>
              <Badge className={getStatusColor(scan.status)}>
                {scan.status}
              </Badge>
            </div>
            <p className="text-gray-600 text-sm mb-2">Réf: {scan.propertyRef}</p>
            <p className="text-gray-500 text-sm">Scanné le {scan.scanDate}</p>
          </div>
          
          <div className="text-right">
            {scan.score && (
              <div className={`text-3xl font-bold ${scan.score >= 80 ? 'text-green-600' : scan.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {scan.score}%
              </div>
            )}
            <div className={`text-sm font-medium ${getRiskColor(scan.riskLevel)}`}>
              Risque: {scan.riskLevel}
            </div>
          </div>
        </div>

        {/* Analyse IA */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-blue-800">Analyse IA</span>
          </div>
          <p className="text-blue-700 text-sm">{scan.aiAnalysis}</p>
        </div>

        {/* Alertes si suspect */}
        {scan.alerts && scan.alerts.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="font-medium text-red-800">Alertes détectées</span>
            </div>
            <ul className="text-red-700 text-sm space-y-1">
              {scan.alerts.map((alert, index) => (
                <li key={index}>• {alert}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Vérifications */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center gap-2">
            {scan.blockchain ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-sm">Blockchain</span>
          </div>
          <div className="flex items-center gap-2">
            {scan.gpsVerified ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Clock className="w-5 h-5 text-gray-400" />
            )}
            <span className="text-sm">GPS vérifié</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Voir détails
          </Button>
          <Button size="sm" variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Rapport
          </Button>
          {scan.status === 'Suspect' && (
            <Button size="sm" variant="outline" className="text-red-600">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Signaler
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header avec statistiques de sécurité */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Scan className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{verificationData.stats.totalScanned}</div>
            <div className="text-sm text-gray-600">Documents scannés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{verificationData.stats.verified}</div>
            <div className="text-sm text-gray-600">Vérifiés</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <AlertTriangle className="w-8 h-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{verificationData.stats.suspicious}</div>
            <div className="text-sm text-gray-600">Suspects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{verificationData.stats.pending}</div>
            <div className="text-sm text-gray-600">En cours</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{verificationData.stats.securityScore}%</div>
            <div className="text-sm text-gray-600">Score sécurité</div>
          </CardContent>
        </Card>
      </div>

      {/* Onglets de fonctionnalités */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="scanner">Scanner IA</TabsTrigger>
          <TabsTrigger value="verification">Vérifications</TabsTrigger>
          <TabsTrigger value="database">Base de données</TabsTrigger>
          <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        </TabsList>

        <TabsContent value="scanner" className="space-y-6">
          {/* Zone de scan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5" />
                Scanner de Documents IA
              </CardTitle>
              <CardDescription>
                Analysez vos documents avec notre IA anti-fraude
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-purple-400 transition-colors">
                <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Glissez-déposez vos documents
                </h3>
                <p className="text-gray-600 mb-4">
                  PDF, JPG, PNG jusqu'à 10MB - Scanner IA intégré
                </p>
                <Button>
                  <Camera className="w-4 h-4 mr-2" />
                  Choisir fichiers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Résultats récents */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Analyses récentes</h3>
            <div className="space-y-4">
              {verificationData.recentScans.map((scan) => (
                <DocumentScanCard key={scan.id} scan={scan} />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Vérifications Multi-Niveaux
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <Database className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Vérification Cadastrale</h4>
                      <p className="text-sm text-gray-600">Cross-check automatique</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Lancer vérification
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Award className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Authentification</h4>
                      <p className="text-sm text-gray-600">Signatures et tampons</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Authentifier
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Brain className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Analyse IA</h4>
                      <p className="text-sm text-gray-600">Détection d'anomalies</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Analyser IA
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">Géolocalisation</h4>
                      <p className="text-sm text-gray-600">Validation GPS</p>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    Vérifier GPS
                  </Button>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Base de Données Anti-Fraude
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Input placeholder="Rechercher référence cadastrale..." className="flex-1" />
                  <Button>
                    <Search className="w-4 h-4 mr-2" />
                    Rechercher
                  </Button>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <Database className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">
                    Base de données connectée aux services officiels
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Dernière synchronisation: aujourd'hui 14:30
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="blockchain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Certification Blockchain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-8 rounded-lg">
                  <Lock className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">
                    Certification Blockchain Active
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Vos documents sont sécurisés par la blockchain
                  </p>
                  <div className="flex justify-center gap-4">
                    <Button>
                      <Zap className="w-4 h-4 mr-2" />
                      Certifier document
                    </Button>
                    <Button variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      Vérifier certificat
                    </Button>
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

export default VendeurAntiFraude;