/**
 * ================================================
 * CRM Buyer Integration Service
 * ================================================
 * Auto-import buyers from purchase_requests and favorites
 * into the CRM system with smart deduplication
 * ================================================
 */

import { supabase } from '@/lib/supabaseClient';

// Helper function to calculate score
const calculateScore = (buyer, source) => {
  let score = 50; // Base score

  if (source === 'purchase_request') {
    score += 30; // High engagement
    if (buyer.budget_min && buyer.budget_max) score += 10;
    if (buyer.buyer_phone) score += 5;
  } else if (source === 'favorite') {
    score += 20; // Medium engagement
    if (buyer.buyer_phone) score += 10;
  }

  return Math.min(score, 100);
};

const CRMBuyerIntegrationService = {
  /**
   * Main function: Sync buyers from platform
   */
  syncBuyersFromPlatform: async (userId) => {
    try {
      console.log('🔄 Starting buyer sync for user:', userId);

      // Fetch from purchase_requests - without filters that don't exist
      const { data: purchaseRequests, error: prError } = await supabase
        .from('purchase_requests')
        .select('*');

      if (prError) {
        console.warn('⚠️ Could not fetch purchase_requests:', prError);
      }

      // Fetch from favorites - without filters that don't exist
      const { data: favorites, error: favError } = await supabase
        .from('favorites')
        .select('*');

      if (favError) {
        console.warn('⚠️ Could not fetch favorites:', favError);
      }

      // Filter locally for the current user
      const userPurchaseRequests = purchaseRequests?.filter(pr => pr.vendor_id === userId) || [];
      const userFavorites = favorites?.filter(fav => fav.vendor_id === userId) || [];

      // Combine and deduplicate
      const allBuyers = [];
      const seen = new Set();

      // Add purchase request buyers
      if (userPurchaseRequests && userPurchaseRequests.length > 0) {
        userPurchaseRequests.forEach(pr => {
          const buyerEmail = pr.buyer_email?.toLowerCase();
          if (buyerEmail && !seen.has(buyerEmail)) {
            seen.add(buyerEmail);
            allBuyers.push({
              email: pr.buyer_email,
              first_name: pr.buyer_first_name || 'Acheteur',
              last_name: pr.buyer_last_name || 'Potentiel',
              phone: pr.buyer_phone,
              company: pr.company_name,
              location: pr.location,
              budget_min: pr.budget_min,
              budget_max: pr.budget_max,
              interests: pr.property_types || [],
              status: 'prospect',
              score: calculateScore(pr, 'purchase_request'),
              source: 'purchase_request',
              custom_fields: {
                property_interests: pr.property_types,
                budget: { min: pr.budget_min, max: pr.budget_max },
                location_preference: pr.location
              }
            });
          }
        });
      }

      // Add favorite buyers
      if (userFavorites && userFavorites.length > 0) {
        userFavorites.forEach(fav => {
          const buyerEmail = fav.buyer_email?.toLowerCase();
          if (buyerEmail && !seen.has(buyerEmail)) {
            seen.add(buyerEmail);
            allBuyers.push({
              email: fav.buyer_email,
              first_name: fav.buyer_first_name || 'Acheteur',
              last_name: fav.buyer_last_name || 'Intéressé',
              phone: fav.buyer_phone,
              company: fav.company_name,
              location: fav.location,
              interests: [fav.property_type],
              status: 'prospect',
              score: calculateScore(fav, 'favorite'),
              source: 'favorite',
              custom_fields: {
                favorite_property_id: fav.property_id,
                property_type: fav.property_type
              }
            });
          }
        });
      }

      console.log(`📋 Found ${allBuyers.length} buyers to import`);

      // Import buyers into CRM
      let created = 0;
      let updated = 0;

      for (const buyer of allBuyers) {
        try {
          // Check if already exists
          const { data: existing } = await supabase
            .from('crm_contacts')
            .select('id')
            .eq('user_id', userId)
            .eq('email', buyer.email)
            .single();

          if (existing) {
            // Update existing contact
            const { error: updateError } = await supabase
              .from('crm_contacts')
              .update({
                ...buyer,
                updated_at: new Date().toISOString()
              })
              .eq('id', existing.id);

            if (!updateError) {
              updated++;
              console.log(`↻ Updated contact: ${buyer.email}`);
            }
          } else {
            // Create new contact
            const { error: insertError } = await supabase
              .from('crm_contacts')
              .insert({
                user_id: userId,
                ...buyer,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (!insertError) {
              created++;
              console.log(`✅ Created contact: ${buyer.email}`);
            }
          }
        } catch (error) {
          console.error('Error processing buyer:', buyer.email, error);
        }
      }

      console.log(`✅ Sync complete: ${created} created, ${updated} updated`);
      return { created, updated, success: true };
    } catch (error) {
      console.error('❌ Sync error:', error);
      return { success: false, error: error.message };
    }
  }
};

export default CRMBuyerIntegrationService;
