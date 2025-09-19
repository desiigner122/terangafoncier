// Test simple de diagnostic pour Vite
import { spawn } from 'child_process';
import path from 'path';

console.log('🔍 Diagnostic du serveur Vite...');

const projectPath = process.cwd();
console.log(`📂 Projet: ${projectPath}`);

// Tester le serveur Vite
console.log('🚀 Démarrage du serveur...');

const viteProcess = spawn('npm', ['run', 'dev'], {
    cwd: projectPath,
    stdio: 'inherit',
    shell: true
});

viteProcess.on('error', (error) => {
    console.error('❌ Erreur lors du démarrage:', error.message);
});

viteProcess.on('exit', (code) => {
    console.log(`🔚 Serveur arrêté avec le code: ${code}`);
});

// Arrêter après 10 secondes pour diagnostic
setTimeout(() => {
    console.log('⏰ Arrêt du diagnostic après 10 secondes');
    viteProcess.kill();
}, 10000);