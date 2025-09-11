#!/bin/bash
# 🚀 SCRIPT CONFIGURATION FINALE AUTOMATIQUE
# ============================================

echo "🔧 CONFIGURATION FINALE TERANGA FONCIER"
echo "======================================"
echo ""

# 1. Vérifier l'état actuel
echo "1. 📊 VÉRIFICATION ÉTAT ACTUEL"
echo "==============================="

if [ -d "dist" ]; then
    echo "✅ Build production: TROUVÉ"
    BUILD_SIZE=$(du -sh dist | cut -f1)
    echo "📊 Taille: $BUILD_SIZE"
else
    echo "❌ Build production: MANQUANT"
    echo "🔄 Lancement du build..."
    npm run build
fi

if [ -f ".env" ]; then
    echo "✅ Configuration .env: TROUVÉE"
else
    echo "❌ Configuration .env: MANQUANTE"
    echo "🔄 Copie de .env.production..."
    cp .env.production .env
fi

if [ -f "create-production-tables.sql" ]; then
    echo "✅ Script SQL production: PRÊT"
else
    echo "❌ Script SQL production: MANQUANT"
fi

echo ""

# 2. Configuration des clés API
echo "2. 🔑 VÉRIFICATION CLÉS API"
echo "==========================="

if grep -q "your_openai_api_key_here" .env; then
    echo "⚠️ Clé OpenAI: À CONFIGURER"
    echo "   Remplacez 'your_openai_api_key_here' par votre vraie clé"
else
    echo "✅ Clé OpenAI: CONFIGURÉE"
fi

# Vérifier Supabase
if grep -q "VITE_SUPABASE_URL" .env; then
    echo "✅ Configuration Supabase: ACTIVE"
else
    echo "❌ Configuration Supabase: MANQUANTE"
fi

echo ""

# 3. État des services
echo "3. 🔧 SERVICES PRIORITY 3"
echo "========================="

SERVICES=(
    "src/services/TerangaBlockchainSyncService.js"
    "src/components/dashboard/UnifiedDashboard.jsx" 
    "src/services/TerangaIntelligentNotifications.js"
    "dist/sw.js"
    "dist/manifest.json"
)

for service in "${SERVICES[@]}"; do
    if [ -f "$service" ]; then
        echo "✅ $(basename "$service"): ACTIF"
    else
        echo "❌ $(basename "$service"): MANQUANT"
    fi
done

echo ""

# 4. Instructions finales
echo "4. 🎯 ACTIONS FINALES REQUISES"
echo "=============================="
echo "🔴 CRITIQUE - Base de données:"
echo "   1. Ouvrez https://supabase.com/dashboard"
echo "   2. Allez dans SQL Editor"  
echo "   3. Copiez le contenu de create-production-tables.sql"
echo "   4. Exécutez le script complet"
echo ""
echo "🟠 IMPORTANT - Clés API:"
echo "   1. Obtenez votre clé OpenAI sur https://platform.openai.com"
echo "   2. Remplacez 'your_openai_api_key_here' dans .env"
echo ""
echo "🟢 DÉPLOIEMENT - Choisissez une option:"
echo "   A. Vercel: vercel --prod"
echo "   B. Netlify: netlify deploy --prod --dir=dist"
echo "   C. Manuel: Copiez dist/ sur votre serveur"
echo ""

# 5. Résumé final
echo "5. 📋 RÉSUMÉ CONFIGURATION"
echo "=========================="
echo "🎯 Build: $([ -d "dist" ] && echo "PRÊT" || echo "À FAIRE")"
echo "🎯 Config: $([ -f ".env" ] && echo "PRÊTE" || echo "À FAIRE")"  
echo "🎯 SQL: $([ -f "create-production-tables.sql" ] && echo "PRÊT" || echo "À FAIRE")"
echo "🎯 PWA: $([ -f "dist/sw.js" ] && echo "PRÊT" || echo "À FAIRE")"
echo ""
echo "🚀 STATUS: PRODUCTION READY - Configuration à finaliser"
echo ""
echo "📖 Guide complet: CONFIGURATIONS_FINALES_PRODUCTION.md"
