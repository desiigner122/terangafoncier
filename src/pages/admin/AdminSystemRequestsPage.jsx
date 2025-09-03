
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { LoadingSpinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { Check, X, FilePlus, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminSystemRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    // toast remplacÃ© par window.safeGlobalToast

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('requests')
                .select('*, user:user_id(full_name), parcel:parcel_id(name)')
                .eq('request_type', 'parcel_listing');
            
            if (error) {
                console.error("Error fetching requests:", error);
                window.safeGlobalToast({ title: 'Erreur', description: 'Impossible de charger les requêtes.', variant: 'destructive' });
            } else {
                setRequests(data.map(r => ({
                    ...r,
                    user: { name: r.user?.full_name || 'Utilisateur Inconnu' },
                    details: { parcelName: r.parcel?.name || 'Parcelle Inconnue', parcelId: r.parcel_id }
                })));
            }
            setLoading(false);
        };
        fetchRequests();
    }, [toast]);

    const handleRequestAction = async (requestId, newStatus) => {
        const request = requests.find(r => r.id === requestId);
        if(!request) return;

        const { error: requestError } = await supabase
            .from('requests')
            .update({ status: newStatus })
            .eq('id', requestId);

        if (requestError) {
            window.safeGlobalToast({ title: 'Erreur', description: 'La mise à jour de la requête a échoué.', variant: 'destructive' });
            return;
        }

        const { error: parcelError } = await supabase
            .from('parcels')
            .update({ status: newStatus === 'approved' ? 'Disponible' : 'Rejetée' })
            .eq('id', request.parcel_id);

        if (parcelError) {
            window.safeGlobalToast({ title: 'Erreur', description: 'La mise à jour de la parcelle a échoué.', variant: 'destructive' });
        } else {
            setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
            window.safeGlobalToast({
                title: 'Action effectuée',
                description: `L'annonce de parcelle a été ${newStatus === 'approved' ? 'approuvée' : 'rejetée'}.`,
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <Badge variant="warning">En attente</Badge>;
            case 'approved': return <Badge variant="success">Approuvée</Badge>;
            case 'rejected': return <Badge variant="destructive">Rejetée</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };

    const RequestDetailsDialog = ({ request }) => {
        return (
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Détails de la Soumission: {request.details.parcelName}</DialogTitle>
                    <DialogDescription>Vérifiez les informations et les documents avant de prendre une décision.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4 text-sm max-h-96 overflow-y-auto">
                    <p><strong>Utilisateur:</strong> {request.user.name}</p>
                    <p><strong>ID de la parcelle:</strong> {request.details.parcelId}</p>
                    <p className="text-muted-foreground">La gestion des documents se fait sur la page de gestion des annonces.</p>
                </div>
                <DialogFooter>
                    <Button variant="outline" asChild><Link to={`/admin/parcels`} target="_blank">Gérer les annonces</Link></Button>
                    <DialogClose asChild><Button variant="secondary">Fermer</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        );
    };

    const renderRequestList = (reqs) => {
        if (reqs.length === 0) {
            return <p className="text-center text-muted-foreground p-8">Aucune requête dans cette catégorie.</p>;
        }
        return (
            <ul className="space-y-4">
                {reqs.map(req => (
                    <li key={req.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex-grow">
                            <div className="flex items-center mb-1 gap-2">
                                <FilePlus className="h-4 w-4 text-green-500"/>
                                <span className="font-semibold text-primary">Ajout de Parcelle</span>
                                {getStatusBadge(req.status)}
                            </div>
                            <p className="text-sm"><strong>Parcelle:</strong> {req.details.parcelName}</p>
                            <p className="text-sm"><strong>De:</strong> {req.user.name}</p>
                            <p className="text-xs text-muted-foreground">ID: {req.id} | Date: {new Date(req.created_at).toLocaleDateString('fr-FR')}</p>
                        </div>
                        <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button variant="outline" size="sm">Détails</Button>
                                </DialogTrigger>
                                <RequestDetailsDialog request={req} />
                            </Dialog>
                             {req.status === 'pending' && (
                                <>
                                <Button size="sm" variant="success" onClick={() => handleRequestAction(req.id, 'approved')}><Check className="h-4 w-4 mr-1"/>Approuver</Button>
                                <Button size="sm" variant="destructive" onClick={() => handleRequestAction(req.id, 'rejected')}><X className="h-4 w-4 mr-1"/>Rejeter</Button>
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        );
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <LoadingSpinner size="large" />
            </div>
        );
    }

    const pendingRequests = requests.filter(r => r.status === 'pending');
    const processedRequests = requests.filter(r => r.status !== 'pending');

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-12 px-4"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Requêtes d'Ajout de Parcelle</CardTitle>
                    <CardDescription>Validez les nouvelles annonces de parcelles soumises par les vendeurs.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="pending">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="pending">En attente <Badge variant="secondary" className="ml-2">{pendingRequests.length}</Badge></TabsTrigger>
                            <TabsTrigger value="processed">Traitées <Badge variant="secondary" className="ml-2">{processedRequests.length}</Badge></TabsTrigger>
                        </TabsList>
                        <TabsContent value="pending" className="pt-6">
                            {renderRequestList(pendingRequests)}
                        </TabsContent>
                        <TabsContent value="processed" className="pt-6">
                             {renderRequestList(processedRequests)}
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AdminSystemRequestsPage;
