# 🔍 AUDIT COMPLET - DEMANDES D'ACHAT VENDEUR

**Date**: 16 Octobre 2025  
**Status**: 🔴 CRITIQUE - Actions Non Fonctionnelles  
**Priorité**: HAUTE

---

## 📊 ÉTAT DES LIEUX

### ✅ Ce qui Fonctionne
- [x] Les demandes s'affichent correctement dans le dashboard vendeur
- [x] Les transactions sont créées avec tous les champs requis (transaction_type, buyer_id, seller_id, parcel_id)
- [x] Le filtre par parcel_id fonctionne
- [x] L'UI est moderne et responsive
- [x] Les statistiques (total, pending, completed, revenue) s'affichent

### ❌ CE QUI NE FONCTIONNE PAS

#### 1. **Boutons d'Action Vendeur** 🚨 CRITIQUE
**Fichier**: `src/pages/dashboards/vendeur/VendeurPurchaseRequests.jsx`

**Problèmes Identifiés**:

##### A. Bouton "Accepter" (handleAccept)
```javascript
// Ligne 85-145
const handleAccept = async (requestId) => {
  // 🔴 PROBLÈME 1: Utilise request.user_id comme buyer_id
  // Mais transactions.user_id peut être différent de buyer_id
  const request = requests.find(r => r.id === requestId);
  
  // 🔴 PROBLÈME 2: request.offered_price ou request.offer_price
  // Mais ces champs sont mappés depuis transaction.amount
  purchase_price: request.offered_price || request.offer_price,
  
  // 🔴 PROBLÈME 3: request.payment_method peut être null/undefined
  // Pas de valeur par défaut
  payment_method: request.payment_method || 'cash',
}
```

**Erreurs Potentielles**:
- `request.user_id` peut être `null` → buyer_id invalide
- `request.parcel_id` peut ne pas correspondre au `parcelle_id` attendu
- `request.offered_price` peut être `undefined` → purchase_price = 0
- `request.payment_method` peut être `null` → crée avec 'cash' par défaut (incorrect)

##### B. Bouton "Négocier" (handleNegotiate)
```javascript
// Ligne 205-246
const handleNegotiate = async (request) => {
  // ✅ Crée un purchase_case en mode négociation
  // ❌ MANQUE: Pas de modal pour saisir la contre-offre
  // ❌ MANQUE: Pas de formulaire de négociation
  // ❌ MANQUE: Pas de sauvegarde de la nouvelle offre
  
  toast.info('💬 Négociation ouverte ! Fonctionnalité complète à venir');
  // TODO: Ouvrir modal de négociation avec formulaire de contre-offre
}
```

**Actions Manquantes**:
- [ ] Modal de négociation
- [ ] Formulaire: nouveau prix, message, conditions
- [ ] Insertion dans `purchase_case_negotiations` table
- [ ] Notification à l'acheteur

##### C. Bouton "Voir Détails" (handleViewDetails)
```javascript
// Ligne 248-251
const handleViewDetails = (request) => {
  toast.info('Détails de la demande à venir ! 📋');
  // TODO: Ouvrir modal avec tous les détails de la transaction
}
```

**Détails Manquants**:
- [ ] Modal avec informations complètes
- [ ] Informations acheteur: nom, email, téléphone, adresse
- [ ] Informations parcelle: titre, localisation, surface, prix
- [ ] Historique de la demande
- [ ] Documents joints (si applicable)
- [ ] Timeline du workflow

##### D. Bouton "Contacter" (handleContact)
```javascript
// Ligne 253-259
const handleContact = (request) => {
  if (request.buyer_email) {
    window.location.href = `mailto:${request.buyer_email}`;
  } else {
    toast.error('Email de l\'acheteur non disponible');
  }
}
```

**Problèmes**:
- ✅ Email fonctionne (si disponible)
- ❌ Pas de numéro de téléphone clickable
- ❌ Pas de modal avec options de contact (Email, Téléphone, SMS, WhatsApp)
- ❌ Pas d'historique des communications

##### E. Bouton "Générer Contrat" (handleGenerateContract)
```javascript
// Ligne 261-264
const handleGenerateContract = (request) => {
  toast.info('Génération de contrat à venir ! 📄');
  // TODO: Générer PDF du contrat de vente
}
```

