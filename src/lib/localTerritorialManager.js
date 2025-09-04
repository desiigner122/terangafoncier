/**
 * Système de données territoriales simulées
 * Version complète avec données pré-définies du Sénégal
 */

// Données territoriales complètes du Sénégal
export const TERRITORIAL_DATA = {
  regions: [
    { id: 'dakar', name: 'Dakar', code: 'DK' },
    { id: 'thies', name: 'Thiès', code: 'TH' },
    { id: 'fatick', name: 'Fatick', code: 'FK' },
    { id: 'kaolack', name: 'Kaolack', code: 'KL' },
    { id: 'saint-louis', name: 'Saint-Louis', code: 'SL' },
    { id: 'louga', name: 'Louga', code: 'LG' },
    { id: 'matam', name: 'Matam', code: 'MT' },
    { id: 'tambacounda', name: 'Tambacounda', code: 'TB' },
    { id: 'kedougou', name: 'Kédougou', code: 'KD' },
    { id: 'kolda', name: 'Kolda', code: 'KO' },
    { id: 'sedhiou', name: 'Sédhiou', code: 'SD' },
    { id: 'ziguinchor', name: 'Ziguinchor', code: 'ZG' },
    { id: 'diourbel', name: 'Diourbel', code: 'DB' },
    { id: 'kaffrine', name: 'Kaffrine', code: 'KF' }
  ],
  
  departments: [
    // Région Dakar
    { id: 'dakar-dakar', name: 'Dakar', regionId: 'dakar' },
    { id: 'dakar-guediawaye', name: 'Guédiawaye', regionId: 'dakar' },
    { id: 'dakar-pikine', name: 'Pikine', regionId: 'dakar' },
    { id: 'dakar-rufisque', name: 'Rufisque', regionId: 'dakar' },
    
    // Région Thiès
    { id: 'thies-thies', name: 'Thiès', regionId: 'thies' },
    { id: 'thies-mbour', name: 'Mbour', regionId: 'thies' },
    { id: 'thies-tivaouane', name: 'Tivaouane', regionId: 'thies' },
    
    // Région Fatick
    { id: 'fatick-fatick', name: 'Fatick', regionId: 'fatick' },
    { id: 'fatick-foundiougne', name: 'Foundiougne', regionId: 'fatick' },
    { id: 'fatick-gossas', name: 'Gossas', regionId: 'fatick' },
    
    // Région Kaolack
    { id: 'kaolack-kaolack', name: 'Kaolack', regionId: 'kaolack' },
    { id: 'kaolack-nioro', name: 'Nioro du Rip', regionId: 'kaolack' },
    { id: 'kaolack-guinguineo', name: 'Guinguinéo', regionId: 'kaolack' },
    
    // Région Saint-Louis
    { id: 'saint-louis-saint-louis', name: 'Saint-Louis', regionId: 'saint-louis' },
    { id: 'saint-louis-dagana', name: 'Dagana', regionId: 'saint-louis' },
    { id: 'saint-louis-podor', name: 'Podor', regionId: 'saint-louis' }
  ],
  
  communes: [
    // Département Dakar
    { id: 'dakar-ville', name: 'Dakar', departmentId: 'dakar-dakar', regionId: 'dakar' },
    { id: 'goree', name: 'Gorée', departmentId: 'dakar-dakar', regionId: 'dakar' },
    { id: 'parcelles-assainies', name: 'Parcelles Assainies', departmentId: 'dakar-dakar', regionId: 'dakar' },
    
    // Département Guédiawaye
    { id: 'guediawaye-ville', name: 'Guédiawaye', departmentId: 'dakar-guediawaye', regionId: 'dakar' },
    { id: 'golf-sud', name: 'Golf Sud', departmentId: 'dakar-guediawaye', regionId: 'dakar' },
    
    // Département Pikine
    { id: 'pikine-ville', name: 'Pikine', departmentId: 'dakar-pikine', regionId: 'dakar' },
    { id: 'thiaroye', name: 'Thiaroye', departmentId: 'dakar-pikine', regionId: 'dakar' },
    
    // Département Rufisque
    { id: 'rufisque-ville', name: 'Rufisque', departmentId: 'dakar-rufisque', regionId: 'dakar' },
    { id: 'bargny', name: 'Bargny', departmentId: 'dakar-rufisque', regionId: 'dakar' },
    
    // Département Thiès
    { id: 'thies-nord', name: 'Thiès Nord', departmentId: 'thies-thies', regionId: 'thies' },
    { id: 'thies-sud', name: 'Thiès Sud', departmentId: 'thies-thies', regionId: 'thies' },
    
    // Département Mbour
    { id: 'mbour-ville', name: 'Mbour', departmentId: 'thies-mbour', regionId: 'thies' },
    { id: 'joal-fadiouth', name: 'Joal-Fadiouth', departmentId: 'thies-mbour', regionId: 'thies' },
    { id: 'saly', name: 'Saly', departmentId: 'thies-mbour', regionId: 'thies' },
    
    // Département Fatick
    { id: 'fatick-ville', name: 'Fatick', departmentId: 'fatick-fatick', regionId: 'fatick' },
    { id: 'diakhao', name: 'Diakhao', departmentId: 'fatick-fatick', regionId: 'fatick' },
    
    // Département Foundiougne
    { id: 'foundiougne-ville', name: 'Foundiougne', departmentId: 'fatick-foundiougne', regionId: 'fatick' },
    { id: 'passy', name: 'Passy', departmentId: 'fatick-foundiougne', regionId: 'fatick' },
    { id: 'sokone', name: 'Sokone', departmentId: 'fatick-foundiougne', regionId: 'fatick' },
    
    // Département Kaolack
    { id: 'kaolack-ville', name: 'Kaolack', departmentId: 'kaolack-kaolack', regionId: 'kaolack' },
    { id: 'latmingue', name: 'Latmingué', departmentId: 'kaolack-kaolack', regionId: 'kaolack' },
    
    // Département Saint-Louis
    { id: 'saint-louis-ville', name: 'Saint-Louis', departmentId: 'saint-louis-saint-louis', regionId: 'saint-louis' },
    { id: 'mpal', name: 'Mpal', departmentId: 'saint-louis-saint-louis', regionId: 'saint-louis' }
  ]
};

