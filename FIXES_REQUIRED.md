# 🔧 FIXES REQUIRED - Supabase Integration Errors

## ❌ Issues Found

### Issue 1: Relationship Error
```
Error: "Could not find a relationship between 'purchase_case_participants' and 'user_id' in the schema cache"
```

**Cause**: Supabase REST API doesn't recognize the foreign key relationship we just created.

**Solution**: 
1. Supabase cache needs refresh (happens automatically but can take a minute)
2. Simplify queries - don't use Supabase relationship joins for now
3. Query separately instead of using `user:user_id(...)` syntax

---

### Issue 2: Column Name Error
```
Error: "column profiles_1.raw_user_meta_data does not exist"
```

**Cause**: Queries use `raw_user_meta_data` but the correct column is `user_metadata`

**Solution**: Update all queries to use `user_metadata` instead of `raw_user_meta_data`

---

### Issue 3: Vendor Acceptance Button Shows Again
```
Problem: Page shows "Accept" button even though seller already accepted
```

**Cause**: Code doesn't check if case is already accepted before showing button

**Solution**: Check `case.status` or `seller_status` before rendering accept button

---

## ✅ Fixes to Apply

### Fix 1: Update SellerAcceptanceService.js Query

**File**: `src/services/SellerAcceptanceService.js`

Find this query (around line 23):
```javascript
const { data: caseData } = await supabase
  .from('purchase_cases')
  .select('*, buyer:buyer_id(id, email, raw_user_meta_data)')
  .eq('id', caseId)
  .eq('seller_id', sellerId)
  .single();
```

Replace with:
```javascript
const { data: caseData } = await supabase
  .from('purchase_cases')
  .select('*')
  .eq('id', caseId)
  .eq('seller_id', sellerId)
  .single();

// Then fetch buyer separately if needed:
if (caseData?.buyer_id) {
  const { data: buyer } = await supabase
    .from('profiles')
    .select('id, email, user_metadata')
    .eq('id', caseData.buyer_id)
    .single();
  caseData.buyer = buyer;
}
```

---

### Fix 2: Update RefactoredVendeurCaseTracking.jsx

**File**: `src/pages/dashboards/vendeur/RefactoredVendeurCaseTracking.jsx`

Find the accept button rendering (around line 100-150) and add a check:

```jsx
// BEFORE:
{case.status === 'pending' && (
  <Button onClick={handleAcceptCase} className="bg-green-600">
    ✅ Accept Request
  </Button>
)}

// AFTER:
{(case.status === 'pending' || case.seller_status === 'pending') && (
  <Button onClick={handleAcceptCase} className="bg-green-600">
    ✅ Accept Request
  </Button>
)}

{case.status === 'seller_accepted' && case.seller_status === 'accepted' && (
  <div className="bg-green-100 border border-green-300 p-4 rounded">
    <CheckCircle className="text-green-600 inline mr-2" />
    <span className="text-green-700 font-semibold">Request Accepted</span>
  </div>
)}
```

---

### Fix 3: Add Tracking/Status Component

Create a new component to show the complete workflow status:

**File**: `src/pages/dashboards/vendeur/CaseTrackingStatus.jsx`