**Fonctionnalités Manquantes**:
- [ ] Génération PDF du contrat de vente
- [ ] Template de contrat personnalisable
- [ ] Signatures électroniques (vendeur + acheteur)
- [ ] Stockage du contrat dans `purchase_case_documents`
- [ ] Envoi automatique aux parties prenantes

---

#### 2. **Informations Manquantes dans les Demandes** 🟡 IMPORTANT

**Champs Absents**:

##### A. Type de Paiement (payment_method)
```javascript
// Ligne 399-405: Mapping incomplet
payment_method: transaction.payment_method,
```

**Problème**: 
- `transaction.payment_method` peut être:
  - `'cash'` (OneTimePaymentPage)
  - `'installments'` (InstallmentsPaymentPage)
  - `'bank_financing'` (BankFinancingPage)
  - `null` ou `undefined` (anciennes transactions)

**Solution Nécessaire**:
```javascript
payment_method: transaction.payment_method || 'unknown',
// + Afficher un badge "Type Non Défini" dans l'UI
```

##### B. Détails du Paiement Échelonné
```javascript
// ❌ MANQUE dans transactions table
installment_plan: {
  duration: 12,        // Non stocké
  monthly_amount: 0,   // Non stocké
  down_payment: 0,     // Non stocké
  total_amount: 0      // Stocké dans amount
}
```

**Impact**: 
- Impossible de voir le plan d'échelonnement
- Vendeur ne sait pas combien de mensualités
- Montant mensuel inconnu

##### C. Détails du Financement Bancaire
```javascript
// ❌ MANQUE dans transactions table
bank_financing: {
  bank_name: '',           // Non stocké
  loan_amount: 0,          // Non stocké
  interest_rate: 0,        // Non stocké
  loan_duration: 0,        // Non stocké
  employment_type: '',     // Non stocké
  monthly_income: 0        // Non stocké
}
```

**Impact**:
- Vendeur ne sait pas quelle banque finance
- Montant du prêt inconnu
- Durée du financement inconnue
- Profil financier de l'acheteur invisible

##### D. Détails Acheteur Incomplets
```javascript
// Ligne 396-401: Mapping partiel
buyer_info: buyerInfo,
buyer_name: buyerInfo.full_name || `${buyer?.first_name || ''} ${buyer?.last_name || ''}`.trim() || 'Acheteur',
buyer_email: buyerInfo.email || buyer?.email || '',
buyer_phone: buyerInfo.phone || buyer?.phone || '',
```

**Champs Manquants**:
- Adresse complète de l'acheteur
- Date de naissance
- Profession
- Nationalité
- Pièce d'identité
- Situation matrimoniale (important pour certains contrats)

---

#### 3. **Configuration Admin Manquante** 🔴 CRITIQUE

**Fichier Existant**: `src/pages/admin/AdminPricingPage.jsx`

**Configuration Actuelle**:
```javascript
// Ligne 42-107: Frais diaspora seulement
const defaultFees = [
  {
    category: 'construction_diaspora',
    name: 'Frais de Gestion Construction',
    type: 'percentage',
    value: 8
  },
  // ... autres frais diaspora
];
```

**❌ MANQUE: Configuration des Achats Fonciers**

##### A. Types de Paiement Autorisés
```javascript
// ❌ NON EXISTANT - À CRÉER
const paymentTypes = [
  {
    id: 'cash',
    name: 'Paiement Comptant',
    enabled: true,
    required_documents: ['id_card', 'proof_of_funds'],
    processing_time: '1-2 jours',
    admin_fee: 0.5,  // % du montant
    buyer_protection: true
  },
  {
    id: 'installments',
    name: 'Paiement Échelonné',
    enabled: true,
    min_down_payment: 20,  // % du prix
    max_duration: 24,      // mois
    interest_rate: 3,      // % annuel
    required_documents: ['id_card', 'proof_of_income', 'bank_statement'],
    admin_fee: 1.5,        // % du montant total
    buyer_protection: true
  },
  {
    id: 'bank_financing',
    name: 'Financement Bancaire',
    enabled: true,
    partner_banks: ['CBAO', 'BOA', 'Ecobank', 'UBA'],
    max_loan_to_value: 80, // % du prix
    required_documents: ['id_card', 'proof_of_income', 'tax_return', 'employment_certificate'],
    processing_time: '7-14 jours',
    admin_fee: 2,          // % du montant financé
    buyer_protection: true
  }
];
```

