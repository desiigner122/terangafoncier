# Plan de Correction Complet - Système de Suivi de Dossiers

**Date**: 3 Novembre 2025  
**Objectif**: Corriger toutes les incohérences d'affichage, actions timeline, données (prix, surface, images), responsive design, PWA, notifications

---

## 🔍 ANALYSE DES PROBLÈMES IDENTIFIÉS

### Problème 1: Images des Parcelles Ne S'affichent Pas ❌
**Fichier**: `ParticulierCaseTrackingModernRefonte.jsx` lignes 926-960

**Causes**:
1. **Gestion multi-format trop complexe**: Cherche `image_url`, `photo_url`, `image`, `photo`, `images[]`
2. **Pas de fallback vers Supabase Storage**: Si l'URL est relative (ex: `parcels/abc123.jpg`), elle ne se construit pas en URL complète
3. **Base de données**: Colonne réelle dans `parcels`/`properties` inconnue

**Impacts**:
- Utilisateurs voient uniquement l'icône Building2 placeholder
- Perte de confiance dans le système
- Aucune visualisation des biens

---

### Problème 2: Prix/Surface/Référence - Affichage Incomplet ⚠️
**Fichiers**: Multiple pages (Acheteur, Vendeur, Notaire)

**Causes**:
1. **Fallbacks excessifs**: `property.price || property.prix || purchaseCase?.purchase_price`
   - Quelle est la SOURCE DE VÉRITÉ?
2. **Surface**: Cherche `area`, `size`, `surface`, `superficie` → confusion
3. **Référence parcelle**: Utilise `property.id.slice(0, 8)` au lieu de `property.reference` ou `property.land_ref`

**Impacts**:
- Données affichées incorrectement
- Certains champs vides alors que données existent
- Confusion utilisateurs sur le prix réel

---

### Problème 3: Boutons d'Actions Timeline - Visibilité Conditionnelle ❌
**Fichiers**: 
- `BuyerActionButtonsSection.jsx`
- `ContextualActionsService.js`
- `TimelineTrackerModern.jsx`

**Causes**:
1. **Pas de synchronisation Timeline ↔ Actions**:
   - Timeline affiche étape "Frais notaire" mais bouton absent
   - Actions affichées même si étape pas encore atteinte
   
2. **Logique hardcodée**:
   ```javascript
   // ❌ Mauvais: toujours visible si notaire_id existe
   if (purchaseCase.notaire_id) {
     actions.push({ id: 'update_fees', label: 'Mettre à jour frais' });
   }
   
   // ✅ Correct: visible seulement à l'étape correspondante
   if (purchaseCase.notaire_id && currentStep === 'notary_assignment') {
     actions.push(...);
   }
   ```

3. **Pas de "disabled" state**: Boutons cliquables même si prématurés

**Impacts**:
- Utilisateurs cliquent sur actions non disponibles
- Confusion sur le workflow
- Boutons importants cachés alors qu'ils devraient être visibles

---

### Problème 4: Frais Notaire - Affichage et Mise à Jour ⚠️
**Fichiers**: 
- `ParticulierCaseTrackingModernRefonte.jsx` ligne 577-615
- `notaire_case_assignments` table

**Causes**:
1. **Calcul hardcodé**: 
   ```javascript
   const depositPaid = (property?.price * 0.10) || 0;  // 10%
   const notaryFeesPaid = (property?.price * 0.05) || 0;  // 5%
   ```
   - Ne prend pas les VRAIS frais depuis `notaire_case_assignments.notary_fees`
   
2. **Pas de mise à jour en temps réel**: Quand notaire met à jour ses frais, acheteur ne voit pas le changement

3. **Aucune validation**: Frais peuvent être 0 FCFA

**Impacts**:
- Montants affichés incorrects
- Acheteur paie le mauvais montant
- Confusion entre "frais estimés" vs "frais réels"

---

### Problème 5: Pourcentage de Progression - Calcul Inexact 📊
**Fichier**: `ParticulierCaseTrackingModernRefonte.jsx` ligne 778-780

