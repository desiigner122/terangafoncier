import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, ArrowLeft, Calculator, FileText, CheckCircle, AlertCircle, Building, User, CreditCard, PieChart } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabaseClient';
import { FEATURES } from '@/config/features';
import terangaBlockchain from '@/services/TerangaBlockchainService';

const BankFinancingPage = () => {
  const { state } = useLocation();
  const { user, profile } = useAuth();
  const context = state || {};
  const hasContext = !!(context.parcelleId || context.projectId);
  const [income, setIncome] = useState('');
  const [amount, setAmount] = useState(context.paymentInfo?.totalPrice?.toString() || context.parcelle?.price?.toString() || '');
  const [submitting, setSubmitting] = useState(false);
  
  // Nouveaux états pour les fonctionnalités avancées
  const [loanDuration, setLoanDuration] = useState('15');
  const [employmentType, setEmploymentType] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [bankPreference, setBankPreference] = useState('');
  const [hasGuarantee, setHasGuarantee] = useState(false);
  const [guaranteeType, setGuaranteeType] = useState('');
  const [documents, setDocuments] = useState({
    salarySlip: false,
    bankStatement: false,
    taxReturn: false,
    employmentCertificate: false,
    identityCard: false
  });

  // Banques partenaires
  const banks = [
    { id: 'boa', name: 'Bank of Africa', rate: 8.5, maxDuration: 25 },
    { id: 'sgbs', name: 'SGBS', rate: 9.2, maxDuration: 20 },
    { id: 'cbao', name: 'CBAO Attijariwafa Bank', rate: 8.8, maxDuration: 25 },
    { id: 'bicis', name: 'BICIS', rate: 9.5, maxDuration: 20 },
    { id: 'ecobank', name: 'Ecobank', rate: 9.0, maxDuration: 22 },
    { id: 'ubs', name: 'UBS', rate: 8.7, maxDuration: 20 }
  ];

  // Calculs financiers
  const calculateLoanDetails = () => {
    const principal = parseInt(amount.replace(/\D/g, ''), 10) || 0;
    const downPaymentAmount = parseInt(downPayment.replace(/\D/g, ''), 10) || 0;
    const loanAmount = principal - downPaymentAmount;
    const monthlyIncome = parseInt(income.replace(/\D/g, ''), 10) || 0;
    const expenses = parseInt(monthlyExpenses.replace(/\D/g, ''), 10) || 0;
    const duration = parseInt(loanDuration) || 15;
    const selectedBank = banks.find(b => b.id === bankPreference);
    const interestRate = selectedBank ? selectedBank.rate : 9.0;
    
    // Calcul mensualité
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = duration * 12;
    const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    
    // Ratio d'endettement
    const debtRatio = ((monthlyPayment + expenses) / monthlyIncome) * 100;
    
    // Capacité d'emprunt
    const maxDebtRatio = 33; // 33% maximum
    const maxMonthlyPayment = (monthlyIncome * maxDebtRatio / 100) - expenses;
    const borrowingCapacity = maxMonthlyPayment * numPayments / Math.pow(1 + monthlyRate, numPayments) * (Math.pow(1 + monthlyRate, numPayments) - 1) / monthlyRate;

    return {
      loanAmount,
      monthlyPayment: isFinite(monthlyPayment) ? monthlyPayment : 0,
      totalCost: isFinite(monthlyPayment) ? monthlyPayment * numPayments : 0,
      interestCost: isFinite(monthlyPayment) ? (monthlyPayment * numPayments) - loanAmount : 0,
      debtRatio: isFinite(debtRatio) ? debtRatio : 0,
      borrowingCapacity: isFinite(borrowingCapacity) ? borrowingCapacity : 0,
      isAffordable: debtRatio <= 33
    };
  };

  const loanDetails = calculateLoanDetails();
  
  // Score d'éligibilité
  const calculateEligibilityScore = () => {
    let score = 0;
    
    // Revenus (30 points)
    const monthlyIncome = parseInt(income.replace(/\D/g, ''), 10) || 0;
    if (monthlyIncome >= 500000) score += 30;
    else if (monthlyIncome >= 300000) score += 20;
    else if (monthlyIncome >= 150000) score += 10;
    
    // Ratio d'endettement (25 points)
    if (loanDetails.debtRatio <= 25) score += 25;
    else if (loanDetails.debtRatio <= 30) score += 15;
    else if (loanDetails.debtRatio <= 33) score += 10;
    
    // Apport personnel (20 points)
    const downPaymentPercent = (parseInt(downPayment.replace(/\D/g, ''), 10) || 0) / (parseInt(amount.replace(/\D/g, ''), 10) || 1) * 100;
    if (downPaymentPercent >= 20) score += 20;
    else if (downPaymentPercent >= 10) score += 15;
    else if (downPaymentPercent >= 5) score += 10;
    
    // Documents (15 points)
    const docCount = Object.values(documents).filter(Boolean).length;
    score += (docCount / 5) * 15;
    
    // Garanties (10 points)
    if (hasGuarantee && guaranteeType) score += 10;
    
    return Math.min(score, 100);
  };

  const eligibilityScore = calculateEligibilityScore();

  const backLink = useMemo(() => {
    if (context.parcelleId) return { to: `/parcelle/${context.parcelleId}`, label: 'Retour à la parcelle' };
    if (context.projectId) return { to: `/project/${context.projectId}`, label: 'Retour au projet' };
    return null;
  }, [context]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {(context.parcelleId || context.projectId) && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Building className="w-5 h-5" />
            <div>
              {context.parcelle?.title ? (
                <span>
                  <strong>{context.parcelle.title}</strong> 
                  {context.parcelle.location && ` • ${context.parcelle.location}`}
                  {context.parcelle.surface && ` • ${context.parcelle.surface} m²`}
                  {context.paymentInfo?.totalPrice && ` • ${context.paymentInfo.totalPrice.toLocaleString()} FCFA`}
                </span>
              ) : (
                <span>
                  Financement pour: {context.parcelleId ? `Parcelle #${context.parcelleId}` : `Projet #${context.projectId}`}
                </span>
              )}
              <div className="text-emerald-600 font-medium">Demande de financement bancaire</div>
            </div>
          </div>
          {backLink && (
            <Link to={backLink.to} className="inline-flex items-center text-emerald-700 hover:text-emerald-800 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1"/> {backLink.label}
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale - Formulaire */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations personnelles */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informations Personnelles
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user && (
                <div className="p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Compte vérifié: <strong>{profile?.full_name || profile?.name || user.email}</strong></span>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">{user.email}</div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revenus mensuels nets (FCFA) *
                  </label>
                  <Input 
                    placeholder="ex: 500000" 
                    value={income} 
                    onChange={(e) => setIncome(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Charges mensuelles (FCFA)
                  </label>
                  <Input 
                    placeholder="ex: 150000" 
                    value={monthlyExpenses} 
                    onChange={(e) => setMonthlyExpenses(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type d'emploi
                  </label>
                  <Select value={employmentType} onValueChange={setEmploymentType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cdi">CDI</SelectItem>
                      <SelectItem value="cdd">CDD</SelectItem>
                      <SelectItem value="fonctionnaire">Fonctionnaire</SelectItem>
                      <SelectItem value="liberal">Profession libérale</SelectItem>
                      <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                      <SelectItem value="retraite">Retraité</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée du prêt (années)
                  </label>
                  <Select value={loanDuration} onValueChange={setLoanDuration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 ans</SelectItem>
                      <SelectItem value="15">15 ans</SelectItem>
                      <SelectItem value="20">20 ans</SelectItem>
                      <SelectItem value="25">25 ans</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Détails du financement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Détails du Financement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Montant total du bien (FCFA) *
                  </label>
                  <Input 
                    placeholder="Prix du terrain/projet" 
                    value={amount} 
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apport personnel (FCFA)
                  </label>
                  <Input 
                    placeholder="Montant que vous apportez" 
                    value={downPayment} 
                    onChange={(e) => setDownPayment(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banque préférée
                </label>
                <Select value={bankPreference} onValueChange={setBankPreference}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une banque..." />
                  </SelectTrigger>
                  <SelectContent>
                    {banks.map(bank => (
                      <SelectItem key={bank.id} value={bank.id}>
                        {bank.name} - {bank.rate}% (max {bank.maxDuration} ans)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Garanties */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="guarantee"
                    checked={hasGuarantee}
                    onChange={(e) => setHasGuarantee(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="guarantee" className="text-sm font-medium text-gray-700">
                    J'ai une garantie supplémentaire
                  </label>
                </div>
                
                {hasGuarantee && (
                  <Select value={guaranteeType} onValueChange={setGuaranteeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de garantie..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="autre-bien">Autre bien immobilier</SelectItem>
                      <SelectItem value="caution">Caution solidaire</SelectItem>
                      <SelectItem value="assurance">Assurance décès/invalidité</SelectItem>
                      <SelectItem value="epargne">Épargne bloquée</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Documents requis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-orange-600" />
                Documents Requis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries({
                  salarySlip: 'Bulletins de salaire (3 derniers mois)',
                  bankStatement: 'Relevés bancaires (6 derniers mois)',
                  taxReturn: 'Déclaration fiscale (2 dernières années)',
                  employmentCertificate: 'Attestation d\'emploi',
                  identityCard: 'Pièce d\'identité'
                }).map(([key, label]) => (
                  <div key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={key}
                      checked={documents[key]}
                      onChange={(e) => setDocuments(prev => ({
                        ...prev,
                        [key]: e.target.checked
                      }))}
                      className="rounded"
                    />
                    <label htmlFor={key} className="text-sm text-gray-700">
                      {label}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center space-x-2 text-orange-800">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    Documents vérifiés: {Object.values(documents).filter(Boolean).length}/5
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bouton de soumission */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                className="w-full" 
                size="lg"
                disabled={!user || submitting || !hasContext || !income || !amount}
                onClick={async () => {
                  if (!user) { 
                    window.safeGlobalToast?.({ title: 'Connexion requise' }); 
                    return; 
                  }
                  if (!hasContext) { 
                    window.safeGlobalToast?.({ 
                      title: 'Sélection requise', 
                      description: 'Veuillez ouvrir une parcelle ou un projet avant de demander un financement.' 
                    }); 
                    return; 
                  }
                  if (!income || !amount) {
                    window.safeGlobalToast?.({ 
                      title: 'Champs requis', 
                      description: 'Veuillez remplir les revenus et le montant.' 
                    }); 
                    return;
                  }

                  setSubmitting(true);
                  try {
                    // Valider que parcelle_id existe dans la base si fournie
                    let validParcelleId = null;
                    if (context.parcelleId) {
                      const { data: parcelExists } = await supabase
                        .from('parcels')
                        .select('id')
                        .eq('id', context.parcelleId)
                        .maybeSingle();

                      if (parcelExists) {
                        validParcelleId = context.parcelleId;
                      } else {
                        console.warn('Parcelle ID invalide, insertion sans parcelle_id:', context.parcelleId);
                      }
                    }

                    const payload = {
                      user_id: user.id,
                      type: 'bank_financing',
                      status: 'pending',
                      parcelle_id: validParcelleId,
                      project_id: context.projectId || null,
                      monthly_income: parseInt(income.replace(/\D/g, ''), 10),
                      requested_amount: parseInt(amount.replace(/\D/g, ''), 10),
                      metadata: {
                        loan_duration: parseInt(loanDuration),
                        employment_type: employmentType,
                        monthly_expenses: parseInt(monthlyExpenses.replace(/\D/g, ''), 10) || 0,
                        down_payment: parseInt(downPayment.replace(/\D/g, ''), 10) || 0,
                        bank_preference: bankPreference,
                        has_guarantee: hasGuarantee,
                        guarantee_type: guaranteeType,
                        documents_provided: documents,
                        eligibility_score: eligibilityScore,
                        loan_details: loanDetails
                      }
                    };
                    
                    const { data: reqRows, error: reqError } = await supabase
                      .from('requests')
                      .insert(payload)
                      .select()
                      .limit(1);
                      
                    if (reqError) throw reqError;

                    const request = Array.isArray(reqRows) ? reqRows[0] : reqRows;
                    
                    // NFT proof (si activé)
                    if (FEATURES.ENABLE_REQUEST_NFT) {
                      try {
                        const toAddr = await terangaBlockchain.getWalletAddress();
                        if (toAddr) {
                          const parcelleTitle = context.parcelle?.title || 'Terrain';
                          const nftName = context.parcelle?.title 
                            ? `Financement - ${parcelleTitle}`
                            : `Teranga Request #${request.id}`;
                          const nftDescription = context.parcelle?.title
                            ? `Preuve de demande de financement bancaire pour ${parcelleTitle} ${context.parcelle?.location ? `(${context.parcelle.location})` : ''}`
                            : "Preuve de demande de financement bancaire";
                          
                          const tokenURI = `data:application/json,{"name":"${nftName}","description":"${nftDescription}","type":"bank_financing","parcelle_id":"${context.parcelleId || ''}"}`;
                          const mintRes = await terangaBlockchain.mintProofNFT(toAddr, tokenURI);
                          if (mintRes?.tokenId) {
                            await supabase
                              .from('requests')
                              .update({ nft_token_id: mintRes.tokenId, nft_tx_hash: mintRes.transactionHash })
                              .eq('id', request.id);
                          }
                        }
                      } catch (e) {
                        console.warn('Mint NFT request failed (ignored):', e.message);
                      }
                    }
                    
                    // Frais de dossier
                    const amountFee = 25000; // 25k FCFA
                    const parcelleTitle = context.parcelle?.title || 'Parcelle';
                    const parcelleLocation = context.parcelle?.location || '';
                    const description = context.parcelleId
                      ? `Frais de dossier financement - ${parcelleTitle} ${parcelleLocation ? `(${parcelleLocation})` : ''}`
                      : context.projectId
                      ? `Frais de dossier financement - Projet #${context.projectId}`
                      : `Frais de dossier financement`;
                    
                    const { error: txError } = await supabase.from('transactions').insert({
                      user_id: user.id,
                      request_id: request?.id || null,
                      status: 'pending',
                      amount: amountFee,
                      currency: 'XOF',
                      description,
                      metadata: payload.metadata
                    });
                    
                    if (txError) throw txError;
                    
                    const successTitle = context.parcelle?.title 
                      ? `Demande envoyée pour ${context.parcelle.title}` 
                      : 'Demande de financement envoyée';
                    const successDescription = `Score d'éligibilité: ${eligibilityScore}/100. Frais de dossier: ${amountFee.toLocaleString()} FCFA.`;
                    
                    window.safeGlobalToast?.({ 
                      title: successTitle, 
                      description: successDescription 
                    });
                  } catch (err) {
                    window.safeGlobalToast?.({ 
                      variant: 'destructive', 
                      title: 'Échec de la demande', 
                      description: err.message 
                    });
                  } finally {
                    setSubmitting(false);
                    
                    // Redirection vers la page de suivi des achats
                    setTimeout(() => {
                      console.log('🔄 Redirection vers /acheteur/mes-achats');
                      navigate('/acheteur/mes-achats');
                    }, 2500);
                  }
                }}
              >
                {submitting ? 'Envoi en cours...' : 'Envoyer la demande de financement'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Simulateur et résumé */}
        <div className="space-y-6">
          {/* Score d'éligibilité */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-purple-600" />
                Score d'Éligibilité
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {eligibilityScore}/100
                  </div>
                  <Progress value={eligibilityScore} className="mt-2" />
                </div>
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Revenus</span>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Endettement</span>
                    <span className="font-medium">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Apport personnel</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Documents</span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Garanties</span>
                    <span className="font-medium">10%</span>
                  </div>
                </div>

                {eligibilityScore >= 70 ? (
                  <Badge className="w-full bg-green-100 text-green-800 border-green-200">
                    Excellent profil
                  </Badge>
                ) : eligibilityScore >= 50 ? (
                  <Badge className="w-full bg-yellow-100 text-yellow-800 border-yellow-200">
                    Profil acceptable
                  </Badge>
                ) : (
                  <Badge className="w-full bg-red-100 text-red-800 border-red-200">
                    Profil à améliorer
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Simulateur de prêt */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Simulation de Prêt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanDetails.loanAmount > 0 ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Montant emprunté:</span>
                        <span className="font-semibold">{loanDetails.loanAmount.toLocaleString()} FCFA</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Mensualité:</span>
                        <span className="font-semibold text-blue-600">
                          {loanDetails.monthlyPayment.toLocaleString()} FCFA
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Coût total:</span>
                        <span className="font-semibold">{loanDetails.totalCost.toLocaleString()} FCFA</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Coût du crédit:</span>
                        <span className="font-semibold text-red-600">
                          {loanDetails.interestCost.toLocaleString()} FCFA
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Taux d'endettement:</span>
                        <Badge variant={loanDetails.debtRatio <= 33 ? "default" : "destructive"}>
                          {loanDetails.debtRatio.toFixed(1)}%
                        </Badge>
                      </div>
                    </div>
                    
                    {!loanDetails.isAffordable && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-red-800">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Taux d'endettement trop élevé (max 33%)
                          </span>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 text-sm py-4">
                    Remplissez les montants pour voir la simulation
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Banques partenaires */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Banques Partenaires
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {banks.map(bank => (
                  <div 
                    key={bank.id} 
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      bankPreference === bank.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setBankPreference(bank.id)}
                  >
                    <div className="font-medium text-sm">{bank.name}</div>
                    <div className="text-xs text-gray-600">
                      Taux: {bank.rate}% • Max {bank.maxDuration} ans
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BankFinancingPage;
