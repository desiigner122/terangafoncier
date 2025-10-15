/**
 * Composant d'upload de documents pour financement bancaire
 * Permet l'upload de fichiers vers Supabase Storage
 */

import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/lib/supabaseClient';

const DOCUMENT_TYPES = {
  salarySlip: { label: 'Bulletins de salaire (3 derniers mois)', accept: '.pdf,.jpg,.jpeg,.png' },
  bankStatement: { label: 'Relevés bancaires (6 derniers mois)', accept: '.pdf,.jpg,.jpeg,.png' },
  taxReturn: { label: 'Déclaration fiscale (2 dernières années)', accept: '.pdf,.jpg,.jpeg,.png' },
  employmentCertificate: { label: 'Attestation d\'emploi', accept: '.pdf,.jpg,.jpeg,.png' },
  identityCard: { label: 'Pièce d\'identité', accept: '.pdf,.jpg,.jpeg,.png' }
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export const DocumentUploader = ({ userId, onDocumentsChange }) => {
  const [documents, setDocuments] = useState({});
  const [uploading, setUploading] = useState({});
  const [errors, setErrors] = useState({});

  const uploadFile = async (docType, file) => {
    // Validation
    if (file.size > MAX_FILE_SIZE) {
      setErrors(prev => ({ ...prev, [docType]: 'Fichier trop volumineux (max 5MB)' }));
      return;
    }

    setUploading(prev => ({ ...prev, [docType]: true }));
    setErrors(prev => ({ ...prev, [docType]: null }));

    try {
      // Générer un nom unique
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${docType}_${Date.now()}.${fileExt}`;

      // Upload vers Supabase Storage
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;

      // Obtenir l'URL publique
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Mettre à jour l'état
      const newDocs = {
        ...documents,
        [docType]: {
          name: file.name,
          url: publicUrl,
          path: fileName,
          uploadedAt: new Date().toISOString()
        }
      };

      setDocuments(newDocs);
      onDocumentsChange?.(newDocs);

    } catch (error) {
      console.error('Erreur upload:', error);
      setErrors(prev => ({ ...prev, [docType]: error.message }));
    } finally {
      setUploading(prev => ({ ...prev, [docType]: false }));
    }
  };

  const removeDocument = async (docType) => {
    const doc = documents[docType];
    if (!doc) return;

    try {
      // Supprimer de Supabase Storage
      const { error } = await supabase.storage
        .from('documents')
        .remove([doc.path]);

      if (error) throw error;

      // Mettre à jour l'état
      const newDocs = { ...documents };
      delete newDocs[docType];
      setDocuments(newDocs);
      onDocumentsChange?.(newDocs);

    } catch (error) {
      console.error('Erreur suppression:', error);
    }
  };

  return (
    <div className="space-y-4">
      {Object.entries(DOCUMENT_TYPES).map(([key, config]) => (
        <div key={key} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                {config.label}
              </label>
              {errors[key] && (
                <p className="text-xs text-red-600 mt-1">{errors[key]}</p>
              )}
            </div>
            
            {/* Bouton upload ou fichier uploadé */}
            {documents[key] ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-green-50 border border-green-200 rounded px-3 py-1">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-700 max-w-xs truncate">
                    {documents[key].name}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDocument(key)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  id={`file-${key}`}
                  accept={config.accept}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadFile(key, file);
                  }}
                  className="hidden"
                  disabled={uploading[key]}
                />
                <label htmlFor={`file-${key}`}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={uploading[key]}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(`file-${key}`).click();
                    }}
                  >
                    {uploading[key] ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Upload...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Uploader
                      </>
                    )}
                  </Button>
                </label>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Résumé */}
      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-2 text-blue-800">
          <FileText className="w-4 h-4" />
          <span className="text-sm font-medium">
            Documents uploadés: {Object.keys(documents).length}/5
          </span>
        </div>
        {Object.keys(documents).length === 5 && (
          <p className="text-xs text-blue-600 mt-1">
            ✓ Tous les documents sont uploadés
          </p>
        )}
      </div>
    </div>
  );
};
