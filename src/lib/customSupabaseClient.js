import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mqcsbdaonvocwfcoqyim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1xY3NiZGFvbnZvY3dmY29xeWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NTk4OTAsImV4cCI6MjA3MDMzNTg5MH0.6MGZ4jXDnDPh2aDnew4rmg-4V0OtaLhEzSwLi8qu5q0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);