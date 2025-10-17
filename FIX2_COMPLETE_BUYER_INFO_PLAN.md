# 🔧 FIX #2: COMPLETE BUYER INFORMATION ON CASE TRACKING PAGE

**Date**: October 17, 2025  
**Priority**: 🟠 HIGH  
**Status**: 📋 Planning & Implementation  

---

## 🎯 PROBLEM

Currently, the VendeurCaseTracking page displays incomplete buyer information:
- Only shows basic email/phone if available
- Missing address information
- Missing company name
- Missing contact details

**What User Needs**:
- Full name (first + last)
- Email (clickable)
- Phone (clickable)
- Complete address (street, city, postal code)
- Company name (if applicable)
- User role/title

---

## 🔍 ROOT CAUSE ANALYSIS

### Current Query (Incomplete)
File: `src/pages/dashboards/vendeur/VendeurCaseTracking.jsx`

```javascript
// Probably something like:
const { data: buyer } = await supabase
  .from('profiles')
  .select('id, email, phone')  // ❌ Too limited
  .eq('id', caseData.buyer_id)
  .single();
```

### Required Fields in Profiles Table
Based on database schema:
- `id` (UUID)
- `first_name` (TEXT)
- `last_name` (TEXT)
- `email` (TEXT)
- `contact_phone` (TEXT)
- `address` (TEXT)
- `city` (TEXT)
- `postal_code` (TEXT)
- `country` (TEXT)
- `company_name` (TEXT)
- `user_role` (TEXT)
- `birth_date` (DATE)
- `identification_number` (TEXT)

---

## ✅ SOLUTION

### Step 1: Update Database Query

**File**: `src/pages/dashboards/vendeur/VendeurCaseTracking.jsx`

Find the buyer fetch logic and replace with:

```javascript
// Fetch complete buyer profile
const { data: buyer, error: buyerError } = await supabase
  .from('profiles')
  .select(`
    id,
    first_name,
    last_name,
    email,
    contact_phone,
    phone,
    address,
    city,
    postal_code,
    country,
    company_name,
    user_role,
    birth_date,
    identification_number
  `)
  .eq('id', caseData.buyer_id)
  .single();

if (buyerError) {
  console.warn('⚠️ Buyer profile fetch error:', buyerError);
  // Continue anyway - don't block the page
}

// Format buyer info for display
const buyerInfo = {
  fullName: buyer 
    ? `${buyer.first_name || ''} ${buyer.last_name || ''}`.trim() 
    : 'Acheteur',
  email: buyer?.email || 'Non fourni',
  phone: buyer?.contact_phone || buyer?.phone || 'Non fourni',
  address: buyer?.address 
    ? `${buyer.address}, ${buyer.postal_code || ''} ${buyer.city || ''}`
    : 'Non fourni',
  city: buyer?.city || 'Non fourni',
  country: buyer?.country || 'Sénégal',
  company: buyer?.company_name || 'N/A',
  role: buyer?.user_role || 'Particulier',
  idNumber: buyer?.identification_number || 'Non fourni'
};
```

### Step 2: Create Buyer Information Section Component

**File**: `src/pages/dashboards/vendeur/VendeurCaseTracking.jsx`

Add a new section component:

