# 🚀 GUIDE D'IMPLÉMENTATION SUITE - SYSTÈME PAIEMENT NOTAIRE

## ✅ DÉJÀ COMPLÉTÉ

1. ✅ **WorkflowStatusService** - 18 étapes + configuration notaryActions
2. ✅ **Migration SQL** - Table notary_payment_requests + RLS policies
3. ✅ **NotaryFeesCalculator** - Service de calcul frais (10% + 5% + 2.5%)
4. ✅ **ActionButtonsSection** - Composant boutons d'actions notaire

## 🔄 ÉTAPES RESTANTES (À IMPLÉMENTER)

### Étape 5: PaymentRequestModal (Notaire)
**Fichier**: `src/components/modals/PaymentRequestModal.jsx`

```jsx
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import NotaryFeesCalculator from '@/services/NotaryFeesCalculator';
import { toast } from 'sonner';

const PaymentRequestModal = ({ isOpen, onClose, caseData, paymentType, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  
  // Calculer les frais
  const calculation = paymentType === 'deposit' 
    ? NotaryFeesCalculator.calculateDeposit(caseData.purchase_price)
    : paymentType === 'notary_fees'
    ? NotaryFeesCalculator.calculateNotaryFees(caseData.purchase_price)
    : NotaryFeesCalculator.calculateFinalPayment(caseData.purchase_price);
  
  const handleSubmit = async () => {
    setLoading(true);
    const result = await NotaryFeesCalculator.createPaymentRequest({
      caseId: caseData.id,
      requestType: paymentType,
      payerId: caseData.buyer_id,
      payerRole: 'buyer',
      notaryId: caseData.notaire_id,
      purchasePrice: caseData.purchase_price
    });
    
    if (result.success) {
      toast.success('Demande de paiement envoyée');
      onSuccess?.();
      onClose();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <h2>Demande de Paiement</h2>
        {/* Afficher détails du calcul */}
        <div>
          {Object.entries(calculation.breakdown).map(([key, value]) => (
            <div key={key}>{key}: {NotaryFeesCalculator.formatCurrency(value)}</div>
          ))}
        </div>
        <Button onClick={handleSubmit} disabled={loading}>
          Envoyer la demande
        </Button>
      </DialogContent>
    </Dialog>
  );
};
```

### Étape 6: AvailableActionsSection (Acheteur)
**Fichier**: `src/components/buyer/AvailableActionsSection.jsx`

```jsx
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import NotaryFeesCalculator from '@/services/NotaryFeesCalculator';
import { AlertCircle, CreditCard } from 'lucide-react';

const AvailableActionsSection = ({ caseData, user, onPaymentClick }) => {
  const [paymentRequests, setPaymentRequests] = useState([]);
  
  useEffect(() => {
    loadPaymentRequests();
  }, [caseData?.id]);
  
  const loadPaymentRequests = async () => {
    const result = await NotaryFeesCalculator.getPendingPaymentRequests(user.id);
    if (result.success) {
      setPaymentRequests(result.data);
    }
  };
  
  if (paymentRequests.length === 0) return null;
  
  return (
    <Card className="border-l-4 border-l-red-500">
      <div className="p-6">
        <h3 className="flex items-center gap-2 text-red-700 font-bold mb-4">
          <AlertCircle className="w-5 h-5" />
          Paiement en attente
        </h3>
        
        {paymentRequests.map(request => (
          <div key={request.id} className="p-4 bg-red-50 rounded-lg mb-3">
            <p className="font-semibold">{request.description}</p>
            <p className="text-2xl font-bold text-red-600 my-2">
              {NotaryFeesCalculator.formatCurrency(request.amount)}
            </p>
            
            <Button 
              onClick={() => onPaymentClick(request)}
              className="w-full bg-emerald-600"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Procéder au paiement
            </Button>
          </div>
        ))}
      </div>
    </Card>
  );
};
```

