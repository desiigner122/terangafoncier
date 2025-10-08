import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  Copy,
  Check,
  MessageCircle
} from 'lucide-react';

/**
 * Modal de partage social pour les propriétés
 * 
 * @example
 * <SharePropertyModal
 *   open={shareModalOpen}
 *   onOpenChange={setShareModalOpen}
 *   property={property}
 *   shareUrl={`${window.location.origin}/parcelles/${property.id}`}
 * />
 */
const SharePropertyModal = ({ open, onOpenChange, property, shareUrl }) => {
  const [copied, setCopied] = useState(false);

  if (!property) return null;

  const shareMessage = `Découvrez cette propriété : ${property.title || property.name}`;
  const encodedMessage = encodeURIComponent(shareMessage);
  const encodedUrl = encodeURIComponent(shareUrl);

  // Liens de partage
  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodedMessage}%20${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodeURIComponent(property.title || property.name)}&body=${encodedMessage}%20${encodedUrl}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      
      // Toast notification
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Lien copié !",
          description: "Le lien a été copié dans le presse-papier."
        });
      }

      // Reset après 2 secondes
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erreur copie:', error);
      if (window.safeGlobalToast) {
        window.safeGlobalToast({
          title: "Erreur",
          description: "Impossible de copier le lien.",
          variant: "destructive"
        });
      }
    }
  };

  const handleShareClick = (platform) => {
    // Tracking analytics (optionnel)
    if (window.gtag) {
      window.gtag('event', 'share', {
        method: platform,
        content_type: 'property',
        content_id: property.id
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Partager la propriété</DialogTitle>
          <DialogDescription>
            {property.title || property.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Boutons réseaux sociaux */}
          <div className="grid grid-cols-2 gap-3">
            {/* WhatsApp */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                handleShareClick('whatsapp');
                window.open(shareLinks.whatsapp, '_blank');
              }}
            >
              <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
              WhatsApp
            </Button>

            {/* Facebook */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                handleShareClick('facebook');
                window.open(shareLinks.facebook, '_blank');
              }}
            >
              <Facebook className="mr-2 h-4 w-4 text-blue-600" />
              Facebook
            </Button>

            {/* Twitter */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                handleShareClick('twitter');
                window.open(shareLinks.twitter, '_blank');
              }}
            >
              <Twitter className="mr-2 h-4 w-4 text-sky-500" />
              Twitter
            </Button>

            {/* LinkedIn */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => {
                handleShareClick('linkedin');
                window.open(shareLinks.linkedin, '_blank');
              }}
            >
              <Linkedin className="mr-2 h-4 w-4 text-blue-700" />
              LinkedIn
            </Button>

            {/* Email */}
            <Button
              variant="outline"
              className="w-full justify-start col-span-2"
              onClick={() => {
                handleShareClick('email');
                window.location.href = shareLinks.email;
              }}
            >
              <Mail className="mr-2 h-4 w-4 text-gray-600" />
              Envoyer par email
            </Button>
          </div>

          {/* Copier le lien */}
          <div className="space-y-2">
            <Label htmlFor="share-url">Ou copiez le lien</Label>
            <div className="flex gap-2">
              <Input
                id="share-url"
                value={shareUrl}
                readOnly
                className="flex-1"
              />
              <Button
                type="button"
                variant={copied ? "default" : "outline"}
                size="icon"
                onClick={handleCopyLink}
              >
                {copied ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Prévisualisation (optionnel) */}
          {property.images && property.images.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex gap-3">
                {property.images[0] && (
                  <img
                    src={property.images[0]}
                    alt={property.title || property.name}
                    className="w-20 h-20 object-cover rounded"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">
                    {property.title || property.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {property.location}
                  </p>
                  {property.price && (
                    <p className="text-sm font-semibold text-orange-600 mt-1">
                      {new Intl.NumberFormat('fr-SN', {
                        style: 'currency',
                        currency: 'XOF',
                        minimumFractionDigits: 0
                      }).format(property.price)}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SharePropertyModal;
