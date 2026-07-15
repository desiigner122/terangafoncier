/**
 * ========================================
 * StatsService - Statistiques réelles de la plateforme
 * ========================================
 * Remplace les chiffres marketing codés en dur / générés via Math.random
 * par de vrais compteurs agrégés depuis Supabase.
 */

import { supabase } from '@/lib/supabaseClient';

class StatsService {
  /**
   * Statistiques globales de la plateforme (compteurs réels).
   * @returns {Promise<{success:boolean, stats:object}>}
   */
  async getPlatformStats() {
    const stats = {
      verifiedProperties: 0,
      totalProperties: 0,
      regions: 0,
      articles: 0,
      reviews: 0,
      avgRating: null
    };

    try {
      const [verified, total, published, approvedReviews, propsForRegions] = await Promise.all([
        supabase.from('properties').select('id', { count: 'exact', head: true }).eq('status', 'active').eq('verification_status', 'verified'),
        supabase.from('properties').select('id', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('id', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('reviews').select('rating', { count: 'exact' }).eq('is_approved', true),
        supabase.from('properties').select('region').not('region', 'is', null)
      ]);

      stats.verifiedProperties = verified.count || 0;
      stats.totalProperties = total.count || 0;
      stats.articles = published.count || 0;
      stats.reviews = approvedReviews.count || 0;

      // Régions distinctes
      const regionSet = new Set((propsForRegions.data || []).map(p => p.region).filter(Boolean));
      stats.regions = regionSet.size;

      // Note moyenne des avis
      const ratings = (approvedReviews.data || []).map(r => r.rating).filter(Boolean);
      if (ratings.length > 0) {
        stats.avgRating = Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10;
      }

      return { success: true, stats };
    } catch (error) {
      console.error('Erreur StatsService.getPlatformStats:', error);
      return { success: false, stats };
    }
  }

  /**
   * Prix moyen réel par région (calculé depuis les propriétés actives).
   * @returns {Promise<Array<{region, avgPricePerM2, count, avgPrice}>>}
   */
  async getRegionMarket() {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('region, price, surface')
        .eq('status', 'active')
        .not('region', 'is', null);
      if (error) throw error;

      const byRegion = {};
      (data || []).forEach(p => {
        if (!p.region) return;
        if (!byRegion[p.region]) byRegion[p.region] = { region: p.region, prices: [], perM2: [], count: 0 };
        const g = byRegion[p.region];
        g.count += 1;
        if (p.price) g.prices.push(Number(p.price));
        if (p.price && p.surface) g.perM2.push(Number(p.price) / Number(p.surface));
      });

      const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      return Object.values(byRegion).map(g => ({
        region: g.region,
        count: g.count,
        avgPrice: Math.round(avg(g.prices)),
        avgPricePerM2: Math.round(avg(g.perM2))
      }));
    } catch (error) {
      console.error('Erreur StatsService.getRegionMarket:', error);
      return [];
    }
  }
}

export default new StatsService();
