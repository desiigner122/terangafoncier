/**
 * Property Image Helpers
 * Utilitaires pour gérer les images des propriétés/parcelles
 * Centralise la logique de fallback et Supabase Storage
 * @author Teranga Foncier Team
 */

import { supabase } from '@/lib/supabaseClient';

/**
 * Obtenir l'URL complète d'une image de propriété
 * Gère les fallbacks et la construction d'URL Supabase Storage
 * 
 * @param {object} property - Objet propriété/parcelle
 * @returns {string|null} URL complète ou null si pas d'image
 */
export const getPropertyImageUrl = (property) => {
  if (!property) return null;

  // Ordre de priorité pour trouver l'image
  let imagePath = null;

  // 1. main_image (colonne principale dans properties)
  if (property.main_image) {
    imagePath = property.main_image;
  }
  // 2. image_url (alternative)
  else if (property.image_url) {
    imagePath = property.image_url;
  }
  // 3. photo_url (autre alternative)
  else if (property.photo_url) {
    imagePath = property.photo_url;
  }
  // 4. Premier élément de images[] si c'est un array
  else if (Array.isArray(property.images) && property.images.length > 0) {
    imagePath = property.images[0];
  }
  // 5. Parser images si c'est une string JSON
  else if (typeof property.images === 'string' && property.images.trim().length > 0) {
    try {
      const parsed = JSON.parse(property.images);
      if (Array.isArray(parsed) && parsed.length > 0) {
        imagePath = parsed[0];
      } else if (typeof parsed === 'string') {
        imagePath = parsed;
      }
    } catch (e) {
      // Si parsing échoue, utiliser la string directement
      imagePath = property.images;
    }
  }

  if (!imagePath) return null;

  // Si URL complète (http/https), retourner directement
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Sinon, construire URL Supabase Storage
  try {
    const { data } = supabase.storage.from('parcels').getPublicUrl(imagePath);
    return data?.publicUrl || null;
  } catch (error) {
    console.warn('⚠️ Erreur construction URL Supabase Storage:', error);
    return null;
  }
};

/**
 * Obtenir toutes les images d'une propriété
 * 
 * @param {object} property - Objet propriété/parcelle
 * @returns {string[]} Array d'URLs (vide si pas d'images)
 */
export const getAllPropertyImages = (property) => {
  if (!property) return [];

  const images = [];

  // 1. Main image d'abord
  const mainImage = getPropertyImageUrl(property);
  if (mainImage) {
    images.push(mainImage);
  }

  // 2. Images additionnelles
  if (Array.isArray(property.images)) {
    property.images.forEach((img, index) => {
      // Éviter de rajouter la main_image
      if (index === 0 && mainImage) return;

      const url = getPropertyImageUrl({ main_image: img });
      if (url && !images.includes(url)) {
        images.push(url);
      }
    });
  } else if (typeof property.images === 'string') {
    try {
      const parsed = JSON.parse(property.images);
      if (Array.isArray(parsed)) {
        parsed.forEach((img, index) => {
          if (index === 0 && mainImage) return;

          const url = getPropertyImageUrl({ main_image: img });
          if (url && !images.includes(url)) {
            images.push(url);
          }
        });
      }
    } catch (e) {
      // Ignorer erreur parsing
    }
  }

  return images;
};

/**
 * Vérifier si une propriété a des images
 * 
 * @param {object} property - Objet propriété/parcelle
 * @returns {boolean} true si au moins une image existe
 */
export const hasPropertyImages = (property) => {
  return getPropertyImageUrl(property) !== null;
};

/**
 * Obtenir un placeholder pour image manquante
 * 
 * @returns {string} URL du placeholder
 */
export const getImagePlaceholder = () => {
  return '/placeholder-property.jpg'; // À créer dans public/
};
