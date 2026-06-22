/**
 * AGRÉGATIONS ANALYTICS RÉELLES (Supabase)
 * ----------------------------------------
 * Fonctions réutilisables pour alimenter les graphiques des dashboards
 * avec de vraies données agrégées. Aucune donnée fabriquée : si la table
 * est vide ou absente, on renvoie une série neutre (zéros) ou un tableau vide.
 */

import { supabase } from '@/lib/supabaseClient';

const MOIS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

/** Somme d'un champ numérique par mois sur N derniers mois (clé: month, value: <field>) */
export async function sumByMonth(table, field = 'amount', months = 6, filters = {}) {
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);
  try {
    let q = supabase.from(table).select(`${field}, created_at`).gte('created_at', since.toISOString());
    Object.entries(filters).forEach(([k, v]) => { q = q.eq(k, v); });
    const { data, error } = await q;
    if (error) throw error;

    const buckets = {};
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      buckets[`${d.getFullYear()}-${d.getMonth()}`] = { month: MOIS_FR[d.getMonth()], value: 0 };
    }
    (data || []).forEach((row) => {
      const d = new Date(row.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets[key]) buckets[key].value += parseFloat(row[field]) || 0;
    });
    return Object.values(buckets);
  } catch (err) {
    console.warn(`sumByMonth(${table}) indisponible:`, err?.message);
    return [];
  }
}

/** Nombre de lignes par mois sur N derniers mois (clé: month, value: count) */
export async function countByMonth(table, months = 6, filters = {}) {
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);
  try {
    let q = supabase.from(table).select('created_at').gte('created_at', since.toISOString());
    Object.entries(filters).forEach(([k, v]) => { q = q.eq(k, v); });
    const { data, error } = await q;
    if (error) throw error;

    const buckets = {};
    for (let i = months - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      buckets[`${d.getFullYear()}-${d.getMonth()}`] = { month: MOIS_FR[d.getMonth()], value: 0 };
    }
    (data || []).forEach((row) => {
      const d = new Date(row.created_at);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (buckets[key]) buckets[key].value += 1;
    });
    return Object.values(buckets);
  } catch (err) {
    console.warn(`countByMonth(${table}) indisponible:`, err?.message);
    return [];
  }
}

/** Nombre de lignes par jour sur N derniers jours (clé: day, value: count) */
export async function countByDay(table, days = 30, filters = {}) {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  try {
    let q = supabase.from(table).select('created_at').gte('created_at', since.toISOString());
    Object.entries(filters).forEach(([k, v]) => { q = q.eq(k, v); });
    const { data, error } = await q;
    if (error) throw error;

    const buckets = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      buckets[d.toISOString().slice(0, 10)] = {
        day: d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }),
        value: 0
      };
    }
    (data || []).forEach((row) => {
      const key = new Date(row.created_at).toISOString().slice(0, 10);
      if (buckets[key]) buckets[key].value += 1;
    });
    return Object.values(buckets);
  } catch (err) {
    console.warn(`countByDay(${table}) indisponible:`, err?.message);
    return [];
  }
}

/** Répartition par valeur d'un champ (clé: name, value: count). Idéal camembert/barres. */
export async function groupByField(table, field, filters = {}) {
  try {
    let q = supabase.from(table).select(field);
    Object.entries(filters).forEach(([k, v]) => { q = q.eq(k, v); });
    const { data, error } = await q;
    if (error) throw error;

    const counts = {};
    (data || []).forEach((row) => {
      const key = row[field] || 'Non renseigné';
      counts[key] = (counts[key] || 0) + 1;
    });
    const total = Object.values(counts).reduce((s, n) => s + n, 0);
    return Object.entries(counts)
      .map(([name, value]) => ({
        name: String(name).charAt(0).toUpperCase() + String(name).slice(1),
        value,
        percentage: total ? Math.round((value / total) * 100) : 0
      }))
      .sort((a, b) => b.value - a.value);
  } catch (err) {
    console.warn(`groupByField(${table}.${field}) indisponible:`, err?.message);
    return [];
  }
}

/** Vrai si une série n'a aucune valeur exploitable (pour afficher un état vide). */
export function isEmptySeries(rows, key = 'value') {
  return !rows || rows.length === 0 || rows.every((r) => !r[key]);
}
