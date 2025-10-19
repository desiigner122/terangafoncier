# 🎯 GUIDE D'ACTION - Parcelle Detail & Edit

## 📌 Problèmes Identifiés

### 1️⃣ **Bouton Éditer visible pour tous?**
**Status:** ⚠️ À diagnostiquer

#### Symptôme
- Utilisateur A voit le bouton "Éditer" sur une parcelle qu'il ne possède pas
- OU: Le bouton n'apparaît jamais même pour le propriétaire

#### Causes possibles
1. **Parcelle pas chargée au rendu** → `parcelle` est null
2. **User pas authentifié** → `user` est null
3. **IDs ne correspondent pas** → `user.id` ≠ `parcelle.owner_id`
4. **Données désynchronisées** entre auth et profiles table

#### ✅ Corrections appliquées
- ✅ Ajout diagnostic console (voir console du navigateur)
- ✅ Amélioration condition: `!loading && parcelle && user && user.id === parcelle.owner_id`
- ✅ Ajout animation au bouton pour meilleure UX
- ✅ Ajout title attribute pour tooltip

#### 🔍 Comment diagnostiquer

1. **Ouvrir console du navigateur** (F12 → Console)
2. **Naviguer vers une page parcelle**
3. **Chercher le message** `🔍 DEBUG BOUTON ÉDITER:`
4. **Vérifier les valeurs:**
   ```
   ✅ user_id = présent ET non vide
   ✅ parcelle_owner_id = présent ET non vide
   ✅ is_owner = true si c'est votre parcelle
   ✅ parcelle_loaded = true
   ✅ user_logged_in = true
   ```

5. **Si algo est faux:**
   - `is_owner: false` mais vous êtes propriétaire → IDs ne matchent pas, vérifier BD
   - `parcelle_loaded: false` → Problème de chargement Supabase
   - `user_logged_in: false` → Pas connecté, aller à /login

---

### 2️⃣ **Champs affichés mais non éditables**
**Status:** ⚠️ À améliorer

#### Champs manquants en édition

| Champ | Affiché | Éditable | Priorité | Notes |
|-------|---------|---------|----------|-------|
| `nft_available` | ✅ | ❌ | 🔴 Haute | Token ID, blockchain, smart contract affichés mais pas éditables |
| `blockchain_verified` | ✅ | ❌ | 🔴 Haute | Affichage blockchain mais pas d'input |
| `ai_score.*` | ✅ | ❌ | 🟡 Moyenne | C'est normal (calculé auto, read-only) |
| `stats.*` | ✅ | ❌ | 🟢 Faible | C'est normal (views, favorites = read-only) |

#### Plan de correction

**Étape 1: Ajouter section NFT/Blockchain dans EditPropertyComplete.jsx**

```jsx
// À ajouter dans l'array steps
{
  id: 7, 
  title: 'NFT & Blockchain', 
  icon: Bitcoin,
  subtext: 'Tokeniser votre propriété'
}

// À ajouter dans renderStepContent()
case 7:
  return <StepNFTBlockchain />;

// Nouvelle fonction StepNFTBlockchain
const StepNFTBlockchain = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-lg font-semibold mb-4">NFT & Blockchain</h3>
      
      <div className="space-y-4">
        {/* NFT Available Toggle */}
        <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
          <Label>Rendre cette propriété disponible en NFT</Label>
          <Switch 
            checked={propertyData.nft_available}
            onCheckedChange={(val) => handleInputChange('nft_available', val)}
          />
        </div>

        {/* NFT Fields - Conditionnels */}
        {propertyData.nft_available && (
          <>
            {/* Token ID */}
            <div>
              <Label>Token ID (optionnel)</Label>
              <Input 
                placeholder="0x1234..."
                value={propertyData.nft_token_id || ''}
                onChange={(e) => handleInputChange('nft_token_id', e.target.value)}
              />
              <p className="text-xs text-gray-600 mt-1">
                Sera généré automatiquement lors de la mint si vide
              </p>
            </div>

            {/* Blockchain Network */}
            <div>
              <Label>Réseau Blockchain</Label>
              <Select 
                value={propertyData.blockchain_network || 'Polygon'}
                onValueChange={(val) => handleInputChange('blockchain_network', val)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Polygon">Polygon (Recommandé - Écologique)</SelectItem>
                  <SelectItem value="Ethereum">Ethereum</SelectItem>
                  <SelectItem value="Binance">Binance Smart Chain</SelectItem>
                  <SelectItem value="Arbitrum">Arbitrum One</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Smart Contract Address */}
            <div>
              <Label>Adresse du Smart Contract (optionnel)</Label>
              <Input 
                placeholder="0x..."
                value={propertyData.nft_smart_contract || ''}
                onChange={(e) => handleInputChange('nft_smart_contract', e.target.value)}
              />
              <p className="text-xs text-gray-600 mt-1">
                Sera associé automatiquement après la création du NFT
              </p>
            </div>

            {/* Mint Date */}
            <div>
              <Label>Date de Mint (optionnel)</Label>
              <Input 
                type="datetime-local"
                value={propertyData.nft_mint_date || ''}
                onChange={(e) => handleInputChange('nft_mint_date', e.target.value)}
              />
            </div>
          </>
        )}
      </div>
    </div>

    {/* Info Box */}
    <Alert>
      <Bitcoin className="h-4 w-4" />
      <AlertDescription>
        <strong>NFT & Blockchain:</strong> Les propriétés tokenisées en NFT bénéficient d'une 
        sécurité accrue, d'une traçabilité complète et d'un accès à nos acheteurs internationaux.
        Vous pouvez activer cette option à tout moment.
      </AlertDescription>
    </Alert>
  </div>
);
```

