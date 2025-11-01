# 📖 SYSTÈME DE PAIEMENT NOTAIRE - DOCUMENTATION UTILISATEUR

## Vue d'ensemble

Le système de paiement notaire de Teranga Foncier permet aux **notaires** de demander des paiements et aux **acheteurs** de payer facilement via plusieurs méthodes. Le système gère automatiquement l'avancement du workflow après chaque paiement confirmé.

---

## 🎯 Pour les Notaires

### 1. Demander un paiement

#### Étape 1 : Accéder au dossier
1. Connectez-vous à votre dashboard notaire
2. Cliquez sur le dossier concerné dans "Mes dossiers"

#### Étape 2 : Créer une demande
Le bouton d'action s'affiche automatiquement selon l'étape du workflow :

- **Étape "deposit_payment"** → "Demander versement des arrhes (10%)"
- **Étape "notary_fees_calculation"** → "Calculer et demander frais de notaire"
- **Étape "final_payment_pending"** → "Demander paiement final (90%)"

#### Étape 3 : Remplir la demande
1. Cliquez sur le bouton d'action
2. Le montant est calculé automatiquement :
   - **Arrhes** : 10% du prix d'achat
   - **Frais notaire** : 17.5% (10% + 5% + 2.5%)
   - **Paiement final** : 90% du solde restant
3. Ajoutez une description (pré-remplie)
4. Ajoutez des instructions de paiement (optionnel)
5. Définissez une date limite (par défaut : +7 jours)
6. Cliquez "Envoyer la demande"

#### Résultat :
- ✅ Demande créée dans la base de données
- ✅ Statut du workflow avance automatiquement
- ✅ L'acheteur reçoit une notification
- ✅ L'acheteur voit la demande dans son dashboard

### 2. Suivre les paiements

#### Tableau de bord
- Accédez à "Mes paiements" dans votre dashboard
- Visualisez toutes les demandes :
  - **En attente** : L'acheteur n'a pas encore payé
  - **Traité** : Paiement effectué et vérifié
  - **Échoué** : Tentative de paiement échouée

#### Notifications temps réel
Vous recevez une notification lorsque :
- L'acheteur effectue un paiement
- Un paiement est confirmé par la passerelle
- Un paiement échoue

---

## 💳 Pour les Acheteurs

### 1. Visualiser les demandes de paiement

#### Accès rapide
1. Connectez-vous à votre dashboard acheteur
2. Une **alerte rouge** s'affiche en haut si vous avez des paiements en attente
3. Ou naviguez vers votre dossier d'achat

#### Informations affichées
Pour chaque demande de paiement :
- 📊 Type de paiement (Arrhes, Frais notaire, Paiement final)
- 💰 Montant à payer
- 📅 Date limite
- ⚠️ Badge d'urgence (si proche de l'échéance)
- 📝 Instructions du notaire
- 📋 Ventilation détaillée (pour frais notaire)

### 2. Effectuer un paiement

#### Méthode 1 : Wave Money (Recommandé)
**Frais** : 0%  
**Délai** : Instantané

1. Cliquez "Procéder au paiement"
2. Sélectionnez "Wave"
3. Vérifiez le montant
4. Cliquez "Confirmer le paiement"
5. **Vous serez redirigé vers Wave**
6. Scannez le QR code avec votre app Wave
7. Confirmez le paiement dans Wave
8. **Retour automatique** vers Teranga Foncier
9. Paiement vérifié et confirmé ✅

#### Méthode 2 : Orange Money
**Frais** : 1%  
**Délai** : Instantané

1. Cliquez "Procéder au paiement"
2. Sélectionnez "Orange Money"
3. Vérifiez le montant + frais (1%)
4. Cliquez "Confirmer le paiement"
5. **Vous serez redirigé vers Orange Money**
6. Suivez les instructions :
   - Composez `#144#` sur votre téléphone Orange
   - Sélectionnez "Payer un marchand"
   - Entrez le code fourni
   - Confirmez avec votre code PIN
7. **Retour automatique** vers Teranga Foncier
8. Paiement vérifié et confirmé ✅

#### Méthode 3 : Virement Bancaire
**Frais** : 0%  
**Délai** : 24-48h (vérification manuelle)

