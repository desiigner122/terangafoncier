# ⚡ GUIDE DE DÉMARRAGE RAPIDE - CORRECTIONS PLATEFORME
## Commandes et Actions Immédiates

**Date:** 9 Octobre 2025  
**Objectif:** Démarrer Phase 1 (Critique) - Workflow Admin → Notaire

---

## 📋 CHECKLIST AVANT DE COMMENCER

### ✅ Prérequis Vérifiés

- [ ] Node.js installé (v18+)
- [ ] Supabase CLI installé (`supabase --version`)
- [ ] Accès Supabase (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] Git configuré
- [ ] VSCode ou éditeur de code
- [ ] Terminal PowerShell (Windows) ou Bash (Linux/Mac)

---

## 🚀 ÉTAPE 1: DÉPLOIEMENT BASE DE DONNÉES (5 min)

### Option A: Avec Supabase CLI (Recommandé)

```powershell
# Depuis le répertoire racine du projet
cd "C:\Users\Smart Business\Desktop\terangafoncier"

# Vérifier Supabase CLI
supabase --version

# Déployer schéma Notaire complet
.\deploy-notaire-complete-schema.ps1

# Suivre les instructions à l'écran
```

### Option B: Manuellement via Supabase Studio

1. Ouvrir https://app.supabase.com
2. Sélectionner projet "terangafoncier"
3. Aller dans **SQL Editor**
4. Ouvrir `database/notaire-complete-features-schema.sql`
5. Copier tout le contenu
6. Coller dans SQL Editor
7. Cliquer **Run**
8. Vérifier "Query succeeded"

### Vérification Tables Créées

```sql
-- Exécuter dans SQL Editor Supabase
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%notaire%' 
   OR table_name LIKE '%support%'
   OR table_name LIKE '%subscription%'
   OR table_name LIKE '%notification%'
   OR table_name LIKE '%video_meeting%'
   OR table_name LIKE '%elearning%'
   OR table_name LIKE '%marketplace%'
   OR table_name LIKE '%cadastral%'
   OR table_name LIKE '%office%'
   OR table_name LIKE '%help%'
   OR table_name LIKE '%financial%'
ORDER BY table_name;

-- Devrait retourner ~30 tables
```

---

## 🚀 ÉTAPE 2: EXTENSION SERVICE NOTAIRE (10 min)

### Ouvrir Fichier Service

```powershell
# Ouvrir dans VSCode
code "src/services/NotaireSupabaseService.js"
```

### Ajouter Nouvelles Méthodes

1. **Ouvrir** `NEW_METHODS_NOTAIRESUPABASESERVICE.js`
2. **Copier** tout le contenu (1000+ lignes)
3. **Ouvrir** `src/services/NotaireSupabaseService.js`
4. **Scroller** jusqu'à la fin de la classe (avant `}`)
5. **Coller** les nouvelles méthodes
6. **Sauvegarder** (Ctrl+S)

### Vérifier Pas d'Erreurs

```powershell
# Compiler projet pour détecter erreurs
npm run build

# Si erreurs, corriger imports manquants
```

### Méthodes Ajoutées (50+)

- ✅ Support (5 méthodes)
- ✅ Subscriptions (7 méthodes)
- ✅ Notifications (7 méthodes)
- ✅ Video Meetings (4 méthodes)
- ✅ E-Learning (4 méthodes)
- ✅ Marketplace (3 méthodes)
- ✅ Cadastre (3 méthodes)
- ✅ Multi-Office (4 méthodes)
- ✅ Help Center (4 méthodes)
- ✅ Financial (3 méthodes)

---

## 🚀 ÉTAPE 3: VÉRIFIER DASHBOARD ADMIN (30 min)

### 3.1. Analyser Assignation Notaire

```powershell
# Rechercher fonction assignation dans Admin
cd "C:\Users\Smart Business\Desktop\terangafoncier\src\pages\dashboards\admin"

# Rechercher "assign" dans tous les fichiers
grep -r "assign" ./*.jsx

# Rechercher "notaire" ou "notary"
grep -r "notaire\|notary" ./*.jsx
```

### 3.2. Ouvrir Fichiers Clés

```powershell
# Ouvrir pages potentiellement concernées
code "ModernUsersPage.jsx"
code "ModernTransactionsPage.jsx"
code "ModernPropertiesManagementPage.jsx"
code "AdminPropertyValidation.jsx"
```

### 3.3. Chercher UI Assignation

