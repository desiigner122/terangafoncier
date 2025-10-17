import React, { useMemo, useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Banknote, ArrowLeft, Calculator, CreditCard, Shield, CheckCircle, AlertCircle, Building, User, FileText, Gift, TrendingDown, Clock, Home } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabaseClient';
import { FEATURES } from '@/config/features';
import terangaBlockchain from '@/services/TerangaBlockchainService';

const OneTimePaymentPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const context = state || {};
  const hasContext = !!(context.parcelleId || context.projectId);
  const [price, setPrice] = useState(context.paymentInfo?.totalPrice?.toString() || context.parcelle?.price?.toString() || '');
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [createdRequestId, setCreatedRequestId] = useState(null);
  
  // Nouveaux états pour les fonctionnalités avancées
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [negotiatedPrice, setNegotiatedPrice] = useState('');
  const [paymentSource, setPaymentSource] = useState('');
  const [urgentPayment, setUrgentPayment] = useState(false);
  const [includeInsurance, setIncludeInsurance] = useState(true);
  const [verificationLevel, setVerificationLevel] = useState('standard');
  const [additionalServices, setAdditionalServices] = useState({
    notary: true,
    survey: false,
    legalCheck: true,
    titleTransfer: true
  });

  // Modes de paiement disponibles
  const paymentMethods = [
    { 
      id: 'bank_transfer', 
      name: 'Virement bancaire', 
      description: 'Sécurisé et tracé',
      fee: 5000,
      processingTime: '1-2 jours ouvrables',
      icon: Banknote
    },
    { 
      id: 'escrow', 
      name: 'Compte séquestre', 
      description: 'Protection maximale',
      fee: 15000,
      processingTime: '3-5 jours ouvrables',
      icon: Shield
    },
    { 
      id: 'cash_deposit', 
      name: 'Dépôt espèces', 
      description: 'En agence partenaire',
      fee: 10000,
      processingTime: 'Immédiat',
      icon: Building
    },
    { 
      id: 'mobile_money', 
      name: 'Mobile Money', 
      description: 'Orange Money, Wave',
      fee: 7500,
      processingTime: 'Immédiat',
      icon: CreditCard
    }
  ];

  // Niveaux de vérification
  const verificationLevels = [
    {
      id: 'standard',
      name: 'Standard',
      description: 'Vérifications de base',
      duration: '3-5 jours',
      cost: 25000,
      checks: ['Authentité du titre', 'Statut juridique', 'Conformité urbanisme']
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Vérifications approfondies',
      duration: '5-7 jours',
      cost: 45000,
      checks: ['Toutes vérifications standard', 'Enquête de voisinage', 'Historique complet', 'Inspection géotechnique']
    },
    {
      id: 'express',
      name: 'Express',
      description: 'Traitement accéléré',
      duration: '1-2 jours',
      cost: 35000,
      checks: ['Vérifications essentielles', 'Priorité de traitement']
    }
  ];

  // Calculs financiers
  const calculateTotal = () => {
    const basePrice = parseInt(negotiatedPrice || price.replace(/\D/g, ''), 10) || 0;
    const selectedMethod = paymentMethods.find(m => m.id === paymentMethod);
    const selectedVerification = verificationLevels.find(v => v.id === verificationLevel);
    
    let totalFees = (selectedMethod?.fee || 0) + (selectedVerification?.cost || 0);
    
    // Services additionnels
    if (additionalServices.notary) totalFees += 50000;
    if (additionalServices.survey) totalFees += 30000;
    if (additionalServices.legalCheck) totalFees += 20000;
    if (additionalServices.titleTransfer) totalFees += 15000;
    
    // Assurance (1% du prix)
    const insuranceCost = includeInsurance ? basePrice * 0.01 : 0;
    
    // Urgence (+20% sur les frais)
    if (urgentPayment) totalFees *= 1.2;
    
    const finalTotal = basePrice + totalFees + insuranceCost;
    
    return {
      basePrice,
      totalFees,
      insuranceCost,
      finalTotal,
      savings: basePrice > 0 ? (basePrice * 0.05) : 0 // 5% d'économie vs financement
    };
  };

  const totals = calculateTotal();

  // Évaluation du bien (prix du marché vs prix négocié)
  const marketAnalysis = () => {
    const marketPrice = parseInt(price.replace(/\D/g, ''), 10) || 0;
    const offeredPrice = parseInt(negotiatedPrice.replace(/\D/g, ''), 10) || marketPrice;
    
    if (!marketPrice || !offeredPrice) return null;
    
    const difference = marketPrice - offeredPrice;
    const percentageDiff = (difference / marketPrice) * 100;
    
    return {
      marketPrice,
      offeredPrice,
      difference,
      percentageDiff,
      isGoodDeal: percentageDiff > 0
    };
  };

  const analysis = marketAnalysis();

  const backLink = useMemo(() => {
    if (context.parcelleId) return { to: `/parcelle/${context.parcelleId}`, label: 'Retour à la parcelle' };
    if (context.projectId) return { to: `/project/${context.projectId}`, label: 'Retour au projet' };
    return { to: '/acheteur', label: 'Retour au dashboard' };
  }, [context]);

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-6">
      {/* Header avec breadcrumb */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          <span>/</span>
          <Link to="/acheteur" className="hover:text-blue-600">Dashboard</Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Paiement Comptant</span>
        </div>
        {backLink && (
          <Link to={backLink.to} className="inline-flex items-center text-blue-700 hover:text-blue-800 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-1"/> {backLink.label}
          </Link>
        )}
      </div>

          {hasContext && (
            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-800">
              <div className="flex items-center space-x-4">
                <Banknote className="w-5 h-5" />
                <div className="flex-1">
                  {context.parcelle?.title ? (
                    <div>
                      <div className="font-semibold text-lg">{context.parcelle.title}</div>
                      <div className="flex items-center gap-3 mt-1 text-blue-700">
                        {context.parcelle.location && (
                          <span>📍 {context.parcelle.location}</span>
                        )}
                        {context.parcelle.surface && (
                          <span>📐 {context.parcelle.surface} m²</span>
                        )}
                        {(context.parcelle.price || context.paymentInfo?.totalPrice) && (
                          <span className="font-bold text-xl">
                            💰 {(context.parcelle.price || context.paymentInfo.totalPrice).toLocaleString()} FCFA
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <span>
                      Achat comptant pour: {context.parcelleId ? `Parcelle #${context.parcelleId}` : `Projet #${context.projectId}`}
                    </span>
                  )}
                  <div className="text-blue-600 font-medium mt-1">💳 Paiement intégral immédiat</div>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne principale - Configuration */}
            <div className="lg:col-span-2 space-y-6">
          {/* Informations de l'acheteur */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                Informations de l'Acheteur
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {user && (
                <div className="p-3 rounded-md bg-blue-50 border border-blue-200 text-blue-800">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Acheteur vérifié: <strong>{profile?.full_name || profile?.name || user.email}</strong></span>
                  </div>
                  <div className="text-sm text-blue-600 mt-1">{user.email}</div>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix de vente affiché (FCFA)
                  </label>
                  <Input 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Prix du vendeur"
                    disabled={!!context.parcelle?.price}
                  />
                  {context.parcelle?.price && (
                    <div className="flex items-center text-xs text-green-600 mt-1">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Prix fixé par le vendeur: {context.parcelle.price.toLocaleString()} FCFA
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix proposé/négocié (FCFA)
                  </label>
                  <Input 
                    value={negotiatedPrice} 
                    onChange={(e) => setNegotiatedPrice(e.target.value)}
                    placeholder="Votre offre d'achat"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source de financement
                  </label>
                  <Select value={paymentSource} onValueChange={setPaymentSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="savings">Épargne personnelle</SelectItem>
                      <SelectItem value="inheritance">Héritage</SelectItem>
                      <SelectItem value="business_sale">Vente d'entreprise</SelectItem>
                      <SelectItem value="property_sale">Vente immobilière</SelectItem>
                      <SelectItem value="diaspora">Fonds diaspora</SelectItem>
                      <SelectItem value="investment">Retour investissement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex flex-col justify-end">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="urgent"
                      checked={urgentPayment}
                      onChange={(e) => setUrgentPayment(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="urgent" className="text-sm font-medium text-gray-700">
                      Traitement urgent (+20% sur frais)
                    </label>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mode de paiement */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-green-600" />
                Mode de Paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paymentMethods.map((method) => {
                  const IconComponent = method.icon;
                  return (
                    <div 
                      key={method.id}
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        paymentMethod === method.id 
                          ? 'border-green-500 bg-green-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setPaymentMethod(method.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <IconComponent className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <div className="font-medium">{method.name}</div>
                          <div className="text-sm text-gray-600">{method.description}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            Frais: {method.fee.toLocaleString()} FCFA • {method.processingTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Niveau de vérification */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Niveau de Vérification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                {verificationLevels.map((level) => (
                  <div 
                    key={level.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      verificationLevel === level.id 
                        ? 'border-orange-500 bg-orange-50' 
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setVerificationLevel(level.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-medium flex items-center space-x-2">
                          <span>{level.name}</span>
                          {level.id === 'premium' && (
                            <Badge className="bg-orange-100 text-orange-800">Recommandé</Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600">{level.description}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{level.cost.toLocaleString()} FCFA</div>
                        <div className="text-xs text-gray-500">{level.duration}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-600">
                      <strong>Inclut:</strong> {level.checks.join(', ')}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Services additionnels */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-600" />
                Services Additionnels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="notary"
                        checked={additionalServices.notary}
                        onChange={(e) => setAdditionalServices(prev => ({
                          ...prev,
                          notary: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="notary" className="text-sm font-medium">
                        Acte notarié
                      </label>
                    </div>
                    <span className="text-sm text-gray-600">50 000 FCFA</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="survey"
                        checked={additionalServices.survey}
                        onChange={(e) => setAdditionalServices(prev => ({
                          ...prev,
                          survey: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="survey" className="text-sm font-medium">
                        Levé topographique
                      </label>
                    </div>
                    <span className="text-sm text-gray-600">30 000 FCFA</span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="legalCheck"
                        checked={additionalServices.legalCheck}
                        onChange={(e) => setAdditionalServices(prev => ({
                          ...prev,
                          legalCheck: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="legalCheck" className="text-sm font-medium">
                        Vérification juridique
                      </label>
                    </div>
                    <span className="text-sm text-gray-600">20 000 FCFA</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="titleTransfer"
                        checked={additionalServices.titleTransfer}
                        onChange={(e) => setAdditionalServices(prev => ({
                          ...prev,
                          titleTransfer: e.target.checked
                        }))}
                        className="rounded"
                      />
                      <label htmlFor="titleTransfer" className="text-sm font-medium">
                        Mutation de titre
                      </label>
                    </div>
                    <span className="text-sm text-gray-600">15 000 FCFA</span>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="insurance"
                    checked={includeInsurance}
                    onChange={(e) => setIncludeInsurance(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="insurance" className="text-sm font-medium text-gray-700">
                    Assurance transaction (1% du prix) - Protection acheteur
                  </label>
                </div>
                {includeInsurance && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <strong>Protection incluse:</strong> Remboursement intégral en cas de vice caché,
                    litige de propriété ou non-conformité découverte après achat.
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes complémentaires
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                  placeholder="Conditions particulières, demandes spéciales..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Bouton de soumission */}
          <Card>
            <CardContent className="pt-6">
              <Button 
                className="w-full" 
                size="lg"
                disabled={!user || submitting || !price}
                onClick={async (e) => {
                  // Prevent double-click
                  e.preventDefault();
                  e.stopPropagation();
                  
                  if (submitting) {
                    console.log('⏳ Soumission déjà en cours, ignorer...');
                    return;
                  }
                  
                  if (!user) { 
                    window.safeGlobalToast?.({ title: 'Connexion requise' }); 
                    return; 
                  }
                  if (!price) {
                    window.safeGlobalToast?.({ 
                      title: 'Prix requis', 
                      description: 'Veuillez renseigner le prix du bien.' 
                    }); 
                    return;
                  }

                  console.log('🚀 Début de la soumission...');
                  setSubmitting(true);
                  try {
                    console.log('🔍 Context reçu:', { 
                      parcelleId: context.parcelleId, 
                      parcelle: context.parcelle,
                      hasContext 
                    });
                    
                    // Valider que parcelle_id existe dans la base si fournie
                    let validParcelleId = null;
                    if (context.parcelleId) {
                      const { data: parcelExists, error: parcelError } = await supabase
                        .from('parcels')
                        .select('id')
                        .eq('id', context.parcelleId)
                        .maybeSingle();

                      console.log('🏠 Vérification parcelle:', { 
                        searched: context.parcelleId, 
                        found: parcelExists,
                        error: parcelError 
                      });

                      if (parcelExists) {
                        validParcelleId = context.parcelleId;
                      } else {
                        console.error('❌ Parcelle ID invalide, insertion SANS parcelle_id:', context.parcelleId);
                      }
                    } else {
                      console.error('❌ AUCUN parcelleId dans le contexte ! context:', context);
                    }

                    const payload = {
                      user_id: user.id,
                      type: 'one_time',
                      payment_type: 'one_time',
                      status: 'pending',
                      parcel_id: validParcelleId,
                      project_id: context.projectId || null,
                      offered_price: parseInt(negotiatedPrice || price.replace(/\D/g, ''), 10),
                      message: note,
                      metadata: {
                        market_price: parseInt(price.replace(/\D/g, ''), 10),
                        negotiated_price: parseInt(negotiatedPrice.replace(/\D/g, ''), 10) || null,
                        payment_method: paymentMethod,
                        payment_source: paymentSource,
                        urgent_payment: urgentPayment,
                        verification_level: verificationLevel,
                        include_insurance: includeInsurance,
                        additional_services: additionalServices,
                        cost_breakdown: totals,
                        market_analysis: analysis
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
                            ? `Achat Comptant - ${parcelleTitle}`
                            : `Teranga Request #${request.id}`;
                          const nftDescription = context.parcelle?.title
                            ? `Preuve d'achat comptant pour ${parcelleTitle} ${context.parcelle?.location ? `(${context.parcelle.location})` : ''}`
                            : "Preuve d'achat comptant";
                          
                          const tokenURI = `data:application/json,{"name":"${nftName}","description":"${nftDescription}","type":"one_time","parcelle_id":"${context.parcelleId || ''}"}`;
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
                    
                    // Transaction principale
                    const parcelleTitle = context.parcelle?.title || 'Parcelle';
                    const parcelleLocation = context.parcelle?.location || '';
                    const description = context.parcelleId
                      ? `Achat comptant ${parcelleTitle} ${parcelleLocation ? `(${parcelleLocation})` : ''}`
                      : context.projectId
                      ? `Achat comptant projet #${context.projectId}`
                      : `Achat comptant`;
                    
                    // Récupérer seller_id depuis la parcelle
                    let seller_id = null;
                    if (validParcelleId) {
                      const { data: parcelData } = await supabase
                        .from('parcels')
                        .select('seller_id')
                        .eq('id', validParcelleId)
                        .maybeSingle();
                      seller_id = parcelData?.seller_id;
                    }
                    
                    const { error: txError } = await supabase.from('transactions').insert({
                      user_id: user.id,
                      buyer_id: user.id, // ✅ AJOUTÉ
                      seller_id: seller_id, // ✅ AJOUTÉ
                      parcel_id: validParcelleId, // ✅ AJOUTÉ
                      transaction_type: 'purchase', // ✅ AJOUTÉ (one_time = achat)
                      request_id: request?.id || null,
                      status: 'pending',
                      amount: totals.finalTotal,
                      currency: 'XOF',
                      description,
                      metadata: payload.metadata
                    });
                    
                    if (txError) throw txError;
                    
                    console.log('✅ Request créée:', request);
                    console.log('✅ Transaction créée avec succès');
                    console.log('📊 Totals:', totals);
                    
                    const successTitle = context.parcelle?.title 
                      ? `Demande d'achat pour ${context.parcelle.title}` 
                      : 'Demande d\'achat comptant envoyée';
                    const successDescription = `Total: ${totals.finalTotal.toLocaleString()} FCFA (dont ${totals.totalFees.toLocaleString()} FCFA de frais). Économie vs financement: ${totals.savings.toLocaleString()} FCFA.`;
                    
                    console.log('📢 Affichage toast:', successTitle, successDescription);
                    
                    // Stocker l'ID de la request pour le dialog
                    setCreatedRequestId(request.id);
                    
                    // Afficher le dialog de succès
                    setShowSuccessDialog(true);
                    setSubmitting(false);
                    
                  } catch (err) {
                    console.error('❌ Erreur lors de la soumission:', err);
                    window.safeGlobalToast?.({ 
                      variant: 'destructive', 
                      title: 'Erreur', 
                      description: err.message || 'Une erreur est survenue lors de la soumission'
                    });
                    setSubmitting(false);
                  }
                }}
              >
                {submitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">⏳</span>
                    Envoi en cours...
                  </span>
                ) : (
                  'Finaliser la demande d\'achat comptant'
                )}
              </Button>
            </CardContent>
          </Card>
            </div>

            {/* Colonne droite - Résumé et avantages */}
            <div className="space-y-6">
          {/* Bien sélectionné */}
          {context.parcelle && (
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-900">
                  <Home className="h-5 w-5" />
                  Bien Sélectionné
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-lg font-bold text-gray-900">
                  {context.parcelle.title || 'Terrain'}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  {context.parcelle.location && (
                    <span>📍 {context.parcelle.location}</span>
                  )}
                  {context.parcelle.surface && (
                    <>
                      <span>•</span>
                      <span>📐 {context.parcelle.surface} m²</span>
                    </>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-blue-200">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-semibold text-gray-700">Prix de vente:</span>
                    <span className="text-3xl font-bold text-blue-600">
                      {(context.parcelle.price || context.paymentInfo?.totalPrice || 0).toLocaleString()} 
                      <span className="text-sm ml-1">FCFA</span>
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Résumé financier */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-green-600" />
                Résumé Financier
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {totals.basePrice > 0 ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prix du bien:</span>
                        <span className="font-semibold">{totals.basePrice.toLocaleString()} FCFA</span>
                      </div>
                      
                      {analysis?.isGoodDeal && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Négociation:</span>
                          <span className="font-semibold text-green-600">
                            -{analysis.difference.toLocaleString()} FCFA ({analysis.percentageDiff.toFixed(1)}%)
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Frais et services:</span>
                        <span className="font-semibold">{totals.totalFees.toLocaleString()} FCFA</span>
                      </div>
                      
                      {totals.insuranceCost > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Assurance:</span>
                          <span className="font-semibold text-blue-600">
                            {totals.insuranceCost.toLocaleString()} FCFA
                          </span>
                        </div>
                      )}
                      
                      <div className="flex justify-between items-center border-t pt-2 font-semibold text-lg">
                        <span>Total à payer:</span>
                        <span className="text-blue-600">{totals.finalTotal.toLocaleString()} FCFA</span>
                      </div>
                      
                      {totals.savings > 0 && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center space-x-2 text-green-800">
                            <Gift className="w-4 h-4" />
                            <span className="text-sm font-medium">
                              Économie vs financement: {totals.savings.toLocaleString()} FCFA
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center text-gray-500 text-sm py-4">
                    Renseignez le prix pour voir le résumé
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analyse du marché */}
          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-purple-600" />
                  Analyse du Prix
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Prix marché:</span>
                    <span className="font-medium">{analysis.marketPrice.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Votre offre:</span>
                    <span className="font-medium">{analysis.offeredPrice.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Différence:</span>
                    <Badge variant={analysis.isGoodDeal ? "default" : "destructive"}>
                      {analysis.isGoodDeal ? '-' : '+'}{Math.abs(analysis.percentageDiff).toFixed(1)}%
                    </Badge>
                  </div>
                  
                  {analysis.isGoodDeal ? (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-sm text-green-800 font-medium">
                        Excellente négociation ! 
                      </div>
                      <div className="text-xs text-green-600">
                        Vous économisez {analysis.difference.toLocaleString()} FCFA
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div className="text-sm text-orange-800 font-medium">
                        Offre au-dessus du marché
                      </div>
                      <div className="text-xs text-orange-600">
                        Considérez renégocier le prix
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Avantages paiement comptant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Avantages Paiement Comptant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Négociation facilitée</div>
                    <div className="text-gray-600">Pouvoir de négociation renforcé</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Pas d'intérêts</div>
                    <div className="text-gray-600">Économie sur les frais de crédit</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Traitement prioritaire</div>
                    <div className="text-gray-600">Finalisation rapide de la transaction</div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                  <div>
                    <div className="font-medium">Propriété immédiate</div>
                    <div className="text-gray-600">Pas d'attente de déblocage de fonds</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Délais et process */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-orange-600" />
                Délais et Processus
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">1. Validation dossier:</span>
                <span className="font-medium">24-48h</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">2. Vérifications:</span>
                <span className="font-medium">
                  {verificationLevels.find(v => v.id === verificationLevel)?.duration || '3-5 jours'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">3. Négociation:</span>
                <span className="font-medium">1-3 jours</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">4. Paiement et transfert:</span>
                <span className="font-medium">
                  {paymentMethods.find(m => m.id === paymentMethod)?.processingTime || '1-2 jours'}
                </span>
              </div>
              
              {urgentPayment && (
                <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded">
                  <div className="text-orange-800 font-medium text-xs">
                    Mode urgent: Tous les délais réduits de 50%
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
            </div>
          </div>

      {/* Dialog de Succès */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="rounded-full bg-green-100 p-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-center text-2xl">
              Demande Envoyée !
            </DialogTitle>
            <DialogDescription className="text-center text-base mt-2">
              Votre demande d'achat a été envoyée avec succès au vendeur.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">✅ Ce qui va se passer :</h4>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Le vendeur sera notifié de votre demande</span>
                </li>
                <li className="flex items-start gap-2">
                  <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Il pourra accepter ou vous proposer des modifications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Vous recevrez une notification dès qu'il aura répondu</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-sm text-slate-600 text-center">
                Vous serez automatiquement redirigé vers votre page 
                <span className="font-semibold text-slate-900"> "Mes Achats" </span> 
                où vous pourrez suivre l'évolution de votre demande.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                setShowSuccessDialog(false);
                setNegotiatedPrice('');
                setNote('');
              }}
            >
              Rester ici
            </Button>
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                setShowSuccessDialog(false);
                navigate('/acheteur/mes-achats');
              }}
            >
              Voir mes achats
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OneTimePaymentPage;
