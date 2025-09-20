
import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
    FileText, 
    ArrowRight, 
    Bell, 
    User, 
    MessageSquare, 
    Check, 
    X, 
    ShoppingCart,
    Shield,
    ExternalLink
} from 'lucide-react';
import { LoadingSpinner } from '@/components/ui/spinner';
// useToast import supprimé - utilisation window.safeGlobalToast
import { supabase } from '@/lib/customSupabaseClient';
import terangaBlockchain, { terangaBlockchain as blockchain } from '@/services/TerangaBlockchainService';

const MyRequestsPage = () => {
    const { user } = useAuth();
    // toast remplacé par window.safeGlobalToast
    const [loading, setLoading] = useState(true);
    const [mySentRequests, setMySentRequests] = useState([]);
    const [myReceivedRequests, setMyReceivedRequests] = useState([]);
    const [filterType, setFilterType] = useState('all'); // all | terrains | promoteurs | communales | construction
    
    const isSeller = user && (user.role === 'Vendeur Particulier' || user.role === 'Vendeur Pro');
    const [activeTab, setActiveTab] = useState(isSeller ? 'received' : 'sent');

    useEffect(() => {
        if (!user) return;
        const fetchRequests = async () => {
            setLoading(true);
            // Requests sent by me
            const { data: sent, error: sentError } = await supabase
                .from('requests')
                .select('*, parcels(name, zone), users!requests_recipient_id_fkey(full_name)')
                .eq('user_id', user.id);
            if (sentError) console.error("Error fetching sent requests:", sentError);
            else setMySentRequests(sent);
            
            // Requests received by me (as a seller)
            const { data: received, error: receivedError } = await supabase
                .from('requests')
                .select('*, parcels(name), users!requests_user_id_fkey(full_name)')
                .eq('recipient_id', user.id);
            if (receivedError) console.error("Error fetching received requests:", receivedError);
            else setMyReceivedRequests(received);
            
            setLoading(false);
        };
        fetchRequests();
    }, [user]);
    
    const handleRequestAction = async (requestId, newStatus) => {
        const { error } = await supabase
            .from('requests')
            .update({ status: newStatus })
            .eq('id', requestId);

        if (error) {
            window.safeGlobalToast({ title: "Erreur", description: "Impossible de mettre à jour la demande.", variant: "destructive" });
        } else {
            const actionText = newStatus === 'approved' ? 'approuvée' : 'rejetée';
            setMyReceivedRequests(prevRequests =>
                prevRequests.map(req =>
                    req.id === requestId ? { ...req, status: newStatus } : req
                )
            );
            window.safeGlobalToast({
                title: `Demande ${actionText}`,
                description: `La demande ${requestId} a été ${actionText}. L'acheteur a été notifié.`,
            });
        }
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'new': return <Badge variant="default">Nouvelle</Badge>;
            case 'in_progress': return <Badge variant="warning">En instruction</Badge>;
            case 'approved': return <Badge variant="success">Approuvée</Badge>;
            case 'rejected': return <Badge variant="destructive">Rejetée</Badge>;
            default: return <Badge variant="secondary">{status}</Badge>;
        }
    };
    
    const filteredSent = useMemo(() => {
        if (filterType === 'all') return mySentRequests;
        return mySentRequests.filter(req => {
            switch (filterType) {
                case 'terrains': return !!req.parcels || req.type === 'offer' || req.type === 'installments' || req.type === 'bank_financing';
                case 'promoteurs': return req.project_id != null;
                case 'communales': return req.type === 'municipal_land';
                case 'construction': return req.type === 'construction_request';
                default: return true;
            }
        });
    }, [mySentRequests, filterType]);

    const sentRequestsList = (
        <ul className="space-y-4">
            {filteredSent.length > 0 ? filteredSent.map(req => (
                <li key={req.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <p className="font-semibold">{req.parcels?.name || `Demande à ${req.users?.full_name}`}</p>
                        <p className="text-sm text-muted-foreground">ID: {req.id} | Destinataire: {req.users?.full_name || 'Mairie'}</p>
                        <div className="mt-1">{getStatusBadge(req.status)}</div>
                                                {(req.nft_token_id || req.nft_tx_hash) && (
                                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                                        {req.nft_token_id && (
                                                            <Badge variant="outline" className="flex items-center gap-1">
                                                                <Shield className="w-3 h-3" /> NFT #{req.nft_token_id}
                                                            </Badge>
                                                        )}
                                                        {req.nft_tx_hash && (
                                                            <a
                                                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                                                href={`${blockchain?.networks?.[blockchain?.currentNetwork]?.blockExplorer || 'https://polygonscan.com'}/tx/${req.nft_tx_hash}`}
                                                                target="_blank" rel="noreferrer"
                                                            >
                                                                <ExternalLink className="w-3 h-3" /> Voir la transaction
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                    </div>
                    <Button asChild size="sm">
                        <Link to={`/case-tracking/${req.id}`}>
                            Suivi détaillé <ArrowRight className="ml-2 h-4 w-4"/>
                        </Link>
                    </Button>
                </li>
            )) : <p className="text-center text-muted-foreground p-4">Aucune demande pour ce filtre.</p>}
        </ul>
    );

    const filteredReceived = useMemo(() => {
        if (filterType === 'all') return myReceivedRequests;
        return myReceivedRequests.filter(req => {
            switch (filterType) {
                case 'terrains': return !!req.parcels || req.type === 'offer' || req.type === 'installments' || req.type === 'bank_financing';
                case 'promoteurs': return req.project_id != null;
                case 'communales': return req.type === 'municipal_land';
                case 'construction': return req.type === 'construction_request';
                default: return true;
            }
        });
    }, [myReceivedRequests, filterType]);

    const receivedRequestsList = (
        <ul className="space-y-4">
            {filteredReceived.length > 0 ? filteredReceived.map(req => (
                <li key={req.id} className="border rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                        <p className="font-semibold">{req.users?.full_name} pour {req.parcels?.name}</p>
                        <p className="text-sm text-muted-foreground">ID: {req.id}</p>
                        <div className="mt-1">{getStatusBadge(req.status)}</div>
                                                {(req.nft_token_id || req.nft_tx_hash) && (
                                                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                                                        {req.nft_token_id && (
                                                            <Badge variant="outline" className="flex items-center gap-1">
                                                                <Shield className="w-3 h-3" /> NFT #{req.nft_token_id}
                                                            </Badge>
                                                        )}
                                                        {req.nft_tx_hash && (
                                                            <a
                                                                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                                                href={`${blockchain?.networks?.[blockchain?.currentNetwork]?.blockExplorer || 'https://polygonscan.com'}/tx/${req.nft_tx_hash}`}
                                                                target="_blank" rel="noreferrer"
                                                            >
                                                                <ExternalLink className="w-3 h-3" /> Voir la transaction
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                    </div>
                     <div className="flex items-center gap-2">
                        {req.status === 'new' && (
                            <>
                            <Button size="sm" variant="outline" onClick={() => handleRequestAction(req.id, 'approved')}>
                                <Check className="h-4 w-4 mr-1"/> Approuver
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => handleRequestAction(req.id, 'rejected')}>
                                <X className="h-4 w-4 mr-1"/> Rejeter
                            </Button>
                            </>
                        )}
                        <Button asChild size="sm">
                            <Link to={`/case-tracking/${req.id}`}>
                                Dossier <ArrowRight className="ml-2 h-4 w-4"/>
                            </Link>
                        </Button>
                    </div>
                </li>
            )) : <p className="text-center text-muted-foreground p-4">Aucune demande pour ce filtre.</p>}
        </ul>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full p-8">
                <LoadingSpinner size="xl" />
            </div>
        );
    }
    
    const showSentTab = isSeller && mySentRequests.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-12 px-4"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl flex items-center">
                        {activeTab === 'received' ? <Bell className="mr-3 h-8 w-8 text-primary"/> : <ShoppingCart className="mr-3 h-8 w-8 text-primary"/>}
                        {isSeller ? (activeTab === 'sent' ? 'Mes Achats' : 'Demandes Reçues') : 'Mes Demandes'}
                    </CardTitle>
                    <CardDescription>
                        {isSeller ? (activeTab === 'sent' ? 'Suivez les demandes que vous avez faites pour acheter d\'autres biens.' : 'Gérez les demandes d\'achat pour vos biens.') : 'Suivez l\'état d\'avancement de vos demandes d\'acquisition ou d\'information.'}
                    </CardDescription>
                </CardHeader>
                                <CardContent>
                                        {/* Type filters */}
                                        <div className="mb-4 flex flex-wrap gap-2">
                                                {[
                                                    { key: 'all', label: 'Toutes' },
                                                    { key: 'terrains', label: 'Terrains' },
                                                    { key: 'promoteurs', label: 'Promoteurs' },
                                                    { key: 'communales', label: 'Communales' },
                                                    { key: 'construction', label: 'Construction' },
                                                ].map(f => (
                                                    <Button key={f.key} variant={filterType === f.key ? 'default' : 'outline'} size="sm" onClick={() => setFilterType(f.key)}>
                                                        {f.label}
                                                    </Button>
                                                ))}
                                        </div>
                    {isSeller && (
                        <div className="mb-6 flex space-x-1 rounded-lg bg-muted p-1">
                            <Button
                                className={`w-full ${activeTab === 'received' ? 'bg-background shadow-sm' : ''}`}
                                variant="ghost"
                                onClick={() => setActiveTab('received')}
                            >
                                <User className="mr-2 h-4 w-4"/> Reçues
                            </Button>
                            {showSentTab && (
                                <Button
                                    className={`w-full ${activeTab === 'sent' ? 'bg-background shadow-sm' : ''}`}
                                    variant="ghost"
                                    onClick={() => setActiveTab('sent')}
                                >
                                    <ShoppingCart className="mr-2 h-4 w-4"/> Mes Achats
                                </Button>
                            )}
                        </div>
                    )}
                    {activeTab === 'sent' ? sentRequestsList : receivedRequestsList}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default MyRequestsPage;





