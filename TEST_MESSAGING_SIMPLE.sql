-- Test simple - créer juste la table de messages
DROP TABLE IF EXISTS purchase_case_messages CASCADE;

CREATE TABLE purchase_case_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id UUID NOT NULL REFERENCES purchase_cases(id) ON DELETE CASCADE,
  sent_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  attachments JSONB DEFAULT NULL,
  read_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Vérifier que la table est créée
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'purchase_case_messages' 
ORDER BY ordinal_position;
