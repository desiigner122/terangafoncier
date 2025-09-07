import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Loader2, 
  FileUp, 
  MapPin, 
  Info, 
  DollarSign, 
  FileText, 
  Image as ImageIcon
} from 'lucide-react';
import { senegalRegionsAndDepartments } from '@/data/senegalLocations';
import { Link, useNavigate } from 'react-router-dom';
import { RoleProtectedRoute } from '@/components/layout/ProtectedRoute';


const AddParcelPageComponent = () => {
    const { user } = useAuth();
    // toast remplacÃ© par window.safeGlobalToast
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
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
        FileTexts: [],
    });

    const isMairie = user?.role === 'Mairie';

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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
        console.log("Submitting form data:", formData);

        // Simulate API call and data persistence
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const newParcelId = `user-parcel-${Date.now().toString().slice(-5)}`;
        const newParcel = {
            id: newParcelId,
            reference: `REF-${formData.commune?.substring(0,3).toUpperCase()}-${newParcelId.slice(-4)}`,
            name: formData.name,
            description: formData.description,
            price: isMairie ? null : parseFloat(formData.price),
            area_sqm: parseFloat(formData.area),
            status: isMairie ? 'Attribution sur demande' : 'Disponible',
            FileTexts: {}, 
            images: ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"],
            coordinates: { lat: 14.7167, lng: -17.4677 }, // Default to Dakar, should be dynamic
            zone: formData.commune,
            type: formData.type,
            is_featured: false,
            titre_foncier: formData.titreFoncier,
            ownerType: user.role,
            seller_id: user.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            verified: false,
            isEligibleForInstallments: formData.isEligibleForInstallments,
            attributionConditions: formData.attributionConditions,
        };
        // sampleParcels.unshift(newParcel); // This would be a DB call

        setIsSubmitting(false);
        window.safeGlobalToast({
            title: "Parcelle Soumise !",
            description: "Votre parcelle a été soumise. Elle sera visible après approbation.",
        });
        setStep(5);
    };

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
                            <CardDescription>Où se situe votre terrain ?</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label>Région</Label>
                                <Select value={formData.region} onValueChange={(v) => handleSelectChange('region', v)}><SelectTrigger><SelectValue placeholder="Sélectionnez une région..." /></SelectTrigger><SelectContent>{senegalRegionsAndDepartments.map(r => <SelectItem key={r.region} value={r.region}>{r.region}</SelectItem>)}</SelectContent></Select>
                            </div>
                            <div>
                                <Label>Département</Label>
                                <Select value={formData.department} onValueChange={(v) => handleSelectChange('department', v)} disabled={!formData.region}><SelectTrigger><SelectValue placeholder="Sélectionnez un département..." /></SelectTrigger><SelectContent>{departments.map(d => <SelectItem key={d.nom} value={d.nom}>{d.nom}</SelectItem>)}</SelectContent></Select>
                            </div>
                            <div>
                                <Label>Commune</Label>
                                <Select value={formData.commune} onValueChange={(v) => handleSelectChange('commune', v)} disabled={!formData.department}><SelectTrigger><SelectValue placeholder="Sélectionnez une commune..." /></SelectTrigger><SelectContent>{communes.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select>
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
                            <CardDescription>Décrivez les caractéristiques de votre terrain.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div><Label htmlFor="name">Titre de l'annonce</Label><Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Ex: Terrain viabilisé à Saly"/></div>
                            <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={formData.description} onChange={handleChange} placeholder="Décrivez les atouts, l'environnement..."/></div>
                            <div><Label htmlFor="area">Superficie (m²)</Label><Input id="area" name="area" type="number" value={formData.area} onChange={handleChange} placeholder="Ex: 300"/></div>
                            <div>
                                <Label>Type de Parcelle</Label>
                                <Select value={formData.type} onValueChange={(v) => handleSelectChange('type', v)}><SelectTrigger><SelectValue placeholder="Sélectionnez un type..." /></SelectTrigger><SelectContent>{['Résidentiel', 'Commercial', 'Agricole', 'Industriel'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select>
                            </div>
                        </CardContent>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
                        <CardHeader>
                            <CardTitle className="flex items-center">{isMairie ? <FileText className="mr-2"/> : <DollarSign className="mr-2"/>}Étape 3: {isMairie ? "Conditions & Statut" : "Prix & Légal"}</CardTitle>
                            <CardDescription>{isMairie ? "Définissez les conditions d'attribution." : "Fixez le prix et précisez le statut juridique."}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {isMairie ? (
                                <div><Label htmlFor="attributionConditions">Conditions d'attribution</Label><Textarea id="attributionConditions" name="attributionConditions" value={formData.attributionConditions} onChange={handleChange} placeholder="Décrivez les critères et la procédure pour l'attribution de ce terrain..."/></div>
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
                            <CardTitle className="flex items-center"><ImageIcon className="mr-2"/>Étape 4: Photos & FileTexts</CardTitle>
                            <CardDescription>Ajoutez des visuels et les FileTexts justificatifs.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div><Label htmlFor="images">Photos du terrain (5 max)</Label><Input id="images" name="images" type="file" multiple accept="image/*" /></div>
                            <div><Label htmlFor="FileTexts">FileTexts (Titre Foncier, Bail, etc.)</Label><Input id="FileTexts" name="FileTexts" type="file" multiple accept=".pdf,.doc,.docx" /></div>
                        </CardContent>
                    </motion.div>
                );
            case 5:
                return (
                    <motion.div key="step5" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-8">
                        <Check className="h-16 w-16 mx-auto text-green-500 bg-green-100 rounded-full p-2 mb-4"/>
                        <h2 className="text-2xl font-bold">Soumission Réussie !</h2>
                        <p className="text-muted-foreground mt-2">Votre parcelle a été enregistrée et est en cours de vérification par nos équipes. Vous serez notifié(e) dès sa publication.</p>
                        <div className="flex gap-4 justify-center mt-6">
                            <Button variant="outline" asChild><Link to="/my-listings">Voir mes annonces</Link></Button>
                            <Button asChild><Link to="/add-parcel" onClick={(e) => { e.preventDefault(); setStep(1); }}>Ajouter une autre parcelle</Link></Button>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto py-12 px-4">
            <Card className="max-w-3xl mx-auto">
                <form onSubmit={handleSubmit}>
                    <AnimatePresence mode="wait">
                        {renderStep()}
                    </AnimatePresence>
                    {step < 5 && (
                        <div className="p-6 border-t flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">Étape {step} sur 4</div>
                            <div className="flex gap-2">
                                {step > 1 && <Button type="button" variant="outline" onClick={handlePrev}><ArrowLeft className="mr-2 h-4 w-4"/> Précédent</Button>}
                                {step < 4 ? (
                                    <Button type="button" onClick={handleNext}>Suivant <ArrowRight className="ml-2 h-4 w-4"/></Button>
                                ) : (
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Check className="mr-2 h-4 w-4"/>}
                                        Soumettre pour Vérification
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </form>
            </Card>
        </motion.div>
    );
};

const AddParcelPage = () => (
    <RoleProtectedRoute allowedRoles={['Vendeur Particulier', 'Vendeur Pro', 'Mairie']}>
        <AddParcelPageComponent />
    </RoleProtectedRoute>
);

export default AddParcelPage;
