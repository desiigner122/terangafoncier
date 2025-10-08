/**
 * COMPOSANTS DES ÉTAPES DU FORMULAIRE D'AJOUT DE PROPRIÉTÉ
 */

import React from 'react';
import { 
  Home, MapPin, DollarSign, FileText, Shield, Image as ImageIcon,
  Sparkles, Brain, TrendingUp, Zap, Globe, Lock, Eye, Calendar,
  User, Phone, Mail, Building, TreesIcon as Tree, Waves, Mountain,
  Navigation, School, ShoppingBag, Building2 as Hospital, Bus, Wifi, Power, Droplets,
  Wind, Upload, X, Plus, Minus, CheckCircle, AlertCircle, Loader2
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

// ============================================================================
// ÉTAPE 1: INFORMATIONS DE BASE
// ============================================================================

export const Step1BasicInfo = ({ formData, setFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-6 w-6 text-blue-600" />
          Informations de Base
        </CardTitle>
        <CardDescription>
          Commencez par les informations essentielles de votre propriété
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Type de propriété */}
        <div>
          <Label htmlFor="propertyType">Type de Propriété *</Label>
          <Select
            value={formData.propertyType}
            onValueChange={(value) => setFormData(prev => ({ ...prev, propertyType: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="terrain">Terrain Nu</SelectItem>
              <SelectItem value="terrain_viabilise">Terrain Viabilisé</SelectItem>
              <SelectItem value="terrain_agricole">Terrain Agricole</SelectItem>
              <SelectItem value="terrain_commercial">Terrain Commercial</SelectItem>
              <SelectItem value="terrain_industriel">Terrain Industriel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Titre */}
        <div>
          <Label htmlFor="title">Titre de l'Annonce *</Label>
          <Input
            id="title"
            placeholder="Ex: Beau terrain de 500m² à Almadies"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="text-lg"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.title.length}/100 caractères
          </p>
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description Détaillée *</Label>
          <Textarea
            id="description"
            placeholder="Décrivez votre propriété en détail: emplacement, avantages, environnement..."
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={6}
            className="resize-none"
          />
          <p className="text-sm text-gray-500 mt-1">
            {formData.description.length}/1000 caractères
          </p>
        </div>

        {/* Statut */}
        <div>
          <Label htmlFor="status">Statut de la Propriété</Label>
          <Select
            value={formData.status}
            onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="disponible">Disponible</SelectItem>
              <SelectItem value="reserve">Réservé</SelectItem>
              <SelectItem value="en_negociation">En Négociation</SelectItem>
              <SelectItem value="vendu">Vendu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// ÉTAPE 2: LOCALISATION
// ============================================================================

export const Step2Location = ({ formData, setFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          Localisation
        </CardTitle>
        <CardDescription>
          Indiquez l'emplacement précis de votre propriété
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Région */}
          <div>
            <Label htmlFor="region">Région *</Label>
            <Select
              value={formData.region}
              onValueChange={(value) => setFormData(prev => ({ ...prev, region: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Dakar">Dakar</SelectItem>
                <SelectItem value="Thiès">Thiès</SelectItem>
                <SelectItem value="Diourbel">Diourbel</SelectItem>
                <SelectItem value="Fatick">Fatick</SelectItem>
                <SelectItem value="Kaolack">Kaolack</SelectItem>
                <SelectItem value="Kolda">Kolda</SelectItem>
                <SelectItem value="Louga">Louga</SelectItem>
                <SelectItem value="Matam">Matam</SelectItem>
                <SelectItem value="Saint-Louis">Saint-Louis</SelectItem>
                <SelectItem value="Sédhiou">Sédhiou</SelectItem>
                <SelectItem value="Tambacounda">Tambacounda</SelectItem>
                <SelectItem value="Kaffrine">Kaffrine</SelectItem>
                <SelectItem value="Kédougou">Kédougou</SelectItem>
                <SelectItem value="Ziguinchor">Ziguinchor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ville */}
          <div>
            <Label htmlFor="city">Ville/Commune *</Label>
            <Input
              id="city"
              placeholder="Ex: Dakar, Rufisque..."
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
            />
          </div>
        </div>

        {/* Quartier */}
        <div>
          <Label htmlFor="neighborhood">Quartier/Zone *</Label>
          <Input
            id="neighborhood"
            placeholder="Ex: Almadies, Fann, Mermoz..."
            value={formData.neighborhood}
            onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
          />
        </div>

        {/* Adresse complète */}
        <div>
          <Label htmlFor="address">Adresse Complète</Label>
          <Textarea
            id="address"
            placeholder="Adresse précise avec points de repère"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
            rows={3}
          />
        </div>

        {/* Coordonnées GPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude (GPS)</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              placeholder="14.693425"
              value={formData.latitude || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, latitude: parseFloat(e.target.value) }))}
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude (GPS)</Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              placeholder="-17.447938"
              value={formData.longitude || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, longitude: parseFloat(e.target.value) }))}
            />
          </div>
        </div>

        <Alert>
          <MapPin className="h-4 w-4" />
          <AlertDescription>
            Les coordonnées GPS permettent un positionnement précis sur la carte. Vous pouvez les obtenir via Google Maps.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// ÉTAPE 3: DIMENSIONS ET PRIX
// ============================================================================

export const Step3DimensionsPrice = ({ formData, setFormData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-6 w-6 text-blue-600" />
          Dimensions et Prix
        </CardTitle>
        <CardDescription>
          Spécifiez les dimensions et le prix de votre propriété
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Superficie */}
        <div>
          <Label htmlFor="surface">Superficie Totale (m²) *</Label>
          <Input
            id="surface"
            type="number"
            placeholder="500"
            value={formData.surface}
            onChange={(e) => setFormData(prev => ({ ...prev, surface: e.target.value }))}
            className="text-xl font-semibold"
          />
        </div>

        {/* Dimensions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="length">Longueur (m)</Label>
            <Input
              id="length"
              type="number"
              placeholder="25"
              value={formData.length}
              onChange={(e) => setFormData(prev => ({ ...prev, length: e.target.value }))}
            />
          </div>
          <div>
            <Label htmlFor="width">Largeur (m)</Label>
            <Input
              id="width"
              type="number"
              placeholder="20"
              value={formData.width}
              onChange={(e) => setFormData(prev => ({ ...prev, width: e.target.value }))}
            />
          </div>
        </div>

        {/* Prix */}
        <div>
          <Label htmlFor="price">Prix Total *</Label>
          <div className="relative">
            <Input
              id="price"
              type="number"
              placeholder="50000000"
              value={formData.price}
              onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
              className="text-2xl font-bold pr-20"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
              {formData.currency}
            </span>
          </div>
          {formData.price && (
            <p className="text-sm text-gray-600 mt-1">
              {parseInt(formData.price).toLocaleString('fr-FR')} FCFA
            </p>
          )}
        </div>

        {/* Prix au m² (calculé automatiquement) */}
        {formData.pricePerSqm && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <Label>Prix au m² (calculé automatiquement)</Label>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {parseInt(formData.pricePerSqm).toLocaleString('fr-FR')} FCFA/m²
            </p>
          </div>
        )}

        {/* Prix négociable */}
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label>Prix Négociable</Label>
            <p className="text-sm text-gray-600">Le prix peut être discuté avec les acheteurs</p>
          </div>
          <Switch
            checked={formData.priceNegotiable}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, priceNegotiable: checked }))}
          />
        </div>
      </CardContent>
    </Card>
  );
};

// ============================================================================
// ÉTAPE 4: CARACTÉRISTIQUES DU TERRAIN
// ============================================================================

export const Step4Features = ({ formData, setFormData }) => {
  const updateTerrain = (key, value) => {
    setFormData(prev => ({
      ...prev,
      terrain: { ...prev.terrain, [key]: value }
    }));
  };

  const updateUtility = (key, value) => {
    setFormData(prev => ({
      ...prev,
      utilities: { ...prev.utilities, [key]: value }
    }));
  };

  const updateProximity = (key, value) => {
    setFormData(prev => ({
      ...prev,
      proximity: { ...prev.proximity, [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Caractéristiques du Terrain */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mountain className="h-6 w-6 text-blue-600" />
            Caractéristiques du Terrain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topographie */}
            <div>
              <Label>Topographie</Label>
              <Select
                value={formData.terrain.topography}
                onValueChange={(value) => updateTerrain('topography', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plat">Plat</SelectItem>
                  <SelectItem value="pente_legere">Pente Légère</SelectItem>
                  <SelectItem value="pente_forte">Pente Forte</SelectItem>
                  <SelectItem value="vallonne">Vallonné</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type de sol */}
            <div>
              <Label>Type de Sol</Label>
              <Select
                value={formData.terrain.soilType}
                onValueChange={(value) => updateTerrain('soilType', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="argilo-sableux">Argilo-sableux</SelectItem>
                  <SelectItem value="sableux">Sableux</SelectItem>
                  <SelectItem value="argileux">Argileux</SelectItem>
                  <SelectItem value="rocheux">Rocheux</SelectItem>
                  <SelectItem value="laterite">Latérite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Accès */}
            <div>
              <Label>Type d'Accès</Label>
              <Select
                value={formData.terrain.access}
                onValueChange={(value) => updateTerrain('access', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bitume">Route Bitumée</SelectItem>
                  <SelectItem value="pave">Route Pavée</SelectItem>
                  <SelectItem value="laterite">Piste Latérite</SelectItem>
                  <SelectItem value="sable">Piste Sablonneuse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Nombre de coins */}
            <div>
              <Label>Nombre de Coins de Rue</Label>
              <Input
                type="number"
                min="1"
                max="4"
                value={formData.terrain.corners}
                onChange={(e) => updateTerrain('corners', parseInt(e.target.value))}
              />
            </div>
          </div>

          {/* Options booléennes */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label>Clôturé</Label>
              <Switch
                checked={formData.terrain.fenced}
                onCheckedChange={(checked) => updateTerrain('fenced', checked)}
              />
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <Label>Risque d'Inondation</Label>
              <Switch
                checked={formData.terrain.flooding}
                onCheckedChange={(checked) => updateTerrain('flooding', checked)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Viabilisation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Power className="h-6 w-6 text-blue-600" />
            Viabilisation et Services
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { key: 'water', label: 'Eau', icon: Droplets },
              { key: 'electricity', label: 'Électricité', icon: Power },
              { key: 'sewage', label: 'Assainissement', icon: Waves },
              { key: 'internet', label: 'Internet', icon: Wifi },
              { key: 'phone', label: 'Téléphone', icon: Phone },
              { key: 'gas', label: 'Gaz', icon: Wind }
            ].map(({ key, label, icon: Icon }) => (
              <div key={key} className={`p-3 border rounded-lg transition-all ${
                formData.utilities[key] ? 'bg-green-50 border-green-500' : 'bg-gray-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`h-5 w-5 ${formData.utilities[key] ? 'text-green-600' : 'text-gray-400'}`} />
                  <Switch
                    checked={formData.utilities[key]}
                    onCheckedChange={(checked) => updateUtility(key, checked)}
                  />
                </div>
                <Label className="text-sm">{label}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Proximités */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-600" />
            Proximités (Distance en km)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'mainRoad', label: 'Route Principale', icon: Navigation },
              { key: 'publicTransport', label: 'Transport Public', icon: Bus },
              { key: 'school', label: 'École', icon: School },
              { key: 'hospital', label: 'Hôpital', icon: Hospital },
              { key: 'market', label: 'Marché', icon: ShoppingBag },
              { key: 'mosque', label: 'Mosquée', icon: Building },
              { key: 'beach', label: 'Plage', icon: Waves }
            ].map(({ key, label, icon: Icon }) => (
              <div key={key}>
                <Label className="flex items-center gap-2">
                  <Icon className="h-4 w-4" />
                  {label}
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.proximity[key]}
                  onChange={(e) => updateProximity(key, e.target.value)}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default { Step1BasicInfo, Step2Location, Step3DimensionsPrice, Step4Features };