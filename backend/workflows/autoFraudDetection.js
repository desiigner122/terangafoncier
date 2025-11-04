import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Analyze case for fraud indicators
 */
async function analyzeCaseFraud(caseData) {
  const flags = [];
  let riskScore = 0;

  // Analysis 1: Missing documents
  const requiredDocs = ['cni', 'title_deed', 'proof_address'];
  const uploadedDocs = (caseData.documents || []).map(d => d.document_type);
  const missingDocs = requiredDocs.filter(d => !uploadedDocs.includes(d));
  
  if (missingDocs.length > 0) {
    flags.push({
      category: 'document_completeness',
      severity: 'medium',
      description: `Documents manquants: ${missingDocs.join(', ')}`,
      riskPoints: 20
    });
    riskScore += 20;
  }

  // Analysis 2: Price anomaly
  if (caseData.property) {
    const marketPrice = caseData.property.market_value || caseData.property.price;
    const priceDeviation = Math.abs(caseData.property.price - marketPrice) / marketPrice;
    
    if (priceDeviation > 0.3) { // 30% deviation
      flags.push({
        category: 'price_anomaly',
        severity: priceDeviation > 0.5 ? 'high' : 'medium',
        description: `Prix anormal: ${Math.round(priceDeviation * 100)}% d'écart du marché`,
        riskPoints: priceDeviation > 0.5 ? 40 : 25
      });
      riskScore += priceDeviation > 0.5 ? 40 : 25;
    }
  }

  // Analysis 3: Transaction speed
  const caseAge = (Date.now() - new Date(caseData.created_at).getTime()) / (1000 * 60 * 60); // hours
  if (caseAge < 24 && caseData.status === 'payment_pending') {
    flags.push({
      category: 'transaction_speed',
      severity: 'medium',
      description: 'Transaction très rapide (< 24h)',
      riskPoints: 15
    });
    riskScore += 15;
  }

  // Analysis 4: Buyer history
  if (caseData.buyer_id) {
    const { data: buyerHistory } = await supabase
      .from('purchase_cases')
      .select('id')
      .eq('buyer_id', caseData.buyer_id)
      .eq('status', 'completed');
    
    if (buyerHistory && buyerHistory.length > 10) {
      flags.push({
        category: 'buyer_pattern',
        severity: 'low',
        description: `Acheteur avec ${buyerHistory.length} achats récents (possible revendeur)`,
        riskPoints: 10
      });
      riskScore += 10;
    }
  }

  // Analysis 5: Invalid documents
  const invalidDocs = (caseData.documents || []).filter(d => d.ai_validation_status === 'invalid');
  if (invalidDocs.length > 0) {
    flags.push({
      category: 'document_validity',
      severity: 'high',
      description: `${invalidDocs.length} document(s) invalide(s) détecté(s)`,
      riskPoints: 30
    });
    riskScore += 30;
  }

  // Determine risk level
  let riskLevel = 'low';
  if (riskScore >= 70) riskLevel = 'critical';
  else if (riskScore >= 50) riskLevel = 'high';
  else if (riskScore >= 30) riskLevel = 'medium';

  return { riskScore, riskLevel, flags };
}

/**
 * Setup automatic fraud detection workflow
 * Triggers on new purchase case creation
 */
