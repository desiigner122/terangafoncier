#!/bin/bash

# Script pour appliquer le responsive design aux 6 pages notaires restantes
# Usage: bash apply-responsive-notaire.sh

files=(
  "src/pages/dashboards/notaire/NotaireTransactionsModernized.jsx"
  "src/pages/dashboards/notaire/NotaireAuthenticationModernized.jsx"
  "src/pages/dashboards/notaire/NotaireCasesModernized.jsx"
  "src/pages/dashboards/notaire/NotaireArchivesModernized.jsx"
  "src/pages/dashboards/notaire/NotaireAnalyticsModernized.jsx"
  "src/pages/dashboards/notaire/NotaireSettingsModernized.jsx"
)

echo "🚀 Application du responsive design aux pages notaires..."

for file in "${files[@]}"; do
  if [ ! -f "$file" ]; then
    echo "⚠️  Fichier introuvable: $file"
    continue
  fi
  
  echo "✏️  Traitement de $(basename $file)..."
  
  # Backup
  cp "$file" "$file.bak"
  
  # Container spacing
  sed -i 's/className="space-y-6"/className="space-y-4 sm:space-y-6"/g' "$file"
  sed -i 's/className="p-6 space-y-6/className="p-3 sm:p-4 lg:p-6 space-y-4 sm:space-y-6/g' "$file"
  
  # Header titles
  sed -i 's/text-3xl font-bold/text-xl sm:text-2xl lg:text-3xl font-bold/g' "$file"
  sed -i 's/text-2xl font-semibold/text-lg sm:text-xl lg:text-2xl font-semibold/g' "$file"
  
  # Stats values
  sed -i 's/text-3xl font-bold text-/text-xl sm:text-2xl lg:text-3xl font-bold text-/g' "$file"
  sed -i 's/text-2xl font-bold text-/text-xl sm:text-2xl font-bold text-/g' "$file"
  sed -i 's/text-2xl font-semibold text-/text-xl sm:text-2xl font-semibold text-/g' "$file"
  
  # Icon sizes
  sed -i 's/h-12 w-12 bg-/h-10 w-10 sm:h-12 sm:w-12 bg-/g' "$file"
  sed -i 's/h-12 w-12 text-/h-10 w-10 sm:h-12 sm:w-12 text-/g' "$file"
  sed -i 's/h-6 w-6 text-/h-5 w-5 sm:h-6 sm:w-6 text-/g' "$file"
  
  # CardContent padding
  sed -i 's/CardContent className="p-6"/CardContent className="p-3 sm:p-4 lg:p-6"/g' "$file"
  sed -i 's/Card className="p-6"/Card className="p-3 sm:p-4 lg:p-6"/g' "$file"
  
  # Grid gaps
  sed -i 's/gap-6/gap-3 sm:gap-4 lg:gap-6/g' "$file"
  sed -i 's/gap-4"/gap-3 sm:gap-4"/g' "$file"
  
  # Grid columns - stats
  sed -i 's/grid-cols-1 md:grid-cols-2 lg:grid-cols-4/grid-cols-2 lg:grid-cols-4/g' "$file"
  sed -i 's/grid-cols-1 md:grid-cols-2 lg:grid-cols-5/grid-cols-2 sm:grid-cols-3 lg:grid-cols-5/g' "$file"
  sed -i 's/grid-cols-2 md:grid-cols-3 lg:grid-cols-6/grid-cols-2 sm:grid-cols-3 lg:grid-cols-6/g' "$file"
  
  # Grid columns - content
  sed -i 's/grid-cols-1 lg:grid-cols-2/grid-cols-1 lg:grid-cols-2/g' "$file"
  sed -i 's/grid-cols-1 lg:grid-cols-3/grid-cols-1 lg:grid-cols-3/g' "$file"
  sed -i 's/grid-cols-1 md:grid-cols-2 lg:grid-cols-3/grid-cols-1 sm:grid-cols-2 lg:grid-cols-3/g' "$file"
  
  # Text sizes
  sed -i 's/text-sm font-medium text-gray/text-xs sm:text-sm font-medium text-gray/g' "$file"
  sed -i 's/text-xs text-gray/text-[10px] sm:text-xs text-gray/g' "$file"
  
  # Tabs
  sed -i 's/grid w-full grid-cols-2/grid w-full grid-cols-2 h-auto/g' "$file"
  sed -i 's/grid w-full grid-cols-3/grid w-full grid-cols-2 sm:grid-cols-3 h-auto/g' "$file"
  sed -i 's/grid w-full grid-cols-4/grid w-full grid-cols-2 sm:grid-cols-4 h-auto/g' "$file"
  sed -i 's/grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7/grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto/g' "$file"
  
  echo "✅ $(basename $file) traité"
done

echo ""
echo "🎉 Responsive design appliqué à toutes les pages !"
echo ""
echo "📝 Fichiers modifiés:"
for file in "${files[@]}"; do
  echo "   - $(basename $file)"
done
echo ""
echo "💾 Backups créés avec extension .bak"
echo "🔍 Vérifiez les changements avec: git diff"