```jsx
import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

export const CaseTrackingStatus = ({ caseData, timeline }) => {
  // Workflow phases
  const phases = [
    { 
      id: 1, 
      title: 'Offer', 
      status: caseData?.status === 'pending' ? 'current' : caseData?.created_at ? 'completed' : 'pending',
      date: caseData?.created_at,
      icon: '📋'
    },
    { 
      id: 2, 
      title: 'Seller Acceptance', 
      status: caseData?.seller_status === 'accepted' ? 'completed' : caseData?.status === 'seller_accepted' ? 'completed' : 'pending',
      date: caseData?.seller_response_date,
      icon: '✅'
    },
    { 
      id: 3, 
      title: 'Verification', 
      status: caseData?.status === 'verified' ? 'completed' : caseData?.status === 'seller_accepted' ? 'current' : 'pending',
      date: null,
      icon: '🔍'
    },
    { 
      id: 4, 
      title: 'Legal Processing', 
      status: caseData?.status === 'legal_processing' ? 'current' : caseData?.status === 'completed' ? 'completed' : 'pending',
      date: null,
      icon: '⚖️'
    },
    { 
      id: 5, 
      title: 'Payment', 
      status: caseData?.status === 'payment_processed' ? 'completed' : caseData?.status === 'legal_processing' ? 'current' : 'pending',
      date: null,
      icon: '💰'
    },
    { 
      id: 6, 
      title: 'Completed', 
      status: caseData?.status === 'completed' ? 'completed' : 'pending',
      date: caseData?.completed_at,
      icon: '🎉'
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-xl font-bold mb-6">📦 Case Status Tracking</h3>
      
      {/* Timeline View */}
      <div className="space-y-4">
        {phases.map((phase, idx) => (
          <div key={phase.id} className="flex items-start gap-4">
            {/* Icon */}
            <div className="text-3xl">{phase.icon}</div>
            
            {/* Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-lg">{phase.title}</h4>
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                  phase.status === 'current' ? 'bg-blue-100 text-blue-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {phase.status === 'completed' ? '✅ Complete' :
                   phase.status === 'current' ? '⏳ In Progress' :
                   '⏸️ Pending'}
                </span>
              </div>
              
              {phase.date && (
                <p className="text-sm text-gray-600 mt-1">
                  {new Date(phase.date).toLocaleDateString()}
                </p>
              )}
            </div>
            
            {/* Connector line */}
            {idx < phases.length - 1 && (
              <div className={`w-1 h-16 ${
                phase.status === 'completed' ? 'bg-green-300' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Current Status Summary */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm font-semibold text-blue-900">
          Current Status: <span className="text-blue-700">{caseData?.status?.toUpperCase()}</span>
        </p>
        <p className="text-xs text-blue-700 mt-2">
          Last Updated: {new Date(caseData?.updated_at).toLocaleString()}
        </p>
      </div>
    </Card>
  );
};

export default CaseTrackingStatus;
```

---

## 🔄 Integration Steps

### Step 1: Fix SellerAcceptanceService
- Open `src/services/SellerAcceptanceService.js`
- Replace the relationship query (line ~23) with simple query
- Update `raw_user_meta_data` to `user_metadata`

### Step 2: Update RefactoredVendeurCaseTracking
- Add status check before showing accept button
- Show "Already Accepted" message if already accepted
- Import and integrate CaseTrackingStatus component

### Step 3: Create CaseTrackingStatus Component
- Create new file: `src/pages/dashboards/vendeur/CaseTrackingStatus.jsx`
- Copy code from above
- Use it in VendeurCaseTracking page

### Step 4: Refresh Build
```bash
npm run build
```

### Step 5: Test
- Go to seller case tracking page
- If already accepted: should NOT show accept button
- Should show "Request Accepted" message
- Should show workflow tracking (like a package tracker)

---

## 📝 Complete Code Changes

### SellerAcceptanceService.js (Lines 20-50)

```javascript
// OLD CODE:
const { data: caseData } = await supabase
  .from('purchase_cases')
  .select('*, buyer:buyer_id(id, email, raw_user_meta_data)')
  .eq('id', caseId)
  .eq('seller_id', sellerId)
  .single();

// NEW CODE:
let { data: caseData, error } = await supabase
  .from('purchase_cases')
  .select('*')
  .eq('id', caseId)
  .eq('seller_id', sellerId)
  .single();

if (error) throw error;

// Fetch buyer info separately
if (caseData?.buyer_id) {
  const { data: buyer } = await supabase
    .from('profiles')
    .select('id, email, user_metadata')
    .eq('id', caseData.buyer_id)
    .single();
  
  if (buyer) {
    caseData.buyer = buyer;
  }
}
```

---

## ✨ What This Fixes

✅ Remove "Accept again" button when already accepted  
✅ Show workflow tracking (like package delivery tracking)  
✅ Fix Supabase query errors  
✅ Better user experience  
✅ Clear status display  

---

**Status**: 🚧 Ready to implement
**Time**: ~20 minutes to fix all issues
