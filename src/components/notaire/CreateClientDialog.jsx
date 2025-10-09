import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  FileText,
  X,
  AlertCircle
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CreateClientDialog = ({ open, onOpenChange, onClientCreated, notaireId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    client_name: '',
    client_type: 'individual',
    email: '',
    phone: '',
    address: '',
    city: '',
    notes: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error on input change
  };

  const validateForm = () => {
    if (!formData.client_name.trim()) {
      setError('Le nom du client est requis');
      return false;
    }

    if (!formData.email.trim()) {
      setError('L\'email est requis');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email invalide');
      return false;
    }

    if (!formData.phone.trim()) {
      setError('Le téléphone est requis');
      return false;
    }

    // Phone validation (Senegalese format)
    const phoneRegex = /^(\+221)?[0-9]{9}$/;
    const cleanPhone = formData.phone.replace(/\s/g, '');
    if (!phoneRegex.test(cleanPhone)) {
      setError('Numéro de téléphone invalide (format: +221XXXXXXXXX ou 9 chiffres)');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    try {
      // Import dynamique du service
      const NotaireSupabaseService = (await import('@/services/NotaireSupabaseService')).default;

      // Préparer les données
      const clientData = {
        notaire_id: notaireId,
        client_name: formData.client_name.trim(),
        client_type: formData.client_type,
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        address: formData.address.trim() || null,
        city: formData.city.trim() || null,
        notes: formData.notes.trim() || null,
        total_transactions: 0,
        total_revenue: 0,
        satisfaction_score: null,
        client_status: 'active'
      };

      // Créer le client
      const result = await NotaireSupabaseService.createClient(notaireId, clientData);

      if (result.success) {
        window.safeGlobalToast({
          title: "Client créé",
          description: `${formData.client_name} a été ajouté avec succès`,
          variant: "success"
        });

        // Réinitialiser le formulaire
        setFormData({
          client_name: '',
          client_type: 'individual',
          email: '',
          phone: '',
          address: '',
          city: '',
          notes: ''
        });

        // Callback pour rafraîchir la liste
        if (onClientCreated) {
          onClientCreated(result.data);
        }

        // Fermer le dialog
        onOpenChange(false);
      } else {
        setError(result.error || 'Erreur lors de la création du client');
      }
    } catch (error) {
      console.error('Erreur création client:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      client_name: '',
      client_type: 'individual',
      email: '',
      phone: '',
      address: '',
      city: '',
      notes: ''
    });
    setError('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <User className="h-6 w-6 text-amber-600" />
            Nouveau Client
          </DialogTitle>
          <DialogDescription>
            Ajoutez un nouveau client à votre base de données CRM
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Type de client */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-500" />
              Type de client *
            </Label>
            <Select
              value={formData.client_type}
              onValueChange={(value) => handleInputChange('client_type', value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="individual">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Particulier
                  </div>
                </SelectItem>
                <SelectItem value="corporate">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Entreprise
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nom du client */}
          <div className="space-y-2">
            <Label htmlFor="client_name" className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              Nom complet {formData.client_type === 'corporate' ? '/ Raison sociale' : ''} *
            </Label>
            <Input
              id="client_name"
              placeholder={formData.client_type === 'corporate' ? 'Ex: Société IMMOSN' : 'Ex: Amadou Ba'}
              value={formData.client_name}
              onChange={(e) => handleInputChange('client_name', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Email et Téléphone (côte à côte) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-500" />
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="client@email.sn"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                Téléphone *
              </Label>
              <Input
                id="phone"
                placeholder="+221 77 123 45 67"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Adresse */}
          <div className="space-y-2">
            <Label htmlFor="address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Adresse complète
            </Label>
            <Input
              id="address"
              placeholder="Ex: Rue 15, Point E"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Ville */}
          <div className="space-y-2">
            <Label htmlFor="city" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-500" />
              Ville
            </Label>
            <Select
              value={formData.city}
              onValueChange={(value) => handleInputChange('city', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une ville" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dakar">Dakar</SelectItem>
                <SelectItem value="Pikine">Pikine</SelectItem>
                <SelectItem value="Guédiawaye">Guédiawaye</SelectItem>
                <SelectItem value="Rufisque">Rufisque</SelectItem>
                <SelectItem value="Thiès">Thiès</SelectItem>
                <SelectItem value="Saint-Louis">Saint-Louis</SelectItem>
                <SelectItem value="Kaolack">Kaolack</SelectItem>
                <SelectItem value="Ziguinchor">Ziguinchor</SelectItem>
                <SelectItem value="Mbour">Mbour</SelectItem>
                <SelectItem value="Touba">Touba</SelectItem>
                <SelectItem value="Autre">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              Notes supplémentaires
            </Label>
            <Textarea
              id="notes"
              placeholder="Informations complémentaires sur le client..."
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              disabled={isLoading}
              rows={3}
            />
          </div>

          {/* Badge informatif */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Les champs marqués d'un astérisque (*) sont obligatoires. Le client sera automatiquement marqué comme "Actif".
            </AlertDescription>
          </Alert>

          {/* Erreur */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            <X className="h-4 w-4 mr-2" />
            Annuler
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-amber-600 hover:bg-amber-700"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Création...
              </>
            ) : (
              <>
                <User className="h-4 w-4 mr-2" />
                Créer le client
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateClientDialog;
