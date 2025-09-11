/**
 * ðŸ“œ DIGITAL CERTIFICATES MANAGER - PRIORITÃ‰ 1 UI  
 * ================================================
 * 
 * Composant pour Gestion Certificats NumÃ©riques Teranga Foncier
 * - Affichage certificats avec enrichissements IA
 * - VÃ©rification authenticity blockchain
 * - Export et partage sÃ©curisÃ©
 * - Monitoring validitÃ© et renouvellement
 * 
 * Version: 1.0 Production Ready
 */

import React, { useState, useEffect } from 'react';
import { 
  Certificate, 
  Download, 
  Share, 
  Eye, 
  Copy,
  CheckCircle, 
  XCircle, 
  Clock,
  Shield,
  Star,
  Calendar,
  User,
  MapPin,
  Hash,
  TrendingUp,
  AlertTriangle,
  ExternalLink,
  FileText
} from 'lucide-react';
import { terangaAI } from '../../services/TerangaAIService';

const DigitalCertificatesManager = ({ certificates = [], onCertificateAction }) => {
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list' | 'detail'
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Ã‰tats pour actions
  const [verifyingCert, setVerifyingCert] = useState(null);
  const [downloadingCert, setDownloadingCert] = useState(null);
  const [sharingCert, setSharingCert] = useState(null);

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // ðŸ”§ EFFETS ET UTILITAIRES
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

  useEffect(() => {
    // Auto-sÃ©lectionner le premier certificat si disponible
    if (certificates.length > 0 && !selectedCertificate) {
      setSelectedCertificate(certificates[0]);
    }
  }, [certificates]);

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = searchTerm === '' || 
      cert.subject?.titleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.subject?.owner?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || cert.metadata?.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const getCertificateStatusInfo = (certificate) => {
    const now = new Date();
    const validUntil = new Date(certificate.validUntil);
    const daysUntilExpiry = Math.ceil((validUntil - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'text-red-600', bg: 'bg-red-50', label: 'ExpirÃ©' };
    } else if (daysUntilExpiry < 30) {
      return { status: 'expiring', color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'Expire bientÃ´t' };
    } else {
      return { status: 'valid', color: 'text-green-600', bg: 'bg-green-50', label: 'Valide' };
    }
  };

  const getCertificationLevel = (certificate) => {
    const level = certificate.certificationLevel || certificate.metadata?.certificationLevel;
    switch (level) {
      case 'AI_ENHANCED_BLOCKCHAIN': return { label: 'IA Enhanced', color: 'text-purple-600', icon: Star };
      case 'BLOCKCHAIN_SECURED': return { label: 'Blockchain', color: 'text-blue-600', icon: Shield };
      default: return { label: 'Standard', color: 'text-gray-600', icon: Certificate };
    }
  };

  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
  // ðŸ”§ ACTIONS CERTIFICATS
  // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•

  const handleVerifyCertificate = async (certificate) => {
    setVerifyingCert(certificate.certificateId);
    try {
      // VÃ©rifier l'authenticity du certificat
      const verification = await terangaAI.verifySecureDocument(
        certificate.subject,
        certificate.security?.mainHash
      );
      
      // Callback pour mettre Ã  jour l'Ã©tat parent
      onCertificateAction?.('verify', certificate, verification);
      
    } catch (error) {
      console.error('âŒ Erreur vÃ©rification certificat:', error);
    } finally {
      setVerifyingCert(null);
    }
  };

  const handleDownloadCertificate = async (certificate) => {
    setDownloadingCert(certificate.certificateId);
    try {
      // GÃ©nÃ©rer le certificat au format PDF (simulÃ©)
      const pdfData = await generateCertificatePDF(certificate);
      
      // TÃ©lÃ©charger le fichier
      const blob = new Blob([pdfData], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificat_${certificate.subject.titleNumber}_${certificate.certificateId}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      onCertificateAction?.('download', certificate);
      
    } catch (error) {
      console.error('âŒ Erreur tÃ©lÃ©chargement certificat:', error);
    } finally {
      setDownloadingCert(null);
    }
  };

  const handleShareCertificate = async (certificate) => {
    setSharingCert(certificate.certificateId);
    try {
      // GÃ©nÃ©rer lien de partage sÃ©curisÃ©
      const shareUrl = `${window.location.origin}/certificates/verify/${certificate.certificateId}`;
      
      // Copier dans le presse-papier
      await navigator.clipboard.writeText(shareUrl);
      
      onCertificateAction?.('share', certificate, { shareUrl });
      
    } catch (error) {
      console.error('âŒ Erreur partage certificat:', error);
    } finally {
      setSharingCert(null);
    }
  };

  const generateCertificatePDF = async (certificate) => {
    // Simuler gÃ©nÃ©ration PDF (en production, utiliser jsPDF ou similar)
    const pdfContent = `
      CERTIFICAT NUMÃ‰RIQUE TERANGA FONCIER
      =====================================
      
      ID Certificat: ${certificate.certificateId}
      Ã‰mis le: ${new Date(certificate.issuedAt).toLocaleDateString('fr-FR')}
      Valide jusqu'au: ${new Date(certificate.validUntil).toLocaleDateString('fr-FR')}
      
      TITRE FONCIER
      -------------
      NumÃ©ro: ${certificate.subject.titleNumber}
      PropriÃ©taire: ${certificate.subject.owner}
      NIN: ${certificate.subject.nin}
      Localisation: ${certificate.subject.location}
      Surface: ${certificate.subject.surface} hectares
      
      SÃ‰CURITÃ‰ BLOCKCHAIN
      -------------------
      Hash Principal: ${certificate.security?.mainHash || 'N/A'}
      Signature: ${certificate.security?.certificateSignature || 'N/A'}
      
      VALIDATIONS IA
      --------------
      Fraude Check: ${certificate.validations?.fraudCheckPassed ? 'âœ… PassÃ©' : 'âŒ Ã‰chec'}
      Documents: ${certificate.validations?.documentsVerified ? 'âœ… VÃ©rifiÃ©s' : 'âŒ Non vÃ©rifiÃ©s'}
      AutoritÃ©: ${certificate.validations?.authorityValidated ? 'âœ… ValidÃ©e' : 'âŒ Non validÃ©e'}
      
      Ce certificat est authentifiÃ© par la blockchain Teranga Foncier.
    `;
    
    return new TextEncoder().encode(pdfContent);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tÃªte et contrÃ´les */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Certificate className="text-purple-600" />
            Certificats NumÃ©riques
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded-full">
              {filteredCertificates.length}
            </span>
          </h2>
          <p className="text-gray-600 mt-1">
            Gestion et vÃ©rification des certificats blockchain enrichis IA
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Barre de recherche */}
          <div className="relative">
            <input
              type="text"
              YOUR_API_KEY="Rechercher certificat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 w-64"
            />
            <Eye className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>

          {/* Filtre statut */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
          >
            <option value="all">Tous statuts</option>
            <option value="ACTIVE">Actifs</option>
            <option value="EXPIRING">Expirent bientÃ´t</option>
            <option value="EXPIRED">ExpirÃ©s</option>
          </select>

          {/* Mode d'affichage */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium ${
                viewMode === 'grid' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grille
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 text-sm font-medium border-l border-gray-300 ${
                viewMode === 'list' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Liste
            </button>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      {filteredCertificates.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <Certificate className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun certificat trouvÃ©</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'Aucun certificat ne correspond aux critÃ¨res de recherche.'
              : 'CrÃ©ez votre premier certificat numÃ©rique en hachant un titre foncier.'}
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6' : 'space-y-4'}>
          {filteredCertificates.map((certificate) => {
            const statusInfo = getCertificateStatusInfo(certificate);
            const certLevel = getCertificationLevel(certificate);
            
            return (
              <div
                key={certificate.certificateId}
                className={`bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow ${
                  selectedCertificate?.certificateId === certificate.certificateId ? 'ring-2 ring-purple-500 border-purple-500' : ''
                } ${viewMode === 'list' ? 'p-4' : 'p-6'}`}
                onClick={() => setSelectedCertificate(certificate)}
              >
                {/* En-tÃªte certificat */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${statusInfo.bg}`}>
                      <certLevel.icon className={`w-5 h-5 ${certLevel.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {certificate.subject?.titleNumber || 'Titre N/A'}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {certificate.certificateId.substring(0, 16)}...
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${statusInfo.bg} ${statusInfo.color} font-medium`}>
                      {statusInfo.label}
                    </span>
                  </div>
                </div>

                {/* Informations principale */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900 font-medium">
                      {certificate.subject?.owner || 'PropriÃ©taire N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      {certificate.subject?.location || 'Localisation N/A'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Ã‰mis le {new Date(certificate.issuedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  {certificate.aiEnrichments?.marketValuation && (
                    <div className="flex items-center gap-2 text-sm">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-gray-600">
                        Valeur IA: {certificate.aiEnrichments.marketValuation.prix_estime_fcfa?.toLocaleString()} FCFA
                      </span>
                    </div>
                  )}
                </div>

                {/* Indicateurs de validation */}
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center gap-1 text-xs">
                    {certificate.validations?.fraudCheckPassed ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span className={certificate.validations?.fraudCheckPassed ? 'text-green-600' : 'text-red-600'}>
                      Anti-fraude
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    {certificate.validations?.documentsVerified ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span className={certificate.validations?.documentsVerified ? 'text-green-600' : 'text-red-600'}>
                      Documents
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    {certificate.validations?.authorityValidated ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <XCircle className="w-3 h-3 text-red-500" />
                    )}
                    <span className={certificate.validations?.authorityValidated ? 'text-green-600' : 'text-red-600'}>
                      AutoritÃ©
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs">
                    <Shield className="w-3 h-3 text-blue-500" />
                    <span className="text-blue-600">
                      {certLevel.label}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVerifyCertificate(certificate);
                      }}
                      disabled={verifyingCert === certificate.certificateId}
                      className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 disabled:opacity-50"
                    >
                      {verifyingCert === certificate.certificateId ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                      ) : (
                        <Shield className="w-3 h-3" />
                      )}
                      VÃ©rifier
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDownloadCertificate(certificate);
                      }}
                      disabled={downloadingCert === certificate.certificateId}
                      className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 disabled:opacity-50"
                    >
                      {downloadingCert === certificate.certificateId ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                      ) : (
                        <Download className="w-3 h-3" />
                      )}
                      PDF
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShareCertificate(certificate);
                      }}
                      disabled={sharingCert === certificate.certificateId}
                      className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 disabled:opacity-50"
                    >
                      {sharingCert === certificate.certificateId ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Share className="w-3 h-3" />
                      )}
                      {sharingCert === certificate.certificateId ? 'CopiÃ©!' : 'Partager'}
                    </button>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCertificate(certificate);
                      setViewMode('detail');
                    }}
                    className="text-xs text-gray-500 hover:text-gray-700 flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    DÃ©tails
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Panneau de dÃ©tails */}
      {selectedCertificate && viewMode === 'detail' && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* En-tÃªte modal */}
            <div className="bg-purple-600 text-white p-6 rounded-t-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold">Certificat NumÃ©rique DÃ©taillÃ©</h2>
                  <p className="text-purple-100">
                    {selectedCertificate.subject?.titleNumber} - {selectedCertificate.certificateId.substring(0, 16)}...
                  </p>
                </div>
                <button
                  onClick={() => setViewMode('grid')}
                  className="text-white hover:text-purple-200"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Contenu dÃ©taillÃ© */}
            <div className="p-6 space-y-6">
              {/* Informations principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">Informations du Titre</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">NumÃ©ro Titre:</span>
                      <span className="font-medium">{selectedCertificate.subject?.titleNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">PropriÃ©taire:</span>
                      <span className="font-medium">{selectedCertificate.subject?.owner}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">NIN:</span>
                      <span className="font-medium">{selectedCertificate.subject?.nin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Surface:</span>
                      <span className="font-medium">{selectedCertificate.subject?.surface} hectares</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Localisation:</span>
                      <span className="font-medium">{selectedCertificate.subject?.location}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">SÃ©curitÃ© Blockchain</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600">Hash Principal:</span>
                      <div className="text-right max-w-[200px]">
                        <code className="text-xs bg-gray-100 p-1 rounded break-all">
                          {selectedCertificate.security?.mainHash || 'N/A'}
                        </code>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Algorithme:</span>
                      <span className="font-medium">{selectedCertificate.metadata?.algorithm || 'SHA-256'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">RÃ©seau:</span>
                      <span className="font-medium">{selectedCertificate.metadata?.blockchainNetwork || 'SENEGAL_LAND_REGISTRY'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enrichissements IA */}
              {selectedCertificate.aiEnrichments && (
                <div className="bg-blue-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-blue-600" />
                    Enrichissements IA
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedCertificate.aiEnrichments.marketValuation && (
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-900 mb-2">Ã‰valuation MarchÃ©</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Valeur estimÃ©e:</span>
                            <span className="font-medium text-green-600">
                              {selectedCertificate.aiEnrichments.marketValuation.prix_estime_fcfa?.toLocaleString()} FCFA
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Confiance:</span>
                            <span className="font-medium">
                              {Math.round((selectedCertificate.aiEnrichments.marketValuation.score_confiance || 0) * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedCertificate.aiEnrichments.fraudRiskAssessment && (
                      <div className="bg-white p-3 rounded border">
                        <h4 className="font-medium text-gray-900 mb-2">Ã‰valuation Fraude</h4>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Score fraude:</span>
                            <span className={`font-medium ${
                              selectedCertificate.aiEnrichments.fraudRiskAssessment.fraudScore < 0.3 
                                ? 'text-green-600' : selectedCertificate.aiEnrichments.fraudRiskAssessment.fraudScore < 0.7
                                ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {Math.round((selectedCertificate.aiEnrichments.fraudRiskAssessment.fraudScore || 0) * 100)}%
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Niveau risque:</span>
                            <span className="font-medium">
                              {selectedCertificate.aiEnrichments.fraudRiskAssessment.riskLevel || 'LOW'}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ChaÃ®ne de confiance */}
              {selectedCertificate.security?.chainOfTrust && (
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900 border-b pb-2">ChaÃ®ne de Confiance</h3>
                  
                  <div className="space-y-3">
                    {selectedCertificate.security.chainOfTrust.map((trust, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <div className="bg-green-100 text-green-600 rounded-full p-1">
                          <CheckCircle className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            Niveau {trust.level}: {trust.authority}
                          </div>
                          <div className="text-sm text-gray-500">
                            ValidÃ© le {new Date(trust.timestamp).toLocaleString('fr-FR')}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between pt-4 border-t">
                <div className="flex gap-3">
                  <button
                    onClick={() => handleDownloadCertificate(selectedCertificate)}
                    disabled={downloadingCert === selectedCertificate.certificateId}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {downloadingCert === selectedCertificate.certificateId ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <Download className="w-4 h-4" />
                    )}
                    TÃ©lÃ©charger PDF
                  </button>

                  <button
                    onClick={() => handleShareCertificate(selectedCertificate)}
                    disabled={sharingCert === selectedCertificate.certificateId}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                  >
                    {sharingCert === selectedCertificate.certificateId ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Share className="w-4 h-4" />
                    )}
                    {sharingCert === selectedCertificate.certificateId ? 'Lien copiÃ©!' : 'Partager'}
                  </button>
                </div>

                <button
                  onClick={() => handleVerifyCertificate(selectedCertificate)}
                  disabled={verifyingCert === selectedCertificate.certificateId}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {verifyingCert === selectedCertificate.certificateId ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  VÃ©rifier AuthenticitÃ©
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DigitalCertificatesManager;
