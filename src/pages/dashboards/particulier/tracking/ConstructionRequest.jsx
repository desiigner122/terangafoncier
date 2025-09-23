import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  HardHat,
  Calendar,
  DollarSign,
  MapPin,
  FileText,
  User,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  Building,
  Home,
  TrendingUp,
  Plus
} from 'lucide-react';
import ModernDashboardLayout from '@/components/dashboard/ModernDashboardLayout';
import ContextualAIAssistant from '@/components/dashboard/ContextualAIAssistant';

const ConstructionRequest = () => {
  const [constructionRequests, setConstructionRequests] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState('requests');

  useEffect(() => {
    // Données des demandes de construction
    setConstructionRequests([
      {
        id: 1,
        requestId: 'PC2024-001',
        title: 'Villa moderne R+2 - Almadies',
        location: 'Almadies, Dakar',
        type: 'Permis de construire',
        status: 'En cours d\'instruction',
        submissionDate: '2024-01-15',
        expectedResponse: '2024-03-15',
        progress: 45,
        surface: '450 m²',
        floors: 'R+2',
        budget: '85,000,000 FCFA',
        architect: 'Cabinet Architecture & Design',
        description: 'Construction d\'une villa moderne avec piscine et jardin',
        documents: [
          'Plan architectural',
          'Plan de masse',
          'Étude géotechnique',
          'Notice descriptive'
        ],
        missingDocuments: [
          'Attestation de raccordement eau',
          'Étude d\'impact environnemental'
        ],
        fees: '250,000 FCFA',
        feesPaid: true,
        assignedOfficer: 'Mme Diop - Service Urbanisme'
      },
      {
        id: 2,
        requestId: 'PC2024-002',
        title: 'Immeuble commercial - Plateau',
        location: 'Plateau, Dakar',
        type: 'Permis de construire',
        status: 'Documents manquants',
        submissionDate: '2023-12-10',
        expectedResponse: '2024-02-28',
        progress: 25,
        surface: '800 m²',
        floors: 'R+4',
        budget: '150,000,000 FCFA',
        architect: 'SCA Architectes Associés',
        description: 'Construction d\'un immeuble mixte commercial et bureaux',
        documents: [
          'Plan architectural',
          'Étude de sol',
          'Notice accessibilité'
        ],
        missingDocuments: [
          'Plan VRD',
          'Étude sécurité incendie',
          'Parking obligatoire'
        ],
        fees: '450,000 FCFA',
        feesPaid: false,
        assignedOfficer: 'M. Ndiaye - Service Contrôle'
      },
      {
        id: 3,
        requestId: 'PC2023-089',
        title: 'Extension villa - Keur Massar',
        location: 'Keur Massar Extension',
        type: 'Déclaration préalable',
        status: 'Approuvé',
        submissionDate: '2023-10-20',
        approvalDate: '2023-12-05',
        progress: 100,
        surface: '120 m²',
        floors: 'Extension R+1',
        budget: '25,000,000 FCFA',
        architect: 'M. Ba - Architecte DPLG',
        description: 'Extension d\'une villa existante avec chambres supplémentaires',
        documents: [
          'Plan modification',
          'Photos état existant',
          'Accord voisinage'
        ],
        permitNumber: 'PC2023-089-APPROVED',
        validityPeriod: '2 ans',
        fees: '85,000 FCFA',
        feesPaid: true
      }
    ]);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      'En cours d\'instruction': 'bg-blue-100 text-blue-800',
      'Documents manquants': 'bg-orange-100 text-orange-800',
      'Approuvé': 'bg-green-100 text-green-800',
      'Rejeté': 'bg-red-100 text-red-800',
      'En révision': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const ConstructionRequestCard = ({ request }) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{request.title}</CardTitle>
            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{request.location}</span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <Building className="w-4 h-4" />
                <span>{request.surface} - {request.floors}</span>
              </div>
            </div>
          </div>
          <Badge className={`${getStatusColor(request.status)} text-white`}>
            {request.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{request.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="font-medium">{request.budget}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Architecte</p>
              <p className="font-medium">{request.architect}</p>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">{request.description}</p>
        </div>

        {request.progress < 100 && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm text-gray-600">{request.progress}%</span>
            </div>
            <Progress value={request.progress} className="h-2" />
          </div>
        )}

        {request.missingDocuments && request.missingDocuments.length > 0 && (
          <div className="mb-4 p-3 bg-orange-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-orange-800 mb-1">Documents manquants :</p>
                <ul className="text-xs text-orange-700 list-disc list-inside">
                  {request.missingDocuments.map((doc, index) => (
                    <li key={index}>{doc}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {request.status === 'Approuvé' && request.permitNumber && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-800">
                  Permis accordé : {request.permitNumber}
                </p>
                <p className="text-xs text-green-700">
                  Validité : {request.validityPeriod}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Déposé le {new Date(request.submissionDate).toLocaleDateString('fr-FR')}</span>
            </div>
            {request.expectedResponse && (
              <div className="flex items-center gap-2 mt-1">
                <Clock className="w-4 h-4" />
                <span>Réponse prévue : {new Date(request.expectedResponse).toLocaleDateString('fr-FR')}</span>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-1" />
              Détails
            </Button>
            {request.status === 'Documents manquants' && (
              <Button size="sm">
                Compléter
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ModernDashboardLayout
      title="Demandes de Construction"
      subtitle="Gestion de vos permis de construire et déclarations"
      userRole="Particulier"
    >
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total demandes</p>
                  <p className="text-2xl font-bold">{constructionRequests.length}</p>
                </div>
                <HardHat className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En cours</p>
                  <p className="text-2xl font-bold">
                    {constructionRequests.filter(r => r.status === 'En cours d\'instruction').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approuvés</p>
                  <p className="text-2xl font-bold">
                    {constructionRequests.filter(r => r.status === 'Approuvé').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Docs manquants</p>
                  <p className="text-2xl font-bold">
                    {constructionRequests.filter(r => r.status === 'Documents manquants').length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bouton d'ajout */}
        {!showAddForm && (
          <div className="flex justify-end">
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle demande de construction
            </Button>
          </div>
        )}

        {/* Liste des demandes */}
        <div className="space-y-4">
          {constructionRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <HardHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">
                  Aucune demande de construction
                </h3>
                <p className="text-gray-500 mb-4">
                  Déposez votre première demande de permis de construire.
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  Nouvelle demande
                </Button>
              </CardContent>
            </Card>
          ) : (
            constructionRequests.map(request => (
              <ConstructionRequestCard key={request.id} request={request} />
            ))
          )}
        </div>

        {/* Formulaire d'ajout (à implémenter si nécessaire) */}
        {showAddForm && (
          <Card>
            <CardHeader>
              <CardTitle>Nouvelle demande de construction</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <HardHat className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Formulaire de demande en cours de développement</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowAddForm(false)}
                >
                  Fermer
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Assistant IA */}
        <ContextualAIAssistant />
      </div>
    </ModernDashboardLayout>
  );
};

export default ConstructionRequest;