##### B. Règles de Prix
```javascript
// ❌ NON EXISTANT - À CRÉER
const pricingRules = {
  // Frais de plateforme
  platform_fees: {
    buyer_fee: 1,        // % du prix d'achat
    seller_fee: 2,       // % du prix de vente
    min_fee: 50000,      // FCFA
    max_fee: 5000000     // FCFA
  },
  
  // Frais de notaire (estimés)
  notary_fees: {
    base_percentage: 3,  // % du prix
    min_fee: 100000,
    registration_fee: 50000
  },
  
  // Frais administratifs
  admin_fees: {
    document_verification: 25000,  // FCFA
    title_search: 50000,
    survey_fee: 75000,
    contract_preparation: 100000
  },
  
  // Taxes
  taxes: {
    transfer_tax: 5,     // % du prix
    registration_tax: 1, // % du prix
    stamp_duty: 0.5      // % du prix
  }
};
```

##### C. Workflow de Validation
```javascript
// ❌ NON EXISTANT - À CRÉER
const validationWorkflow = {
  // Acceptation automatique si conditions remplies
  auto_accept: {
    enabled: false,
    conditions: {
      payment_method: 'cash',
      buyer_verified: true,
      funds_verified: true,
      min_price_met: true
    }
  },
  
  // Validation admin requise
  admin_approval_required: {
    high_value_threshold: 50000000,  // FCFA
    new_buyer: true,
    foreign_buyer: true,
    disputed_property: true
  },
  
  // Délais de réponse
  response_deadlines: {
    seller_initial_response: 48,    // heures
    buyer_counter_offer_response: 24,
    admin_verification: 72,
    notary_availability: 168        // 7 jours
  }
};
```

---

#### 4. **Données Metadata Non Structurées** 🟡 MOYEN

**Problème Actuel**:
```javascript
// Dans transactions table
metadata: {
  // Contenu variable selon la page de paiement
  // Pas de structure standardisée
  // Difficile à extraire et afficher
}
```

**Structure Nécessaire**:
```javascript
// Standard pour TOUS les types de paiement
metadata: {
  // Informations communes
  buyer_info: {
    full_name: '',
    email: '',
    phone: '',
    address: '',
    id_type: 'cni|passport|residence_permit',
    id_number: ''
  },
  
  // Informations parcelle
  parcel_info: {
    title: '',
    location: '',
    surface: 0,
    zone_type: '',
    cadastral_reference: ''
  },
  
  // Détails paiement (varie selon type)
  payment_details: {
    // Pour cash:
    payment_source: 'savings|inheritance|sale|loan',
    proof_of_funds: true,
    
    // Pour installments:
    down_payment_percentage: 20,
    monthly_amount: 0,
    duration_months: 12,
    
    // Pour bank_financing:
    bank_name: '',
    loan_amount: 0,
    interest_rate: 0,
    employment_type: '',
    monthly_income: 0
  },
  
  // Services additionnels
  additional_services: {
    notary: true,
    survey: false,
    legal_check: true,
    title_transfer: true,
    insurance: true
  },
  
  // Timestamps
  submitted_at: '',
  verified_at: '',
  approved_at: ''
}
```

---

## 🔧 SOLUTIONS PROPOSÉES

### Phase 1: Corrections Urgentes (1-2 jours)

