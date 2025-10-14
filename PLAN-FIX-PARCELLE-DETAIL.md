# PLAN DE CORRECTION - ParcelleDetailPage.jsx

## Problème
La page `/parcelle/:id` affiche des données mockées (ligne 40: `const mockParcelleData`) au lieu de charger depuis Supabase.

## Solution
Remplacer le mock data par une query Supabase, comme on l'a fait pour ParcellesVendeursPage.

## Étapes

### 1. Remplacer useEffect avec chargement Supabase
```javascript
useEffect(() => {
  const loadProperty = async () => {
    try {
      setLoading(true);
      
      // Charger la property depuis Supabase
      const { data: property, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:owner_id (
            id,
            full_name,
            email,
            phone,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!property) {
        navigate('/404');
        return;
      }
      
      // Mapper les données
      const mappedProperty = {
        id: property.id,
        title: property.title,
        description: property.description,
        price: property.price,
        surface: property.surface,
        location: property.location,
        city: property.city,
        region: property.region,
        images: JSON.parse(property.images || '[]'),
        features: JSON.parse(property.features || '{}'),
        amenities: JSON.parse(property.amenities || '[]'),
        seller: {
          id: property.profiles?.id,
          name: property.profiles?.full_name,
          email: property.profiles?.email,
          phone: property.profiles?.phone,
          verified: true
        },
        coordinates: {
          lat: property.latitude,
          lng: property.longitude
        }
      };
      
      setParcelle(mappedProperty);
      setLoading(false);
      
    } catch (error) {
      console.error('Erreur chargement:', error);
      setLoading(false);
    }
  };
  
  loadProperty();
}, [id]);
```

### 2. Supprimer le mock data (lignes 40-400+)

### 3. Ajouter import Supabase
```javascript
import { supabase } from '@/lib/supabase';
```

## Estimation
- Lignes à modifier: ~450 lignes
- Temps: 10-15 minutes
- Impact: Affichage des vraies données de votre parcelle

## Après correction
✅ `/parcelle/9a2dce41-8e2c-4888-b3d8-0dce41339b5a` affichera:
- Titre: "Terrain Résidentiel"
- Prix: 10,000,000 XOF
- Surface: 100 m²
- 3 vraies images depuis Supabase Storage
- Vendeur: Heritage Fall
