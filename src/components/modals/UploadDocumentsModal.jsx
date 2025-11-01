import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Upload, File, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabaseClient';

/**
 * Modal pour upload de documents (vendeur)
 */
const UploadDocumentsModal = ({
  isOpen,
  onClose,
  caseData,
  documentTypes, // Array de types requis
  action, // Action à effectuer
  nextStatus, // Prochain statut
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  // Labels des types de documents
  const documentLabels = {
    title_deed: 'Titre de propriété',
    land_certificate: 'Certificat foncier',
    tax_receipts: 'Quittances fiscales',
    non_mortgage_cert: 'Certificat de non-hypothèque',
    compliance_cert: 'Certificat de conformité',
    identity_card: 'Pièce d\'identité',
    proof_of_address: 'Justificatif de domicile',
  };

  /**
   * Gérer la sélection de fichier
   */
  const handleFileChange = (docType, event) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier la taille (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Fichier trop volumineux', {
          description: 'La taille maximale est de 10 MB',
        });
        return;
      }

      // Vérifier le type
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Type de fichier non supporté', {
          description: 'Formats acceptés: PDF, JPG, PNG',
        });
        return;
      }

      setFiles(prev => ({
        ...prev,
        [docType]: file,
      }));
    }
  };

  /**
   * Supprimer un fichier sélectionné
   */
  const handleRemoveFile = (docType) => {
    setFiles(prev => {
      const newFiles = { ...prev };
      delete newFiles[docType];
      return newFiles;
    });
  };

  /**
   * Uploader tous les fichiers
   */
  const handleUpload = async () => {
    // Vérifier que tous les documents requis sont fournis
    const missingDocs = documentTypes.filter(type => !files[type]);
    if (missingDocs.length > 0) {
      toast.error('Documents manquants', {
        description: `Veuillez fournir: ${missingDocs.map(t => documentLabels[t]).join(', ')}`,
      });
      return;
    }

    setLoading(true);

    try {
      const uploadPromises = [];
      const uploadedUrls = {};

      // Upload chaque fichier dans Supabase Storage
      for (const [docType, file] of Object.entries(files)) {
        const fileName = `${caseData.case_number}/${docType}_${Date.now()}_${file.name}`;
        
        const uploadPromise = supabase.storage
          .from('case-documents')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false,
          })
          .then(({ data, error }) => {
            if (error) throw error;
            
            // Récupérer l'URL publique
            const { data: urlData } = supabase.storage
              .from('case-documents')
              .getPublicUrl(fileName);
              
            uploadedUrls[docType] = {
              url: urlData.publicUrl,
              fileName: file.name,
              uploadedAt: new Date().toISOString(),
            };
          });

        uploadPromises.push(uploadPromise);
      }

      await Promise.all(uploadPromises);

      // Mettre à jour le dossier avec les documents
      const { error: updateError } = await supabase
        .from('purchase_cases')
        .update({
          documents: {
            ...caseData.documents,
            ...uploadedUrls,
          },
          metadata: {
            ...caseData.metadata,
            documents_uploaded_at: new Date().toISOString(),
            documents_uploaded: documentTypes,
          },
          status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq('id', caseData.id);

      if (updateError) throw updateError;

      // Créer notification pour le notaire
      if (caseData.notaire_id) {
        await supabase.from('notifications').insert({
          user_id: caseData.notaire_id,
          type: 'documents_uploaded',
          title: 'Nouveaux documents uploadés',
          message: `Le vendeur a fourni ${documentTypes.length} document(s) pour le dossier ${caseData.case_number}`,
          link: `/notaire/dossier/${caseData.case_number}`,
          metadata: {
            case_id: caseData.id,
            case_number: caseData.case_number,
            document_types: documentTypes,
            uploaded_count: documentTypes.length,
          },
        });
      }

      toast.success('✅ Documents uploadés avec succès', {
        description: `${documentTypes.length} document(s) envoyé(s)`,
        duration: 4000,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload', {
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-600" />
            Fournir les Documents Requis
          </DialogTitle>
          <DialogDescription>
            Dossier: {caseData.case_number}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Liste des documents à uploader */}
          {documentTypes.map((docType) => (
            <div key={docType} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">
                  {documentLabels[docType] || docType}
                </Label>
                {files[docType] && (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
              </div>

              {/* Zone de drop ou fichier sélectionné */}
              {!files[docType] ? (
                <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id={`file-${docType}`}
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileChange(docType, e)}
                  />
                  <label
                    htmlFor={`file-${docType}`}
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Cliquez pour sélectionner un fichier
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, PNG (max 10 MB)
                    </p>
                  </label>
                </div>
              ) : (
                <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <File className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">{files[docType].name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(files[docType].size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveFile(docType)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          ))}

          {/* Informations */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <strong>Important :</strong> Assurez-vous que tous les documents sont
              lisibles, à jour et correspondent aux originaux. Les documents seront
              vérifiés par le notaire.
            </AlertDescription>
          </Alert>

          {/* Progression */}
          {Object.keys(files).length > 0 && (
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                {Object.keys(files).length} / {documentTypes.length} document(s) sélectionné(s)
              </p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            onClick={handleUpload}
            disabled={Object.keys(files).length !== documentTypes.length || loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Upload en cours...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Envoyer les documents ({Object.keys(files).length}/{documentTypes.length})
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadDocumentsModal;