#### 1.1 Corriger handleAccept - Données Fiables
```javascript
const handleAccept = async (requestId) => {
  setActionLoading(requestId);
  try {
    // ✅ 1. Récupérer la transaction COMPLÈTE depuis la DB
    const { data: transaction, error: txError } = await supabase
      .from('transactions')
      .select(`
        *,
        buyer:buyer_id(id, email, first_name, last_name, phone),
        parcel:parcel_id(id, title, location, surface, price, seller_id)
      `)
      .eq('id', requestId)
      .single();
    
    if (txError) throw txError;
    
    // ✅ 2. Vérifier que toutes les données essentielles existent
    if (!transaction.buyer_id || !transaction.seller_id || !transaction.parcel_id) {
      throw new Error('Transaction incomplète - données manquantes');
    }
    
    // ✅ 3. Créer le purchase_case avec données vérifiées
    const result = await PurchaseWorkflowService.createPurchaseCase({
      request_id: requestId,
      buyer_id: transaction.buyer_id,
      seller_id: transaction.seller_id,
      parcelle_id: transaction.parcel_id,
      purchase_price: transaction.amount,
      payment_method: transaction.payment_method || 'unknown',
      initiation_method: 'seller_acceptance',
      property_details: {
        title: transaction.parcel?.title,
        location: transaction.parcel?.location,
        surface: transaction.parcel?.surface
      },
      buyer_details: {
        name: `${transaction.buyer?.first_name} ${transaction.buyer?.last_name}`,
        email: transaction.buyer?.email,
        phone: transaction.buyer?.phone
      },
      payment_details: transaction.metadata?.payment_details || {}
    });
    
    if (!result.success) throw new Error(result.error);
    
    // ✅ 4. Mettre à jour la transaction
    const { error: updateError } = await supabase
      .from('transactions')
      .update({ 
        status: 'accepted',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId);
    
    if (updateError) throw updateError;
    
    // ✅ 5. Recharger et afficher succès
    await loadRequests();
    toast.success(`✅ Offre acceptée ! Dossier créé: ${result.case.case_number}`);
    
  } catch (error) {
    console.error('❌ Erreur acceptation:', error);
    toast.error('Erreur: ' + error.message);
  } finally {
    setActionLoading(null);
  }
};
```

#### 1.2 Créer Modal de Négociation
**Nouveau Fichier**: `src/components/modals/NegotiationModal.jsx`

```jsx
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const NegotiationModal = ({ request, isOpen, onClose, onSubmit }) => {
  const [counterOffer, setCounterOffer] = useState({
    new_price: request.offered_price,
    message: '',
    conditions: '',
    valid_until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 7 jours
  });

  const handleSubmit = () => {
    onSubmit(counterOffer);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Négociation - {request.parcels?.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Prix actuel */}
          <div className="bg-slate-100 p-4 rounded-lg">
            <p className="text-sm text-slate-600">Offre de l'acheteur</p>
            <p className="text-2xl font-bold">{request.offered_price?.toLocaleString()} FCFA</p>
          </div>
          
          {/* Contre-offre */}
          <div>
            <Label>Votre contre-offre (FCFA)</Label>
            <Input
              type="number"
              value={counterOffer.new_price}
              onChange={(e) => setCounterOffer({...counterOffer, new_price: parseInt(e.target.value)})}
            />
          </div>
          
          {/* Message */}
          <div>
            <Label>Message pour l'acheteur</Label>
            <Textarea
              placeholder="Expliquez votre contre-offre..."
              value={counterOffer.message}
              onChange={(e) => setCounterOffer({...counterOffer, message: e.target.value})}
              rows={4}
            />
          </div>
          
          {/* Conditions */}
          <div>
            <Label>Conditions particulières (optionnel)</Label>
            <Textarea
              placeholder="Ex: Paiement comptant uniquement, délai de libération 30 jours..."
              value={counterOffer.conditions}
              onChange={(e) => setCounterOffer({...counterOffer, conditions: e.target.value})}
              rows={3}
            />
          </div>
          
          {/* Validité */}
          <div>
            <Label>Valable jusqu'au</Label>
            <Input
              type="date"
              value={counterOffer.valid_until}
              onChange={(e) => setCounterOffer({...counterOffer, valid_until: e.target.value})}
            />
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1">
              Envoyer la contre-offre
            </Button>
            <Button variant="outline" onClick={onClose}>
              Annuler
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NegotiationModal;
```

#### 1.3 Créer Modal de Détails
**Nouveau Fichier**: `src/components/modals/RequestDetailsModal.jsx`

