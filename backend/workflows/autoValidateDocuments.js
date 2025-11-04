import { createClient } from '@supabase/supabase-js';
import { analyzeDocumentAI } from '../config/ai.js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Setup automatic document validation workflow
 * Triggers on every new document upload
 */
export async function setupDocumentValidationTrigger() {
  console.log('🤖 Initializing auto-validation workflow...');

  const channel = supabase
    .channel('documents-validation')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'documents',
        filter: 'status=eq.uploaded'
      },
      async (payload) => {
        const document = payload.new;
        
        console.log(`📄 New document detected: ${document.id} (${document.document_type})`);
        
        try {
          // Validate with AI
          const validation = await analyzeDocumentAI(
            document.file_url,
            document.document_type
          );
          
          console.log(`✅ Validation complete: ${validation.isValid ? 'VALID' : 'INVALID'} (score: ${validation.confidenceScore})`);
          
          // Update database
          const { error } = await supabase
            .from('documents')
            .update({
              ai_validation_status: validation.isValid ? 'valid' : 'invalid',
              ai_validation_score: validation.confidenceScore,
              ai_validation_issues: validation.issues,
              ai_validated_at: new Date().toISOString(),
              status: validation.isValid ? 'verified' : 'rejected'
            })
            .eq('id', document.id);
          
          if (error) throw error;
          
          // If invalid, notify user
          if (!validation.isValid) {
            await supabase.from('notifications').insert({
              user_id: document.uploaded_by,
              type: 'document_rejected',
              title: '❌ Document rejeté par l\'IA',
              message: `Votre ${document.document_type} a été rejeté: ${validation.issues.join(', ')}`,
              data: { 
                documentId: document.id,
                issues: validation.issues
              },
              read: false,
              created_at: new Date().toISOString()
            });
            
            console.log(`⚠️ User ${document.uploaded_by} notified of rejection`);
          }
          
        } catch (error) {
          console.error('❌ Auto-validation error:', error);
          
          // Update status to error
          await supabase
            .from('documents')
            .update({
              ai_validation_status: 'error',
              ai_validation_issues: [error.message],
              status: 'uploaded' // Keep uploaded for manual retry
            })
            .eq('id', document.id);
        }
      }
    )
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log('✅ Auto-validation workflow active');
      } else if (status === 'CHANNEL_ERROR') {
        console.error('❌ Auto-validation workflow error');
      }
    });
    
  return channel;
}

/**
 * Manually trigger validation for existing documents
 */
export async function validateExistingDocuments() {
  console.log('🔄 Validating existing documents...');
  
  try {
    // Get all unvalidated documents
    const { data: documents, error } = await supabase
      .from('documents')
      .select('*')
      .is('ai_validation_status', null)
      .eq('status', 'uploaded')
      .limit(100);
    
    if (error) throw error;
    
    console.log(`📊 Found ${documents.length} unvalidated documents`);
    
    let validated = 0;
    let failed = 0;
    
    for (const document of documents) {
      try {
        const validation = await analyzeDocumentAI(
          document.file_url,
          document.document_type
        );
        
        await supabase
          .from('documents')
          .update({
            ai_validation_status: validation.isValid ? 'valid' : 'invalid',
            ai_validation_score: validation.confidenceScore,
            ai_validation_issues: validation.issues,
            ai_validated_at: new Date().toISOString(),
            status: validation.isValid ? 'verified' : 'rejected'
          })
          .eq('id', document.id);
        
        validated++;
        console.log(`✅ [${validated}/${documents.length}] Document ${document.id} validated`);
        
      } catch (error) {
        failed++;
        console.error(`❌ Failed to validate document ${document.id}:`, error.message);
      }
    }
    
    console.log(`\n📊 Validation complete: ${validated} succeeded, ${failed} failed`);
    
  } catch (error) {
    console.error('❌ Batch validation error:', error);
  }
}
