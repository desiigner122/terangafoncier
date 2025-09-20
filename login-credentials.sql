-- IDENTIFIANTS D'ACCÈS DES COMPTES CRÉÉS
-- Ce script affiche les informations de connexion pour tous les comptes standardisés

-- ⚠️ INFORMATIONS IMPORTANTES DE SÉCURITÉ ⚠️
-- 1. Ce script affiche les informations sensibles de connexion
-- 2. À utiliser uniquement en environnement sécurisé
-- 3. Changer TOUS les mots de passe après première utilisation

-- IDENTIFIANTS D'ACCÈS DES COMPTES CRÉÉS
-- Ce script affiche les informations de connexion pour tous les comptes standardisés

-- ⚠️ INFORMATIONS IMPORTANTES DE SÉCURITÉ ⚠️
-- 1. Ce script affiche les informations sensibles de connexion
-- 2. À utiliser uniquement en environnement sécurisé
-- 3. Changer TOUS les mots de passe après première utilisation

-- IDENTIFIANTS D'ACCÈS COMPLETS
SELECT 
    p.email as "📧 EMAIL",
    'TempPass2024!' as "🔑 MOT DE PASSE",
    p.role as "🎯 RÔLE", 
    p.full_name as "👤 NOM COMPLET",
    p.phone as "📞 TÉLÉPHONE"
FROM public.profiles p
ORDER BY 
    CASE p.role
        WHEN 'Admin' THEN 1
        WHEN 'Particulier' THEN 2  
        WHEN 'Vendeur Particulier' THEN 3
        WHEN 'Vendeur Pro' THEN 4
        WHEN 'Notaire' THEN 5
        WHEN 'Agent Foncier' THEN 6
        WHEN 'Géomètre' THEN 7
        WHEN 'Promoteur' THEN 8
        WHEN 'Mairie' THEN 9
        WHEN 'Investisseur' THEN 10
        WHEN 'Banque' THEN 11
        ELSE 12
    END;

-- RÉCAPITULATIF SIMPLE DES CONNEXIONS
SELECT 
    'COMPTE ' || ROW_NUMBER() OVER (ORDER BY 
        CASE p.role
            WHEN 'Admin' THEN 1
            WHEN 'Particulier' THEN 2  
            WHEN 'Vendeur Particulier' THEN 3
            WHEN 'Vendeur Pro' THEN 4
            WHEN 'Notaire' THEN 5
            WHEN 'Agent Foncier' THEN 6
            WHEN 'Géomètre' THEN 7
            WHEN 'Promoteur' THEN 8
            WHEN 'Mairie' THEN 9
            WHEN 'Investisseur' THEN 10
            WHEN 'Banque' THEN 11
            ELSE 12
        END
    ) as "N°",
    p.role as "RÔLE",
    p.email as "📧 EMAIL",
    'TempPass2024!' as "🔑 MOT DE PASSE",
    p.full_name as "👤 NOM COMPLET"
FROM public.profiles p
ORDER BY 
    CASE p.role
        WHEN 'Admin' THEN 1
        WHEN 'Particulier' THEN 2  
        WHEN 'Vendeur Particulier' THEN 3
        WHEN 'Vendeur Pro' THEN 4
        WHEN 'Notaire' THEN 5
        WHEN 'Agent Foncier' THEN 6
        WHEN 'Géomètre' THEN 7
        WHEN 'Promoteur' THEN 8
        WHEN 'Mairie' THEN 9
        WHEN 'Investisseur' THEN 10
        WHEN 'Banque' THEN 11
        ELSE 12
    END;

-- GUIDE DE CONNEXION DÉTAILLÉ
SELECT 
    p.role as "🎯 RÔLE",
    p.email as "📧 EMAIL DE CONNEXION",
    'TempPass2024!' as "🔑 MOT DE PASSE TEMPORAIRE",
    CASE p.role
        WHEN 'Admin' THEN '👑 Accès complet à toutes les fonctionnalités'
        WHEN 'Particulier' THEN '🏠 Recherche et achat de parcelles'
        WHEN 'Vendeur Particulier' THEN '💰 Vente de parcelles personnelles'
        WHEN 'Vendeur Pro' THEN '🏢 Vente professionnelle multiple'
        WHEN 'Notaire' THEN '⚖️ Authentification des transactions'
        WHEN 'Agent Foncier' THEN '📋 Gestion administrative foncière'
        WHEN 'Géomètre' THEN '📐 Mesures et délimitations'
        WHEN 'Promoteur' THEN '🏗️ Développement de projets'
        WHEN 'Mairie' THEN '🏛️ Gestion communale'
        WHEN 'Investisseur' THEN '💼 Investissement immobilier'
        WHEN 'Banque' THEN '🏦 Financement et crédits'
        ELSE '❓ Rôle non défini'
    END as "📝 DESCRIPTION",
    '/dashboard' as "🔗 URL D'ACCÈS"
FROM public.profiles p
ORDER BY 
    CASE p.role
        WHEN 'Admin' THEN 1
        WHEN 'Particulier' THEN 2  
        WHEN 'Vendeur Particulier' THEN 3
        WHEN 'Vendeur Pro' THEN 4
        WHEN 'Notaire' THEN 5
        WHEN 'Agent Foncier' THEN 6
        WHEN 'Géomètre' THEN 7
        WHEN 'Promoteur' THEN 8
        WHEN 'Mairie' THEN 9
        WHEN 'Investisseur' THEN 10
        WHEN 'Banque' THEN 11
        ELSE 12
    END;

/*
═══════════════════════════════════════════════════════════════
📋 RÉSUMÉ DES IDENTIFIANTS D'ACCÈS - TERANGA FONCIER
═══════════════════════════════════════════════════════════════

🔐 MOT DE PASSE UNIVERSEL: TempPass2024!

📧 COMPTES CRÉÉS:
1. admin@terangafoncier.sn               | Admin
2. particulier@terangafoncier.sn         | Particulier  
3. vendeur.particulier@terangafoncier.sn | Vendeur Particulier
4. vendeur.pro@terangafoncier.sn         | Vendeur Pro
5. notaire@terangafoncier.sn             | Notaire
6. agent.foncier@terangafoncier.sn       | Agent Foncier
7. geometre@terangafoncier.sn            | Géomètre
8. promoteur@terangafoncier.sn           | Promoteur
9. mairie@terangafoncier.sn              | Mairie
10. investisseur@terangafoncier.sn       | Investisseur
11. banque@terangafoncier.sn             | Banque

⚠️ SÉCURITÉ IMPORTANTE:
- Changer immédiatement tous les mots de passe après première connexion
- Utiliser des mots de passe forts et uniques
- Activer l'authentification à deux facteurs si disponible

🌐 URL DE CONNEXION: 
https://votre-domaine.com/login

═══════════════════════════════════════════════════════════════
*/