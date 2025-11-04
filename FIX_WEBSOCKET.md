# 🔌 FIX: WebSocket Connection Issues

## Problèmes Observés
1. `WebSocket is closed before the connection is established`
2. Multiples déconnexions/reconnexions
3. Cookie `__cf_bm` rejeté (Cloudflare)

## Causes
1. **Trop de subscriptions simultanées** : Plusieurs composants créent des channels realtime
2. **Cleanup insuffisant** : Les channels ne sont pas fermés proprement
3. **Re-renders multiples** : React re-créé les subscriptions à chaque render

## Solutions

### Solution 1 : Limiter les Subscriptions (Recommandé)

**Dans `ParticulierMesAchatsRefonte.jsx`** :

```jsx
// ❌ AVANT: Subscription à chaque render
useEffect(() => {
  const subscription = supabase
    .channel('purchase_cases_changes')
    .on('postgres_changes', { ... })
    .subscribe();
    
  return () => subscription.unsubscribe();
}, []); // ⚠️ Se déclenche plusieurs fois

// ✅ APRÈS: Subscription unique avec flag
useEffect(() => {
  let subscription = null;
  let mounted = true;
  
  const setupRealtime = async () => {
    if (!mounted) return;
    
    subscription = supabase
      .channel(`purchase_cases_${user?.id}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'purchase_cases',
        filter: `buyer_id=eq.${user?.id}`
      }, (payload) => {
        if (mounted) {
          console.log('🔔 Realtime update:', payload);
          loadPurchaseCases();
        }
      })
      .subscribe((status) => {
        console.log('📡 Subscription status:', status);
      });
  };
  
  if (user?.id) {
    setupRealtime();
  }
  
  return () => {
    mounted = false;
    if (subscription) {
      subscription.unsubscribe();
    }
  };
}, [user?.id]); // Dépendance stable
```

### Solution 2 : Service Realtime Centralisé

**Créer `src/services/RealtimeManager.js`** :

```javascript
class RealtimeManager {
  constructor() {
    this.subscriptions = new Map();
    this.client = null;
  }
  
  subscribe(channelName, config, callback) {
    // Éviter les doublons
    if (this.subscriptions.has(channelName)) {
      console.log('⚠️ Channel déjà actif:', channelName);
      return this.subscriptions.get(channelName);
    }
    
    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', config, callback)
      .subscribe();
      
    this.subscriptions.set(channelName, channel);
    console.log('✅ Channel créé:', channelName);
    
    return channel;
  }
  
  unsubscribe(channelName) {
    const channel = this.subscriptions.get(channelName);
    if (channel) {
      channel.unsubscribe();
      this.subscriptions.delete(channelName);
      console.log('🔌 Channel fermé:', channelName);
    }
  }
  
  unsubscribeAll() {
    this.subscriptions.forEach((channel, name) => {
      channel.unsubscribe();
      console.log('🔌 Channel fermé:', name);
    });
    this.subscriptions.clear();
  }
}

export default new RealtimeManager();
```

### Solution 3 : Désactiver Temporairement

**Si vous n'avez pas besoin du temps réel immédiatement** :

```jsx
// Dans ParticulierMesAchatsRefonte.jsx
useEffect(() => {
  loadPurchaseCases();
  
  // DÉSACTIVER TEMPORAIREMENT
  // const subscription = ...
  
  return () => {
    // Cleanup si activé
  };
}, [user?.id]);
```

### Solution 4 : Fix Cookie Cloudflare

Le cookie `__cf_bm` est un cookie de gestion de bot de Cloudflare. Pour le fix :

**Dans `index.html`** :
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self' https://*.supabase.co; 
               connect-src 'self' https://*.supabase.co wss://*.supabase.co;">
```

**OU en développement, ignorer l'erreur** (elle n'affecte pas le fonctionnement).

## Fix Rapide Recommandé

### 1. Modifier `ParticulierMesAchatsRefonte.jsx`

Trouvez cette section (vers ligne 166) :

```jsx
console.log('✅ Realtime subscriptions activées');
```

Et remplacez TOUT le useEffect par :

```jsx
useEffect(() => {
  if (!user?.id) return;
  
  let mounted = true;
  let channel = null;
  
  const setupRealtime = async () => {
    // Attendre un peu pour éviter les races
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!mounted) return;
    
    channel = supabase
      .channel(`purchase_cases_${user.id}_${Date.now()}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'purchase_cases',
        filter: `buyer_id=eq.${user.id}`
      }, (payload) => {
        if (mounted) {
          console.log('🔔 Purchase case updated:', payload);
          loadPurchaseCases();
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Realtime connected');
        }
      });
  };
  
  setupRealtime();
  
  return () => {
    mounted = false;
    if (channel) {
      channel.unsubscribe().then(() => {
        console.log('🔌 Realtime disconnected');
      });
    }
  };
}, [user?.id]);
```

### 2. Retester

1. Rafraîchir la page
2. Les erreurs WebSocket devraient disparaître
3. Le realtime devrait se connecter 1 seule fois

## Diagnostic

Pour voir les channels actifs :

```javascript
// Dans la console du navigateur
supabase.getChannels().forEach(c => console.log(c.topic))
```

---

**Note** : Le problème WebSocket n'empêche PAS l'app de fonctionner. C'est juste des tentatives de reconnexion automatique. Vous pouvez l'ignorer en attendant d'implémenter le fix.
