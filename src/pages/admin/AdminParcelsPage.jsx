
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, Clock, XCircle, FileText, Trash2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { LoadingSpinner } from '@/components/ui/spinner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { supabase } from '@/lib/supabaseClient';
import { Link } from 'react-router-dom';

const ParcelDocumentsDialog = ({ parcel }) => {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDocuments = async () => {
            setLoading(true);
            const { data, error } = await supabase
                .from('documents')
                .select('*')
                .eq('parcel_id', parcel.id);
            
            if (error) {
                console.error("Error fetching documents:", error);
            } else {
                setDocuments(data);
            }
            setLoading(false);
        };
        fetchDocuments();
    }, [parcel.id]);

    return (
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle>Documents pour {parcel.reference}</DialogTitle>
                <DialogDescription>Consultez les documents justificatifs pour cette annonce.</DialogDescription>
            </DialogHeader>
            <div className="py-4 max-h-96 overflow-y-auto">
                {loading ? <LoadingSpinner /> : documents.length > 0 ? (
                    <ul className="space-y-2">
                        {documents.map((doc) => (
                           <li key={doc.id} className="flex items-center justify-between p-2 border rounded-md">
                               <span className="text-sm font-medium capitalize">{doc.document_type.replace(/_/g, ' ')}</span>
                               <Button asChild variant="outline" size="sm">
                                   <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                       <Eye className="mr-2 h-4 w-4" /> Voir
                                   </a>
                               </Button>
                           </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-muted-foreground">Aucun document n'a été fourni pour cette parcelle.</p>
                )}
            </div>
            <DialogFooter>
                <DialogClose asChild>
                    <Button variant="secondary">Fermer</Button>
                </DialogClose>
            </DialogFooter>
        </DialogContent>
    );
};

const AdminParcelsPage = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  // toast remplacÃ© par window.safeGlobalToast

  useEffect(() => {
    const fetchParcels = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('parcels')
            .select('*, seller:seller_id(full_name)');
        
        if (error) {
            console.error("Error fetching parcels:", error);
            window.safeGlobalToast({ title: 'Erreur', description: 'Impossible de charger les annonces.', variant: 'destructive' });
        } else {
            setParcels(data.map(p => ({...p, sellerName: p.seller?.full_name || 'Vendeur Inconnu'})));
        }
        setLoading(false);
    };
    fetchParcels();
  }, [toast]);

  const handleStatusChange = async (parcelId, newStatus) => {
    const { error } = await supabase
        .from('parcels')
        .update({ status: newStatus })
        .eq('id', parcelId);

    if (error) {
        window.safeGlobalToast({ title: 'Erreur', description: 'La mise à jour a échoué.', variant: 'destructive' });
    } else {
        setParcels(prev => prev.map(p => p.id === parcelId ? {...p, status: newStatus} : p));
        window.safeGlobalToast({ title: 'Succès', description: `Le statut de l'annonce a été mis à jour.` });
    }
  };
  
  const handleDelete = async (parcelId) => {
    const { error } = await supabase
        .from('parcels')
        .delete()
        .eq('id', parcelId);

    if (error) {
        window.safeGlobalToast({ title: 'Erreur', description: 'La suppression a échoué.', variant: 'destructive' });
    } else {
        setParcels(prev => prev.filter(p => p.id !== parcelId));
        window.safeGlobalToast({ title: 'Succès', description: `L'annonce a été supprimée.` });
    }
  };
  
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Disponible': return <Badge variant="success"><CheckCircle className="mr-1 h-3 w-3" />Disponible</Badge>;
      case 'En attente de validation': return <Badge variant="warning"><Clock className="mr-1 h-3 w-3" />En attente</Badge>;
      case 'Rejetée': return <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejetée</Badge>;
      case 'Vendue': return <Badge variant="secondary">Vendue</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };
  
  const renderParcelsTable = (parcelList) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Annonce</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendeur</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix (FCFA)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
          {parcelList.length > 0 ? parcelList.map((parcel) => (
            <tr key={parcel.id}>
              <td className="px-6 py-4 whitespace-nowrap"><div className="font-medium">{parcel.name}</div><div className="text-xs text-muted-foreground">{parcel.reference}</div></td>
              <td className="px-6 py-4 whitespace-nowrap">{parcel.sellerName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{parcel.price?.toLocaleString('fr-SN')}</td>
              <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(parcel.status)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                {parcel.status === 'En attente de validation' && (
                  <>
                    <Button size="xs" variant="success" onClick={() => handleStatusChange(parcel.id, 'Disponible')}>Activer</Button>
                    <Button size="xs" variant="destructive" onClick={() => handleStatusChange(parcel.id, 'Rejetée')}>Rejeter</Button>
                  </>
                )}
                 <Dialog>
                   <DialogTrigger asChild>
                     <Button size="xs" variant="outline"><FileText className="mr-1 h-3 w-3" /> Docs</Button>
                   </DialogTrigger>
                   <ParcelDocumentsDialog parcel={parcel} />
                 </Dialog>
                 <AlertDialog>
                   <AlertDialogTrigger asChild>
                     <Button size="xs" variant="destructive-outline"><Trash2 className="h-3 w-3" /></Button>
                   </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader><AlertDialogTitle>Supprimer l'annonce?</AlertDialogTitle><AlertDialogDescription>Action irréversible.</AlertDialogDescription></AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(parcel.id)}>Confirmer</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                 </AlertDialog>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="5" className="text-center p-8 text-muted-foreground">Aucune annonce dans cette catégorie.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );

  if (loading) return <div className="flex items-center justify-center h-full"><LoadingSpinner size="large" /></div>;

  const filteredParcels = parcels.filter(p => p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.reference?.toLowerCase().includes(searchTerm.toLowerCase()) || p.sellerName?.toLowerCase().includes(searchTerm.toLowerCase()));
  const pendingParcels = filteredParcels.filter(p => p.status === 'En attente de validation');
  const activeParcels = filteredParcels.filter(p => p.status === 'Disponible');
  const otherParcels = filteredParcels.filter(p => !['En attente de validation', 'Disponible'].includes(p.status));

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Gestion des Annonces</h1>
      </div>
      <Card>
        <CardHeader>
          <div className="flex space-x-2 pt-2">
            <div className="relative flex-grow"><Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" /><Input type="search" placeholder="Rechercher par nom, référence, vendeur..." className="pl-8 w-full" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">En attente <Badge variant="secondary" className="ml-2">{pendingParcels.length}</Badge></TabsTrigger>
              <TabsTrigger value="active">Actives <Badge variant="secondary" className="ml-2">{activeParcels.length}</Badge></TabsTrigger>
              <TabsTrigger value="others">Autres <Badge variant="secondary" className="ml-2">{otherParcels.length}</Badge></TabsTrigger>
            </TabsList>
            <TabsContent value="pending" className="pt-4">{renderParcelsTable(pendingParcels)}</TabsContent>
            <TabsContent value="active" className="pt-4">{renderParcelsTable(activeParcels)}</TabsContent>
            <TabsContent value="others" className="pt-4">{renderParcelsTable(otherParcels)}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AdminParcelsPage;
