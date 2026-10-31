# ANALYSE POUR L'IA SUPABASE - ÉCHECS D'AUTHENTIFICATION PERSISTANTS

## CONTEXTE DU PROBLÈME
- **Plateforme**: Application React avec authentification Supabase
- **Taux de succès**: 6/20 comptes fonctionnent (30%), 14 échouent (70%)
- **Message d'erreur**: "Database error querying schema" après authentification
- **UUID Validation**: ✅ CONFIRMÉ - Tous les UUID sont valides (VALID_UUID_V4)

## COMPTES QUI FONCTIONNENT (6)
1. geowest.africa@teranga-foncier.sn
2. cabinet.ndiaye@teranga-foncier.sn  
3. atlantique.capital@teranga-foncier.sn
4. fonds.souverain@teranga-foncier.sn
5. mairie.thies@teranga-foncier.sn
6. mairie.dakar@teranga-foncier.sn

## COMPTES QUI ÉCHOUENT (14)
- ahmadou.ba@teranga-foncier.sn ❌
- domaine.seck@teranga-foncier.sn ❌
- + 12 autres comptes (tous avec UUID valides)

## INVESTIGATIONS RÉALISÉES
### ✅ Email Confirmation
- Tous les 20 comptes ont email_confirmed_at défini
- Problème éliminé

### ✅ UUID Format Validation  
- Diagnostic complet exécuté avec regex UUID v4
- TOUS les comptes montrent VALID_UUID_V4
- Hypothèse UUID malformé éliminée

### ✅ Données de Base
- Tous les comptes existent dans auth.users
- Tous ont des métadonnées complètes (raw_user_meta_data)
- Email confirmation OK pour tous

## DIAGNOSTIC TECHNIQUE REQUIS

### 1. STRUCTURE DES TABLES
```sql
-- Tables impliquées dans l'authentification
- auth.users (authentification Supabase)
- public.profiles (données utilisateur legacy)  
- public.users (données utilisateur principales)
```

### 2. HYPOTHÈSES À VÉRIFIER
- **Politiques RLS conflictuelles**: Les 6 comptes qui marchent ont peut-être des permissions spéciales
- **Données manquantes**: Différences dans public.profiles vs public.users
- **Triggers défaillants**: Triggers qui bloquent certains comptes
- **Contraintes de schéma**: Violations de contraintes pour certains IDs

### 3. PATTERN SUSPECT
- Le fait que exactement les MÊMES 6 comptes fonctionnent à chaque test
- Suggère un problème systémique, pas aléatoire
- Probablement lié à des différences de configuration/données entre ces comptes

## CODE D'AUTHENTIFICATION
```javascript
// AuthContext.jsx - Code qui échoue pour 14 comptes
const { data, error } = await supabase
  .from('users')  // Updated from 'profiles' 
  .select('*')
  .eq('id', user.id)
  .single();
```

## QUESTIONS POUR L'IA SUPABASE
1. **Politiques RLS**: Comment identifier si certains comptes sont bloqués par des politiques RLS trop restrictives sur la table public.users ?

2. **Différences de données**: Quel diagnostic SQL permettrait de comparer les 6 comptes qui marchent vs les 14 qui échouent pour identifier les différences critiques ?

3. **Triggers et contraintes**: Comment lister tous les triggers et contraintes qui pourraient causer "Database error querying schema" spécifiquement ?

4. **Pattern d'accès**: Pourquoi exactement les mêmes comptes échouent/réussissent de façon consistante ? Quelle différence de configuration pourrait expliquer ce pattern ?

5. **Erreur spécifique**: Que signifie exactement "Database error querying schema" dans le contexte Supabase et quelles sont les causes les plus communes ?

## DIAGNOSTIC SQL RECOMMANDÉ
Peux-tu me fournir des requêtes SQL spécifiques pour :
- Comparer les 6 comptes qui marchent vs 14 qui échouent
- Identifier les différences dans les politiques RLS appliquées
- Vérifier les contraintes et triggers qui pourraient bloquer l'accès
- Analyser les permissions et rôles pour ces comptes spécifiques

## OBJECTIF
Atteindre 20/20 comptes fonctionnels (100% de succès) en identifiant et corrigeant la cause racine de l'erreur "Database error querying schema" pour les 14 comptes qui échouent malgré des UUID valides et des emails confirmés.