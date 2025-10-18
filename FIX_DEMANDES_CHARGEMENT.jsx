// EXPLICATION: Pourquoi les Demandes Ne Chargent Pas

/**
 * PROBLÈME INITIAL:
 * 
 * Sur le dashboard vendeur, les demandes (purchase_requests) ne s'affichaient pas
 * Erreur: "Could not find column X" ou "HTTP 400"
 * 
 * CAUSES IDENTIFIÉES:
 * 
 * 1. Colonnes inexistantes dans SELECT
 *    - buyer_id: EXISTE dans purchase_requests ✓
 *    - contact_id: N'EXISTE PAS dans property_inquiries ✗ (FIXÉ)
 * 
 * 2. Relations incorrectes
 *    - conversations utilise participant_1_id/participant_2_id
 *    - PAS buyer_id ✗
 * 
 * 3. RLS Policies restrictives
 *    - Vendeurs ne peuvent pas voir demandes des autres
 *    - Correctement restreint (bon pour sécurité)
 * 
 * 4. Profils manquants
 *    - Colonnes address/city/bio n'existaient pas
 *    - FIXÉ avec FIX_MISSING_COLUMNS_COMPLETE.sql
 */

// ============================================
// SOLUTION 1: Charger Demandes Correctement
// ============================================

import { supabase } from '@/lib/supabase';

async function loadPurchaseRequests(vendorId) {
  try {
    // 1. Charger demandes pour cette propriété
    const { data: demandes, error: demandesError } = await supabase
      .from('purchase_requests')
      .select(`
        id,
        property_id,
        buyer_id,
        status,
        offer_price,
        message,
        created_at,
        preferred_visit_date,
        
        -- Lier les infos acheteur via buyer_id
        buyer:buyer_id (
          id,
          email,
          full_name,
          phone,
          avatar_url
        ),
        
        -- Lier la propriété
        property:property_id (
          id,
          title,
          price_fcfa,
          address
        )
      `)
      .eq('vendor_id', vendorId)  // ← CLEF: Filtrer par vendeur
      .order('created_at', { ascending: false });

    if (demandesError) {
      console.error('❌ Erreur chargement demandes:', demandesError);
      return { data: [], error: demandesError };
    }

    console.log('✅ Demandes chargées:', demandes?.length);
    return { data: demandes || [], error: null };

  } catch (err) {
    console.error('❌ Exception:', err);
    return { data: [], error: err };
  }
}

// ============================================
// SOLUTION 2: Charger Propriétés Enquêtes
// ============================================

async function loadPropertyInquiries(vendorId) {
  try {
    // Propriété_inquiries = messages d'acheteurs intéressés
    const { data: inquiries, error } = await supabase
      .from('property_inquiries')
      .select(`
        id,
        property_id,
        status,
        created_at,
        
        -- CORRECTED: Pas contact_id, utiliser autre colonne
        message,
        inquiry_type,
        
        -- Lier la propriété
        property:property_id (
          id,
          title,
          owner_id
        )
      `)
      .eq('property:owner_id', vendorId)  // Filtrer par propriétaire
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur inquiries:', error);
      return { data: [], error };
    }

    console.log('✅ Inquiries chargées:', inquiries?.length);
    return { data: inquiries || [], error: null };

  } catch (err) {
    console.error('❌ Exception:', err);
    return { data: [], error: err };
  }
}

// ============================================
// SOLUTION 3: Combiner Demandes + Inquiries
// ============================================

