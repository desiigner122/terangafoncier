# 🏗️ REFONTE COMPLÈTE - Page Unifiée de Suivi de Dossier d'Achat

**Date**: 29 Octobre 2025  
**Objectif**: Créer UNE seule page de suivi pour TOUS les acteurs

---

## 👥 LES 5 ACTEURS DU DOSSIER

### 1. 🏠 **ACHETEUR** (Particulier/Entreprise)
**Rôle**: Initie la demande d'achat
**Besoins**:
- Voir progression du dossier
- Communiquer avec vendeur/notaire/agent/géomètre
- Uploader documents (pièces identité, justificatifs revenus, etc.)
- Suivre financement bancaire
- Planifier rendez-vous
- Payer (acomptes, frais notaire, frais agent, etc.)

---

### 2. 🏘️ **VENDEUR** (Propriétaire)
**Rôle**: Propriétaire de la parcelle
**Besoins**:
- Recevoir notifications demandes d'achat
- Accepter/refuser offres
- Négocier prix
- Uploader documents parcelle (titre foncier, bornage, etc.)
- Communiquer avec acheteur/notaire/agent
- Suivre paiement
- Confirmer transfert propriété

---

### 3. ⚖️ **NOTAIRE**
**Rôle**: Authentifier la vente, rédiger actes
**Besoins**:
- Voir tous ses dossiers assignés
- Vérifier identités parties
- Valider documents légaux
- Rédiger contrat de vente
- Planifier signature
- Calculer frais notariaux
- Confirmer paiement reçu
- Enregistrer acte authentique

**Quand intervient**: Après accord acheteur-vendeur

---

### 4. 🏢 **AGENT FONCIER** ⚠️ FACULTATIF (Choix de l'acheteur)
**Rôle**: Faciliter transaction, intermédiaire
**Besoins**:
- Voir dossiers dont il est agent
- Accompagner acheteur dans recherche
- Organiser visites terrain
- Négocier entre parties
- Collecter documents
- Suivre commission (généralement 5% du prix)
- Statut paiement commission

