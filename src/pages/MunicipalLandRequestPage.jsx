import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { Landmark, Send, UploadCloud, User, FileText, ClipboardCheck, ArrowLeft, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const mairies = ['Saly', 'Dakar', 'Thiès', 'Diamniadio', 'Ziguinchor', 'Saint-Louis'];
const purposes = ['Habitat Social', 'Habitat Résidentiel', 'Projet Commercial', 'Projet Agricole', 'Autre'];

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
            {isCompleted ? <ClipboardCheck className="h-5 w-5" /> : step}
          </div>
          {step < totalSteps && <div className={`h-1 w-12 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-muted'}`}></div>}
        </React.Fragment>
      );
    })}
  </div>
);

const MunicipalLandRequestPage = () => {
  // toast remplacÃ© par window.safeGlobalToast
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    mairie: '',
    purpose: '',
    areaSought: '',
    message: '',
  });
  const [files, setFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      window.safeGlobalToast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour accéder à cette page.",
        variant: "destructive",
      });
      navigate('/login', { state: { from: '/request-municipal-land' } });
    } else if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.phone || '',
      }));
    }
  }, [isAuthenticated, user, navigate, toast]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log("Municipal Land Request Submitted:", { ...formData, files: files.map(f => f.name) });

    window.safeGlobalToast({
      title: "Demande Envoyée (Simulation)",
      description: `Votre demande a bien été transmise à la Mairie de ${formData.mairie}. Vous pouvez suivre son statut dans 'Mes Demandes'.`,
      className: "bg-green-500 text-white",
    });

    navigate('/my-requests');
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <motion.div key={1} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="space-y-4">
            <CardHeader><CardTitle className="flex items-center"><User className="mr-2"/> Informations Personnelles</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="fullName">Nom Complet</Label><Input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} required /></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required /></div>
              <div><Label htmlFor="phone">Téléphone</Label><Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} required /></div>
              <div><Label htmlFor="address">Adresse</Label><Input id="address" name="address" value={formData.address} onChange={handleInputChange} required /></div>
            </CardContent>
          </motion.div>
        );
      case 2:
        return (
          <motion.div key={2} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="space-y-4">
            <CardHeader><CardTitle className="flex items-center"><Landmark className="mr-2"/> Détails de la Demande</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="mairie">Mairie Concernée</Label><Select name="mairie" onValueChange={(v) => handleSelectChange('mairie', v)} value={formData.mairie} required><SelectTrigger><SelectValue placeholder="Sélectionnez une mairie" /></SelectTrigger><SelectContent>{mairies.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="purpose">Objet de la Demande</Label><Select name="purpose" onValueChange={(v) => handleSelectChange('purpose', v)} value={formData.purpose} required><SelectTrigger><SelectValue placeholder="Sélectionnez l'objet" /></SelectTrigger><SelectContent>{purposes.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
              <div><Label htmlFor="areaSought">Superficie Recherchée (m²)</Label><Input id="areaSought" name="areaSought" type="number" placeholder="Ex: 300" value={formData.areaSought} onChange={handleInputChange} required /></div>
            </CardContent>
          </motion.div>
        );
      case 3:
        return (
          <motion.div key={3} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="space-y-4">
            <CardHeader><CardTitle className="flex items-center"><FileText className="mr-2"/> Motivation et Pièces Jointes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div><Label htmlFor="message">Message de Motivation</Label><Textarea id="message" name="message" placeholder="Expliquez votre projet..." value={formData.message} onChange={handleInputChange} rows={5} required /></div>
              <div><Label htmlFor="documents">Pièces Jointes</Label><div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:border-primary transition-colors border-border"><div className="space-y-1 text-center"><UploadCloud className="mx-auto h-12 w-12 text-muted-foreground" /><div className="flex text-sm text-muted-foreground"><label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/80"><span>Téléchargez vos fichiers</span><input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleFileChange} /></label><p className="pl-1">ou glissez-déposez</p></div><p className="text-xs text-muted-foreground">PDF, JPG, PNG (Max. 5MB)</p>{files.length > 0 && (<ul className="mt-2 text-xs text-foreground list-disc list-inside">{files.map(file => <li key={file.name}>{file.name}</li>)}</ul>)}</div></div></div>
            </CardContent>
          </motion.div>
        );
      case 4:
        return (
          <motion.div key={4} initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 50 }} className="space-y-4">
            <CardHeader><CardTitle className="flex items-center"><ClipboardCheck className="mr-2"/> Récapitulatif</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p><strong>Nom:</strong> {formData.fullName}</p>
              <p><strong>Email:</strong> {formData.email}</p>
              <p><strong>Mairie:</strong> {formData.mairie}</p>
              <p><strong>Objet:</strong> {formData.purpose}</p>
              <p><strong>Superficie:</strong> {formData.areaSought} m²</p>
              <p><strong>Motivation:</strong> {formData.message}</p>
              <p><strong>Fichiers:</strong> {files.length > 0 ? files.map(f => f.name).join(', ') : 'Aucun'}</p>
              <p className="text-xs text-muted-foreground pt-4">En soumettant, vous acceptez que vos données soient transmises à la mairie sélectionnée et traitées conformément à notre <Link to="/privacy" className="underline hover:text-primary">politique de confidentialité</Link>.</p>
            </CardContent>
          </motion.div>
        );
      default:
        return null;
    }
  };

  if (!isAuthenticated) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4 md:py-12 max-w-3xl"
    >
      <Card className="shadow-xl border-border/50 bg-card">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-foreground">Demande de Terrain Communal</CardTitle>
          <CardDescription className="text-lg text-muted-foreground">
            Suivez les étapes pour soumettre votre dossier d'acquisition.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StepIndicator currentStep={step} totalSteps={4} />
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {renderStep()}
            </AnimatePresence>
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Précédent
              </Button>
              {step < 4 ? (
                <Button type="button" onClick={nextStep}>
                  Suivant <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" size="lg" className="bg-gradient-to-r from-primary to-green-600 hover:opacity-90 text-white" disabled={isSubmitting}>
                  {isSubmitting ? 'Envoi en cours...' : <><Send className="mr-2 h-5 w-5" /> Envoyer ma Demande</>}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MunicipalLandRequestPage;
