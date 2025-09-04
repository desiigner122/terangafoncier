// Script pour corriger les données simulées avec FCFA Sénégalais
import { createClient } from '@supabase/supabase-js';

// Configuration Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Données réalistes pour le marché immobilier sénégalais en FCFA
const REALISTIC_SENEGAL_DATA = {
  // Prix par m² selon les zones (en FCFA)
  pricePerM2: {
    'Dakar-Centre': { min: 200000, max: 800000 },
    'Dakar-Périphérie': { min: 80000, max: 250000 },
    'Thiès': { min: 50000, max: 150000 },
    'Saint-Louis': { min: 40000, max: 120000 },
    'Kaolack': { min: 35000, max: 100000 },
    'Ziguinchor': { min: 30000, max: 90000 },
    'Tambacounda': { min: 25000, max: 70000 },
    'Kolda': { min: 20000, max: 60000 }
  },
  
  // Types de propriétés avec prix moyens
  propertyTypes: [
    { type: 'Terrain nu', minPrice: 5000000, maxPrice: 500000000 },
    { type: 'Villa', minPrice: 50000000, maxPrice: 2000000000 },
    { type: 'Appartement', minPrice: 25000000, maxPrice: 800000000 },
    { type: 'Duplex', minPrice: 80000000, maxPrice: 1500000000 },
    { type: 'Studio', minPrice: 15000000, maxPrice: 100000000 },
    { type: 'Bureau', minPrice: 30000000, maxPrice: 1200000000 },
    { type: 'Entrepôt', minPrice: 100000000, maxPrice: 3000000000 },
    { type: 'Local commercial', minPrice: 20000000, maxPrice: 800000000 }
  ],

  // Régions du Sénégal avec leurs départements
  regions: {
    'Dakar': ['Dakar', 'Guédiawaye', 'Pikine', 'Rufisque'],
    'Thiès': ['Thiès', 'Mbour', 'Tivaouane'],
    'Saint-Louis': ['Saint-Louis', 'Dagana', 'Podor'],
    'Diourbel': ['Diourbel', 'Bambey', 'Mbacké'],
    'Kaolack': ['Kaolack', 'Guinguinéo', 'Nioro du Rip'],
    'Tambacounda': ['Tambacounda', 'Bakel', 'Goudiry', 'Koumpentoum'],
    'Ziguinchor': ['Ziguinchor', 'Bignona', 'Oussouye'],
    'Kolda': ['Kolda', 'Médina Yoro Foulah', 'Vélingara'],
    'Fatick': ['Fatick', 'Foundiougne', 'Gossas'],
    'Kaffrine': ['Kaffrine', 'Birkelane', 'Koungheul', 'Malem-Hodar'],
    'Kédougou': ['Kédougou', 'Saraya', 'Salémata'],
    'Louga': ['Louga', 'Kébémer', 'Linguère'],
    'Matam': ['Matam', 'Kanel', 'Ranérou'],
    'Sédhiou': ['Sédhiou', 'Bounkiling', 'Goudomp']
  },

  // Statistiques du marché
  marketStats: {
    averagePrice: 85000000, // 85 millions FCFA
    medianPrice: 45000000,  // 45 millions FCFA
    currency: 'FCFA',
    currencySymbol: 'FCFA',
    priceGrowth: 8.5, // Croissance annuelle en %
    demandIndex: 85,
    supplyIndex: 65
  }
};

// Fonction pour formater les prix en FCFA
export const formatPrice = (price, options = {}) => {
  const { 
    showSymbol = true, 
    abbreviated = false,
    locale = 'fr-SN' 
  } = options;

  if (abbreviated) {
    if (price >= 1000000000) {
      return `${(price / 1000000000).toFixed(1)}Md ${showSymbol ? 'FCFA' : ''}`;
    } else if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M ${showSymbol ? 'FCFA' : ''}`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K ${showSymbol ? 'FCFA' : ''}`;
    }
  }

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'XOF', // Code ISO pour le Franc CFA
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price).replace('XOF', 'FCFA');
};