1. Cliquez "Procéder au paiement"
2. Sélectionnez "Virement Bancaire"
3. **Notez les informations bancaires** :
   - Banque : **BHS (Banque de l'Habitat du Sénégal)**
   - Titulaire : Teranga Foncier SARL
   - N° compte : `SN08 SN01 0100 0123 4567 8901 234`
   - Code SWIFT : `BHSNSNDX`
   - **Référence** : `TF-XXXXX` (IMPORTANT !)
4. Effectuez le virement depuis votre banque
5. **Utilisez impérativement la référence fournie**
6. Le paiement sera vérifié sous 24-48h
7. Vous recevrez une notification de confirmation

#### Méthode 4 : Carte Bancaire
**Frais** : 2.5%  
**Délai** : Instantané

1. Cliquez "Procéder au paiement"
2. Sélectionnez "Carte Bancaire"
3. Vérifiez le montant + frais (2.5%)
4. Cliquez "Confirmer le paiement"
5. **Vous serez redirigé vers PayTech** (passerelle sécurisée)
6. Entrez vos informations de carte :
   - Numéro de carte
   - Date d'expiration
   - CVV
7. Validez avec 3D Secure (code SMS)
8. **Retour automatique** vers Teranga Foncier
9. Paiement vérifié et confirmé ✅

### 3. Après le paiement

#### Confirmation immédiate
- ✅ Vous voyez une page de succès
- ✅ Le notaire est notifié automatiquement
- ✅ Le dossier avance au statut suivant
- ✅ La demande de paiement disparaît de votre liste
- ✅ Vous recevez un reçu par email

#### Si le paiement échoue
- ❌ Vous voyez une page d'erreur
- 🔄 Vous pouvez réessayer immédiatement
- 📧 Vous pouvez contacter le support si besoin

#### Si vous annulez
- ⚠️ Aucun montant n'est débité
- 🔄 La demande reste en attente
- ✅ Vous pouvez payer plus tard

---

## 🔄 Workflow Automatique

### Étapes avec paiement

Le système gère 3 types de paiements dans le workflow :

| Étape Workflow | Type Paiement | Montant | Status Suivant |
|----------------|---------------|---------|----------------|
| `deposit_payment` | Arrhes | 10% | `title_verification` |
| `notary_fees_calculation` | Frais notaire | 17.5% | `payment_request` |
| `final_payment_pending` | Paiement final | 90% | `property_registration` |

### Avancement automatique

Après chaque paiement confirmé :
1. ✅ Le statut de la demande passe de `pending` → `paid`
2. ✅ Le workflow avance automatiquement au status suivant
3. ✅ Le notaire reçoit une notification
4. ✅ L'acheteur voit le nouveau statut dans son dashboard
5. ✅ La timeline du dossier est mise à jour

---

## 💰 Calcul des Frais

### Arrhes (10%)
**Exemple** : Prix d'achat = 50,000,000 FCFA  
→ Arrhes = 5,000,000 FCFA

### Frais de Notaire (17.5%)
**Composition** :
- Droits d'enregistrement : **10%**
- Honoraires notaire : **5%**
- Taxes et timbres : **2.5%**
- **TOTAL : 17.5%**

**Exemple** : Prix d'achat = 50,000,000 FCFA
- Droits d'enregistrement : 5,000,000 FCFA
- Honoraires notaire : 2,500,000 FCFA
- Taxes et timbres : 1,250,000 FCFA
- **TOTAL : 8,750,000 FCFA**

### Paiement Final (90%)
**Calcul** : Prix d'achat - Arrhes déjà payées

**Exemple** : Prix d'achat = 50,000,000 FCFA  
→ Arrhes déjà payées = 5,000,000 FCFA  
→ Paiement final = 45,000,000 FCFA

### Frais de Transaction

| Méthode | Frais | Sur Montant |
|---------|-------|-------------|
| Wave | 0% | Gratuit |
| Orange Money | 1% | 50,000 → +500 FCFA |
| Virement | 0% | Gratuit |
| Carte | 2.5% | 50,000 → +1,250 FCFA |

---

## 🔐 Sécurité

### Protection des données
- ✅ Toutes les transactions sont cryptées (SSL/TLS)
- ✅ Aucune information bancaire stockée sur nos serveurs
- ✅ Conformité PCI-DSS pour les paiements par carte
- ✅ Authentification 3D Secure pour les cartes

### Vérifications
- ✅ Chaque paiement est vérifié par la passerelle
- ✅ Webhooks automatiques pour confirmation
- ✅ Double vérification manuelle pour virements
- ✅ Historique complet des transactions

### En cas de litige
1. Contactez immédiatement le support : support@teranga-foncier.sn
2. Fournissez votre référence de transaction
3. Notre équipe enquêtera sous 24h
4. Remboursement possible si erreur prouvée

---

## 📊 Notifications

### Notaire reçoit une notification quand :
- ✅ L'acheteur effectue un paiement
- ✅ Un paiement est confirmé
- ❌ Un paiement échoue
- ⏳ Un virement est en attente de vérification

### Acheteur reçoit une notification quand :
- 📨 Une demande de paiement est créée
- ✅ Un paiement est confirmé
- ❌ Un paiement échoue
- ⚠️ La date limite approche
- 📄 Le reçu est disponible

---

## 🆘 Support

### Questions fréquentes

**Q: Mon paiement Wave n'a pas été confirmé, que faire ?**  
R: Patientez 5 minutes, le système vérifie automatiquement. Si le problème persiste, contactez le support.

**Q: J'ai annulé par erreur, puis-je réessayer ?**  
R: Oui, retournez sur votre dossier et cliquez à nouveau sur "Procéder au paiement".

**Q: Le notaire n'a pas été notifié de mon paiement**  
R: Vérifiez dans votre historique de paiements. Si le statut est "Confirmé", le notaire a été notifié. Sinon, contactez le support.

**Q: Puis-je payer en plusieurs fois ?**  
R: Non, chaque demande doit être payée intégralement. Contactez le notaire pour des arrangements particuliers.

**Q: Le virement bancaire prend combien de temps ?**  
R: 24-48h ouvrées pour vérification manuelle par notre équipe comptable.

### Contact Support
- 📧 Email : support@teranga-foncier.sn
- 📞 Téléphone : +221 33 XXX XX XX
- 💬 Chat : Disponible dans votre dashboard
- ⏰ Horaires : Lundi-Vendredi 9h-18h

---

## 🚀 Avantages du Système

### Pour les Notaires
- ✅ Demandes en 30 secondes
- ✅ Calcul automatique des montants
- ✅ Notifications temps réel
- ✅ Avancement automatique du workflow
- ✅ Historique complet des paiements
- ✅ Aucune gestion manuelle

### Pour les Acheteurs
- ✅ 4 méthodes de paiement au choix
- ✅ Paiements sécurisés
- ✅ Confirmation instantanée (Wave, Orange, Carte)
- ✅ Instructions claires pour virements
- ✅ Badges d'urgence pour échéances
- ✅ Historique consultable

### Pour tous
- ✅ Transparence totale
- ✅ Traçabilité complète
- ✅ Conformité réglementaire
- ✅ Réduction des erreurs
- ✅ Gain de temps considérable

---

## 📱 Compatibilité

### Navigateurs supportés
- ✅ Chrome (recommandé)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ❌ Internet Explorer (non supporté)

### Appareils
- ✅ Desktop (Windows, Mac, Linux)
- ✅ Tablettes (iPad, Android)
- ✅ Smartphones (iOS, Android)

### Applications mobiles requises
- Wave Money (pour paiements Wave)
- Orange Money (pour paiements Orange)

---

## 📈 Statistiques

Le système enregistre automatiquement :
- Nombre de paiements par méthode
- Montants totaux traités
- Temps moyen de confirmation
- Taux de succès par passerelle
- Disponible dans votre dashboard

---

**Version** : 1.0 - Phase 4  
**Dernière mise à jour** : Novembre 2024  
**Prochaines fonctionnalités** :
- Paiements récurrents
- Frais personnalisés
- Export des reçus PDF
- Intégration Orange Money Web

---

Pour toute question ou assistance, n'hésitez pas à contacter notre équipe support ! 🤝
