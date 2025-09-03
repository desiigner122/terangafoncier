import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileSignature, Search, Filter, Eye } from 'lucide-react';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { InstructionModal, AttributionModal } from '@/pages/solutions/dashboards/mairies/MairiesDashboardModals';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { useAuth } from '@/context/SupabaseAuthContext';

const MairieRequestsPage = () => {
  // toast remplacÃ© par window.safeGlobalToast
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ type: null, data: null });
  const [municipalParcels, setMunicipalParcels] = useState([]);
  const [attributionParcel, setAttributionParcel] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchMairieData = async () => {
      setLoading(true);
      
      const { data: parcelsData, error: parcelsError } = await supabase
        .from('parcels')
        .select('*')
        .eq('owner_type', 'Mairie');
      
      if (parcelsError) console.error("Error fetching municipal parcels:", parcelsError);
      else setMunicipalParcels(parcelsData || []);

      const { data: requestsData, error: requestsError } = await supabase
        .from('requests')
        .select('*, user:user_id(full_name), parcel:parcel_id(name, zone)')
        .eq('recipient_id', user.id); // Assuming Mairie user is the recipient
      
      if (requestsError) {
        console.error("Error fetching requests:", requestsError);
        window.safeGlobalToast({ title: "Erreur", description: "Impossible de charger les demandes.", variant: "destructive" });
      } else {
        setRequests(requestsData.map(r => ({...r, history: r.history || []})));
      }
      
      setLoading(false);
    };
    fetchMairieData();
  }, [user, toast]);

  const openModal = (type, data) => {
    setModalContent({ type, data });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent({ type: null, data: null });
  };

  const handleOpenInstructionModal = (request) => {
    const modalType = request.request_type === 'acquisition' ? 'attribution' : 'permit';
    const title = modalType === 'attribution' ? `Attribuer un Terrain : Dossier ${request.id}` : `Instruction du Dossier: ${request.id}`;
    const description = modalType === 'attribution' ? `Demande de ${request.user?.full_name} pour un terrain communal.` : `Vérifiez les pièces et rendez votre décision.`;
    
    openModal(modalType, { request, user: request.user, title, description });
  };

  const handleContactApplicant = (applicantId, dossierId) => {
    closeModal();
    navigate('/messaging', { state: { recipientId: applicantId, context: `Dossier ${dossierId}` }});
  };

  const handleDecision = async (request, decision, updateNote) => {
    const { error } = await supabase
      .from('requests')
      .update({ status: decision, note: updateNote || `Le statut a été mis à jour à "${decision}".` })
      .eq('id', request.id);

    if (error) {
      window.safeGlobalToast({ title: "Erreur", description: "La mise à jour a échoué.", variant: "destructive" });
    } else {
      setRequests(prev => prev.map(req => req.id === request.id ? {...req, status: decision} : req));
      closeModal();
      window.safeGlobalToast({
          title: "Décision Enregistrée",
          description: `La décision '${decision}' a été enregistrée pour le dossier ${request.id}. L'acheteur a été notifié.`,
      });
    }
  };

  const handleAttribution = async (request) => {
    if (!attributionParcel) {
        window.safeGlobalToast({ title: "Erreur", description: "Veuillez sélectionner une parcelle à attribuer.", variant: "destructive" });
        return;
    }
    await handleDecision(request, 'Approuvée', `La parcelle ${attributionParcel} a été attribuée au demandeur.`);
    setAttributionParcel('');
  };

  const renderModalContent = () => {
    if (!isModalOpen || !modalContent.data) return null;
    
    const { type, data } = modalContent;
    const { request } = data;

    switch (type) {
      case 'permit':
        return <InstructionModal 
                 content={data} 
                 onDecision={(decision, note) => handleDecision(request, decision, note)}
                 onContact={() => handleContactApplicant(request.user_id, request.id)}
                 onAction={(title, desc) => window.safeGlobalToast({ title, description: desc, variant: 'destructive'})}
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
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 md:p-6 lg:p-8"
    >
      <h1 className="text-3xl font-bold flex items-center"><FileSignature className="mr-3 h-8 w-8"/>Demandes Administratives</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Suivi des Demandes (Permis, DIA, Attribution, etc.)</CardTitle>
          <div className="flex space-x-2 pt-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher par demandeur, parcelle..." className="pl-8" />
            </div>
            <Button variant="outline" onClick={() => window.safeGlobalToast({title: "Filtres appliqués"})}><Filter className="mr-2 h-4 w-4" /> Filtrer</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2 font-semibold">Demandeur</th>
                  <th className="text-left p-2 font-semibold">Type</th>
                  <th className="text-left p-2 font-semibold">Objet</th>
                  <th className="text-left p-2 font-semibold">Statut</th>
                  <th className="text-right p-2 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {requests.map(req => (
                    <tr key={req.id} className="border-b hover:bg-muted/30">
                      <td className="p-2">{req.user?.full_name || 'N/A'}</td>
                      <td className="p-2 capitalize">{req.request_type}</td>
                      <td className="p-2 text-muted-foreground">{req.message?.substring(0, 50)}...</td>
                      <td className="p-2"><Badge variant={req.status === 'Nouvelle' ? 'warning' : 'secondary'}>{req.status}</Badge></td>
                      <td className="p-2 text-right space-x-1">
                        <Button variant="default" size="sm" onClick={() => handleOpenInstructionModal(req)}>
                          <Eye className="mr-2 h-4 w-4" /> Instruire
                        </Button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogContent className="sm:max-w-3xl" onOpenAutoFocus={(e) => e.preventDefault()}>
        {renderModalContent()}
      </DialogContent>
    </Dialog>
    </>
  );
};

export default MairieRequestsPage;
