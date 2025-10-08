/**
 * PAGE D'ÉDITION SIMPLE DE PROPRIÉTÉ
 * ✅ Fonctionne avec le vrai schéma Supabase
 * ✅ Formulaire complet pré-rempli
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { ArrowLeft, Save, Loader2, AlertCircle } from 'lucide-react';
import { notify } from '@/components/ui/NotificationToast';
import LoadingState from '@/components/ui/LoadingState';

const EditPropertySimple = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    property_type: 'terrain',
    price: '',
    surface: '',
    location: '',
    city: '',
    region: '',
    status: 'pending_verification',
    features: {}
  });

  useEffect(() => {
    if (id && user) {
      loadProperty();
    }
  }, [id, user]);

  const loadProperty = async () => {
    try {
      setLoading(true);
      
      const { data, error: loadError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id)
        .single();

      if (loadError) throw loadError;
      
      if (!data) {
        setError('Propriété non trouvée');
        return;
      }

      setFormData({
        title: data.title || '',
        description: data.description || '',
        property_type: data.property_type || 'terrain',
        price: data.price || '',
        surface: data.surface || '',
        location: data.location || '',
        city: data.city || '',
        region: data.region || '',
        status: data.status || 'pending_verification',
        features: data.features || {}
      });
    } catch (err) {
      console.error('Erreur chargement propriété:', err);
      setError(err.message);
      notify.error('Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from('properties')
        .update({
          title: formData.title,
          description: formData.description,
          property_type: formData.property_type,
          price: parseFloat(formData.price),
          surface: parseFloat(formData.surface),
          location: formData.location,
          city: formData.city,
          region: formData.region,
          status: formData.status,
          features: formData.features,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('owner_id', user.id);

      if (updateError) throw updateError;

      notify.success('✅ Propriété mise à jour avec succès !');
      setTimeout(() => navigate('/dashboard/properties'), 1500);
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      notify.error('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return <LoadingState message="Chargement de la propriété..." />;
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <AlertCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-xl font-semibold">Erreur</h2>
              <p className="text-muted-foreground">{error}</p>
              <Button onClick={() => navigate('/dashboard/properties')}>
                Retour aux propriétés
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Button
        variant="ghost"
        onClick={() => navigate('/dashboard/properties')}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Retour
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>✏️ Modifier la Propriété</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Titre */}
            <div>
              <Label htmlFor="title">Titre *</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Terrain de 500m² à Dakar"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={5}
                placeholder="Décrivez votre propriété..."
              />
            </div>

            {/* Type de propriété */}
            <div>
              <Label htmlFor="property_type">Type de bien *</Label>
              <Select
                value={formData.property_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, property_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="terrain">Terrain</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="appartement">Appartement</SelectItem>
                  <SelectItem value="immeuble">Immeuble</SelectItem>
                  <SelectItem value="bureau">Bureau</SelectItem>
                  <SelectItem value="local_commercial">Local Commercial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Prix et Surface */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Prix (FCFA) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Ex: 50000000"
                  required
                />
              </div>

              <div>
                <Label htmlFor="surface">Surface (m²) *</Label>
                <Input
                  id="surface"
                  name="surface"
                  type="number"
                  value={formData.surface}
                  onChange={handleChange}
                  placeholder="Ex: 500"
                  required
                />
              </div>
            </div>

            {/* Localisation */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="location">Adresse</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Ex: Cité Keur Gorgui"
                />
              </div>

              <div>
                <Label htmlFor="city">Ville *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Ex: Dakar"
                  required
                />
              </div>

              <div>
                <Label htmlFor="region">Région *</Label>
                <Input
                  id="region"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="Ex: Dakar"
                  required
                />
              </div>
            </div>

            {/* Statut */}
            <div>
              <Label htmlFor="status">Statut</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending_verification">En attente de vérification</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspendue</SelectItem>
                  <SelectItem value="sold">Vendue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/dashboard/properties')}
                disabled={saving}
              >
                Annuler
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sauvegarde...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Sauvegarder
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditPropertySimple;
