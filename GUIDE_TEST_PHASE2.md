# 🧪 GUIDE DE TEST - PHASE 2

## Checklist de test pour les 5 nouvelles pages

---

## ⚠️ PRÉ-REQUIS

### 1. Base de données
```sql
-- IMPORTANT: Exécuter d'abord dans Supabase SQL Editor
-- Fichier: create-phase2-tables.sql
```

✅ Vérifier que ces tables existent:
- [ ] `property_photos`
- [ ] `ai_analyses`
- [ ] `ai_chat_history`
- [ ] `gps_coordinates`
- [ ] `blockchain_certificates`
- [ ] `wallet_connections`
- [ ] `fraud_checks`

### 2. Storage Buckets
✅ Créer dans Supabase Storage:
- [ ] Bucket `property-photos` (public read)

### 3. Variables d'environnement
✅ Vérifier `.env`:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

---

## 📸 TEST 1: VendeurPhotosRealData

### Scénario A - Chargement initial
1. Ouvrir dashboard vendeur
2. Cliquer sur onglet "Photos"
3. **Vérifier:**
   - [ ] Page charge sans erreur
   - [ ] 4 KPI cards s'affichent
   - [ ] Liste des photos (ou message "Aucune photo")
   - [ ] Animations Framer Motion fluides

### Scénario B - Upload photo
1. Cliquer sur "Uploader Photos"
2. Drag & drop une image ou cliquer pour parcourir
3. Sélectionner 1-3 images
4. **Vérifier:**
   - [ ] Preview des images avant upload
   - [ ] Upload réussit avec toast success
   - [ ] Photo apparaît dans la liste
   - [ ] Analyse qualité IA (score 70-100)
   - [ ] KPI "Total Photos" augmente

### Scénario C - Actions sur photo
1. Cliquer sur "Voir" sur une photo
2. **Vérifier:** Modal avec détails
3. Cliquer sur "Supprimer"
4. **Vérifier:**
   - [ ] Confirmation demandée
   - [ ] Photo supprimée de Supabase
   - [ ] Photo supprimée du Storage
   - [ ] Liste mise à jour

### Erreurs possibles
- ❌ "property-photos bucket not found" → Créer bucket Storage
- ❌ "Insert failed" → Vérifier RLS policies
- ❌ "vendor_id null" → Vérifier auth user

---

## 🤖 TEST 2: VendeurAIRealData

### Scénario A - Chargement
1. Cliquer sur onglet "IA"
2. **Vérifier:**
   - [ ] 5 stats cards affichées
   - [ ] Onglets: Analyses, Chat, Historique
   - [ ] Liste des analyses précédentes

### Scénario B - Nouvelle analyse
1. Aller sur onglet "Analyses"
2. Sélectionner type: "Price Estimation"
3. Entrer ID propriété
4. Cliquer "Lancer Analyse"
5. **Vérifier:**
   - [ ] Bouton en loading (3-5 sec)
   - [ ] Toast success
   - [ ] Résultat affiché avec confidence
   - [ ] KPI "Total Analyses" augmente
   - [ ] Coût tokens calculé

### Scénario C - Chat IA
1. Aller sur onglet "Chat"
2. Taper: "Analyse ma propriété ALM-001"
3. Envoyer message
4. **Vérifier:**
   - [ ] Message ajouté à l'historique
   - [ ] Réponse IA générée (2-3 sec)
   - [ ] Badge "IA" violet sur réponse
   - [ ] Historique sauvegardé dans BD

### Erreurs possibles
- ❌ "ai_analyses table not found" → Exécuter SQL
- ❌ "Analysis failed" → Vérifier property_id existe

---

## 🗺️ TEST 3: VendeurGPSRealData

### Scénario A - Vue carte
1. Cliquer sur onglet "GPS"
2. **Vérifier:**
   - [ ] Carte Leaflet chargée
   - [ ] Markers sur propriétés
   - [ ] Zoom/Pan fonctionnel
   - [ ] 5 stats GPS affichées

