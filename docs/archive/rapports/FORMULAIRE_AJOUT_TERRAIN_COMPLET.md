# 🏗️ FORMULAIRE AJOUT TERRAIN - VENDEUR UNIQUEMENT

## ❌ PROBLÈME ACTUEL

**Le formulaire actuel permet d'ajouter :**
- ❌ Terrains
- ❌ Villas
- ❌ Appartements
- ❌ Commerces
- ❌ Industriels

**MAIS** : Un vendeur ne peut vendre QUE des **TERRAINS** !

---

## ✅ SOLUTION : Formulaire Spécifique Terrain

### Structure Basée sur ParcelleDetailPage.jsx

Le formulaire doit collecter **EXACTEMENT** les mêmes données qu'une parcelle pour garantir la cohérence.

---

## 📋 STRUCTURE COMPLÈTE DU FORMULAIRE

### ÉTAPE 1: INFORMATIONS DE BASE (3 champs)

```jsx
{
  title: string,              // "Terrain Résidentiel Premium - Almadies"
  description: string,        // Description longue (min 200 caractères)
  type: enum                  // Résidentiel | Commercial | Agricole | Industriel | Mixte
}
```

**UI:**
- Input texte pour titre (max 100 caractères)
- Textarea pour description (min 200, max 2000 caractères)
- 5 boutons radio pour type de terrain avec icônes

---

### ÉTAPE 2: LOCALISATION DÉTAILLÉE (8 champs)

```jsx
{
  address: string,            // "Route des Almadies, Parcelle N°147"
  city: string,               // "Dakar"
  region: string,             // "Dakar"
  postal_code: string,        // "12000"
  latitude: number,           // 14.7381
  longitude: number,          // -17.5094
  nearby_landmarks: array     // ["Université Cheikh Anta Diop (8 km)", ...]
}
```

**UI:**
- Input texte pour adresse complète
- Select pour ville (Dakar, Thiès, Saint-Louis, etc.)
- Input pour région
- Input pour code postal
- **Carte interactive** pour sélectionner lat/long (optionnel ici, requis dans GPS tab)
- Liste dynamique pour ajouter des points d'intérêt à proximité

---

### ÉTAPE 3: PRIX & SURFACE (4 champs)

```jsx
{
  price: number,              // 85000000
  currency: string,           // "XOF"
  surface: number,            // 500
  surface_unit: string        // "m²"
}
```

**UI:**
- Input number pour prix avec formatage auto (85 000 000 FCFA)
- Input number pour surface
- **Calcul automatique** du prix au m²
- Badge affichant "17,000 FCFA/m²"

---

### ÉTAPE 4: CARACTÉRISTIQUES DU TERRAIN (10 champs)

#### 4.1 Zonage et Réglementation

```jsx
{
  zoning: enum,               // "R1" | "R2" | "R3" | "R4" | "C" | "I" | "A" | "M"
  buildable_ratio: number,    // 0.6 (Coefficient d'emprise au sol)
  max_floors: number,         // 4 (R+3)
  land_registry_ref: string,  // "TF 12345/DK"
  title_deed_number: string,  // "147/2025"
  legal_status: enum          // "Titre Foncier" | "Bail" | "Concession" | etc.
}
```

**UI:**
- Select pour zonage avec descriptions :
  - R1 : Résidentiel faible densité (villas individuelles)
  - R2 : Résidentiel moyenne densité (petits immeubles)
  - R3 : Résidentiel forte densité (immeubles collectifs)
  - R4 : Résidentiel très haute densité (tours)
  - C : Commercial
  - I : Industriel
  - A : Agricole
  - M : Mixte

- Input number pour coefficient (0.1 à 1.0)
- Input number pour étages max (1 à 20)
- Input texte pour réf. cadastrale
- Input texte pour n° titre foncier
- Select pour statut juridique

#### 4.2 Caractéristiques Principales

```jsx
{
  main_features: array        // ["Vue mer panoramique", "Résidence fermée", ...]
}
```

**Liste prédéfinie:**
- Vue mer panoramique
- Vue montagne
- Vue dégagée
- Résidence fermée sécurisée
- Gardien 24h/24
- Parking privé
- Espace vert
- Piscine commune
- Terrain de sport
- Salle de gym
- Aire de jeux enfants

