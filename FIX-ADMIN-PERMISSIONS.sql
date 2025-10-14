-- ===================================================================
-- FIX URGENT : PERMISSIONS ADMINISTRATEUR (RLS)
-- ===================================================================
-- Objectif: Donner à l'administrateur un accès complet aux tables
--           critiques pour résoudre les problèmes de visibilité.
-- Date: 12 Octobre 2025
-- IMPORTANT: Exécutez CREATE-GET-USER-ROLE-FUNCTION.sql AVANT ce script
-- ===================================================================

-- Étape 1: S'assurer que RLS est activé sur les tables
ALTER TABLE public.marketing_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Étape 2: Supprimer les anciennes politiques potentiellement restrictives
DROP POLICY IF EXISTS "Admin_Full_Access_MarketingLeads" ON public.marketing_leads;
DROP POLICY IF EXISTS "Admin_Full_Access_Properties" ON public.properties;
DROP POLICY IF EXISTS "Admin_Full_Access_SupportTickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Public_Read_Available_Properties" ON public.properties;
DROP POLICY IF EXISTS "Owner_Full_Access_Properties" ON public.properties;
DROP POLICY IF EXISTS "User_Can_See_Own_Tickets" ON public.support_tickets;

-- Étape 3: Créer des politiques qui donnent un accès TOTAL à l'admin

-- Politique pour les LEADS
CREATE POLICY "Admin_Full_Access_MarketingLeads"
ON public.marketing_leads
FOR ALL
USING (get_user_role() = 'admin')
WITH CHECK (get_user_role() = 'admin');

-- Politique pour les PROPRIÉTÉS
CREATE POLICY "Admin_Full_Access_Properties"
ON public.properties
FOR ALL
USING (get_user_role() = 'admin')
WITH CHECK (get_user_role() = 'admin');

-- Politique pour les TICKETS
CREATE POLICY "Admin_Full_Access_SupportTickets"
ON public.support_tickets
FOR ALL
USING (get_user_role() = 'admin')
WITH CHECK (get_user_role() = 'admin');

-- Étape 4: Ajouter des politiques pour les autres utilisateurs (non-admin)

-- Les utilisateurs authentifiés peuvent voir les propriétés disponibles
CREATE POLICY "Public_Read_Available_Properties"
ON public.properties
FOR SELECT
USING (status = 'disponible');

-- Les propriétaires peuvent voir et modifier leurs propres propriétés
CREATE POLICY "Owner_Full_Access_Properties"
ON public.properties
FOR ALL
USING (auth.uid() = owner_id)
WITH CHECK (auth.uid() = owner_id);

-- Les utilisateurs peuvent voir leurs propres tickets
CREATE POLICY "User_Can_See_Own_Tickets"
ON public.support_tickets
FOR SELECT
USING (auth.uid() = user_id);

-- ===================================================================
-- VÉRIFICATION
-- ===================================================================
-- Cette requête liste les nouvelles politiques que nous venons de créer.
SELECT 
    tablename,
    policyname,
    cmd as operation,
    CASE 
        WHEN policyname LIKE 'Admin%' THEN '👑 Admin'
        WHEN policyname LIKE 'Owner%' THEN '👤 Owner'
        ELSE '🌍 Public'
    END as access_type
FROM pg_policies 
WHERE tablename IN ('marketing_leads', 'properties', 'support_tickets')
ORDER BY tablename, policyname;
