import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LoadingSpinner } from '@/components/ui/spinner';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Loader2,
  MapPin,
  Info,
  DollarSign,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { senegalRegionsAndDepartments } from '@/data/senegalLocations';

const EditParcelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    region: '',
    department: '',
    commune: '',
    address: '',
    name: '',
    description: '',
    area: '',
    type: '',
    price: '',
    titreFoncier: '',
    isEligibleForInstallments: false,
    attributionConditions: '',
    images: [],
    documents: [],
    existingImages: [],
    existingDocuments: []
  });

  const isMairie = user?.role === 'Mairie';

  useEffect(() => {
    const fetchParcel = async () => {
      try {
        const { data, error } = await supabase
          .from('parcels')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;

        // Vérifier que l'utilisateur est bien le propriétaire
        if (data.seller_id !== user.id) {
          window.safeGlobalToast({
            title: 'Accès refusé',
            description: 'Vous ne pouvez pas modifier ce terrain.',
            variant: 'destructive'
          });
          navigate('/dashboard/my-listings');
          return;
        }

        setFormData({
          region: data.region || '',
          department: data.department || '',
          commune: data.commune || '',
          address: data.address || '',
          name: data.name || '',
          description: data.description || '',
          area: data.area_sqm?.toString() || '',
          type: data.type || '',
          price: data.price?.toString() || '',
          titreFoncier: data.titre_foncier || '',
          isEligibleForInstallments: data.is_eligible_for_installments || false,
          attributionConditions: data.attribution_conditions || '',
          images: [],
          documents: [],
          existingImages: data.images || [],
          existingDocuments: data.documents || []
        });
      } catch (error) {
        console.error('Erreur chargement terrain:', error);
        window.safeGlobalToast({
          title: 'Erreur',
          description: 'Impossible de charger le terrain.',
          variant: 'destructive'
        });
        navigate('/dashboard/my-listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchParcel();
  }, [id, user, navigate]);

  const handleNext = () => setStep(prev => prev + 1);
  const handlePrev = () => setStep(prev => prev - 1);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const fileArray = Array.from(files);
    setFormData(prev => ({ ...prev, [name]: fileArray }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === 'region') {
      setFormData(prev => ({ ...prev, department: '', commune: '' }));
    }
    if (name === 'department') {
      setFormData(prev => ({ ...prev, commune: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Upload nouvelles images si présentes
      let imageUrls = [...formData.existingImages];
      if (formData.images && formData.images.length > 0) {
        for (const image of formData.images) {
          const fileName = `${user.id}/${Date.now()}_${image.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const { error: uploadError } = await supabase.storage
            .from('parcel-images')
            .upload(fileName, image);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('parcel-images')
              .getPublicUrl(fileName);
            imageUrls.push(publicUrl);
          }
        }
      }

      // Upload nouveaux documents si présents
      let documentUrls = [...formData.existingDocuments];
      if (formData.documents && formData.documents.length > 0) {
        for (const doc of formData.documents) {
          const fileName = `${user.id}/${Date.now()}_${doc.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const { error: uploadError } = await supabase.storage
            .from('parcel-documents')
            .upload(fileName, doc);

          if (!uploadError) {
            const { data: { publicUrl } } = supabase.storage
              .from('parcel-documents')
              .getPublicUrl(fileName);
            documentUrls.push(publicUrl);
          }
        }
      }

      // Mettre à jour dans Supabase
      const updateData = {
        name: formData.name,
        description: formData.description,
        price: isMairie ? null : parseFloat(formData.price),
        area_sqm: parseFloat(formData.area),
        type: formData.type,
        region: formData.region,
        department: formData.department,
        commune: formData.commune,
        address: formData.address,
        titre_foncier: formData.titreFoncier || null,
        is_eligible_for_installments: formData.isEligibleForInstallments,
        attribution_conditions: formData.attributionConditions || null,
        images: imageUrls,
        documents: documentUrls,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('parcels')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      window.safeGlobalToast({
        title: 'Terrain modifié !',
        description: 'Vos modifications ont été enregistrées avec succès.'
      });

      navigate('/dashboard/my-listings');

    } catch (error) {
      console.error('Erreur modification:', error);
      window.safeGlobalToast({
        title: 'Erreur',
        description: 'Impossible de modifier le terrain. Réessayez.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const selectedRegionData = senegalRegionsAndDepartments.find(r => r.region === formData.region);
  const departments = selectedRegionData ? selectedRegionData.departements : [];
  const selectedDepartmentData = departments.find(d => d.nom === formData.department);
  const communes = selectedDepartmentData ? selectedDepartmentData.communes : [];

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center"><MapPin className="mr-2"/>Étape 1: Localisation</CardTitle>
              <CardDescription>Modifiez la localisation du terrain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Région</Label>
                <Select value={formData.region} onValueChange={(v) => handleSelectChange('region', v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez une région..." /></SelectTrigger>
                  <SelectContent>{senegalRegionsAndDepartments.map(r => <SelectItem key={r.region} value={r.region}>{r.region}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Département</Label>
                <Select value={formData.department} onValueChange={(v) => handleSelectChange('department', v)} disabled={!formData.region}>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez un département..." /></SelectTrigger>
                  <SelectContent>{departments.map(d => <SelectItem key={d.nom} value={d.nom}>{d.nom}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Commune</Label>
                <Select value={formData.commune} onValueChange={(v) => handleSelectChange('commune', v)} disabled={!formData.department}>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez une commune..." /></SelectTrigger>
                  <SelectContent>{communes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="address">Adresse / Lieu-dit</Label><Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="Ex: Près de la route nationale..."/></div>
            </CardContent>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center"><Info className="mr-2"/>Étape 2: Détails de la Parcelle</CardTitle>
              <CardDescription>Modifiez les caractéristiques du terrain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="name">Titre de l'annonce</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Terrain viabilisé à Saly"/></div>
              <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Décrivez les atouts, l'environnement..." rows={6}/></div>
              <div><Label htmlFor="area">Superficie (m²)</Label><Input id="area" name="area" type="number" value={formData.area} onChange={handleChange} placeholder="Ex: 300"/></div>
              <div>
                <Label>Type de Parcelle</Label>
                <Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}>
                  <SelectTrigger><SelectValue placeholder="Sélectionnez un type..." /></SelectTrigger>
                  <SelectContent>{['Résidentiel', 'Commercial', 'Agricole', 'Industriel'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </CardContent>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center">{isMairie ? <FileText className="mr-2"/> : <DollarSign className="mr-2"/>}Étape 3: {isMairie ? "Conditions & Statut" : "Prix & Légal"}</CardTitle>
              <CardDescription>{isMairie ? "Modifiez les conditions d'attribution." : "Modifiez le prix et le statut juridique."}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {isMairie ? (
                <div><Label htmlFor="attributionConditions">Conditions d'attribution</Label><Textarea id="attributionConditions" name="attributionConditions" value={formData.attributionConditions} onChange={handleChange} placeholder="Décrivez les critères et la procédure..." rows={5}/></div>
              ) : (
                <>
                  <div><Label htmlFor="price">Prix (FCFA)</Label><Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Ex: 15000000"/></div>
                  <div className="flex items-center space-x-2"><Checkbox id="isEligibleForInstallments" name="isEligibleForInstallments" checked={formData.isEligibleForInstallments} onCheckedChange={(c) => handleChange({ target: { name: 'isEligibleForInstallments', type: 'checkbox', checked: c } })}/><Label htmlFor="isEligibleForInstallments">Éligible au paiement échelonné via nos partenaires</Label></div>
                </>
              )}
              <div><Label htmlFor="titreFoncier">Numéro du Titre Foncier (si disponible)</Label><Input id="titreFoncier" name="titreFoncier" value={formData.titreFoncier} onChange={handleChange} placeholder="Ex: TF 12345/DK"/></div>
            </CardContent>
          </motion.div>
        );
      case 4:
        return (
          <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
            <CardHeader>
              <CardTitle className="flex items-center"><ImageIcon className="mr-2"/>Étape 4: Photos & Documents</CardTitle>
              <CardDescription>Ajoutez de nouvelles photos ou documents (les anciens seront conservés)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Photos existantes: {formData.existingImages.length}</Label>
                <p className="text-sm text-gray-500 mb-2">Ajoutez de nouvelles photos (elles s'ajouteront aux existantes)</p>
                <Input id="images" name="images" type="file" multiple accept="image/*" onChange={handleFileChange} />
              </div>
              <div>
                <Label>Documents existants: {formData.existingDocuments.length}</Label>
                <p className="text-sm text-gray-500 mb-2">Ajoutez de nouveaux documents</p>
                <Input id="documents" name="documents" type="file" multiple accept=".pdf,.doc,.docx" onChange={handleFileChange} />
              </div>
            </CardContent>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto py-12 px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Modifier le terrain</h1>
        <p className="text-gray-600">Mettez à jour les informations de votre annonce</p>
      </div>
      
      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {renderStep()}
          </AnimatePresence>
          <div className="p-6 border-t flex justify-between items-center">
            <div className="text-sm text-muted-foreground">Étape {step} sur 4</div>
            <div className="flex gap-2">
              {step > 1 && <Button type="button" variant="outline" onClick={handlePrev}><ArrowLeft className="mr-2 h-4 w-4"/> Précédent</Button>}
              {step < 4 ? (
                <Button type="button" onClick={handleNext}>Suivant <ArrowRight className="ml-2 h-4 w-4"/></Button>
              ) : (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4"/>}
                  Enregistrer les modifications
                </Button>
              )}
            </div>
          </div>
        </form>
      </Card>
    </motion.div>
  );
};

export default EditParcelPage;
