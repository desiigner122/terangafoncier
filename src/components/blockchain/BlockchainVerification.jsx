/**
 * 🔗 Composant Blockchain Verification
 * Affichage de l'intégrité blockchain d'un dossier immobilier
 */

import React, { useState, useEffect } from 'react';
import { Shield, Check, AlertTriangle, Download, Eye, Hash, Clock, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import PurchaseWorkflowService from '@/services/PurchaseWorkflowService';

const BlockchainVerification = ({ caseId, className = '' }) => {
  const [integrity, setIntegrity] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    loadBlockchainData();
  }, [caseId]);

  const loadBlockchainData = async () => {
    setLoading(true);
    try {
      const [integrityResult, historyResult] = await Promise.all([
        PurchaseWorkflowService.verifyBlockchainIntegrity(caseId),
        PurchaseWorkflowService.getBlockchainHistory(caseId)
      ]);

      if (integrityResult.success) {
        setIntegrity(integrityResult.integrity);
      }

      if (historyResult.success) {
        setHistory(historyResult.history);
      }
    } catch (error) {
      console.error('Erreur chargement blockchain:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateCertificate = async () => {
    try {
      const result = await PurchaseWorkflowService.generateBlockchainCertificate(caseId);
      if (result.success) {
        // Simuler téléchargement du certificat
        const certificateData = JSON.stringify(result.certificate, null, 2);
        const blob = new Blob([certificateData], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificat-blockchain-${caseId}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erreur génération certificat:', error);
    }
  };

  const getIntegrityColor = (score) => {
    if (score >= 99) return 'text-green-600 bg-green-50';
    if (score >= 95) return 'text-blue-600 bg-blue-50';
    if (score >= 80) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getTransactionIcon = (type) => {
    const icons = {
      case_creation: '📂',
      status_update: '🔄',
      document_upload: '📄',
      payment_processed: '💰',
      contract_signed: '✍️',
      property_transfer: '🏠',
      case_completed: '✅',
      dispute_opened: '⚠️',
      dispute_resolved: '✅'
    };
    return icons[type] || '🔗';
  };

  if (loading) {
    return (
      <div className={`p-6 bg-white rounded-lg border ${className}`}>
        <div className="flex items-center justify-center space-x-2">
          <Zap className="w-5 h-5 animate-spin" />
          <span>Vérification blockchain...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-6 bg-white rounded-lg border ${className}`}>
      {/* En-tête Blockchain */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Shield className="w-6 h-6 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Vérification Blockchain
            </h3>
            <p className="text-sm text-gray-500">
              Réseau Teranga • {history.length} transactions
            </p>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadBlockchainData}
            disabled={loading}
          >
            <Hash className="w-4 h-4 mr-2" />
            Re-vérifier
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={generateCertificate}
          >
            <Download className="w-4 h-4 mr-2" />
            Certificat
          </Button>
        </div>
      </div>

      {/* Score d'Intégrité */}
      {integrity && (
        <div className="mb-6 p-4 rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Score d'Intégrité
            </span>
            <Badge className={getIntegrityColor(integrity.integrity_score)}>
              {integrity.integrity_score}%
            </Badge>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full ${
                integrity.integrity_score >= 95 ? 'bg-green-600' :
                integrity.integrity_score >= 80 ? 'bg-yellow-600' : 'bg-red-600'
              }`}
              style={{ width: `${integrity.integrity_score}%` }}
            />
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              {integrity.verified_blocks} / {integrity.total_transactions} vérifiées
            </span>
            <span className={`font-medium ${
              integrity.is_valid ? 'text-green-600' : 'text-red-600'
            }`}>
              {integrity.is_valid ? (
                <><Check className="w-4 h-4 inline mr-1" />Authentique</>
              ) : (
                <><AlertTriangle className="w-4 h-4 inline mr-1" />Suspect</>
              )}
            </span>
          </div>
          
          <p className="text-xs text-gray-500 mt-1">
            Confiance: {integrity.confidence_level}
          </p>
        </div>
      )}

      {/* Historique Blockchain */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-700">
            Historique Blockchain
          </h4>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHistory(!showHistory)}
          >
            <Eye className="w-4 h-4 mr-1" />
            {showHistory ? 'Masquer' : 'Afficher'}
          </Button>
        </div>

        {showHistory && (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {history.map((tx, index) => (
              <div
                key={tx.transaction_id}
                className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-lg">{getTransactionIcon(tx.type)}</span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-gray-900 truncate">
                      {tx.type.replace('_', ' ').toUpperCase()}
                    </h5>
                    <Badge variant="outline" className="ml-2">
                      #{tx.block_number}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(tx.timestamp).toLocaleDateString('fr-FR', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                  
                  <div className="flex items-center mt-2 space-x-4 text-xs text-gray-400">
                    <span>TX: {tx.transaction_id.substring(0, 12)}...</span>
                    <span className={`flex items-center ${
                      tx.verified ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.verified ? (
                        <><Check className="w-3 h-3 mr-1" />Vérifié</>
                      ) : (
                        <><AlertTriangle className="w-3 h-3 mr-1" />Suspect</>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            {history.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Hash className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Aucune transaction blockchain trouvée</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Méta-données Blockchain */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-xs text-gray-500">
          <div>
            <span className="font-medium">Réseau:</span> Teranga Chain
          </div>
          <div>
            <span className="font-medium">Consensus:</span> Proof of Authority
          </div>
          <div>
            <span className="font-medium">Block Time:</span> 30s
          </div>
          <div>
            <span className="font-medium">Validateurs:</span> 3 actifs
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockchainVerification;