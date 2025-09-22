// Repair failing accounts by ensuring identities exist and metadata/flags are valid
// Requires SUPABASE_SERVICE_ROLE env var
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE;

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE env vars');
  process.exit(1);
}

const admin = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { autoRefreshToken: false, persistSession: false } });

// Default failing emails list; can be overridden via CLI args
const DEFAULT_FAILING_EMAILS = [
  'test.admin@terangafoncier.sn',
  'family.diallo@teranga-foncier.sn',
  'ahmadou.ba@teranga-foncier.sn',
  'heritage.fall@teranga-foncier.sn',
  'domaine.seck@teranga-foncier.sn',
  'urban.developers@teranga-foncier.sn',
  'sahel.construction@teranga-foncier.sn',
  'financement.boa@teranga-foncier.sn',
  'credit.agricole@teranga-foncier.sn',
  'etude.diouf@teranga-foncier.sn',
  'chambre.notaires@teranga-foncier.sn',
  'foncier.expert@teranga-foncier.sn',
  'teranga.immobilier@teranga-foncier.sn'
];

// If emails are passed as CLI args, use them; else use defaults
const argEmails = process.argv.slice(2).filter(e => e.includes('@'));
const TARGET_EMAILS = argEmails.length ? argEmails : DEFAULT_FAILING_EMAILS;

function roleForEmail(email) {
  if (email.includes('admin')) return 'admin';
  if (email.includes('diallo') || email.includes('ahmadou')) return 'particulier';
  if (email.includes('heritage') || email.includes('seck')) return 'vendeur';
  if (email.includes('promoteur') || email.includes('urban') || email.includes('sahel')) return 'promoteur';
  if (email.includes('boa') || email.includes('agricole')) return 'banque';
  if (email.includes('notaire') || email.includes('notaires') || email.includes('etude')) return 'notaire';
  if (email.includes('foncier') || email.includes('immobilier')) return 'agent_foncier';
  return null;
}

(async () => {
  console.log('🔐 Using Supabase URL:', SUPABASE_URL);
  console.log('🧪 Target emails:', TARGET_EMAILS.join(', '));
  for (const email of TARGET_EMAILS) {
    console.log(`\n🔧 Repairing: ${email}`);
    // 1) Fetch user by email
    const { data: list, error: listErr } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
    if (listErr) throw listErr;
    const user = list.users.find(u => u.email?.toLowerCase() === email.toLowerCase());

    if (!user) {
      // Create user if missing
      const role = roleForEmail(email) || 'particulier';
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password: 'password123',
        email_confirm: true,
        app_metadata: { provider: 'email' },
        user_metadata: { role, email_verified: true, full_name: email.split('@')[0] }
      });
      if (createErr) { console.error('Create error:', createErr.message); continue; }
      console.log('✅ Created user:', created.user.id);
      continue;
    }

    // 2) Ensure identity exists (email)
    if (!user.identities || user.identities.length === 0) {
      // Workaround: delete and recreate user to rebuild identity cleanly
      console.log('⚠️ Missing identities; recreating user');
      await admin.auth.admin.deleteUser(user.id);
      const role = roleForEmail(email) || 'particulier';
      const { data: recreated, error: recErr } = await admin.auth.admin.createUser({
        email,
        password: 'password123',
        email_confirm: true,
        app_metadata: { provider: 'email' },
        user_metadata: { role, email_verified: true }
      });
      if (recErr) { console.error('Recreate error:', recErr.message); continue; }
      console.log('✅ Recreated user with identity:', recreated.user.id);
      continue;
    }

    // 3) Normalize metadata and confirm email
    const role = user.user_metadata?.role || roleForEmail(email) || 'particulier';
    const { data: updated, error: updErr } = await admin.auth.admin.updateUserById(user.id, {
      ban_duration: 'none',
      email_confirm: true,
      password: 'password123',
      app_metadata: { ...user.app_metadata, provider: 'email' },
      user_metadata: { ...user.user_metadata, role, email_verified: true }
    });
    if (updErr) { console.error('Update error:', updErr.message); continue; }
    console.log('✅ Updated user:', updated.user.id);
    // Small delay to avoid rate limits
    await new Promise(r => setTimeout(r, 200));
  }

  console.log('\n🎯 Repair pass completed. Now rerun: node test-connexions-supabase.js');
})();
