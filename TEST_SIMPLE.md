# 🧪 SIMPLE TEST INSTRUCTIONS

**Objectif**: Vérifier si le système synchronise correctement quand un vendeur accepte une demande

---

## ⚡ 30 SECONDES RÉSUMÉ

```
1. Redémarrer: npm run dev
2. Ouvrir 2 tabs: Seller (VendeurPurchaseRequests) + Buyer (ParticulierMesAchats)
3. Ouvrir F12 sur les deux
4. Vendeur: Cliquer ACCEPTER sur une demande
5. Buyer: Regarder console - voyez-vous "🟢 [REALTIME] CALLBACK TRIGGERED!"?
6. Rapportez-moi: OUI ou NON
```

---

## ✅ CHECKLIST

- [ ] Dev server redémarré
- [ ] 2 tabs ouverts (Seller + Buyer)
- [ ] Console ouverte (F12) sur les deux
- [ ] Vendeur a cliqué ACCEPTER
- [ ] J'ai regardé console Buyer pour le log 🟢
- [ ] J'ai noté le résultat

---

## 📊 RÉSULTAT

Répondez avec UNE de ces deux réponses:

### Option 1: Callback vu ✅
```
🟢 Oui! J'ai vu "🟢 [REALTIME] CALLBACK TRIGGERED!" dans la console
La demande a passé du tab "En attente" à "Acceptées"
```

### Option 2: Callback PAS vu ❌
```
❌ Non, pas de "🟢 [REALTIME] CALLBACK TRIGGERED!"
La demande est restée dans "En attente"
```

---

## 📍 PROCHAINES ÉTAPES

Une fois que vous me rapportez, je sais EXACTEMENT quoi fixer:

- **SI Callback vu**: Filter logic ou tabs issue
- **SI Callback PAS vu**: Real-time subscription cassée

Alors je peux faire les fixes nécessaires.

