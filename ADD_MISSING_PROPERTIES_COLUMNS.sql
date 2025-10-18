-- ============================================
-- FIX COMPLET: Ajouter TOUTES les colonnes manquantes à properties
-- Date: 18 Oct 2025
-- ============================================

-- === ÉTAPE 1: INFORMATIONS DE BASE ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS property_type TEXT DEFAULT 'terrain';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'Résidentiel';

-- === ÉTAPE 2: LOCALISATION ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS postal_code TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS latitude NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS longitude NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS nearby_landmarks JSONB DEFAULT '[]'::jsonb;

-- === ÉTAPE 3: PRIX & SURFACE ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'XOF';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS surface NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS surface_unit TEXT DEFAULT 'm²';

-- === ÉTAPE 4: CARACTÉRISTIQUES ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS zoning TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS buildable_ratio NUMERIC;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS max_floors INTEGER;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS land_registry_ref TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS title_deed_number TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS legal_status TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS main_features JSONB DEFAULT '[]'::jsonb;

-- === ÉTAPE 5: ÉQUIPEMENTS ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS utilities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS access JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS amenities JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS nearby_facilities JSONB DEFAULT '[]'::jsonb;

-- === ÉTAPE 6: FINANCEMENT ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS financing_methods JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS bank_financing_available BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS min_down_payment TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS max_duration TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS partner_banks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS installment_available BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS installment_duration TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS monthly_payment TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS crypto_available BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS accepted_cryptos JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS crypto_discount TEXT;

-- === ÉTAPE 7: BLOCKCHAIN & NFT ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS nft_available BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS blockchain_network TEXT DEFAULT 'Polygon';

-- === ÉTAPE 8: DOCUMENTS ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS has_title_deed BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS has_survey BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS has_building_permit BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS has_urban_certificate BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::jsonb;

-- === IMAGES & MÉTADONNÉES ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS view_count INTEGER DEFAULT 0;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- === STATUT & PUBLICATION ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT true;

-- === RÉFÉRENCES & AUDIT ===
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS reference TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS document_type TEXT;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS bedrooms INTEGER;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS bathrooms INTEGER;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS negotiable BOOLEAN DEFAULT false;
ALTER TABLE public.properties ADD COLUMN IF NOT EXISTS area NUMERIC;

-- ============================================
-- ✅ TOUTES les colonnes manquantes ont été ajoutées!
-- ============================================
