import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import {
  ArrowLeft,
  Save,
  Loader2,
  MapPin,
  DollarSign,
  FileText,
  AlertCircle,
  Check,
  Upload,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

/**
 * Page d'édition complète pour les parcelles/propriétés
 * Permet à un vendeur d'éditer ses propriétés
 */
const ParcelleEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // État du formulaire
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [property, setProperty] = useState(null);
  const [errors, setErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  // Données du formulaire
  const [formData, setFormData] = useState({
    // Informations de base
    title: '',
    description: '',
    type: 'terrain', // terrain, maison, appartement, etc.
    status: 'active', // active, inactive, sold
    
    // Localisation
    address: '',
    city: '',
    region: '',
    lat: '',
    lng: '',
    
    // Caractéristiques
    area: '', // en m²
    bedrooms: '',
    bathrooms: '',
    features: '',
    
    // Tarification
    price: '',
    currency: 'XOF',
    negotiable: false,
    
    // Documents
    reference: '',
    documentType: '', // titre_foncier, certificat_possession, etc.
    
    // Médias
    images: [],
    documents: [],
    
    // Métadonnées
    published: true
  });

  // Charger la propriété
  useEffect(() => {
    if (user?.id) {
      loadProperty();
    }
  }, [user?.id, id]);

  const loadProperty = async () => {
    try {
      setLoading(true);

      // Charger la propriété
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast.error('Propriété non trouvée');
        navigate('/dashboard/vendeur');
        return;
      }

      // Vérifier que l'utilisateur est le propriétaire
      if (data.owner_id !== user.id && !user.isAdmin) {
        toast.error('Vous ne pouvez pas éditer cette propriété');
        navigate('/dashboard/vendeur');
        return;
      }

      setProperty(data);
      setFormData({
        title: data.title || '',
        description: data.description || '',
        type: data.property_type || 'terrain',
        status: data.status || 'active',
        address: data.address || '',
        city: data.city || '',
        region: data.region || '',
        lat: data.latitude?.toString() || '',
        lng: data.longitude?.toString() || '',
        area: data.area?.toString() || '',
        bedrooms: data.bedrooms?.toString() || '',
        bathrooms: data.bathrooms?.toString() || '',
        features: Array.isArray(data.features) ? data.features.join(', ') : '',
        price: data.price?.toString() || '',
        currency: data.currency || 'XOF',
        negotiable: data.negotiable || false,
        reference: data.reference || '',
        documentType: data.document_type || '',
        images: data.images || [],
        documents: data.documents || [],
        published: data.published !== false
      });
    } catch (error) {
      console.error('Erreur chargement propriété:', error);
      toast.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = 'Le titre est requis';
    if (!formData.address.trim()) newErrors.address = 'L\'adresse est requise';
    if (!formData.price) newErrors.price = 'Le prix est requis';
    if (!formData.type) newErrors.type = 'Le type est requis';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setSaving(true);
    try {
      const updateData = {
        title: formData.title,
        description: formData.description,
        property_type: formData.type,
        status: formData.status,
        address: formData.address,
        city: formData.city,
        region: formData.region,
        latitude: formData.lat ? parseFloat(formData.lat) : null,
        longitude: formData.lng ? parseFloat(formData.lng) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        features: formData.features.split(',').map(f => f.trim()).filter(f => f),
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency,
        negotiable: formData.negotiable,
        reference: formData.reference,
        document_type: formData.documentType,
        images: formData.images,
        documents: formData.documents,
        published: formData.published,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('properties')
        .update(updateData)
        .eq('id', id)
        .eq('owner_id', user.id); // Sécurité: vérifier le propriétaire

      if (error) throw error;

      toast.success('Propriété mise à jour avec succès');
      navigate(`/parcelles/${id}`);
    } catch (error) {
      console.error('Erreur sauvegarde:', error);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/parcelles/${id}`)}
              className="text-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold">Éditer la propriété</h1>
              <p className="text-sm text-gray-600">{formData.title || 'Sans titre'}</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer
          </Button>
        </div>
      </div>

      {/* Contenu */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Alertes */}
        {property?.status === 'sold' && (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertCircle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Cette propriété est marquée comme vendue. Vous pouvez toujours l'éditer.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Infos de base</TabsTrigger>
            <TabsTrigger value="location">Localisation</TabsTrigger>
            <TabsTrigger value="details">Détails</TabsTrigger>
            <TabsTrigger value="media">Médias</TabsTrigger>
          </TabsList>

          {/* Onglet: Infos de base */}
          <TabsContent value="basic" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informations de base</CardTitle>
                <CardDescription>Titre et description de la propriété</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Ex: Terrain 500m² à Dakar"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="type">Type de propriété *</Label>
                  <Select value={formData.type} onValueChange={(value) => handleChange('type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="terrain">Terrain</SelectItem>
                      <SelectItem value="maison">Maison</SelectItem>
                      <SelectItem value="appartement">Appartement</SelectItem>
                      <SelectItem value="bureau">Bureau</SelectItem>
                      <SelectItem value="local">Local commercial</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Décrivez la propriété en détail..."
                    rows={6}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.description.length}/500</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="negotiable"
                      checked={formData.negotiable}
                      onChange={(e) => handleChange('negotiable', e.target.checked)}
                    />
                    <Label htmlFor="negotiable" className="mb-0">Prix négociable</Label>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="published"
                      checked={formData.published}
                      onChange={(e) => handleChange('published', e.target.checked)}
                    />
                    <Label htmlFor="published" className="mb-0">Publiée</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet: Localisation */}
          <TabsContent value="location" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Localisation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="address">Adresse *</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    placeholder="Adresse complète"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      placeholder="Ex: Dakar"
                    />
                  </div>
                  <div>
                    <Label htmlFor="region">Région</Label>
                    <Input
                      id="region"
                      value={formData.region}
                      onChange={(e) => handleChange('region', e.target.value)}
                      placeholder="Ex: Dakar"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lat">Latitude</Label>
                    <Input
                      id="lat"
                      type="number"
                      step="0.000001"
                      value={formData.lat}
                      onChange={(e) => handleChange('lat', e.target.value)}
                      placeholder="14.6956"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lng">Longitude</Label>
                    <Input
                      id="lng"
                      type="number"
                      step="0.000001"
                      value={formData.lng}
                      onChange={(e) => handleChange('lng', e.target.value)}
                      placeholder="-17.4572"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet: Détails */}
          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Caractéristiques et tarification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="area">Superficie (m²)</Label>
                    <Input
                      id="area"
                      type="number"
                      value={formData.area}
                      onChange={(e) => handleChange('area', e.target.value)}
                      placeholder="500"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Prix *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleChange('price', e.target.value)}
                        placeholder="0"
                      />
                      <Select value={formData.currency} onValueChange={(value) => handleChange('currency', value)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XOF">XOF</SelectItem>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Chambres</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => handleChange('bedrooms', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bathrooms">Salles de bain</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => handleChange('bathrooms', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="features">Caractéristiques (séparées par des virgules)</Label>
                  <Textarea
                    id="features"
                    value={formData.features}
                    onChange={(e) => handleChange('features', e.target.value)}
                    placeholder="Ex: Électricité, Eau courante, Clôture"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="reference">Référence du bien</Label>
                  <Input
                    id="reference"
                    value={formData.reference}
                    onChange={(e) => handleChange('reference', e.target.value)}
                    placeholder="REF-2024-001"
                  />
                </div>

                <div>
                  <Label htmlFor="documentType">Type de document</Label>
                  <Select value={formData.documentType} onValueChange={(value) => handleChange('documentType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="titre_foncier">Titre foncier</SelectItem>
                      <SelectItem value="certificat_possession">Certificat de possession</SelectItem>
                      <SelectItem value="lettre_attribution">Lettre d'attribution</SelectItem>
                      <SelectItem value="autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet: Médias */}
          <TabsContent value="media" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Images et documents</CardTitle>
                <CardDescription>Gérez les images et documents de la propriété</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border-2 border-dashed rounded-lg p-8 text-center bg-gray-50">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-600">Glissez-déposez des images ou cliquez pour parcourir</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG jusqu'à 10MB</p>
                </div>

                {formData.images.length > 0 && (
                  <div>
                    <p className="font-semibold mb-2">Images ({formData.images.length})</p>
                    <div className="grid grid-cols-4 gap-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Image ${idx}`} className="w-full h-24 object-cover rounded" />
                          <button className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded transition">
                            <Trash2 className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Boutons d'action */}
        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate(`/parcelles/${id}`)}
          >
            Annuler
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-blue-600 hover:bg-blue-700 gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer les modifications
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ParcelleEditPage;
