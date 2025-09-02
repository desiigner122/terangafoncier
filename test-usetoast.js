// Test rapide pour vérifier que useToast fonctionne
import { useToast } from './src/components/ui/use-toast-simple.js';

console.log('=== TEST USETOAST ===');

try {
  const { toast, toasts } = useToast();
  console.log('✅ useToast hook importé:', typeof useToast);
  console.log('✅ toast function:', typeof toast);
  console.log('✅ toasts array:', Array.isArray(toasts));
  
  // Test d'appel de toast
  const result = toast({
    title: 'Test',
    description: 'Test de fonctionnement'
  });
  
  console.log('✅ Toast appelé avec succès:', result);
  console.log('✅ Pas d\'erreur TypeError !');
  
} catch (error) {
  console.error('❌ Erreur lors du test:', error);
}

console.log('=== FIN TEST ===');
