# 🔍 Diagnostic: Pourquoi Google Ne Détecte Pas Votre Site

**Date:** October 17, 2025  
**URL Production:** https://www.terangafoncier.sn/  
**Problème:** Site non visible dans résultats Google

---

## 🚨 CAUSES PRINCIPALES

### 1. **Site Pas Encore Indexé par Google** (CAUSE LA PLUS PROBABLE)

#### Pourquoi?
- Le site est trop nouveau ou a changé de domaine récemment
- Google n'a pas encore crawlé le site
- Le sitemap.xml n'a pas été soumis
- robots.txt bloque les bots Google

#### ✅ Solutions:

**Étape 1: Vérifier que le site est accessible**
```
curl -I https://www.terangafoncier.sn/
# Doit retourner: HTTP/1.1 200 OK (pas 404, 403, ou redirect)
```

**Étape 2: Vérifier robots.txt**
```
https://www.terangafoncier.sn/robots.txt
# Doit contenir:
# User-agent: *
# Allow: /
# Disallow: /admin/, /api/
# Sitemap: https://www.terangafoncier.sn/sitemap.xml
```

**Étape 3: Vérifier sitemap.xml**
```
https://www.terangafoncier.sn/sitemap.xml
# Doit retourner un XML valide avec 40+ URLs
```

**Étape 4: Soumettre à Google Search Console**
1. Aller à: https://search.google.com/search-console
2. Ajouter propriété: https://www.terangafoncier.sn/
3. Vérifier propriété (par DNS ou fichier HTML)
4. Soumettre sitemap.xml:
   - Menu gauche → Sitemaps
   - Cliquer "Add a new sitemap"
   - Entrer: `sitemap.xml`
5. Attendre Google de crawler (1-7 jours)

---

### 2. **robots.txt Bloque Google** ⚠️

#### Diagnostic:
```
# Vérifier le contenu exact de robots.txt
cat public/robots.txt
```

#### ❌ Mauvais (Bloque Google):
```
User-agent: *
Disallow: /

Sitemap: https://terangafoncier.vercel.app/sitemap.xml  # MAUVAIS DOMAINE!
```

#### ✅ Correct:
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /dashboard/

Sitemap: https://www.terangafoncier.sn/sitemap.xml
```

**📌 À vérifier:**
- Assurez-vous que `Allow: /` existe
- Vérifiez que le domaine Sitemap est correct (www.terangafoncier.sn, pas vercel.app)
- Pas de `Disallow: /` global

---

### 3. **Sitemap.xml Invalide ou Manquant** ⚠️

#### Diagnostic:
```
# Tester le XML
curl https://www.terangafoncier.sn/sitemap.xml | head -50
```

#### ❌ Problèmes courants:

**A) Sitemap manquant ou non accessible**
```
# Résultat: 404 Not Found
# Solution: Vérifier que sitemap.xml existe dans public/
```

**B) XML invalide (pas bien formé)**
```
# Résultat: XML parsing error
# Solution: Valider à https://www.xml-sitemaps.com/validate-xml-sitemap.html
```

**C) Pas d'URLs dans le sitemap**
```
# Résultat: Vide ou trop peu d'URLs
# Solution: Ajouter toutes les pages publiques
```

#### ✅ Sitemap valide:
- [ ] Tous les `<loc>` pointent vers les bonnes URLs
- [ ] Domaine correct: `https://www.terangafoncier.sn/`
- [ ] Pas d'URLs protégées (/admin/, /dashboard/)
- [ ] `lastmod` à jour: 2025-10-17
- [ ] `priority` entre 0.0-1.0
- [ ] Maximum 50,000 URLs par sitemap

---

### 4. **Meta Tags Manquants ou Mal Configurés** ⚠️

#### Diagnostic:
Ouvrir le site en navigateur et faire:
1. Clic droit → Inspect → Console
2. Taper:
```javascript
document.title  // Doit montrer le titre
document.head.querySelector('meta[name="description"]')?.content  // La description
```

