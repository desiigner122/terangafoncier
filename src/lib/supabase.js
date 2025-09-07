// Mock Supabase pour desactiver temporairement les appels DB
console.warn('Supabase desactive - Mode comptes de test uniquement');

export const supabase = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    getUser: () => Promise.resolve({ data: { user: null }, error: null }),
    signInWithPassword: () => Promise.resolve({ data: null, error: new Error('Supabase desactive') }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
  },
  from: () => ({
    select: () => ({ data: [], error: null }),
    insert: () => ({ data: null, error: new Error('DB desactivee') }),
    update: () => ({ data: null, error: new Error('DB desactivee') }),
    delete: () => ({ data: null, error: new Error('DB desactivee') }),
    upsert: () => ({ data: null, error: new Error('DB desactivee') })
  })
};

export const createClient = () => supabase;
export default supabase;
