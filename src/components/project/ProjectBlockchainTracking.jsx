import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, CheckCircle,
  Clock, Hash, Building2, AlertTriangle,
  Download, Eye, Verified, Lock
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import EmptyState from '@/components/ui/EmptyState';

const ProjectBlockchainTracking = ({ vefaCaseId, currentMilestone }) => {
  const [blockchainData, setBlockchainData] = useState(null);
  const [certificate, setCertificate] = useState(null);
  const [milestoneBlocks, setMilestoneBlocks] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState('checking');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBlockchainData();
  }, [vefaCaseId]);

  const loadBlockchainData = async () => {
    try {
      setLoading(true);

      if (!vefaCaseId) {
        setBlockchainData(null);
        setMilestoneBlocks([]);
        setVerificationStatus('empty');
        return;
      }

      // Transactions blockchain réelles liées au bien/projet
      const { data: transactions, error: txError } = await supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('property_id', vefaCaseId)
        .order('created_at', { ascending: true });

      if (txError) throw txError;

      // Certificat blockchain associé (le plus récent)
      const { data: certificates, error: certError } = await supabase
        .from('blockchain_certificates')
        .select('*')
        .eq('property_id', vefaCaseId)
        .order('created_at', { ascending: false })
        .limit(1);

      if (certError) throw certError;

      const txList = transactions || [];
      const latestCertificate = certificates && certificates.length > 0 ? certificates[0] : null;
      const confirmedCount = txList.filter(t => t.status === 'confirmed' || t.status === 'validated').length;

      setCertificate(latestCertificate);
      setMilestoneBlocks(txList);

      if (txList.length === 0 && !latestCertificate) {
        setBlockchainData(null);
        setVerificationStatus('empty');
        return;
      }

      setBlockchainData({
        caseId: vefaCaseId,
        totalBlocks: new Set(txList.map(t => t.block_number).filter(Boolean)).size,
        totalTransactions: txList.length,
        integrityScore: txList.length > 0 ? Math.round((confirmedCount / txList.length) * 100) : 0,
        lastBlockHash: txList.length > 0 ? txList[txList.length - 1].transaction_hash : null
      });

      setVerificationStatus(
        latestCertificate?.status === 'valid' || latestCertificate?.status === 'verified'
          ? 'verified'
          : 'checking'
      );

    } catch (error) {
      console.error('Erreur chargement blockchain:', error);
      setVerificationStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    const icons = {
      confirmed: CheckCircle,
      validated: CheckCircle,
      pending: Clock,
      failed: AlertTriangle
    };
    return icons[status] || Building2;
  };

  const getStatusColor = (status) => {
    const colors = {
      confirmed: '#10B981',
      validated: '#10B981',
      pending: '#F59E0B',
      failed: '#EF4444'
    };
    return colors[status] || '#6B7280';
  };

  const formatHash = (hash) => {
    if (!hash) return '—';
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
              : verificationStatus === 'empty'
              ? 'bg-gray-100 text-gray-600'
              : 'bg-red-100 text-red-800'
          }`}>
            {verificationStatus === 'verified' && <CheckCircle className="h-4 w-4" />}
            {verificationStatus === 'checking' && <Clock className="h-4 w-4" />}
            {verificationStatus === 'empty' && <Shield className="h-4 w-4" />}
            {verificationStatus === 'error' && <AlertTriangle className="h-4 w-4" />}
            <span className="capitalize">
              {verificationStatus === 'verified' ? 'Vérifié' :
               verificationStatus === 'empty' ? 'Aucune donnée' :
               verificationStatus === 'checking' ? 'En attente' : verificationStatus}
            </span>
          </div>
        </div>

        {blockchainData ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{blockchainData.totalBlocks}</div>
                <div className="text-sm text-gray-500">Blocs créés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{blockchainData.totalTransactions}</div>
                <div className="text-sm text-gray-500">Transactions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{blockchainData.integrityScore}%</div>
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
              <div className="text-xs text-gray-500 mb-1">Hash de la dernière transaction</div>
              <div className="font-mono text-sm text-gray-900 flex items-center space-x-2">
                <Hash className="h-4 w-4" />
                <span>{formatHash(blockchainData.lastBlockHash)}</span>
              </div>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-500">Aucune transaction blockchain enregistrée pour ce projet pour le moment.</p>
        )}
      </div>

      {/* Historique des transactions blockchain */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          Historique des Transactions Blockchain
        </h3>

        {milestoneBlocks.length === 0 ? (
          <EmptyState
            icon={Shield}
            title="Aucune transaction enregistrée"
            description="Les transactions blockchain liées à ce projet apparaîtront ici dès qu'elles seront enregistrées."
          />
        ) : (
          <div className="space-y-6">
            {milestoneBlocks.map((block, index) => {
              const Icon = getStatusIcon(block.status);
              const color = getStatusColor(block.status);

              return (
                <motion.div
                  key={block.id || index}
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
                          {block.block_number ? `Bloc #${block.block_number}` : 'Transaction'} - {block.status || 'inconnu'}
                        </h4>
                        <div className="text-sm text-gray-500">
                          {block.created_at ? new Date(block.created_at).toLocaleDateString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : '—'}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Hash de transaction</div>
                          <div className="font-mono text-sm text-gray-700">
                            {formatHash(block.transaction_hash)}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-gray-500 mb-1">Montant</div>
                          <div className="text-sm font-medium text-gray-900">
                            {block.amount ? `${Number(block.amount).toLocaleString('fr-FR')} FCFA` : '—'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* Certificat blockchain */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Certificats et Vérifications
        </h3>

        {certificate ? (
          <>
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-xs text-gray-500 mb-1">Hash du certificat</div>
              <div className="font-mono text-sm text-gray-900">{formatHash(certificate.certificate_hash)}</div>
              <div className="text-xs text-gray-500 mt-2">Statut : {certificate.status || 'inconnu'}</div>
            </div>
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
          </>
        ) : (
          <p className="text-sm text-gray-500">Aucun certificat blockchain n'a encore été émis pour ce projet.</p>
        )}

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