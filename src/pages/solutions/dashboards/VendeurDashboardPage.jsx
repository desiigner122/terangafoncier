
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, MessageSquare, BarChart2, Bell, User, PlusCircle, Eye, Edit, Trash2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/spinner';
import { useAuth } from '@/context/SupabaseAuthContext';
import { sampleRequests, sampleUsers, sampleParcels } from '@/data';
import { useToast } from "@/components/ui/use-toast-simple";
import { Link } from 'react-router-dom';

const VendeurDashboardPage = () => {
    const { user } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [requests, setRequests] = useState([]);
    const [listings, setListings] = useState([]);

    useEffect(() => {
        if (!user) return;
        const timer = setTimeout(() => {
            const sellerParcels = sampleParcels.filter(p => p.seller_id === user.id);
            const sellerRequests = sampleRequests.filter(req => sellerParcels.some(p => p.id === req.parcel_id));
            setRequests(sellerRequests);
            setListings(sellerParcels);
            setLoading(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [user]);

    const handleRequestAction = (requestId, action) => {
        const actionText = action === 'approve' ? 'approuvée' : 'rejetée';
        const newStatus = action === 'approve' ? 'En attente de paiement' : 'Rejetée';

        setRequests(prevRequests =>
            prevRequests.map(req =>
                req.id === requestId ? { ...req, status: newStatus } : req
            )
        );

        toast({
            title: `Demande ${actionText}`,
            description: `La demande ${requestId} a été ${actionText}. L'acheteur a été notifié.`,
        });
    };
    
    const handleListingAction = (listingId, action) => {
        toast({
            title: `Action sur l'annonce ${listingId}`,
            description: `L'action "${action}" a été simulée.`,
        });
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <LoadingSpinner size="xl" />
            </div>
        );
    }
    
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 p-4 md:p-6 lg:p-8"
        >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary flex items-center">
                        <User className="h-8 w-8 mr-3 text-accent_brand"/>
                        Tableau de Bord Vendeur
                    </h1>
                    <p className="text-muted-foreground">Gérez vos biens, vos demandes et vos ventes.</p>
                </div>
                <Button asChild>
                    <Link to="/add-parcel"><PlusCircle className="mr-2 h-4 w-4"/>Ajouter un nouveau bien</Link>
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
               <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Biens Actifs</CardTitle><Home className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{listings.filter(l => l.status === 'Disponible').length}</div></CardContent></Card>
               <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Demandes en Attente</CardTitle><MessageSquare className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{requests.filter(r => r.status === 'Nouvelle').length}</div></CardContent></Card>
               <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Ventes Finalisées (Mois)</CardTitle><BarChart2 className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">2</div></CardContent></Card>
               <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Notifications</CardTitle><Bell className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">5</div></CardContent></Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Mes Annonces</CardTitle>
                        <CardDescription>Aperçu rapide de vos biens en vente.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-3">
                            {listings.slice(0, 4).map(listing => (
                                <li key={listing.id} className="flex items-center justify-between p-2 bg-muted/30 rounded-md">
                                    <div>
                                        <p className="font-semibold text-sm">{listing.name}</p>
                                        <p className="text-xs text-muted-foreground">{listing.zone} - {listing.area_sqm} m²</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleListingAction(listing.id, 'edit')}><Edit className="h-4 w-4"/></Button>
                                        <Button variant="ghost" size="icon" className="h-7 w-7" asChild><Link to={`/parcelles/${listing.id}`}><Eye className="h-4 w-4"/></Link></Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link to="/my-listings">Gérer toutes mes annonces</Link>
                        </Button>
                    </CardFooter>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Demandes Récentes des Acheteurs</CardTitle>
                        <CardDescription>Gérez les demandes pour vos biens.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <tbody>
                                    {requests.length > 0 ? requests.slice(0, 3).map(req => {
                                        const acheteur = sampleUsers.find(u => u.id === req.user_id);
                                        const bien = listings.find(l => l.id === req.parcel_id);
                                        return (
                                            <tr key={req.id} className="border-b last:border-b-0 hover:bg-muted/30">
                                                <td className="p-2">
                                                    <p className="font-semibold">{acheteur?.name || 'Inconnu'}</p>
                                                    <p className="text-xs text-muted-foreground">{bien?.name || 'N/A'}</p>
                                                </td>
                                                <td className="p-2 text-right">
                                                    {req.status === 'Nouvelle' ? (
                                                        <div className="flex gap-1 justify-end">
                                                            <Button size="xs" onClick={() => handleRequestAction(req.id, 'approve')}>Approuver</Button>
                                                            <Button size="xs" variant="destructive" onClick={() => handleRequestAction(req.id, 'reject')}>Rejeter</Button>
                                                        </div>
                                                    ) : (
                                                        <Badge variant={req.status === 'En attente de paiement' ? 'warning' : 'secondary'}>{req.status}</Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }) : (
                                        <tr>
                                            <td colSpan="2" className="p-4 text-center text-muted-foreground">Aucune demande pour le moment.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                     <CardFooter>
                        <Button asChild variant="outline" className="w-full">
                            <Link to="/my-requests">Gérer toutes les demandes</Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>

        </motion.div>
    );
};

export default VendeurDashboardPage;
