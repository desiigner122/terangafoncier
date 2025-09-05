﻿import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Map, 
  Search, 
  Layers, 
  Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { LoadingSpinner } from '@/components/ui/spinner';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { supabase } from '@/lib/customSupabaseClient';

// Fix for Leaflet's default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sample GeoJSON data for zoning simulation
const zoningData = {
  type: "FeatureCollection",
  features: [
    { type: "Feature", properties: { zone: 'Résidentiel' }, geometry: { type: "Polygon", coordinates: [[[-17.03, 14.44], [-17.02, 14.44], [-17.02, 14.45], [-17.03, 14.45], [-17.03, 14.44]]] } },
    { type: "Feature", properties: { zone: 'Commercial' }, geometry: { type: "Polygon", coordinates: [[[-17.04, 14.45], [-17.03, 14.45], [-17.03, 14.46], [-17.04, 14.46], [-17.04, 14.45]]] } },
    { type: "Feature", properties: { zone: 'Espace Vert' }, geometry: { type: "Polygon", coordinates: [[[-17.035, 14.445], [-17.025, 14.445], [-17.025, 14.455], [-17.035, 14.455], [-17.035, 14.445]]] } }
  ]
};

const CadastrePage = () => {
  // toast remplacÃ© par window.safeGlobalToast
  const [loading, setLoading] = useState(true);
  const [parcels, setParcels] = useState([]);
  const [mapCenter, setMapCenter] = useState([14.7167, -17.4677]); // Dakar
  const [showZoning, setShowZoning] = useState(false);

  useEffect(() => {
    const fetchParcels = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('parcels')
        .select('*')
        .filter('zone', 'eq', 'Saly'); // Assuming this page is for Saly
      
      if (error) {
        console.error("Error fetching parcels:", error);
        window.safeGlobalToast({ title: "Erreur", description: "Impossible de charger les parcelles.", variant: "destructive" });
      } else {
        setParcels(data);
        if (data.length > 0 && data[0].coordinates) {
          setMapCenter([data[0].coordinates.lat, data[0].coordinates.lng]);
        }
      }
      setLoading(false);
    };
    fetchParcels();
  }, [toast]);

  const handleAction = (message) => {
    window.safeGlobalToast({ title: "Action Simulée", description: message });
  };
  
  const getZoneStyle = (feature) => {
    switch (feature.properties.zone) {
      case 'Résidentiel': return { color: '#3b82f6', weight: 2, fillOpacity: 0.3 };
      case 'Commercial': return { color: '#f97316', weight: 2, fillOpacity: 0.3 };
      case 'Espace Vert': return { color: '#22c55e', weight: 2, fillOpacity: 0.3 };
      default: return { color: '#6b7280', weight: 2, fillOpacity: 0.3 };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-4 md:p-6 lg:p-8"
    >
      <h1 className="text-3xl font-bold flex items-center"><Map className="mr-3 h-8 w-8"/>Cadastre Numérique (Commune de Saly)</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Carte Interactive du Cadastre</CardTitle>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 pt-2">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Rechercher une parcelle par référence..." className="pl-8" />
            </div>
            <Button variant="outline" onClick={() => setShowZoning(!showZoning)}><Layers className="mr-2 h-4 w-4" /> {showZoning ? "Cacher" : "Afficher"} Zonage</Button>
            <Button variant="outline" onClick={() => handleAction("Export de la vue actuelle de la carte.")}><Download className="mr-2 h-4 w-4" /> Exporter Vue</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full h-[550px] bg-muted rounded-lg overflow-hidden border">
            <MapContainer center={mapCenter} zoom={14} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {parcels
                .filter(p => p.coordinates)
                .map(parcel => (
                <Marker key={parcel.id} position={[parcel.coordinates.lat, parcel.coordinates.lng]}>
                  <Popup>
                    <b>{parcel.name}</b><br/>
                    Référence: {parcel.reference}<br/>
                    Statut: {parcel.status}
                  </Popup>
                </Marker>
              ))}
              {showZoning && <GeoJSON data={zoningData} style={getZoneStyle} onEachFeature={(feature, layer) => {
                layer.bindPopup(`Zone: ${feature.properties.zone}`);
              }} />}
            </MapContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CadastrePage;