**Quand intervient**: Dès le début (souvent avant demande d'achat)
**Note**: L'acheteur décide s'il veut faire appel à un agent ou non

---

### 5. 📐 **GÉOMÈTRE** ⚠️ FACULTATIF (Choix de l'acheteur)
**Rôle**: Mesurer, borner, certifier limites parcelle
**Besoins**:
- Recevoir missions de bornage
- Planifier RDV terrain
- Uploader plan de bornage
- Uploader certificat topographique
- Valider coordonnées GPS
- Facturer prestations (bornage, plans, etc.)

**Quand intervient**: Avant ou pendant la vente (selon demande)
**Note**: L'acheteur décide s'il veut faire appel à un géomètre pour vérifier le bornage

---

## 🔄 WORKFLOW COMPLET AVEC TOUS LES ACTEURS

```
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 0: PRÉPARATION (Optionnel - Si agent foncier)                 │
├─────────────────────────────────────────────────────────────────────┤
│ 👤 ACHETEUR décide: "Je veux un agent foncier pour m'aider ?"      │
│                                                                      │
│ SI OUI:                                                              │
│    👤 ACHETEUR contacte 🏢 AGENT FONCIER                            │
│    🏢 AGENT recherche parcelles disponibles                         │
│    🏢 AGENT organise visite avec VENDEUR                            │
│    👤 ACHETEUR visite terrain                                       │
│                                                                      │
│ SI NON:                                                              │
│    👤 ACHETEUR cherche directement sur la plateforme                │
│    👤 ACHETEUR contacte VENDEUR directement                         │
│                                                                      │
│ ⚠️ BORNAGE (Décision de l'acheteur):                                │
│    👤 ACHETEUR décide: "Je veux vérifier le bornage ?"             │
│                                                                      │
│    SI OUI:                                                           │
│       👤 ACHETEUR mandate 📐 GÉOMÈTRE                               │
│       📐 GÉOMÈTRE fait bornage + plan                               │
│       📐 GÉOMÈTRE upload certificat topographique                   │
│                                                                      │
│    SI NON:                                                           │
│       🏘️ VENDEUR fournit documents bornage existants (si disponible)│
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 1: DEMANDE D'ACHAT                                            │
├─────────────────────────────────────────────────────────────────────┤
│ 👤 ACHETEUR fait demande d'achat (purchase_request)                │
│    → Prix proposé                                                   │
│    → Via agent ou direct                                            │
│    → Créer purchase_case (dossier)                                 │
│                                                                      │
│ 🔔 Notification → 🏘️ VENDEUR                                       │
│ 🔔 Notification → 🏢 AGENT (si mentionné)                          │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 2: NÉGOCIATION                                                │
├─────────────────────────────────────────────────────────────────────┤
│ 🏘️ VENDEUR voit demande                                            │
│                                                                      │
│ Option A: Accepte directement                                       │
│ Option B: Contre-offre (nouveau prix)                               │
│ Option C: Refuse                                                    │
│                                                                      │
│ 🏢 AGENT FONCIER facilite négociation (si présent)                 │
│    → Messages tripartites                                           │
│    → Conseils prix marché                                           │
│                                                                      │
│ ✅ Accord trouvé → Status: 'preliminary_agreement'                 │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 3: CHOIX DU NOTAIRE                                           │
├─────────────────────────────────────────────────────────────────────┤
│ 🎯 Système propose TOP 3 notaires (algorithme scoring)             │
│                                                                      │
│ 👤 ACHETEUR choisit notaire → Approuve                             │
│ 🏘️ VENDEUR approuve le choix                                       │
│ 🔔 Notification → ⚖️ NOTAIRE (24h pour accepter)                   │
│ ⚖️ NOTAIRE accepte → Status: 'notary_assigned'                     │
│                                                                      │
│ 🔔 Notifications → Tous les acteurs                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 4: VÉRIFICATIONS DOCUMENTS                                    │
├─────────────────────────────────────────────────────────────────────┤
│ 👤 ACHETEUR upload:                                                 │
│    - Pièce identité (CNI/Passeport)                                │
│    - Justificatif domicile                                          │
│    - Justificatif revenus (si financement)                         │
│                                                                      │
│ 🏘️ VENDEUR upload:                                                 │
│    - Titre foncier                                                  │
│    - Quitus fiscal                                                  │
│    - Certificat de bornage (fourni par géomètre)                   │
│    - Certificat de non-hypothèque                                  │
│                                                                      │
│ 📐 GÉOMÈTRE upload (si mission):                                   │
│    - Plan de bornage officiel                                       │
│    - Certificat topographique                                       │
│    - Coordonnées GPS limites                                        │
│    - Photos terrain                                                 │
│                                                                      │
│ ⚖️ NOTAIRE vérifie tous les documents                              │
│    → Valide identités                                               │
│    → Vérifie titre foncier au cadastre                             │
│    → Contrôle bornage                                               │
│    → Status: 'document_audit'                                       │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 5: PAIEMENT DIRECT (Simplifié - Pas de financement)           │
├─────────────────────────────────────────────────────────────────────┤
│ ⚠️ Note: Le financement bancaire et paiement échelonné sont gérés  │
│          dans un workflow séparé. Ici on traite le PAIEMENT DIRECT. │
│                                                                      │
│ 💰 PAIEMENT 1: Acompte (10-20% généralement)                        │
│    👤 ACHETEUR → 🏘️ VENDEUR                                        │
│    Status: En attente / Payé                                        │
│    → Preuve de paiement uploadée                                    │
│                                                                      │
│ 💰 PAIEMENT 2: Frais notaire                                       │
│    👤 ACHETEUR → ⚖️ NOTAIRE                                         │
│    Montant: [calculé par notaire]                                  │
│    → Reçu notaire uploadé                                           │
│                                                                      │
│ 💰 PAIEMENT 3: Commission agent (si applicable - facultatif)        │
│    👤 ACHETEUR → 🏢 AGENT FONCIER                                  │
│    Montant: 5% du prix généralement                                │
│    → Seulement si l'acheteur a choisi un agent                     │
│                                                                      │
│ 💰 PAIEMENT 4: Frais géomètre (si applicable - facultatif)          │
│    👤 ACHETEUR → 📐 GÉOMÈTRE                                        │
│    Montant: Bornage + Plans + Certificat                           │
│    → Seulement si l'acheteur a demandé un bornage                  │
│                                                                      │
│ 💰 PAIEMENT 5: Solde                                               │
│    👤 ACHETEUR → 🏘️ VENDEUR                                        │
│    Montant: Prix total - Acompte                                    │
│    Mode: Virement bancaire / Chèque certifié / Séquestre notaire   │
│    → Preuve de virement uploadée                                    │
│                                                                      │
│ ✅ Tous paiements confirmés → Status: 'payment_completed'          │
└─────────────────────────────────────────────────────────────────────┘
├─────────────────────────────────────────────────────────────────────┤
│ ⚖️ NOTAIRE rédige projet d'acte de vente                           │
│    → Identités parties                                              │
│    → Description parcelle (avec données géomètre)                  │
│    → Prix et conditions paiement                                    │
│    → Clauses spéciales                                              │
│                                                                      │
│ 🔔 Notification → ACHETEUR + VENDEUR                               │
│ 👤 ACHETEUR relit contrat                                          │
│ 🏘️ VENDEUR relit contrat                                          │
│                                                                      │
│ ⚠️ Si modifications → Retour notaire                               │
│ ✅ Contrat validé par les 2 parties                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 7: RENDEZ-VOUS SIGNATURE                                      │
├─────────────────────────────────────────────────────────────────────┤
│ ⚖️ NOTAIRE propose dates RDV signature                             │
│                                                                      │
│ 👤 ACHETEUR confirme disponibilité                                 │
│ 🏘️ VENDEUR confirme disponibilité                                 │
│                                                                      │
│ 🔔 RDV confirmé → Tous les acteurs                                 │
│    📅 Date: [JJ/MM/AAAA]                                           │
│    🕐 Heure: [HH:MM]                                               │
│    📍 Lieu: Office notarial                                         │
│                                                                      │
│ ⚠️ RAPPEL automatique 48h avant                                    │
│ ⚠️ RAPPEL automatique 24h avant                                    │
└─────────────────────────────────────────────────────────────────────┘
                              ↓

                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 6: RÉDACTION CONTRAT                                          │
├─────────────────────────────────────────────────────────────────────┤
│ 📅 JOUR J - RDV à l'office notarial                                │
│                                                                      │
│ Présents:                                                            │
│    👤 ACHETEUR (+ pièce identité originale)                        │
│    🏘️ VENDEUR (+ pièce identité originale)                        │
│    ⚖️ NOTAIRE                                                       │
│    🏢 AGENT FONCIER (optionnel)                                    │
│                                                                      │
│ ⚖️ NOTAIRE lit l'acte aux parties                                  │
│ ⚖️ NOTAIRE explique clauses                                        │
│                                                                      │
│ ✍️ ACHETEUR signe                                                  │
│ ✍️ VENDEUR signe                                                   │
│ ✍️ NOTAIRE authentifie signatures                                  │
│                                                                      │
│ 📄 Acte de vente authentique généré                                │
│ Status: 'signing_process' → 'property_transfer'                    │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 7: RENDEZ-VOUS SIGNATURE                                      │
├─────────────────────────────────────────────────────────────────────┤
│ ⚖️ NOTAIRE fait formalités:                                        │
│    → Enregistrement acte aux impôts                                 │
│    → Inscription conservation foncière                              │
│    → Publication changement propriétaire                            │
│    → Mise à jour cadastre                                           │
│                                                                      │
│ 📄 NOTAIRE remet copies acte:                                      │
│    → Copie authentique ACHETEUR                                     │
│    → Copie authentique VENDEUR                                      │
│    → Copie pour archives                                            │
│                                                                      │
│ 🏢 AGENT FONCIER reçoit commission (si pas encore payée)          │
│                                                                      │
│ ✅ Transfert propriété effectif                                    │
│ Status: 'completed'                                                 │
│                                                                      │
│ 🔔 Notifications finales → Tous les acteurs                        │
│                                                                      │
│ 🎉 VENTE TERMINÉE !                                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 8: SIGNATURE ACTE                                             │
├─────────────────────────────────────────────────────────────────────┤
│ 📅 JOUR J - RDV à l'office notarial                                │
│                                                                      │
│ Présents:                                                            │
│    👤 ACHETEUR (+ pièce identité originale)                        │
│    🏘️ VENDEUR (+ pièce identité originale)                        │
│    ⚖️ NOTAIRE                                                       │
│    🏢 AGENT FONCIER (optionnel - si présent dans le dossier)       │
│                                                                      │
│ ⚖️ NOTAIRE lit l'acte aux parties                                  │
│ ⚖️ NOTAIRE explique clauses                                        │
│                                                                      │
│ ✍️ ACHETEUR signe                                                  │
│ ✍️ VENDEUR signe                                                   │
│ ✍️ NOTAIRE authentifie signatures                                  │
│                                                                      │
│ 📄 Acte de vente authentique généré                                │
│ Status: 'signing_process' → 'property_transfer'                    │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 9: FORMALITÉS POST-SIGNATURE                                  │
├─────────────────────────────────────────────────────────────────────┤
│ ⚖️ NOTAIRE fait formalités:                                        │
│    → Enregistrement acte aux impôts                                 │
│    → Inscription conservation foncière                              │
│    → Publication changement propriétaire                            │
│    → Mise à jour cadastre                                           │
│                                                                      │
│ 📄 NOTAIRE remet copies acte:                                      │
│    → Copie authentique ACHETEUR                                     │
│    → Copie authentique VENDEUR                                      │
│    → Copie pour archives                                            │
│                                                                      │
│ 🏢 AGENT FONCIER reçoit commission (si présent et pas encore payé) │
│                                                                      │
│ ✅ Transfert propriété effectif                                    │
│ Status: 'completed'                                                 │
│                                                                      │
│ 🔔 Notifications finales → Tous les acteurs                        │
│                                                                      │
│ 🎉 VENTE TERMINÉE !                                                │
└─────────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────────┐
│ PHASE 10: ÉVALUATIONS (Optionnel)                                   │
├─────────────────────────────────────────────────────────────────────┤
│ 👤 ACHETEUR peut évaluer:                                          │
│    → ⚖️ NOTAIRE (professionnalisme, rapidité)                     │
│    → 🏢 AGENT FONCIER (si utilisé)                                │
│    → 📐 GÉOMÈTRE (si utilisé)                                     │
│    → 🏘️ VENDEUR (communication)                                   │
│                                                                      │
│ 🏘️ VENDEUR peut évaluer:                                          │
│    → ⚖️ NOTAIRE                                                    │
│    → 🏢 AGENT FONCIER (si utilisé)                                │
│    → 👤 ACHETEUR (sérieux, ponctualité)                           │
│                                                                      │
│ ⭐ Reviews publiées sur profils                                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ MODIFICATIONS BASE DE DONNÉES

### Table `purchase_cases` - Ajouts

```sql
ALTER TABLE purchase_cases
ADD COLUMN IF NOT EXISTS agent_foncier_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS geometre_id UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS agent_assigned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS geometre_assigned_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS agent_commission DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS agent_commission_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS geometre_fees DECIMAL(12, 2),
ADD COLUMN IF NOT EXISTS geometre_fees_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS has_agent BOOLEAN DEFAULT false, -- L'acheteur a choisi un agent
ADD COLUMN IF NOT EXISTS has_surveying BOOLEAN DEFAULT false, -- L'acheteur a demandé un bornage
ADD COLUMN IF NOT EXISTS surveying_completed_at TIMESTAMP;

-- Index
CREATE INDEX IF NOT EXISTS idx_purchase_cases_agent 
ON purchase_cases(agent_foncier_id) WHERE agent_foncier_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_purchase_cases_geometre 
ON purchase_cases(geometre_id) WHERE geometre_id IS NOT NULL;

-- Commentaires
COMMENT ON COLUMN purchase_cases.has_agent IS 'L''acheteur a décidé de faire appel à un agent foncier (facultatif)';
COMMENT ON COLUMN purchase_cases.has_surveying IS 'L''acheteur a demandé un bornage par géomètre (facultatif)';
```

### Table `agent_foncier_profiles`

```sql
CREATE TABLE IF NOT EXISTS agent_foncier_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  
  -- Informations agence
  agency_name VARCHAR(255),
  agency_address TEXT,
  agency_region VARCHAR(100),
  license_number VARCHAR(100),
  is_verified BOOLEAN DEFAULT false,
  
  -- Commission
  commission_rate DECIMAL(5, 2) DEFAULT 5.00, -- 5%
  
  -- Performance
  total_sales_completed INTEGER DEFAULT 0,
  total_commission_earned DECIMAL(15, 2) DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  
  -- Spécialisations
  specializations TEXT[] DEFAULT ARRAY['terrain', 'immobilier'],
  zones_coverage TEXT[], -- Régions où l'agent opère
  
  -- Contact
  phone VARCHAR(50),
  email VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table `geometre_profiles`

```sql
CREATE TABLE IF NOT EXISTS geometre_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id),
  
  -- Informations cabinet
  cabinet_name VARCHAR(255),
  cabinet_address TEXT,
  license_number VARCHAR(100),
  is_verified BOOLEAN DEFAULT false,
  
  -- Tarification
  bornage_fee DECIMAL(12, 2) DEFAULT 100000, -- 100k FCFA
  plan_fee DECIMAL(12, 2) DEFAULT 50000,
  certificate_fee DECIMAL(12, 2) DEFAULT 30000,
  
  -- Performance
  total_missions_completed INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0.00,
  reviews_count INTEGER DEFAULT 0,
  average_completion_days DECIMAL(6, 2),
  
  -- Équipement
  has_gps BOOLEAN DEFAULT true,
  has_drone BOOLEAN DEFAULT false,
  has_total_station BOOLEAN DEFAULT true,
  
  -- Contact
  phone VARCHAR(50),
  email VARCHAR(255),
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Table `surveying_missions` (Missions géomètre)

```sql
CREATE TABLE IF NOT EXISTS surveying_missions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  case_id UUID REFERENCES purchase_cases(id),
  geometre_id UUID REFERENCES profiles(id),
  parcelle_id UUID REFERENCES parcels(id),
  
  -- Type de mission
  mission_type VARCHAR(50), -- 'bornage', 'plan', 'certificat', 'complete'
  
  -- Status
  status VARCHAR(50) DEFAULT 'pending',
  
  -- Dates
  requested_at TIMESTAMP DEFAULT NOW(),
  scheduled_date DATE,
  completed_at TIMESTAMP,
  
  -- Livrables
  plan_url TEXT,
  certificate_url TEXT,
  photos_urls TEXT[],
  gps_coordinates JSONB,
  
  -- Tarif
  quoted_fee DECIMAL(12, 2),
  paid BOOLEAN DEFAULT false,
  paid_at TIMESTAMP,
  
  -- Notes
  geometre_notes TEXT,
  client_notes TEXT,
  
  CONSTRAINT valid_mission_type CHECK (mission_type IN 
    ('bornage', 'plan', 'certificat', 'verification', 'complete')
  ),
  CONSTRAINT valid_mission_status CHECK (status IN 
    ('pending', 'scheduled', 'in_progress', 'completed', 'cancelled')
  )
);
```

---

## 🎨 INTERFACE UNIFIÉE - Design

### Header avec Détection de Rôle

```jsx
// En haut de page, badge indique le rôle de l'utilisateur
┌────────────────────────────────────────────────────────┐
│ ← Retour   [Badge: Vous êtes ACHETEUR]    TF-20251029 │
│                                                         │
│ Dossier d'achat - Parcelle "Terrain Almadies 500m²"   │
│ Status: [🟡 En cours] • Notaire assigné                │
│                                                         │
│ 👥 PARTICIPANTS:                                       │
│  👤 Acheteur: Jean Dupont                              │
│  🏘️ Vendeur: Marie Sow                                │
│  ⚖️ Notaire: Maître Diop (Étude Diop)                 │
│  🏢 Agent: Teranga Immo (5%)                           │
│  📐 Géomètre: Cabinet Ndiaye                           │
└────────────────────────────────────────────────────────┘
```

### Tabs Conditionnels selon Rôle

```jsx
<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
    <TabsTrigger value="timeline">Progression</TabsTrigger>
    <TabsTrigger value="documents">Documents</TabsTrigger>
    <TabsTrigger value="messages">Messages</TabsTrigger>
    <TabsTrigger value="payments">Paiements</TabsTrigger>
    
    {/* Conditionnel ACHETEUR */}
    {userRole === 'buyer' && (
      <TabsTrigger value="financing">Financement</TabsTrigger>
    )}
    
    {/* Conditionnel NOTAIRE */}
    {userRole === 'notaire' && (
      <TabsTrigger value="legal">Juridique</TabsTrigger>
    )}
    
    {/* Conditionnel GÉOMÈTRE */}
    {userRole === 'geometre' && (
      <TabsTrigger value="surveying">Bornage</TabsTrigger>
    )}
  </TabsList>