**Dans chaque fichier, chercher:**
- Dropdown/Select pour choisir notaire
- Bouton "Assigner" ou "Assign"
- Modal d'assignation
- Fonction `handleAssign...` ou `assignNotaire...`

### 3.4. Si Assignation Existe

✅ **Tester:**
1. Lancer app en dev
2. Se connecter comme Admin
3. Aller dans Transactions/Propriétés
4. Essayer d'assigner un notaire
5. Vérifier:
   - [ ] Notification envoyée au notaire
   - [ ] Dossier apparaît dans `/notaire/cases`
   - [ ] Historique enregistré
   - [ ] Workflow mis à jour

### 3.5. Si Assignation N'Existe PAS

❌ **Implémenter:**

```javascript
// Ajouter dans ModernTransactionsPage.jsx ou AdminPropertyValidation.jsx

const [notairesList, setNotairesList] = useState([]);
const [selectedNotaire, setSelectedNotaire] = useState(null);
const [showAssignModal, setShowAssignModal] = useState(false);
const [selectedCase, setSelectedCase] = useState(null);

// Charger liste notaires
useEffect(() => {
  loadNotaires();
}, []);

const loadNotaires = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('role', 'notaire')
    .eq('is_active', true)
    .order('full_name');
  
  if (!error) setNotairesList(data);
};

// Fonction assignation
const handleAssignNotaire = async () => {
  if (!selectedCase || !selectedNotaire) {
    toast.error('Sélectionnez un dossier et un notaire');
    return;
  }

  try {
    // 1. Insérer participant
    const { error: participantError } = await supabase
      .from('purchase_case_participants')
      .insert({
        case_id: selectedCase.id,
        user_id: selectedNotaire,
        role: 'notary',
        status: 'active',
        permissions: ['view_documents', 'verify', 'sign', 'update_status']
      });

    if (participantError) throw participantError;

    // 2. Mettre à jour workflow
    const { error: workflowError } = await supabase
      .from('purchase_cases')
      .update({
        workflow_stage: 'notary_assignment',
        assigned_notary_id: selectedNotaire,
        notary_assigned_at: new Date().toISOString()
      })
      .eq('id', selectedCase.id);

    if (workflowError) throw workflowError;

    // 3. Historique
    await supabase
      .from('purchase_case_history')
      .insert({
        case_id: selectedCase.id,
        action: 'notary_assigned',
        description: `Notaire assigné au dossier`,
        performed_by: user.id,
        metadata: { notary_id: selectedNotaire }
      });

    // 4. Notification notaire
    await supabase
      .from('notifications')
      .insert({
        user_id: selectedNotaire,
        type: 'case_assigned',
        title: 'Nouveau dossier assigné',
        content: `Dossier ${selectedCase.id} vous a été assigné`,
        category: 'workflow',
        action_url: `/notaire/cases/${selectedCase.id}`
      });

    // 5. Notifications acheteur + vendeur
    await Promise.all([
      supabase.from('notifications').insert({
        user_id: selectedCase.buyer_id,
        type: 'notary_assigned',
        title: 'Notaire assigné à votre dossier',
        content: `Le notaire a été assigné à votre achat`
      }),
      supabase.from('notifications').insert({
        user_id: selectedCase.seller_id,
        type: 'notary_assigned',
        title: 'Notaire assigné à votre vente',
        content: `Le notaire a été assigné à votre vente`
      })
    ]);

    toast.success('Notaire assigné avec succès');
    setShowAssignModal(false);
    loadCases(); // Recharger liste
    
  } catch (error) {
    console.error('Erreur assignation:', error);
    toast.error('Erreur lors de l\'assignation');
  }
};

// UI - Ajouter bouton dans liste transactions
<Button 
  onClick={() => {
    setSelectedCase(transaction);
    setShowAssignModal(true);
  }}
>
  Assigner Notaire
</Button>

// UI - Modal d'assignation
<Dialog open={showAssignModal} onOpenChange={setShowAssignModal}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Assigner un Notaire</DialogTitle>
      <DialogDescription>
        Dossier: {selectedCase?.id}
      </DialogDescription>
    </DialogHeader>
    
    <div className="space-y-4">
      <Label>Sélectionner Notaire</Label>
      <Select value={selectedNotaire} onValueChange={setSelectedNotaire}>
        <SelectTrigger>
          <SelectValue placeholder="Choisir un notaire..." />
        </SelectTrigger>
        <SelectContent>
          {notairesList.map(notaire => (
            <SelectItem key={notaire.id} value={notaire.id}>
              {notaire.full_name} ({notaire.email})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
    
    <DialogFooter>
      <Button variant="outline" onClick={() => setShowAssignModal(false)}>
        Annuler
      </Button>
      <Button onClick={handleAssignNotaire} disabled={!selectedNotaire}>
        Assigner
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

---

## 🚀 ÉTAPE 4: CORRIGER NOTAIRE CASES (2-3 jours)

### 4.1. Ouvrir Fichier

```powershell
code "src/pages/dashboards/notaire/NotaireCases.jsx"
```

### 4.2. Identifier Mock Data

**Ligne 136:**
```javascript
const mockCases = [
  // ... 4 dossiers mockés
]
```

### 4.3. Remplacer par Données Réelles

**Supprimer lignes 136-327 (mockCases)**

**Ajouter à la place:**

```javascript
// État pour dossiers réels
const [cases, setCases] = useState([]);
const [isLoading, setIsLoading] = useState(true);

