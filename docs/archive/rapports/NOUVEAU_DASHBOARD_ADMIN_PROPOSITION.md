# Nouveau Dashboard Admin — Proposition Alignée sur les Pages Publiques et "Solutions"

## Objectifs
- Unifier pilotage business, contenu marketing et opérations.
- Remplacer les sections mockées par des écrans et des métriques réelles.
- Donner de la visibilité sur les tunnels (Solutions → Leads → Conversions).
- Outiller le SEO/Blog, les A/B tests, les traductions, et les Feature Flags sans code.

## Cartographie des pages publiques et besoins d’administration
Basé sur `src/App.jsx` (routes publiques principales):
- Accueil et pages génériques: Home, About, Contact, HowItWorks, FAQ, Partners, Success Stories, Legal/Privacy/Cookies/Terms/Data Protection.
- Contenu "Guides": Diaspora, Guides & Tutoriels, DocumentsFonciers, LoisFoncieres, ProjectsGuide, RequestsGuide, Glossary, TaxGuide.
- Solutions (verticales): Banques, Notaires, Promoteurs, Vendeurs, Investisseurs, Agriculteurs, Diaspora Investment, Construction à distance, Project Monitoring, Agents fonciers, Géomètres.
- Produits / Outils: Price Calculator, Market Analysis, Interactive Map, Property Verification, NFT Properties, Smart Contracts, Escrow.
- Marketing/Commercial: Pricing, Rejoignez-nous, Become Seller, Success, Checkout/Payment.
- Blog: Blog (liste) + BlogPost (détail).

Ces sections appellent des capacités admin:
- CMS Pages & Sections (édition landing/solutions/guides).
- SEO & Blog (déjà présent: AdminBlogPage) + métadonnées SEO.
- Leads & Funnels (collecte des formulaires, attribution UTM, assignation).
- Analytics de pages & événements (CTA, scroll, sorties, conversions jusqu’à register).
- Navigation & Traductions (menus, locales FR/EN/WO).
- Feature Flags & Expériences (A/B tests, rollouts progressifs).

## IA du nouveau Dashboard Admin
Regrouper en 6 rubriques, avec navigation latérale simple et badges (chiffres en temps réel via Supabase):

1) Aperçu (Overview)
- KPI clés: trafic ≈ (proxy via événements), leads, conversions, revenus, tickets ouverts, propriétés en attente, signups 7/30j.
- Flux récent: derniers leads, tickets, publications, mises à jour prix.

2) Contenu & Site
- Pages & Sections: CRUD de pages (Solutions/Guides/Static) avec blocs JSON (Hero, Features, Proof, CTA, FAQ).
- SEO & Blog: articles (existant), SEO meta (titre, description, og:image), sitemaps à générer côté build.
- Media Library: assets (images/documents) avec tags et usages.
- Navigation: menus header/footer par clés; drag & drop ordre.
- Traductions: clés i18n, locales FR/EN/WO, statut complétion.

3) Marketing & Croissance
- Leads: table de prospects (source, utm, formulaire, statut, assigné à, notes).
- Campagnes: UTM, landing ciblées, budget, KPI (clics, leads, conv.).
- Funnels: pages → événements → conversion (ex: Solutions/Vendeurs → register/sell-property).
- A/B Tests: expériences, variantes, trafic %, résultats (statistiques simples, p-value ultérieure).

4) Opérations
- Utilisateurs (réel) — déjà modernisé.
- Propriétés (réel) — modernisé.
- Transactions (réel) — modernisé.
- Support/Tickets (réel) — admin peut répondre, assigner, fermer.
- Rapports & Modération: signalements contenus/annonces.

5) Conformité & Qualité
- Audit Log (existant), Statut RLS.
- Vérifications (KYC/kyb), 
- Système: santé (ping API, latence Supabase proxy), quantité d’assets, erreurs récentes.

6) Paramètres
- Plateforme (général, notifications, sécurité, paiements).
- Intégrations (IA, Blockchain) — déjà préparé dans ModernSettingsPage.
- Accès & Rôles — cartographie rôles → routes.