```jsx
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Home, CreditCard, FileText, Clock } from 'lucide-react';

const RequestDetailsModal = ({ request, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la Demande d'Achat</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Aperçu</TabsTrigger>
            <TabsTrigger value="buyer">Acheteur</TabsTrigger>
            <TabsTrigger value="payment">Paiement</TabsTrigger>
            <TabsTrigger value="timeline">Chronologie</TabsTrigger>
          </TabsList>
          
          {/* Aperçu */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm text-slate-600">Statut</p>
                <Badge>{request.status}</Badge>
              </div>
              <div className="border rounded-lg p-4">
                <p className="text-sm text-slate-600">Montant</p>
                <p className="text-xl font-bold">{request.offered_price?.toLocaleString()} FCFA</p>
              </div>
            </div>
            
            {/* Parcelle */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Home className="w-5 h-5" />
                <h3 className="font-semibold">Propriété</h3>
              </div>
              <p className="font-medium">{request.parcels?.title}</p>
              <p className="text-sm text-slate-600">{request.parcels?.location}</p>
              <p className="text-sm text-slate-600">{request.parcels?.surface} m²</p>
            </div>
          </TabsContent>
          
          {/* Acheteur */}
          <TabsContent value="buyer" className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5" />
                <h3 className="font-semibold">Informations Acheteur</h3>
              </div>
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-slate-600">Nom complet</p>
                  <p className="font-medium">{request.buyer_name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="font-medium">{request.buyer_email}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Téléphone</p>
                  <p className="font-medium">{request.buyer_phone || 'Non renseigné'}</p>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Paiement */}
          <TabsContent value="payment" className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5" />
                <h3 className="font-semibold">Mode de Paiement</h3>
              </div>
              <Badge>{request.payment_method || 'Non défini'}</Badge>
              
              {/* Détails selon le type */}
              {request.metadata?.payment_details && (
                <div className="mt-4 space-y-2">
                  {Object.entries(request.metadata.payment_details).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-slate-600 capitalize">{key.replace('_', ' ')}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Timeline */}
          <TabsContent value="timeline" className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5" />
                <h3 className="font-semibold">Historique</h3>
              </div>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Demande créée</p>
                    <p className="text-sm text-slate-600">
                      {new Date(request.created_at).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default RequestDetailsModal;
```

---

### Phase 2: Configuration Admin (2-3 jours)

#### 2.1 Créer Page de Configuration des Types de Paiement
**Nouveau Fichier**: `src/pages/admin/AdminPurchaseSettings.jsx`