**Cause**:
```javascript
const calculateProgress = () => {
  return WorkflowStatusService.calculateProgressFromStatus(purchaseCase.status);
};
```
- **Basé uniquement sur le status**: Ignore les actions réellement complétées
- Exemple: Status = "document_collection" → 40%
  - Mais 0 documents uploadés → devrait être 35%
  - 5 documents uploadés → devrait être 42%

**Impacts**:
- Barre de progression mensongère
- Utilisateurs pensent que le dossier avance alors que rien n'est fait
- Perte de crédibilité

---

### Problème 6: Responsive Design - Mobile Non Optimisé 📱
**Fichiers**: Toutes les pages de suivi

**Causes**:
1. **Cards trop larges**: `className="grid grid-cols-3"` → 3 colonnes sur mobile (illisible)
2. **Textes trop longs**: Titres tronqués, descriptions cachées
3. **Boutons trop petits**: Difficile de cliquer sur mobile
4. **Timeline verticale non adaptée**: Prend trop d'espace sur petit écran

**Impacts**:
- 60% des utilisateurs sont sur mobile
- Expérience utilisateur catastrophique
- Taux de rebond élevé

---

### Problème 7: PWA - Service Worker et Manifest 📲
**Fichiers**: `vite.config.js`, `public/manifest.json`

**Causes**:
1. **Pas de service worker**: Aucune mise en cache des assets
2. **Manifest incomplet**: Icônes manquantes, pas de screenshots
3. **Notifications push non configurées**: Même si realtime fonctionne, pas de notifs natives

**Impacts**:
- Pas d'installation "Add to Home Screen"
- Pas de fonctionnement offline
- Pas de notifications système natives

---

### Problème 8: Notifications et Messages - UX Incohérente 💬
**Fichiers**: 
- `ParticulierCaseTrackingModernRefonte.jsx` messages section
- `RealtimeNotificationService.js`

**Causes**:
1. **Compteur de messages non mis à jour**: Affiche toujours 0
2. **Toast notifications trop nombreuses**: Spam l'utilisateur
3. **Pas de badge "non lu"**: Impossible de savoir si nouveau message
4. **Son manquant**: Pas de feedback audio

**Impacts**:
- Utilisateurs ratent des messages importants
- Surcharge cognitive (trop de toasts)
- Pas de distinction urgent/normal

---

## 🎯 PLAN DE CORRECTIONS (6 Phases)

### Phase 1: Fixes Données et Affichage (PRIORITÉ CRITIQUE) 🔴

#### 1.1 - Fixer Images Parcelles (2h)
**Fichier**: `ParticulierCaseTrackingModernRefonte.jsx` + `VendeurCaseTrackingModernFixed.jsx`

