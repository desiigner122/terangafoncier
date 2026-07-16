import React, { useState, useEffect } from 'react';
import {
  Building,
  Camera,
  Eye,
  Video,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Users,
  TrendingUp,
  Satellite,
  Wifi,
  Battery,
  Settings,
  Phone,
  MessageSquare,
  Download,
  BarChart3,
  Shield,
  Zap,
  Loader2,
  HardHat
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const formatMoney = (value) => {
  if (value === null || value === undefined || value === '') return '—';
  const num = Number(value);
  if (Number.isNaN(num)) return '—';
  return `${num.toLocaleString('fr-FR')} FCFA`;
};

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleDateString('fr-FR');
};

// Calcule le temps restant jusqu'à la date de fin estimée (donnée réelle)
const remainingLabel = (endDate) => {
  if (!endDate) return null;
  const end = new Date(endDate);
  if (Number.isNaN(end.getTime())) return null;
  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays < 0) return { text: `Dépassé de ${Math.abs(diffDays)} j`, late: true };
  const months = Math.floor(diffDays / 30);
  if (months >= 1) return { text: `Reste ~${months} mois`, late: false };
  return { text: `Reste ${diffDays} j`, late: false };
};

const statusBadgeClass = (status = '') => {
  const s = String(status).toLowerCase();
  if (s.includes('cours') || s.includes('progress') || s.includes('construction')) return 'bg-blue-100 text-blue-800';
  if (s.includes('termin') || s.includes('complet') || s.includes('livr')) return 'bg-green-100 text-green-800';
  if (s.includes('pré') || s.includes('pre') || s.includes('plan') || s.includes('attente')) return 'bg-orange-100 text-orange-800';
  return 'bg-gray-100 text-gray-800';
};

const isActiveStatus = (status = '') => {
  const s = String(status).toLowerCase();
  return !(s.includes('termin') || s.includes('complet') || s.includes('livr') || s.includes('annul'));
};

const ConstructionPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [{ data: projectRows }, { data: requestRows }] = await Promise.all([
          supabase
            .from('developer_projects')
            .select('id, title, client, location, status, progress, budget, spent, start_date, estimated_completion, current_phase, updated_at, created_at')
            .eq('developer_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('construction_requests')
            .select('id, title, status, budget, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        ]);

        setProjects(projectRows || []);
        setRequests(requestRows || []);
      } catch (err) {
        console.error('Erreur chargement construction:', err);
        setProjects([]);
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Agrégats réels
  const activeProjects = projects.filter((p) => isActiveStatus(p.status));
  const avgProgress = projects.length
    ? Math.round(projects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) / projects.length)
    : 0;
  const totalBudget = projects.reduce((acc, p) => acc + (Number(p.budget) || 0), 0);
  const totalSpent = projects.reduce((acc, p) => acc + (Number(p.spent) || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header avec stats */}
      <div>
        <h2 className="text-3xl font-bold flex items-center mb-2">
          <Building className="w-6 h-6 mr-2 text-blue-600" />
          Suivi des Chantiers
        </h2>
        <p className="text-gray-600">Avancement et budget de vos projets de construction</p>
      </div>

      {/* Stats Cards - données réelles issues de developer_projects */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chantiers Actifs</p>
                <p className="text-2xl font-bold text-blue-600">{activeProjects.length}</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avancement Moyen</p>
                <p className="text-2xl font-bold text-green-600">
                  {projects.length ? `${avgProgress}%` : '—'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Budget Total</p>
                <p className="text-2xl font-bold text-orange-600">
                  {projects.length ? formatMoney(totalBudget) : '—'}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dépensé Total</p>
                <p className="text-2xl font-bold text-purple-600">
                  {projects.length ? formatMoney(totalSpent) : '—'}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* État vide honnête */}
      {projects.length === 0 && (
        <Card>
          <CardContent className="p-10 text-center text-gray-500">
            <Building className="w-10 h-10 mx-auto mb-3 text-gray-300" />
            <p className="font-medium">Aucun chantier pour le moment</p>
            <p className="text-sm mt-1">Vos projets de construction apparaîtront ici.</p>
          </CardContent>
        </Card>
      )}

      {/* Projets en construction - données réelles */}
      <div className="grid gap-6">
        {projects.map((project) => {
          const budget = Number(project.budget) || 0;
          const spent = Number(project.spent) || 0;
          const spentPct = budget > 0 ? (spent / budget) * 100 : 0;
          const remaining = remainingLabel(project.estimated_completion);

          return (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    {project.title || 'Projet sans titre'}
                  </CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location || '—'}{project.client ? ` • Client: ${project.client}` : ''}
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={statusBadgeClass(project.status)}>
                    {project.status || 'Statut inconnu'}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
                  <TabsTrigger value="cameras">Caméras Live</TabsTrigger>
                  <TabsTrigger value="iot">Capteurs IoT</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Avancement</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Phase: {project.current_phase || '—'}</span>
                          <span>{Number(project.progress) || 0}%</span>
                        </div>
                        <Progress value={Number(project.progress) || 0} className="h-2" />
                        <p className="text-xs text-gray-600">
                          Dernière maj: {formatDate(project.updated_at)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Budget</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Dépensé</span>
                          <span>{budget > 0 ? `${spentPct.toFixed(1)}%` : '—'}</span>
                        </div>
                        <Progress value={spentPct} className="h-2" />
                        <p className="text-xs text-gray-600">
                          {formatMoney(spent)} / {formatMoney(budget)}
                        </p>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Délais</h4>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Fin prévue: {formatDate(project.estimated_completion)}</span>
                        </div>
                        {remaining && (
                          <div className="flex items-center text-sm">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{remaining.text}</span>
                          </div>
                        )}
                        {remaining && (
                          <Badge className={`text-xs ${remaining.late ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                            {remaining.late ? 'En retard' : 'Dans les temps'}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                {/* Pas de source réelle pour les flux caméra : état honnête */}
                <TabsContent value="cameras" className="space-y-4">
                  <div className="p-8 text-center border rounded-lg bg-gray-50">
                    <Camera className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-600">Caméras de chantier</p>
                    <p className="text-sm text-gray-500 mt-1">
                      La surveillance vidéo en direct sera bientôt disponible.
                    </p>
                  </div>
                </TabsContent>

                {/* Pas de source réelle pour les capteurs IoT : état honnête */}
                <TabsContent value="iot" className="space-y-4">
                  <div className="p-8 text-center border rounded-lg bg-gray-50">
                    <Satellite className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                    <p className="font-medium text-gray-600">Capteurs IoT</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Le suivi des capteurs (température, humidité, bruit, qualité de l'air) sera bientôt disponible.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="communication" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h5 className="font-semibold">Contact Client</h5>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Phone className="w-4 h-4 mr-2" />
                          Appeler {project.client || 'le client'}
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Envoyer un message
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Video className="w-4 h-4 mr-2" />
                          Visioconférence
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h5 className="font-semibold">Équipe Chantier</h5>
                      <div className="space-y-2">
                        <Button variant="outline" className="w-full justify-start">
                          <Users className="w-4 h-4 mr-2" />
                          Chef de chantier
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <Shield className="w-4 h-4 mr-2" />
                          Responsable sécurité
                        </Button>
                        <Button variant="outline" className="w-full justify-start">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Contrôleur qualité
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          );
        })}
      </div>

      {/* Demandes de construction réelles (construction_requests) */}
      {requests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HardHat className="w-5 h-5 mr-2 text-orange-600" />
              Demandes de construction
            </CardTitle>
            <CardDescription>Demandes enregistrées liées à vos chantiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {requests.map((req) => (
              <div key={req.id} className="flex items-center justify-between border rounded-lg p-3">
                <div>
                  <p className="font-medium">{req.title || 'Demande sans titre'}</p>
                  <p className="text-xs text-gray-500">Créée le {formatDate(req.created_at)}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-600">{formatMoney(req.budget)}</span>
                  <Badge className={statusBadgeClass(req.status)}>
                    {req.status || 'Statut inconnu'}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConstructionPage;
