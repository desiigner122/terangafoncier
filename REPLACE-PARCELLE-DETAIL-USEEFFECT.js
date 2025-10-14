// REMPLACER le useEffect dans ParcelleDetailPage.jsx (lignes ~35-450)
// avec ce code qui charge depuis Supabase

import { supabase } from '@/lib/supabase'; // À ajouter en haut du fichier

useEffect(() => {
  const loadProperty = async () => {
    try {
      setLoading(true);

      // Charger la property avec le profil du vendeur
      const { data: property, error } = await supabase
        .from('properties')
        .select(`
          *,
          profiles:owner_id (
            id,
            full_name,
            email,
            phone,
            avatar_url,
            role
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Erreur chargement:', error);
        navigate('/404');
        return;
      }

      if (!property) {
        navigate('/404');
        return;
      }

      // Parser les JSON fields
      const images = Array.isArray(property.images) ? property.images :
                    (typeof property.images === 'string' ? JSON.parse(property.images || '[]') : []);
      
      const features = property.features && typeof property.features === 'object' 
        ? property.features 
        : (typeof property.features === 'string' ? JSON.parse(property.features || '{}') : {});
      
      const amenities = Array.isArray(property.amenities) ? property.amenities :
                       (typeof property.amenities === 'string' ? JSON.parse(property.amenities || '[]') : []);
      
      const metadata = property.metadata && typeof property.metadata === 'object'
        ? property.metadata
        : (typeof property.metadata === 'string' ? JSON.parse(property.metadata || '{}') : {});

      // Mapper les données vers le format attendu par le composant
      const mappedData = {
        id: property.id,
        title: property.title || 'Terrain sans titre',
        location: property.location || `${property.city}, ${property.region}`,
        region: property.region,
        city: property.city,
        price: property.price?.toString() || '0',
        surface: property.surface?.toString() || '0',
        type: property.property_type || 'Terrain',
        
        seller: {
          id: property.profiles?.id || property.owner_id,
          name: property.profiles?.full_name || 'Vendeur',
          type: property.profiles?.role === 'vendeur' ? 'Particulier' : 'Professionnel',
          phone: property.profiles?.phone || 'Non renseigné',
          email: property.profiles?.email || '',
          verified: property.verification_status === 'verified',
          rating: 4.5, // À calculer depuis reviews plus tard
          properties_sold: 0 // À calculer plus tard
        },

        address: {
          full: property.address || property.location,
          coordinates: {
            latitude: property.latitude || 14.7167,
            longitude: property.longitude || -17.4677
          },
          nearby_landmarks: property.nearby_landmarks || []
        },

        coordinates: {
          lat: property.latitude || 14.7167,
          lng: property.longitude || -17.4677
        },

        features: {
          main: features.main || [],
          utilities: features.utilities || [],
          zoning: property.zoning || features.zoning,
          buildable_ratio: property.buildable_ratio || features.buildable_ratio,
          max_floors: property.max_floors || features.max_floors
        },

        amenities: amenities,

        documents: {
          title_deed: !!property.title_deed_number,
          survey: metadata.documents?.has_survey || false,
          building_permit: metadata.documents?.has_building_permit || false,
          urban_certificate: metadata.documents?.has_urban_certificate || false
        },

        financing: {
          methods: metadata.financing?.methods || ['direct'],
          bank_financing: metadata.financing?.bank_financing || null,
          installment: metadata.financing?.installment || null,
          crypto: metadata.financing?.crypto || null
        },

        blockchain: {
          verified: property.blockchain_verified || false,
          hash: property.blockchain_hash,
          network: property.blockchain_network,
          nft_token_id: property.nft_token_id
        },

        stats: {
          views: property.views_count || 0,
          favorites: property.favorites_count || 0,
          contact_requests: property.contact_requests_count || 0
        },

        images: images,
        main_image: images[0] || null,
        description: property.description || 'Aucune description disponible',
        status: property.status,
        verification_status: property.verification_status,
        legal_status: property.legal_status,
        title_deed_number: property.title_deed_number,
        land_registry_ref: property.land_registry_ref,
        created_at: property.created_at,
        updated_at: property.updated_at
      };

      setParcelle(mappedData);
      setLoading(false);

    } catch (error) {
      console.error('Erreur chargement parcelle:', error);
      setLoading(false);
      // Ne pas naviguer vers 404 en cas d'erreur réseau
    }
  };

  if (id) {
    loadProperty();
  }
}, [id, navigate]);