class LocalTerritorialManager {
  
  // Obtenir toutes les régions
  getRegions() {
    return Promise.resolve(TERRITORIAL_DATA.regions);
  }
  
  // Obtenir les départements d'une région
  getDepartmentsByRegion(regionId) {
    const departments = TERRITORIAL_DATA.departments.filter(dept => dept.regionId === regionId);
    return Promise.resolve(departments);
  }
  
  // Obtenir les communes d'un département
  getCommunesByDepartment(departmentId) {
    const communes = TERRITORIAL_DATA.communes.filter(commune => commune.departmentId === departmentId);
    return Promise.resolve(communes);
  }
  
  // Obtenir les communes d'une région
  getCommunesByRegion(regionId) {
    const communes = TERRITORIAL_DATA.communes.filter(commune => commune.regionId === regionId);
    return Promise.resolve(communes);
  }
  
  // Obtenir une région par ID
  getRegion(regionId) {
    const region = TERRITORIAL_DATA.regions.find(r => r.id === regionId);
    return Promise.resolve(region);
  }
  
  // Obtenir un département par ID
  getDepartment(departmentId) {
    const department = TERRITORIAL_DATA.departments.find(d => d.id === departmentId);
    return Promise.resolve(department);
  }
  
  // Obtenir une commune par ID
  getCommune(communeId) {
    const commune = TERRITORIAL_DATA.communes.find(c => c.id === communeId);
    return Promise.resolve(commune);
  }
  
  // Obtenir la hiérarchie complète pour une commune
  async getTerritorialHierarchy(communeId) {
    const commune = await this.getCommune(communeId);
    if (!commune) return null;
    
    const department = await this.getDepartment(commune.departmentId);
    const region = await this.getRegion(commune.regionId);
    
    return {
      commune,
      department,
      region
    };
  }
  
  // Rechercher des communes par nom
  searchCommunes(query) {
    const searchTerm = query.toLowerCase();
    const communes = TERRITORIAL_DATA.communes.filter(commune => 
      commune.name.toLowerCase().includes(searchTerm)
    );
    return Promise.resolve(communes);
  }
  
  // Valider une structure territoriale
  async validateTerritorialStructure(regionId, departmentId, communeId) {
    const region = await this.getRegion(regionId);
    const department = await this.getDepartment(departmentId);
    const commune = await this.getCommune(communeId);
    
    if (!region || !department || !commune) {
      return { valid: false, error: 'Élément territorial non trouvé' };
    }
    
    if (department.regionId !== regionId) {
      return { valid: false, error: 'Le département ne correspond pas à la région' };
    }
    
    if (commune.departmentId !== departmentId || commune.regionId !== regionId) {
      return { valid: false, error: 'La commune ne correspond pas au département/région' };
    }
    
    return { valid: true, region, department, commune };
  }
  
  // Obtenir les statistiques territoriales
  getStatistics() {
    return Promise.resolve({
      totalRegions: TERRITORIAL_DATA.regions.length,
      totalDepartments: TERRITORIAL_DATA.departments.length,
      totalCommunes: TERRITORIAL_DATA.communes.length
    });
  }
}

// Export de l'instance
export const localTerritorialManager = new LocalTerritorialManager();

// Fonction d'initialisation pour compatibilité
export function initializeTerritorialData() {
  console.log('✅ Données territoriales locales initialisées');
  console.log(`📊 ${TERRITORIAL_DATA.regions.length} régions, ${TERRITORIAL_DATA.departments.length} départements, ${TERRITORIAL_DATA.communes.length} communes`);
  return Promise.resolve();
}