### Scénario B - Vérification GPS
1. Sélectionner une propriété
2. Cliquer "Vérifier GPS"
3. **Vérifier:**
   - [ ] Analyse GPS lancée
   - [ ] Précision calculée (95-100%)
   - [ ] Badge "Vérifié" vert si OK
   - [ ] Coordonnées sauvegardées

### Scénario C - Détection conflits
1. **Vérifier:**
   - [ ] Propriétés trop proches détectées
   - [ ] Badge "Conflit" rouge
   - [ ] Distance affichée en mètres

### Erreurs possibles
- ❌ "Leaflet not defined" → npm install leaflet
- ❌ "Map tiles not loading" → Vérifier connexion internet

---

## 🔗 TEST 4: VendeurBlockchainRealData ⭐ NOUVEAU

### Scénario A - Vue certificats
1. Cliquer sur onglet "Blockchain"
2. **Vérifier:**
   - [ ] 5 stats blockchain affichées
   - [ ] Onglets: Certificats, Mint, Wallets, Analytics
   - [ ] Liste des NFTs (ou message vide)

### Scénario B - Mint NFT
1. Aller sur onglet "Mint NFT"
2. Entrer ID propriété
3. Sélectionner réseau: Polygon
4. Sélectionner standard: ERC-721
5. Cliquer "Créer le NFT"
6. **Vérifier:**
   - [ ] Loading 2-3 secondes
   - [ ] Toast success "NFT minté"
   - [ ] Token ID généré (TERA + timestamp)
   - [ ] Transaction hash créé (0x...)
   - [ ] Certificat dans liste
   - [ ] Badge "active" vert
   - [ ] KPI "NFTs Actifs" augmente

### Scénario C - Connexion wallet
1. Aller sur onglet "Wallets"
2. Cliquer "MetaMask"
3. **Vérifier:**
   - [ ] Wallet connecté
   - [ ] Adresse générée (0x...)
   - [ ] Badge "Actif" vert
   - [ ] Network Polygon affiché

### Scénario D - Vérifier certificat
1. Cliquer "Vérifier" sur un NFT
2. **Vérifier:**
   - [ ] Status → "verified"
   - [ ] verified_at rempli
   - [ ] Toast success

### Scénario E - Voir sur explorer
1. Cliquer "Explorer" sur un NFT
2. **Vérifier:**
   - [ ] Ouvre PolygonScan
   - [ ] URL: https://polygonscan.com/tx/{hash}

### Erreurs possibles
- ❌ "blockchain_certificates not found" → Exécuter SQL
- ❌ "Mint failed" → Vérifier property_id valide
- ❌ "Wallet connection failed" → Normal (simulation)

---

## 🛡️ TEST 5: VendeurAntiFraudeRealData ⭐ NOUVEAU

### Scénario A - Vue overview
1. Cliquer sur onglet "Anti-Fraude"
2. **Vérifier:**
   - [ ] 5 stats affichées
   - [ ] Score de sécurité global (jauge)
   - [ ] Distribution des risques (graphique)
   - [ ] Vérifications récentes

### Scénario B - Scanner propriété
1. Aller sur onglet "Scanner"
2. Entrer ID propriété
3. Sélectionner type: "Comprehensive"
4. Cliquer "Démarrer la Vérification"
5. **Vérifier:**
   - [ ] Loading 3-4 secondes
   - [ ] 3 analyses simulées (OCR, GPS, Prix)
   - [ ] Score de fraude calculé (0-100)
   - [ ] Risk level: low/medium/high
   - [ ] Status: verified/suspicious/rejected
   - [ ] Résultat sauvegardé
   - [ ] Toast avec score

