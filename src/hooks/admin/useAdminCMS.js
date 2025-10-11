/**
 * ========================================
 * useAdminCMS - Hook pour gestion CMS
 * ========================================
 * Date: 10 Octobre 2025
 * Utilise: CMSService
 */

import { useState, useEffect, useCallback } from 'react';
import CMSService from '@/services/admin/CMSService';

export function useAdminCMS() {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Charger toutes les pages
   */
  const loadPages = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    
    const result = await CMSService.getPages(filters);
    
    if (result.success) {
      setPages(result.pages);
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Charger une page par slug
   */
  const loadPageBySlug = useCallback(async (slug) => {
    setLoading(true);
    setError(null);
    
    const result = await CMSService.getPageBySlug(slug);
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Créer une page
   */
  const createPage = useCallback(async (pageData) => {
    setLoading(true);
    setError(null);
    
    const result = await CMSService.createPage(pageData);
    
    if (result.success) {
      // Recharger la liste
      await loadPages();
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, [loadPages]);

  /**
   * Mettre à jour une page
   */
  const updatePage = useCallback(async (pageId, updates) => {
    setLoading(true);
    setError(null);
    
    const result = await CMSService.updatePage(pageId, updates);
    
    if (result.success) {
      // Mettre à jour la liste locale
      setPages(prev => prev.map(p => p.id === pageId ? result.page : p));
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Publier une page
   */
  const publishPage = useCallback(async (pageId) => {
    setLoading(true);
    setError(null);
    
    const result = await CMSService.publishPage(pageId);
    
    if (result.success) {
      setPages(prev => prev.map(p => p.id === pageId ? result.page : p));
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Supprimer une page
   */
  const deletePage = useCallback(async (pageId) => {
    setLoading(true);
    setError(null);
    
    const result = await CMSService.deletePage(pageId);
    
    if (result.success) {
      setPages(prev => prev.filter(p => p.id !== pageId));
    } else {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Charger sections d'une page
   */
  const loadSections = useCallback(async (pageId) => {
    const result = await CMSService.getSections(pageId);
    return result;
  }, []);

  /**
   * Créer une section
   */
  const createSection = useCallback(async (sectionData) => {
    const result = await CMSService.createSection(sectionData);
    return result;
  }, []);

  /**
   * Mettre à jour une section
   */
  const updateSection = useCallback(async (sectionId, updates) => {
    const result = await CMSService.updateSection(sectionId, updates);
    return result;
  }, []);

  /**
   * Supprimer une section
   */
  const deleteSection = useCallback(async (sectionId) => {
    const result = await CMSService.deleteSection(sectionId);
    return result;
  }, []);

  /**
   * Charger médias
   */
  const loadMediaAssets = useCallback(async (filters = {}) => {
    const result = await CMSService.getMediaAssets(filters);
    return result;
  }, []);

  /**
   * Uploader un média
   */
  const uploadMedia = useCallback(async (file, metadata) => {
    setLoading(true);
    setError(null);
    
    const result = await CMSService.uploadMedia(file, metadata);
    
    if (!result.success) {
      setError(result.error);
    }
    
    setLoading(false);
    return result;
  }, []);

  /**
   * Mettre à jour un média
   */
  const updateMediaAsset = useCallback(async (assetId, updates) => {
    const result = await CMSService.updateMediaAsset(assetId, updates);
    return result;
  }, []);

  /**
   * Supprimer un média
   */
  const deleteMediaAsset = useCallback(async (assetId) => {
    const result = await CMSService.deleteMediaAsset(assetId);
    return result;
  }, []);

  // Charger pages au montage (optionnel)
  useEffect(() => {
    // loadPages(); // Décommenter si besoin d'auto-chargement
  }, []);

  return {
    // State
    pages,
    loading,
    error,
    
    // Pages
    loadPages,
    loadPageBySlug,
    createPage,
    updatePage,
    publishPage,
    deletePage,
    
    // Sections
    loadSections,
    createSection,
    updateSection,
    deleteSection,
    
    // Media
    loadMediaAssets,
    uploadMedia,
    updateMediaAsset,
    deleteMediaAsset
  };
}