**UI:** Checkboxes multiples avec icônes

---

### ÉTAPE 5: ÉQUIPEMENTS & UTILITÉS (15+ champs)

#### 5.1 Utilités Disponibles

```jsx
{
  utilities: array            // ["water", "electricity", "internet", ...]
}
```

**Options:**
- ✅ Eau courante (SONES/SDE)
- ✅ Électricité SENELEC
- ✅ Internet fibre optique
- ✅ Gaz de ville
- ✅ Système de drainage
- ✅ Tout-à-l'égout

#### 5.2 Accès

```jsx
{
  access: array               // ["paved_road", "public_transport", ...]
}
```

**Options:**
- ✅ Route pavée
- ✅ Route en terre
- ✅ Transport public
- ✅ Station taxi
- ✅ Piste cyclable
- ✅ Accès handicapés

#### 5.3 Proximités (avec distances)

```jsx
{
  nearby_facilities: array    // [{ type: "school", distance: "1.5 km" }, ...]
}
```

**Options avec input distance:**
- 🏫 École (distance en km)
- 🏥 Hôpital (distance en km)
- 🛒 Centre commercial (distance en km)
- 🚌 Gare/Arrêt bus (distance en km)
- 🕌 Mosquée (distance en km)
- 🏪 Marché (distance en km)
- 💊 Pharmacie (distance en km)
- 🏦 Banque (distance en km)
- 🏖️ Plage (distance en km)
- ✈️ Aéroport (distance en km)

**UI:** Checkbox + Input pour chaque facilité

---

### ÉTAPE 6: OPTIONS DE FINANCEMENT (12 champs)

#### 6.1 Méthodes de Paiement

```jsx
{
  financing_methods: array    // ["direct", "installment", "bank", "crypto"]
}
```

#### 6.2 Financement Bancaire

```jsx
{
  bank_financing_available: boolean,
  min_down_payment: string,   // "30%"
  max_duration: string,       // "25 ans"
  partner_banks: array        // ["CBAO", "UBA", "Banque Atlantique"]
}
```

**UI:**
- Toggle "Financement bancaire disponible"
- Si activé :
  - Select pour apport min (10%, 20%, 30%, 40%, 50%)
  - Select pour durée max (5, 10, 15, 20, 25 ans)
  - Multi-select pour banques partenaires

#### 6.3 Paiement Échelonné

```jsx
{
  installment_available: boolean,
  installment_duration: string, // "5 ans"
  monthly_payment: number       // 1200000
}
```

**UI:**
- Toggle "Paiement échelonné disponible"
- Si activé :
  - Select durée (6 mois, 1 an, 2 ans, 3 ans, 5 ans)
  - **Calcul automatique** des mensualités

#### 6.4 Crypto-monnaie

```jsx
{
  crypto_available: boolean,
  accepted_cryptos: array,      // ["Bitcoin", "Ethereum", "USDC"]
  crypto_discount: string       // "5%"
}
```

**UI:**
- Toggle "Accepter crypto-monnaies"
- Si activé :
  - Multi-select crypto (BTC, ETH, USDC, USDT, BNB)
  - Input réduction (0% à 10%)

---

### ÉTAPE 7: PHOTOS (Min 3, Max 20)

```jsx
{
  images: array               // [{ file, preview, id, is_main }]
}
```

**UI:**
- Zone drag & drop
- Prévisualisation avec miniatures
- Réorganiser l'ordre (drag & drop)
- Définir photo principale (badge)
- Supprimer une photo
- Validation :
  - Min 3 photos requises
  - Max 20 photos
  - Taille max 5MB par image
  - Formats: JPG, PNG, WEBP

---

### ÉTAPE 8: DOCUMENTS LÉGAUX

#### 8.1 Documents Disponibles

```jsx
{
  has_title_deed: boolean,      // Titre foncier
  has_survey: boolean,          // Plan de bornage
  has_building_permit: boolean, // Permis de construire
  has_urban_certificate: boolean, // Certificat d'urbanisme
  documents: array              // [{name, file, type, verified}]
}
```

**UI:**
- Checkboxes pour documents disponibles
- Upload zone pour chaque document
- Liste des documents uploadés avec statut de vérification

