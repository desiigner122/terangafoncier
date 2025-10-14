import React, { useState, useEffect } from 'react';
// Use the unified custom Supabase client everywhere for consistency
import { supabase } from '@/lib/supabaseClient';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// useToast remplacé par safeToast
import { 
  Landmark, 
  Send, 
  Loader2, 
  FileCheck, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  User, 
  UploadCloud, 
  ClipboardCheck
} from 'lucide-react';
import { RoleProtectedRoute } from '@/components/layout/ProtectedRoute';
import { Link } from 'react-router-dom';
import { senegalRegionsAndDepartments } from '@/data/senegalLocations';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const StepIndicator = ({ currentStep, totalSteps }) => (
  <div className="flex justify-center items-center space-x-2 mb-8">
    {Array.from({ length: totalSteps }).map((_, index) => {
      const step = index + 1;
      const isCompleted = step < currentStep;
      const isActive = step === currentStep;
      return (
        <React.Fragment key={step}>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-300 ${
              isActive ? 'bg-primary text-primary-foreground scale-110' : isCompleted ? 'bg-green-500 text-white' : 'bg-muted text-muted-foreground'
            }`}
          >
            {isCompleted ? <CheckCircle className="h-5 w-5" /> : step}
          </div>
          {step < totalSteps && <div className={`h-1 w-12 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-muted'}`}></div>}
        </React.Fragment>
      );
    })}
  </div>
);

