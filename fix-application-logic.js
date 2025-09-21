// ======================================================================
// CORRECTION GLOBALE : REMPLACER public.users PAR public.profiles
// Script automatique pour corriger toute la logique de l'application
// ======================================================================

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Liste des fichiers à corriger (identifiés via grep)
const filesToCorrect = [
    'src/lib/accountCreationService.js',
    'src/lib/territorialManager.js', 
    'src/pages/AnalyticsPageReal.jsx',
    'src/pages/AnalyticsPage.jsx',
    'src/lib/globalAnalytics.js',
    'src/context/SimpleSupabaseAuthContext.jsx',
    'src/pages/admin/AdminDashboardPage.jsx',
    'src/context/AuthContext.jsx',
    'src/pages/admin/AdminReportsPage.jsx',
    'src/pages/admin/AdminUserRequestsPage.jsx',
    'src/pages/admin/AdminUsersPageOriginal.jsx',
    'src/pages/admin/components/FixedUserActions.jsx',
    'src/pages/admin/ModernAdminDashboard.jsx',
    'src/pages/admin/components/AddUserWizardNew.jsx'
];

const workspaceRoot = __dirname;

async function correctApplicationLogic() {
    console.log('🔧 CORRECTION GLOBALE : public.users → public.profiles');
    console.log('='.repeat(60));
    
    let totalCorrections = 0;
    
    for (const relativePath of filesToCorrect) {
        const fullPath = path.join(workspaceRoot, relativePath);
        
        if (!fs.existsSync(fullPath)) {
            console.log(`❌ Fichier non trouvé: ${relativePath}`);
            continue;
        }
        
        try {
            let content = fs.readFileSync(fullPath, 'utf8');
            const originalContent = content;
            
            // Remplacements principaux
            const replacements = [
                // Supabase .from('users') → .from('profiles')
                [/\.from\s*\(\s*['"]users['"] *\)/g, ".from('profiles')"],
                
                // Commentaires explicites
                [/\/\/ *table: *users/gi, '// table: profiles'],
                [/\/\* *table: *users *\*\//gi, '/* table: profiles */'],
                
                // Variables nommées
                [/const\s+users\s*=/g, 'const profiles ='],
                [/let\s+users\s*=/g, 'let profiles ='],
                [/var\s+users\s*=/g, 'var profiles ='],
                
                // Propriétés d'objets
                [/data:\s*users/g, 'data: profiles'],
                [/\{\s*data:\s*users\s*\}/g, '{ data: profiles }'],
                
                // References dans les commentaires
                [/users\s*table/gi, 'profiles table'],
                [/from\s*users/gi, 'from profiles']
            ];
            
            let fileCorrections = 0;
            
            for (const [pattern, replacement] of replacements) {
                const matches = content.match(pattern);
                if (matches) {
                    content = content.replace(pattern, replacement);
                    fileCorrections += matches.length;
                }
            }
            
            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`✅ ${relativePath}: ${fileCorrections} corrections`);
                totalCorrections += fileCorrections;
            } else {
                console.log(`➖ ${relativePath}: aucune correction nécessaire`);
            }
            
        } catch (error) {
            console.error(`❌ Erreur lors de la correction de ${relativePath}:`, error.message);
        }
    }
    
    console.log('='.repeat(60));
    console.log(`🎯 TOTAL: ${totalCorrections} corrections appliquées`);
    console.log('');
    console.log('📋 PROCHAINES ÉTAPES:');
    console.log('1. Vérifiez les changements avec git diff');
    console.log('2. Testez l\'application: npm run dev');
    console.log('3. Testez les connexions: node test-connexions-supabase.js');
    console.log('4. Si tout fonctionne → les 20/20 comptes devraient marcher !');
}

// Exécution
correctApplicationLogic();