---

## 🔄 FLUX DE SOUMISSION

### 1. Validation par Étape

Chaque étape doit être validée avant de passer à la suivante :

```javascript
const validateStep = (step) => {
  switch (step) {
    case 1: // Informations
      if (!title || title.length < 10) return 'Titre trop court (min 10 caractères)';
      if (!description || description.length < 200) return 'Description trop courte (min 200 caractères)';
      if (!type) return 'Sélectionnez un type de terrain';
      break;
      
    case 2: // Localisation
      if (!address) return 'Adresse requise';
      if (!city) return 'Ville requise';
      if (!region) return 'Région requise';
      break;
      
    case 3: // Prix & Surface
      if (!price || price < 1000000) return 'Prix minimum: 1,000,000 FCFA';
      if (!surface || surface < 50) return 'Surface minimum: 50 m²';
      break;
      
    case 4: // Caractéristiques
      if (!zoning) return 'Zonage requis';
      if (!legal_status) return 'Statut juridique requis';
      break;
      
    case 5: // Équipements
      if (utilities.length === 0) return 'Sélectionnez au moins une utilité';
      break;
      
    case 6: // Financement
      if (financing_methods.length === 0) return 'Sélectionnez au moins une méthode de paiement';
      break;
      
    case 7: // Photos
      if (images.length < 3) return 'Minimum 3 photos requises';
      break;
      
    case 8: // Documents
      if (!has_title_deed) return 'Titre foncier requis pour publication';
      break;
  }
  return null;
};
```

### 2. Upload Progressif

```javascript
const handleSubmit = async () => {
  setIsSubmitting(true);
  
  try {
    // 1. Upload photos → Supabase Storage
    const imageUrls = await uploadPhotos(images);
    
    // 2. Upload documents → Supabase Storage
    const documentUrls = await uploadDocuments(documents);
    
    // 3. Créer la propriété → Supabase DB
    const { data: property } = await supabase
      .from('properties')
      .insert({
        owner_id: user.id,
        property_type: 'terrain', // FIXÉ
        title,
        description,
        type, // Type de terrain
        
        // Localisation
        address,
        city,
        region,
        postal_code,
        latitude,
        longitude,
        location: `${city}, ${region}, Sénégal`,
        
        // Prix & Surface
        price: parseFloat(price),
        currency,
        surface: parseFloat(surface),
        surface_unit,
        
        // Caractéristiques
        zoning,
        legal_status,
        land_registry_ref,
        title_deed_number,
        
        // Features (JSONB)
        features: {
          main: main_features,
          utilities,
          access,
          zoning,
          buildable_ratio: parseFloat(buildable_ratio),
          max_floors: parseInt(max_floors)
        },
        
        // Amenities (JSONB)
        amenities: nearby_facilities,
        
        // Images (JSONB)
        images: imageUrls,
        
        // Documents (JSONB)
        documents: documentUrls,
        
        // Financement (JSONB dans metadata)
        metadata: {
          financing: {
            methods: financing_methods,
            bank_financing: {
              available: bank_financing_available,
              min_down_payment,
              max_duration,
              partner_banks
            },
            installment: {
              available: installment_available,
              duration: installment_duration,
              monthly_payment
            },
            crypto: {
              available: crypto_available,
              accepted_currencies: accepted_cryptos,
              discount: crypto_discount
            }
          }
        },
        
        // Statuts
        status: 'pending', // En attente de vérification
        verification_status: 'pending',
        published_at: null, // Pas encore publié
        
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    // 4. Créer les entrées dans property_photos
    if (imageUrls.length > 0) {
      await supabase.from('property_photos').insert(
        imageUrls.map((url, index) => ({
          property_id: property.id,
          vendor_id: user.id,
          photo_url: url,
          is_main: index === 0,
          order_index: index
        }))
      );
    }
    
    // 5. Notification au vendeur
    toast.success('Terrain ajouté avec succès ! En attente de validation.');
    
    // 6. Reset formulaire
    resetForm();
    
  } catch (error) {
    console.error('Erreur:', error);
    toast.error('Erreur lors de l\'ajout du terrain');
  } finally {
    setIsSubmitting(false);
  }
};
```