const DashboardMunicipalRequestPageComponent = () => {
  // Système de notification sécurisé
const safeToast = (message, type = 'default') => {
  try {
    // Utilisation du système global sécurisé
    if (typeof window !== 'undefined' && window.safeGlobalToast) {
      window.safeGlobalToast(message, type);
      return;
    }
    
    // Fallback 1: Console pour développement
    console.log(`📢 TOAST [${type.toUpperCase()}]: ${message}`);
    
    // Fallback 2: Alert pour utilisateur en cas d'erreur critique
    if (type === 'destructive' || type === 'error') {
      alert(`❌ Erreur: ${message}`);
    } else if (type === 'success') {
      // Notification discrète pour succès (DOM fallback minimal)
      if (typeof document !== 'undefined') {
        const notification = document.createElement('div');
        notification.style.cssText = `
          position: fixed;
          top: 20px;
          right: 20px;
          background: #10b981;
          color: white;
          padding: 12px 20px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          z-index: 9999;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 14px;
          transition: all 0.3s ease;
        `;
        notification.textContent = `✅ ${message}`;
        document.body.appendChild(notification);

        setTimeout(() => {
          if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
          }
        }, 3000);
      }
    }
  } catch (error) {
    console.error('Erreur dans safeToast:', error);
    console.log(`📢 MESSAGE: ${message}`);
  }
};

    // toast remplacé par safeToast
    const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
    const { user } = useAuth();
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const watchedRegion = watch('region');
    const watchedDepartment = watch('department');

    const [regions, setRegions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [communes, setCommunes] = useState([]);
    const [loadingRegions, setLoadingRegions] = useState(true);
    const [fetchError, setFetchError] = useState(null);

    // Use local Senegal locations dataset for cascade selections
    useEffect(() => {
        try {
            setLoadingRegions(true);
            setFetchError(null);
            const regionNames = senegalRegionsAndDepartments.map(r => r.region);
            setRegions(regionNames);
        } catch (err) {
            setFetchError(err.message);
            setRegions([]);
        } finally {
            setLoadingRegions(false);
        }
    }, []);

    useEffect(() => {
        if (!watchedRegion) { setDepartments([]); setCommunes([]); return; }
        const regionObj = senegalRegionsAndDepartments.find(r => r.region === watchedRegion);
        const deps = regionObj ? regionObj.departements.map(d => d.nom) : [];
        setDepartments(deps);
        // Reset commune when region changes
        setValue('department', undefined);
        setValue('commune', undefined);
        setCommunes([]);
    }, [watchedRegion, setValue]);

    useEffect(() => {
        if (!watchedDepartment || !watchedRegion) { setCommunes([]); return; }
        const regionObj = senegalRegionsAndDepartments.find(r => r.region === watchedRegion);
        const depObj = regionObj?.departements.find(d => d.nom === watchedDepartment);
        const cms = depObj ? depObj.communes : [];
        setCommunes(cms);
        setValue('commune', undefined);
    }, [watchedDepartment, watchedRegion, setValue]);

    const onSubmit = async (formData) => {
        try {
            setIsSubmitting(true);
            if (!user) {
                safeToast("Vous devez être connecté pour soumettre une demande.", 'error');
                return;
            }

            // Persist as a generic request in public.requests for now.
            // If communal_requests exists later, we can migrate insert target.
            const payload = {
                user_id: user.id,
                request_type: 'communal',
                status: 'pending',
                details: {
                    region: formData.region,
                    department: formData.department,
                    commune: formData.commune,
                    project_type: formData.project_type,
                    motivation: formData.motivation,
                    // Placeholder for future uploads handling
                    attachments: Array.isArray(formData.FileTexts) ? [...formData.FileTexts].map(f => f?.name) : [],
                    source: 'DashboardMunicipalRequestPage'
                }
            };

            const { error } = await supabase.from('requests').insert(payload);
            if (error) throw error;

            setStep(4); // Go to success step
            if (typeof window !== 'undefined' && window.safeGlobalToast) {
                window.safeGlobalToast({
                    title: 'Demande Envoyée !',
                    description: `Votre demande d'attribution pour la commune de ${formData.commune} a bien été enregistrée.`,
                });
            } else {
                safeToast("Demande envoyée avec succès !", 'success');
            }
        } catch (e) {
            console.error('Erreur en soumettant la demande communale:', e);
            safeToast("Impossible d'envoyer la demande. Veuillez réessayer.", 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNext = () => setStep(prev => prev + 1);
    const handlePrev = () => setStep(prev => prev - 1);

    const stepVariants = {
        hidden: { opacity: 0, x: 50 },
        visible: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -50 }
    };
    
    const renderStepContent = () => {
        switch(step) {
            case 1:
                return (
                    <motion.div key="step1" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl"><Landmark/>Étape 1: Localisation</CardTitle>
                            <CardDescription>Sélectionnez la commune où vous souhaitez obtenir un terrain.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                                                        <div>
                                                            <Label>Région</Label>
                                                            <Select onValueChange={(v) => setValue('region', v)}>
                                                                <SelectTrigger><SelectValue placeholder="Sélectionnez une région..." /></SelectTrigger>
                                                                <SelectContent>
                                                                    {regions.map(r => (
                                                                        <SelectItem key={r} value={r}>{r}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label>Département</Label>
                                                            <Select onValueChange={(v) => setValue('department', v)} disabled={!watchedRegion}>
                                                                <SelectTrigger><SelectValue placeholder="Sélectionnez un département..." /></SelectTrigger>
                                                                <SelectContent>
                                                                    {departments.map(d => (
                                                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                                                        <div>
                                                            <Label>Commune</Label>
                                                            <Select onValueChange={(v) => setValue('commune', v)} disabled={!watchedDepartment}>
                                                                <SelectTrigger><SelectValue placeholder="Sélectionnez une commune..." /></SelectTrigger>
                                                                <SelectContent>
                                                                    {communes.map(c => (
                                                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        </div>
                        </CardContent>
                    </motion.div>
                );
            case 2:
                return (
                    <motion.div key="step2" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                        <CardHeader>
                                                        <CardTitle className="flex items-center gap-2 text-2xl"><FileCheck/>Étape 2: Motivation & Pièces</CardTitle>
                            <CardDescription>Expliquez votre projet et joignez les pièces requises.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div><Label htmlFor="project_type">Type de projet</Label><Select onValueChange={(v) => setValue('project_type', v)}><SelectTrigger><SelectValue placeholder="Sélectionnez le type de projet..." /></SelectTrigger><SelectContent>{['Habitation', 'Commercial', 'Agricole', 'Industriel'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent></Select></div>
                            <div><Label htmlFor="motivation">Motivation de votre demande</Label><Textarea id="motivation" placeholder="Décrivez votre projet, son impact, et pourquoi vous sollicitez un terrain dans cette commune..." {...register('motivation', { required: true })} /></div>
                                                        <div><Label htmlFor="FileTexts">Fichiers justificatifs</Label><Input id="FileTexts" type="file" multiple {...register('FileTexts')} /><p className="text-xs text-muted-foreground mt-1">Joindre CNI, plan de financement, etc.</p></div>
                        </CardContent>
                    </motion.div>
                );
            case 3:
                return (
                    <motion.div key="step3" variants={stepVariants} initial="hidden" animate="visible" exit="exit">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-2xl"><ClipboardCheck/>Étape 3: Récapitulatif</CardTitle>
                            <CardDescription>Vérifiez les informations avant de soumettre.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p><strong>Commune:</strong> {watch('commune')}, {watch('department')}, {watch('region')}</p>
                            <p><strong>Type de projet:</strong> {watch('project_type')}</p>
                            <p><strong>Motivation:</strong> {watch('motivation')?.substring(0, 100)}...</p>
                            <p className="text-xs text-muted-foreground pt-4">En soumettant, vous acceptez que vos données soient transmises à la mairie sélectionnée.</p>
                        </CardContent>
                    </motion.div>
                );
            case 4:
                return (
                    <motion.div key="step4" variants={stepVariants} initial="hidden" animate="visible" exit="exit" className="text-center p-8">
                        <CheckCircle className="h-20 w-20 mx-auto text-green-500 mb-4"/>
                        <h2 className="text-2xl font-bold">Demande Envoyée avec Succès !</h2>
                        <p className="text-muted-foreground mt-2 max-w-md mx-auto">Votre dossier a été transmis à la mairie concernée. Vous pouvez suivre son avancement depuis votre tableau de bord dans la section "Mes Demandes".</p>
                        <div className="mt-6 flex justify-center gap-4">
                            <Button asChild><Link to="/dashboard">Aller au Tableau de Bord</Link></Button>
                            <Button variant="outline" onClick={() => setStep(1)}>Faire une autre demande</Button>
                        </div>
                    </motion.div>
                );
            default: return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto py-12 px-4"
        >
            <Card className="max-w-3xl mx-auto shadow-lg">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-foreground">Demande de Terrain Communal</CardTitle>
                    <CardDescription className="text-lg text-muted-foreground">
                        Suivez les étapes pour soumettre votre dossier d'acquisition.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <StepIndicator currentStep={step} totalSteps={3} />
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <AnimatePresence mode="wait">
                            {renderStepContent()}
                        </AnimatePresence>
                        {step < 4 && (
                            <CardFooter className="justify-between mt-8 pt-4 border-t">
                                <Button type="button" variant="outline" onClick={handlePrev} disabled={step === 1}>
                                    <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
                                </Button>
                                {step < 3 ? (
                                    <Button type="button" onClick={handleNext}>
                                        Suivant <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                ) : (
                                    <Button type="submit" size="lg" disabled={isSubmitting}>
                                        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Send className="mr-2 h-5 w-5" />}
                                        Envoyer ma Demande
                                    </Button>
                                )}
                            </CardFooter>
                        )}
                    </form>
                </CardContent>
            </Card>
        </motion.div>
    );
};

const DashboardMunicipalRequestPage = () => (
    <RoleProtectedRoute allowedRoles={['Particulier', 'Acheteur']}>
        <DashboardMunicipalRequestPageComponent />
    </RoleProtectedRoute>
);

export default DashboardMunicipalRequestPage;

