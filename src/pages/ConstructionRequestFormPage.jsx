import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { supabase } from '@/lib/customSupabaseClient';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2, Hammer, MapPin, Building2, Euro, Upload } from 'lucide-react';

const ConstructionRequestFormPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    building_type: 'Villa individuelle',
    location: '',
    surface: '',
    terrain: '',
    rooms: '',
    budget_estimated: '',
    deadline: '',
  });

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    try {
      const payload = {
        type: 'construction_request',
        status: 'new',
        title: form.title,
        description: form.description,
        user_id: user.id,
        data: {
          building_type: form.building_type,
          location: form.location,
          surface: form.surface,
          terrain: form.terrain,
          rooms: form.rooms,
          budget_estimated: Number(String(form.budget_estimated).replace(/\D/g, '')) || null,
          deadline: form.deadline || null,
        }
      };

      const { data, error } = await supabase.from('requests').insert(payload).select('id').single();
      if (error) throw error;

      window.safeGlobalToast?.({ title: 'Demande publiée', description: 'Votre demande de construction a été soumise.' });
      navigate(`/construction-request/${data.id}`);
    } catch (err) {
      console.error('Submit construction request failed:', err);
      window.safeGlobalToast?.({ title: 'Erreur', description: 'Impossible de soumettre la demande.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="container mx-auto py-10 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <Badge variant="secondary" className="mb-2">Publication</Badge>
          <h1 className="text-2xl font-bold">Publier une demande de construction</h1>
          <p className="text-sm text-gray-600">Décrivez votre projet pour recevoir des propositions de promoteurs et entreprises.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Hammer className="w-5 h-5 text-blue-600" />
              Détails du projet
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label>Titre du projet</Label>
                <Input name="title" value={form.title} onChange={handleChange} placeholder="Ex: Villa moderne avec piscine - Almadies" required />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Type de construction</Label>
                  <Select value={form.building_type} onValueChange={(v) => setForm(p => ({ ...p, building_type: v }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Villa individuelle">Villa individuelle</SelectItem>
                      <SelectItem value="Immeuble résidentiel">Immeuble résidentiel</SelectItem>
                      <SelectItem value="Commercial">Commercial</SelectItem>
                      <SelectItem value="Rénovation">Rénovation</SelectItem>
                      <SelectItem value="Bureau">Bureau</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Localisation</Label>
                  <Input name="location" value={form.location} onChange={handleChange} placeholder="Quartier, Ville" />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Surface habitable</Label>
                  <Input name="surface" value={form.surface} onChange={handleChange} placeholder="Ex: 250m²" />
                </div>
                <div>
                  <Label>Surface terrain</Label>
                  <Input name="terrain" value={form.terrain} onChange={handleChange} placeholder="Ex: 500m²" />
                </div>
                <div>
                  <Label>Configuration (pièces)</Label>
                  <Input name="rooms" value={form.rooms} onChange={handleChange} placeholder="Ex: 4 chambres, 3 SDB" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Budget estimé (FCFA)</Label>
                  <Input name="budget_estimated" value={form.budget_estimated} onChange={handleChange} placeholder="Ex: 85 000 000" />
                </div>
                <div>
                  <Label>Échéance souhaitée</Label>
                  <Input type="date" name="deadline" value={form.deadline} onChange={handleChange} />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea name="description" value={form.description} onChange={handleChange} placeholder="Décrivez votre projet, matériaux souhaités, contraintes, etc." rows={5} />
              </div>

              {/* Placeholder for documents upload - can be wired to Storage later */}
              <div>
                <Label>Documents (optionnel)</Label>
                <div className="border-2 border-dashed rounded-lg p-6 text-center text-sm text-gray-600">
                  <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
                  Déposez vos plans, études ou inspirations (à venir)
                </div>
              </div>

              <div className="pt-2">
                <Button type="submit" disabled={submitting} className="w-full">
                  {submitting ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publication...</>) : 'Publier la demande'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default ConstructionRequestFormPage;
