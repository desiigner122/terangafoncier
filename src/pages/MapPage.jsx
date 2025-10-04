import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  ExternalLink, 
  Layers, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Home, 
  DollarSign, 
  MapPin,
  Heart
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card'; // Import Card and CardContent
import { useSecureGeolocation, getBrowserCapabilities } from '@/hooks/useSecureGeolocation';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createIcon = (color) => {
  return new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const greenIcon = createIcon('green'); // Disponible
const yellowIcon = createIcon('yellow'); // Réservée
const redIcon = createIcon('red'); // Vendue
const greyIcon = createIcon('grey'); // Autre/Non spécifié
const blueIcon = createIcon('blue'); // Points d'intérêt

// Custom Zoom Control Component
const CustomZoomControl = () => {
  const map = useMap();
  return (
    <div className="leaflet-control leaflet-bar absolute bottom-20 right-4 z-[1000] flex flex-col gap-1.5">
      <Button size="icon" variant="secondary" onClick={() => map.zoomIn()} title="Zoomer" className="shadow-lg border">
        <ZoomIn className="h-5 w-5" />
      </Button>
      <Button size="icon" variant="secondary" onClick={() => map.zoomOut()} title="Dézoomer" className="shadow-lg border">
        <ZoomOut className="h-5 w-5" />
      </Button>
    </div>
  );
};

// Legend Component
const MapLegend = () => (
  <Card className="leaflet-control absolute bottom-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm p-3 rounded-lg shadow-xl border">
    <CardContent className="p-0">
      <h4 className="font-semibold text-sm mb-2 text-foreground">Légende des Parcelles</h4>
      <ul className="space-y-1.5 text-xs">
        <li className="flex items-center"><MapPin className="h-5 w-auto mr-2 text-green-500"/> Disponible</li>
        <li className="flex items-center"><MapPin className="h-5 w-auto mr-2 text-yellow-500"/> Réservée</li>
        <li className="flex items-center"><MapPin className="h-5 w-auto mr-2 text-red-500"/> Vendue</li>
        <li className="flex items-center"><MapPin className="h-5 w-auto mr-2 text-gray-500"/> Statut Inconnu</li>
      </ul>
    </CardContent>
  </Card>
);

import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/customSupabaseClient';

const MapPage = () => {
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const defaultPosition = [14.7167, -17.4677]; // Dakar center
  const defaultZoom = 11;
  const mapRef = useRef();
  const { user } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const { position: userPosition, error: geoError, loading: geoLoading, getCurrentPosition } = useSecureGeolocation();
  const browserCapabilities = getBrowserCapabilities();

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      setFetchError(null);
      try {
        const { data, error } = await supabase.from('parcels').select('*');
        if (error) throw error;
        setParcels(data);
      } catch (err) {
        setFetchError(err.message);
        setParcels([]);
        console.error('Erreur lors du chargement des parcelles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchParcels();
  }, []);

  // Charger les favoris utilisateur
  useEffect(() => {
    const loadFavorites = async () => {
      if (!user) { setFavoriteIds([]); return; }
      const { data: profile } = await supabase.from('users').select('favorites').eq('id', user.id).single();
      setFavoriteIds(Array.isArray(profile?.favorites) ? profile.favorites : []);
    };
    loadFavorites();
  }, [user]);

  // Fonction sécurisée pour obtenir la position utilisateur
  const handleGetUserLocation = () => {
    if (!browserCapabilities.geolocation) {
      alert('Votre navigateur ne supporte pas la géolocalisation.');
      return;
    }
    
    if (!browserCapabilities.isSecureContext) {
      alert('La géolocalisation nécessite une connexion sécurisée (HTTPS).');
      return;
    }
    
    getCurrentPosition();
  };

  const getIconForParcel = (status) => {
    switch (status) {
      case 'Disponible': return greenIcon;
      case 'Réservée': return yellowIcon;
      case 'Vendue': return redIcon;
      default: return greyIcon;
    }
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) return 'Prix non spécifié';
    return new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF', maximumFractionDigits: 0 }).format(price);
  }

  const toggleFavorite = async (parcelId) => {
    if (!user) {
      window.safeGlobalToast?.({ title: 'Connexion requise', description: 'Connectez-vous pour ajouter des favoris.' });
      return;
    }
    const isFav = favoriteIds.includes(parcelId);
    const next = isFav ? favoriteIds.filter(id => id !== parcelId) : [...favoriteIds, parcelId];
    setFavoriteIds(next);
    const { error } = await supabase.from('users').update({ favorites: next }).eq('id', user.id);
    if (error) {
      setFavoriteIds(favoriteIds);
      window.safeGlobalToast?.({ title: 'Erreur', description: "Impossible de mettre à jour vos favoris.", variant: 'destructive' });
    } else {
      window.safeGlobalToast?.({ title: isFav ? 'Retiré des favoris' : 'Ajouté aux favoris' });
    }
  };

      const handleSearch = (event) => {
          event.preventDefault();
          const query = event.target.elements.locationSearch.value;
          if (!query) return;
          console.log("Recherche pour :", query);
          alert(`Recherche pour "${query}" - L'intégration de l'API de Géocodage est nécessaire pour cette fonctionnalité.`);
      }

      // Afficher les erreurs de géolocalisation de manière non-bloquante
      useEffect(() => {
        if (geoError) {
          console.warn('Erreur de géolocalisation:', geoError);
        }
        if (userPosition) {
          console.log('Position utilisateur obtenue:', userPosition);
        }
      }, [geoError, userPosition]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="relative h-[calc(100vh-64px)] w-full"
    >
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] w-full max-w-lg px-4">
        <form onSubmit={handleSearch} className="relative">
          <Input
            type="search"
            name="locationSearch"
            placeholder="Rechercher une adresse, ville, ou référence de parcelle..."
            className="w-full h-12 pl-12 pr-4 rounded-full bg-background/95 shadow-xl border-border focus:ring-2 focus:ring-primary text-sm"
          />
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-full">Chargement des parcelles...</div>
      ) : fetchError ? (
        <div className="text-red-600 py-4">Erreur : {fetchError}</div>
      ) : (
        <MapContainer
          center={defaultPosition}
          zoom={defaultZoom}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          ref={mapRef}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors & Teranga Foncier'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          {parcels
            .filter(parcel => parcel.coordinates)
            .map((parcel) => (
              <Marker key={parcel.id} position={[parcel.coordinates.lat, parcel.coordinates.lng]} icon={getIconForParcel(parcel.status)}>
                <Popup minWidth={220}>
                  <div className="space-y-1.5">
                    <h3 className="font-bold text-base mb-1 text-primary">{parcel.location_name}</h3>
                    <p className="text-xs text-muted-foreground -mt-1">Réf: {parcel.reference}</p>
                    <div className="flex items-center text-sm">
                      <Home className="h-4 w-4 mr-1.5 text-muted-foreground"/>
                      <span>{parcel.area_sqm ? `${parcel.area_sqm} m²` : 'Surface N/A'}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <DollarSign className="h-4 w-4 mr-1.5 text-muted-foreground"/>
                      <span className="font-semibold">{formatPrice(parcel.price)}</span>
                    </div>
                    <p className={`text-xs font-medium capitalize ${
                      parcel.status === 'Disponible' ? 'text-green-600' :
                      parcel.status === 'Réservée' ? 'text-yellow-600' :
                      parcel.status === 'Vendue' ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      Statut : {parcel.status}
                    </p>
                    <div className="flex items-center gap-2 mt-2.5">
                      <Button size="icon" variant="ghost" onClick={() => toggleFavorite(parcel.id)} title={favoriteIds.includes(parcel.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}>
                        <Heart className={`h-4 w-4 ${favoriteIds.includes(parcel.id) ? 'text-red-500 fill-current' : ''}`} />
                      </Button>
                      <Button asChild size="sm" className="flex-1">
                        <Link to={`/parcelle/${parcel.id}`}>
                          Voir les détails <ExternalLink className="ml-2 h-3.5 w-3.5"/>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          <CustomZoomControl />
          <MapLegend />
        </MapContainer>
      )}
    </motion.div>
  );
};

export default MapPage;
