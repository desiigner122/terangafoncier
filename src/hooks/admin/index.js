/**
 * ========================================
 * Admin Hooks - Export centralisé
 * ========================================
 * Hooks existants (Phase 0) + Nouveaux (Phase 1)
 */

// PHASE 0 - Hooks existants
export { default as useAdminStats } from './useAdminStats';
export { default as useAdminUsers } from './useAdminUsers';
export { default as useAdminProperties } from './useAdminProperties';
export { default as useAdminTickets } from './useAdminTickets';

// PHASE 1 - Nouveaux hooks (CMS, Marketing, Analytics)
export { useAdminCMS } from './useAdminCMS';
export { useAdminLeads } from './useAdminLeads';
export { usePageTracking, useAnalytics } from './usePageTracking';