```jsx
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

const AdminPurchaseSettings = () => {
  const [config, setConfig] = useState({
    payment_types: {
      cash: {
        enabled: true,
        admin_fee_percentage: 0.5,
        required_documents: ['id_card', 'proof_of_funds'],
        processing_time_hours: 48,
        buyer_protection: true
      },
      installments: {
        enabled: true,
        admin_fee_percentage: 1.5,
        min_down_payment_percentage: 20,
        max_duration_months: 24,
        interest_rate_annual: 3,
        required_documents: ['id_card', 'proof_of_income', 'bank_statement'],
        buyer_protection: true
      },
      bank_financing: {
        enabled: true,
        admin_fee_percentage: 2,
        max_loan_to_value_percentage: 80,
        required_documents: ['id_card', 'proof_of_income', 'tax_return'],
        partner_banks: ['CBAO', 'BOA', 'Ecobank', 'UBA'],
        processing_time_days: 14,
        buyer_protection: true
      }
    },
    pricing_rules: {
      platform_fees: {
        buyer_fee_percentage: 1,
        seller_fee_percentage: 2,
        min_fee_fcfa: 50000,
        max_fee_fcfa: 5000000
      },
      notary_fees: {
        base_percentage: 3,
        min_fee_fcfa: 100000,
        registration_fee_fcfa: 50000
      }
    }
  });

  const saveConfig = async () => {
    try {
      // Sauvegarder dans settings table ou purchase_config table
      const { error } = await supabase
        .from('purchase_configuration')
        .upsert({
          id: 'default',
          config: config,
          updated_at: new Date().toISOString()
        });
      
      if (error) throw error;
      toast.success('Configuration sauvegardée');
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la sauvegarde');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Configuration des Achats Fonciers</h1>
      
      <Tabs defaultValue="payment_types">
        <TabsList>
          <TabsTrigger value="payment_types">Types de Paiement</TabsTrigger>
          <TabsTrigger value="fees">Frais & Commissions</TabsTrigger>
          <TabsTrigger value="workflow">Workflow</TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment_types" className="space-y-4">
          {/* Paiement Comptant */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Paiement Comptant
                <Switch 
                  checked={config.payment_types.cash.enabled}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({
                      ...prev,
                      payment_types: {
                        ...prev.payment_types,
                        cash: { ...prev.payment_types.cash, enabled: checked }
                      }
                    }))
                  }
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Frais plateforme (%)</Label>
                <Input 
                  type="number" 
                  step="0.1"
                  value={config.payment_types.cash.admin_fee_percentage}
                  onChange={(e) => 
                    setConfig(prev => ({
                      ...prev,
                      payment_types: {
                        ...prev.payment_types,
                        cash: { 
                          ...prev.payment_types.cash, 
                          admin_fee_percentage: parseFloat(e.target.value) 
                        }
                      }
                    }))
                  }
                />
              </div>
              
              <div>
                <Label>Délai de traitement (heures)</Label>
                <Input 
                  type="number"
                  value={config.payment_types.cash.processing_time_hours}
                  onChange={(e) => 
                    setConfig(prev => ({
                      ...prev,
                      payment_types: {
                        ...prev.payment_types,
                        cash: { 
                          ...prev.payment_types.cash, 
                          processing_time_hours: parseInt(e.target.value) 
                        }
                      }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Paiement Échelonné */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Paiement Échelonné
                <Switch 
                  checked={config.payment_types.installments.enabled}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({
                      ...prev,
                      payment_types: {
                        ...prev.payment_types,
                        installments: { ...prev.payment_types.installments, enabled: checked }
                      }
                    }))
                  }
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Acompte minimum (%)</Label>
                  <Input 
                    type="number"
                    value={config.payment_types.installments.min_down_payment_percentage}
                    onChange={(e) => 
                      setConfig(prev => ({
                        ...prev,
                        payment_types: {
                          ...prev.payment_types,
                          installments: { 
                            ...prev.payment_types.installments, 
                            min_down_payment_percentage: parseInt(e.target.value) 
                          }
                        }
                      }))
                    }
                  />
                </div>
                
                <div>
                  <Label>Durée maximum (mois)</Label>
                  <Input 
                    type="number"
                    value={config.payment_types.installments.max_duration_months}
                    onChange={(e) => 
                      setConfig(prev => ({
                        ...prev,
                        payment_types: {
                          ...prev.payment_types,
                          installments: { 
                            ...prev.payment_types.installments, 
                            max_duration_months: parseInt(e.target.value) 
                          }
                        }
                      }))
                    }
                  />
                </div>
              </div>
              
              <div>
                <Label>Taux d'intérêt annuel (%)</Label>
                <Input 
                  type="number"
                  step="0.1"
                  value={config.payment_types.installments.interest_rate_annual}
                  onChange={(e) => 
                    setConfig(prev => ({
                      ...prev,
                      payment_types: {
                        ...prev.payment_types,
                        installments: { 
                          ...prev.payment_types.installments, 
                          interest_rate_annual: parseFloat(e.target.value) 
                        }
                      }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
          
          {/* Financement Bancaire */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Financement Bancaire
                <Switch 
                  checked={config.payment_types.bank_financing.enabled}
                  onCheckedChange={(checked) => 
                    setConfig(prev => ({
                      ...prev,
                      payment_types: {
                        ...prev.payment_types,
                        bank_financing: { ...prev.payment_types.bank_financing, enabled: checked }
                      }
                    }))
                  }
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Ratio prêt/valeur maximum (%)</Label>
                <Input 
                  type="number"
                  value={config.payment_types.bank_financing.max_loan_to_value_percentage}
                  onChange={(e) => 
                    setConfig(prev => ({
                      ...prev,
                      payment_types: {
                        ...prev.payment_types,
                        bank_financing: { 
                          ...prev.payment_types.bank_financing, 
                          max_loan_to_value_percentage: parseInt(e.target.value) 
                        }
                      }
                    }))
                  }
                />
              </div>
              
              <div>
                <Label>Banques partenaires (séparées par des virgules)</Label>
                <Input 
                  value={config.payment_types.bank_financing.partner_banks.join(', ')}
                  onChange={(e) => 
                    setConfig(prev => ({
                      ...prev,
                      payment_types: {
                        ...prev.payment_types,
                        bank_financing: { 
                          ...prev.payment_types.bank_financing, 
                          partner_banks: e.target.value.split(',').map(b => b.trim())
                        }
                      }
                    }))
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="fees" className="space-y-4">
          {/* Configuration des frais */}
          <Card>
            <CardHeader>
              <CardTitle>Frais de Plateforme</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Frais acheteur (%)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={config.pricing_rules.platform_fees.buyer_fee_percentage}
                  />
                </div>
                <div>
                  <Label>Frais vendeur (%)</Label>
                  <Input 
                    type="number"
                    step="0.1"
                    value={config.pricing_rules.platform_fees.seller_fee_percentage}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Button onClick={saveConfig} size="lg" className="w-full">
        Sauvegarder la Configuration
      </Button>
    </div>
  );
};

export default AdminPurchaseSettings;
```

