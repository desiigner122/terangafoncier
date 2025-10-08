import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Star, 
  Image,
  DollarSign,
  Wallet,
  Sparkles,
  CheckCircle,
  Loader2
} from 'lucide-react';

/**
 * CreateNFTModal - Modal pour créer un NFT d'une propriété
 * @param {boolean} open - État d'ouverture du modal
 * @param {function} onOpenChange - Callback pour changer l'état
 * @param {object} property - Propriété à transformer en NFT
 */
const CreateNFTModal = ({ open, onOpenChange, property }) => {
  const [nftData, setNftData] = useState({
    name: property?.title || '',
    description: property?.location || '',
    royaltyPercentage: 5,
    price: property?.price || 0
  });
  const [creating, setCreating] = useState(false);
  const [created, setCreated] = useState(false);

  if (!property) return null;

  const handleCreate = async () => {
    setCreating(true);
    
    // Simuler création NFT
    setTimeout(() => {
      setCreating(false);
      setCreated(true);
      
      window.safeGlobalToast({
        title: "NFT Créé !",
        description: `Le NFT "${nftData.name}" a été créé avec succès sur TerangaChain.`
      });

      // Reset après 2 secondes
      setTimeout(() => {
        setCreated(false);
        onOpenChange(false);
      }, 2000);
    }, 3000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (created) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <div className="text-center py-8">
            <div className="relative inline-block mb-4">
              <Star className="h-24 w-24 text-yellow-500 mx-auto" />
              <Sparkles className="h-8 w-8 text-yellow-400 absolute -top-2 -right-2 animate-pulse" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              NFT Créé avec Succès !
            </h3>
            <p className="text-gray-600 mb-4">
              Votre propriété est maintenant un NFT sur TerangaChain
            </p>
            <Badge className="bg-green-600 text-white">
              <CheckCircle className="h-4 w-4 mr-1" />
              Disponible sur OpenSea
            </Badge>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-yellow-600" />
            Créer un NFT de Propriété
          </DialogTitle>
          <DialogDescription>
            Transformez votre propriété en NFT sur la blockchain TerangaChain
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Preview Card */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 bg-gray-200 rounded-lg flex items-center justify-center">
                <Image className="h-10 w-10 text-gray-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-lg text-gray-900">{property.title}</h4>
                <p className="text-sm text-gray-600">{property.location}</p>
                <Badge className="mt-2 bg-purple-600">NFT Collection</Badge>
              </div>
            </div>
          </div>

          {/* NFT Details Form */}
          <div className="space-y-3">
            <div>
              <Label htmlFor="nft-name">Nom du NFT</Label>
              <Input
                id="nft-name"
                value={nftData.name}
                onChange={(e) => setNftData({ ...nftData, name: e.target.value })}
                placeholder="Nom unique du NFT"
              />
            </div>

            <div>
              <Label htmlFor="nft-description">Description</Label>
              <Input
                id="nft-description"
                value={nftData.description}
                onChange={(e) => setNftData({ ...nftData, description: e.target.value })}
                placeholder="Description du NFT"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="nft-royalty">Royalties (%)</Label>
                <Input
                  id="nft-royalty"
                  type="number"
                  min="0"
                  max="10"
                  value={nftData.royaltyPercentage}
                  onChange={(e) => setNftData({ ...nftData, royaltyPercentage: e.target.value })}
                />
                <p className="text-xs text-gray-500 mt-1">Commission sur reventes futures</p>
              </div>

              <div>
                <Label htmlFor="nft-price">Prix Initial</Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="nft-price"
                    type="text"
                    value={formatCurrency(nftData.price)}
                    disabled
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Blockchain Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-2">
            <h4 className="font-semibold text-sm text-blue-900">Informations Blockchain</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-gray-600">Réseau :</span>
                <span className="font-medium ml-2">TerangaChain</span>
              </div>
              <div>
                <span className="text-gray-600">Standard :</span>
                <span className="font-medium ml-2">ERC-721</span>
              </div>
              <div>
                <span className="text-gray-600">Gas estimé :</span>
                <span className="font-medium ml-2">~0.002 ETH</span>
              </div>
              <div>
                <span className="text-gray-600">Temps :</span>
                <span className="font-medium ml-2">~30 secondes</span>
              </div>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-yellow-800">
              ⚠️ La création du NFT est irréversible. Assurez-vous que toutes les informations sont correctes.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={creating}>
            Annuler
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700" 
            onClick={handleCreate}
            disabled={creating}
          >
            {creating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Création en cours...
              </>
            ) : (
              <>
                <Wallet className="h-4 w-4 mr-2" />
                Créer le NFT
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateNFTModal;