**Étape 2: Mettre à jour state dans EditPropertyComplete**

```jsx
// Ajouter au state initial
blockchain_network: 'Polygon',
nft_available: false,
nft_token_id: '',
nft_smart_contract: '',
nft_mint_date: '',
```

**Étape 3: Réordonner les étapes**

```jsx
// Actuel (PhotosEtapes 7, Documents 8)
// Nouveau:
{ id: 7, title: 'NFT & Blockchain' },  // NOUVEAU
{ id: 8, title: 'Photos' },             // Was 7
{ id: 9, title: 'Documents' }           // Was 8
```

---

## 🚀 CHECKLIST DE CORRECTION

### Phase 1: Diagnostique du bouton Éditer (15 min)
- [ ] Ouvrir console F12
- [ ] Naviguer vers une parcelle
- [ ] Chercher "🔍 DEBUG BOUTON ÉDITER"
- [ ] Vérifier les IDs correspondent
- [ ] Si pas d'affichage → Vérifier auth status

### Phase 2: Ajouter section NFT dans EditPropertyComplete (45 min)
- [ ] Créer fonction `StepNFTBlockchain`
- [ ] Ajouter au switch case
- [ ] Ajouter au state initial
- [ ] Ajouter au steps array
- [ ] Tester l'affichage conditionnel (toggle NFT)
- [ ] Tester la sauvegarde des données

### Phase 3: Validation & Test (30 min)
- [ ] ✅ Vendeur peut éditer sa parcelle
- [ ] ✅ Vendeur voit le bouton "Éditer"
- [ ] ✅ Vendeur peut aller à /parcelles/{id}/edit
- [ ] ✅ NFT section apparaît/disparaît avec toggle
- [ ] ✅ Données NFT se sauvegardent
- [ ] ✅ Pas de user autre que propriétaire voit bouton Éditer
- [ ] ✅ Build réussit (npm run build)

### Phase 4: Push & Déploiement (10 min)
- [ ] git add .
- [ ] git commit -m "feat: Ajouter section NFT/Blockchain dans EditPropertyComplete + Améliorer diagnostic bouton Éditer"
- [ ] git push
- [ ] Vérifier sur GitHub Actions

---

## 📚 Fichiers à Modifier

### 1. ✅ DÉJÀ MODIFIÉ: ParcelleDetailPage.jsx
```diff
- {user?.id === parcelle?.owner_id && (
+ {!loading && parcelle && user && user.id === parcelle.owner_id && (
  
+ // + useEffect de diagnostic
```

### 2. À MODIFIER: EditPropertyComplete.jsx (1419 lignes)
```diff
// À la ligne ~140 (dans array steps)
+ { id: 7, title: 'NFT & Blockchain', icon: Bitcoin },

// À la ligne ~500 (dans renderStepContent)
+ case 7:
+   return <StepNFTBlockchain />;

// À la ligne ~100 (dans state initial)
+ blockchain_network: 'Polygon',
+ nft_available: false,
+ nft_token_id: '',
+ nft_smart_contract: '',
+ nft_mint_date: '',

// À la fin du fichier (avant export)
+ const StepNFTBlockchain = () => { ... }
```

### 3. À VÉRIFIER: AddParcelPage.jsx
- Vérifier que tous les champs NFT/Blockchain y sont aussi

### 4. CRÉÉ: AUDIT-CHAMPS-PARCELLE.md
- Documentation complète du mappage champs

---

## 🔗 Routes connexes

| Route | Fichier | Status |
|-------|---------|--------|
| `/parcelle/:id` | ParcelleDetailPage.jsx | ✅ Affiché |
| `/parcelle/:id/edit` | EditPropertyComplete.jsx | ⚠️ À tester |
| `/parcelle/add` | AddParcelPage.jsx | ⚠️ À vérifier |
| `/parcelle/:id/edit-simple` | EditParcelPage.jsx | ✅ Alternatif |

---

## 💡 Tips

- **Test rapide:** Créer compte vendeur → Ajouter parcelle → Éditer → Vérifier tous les champs
- **Audit champs:** Consulter `AUDIT-CHAMPS-PARCELLE.md` pour mappage complet
- **Console debug:** Les logs `🔍 DEBUG` aident à diagnostiquer bugs d'affichage
- **Git histoire:** Tous les changements sont trackés (git log --oneline)

---

## ❓ FAQ

**Q: Pourquoi le bouton Éditer ne s'affiche jamais?**
A: Vérifier la console F12 → "🔍 DEBUG BOUTON ÉDITER" → Si `is_owner: false`, c'est que vous n'êtes pas propriétaire ou les IDs ne matchent pas dans la BD.

**Q: Où ajouter les champs NFT?**
A: Dans `EditPropertyComplete.jsx` dans une nouvelle étape 7 "NFT & Blockchain" avant "Photos".

**Q: Les champs AI Score peuvent-ils être édités?**
A: Non, c'est normal. Ils sont calculés automatiquement par l'IA. Ce sont des "read-only metrics".

**Q: AddParcelPage.jsx doit aussi avoir les champs NFT?**
A: Oui, pour cohérence. À vérifier et ajouter si manquants.

---

**Prochaine étape:** Diagnostiquer le bouton Éditer via console, puis ajouter section NFT.
