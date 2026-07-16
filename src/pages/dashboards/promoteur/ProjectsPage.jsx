import React, { useState, useEffect } from 'react';
import {
  Building,
  Plus,
  Eye,
  Edit,
  Filter,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  BarChart3,
  Loader2
} from 'lucide-react';
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

const statusBadgeClass = (status = '') => {
  const s = String(status).toLowerCase();
  if (s.includes('cours') || s.includes('progress') || s.includes('construction')) return 'bg-blue-100 text-blue-800';
  if (s.includes('termin') || s.includes('complet') || s.includes('livr')) return 'bg-green-100 text-green-800';
  if (s.includes('pré') || s.includes('pre') || s.includes('plan')) return 'bg-orange-100 text-orange-800';
  return 'bg-gray-100 text-gray-800';
};

const ProjectsPage = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [salesByProject, setSalesByProject] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const [{ data: projectRows }, { data: saleRows }] = await Promise.all([
          supabase
            .from('developer_projects')
            .select('id, title, client, location, status, progress, budget, spent, start_date, estimated_completion, current_phase, created_at')
            .eq('developer_id', user.id)
            .order('created_at', { ascending: false }),
          supabase
            .from('project_sales')
            .select('id, project_id, status')
            .eq('promoteur_id', user.id)
        ]);

        setProjects(projectRows || []);

        // Regroupe les ventes par projet (compteurs réservés / vendus)
        const grouped = {};
        (saleRows || []).forEach((sale) => {
          const key = sale.project_id;
          if (!grouped[key]) grouped[key] = { reserved: 0, sold: 0, total: 0 };
          grouped[key].total += 1;
          if (sale.status === 'reserved') grouped[key].reserved += 1;
          if (sale.status === 'sold' || sale.status === 'delivered') grouped[key].sold += 1;
        });
        setSalesByProject(grouped);
      } catch (error) {
        console.error('Erreur chargement projets promoteur:', error);
        setProjects([]);
        setSalesByProject({});
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user?.id]);

  // Agrégats réels pour les cartes de stats
  const totalProjects = projects.length;
  const totalReserved = Object.values(salesByProject).reduce((acc, s) => acc + s.reserved, 0);
  const totalSold = Object.values(salesByProject).reduce((acc, s) => acc + s.sold, 0);
  const avgProgress = totalProjects > 0
    ? Math.round(projects.reduce((acc, p) => acc + (Number(p.progress) || 0), 0) / totalProjects)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Mes Projets
        </h1>
        <p className="text-gray-600">
          Gestion de vos projets immobiliers
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-2">
          <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
            <Filter className="w-4 h-4 mr-2" />
            Filtrer
          </button>
        </div>
        <button className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
          <Plus className="w-4 h-4 mr-2" />
          Nouveau Projet
        </button>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Projets</p>
              <p className="text-2xl font-bold text-blue-600">{loading ? '—' : totalProjects}</p>
            </div>
            <Building className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Lots Vendus</p>
              <p className="text-2xl font-bold text-green-600">{loading ? '—' : totalSold}</p>
            </div>
            <Users className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Réservations</p>
              <p className="text-2xl font-bold text-orange-600">{loading ? '—' : totalReserved}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avancement Moyen</p>
              <p className="text-2xl font-bold text-purple-600">{loading ? '—' : `${avgProgress}%`}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Projets */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Loader2 className="w-6 h-6 mr-2 animate-spin" />
          Chargement des projets...
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md py-16 text-center">
          <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-900 font-semibold">Aucun projet</p>
          <p className="text-gray-500 text-sm mt-1">
            Vos projets immobiliers apparaîtront ici.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => {
            const sales = salesByProject[project.id] || { reserved: 0, sold: 0, total: 0 };
            const progress = Number(project.progress) || 0;
            return (
              <div key={project.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
                    <Building className="w-16 h-16 text-blue-600" />
                  </div>
                  {project.status && (
                    <div className="absolute top-4 right-4 flex space-x-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusBadgeClass(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {project.title || 'Projet sans titre'}
                  </h3>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    {project.location || '—'}
                    {project.current_phase ? ` • ${project.current_phase}` : ''}
                  </div>

                  {/* Budget et dépenses */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-bold text-green-600">{formatMoney(project.budget)}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Dépensé</p>
                      <p className="font-bold text-blue-600">{formatMoney(project.spent)}</p>
                    </div>
                  </div>

                  {/* Avancement chantier (progress réel) */}
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Avancement</span>
                      <span className="font-semibold text-orange-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Ventes / réservations (project_sales) */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {sales.sold} vendu{sales.sold > 1 ? 's' : ''}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {sales.reserved} réservé{sales.reserved > 1 ? 's' : ''}
                    </span>
                    {project.client && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                        {project.client}
                      </span>
                    )}
                  </div>

                  {/* Livraison estimée */}
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    Livraison: {formatDate(project.estimated_completion)}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button className="flex-1 flex items-center justify-center px-3 py-2 border border-gray-300 rounded text-sm hover:bg-gray-50">
                      <Eye className="w-4 h-4 mr-1" />
                      Détails
                    </button>
                    <button className="flex-1 flex items-center justify-center px-3 py-2 bg-orange-600 text-white rounded text-sm hover:bg-orange-700">
                      <Edit className="w-4 h-4 mr-1" />
                      Gérer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
