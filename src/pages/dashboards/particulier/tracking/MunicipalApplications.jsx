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
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  Phone,
  Plus,
  FileText,
  User,
  Eye,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  TrendingUp,
  Landmark,
  UserCheck
} from 'lucide-react';
import ModernDashboardLayout from '@/components/dashboard/ModernDashboardLayout';
import ContextualAIAssistant from '@/components/dashboard/ContextualAIAssistant';
import { useNotifications } from '@/contexts/NotificationContext';

const MunicipalApplications = () => {
  const { addNotification } = useNotifications();
  const [applications, setApplications] = useState([]);
  const [permits, setPermits] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedTab, setSelectedTab] = useState('applications');

  useEffect(() => {
    // Demandes communales
    setApplications([
      {
        id: 1,
        applicationId: 'DEM001',
        type: 'Permis de construire',
        title: 'Construction villa - Keur Massar',
        location: 'Keur Massar Extension, Dakar',
        municipality: 'Commune de Keur Massar',
        status: 'En cours d\'instruction',
        submissionDate: '2023-12-01',
        expectedResponse: '2024-02-01',
        progress: 60,
        description: 'Demande de permis pour construction d\'une villa R+1',
        applicant: 'M. Ndiaye Amadou',
        architect: 'Cabinet ARCHI+',
        documents: ['Plan masse', 'Plan architectural', 'Étude géotechnique'],
        missingDocuments: ['Attestation voirie'],
        fees: '150,000 FCFA',
        feesPaid: true,
        assignedOfficer: 'Mme Diop - Service Urbanisme'
      },
      {
        id: 2,
        applicationId: 'DEM002',
        type: 'Certificat d\'urbanisme',
        title: 'Terrain - Diamaguène',
        location: 'Diamaguène, Sicap Mbao',
        municipality: 'Commune de Sicap Mbao',
        status: 'Documents manquants',
        submissionDate: '2024-01-05',
        expectedResponse: '2024-02-15',
        progress: 25,
        description: 'Demande de certificat d\'urbanisme opérationnel',
        applicant: 'Mme Fall Awa',
        documents: ['Titre foncier', 'Plan topographique'],
        missingDocuments: ['Extrait plan cadastral', 'Quitus fiscal'],
        fees: '50,000 FCFA',
        feesPaid: false,
        assignedOfficer: 'M. Ba - Service Cadastre'
      },
      {
        id: 3,
        applicationId: 'DEM003',
        type: 'Permis de démolir',
        title: 'Ancienne maison - Médina',
        location: 'Médina, Dakar',
        municipality: 'Commune de Médina',
        status: 'Approuvé',
        submissionDate: '2023-11-15',
        approvalDate: '2023-12-20',
        progress: 100,
        description: 'Démolition d\'un bâtiment vétuste pour reconstruction',
        applicant: 'SCI Les Palmiers',
        documents: ['Étude technique', 'Plan démolition', 'Assurance'],
        fees: '75,000 FCFA',
        feesPaid: true,
        assignedOfficer: 'M. Sarr - Service Technique'
      }
    ]);

    // Permis obtenus
    setPermits([
      {
        id: 1,
        permitId: 'PC2023-045',
        type: 'Permis de construire',
        title: 'Villa moderne - Almadies',
        location: 'Almadies, Dakar',
        issuedDate: '2023-10-15',
        expiryDate: '2024-10-15',
        validFor: '12 mois',
        status: 'Valide',
        holder: 'M. Diallo Mamadou'
      },
      {
        id: 2,
        permitId: 'CU2023-123',
        type: 'Certificat d\'urbanisme',
        title: 'Terrain constructible - Yeumbeul',
        location: 'Yeumbeul Nord, Dakar',
        issuedDate: '2023-09-20',
        expiryDate: '2024-09-20',
        validFor: '12 mois',
        status: 'Valide',
        holder: 'Mme Sow Fatou'
      }
    ]);

    // Certificats
    setCertificates([
      {
        id: 1,
        certificateId: 'CERT2023-089',
        type: 'Certificat de conformité',
        title: 'Immeuble R+3 - Plateau',
        location: 'Plateau, Dakar',
        issuedDate: '2023-11-30',
        status: 'Valide',
        holder: 'SCAT URBAM',
        description: 'Certificat de conformité après achèvement des travaux'
      }
    ]);
  }, []);

  const handleAddApplication = (applicationData) => {
    const newApplication = {
      id: applications.length + 1,
      applicationId: `DEM${String(applications.length + 1).padStart(3, '0')}`,
      ...applicationData,
      submissionDate: new Date().toISOString().split('T')[0],
      status: 'Soumis',
      progress: 10,
      feesPaid: false
    };
    setApplications([...applications, newApplication]);
    setShowAddForm(false);
    addNotification({
      type: 'success',
      title: 'Demande soumise',
      message: `Votre demande ${applicationData.type} a été soumise avec succès.`
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Soumis': return 'bg-blue-500';
      case 'En cours d\'instruction': return 'bg-yellow-600';
      case 'Documents manquants': return 'bg-orange-500';
      case 'Approuvé': return 'bg-green-500';
      case 'Rejeté': return 'bg-red-500';
      case 'Valide': return 'bg-green-500';
      case 'Expiré': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityIcon = (status) => {
    switch (status) {
      case 'Documents manquants': return <AlertCircle className="w-4 h-4 text-orange-500" />;
      case 'Rejeté': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'Approuvé': return <CheckCircle className="w-4 h-4 text-green-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const AddApplicationForm = () => (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="w-5 h-5" />
          Nouvelle demande communale
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Type de demande</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="permis-construire">Permis de construire</SelectItem>
                <SelectItem value="permis-demolir">Permis de démolir</SelectItem>
                <SelectItem value="certificat-urbanisme">Certificat d'urbanisme</SelectItem>
                <SelectItem value="autorisation-voirie">Autorisation de voirie</SelectItem>
                <SelectItem value="permis-amenager">Permis d'aménager</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Commune</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez la commune" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dakar">Commune de Dakar</SelectItem>
                <SelectItem value="keur-massar">Commune de Keur Massar</SelectItem>
                <SelectItem value="medina">Commune de Médina</SelectItem>
                <SelectItem value="sicap-mbao">Commune de Sicap Mbao</SelectItem>
                <SelectItem value="yeumbeul">Commune de Yeumbeul</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Titre du projet</label>
            <Input placeholder="Ex: Construction villa - Keur Massar" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Localisation</label>
            <Input placeholder="Ex: Keur Massar Extension, Dakar" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Demandeur</label>
            <Input placeholder="Ex: M. Ndiaye Amadou" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Architecte (si applicable)</label>
            <Input placeholder="Ex: Cabinet ARCHI+" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Description du projet</label>
          <Textarea placeholder="Décrivez votre projet en détail..." rows={3} />
        </div>
        <div className="flex gap-2">
          <Button onClick={() => handleAddApplication({})}>
            Soumettre la demande
          </Button>
          <Button variant="outline" onClick={() => setShowAddForm(false)}>
            Annuler
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const ApplicationCard = ({ application }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{application.title}</CardTitle>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {application.location}
            </p>
            <p className="text-blue-600 font-medium mt-1">{application.municipality}</p>
          </div>
          <div className="flex items-center gap-2">
            {getPriorityIcon(application.status)}
            <Badge className={`${getStatusColor(application.status)} text-white`}>
              {application.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Progression du dossier</span>
            <span className="text-sm text-gray-600">{application.progress}%</span>
          </div>
          <Progress value={application.progress} className="mb-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{application.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Soumis le</p>
              <p className="font-medium">{application.submissionDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Réponse attendue</p>
              <p className="font-medium">{application.expectedResponse || application.approvalDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Frais</p>
              <p className="font-medium">{application.fees}</p>
              {application.feesPaid ? (
                <CheckCircle className="w-3 h-3 text-green-500 inline ml-1" />
              ) : (
                <AlertCircle className="w-3 h-3 text-red-500 inline ml-1" />
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium mb-2">Documents fournis:</p>
            <div className="space-y-1">
              {application.documents.map((doc, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  {doc}
                </div>
              ))}
            </div>
          </div>
          {application.missingDocuments && application.missingDocuments.length > 0 && (
            <div>
              <p className="text-sm font-medium mb-2 text-orange-600">Documents manquants:</p>
              <div className="space-y-1">
                {application.missingDocuments.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-orange-600">
                    <AlertCircle className="w-3 h-3" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-gray-50 p-3 rounded mb-4">
          <p className="text-sm font-medium">Agent responsable:</p>
          <p className="text-sm text-gray-700">{application.assignedOfficer}</p>
        </div>

        <p className="text-gray-700 mb-4">{application.description}</p>

        <div className="flex gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Voir dossier
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            Contacter
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Documents
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const PermitCard = ({ permit }) => (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{permit.title}</CardTitle>
            <p className="text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-4 h-4" />
              {permit.location}
            </p>
            <p className="text-blue-600 font-medium mt-1">{permit.permitId}</p>
          </div>
          <Badge className={`${getStatusColor(permit.status)} text-white`}>
            {permit.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{permit.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Délivré le</p>
              <p className="font-medium">{permit.issuedDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-orange-600" />
            <div>
              <p className="text-sm text-gray-600">Expire le</p>
              <p className="font-medium">{permit.expiryDate}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <UserCheck className="w-4 h-4 text-gray-600" />
          <span className="text-sm">Titulaire: {permit.holder}</span>
        </div>

        <div className="flex gap-2">
          <Button size="sm" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Voir permis
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Télécharger
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <ModernDashboardLayout
      title="Demandes Communales"
      subtitle="Suivi de vos démarches administratives"
    >
      <div className="space-y-6">
        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Demandes en cours</p>
                  <p className="text-2xl font-bold">
                    {applications.filter(a => a.status !== 'Approuvé' && a.status !== 'Rejeté').length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Permis obtenus</p>
                  <p className="text-2xl font-bold">{permits.length}</p>
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
                    {applications.filter(a => a.status === 'Documents manquants').length}
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
                  <p className="text-sm text-gray-600">Certificats</p>
                  <p className="text-2xl font-bold">{certificates.length}</p>
                </div>
                <Landmark className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Bouton d'ajout */}
        {!showAddForm && (
          <div className="flex justify-end">
            <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nouvelle demande
            </Button>
          </div>
        )}

        {/* Formulaire d'ajout */}
        {showAddForm && <AddApplicationForm />}

        {/* Onglets */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="applications" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Demandes ({applications.length})
            </TabsTrigger>
            <TabsTrigger value="permits" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Permis ({permits.length})
            </TabsTrigger>
            <TabsTrigger value="certificates" className="flex items-center gap-2">
              <Landmark className="w-4 h-4" />
              Certificats ({certificates.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="applications" className="mt-6">
            <div className="space-y-4">
              {applications.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Aucune demande en cours
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Commencez par soumettre votre première demande communale.
                    </p>
                    <Button onClick={() => setShowAddForm(true)}>
                      Nouvelle demande
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                applications.map(application => (
                  <ApplicationCard key={application.id} application={application} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="permits" className="mt-6">
            <div className="space-y-4">
              {permits.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Aucun permis obtenu
                    </h3>
                    <p className="text-gray-500">
                      Vos permis approuvés apparaîtront ici.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                permits.map(permit => (
                  <PermitCard key={permit.id} permit={permit} />
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="mt-6">
            <div className="space-y-4">
              {certificates.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Landmark className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Aucun certificat
                    </h3>
                    <p className="text-gray-500">
                      Vos certificats obtenus apparaîtront ici.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                certificates.map(certificate => (
                  <Card key={certificate.id} className="mb-4">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{certificate.title}</CardTitle>
                          <p className="text-gray-600 flex items-center gap-1 mt-1">
                            <MapPin className="w-4 h-4" />
                            {certificate.location}
                          </p>
                          <p className="text-blue-600 font-medium mt-1">{certificate.certificateId}</p>
                        </div>
                        <Badge className={`${getStatusColor(certificate.status)} text-white`}>
                          {certificate.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">{certificate.description}</p>
                      <div className="flex items-center gap-4 mb-4">
                        <span className="text-sm text-gray-600">Délivré le: {certificate.issuedDate}</span>
                        <span className="text-sm text-gray-600">Titulaire: {certificate.holder}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex items-center gap-2">
                          <Eye className="w-4 h-4" />
                          Voir certificat
                        </Button>
                        <Button size="sm" variant="outline" className="flex items-center gap-2">
                          <FileText className="w-4 h-4" />
                          Télécharger
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Assistant IA contextuel */}
      <ContextualAIAssistant />
    </ModernDashboardLayout>
  );
};

export default MunicipalApplications;