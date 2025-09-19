#!/usr/bin/env node

/**
 * 🔄 Mise à Jour URLs Supabase - Script Automatisé
 * Ce script remplace toutes les anciennes URLs Supabase par les nouvelles
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { createInterface } from 'readline';

const OLD_URLS = [
    'https://ndenqikcogzrkrjnlvns.supabase.co',
    'https://upqthvkkgmykydxrpupm.supabase.co'
];

const OLD_KEYS = [
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyam5sdm5zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY2NjMzMDQsImV4cCI6MjA3MjIzOTMwNH0.4UOe3QXy8DywtlOkgtZn9A9xrVIW2tnYEowjJX3VbYM',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwcXRodmtrZ215a3lkeHJwdXBtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU2NjI0NjUsImV4cCI6MjA1MTIzODQ2NX0.vJqYfBxmK1vpfPdx7EkR-ZMLQFvAjfrfQZHJHRqCktM'
];

async function promptUser(question) {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

async function getAllFiles(dir, files = []) {
    const entries = readdirSync(dir);
    
    for (const entry of entries) {
        const fullPath = join(dir, entry);
        const stat = statSync(fullPath);
        
        if (stat.isDirectory()) {
            if (!entry.startsWith('.') && 
                entry !== 'node_modules' && 
                entry !== 'dist' && 
                entry !== 'build') {
                await getAllFiles(fullPath, files);
            }
        } else if (stat.isFile()) {
            const ext = extname(entry);
            if (['.js', '.jsx', '.ts', '.tsx', '.env', '.md', '.sql', '.ps1', '.sh', '.mjs', '.cjs'].includes(ext) || 
                entry.startsWith('.env')) {
                files.push(fullPath);
            }
        }
    }
    
    return files;
}

function updateFileContent(filePath, newUrl, newKey) {
    try {
        let content = readFileSync(filePath, 'utf8');
        let updated = false;
        
        // Remplacer les URLs
        for (const oldUrl of OLD_URLS) {
            if (content.includes(oldUrl)) {
                content = content.replaceAll(oldUrl, newUrl);
                updated = true;
            }
        }
        
        // Remplacer les clés
        for (const oldKey of OLD_KEYS) {
            if (content.includes(oldKey)) {
                content = content.replaceAll(oldKey, newKey);
                updated = true;
            }
        }
        
        if (updated) {
            writeFileSync(filePath, content, 'utf8');
            return true;
        }
        
        return false;
    } catch (error) {
        console.error(`❌ Erreur mise à jour ${filePath}:`, error.message);
        return false;
    }
}

async function main() {
    console.log('🔄 Mise à Jour URLs et Clés Supabase');
    console.log('=' .repeat(50));
    
    // Demander les nouvelles informations
    const newUrl = await promptUser('🌐 Nouvelle URL Supabase (ex: https://abc123.supabase.co): ');
    const newKey = await promptUser('🔑 Nouvelle clé Anon Supabase: ');
    
    if (!newUrl || !newKey) {
        console.log('❌ URL et clé requises pour continuer');
        process.exit(1);
    }
    
    if (!newUrl.includes('supabase.co')) {
        console.log('❌ URL invalide - doit contenir "supabase.co"');
        process.exit(1);
    }
    
    console.log('');
    console.log('🔍 Recherche des fichiers à mettre à jour...');
    
    const files = await getAllFiles('.');
    console.log(`📁 ${files.length} fichiers trouvés`);
    
    let updatedCount = 0;
    const updatedFiles = [];
    
    console.log('');
    console.log('🔄 Mise à jour en cours...');
    
    for (const file of files) {
        const updated = updateFileContent(file, newUrl, newKey);
        if (updated) {
            updatedCount++;
            updatedFiles.push(file);
            console.log(`✅ ${file}`);
        }
    }
    
    console.log('');
    console.log('=' .repeat(50));
    console.log(`🎉 Mise à jour terminée!`);
    console.log(`📊 ${updatedCount} fichiers mis à jour`);
    
    if (updatedFiles.length > 0) {
        console.log('');
        console.log('📋 Fichiers modifiés:');
        updatedFiles.forEach(file => console.log(`   • ${file}`));
    }
    
    console.log('');
    console.log('🔧 Prochaines étapes:');
    console.log('1. Vérifier que .env contient les bonnes valeurs');
    console.log('2. Exécuter: node test-supabase-connection.mjs');
    console.log('3. Créer la structure de base de données');
    console.log('4. Tester l\'inscription d\'un utilisateur');
    
    // Créer/mettre à jour le fichier .env
    const envContent = `VITE_SUPABASE_URL="${newUrl}"
VITE_SUPABASE_ANON_KEY="${newKey}"

# OpenAI Configuration
VITE_OPENAI_API_KEY="your_openai_api_key_here"
`;
    
    writeFileSync('.env', envContent);
    console.log('✅ Fichier .env mis à jour');
}

main().catch(console.error);