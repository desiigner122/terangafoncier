import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Map,
  MapPin,
  Plus,
  Filter,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  BarChart3,
  TrendingUp,
  Ruler
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

// Formatage monétaire XOF compact (ex: 850M, 2.5Md)
const formatXOF = (value) => {
  const n = Number(value);
  if (!n || Number.isNaN(n)) return '—';
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} Md XOF`;
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M XOF`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}k XOF`;
  return `${n} XOF`;
};

// Formatage superficie (m²) avec séparateur de milliers
const formatSurface = (value) => {
  const n = Number(value);
  if (!n || Number.isNaN(n)) return '—';
  return `${n.toLocaleString('fr-FR')} m²`;
};

// Libellé + variante de badge selon le verification_status réel
const statusLabel = (status) => {
  switch (status) {
    case 'verified': return { label: 'Vérifié', variant: 'success' };
    case 'pending': return { label: 'En attente', variant: 'secondary' };
    case 'in_progress': return { label: 'En cours', variant: 'warning' };
    case 'rejected': return { label: 'Rejeté', variant: 'destructive' };
    default: return { label: status || 'Non défini', variant: 'secondary' };
  }
};

const AgentFoncierTerrains = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [terrains, setTerrains] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadTerrains = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Terrains de l'agent : properties filtré par owner_id
        const { data: props, error } = await supabase
          .from('properties')
          .select('id, title, name, type, price, surface, location, region, city, status, verification_status, estimated_value, owner_id, created_at')
          .eq('owner_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const list = props || [];

        // Photo principale (property_photos) pour chaque terrain
        const ids = list.map((p) => p.id);
        let photosByProperty = {};
        if (ids.length > 0) {
          const { data: photos } = await supabase
            .from('property_photos')
            .select('property_id, url, is_primary')
            .in('property_id', ids);
          (photos || []).forEach((ph) => {
            if (!photosByProperty[ph.property_id] || ph.is_primary) {
              photosByProperty[ph.property_id] = ph.url;
            }
          });
        }

        setTerrains(
          list.map((p) => ({
            ...p,
            nom: p.title || p.name || 'Terrain sans titre',
            localisation: p.location || [p.city, p.region].filter(Boolean).join(', ') || '—',
            photo: photosByProperty[p.id] || null
          }))
        );
      } catch (e) {
        console.error('Erreur chargement terrains agent:', e);
        setTerrains([]);
      } finally {
        setLoading(false);
      }
    };

    loadTerrains();
  }, [user?.id]);

  // Stats calculées sur les vraies données
  const totalTerrains = terrains.length;
  const valeurTotale = terrains.reduce(
    (sum, t) => sum + (Number(t.estimated_value) || Number(t.price) || 0),
    0
  );
  const enEvaluation = terrains.filter(
    (t) => t.verification_status === 'pending' || t.verification_status === 'in_progress'
  ).length;
  const superficieTotale = terrains.reduce((sum, t) => sum + (Number(t.surface) || 0), 0);

  const filtered = terrains.filter((t) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      t.nom.toLowerCase().includes(q) ||
      t.localisation.toLowerCase().includes(q) ||
      (t.type || '').toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white p-6">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des Terrains</h1>
          <p className="text-gray-600">Inventaire et suivi foncier</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Terrain
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Terrains</p>
                <p className="text-2xl font-bold text-gray-900">
                  {totalTerrains > 0 ? totalTerrains.toLocaleString('fr-FR') : '—'}
                </p>
              </div>
              <Map className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valeur Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {valeurTotale > 0 ? formatXOF(valeurTotale) : '—'}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Évaluation</p>
                <p className="text-2xl font-bold text-gray-900">{enEvaluation}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Superficie Totale</p>
                <p className="text-2xl font-bold text-gray-900">
                  {superficieTotale > 0
                    ? `${(superficieTotale / 10000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} Ha`
                    : '—'}
                </p>
              </div>
              <Ruler className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Rechercher un terrain..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      {/* Liste des terrains */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Terrains</CardTitle>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Map className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">Aucun terrain</p>
              <p className="text-sm">
                {terrains.length === 0
                  ? "Vous n'avez aucun terrain enregistré pour le moment."
                  : 'Aucun terrain ne correspond à votre recherche.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map((terrain, index) => {
                const badge = statusLabel(terrain.verification_status);
                return (
                  <motion.div
                    key={terrain.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {terrain.photo ? (
                          <img
                            src={terrain.photo}
                            alt={terrain.nom}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Map className="h-6 w-6 text-green-600" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{terrain.nom}</h4>
                        <div className="flex items-center space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{terrain.localisation}</span>
                          </div>
                          {terrain.type && (
                            <Badge variant="secondary" className="text-xs">
                              {terrain.type}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{formatSurface(terrain.surface)}</p>
                        <p className="text-sm text-gray-600">
                          {formatXOF(terrain.estimated_value || terrain.price)}
                        </p>
                      </div>

                      <Badge variant={badge.variant}>{badge.label}</Badge>

                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgentFoncierTerrains;
