
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  LandPlot, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  ArrowRight, 
  Edit, 
  Trash2, 
  UploadCloud, 
  Banknote, 
  XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/spinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContextFixed';
import { supabase } from '@/lib/customSupabaseClient';

const getStatusInfo = (status) => {
    switch (status) {
      case 'pending_verification': return { variant: 'warning', icon: Clock, text: 'En vérification' };
      case 'available': return { variant: 'success', icon: CheckCircle, text: 'Publié' };
      case 'rejected': return { variant: 'destructive', icon: AlertTriangle, text: 'Rejeté' };
      case 'sold': return { variant: 'info', icon: Banknote, text: 'Vendu' };
      default: return { variant: 'secondary', icon: XCircle, text: status || 'Inconnu' };
    }
};

const getTypeIcon = (type) => {
    return type === 'Terrain' ? <LandPlot className="mr-1.5 h-4 w-4" /> : <Building className="mr-1.5 h-4 w-4" />;
};

const formatPrice = (price) => {
   if(!price) return "N/A";
   return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price);
}

const MyListingsPage = () => {
   const { user } = useSupabaseAuth();
   const [isLoading, setIsLoading] = useState(true);
   const [listings, setListings] = useState([]);
   // toast remplacÃ© par window.safeGlobalToast

   useEffect(() => {
    const fetchListings = async () => {
        if (!user) return;
        setIsLoading(true);
        const { data, error } = await supabase
            .from('parcels')
            .select('*')
            .eq('seller_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error("Error fetching listings:", error);
            window.safeGlobalToast({ title: "Erreur", description: "Impossible de charger vos annonces.", variant: "destructive" });
        } else {
            setListings(data);
        }
        setIsLoading(false);
    };
    fetchListings();
   }, [user, toast]);

   const handleDelete = async (listingId) => {
       const { error } = await supabase.from('parcels').delete().eq('id', listingId);
       if (error) {
           window.safeGlobalToast({ title: 'Erreur', description: 'Impossible de supprimer le bien.', variant: 'destructive' });
       } else {
           setListings(prev => prev.filter(l => l.id !== listingId));
           window.safeGlobalToast({ title: 'Bien supprimé', description: `Votre bien a été retiré.` });
       }
   };
   
   const handleEdit = (listing) => {
      window.safeGlobalToast({title: "Fonctionnalité à venir", description: "La modification des annonces sera bientôt disponible."})
   }

   const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
   const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-6 container mx-auto py-8 px-4"
    >
      <h1 className="text-3xl font-bold">Mes Biens en Vente</h1>

      {isLoading ? (
         <div className="flex justify-center items-center py-20"><LoadingSpinner size="large" /></div>
      ) : listings.length > 0 ? (
        <div className="space-y-4">
          {listings.map((listing) => {
             const statusInfo = getStatusInfo(listing.status);
             const StatusIcon = statusInfo.icon;
             return (
                <motion.div key={listing.id} variants={itemVariants}>
                   <Card className="hover:shadow-md transition-shadow border">
                      <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                              <CardTitle className="text-lg flex items-center">
                                 {getTypeIcon(listing.type)} {listing.name}
                              </CardTitle>
                              <Badge variant={statusInfo.variant} className="whitespace-nowrap w-fit">
                                 <StatusIcon className="mr-1.5 h-4 w-4" />
                                 {statusInfo.text}
                              </Badge>
                          </div>
                          <CardDescription>
                             ID: {listing.reference} | Soumis le: {new Date(listing.created_at).toLocaleDateString('fr-FR')} | Prix: {formatPrice(listing.price)}
                          </CardDescription>
                      </CardHeader>
                      {listing.status === 'rejected' && (
                        <CardContent>
                          <p className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">Votre annonce a été rejetée. Raison simulée : FileText manquant. Veuillez vérifier vos FileTexts ou contacter le support.</p>
                        </CardContent>
                      )}
                      <CardFooter className="pt-4 flex flex-wrap gap-2 justify-end">
                         {listing.status === 'available' && (
                             <Button variant="link" size="sm" asChild>
                                <Link to={`/parcelles/${listing.id}`}>Voir l'annonce <ArrowRight className="ml-1 h-3 w-3"/></Link>
                             </Button>
                         )}
                         <Button variant="outline" size="sm" onClick={() => handleEdit(listing)}>
                            <Edit className="mr-2 h-4 w-4"/> Modifier
                         </Button>
                         <AlertDialog>
                           <AlertDialogTrigger asChild>
                             <Button variant="destructive" size="sm">
                               <Trash2 className="mr-2 h-4 w-4"/> Supprimer
                             </Button>
                           </AlertDialogTrigger>
                           <AlertDialogContent>
                             <AlertDialogHeader>
                               <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                               <AlertDialogDescription>
                                 Êtes-vous sûr de vouloir supprimer définitivement ce bien ({listing.name}) ? Cette action est irréversible.
                               </AlertDialogDescription>
                             </AlertDialogHeader>
                             <AlertDialogFooter>
                               <AlertDialogCancel>Annuler</AlertDialogCancel>
                               <AlertDialogAction onClick={() => handleDelete(listing.id)}>Supprimer</AlertDialogAction>
                             </AlertDialogFooter>
                           </AlertDialogContent>
                         </AlertDialog>
                      </CardFooter>
                   </Card>
                </motion.div>
             );
          })}
        </div>
      ) : (
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           className="text-center py-16 bg-card border rounded-lg shadow-sm"
         >
             <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
             <h2 className="text-xl font-semibold mb-2">Aucun bien soumis</h2>
             <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Vous n'avez pas encore proposé de bien à la vente sur notre plateforme.
             </p>
             <Button asChild>
                 <Link to="/add-parcel">
                    <UploadCloud className="mr-2 h-4 w-4"/> Proposer un Bien
                 </Link>
             </Button>
         </motion.div>
      )}
    </motion.div>
  );
};

export default MyListingsPage;