---

### Phase 3: Améliorer Metadata (1 jour)

#### 3.1 Créer Structure Standard pour Metadata
**Nouveau Fichier**: `src/utils/transactionMetadataSchema.js`

```javascript
export const createTransactionMetadata = ({
  // Informations acheteur
  buyer_info,
  
  // Informations parcelle
  parcel_info,
  
  // Type de paiement
  payment_type,
  
  // Détails paiement (varie selon type)
  payment_details,
  
  // Services additionnels
  additional_services = {
    notary: true,
    survey: false,
    legal_check: true,
    title_transfer: true,
    insurance: true
  },
  
  // Timestamps
  submitted_at = new Date().toISOString()
}) => {
  return {
    version: '1.0',
    buyer_info: {
      full_name: buyer_info.full_name || '',
      email: buyer_info.email || '',
      phone: buyer_info.phone || '',
      address: buyer_info.address || '',
      id_type: buyer_info.id_type || 'cni',
      id_number: buyer_info.id_number || '',
      nationality: buyer_info.nationality || 'SN',
      date_of_birth: buyer_info.date_of_birth || '',
      occupation: buyer_info.occupation || ''
    },
    parcel_info: {
      title: parcel_info.title || '',
      location: parcel_info.location || '',
      surface: parcel_info.surface || 0,
      zone_type: parcel_info.zone_type || '',
      cadastral_reference: parcel_info.cadastral_reference || '',
      seller_name: parcel_info.seller_name || ''
    },
    payment_type: payment_type,
    payment_details: standardizePaymentDetails(payment_type, payment_details),
    additional_services: additional_services,
    timestamps: {
      submitted_at: submitted_at,
      verified_at: null,
      approved_at: null
    },
    verification_status: {
      buyer_verified: false,
      documents_verified: false,
      funds_verified: false,
      property_verified: false
    }
  };
};

const standardizePaymentDetails = (type, details) => {
  switch (type) {
    case 'cash':
      return {
        payment_source: details.payment_source || '',
        proof_of_funds: details.proof_of_funds || false,
        bank_name: details.bank_name || '',
        account_verified: details.account_verified || false
      };
    
    case 'installments':
      return {
        down_payment_percentage: details.down_payment_percentage || 20,
        down_payment_amount: details.down_payment_amount || 0,
        monthly_amount: details.monthly_amount || 0,
        duration_months: details.duration_months || 12,
        interest_rate: details.interest_rate || 3,
        total_amount: details.total_amount || 0,
        first_payment_date: details.first_payment_date || ''
      };
    
    case 'bank_financing':
      return {
        bank_name: details.bank_name || '',
        loan_amount: details.loan_amount || 0,
        down_payment: details.down_payment || 0,
        interest_rate: details.interest_rate || 0,
        loan_duration_years: details.loan_duration_years || 0,
        employment_type: details.employment_type || '',
        employer_name: details.employer_name || '',
        monthly_income: details.monthly_income || 0,
        employment_duration_years: details.employment_duration_years || 0
      };
    
    default:
      return details || {};
  }
};
```

#### 3.2 Mettre à Jour les Pages de Paiement
Modifier `OneTimePaymentPage.jsx`, `InstallmentsPaymentPage.jsx`, `BankFinancingPage.jsx`:

