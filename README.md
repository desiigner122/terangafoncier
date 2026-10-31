# Teranga Foncier

Plateforme foncière sénégalaise : annonces de terrains, demandes communales,
suivi de dossiers et tableaux de bord par rôle (particulier, vendeur, promoteur,
banque, notaire, géomètre, mairie, administrateur).

- **Frontend** : React 18 + Vite 4 + Tailwind, déployé sur Vercel (`vercel.json`).
- **Données & auth** : Supabase (projet « Teranga Foncier V1 »).
- **Backend Express** (`backend/`) : API complémentaire, déployée séparément.

## Démarrer

```bash
npm ci
cp .env.example .env.local   # puis renseigner VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY
npm run dev
```

Scripts :

| Commande | Rôle |
| --- | --- |
| `npm run dev` | serveur de développement |
| `npm run build` | build de production (génère aussi `public/version.json`) |
| `npm run lint` | ESLint sur `src/` |
| `npm run preview` | prévisualiser le build |

## Structure

```
src/            application React (pages, composants, services, contextes)
backend/        API Express (point d'entrée déployé : backend/server.js)
supabase/       config Supabase + migrations versionnées (source de vérité)
sql/            anciens scripts SQL (archive, non appliqués automatiquement)
scripts/        scripts de build (generate-version.js) et scripts historiques (legacy/)
docs/           documentation ; docs/archive contient les anciens rapports
```

## Sécurité : règles à respecter

- **Aucun secret dans le dépôt.** Les fichiers `.env*` sont ignorés par git
  (seuls les `*.example` sont versionnés). La CI exécute gitleaks.
- **Jamais de clé `service_role` ni de clé d'API IA côté navigateur.**
  Le frontend n'utilise que la clé `anon` ; les appels IA passent par un proxy
  serveur (`VITE_AI_PROXY_URL`).
- **Le rôle d'un utilisateur vient de la table `profiles`** (protégée par RLS
  et par un trigger qui interdit de modifier son propre rôle). `user_metadata`
  ne sert jamais à une décision d'accès.
- **Ne pas exposer `process.env` dans `vite.config.js`** : seules les variables
  `VITE_*` sont accessibles au client via `import.meta.env`.
- Les changements de schéma se font par **migrations dans `supabase/migrations/`**
  (`supabase db push`), jamais par scripts SQL ad hoc.

Voir `docs/SECURITE_ACTIONS_MANUELLES.md` pour les actions à mener hors du code
après l'audit du 31/10/2026.

## Licence

MIT – voir `LICENSE`.