export async function loadAllDemandes(vendorId) {
  try {
    const [
      { data: demands, error: demandsError },
      { data: inquiries, error: inquiriesError }
    ] = await Promise.all([
      loadPurchaseRequests(vendorId),
      loadPropertyInquiries(vendorId)
    ]);

    // Combiner en une liste
    const allDemandes = [
      ...(demands || []).map(d => ({
        id: d.id,
        type: 'purchase_request',
        title: d.property?.title,
        amount: d.offer_price,
        buyer: d.buyer?.full_name,
        status: d.status,
        date: d.created_at,
        data: d
      })),
      ...(inquiries || []).map(i => ({
        id: i.id,
        type: 'inquiry',
        title: i.property?.title,
        amount: null,
        buyer: '(Intéressé)',
        status: i.status,
        date: i.created_at,
        data: i
      }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log('✅ Toutes demandes chargées:', allDemandes.length);
    return { data: allDemandes, error: demandsError || inquiriesError };

  } catch (err) {
    console.error('❌ Erreur combinaison:', err);
    return { data: [], error: err };
  }
}

// ============================================
// EXEMPLE D'UTILISATION DANS COMPOSANT
// ============================================

import React, { useState, useEffect } from 'react';

export function DemandesVendeur({ vendorId }) {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [vendorId]);

  const loadData = async () => {
    setLoading(true);
    const { data, error } = await loadAllDemandes(vendorId);
    setDemandes(data);
    setError(error);
    setLoading(false);
  };

  if (loading) return <div>⏳ Chargement demandes...</div>;
  if (error) return <div>❌ Erreur: {error.message}</div>;
  if (demandes.length === 0) return <div>ℹ️ Aucune demande</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">{demandes.length} Demandes</h2>
      
      {demandes.map(d => (
        <div key={d.id} className="border p-4 rounded bg-white">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold">{d.title}</h3>
              <p className="text-sm text-gray-600">{d.buyer}</p>
              <p className="text-xs text-gray-500">
                {new Date(d.date).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="text-right">
              {d.amount && <p className="font-bold">{d.amount} CFA</p>}
              <p className={`px-2 py-1 rounded text-sm ${
                d.status === 'pending' ? 'bg-yellow-100' :
                d.status === 'accepted' ? 'bg-green-100' :
                'bg-gray-100'
              }`}>
                {d.status}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================
// ÉTAPES POUR FIXER LE DASHBOARD
// ============================================

/*

1. EXÉCUTER MIGRATION SQL
   → FIX_MISSING_COLUMNS_COMPLETE.sql
   → Ajoute colonnes manquantes
   → Crée tables analytics/subscriptions

2. REMPLACER REQUÊTES CASSÉES
   → VendeurDashboardRefactored.jsx
   → Utiliser fonctions ci-dessus (loadAllDemandes)
   → Tester sans erreurs

3. AFFICHER LES DEMANDES
   → Dans VendeurDashboardRefactored
   → Ajouter section "Demandes Récentes"
   → Montrer badge du nombre

4. AJOUTER COMPTEUR VUES
   → Utiliser view_count de properties
   → Afficher "Vues: 25" sur chaque annonce
   → Tracker dans analytics_views

5. TESTER COMPLET
   → Dashboard charge
   → Pas d'erreurs Supabase
   → Demandes affichées
   → Vues comptées

*/

// ============================================
// INTÉGRATION DANS VENDEUR DASHBOARD
// ============================================

// VendeurDashboardRefactored.jsx

import { loadAllDemandes } from '@/services/demandesService';
import { SupabaseErrorDisplay } from '@/components/SupabaseErrorHandler';

export function VendeurDashboardRefactored() {
  const [user, setUser] = useState(null);
  const [demandes, setDemandes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [user?.id]);

  const loadData = async () => {
    if (!user?.id) return;
    
    // NEW: Charger demandes correctement
    const { data, error: demandesError } = await loadAllDemandes(user.id);
    setDemandes(data);
    
    // Afficher erreurs si besoin
    if (demandesError) {
      console.error('Erreur demandes:', demandesError);
      setError(demandesError);
    }
  };

  return (
    <div className="space-y-6">
      {/* Erreur display */}
      {error && (
        <SupabaseErrorDisplay 
          error={error}
          onDismiss={() => setError(null)}
        />
      )}

      {/* Section Demandes */}
      <Card>
        <CardHeader>
          <CardTitle>
            📬 Demandes Récentes ({demandes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {demandes.length === 0 ? (
            <p className="text-gray-500">Aucune demande pour le moment</p>
          ) : (
            <div className="space-y-3">
              {demandes.slice(0, 5).map(d => (
                <div key={d.id} className="flex justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-semibold">{d.title}</p>
                    <p className="text-sm text-gray-600">{d.buyer}</p>
                  </div>
                  <div className="text-right">
                    {d.amount && <p className="font-bold">{d.amount} CFA</p>}
                    <Badge>{d.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ... Autres sections ... */}
    </div>
  );
}

export default VendeurDashboardRefactored;
