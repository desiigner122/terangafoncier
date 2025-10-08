/**
 * PAGE D'ÉDITION DE PROPRIÉTÉ - MODE ÉDITION
 * Réutilise la logique de AddPropertyAdvanced mais en mode édition
 * ✅ Chargement données existantes depuis Supabase
 * ✅ Mise à jour au lieu de création
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { notify } from '@/components/ui/NotificationToast';
import LoadingState from '@/components/ui/LoadingState';

// Import du composant AddPropertyAdvanced pour réutiliser sa logique
import AddPropertyAdvanced from './AddPropertyAdvanced';

const EditPropertyAdvanced = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // ID de la propriété à éditer
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [property, setProperty] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (id && user) {
      loadProperty();
    }
  }, [id, user]);

  const loadProperty = async () => {
    try {
      setLoading(true);

      // Charger la propriété depuis Supabase
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('id', id)
        .eq('owner_id', user.id) // Sécurité: vérifier que c'est bien sa propriété
        .single();

      if (error) {
        console.error('Erreur chargement propriété:', error);
        if (error.code === 'PGRST116') {
          // Propriété non trouvée
          setNotFound(true);
          notify.error('Propriété introuvable');
        } else {
          throw error;
        }
        return;
      }

      setProperty(data);
      notify.success('Propriété chargée !');
      
    } catch (error) {
      console.error('Erreur:', error);
      notify.error('Erreur lors du chargement de la propriété');
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingState type="spinner" message="Chargement de la propriété..." />;
  }

  if (notFound || !property) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Propriété introuvable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              Cette propriété n'existe pas ou vous n'avez pas les droits pour la modifier.
            </p>
            <div className="flex gap-3 justify-center">
              <Button 
                variant="outline"
                onClick={() => navigate('/dashboard/vendeur/properties')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour aux propriétés
              </Button>
              <Button onClick={() => navigate('/dashboard/add-property-advanced')}>
                Créer une nouvelle propriété
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Rendre le formulaire avec les données existantes
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header personnalisé pour l'édition */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/dashboard/vendeur/properties')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Modifier la propriété</h1>
                <p className="text-sm text-muted-foreground">{property.title}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire d'édition (utilise AddPropertyAdvanced en mode édition) */}
      <div className="container mx-auto px-4 py-6">
        <AddPropertyAdvanced 
          isEditMode={true} 
          existingProperty={property}
          onSaveSuccess={() => {
            notify.success('Propriété mise à jour avec succès !');
            setTimeout(() => navigate('/dashboard/vendeur/properties'), 1500);
          }}
        />
      </div>
    </div>
  );
};

export default EditPropertyAdvanced;
