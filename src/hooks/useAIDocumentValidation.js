/**
 * @file useAIDocumentValidation.js
 * @description Hook pour validation documents par IA
 * @created 2025-11-03
 * @week 3 - Day 1-5
 */

import { useState } from 'react';
import { supabase } from '@/config/supabaseClient';
import { toast } from 'sonner';
import axios from 'axios';

export const useAIDocumentValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

  /**
   * Valider document avec IA
   * @param {String} documentId - ID document à valider
   * @param {String} documentType - Type: 'cni', 'passport', 'title_deed', 'contract'
   */
  const validateDocument = async (documentId, documentType) => {
    try {
      setIsValidating(true);
      setValidationResult(null);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expirée');
        return null;
      }

      // Appel API validation IA
      const response = await axios.post(
        `${API_BASE}/ai/validate-document`,
        {
          documentId,
          documentType,
        },
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (response.data.success) {
        setValidationResult(response.data.validation);
        
        // Toast selon résultat
        if (response.data.validation.isValid) {
          toast.success('✅ Document validé par l\'IA !');
        } else {
          toast.error(`❌ Document invalide: ${response.data.validation.issues.join(', ')}`);
        }

        return response.data.validation;
      }

    } catch (error) {
      console.error('❌ Error validating document:', error);
      toast.error(error.response?.data?.error || 'Erreur validation IA');
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  /**
   * Valider tous les documents d'un dossier
   * @param {String} caseId - Purchase case ID
   */
  const validateCaseDocuments = async (caseId) => {
    try {
      setIsValidating(true);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Session expirée');
        return null;
      }

      const response = await axios.post(
        `${API_BASE}/ai/validate-case-documents`,
        { caseId },
        {
          headers: { Authorization: `Bearer ${session.access_token}` },
        }
      );

      if (response.data.success) {
        setValidationResult(response.data.results);
        
        const validCount = response.data.results.filter(r => r.isValid).length;
        const totalCount = response.data.results.length;
        
        toast.success(`${validCount}/${totalCount} documents validés`);
        
        return response.data.results;
      }

    } catch (error) {
      console.error('❌ Error validating case documents:', error);
      toast.error('Erreur validation documents');
      return null;
    } finally {
      setIsValidating(false);
    }
  };

  return {
    validateDocument,
    validateCaseDocuments,
    isValidating,
    validationResult,
  };
};

export default useAIDocumentValidation;