export async function setupFraudDetectionTrigger() {
  console.log('🛡️ Initializing auto-fraud-detection workflow...');

  const channel = supabase
    .channel('cases-fraud-detection')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'purchase_cases'
      },
      async (payload) => {
        const purchaseCase = payload.new;
        
        console.log(`📋 New case detected: ${purchaseCase.id}`);
        
        // Wait 60 seconds to allow document uploads
        setTimeout(async () => {
          try {
            // Fetch complete case data
            const { data: caseData, error: fetchError } = await supabase
              .from('purchase_cases')
              .select(`
                *,
                buyer:buyer_id (*),
                seller:seller_id (*),
                property:property_id (*),
                documents (*),
                transactions (*)
              `)
              .eq('id', purchaseCase.id)
              .single();
            
            if (fetchError) throw fetchError;
            
            console.log(`🔍 Analyzing fraud for case ${purchaseCase.id}...`);
            
            // Analyze
            const fraudAnalysis = await analyzeCaseFraud(caseData);
            
            console.log(`✅ Fraud analysis complete: ${fraudAnalysis.riskLevel} (score: ${fraudAnalysis.riskScore})`);
            
            // Save results
            await supabase
              .from('purchase_cases')
              .update({
                fraud_risk_score: fraudAnalysis.riskScore,
                fraud_flags: fraudAnalysis.flags,
                fraud_analyzed_at: new Date().toISOString()
              })
              .eq('id', purchaseCase.id);
            
            // If high/critical risk, alert admins
            if (['high', 'critical'].includes(fraudAnalysis.riskLevel)) {
              console.log(`⚠️ High/critical fraud detected for case ${purchaseCase.id}`);
              
              // Get admins
              const { data: admins } = await supabase
                .from('profiles')
                .select('id, email')
                .in('role', ['admin', 'super_admin']);
              
              // Notify each admin
              const notifications = admins.map(admin => ({
                user_id: admin.id,
                type: 'fraud_alert_high',
                title: `⛔ Fraude ${fraudAnalysis.riskLevel} détectée`,
                message: `Cas ${purchaseCase.case_number}: ${fraudAnalysis.flags.length} signaux, score ${fraudAnalysis.riskScore}`,
                data: { 
                  caseId: purchaseCase.id,
                  riskScore: fraudAnalysis.riskScore,
                  riskLevel: fraudAnalysis.riskLevel,
                  flags: fraudAnalysis.flags
                },
                priority: fraudAnalysis.riskLevel === 'critical' ? 'urgent' : 'high',
                read: false,
                created_at: new Date().toISOString()
              }));
              
              await supabase.from('notifications').insert(notifications);
              
              console.log(`📧 ${admins.length} admins notified`);
            }
            
          } catch (error) {
            console.error('❌ Auto-fraud-detection error:', error);
          }
        }, 60000); // 60 seconds delay
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Auto-fraud-detection workflow active');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Auto-fraud-detection workflow error');
      }
    });
    
  return channel;
}

/**
 * Manually trigger fraud analysis for existing cases
 */
export async function analyzeExistingCases() {
  console.log('🔄 Analyzing existing cases for fraud...');
  
  try {
    // Get unanalyzed cases
    const { data: cases, error } = await supabase
      .from('purchase_cases')
      .select(`
        *,
        buyer:buyer_id (*),
        seller:seller_id (*),
        property:property_id (*),
        documents (*),
        transactions (*)
      `)
      .is('fraud_analyzed_at', null)
      .limit(50);
    
    if (error) throw error;
    
    console.log(`📊 Found ${cases.length} unanalyzed cases`);
    
    let analyzed = 0;
    let highRisk = 0;
    
    for (const caseData of cases) {
      try {
        const fraudAnalysis = await analyzeCaseFraud(caseData);
        
        await supabase
          .from('purchase_cases')
          .update({
            fraud_risk_score: fraudAnalysis.riskScore,
            fraud_flags: fraudAnalysis.flags,
            fraud_analyzed_at: new Date().toISOString()
          })
          .eq('id', caseData.id);
        
        if (['high', 'critical'].includes(fraudAnalysis.riskLevel)) {
          highRisk++;
        }
        
        analyzed++;
        console.log(`✅ [${analyzed}/${cases.length}] Case ${caseData.case_number}: ${fraudAnalysis.riskLevel} (${fraudAnalysis.riskScore})`);
        
      } catch (error) {
        console.error(`❌ Failed to analyze case ${caseData.id}:`, error.message);
      }
    }
    
    console.log(`\n📊 Analysis complete: ${analyzed} cases, ${highRisk} high/critical risk`);
    
  } catch (error) {
    console.error('❌ Batch analysis error:', error);
  }
}
