/**
 * Script de test pour vérifier la navigation du dashboard
 */

const navigationItems = [
  'home',
  'overview', 
  'recherche',
  'favoris',
  'offres',
  'visites',
  'financement',
  'zones-communales',
  'demandes',
  'terrains-prives',
  'construction',
  'promoteurs',
  'tickets',
  'messages',
  'notifications',
  'calendar',
  'documents',
  'analytics'
];

console.log('🧪 Test des routes de navigation du dashboard particulier');
console.log('='.repeat(60));

navigationItems.forEach((route, index) => {
  const fullPath = `/acheteur/${route}`;
  console.log(`${(index + 1).toString().padStart(2, '0')}. ${fullPath}`);
});

console.log('='.repeat(60));
console.log(`Total: ${navigationItems.length} routes à tester`);