## Données & Schéma Supabase (proposition)
Tables nouvelles (nommage simple, JSONB pour flexibilité):
- cms_pages: id, slug, title, category (solution, guide, static), status (draft/published), seo_meta JSONB, content JSONB, updated_at.
- cms_sections: id, page_id FK, key, content JSONB, order_index.
- media_assets: id, url, alt, tags[], used_in JSONB, created_at.
- seo_meta: id, page_slug, title, description, og_image, noindex, locale.
- marketing_leads: id, source, utm JSONB, form_name, payload JSONB, status, assigned_to, created_at.
- page_events: id, page, event_type, user_id NULLABLE, metadata JSONB, created_at.
- experiments: id, key, goal, status, created_at.
- experiment_variants: id, experiment_id FK, name, traffic, page_targeting JSONB.
- experiment_assignments: id, experiment_id, user_or_anon_id, variant, created_at.
- nav_menu: id, key (header/footer), items JSONB.
- translations: id, key, locale, value, updated_at.
- feature_flags: id, key, enabled, rollout, audience JSONB, updated_at.
- forms: id, name, schema JSONB, destination (table/webhook), active.
- form_submissions: id, form_id, user_id NULL, payload JSONB, created_at.

Note: Blog existant (blog_posts) inchangé conformément aux consignes.

## Écrans Admin → Tables
- Contenu & Site / Pages & Sections → cms_pages, cms_sections, seo_meta, media_assets.
- SEO & Blog → blog_posts (existant), seo_meta, media_assets.
- Leads → marketing_leads, form_submissions.
- Funnels & Analytics → page_events (+ jointures users si user_id).
- A/B Tests → experiments, experiment_variants, experiment_assignments.
- Navigation → nav_menu.
- Traductions → translations.
- Feature Flags → feature_flags.

## KPIs par section
- Solutions (par verticale): vues, CTR CTA principal, leads, conv. → account/register, conv. → sell-property.
- Guides/Glossary/Tax: vues, temps moyen, entrée SEO (landing), taux de rebond.
- Pricing: vues, clics CTA, démarrages checkout, abandons.
- Blog: vues article, sources trafic (utm), abonnements newsletter (si formulaires).

## Intégration Front
- Récupérer cms_pages par slug (ex: "/solutions/vendeurs") et rendre des blocs dynamiques (content JSONB).
- Fallback: si page non configurée, utiliser version statique actuelle pour compat.
- Instrumenter événements (onClick CTA, onSubmit Form) → page_events.
- Formulaires public → form_submissions + marketing_leads.

## Sécurité & RLS
- cms_pages en lecture publique (status = published); écriture/admin via rôle "admin".
- leads/assignments/flags: accès restreint admin.
- events: insertion publique sans auth (row limité à metadata safe), lectures agrégées admin.

## Déploiement par phases
- Phase A (1-2 j):
  - Créer tables cms_pages, cms_sections, seo_meta, media_assets, nav_menu, translations (DDL fourni en brouillon si besoin).
  - Admin: ajouter menu "Contenu & Site" avec Pages & SEO (list + edit minimal).
  - Intégrer lecture CMS pour 1 page Solutions (ex: Notaires) en mode progressive enhancement.
- Phase B (2-3 j):
  - Leads, page_events, formulaire Contact → form_submissions/marketing_leads.
  - Écran Admin Leads + Funnels (listes, filtres par UTM/source, timeline funnel simple).
- Phase C (2-3 j):
  - Experiments & Feature Flags, A/B sur Hero/Titre CTA d’1 page Solutions.
  - Navigation editor + traductions clés (FR/EN/WO) pour header/footer.

## Navigation proposée (Admin)
- Accueil
- Contenu & Site
  - Pages & Sections
  - SEO & Blog
  - Media Library
  - Navigation
  - Traductions
- Marketing & Croissance
  - Leads
  - Funnels & Événements
  - Campagnes
  - A/B Tests
- Opérations
  - Utilisateurs
  - Propriétés
  - Transactions
  - Support/Tickets
  - Rapports & Modération
- Conformité & Qualité
  - Audit Log
  - Vérifications
  - Système
- Paramètres
  - Plateforme
  - Intégrations IA/Blockchain
  - Accès & Rôles

## Livrables rapides (proposés)
- Doc d’API minimale GlobalAdminService pour: cms_pages, leads, events.
- Hook useAdminContent() (listPages, getPage, savePage, publish, uploadAsset).
- Deux composants admin:
  - AdminPagesList.jsx (table + recherche + statut + actions).
  - AdminPageEditor.jsx (builder de blocs simple: Hero/Features/CTA/FAQ).

## Prochaines étapes
- Valider les rubriques et la navigation.
- Générer le DDL Supabase prêt à exécution (si validé), puis créer 2 écrans admin (Pages & SEO) en premier.
- Instrumenter 1 page Solutions pilote (ex: Notaires) avec CMS + événements + CTA lead.
- Étendre aux autres verticales et au Pricing.