#### ❌ Problèmes:
- `<title>` vide ou générique
- Pas de meta description
- Meta description > 160 caractères
- Pas de canonical URL

#### ✅ Correct:
```html
<title>Achetez Votre Terrain au Sénégal | Teranga Foncier</title>
<meta name="description" content="Plateforme blockchain immobilière...">
<link rel="canonical" href="https://www.terangafoncier.sn/">
```

---

### 5. **Domaine Mal Configuré ou Pointant Vers Vercel par Défaut** ⚠️

#### Diagnostic:
```bash
# Vérifier où pointe www.terangafoncier.sn
nslookup www.terangafoncier.sn
# Ou
dig www.terangafoncier.sn

# Résultat attendu:
# CNAME terangafoncier.vercel.app
# (C'est correct si le DNS pointe vers Vercel)
```

#### ❌ Problèmes courants:

**A) DNS pointe vers mauvais serveur**
```
# Vérifier dans votre registrar (ex: Namecheap, GoDaddy)
# www.terangafoncier.sn doit pointer vers:
# CNAME: cname.vercel.app. (Vercel)
```

**B) Vercel project mal configuré**
```
# Dans Vercel Dashboard:
# 1. Project Settings → Domains
# 2. Ajouter domaine: www.terangafoncier.sn
# 3. Suivre les instructions DNS
# 4. Attendre SSL certificate (2-48h)
```

#### ✅ Vérifier:
```bash
# Doit retourner HTTPS (200)
curl -I https://www.terangafoncier.sn/
# HTTP/1.1 200 OK

# Doit avoir certif SSL valide
curl -v https://www.terangafoncier.sn/ 2>&1 | grep -i "ssl"
```

---

### 6. **Build Vercel Échoue ou Site Offline** ⚠️

#### Diagnostic:
1. Aller à: https://vercel.com/dashboard
2. Cliquer sur votre projet `terangafoncier`
3. Vérifier onglet "Deployments"
4. Le dernier deploy doit avoir:
   - ✅ Status: "READY" (vert)
   - ❌ Status: "FAILED" (rouge) = problème!

#### ❌ Build Failure - Causes:
- Erreurs de compilation TypeScript/JSX
- Dépendances manquantes
- Variables d'environnement manquantes

#### ✅ Solutions:
```bash
# 1. Vérifier la build locale
npm run build

# 2. Fixer les erreurs trouvées
# 3. Commit et push
git add .
git commit -m "Fix: Erreurs build"
git push origin main

# 4. Vérifier dans Vercel Dashboard que ça passe
```

---

## 🔧 ÉTAPES DE DIAGNOSTIC COMPLET

### **JOUR 1 - Diagnostic Immédiat**

```bash
# 1. Vérifier site est accessible
curl -I https://www.terangafoncier.sn/
echo "---"

# 2. Vérifier robots.txt
curl https://www.terangafoncier.sn/robots.txt
echo "---"

# 3. Vérifier sitemap.xml existe
curl -I https://www.terangafoncier.sn/sitemap.xml
echo "---"

# 4. Compter les URLs dans sitemap
curl https://www.terangafoncier.sn/sitemap.xml | grep -o "<loc>" | wc -l
echo "URLs dans sitemap"
```

### **JOUR 2 - Actions Google Search Console**

1. **Ajouter et vérifier le domaine**
   - https://search.google.com/search-console
   - Propriété: https://www.terangafoncier.sn/
   - Vérifier par DNS ou fichier HTML

2. **Soumettre sitemap.xml**
   - Menu → Sitemaps
   - Ajouter: sitemap.xml
   - Status doit changer à "Submitted"

3. **Demander indexation de la homepage**
   - Menu → URL Inspection
   - Entrer: https://www.terangafoncier.sn/
   - Cliquer: "Request indexing"

4. **Monitorer indexation**
   - Dashboard → Coverage
   - Vérifier "Indexed" (doit augmenter de 0 à 40+ en 1-2 semaines)

