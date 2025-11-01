# STRATÉGIE COMPLÈTE - SYNCHRONISATION VENDEUR/ACHETEUR

## 🎯 Objectifs

1. **Page de suivi achats acheteur** ✅ COMPLÈTE
   - Liste centralisée avec filtres/recherche
   - KPIs et statistiques
   - Temps réel

2. **Page dossier acheteur** ✅ COMPLÈTE
   - Multi-participants (acheteur, vendeur, notaire, géomètre, agent)
   - 12 étapes de workflow
   - Messagerie intégrée
   - Documents et tâches

3. **Synchronisation bidirectionnelle** 🔄 EN COURS
   - Côté acheteur: ParticulierMesAchatsRefactored + ModernBuyerCaseTrackingV2
   - Côté vendeur: Doit refléter les mêmes données
   - Temps réel < 1s

---

## 📋 Tâches restantes

### Phase 1: Côté Vendeur (VendeurPurchaseRequests)

Les demandes d'achat côté vendeur doivent afficher:

1. **Vue acheteur dans la demande**
   - Avatar acheteur
   - Coordonnées complètes
   - Historique (acheteur nouveau ou récurrent)

2. **Progression du dossier**
   - Barre de progression (comme acheteur)
   - Status synchronisé

3. **Actions rapides**
   - Accepter/Rejeter (créer purchase_case)
   - Assigner participants (notaire, géomètre, agent)
   - Voir dossier complet
   - Messagerie

### Phase 2: Intégration Vendeur Dashboard Refentoi

Moderniser `RefactoredVendeurCaseTracking` pour:

1. **Paralléliser avec ModernBuyerCaseTrackingV2**
   - Même layout
   - Mêmes onglets
   - Mêmes données (mais vue vendeur)

2. **Ajouter contrôles vendeur**
   - Modifier les participants
   - Mettre à jour le statut
   - Approuver les documents
   - Assigner les tâches

3. **Notifications vendeur**
   - Message reçu d'acheteur
   - Document uploadé
   - Tâche assignée
   - Paiement reçu

### Phase 3: Synchronisation Notaire/Géomètre

Créer des pages de suivi pour:

1. **NotaireLoginPage** → Dashboard notaire avec ses cas
2. **GeometreLoginPage** → Dashboard géomètre avec ses cas
3. **AgentFoncierLoginPage** → Dashboard agent foncier

---

## 🔄 Architecture de sync proposée

### Current State (Après commits 30ef, f5a26, 9c803)

```
Acheteur:
├── ParticulierMesAchatsRefactored ✅
│   └── Liste des purchase_cases où buyer_id = user.id
└── ModernBuyerCaseTrackingV2 ✅
    ├── Détails du dossier
    ├── Participants (lecture)
    ├── Documents (upload)
    ├── Tâches (view)
    └── Messages (chat)

Vendeur:
├── VendeurPurchaseRequests (déjà existe)
│   └── Liste des demandes (requests)
└── RefactoredVendeurCaseTracking (existe)
    └── Détails cas (à synchroniser)
```

### Target State (Après refonte complète)

```
Acheteur:
├── ParticulierMesAchatsRefactored ✅
└── ModernBuyerCaseTrackingV2 ✅
    ├── Aperçu
    ├── Participants (5 roles)
    ├── Documents
    ├── Tâches
    └── Messages

Vendeur:
├── VendeurPurchaseRequests (moderne)
└── RefactoredVendeurCaseTrackingV2 (NEW)
    ├── Aperçu (même données)
    ├── Participants (gestion)
    ├── Documents (approuver)
    ├── Tâches (assigner)
    └── Messages (chat)

Notaire (NEW):
├── NotairesDashboard
└── NotaireCaseTracking (sync avec acheteur/vendeur)

Géomètre (NEW):
├── GeometresDashboard
└── GeometreCaseTracking (sync avec acheteur/vendeur)

Agent Foncier (NEW):
├── AgentsDashboard
└── AgentCaseTracking (opt, sync avec acheteur/vendeur)
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                  Supabase (Source of Truth)             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │ purchase_cases (UUID, case_number, status, ...)  │   │
│  │  ├─ buyer_id → profiles                          │   │
│  │  ├─ seller_id → profiles                         │   │
│  │  ├─ notary_id → profiles (NULL ok)               │   │
│  │  ├─ geometre_id → profiles (NULL ok)             │   │
│  │  └─ agent_foncier_id → profiles (NULL ok)        │   │
│  └──────────────────────────────────────────────────┘   │
│           ▲                              ▲                │
│           │ Realtime Updates             │ RLS Policies  │
│  ┌────────┴───────┐              ┌──────┴────────┐      │
│  │   Conversations│              │ Case Metadata │      │
│  │ conversation_  │              ├──────────────┤      │
│  │    messages    │              │ documents    │      │
│  │    (case_id)   │              │ case_tasks   │      │
│  │                │              │ case_payments│      │
│  └─────────────────┘              └──────────────┘      │
└─────────────────────────────────────────────────────────┘
                ▲                    ▲
          RLS Policy 1         RLS Policy N
                │                    │
    ┌───────────┴────────────┬───────┴──────────────────┐
    │                        │                          │
┌───────────────┐  ┌──────────────────┐  ┌───────────────────┐
│   ACHETEUR    │  │     VENDEUR      │  │  NOTAIRE/GÉOMÈTRE │
│               │  │                  │  │  (Future)         │
│ ✅ MesAchats  │  │ PurchaseRequests │  │                   │
│ ✅ CaseTrackV2│  │ CaseTrackingV2   │  │                   │
│               │  │ (à créer)        │  │                   │
└───────────────┘  └──────────────────┘  └───────────────────┘
```

