import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, Camera, FileText, CheckCircle, 
  Clock, Hash, Building2, AlertTriangle,
  Download, Eye, Verified, Lock
} from 'lucide-react';
import { terangaBlockchain } from '../../services/TerangaBlockchainService';

const ProjectBlockchainTracking = ({ vefaCaseId, currentMilestone }) => {
  const [blockchainData, setBlockchainData] = useState(null);
  const [milestoneBlocks, setMilestoneBlocks] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState('checking');
  const [loading, setLoading] = useState(true);

  const blockchainService = terangaBlockchain;

  useEffect(() => {
    loadBlockchainData();
  }, [vefaCaseId]);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);
      
      // Simuler les données blockchain pour le projet
      const mockBlockchainData = {
        caseId: vefaCaseId,
        totalBlocks: 8,
        totalTransactions: 24,
        integrityScore: 100,
        lastBlockHash: '0x7f9c2a8b3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
        chainValidation: 'VALID',
        blocks: [
          {
            blockNumber: 1247,
            hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
            timestamp: '2024-07-20T10:30:00Z',
            milestone: 'RESERVATION',
            data: {
              reservationAmount: 4500000,
              clientSignature: 'verified',
              documents: ['reservation_contract.pdf']
            },
            transactions: 3
          },
          {
            blockNumber: 1263,
            hash: '0x2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c',
            timestamp: '2024-08-15T14:20:00Z',
            milestone: 'VEFA_CONTRACT',
            data: {
              contractValue: 45000000,
              vefaSignature: 'verified',
              deliveryGuarantee: 'confirmed',
              documents: ['vefa_contract.pdf', 'delivery_guarantee.pdf', 'insurance_damage.pdf']
            },
            transactions: 5
          },
          {
            blockNumber: 1298,
            hash: '0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d',
            timestamp: '2024-09-01T08:00:00Z',
            milestone: 'CONSTRUCTION_STARTED',
            data: {
              constructionPermit: 'validated',
              sitePhotos: ['site_before_1.jpg', 'site_before_2.jpg'],
              contractorCertification: 'verified'
            },
            transactions: 4
          },
          {
            blockNumber: 1342,
            hash: '0x4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e',
            timestamp: '2024-10-15T16:45:00Z',
            milestone: 'FOUNDATIONS',
            data: {
              foundationsCompletion: '100%',
              technicalInspection: 'passed',
              photos: ['foundations_1.jpg', 'foundations_2.jpg', 'foundations_3.jpg'],
              certifications: ['technical_inspection_report.pdf']
            },
            transactions: 6
          },
          {
            blockNumber: 1387,
            hash: '0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f',
            timestamp: '2024-11-30T12:30:00Z',
            milestone: 'STRUCTURE',
            data: {
              structureCompletion: '100%',
              concreteTests: 'passed',
              structuralInspection: 'validated',
              photos: ['structure_1.jpg', 'structure_2.jpg'],
              certifications: ['structural_report.pdf', 'concrete_tests.pdf']
            },
            transactions: 5
          }
        ]
      };

      setBlockchainData(mockBlockchainData);
      setMilestoneBlocks(mockBlockchainData.blocks);
      setVerificationStatus('verified');
      
    } catch (error) {
      console.error('Erreur chargement blockchain:', error);
      setVerificationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getMilestoneIcon = (milestone) => {
    const icons = {
      'RESERVATION': CheckCircle,
      'VEFA_CONTRACT': FileText,
      'CONSTRUCTION_STARTED': Building2,
      'FOUNDATIONS': Shield,
      'STRUCTURE': Building2
    };
    return icons[milestone] || Building2;
  };

  const getMilestoneColor = (milestone) => {
    const colors = {
      'RESERVATION': '#10B981',
      'VEFA_CONTRACT': '#3B82F6',
      'CONSTRUCTION_STARTED': '#F59E0B',
      'FOUNDATIONS': '#8B5CF6',
      'STRUCTURE': '#EC4899'
    };
    return colors[milestone] || '#6B7280';
  };

  const formatHash = (hash) => {
    return `${hash.slice(0, 8)}...${hash.slice(-8)}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status de vérification blockchain */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Vérification Blockchain</span>
          </h3>
          
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
            verificationStatus === 'verified' 
              ? 'bg-green-100 text-green-800'
              : verificationStatus === 'checking'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {verificationStatus === 'verified' && <CheckCircle className="h-4 w-4" />}
            {verificationStatus === 'checking' && <Clock className="h-4 w-4" />}
            {verificationStatus === 'error' && <AlertTriangle className="h-4 w-4" />}
            <span className="capitalize">{verificationStatus === 'verified' ? 'Vérifié' : verificationStatus}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{blockchainData?.totalBlocks}</div>
            <div className="text-sm text-gray-500">Blocs créés</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{blockchainData?.totalTransactions}</div>
            <div className="text-sm text-gray-500">Transactions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{blockchainData?.integrityScore}%</div>
            <div className="text-sm text-gray-500">Intégrité</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              <Verified className="h-8 w-8 mx-auto" />
            </div>
            <div className="text-sm text-gray-500">Certifié</div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-xs text-gray-500 mb-1">Hash de la chaîne actuelle</div>
          <div className="font-mono text-sm text-gray-900 flex items-center space-x-2">
            <Hash className="h-4 w-4" />
            <span>{formatHash(blockchainData?.lastBlockHash)}</span>
            <button className="text-blue-600 hover:text-blue-800">
              <Eye className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Historique des blocs par étape */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Historique Blockchain des Étapes
        </h3>

        <div className="space-y-6">
          {milestoneBlocks.map((block, index) => {
            const Icon = getMilestoneIcon(block.milestone);
            const color = getMilestoneColor(block.milestone);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-start space-x-4">
                  <div 
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: color + '20', color: color }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">
                        Bloc #{block.blockNumber} - {block.milestone.replace('_', ' ')}
                      </h4>
                      <div className="text-sm text-gray-500">
                        {new Date(block.timestamp).toLocaleDateString('fr-FR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Hash du bloc</div>
                        <div className="font-mono text-sm text-gray-700">
                          {formatHash(block.hash)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Transactions</div>
                        <div className="text-sm font-medium text-gray-900">
                          {block.transactions} enregistrements
                        </div>
                      </div>
                    </div>

                    {/* Données spécifiques de l'étape */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="text-xs font-medium text-gray-700 mb-2 uppercase">
                        Données enregistrées
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(block.data).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="text-gray-600 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                            </span>
                            <span className="text-gray-900 font-medium">
                              {Array.isArray(value) ? `${value.length} fichier(s)` : value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Photos et documents */}
                      {(block.data.photos || block.data.documents || block.data.certifications) && (
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex flex-wrap gap-2">
                            {block.data.photos && (
                              <div className="flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                <Camera className="h-3 w-3" />
                                <span>{block.data.photos.length} photo(s)</span>
                              </div>
                            )}
                            {block.data.documents && (
                              <div className="flex items-center space-x-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                <FileText className="h-3 w-3" />
                                <span>{block.data.documents.length} document(s)</span>
                              </div>
                            )}
                            {block.data.certifications && (
                              <div className="flex items-center space-x-1 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                <Verified className="h-3 w-3" />
                                <span>{block.data.certifications.length} certification(s)</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Actions blockchain */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Certificats et Vérifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            <Download className="h-4 w-4" />
            <span>Télécharger Certificat Blockchain</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors">
            <Eye className="h-4 w-4" />
            <span>Voir Détails Complets</span>
          </button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 text-blue-800">
            <Lock className="h-4 w-4" />
            <span className="text-sm font-medium">
              Toutes les données sont cryptées et immuables sur la blockchain TerangaChain
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectBlockchainTracking;