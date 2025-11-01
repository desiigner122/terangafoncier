# 🏛️ PLAN COMPLET : WORKFLOW NOTAIRE ET SYSTÈME DE PAIEMENT

## 📊 Vue d'ensemble

### Objectifs
1. ✅ Aligner les boutons d'actions du notaire avec les étapes du timeline
2. ✅ Implémenter un système de demande de paiement des frais
3. ✅ Ajouter les vraies étapes d'une transaction immobilière sénégalaise
4. ✅ Notifier les acteurs (acheteur/vendeur) des paiements requis
5. ✅ Interface de paiement avec choix du mode de paiement

---

## 🔄 NOUVELLES ÉTAPES DU WORKFLOW (18 étapes)

### Phase 1: Initiation (3 étapes)
```javascript
'initiated'                    // Dossier créé
'buyer_verification'           // Vérification identité acheteur
'seller_notification'          // Notification au vendeur
```

### Phase 2: Pré-contractuelle (3 étapes)
```javascript
'preliminary_agreement'        // Accord préliminaire (promesse de vente)
'deposit_payment'              // 💰 Versement des arrhes (10%)
'title_verification'           // Vérification des titres de propriété
```

### Phase 3: Due Diligence (4 étapes)
```javascript
'property_survey'              // Enquête de propriété au Conservateur
'certificate_verification'     // Certificats (non-gage, non-expropriation)
'tax_clearance'                // Vérification situation fiscale
'land_survey'                  // Bornage et métrés
```

### Phase 4: Frais et Fiscalité (3 étapes)
```javascript
'notary_fees_calculation'      // Calcul des frais de notaire (15-20%)
'payment_request'              // 💰 Demande de paiement frais notaire
'fees_payment_pending'         // 💰 En attente paiement frais
```

### Phase 5: Contractuelle (2 étapes)
```javascript
'contract_preparation'         // Rédaction acte de vente
'signing_appointment'          // Rendez-vous signature
```

### Phase 6: Paiement Final (1 étape)
```javascript
'final_payment_pending'        // 💰 Paiement du solde du prix
```

### Phase 7: Post-contractuelle (2 étapes)
```javascript
'property_registration'        // Enregistrement au Livre Foncier
'property_transfer'            // Remise clés et documents
```

### Phase 8: Finalisation (1 étape)
```javascript
'completed'                    // Transaction complétée ✅
```

**TOTAL: 18 étapes** (au lieu de 14 actuellement)

---

## 💰 SYSTÈME DE PAIEMENT DES FRAIS

### 1. Structure de données

#### Table: `notary_payment_requests`
```sql
CREATE TABLE notary_payment_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id),
  request_type TEXT NOT NULL, -- 'deposit', 'notary_fees', 'final_payment'
  amount DECIMAL(15,2) NOT NULL,
  currency TEXT DEFAULT 'XOF',
  
  -- Payer
  payer_id UUID NOT NULL REFERENCES profiles(id), -- acheteur ou vendeur
  payer_role TEXT NOT NULL, -- 'buyer' ou 'seller'
  
  -- Métadonnées
  description TEXT,
  breakdown JSONB, -- Détails des frais (enregistrement 10%, honoraires 5%, etc.)
  
  -- Statut
  status TEXT DEFAULT 'pending', -- pending, paid, cancelled
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  paid_at TIMESTAMPTZ,
  
  -- Paiement
  payment_method TEXT, -- 'wave', 'orange_money', 'bank_transfer', 'card'
  transaction_reference TEXT,
  payment_proof_url TEXT,
  
  -- Notaire
  notary_id UUID REFERENCES profiles(id),
  notary_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### Table: `payment_transactions` (déjà existe, à adapter)
```sql
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS notary_request_id UUID REFERENCES notary_payment_requests(id);
ALTER TABLE payment_transactions ADD COLUMN IF NOT EXISTS case_id UUID REFERENCES purchase_cases(id);
```

---

### 2. Flux de Paiement

#### Étape 1: Notaire crée une demande de paiement
```javascript
// NotaireCaseDetailModern.jsx - Nouveau bouton
const handleRequestPayment = async (paymentType) => {
  const breakdown = calculateFeesBreakdown(caseData.purchase_price);
  
  await supabase.from('notary_payment_requests').insert({
    case_id: caseData.id,
    request_type: paymentType, // 'deposit', 'notary_fees', 'final_payment'
    amount: breakdown.total,
    payer_id: caseData.buyer_id, // ou seller_id selon le type
    payer_role: 'buyer',
    breakdown: breakdown,
    notary_id: user.id,
    description: `Frais de notaire pour dossier ${caseData.case_number}`
  });
  
  // Notifier l'acheteur
  await NotificationService.sendPaymentRequest({
    buyerId: caseData.buyer_id,
    buyerEmail: caseData.buyer_email,
    caseNumber: caseData.case_number,
    amount: breakdown.total,
    paymentType: paymentType
  });
  
  // Mettre à jour le statut du dossier
  await PurchaseWorkflowService.updateCaseStatus(
    caseData.id,
    'fees_payment_pending',
    user.id,
    'Demande de paiement des frais de notaire envoyée'
  );
};

