# Installation des dépendances pour l'intégration IA et Blockchain
Write-Host "🚀 Installation des dépendances Teranga Foncier IA + Blockchain" -ForegroundColor Green

# Vérifier si npm est installé
if (!(Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "❌ NPM n'est pas installé. Veuillez installer Node.js d'abord." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Installation des packages React..." -ForegroundColor Yellow

# Packages de base React/UI
npm install framer-motion recharts
npm install lucide-react @radix-ui/react-tabs @radix-ui/react-tooltip

# Packages pour l'IA et Analytics
Write-Host "🧠 Installation des packages IA..." -ForegroundColor Yellow
npm install axios openai
npm install chart.js react-chartjs-2
npm install d3 react-d3-library

# Packages Blockchain et Web3
Write-Host "⛓️ Installation des packages Blockchain..." -ForegroundColor Yellow
npm install ethers web3
npm install @web3-react/core @web3-react/injected-connector
npm install ipfs-http-client

# Packages pour le développement
Write-Host "🛠️ Installation des outils de développement..." -ForegroundColor Yellow
npm install --save-dev @types/d3 @types/node

# Packages utilitaires
Write-Host "⚙️ Installation des utilitaires..." -ForegroundColor Yellow
npm install lodash date-fns
npm install react-hot-toast react-loading-skeleton

Write-Host "✅ Installation terminée!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Prochaines étapes:" -ForegroundColor Cyan
Write-Host "1. Configurez vos clés API dans le fichier .env" -ForegroundColor White
Write-Host "2. Copiez .env.example vers .env et remplissez les valeurs" -ForegroundColor White
Write-Host "3. Démarrez le serveur avec: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🔗 Services à configurer:" -ForegroundColor Cyan
Write-Host "- OpenAI API (pour l'IA)" -ForegroundColor White
Write-Host "- Polygon RPC (pour la blockchain)" -ForegroundColor White
Write-Host "- Pinata IPFS (pour le stockage)" -ForegroundColor White
Write-Host ""
Write-Host "🎉 Teranga Foncier IA + Blockchain est prêt!" -ForegroundColor Green