</Tabs>
```

### Vue d'ensemble (Pour TOUS)

```jsx
<Card>
  <CardHeader>
    <CardTitle>Informations Dossier</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="grid grid-cols-3 gap-4">
      {/* Parcelle */}
      <div>
        <Label>Parcelle</Label>
        <p>Almadies, Dakar</p>
        <p>500 m² • TF N° 12345/DAK</p>
      </div>
      
      {/* Prix */}
      <div>
        <Label>Prix convenu</Label>
        <p className="text-2xl font-bold">50 000 000 FCFA</p>
      </div>
      
      {/* Phase */}
      <div>
        <Label>Phase actuelle</Label>
        <Badge>Document audit</Badge>
        <Progress value={60} className="mt-2" />
      </div>
    </div>
    
    {/* Participants - Visible par TOUS */}
    <Separator className="my-4" />
    
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {/* Acheteur */}
      <Card>
        <CardContent className="p-4 text-center">
          <Avatar>
            <AvatarImage src={buyer.avatar} />
            <AvatarFallback>👤</AvatarFallback>
          </Avatar>
          <p className="font-semibold mt-2">Jean Dupont</p>
          <Badge variant="outline">Acheteur</Badge>
          <div className="mt-2 space-y-1 text-sm">
            <p>📧 {buyer.email}</p>
            <p>📞 {buyer.phone}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Vendeur */}
      <Card>
        <CardContent className="p-4 text-center">
          <Avatar>
            <AvatarImage src={seller.avatar} />
            <AvatarFallback>🏘️</AvatarFallback>
          </Avatar>
          <p className="font-semibold mt-2">Marie Sow</p>
          <Badge variant="outline">Vendeur</Badge>
          <div className="mt-2 space-y-1 text-sm">
            <p>📧 {seller.email}</p>
            <p>📞 {seller.phone}</p>
          </div>
        </CardContent>
      </Card>
      
      {/* Notaire */}
      {notaire && (
        <Card>
          <CardContent className="p-4 text-center">
            <Avatar>
              <AvatarImage src={notaire.avatar} />
              <AvatarFallback>⚖️</AvatarFallback>
            </Avatar>
            <p className="font-semibold mt-2">Maître Diop</p>
            <Badge variant="outline">Notaire</Badge>
            <p className="text-xs mt-1">Étude Diop</p>
            <div className="mt-2 space-y-1 text-sm">
              <p>📧 {notaire.email}</p>
              <p>📞 {notaire.phone}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Agent Foncier - FACULTATIF */}
      {purchaseCase.has_agent && agent && (
        <Card className="border-dashed">
          <CardContent className="p-4 text-center">
            <Avatar>
              <AvatarImage src={agent.avatar} />
              <AvatarFallback>🏢</AvatarFallback>
            </Avatar>
            <p className="font-semibold mt-2">{agent.agency_name}</p>
            <Badge variant="outline">Agent</Badge>
            <Badge variant="secondary" className="text-xs mt-1">Facultatif</Badge>
            <p className="text-xs mt-1">Commission: 5%</p>
            <div className="mt-2 space-y-1 text-sm">
              <p>📧 {agent.email}</p>
              <p>📞 {agent.phone}</p>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Géomètre - FACULTATIF */}
      {purchaseCase.has_surveying && geometre && (
        <Card className="border-dashed">
          <CardContent className="p-4 text-center">
            <Avatar>
              <AvatarImage src={geometre.avatar} />
              <AvatarFallback>📐</AvatarFallback>
            </Avatar>
            <p className="font-semibold mt-2">{geometre.cabinet_name}</p>
            <Badge variant="outline">Géomètre</Badge>
            <Badge variant="secondary" className="text-xs mt-1">Facultatif</Badge>
            <p className="text-xs mt-1">
              {surveyingMission?.status === 'completed' ? '✅ Bornage OK' : '⏳ En cours'}
            </p>
            <div className="mt-2 space-y-1 text-sm">
              <p>📧 {geometre.email}</p>
              <p>📞 {geometre.phone}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  </CardContent>
</Card>
```

---

## 📋 ACTIONS SPÉCIFIQUES PAR RÔLE

### Actions ACHETEUR 👤

```jsx
<Card>
  <CardHeader>
    <CardTitle>Vos actions</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      {/* Choix facultatifs (Phase 0) */}
      {!purchaseCase.has_agent && (
        <Button onClick={chooseAgent} variant="outline">
          🏢 Choisir un agent foncier (Facultatif)
        </Button>
      )}
      
      {!purchaseCase.has_surveying && (
        <Button onClick={requestSurveying} variant="outline">
          📐 Commander un bornage (Facultatif)
        </Button>
      )}
      
      <Separator />
      
      {/* Actions principales */}
      <Button onClick={uploadDocument}>
        📤 Uploader mes pièces d'identité
      </Button>
      <Button onClick={viewContract}>
        📄 Consulter projet de contrat
      </Button>
      <Button onClick={payDeposit}>
        💰 Payer acompte (10-20%)
      </Button>
      <Button onClick={confirmAppointment}>
        ✅ Confirmer RDV signature
      </Button>
    </div>
  </CardContent>
</Card>
```

### Actions VENDEUR 🏘️

```jsx
<Card>
  <CardHeader>
    <CardTitle>Vos actions</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <Button onClick={uploadTitreFoncier}>
        📄 Uploader titre foncier
      </Button>
      {purchaseCase.has_surveying && (
        <Badge variant="secondary">
          ℹ️ Bornage demandé par l'acheteur
        </Badge>
      )}
      <Button onClick={approveContract}>
        ✅ Valider contrat proposé
      </Button>
      <Button onClick={confirmAppointment}>
        📅 Confirmer RDV signature
      </Button>
    </div>
  </CardContent>
</Card>
```

### Actions NOTAIRE ⚖️

```jsx
<Card>
  <CardHeader>
    <CardTitle>Vos actions notariales</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-2">
      <Button onClick={verifyIdentities}>
        🔍 Vérifier identités
      </Button>
      <Button onClick={checkTitreFoncier}>
        📋 Contrôler titre foncier au cadastre
      </Button>
      <Button onClick={generateContract}>
        📝 Générer acte de vente
      </Button>
      <Button onClick={proposeAppointments}>
        📅 Proposer dates RDV
      </Button>
      <Button onClick={confirmPaymentReceived}>
        ✅ Confirmer réception honoraires
      </Button>
      <Button onClick={registerAct}>
        📄 Enregistrer acte aux impôts
      </Button>
    </div>
  </CardContent>
</Card>
```

### Actions AGENT FONCIER 🏢 (Si choisi par l'acheteur)

```jsx
{purchaseCase.has_agent && userRole === 'agent' && (
  <Card>
    <CardHeader>
      <CardTitle>Vos actions agent</CardTitle>
      <CardDescription>
        Vous avez été choisi par l'acheteur pour faciliter cette transaction
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <Button onClick={facilitateNegotiation}>
          💬 Faciliter négociation
        </Button>
        <Button onClick={collectDocuments}>
          📋 Collecter documents manquants
        </Button>
        <Button onClick={trackCommission}>
          💰 Suivre commission (5%)
        </Button>
        <Button onClick={confirmCommissionReceived}>
          ✅ Confirmer paiement commission
        </Button>
      </div>
    </CardContent>
  </Card>
)}
```

### Actions GÉOMÈTRE 📐 (Si mission demandée par l'acheteur)

```jsx
{purchaseCase.has_surveying && userRole === 'geometre' && (
  <Card>
    <CardHeader>
      <CardTitle>Mission de bornage</CardTitle>
      <CardDescription>
        L'acheteur a demandé une vérification du bornage de la parcelle
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {/* Status mission */}
        <div>
          <Label>Status</Label>
          <Badge>{surveyingMission.status}</Badge>
        </div>
        
        {/* Actions */}
        <div className="space-y-2">
          <Button onClick={acceptMission}>
            ✅ Accepter mission
          </Button>
          <Button onClick={scheduleVisit}>
            📅 Planifier visite terrain
          </Button>
          <Button onClick={uploadPlan}>
            📤 Uploader plan de bornage
          </Button>
          <Button onClick={uploadCertificate}>
            📄 Uploader certificat topographique
          </Button>
          <Button onClick={enterGPSCoordinates}>
            📍 Saisir coordonnées GPS
          </Button>
          <Button onClick={generateInvoice}>
            💰 Générer facture
          </Button>
          <Button onClick={completeMission}>
            ✅ Clôturer mission
          </Button>
        </div>
      </div>
    </CardContent>
  </Card>
)}
```

---

## 💬 MESSAGERIE MULTI-ACTEURS

```jsx
<Card>
  <CardHeader>
    <CardTitle>Messages (5 participants)</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Liste messages avec avatar + rôle */}
    <ScrollArea className="h-96">
      {messages.map(msg => (
        <div key={msg.id} className="flex gap-3 mb-4">
          <Avatar>
            <AvatarImage src={msg.sender.avatar} />
            <AvatarFallback>{msg.sender.role_icon}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{msg.sender.name}</span>
              <Badge variant="outline">{msg.sender.role}</Badge>
              <span className="text-xs text-muted">{msg.time}</span>
            </div>
            <p className="mt-1">{msg.content}</p>
          </div>
        </div>
      ))}
    </ScrollArea>
    
    {/* Envoi message */}
    <div className="mt-4 flex gap-2">
      <Textarea 
        placeholder="Votre message à tous les participants..."
        value={newMessage}
        onChange={e => setNewMessage(e.target.value)}
      />
      <Button onClick={sendMessage}>
        <Send className="w-4 h-4" />
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## 🎯 PROCHAINES ÉTAPES

### 1. Migrations SQL (1h)
- Ajouter colonnes `agent_foncier_id`, `geometre_id`
- Créer `agent_foncier_profiles`
- Créer `geometre_profiles`
- Créer `surveying_missions`

### 2. Service UnifiedCaseTrackingService.js (2h)
- Méthode `getCaseWithAllParticipants(caseId, userId)`
- Détecte rôle utilisateur
- Charge données selon rôle
- Permissions différenciées

### 3. Composant UnifiedCaseTracking.jsx (4h)
- Détection automatique du rôle
- Interface adaptative
- Actions conditionnelles
- Messagerie multi-acteurs

### 4. Tests (2h)
- Tester avec chaque rôle
- Vérifier permissions
- Tester messagerie
- Tester notifications

**Total estimé**: ~9h de développement

---

**Voulez-vous que je commence par créer les migrations SQL et le service ?** 🚀