### Scénario C - Voir historique
1. Aller sur onglet "Historique"
2. **Vérifier:**
   - [ ] Liste des vérifications
   - [ ] Score coloré (vert/jaune/rouge)
   - [ ] 3 checkmarks (OCR, GPS, Prix)
   - [ ] Alertes affichées si risques
   - [ ] Date de vérification

### Scénario D - Re-vérifier
1. Cliquer refresh sur une vérification
2. **Vérifier:**
   - [ ] Nouvelle analyse lancée
   - [ ] Score peut changer
   - [ ] Historique mis à jour

### Scénario E - Export rapport
1. Cliquer download sur une vérification
2. **Vérifier:**
   - [ ] Toast "Rapport exporté"
   - [ ] (Future: PDF généré)

### Scénario F - Alertes
1. Aller sur onglet "Alertes"
2. **Vérifier:**
   - [ ] Propriétés suspectes affichées
   - [ ] Badge jaune/rouge
   - [ ] Détails des alertes
   - [ ] Bouton "Re-vérifier"

### Erreurs possibles
- ❌ "fraud_checks not found" → Exécuter SQL
- ❌ "Scan failed" → Vérifier property existe
- ❌ "Score null" → Vérifier calcul dans simulateXXX

---

## 🔄 TEST INTÉGRATION

### Navigation entre pages
1. Tester navigation rapide:
   - Photos → IA → GPS → Blockchain → Anti-Fraude
2. **Vérifier:**
   - [ ] Pas de re-render complet
   - [ ] Lazy loading fonctionne
   - [ ] Données persistent (cache)

### Performance
1. **Vérifier temps de chargement:**
   - [ ] Chaque page < 2 secondes
   - [ ] Animations 60fps
   - [ ] Pas de memory leaks

### Responsive
1. Tester sur mobile (DevTools)
2. **Vérifier:**
   - [ ] Cards en colonne
   - [ ] Boutons accessibles
   - [ ] Texte lisible

---

## 🐛 ERREURS COURANTES

### 1. "Cannot read property 'id' of undefined"
**Cause:** User non connecté  
**Solution:** Vérifier `const { user } = useAuth()`

### 2. "Table 'xxx' does not exist"
**Cause:** Tables Phase 2 non créées  
**Solution:** Exécuter `create-phase2-tables.sql`

### 3. "Permission denied for relation xxx"
**Cause:** RLS policies manquantes  
**Solution:** Vérifier policies dans SQL

### 4. "Storage bucket not found"
**Cause:** Bucket non créé  
**Solution:** Créer `property-photos` dans Supabase Storage

### 5. "vendor_id cannot be null"
**Cause:** User n'a pas de profile  
**Solution:** Vérifier table `profiles` a user.id

---

## ✅ CHECKLIST FINALE

### Avant production
- [ ] Toutes les 5 pages testées
- [ ] CRUD fonctionne sur chaque table
- [ ] Animations fluides
- [ ] Pas d'erreurs console
- [ ] Toast notifications OK
- [ ] Loading states OK
- [ ] Responsive mobile OK
- [ ] RLS policies testées
- [ ] Storage upload/delete OK
- [ ] Simulation IA réaliste

### Métriques de succès
- ✅ 0 erreurs JavaScript
- ✅ Temps de chargement < 2s
- ✅ Upload photo < 5s
- ✅ Analyses IA < 5s
- ✅ Mint NFT < 3s
- ✅ Scan fraude < 4s

---

## 🚀 APRÈS LES TESTS

### Si tout OK ✅
1. Créer quelques données de test
2. Prendre screenshots
3. Documenter dans README
4. Préparer Phase 3

### Si problèmes ❌
1. Vérifier console browser (F12)
2. Vérifier logs Supabase
3. Vérifier network tab (requests)
4. Corriger et re-tester

---

**Bon courage pour les tests ! 🎉**

*En cas de blocage, vérifier d'abord:*
1. *Tables créées?*
2. *User connecté?*
3. *RLS policies OK?*