### **JOUR 7 - Vérification**

```bash
# Vérifier si Google a indexé
# Dans Google Search Console:
# - Coverage: doit montrer pages indexées
# - Enhancements: pas d'erreurs

# OU taper dans Google:
# site:terangafoncier.sn
# (Doit montrer au minimum la homepage)
```

---

## 📊 CHECKLIST DE VÉRIFICATION

### ✅ Vérifications Techniques

- [ ] Site accessible: `https://www.terangafoncier.sn/` retourne 200
- [ ] robots.txt valide et pointe vers correct sitemap.xml
- [ ] sitemap.xml accessible et contient 40+ URLs valides
- [ ] Pas de redirect chaîne (ex: http → https → www)
- [ ] SSL/HTTPS valide et non auto-signé
- [ ] Index.html charge correctement
- [ ] Aucune erreur 4xx ou 5xx

### ✅ SEO On-Page

- [ ] `<title>` unique et descriptif pour chaque page
- [ ] `<meta name="description">` 120-160 caractères
- [ ] `<meta name="viewport">` responsive
- [ ] `<link rel="canonical">` pour chaque page
- [ ] Pas de rel="noindex"
- [ ] Pas de robots meta noindex

### ✅ Sitemap & Search Console

- [ ] Sitemap.xml valide XML
- [ ] 40+ URLs dans sitemap
- [ ] Domaine correct dans sitemap
- [ ] Propriété ajoutée à Google Search Console
- [ ] Sitemap soumis à GSC
- [ ] Aucune erreur de couverture en GSC

### ✅ Configuration Domaine

- [ ] Domaine pointe vers Vercel
- [ ] CNAME configuré correctement
- [ ] SSL activé et valide
- [ ] Vercel deployment "READY"

---

## 🟢 QUICK FIX - ACTION MAINTENANT

Exécutez ceci dans l'ordre:

```bash
# 1. Vérifier et corriger robots.txt
echo "1. Vérification robots.txt..."
curl https://www.terangafoncier.sn/robots.txt | head -5

# 2. Vérifier sitemap.xml
echo "2. Vérification sitemap.xml..."
curl -I https://www.terangafoncier.sn/sitemap.xml

# 3. Builder localement
echo "3. Build local..."
npm run build

# 4. Si build OK, push to Vercel
echo "4. Push vers Vercel..."
git add .
git commit -m "SEO: Fix et diagnostic indexation"
git push origin main

# 5. Attendre 2-3 minutes pour Vercel deploy
echo "5. Attendre Vercel deployment..."
sleep 180

# 6. Tester production
echo "6. Test production..."
curl -I https://www.terangafoncier.sn/
```

---

## 📈 NEXT STEPS - APRÈS INDEXATION

Une fois que Google indexe le site (1-2 semaines):

1. **Monitorer Search Console**
   - Impressions: Combien de fois le site apparaît
   - CTR: % de clics
   - Position moyenne: Ranking position

2. **Optimiser par données**
   - Pages avec peu de clics? Améliorer titre/description
   - Keywords non rankés? Ajouter contenu
   - Ranking baisse? Vérifier si site toujours en ligne

3. **Ajouter plus de contenu**
   - Blog articles
   - Guides détaillés
   - Pages de destination par location

---

## 🆘 AIDE D'URGENCE

Si rien ne fonctionne:

**Vérifier les logs Vercel:**
```
https://vercel.com/dashboard/[your-account]/[project-name]/logs
```

**Vérifier les erreurs Search Console:**
```
https://search.google.com/search-console/coverage
# Chercher: "Excluded by robots.txt" ou autres erreurs
```

**Forcer recrawl dans GSC:**
```
URL Inspection → Request Indexing
Faire pour 10-20 top pages
```

---

**Document créé:** October 17, 2025  
**Priorité:** 🔴 CRITIQUE - À faire immédiatement  
**Temps estimé:** 30 minutes pour actions, 1-2 semaines pour résultats