const calculateFeesBreakdown = (purchasePrice) => {
  const registrationFees = purchasePrice * 0.10; // 10%
  const notaryFees = purchasePrice * 0.05;       // 5%
  const taxesAndStamps = purchasePrice * 0.025;  // 2.5%
  
  return {
    registration_fees: registrationFees,
    notary_fees: notaryFees,
    taxes_stamps: taxesAndStamps,
    total: registrationFees + notaryFees + taxesAndStamps
  };
};
```

#### Étape 2: Acheteur reçoit notification
```javascript
// CaseTrackingUnified.jsx - Section "Actions Disponibles"
const [paymentRequests, setPaymentRequests] = useState([]);

useEffect(() => {
  loadPaymentRequests();
}, [caseData?.id]);

const loadPaymentRequests = async () => {
  const { data } = await supabase
    .from('notary_payment_requests')
    .select('*')
    .eq('case_id', caseData.id)
    .eq('payer_id', user.id)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  
  setPaymentRequests(data || []);
};
```

#### Étape 3: Acheteur paie
```javascript
// PaymentModal.jsx - Nouveau composant
const handlePayment = async (paymentMethod) => {
  // 1. Créer transaction de paiement
  const { data: transaction } = await supabase
    .from('payment_transactions')
    .insert({
      case_id: paymentRequest.case_id,
      notary_request_id: paymentRequest.id,
      amount: paymentRequest.amount,
      payment_method: paymentMethod,
      status: 'pending',
      payer_id: user.id
    })
    .select()
    .single();
  
  // 2. Rediriger vers gateway de paiement
  if (paymentMethod === 'wave') {
    // Intégration Wave API
    await initiateWavePayment(transaction);
  } else if (paymentMethod === 'orange_money') {
    // Intégration Orange Money API
    await initiateOrangeMoneyPayment(transaction);
  }
  
  // 3. Webhook callback confirmera le paiement
};
```

#### Étape 4: Confirmation automatique
```javascript
// Webhook handler (backend ou Supabase Edge Function)
export const handlePaymentWebhook = async (webhookData) => {
  if (webhookData.status === 'success') {
    // 1. Mettre à jour la demande de paiement
    await supabase
      .from('notary_payment_requests')
      .update({
        status: 'paid',
        paid_at: new Date().toISOString(),
        payment_method: webhookData.payment_method,
        transaction_reference: webhookData.reference
      })
      .eq('id', webhookData.notary_request_id);
    
    // 2. Mettre à jour transaction
    await supabase
      .from('payment_transactions')
      .update({ status: 'completed' })
      .eq('id', webhookData.transaction_id);
    
    // 3. Avancer le workflow
    const { data: request } = await supabase
      .from('notary_payment_requests')
      .select('case_id, request_type')
      .eq('id', webhookData.notary_request_id)
      .single();
    
    let nextStatus;
    if (request.request_type === 'deposit') {
      nextStatus = 'title_verification';
    } else if (request.request_type === 'notary_fees') {
      nextStatus = 'contract_preparation';
    } else if (request.request_type === 'final_payment') {
      nextStatus = 'property_registration';
    }
    
    await PurchaseWorkflowService.updateCaseStatus(
      request.case_id,
      nextStatus,
      null,
      `Paiement confirmé: ${request.request_type}`
    );
    
    // 4. Notifier le notaire
    await NotificationService.sendPaymentConfirmation({
      notaryId: webhookData.notary_id,
      caseNumber: webhookData.case_number,
      amount: webhookData.amount
    });
  }
};
```

---

## 🎯 ALIGNEMENT BOUTONS D'ACTIONS AVEC TIMELINE

### 1. Configuration des actions par étape

```javascript
// WorkflowStatusService.js - Nouvelle structure
static notaryActions = {
  'buyer_verification': {
    label: 'Valider identité acheteur',
    action: 'validate_buyer',
    nextStatus: 'seller_notification',
    icon: 'CheckCircle',
    color: 'blue'
  },
  'seller_notification': {
    label: 'Notifier le vendeur',
    action: 'notify_seller',
    nextStatus: 'preliminary_agreement',
    icon: 'Bell',
    color: 'indigo'
  },
  'preliminary_agreement': {
    label: 'Générer promesse de vente',
    action: 'generate_preliminary_agreement',
    nextStatus: 'deposit_payment',
    icon: 'FileText',
    color: 'purple'
  },
  'deposit_payment': {
    label: 'Demander versement des arrhes (10%)',
    action: 'request_deposit_payment',
    nextStatus: 'fees_payment_pending',
    icon: 'DollarSign',
    color: 'green',
    requiresPayment: true,
    paymentType: 'deposit'
  },
  'title_verification': {
    label: 'Vérifier titres de propriété',
    action: 'verify_title',
    nextStatus: 'property_survey',
    icon: 'Shield',
    color: 'blue'
  },
  'property_survey': {
    label: 'Lancer enquête au Conservateur',
    action: 'initiate_property_survey',
    nextStatus: 'certificate_verification',
    icon: 'Search',
    color: 'cyan'
  },
  'certificate_verification': {
    label: 'Obtenir certificats (non-gage, non-expropriation)',
    action: 'request_certificates',
    nextStatus: 'tax_clearance',
    icon: 'FileCheck',
    color: 'teal'
  },
  'tax_clearance': {
    label: 'Vérifier situation fiscale',
    action: 'verify_tax_status',
    nextStatus: 'land_survey',
    icon: 'Receipt',
    color: 'amber'
  },
  'land_survey': {
    label: 'Commander bornage et métrés',
    action: 'order_land_survey',
    nextStatus: 'notary_fees_calculation',
    icon: 'Map',
    color: 'orange'
  },
  'notary_fees_calculation': {
    label: 'Calculer frais de notaire (15-20%)',
    action: 'calculate_notary_fees',
    nextStatus: 'payment_request',
    icon: 'Calculator',
    color: 'pink'
  },
  'payment_request': {
    label: 'Envoyer demande de paiement frais',
    action: 'request_notary_fees_payment',
    nextStatus: 'fees_payment_pending',
    icon: 'Send',
    color: 'red',
    requiresPayment: true,
    paymentType: 'notary_fees'
  },
  'fees_payment_pending': {
    label: 'Attendre paiement...',
    action: null, // Pas d'action, automatique après paiement
    nextStatus: 'contract_preparation',
    icon: 'Clock',
    color: 'gray',
    disabled: true
  },
  'contract_preparation': {
    label: 'Rédiger acte de vente',
    action: 'draft_sales_contract',
    nextStatus: 'signing_appointment',
    icon: 'FileEdit',
    color: 'violet'
  },
  'signing_appointment': {
    label: 'Planifier rendez-vous signature',
    action: 'schedule_signing',
    nextStatus: 'final_payment_pending',
    icon: 'Calendar',
    color: 'indigo'
  },
  'final_payment_pending': {
    label: 'Demander paiement du solde',
    action: 'request_final_payment',
    nextStatus: 'property_registration',
    icon: 'CreditCard',
    color: 'green',
    requiresPayment: true,
    paymentType: 'final_payment'
  },
  'property_registration': {
    label: 'Enregistrer au Livre Foncier',
    action: 'register_property',
    nextStatus: 'property_transfer',
    icon: 'Book',
    color: 'blue'
  },
  'property_transfer': {
    label: 'Organiser remise des clés',
    action: 'transfer_property',
    nextStatus: 'completed',
    icon: 'Key',
    color: 'emerald'
  },
  'completed': {
    label: 'Dossier complété',
    action: null,
    nextStatus: null,
    icon: 'CheckCircle2',
    color: 'green',
    disabled: true
  }
};
```

### 2. Composant dynamique des boutons d'actions

```javascript
// NotaireCaseDetailModern.jsx - Section Actions
const ActionButtonsSection = ({ currentStatus, caseData }) => {
  const actionConfig = WorkflowStatusService.notaryActions[currentStatus];
  
  if (!actionConfig) return null;
  
  const handleAction = async () => {
    if (actionConfig.requiresPayment) {
      // Ouvrir modal de demande de paiement
      setShowPaymentRequestModal(true);
      setPaymentRequestType(actionConfig.paymentType);
    } else {
      // Exécuter l'action directement
      await executeNotaryAction(actionConfig.action);
    }
  };
  
  return (
    <Card className="border-l-4 border-l-blue-600">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-blue-600" />
          Action Requise
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg">
            <div className={`p-3 bg-${actionConfig.color}-100 rounded-xl`}>
              {/* Icon dynamique */}
              {React.createElement(
                lucideIcons[actionConfig.icon],
                { className: `w-6 h-6 text-${actionConfig.color}-600` }
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                {actionConfig.label}
              </p>
              <p className="text-sm text-slate-600">
                Étape actuelle: {WorkflowStatusService.getLabel(currentStatus)}
              </p>
            </div>
          </div>
          
          <Button
            onClick={handleAction}
            disabled={actionConfig.disabled || loading}
            className="w-full"
            size="lg"
          >
            {actionConfig.requiresPayment ? (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Demander le paiement
              </>
            ) : (
              <>
                {React.createElement(lucideIcons[actionConfig.icon], {
                  className: 'w-4 h-4 mr-2'
                })}
                {actionConfig.label}
              </>
            )}
          </Button>
          
          {actionConfig.requiresPayment && (
            <Alert>
              <Info className="w-4 h-4" />
              <AlertDescription>
                Cette action déclenchera une demande de paiement à l'acheteur.
                Il sera notifié par email et pourra payer via Wave, Orange Money ou virement bancaire.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 📱 INTERFACE CÔTÉ ACHETEUR/VENDEUR

### 1. Section "Actions Disponibles"

```javascript
// CaseTrackingUnified.jsx - Nouveau composant
const AvailableActionsSection = () => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  
  useEffect(() => {
    loadPaymentRequests();
  }, [caseData?.id]);
  
  const loadPaymentRequests = async () => {
    const { data } = await supabase
      .from('notary_payment_requests')
      .select('*')
      .eq('case_id', caseData.id)
      .eq('payer_id', user.id)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false });
    
    setPaymentRequests(data || []);
  };
  
  if (paymentRequests.length === 0) return null;
  
  return (
    <Card className="border-l-4 border-l-red-500 animate-pulse-slow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-700">
          <AlertCircle className="w-5 h-5" />
          Action Requise - Paiement en attente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentRequests.map(request => (
            <div
              key={request.id}
              className="p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-slate-900">
                    {getPaymentTypeLabel(request.request_type)}
                  </h4>
                  <p className="text-sm text-slate-600 mt-1">
                    {request.description}
                  </p>
                </div>
                <Badge className="bg-red-500 text-white">
                  EN ATTENTE
                </Badge>
              </div>
              
              {/* Détails des frais */}
              <div className="mb-4 p-3 bg-white rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Droits d'enregistrement</span>
                  <span className="font-medium">
                    {formatCurrency(request.breakdown.registration_fees)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Honoraires notaire</span>
                  <span className="font-medium">
                    {formatCurrency(request.breakdown.notary_fees)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes et timbres</span>
                  <span className="font-medium">
                    {formatCurrency(request.breakdown.taxes_stamps)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total à payer</span>
                  <span className="text-red-600">
                    {formatCurrency(request.amount)}
                  </span>
                </div>
              </div>
              
              <Button
                onClick={() => openPaymentModal(request)}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Procéder au paiement
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
```

### 2. Modal de paiement

```javascript
// PaymentModal.jsx - Nouveau composant
const PaymentModal = ({ isOpen, onClose, paymentRequest }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const paymentMethods = [
    {
      id: 'wave',
      name: 'Wave',
      icon: '💳',
      description: 'Paiement instantané via Wave',
      fees: '0%'
    },
    {
      id: 'orange_money',
      name: 'Orange Money',
      icon: '🟠',
      description: 'Paiement mobile Orange',
      fees: '1%'
    },
    {
      id: 'bank_transfer',
      name: 'Virement Bancaire',
      icon: '🏦',
      description: 'Transfert depuis votre banque',
      fees: '0%'
    },
    {
      id: 'card',
      name: 'Carte Bancaire',
      icon: '💳',
      description: 'Visa, Mastercard',
      fees: '2.5%'
    }
  ];
  
  const handlePayment = async () => {
    setLoading(true);
    try {
      // Créer transaction
      const { data: transaction } = await supabase
        .from('payment_transactions')
        .insert({
          case_id: paymentRequest.case_id,
          notary_request_id: paymentRequest.id,
          amount: paymentRequest.amount,
          payment_method: selectedMethod,
          status: 'pending',
          payer_id: user.id
        })
        .select()
        .single();
      
      // Rediriger vers gateway
      if (selectedMethod === 'wave') {
        await initiateWavePayment(transaction);
      } else if (selectedMethod === 'orange_money') {
        await initiateOrangeMoneyPayment(transaction);
      } else if (selectedMethod === 'card') {
        await initiateCardPayment(transaction);
      } else {
        // Virement bancaire - montrer instructions
        setShowBankTransferInstructions(true);
      }
    } catch (error) {
      toast.error('Erreur lors du paiement: ' + error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choisissez votre mode de paiement</DialogTitle>
          <DialogDescription>
            Montant à payer: <span className="font-bold text-xl">
              {formatCurrency(paymentRequest.amount)}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4 my-6">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 border-2 rounded-xl transition-all ${
                selectedMethod === method.id
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-4xl mb-2">{method.icon}</div>
              <h4 className="font-semibold">{method.name}</h4>
              <p className="text-sm text-slate-600 mt-1">
                {method.description}
              </p>
              <Badge className="mt-2">{method.fees} frais</Badge>
            </button>
          ))}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            onClick={handlePayment}
            disabled={!selectedMethod || loading}
            className="bg-gradient-to-r from-emerald-600 to-teal-600"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <CreditCard className="w-4 h-4 mr-2" />
            )}
            Payer {formatCurrency(paymentRequest.amount)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
```

---

## 🚀 PLAN D'IMPLÉMENTATION

### Étape 1: Mise à jour du workflow (1-2h)
- [ ] Mettre à jour `WorkflowStatusService.chronologicalOrder` avec 18 étapes
- [ ] Ajouter `WorkflowStatusService.notaryActions` configuration
- [ ] Créer migrations SQL pour nouvelles étapes

### Étape 2: Tables de paiement (30min)
- [ ] Créer table `notary_payment_requests`
- [ ] Ajouter colonnes à `payment_transactions`
- [ ] Créer policies RLS

### Étape 3: Interface Notaire (2-3h)
- [ ] Créer composant `ActionButtonsSection`
- [ ] Ajouter logique demande de paiement
- [ ] Intégrer calcul automatique des frais
- [ ] Créer modal `PaymentRequestModal`

### Étape 4: Interface Acheteur/Vendeur (2-3h)
- [ ] Créer composant `AvailableActionsSection`
- [ ] Créer composant `PaymentModal`
- [ ] Intégrer choix du mode de paiement
- [ ] Afficher détails des frais

### Étape 5: Intégration Gateway Payment (3-4h)
- [ ] Intégrer Wave API
- [ ] Intégrer Orange Money API
- [ ] Créer webhook handler
- [ ] Tester confirmation automatique

### Étape 6: Notifications (1h)
- [ ] Email notaire → acheteur (demande paiement)
- [ ] Email acheteur → notaire (paiement confirmé)
- [ ] SMS notifications (optionnel)

### Étape 7: Tests (2h)
- [ ] Tester chaque étape du workflow
- [ ] Tester demandes de paiement
- [ ] Tester confirmations automatiques
- [ ] Vérifier notifications

---

## 📝 FICHIERS À CRÉER/MODIFIER

### Nouveaux fichiers
1. `src/components/payment/PaymentModal.jsx`
2. `src/components/payment/PaymentMethodSelector.jsx`
3. `src/components/notaire/ActionButtonsSection.jsx`
4. `src/components/buyer/AvailableActionsSection.jsx`
5. `src/services/PaymentGatewayService.js`
6. `src/services/NotaryFeesCalculator.js`
7. `migrations/create_notary_payment_requests.sql`
8. `migrations/update_workflow_stages.sql`

### Fichiers à modifier
1. `src/services/WorkflowStatusService.js` - Ajouter 18 étapes + actions
2. `src/pages/dashboards/notaire/NotaireCaseDetailModern.jsx` - Ajouter section actions
3. `src/pages/CaseTrackingUnified.jsx` - Ajouter section paiements
4. `src/services/PurchaseWorkflowService.js` - Logique paiements
5. `src/services/NotificationService.js` - Nouvelles notifications

---

## 💡 AMÉLIORATIONS FUTURES

1. **Dashboard Notaire**: Voir tous les paiements en attente
2. **Historique des paiements**: Timeline détaillée
3. **Génération automatique des documents**: Promesse de vente, acte de vente
4. **Signature électronique**: Intégration DocuSign ou équivalent
5. **Rappels automatiques**: Si paiement pas fait après X jours
6. **Split payment**: Partager frais entre acheteur et vendeur
7. **Facturation**: Générer facture PDF pour chaque paiement

---

**TEMPS ESTIMÉ TOTAL**: 12-16 heures de développement
**PRIORITÉ**: HAUTE - Essentiel pour le workflow complet
