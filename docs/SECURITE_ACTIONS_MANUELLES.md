# Actions de sécurité à mener hors du code

Suite à l'audit du 31/10/2026. Les correctifs de code sont dans la branche
`claude/compassionate-pasteur-91646p`. Les actions ci-dessous **ne peuvent pas
être faites depuis le dépôt** et doivent être réalisées par le propriétaire du
projet. Elles sont classées par urgence.

## 1. Immédiatement

1. **Passer le dépôt GitHub en privé**
   `Settings → General → Danger Zone → Change visibility`.
   Le dépôt était public avec des secrets dedans.

2. **Révoquer les clés Supabase exposées** (elles restent valides même après
   suppression des fichiers, car elles sont dans l'historique git) :
   - projet `ndenqikcogzrkrjnlvns` (ancien, en pause) : clé `service_role`
     et clé `anon` → *Project Settings → API → Reset / rotate JWT secret* ;
   - projet `rpwsqgpyzdxcjkgixhqd` : clé `service_role` ;
   - projets `upqthvkkgmykydxrpupm` et `blwxmlxtukctyxwfsvdi` (V1, actif) :
     clés `anon` exposées — la clé `anon` est publique par nature, mais la
     faire tourner reste recommandé.

3. **Changer tous les secrets configurés sur Vercel** (projet frontend).
   La configuration Vite copiait **l'intégralité de `process.env`** dans le
   JavaScript public : chaque variable d'environnement du projet Vercel a été
   servie aux visiteurs. Après avoir déployé cette branche, régénérer :
   `JWT_SECRET`, `JWT_REFRESH_SECRET`, clés Stripe, OpenAI, Google, Cloudinary,
   Mapbox, clé privée Polygon, etc.

4. **Réinitialiser les mots de passe** des comptes listés dans les anciens
   fichiers `LOGIN-CREDENTIALS-ALL-ROLES.md` et `login-credentials.sql`
   (19 comptes dont l'admin, mot de passe partagé). Supprimer les comptes de
   test inutiles.

5. **Secret JWT du backend** : la valeur de `backend/vercel-environment-variables.txt`
   était commitée. Générer un nouveau `JWT_SECRET` (≥ 32 caractères aléatoires)
   et un `PAYMENT_WEBHOOK_SECRET` pour le webhook de paiement.

## 2. Dans la semaine

6. **Appliquer la migration de durcissement** sur le projet Supabase V1 :
   ```bash
   supabase link --project-ref blwxmlxtukctyxwfsvdi
   supabase db push
   ```
   ou copier `supabase/migrations/20261031000000_security_hardening.sql` dans
   l'éditeur SQL du dashboard. Elle :
   - interdit à un utilisateur de changer son propre `role` / statut ;
   - réserve aux admins les fonctions qui lisent `auth.users` ;
   - supprime les policies `USING (true)` sur les tables sensibles ;
   - fixe `search_path` sur toutes les fonctions `SECURITY DEFINER`.

7. **Vérifier l'état réel de la base** avec *Database → Advisors (Security)*
   dans le dashboard Supabase, et avec :
   ```sql
   select tablename, rowsecurity from pg_tables where schemaname = 'public' and not rowsecurity;
   select * from pg_policies where schemaname = 'public' and qual = 'true';
   ```
   Corriger ce qui reste.

8. **Récupérer le schéma réel** pour qu'il devienne la source de vérité :
   `supabase db pull`, puis commiter le résultat dans `supabase/migrations/`.
   Les 370 scripts SQL historiques sont archivés dans `sql/` et ne doivent
   plus être appliqués à la main.

9. **Promouvoir les admins** : avec la nouvelle règle, un compte ne devient
   admin que par un `UPDATE public.profiles SET role = 'admin' WHERE id = …`
   exécuté avec la clé `service_role` (éditeur SQL du dashboard), ou par un
   admin existant depuis l'interface.

10. **Backend** : définir `FRONTEND_URL` (origines autorisées, séparées par
    des virgules), `JWT_SECRET`, `PAYMENT_WEBHOOK_SECRET`. Le serveur refuse
    désormais de démarrer sans `JWT_SECRET`. Le webhook de paiement exige un
    en-tête `X-Webhook-Signature` (HMAC-SHA256 du corps brut).

11. **Proxy IA** : si les fonctionnalités IA doivent fonctionner, créer un
    endpoint serveur qui détient la clé OpenAI et définir `VITE_AI_PROXY_URL`.
    Sans cela, les services IA utilisent leurs réponses locales (mode
    simulation).

## 3. Ensuite

- Nettoyer l'historique git des secrets (`git filter-repo`) **après** avoir
  révoqué les clés : la révocation prime, le nettoyage évite seulement les
  alertes.
- Remplacer les données fictives (`Math.random`) restantes dans certains
  dashboards par de vraies requêtes ou des états vides.
- `src/services/TerangaBlockchainService.js` utilise `ethers.utils` (API
  ethers v5) alors que la dépendance est ethers v6 : ce code échoue à
  l'exécution. À migrer ou retirer.
- Les fonctions de rendu du tableau de bord admin ont été converties en
  composants (`Admin*Section`) pour respecter les règles des hooks ; elles
  gagneraient à être extraites dans des fichiers dédiés.