// Charger dossiers assignés au notaire connecté
useEffect(() => {
  if (user) {
    loadAssignedCases();
  }
}, [user]);

const loadAssignedCases = async () => {
  setIsLoading(true);
  
  try {
    const { data, error } = await supabase
      .from('purchase_cases')
      .select(`
        *,
        buyer:profiles!buyer_id(
          id,
          full_name,
          email,
          phone
        ),
        seller:profiles!seller_id(
          id,
          full_name,
          email,
          phone
        ),
        parcelle:parcelles!parcelle_id(
          id,
          title,
          location,
          surface,
          price,
          land_title,
          zoning,
          coordinates
        ),
        participants:purchase_case_participants!case_id(
          user_id,
          role,
          status,
          joined_at
        ),
        documents:purchase_case_documents!case_id(
          id,
          document_type,
          file_name,
          file_url,
          uploaded_at,
          status
        ),
        history:purchase_case_history!case_id(
          action,
          description,
          performed_at,
          performed_by
        )
      `)
      .eq('participants.user_id', user.id)
      .eq('participants.role', 'notary')
      .eq('participants.status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erreur chargement dossiers:', error);
      toast.error('Erreur de chargement');
      return;
    }

    // Transformer données pour affichage
    const transformedCases = data.map(c => ({
      id: c.id,
      title: `${c.transaction_type} - ${c.parcelle?.title}`,
      type: c.transaction_type,
      platformRef: c.id,
      buyer: c.buyer,
      seller: c.seller,
      status: c.current_stage,
      priority: c.priority || 'medium',
      openDate: new Date(c.created_at).toISOString().split('T')[0],
      dueDate: c.expected_completion_date,
      lastActivity: new Date(c.updated_at).toISOString().split('T')[0],
      progress: calculateProgress(c.current_stage),
      description: c.description,
      property: {
        address: c.parcelle?.location,
        area: `${c.parcelle?.surface}m²`,
        value: c.agreed_price || c.parcelle?.price,
        coordinates: c.parcelle?.coordinates,
        landTitle: c.parcelle?.land_title,
        zoning: c.parcelle?.zoning
      },
      transaction: {
        price: c.agreed_price,
        deposit: c.deposit_amount,
        remaining: (c.agreed_price || 0) - (c.deposit_amount || 0),
        paymentStatus: c.payment_status,
        escrowAccount: c.escrow_account_id
      },
      documentsCount: c.documents?.length || 0,
      completedDocuments: c.documents?.filter(d => d.status === 'verified').length || 0,
      notaryFees: calculateNotaryFees(c.agreed_price),
      nextAction: getNextAction(c.current_stage),
      platformSteps: {
        listing: { completed: true, date: c.created_at },
        negotiation: { completed: c.current_stage !== 'negotiation', date: c.negotiation_completed_at },
        agreement: { completed: c.current_stage !== 'negotiation', date: c.agreement_signed_at },
        notaryAssignment: { completed: true, date: c.notary_assigned_at },
        documentVerification: { 
          completed: c.current_stage === 'title_transfer' || c.current_stage === 'completed',
          inProgress: c.current_stage === 'document_verification'
        },
        titleTransfer: { 
          completed: c.current_stage === 'completed',
          inProgress: c.current_stage === 'title_transfer'
        },
        finalRegistration: { 
          completed: c.current_stage === 'completed',
          inProgress: c.current_stage === 'final_registration'
        }
      }
    }));

    setCases(transformedCases);
    setFilteredCases(transformedCases);
    
  } catch (error) {
    console.error('Erreur:', error);
    toast.error('Erreur lors du chargement');
  } finally {
    setIsLoading(false);
  }
};

