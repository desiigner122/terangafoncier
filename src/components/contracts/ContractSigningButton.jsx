/**
 * @file ContractSigningButton.jsx
 * @description Bouton pour générer et signer contrat DocuSign
 * @created 2025-11-03
 * @week 2 - Day 1-3
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileSignature, Loader2, CheckCircle2, AlertCircle, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';
import axios from 'axios';

const ContractSigningButton = ({ caseId, caseData, userRole, onContractCreated }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contract, setContract] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignDialog, setShowSignDialog] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  /**
   * Charger contrat existant
   */
  useEffect(() => {
    fetchExistingContract();
  }, [caseId]);

  const fetchExistingContract = async () => {
    try {
      setIsLoading(true);

      const { data, error } = await supabase
        .from('contracts')
        .select('*')
        .eq('case_id', caseId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows
        throw error;
      }

      setContract(data);

    } catch (error) {
      console.error('❌ Error fetching contract:', error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Générer nouveau contrat
   */
  const handleGenerateContract = async () => {
    try {
      setIsGenerating(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expirée');
        return;
      }

      const response = await axios.post(
        `${API_BASE}/docusign/create-contract`,
        { caseId, contractType: 'PURCHASE_CONTRACT' },
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );

      if (response.data.success) {
        toast.success('Contrat généré ! Emails de signature envoyés.');
        setContract(response.data.contract);
        
        if (onContractCreated) {
          onContractCreated(response.data.contract);
        }
      }

    } catch (error) {
      console.error('❌ Error generating contract:', error);
      toast.error(error.response?.data?.error || 'Erreur génération contrat');
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Ouvrir dialog signature
   */
  const handleOpenSigning = () => {
    setShowSignDialog(true);
  };

  /**
   * Rafraîchir statut
   */
  const handleRefreshStatus = async () => {
    try {
      if (!contract?.docusign_envelope_id) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await axios.get(
        `${API_BASE}/docusign/status/${contract.docusign_envelope_id}`,
        { headers: { Authorization: `Bearer ${session.access_token}` } }
      );

      if (response.data.success) {
        setContract(response.data.contract);
        toast.success('Statut mis à jour');
      }

    } catch (error) {
      console.error('❌ Error refreshing status:', error);
      toast.error('Erreur mise à jour statut');
    }
  };

  /**
   * Télécharger PDF signé
   */
  const handleDownloadSigned = async () => {
    try {
      if (!contract?.docusign_envelope_id) return;

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await axios.get(
        `${API_BASE}/docusign/download/${contract.docusign_envelope_id}`,
        { 
          headers: { Authorization: `Bearer ${session.access_token}` },
          responseType: 'blob',
        }
      );

      // Créer lien download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `contrat_${contract.id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast.success('Document téléchargé');

    } catch (error) {
      console.error('❌ Error downloading:', error);
      toast.error('Erreur téléchargement');
    }
  };

  /**
   * Obtenir URL signature selon rôle
   */
  const getSigningUrl = () => {
    if (!contract) return null;

    switch (userRole) {
      case 'particulier':
      case 'acheteur':
        return contract.buyer_signing_url;
      case 'vendeur_particulier':
      case 'vendeur_pro':
        return contract.seller_signing_url;
      case 'notaire':
        return contract.notaire_signing_url;
      default:
        return null;
    }
  };

  const signingUrl = getSigningUrl();

  // Status badges
  const getStatusBadge = () => {
    if (!contract) return null;

    const statusConfig = {
      pending_signatures: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      signing: { label: 'Signature en cours', color: 'bg-blue-100 text-blue-800' },
      signed: { label: 'Signé', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulé', color: 'bg-red-100 text-red-800' },
      expired: { label: 'Expiré', color: 'bg-gray-100 text-gray-800' },
    };

    const config = statusConfig[contract.status] || statusConfig.pending_signatures;

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </CardContent>
      </Card>
    );
  }

  // Aucun contrat généré
  if (!contract) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSignature className="w-5 h-5" />
            Signature Électronique
          </CardTitle>
          <CardDescription>
            Générez le contrat de vente pour signature par toutes les parties
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert className="mb-4 bg-blue-50 border-blue-200">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              Le contrat sera envoyé automatiquement par email à l'acheteur, au vendeur et au notaire.
              Chaque partie recevra un lien unique pour signer électroniquement.
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleGenerateContract}
            disabled={isGenerating}
            className="w-full bg-emerald-600 hover:bg-emerald-700"
            size="lg"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Génération en cours...
              </>
            ) : (
              <>
                <FileSignature className="w-4 h-4 mr-2" />
                Générer le contrat de vente
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Contrat existant
  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileSignature className="w-5 h-5" />
              <div>
                <CardTitle>Contrat de Vente</CardTitle>
                <CardDescription>Signature électronique DocuSign</CardDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Statut signatures */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Acheteur</span>
              {contract.buyer_signed ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Signé</span>
                </div>
              ) : (
                <span className="text-yellow-600">En attente</span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Vendeur</span>
              {contract.seller_signed ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Signé</span>
                </div>
              ) : (
                <span className="text-yellow-600">En attente</span>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Notaire</span>
              {contract.notaire_signed ? (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Signé</span>
                </div>
              ) : (
                <span className="text-yellow-600">En attente</span>
              )}
            </div>
          </div>

          {/* Actions selon rôle et statut */}
          <div className="space-y-2">
            {/* Bouton signer (si pas encore signé par ce user) */}
            {signingUrl && (
              <>
                {!contract.buyer_signed && userRole === 'acheteur' && (
                  <Button
                    onClick={handleOpenSigning}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <FileSignature className="w-4 h-4 mr-2" />
                    Signer le contrat
                  </Button>
                )}

                {!contract.seller_signed && ['vendeur_particulier', 'vendeur_pro'].includes(userRole) && (
                  <Button
                    onClick={handleOpenSigning}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <FileSignature className="w-4 h-4 mr-2" />
                    Signer le contrat
                  </Button>
                )}

                {!contract.notaire_signed && userRole === 'notaire' && (
                  <Button
                    onClick={handleOpenSigning}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    size="lg"
                  >
                    <FileSignature className="w-4 h-4 mr-2" />
                    Signer le contrat
                  </Button>
                )}
              </>
            )}

            {/* Télécharger si signé */}
            {contract.status === 'signed' && (
              <Button
                onClick={handleDownloadSigned}
                variant="outline"
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Télécharger le contrat signé
              </Button>
            )}

            {/* Rafraîchir statut */}
            <Button
              onClick={handleRefreshStatus}
              variant="outline"
              size="sm"
              className="w-full"
            >
              Rafraîchir le statut
            </Button>
          </div>

          {/* Alerte succès si tout signé */}
          {contract.status === 'signed' && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                🎉 Contrat entièrement signé ! Vous pouvez télécharger le document.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Dialog signature embedded */}
      <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Signer le contrat</DialogTitle>
            <DialogDescription>
              Suivez les instructions DocuSign pour apposer votre signature électronique
            </DialogDescription>
          </DialogHeader>

          {signingUrl ? (
            <iframe
              src={signingUrl}
              className="w-full h-full rounded border"
              title="DocuSign Signing"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">URL de signature non disponible</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContractSigningButton;
