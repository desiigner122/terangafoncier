import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Hammer, 
  Clock, 
  Users, 
  Truck, 
  AlertTriangle,
  CheckCircle,
  Calendar,
  MapPin,
  Building,
  Settings,
  Camera,
  FileText,
  Phone,
  Eye,
  Edit,
  Plus,
  Filter,
  Download
} from 'lucide-react';

const PromoteurChantiers = () => {
  const [selectedSite, setSelectedSite] = useState(null);
  const [activeTab, setActiveTab] = useState('active');

  // Chantiers actifs
  const activeSites = [
    {
      id: 1,
      name: 'Résidence Teranga',
      location: 'Almadies, Dakar',
      type: 'Résidentiel',
      status: 'En cours',
      progress: 75,
      startDate: '2024-01-15',
      plannedEnd: '2025-06-30',
      currentPhase: 'Finitions intérieures',
      budget: 2800000000,
      spent: 2100000000,
      workers: 45,
      contractor: 'BTP Sénégal SARL',
      supervisor: 'Ing. Mamadou Fall',
      supervisorPhone: '+221 77 123 45 67',
      lastInspection: '2024-12-10',
      nextMilestone: 'Livraison étage 2 - 20 Déc',
      issues: 2,
      safetyScore: 92,
      images: 24,
      units: 24,
      unitsCompleted: 18
    },
    {
      id: 2,
      name: 'Complexe Commercial VDN',
      location: 'VDN, Dakar',
      type: 'Commercial',
      status: 'En cours',
      progress: 45,
      startDate: '2024-03-10',
      plannedEnd: '2025-12-15',
      currentPhase: 'Gros œuvre niveau 2',
      budget: 5200000000,
      spent: 2340000000,
      workers: 78,
      contractor: 'Teranga Construction',
      supervisor: 'Ing. Aïssatou Diop',
      supervisorPhone: '+221 77 234 56 78',
      lastInspection: '2024-12-08',
      nextMilestone: 'Coulage dalle niveau 3 - 28 Déc',
      issues: 1,
      safetyScore: 88,
      images: 42,
      units: 12,
      unitsCompleted: 5
    },
    {
      id: 3,
      name: 'Entrepôt Logistics',
      location: 'Rufisque',
      type: 'Industriel',
      status: 'Retard',
      progress: 35,
      startDate: '2024-05-20',
      plannedEnd: '2025-08-30',
      currentPhase: 'Charpente métallique',
      budget: 1800000000,
      spent: 630000000,
      workers: 32,
      contractor: 'Metal Pro Sénégal',
      supervisor: 'Ing. Ousmane Sarr',
      supervisorPhone: '+221 77 345 67 89',
      lastInspection: '2024-12-05',
      nextMilestone: 'Montage charpente - 15 Jan',
      issues: 4,
      safetyScore: 85,
      images: 18,
      units: 1,
      unitsCompleted: 0
    }
  ];

  // Chantiers terminés
  const completedSites = [
    {
      id: 4,
      name: 'Villa Duplex Mermoz',
      location: 'Mermoz, Dakar',
      type: 'Résidentiel',
      status: 'Terminé',
      progress: 100,
      startDate: '2023-06-15',
      completedDate: '2024-11-30',
      budget: 180000000,
      finalCost: 172000000,
      contractor: 'Fall Construction',
      quality: 'Excellent',
      clientSatisfaction: 4.8
    }
  ];

  // Statistiques générales
  const siteStats = {
    totalActive: 8,
    totalWorkers: 234,
    totalBudget: 12400000000,
    averageProgress: 62,
    onTime: 6,
    delayed: 2,
    safetyIncidents: 3,
    averageSafetyScore: 88
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'En cours': return 'bg-blue-100 text-blue-800';
      case 'Retard': return 'bg-red-100 text-red-800';
      case 'Terminé': return 'bg-green-100 text-green-800';
      case 'Suspendu': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'En cours': return <Clock className="w-4 h-4" />;
      case 'Retard': return <AlertTriangle className="w-4 h-4" />;
      case 'Terminé': return <CheckCircle className="w-4 h-4" />;
      case 'Suspendu': return <Settings className="w-4 h-4" />;
      default: return <Building className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'Résidentiel': return 'bg-blue-100 text-blue-800';
      case 'Commercial': return 'bg-green-100 text-green-800';
      case 'Industriel': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const calculateDelay = (plannedEnd) => {
    const today = new Date();
    const planned = new Date(plannedEnd);
    const diffTime = planned - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestion des Chantiers</h1>
            <p className="text-gray-600">Suivi en temps réel de vos chantiers de construction</p>
          <div className="flex items-center space-x-2">
            <Badge className="bg-blue-100 text-blue-800">
              <Hammer className="w-3 h-3 mr-1" />
              {siteStats.totalActive} chantiers actifs
            </Badge>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Chantiers Actifs</p>
                  <p className="text-2xl font-bold text-gray-900">{siteStats.totalActive}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4">
                <div className="flex items-center text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">{siteStats.onTime} dans les temps</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ouvriers</p>
                  <p className="text-2xl font-bold text-gray-900">{siteStats.totalWorkers}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-sm text-gray-600">Tous chantiers confondus</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Budget Total</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(siteStats.totalBudget)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Sécurité</p>
                  <p className="text-2xl font-bold text-gray-900">{siteStats.averageSafetyScore}%</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={siteStats.averageSafetyScore} className="h-2" />
                <span className="text-xs text-gray-500 mt-1">Score moyen sécurité</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="active" className="flex items-center gap-2">
              <Hammer className="w-4 h-4" />
              Chantiers Actifs ({activeSites.length})
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Terminés ({completedSites.length})
            </TabsTrigger>
          </TabsList>

          {/* Chantiers actifs */}
          <TabsContent value="active" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Chantiers en Cours</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Filter className="w-4 h-4 mr-2" />
                      Filtrer
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Rapport
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activeSites.map((site) => (
                    <motion.div
                      key={site.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border rounded-lg p-6 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-start space-x-4">
                          <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Hammer className="w-8 h-8 text-orange-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg text-gray-900 mb-1">
                              {site.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                {site.location}
                              </div>
                              <div className="flex items-center">
                                <Building className="w-4 h-4 mr-1" />
                                {site.contractor}
                              </div>
                              <div className="flex items-center">
                                <Users className="w-4 h-4 mr-1" />
                                {site.workers} ouvriers
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              Phase actuelle: <strong>{site.currentPhase}</strong>
                            </p>
                            
                            {/* Badges */}
                            <div className="flex items-center space-x-2">
                              <Badge className={getTypeColor(site.type)}>
                                {site.type}
                              </Badge>
                              <Badge className={getStatusColor(site.status)}>
                                {getStatusIcon(site.status)}
                                <span className="ml-1">{site.status}</span>
                              </Badge>
                              {site.issues > 0 && (
                                <Badge className="bg-red-100 text-red-800">
                                  {site.issues} problèmes
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {site.progress}%
                          </div>
                          <div className="text-sm text-gray-500">Avancement</div>
                          <div className="text-sm text-gray-500 mt-2">
                            Fin prévue: {formatDate(site.plannedEnd)}
                          </div>
                          {calculateDelay(site.plannedEnd) < 0 && (
                            <div className="text-sm text-red-600 font-medium">
                              Retard: {Math.abs(calculateDelay(site.plannedEnd))} jours
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Progression */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-gray-600">Progression du chantier</span>
                          <span className="font-medium">{site.progress}%</span>
                        </div>
                        <Progress value={site.progress} className="h-3 mb-2" />
                        <p className="text-xs text-blue-600">
                          Prochaine étape: {site.nextMilestone}
                        </p>
                      </div>

                      {/* Métriques */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Budget</p>
                          <p className="font-semibold">{formatCurrency(site.budget)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Dépensé</p>
                          <p className="font-semibold text-orange-600">
                            {formatCurrency(site.spent)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Unités</p>
                          <p className="font-semibold">
                            {site.unitsCompleted}/{site.units}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Sécurité</p>
                          <p className="font-semibold text-green-600">{site.safetyScore}%</p>
                        </div>
                      </div>

                      {/* Équipe */}
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              Superviseur: {site.supervisor}
                            </p>
                            <p className="text-sm text-gray-600">
                              Dernière inspection: {formatDate(site.lastInspection)}
                            </p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Phone className="w-4 h-4 mr-2" />
                            Appeler
                          </Button>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-sm text-gray-600">
                          <span>{site.images} photos</span>
                          <span>•</span>
                          <span>Démarré le {formatDate(site.startDate)}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Camera className="w-4 h-4 mr-2" />
                            Photos
                          </Button>
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            Rapports
                          </Button>
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                            <Eye className="w-4 h-4 mr-2" />
                            Détails
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Chantiers terminés */}
          <TabsContent value="completed" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Chantiers Terminés</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedSites.map((site) => (
                    <div key={site.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">{site.name}</h3>
                          <p className="text-sm text-gray-600">{site.location}</p>
                          <div className="flex items-center space-x-4 mt-2">
                            <Badge className={getTypeColor(site.type)}>
                              {site.type}
                            </Badge>
                            <Badge className="bg-green-100 text-green-800">
                              Terminé
                            </Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(site.budget - site.finalCost)} économisé
                          </p>
                          <p className="text-sm text-gray-500">
                            Terminé le {formatDate(site.completedDate)}
                          </p>
                          <div className="flex items-center mt-1">
                            <span className="text-sm text-gray-600 mr-2">Satisfaction:</span>
                            <span className="font-semibold text-blue-600">{site.clientSatisfaction}/5</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Actions rapides */}
        <Card>
          <CardHeader>
            <CardTitle>Actions Rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-16 flex flex-col">
                <Plus className="w-5 h-5 mb-1" />
                <span className="text-sm">Nouveau Chantier</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <Camera className="w-5 h-5 mb-1" />
                <span className="text-sm">Galerie Photos</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <AlertTriangle className="w-5 h-5 mb-1" />
                <span className="text-sm">Incidents Sécurité</span>
              </Button>
              <Button variant="outline" className="h-16 flex flex-col">
                <FileText className="w-5 h-5 mb-1" />
                <span className="text-sm">Rapport Mensuel</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PromoteurChantiers;