// Fonction helper - Calculer progression
const calculateProgress = (stage) => {
  const stages = {
    'negotiation': 20,
    'agreement': 40,
    'notary_assignment': 50,
    'document_verification': 70,
    'title_transfer': 85,
    'final_registration': 95,
    'completed': 100
  };
  return stages[stage] || 0;
};

// Fonction helper - Calculer frais notariaux (1.5% du prix)
const calculateNotaryFees = (price) => {
  if (!price) return 0;
  return Math.round(price * 0.015);
};

// Fonction helper - Prochaine action
const getNextAction = (stage) => {
  const actions = {
    'notary_assignment': 'Vérifier documents fournis',
    'document_verification': 'Vérification documents en cours',
    'title_transfer': 'Initier transfert de propriété',
    'final_registration': 'Enregistrement au cadastre',
    'completed': 'Dossier finalisé'
  };
  return actions[stage] || 'Action à déterminer';
};
```

### 4.4. Implémenter Actions Notaire

**Validation documents:**
```javascript
const handleValidateDocuments = async (caseId) => {
  try {
    const { error } = await supabase
      .from('purchase_cases')
      .update({
        current_stage: 'title_transfer',
        document_verification_completed_at: new Date().toISOString()
      })
      .eq('id', caseId);

    if (error) throw error;

    // Historique
    await supabase.from('purchase_case_history').insert({
      case_id: caseId,
      action: 'documents_validated',
      description: 'Documents vérifiés et validés',
      performed_by: user.id
    });

    // Notifications
    const caseData = cases.find(c => c.id === caseId);
    await Promise.all([
      supabase.from('notifications').insert({
        user_id: caseData.buyer.id,
        type: 'document_validated',
        title: 'Documents validés',
        content: 'Le notaire a validé tous les documents'
      }),
      supabase.from('notifications').insert({
        user_id: caseData.seller.id,
        type: 'document_validated',
        title: 'Documents validés',
        content: 'Le notaire a validé tous les documents'
      })
    ]);

    toast.success('Documents validés avec succès');
    await loadAssignedCases();
    
  } catch (error) {
    console.error('Erreur validation:', error);
    toast.error('Erreur lors de la validation');
  }
};
```

**Initier transfert:**
```javascript
const handleInitiateTransfer = async (caseId) => {
  try {
    const { error } = await supabase
      .from('purchase_cases')
      .update({
        current_stage: 'final_registration',
        title_transfer_initiated_at: new Date().toISOString()
      })
      .eq('id', caseId);

    if (error) throw error;

    await supabase.from('purchase_case_history').insert({
      case_id: caseId,
      action: 'transfer_initiated',
      description: 'Transfert de propriété initié',
      performed_by: user.id
    });

    toast.success('Transfert initié avec succès');
    await loadAssignedCases();
    
  } catch (error) {
    console.error('Erreur transfert:', error);
    toast.error('Erreur lors du transfert');
  }
};
```

### 4.5. Tester

```powershell
# Lancer app en dev
npm run dev

# Se connecter comme Notaire
# Aller sur /notaire/cases
# Vérifier:
# - [ ] Dossiers assignés s'affichent
# - [ ] Informations complètes
# - [ ] Workflow 7 étapes visible
# - [ ] Boutons fonctionnels
# - [ ] Actions mettent à jour BD
```

---

## 🚀 ÉTAPE 5: TESTS WORKFLOW COMPLET (1 jour)

### Scénario de Test End-to-End

**1. Préparer données test:**
```sql
-- Créer utilisateurs test (via Supabase Auth)
-- Acheteur: acheteur.test@terangafoncier.sn
-- Vendeur: vendeur.test@terangafoncier.sn
-- Notaire: notaire.test@terangafoncier.sn
-- Admin: admin.test@terangafoncier.sn

-- Créer parcelle test
INSERT INTO parcelles (
  title,
  description,
  location,
  surface,
  price,
  owner_id,
  status
) VALUES (
  'Terrain Test - Zone Résidentielle',
  'Terrain de test pour workflow',
  'Test City, Dakar',
  500,
  25000000,
  'vendor-user-id',
  'active'
);

