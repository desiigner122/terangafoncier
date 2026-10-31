# Guide du Mode Maintenance - Teranga Foncier

## 🔧 Activation du Mode Maintenance

Le mode maintenance permet de désactiver temporairement l'accès public au site tout en permettant aux administrateurs de continuer à travailler.

### Méthode 1: Via l'Interface Admin

1. **Accéder aux Paramètres**
   - Connectez-vous en tant qu'administrateur
   - Allez dans `Dashboard Admin > Paramètres`
   - Cliquez sur l'onglet "Général"

2. **Activer le Mode Maintenance**
   - Activez le switch "Mode Maintenance"
   - Personnalisez le message affiché aux visiteurs
   - Définissez les heures de début/fin (optionnel)
   - Cliquez sur "Sauvegarder"

3. **Tester l'Activation**
   - Cliquez sur le bouton "Tester" à côté de l'alerte
   - Ouvrez un nouvel onglet en navigation privée
   - Visitez le site pour voir la page de maintenance

### Méthode 2: Via la Console (Test Rapide)

```javascript
// Activer
maintenanceTest.activer()

// Désactiver
maintenanceTest.desactiver()

// Vérifier le statut
maintenanceTest.verifier()
```

## 🎯 Fonctionnalités du Mode Maintenance

### ✅ Ce qui est Activé

- **Page de maintenance personnalisée** avec design Teranga Foncier
- **Accès administrateur préservé** - Les admins voient un bandeau orange mais peuvent utiliser le site normalement
- **Message personnalisable** - Configurez le texte affiché aux visiteurs
- **Informations de contact** - Email et téléphone de support affichés
- **Design responsive** - Fonctionne sur mobile et desktop
- **Animations fluides** - Interface moderne avec Framer Motion

### ⚠️ Ce qui est Désactivé

- **Accès public** - Tous les visiteurs non-admin voient la page de maintenance
- **Nouvelles inscriptions** - Impossible de créer un compte
- **Navigation normale** - Redirection automatique vers la page de maintenance

## 📱 Interface de Maintenance

La page de maintenance affiche :

- **Logo et branding** Teranga Foncier
- **Message d'état** personnalisé
- **Progression** avec animations
- **Informations de contact** du support
- **Bouton de rafraîchissement** pour vérifier la fin de maintenance
- **Design professionnel** avec les couleurs de la marque

## 👥 Gestion des Utilisateurs

### Administrateurs
- ✅ Accès complet au site
- ✅ Bandeau d'avertissement visible
- ✅ Peuvent activer/désactiver le mode
- ✅ Accès aux paramètres système

### Utilisateurs Normaux
- ❌ Redirection vers page de maintenance
- ❌ Impossible de se connecter
- ❌ Pas d'accès aux fonctionnalités
- ✅ Peuvent voir les informations de contact

## 🔄 Désactivation

### Via Interface Admin
1. Retournez dans `Paramètres > Général`
2. Désactivez le switch "Mode Maintenance"
3. Sauvegardez les modifications

### Via Console
```javascript
maintenanceTest.desactiver()
window.location.reload()
```

## 🧪 Tests et Validation

### Test Complet
1. **Avant Activation**
   - Vérifiez que le site fonctionne normalement
   - Notez les fonctionnalités critiques

2. **Pendant la Maintenance**
   - Testez l'accès admin (doit fonctionner)
   - Testez l'accès visiteur (page de maintenance)
   - Vérifiez le responsive design
   - Testez les liens de contact

3. **Après Désactivation**
   - Confirmez le retour à la normale
   - Testez les fonctionnalités principales
   - Vérifiez l'absence d'effets de bord

### Scénarios de Test

```javascript
// Test 1: Activation rapide
console.log('Test activation maintenance...');
maintenanceTest.activer();
// Ouvrir nouvel onglet privé et vérifier

// Test 2: Vérification statut
const status = maintenanceTest.verifier();
console.log('Statut:', status);

// Test 3: Désactivation
maintenanceTest.desactiver();
// Recharger et vérifier retour normal
```

## 🚨 Cas d'Usage

### Maintenance Programmée
- **Mises à jour système** - Déploiement de nouvelles fonctionnalités
- **Maintenance serveur** - Opérations sur l'infrastructure
- **Migrations de données** - Transferts de bases de données

### Maintenance d'Urgence
- **Problèmes critiques** - Bugs bloquants détectés
- **Sécurité** - Failles de sécurité à corriger
- **Performance** - Surcharge serveur

### Maintenance Préventive
- **Sauvegardes** - Opérations de backup importantes
- **Optimisations** - Amélioration des performances
- **Tests** - Validation de nouvelles fonctionnalités

## 📞 Support et Contact

- **Email:** palaye122@gmail.com
- **Téléphone:** +221 77 593 42 41
- **Urgences:** Support 24h/24 disponible

## 🔧 Configuration Technique

### Structure des Fichiers
```
src/
├── components/
│   ├── MaintenancePage.jsx          # Page de maintenance
│   └── MaintenanceWrapper.jsx       # Wrapper de contrôle
├── contexts/
│   └── MaintenanceContext.jsx       # Contexte global
└── pages/dashboards/admin/
    └── ModernSettingsPage.jsx       # Interface de configuration
```

### Variables de Configuration
```javascript
{
  isMaintenanceMode: boolean,
  maintenanceConfig: {
    message: string,
    estimatedDuration: number|null,
    allowedUsers: string[],
    startTime: string,
    endTime: string|null
  }
}
```

### Stockage Local
- `localStorage.maintenanceMode`: 'true'/'false'
- `localStorage.maintenanceConfig`: Configuration JSON

---

**⚠️ Important:** Testez toujours le mode maintenance en environnement de développement avant de l'utiliser en production !