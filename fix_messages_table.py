#!/usr/bin/env python3
"""
Script pour exécuter la migration de la table messages directement
via l'API PostgreSQL de Supabase
"""

import os
import psycopg2
from psycopg2 import sql

# Configuration Supabase
SUPABASE_URL = os.getenv('VITE_SUPABASE_URL', 'https://ndenqikcogzrkrjnlvns.supabase.co')
SUPABASE_DB_PASSWORD = os.getenv('SUPABASE_DB_PASSWORD')  # Doit être défini

# Parser l'URL Supabase pour obtenir les détails
# Format: https://<project-id>.supabase.co
project_id = SUPABASE_URL.split('//')[-1].split('.')[0]

# Chaîne de connexion
conn_string = f"postgresql://postgres:{SUPABASE_DB_PASSWORD}@db.ndenqikcogzrkrjnlvns.supabase.co:5432/postgres"

try:
    conn = psycopg2.connect(conn_string)
    cursor = conn.cursor()
    
    print("✅ Connecté à Supabase PostgreSQL")
    
    # Migration SQL
    migration_sql = """
    -- Drop existing problematic messages table
    DROP TABLE IF EXISTS public.messages CASCADE;
    
    -- Créer la table messages avec la structure correcte
    CREATE TABLE public.messages (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      recipient_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
      subject TEXT,
      body TEXT NOT NULL DEFAULT '',
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    -- Add proper indexes
    CREATE INDEX idx_messages_sender_recipient ON public.messages(sender_id, recipient_id);
    CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
    CREATE INDEX idx_messages_is_read ON public.messages(is_read);
    CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);
    
    -- Enable RLS
    ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
    
    -- RLS Policies
    CREATE POLICY "Users can view their own messages" ON public.messages
      FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
    
    CREATE POLICY "Users can send messages" ON public.messages
      FOR INSERT WITH CHECK (auth.uid() = sender_id);
    
    CREATE POLICY "Users can update their own messages" ON public.messages
      FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
    """
    
    cursor.execute(migration_sql)
    conn.commit()
    
    print("✅ Migration appliquée avec succès!")
    
    # Vérifier la structure de la table
    cursor.execute("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'messages'
        ORDER BY ordinal_position;
    """)
    
    print("\n📊 Structure de la table messages:")
    for row in cursor.fetchall():
        print(f"  - {row[0]}: {row[1]} (nullable={row[2]}, default={row[3]})")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"❌ Erreur: {e}")
    exit(1)
