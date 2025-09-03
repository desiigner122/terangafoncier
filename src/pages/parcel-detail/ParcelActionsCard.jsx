import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Share2, Flag, Banknote, FileSignature } from 'lucide-react';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { useAuth } from '@/context/AuthContext';

const ParcelActionsCard = ({ parcel, onInstallmentClick }) => {
  // toast remplacÃ© par window.safeGlobalToast
  const { user } = useAuth();

  const handleAction = (message) => {
    window.safeGlobalToast({
      title: "Action Simulée",
      description: message,
    });
  };

  const isParticulier = user?.role === 'Particulier';

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle>Actions Rapides</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isParticulier ? (
          <>
            <Button className="w-full" onClick={() => handleAction(`Demande d'achat envoyée pour ${parcel.name}`)}>
              <FileSignature className="mr-2 h-4 w-4" /> Demander à acheter
            </Button>
            {parcel.price > 5000000 && (
              <Button variant="outline" className="w-full" onClick={onInstallmentClick}>
                <Banknote className="mr-2 h-4 w-4" /> Simuler un paiement échelonné
              </Button>
            )}
          </>
        ) : (
          <p className="text-sm text-center text-muted-foreground p-4 bg-muted/50 rounded-md">
            La demande d'achat et de financement est réservée aux utilisateurs avec le rôle "Particulier".
          </p>
        )}
        <div className="flex justify-around items-center pt-2">
          <Button variant="ghost" size="sm" onClick={() => handleAction(`${parcel.name} ajouté aux favoris.`)}>
            <Heart className="mr-1 h-4 w-4" /> Sauvegarder
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleAction(`Lien de partage pour ${parcel.name} copié.`)}>
            <Share2 className="mr-1 h-4 w-4" /> Partager
          </Button>
          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleAction(`Annonce ${parcel.name} signalée.`)}>
            <Flag className="mr-1 h-4 w-4" /> Signaler
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ParcelActionsCard;