// Fonction pour générer un prix aléatoire selon la zone
export const generateRealisticPrice = (region, department, propertyType, surface = 100) => {
  const zoneKey = region === 'Dakar' ? 
    (department === 'Dakar' ? 'Dakar-Centre' : 'Dakar-Périphérie') : 
    region;
  
  const priceRange = REALISTIC_SENEGAL_DATA.pricePerM2[zoneKey] || 
                     REALISTIC_SENEGAL_DATA.pricePerM2['Kolda'];
  
  const pricePerM2 = Math.floor(
    Math.random() * (priceRange.max - priceRange.min) + priceRange.min
  );
  
  return pricePerM2 * surface;
};

// Fonction pour corriger les propriétés existantes
export const updatePropertiesWithFCFA = async () => {
  try {
    console.log('🔄 Mise à jour des prix en FCFA...');
    
    // Récupérer toutes les propriétés
    const { data: properties, error } = await supabase
      .from('properties')
      .select('*');
    
    if (error) throw error;
    
    const updates = properties.map(property => {
      const newPrice = generateRealisticPrice(
        property.region,
        property.department,
        property.type,
        property.surface || 100
      );
      
      return {
        id: property.id,
        price: newPrice,
        currency: 'FCFA',
        price_per_m2: Math.floor(newPrice / (property.surface || 100))
      };
    });
    
    // Mise à jour par batch
    for (const update of updates) {
      await supabase
        .from('properties')
        .update({
          price: update.price,
          currency: update.currency,
          price_per_m2: update.price_per_m2
        })
        .eq('id', update.id);
    }
    
    console.log(`✅ ${updates.length} propriétés mises à jour avec des prix FCFA réalistes`);
    return updates;
    
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour:', error);
    throw error;
  }
};

// Fonction pour créer des données de démonstration réalistes
export const createRealisticDemoData = async () => {
  try {
    console.log('🏗️ Création de données de démonstration réalistes...');
    
    const demoProperties = [];
    const regions = Object.keys(REALISTIC_SENEGAL_DATA.regions);
    
    for (let i = 0; i < 50; i++) {
      const region = regions[Math.floor(Math.random() * regions.length)];
      const departments = REALISTIC_SENEGAL_DATA.regions[region];
      const department = departments[Math.floor(Math.random() * departments.length)];
      const propertyType = REALISTIC_SENEGAL_DATA.propertyTypes[
        Math.floor(Math.random() * REALISTIC_SENEGAL_DATA.propertyTypes.length)
      ];
      
      const surface = Math.floor(Math.random() * 500) + 50; // 50-550 m²
      const price = generateRealisticPrice(region, department, propertyType.type, surface);
      
      demoProperties.push({
        title: `${propertyType.type} - ${department}`,
        description: `Magnifique ${propertyType.type.toLowerCase()} situé à ${department}, région de ${region}`,
        type: propertyType.type,
        price: price,
        currency: 'FCFA',
        price_per_m2: Math.floor(price / surface),
        surface: surface,
        region: region,
        department: department,
        commune: `${department} Centre`,
        address: `Quartier résidentiel, ${department}`,
        bedrooms: Math.floor(Math.random() * 5) + 1,
        bathrooms: Math.floor(Math.random() * 3) + 1,
        features: ['Électricité', 'Eau courante', 'Sécurisé'],
        status: 'available',
        created_at: new Date().toISOString()
      });
    }
    
    // Insertion des propriétés de démonstration
    const { data, error } = await supabase
      .from('properties')
      .insert(demoProperties);
    
    if (error) throw error;
    
    console.log(`✅ ${demoProperties.length} propriétés de démonstration créées`);
    return demoProperties;
    
  } catch (error) {
    console.error('❌ Erreur lors de la création des données:', error);
    throw error;
  }
};

// Configuration des devises pour l'application
export const CURRENCY_CONFIG = {
  primary: {
    code: 'FCFA',
    symbol: 'FCFA',
    name: 'Franc CFA Ouest-Africain',
    country: 'Sénégal',
    locale: 'fr-SN'
  },
  conversions: {
    EUR: 655.957, // 1 EUR = 655.957 FCFA (taux fixe)
    USD: 580.0,   // Approximatif selon les fluctuations
    GBP: 750.0    // Approximatif
  }
};

// Exportation pour utilisation dans l'application
export default {
  REALISTIC_SENEGAL_DATA,
  formatPrice,
  generateRealisticPrice,
  updatePropertiesWithFCFA,
  createRealisticDemoData,
  CURRENCY_CONFIG
};
