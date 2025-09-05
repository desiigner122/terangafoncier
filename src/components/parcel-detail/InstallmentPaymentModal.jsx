﻿
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator, 
  Send, 
  CheckCircle, 
  Loader2, 
  Landmark
} from 'lucide-react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { Link } from 'react-router-dom';
import { partnerBanks } from '@/data/paymentData';

const formatPrice = (price) => {
  if (isNaN(price)) return '0 FCFA';
  return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price);
};

const InstallmentPaymentModal = ({ isOpen, onClose, parcelPrice, parcelName }) => {
  const { user, profile } = useAuth();
  // toast remplacÃ© par window.safeGlobalToast
  const [step, setStep] = useState(user ? 1 : 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [downPayment, setDownPayment] = useState(parcelPrice * 0.2);
  const [loanTerm, setLoanTerm] = useState(36); // in months
  const [interestRate] = useState(0.10); // 10% annual interest rate

  const [formData, setFormData] = useState({
    fullName: profile?.full_name || '',
    email: user?.email || '',
    phone: '',
    profession: '',
    monthlyIncome: '',
    bank: '',
  });

  const loanAmount = parcelPrice - downPayment;
  const monthlyInterestRate = interestRate / 12;
  const monthlyPayment = loanAmount > 0 ? (loanAmount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanTerm)) : 0;
  const totalCost = monthlyPayment * loanTerm + downPayment;

  useEffect(() => {
    if (isOpen) {
      setStep(user ? 1 : 0);
      setDownPayment(parcelPrice * 0.2);
      setLoanTerm(36);
      setFormData({
        fullName: profile?.full_name || '',
        email: user?.email || '',
        phone: '', profession: '', monthlyIncome: '', bank: ''
      });
    }
  }, [isOpen, parcelPrice, user, profile]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBankChange = (value) => {
    setFormData(prev => ({ ...prev, bank: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log("Financing Request Submitted:", {
      parcelName, parcelPrice, downPayment, loanTerm, ...formData
    });
    setIsSubmitting(false);
    setStep(3);
  };

  const containerVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.3, ease: 'easeIn' } },
  };

  const renderContent = () => {
    switch (step) {
      case 0:
        return (
          <motion.div key="step0" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="p-6 text-center">
            <DialogHeader>
              <DialogTitle className="text-2xl">Connexion Requise</DialogTitle>
              <DialogDescription>Vous devez être connecté pour faire une demande de financement.</DialogDescription>
            </DialogHeader>
            <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="w-full"><Link to="/login">Se Connecter</Link></Button>
              <Button asChild variant="outline" className="w-full"><Link to="/register">Créer un Compte</Link></Button>
            </div>
          </motion.div>
        );
      case 1:
        return (
          <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl flex items-center"><Calculator className="mr-2 h-6 w-6"/>Simulateur de Financement</DialogTitle>
              <DialogDescription>Estimez vos mensualités pour : <span className="font-semibold text-primary">{parcelName}</span></DialogDescription>
            </DialogHeader>
            <div className="px-6 space-y-4">
              <div><Label htmlFor="parcelPrice">Montant du Terrain</Label><Input id="parcelPrice" value={formatPrice(parcelPrice)} readOnly disabled /></div>
              <div><Label htmlFor="downPayment">Apport Personnel (FCFA)</Label><Input id="downPayment" type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} /></div>
              <div>
                <Label htmlFor="loanTerm">Durée du Crédit (mois)</Label>
                <Select value={String(loanTerm)} onValueChange={(value) => setLoanTerm(Number(value))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="12">12 mois</SelectItem><SelectItem value="24">24 mois</SelectItem><SelectItem value="36">36 mois</SelectItem><SelectItem value="48">48 mois</SelectItem><SelectItem value="60">60 mois</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="p-4 bg-muted rounded-lg space-y-2">
                <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Mensualité Estimée*</span><span className="text-lg font-bold text-primary">{formatPrice(monthlyPayment)}</span></div>
                <div className="flex justify-between items-center"><span className="text-sm text-muted-foreground">Coût Total Estimé</span><span className="font-semibold">{formatPrice(totalCost)}</span></div>
              </div>
              <p className="text-xs text-muted-foreground text-center">*Taux annuel de {interestRate * 100}%. Ne constitue pas une offre.</p>
            </div>
            <DialogFooter className="p-6">
              <Button variant="outline" onClick={onClose}>Annuler</Button>
              <Button onClick={() => setStep(2)}>Faire une Demande de Financement</Button>
            </DialogFooter>
          </motion.div>
        );
      case 2:
        return (
          <motion.form key="step2" onSubmit={handleSubmit} variants={containerVariants} initial="hidden" animate="visible" exit="exit">
            <DialogHeader className="p-6 pb-4">
              <DialogTitle className="text-2xl flex items-center"><Send className="mr-2 h-6 w-6"/>Demande de Financement</DialogTitle>
              <DialogDescription>Remplissez ce formulaire pour soumettre votre demande à nos partenaires financiers.</DialogDescription>
            </DialogHeader>
            <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto">
              <div><Label htmlFor="fullName">Nom Complet</Label><Input id="fullName" name="fullName" required onChange={handleFormChange} value={formData.fullName}/></div>
              <div><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" required onChange={handleFormChange} value={formData.email}/></div>
              <div><Label htmlFor="phone">Téléphone</Label><Input id="phone" name="phone" type="tel" required onChange={handleFormChange} /></div>
              <div><Label htmlFor="profession">Situation Professionnelle</Label><Input id="profession" name="profession" required onChange={handleFormChange} /></div>
              <div><Label htmlFor="monthlyIncome">Revenu Mensuel Net (FCFA)</Label><Input id="monthlyIncome" name="monthlyIncome" type="number" required onChange={handleFormChange} /></div>
              <div>
                <Label htmlFor="bank">Banque Partenaire</Label>
                <Select onValueChange={handleBankChange} required>
                  <SelectTrigger id="bank"><SelectValue placeholder="Sélectionnez votre banque..." /></SelectTrigger>
                  <SelectContent>
                    {partnerBanks.map(bank => (
                      <SelectItem key={bank.id} value={bank.name}>{bank.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter className="p-6">
              <Button type="button" variant="outline" onClick={() => setStep(1)}>Retour</Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Soumettre la Demande
              </Button>
            </DialogFooter>
          </motion.form>
        );
      case 3:
        return (
          <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit" className="p-6 text-center space-y-4">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <h2 className="text-2xl font-bold">Demande Envoyée !</h2>
            <p className="text-muted-foreground">
              Votre demande de financement a été transmise à <span className="font-bold text-primary">{formData.bank}</span>. Vous serez contacté(e) sous 48h pour les prochaines étapes.
            </p>
            <Button onClick={onClose} className="w-full">Fermer</Button>
          </motion.div>
        );
      default: return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px] p-0">
        <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};

export default InstallmentPaymentModal;

