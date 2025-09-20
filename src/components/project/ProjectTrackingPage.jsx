import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, Calendar, Progress, MapPin, Camera, FileText,
  Clock, CheckCircle, AlertTriangle, Eye, Bookmark,
  FileSignature, HardHat, Home, Triangle, Shield,
  Palette, Sparkles, Search, Key, ShieldCheck,
  Play, XCircle, Users, CreditCard, Image,
  Download, ExternalLink, Bell, Star
} from 'lucide-react';
import { DeveloperProjectWorkflowService } from '../../services/DeveloperProjectWorkflowService';

const ProjectTrackingPage = ({ caseId }) => {
  const [projectCase, setProjectCase] = useState(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [constructionPhotos, setConstructionPhotos] = useState([]);

  const workflowService = new DeveloperProjectWorkflowService();

  useEffect(() => {
    loadProjectData();
  }, [caseId]);

  const loadProjectData = async () => {
    try {
      setLoading(true);
      // Charger les données du projet (simulation)
      const mockProjectCase = {
        id: caseId,
        projectName: "Résidence Les Jardins de Dakar",
        developerName: "Teranga Développement",
        unitNumber: "B205",
        unitType: "3 pièces",
        surfaceArea: 75.5,
        salePrice: 45000000,
        reservationAmount: 4500000,
        currentStatus: 'STRUCTURE',
        constructionProgress: 35,
        expectedDelivery: '2025-06-15',
        actualDelivery: null,
        vefaContractDate: '2024-08-15',
        constructionStartDate: '2024-09-01',
        location: {
          address: "Route de Ngor, Dakar",
          district: "Almadies"
        },
        paymentSchedule: [
          { type: 'RESERVATION', amount: 4500000, status: 'paid', date: '2024-07-20' },
          { type: 'CONTRACT_SIGNING', amount: 9000000, status: 'paid', date: '2024-08-15' },
          { type: 'FOUNDATIONS', amount: 9000000, status: 'paid', date: '2024-09-15' },
          { type: 'STRUCTURE', amount: 9000000, status: 'pending', dueDate: '2024-12-01' },
          { type: 'CLOSING', amount: 9000000, status: 'pending', dueDate: '2025-02-15' },
          { type: 'DELIVERY', amount: 4500000, status: 'pending', dueDate: '2025-06-15' }
        ]
      };

      const mockMilestones = [
        { 
          type: 'PROSPECT', 
          name: 'Prospect intéressé', 
          date: '2024-07-01', 
          completed: true,
          photos: []
        },
        { 
          type: 'RESERVATION', 
          name: 'Réservation confirmée', 
          date: '2024-07-20', 
          completed: true,
          photos: []
        },
        { 
          type: 'VEFA_CONTRACT', 
          name: 'Contrat VEFA signé', 
          date: '2024-08-15', 
          completed: true,
          photos: []
        },
        { 
          type: 'CONSTRUCTION_STARTED', 
          name: 'Début construction', 
          date: '2024-09-01', 
          completed: true,
          photos: ['construction_start_1.jpg', 'construction_start_2.jpg']
        },
        { 
          type: 'FOUNDATIONS', 
          name: 'Fondations terminées', 
          date: '2024-10-15', 
          completed: true,
          photos: ['foundations_1.jpg', 'foundations_2.jpg', 'foundations_3.jpg']
        },
        { 
          type: 'STRUCTURE', 
          name: 'Gros œuvre en cours', 
          date: '2024-11-30', 
          completed: true,
          photos: ['structure_1.jpg', 'structure_2.jpg']
        },
        { 
          type: 'ROOFING', 
          name: 'Toiture', 
          estimatedDate: '2025-01-15', 
          completed: false,
          photos: []
        },
        { 
          type: 'CLOSING', 
          name: 'Clos et couvert', 
          estimatedDate: '2025-02-28', 
          completed: false,
          photos: []
        },
        { 
          type: 'INTERIOR_WORKS', 
          name: 'Second œuvre', 
          estimatedDate: '2025-04-30', 
          completed: false,
          photos: []
        },
        { 
          type: 'FINISHING', 
          name: 'Finitions', 
          estimatedDate: '2025-05-30', 
          completed: false,
          photos: []
        },
        { 
          type: 'DELIVERED', 
          name: 'Livraison', 
          estimatedDate: '2025-06-15', 
          completed: false,
          photos: []
        }
      ];

      setProjectCase(mockProjectCase);
      setMilestones(mockMilestones);
      
    } catch (error) {
      console.error('Erreur chargement données projet:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      'PROSPECT': Eye,
      'RESERVATION': Bookmark,
      'VEFA_CONTRACT': FileSignature,
      'CONSTRUCTION_STARTED': HardHat,
      'FOUNDATIONS': Building2,
      'STRUCTURE': Home,
      'ROOFING': Triangle,
      'CLOSING': Shield,
      'INTERIOR_WORKS': Palette,
      'FINISHING': Sparkles,
      'PRE_DELIVERY': Search,
      'DELIVERED': Key,
      'WARRANTY_PERIOD': ShieldCheck,
      'COMPLETED': CheckCircle
    };
    return icons[status] || Building2;
  };

  const getStatusColor = (status, completed = false) => {
    if (!completed) return '#94A3B8'; // Gris pour non complété
    
    const colors = {
      'PROSPECT': '#3B82F6',
      'RESERVATION': '#F59E0B',
      'VEFA_CONTRACT': '#10B981',
      'CONSTRUCTION_STARTED': '#F59E0B',
      'FOUNDATIONS': '#8B5CF6',
      'STRUCTURE': '#8B5CF6',
      'ROOFING': '#8B5CF6',
      'CLOSING': '#8B5CF6',
      'INTERIOR_WORKS': '#EC4899',
      'FINISHING': '#EC4899',
      'PRE_DELIVERY': '#10B981',
      'DELIVERED': '#10B981',
      'WARRANTY_PERIOD': '#06B6D4',
      'COMPLETED': '#10B981'
    };
    return colors[status] || '#8B5CF6';
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
                  {projectCase.projectName}
                </h1>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                  <span>Unité {projectCase.unitNumber}</span>
                  <span>•</span>
                  <span>{projectCase.unitType}</span>
                  <span>•</span>
                  <span>{projectCase.surfaceArea} m²</span>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">
                {projectCase.constructionProgress}%
              </div>
              <div className="text-sm text-gray-500">Avancement</div>
            </div>
          </div>

          {/* Barre de progression */}
          <div className="mt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progression de la construction</span>
              <span>Livraison prévue : {new Date(projectCase.expectedDelivery).toLocaleDateString('fr-FR')}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${projectCase.constructionProgress}%` }}
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
              { id: 'payments', label: 'Paiements', icon: CreditCard },
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
              
              <div className="relative">
                {milestones.map((milestone, index) => {
                  const Icon = getStatusIcon(milestone.type);
                  const isCompleted = milestone.completed;
                  const statusColor = getStatusColor(milestone.type, isCompleted);
                  
                  return (
                    <div key={index} className="relative pb-8">
                      {/* Ligne de connexion */}
                      {index < milestones.length - 1 && (
                        <div 
                          className="absolute left-6 top-12 w-0.5 h-16"
                          style={{ backgroundColor: isCompleted ? statusColor : '#E5E7EB' }}
                        />
                      )}
                      
                      <div className="flex items-start space-x-4">
                        <div 
                          className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center"
                          style={{ 
                            backgroundColor: isCompleted ? statusColor : '#F3F4F6',
                            color: isCompleted ? 'white' : '#9CA3AF'
                          }}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        
                        <div className="flex-1 bg-white rounded-lg shadow-sm border p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-medium text-gray-900">
                                {milestone.name}
                              </h3>
                              <p className="text-sm text-gray-500 mt-1">
                                {isCompleted ? (
                                  `Terminé le ${new Date(milestone.date).toLocaleDateString('fr-FR')}`
                                ) : (
                                  `Prévu le ${new Date(milestone.estimatedDate).toLocaleDateString('fr-FR')}`
                                )}
                              </p>
                            </div>
                            
                            {isCompleted && milestone.photos.length > 0 && (
                              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
                                <Camera className="h-4 w-4" />
                                <span className="text-sm">{milestone.photos.length} photos</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {milestones
                  .filter(m => m.completed && m.photos.length > 0)
                  .map((milestone, index) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                      <div className="p-4 border-b">
                        <h3 className="font-medium text-gray-900">{milestone.name}</h3>
                        <p className="text-sm text-gray-500">
                          {new Date(milestone.date).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-2 p-4">
                        {milestone.photos.map((photo, photoIndex) => (
                          <div key={photoIndex} className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                            <Camera className="h-8 w-8 text-gray-400" />
                            <span className="text-xs text-gray-500 ml-2">{photo}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
              </div>
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
                Échéancier VEFA
              </h2>
              
              <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <div className="px-6 py-4 border-b bg-gray-50">
                  <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-700">
                    <span>Étape</span>
                    <span>Montant</span>
                    <span>Date d'échéance</span>
                    <span>Statut</span>
                  </div>
                </div>
                
                <div className="divide-y">
                  {projectCase.paymentSchedule.map((payment, index) => (
                    <div key={index} className="px-6 py-4">
                      <div className="grid grid-cols-4 gap-4 items-center">
                        <div className="text-sm text-gray-900">
                          {payment.type.replace('_', ' ')}
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {payment.amount.toLocaleString('fr-FR')} FCFA
                        </div>
                        <div className="text-sm text-gray-500">
                          {payment.date ? 
                            new Date(payment.date).toLocaleDateString('fr-FR') :
                            new Date(payment.dueDate).toLocaleDateString('fr-FR')
                          }
                        </div>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            payment.status === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {payment.status === 'paid' ? 'Payé' : 'En attente'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
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