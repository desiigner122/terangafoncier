import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ndenqikcogzrkrjnlvns.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kZW5xaWtjb2d6cmtyanJsam52cyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzI1MzAzMjgwLCJleHAiOjIwNDA4NzkyODB9.r_vUL8kHNV3RZTnr6TdSvOFvqE-x02M7SWBh1oQhzWU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);