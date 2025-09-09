import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Eye,
  Download,
  Calendar,
  User,
  Building,
  MapPin,
  Shield,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  Info
} from 'lucide-react';

const DueDiligencePage = () => {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [dueDiligenceReports, setDueDiligenceReports] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Simulation des rapports de due diligence
    const mockReports = [
      {
        id: 1,
        propertyTitle: "Villa Luxury Almadies",
        location: "Almadies, Dakar",
        price: 1200000,
        status: "completed",
        completionDate: "2024-12-15",
        riskLevel: "low",
        overallScore: 85,
        analyst: "Dr. Mamadou Diallo",
        documents: {
          legal: { status: "verified", score: 90, issues: 0 },
          financial: { status: "verified", score: 88, issues: 1 },
          technical: { status: "verified", score: 82, issues: 2 },
          environmental: { status: "verified", score: 75, issues: 3 },
          market: { status: "verified", score: 92, issues: 0 }
        },
        keyFindings: [
          {
            category: "Légal",
            type: "positive",
            message: "Titre foncier clair et sans litige",
            severity: "info"
          },
          {
            category: "Technique",
            type: "warning",
            message: "Rénovation électrique recommandée dans 2 ans",
            severity: "medium"
          },
          {
            category: "Environnemental",
            type: "warning",
            message: "Zone inondable en saison des pluies",
            severity: "medium"
          },
          {
            category: "Marché",
            type: "positive",
            message: "Forte demande dans la zone, appréciation de 12%/an",
            severity: "info"
          }
        ]
      },
      {
        id: 2,
        propertyTitle: "Centre Commercial VDN",
        location: "VDN, Dakar",
        price: 2500000,
        status: "in_progress",
        completionDate: null,
        riskLevel: "medium",
        overallScore: 72,
        analyst: "Fatou Sow",
        documents: {
          legal: { status: "verified", score: 95, issues: 0 },
          financial: { status: "pending", score: null, issues: null },
          technical: { status: "verified", score: 78, issues: 4 },
          environmental: { status: "verified", score: 65, issues: 5 },
          market: { status: "verified", score: 85, issues: 1 }
        },
        keyFindings: [
          {
            category: "Légal",
            type: "positive",
            message: "Permis de construire valide et conforme",
            severity: "info"
          },
          {
            category: "Technique",
            type: "warning",
            message: "Structure nécessite renforcement sismique",
            severity: "high"
          },
          {
            category: "Environnemental",
            type: "negative",
            message: "Impact sonore élevé sur le voisinage",
            severity: "high"
          }
        ]
      },
      {
        id: 3,
        propertyTitle: "Résidence Teranga Heights",
        location: "Mermoz, Dakar",
        price: 850000,
        status: "failed",
        completionDate: "2024-12-10",
        riskLevel: "high",
        overallScore: 45,
        analyst: "Ousmane Ba",
        documents: {
          legal: { status: "rejected", score: 25, issues: 8 },
          financial: { status: "verified", score: 70, issues: 2 },
          technical: { status: "verified", score: 55, issues: 6 },
          environmental: { status: "rejected", score: 30, issues: 10 },
          market: { status: "verified", score: 65, issues: 3 }
        },
        keyFindings: [
          {
            category: "Légal",
            type: "negative",
            message: "Litige foncier en cours avec la mairie",
            severity: "critical"
          },
          {
            category: "Environnemental",
            type: "negative",
            message: "Sol contaminé détecté, dépollution nécessaire",
            severity: "critical"
          },
          {
            category: "Technique",
            type: "negative",
            message: "Fondations insuffisantes pour la structure",
            severity: "high"
          }
        ]
      }
    ];
    
    setDueDiligenceReports(mockReports);
    setSelectedProperty(mockReports[0]);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'in_progress': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'completed': return 'Terminé';
      case 'in_progress': return 'En Cours';
      case 'failed': return 'Échec';
      default: return status;
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDocumentStatusIcon = (status) => {
    switch (status) {
      case 'verified': return CheckCircle;
      case 'pending': return Clock;
      case 'rejected': return XCircle;
      default: return AlertTriangle;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getFindingIcon = (type) => {
    switch (type) {
      case 'positive': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'negative': return XCircle;
      default: return Info;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Due Diligence Immobilière
          </h1>
          <p className="text-gray-600">
            Analyses approfondies et rapports de vérification pour vos investissements
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Reports List */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Rapports Disponibles
              </h2>
              <div className="space-y-3">
                {dueDiligenceReports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedProperty(report)}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedProperty?.id === report.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <h3 className="font-medium text-gray-900 mb-1">
                      {report.propertyTitle}
                    </h3>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {report.location}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {getStatusLabel(report.status)}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {report.overallScore}/100
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Report Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            {selectedProperty && (
              <>
                {/* Report Header */}
                <div className="bg-white rounded-xl p-6 shadow-lg mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {selectedProperty.propertyTitle}
                      </h2>
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        {selectedProperty.location}
                        <DollarSign className="h-4 w-4 ml-4 mr-1" />
                        {selectedProperty.price.toLocaleString()} FCFA
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProperty.status)}`}>
                          {getStatusLabel(selectedProperty.status)}
                        </span>
                        <span className={`text-sm font-medium ${getRiskColor(selectedProperty.riskLevel)}`}>
                          Risque {selectedProperty.riskLevel === 'low' ? 'Faible' : 
                                  selectedProperty.riskLevel === 'medium' ? 'Moyen' : 'Élevé'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        {selectedProperty.overallScore}/100
                      </div>
                      <div className="text-sm text-gray-600">Score Global</div>
                      {selectedProperty.completionDate && (
                        <div className="flex items-center text-xs text-gray-500 mt-2">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(selectedProperty.completionDate).toLocaleDateString('fr-FR')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Navigation Tabs */}
                <div className="bg-white rounded-xl shadow-lg mb-6">
                  <div className="flex border-b">
                    {[
                      { id: 'overview', label: 'Vue d\'ensemble', icon: Eye },
                      { id: 'documents', label: 'Documents', icon: FileText },
                      { id: 'findings', label: 'Conclusions', icon: Shield },
                      { id: 'recommendations', label: 'Recommandations', icon: Star }
                    ].map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                            activeTab === tab.id
                              ? 'text-blue-600 border-b-2 border-blue-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <Icon className="h-4 w-4 mr-2" />
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <div className="p-6">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                      <div className="space-y-6">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Informations Générales
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <User className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm text-gray-600">Analyste</p>
                                <p className="font-medium">{selectedProperty.analyst}</p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <Building className="h-5 w-5 text-gray-400 mr-3" />
                              <div>
                                <p className="text-sm text-gray-600">Type de Bien</p>
                                <p className="font-medium">Résidentiel</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Score par Catégorie</h4>
                          <div className="space-y-3">
                            {Object.entries(selectedProperty.documents).map(([category, data]) => (
                              <div key={category} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600 capitalize">
                                  {category === 'legal' ? 'Légal' :
                                   category === 'financial' ? 'Financier' :
                                   category === 'technical' ? 'Technique' :
                                   category === 'environmental' ? 'Environnemental' :
                                   category === 'market' ? 'Marché' : category}
                                </span>
                                <div className="flex items-center">
                                  {data.score && (
                                    <span className="text-sm font-medium mr-2">
                                      {data.score}/100
                                    </span>
                                  )}
                                  <div className="w-20 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        data.score >= 80 ? 'bg-green-500' :
                                        data.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                                      }`}
                                      style={{ width: `${data.score || 0}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Documents Tab */}
                    {activeTab === 'documents' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Statut des Documents
                        </h3>
                        {Object.entries(selectedProperty.documents).map(([category, data]) => {
                          const StatusIcon = getDocumentStatusIcon(data.status);
                          return (
                            <div key={category} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                              <div className="flex items-center">
                                <StatusIcon className={`h-5 w-5 mr-3 ${
                                  data.status === 'verified' ? 'text-green-600' :
                                  data.status === 'pending' ? 'text-yellow-600' : 'text-red-600'
                                }`} />
                                <div>
                                  <h4 className="font-medium text-gray-900 capitalize">
                                    {category === 'legal' ? 'Documents Légaux' :
                                     category === 'financial' ? 'Documents Financiers' :
                                     category === 'technical' ? 'Rapports Techniques' :
                                     category === 'environmental' ? 'Études Environnementales' :
                                     category === 'market' ? 'Analyses de Marché' : category}
                                  </h4>
                                  <p className="text-sm text-gray-600">
                                    {data.status === 'verified' ? 'Vérifié et conforme' :
                                     data.status === 'pending' ? 'En cours de vérification' :
                                     'Problèmes détectés'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {data.issues !== null && (
                                  <span className="text-sm text-gray-600">
                                    {data.issues} problème(s)
                                  </span>
                                )}
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Findings Tab */}
                    {activeTab === 'findings' && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Principales Conclusions
                        </h3>
                        {selectedProperty.keyFindings.map((finding, index) => {
                          const FindingIcon = getFindingIcon(finding.type);
                          return (
                            <div key={index} className="flex items-start p-4 border border-gray-200 rounded-lg">
                              <FindingIcon className={`h-5 w-5 mr-3 mt-0.5 ${
                                finding.type === 'positive' ? 'text-green-600' :
                                finding.type === 'warning' ? 'text-yellow-600' : 'text-red-600'
                              }`} />
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-medium text-gray-900">
                                    {finding.category}
                                  </span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                                    {finding.severity === 'critical' ? 'Critique' :
                                     finding.severity === 'high' ? 'Élevé' :
                                     finding.severity === 'medium' ? 'Moyen' : 'Info'}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{finding.message}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Recommendations Tab */}
                    {activeTab === 'recommendations' && (
                      <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Recommandations d'Investissement
                        </h3>
                        
                        <div className={`p-6 rounded-lg ${
                          selectedProperty.overallScore >= 80 ? 'bg-green-50 border border-green-200' :
                          selectedProperty.overallScore >= 60 ? 'bg-yellow-50 border border-yellow-200' :
                          'bg-red-50 border border-red-200'
                        }`}>
                          <div className="flex items-center mb-4">
                            {selectedProperty.overallScore >= 80 ? (
                              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
                            ) : selectedProperty.overallScore >= 60 ? (
                              <AlertTriangle className="h-6 w-6 text-yellow-600 mr-3" />
                            ) : (
                              <XCircle className="h-6 w-6 text-red-600 mr-3" />
                            )}
                            <h4 className="text-lg font-semibold">
                              {selectedProperty.overallScore >= 80 ? 'Investissement Recommandé' :
                               selectedProperty.overallScore >= 60 ? 'Investissement avec Réserves' :
                               'Investissement Non Recommandé'}
                            </h4>
                          </div>
                          
                          <div className="space-y-3 text-sm">
                            {selectedProperty.overallScore >= 80 && (
                              <>
                                <p>✅ Profil de risque acceptable pour un investissement</p>
                                <p>✅ Documentation légale en ordre</p>
                                <p>✅ Potentiel d'appréciation intéressant</p>
                              </>
                            )}
                            {selectedProperty.overallScore >= 60 && selectedProperty.overallScore < 80 && (
                              <>
                                <p>⚠️ Quelques points à surveiller avant investissement</p>
                                <p>⚠️ Négociation du prix recommandée</p>
                                <p>⚠️ Suivi régulier nécessaire</p>
                              </>
                            )}
                            {selectedProperty.overallScore < 60 && (
                              <>
                                <p>❌ Risques trop élevés pour un investissement sûr</p>
                                <p>❌ Problèmes majeurs à résoudre avant acquisition</p>
                                <p>❌ Rechercher d'autres opportunités</p>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h5 className="font-medium text-blue-900 mb-2">Actions Prioritaires</h5>
                            <ul className="text-sm text-blue-800 space-y-1">
                              <li>• Vérification finale des documents légaux</li>
                              <li>• Négociation des conditions</li>
                              <li>• Planification des travaux nécessaires</li>
                            </ul>
                          </div>
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h5 className="font-medium text-purple-900 mb-2">Suivi Recommandé</h5>
                            <ul className="text-sm text-purple-800 space-y-1">
                              <li>• Réévaluation annuelle</li>
                              <li>• Monitoring du marché local</li>
                              <li>• Surveillance réglementaire</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DueDiligencePage;
