
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/components/ui/use-toast-simple";
import { LoadingSpinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { Check, X, UserPlus, Eye } from 'lucide-react';

const AdminUserRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchRequests = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('requests')
                .select('*, user:user_id(full_name, role)')
                .eq('request_type', 'account_upgrade');
            
            if (error) {
                console.error("Error fetching requests:", error);
                toast({ title: 'Erreur', description: 'Impossible de charger les requêtes.', variant: 'destructive' });
            } else {
                setRequests(data.map(r => {
                    let requestedRole = 'N/A';
                    try {
                        requestedRole = JSON.parse(r.message || '{}')?.requestedRole || 'N/A';
                    } catch (error) {
                        console.warn('Failed to parse request message:', error);
                    }
                    
                    return {
                        ...r,
                        user: { name: r.user?.full_name || 'Utilisateur Inconnu', id: r.user_id, currentRole: r.user?.role },
                        details: { requestedRole }
                    };
                }));
            }
            setLoading(false);
        };
        fetchRequests();
    }, [toast]);

    const handleRequestAction = async (requestId, newStatus) => {
        const request = requests.find(r => r.id === requestId);
        if (!request) return;

        const { error: requestError } = await supabase
            .from('requests')
            .update({ status: newStatus })
            .eq('id', requestId);

        if (requestError) {
            toast({ title: 'Erreur', description: 'La mise à jour de la requête a échoué.', variant: 'destructive' });
            return;
        }

        if (newStatus === 'approved') {
            const { error: profileError } = await supabase
                .from('users')
                .update({ role: request.details.requestedRole, user_type: request.details.requestedRole, verification_status: 'verified' })
                .eq('id', request.user.id);

            if (profileError) {
                toast({ title: 'Erreur', description: 'La mise à jour du profil a échoué.', variant: 'destructive' });
                return;
            }
        }
        
        setRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: newStatus } : req));
        toast({
            title: 'Action effectuée',
            description: `La demande de ${request.user.name} a été ${newStatus === 'approved' ? 'approuvée' : 'rejetée'}.`,
        });
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
                    <DialogTitle>Détails de la Requête: {request.id}</DialogTitle>
                    <DialogDescription>Vérifiez les informations avant de prendre une décision.</DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4 text-sm max-h-96 overflow-y-auto">
                    <p><strong>Utilisateur:</strong> {request.user.name} ({request.user.id})</p>
                    <p><strong>Rôle Actuel:</strong> {request.user.currentRole}</p>
                    <p><strong>Rôle Demandé:</strong> {request.details.requestedRole}</p>
                    <p className="text-muted-foreground">La gestion des documents se fait sur la page de vérification des utilisateurs.</p>
                </div>
                <DialogFooter>
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
                                <UserPlus className="h-4 w-4 text-blue-500"/>
                                <span className="font-semibold text-primary">Demande de Changement de Rôle</span>
                                {getStatusBadge(req.status)}
                            </div>
                            <p className="text-sm"><strong>Utilisateur:</strong> {req.user.name}</p>
                            <p className="text-sm text-muted-foreground">De <strong>{req.user.currentRole}</strong> à <strong>{req.details.requestedRole}</strong></p>
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
                    <CardTitle className="text-3xl font-bold">Demandes de Changement de Rôle</CardTitle>
                    <CardDescription>Validez les utilisateurs souhaitant obtenir un nouveau rôle (ex: devenir vendeur).</CardDescription>
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

export default AdminUserRequestsPage;