```javascript
const BuyerInformationSection = ({ buyer, buyerInfo }) => {
  if (!buyer && !buyerInfo) {
    return <div className="p-4 text-gray-500">Informations acheteur indisponibles</div>;
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-6">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">
        👤 Informations de l'Acheteur
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Nom Complet
          </label>
          <p className="text-base font-semibold text-slate-900">
            {buyerInfo.fullName}
          </p>
        </div>

        {/* Role/Type */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Type d'Acheteur
          </label>
          <p className="text-base font-semibold text-slate-900">
            {buyerInfo.role}
          </p>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Email
          </label>
          <a 
            href={`mailto:${buyerInfo.email}`}
            className="text-blue-600 hover:text-blue-700 underline font-medium"
          >
            {buyerInfo.email}
          </a>
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Téléphone
          </label>
          <a 
            href={`tel:${buyerInfo.phone}`}
            className="text-blue-600 hover:text-blue-700 underline font-medium"
          >
            {buyerInfo.phone}
          </a>
        </div>

        {/* Company (if applicable) */}
        {buyerInfo.company && buyerInfo.company !== 'N/A' && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Entreprise
            </label>
            <p className="text-base font-semibold text-slate-900">
              {buyerInfo.company}
            </p>
          </div>
        )}

        {/* Address */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Adresse Complète
          </label>
          <p className="text-base text-slate-900">
            {buyerInfo.address}
          </p>
        </div>

        {/* City & Country */}
        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Ville
          </label>
          <p className="text-base text-slate-900">
            {buyerInfo.city}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">
            Pays
          </label>
          <p className="text-base text-slate-900">
            {buyerInfo.country}
          </p>
        </div>

        {/* ID Number (if available) */}
        {buyerInfo.idNumber && buyerInfo.idNumber !== 'Non fourni' && (
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Pièce d'Identité
            </label>
            <p className="text-base text-slate-900">
              {buyerInfo.idNumber}
            </p>
          </div>
        )}
      </div>

      {/* Contact Buttons */}
      <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
        <a 
          href={`mailto:${buyerInfo.email}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 px-4 font-medium text-center transition"
        >
          📧 Envoyer un Email
        </a>
        <a 
          href={`tel:${buyerInfo.phone}`}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 px-4 font-medium text-center transition"
        >
          ☎️ Appeler
        </a>
      </div>
    </div>
  );
};
```

### Step 3: Integrate Into Case Tracking Page

In the render section of VendeurCaseTracking, add:

```javascript
return (
  <div className="space-y-6">
    {/* Header */}
    {/* ... */}

    {/* Buyer Information Section - NEW */}
    <BuyerInformationSection buyer={buyer} buyerInfo={buyerInfo} />

    {/* Existing sections */}
    {/* Timeline, Property, Documents, etc. */}
  </div>
);
```

---

## 🎨 UI MOCKUP

```
┌─────────────────────────────────────────────────────┐
│ 👤 Informations de l'Acheteur                       │
├─────────────────────────────────────────────────────┤
│                                                     │
│ Nom Complet          │ Type d'Acheteur             │
│ Ousmane Diallo       │ Particulier                  │
│                                                     │
│ Email                │ Téléphone                   │
│ ousmane@example.com  │ +221 77 123 4567            │
│                                                     │
│ Entreprise                                          │
│ N/A                                                 │
│                                                     │
│ Adresse Complète                                    │
│ 123 Avenue Lamine Guèye, 14000 Kaolack, Sénégal   │
│                                                     │
│ Ville               │ Pays                         │
│ Kaolack             │ Sénégal                      │
│                                                     │
│ Pièce d'Identité                                    │
│ CNI-123456789-SN                                    │
│                                                     │
│ ┌──────────────────┬──────────────────┐            │
│ │ 📧 Email         │ ☎️ Appeler       │            │
│ └──────────────────┴──────────────────┘            │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTATION CHECKLIST

- [ ] Locate current buyer fetch logic in VendeurCaseTracking.jsx
- [ ] Update query to include all required fields
- [ ] Create BuyerInformationSection component
- [ ] Add formatBuyerInfo helper function
- [ ] Integrate section into page layout
- [ ] Add error handling for missing fields
- [ ] Test with various buyer profiles
- [ ] Verify email/phone links work
- [ ] Style to match app theme
- [ ] Test on mobile view

---

## 🧪 TESTING STEPS

1. Navigate to a case tracking page
2. Check that buyer full name displays
3. Click on email link - should open mail client
4. Click on phone link - should open phone app
5. Verify all fields are populated
6. Test with missing data (should show "Non fourni")
7. Test on mobile (should stack vertically)

---

## 📊 EXPECTED RESULT

**Before**:
```
Buyer Email: ousmane@example.com
```

**After**:
```
👤 Informations de l'Acheteur

Nom Complet: Ousmane Diallo
Type: Particulier
Email: ousmane@example.com (clickable 📧)
Téléphone: +221 77 123 4567 (clickable ☎️)
Adresse: 123 Avenue Lamine Guèye, 14000 Kaolack, Sénégal
Ville: Kaolack
Pays: Sénégal
ID: CNI-123456789-SN

[📧 Email] [☎️ Appeler]
```

---

**Status**: Ready to implement  
**Effort**: 1-2 hours  
**Impact**: Significantly improves UX for notary and case management  
