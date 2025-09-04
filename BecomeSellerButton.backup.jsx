
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/AuthContext';
// useToast import supprimé - utilisation window.safeGlobalToast
import { UploadCloud, Award, UserPlus } from 'lucide-react';
import { sampleSystemRequests } from '@/data/systemRequestsData';

const BecomeSellerButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [files, setFiles] = useState({ identity: null, residence: null });
  
  // Protection contre useAuth qui peut retourner null
  const authData = useAuth();
  const user = authData?.user || authData?.profile || null;
  
  // Si pas d'utilisateur, ne pas afficher le composant
  if (!user) {
    return null;
  }

  const handleFileChange = (e) => {
    const { name, files: inputFiles } = e.target;
    if (inputFiles.length > 0) {
      setFiles((prev) => ({ ...prev, [name]: inputFiles[0] }));
    }
  };

      const handleSubmit = async () => {
        if (!files.identity || !files.residence) {
          window.safeGlobalToast({
            title: 'Documents requis',
            description: 'Veuillez téléverser votre pièce d\'identité et un justificatif de domicile.',
            variant: 'destructive',
          });
          return;
        }

        setIsSubmitting(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        
        try {
          // In a real app, this would be a call to your backend.
          // Here, we add it to our simulated requests data.
          const newRequest = {
            id: `SYSREQ-${Date.now()}`,
            type: 'account_upgrade',
            status: 'pending',
            user: {
                id: user.id,
                name: user.name,
                currentRole: user.role,
            },
            details: {
                requestedRole: 'Vendeur Particulier',
                files: {
                    identity: files.identity.name,
                    residence: files.residence.name,
                }
            },
            created_at: new Date().toISOString(),
          };
          
          sampleSystemRequests.push(newRequest);

          window.safeGlobalToast({
            title: 'Demande envoyée !',
            description: 'Votre demande pour devenir vendeur a été soumise pour vérification. Vous serez notifié de la décision.',
            className: 'bg-green-500 text-white',
          });
          setIsModalOpen(false);

        } catch (error) {
          window.safeGlobalToast({
            title: 'Erreur',
            description: 'Une erreur est survenue lors de la soumission de votre demande.',
            variant: 'destructive',
          });
        } finally {
          setIsSubmitting(false);
        }
      };

      if (user?.role.includes('Vendeur')) {
        return null;
      }

      return (
        <>
          <Button onClick={() => setIsModalOpen(true)} className="bg-white text-primary hover:bg-gray-100">
            <UserPlus className="mr-2 h-4 w-4" />
            Devenir Vendeur
          </Button>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Award />Devenir Vendeur Vérifié</DialogTitle>
                <DialogDescription>
                  Pour garantir la sécurité de la plateforme, veuillez fournir les documents suivants. Votre statut sera mis à jour après vérification par notre équipe.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="identity" className="text-right col-span-1 text-sm font-medium">
                    Pièce d'identité
                  </label>
                  <Input id="identity" name="identity" type="file" className="col-span-3" onChange={handleFileChange} />
                </div>
                 {files.identity && <p className="text-xs text-green-600 col-start-2 col-span-3">{files.identity.name}</p>}
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="residence" className="text-right col-span-1 text-sm font-medium">
                    Justificatif de domicile
                  </label>
                  <Input id="residence" name="residence" type="file" className="col-span-3" onChange={handleFileChange} />
                </div>
                {files.residence && <p className="text-xs text-green-600 col-start-2 col-span-3">{files.residence.name}</p>}
              </div>
              <DialogFooter>
                <Button onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi...' : <><UploadCloud className="mr-2 h-4 w-4" /> Soumettre pour vérification</>}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      );
    };

    export default BecomeSellerButton;
  
