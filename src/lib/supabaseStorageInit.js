/**
 * Utilitaires de stockage Supabase côté client
 * Version sécurisée sans clés d'administration
 */

// Script d'initialisation Supabase côté client (sans clé service)
export async function initializeClientStorage(supabaseClient) {
  console.log('🔧 Vérification des buckets côté client...');
  
  try {
    const { data: buckets } = await supabaseClient.storage.listBuckets();
    console.log('📋 Buckets disponibles:', buckets?.map(b => b.name) || []);
    
    return {
      hasAvatars: buckets?.some(b => b.name === 'avatars') || false,
      hasDocuments: buckets?.some(b => b.name === 'documents') || false,
      hasParcels: buckets?.some(b => b.name === 'parcels') || false
    };
  } catch (error) {
    console.warn('⚠️  Impossible de vérifier les buckets:', error);
    return {
      hasAvatars: false,
      hasDocuments: false,
      hasParcels: false
    };
  }
}

// Fonction utilitaire pour upload sécurisé
export async function safeStorageUpload(supabaseClient, bucket, filePath, file, options = {}) {
  try {
    // Vérifier que le bucket existe
    const { data: buckets } = await supabaseClient.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === bucket);
    
    if (!bucketExists) {
      throw new Error(`Bucket "${bucket}" non disponible`);
    }
    
    // Effectuer l'upload
    const { data, error } = await supabaseClient.storage
      .from(bucket)
      .upload(filePath, file, options);
    
    if (error) throw error;
    
    // Récupérer l'URL publique si le bucket est public
    const { data: { publicUrl } } = supabaseClient.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return {
      success: true,
      data,
      publicUrl,
      error: null
    };
    
  } catch (error) {
    console.error(`Erreur upload ${bucket}:`, error);
    return {
      success: false,
      data: null,
      publicUrl: null,
      error: error.message
    };
  }
}

// Export par défaut pour ES modules
export default safeStorageUpload;