### Étape 7: PaymentModal (Acheteur)
**Fichier**: `src/components/modals/PaymentModal.jsx`

```jsx
import { useState } from 'react';
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const PaymentModal = ({ isOpen, onClose, paymentRequest }) => {
  const [selectedMethod, setSelectedMethod] = useState(null);
  
  const paymentMethods = [
    { id: 'wave', name: 'Wave', icon: '💳', fees: '0%' },
    { id: 'orange_money', name: 'Orange Money', icon: '🟠', fees: '1%' },
    { id: 'bank_transfer', name: 'Virement', icon: '🏦', fees: '0%' },
    { id: 'card', name: 'Carte', icon: '💳', fees: '2.5%' }
  ];
  
  const handlePayment = async () => {
    // TODO: Intégrer avec PaymentGatewayService
    console.log('Payment:', selectedMethod, paymentRequest);
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <h2>Choisir mode de paiement</h2>
        <div className="grid grid-cols-2 gap-4">
          {paymentMethods.map(method => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 border-2 rounded-xl ${
                selectedMethod === method.id ? 'border-blue-600' : 'border-gray-200'
              }`}
            >
              <div className="text-4xl">{method.icon}</div>
              <h4>{method.name}</h4>
              <Badge>{method.fees} frais</Badge>
            </button>
          ))}
        </div>
        <Button onClick={handlePayment} disabled={!selectedMethod}>
          Payer
        </Button>
      </DialogContent>
    </Dialog>
  );
};
```

### Étape 8: PaymentGatewayService
**Fichier**: `src/services/PaymentGatewayService.js`

```javascript
import { supabase } from '@/lib/supabaseClient';

export class PaymentGatewayService {
  // Configuration Wave API
  static WAVE_API_URL = process.env.VITE_WAVE_API_URL || 'https://api.wave.com';
  static WAVE_API_KEY = process.env.VITE_WAVE_API_KEY;
  
  // Configuration Orange Money API
  static ORANGE_API_URL = process.env.VITE_ORANGE_API_URL;
  static ORANGE_API_KEY = process.env.VITE_ORANGE_API_KEY;
  
