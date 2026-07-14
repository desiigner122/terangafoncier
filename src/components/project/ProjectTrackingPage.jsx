import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, Calendar, MapPin, Camera, FileText,
  Clock, CheckCircle, CreditCard
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import EmptyState from '@/components/ui/EmptyState';

const ProjectTrackingPage = ({ caseId }) => {
  const [projectCase, setProjectCase] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadProjectData();
  }, [caseId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      setNotFound(false);

      if (!caseId) {
        setProjectCase(null);
        setNotFound(true);
        return;
      }

      const { data: project, error } = await supabase
        .from('developer_projects')
        .select('*')
        .eq('id', caseId)
        .maybeSingle();

      if (error) throw error;

      if (!project) {
        setProjectCase(null);
        setNotFound(true);
        return;
      }

      let developerName = null;
      if (project.developer_id) {
        const { data: developer } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', project.developer_id)
          .maybeSingle();
        developerName = developer?.full_name || null;
      }

      setProjectCase({ ...project, developerName });
    } catch (error) {
      console.error('Erreur chargement données projet:', error);
      setProjectCase(null);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '—';
    return `${Number(amount).toLocaleString('fr-FR')} FCFA`;
  };

  const formatDate = (value) => {
    if (!value) return '—';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('fr-FR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du projet...</p>
        </div>
      </div>
    );
  }

  if (notFound || !projectCase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <EmptyState
          icon={Building2}
          title="Projet introuvable"
          description="Aucune donnée de projet n'a été trouvée pour cet identifiant."
        />
      </div>
    );
  }

  const progress = projectCase.progress ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* En-tête du projet */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Building2 className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {projectCase.title || 'Projet sans nom'}
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  {projectCase.developerName && <span>{projectCase.developerName}</span>}
                  {projectCase.location && (
                    <>
                      <span>•</span>
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{projectCase.location}</span>
                    </>
                  )}
                  {projectCase.current_phase && (
                    <>
                      <span>•</span>
                      <span>{projectCase.current_phase}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {progress}%
              </div>
              <div className="text-sm text-gray-500">Avancement</div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progression de la construction</span>
              <span>Livraison prévue : {formatDate(projectCase.estimated_completion)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation des onglets */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'timeline', label: 'Timeline Construction', icon: Calendar },
              { id: 'photos', label: 'Photos Chantier', icon: Camera },
              { id: 'documents', label: 'Documents', icon: FileText },
              { id: 'payments', label: 'Budget', icon: CreditCard },
              { id: 'project', label: 'Détails Projet', icon: Building2 }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          {activeTab === 'timeline' && (
            <motion.div
              key="timeline"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Timeline de Construction
              </h2>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Statut actuel : {projectCase.status || projectCase.current_phase || '—'}</span>
                </div>
                <p className="text-sm text-gray-500">
                  Le détail étape par étape du chantier n'est pas encore disponible pour ce projet.
                </p>
              </div>
            </motion.div>
          )}

          {activeTab === 'photos' && (
            <motion.div
              key="photos"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Photos du Chantier
              </h2>
              <EmptyState
                icon={Camera}
                title="Aucune photo disponible"
                description="Les photos du chantier apparaîtront ici dès qu'elles seront ajoutées à ce projet."
              />
            </motion.div>
          )}

          {activeTab === 'documents' && (
            <motion.div
              key="documents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Documents du Projet
              </h2>
              <EmptyState
                icon={FileText}
                title="Aucun document disponible"
                description="Les documents liés à ce projet apparaîtront ici dès qu'ils seront ajoutés."
              />
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Budget du Projet
              </h2>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Budget total</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(projectCase.budget)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dépensé à ce jour</p>
                    <p className="text-xl font-bold text-gray-900">{formatCurrency(projectCase.spent)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Restant</p>
                    <p className="text-xl font-bold text-gray-900">
                      {projectCase.budget != null && projectCase.spent != null
                        ? formatCurrency(projectCase.budget - projectCase.spent)
                        : '—'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'project' && (
            <motion.div
              key="project"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Détails du Projet
              </h2>

              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Client</p>
                    <p className="font-medium text-gray-900">{projectCase.client || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Promoteur</p>
                    <p className="font-medium text-gray-900">{projectCase.developerName || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Localisation</p>
                    <p className="font-medium text-gray-900">{projectCase.location || '—'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Statut</p>
                    <p className="font-medium text-gray-900 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      {projectCase.status || '—'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date de début</p>
                    <p className="font-medium text-gray-900">{formatDate(projectCase.start_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Livraison estimée</p>
                    <p className="font-medium text-gray-900">{formatDate(projectCase.estimated_completion)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProjectTrackingPage;
