# 🚀 PHASE 2 - GUIDE DE MIGRATION & TESTS

**Date:** 10 Octobre 2025  
**Prérequis:** Phase 1 complète (code déployé)  
**Durée estimée:** 2-3 heures  
**Objectif:** Exécuter migration SQL + tester toutes les fonctionnalités

---

## 📋 CHECKLIST PHASE 2

### Étape 1 : Migration SQL (15 min)
- [ ] Ouvrir Supabase Dashboard
- [ ] Aller dans SQL Editor
- [ ] Copier contenu `supabase/migrations/20251010_phase1_admin_tables.sql`
- [ ] Exécuter le script
- [ ] Vérifier 8 tables créées
- [ ] Vérifier données seed (pricing_config, team_members)

### Étape 2 : Storage Bucket (5 min)
- [ ] Ouvrir Supabase Dashboard > Storage
- [ ] Create new bucket
  - Name: `media`
  - Public: ✅ (coché)
  - File size limit: 50 MB
  - Allowed MIME types: image/*, video/*
- [ ] Créer policy publique pour lecture

### Étape 3 : Tests CMS (30 min)
- [ ] Se connecter en Admin
- [ ] Aller `/admin/cms/pages`
- [ ] Créer nouvelle page "Solutions Notaires"
  - Slug: solutions-notaires
  - Description: "Solutions digitales pour les notaires"
- [ ] Ajouter section Hero
  - Title: "Digitalisez votre étude"
  - Subtitle: "Gagnez du temps avec nos outils"
  - CTA: "Découvrir", "/contact"
- [ ] Ajouter section Features
  - Feature 1: "Signature électronique"
  - Feature 2: "Gestion dossiers"
  - Feature 3: "Suivi transactions"
- [ ] Sauvegarder (Draft)
- [ ] Publier
- [ ] Vérifier page apparaît dans liste
- [ ] Tester édition
- [ ] Tester suppression (créer page test)

### Étape 4 : Tests Leads (20 min)
- [ ] Aller sur page Contact (déconnecté)
- [ ] Remplir formulaire
  - Nom: "Test Lead"
  - Email: "test@example.com"
  - Téléphone: "+221 77 123 45 67"
  - Sujet: "Demande d'information"
  - Message: "Je souhaite des informations sur vos services"
- [ ] Soumettre
- [ ] Se reconnecter Admin
- [ ] Aller `/admin/marketing/leads`
- [ ] Vérifier lead apparaît (statut: New)
- [ ] Changer statut → Contacted
- [ ] Assigner à team member
- [ ] Ajouter notes: "Premier contact effectué"
- [ ] Vérifier stats (Total: 1, Nouveaux: 0 après changement statut)
- [ ] Tester filtres (status, source)
- [ ] Tester recherche (email, nom)
- [ ] Supprimer lead test

### Étape 5 : Tests Blog (20 min)
- [ ] Aller `/admin/blog`
- [ ] Vérifier articles existants chargés
- [ ] Créer nouvel article
  - Title: "Test Article Phase 2"
  - Category: guides
  - Content: "Contenu de test..."
  - Image: URL Unsplash
- [ ] Vérifier slug auto-généré: "test-article-phase-2"
- [ ] Publier
- [ ] Aller sur `/blog` (page publique)
- [ ] Vérifier article apparaît
- [ ] Cliquer sur article
- [ ] Vérifier BlogPostPage affiche contenu
- [ ] Retour admin, supprimer article test

### Étape 6 : Tests Analytics (30 min)
- [ ] Ouvrir site en navigation privée
- [ ] Naviguer sur plusieurs pages:
  - / (homepage)
  - /solutions
  - /blog
  - /contact
  - /tools/calculator
- [ ] Rester 30s sur chaque page
- [ ] Attendre 2-3 minutes (latency tracking)
- [ ] Se connecter Admin
- [ ] Aller `/admin/analytics`
- [ ] Vérifier section "Page Tracking Analytics"
  - Pages vues > 0
  - Visiteurs uniques: 1
  - Durée moyenne > 0
  - Taux de rebond calculé
- [ ] Changer période: 7d → 30d
- [ ] Vérifier données changent
- [ ] Tester refresh données

### Étape 7 : Tests Intégration (20 min)
- [ ] Créer page CMS avec CTA "Contactez-nous"
- [ ] Publier page
- [ ] Naviguer vers page (si route existe)
- [ ] Cliquer CTA → Contact
- [ ] Soumettre formulaire
- [ ] Vérifier lead créé avec source "cta_click"
- [ ] Vérifier event trackée dans page_events
- [ ] Vérifier analytics MAJ

---

## 🐛 DEBUG COMMUN

### Erreur : "useToast not found"
**Solution :** Utiliser `toast` de `sonner` au lieu de `useToast`
```jsx
import { toast } from 'sonner';
toast.success('Message');
```

### Erreur : "Cannot read property 'data' of undefined"
**Cause :** Service retourne `{success, data, error}`
**Solution :** Toujours vérifier `result.success` avant `result.data`
```jsx
const result = await BlogService.getPosts();
if (result.success) {
  setPosts(result.data);
}
```

### Erreur : "RLS policy violation"
**Cause :** Utilisateur pas Admin
**Solution :** Vérifier table `profiles` → `role = 'Admin'`
```sql
UPDATE profiles SET role = 'Admin' WHERE id = 'USER_ID';
```

### Erreur : "media bucket not found"
**Cause :** Bucket Storage pas créé
**Solution :** Créer bucket `media` dans Supabase Storage (étape 2)

### Erreur : "Page not found" sur /admin/cms/pages
**Cause :** Route pas importée dans App.jsx
**Solution :** Vérifier imports + routes (déjà fait Phase 1)

---

## 📊 MÉTRIQUES DE SUCCÈS

### CMS
- ✅ Création page < 5 min
- ✅ Ajout section < 30 sec
- ✅ Publication instantanée
- ✅ SEO meta editable

### Leads
- ✅ Capture lead < 3 sec après submit
- ✅ Assignation < 10 sec
- ✅ Stats temps réel
- ✅ Filtres réactifs

### Blog
- ✅ CRUD article fonctionnel
- ✅ Slug auto-généré correct
- ✅ Affichage public instantané
- ✅ Fallback données hardcodées

### Analytics
- ✅ Tracking automatique
- ✅ Durée sessions enregistrée
- ✅ Device/Browser détecté
- ✅ Dashboard mis à jour

---

## 🔧 COMMANDES UTILES

### Vérifier tables créées
```sql
SELECT tablename FROM pg_tables 
WHERE tablename IN (
  'cms_pages', 'cms_sections', 'media_assets',
  'marketing_leads', 'team_members', 'page_events',
  'page_views', 'pricing_config'
);
```

### Compter leads par statut
```sql
SELECT status, COUNT(*) 
FROM marketing_leads 
GROUP BY status;
```

### Top 10 pages vues
```sql
SELECT page, COUNT(*) as views
FROM page_views
GROUP BY page
ORDER BY views DESC
LIMIT 10;
```

### Vérifier RLS policies
```sql
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE tablename LIKE 'cms_%' OR tablename LIKE 'marketing_%';
```

---

## 📝 RAPPORT DE TESTS

### Template à remplir
```markdown
## Tests Phase 2 - [DATE]

### CMS
- [ ] Création page: ✅ / ❌ (Notes: ...)
- [ ] Édition page: ✅ / ❌
- [ ] Publication: ✅ / ❌
- [ ] Suppression: ✅ / ❌

### Leads
- [ ] Capture formulaire: ✅ / ❌
- [ ] Assignation: ✅ / ❌
- [ ] Changement statut: ✅ / ❌
- [ ] Filtres: ✅ / ❌

### Blog
- [ ] CRUD articles: ✅ / ❌
- [ ] Affichage public: ✅ / ❌
- [ ] Slug auto: ✅ / ❌

### Analytics
- [ ] Tracking pages: ✅ / ❌
- [ ] Dashboard: ✅ / ❌
- [ ] Périodes: ✅ / ❌

### Bugs trouvés
1. [Description bug]
   - Severity: High/Medium/Low
   - Steps: ...
   - Expected: ...
   - Actual: ...

### Améliorations suggérées
1. [Amélioration]
   - Impact: ...
   - Effort: ...
```

---

## 🎯 CRITÈRES DE VALIDATION

### Phase 2 complète si:
- ✅ Migration SQL exécutée sans erreur
- ✅ Bucket Storage créé
- ✅ Au moins 1 page CMS créée et publiée
- ✅ Au moins 1 lead capturé et traité
- ✅ Articles blog chargés depuis DB
- ✅ Analytics tracking fonctionnel
- ✅ Aucun bug bloquant

### Prêt pour Phase 3 (Optimisations) si:
- ✅ Tous les tests Phase 2 passés
- ✅ Performance acceptable (< 3s chargement)
- ✅ Aucune erreur console critique
- ✅ UX fluide (loading states, transitions)

---

## 🚀 PROCHAINES PHASES

### Phase 3 : Optimisations (3-4h)
- Pagination (leads, blog, analytics)
- Validations formulaires (React Hook Form + Zod)
- Drag & drop sections CMS
- Preview live pages
- Export analytics (CSV, PDF)

### Phase 4 : Extensions (4-5h)
- Templates CMS (Solutions, Guides, Outils)
- Pipeline visuel leads (Kanban)
- Notifications email (Resend/SendGrid)
- Dashboard widgets personnalisables
- Multi-langue (i18n)

### Phase 5 : Production (2-3h)
- Tests E2E (Playwright)
- Monitoring (Sentry)
- Backup automatique DB
- Documentation utilisateur
- Formation équipe

---

**Bon courage pour la Phase 2! 🎉**

La Phase 1 a posé des fondations solides. La Phase 2 va valider que tout fonctionne correctement en conditions réelles.

**Contact support:** Si problème, chercher dans logs Supabase ou console navigateur.