  /**
   * Initier paiement Wave
   */
  static async initiateWavePayment(transaction) {
    try {
      const response = await fetch(`${this.WAVE_API_URL}/v1/checkout/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.WAVE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          amount: transaction.amount,
          currency: 'XOF',
          success_url: `${window.location.origin}/payment/success`,
          cancel_url: `${window.location.origin}/payment/cancel`,
          metadata: {
            transaction_id: transaction.id,
            notary_request_id: transaction.notary_request_id
          }
        })
      });
      
      const data = await response.json();
      
      if (data.wave_launch_url) {
        window.location.href = data.wave_launch_url;
      }
      
      return { success: true, data };
    } catch (error) {
      console.error('Wave payment error:', error);
      return { success: false, error: error.message };
    }
  }
  
  /**
   * Initier paiement Orange Money
   */
  static async initiateOrangeMoneyPayment(transaction) {
    // TODO: Implémenter Orange Money API
    console.log('Orange Money payment:', transaction);
    return { success: false, error: 'Non implémenté' };
  }
}
```

### Étape 9: Intégration dans NotaireCaseDetailModern
**Fichier**: `src/pages/dashboards/notaire/NotaireCaseDetailModern.jsx`

Ajouter dans le composant:

```jsx
import ActionButtonsSection from '@/components/notaire/ActionButtonsSection';
import PaymentRequestModal from '@/components/modals/PaymentRequestModal';
import PurchaseWorkflowService from '@/services/PurchaseWorkflowService';

// Dans le composant:
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [paymentModalData, setPaymentModalData] = useState(null);

const handleActionClick = async ({ action, nextStatus }) => {
  // Exécuter action et avancer workflow
  const result = await PurchaseWorkflowService.updateCaseStatus(
    caseData.id,
    nextStatus,
    user.id,
    `Action: ${action}`
  );
  
  if (result.success) {
    toast.success('Action effectuée');
    await loadCaseData(); // Recharger
  }
};

const handlePaymentRequestClick = ({ paymentType, nextStatus }) => {
  setPaymentModalData({ paymentType, nextStatus });
  setShowPaymentModal(true);
};

// Dans le JSX:
<ActionButtonsSection
  currentStatus={caseData.status}
  caseData={caseData}
  onActionClick={handleActionClick}
  onPaymentRequestClick={handlePaymentRequestClick}
/>

<PaymentRequestModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  caseData={caseData}
  paymentType={paymentModalData?.paymentType}
  onSuccess={() => loadCaseData()}
/>
```

### Étape 10: Intégration dans CaseTrackingUnified
**Fichier**: `src/pages/CaseTrackingUnified.jsx`

```jsx
import AvailableActionsSection from '@/components/buyer/AvailableActionsSection';
import PaymentModal from '@/components/modals/PaymentModal';

// Dans le composant:
const [showPaymentModal, setShowPaymentModal] = useState(false);
const [selectedPaymentRequest, setSelectedPaymentRequest] = useState(null);

const handlePaymentClick = (paymentRequest) => {
  setSelectedPaymentRequest(paymentRequest);
  setShowPaymentModal(true);
};

// Dans le JSX (avant TimelineTrackerModern):
<AvailableActionsSection
  caseData={caseData}
  user={user}
  onPaymentClick={handlePaymentClick}
/>

<PaymentModal
  isOpen={showPaymentModal}
  onClose={() => setShowPaymentModal(false)}
  paymentRequest={selectedPaymentRequest}
/>
```

## 📝 FICHIERS À CRÉER MANUELLEMENT

1. ✅ `src/services/WorkflowStatusService.js` - FAIT
2. ✅ `migrations/create_notary_payment_system.sql` - FAIT
3. ✅ `src/services/NotaryFeesCalculator.js` - FAIT
4. ✅ `src/components/notaire/ActionButtonsSection.jsx` - FAIT
5. ⏳ `src/components/modals/PaymentRequestModal.jsx` - À FAIRE
6. ⏳ `src/components/buyer/AvailableActionsSection.jsx` - À FAIRE
7. ⏳ `src/components/modals/PaymentModal.jsx` - À FAIRE
8. ⏳ `src/services/PaymentGatewayService.js` - À FAIRE
9. ⏳ Modifier `src/pages/dashboards/notaire/NotaireCaseDetailModern.jsx` - À FAIRE
10. ⏳ Modifier `src/pages/CaseTrackingUnified.jsx` - À FAIRE

## 🔄 ORDRE D'IMPLÉMENTATION RECOMMANDÉ

### Phase 1 (Fait)
- [x] WorkflowStatusService
- [x] Migration SQL
- [x] NotaryFeesCalculator
- [x] ActionButtonsSection

### Phase 2 (Suite)
- [ ] PaymentRequestModal
- [ ] Intégrer dans NotaireCaseDetailModern
- [ ] Tester création demande de paiement

### Phase 3
- [ ] AvailableActionsSection
- [ ] PaymentModal
- [ ] Intégrer dans CaseTrackingUnified
- [ ] Tester affichage demandes côté acheteur

### Phase 4
- [ ] PaymentGatewayService
- [ ] Webhook handler (Supabase Edge Function)
- [ ] Tester paiements Wave/Orange Money

### Phase 5
- [ ] Notifications (NotificationService)
- [ ] Tests end-to-end complets
- [ ] Documentation

## 🚀 PROCHAINE ACTION

Exécuter la migration SQL dans Supabase:
```bash
# Copier le contenu de migrations/create_notary_payment_system.sql
# Aller dans Supabase Dashboard > SQL Editor
# Coller et exécuter
```

Ensuite continuer avec Phase 2.
