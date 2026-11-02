import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF', minimumFractionDigits: 0 }).format(amount || 0);

/** Journalise une action d'administration (table admin_actions). */
export const logAdminAction = async (adminId, actionType, targetId, targetType, details) => {
  try {
    await supabase.from('admin_actions').insert({
      admin_id: adminId,
      action_type: actionType,
      target_id: targetId,
      target_type: targetType,
      details,
      ip_address: 'auto',
      created_at: new Date()
    });
  } catch (error) {
    console.error('Erreur log action:', error);
  }
};

export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    toast.error('Aucune donnée à exporter');
    return;
  }
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((row) => Object.values(row).map((v) => `"${v}"`).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};