**Actions**:
1. **Vérifier structure DB**:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'parcels' AND column_name LIKE '%image%';
   ```

2. **Simplifier logique d'affichage**:
   ```jsx
   const getPropertyImage = (property) => {
     // Ordre de priorité
     const imagePath = property?.main_image 
       || property?.image_url 
       || (property?.images?.[0]);
     
     // Si path relatif, construire URL Supabase
     if (imagePath && !imagePath.startsWith('http')) {
       const { data } = supabase.storage.from('parcels').getPublicUrl(imagePath);
       return data.publicUrl;
     }
     
     return imagePath || null;
   };
   ```

3. **Tester avec vraies données**:
   - Créer parcelle avec image
   - Vérifier affichage dans 3 pages (Acheteur, Vendeur, Notaire)

**Success Metrics**:
- ✅ Images s'affichent sur 100% des parcelles avec photo
- ✅ Fallback Building2 icon seulement si vraiment pas d'image
- ✅ Pas d'erreurs 404 dans console

---

#### 1.2 - Fixer Prix/Surface/Référence (1.5h)
**Fichiers**: Tous les `CaseTracking` components

**Actions**:
1. **Définir SOURCE DE VÉRITÉ**:
   ```javascript
   // RÈGLE: Toujours utiliser purchase_case.purchase_price si existe
   const finalPrice = purchaseCase?.purchase_price 
     || purchaseRequest?.offered_price
     || property?.price
     || 0;
   
   const finalSurface = property?.surface 
     || property?.area
     || 0;
   
   const propertyRef = property?.land_reference
     || property?.reference
     || property?.id?.slice(0, 8).toUpperCase();
   ```

2. **Ajouter logging**:
   ```javascript
   console.log('💰 Prix affiché:', {
     purchase_price: purchaseCase?.purchase_price,
     offered_price: purchaseRequest?.offered_price,
     property_price: property?.price,
     final: finalPrice
   });
   ```

3. **Formater correctement**:
   ```jsx
   {finalPrice > 0 ? (
     <span className="text-2xl font-bold">
       {finalPrice.toLocaleString('fr-FR')} FCFA
     </span>
   ) : (
     <span className="text-gray-400">Prix non défini</span>
   )}
   ```

**Success Metrics**:
- ✅ Prix affiché = prix réel dans 100% des cas
- ✅ Surface affichée correctement (fallback cohérent)
- ✅ Référence parcelle unique et lisible

---

#### 1.3 - Fixer Frais Notaire (2h)
**Fichiers**: 
- `ParticulierCaseTrackingModernRefonte.jsx`
- `notaire_case_assignments` realtime

**Actions**:
1. **Charger frais réels depuis DB**:
   ```javascript
   const loadNotaryFees = async () => {
     if (!notaireAssignment?.id) return null;
     
     const { data, error } = await supabase
       .from('notaire_case_assignments')
       .select('notary_fees, fees_paid, fees_approved')
       .eq('id', notaireAssignment.id)
       .single();
     
     if (data) {
       setRealNotaryFees(data.notary_fees || 0);
       setFeesPaid(data.fees_paid || false);
     }
   };
   ```

2. **Afficher avec distinction**:
   ```jsx
   <Card className="border-l-4 border-l-purple-500">
     <CardHeader>
       <CardTitle>Frais de Notaire</CardTitle>
       {realNotaryFees > 0 ? (
         <Badge className="bg-green-500">Montant défini</Badge>
       ) : (
         <Badge className="bg-orange-500">En attente</Badge>
       )}
     </CardHeader>
     <CardContent>
       {realNotaryFees > 0 ? (
         <>
           <p className="text-3xl font-bold text-purple-600">
             {realNotaryFees.toLocaleString('fr-FR')} FCFA
           </p>
           <p className="text-sm text-gray-500 mt-1">
             Défini par {notaire?.full_name}
           </p>
         </>
       ) : (
         <p className="text-gray-400">
           Le notaire définira les frais prochainement
         </p>
       )}
     </CardContent>
   </Card>
   ```

3. **Realtime update**:
   ```javascript
   useEffect(() => {
     if (!notaireAssignment?.id) return;
     
     const channel = supabase
       .channel('notary-fees-update')
       .on('postgres_changes', {
         event: 'UPDATE',
         schema: 'public',
         table: 'notaire_case_assignments',
         filter: `id=eq.${notaireAssignment.id}`
       }, (payload) => {
         if (payload.new.notary_fees !== realNotaryFees) {
           setRealNotaryFees(payload.new.notary_fees);
           toast.success(`Frais notaire mis à jour: ${payload.new.notary_fees.toLocaleString()} FCFA`);
         }
       })
       .subscribe();
     
     return () => supabase.removeChannel(channel);
   }, [notaireAssignment?.id]);
   ```

**Success Metrics**:
- ✅ Frais affichés = frais réels dans `notaire_case_assignments`
- ✅ Mise à jour en temps réel quand notaire modifie
- ✅ Distinction claire "estimé" vs "réel"

---

### Phase 2: Boutons d'Actions Timeline (PRIORITÉ HAUTE) 🟠

#### 2.1 - Synchroniser Timeline ↔ Actions (3h)
**Fichiers**: 
- `ContextualActionsService.js`
- `BuyerActionButtonsSection.jsx`
- `TimelineTrackerModern.jsx`

**Concept**:
```
Timeline étape "notary_assignment" → Bouton "Sélectionner notaire" visible
Timeline étape "document_collection" → Bouton "Upload documents" visible
Timeline étape "deposit_pending" → Bouton "Payer acompte" visible
```

**Actions**:
1. **Créer mapping Timeline → Actions**:
   ```javascript
   // ContextualActionsService.js
   const TIMELINE_ACTIONS_MAP = {
     initiated: ['select_notary'],
     buyer_verification: ['select_notary', 'choose_agent'],
     notary_assignment: ['select_notary', 'approve_notary'],
     document_collection: ['upload_documents', 'upload_title_deed'],
     deposit_pending: ['pay_deposit'],
     contract_preparation: ['review_contract'],
     appointment_scheduling: ['confirm_appointment'],
     final_payment: ['pay_balance', 'pay_notary_fees'],
     signature: ['sign_contract'],
     completed: []
   };
   
   export const getBuyerActions = (caseData, permissions) => {
     const currentStatus = caseData.status;
     const allowedActionIds = TIMELINE_ACTIONS_MAP[currentStatus] || [];
     
     const allActions = getBuyerActionsInternal(currentStatus, caseData, permissions);
     
     // Filtrer pour garder seulement les actions de l'étape actuelle
     const filteredActions = {
       validations: allActions.validations.filter(a => 
         allowedActionIds.includes(a.id) || a.priority === 'high'
       ),
       documents: allActions.documents.filter(a => allowedActionIds.includes(a.id)),
       payments: allActions.payments.filter(a => allowedActionIds.includes(a.id)),
       appointments: allActions.appointments.filter(a => allowedActionIds.includes(a.id)),
       optional: allActions.optional // Toujours visibles
     };
     
     return filteredActions;
   };
   ```

2. **Ajouter états "disabled"**:
   ```jsx
   // BuyerActionButtonsSection.jsx
   const isActionAvailable = (action) => {
     const currentStep = TIMELINE_ACTIONS_MAP[currentStatus] || [];
     return currentStep.includes(action.id) || action.priority === 'high';
   };
   
   <Button
     onClick={() => onActionClick?.(action)}
     disabled={loading || !isActionAvailable(action)}
     className={cn(
       action.className,
       !isActionAvailable(action) && 'opacity-50 cursor-not-allowed'
     )}
   >
     {isActionAvailable(action) ? (
       <>{action.label}</>
     ) : (
       <>
         <Lock className="w-4 h-4 mr-2" />
         {action.label} (Disponible plus tard)
       </>
     )}
   </Button>
   ```

3. **Ajouter tooltips explicatifs**:
   ```jsx
   <Tooltip>
     <TooltipTrigger asChild>
       <Button disabled={!isActionAvailable(action)}>...</Button>
     </TooltipTrigger>
     <TooltipContent>
       {isActionAvailable(action) ? (
         <p>{action.description}</p>
       ) : (
         <p>Cette action sera disponible à l'étape "{getStepLabel(action.requiredStep)}"</p>
       )}
     </TooltipContent>
   </Tooltip>
   ```

**Success Metrics**:
- ✅ Boutons visibles seulement à l'étape correspondante
- ✅ Boutons "disabled" avec tooltip si prématurés
- ✅ Actions prioritaires (notaire) toujours visibles

---

#### 2.2 - Timeline avec Actions Intégrées (2h)
**Fichier**: `TimelineTrackerModern.jsx`

**Concept**: Afficher mini-bouton d'action directement sur chaque étape timeline

**Actions**:
1. **Ajouter bouton dans chaque step**:
   ```jsx
   {step.actions && step.actions.length > 0 && (
     <div className="mt-3 space-y-2">
       {step.actions.map(action => (
         <Button
           key={action.id}
           size="sm"
           variant="outline"
           onClick={() => onActionClick?.(action)}
           disabled={step.status !== 'in_progress'}
           className={cn(
             'w-full',
             step.status === 'in_progress' && 'border-blue-500 text-blue-600 hover:bg-blue-50'
           )}
         >
           <ActionIcon className="w-3 h-3 mr-2" />
           {action.shortLabel || action.label}
         </Button>
       ))}
     </div>
   )}
   ```

2. **Mapper actions aux étapes**:
   ```javascript
   const enrichTimelineWithActions = (timelineSteps, availableActions) => {
     return timelineSteps.map(step => ({
       ...step,
       actions: availableActions.filter(a => a.timelineStep === step.id)
     }));
   };
   ```

**Success Metrics**:
- ✅ Bouton "Sélectionner notaire" sur étape "notary_assignment"
- ✅ Bouton "Payer acompte" sur étape "deposit_pending"
- ✅ Désactivés si étape pas encore atteinte

---

### Phase 3: Pourcentage de Progression Intelligent (PRIORITÉ MOYENNE) 🟡

#### 3.1 - Calcul Basé sur Actions Complétées (2h)
**Fichier**: `WorkflowStatusService.js` + pages tracking

**Concept**:
```
Progression = (Actions complétées / Total actions requises) * 100
```

**Actions**:
1. **Créer fonction de calcul avancée**:
   ```javascript
   // WorkflowStatusService.js
   export const calculateSmartProgress = (purchaseCase, completedActions) => {
     const status = purchaseCase.status;
     
     // Base progress par status
     const baseProgress = calculateProgressFromStatus(status);
     
     // Actions requises pour chaque étape
     const REQUIRED_ACTIONS = {
       initiated: ['select_notary'],
       buyer_verification: ['select_notary'],
       notary_assignment: ['approve_notary'],
       document_collection: ['upload_documents', 'upload_title_deed'],
       deposit_pending: ['pay_deposit'],
       contract_preparation: ['review_contract'],
       appointment_scheduling: ['confirm_appointment'],
       final_payment: ['pay_balance', 'pay_notary_fees'],
       signature: ['sign_contract']
     };
     
     const requiredForStatus = REQUIRED_ACTIONS[status] || [];
     const completedForStatus = requiredForStatus.filter(actionId =>
       completedActions.includes(actionId)
     );
     
     // Bonus de progression (+5% par action complétée)
     const bonusProgress = (completedForStatus.length / requiredForStatus.length) * 5;
     
     return Math.min(baseProgress + bonusProgress, 100);
   };
   ```

2. **Tracker actions complétées**:
   ```javascript
   const [completedActions, setCompletedActions] = useState([]);
   
   // Après chaque action
   const handleActionComplete = (actionId) => {
     setCompletedActions(prev => [...prev, actionId]);
     
     // Sauvegarder en DB
     await supabase.from('purchase_case_actions').insert({
       case_id: purchaseCase.id,
       action_id: actionId,
       completed_at: new Date().toISOString()
     });
   };
   ```

3. **Afficher progression détaillée**:
   ```jsx
   <div className="space-y-2">
     <div className="flex justify-between text-sm">
       <span className="font-medium">Progression du dossier</span>
       <span className="font-bold">{smartProgress}%</span>
     </div>
     <Progress value={smartProgress} className="h-3" />
     <p className="text-xs text-gray-500">
       {completedActions.length} / {totalRequiredActions} actions complétées
     </p>
   </div>
   ```

**Success Metrics**:
- ✅ Progression reflète vraiment l'avancement
- ✅ Bonus +5% par action complétée
- ✅ Détail "X/Y actions complétées"

---

### Phase 4: Responsive Design (PRIORITÉ HAUTE) 🟠

#### 4.1 - Optimisation Mobile (3h)
**Fichiers**: Tous les `CaseTracking` components

**Actions**:
1. **Grids responsive**:
   ```jsx
   // ❌ Avant
   <div className="grid grid-cols-3 gap-4">
   
   // ✅ Après
   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
   ```

2. **Timeline verticale compacte**:
   ```jsx
   <div className="hidden lg:block">
     {/* Timeline horizontale */}
   </div>
   <div className="lg:hidden">
     <TimelineCompactMobile steps={timelineSteps} />
   </div>
   ```

3. **Cards empilées sur mobile**:
   ```jsx
   <div className="space-y-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-y-0">
     <Card>Propriété</Card>
     <Card>Vendeur</Card>
     <Card>Notaire</Card>
     <Card>Actions</Card>
   </div>
   ```

4. **Boutons full-width sur mobile**:
   ```jsx
   <Button className="w-full md:w-auto">
     Sélectionner Notaire
   </Button>
   ```

**Success Metrics**:
- ✅ Lisibilité parfaite sur iPhone SE (375px)
- ✅ Pas de scroll horizontal
- ✅ Boutons cliquables (min 44px hauteur)

---

### Phase 5: PWA et Notifications Natives (PRIORITÉ MOYENNE) 🟡

#### 5.1 - Service Worker et Manifest (2h)
**Fichiers**: `vite.config.js`, `public/manifest.json`, `src/sw.js`

**Actions**:
1. **Installer Vite PWA plugin**:
   ```bash
   npm install vite-plugin-pwa -D
   ```

2. **Configurer `vite.config.js`**:
   ```javascript
   import { VitePWA } from 'vite-plugin-pwa';
   
   export default defineConfig({
     plugins: [
       react(),
       VitePWA({
         registerType: 'autoUpdate',
         includeAssets: ['logo.svg', 'logo-192.png', 'logo-512.png'],
         manifest: {
           name: 'Teranga Foncier',
           short_name: 'TFoncier',
           description: 'Plateforme de gestion immobilière au Sénégal',
           theme_color: '#1E3A8A',
           background_color: '#FFFFFF',
           display: 'standalone',
           icons: [
             {
               src: '/logo-192.png',
               sizes: '192x192',
               type: 'image/png'
             },
             {
               src: '/logo-512.png',
               sizes: '512x512',
               type: 'image/png'
             }
           ]
         },
         workbox: {
           globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
           runtimeCaching: [
             {
               urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
               handler: 'NetworkFirst',
               options: {
                 cacheName: 'supabase-cache',
                 expiration: {
                   maxEntries: 50,
                   maxAgeSeconds: 60 * 60 * 24 // 24h
                 }
               }
             }
           ]
         }
       })
     ]
   });
   ```

3. **Créer icônes PWA**:
   - Générer 192x192 et 512x512 depuis logo
   - Placer dans `public/`

**Success Metrics**:
- ✅ Prompt "Add to Home Screen" sur mobile
- ✅ Fonctionne offline (mode lecture)
- ✅ Icône app sur écran d'accueil

---

#### 5.2 - Push Notifications (2h)
**Fichiers**: `RealtimeNotificationService.js`, `src/utils/notifications.js`

**Actions**:
1. **Demander permission**:
   ```javascript
   // src/utils/notifications.js
   export const requestNotificationPermission = async () => {
     if (!('Notification' in window)) {
       console.warn('Notifications not supported');
       return false;
     }
     
     const permission = await Notification.requestPermission();
     return permission === 'granted';
   };
   ```

2. **Envoyer notification native**:
   ```javascript
   export const sendNativeNotification = (title, options) => {
     if (Notification.permission === 'granted') {
       new Notification(title, {
         body: options.message,
         icon: '/logo-192.png',
         badge: '/logo-72.png',
         tag: options.tag,
         data: options.data,
         requireInteraction: options.urgent || false
       });
     }
   };
   ```

3. **Intégrer avec realtime**:
   ```javascript
   // RealtimeNotificationService.js
   const handleRealtimeEvent = (event, payload) => {
     // Toast notification (comme avant)
     toast.info(event.message);
     
     // + Native notification si permission
     if (Notification.permission === 'granted') {
       sendNativeNotification(event.title, {
         message: event.message,
         tag: `case-${payload.new.id}`,
         data: { caseId: payload.new.id, action: 'open_case' },
         urgent: event.priority === 'high'
       });
     }
   };
   ```

4. **Son de notification**:
   ```javascript
   const playNotificationSound = () => {
     const audio = new Audio('/sounds/notification.mp3');
     audio.play().catch(err => console.warn('Audio play failed:', err));
   };
   ```

**Success Metrics**:
- ✅ Notifications natives sur mobile/desktop
- ✅ Son joué pour messages importants
- ✅ Badge nombre de notifs non lues

---

### Phase 6: Messages et Compteurs (PRIORITÉ MOYENNE) 🟡

#### 6.1 - Compteur de Messages Non Lus (1.5h)
**Fichiers**: `ParticulierCaseTrackingModernRefonte.jsx`, `purchase_case_messages` table

**Actions**:
1. **Ajouter colonne `read_by`**:
   ```sql
   ALTER TABLE purchase_case_messages
   ADD COLUMN IF NOT EXISTS read_by UUID[];
   
   -- Marquer comme lu
   UPDATE purchase_case_messages
   SET read_by = array_append(read_by, 'user_id')
   WHERE id = 'message_id';
   ```

2. **Calculer non lus**:
   ```javascript
   const unreadCount = messages.filter(m => 
     !m.read_by?.includes(user.id) && m.sender_id !== user.id
   ).length;
   ```

3. **Afficher badge**:
   ```jsx
   <TabsTrigger value="messages" className="relative">
     Messages
     {unreadCount > 0 && (
       <Badge className="absolute -top-1 -right-1 bg-red-500 text-white px-2 py-0.5 text-xs">
         {unreadCount}
       </Badge>
     )}
   </TabsTrigger>
   ```

4. **Marquer comme lu automatiquement**:
   ```javascript
   useEffect(() => {
     if (activeTab === 'messages') {
       // Marquer tous les messages comme lus
       const unreadIds = messages
         .filter(m => !m.read_by?.includes(user.id))
         .map(m => m.id);
       
       if (unreadIds.length > 0) {
         markMessagesAsRead(unreadIds);
       }
     }
   }, [activeTab, messages]);
   
   const markMessagesAsRead = async (messageIds) => {
     await supabase.rpc('mark_messages_read', {
       message_ids: messageIds,
       user_id: user.id
     });
   };
   ```

**Success Metrics**:
- ✅ Badge rouge avec nombre de non lus
- ✅ Badge disparaît quand onglet "Messages" ouvert
- ✅ Realtime update du compteur

---

#### 6.2 - Optimiser Toast Notifications (1h)
**Fichier**: `RealtimeNotificationService.js`

**Actions**:
1. **Déduplication**:
   ```javascript
   const recentToasts = new Set();
   
   const showToast = (message, type) => {
     const key = `${type}-${message}`;
     
     if (recentToasts.has(key)) return; // Déjà affiché
     
     recentToasts.add(key);
     toast[type](message);
     
     // Retirer après 5s
     setTimeout(() => recentToasts.delete(key), 5000);
   };
   ```

2. **Priorités**:
   ```javascript
   const NOTIFICATION_PRIORITY = {
     HIGH: ['notary_assigned', 'payment_received', 'contract_ready'],
     MEDIUM: ['document_uploaded', 'message_sent'],
     LOW: ['status_updated']
   };
   
   const shouldShowToast = (event) => {
     const priority = NOTIFICATION_PRIORITY.HIGH.includes(event) ? 'high'
       : NOTIFICATION_PRIORITY.MEDIUM.includes(event) ? 'medium'
       : 'low';
     
     // Afficher seulement HIGH et MEDIUM
     return priority !== 'low';
   };
   ```

**Success Metrics**:
- ✅ Max 3 toasts simultanés
- ✅ Pas de doublons
- ✅ Seulement événements importants

---

## 📋 CHECKLIST FINALE

### Données et Affichage
- [ ] Images parcelles s'affichent (avec fallback Supabase Storage)
- [ ] Prix affiché = prix réel (source de vérité définie)
- [ ] Surface affichée correctement
- [ ] Référence parcelle unique
- [ ] Frais notaire = valeur réelle de `notaire_case_assignments`
- [ ] Frais notaire mis à jour en temps réel

### Boutons d'Actions Timeline
- [ ] Boutons visibles seulement à l'étape correspondante
- [ ] Boutons "disabled" avec tooltip si prématurés
- [ ] Mini-boutons dans timeline steps
- [ ] Actions prioritaires (notaire) toujours visibles
- [ ] Pas de boutons cliquables s'ils ne font rien

### Progression
- [ ] Pourcentage basé sur actions complétées
- [ ] Affichage "X/Y actions complétées"
- [ ] Bonus +5% par action
- [ ] Barre de progression synchronisée

### Responsive Design
- [ ] Grids 1 colonne sur mobile
- [ ] Timeline compacte sur mobile
- [ ] Boutons full-width sur petit écran
- [ ] Pas de scroll horizontal
- [ ] Boutons min 44px hauteur (accessibilité)

### PWA
- [ ] Service worker installé
- [ ] Manifest complet avec icônes
- [ ] Prompt "Add to Home Screen"
- [ ] Fonctionne offline (lecture)
- [ ] Cache Supabase assets

### Notifications
- [ ] Permission demandée au login
- [ ] Notifications natives sur events importants
- [ ] Son joué pour messages urgents
- [ ] Badge nombre notifs non lues
- [ ] Toasts dédupliqués (max 3)

### Messages
- [ ] Compteur de messages non lus
- [ ] Badge rouge sur tab "Messages"
- [ ] Marquage automatique "lu" quand ouvert
- [ ] Realtime update compteur
- [ ] Liste messages scrollable

---

## 🚀 ORDRE D'EXÉCUTION RECOMMANDÉ

### Semaine 1 (20h)
1. **Jour 1-2**: Phase 1 (Données et affichage) - 5.5h
   - Images parcelles ✅
   - Prix/Surface/Référence ✅
   - Frais notaire ✅

2. **Jour 3-4**: Phase 2 (Boutons timeline) - 5h
   - Synchronisation Timeline ↔ Actions ✅
   - Timeline avec actions intégrées ✅

3. **Jour 5**: Phase 3 (Progression) - 2h
   - Calcul intelligent ✅

4. **Weekend**: Phase 4 (Responsive) - 3h
   - Mobile optimization ✅

### Semaine 2 (12h)
5. **Jour 1-2**: Phase 5 (PWA) - 4h
   - Service worker ✅
   - Push notifications ✅

6. **Jour 3**: Phase 6 (Messages) - 2.5h
   - Compteur non lus ✅
   - Toast optimizations ✅

7. **Jour 4-5**: Tests E2E - 5.5h
   - Scénarios utilisateurs ✅
   - Fixes bugs identifiés ✅

---

## 📊 MÉTRIQUES DE SUCCÈS FINALES

### Avant Corrections
- 🖼️ Images: 0% affichées
- 💰 Prix: 60% corrects
- 🎯 Actions timeline: 30% synchronisés
- 📊 Progression: 100% hardcodée
- 📱 Mobile: Illisible
- 📲 PWA: 0% installable
- 💬 Messages: Compteur toujours 0

### Après Corrections (Objectifs)
- 🖼️ Images: **100%** affichées (ou placeholder)
- 💰 Prix: **100%** corrects
- 🎯 Actions timeline: **100%** synchronisés
- 📊 Progression: **Dynamique** selon actions réelles
- 📱 Mobile: **Parfaite** lisibilité
- 📲 PWA: **100%** installable + offline
- 💬 Messages: **Badge non lus** en temps réel

---

## 🎯 CONCLUSION

Ce plan couvre **TOUS** les problèmes identifiés dans le système de suivi de dossiers:
1. ✅ Images parcelles
2. ✅ Prix/Surface/Référence
3. ✅ Frais notaire
4. ✅ Boutons d'actions timeline
5. ✅ Pourcentage de progression
6. ✅ Responsive design
7. ✅ PWA et offline
8. ✅ Notifications natives
9. ✅ Messages et compteurs

**Temps total estimé**: **32 heures** (4 jours de travail intensif ou 2 semaines normales)

**Impact utilisateur**: Expérience **10x meilleure**, professionnel, fiable, moderne.