-- Créer dossier test
INSERT INTO purchase_cases (
  buyer_id,
  seller_id,
  parcelle_id,
  transaction_type,
  agreed_price,
  current_stage
) VALUES (
  'buyer-user-id',
  'seller-user-id',
  'parcelle-id',
  'vente_immobiliere',
  25000000,
  'agreement'
);
```

**2. Test étape par étape:**

| Étape | Acteur | Action | Vérification |
|-------|--------|--------|--------------|
| 1 | Vendeur | Publier terrain | ✅ Parcelle visible |
| 2 | Acheteur | Faire offre | ✅ Offre enregistrée |
| 3 | Vendeur | Accepter offre | ✅ Dossier créé (purchase_case) |
| 4 | **Admin** | **Assigner notaire** | ✅ Notification notaire envoyée |
| 5 | **Notaire** | **Voir dossier assigné** | ✅ Dossier dans /notaire/cases |
| 6 | Notaire | Vérifier documents | ✅ Workflow mis à jour |
| 7 | Notaire | Valider documents | ✅ Étape complétée |
| 8 | Notaire | Initier transfert | ✅ Workflow avance |
| 9 | Notaire | Enregistrement final | ✅ Dossier complété |
| 10 | Tous | Recevoir notifications | ✅ Emails/notifications |

**3. Vérifier base de données:**
```sql
-- Vérifier participant notaire
SELECT * FROM purchase_case_participants 
WHERE role = 'notary' AND case_id = 'test-case-id';

-- Vérifier historique
SELECT * FROM purchase_case_history 
WHERE case_id = 'test-case-id' 
ORDER BY performed_at DESC;

-- Vérifier notifications
SELECT * FROM notifications 
WHERE user_id = 'notaire-user-id' 
ORDER BY created_at DESC;

-- Vérifier workflow
SELECT current_stage, notary_assigned_at, 
       document_verification_completed_at,
       title_transfer_initiated_at
FROM purchase_cases 
WHERE id = 'test-case-id';
```

---

## 📊 CHECKLIST FINALE PHASE 1

### Jour 1-2: Setup
- [ ] Schéma BD déployé (30 tables)
- [ ] Service étendu (50 méthodes)
- [ ] Environnement dev fonctionnel

### Jour 3-5: Admin
- [ ] Assignation notaire implémentée/vérifiée
- [ ] UI admin fonctionnelle
- [ ] Notifications envoyées

### Jour 6-8: Notaire Cases
- [ ] Mock data supprimée
- [ ] Chargement dossiers assignés OK
- [ ] Workflow 7 étapes affiché
- [ ] Actions notaire fonctionnelles

### Jour 9-10: Tests
- [ ] Test workflow complet
- [ ] Vérification BD
- [ ] Vérification notifications
- [ ] Documentation mise à jour

---

## 🎯 LIVRABLE PHASE 1

À la fin de ces 10 jours, vous aurez:

✅ **Workflow Admin → Notaire 100% fonctionnel**
- Admin peut assigner notaire à dossier
- Notaire reçoit notification
- Dossier apparaît dans dashboard notaire
- Notaire peut traiter dossier complet
- Historique et notifications fonctionnent

✅ **Base de données complète**
- 30+ tables créées
- Relations configurées
- Indexes optimisés
- RLS policies actives

✅ **Service étendu**
- 70+ méthodes Supabase
- Toutes documentées
- Error handling complet

✅ **Tests validés**
- Workflow end-to-end testé
- Aucune régression
- Prêt pour production partielle

---

## 📞 SUPPORT

**En cas de problème:**

1. **Erreur Supabase CLI:**
   - Réinstaller: `npm install -g supabase`
   - Vérifier auth: `supabase login`

2. **Erreur déploiement SQL:**
   - Vérifier syntaxe SQL
   - Exécuter par petits blocs
   - Vérifier logs Supabase

3. **Erreur compilation React:**
   - Vérifier imports
   - `npm install` (réinstaller dépendances)
   - `npm run dev` (mode développement)

4. **Questions techniques:**
   - Consulter `GUIDE_ACTIVATION_DASHBOARD_NOTAIRE.md`
   - Consulter documentation Supabase
   - Consulter documentation React

---

## 🚀 COMMENCER MAINTENANT

```powershell
# 1. Déployer BD
cd "C:\Users\Smart Business\Desktop\terangafoncier"
.\deploy-notaire-complete-schema.ps1

# 2. Étendre service
code "src/services/NotaireSupabaseService.js"
# Copier méthodes depuis NEW_METHODS_NOTAIRESUPABASESERVICE.js

# 3. Vérifier admin
code "src/pages/dashboards/admin/ModernUsersPage.jsx"

# 4. Corriger notaire
code "src/pages/dashboards/notaire/NotaireCases.jsx"

# 5. Lancer dev
npm run dev
```

---

**BONNE CHANCE ! 🚀**

