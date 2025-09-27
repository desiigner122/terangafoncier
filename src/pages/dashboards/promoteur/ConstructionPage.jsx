import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Camera, 
  Eye, 
  Video,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Satellite,
  Wifi,
  Battery,
  Settings,
  Phone,
  MessageSquare,
  Download,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ConstructionPage = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [liveFeeds, setLiveFeeds] = useState([]);

  // Données mockées des projets en construction avec suivi à distance
  const constructionProjects = [
    {
      id: 1,
      clientName: 'Aminata FALL',
      projectName: 'Villa R+1 Liberté 6',
      location: 'Liberté 6, Dakar',
      startDate: '2024-01-15',
      expectedEnd: '2025-06-30',
      progress: 45,
      phase: 'Gros œuvre',
      budget: 45000000,
      spent: 20250000,
      cameras: 4,
      lastUpdate: '2024-01-20 14:30',
      status: 'En cours',
      alerts: 1,
      satisfaction: 4.8,
      contractor: 'TERANGA Construction SARL',
      iot: {
        humidity: 65,
        temperature: 28,
        noiseLevel: 75,
        airQuality: 'Bon'
      }
    },
    {
      id: 2,
      clientName: 'Moussa DIENG',
      projectName: 'Maison Familiale Grand Yoff',
      location: 'Grand Yoff, Dakar',
      startDate: '2024-02-01',
      expectedEnd: '2025-04-15',
      progress: 60,
      phase: 'Finitions',
      budget: 28000000,
      spent: 16800000,
      cameras: 3,
      lastUpdate: '2024-01-20 16:45',
      status: 'En cours',
      alerts: 0,
      satisfaction: 4.9,
      contractor: 'TERANGA Construction SARL',
      iot: {
        humidity: 58,
        temperature: 26,
        noiseLevel: 68,
        airQuality: 'Excellent'
      }
    },
    {
      id: 3,
      clientName: 'Fatou SARR',
      projectName: 'Duplex Moderne Pikine',
      location: 'Pikine, Dakar',
      startDate: '2024-03-10',
      expectedEnd: '2025-08-20',
      progress: 25,
      phase: 'Fondations',
      budget: 35000000,
      spent: 8750000,
      cameras: 2,
      lastUpdate: '2024-01-20 11:20',
      status: 'En cours',
      alerts: 2,
      satisfaction: 4.6,
      contractor: 'TERANGA Construction SARL',
      iot: {
        humidity: 72,
        temperature: 31,
        noiseLevel: 85,
        airQuality: 'Moyen'
      }
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div>
        <h2 className="text-3xl font-bold flex items-center mb-2">
          <Building className="w-6 h-6 mr-2 text-blue-600" />
          Suivi Construction à Distance
        </h2>
        <p className="text-gray-600">Surveillance IoT et caméras en temps réel de vos chantiers</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Projets Actifs</p>
                <p className="text-2xl font-bold text-blue-600">{constructionProjects.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Caméras Actives</p>
                <p className="text-2xl font-bold text-green-600">
                  {constructionProjects.reduce((acc, p) => acc + p.cameras, 0)}
                </p>
              </div>
              <Camera className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertes Actives</p>
                <p className="text-2xl font-bold text-orange-600">
                  {constructionProjects.reduce((acc, p) => acc + p.alerts, 0)}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Satisfaction Moyenne</p>
                <p className="text-2xl font-bold text-purple-600">4.8/5</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projets en construction */}
      <div className="grid gap-6">
        {constructionProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    {project.projectName}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location} • Client: {project.clientName}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={
                    project.status === 'En cours' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'Terminé' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }>
                    {project.status}
                  </Badge>
                  {project.alerts > 0 && (
                    <Badge className="bg-red-100 text-red-800">
                      {project.alerts} alerte{project.alerts > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="cameras">Caméras Live</TabsTrigger>
                  <TabsTrigger value="iot">Capteurs IoT</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Avancement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Phase: {project.phase}</span>
                          <span>{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-2" />
                        <p className="text-xs text-gray-600">
                          Dernière maj: {project.lastUpdate}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Budget</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Dépensé</span>
                          <span>{((project.spent / project.budget) * 100).toFixed(1)}%</span>
                        </div>
                        <Progress value={(project.spent / project.budget) * 100} className="h-2" />
                        <p className="text-xs text-gray-600">
                          {project.spent.toLocaleString()} / {project.budget.toLocaleString()} FCFA
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Délais</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Fin prévue: {project.expectedEnd}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>Reste: 5 mois</span>
                        </div>
                        <Badge className="bg-green-100 text-green-800 text-xs">
                          Dans les temps
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="cameras" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: project.cameras }).map((_, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold">Caméra {idx + 1}</h5>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs text-green-600">En ligne</span>
                          </div>
                        </div>
                        <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center mb-2">
                          <Camera className="w-8 h-8 text-gray-400" />
                          <span className="ml-2 text-sm text-gray-500">Feed Live</span>
                        </div>
                        <div className="flex justify-between">
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            Voir
                          </Button>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-1" />
                            Capturer
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="iot" className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{project.iot.temperature}°C</div>
                      <div className="text-sm text-gray-600">Température</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{project.iot.humidity}%</div>
                      <div className="text-sm text-gray-600">Humidité</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">{project.iot.noiseLevel} dB</div>
                      <div className="text-sm text-gray-600">Bruit</div>
                    </div>
                    <div className="text-center p-4 border rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{project.iot.airQuality}</div>
                      <div className="text-sm text-gray-600">Air</div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h5 className="font-semibold flex items-center mb-2">
                      <Satellite className="w-4 h-4 mr-2" />
                      Surveillance IA
                    </h5>
                    <p className="text-sm text-blue-700">
                      Détection automatique d'anomalies, respect des horaires de travail, 
                      et contrôle qualité par vision artificielle.
                    </p>
                  </div>
                </TabsContent>
                
                <TabsContent value="communication" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h5 className="font-semibold">Contact Client</h5>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Phone className="w-4 h-4 mr-2" />
                          Appeler {project.clientName}
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Envoyer un message
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Video className="w-4 h-4 mr-2" />
                          Visioconférence
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h5 className="font-semibold">Équipe Chantier</h5>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="w-4 h-4 mr-2" />
                          Chef de chantier
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="w-4 h-4 mr-2" />
                          Responsable sécurité
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Contrôleur qualité
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold flex items-center mb-2">
                      <Zap className="w-4 h-4 mr-2" />
                      Notifications Automatiques
                    </h5>
                    <p className="text-sm text-green-700">
                      Le client reçoit des mises à jour automatiques avec photos et vidéos 
                      de l'avancement chaque semaine.
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ConstructionPage;