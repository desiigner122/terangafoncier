
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ShoppingCart, CalendarPlus, PercentSquare, Landmark, FileSignature, Ban } from 'lucide-react';
import InstallmentPaymentModal from '@/components/parcel-detail/InstallmentPaymentModal';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Forbid, Can } from '@/components/auth/RoleBasedGuard';

const ParcelActionsCard = ({ parcel, onRequestInfo, onInitiateBuy, onRequestVisit }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMunicipal = parcel.ownerType === 'Mairie';
  const { user } = useAuth();
  
  // A user cannot buy their own parcel
  const isOwner = user?.id === parcel.seller_id;

  const forbiddenBuyRoles = ['Mairie', 'Vendeur Particulier', 'Vendeur Pro', 'Admin', 'Agent Foncier'];

  const renderPrivateSellerActions = () => (
    <div className="flex flex-col gap-3">
      <Forbid forbiddenRoles={isOwner ? [user.role] : []} tooltipMessage="Vous ne pouvez pas interagir avec votre propre annonce.">
        <Button size="lg" className="w-full" onClick={onRequestInfo}>
          <Info className="mr-2 h-4 w-4"/> Demander Plus d'Infos
        </Button>
      </Forbid>

      <Forbid forbiddenRoles={isOwner ? [user.role] : forbiddenBuyRoles} tooltipMessage="Seuls les particuliers et investisseurs peuvent initier un achat.">
          <Button size="lg" className="w-full bg-gradient-to-r from-green-600 to-accent_brand text-white hover:opacity-90" onClick={onInitiateBuy}>
            <ShoppingCart className="mr-2 h-4 w-4"/> Initier l'Achat
          </Button>
      </Forbid>

      <Forbid forbiddenRoles={isOwner ? [user.role] : []}>
        <Button size="lg" variant="outline" className="w-full" onClick={onRequestVisit}>
          <CalendarPlus className="mr-2 h-4 w-4"/> Demander une Visite
        </Button>
      </Forbid>

      {parcel.isEligibleForInstallments && (
        <Forbid forbiddenRoles={isOwner ? [user.role] : forbiddenBuyRoles} tooltipMessage="Cette action est réservée aux acheteurs potentiels.">
          <Button size="lg" variant="secondary" className="w-full" onClick={() => setIsModalOpen(true)}>
            <PercentSquare className="mr-2 h-4 w-4"/> Demander un Financement
          </Button>
        </Forbid>
      )}
    </div>
  );

  const renderMunicipalActions = () => (
    <div className="flex flex-col gap-3">
       <Forbid forbiddenRoles={['Mairie', 'Vendeur Particulier', 'Vendeur Pro']} tooltipMessage="Seuls les particuliers peuvent faire cette demande.">
          <Button size="lg" className="w-full" asChild>
            <Link to={`/request-municipal-land?zone=${parcel.zone}`}>
              <FileSignature className="mr-2 h-4 w-4"/> Faire une Demande d'Attribution
            </Link>
          </Button>
       </Forbid>
      <Button size="lg" variant="outline" className="w-full" onClick={onRequestInfo}>
        <Info className="mr-2 h-4 w-4"/> Contacter la Mairie
      </Button>
    </div>
  );
  
  const renderForbidden = () => (
     <div className="text-center p-4 bg-muted/50 rounded-md">
        <Ban className="mx-auto h-10 w-10 text-muted-foreground mb-2"/>
        <p className="text-sm font-medium text-muted-foreground">Action non disponible</p>
        <p className="text-xs text-muted-foreground">Cette parcelle n'est plus disponible à la vente.</p>
     </div>
  );

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
          <CardDescription>
            {isMunicipal ? `Interagissez avec la Mairie de ${parcel.zone}.` : 'Interagissez avec cette parcelle.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {parcel.status === 'Disponible' || parcel.status === 'Attribution sur demande' ? (
            isMunicipal ? renderMunicipalActions() : renderPrivateSellerActions()
          ) : (
            renderForbidden()
          )}
        </CardContent>
      </Card>
      
      {parcel.isEligibleForInstallments && !isMunicipal && (
        <InstallmentPaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          parcelPrice={parcel.price}
          parcelName={parcel.name}
        />
      )}
    </>
  );
};

export default ParcelActionsCard;
