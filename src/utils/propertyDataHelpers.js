/**
 * Property Data Helpers
 * Utilitaires pour gérer les données des propriétés (prix, surface, référence)
 * Centralise la logique de fallback et formatage
 * @author Teranga Foncier Team
 */

/**
 * Obtenir le prix RÉEL d'une transaction
 * 
 * Ordre de priorité:
 * 1. purchase_case.purchase_price (prix validé/négocié)
 * 2. request.offered_price (offre acheteur)
 * 3. property.price (prix initial vendeur)
 * 
 * @param {object} purchaseCase - Dossier d'achat
 * @param {object} purchaseRequest - Demande d'achat
 * @param {object} property - Propriété/parcelle
 * @returns {number} Prix en FCFA (0 si non défini)
 */
export const getRealPrice = (purchaseCase, purchaseRequest, property) => {
  // 1. Prix validé dans le dossier (après négociation)
  if (purchaseCase?.purchase_price && purchaseCase.purchase_price > 0) {
    return purchaseCase.purchase_price;
  }

  // 2. Prix offert par l'acheteur
  if (purchaseRequest?.offered_price && purchaseRequest.offered_price > 0) {
    return purchaseRequest.offered_price;
  }

  // 3. Prix initial de la propriété
  if (property?.price && property.price > 0) {
    return property.price;
  }

  // 4. Fallback alternatif (anciennes colonnes)
  if (property?.prix && property.prix > 0) {
    return property.prix;
  }

  return 0;
};

/**
 * Obtenir la surface d'une propriété
 * Support multi-colonnes: surface, area, size, superficie
 * 
 * @param {object} property - Propriété/parcelle
 * @returns {number} Surface en m² (0 si non définie)
 */
export const getPropertySurface = (property) => {
  if (!property) return 0;

  // Ordre de priorité
  return property.surface 
    || property.area
    || property.size
    || property.superficie
    || 0;
};

/**
 * Obtenir la référence unique d'une propriété
 * 
 * Ordre de priorité:
 * 1. land_reference (référence cadastrale officielle)
 * 2. reference (référence custom)
 * 3. land_ref (alternative)
 * 4. id (8 premiers caractères en majuscules)
 * 
 * @param {object} property - Propriété/parcelle
 * @returns {string} Référence (N/A si aucune)
 */
export const getPropertyReference = (property) => {
  if (!property) return 'N/A';

  // Ordre de priorité
  if (property.land_reference) {
    return property.land_reference;
  }

  if (property.reference) {
    return property.reference;
  }

  if (property.land_ref) {
    return property.land_ref;
  }

  // Fallback: 8 premiers caractères de l'ID en majuscules
  if (property.id) {
    return property.id.slice(0, 8).toUpperCase();
  }

  return 'N/A';
};

/**
 * Formater un prix en FCFA
 * 
 * @param {number} price - Prix en FCFA
 * @param {object} options - Options de formatage
 * @param {boolean} options.showZero - Afficher "0 FCFA" au lieu de "Prix non défini" (default: false)
 * @returns {string} Prix formaté
 */
export const formatPrice = (price, options = {}) => {
  if (!price || price === 0) {
    return options.showZero ? '0 FCFA' : 'Prix non défini';
  }

  return `${price.toLocaleString('fr-FR')} FCFA`;
};

/**
 * Formater une surface en m²
 * 
 * @param {number} surface - Surface en m²
 * @param {object} options - Options de formatage
 * @param {boolean} options.showZero - Afficher "0 m²" au lieu de "Surface non définie" (default: false)
 * @returns {string} Surface formatée
 */
export const formatSurface = (surface, options = {}) => {
  if (!surface || surface === 0) {
    return options.showZero ? '0 m²' : 'Surface non définie';
  }

  return `${surface.toLocaleString('fr-FR')} m²`;
};

/**
 * Formater un montant générique
 * 
 * @param {number} amount - Montant
 * @param {string} unit - Unité (FCFA, m², etc.)
 * @returns {string} Montant formaté
 */
export const formatAmount = (amount, unit = 'FCFA') => {
  if (!amount || amount === 0) {
    return `0 ${unit}`;
  }

  return `${amount.toLocaleString('fr-FR')} ${unit}`;
};

/**
 * Calculer le prix par m²
 * 
 * @param {number} price - Prix total
 * @param {number} surface - Surface en m²
 * @returns {number} Prix par m² (0 si surface = 0)
 */
export const getPricePerSquareMeter = (price, surface) => {
  if (!price || !surface || surface === 0) {
    return 0;
  }

  return Math.round(price / surface);
};

/**
 * Formater le prix par m²
 * 
 * @param {number} price - Prix total
 * @param {number} surface - Surface en m²
 * @returns {string} Prix par m² formaté
 */
export const formatPricePerSquareMeter = (price, surface) => {
  const pricePerSqm = getPricePerSquareMeter(price, surface);

  if (pricePerSqm === 0) {
    return 'N/A';
  }

  return `${pricePerSqm.toLocaleString('fr-FR')} FCFA/m²`;
};

/**
 * Obtenir le statut d'une propriété
 * 
 * @param {object} property - Propriété/parcelle
 * @returns {string} Statut (disponible, vendu, etc.)
 */
export const getPropertyStatus = (property) => {
  if (!property) return 'inconnu';

  return property.status || property.statut || 'disponible';
};

/**
 * Vérifier si une propriété est disponible
 * 
 * @param {object} property - Propriété/parcelle
 * @returns {boolean} true si disponible
 */
export const isPropertyAvailable = (property) => {
  const status = getPropertyStatus(property);
  return status === 'disponible' || status === 'available';
};