---

## 🛠️ Implémentation à venir

### Étape 1: Créer RefactoredVendeurCaseTrackingV2

Copier la structure de `ModernBuyerCaseTrackingV2` mais avec:

```javascript
// Différences clés
- Charger depuis purchase_cases où seller_id = user.id
- Ajouter UI pour "Assigner Notaire"
- Ajouter UI pour "Assigner Géomètre"
- Ajouter UI pour "Assigner Agent"
- Ajouter UI pour "Mettre à jour Statut"
- Ajouter notifications vendeur
- Afficher les demandes à accepter/rejeter
```

### Étape 2: Moderniser VendeurPurchaseRequests

```javascript
// Ajouter colonne avec infos acheteur
- Avatar + nom
- Email/téléphone
- Lien "Voir dossier" → page détails

// Ajouter statuts de progression
- Demande reçue
- En discussion
- Dossier créé
- Acceptée/Rejetée
```

### Étape 3: Créer NotairesDashboard (future)

```javascript
// Liste des cas assignés au notaire
- Vue similaire à acheteur mais pour notaire
- Actions spécifiques:
  - Approuver documents
  - Planifier rendez-vous
  - Ajouter notes
  - Valider signatures
```

### Étape 4: Tester synchronisation end-to-end

```javascript
// Scenario: Acheteur → Demande → Vendeur → Accepte → Notaire voit

1. Acheteur crée demande d'achat
2. Vendeur reçoit en temps réel
3. Vendeur accepte et assigne notaire
4. Acheteur voit notaire assigné
5. Notaire voit le cas dans son dashboard
6. Tous reçoivent mises à jour en temps réel
```

---

## 🔐 Sécurité - RLS à valider

```sql
-- VENDEUR: voir ses dossiers
CREATE POLICY "sellers_view_cases"
ON purchase_cases FOR SELECT
USING (auth.uid() = seller_id);

-- VENDEUR: modifier statut et participants
CREATE POLICY "sellers_update_case"
ON purchase_cases FOR UPDATE
USING (auth.uid() = seller_id)
WITH CHECK (auth.uid() = seller_id);

-- NOTAIRE: voir dossiers assignés
CREATE POLICY "notaries_view_cases"
ON purchase_cases FOR SELECT
USING (auth.uid() = notary_id);

-- GÉOMÈTRE: voir dossiers assignés
CREATE POLICY "geometres_view_cases"
ON purchase_cases FOR SELECT
USING (auth.uid() = geometre_id);

-- Tous: voir messages du dossier
CREATE POLICY "all_view_case_messages"
ON conversation_messages FOR SELECT
USING (
  EXISTS(
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = conversation_messages.case_id
    AND (
      pc.buyer_id = auth.uid()
      OR pc.seller_id = auth.uid()
      OR pc.notary_id = auth.uid()
      OR pc.geometre_id = auth.uid()
      OR pc.agent_foncier_id = auth.uid()
    )
  )
);

-- Tous assignés: envoyer messages
CREATE POLICY "participants_send_messages"
ON conversation_messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS(
    SELECT 1 FROM purchase_cases pc
    WHERE pc.id = conversation_messages.case_id
    AND (
      pc.buyer_id = auth.uid()
      OR pc.seller_id = auth.uid()
      OR pc.notary_id = auth.uid()
      OR pc.geometre_id = auth.uid()
      OR pc.agent_foncier_id = auth.uid()
    )
  )
);
```

---

## 📈 Timeline proposée

- **Semaine 1**: ✅ Acheteur Dashboard Refactored
- **Semaine 2**: 🔄 Vendeur Dashboard Refactored (en cours)
- **Semaine 3**: Synchronisation end-to-end + Tests
- **Semaine 4**: Notaire/Géomètre Dashboards (future)
- **Semaine 5**: Production deployment + Monitoring

---

## ✅ Checklist avant deployment

- [ ] ModernBuyerCaseTrackingV2 testée en local
- [ ] ParticulierMesAchatsRefactored testée en local
- [ ] Synchronisation temps réel validée
- [ ] RLS policies en place
- [ ] RefactoredVendeurCaseTrackingV2 créée
- [ ] VendeurPurchaseRequests modernisée
- [ ] Tests end-to-end acheteur↔vendeur
- [ ] Documentation mise à jour
- [ ] Production build testé
- [ ] Déploiement sur terangafoncier.sn

---

## 📞 Contact & Support

Pour questions ou blocages:
- Consulter REFONTE_BUYER_DASHBOARD_DOCUMENTATION.md
- Vérifier Supabase RLS policies
- Valider Realtime subscriptions
