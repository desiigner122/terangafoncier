import React, { useMemo, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowLeft, Calculator, Calendar, DollarSign, CheckCircle, AlertCircle, Building, User, CreditCard } from "lucide-react";
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/lib/supabaseClient";
import { FEATURES } from '@/config/features';
import terangaBlockchain from '@/services/TerangaBlockchainService';

const InstallmentsPaymentPage = () => {
  const { state } = useLocation();
  const { user, profile } = useAuth();
  const context = state || {};
  const hasContext = !!(context.parcelleId || context.projectId);
  const [months, setMonths] = useState("12");
  const [downPayment, setDownPayment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  // Nouveaux états pour les fonctionnalités avancées
  const [totalAmount, setTotalAmount] = useState(context.paymentInfo?.totalPrice?.toString() || context.parcelle?.price?.toString() || '');
  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [paymentFrequency, setPaymentFrequency] = useState('monthly');
  const [firstPaymentDate, setFirstPaymentDate] = useState('');
  const [interestRate, setInterestRate] = useState('3.5'); // Taux d'intérêt par défaut
  const [includeInsurance, setIncludeInsurance] = useState(false);
  
  // Options de durée plus flexibles
  const durationOptions = [
    { value: "6", label: "6 mois" },
    { value: "12", label: "1 an" },
    { value: "18", label: "18 mois" },
    { value: "24", label: "2 ans" },
    { value: "36", label: "3 ans" },
    { value: "48", label: "4 ans" },
    { value: "60", label: "5 ans" }
  ];
  
  // Types de fréquence de paiement
  const frequencyOptions = [
    { value: "monthly", label: "Mensuel", multiplier: 1 },
    { value: "quarterly", label: "Trimestriel", multiplier: 3 },
    { value: "semi-annual", label: "Semestriel", multiplier: 6 }
  ];

  // Calculs détaillés du paiement échelonné
  const calculateInstallmentDetails = () => {
    const principal = parseInt(totalAmount.replace(/\D/g, ''), 10) || 0;
    const downPaymentAmount = parseInt(downPayment.replace(/\D/g, ''), 10) || 0;
    const amountToFinance = principal - downPaymentAmount;
    const duration = parseInt(months);
    const rate = parseFloat(interestRate) / 100;
    const frequency = frequencyOptions.find(f => f.value === paymentFrequency)?.multiplier || 1;
    const numberOfPayments = duration / frequency;
    
    // Calcul avec intérêts composés
    const periodicRate = rate / (12 / frequency);
    const monthlyPayment = amountToFinance * (periodicRate * Math.pow(1 + periodicRate, numberOfPayments)) / (Math.pow(1 + periodicRate, numberOfPayments) - 1);
    
    // Assurance (2% du montant financé par an)
    const insuranceCost = includeInsurance ? (amountToFinance * 0.02 * (duration / 12)) : 0;
    const totalWithInsurance = (monthlyPayment * numberOfPayments) + insuranceCost;
    
    // Calcul de la capacité de paiement
    const income = parseInt(monthlyIncome.replace(/\D/g, ''), 10) || 0;
    const maxPaymentCapacity = income * 0.3; // 30% max des revenus
    const paymentRatio = (monthlyPayment / income) * 100;
    
    return {
      amountToFinance,
      monthlyPayment: isFinite(monthlyPayment) ? monthlyPayment : 0,
      numberOfPayments,
      totalCost: isFinite(totalWithInsurance) ? totalWithInsurance : 0,
      interestCost: isFinite(monthlyPayment) ? (monthlyPayment * numberOfPayments) - amountToFinance : 0,
      insuranceCost,
      paymentRatio: isFinite(paymentRatio) ? paymentRatio : 0,
      isAffordable: paymentRatio <= 30,
      maxPaymentCapacity
    };
  };

  const installmentDetails = calculateInstallmentDetails();
  
  // Génération du planning de paiement
  const generatePaymentSchedule = () => {
    if (!firstPaymentDate || installmentDetails.numberOfPayments === 0) return [];
    
    const schedule = [];
    const startDate = new Date(firstPaymentDate);
    const frequency = frequencyOptions.find(f => f.value === paymentFrequency)?.multiplier || 1;
    
    for (let i = 0; i < installmentDetails.numberOfPayments; i++) {
      const paymentDate = new Date(startDate);
      paymentDate.setMonth(paymentDate.getMonth() + (i * frequency));
      
      schedule.push({
        paymentNumber: i + 1,
        date: paymentDate.toLocaleDateString('fr-FR'),
        amount: installmentDetails.monthlyPayment,
        principal: installmentDetails.amountToFinance / installmentDetails.numberOfPayments, // Simplifié
        interest: installmentDetails.monthlyPayment - (installmentDetails.amountToFinance / installmentDetails.numberOfPayments)
      });
    }
    
    return schedule;
  };

  const paymentSchedule = generatePaymentSchedule();
  
  const backLink = useMemo(() => {
    if (context.parcelleId) return { to: `/parcelle/${context.parcelleId}`, label: "Retour à la parcelle" };
    if (context.projectId) return { to: `/project/${context.projectId}`, label: "Retour au projet" };
    return null;
  }, [context]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {(context.parcelleId || context.projectId) && (
        <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 text-sm text-purple-800 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-5 h-5" />
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
                  Paiement échelonné pour: {context.parcelleId ? `Parcelle #${context.parcelleId}` : `Projet #${context.projectId}`}
                </span>
              )}
              <div className="text-purple-600 font-medium">Plan de paiement échelonné</div>
            </div>
          </div>
          {backLink && (
            <Link to={backLink.to} className="inline-flex items-center text-purple-700 hover:text-purple-800 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" />
              {backLink.label}
            </Link>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne principale - Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Informations du bien */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                Détails du Bien
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user && (
                <div className="p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Acheteur: <strong>{profile?.full_name || profile?.name || user.email}</strong></span>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">{user.email}</div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix total du bien (FCFA) *
                  </label>
                  <Input 
                    placeholder="ex: 15000000" 
                    value={totalAmount} 
                    onChange={(e) => setTotalAmount(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Apport initial (FCFA)
                  </label>
                  <Input 
                    placeholder="ex: 3000000" 
                    value={downPayment} 
                    onChange={(e) => setDownPayment(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Revenus mensuels (FCFA)
                  </label>
                  <Input 
                    placeholder="ex: 400000" 
                    value={monthlyIncome} 
                    onChange={(e) => setMonthlyIncome(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date du premier paiement
                  </label>
                  <Input 
                    type="date"
                    value={firstPaymentDate} 
                    onChange={(e) => setFirstPaymentDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuration du paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Plan de Paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Durée totale
                  </label>
                  <Select value={months} onValueChange={setMonths}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {durationOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fréquence de paiement
                  </label>
                  <Select value={paymentFrequency} onValueChange={setPaymentFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencyOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Taux d'intérêt (% annuel)
                  </label>
                  <Select value={interestRate} onValueChange={setInterestRate}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2.5">2,5%</SelectItem>
                      <SelectItem value="3.0">3,0%</SelectItem>
                      <SelectItem value="3.5">3,5%</SelectItem>
                      <SelectItem value="4.0">4,0%</SelectItem>
                      <SelectItem value="4.5">4,5%</SelectItem>
                      <SelectItem value="5.0">5,0%</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="insurance"
                  checked={includeInsurance}
                  onChange={(e) => setIncludeInsurance(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="insurance" className="text-sm font-medium text-gray-700">
                  Inclure une assurance décès/invalidité (2% par an)
                </label>
              </div>
              
              {includeInsurance && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <strong>Assurance incluse:</strong> En cas de décès ou d'invalidité permanente, 
                    le solde restant sera couvert par l'assurance.
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Échéancier détaillé */}
          {paymentSchedule.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Échéancier de Paiement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="p-2 text-left">N°</th>
                        <th className="p-2 text-left">Date</th>
                        <th className="p-2 text-right">Montant</th>
                        <th className="p-2 text-right">Capital</th>
                        <th className="p-2 text-right">Intérêts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paymentSchedule.map(payment => (
                        <tr key={payment.paymentNumber} className="border-t">
                          <td className="p-2 font-medium">{payment.paymentNumber}</td>
                          <td className="p-2">{payment.date}</td>
                          <td className="p-2 text-right font-semibold">
                            {payment.amount.toLocaleString()} FCFA
                          </td>
                          <td className="p-2 text-right text-green-600">
                            {payment.principal.toLocaleString()} FCFA
                          </td>
                          <td className="p-2 text-right text-red-600">
                            {payment.interest.toLocaleString()} FCFA
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Bouton de validation */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                className="w-full" 
                size="lg"
                disabled={!user || submitting || !hasContext || !totalAmount || !firstPaymentDate}
                onClick={async () => {
                  if (!user) { 
                    window.safeGlobalToast?.({ title: 'Connexion requise' }); 
                    return; 
                  }
                  if (!hasContext) { 
                    window.safeGlobalToast?.({ 
                      title: 'Sélection requise', 
                      description: 'Veuillez ouvrir une parcelle ou un projet pour configurer le paiement échelonné.' 
                    }); 
                    return; 
                  }
                  if (!totalAmount || !firstPaymentDate) {
                    window.safeGlobalToast?.({ 
                      title: 'Champs requis', 
                      description: 'Veuillez remplir le montant total et la date du premier paiement.' 
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
                      type: 'installment_payment',
                      status: 'pending',
                      parcelle_id: validParcelleId,
                      project_id: context.projectId || null,
                      requested_amount: parseInt(totalAmount.replace(/\D/g, ''), 10),
                      metadata: {
                        total_amount: parseInt(totalAmount.replace(/\D/g, ''), 10),
                        down_payment: parseInt(downPayment.replace(/\D/g, ''), 10) || 0,
                        monthly_income: parseInt(monthlyIncome.replace(/\D/g, ''), 10) || 0,
                        duration_months: parseInt(months),
                        payment_frequency: paymentFrequency,
                        interest_rate: parseFloat(interestRate),
                        include_insurance: includeInsurance,
                        first_payment_date: firstPaymentDate,
                        installment_details: installmentDetails,
                        payment_schedule: paymentSchedule
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
                            ? `Paiement Échelonné - ${parcelleTitle}`
                            : `Teranga Request #${request.id}`;
                          const nftDescription = context.parcelle?.title
                            ? `Plan de paiement échelonné pour ${parcelleTitle} ${context.parcelle?.location ? `(${context.parcelle.location})` : ''}`
                            : "Plan de paiement échelonné";
                          
                          const tokenURI = `data:application/json,{"name":"${nftName}","description":"${nftDescription}","type":"installment_payment","parcelle_id":"${context.parcelleId || ''}"}`;
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
                    const amountFee = 15000; // 15k FCFA
                    const parcelleTitle = context.parcelle?.title || 'Parcelle';
                    const parcelleLocation = context.parcelle?.location || '';
                    const description = context.parcelleId
                      ? `Frais dossier paiement échelonné - ${parcelleTitle} ${parcelleLocation ? `(${parcelleLocation})` : ''}`
                      : context.projectId
                      ? `Frais dossier paiement échelonné - Projet #${context.projectId}`
                      : `Frais dossier paiement échelonné`;
                    
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
                      ? `Plan créé pour ${context.parcelle.title}` 
                      : 'Plan de paiement échelonné créé';
                    const successDescription = `${installmentDetails.numberOfPayments} paiements de ${installmentDetails.monthlyPayment.toLocaleString()} FCFA. Frais: ${amountFee.toLocaleString()} FCFA.`;
                    
                    window.safeGlobalToast?.({ 
                      title: successTitle, 
                      description: successDescription 
                    });
                  } catch (err) {
                    window.safeGlobalToast?.({ 
                      variant: 'destructive', 
                      title: 'Erreur', 
                      description: err.message 
                    });
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                {submitting ? 'Création en cours...' : 'Créer le plan de paiement'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Colonne droite - Résumé et simulation */}
        <div className="space-y-6">
          {/* Résumé financier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Simulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {installmentDetails.amountToFinance > 0 ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prix total:</span>
                        <span className="font-semibold">{parseInt(totalAmount.replace(/\D/g, ''), 10).toLocaleString()} FCFA</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Apport initial:</span>
                        <span className="font-semibold text-green-600">
                          -{(parseInt(downPayment.replace(/\D/g, ''), 10) || 0).toLocaleString()} FCFA
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center border-t pt-2">
                        <span className="text-sm text-gray-600">À financer:</span>
                        <span className="font-semibold">{installmentDetails.amountToFinance.toLocaleString()} FCFA</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Paiement {frequencyOptions.find(f => f.value === paymentFrequency)?.label.toLowerCase()}:</span>
                        <span className="font-semibold text-blue-600 text-lg">
                          {installmentDetails.monthlyPayment.toLocaleString()} FCFA
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Nombre de paiements:</span>
                        <span className="font-semibold">{installmentDetails.numberOfPayments}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Coût total:</span>
                        <span className="font-semibold">{installmentDetails.totalCost.toLocaleString()} FCFA</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Dont intérêts:</span>
                        <span className="font-semibold text-red-600">
                          {installmentDetails.interestCost.toLocaleString()} FCFA
                        </span>
                      </div>
                      
                      {includeInsurance && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Dont assurance:</span>
                          <span className="font-semibold text-blue-600">
                            {installmentDetails.insuranceCost.toLocaleString()} FCFA
                          </span>
                        </div>
                      )}
                      
                      {monthlyIncome && (
                        <div className="flex justify-between items-center border-t pt-2">
                          <span className="text-sm text-gray-600">Ratio d'endettement:</span>
                          <Badge variant={installmentDetails.paymentRatio <= 30 ? "default" : "destructive"}>
                            {installmentDetails.paymentRatio.toFixed(1)}%
                          </Badge>
                        </div>
                      )}
                    </div>
                    
                    {!installmentDetails.isAffordable && monthlyIncome && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center space-x-2 text-red-800">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Paiement trop élevé (max 30% des revenus)
                          </span>
                        </div>
                        <div className="text-xs text-red-600 mt-1">
                          Capacité max: {installmentDetails.maxPaymentCapacity.toLocaleString()} FCFA
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-center text-gray-500 text-sm py-4">
                    Renseignez le montant pour voir la simulation
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Avantages du paiement échelonné */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Avantages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Flexibilité de paiement</div>
                    <div className="text-gray-600">Étalez vos paiements selon vos capacités</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Taux préférentiels</div>
                    <div className="text-gray-600">Taux d'intérêt attractifs pour nos clients</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Sécurité juridique</div>
                    <div className="text-gray-600">Contrat sécurisé et suivi personnalisé</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Remboursement anticipé</div>
                    <div className="text-gray-600">Possibilité de remboursement anticipé sans frais</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conditions et engagements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-gray-600">
              <div>• Apport minimum: 20% du prix de vente</div>
              <div>• Assurance décès/invalidité recommandée</div>
              <div>• Revenus stables justifiés sur 6 mois</div>
              <div>• Frais de dossier: 15 000 FCFA</div>
              <div>• Taux variable selon la durée choisie</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InstallmentsPaymentPage;