---

## 🎨 UI/UX RECOMMENDATIONS

### Progress Bar
```jsx
<Progress value={(currentStep / 8) * 100} />
<span>{currentStep}/8 étapes - {Math.round((currentStep/8)*100)}% complété</span>
```

### Step Indicators
Chaque étape affiche :
- ✅ Check vert si complétée
- 🔵 Bleu si active
- ⚪ Gris si pas encore atteinte

### Validation Temps Réel
- Afficher les erreurs en rouge sous chaque champ
- Désactiver le bouton "Suivant" si validation échoue
- Compteur de caractères pour description

### Prévisualisation
Bouton "👁️ Prévisualiser" qui affiche le terrain comme il apparaîtra sur ParcelleDetailPage

---

## 📊 RÉCAPITULATIF FINAL

### Étape 8 : Récapitulatif avant Soumission

Afficher un résumé complet avant soumission :

```jsx
<Card>
  <CardHeader>
    <CardTitle>Récapitulatif</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Informations */}
      <Section title="Informations">
        <p><strong>Titre:</strong> {title}</p>
        <p><strong>Type:</strong> {type}</p>
      </Section>
      
      {/* Localisation */}
      <Section title="Localisation">
        <p>{address}, {city}, {region}</p>
      </Section>
      
      {/* Prix */}
      <Section title="Prix & Surface">
        <p><strong>Prix:</strong> {formatPrice(price)}</p>
        <p><strong>Surface:</strong> {surface} m²</p>
        <p><strong>Prix/m²:</strong> {formatPricePerM2(price, surface)}</p>
      </Section>
      
      {/* Photos */}
      <Section title="Photos">
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, i) => (
            <img key={i} src={img.preview} className="rounded" />
          ))}
        </div>
      </Section>
      
      {/* Documents */}
      <Section title="Documents">
        {has_title_deed && <Badge>✓ Titre foncier</Badge>}
        {has_survey && <Badge>✓ Plan de bornage</Badge>}
      </Section>
    </div>
    
    <Alert className="mt-4">
      <Info className="h-4 w-4" />
      <AlertDescription>
        Votre terrain sera vérifié par notre équipe avant publication.
        Délai moyen: 24-48h.
      </AlertDescription>
    </Alert>
  </CardContent>
</Card>
```

---

## 🔐 SÉCURITÉ & VALIDATION

### Côté Client
- Validation de chaque champ
- Taille images max 5MB
- Formats images: JPG, PNG, WEBP
- Min 3 photos, max 20 photos

### Côté Serveur (Supabase RLS)
```sql
-- Seul le propriétaire peut créer son terrain
CREATE POLICY "Users can create their own properties"
ON properties FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = owner_id AND property_type = 'terrain');

-- Seul le propriétaire peut modifier son terrain
CREATE POLICY "Users can update their own properties"
ON properties FOR UPDATE
TO authenticated
USING (auth.uid() = owner_id);
```

---

## ✅ CHECKLIST IMPLÉMENTATION

- [ ] Mettre à jour `propertyData` state avec tous les champs
- [ ] Créer les 8 étapes du formulaire
- [ ] Ajouter validation par étape
- [ ] Implémenter upload photos avec react-dropzone
- [ ] Implémenter upload documents
- [ ] Créer section récapitulatif
- [ ] Implémenter soumission vers Supabase
- [ ] Ajouter gestion d'erreurs
- [ ] Tester avec données réelles
- [ ] Vérifier que property_type = 'terrain' est bien fixé

---

## 🎯 RÉSULTAT ATTENDU

Un formulaire en **8 étapes** qui collecte **TOUTES** les informations nécessaires pour créer une parcelle identique à celles affichées dans `ParcelleDetailPage.jsx`.

**Points clés:**
- ✅ Type fixé sur "terrain" uniquement
- ✅ Structure identique à ParcelleDetailPage
- ✅ Validation complète
- ✅ Upload photos + documents
- ✅ Options de financement
- ✅ Calculs automatiques (prix/m², mensualités)
- ✅ Prévisualisation avant soumission

---

**Date:** 5 Octobre 2025  
**Status:** 📋 Spécification complète  
**Next:** Implémenter le formulaire complet
