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
        .select('region, price, surface, verification_status, smart_contract_address')
        .eq('status', 'active')
        .not('region', 'is', null);
      if (error) throw error;

      const byRegion = {};
      (data || []).forEach(p => {
        if (!p.region) return;
        if (!byRegion[p.region]) {
          byRegion[p.region] = { region: p.region, prices: [], perM2: [], count: 0, verified: 0, smartContracts: 0 };
        }
        const g = byRegion[p.region];
        g.count += 1;
        if (p.price) g.prices.push(Number(p.price));
        if (p.price && p.surface) g.perM2.push(Number(p.price) / Number(p.surface));
        if (p.verification_status === 'verified') g.verified += 1;
        if (p.smart_contract_address) g.smartContracts += 1;
      });

      const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      return Object.values(byRegion).map(g => ({
        region: g.region,
        count: g.count,
        avgPrice: Math.round(avg(g.prices)),
        avgPricePerM2: Math.round(avg(g.perM2)),
        smartContracts: g.smartContracts,
        verificationRate: g.count ? Math.round((g.verified / g.count) * 100) : 0
      }));
    } catch (error) {
      console.error('Erreur StatsService.getRegionMarket:', error);
      return [];
    }
  }

  /**
   * Statistiques blockchain/IA réelles (comptages depuis les tables dédiées).
   * Remplace les métriques blockchain/IA qui étaient auparavant simulées.
   * @returns {Promise<object>}
   */
  async getBlockchainStats() {
    const stats = {
      transactions: 0,
      volume24h: 0,
      certificates: 0,
      verifiedCertificates: 0,
      smartContracts: 0,
      nftProperties: 0,
      aiOpportunities: 0,
      openDisputes: 0
    };

    try {
      // blockchain_transactions / blockchain_certificates / disputes ont des lignes
      // protégées par RLS (authenticated only : montants, parties au litige...).
      // On passe par une RPC SECURITY DEFINER qui n'expose que des compteurs agrégés,
      // accessible aussi aux visiteurs anonymes (page d'accueil publique).
      const [publicStats, smartContracts, nftProps, opportunities] = await Promise.all([
        supabase.rpc('get_platform_public_stats'),
        supabase.from('properties').select('id', { count: 'exact', head: true }).not('smart_contract_address', 'is', null),
        supabase.from('properties').select('id', { count: 'exact', head: true }).not('nft_token_id', 'is', null),
        supabase.from('properties').select('id', { count: 'exact', head: true }).gte('ai_score', 80)
      ]);

      const row = publicStats.data?.[0];
      if (row) {
        stats.transactions = row.blockchain_transactions_count || 0;
        stats.volume24h = Number(row.blockchain_volume_24h) || 0;
        stats.certificates = row.certificates_count || 0;
        stats.verifiedCertificates = row.verified_certificates_count || 0;
        stats.openDisputes = row.open_disputes_count || 0;
      }
      stats.smartContracts = smartContracts.count || 0;
      stats.nftProperties = nftProps.count || 0;
      stats.aiOpportunities = opportunities.count || 0;

      return { success: true, stats };
    } catch (error) {
      console.error('Erreur StatsService.getBlockchainStats:', error);
      return { success: false, stats };
    }
  }
}

export default new StatsService();
