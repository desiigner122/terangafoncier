import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  User,
  DollarSign,
  MapPin,
  Calendar,
  ChevronRight,
  ChevronLeft,
  X,
  AlertCircle,
  Check,
  Building,
  Users,
  Scale
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
import { Progress } from '@/components/ui/progress';

const CreateActDialog = ({ open, onOpenChange, onActCreated, notaireId }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    // Étape 1: Informations générales
    act_type: '',
    client_name: '',
    property_address: '',
    estimated_completion_date: '',
    
    // Étape 2: Parties impliquées
    seller_name: '',
    seller_id: '',
    buyer_name: '',
    buyer_id: '',
    witnesses: '',
    
    // Étape 3: Valeur et honoraires
    act_value: '',
    notary_fees: '',
    registration_fees: '',
    notes: ''
  });

  const actTypes = [
    { value: 'vente_immobiliere', label: 'Vente Immobilière', icon: Building },
    { value: 'vente_terrain', label: 'Vente de Terrain', icon: MapPin },
    { value: 'succession', label: 'Succession', icon: Users },
    { value: 'donation', label: 'Donation', icon: FileText },
    { value: 'hypotheque', label: 'Hypothèque', icon: DollarSign },
    { value: 'acte_propriete', label: 'Acte de Propriété', icon: FileText },
    { value: 'servitude', label: 'Servitude', icon: Scale },
    { value: 'partage', label: 'Partage', icon: Users },
    { value: 'constitution_societe', label: 'Constitution de Société', icon: Building }
  ];

  const steps = [
    { 
      number: 1, 
      title: 'Informations générales',
      description: 'Type d\'acte et client principal'
    },
    { 
      number: 2, 
      title: 'Parties impliquées',
      description: 'Vendeur, acheteur et témoins'
    },
    { 
      number: 3, 
      title: 'Valeur et honoraires',
      description: 'Montants et frais notariés'
    }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.act_type) {
          setError('Le type d\'acte est requis');
          return false;
        }
        if (!formData.client_name.trim()) {
          setError('Le nom du client est requis');
          return false;
        }
        return true;

      case 2:
        // Parties optionnelles mais validations de format si renseignées
        if (formData.seller_id && !/^[0-9]{13}$/.test(formData.seller_id.replace(/\s/g, ''))) {
          setError('Numéro CNI vendeur invalide (13 chiffres requis)');
          return false;
        }
        if (formData.buyer_id && !/^[0-9]{13}$/.test(formData.buyer_id.replace(/\s/g, ''))) {
          setError('Numéro CNI acheteur invalide (13 chiffres requis)');
          return false;
        }
        return true;

      case 3:
        if (!formData.act_value || parseFloat(formData.act_value) <= 0) {
          setError('La valeur de l\'acte doit être supérieure à 0');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError('');
  };

  const calculateNotaryFees = () => {
    const actValue = parseFloat(formData.act_value) || 0;
    // Calcul simplifié: 2% du montant de l'acte
    return Math.round(actValue * 0.02);
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsLoading(true);
    setError('');

    try {
      const NotaireSupabaseService = (await import('@/services/NotaireSupabaseService')).default;

      // Calculer les honoraires si non renseignés
      const notaryFees = formData.notary_fees ? parseFloat(formData.notary_fees) : calculateNotaryFees();

      // Préparer les parties en JSONB
      const parties = {
        seller: {
          name: formData.seller_name || null,
          id_number: formData.seller_id || null
        },
        buyer: {
          name: formData.buyer_name || null,
          id_number: formData.buyer_id || null
        },
        witnesses: formData.witnesses ? formData.witnesses.split(',').map(w => w.trim()) : []
      };

      // Date de completion estimée (30 jours par défaut)
      const estimatedDate = formData.estimated_completion_date 
        ? new Date(formData.estimated_completion_date).toISOString()
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

      const actData = {
        act_type: formData.act_type,
        client_name: formData.client_name.trim(),
        property_address: formData.property_address.trim() || null,
        act_value: parseFloat(formData.act_value),
        notary_fees: notaryFees,
        parties,
        status: 'draft',
        estimated_completion_date: estimatedDate,
        notes: formData.notes.trim() || null
      };

      const result = await NotaireSupabaseService.createNotarialAct(notaireId, actData);

      if (result.success) {
        window.safeGlobalToast({
          title: "Acte créé",
          description: `${result.data.act_number} a été créé avec succès`,
          variant: "success"
        });

        // Réinitialiser le formulaire
        setFormData({
          act_type: '',
          client_name: '',
          property_address: '',
          estimated_completion_date: '',
          seller_name: '',
          seller_id: '',
          buyer_name: '',
          buyer_id: '',
          witnesses: '',
          act_value: '',
          notary_fees: '',
          registration_fees: '',
          notes: ''
        });
        setCurrentStep(1);

        // Callback
        if (onActCreated) {
          onActCreated(result.data);
        }

        onOpenChange(false);
      } else {
        setError(result.error || 'Erreur lors de la création de l\'acte');
      }
    } catch (error) {
      console.error('Erreur création acte:', error);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      act_type: '',
      client_name: '',
      property_address: '',
      estimated_completion_date: '',
      seller_name: '',
      seller_id: '',
      buyer_name: '',
      buyer_id: '',
      witnesses: '',
      act_value: '',
      notary_fees: '',
      registration_fees: '',
      notes: ''
    });
    setCurrentStep(1);
    setError('');
    onOpenChange(false);
  };

  const progress = (currentStep / 3) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <FileText className="h-6 w-6 text-amber-600" />
            Nouvel Acte Notarié
          </DialogTitle>
          <DialogDescription>
            Créez un nouvel acte en 3 étapes simples
          </DialogDescription>
        </DialogHeader>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex items-center gap-2 ${
                  currentStep === step.number ? 'text-amber-600 font-semibold' : 
                  currentStep > step.number ? 'text-green-600' : 
                  'text-gray-400'
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${
                  currentStep === step.number ? 'border-amber-600 bg-amber-50' :
                  currentStep > step.number ? 'border-green-600 bg-green-50' :
                  'border-gray-300'
                }`}>
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span>{step.number}</span>
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="text-xs">{step.title}</div>
                </div>
              </div>
            ))}
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-6 py-4"
          >
            {/* ÉTAPE 1: Informations générales */}
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Type d'acte *
                  </Label>
                  <Select
                    value={formData.act_type}
                    onValueChange={(value) => handleInputChange('act_type', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type d'acte" />
                    </SelectTrigger>
                    <SelectContent>
                      {actTypes.map((type) => {
                        const Icon = type.icon;
                        return (
                          <SelectItem key={type.value} value={type.value}>
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4" />
                              {type.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="client_name" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-500" />
                    Nom du client principal *
                  </Label>
                  <Input
                    id="client_name"
                    placeholder="Ex: Amadou Ba"
                    value={formData.client_name}
                    onChange={(e) => handleInputChange('client_name', e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="property_address" className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    Adresse du bien (optionnel)
                  </Label>
                  <Textarea
                    id="property_address"
                    placeholder="Ex: Lot 234, Zone B, Almadies, Dakar"
                    value={formData.property_address}
                    onChange={(e) => handleInputChange('property_address', e.target.value)}
                    disabled={isLoading}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="estimated_completion_date" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    Date de completion estimée (optionnel)
                  </Label>
                  <Input
                    id="estimated_completion_date"
                    type="date"
                    value={formData.estimated_completion_date}
                    onChange={(e) => handleInputChange('estimated_completion_date', e.target.value)}
                    disabled={isLoading}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <p className="text-xs text-gray-500">Par défaut: 30 jours à partir d'aujourd'hui</p>
                </div>
              </>
            )}

            {/* ÉTAPE 2: Parties impliquées */}
            {currentStep === 2 && (
              <>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Toutes les informations de cette étape sont optionnelles. Vous pourrez les compléter ultérieurement.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seller_name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      Nom du vendeur
                    </Label>
                    <Input
                      id="seller_name"
                      placeholder="Ex: Ibrahima Diop"
                      value={formData.seller_name}
                      onChange={(e) => handleInputChange('seller_name', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="seller_id" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      CNI vendeur
                    </Label>
                    <Input
                      id="seller_id"
                      placeholder="Ex: 1234567890123"
                      value={formData.seller_id}
                      onChange={(e) => handleInputChange('seller_id', e.target.value)}
                      disabled={isLoading}
                      maxLength={13}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="buyer_name" className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      Nom de l'acheteur
                    </Label>
                    <Input
                      id="buyer_name"
                      placeholder="Ex: Mariama Sall"
                      value={formData.buyer_name}
                      onChange={(e) => handleInputChange('buyer_name', e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="buyer_id" className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      CNI acheteur
                    </Label>
                    <Input
                      id="buyer_id"
                      placeholder="Ex: 1234567890123"
                      value={formData.buyer_id}
                      onChange={(e) => handleInputChange('buyer_id', e.target.value)}
                      disabled={isLoading}
                      maxLength={13}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="witnesses" className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    Témoins (séparer par des virgules)
                  </Label>
                  <Input
                    id="witnesses"
                    placeholder="Ex: Ousmane Diallo, Fatou Ndiaye"
                    value={formData.witnesses}
                    onChange={(e) => handleInputChange('witnesses', e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </>
            )}

            {/* ÉTAPE 3: Valeur et honoraires */}
            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="act_value" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    Valeur de l'acte (FCFA) *
                  </Label>
                  <Input
                    id="act_value"
                    type="number"
                    placeholder="Ex: 25000000"
                    value={formData.act_value}
                    onChange={(e) => handleInputChange('act_value', e.target.value)}
                    disabled={isLoading}
                    min="0"
                    step="100000"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notary_fees" className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    Honoraires notariés (FCFA)
                  </Label>
                  <Input
                    id="notary_fees"
                    type="number"
                    placeholder={`Calculé automatiquement: ${calculateNotaryFees().toLocaleString()} FCFA`}
                    value={formData.notary_fees}
                    onChange={(e) => handleInputChange('notary_fees', e.target.value)}
                    disabled={isLoading}
                    min="0"
                  />
                  <p className="text-xs text-gray-500">
                    Suggestion: {calculateNotaryFees().toLocaleString()} FCFA (2% de la valeur)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration_fees" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Frais d'enregistrement (FCFA)
                  </Label>
                  <Input
                    id="registration_fees"
                    type="number"
                    placeholder="Ex: 150000"
                    value={formData.registration_fees}
                    onChange={(e) => handleInputChange('registration_fees', e.target.value)}
                    disabled={isLoading}
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes" className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    Notes supplémentaires
                  </Label>
                  <Textarea
                    id="notes"
                    placeholder="Ajoutez des notes sur cet acte..."
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    disabled={isLoading}
                    rows={3}
                  />
                </div>

                {/* Résumé */}
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    <div className="space-y-1">
                      <div className="font-semibold">Résumé de l'acte:</div>
                      <div>Type: <Badge variant="outline">{actTypes.find(t => t.value === formData.act_type)?.label}</Badge></div>
                      <div>Client: {formData.client_name}</div>
                      <div>Valeur: {parseFloat(formData.act_value || 0).toLocaleString()} FCFA</div>
                      <div>Honoraires: {(formData.notary_fees ? parseFloat(formData.notary_fees) : calculateNotaryFees()).toLocaleString()} FCFA</div>
                    </div>
                  </AlertDescription>
                </Alert>
              </>
            )}

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
          </motion.div>
        </AnimatePresence>

        <DialogFooter className="gap-2">
          <div className="flex justify-between w-full">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={isLoading}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Précédent
                </Button>
              )}
            </div>
            <div>
              {currentStep < 3 ? (
                <Button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  Suivant
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Créer l'acte
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateActDialog;