```javascript
import { createTransactionMetadata } from '@/utils/transactionMetadataSchema';

// Dans handleSubmit:
const metadata = createTransactionMetadata({
  buyer_info: {
    full_name: user.full_name,
    email: user.email,
    phone: user.phone,
    // ... autres champs du formulaire
  },
  parcel_info: {
    title: parcel.title,
    location: parcel.location,
    surface: parcel.surface,
    // ...
  },
  payment_type: 'cash', // ou 'installments', 'bank_financing'
  payment_details: {
    // Détails spécifiques selon le type
  },
  additional_services: additionalServices
});

// Insérer avec metadata structuré
await supabase.from('transactions').insert({
  // ... autres champs
  metadata: metadata
});
```

---

## 📋 CHECKLIST COMPLÈTE

### Phase 1: Urgences (1-2 jours) 🔴
- [ ] Corriger `handleAccept` avec récupération complète de la transaction
- [ ] Créer `NegotiationModal.jsx`
- [ ] Créer `RequestDetailsModal.jsx`
- [ ] Intégrer les modals dans `VendeurPurchaseRequests.jsx`
- [ ] Implémenter `handleNegotiate` avec insertion dans `purchase_case_negotiations`
- [ ] Implémenter `handleViewDetails` avec affichage modal
- [ ] Améliorer `handleContact` avec options multiples (Email, Phone, SMS, WhatsApp)
- [ ] Tester tous les boutons

### Phase 2: Configuration Admin (2-3 jours) 🟡
- [ ] Créer table `purchase_configuration` dans Supabase
- [ ] Créer page `AdminPurchaseSettings.jsx`
- [ ] Implémenter configuration des types de paiement
- [ ] Implémenter configuration des frais et commissions
- [ ] Implémenter configuration du workflow
- [ ] Créer API endpoint pour récupérer la configuration
- [ ] Utiliser la configuration dans les pages de paiement
- [ ] Afficher les frais calculés en temps réel

### Phase 3: Métadata (1 jour) 🟢
- [ ] Créer `transactionMetadataSchema.js`
- [ ] Mettre à jour `OneTimePaymentPage.jsx`
- [ ] Mettre à jour `InstallmentsPaymentPage.jsx`
- [ ] Mettre à jour `BankFinancingPage.jsx`
- [ ] Créer script SQL pour migrer anciennes metadata
- [ ] Valider structure des nouvelles transactions

### Phase 4: Génération de Contrats (3-4 jours) 🟣
- [ ] Installer `@react-pdf/renderer` ou `pdfmake`
- [ ] Créer template de contrat de vente
- [ ] Implémenter `handleGenerateContract`
- [ ] Ajouter signatures électroniques
- [ ] Stocker PDF dans Supabase Storage
- [ ] Référencer dans `purchase_case_documents`
- [ ] Envoyer par email aux parties

### Phase 5: Tests & Validation (2 jours) ⚪
- [ ] Tester workflow complet: Création → Acceptation → Négociation → Contrat
- [ ] Tester avec différents types de paiement
- [ ] Vérifier toutes les notifications
- [ ] Valider calculs de frais
- [ ] Tester en tant que vendeur
- [ ] Tester en tant qu'acheteur
- [ ] Documenter le processus

---

## 🎯 PRIORITÉS

**IMMÉDIAT (Cette semaine)**:
1. Corriger `handleAccept` - CRITIQUE
2. Créer modal de négociation
3. Créer modal de détails

**COURT TERME (Semaine prochaine)**:
4. Page configuration admin
5. Structure metadata standard

**MOYEN TERME (2 semaines)**:
6. Génération de contrats
7. Améliorer notifications

---

## 📞 QUESTIONS À CLARIFIER AVEC CLIENT

1. **Types de paiement**: Quels sont les types à activer par défaut?
2. **Frais plateforme**: Quel pourcentage voulez-vous prendre sur chaque transaction?
3. **Durée échelonnement**: Maximum 12, 24, ou 36 mois?
4. **Banques partenaires**: Quelles banques pour le financement?
5. **Documents requis**: Quels documents obligatoires pour chaque type?
6. **Workflow validation**: Acceptation automatique ou validation admin systématique?
7. **Contrat**: Template existant ou à créer de zéro?

---

**Date Audit**: 16 Octobre 2025  
**Version**: 1.0  
**Status**: 🔴 À TRAITER IMMÉDIATEMENT
