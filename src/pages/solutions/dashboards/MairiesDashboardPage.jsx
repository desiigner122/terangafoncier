
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, FileSignature, LandPlot, AlertTriangle, Map as MapIcon, Library, Construction, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { sampleParcels, sampleRequests, sampleUsers } from '@/data';
import { LoadingSpinner } from '@/components/ui/spinner';
import { InstructionModal, AttributionModal, GenericActionModal } from './mairies/MairiesDashboardModals';
import { useToast } from '@/components/ui/use-toast-simple';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const MairiesDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ type: null, data: null });
  const [municipalParcels, setMunicipalParcels] = useState([]);
  const [requestsForTable, setRequestsForTable] = useState([]);
  const [attributionParcel, setAttributionParcel] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  const openModal = (type, data) => {
    setModalContent({ type, data });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent({ type: null, data: null });
  }
  
  useEffect(() => {
    const timer = setTimeout(() => {
      const mairieName = "Mairie de Saly";
      const mairieParcels = sampleParcels.filter(p => p.ownerType === 'Mairie' && p.zone === 'Saly');
      const requestsForMairie = sampleRequests.map(r => ({...r, history: r.history || []}))
                                              .filter(r => r.recipient === mairieName || sampleParcels.find(p => p.id === r.parcel_id)?.zone === 'Saly');
      
      setMunicipalParcels(mairieParcels);
      setRequestsForTable(requestsForMairie);
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);
  
  const handleOpenInstructionModal = (request) => {
    const user = sampleUsers.find(u => u.id === request.user_id);
    const modalType = request.request_type === 'acquisition' ? 'attribution' : 'permit';

    const modalProps = {
        title: modalType === 'attribution' ? `Attribuer un Terrain : Dossier ${request.id}` : `Instruction du Dossier: ${request.id}`,
        description: modalType === 'attribution' ? `Demande de ${user?.name} pour un terrain communal.` : `Vérifiez les pièces et rendez votre décision.`,
        request, 
        user, 
        modalType
    };
    openModal(modalType, modalProps);
  };
  
  const handleContactApplicant = (applicantId, dossierId) => {
    closeModal();
    navigate('/messaging', { state: { recipientId: applicantId, context: `Dossier ${dossierId}` }});
  };

  const handleDecision = (request, decision, updateNote) => {
    const newHistoryEntry = {
        status: decision,
        date: new Date().toISOString(),
        updated_by: "Agent Mairie (simulé)",
        note: updateNote || `Le statut a été mis à jour à "${decision}".`
    };

    setRequestsForTable(prev => prev.map(req => 
        req.id === request.id 
        ? {...req, status: decision, history: [...(req.history || []), newHistoryEntry] } 
        : req
    ));

    closeModal();
    toast({
        title: "Décision Enregistrée",
        description: `La décision '${decision}' a été enregistrée pour le dossier ${request.id}. L'acheteur a été notifié.`,
    });
  }

  const handleAttribution = (request) => {
    if (!attributionParcel) {
        toast({ title: "Erreur", description: "Veuillez sélectionner une parcelle à attribuer.", variant: "destructive" });
        return;
    }
    const decision = 'Approuvée';
    const newHistoryEntry = {
        status: decision,
        date: new Date().toISOString(),
        updated_by: "Agent Mairie (simulé)",
        note: `La parcelle ${attributionParcel} a été attribuée au demandeur.`
    };
    
    setRequestsForTable(prev => prev.map(req => req.id === request.id ? {...req, status: decision, history: [...(req.history || []), newHistoryEntry]} : req));
    closeModal();
    toast({
        title: "Parcelle Attribuée",
        description: `La parcelle ${attributionParcel} a été attribuée au demandeur pour le dossier ${request.id}.`,
    });
    setAttributionParcel('');
  }
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full p-8">
        <LoadingSpinner size="xl" />
      </div>
    );
  }

  const renderModalContent = () => {
    if (!isModalOpen || !modalContent?.data?.request) return null;
    
    const { type, data } = modalContent;
    const { request } = data;

    switch (type) {
      case 'permit':
        return <InstructionModal 
                 content={data} 
                 onDecision={(decision, note) => handleDecision(request, decision, note)}
                 onContact={() => handleContactApplicant(request.user_id, request.id)}
                 onAction={(title, desc) => toast({ title, description: desc, variant: 'destructive'})}
                 onClose={closeModal} 
               />;
      case 'attribution':
         return <AttributionModal
                 content={data} 
                 municipalParcels={municipalParcels}
                 attributionParcel={attributionParcel}
                 setAttributionParcel={setAttributionParcel}
                 onAttribution={() => handleAttribution(request)}
                 onDecision={(decision) => handleDecision(request, decision, "La demande d'attribution a été rejetée.")}
                 onContact={() => handleContactApplicant(request.user_id, request.id)}
                 onClose={closeModal} 
               />;
      case 'generic':
      default:
        return <GenericActionModal content={data} onClose={closeModal} />;
    }
  };

  const newRequestsCount = requestsForTable.filter(r => r.status === 'Nouvelle').length;
  const pendingAttributionCount = municipalParcels.filter(p => p.status === 'Attribution sur demande').length;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="space-y-6 p-4 md:p-6 lg:p-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center">
              <Landmark className="h-8 w-8 mr-3 text-blue-600"/>
              Tableau de Bord Mairie (Saly)
            </h1>
            <p className="text-muted-foreground">Outils pour la gestion du foncier et des demandes administratives de votre commune.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Nouvelles Demandes</CardTitle>
                    <FileSignature className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{newRequestsCount}</div>
                    <p className="text-xs text-muted-foreground">en attente de traitement</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Terrains à Attribuer</CardTitle>
                    <LandPlot className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingAttributionCount}</div>
                    <p className="text-xs text-muted-foreground">disponibles dans le patrimoine</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Litiges en Cours</CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">1</div>
                    <p className="text-xs text-muted-foreground">nécessitant une médiation</p>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agents Actifs</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">connectés aujourd'hui</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>Demandes Récentes</CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <tbody>
                                {requestsForTable.slice(0, 5).map(req => {
                                    const user = sampleUsers.find(u => u.id === req.user_id);
                                    return(
                                    <tr key={req.id} className="border-b last:border-b-0 hover:bg-muted/30">
                                        <td className="p-2 font-medium">{req.id}</td>
                                        <td className="p-2">{user?.name || 'N/A'}</td>
                                        <td className="p-2 capitalize">{req.request_type}</td>
                                        <td className="p-2">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenInstructionModal(req)}>Instruire</Button>
                                        </td>
                                    </tr>
                                )})}
                            </tbody>
                        </table>
                     </div>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link to="/dashboard/mairie-requests">Voir toutes les demandes</Link>
                    </Button>
                </CardFooter>
            </Card>
            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Outils d'Urbanisme</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2">
                        <Button asChild variant="secondary" className="justify-start"><Link to="/dashboard/cadastre"><MapIcon className="mr-2 h-4 w-4"/> Consulter le Cadastre</Link></Button>
                        <Button asChild variant="secondary" className="justify-start"><Link to="/dashboard/urban-plan"><Library className="mr-2 h-4 w-4"/> Voir Plan d'Urbanisme</Link></Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Litiges Fonciers</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 text-center">
                        <Construction className="mx-auto h-8 w-8 text-yellow-500 mb-2"/>
                        <p className="text-xs text-muted-foreground">La gestion des litiges sera bientôt disponible.</p>
                        <Button asChild variant="outline" size="sm"><Link to="/dashboard/disputes">En savoir plus</Link></Button>
                    </CardContent>
                </Card>
            </div>
        </div>
        
      </motion.div>
    
     <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl" onOpenAutoFocus={(e) => e.preventDefault()}>
            {renderModalContent()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MairiesDashboardPage;
