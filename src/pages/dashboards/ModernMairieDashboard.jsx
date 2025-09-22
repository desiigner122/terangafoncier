import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  FileText, 
  Map, 
  Users, 
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Star,
  Euro,
  Download,
  Upload,
  Bell,
  Home,
  Truck,
  Trees,
  Shield
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';

const ModernMairieDashboard = () => {
  const [selectedTab, setSelectedTab] = useState('permits');

  // Stats du header pour Mairie
  const stats = [
    { 
      label: 'Permis en Cours', 
      value: '47', 
      icon: FileText, 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      label: 'Zone Territoire', 
      value: '12.5km²', 
      icon: Map, 
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Citoyens Actifs', 
      value: '8,542', 
      icon: Users, 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      label: 'Services Traités', 
      value: '156', 
      icon: CheckCircle, 
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50'
    }
  ];

  const DashboardHeader = () => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.bgColor} mr-4`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );

  const PermitsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Permis en cours */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Permis en Cours de Traitement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                type: 'Permis de Construire', 
                applicant: 'SARL Construction Moderne',
                project: 'Immeuble R+4 - Liberté 6',
                submitted: '15/01/2024',
                status: 'Instruction',
                daysLeft: 25
              },
              { 
                type: 'Certificat d\'Urbanisme', 
                applicant: 'Mamadou FALL',
                project: 'Villa - Parcelle 142/D',
                submitted: '18/01/2024',
                status: 'Commission',
                daysLeft: 18
              },
              { 
                type: 'Permis de Démolir', 
                applicant: 'Entreprise TERANGA',
                project: 'Ancien marché central',
                submitted: '20/01/2024',
                status: 'Enquête publique',
                daysLeft: 12
              }
            ].map((permit, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{permit.type}</h4>
                    <p className="text-sm text-gray-600">{permit.applicant}</p>
                    <p className="text-sm text-gray-500">{permit.project}</p>
                  </div>
                  <Badge variant="outline">{permit.status}</Badge>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Déposé: {permit.submitted}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-orange-500" />
                    {permit.daysLeft} jours restants
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Types de permis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-green-600" />
            Types de Permis Disponibles
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { type: 'Permis de Construire', count: 23, avgDays: 60, icon: Home },
              { type: 'Certificat d\'Urbanisme', count: 15, avgDays: 30, icon: MapPin },
              { type: 'Permis de Démolir', count: 4, avgDays: 45, icon: Truck },
              { type: 'Autorisation de Voirie', count: 8, avgDays: 15, icon: Map },
              { type: 'Déclaration Préalable', count: 12, avgDays: 20, icon: FileText }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <item.icon className="h-5 w-5 text-teal-600" />
                  <div>
                    <h5 className="font-medium">{item.type}</h5>
                    <p className="text-xs text-gray-600">{item.count} en cours</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{item.avgDays} jours</p>
                  <p className="text-xs text-gray-600">délai moyen</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Commission d'urbanisme */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            Prochaines Commissions d'Urbanisme
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                date: '25 Janvier 2024',
                time: '14h30',
                dossiers: 8,
                location: 'Salle du Conseil Municipal',
                status: 'Programmée'
              },
              {
                date: '8 Février 2024',
                time: '14h30',
                dossiers: 12,
                location: 'Salle du Conseil Municipal',
                status: 'En préparation'
              }
            ].map((commission, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-semibold">{commission.date} à {commission.time}</h4>
                  <Badge variant="outline">{commission.status}</Badge>
                </div>
                <div className="text-sm text-gray-600">
                  <p>{commission.dossiers} dossiers à examiner</p>
                  <p>{commission.location}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const TerritoryTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Zones du territoire */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Map className="h-5 w-5 text-green-600" />
            Zones Territoriales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { 
                zone: 'Zone Résidentielle Nord',
                surface: '3.2 km²',
                population: 2400,
                density: '750 hab/km²',
                status: 'Dense',
                color: 'bg-red-50 border-red-200'
              },
              { 
                zone: 'Zone Commerciale Centre',
                surface: '1.8 km²',
                population: 850,
                density: '472 hab/km²',
                status: 'Modéré',
                color: 'bg-yellow-50 border-yellow-200'
              },
              { 
                zone: 'Zone Industrielle Sud',
                surface: '4.1 km²',
                population: 320,
                density: '78 hab/km²',
                status: 'Faible',
                color: 'bg-green-50 border-green-200'
              },
              { 
                zone: 'Zone Agricole Est',
                surface: '3.4 km²',
                population: 180,
                density: '53 hab/km²',
                status: 'Très faible',
                color: 'bg-blue-50 border-blue-200'
              }
            ].map((zone, index) => (
              <div key={index} className={`p-4 border rounded-lg ${zone.color}`}>
                <h4 className="font-semibold mb-2">{zone.zone}</h4>
                <div className="space-y-1 text-sm">
                  <p>Surface: {zone.surface}</p>
                  <p>Population: {zone.population} habitants</p>
                  <p>Densité: {zone.density}</p>
                </div>
                <div className="mt-2">
                  <Badge variant="outline">{zone.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Équipements publics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5 text-blue-600" />
            Équipements Publics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { facility: 'Écoles Primaires', count: 8, capacity: 1200, icon: Building },
              { facility: 'Centres de Santé', count: 3, capacity: 450, icon: Shield },
              { facility: 'Espaces Verts', count: 12, capacity: null, icon: Trees },
              { facility: 'Terrains de Sport', count: 5, capacity: null, icon: Star },
              { facility: 'Marchés', count: 2, capacity: 300, icon: Home }
            ].map((facility, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <facility.icon className="h-5 w-5 text-teal-600" />
                  <div>
                    <h5 className="font-medium text-sm">{facility.facility}</h5>
                    {facility.capacity && (
                      <p className="text-xs text-gray-600">Capacité: {facility.capacity}</p>
                    )}
                  </div>
                </div>
                <Badge variant="secondary">{facility.count}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projets d'aménagement */}
      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Projets d'Aménagement en Cours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                project: 'Extension Zone Résidentielle',
                budget: '2.5 M FCFA',
                progress: 65,
                deadline: 'Mars 2024',
                status: 'En cours'
              },
              {
                project: 'Rénovation Marché Central',
                budget: '800k FCFA',
                progress: 30,
                deadline: 'Mai 2024',
                status: 'Planification'
              },
              {
                project: 'Nouveau Parc Municipal',
                budget: '1.2 M FCFA',
                progress: 85,
                deadline: 'Février 2024',
                status: 'Finalisation'
              },
              {
                project: 'Voie de Contournement',
                budget: '4.8 M FCFA',
                progress: 15,
                deadline: 'Décembre 2024',
                status: 'Études'
              }
            ].map((project, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{project.project}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Budget:</span>
                    <span className="font-medium">{project.budget}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Échéance:</span>
                    <span>{project.deadline}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Progression:</span>
                      <span>{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-2" />
                  </div>
                  <Badge variant="outline" className="mt-2">{project.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const CitizensTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Demandes citoyennes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-600" />
            Demandes Citoyennes Récentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              {
                citizen: 'Aminata DIOP',
                request: 'Demande d\'éclairage public',
                location: 'Rue 15 - Quartier Nord',
                date: '20/01/2024',
                priority: 'Haute',
                status: 'En cours'
              },
              {
                citizen: 'Ibrahim NDIAYE', 
                request: 'Réparation voirie',
                location: 'Avenue Cheikh Anta Diop',
                date: '19/01/2024',
                priority: 'Moyenne',
                status: 'Planifiée'
              },
              {
                citizen: 'Fatou SALL',
                request: 'Collecte des ordures',
                location: 'Cité des Enseignants',
                date: '18/01/2024',
                priority: 'Normale',
                status: 'Traitée'
              }
            ].map((request, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-900">{request.citizen}</h4>
                    <p className="text-sm text-gray-600">{request.request}</p>
                    <p className="text-xs text-gray-500">{request.location}</p>
                  </div>
                  <div className="text-right">
                    <Badge 
                      variant={request.priority === 'Haute' ? 'destructive' : 
                              request.priority === 'Moyenne' ? 'secondary' : 'outline'}
                      className="mb-1"
                    >
                      {request.priority}
                    </Badge>
                    <p className="text-xs">{request.date}</p>
                  </div>
                </div>
                <Badge variant="outline">{request.status}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Services aux citoyens */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Services aux Citoyens
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { service: 'État Civil', requests: 45, avgTime: '2 jours', satisfaction: 92 },
              { service: 'Permis de Conduire', requests: 23, avgTime: '7 jours', satisfaction: 88 },
              { service: 'Certificats Divers', requests: 67, avgTime: '1 jour', satisfaction: 95 },
              { service: 'Légalisation', requests: 34, avgTime: '1 jour', satisfaction: 91 },
              { service: 'Carte d\'Identité', requests: 56, avgTime: '10 jours', satisfaction: 85 }
            ].map((service, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium">{service.service}</h5>
                  <Badge variant="secondary">{service.requests}</Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Délai moyen:</p>
                    <p className="font-medium">{service.avgTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Satisfaction:</p>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">{service.satisfaction}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Canaux de communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-blue-600" />
            Canaux de Communication
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Phone className="h-5 w-5 text-green-600" />
                <h5 className="font-medium">Accueil Téléphonique</h5>
              </div>
              <div className="text-sm text-gray-600">
                <p>156 appels ce mois</p>
                <p>Temps d'attente moyen: 2min 30s</p>
              </div>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="h-5 w-5 text-blue-600" />
                <h5 className="font-medium">Email</h5>
              </div>
              <div className="text-sm text-gray-600">
                <p>89 emails reçus</p>
                <p>Temps de réponse: 4h moyenne</p>
              </div>
            </div>

            <div className="p-3 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Building className="h-5 w-5 text-purple-600" />
                <h5 className="font-medium">Accueil Physique</h5>
              </div>
              <div className="text-sm text-gray-600">
                <p>234 visiteurs ce mois</p>
                <p>Horaires: 8h-16h (Lun-Ven)</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enquêtes de satisfaction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Satisfaction Citoyenne
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">89%</div>
              <p className="text-sm text-gray-600">Satisfaction générale</p>
              <Progress value={89} className="mt-2" />
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">Rapidité du service</span>
                <div className="flex items-center gap-2">
                  <Progress value={85} className="w-20" />
                  <span className="text-sm font-medium">85%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Qualité de l'accueil</span>
                <div className="flex items-center gap-2">
                  <Progress value={92} className="w-20" />
                  <span className="text-sm font-medium">92%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Information claire</span>
                <div className="flex items-center gap-2">
                  <Progress value={87} className="w-20" />
                  <span className="text-sm font-medium">87%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const SettingsTab = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Configuration générale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-gray-600" />
            Configuration Générale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Nom de la commune</label>
              <input 
                type="text" 
                defaultValue="Commune de Dakar-Plateau"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Code postal</label>
              <input 
                type="text" 
                defaultValue="12500"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Population officielle</label>
              <input 
                type="number" 
                defaultValue="8542"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Surface territoriale (km²)</label>
              <input 
                type="number" 
                step="0.1"
                defaultValue="12.5"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gestion des délais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-600" />
            Délais Réglementaires
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Permis de Construire</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="text-gray-600">Instruction:</label>
                  <input type="number" defaultValue="60" className="w-full p-1 border rounded" />
                </div>
                <div>
                  <label className="text-gray-600">Commission:</label>
                  <input type="number" defaultValue="15" className="w-full p-1 border rounded" />
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Certificat d'Urbanisme</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="text-gray-600">Simple:</label>
                  <input type="number" defaultValue="30" className="w-full p-1 border rounded" />
                </div>
                <div>
                  <label className="text-gray-600">Opérationnel:</label>
                  <input type="number" defaultValue="60" className="w-full p-1 border rounded" />
                </div>
              </div>
            </div>
            
            <div className="p-3 border rounded-lg">
              <h4 className="font-medium mb-2">Services aux Citoyens</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <label className="text-gray-600">État Civil:</label>
                  <input type="number" defaultValue="2" className="w-full p-1 border rounded" />
                </div>
                <div>
                  <label className="text-gray-600">Certificats:</label>
                  <input type="number" defaultValue="1" className="w-full p-1 border rounded" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications et alertes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-red-600" />
            Notifications et Alertes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Dépassement délai permis</h4>
                <p className="text-sm text-gray-600">Alerte à J-5</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Commission d'urbanisme</h4>
                <p className="text-sm text-gray-600">Rappel J-2</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Demande citoyenne urgente</h4>
                <p className="text-sm text-gray-600">Notification immédiate</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Rapport mensuel</h4>
                <p className="text-sm text-gray-600">Auto-génération</p>
              </div>
              <input type="checkbox" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact et horaires */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Informations de Contact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Adresse</label>
              <textarea 
                defaultValue="Place de l'Indépendance&#10;BP 12500 Dakar-Plateau&#10;Sénégal"
                className="w-full p-2 border rounded-lg"
                rows="3"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Téléphone</label>
                <input 
                  type="tel" 
                  defaultValue="+221 33 823 45 67"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email" 
                  defaultValue="contact@mairie-plateau.sn"
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Horaires d'ouverture</label>
              <input 
                type="text" 
                defaultValue="Lundi-Vendredi: 8h00-16h00"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Site web</label>
              <input 
                type="url" 
                defaultValue="https://mairie-plateau.sn"
                className="w-full p-2 border rounded-lg"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-teal-50 to-cyan-50 p-6"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header avec titre et stats */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Mairie</h1>
          <p className="text-gray-600 mb-6">Gestion municipale, services aux citoyens et territoire</p>
          
          <DashboardHeader />
        </div>

        {/* Tabs navigation */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger 
              value="permits" 
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Permis
            </TabsTrigger>
            <TabsTrigger 
              value="territory" 
              className="flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              Territoire
            </TabsTrigger>
            <TabsTrigger 
              value="citizens" 
              className="flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Citoyens
            </TabsTrigger>
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2"
            >
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="permits">
            <PermitsTab />
          </TabsContent>

          <TabsContent value="territory">
            <TerritoryTab />
          </TabsContent>

          <TabsContent value="citizens">
            <CitizensTab />
          </TabsContent>

          <TabsContent value="settings">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default ModernMairieDashboard;
