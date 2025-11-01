/**
 * ContextualActionsPanel.jsx
 * 
 * Affiche les actions disponibles groupées par catégorie
 * selon le statut du workflow et le rôle de l'utilisateur
 */

import React from 'react';
import {
  Upload, Download, FileText, CheckCircle, Clock, XCircle,
  CreditCard, Building2, Ruler, Calendar, MessageSquare,
  FileSearch, FileCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Map icon names to components
const ICON_MAP = {
  Upload,
  Download,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  Building2,
  Ruler,
  Calendar,
  MessageSquare,
  FileSearch,
  FileCheck
};

/**
 * Category display config
 */
const CATEGORY_CONFIG = {
  documents: {
    title: '📄 Documents',
    description: 'Upload et gestion des documents',
    color: 'text-blue-600'
  },
  payments: {
    title: '💳 Paiements',
    description: 'Transactions financières',
    color: 'text-green-600'
  },
  appointments: {
    title: '📅 Rendez-vous',
    description: 'Planification et confirmations',
    color: 'text-purple-600'
  },
  validations: {
    title: '✅ Validations',
    description: 'Vérifications et approbations',
    color: 'text-orange-600'
  },
  optional: {
    title: '🔧 Actions facultatives',
    description: 'Options supplémentaires',
    color: 'text-gray-600'
  }
};

/**
 * Single action button
 */
const ActionButton = ({ action, handlers }) => {
  const IconComponent = ICON_MAP[action.icon] || FileText;
  const handler = handlers[action.handler];

  return (
    <Button
      onClick={handler}
      variant={action.variant || 'default'}
      className="w-full justify-start h-auto py-3 px-4"
    >
      <div className="flex items-start gap-3 w-full">
        <IconComponent className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 text-left">
          <p className="font-medium text-sm">{action.label}</p>
          {action.description && (
            <p className="text-xs opacity-70 mt-1">{action.description}</p>
          )}
          {action.amount && (
            <p className="text-xs font-semibold mt-1">
              {new Intl.NumberFormat('fr-FR').format(action.amount)} FCFA
            </p>
          )}
        </div>
      </div>
    </Button>
  );
};

/**
 * Category section
 */
const CategorySection = ({ category, actions, handlers, config }) => {
  if (!actions || actions.length === 0) return null;

  return (
    <div className="space-y-3">
      <div>
        <h3 className={`font-semibold text-lg ${config.color}`}>
          {config.title}
        </h3>
        <p className="text-xs text-muted-foreground">{config.description}</p>
      </div>
      <div className="space-y-2">
        {actions.map((action) => (
          <ActionButton key={action.id} action={action} handlers={handlers} />
        ))}
      </div>
    </div>
  );
};

/**
 * Main panel component
 */
export const ContextualActionsPanel = ({ actionsByCategory, handlers, userRole, caseStatus }) => {
  // Filter out empty categories
  const hasActions = Object.values(actionsByCategory).some(
    (actions) => actions && actions.length > 0
  );

  if (!hasActions) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Actions disponibles</CardTitle>
          <CardDescription>Aucune action requise pour le moment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              Toutes les actions pour cette étape sont complétées.
            </p>
            <p className="text-xs mt-2">
              Le workflow continuera automatiquement.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vos actions</CardTitle>
        <CardDescription>
          Actions disponibles selon votre rôle et l'étape actuelle
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Documents */}
        <CategorySection
          category="documents"
          actions={actionsByCategory.documents}
          handlers={handlers}
          config={CATEGORY_CONFIG.documents}
        />

        {actionsByCategory.documents?.length > 0 && 
         (actionsByCategory.payments?.length > 0 || 
          actionsByCategory.appointments?.length > 0 || 
          actionsByCategory.validations?.length > 0) && (
          <Separator />
        )}

        {/* Payments */}
        <CategorySection
          category="payments"
          actions={actionsByCategory.payments}
          handlers={handlers}
          config={CATEGORY_CONFIG.payments}
        />

        {actionsByCategory.payments?.length > 0 && 
         (actionsByCategory.appointments?.length > 0 || 
          actionsByCategory.validations?.length > 0) && (
          <Separator />
        )}

        {/* Appointments */}
        <CategorySection
          category="appointments"
          actions={actionsByCategory.appointments}
          handlers={handlers}
          config={CATEGORY_CONFIG.appointments}
        />

        {actionsByCategory.appointments?.length > 0 && 
         actionsByCategory.validations?.length > 0 && (
          <Separator />
        )}

        {/* Validations */}
        <CategorySection
          category="validations"
          actions={actionsByCategory.validations}
          handlers={handlers}
          config={CATEGORY_CONFIG.validations}
        />

        {(actionsByCategory.documents?.length > 0 || 
          actionsByCategory.payments?.length > 0 || 
          actionsByCategory.appointments?.length > 0 || 
          actionsByCategory.validations?.length > 0) && 
         actionsByCategory.optional?.length > 0 && (
          <Separator className="my-4" />
        )}

        {/* Optional */}
        <CategorySection
          category="optional"
          actions={actionsByCategory.optional}
          handlers={handlers}
          config={CATEGORY_CONFIG.optional}
        />
      </CardContent>
    </Card>
  );
};

export default ContextualActionsPanel;
