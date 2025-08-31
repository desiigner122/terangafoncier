
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from '@/components/ui/spinner';
import { Check, X, ShieldOff, Eye } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';

const UserVerificationDetailsDialog = ({ user, documents }) => (
    <DialogContent>
        <DialogHeader>
            <DialogTitle>Détails pour {user.full_name}</DialogTitle>
            <DialogDescription>Vérifiez les informations de l'utilisateur avant l'approbation.</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-2 text-sm max-h-[60vh] overflow-y-auto">
            <p><strong>Nom:</strong> {user.full_name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Rôle demandé:</strong> {user.role}</p>
            <p><strong>Date d'inscription:</strong> {format(new Date(user.created_at), 'd MMMM yyyy, HH:mm', { locale: fr })}</p>
            {documents.length > 0 ? (
                <div>
                    <strong className="block mt-4 mb-2">Documents soumis:</strong>
                    <ul className="space-y-2">
                       {documents.map((doc) => (
                         <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                           <span className="font-medium capitalize">{doc.document_type.replace(/_/g, ' ')}</span>
                           <Button asChild variant="outline" size="sm">
                               <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                   <Eye className="mr-2 h-4 w-4" /> Voir
                               </a>
                           </Button>
                         </li>
                       ))}
                    </ul>
                </div>
            ) : (
                <p className="text-muted-foreground mt-4">Aucun document n'a été soumis par cet utilisateur.</p>
            )}
        </div>
        <DialogFooter>
            <DialogClose asChild>
                <Button variant="secondary">Fermer</Button>
            </DialogClose>
        </DialogFooter>
    </DialogContent>
);

const AdminUserVerificationsPage = () => {
    const [users, setUsers] = useState([]);
    const [documents, setDocuments] = useState({});
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchUnverifiedUsers = async () => {
            setLoading(true);
            const { data: usersData, error: usersError } = await supabase
                .from('users')
                .select('*, user_auth:id(email)')
                .in('verification_status', ['unverified', 'pending']);

            if (usersError) {
                console.error("Error fetching users:", usersError);
                toast({ title: 'Erreur', description: 'Impossible de charger les utilisateurs.', variant: 'destructive' });
                setLoading(false);
                return;
            }
            const formattedUsers = usersData.map(u => ({ ...u, email: u.user_auth?.email || 'Email non trouvé' }));
            setUsers(formattedUsers);

            const userIds = formattedUsers.map(u => u.id);
            if (userIds.length > 0) {
                const { data: docsData, error: docsError } = await supabase
                    .from('documents')
                    .select('*')
                    .in('user_id', userIds);
                
                if (docsError) {
                    console.error("Error fetching documents:", docsError);
                } else {
                    const docsByUserId = docsData.reduce((acc, doc) => {
                        if (!acc[doc.user_id]) acc[doc.user_id] = [];
                        acc[doc.user_id].push(doc);
                        return acc;
                    }, {});
                    setDocuments(docsByUserId);
                }
            }
            setLoading(false);
        };
        fetchUnverifiedUsers();
    }, [toast]);
    
    const handleVerificationAction = async (userId, newStatus) => {
        const user = users.find(u => u.id === userId);
        const { error } = await supabase
            .from('users')
            .update({ verification_status: newStatus })
            .eq('id', userId);

        if (error) {
            toast({ title: 'Erreur', description: 'La mise à jour a échoué.', variant: 'destructive' });
        } else {
            setUsers(prevUsers => prevUsers.filter(u => u.id !== userId));
            toast({
                title: 'Action effectuée',
                description: `Le compte de ${user?.full_name} a été ${newStatus === 'verified' ? 'approuvé' : 'rejeté'}.`,
            });
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
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-12 px-4"
        >
            <Card>
                <CardHeader>
                    <CardTitle className="text-3xl font-bold">Vérifications des Nouveaux Comptes</CardTitle>
                    <CardDescription>Approuvez ou rejetez les nouveaux utilisateurs inscrits sur la plateforme.</CardDescription>
                </CardHeader>
                <CardContent>
                    {users.length > 0 ? (
                        <ul className="space-y-4">
                            {users.map(user => (
                                <li key={user.id} className="border p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex items-center gap-4 flex-grow">
                                        <Avatar className="h-12 w-12">
                                            <AvatarImage src={user.avatar_url} />
                                            <AvatarFallback>{user.full_name?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-semibold text-primary">{user.full_name}</p>
                                            <p className="text-sm text-muted-foreground">{user.email}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Inscrit le: {format(new Date(user.created_at), 'd MMMM yyyy', { locale: fr })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="sm" variant="outline"><Eye className="h-4 w-4 mr-1"/>Détails & Docs</Button>
                                            </DialogTrigger>
                                            <UserVerificationDetailsDialog user={user} documents={documents[user.id] || []} />
                                        </Dialog>
                                        <Button size="sm" variant="success" onClick={() => handleVerificationAction(user.id, 'verified')}>
                                            <Check className="h-4 w-4 mr-1"/> Approuver
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleVerificationAction(user.id, 'rejected')}>
                                            <X className="h-4 w-4 mr-1"/> Rejeter
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12">
                             <ShieldOff className="mx-auto h-12 w-12 text-muted-foreground" />
                            <h3 className="mt-2 text-lg font-medium">Aucune vérification en attente</h3>
                            <p className="mt-1 text-sm text-muted-foreground">
                                Tous les nouveaux comptes ont été traités.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default AdminUserVerificationsPage;
