import { logger } from '@/lib/logger';
/**
 * Gestion centralisée des erreurs Supabase
 * Convertit les codes d'erreur en messages utilisateur clairs
 */

export const supabaseErrorMessages = {
  PGRST204: {
    title: '❌ Colonne manquante',
    message: 'La colonne demandée n\'existe pas dans la base de données. Contactez le support.',
    severity: 'error',
    action: 'contact_support'
  },
  PGRST200: {
    title: '❌ Relation invalide',
    message: 'Impossible de trouver la relation demandée. Les données pourraient être incomplètes.',
    severity: 'error',
    action: 'reload_page'
  },
  23514: {
    title: '⚠️ Données invalides',
    message: 'Les données saisies ne respectent pas les contraintes. Vérifiez vos entrées.',
    severity: 'warning',
    action: 'check_form'
  },
  '42P01': {
    title: '❌ Table manquante',
    message: 'La table n\'existe pas. La base de données peut être incomplète.',
    severity: 'error',
    action: 'contact_support'
  },
  'PGRST100': {
    title: '❌ Erreur limite',
    message: 'Vous avez atteint votre limite d\'utilisation. Mettez à jour votre plan.',
    severity: 'error',
    action: 'upgrade_plan'
  },
  'PGRST103': {
    title: '🔒 Accès refusé',
    message: 'Vous n\'avez pas les permissions pour cette action.',
    severity: 'error',
    action: 'check_permissions'
  }
};

/**
 * Parse une erreur Supabase et retourne un message utilisateur
 */
export function parseSupabaseError(error) {
  if (!error) return null;

  const code = error.code || error.status || 'UNKNOWN';
  const message = error.message || 'Erreur inconnue';
  const hint = error.hint || '';

  const predefined = supabaseErrorMessages[code];

  if (predefined) {
    return {
      ...predefined,
      code,
      detail: message,
      hint,
      timestamp: new Date().toISOString()
    };
  }

  // Erreurs customisées
  if (message.includes('Could not find') && message.includes('column')) {
    return {
      title: '❌ Colonne inexistante',
      message: `La colonne demandée n'existe pas. (${message})`,
      severity: 'error',
      code: 'COLUMN_NOT_FOUND',
      detail: message,
      hint,
      action: 'contact_support'
    };
  }

  if (message.includes('Could not find a relationship')) {
    return {
      title: '❌ Relation incorrecte',
      message: `Impossible de charger les données liées. (${hint || message})`,
      severity: 'error',
      code: 'RELATIONSHIP_NOT_FOUND',
      detail: message,
      hint,
      action: 'reload_page'
    };
  }

  if (message.includes('violates check constraint')) {
    return {
      title: '⚠️ Données non valides',
      message: 'Les données ne respectent pas les règles métier.',
      severity: 'warning',
      code: 'CHECK_CONSTRAINT_VIOLATED',
      detail: message,
      hint,
      action: 'check_form'
    };
  }

  // Erreur par défaut
  return {
    title: '❌ Erreur Supabase',
    message: message.substring(0, 100),
    severity: 'error',
    code: code || 'SUPABASE_ERROR',
    detail: message,
    hint,
    action: 'retry'
  };
}

/**
 * Hook pour gérer et logger les erreurs Supabase
 */
export function useSupabaseError() {
  const handleError = (error, context = '') => {
    const parsed = parseSupabaseError(error);

    // Log pour debug
    logger.error(`[Supabase ${context}]`, {
      code: parsed?.code,
      message: parsed?.message,
      detail: parsed?.detail,
      hint: parsed?.hint,
      raw: error
    });

    return parsed;
  };

  return { handleError, parseSupabaseError };
}

/**
 * Composant pour afficher les erreurs
 */
export function SupabaseErrorDisplay({ error, onDismiss }) {
  if (!error) return null;

  const parsed = typeof error === 'string' ? { message: error } : parseSupabaseError(error);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'error': return 'from-red-600 to-red-700';
      case 'warning': return 'from-amber-600 to-amber-700';
      case 'info': return 'from-blue-600 to-blue-700';
      default: return 'from-gray-600 to-gray-700';
    }
  };

  return (
    <div className={`bg-gradient-to-r ${getSeverityColor(parsed.severity)} text-white p-4 rounded-lg shadow-lg`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-bold text-lg">{parsed.title}</h3>
          <p className="text-sm mt-1">{parsed.message}</p>
          {parsed.hint && (
            <p className="text-xs mt-2 opacity-90">💡 {parsed.hint}</p>
          )}
          {parsed.code && (
            <p className="text-xs mt-2 opacity-75">Code: {parsed.code}</p>
          )}
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="ml-4 text-white hover:opacity-75 transition"
          >
            ✕
          </button>
        )}
      </div>

      {/* Action suggestions */}
      {parsed.action && (
        <div className="mt-3 text-xs space-y-1">
          {parsed.action === 'retry' && '🔄 Actualiser ou réessayer'}
          {parsed.action === 'contact_support' && '📧 Contactez le support'}
          {parsed.action === 'check_form' && '✏️ Vérifiez les données du formulaire'}
          {parsed.action === 'reload_page' && '🔄 Rechargez la page'}
          {parsed.action === 'upgrade_plan' && '⬆️ Mettez à jour votre plan'}
          {parsed.action === 'check_permissions' && '🔒 Vérifiez vos permissions'}
        </div>
      )}
    </div>
  );
}

export default { parseSupabaseError, useSupabaseError, SupabaseErrorDisplay };
