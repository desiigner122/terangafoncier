# CRM Testing Guide - Complete Walkthrough

## 🧪 Pre-Testing Checklist

- [ ] Database tables created in Supabase (crm_contacts, crm_deals, crm_activities, crm_tasks)
- [ ] RLS policies enabled on all tables
- [ ] CRMService.js in place at `src/services/CRMService.js`
- [ ] useCRM.js hook in place at `src/hooks/useCRM.js`
- [ ] All components created in `src/components/CRM/`
- [ ] CRMPageNew.jsx created at `src/pages/CRM/CRMPageNew.jsx`
- [ ] You're logged in to the app (authenticated)

---

## 🚀 Step 1: Add Route to Your App

Add this to your main router (App.jsx or similar):

```javascript
import CRMPageNew from '@/pages/CRM/CRMPageNew';

// In your route definition:
<Route path="/crm/new" element={<CRMPageNew />} />
```

---

## 🧪 Step 2: Test Basic Navigation

1. **Start the dev server** (if not already running):
   ```bash
   npm run dev
   ```

2. **Navigate to** `http://localhost:5173/crm/new` (or your app's base URL + `/crm/new`)

3. **You should see**:
   - Header: "CRM Dashboard" with subtitle
   - Tab navigation: Overview | Contacts | Deals | Activities
   - Overview tab is active by default
   - 4 KPI cards showing statistics
   - Recent Activity widget

**If you see an error**: Check browser console (F12) for any error messages.

---

## 🧪 Step 3: Test Contact Management

### Create a Contact
1. Click the **"New Contact"** button (top right)
2. A modal should open with the contact form
3. Fill in the form:
   - **Name**: "John Doe" ✓
   - **Email**: "john@example.com" ✓
   - **Phone**: "+221771234567"
   - **Role**: "Decision Maker"
   - **Company**: "ACME Corp"
   - **Location**: "Dakar"
   - **Status**: "prospect"
   - **Score**: 75
4. Click **"Create Contact"** button
5. Modal should close and contact should appear

**Expected**:
- Contact form validates required fields
- Success message or contact appears in list
- Modal closes automatically
- No errors in console

### View Contacts List
1. Click the **"Contacts"** tab
2. You should see a table with:
   - Column headers: Name, Email, Phone, Company, Status, Score, Actions
   - Your newly created contact in the list
   - Action buttons: View, Edit, Delete for each contact

### Filter Contacts
1. Try searching by name in the search box
2. Try filtering by status dropdown
3. Try filtering by role dropdown

**Expected**: Table updates as you filter

### Edit a Contact
1. Click the **"Edit"** (pencil icon) button on any contact
2. Modal opens with pre-filled form data
3. Change a field (e.g., score to 85)
4. Click **"Update Contact"**
5. Modal closes and change is reflected in table

### Delete a Contact
1. Click the **"Delete"** (trash icon) button on any contact
2. Confirm the deletion dialog
3. Contact disappears from list

**Expected**: All CRUD operations work smoothly

---

## 🧪 Step 4: Test Deal Management

### Create a Deal
1. Click the **"Deals"** tab
2. You should see a **Kanban board** with 5 columns:
   - Prospection | Qualification | Proposition | Négociation | Fermeture
3. Click **"New Deal"** button
4. Deal form modal opens with fields:
   - **Title**: "Downtown Property Acquisition" ✓
   - **Contact**: Select "John Doe" (the contact you created) ✓
   - **Value**: 5000000 (5M CFA)
   - **Stage**: "Prospection" (auto-filled)
   - **Probability**: 30
   - **Expected Close Date**: Pick a future date
5. Click **"Create Deal"**
6. Modal closes and deal appears in **Prospection column**

### Drag Deal Between Stages
1. On the Kanban board, you should see your deal card
2. **Drag the deal card** from "Prospection" to "Qualification"
3. Deal should move to the new column
4. Drag it to other stages to test

**Expected**: Smooth drag-drop with visual feedback

### Edit a Deal
1. Click **"Edit"** button on any deal card
2. Form opens with deal data pre-filled
3. Change the probability to 60
4. Click **"Update Deal"**
5. Card updates to show new probability

### Delete a Deal
1. Click the **"Delete"** button on a deal card
2. Confirm deletion
3. Deal disappears from Kanban

**Expected**: Deals move smoothly between stages and persist

---

## 🧪 Step 5: Test Dashboard & Activities

### Overview Tab
1. Click the **"Overview"** tab
2. You should see:
   - **KPI Cards**: Total Contacts, Leads, Pipeline Value, Avg Deal Size
   - **Recent Activity**: Timeline of activities
   - **Quick Stats**: Active Deals, Client Rate, Today's Tasks

### Activities Tab
1. Click the **"Activities"** tab
2. Timeline of all activities (should be mostly empty for new data)
3. Activities show: type, title, contact name, date, outcome

**Expected**: All data displays correctly, no errors

---

## 🧪 Step 6: Form Validation Testing

### Test Required Field Validation
1. Open a contact form
2. **Try submitting without filling Name**
   - Should show error: "Name is required"
3. **Try submitting without Email**
   - Should show error: "Email is required"
4. **Try entering invalid email** (e.g., "notanemail")
   - Should show error: "Invalid email format"

### Test Number Validation
1. Open contact form
2. Try entering score > 100 or < 0
   - Should show error: "Score must be between 0 and 100"

### Test Deal Validation
1. Open deal form
2. Try submitting without title
   - Should show error: "Deal title is required"
3. Try submitting without selecting a contact
   - Should show error: "Please select a contact"

**Expected**: All validations work correctly

---

## 🧪 Step 7: Error Handling

### Test Network Error Handling
1. Open browser dev tools (F12) → Network tab
2. Set Network to **"Offline"**
3. Try creating a new contact
4. Should show error message (network error)
5. Set Network back to **"Online"**

### Test Error Display
1. Check if error messages appear properly
2. Click "Dismiss" to clear error messages

**Expected**: Graceful error handling with user-friendly messages

---

## 🧪 Step 8: Performance Testing

### Test with Multiple Records
1. Create 10-20 contacts
2. Create 5-10 deals
3. Navigate between tabs
4. Check if app remains responsive
5. Monitor browser console for any warnings

**Expected**: Smooth performance, no memory leaks

---

## 📋 Final Testing Checklist

### Functionality
- [ ] Create contact works
- [ ] Edit contact works
- [ ] Delete contact works
- [ ] Contact search filters correctly
- [ ] Create deal works
- [ ] Edit deal works
- [ ] Delete deal works
- [ ] Drag-drop deals works
- [ ] View activities timeline
- [ ] Dashboard KPIs update correctly

### UI/UX
- [ ] Forms look good
- [ ] Buttons are clickable
- [ ] Modals open/close smoothly
- [ ] Kanban board is responsive
- [ ] Tables are sortable/filterable
- [ ] Icons load correctly
- [ ] Colors are appropriate

### Validation
- [ ] Required fields show errors
- [ ] Invalid emails rejected
- [ ] Invalid phone formats rejected
- [ ] Number validation works
- [ ] Date picker works

### Performance
- [ ] App is responsive
- [ ] No lag when switching tabs
- [ ] Animations are smooth
- [ ] No console errors

### Data Persistence
- [ ] Data saves to Supabase
- [ ] Data persists after page refresh
- [ ] Deleted data doesn't come back
- [ ] Edited data updates everywhere

---

## 🐛 Troubleshooting

### Problem: "Hook not found" error
**Solution**: Make sure `useCRM` is imported correctly in CRMPageNew.jsx
```javascript
import { useCRM } from '../../hooks/useCRM';
```

### Problem: "Component not found" error
**Solution**: Verify all component files exist in correct paths

### Problem: Kanban drag-drop not working
**Solution**: 
- Check if Framer Motion is installed: `npm list framer-motion`
- Try installing if missing: `npm install framer-motion`

### Problem: Contacts/deals not showing
**Solution**:
- Check browser console for errors
- Verify Supabase connection
- Check RLS policies are enabled
- Make sure you're logged in (authenticated)

### Problem: Forms not submitting
**Solution**:
- Check console for validation errors
- Fill all required fields (marked with *)
- Check if there are any error messages displayed

### Problem: Data not persisting
**Solution**:
- Check Supabase database directly
- Verify RLS policies allow authenticated users
- Check browser console for API errors
- Verify CRMService is connecting correctly

---

## ✅ Success Criteria

The CRM is working correctly when:

1. ✅ All 4 tabs are accessible (Overview, Contacts, Deals, Activities)
2. ✅ You can create, read, update, delete contacts
3. ✅ You can create, read, update, delete deals
4. ✅ Kanban drag-drop moves deals between stages
5. ✅ Dashboard shows accurate KPI numbers
6. ✅ Forms validate correctly
7. ✅ No console errors
8. ✅ Data persists after refresh
9. ✅ Animations are smooth
10. ✅ UI looks professional and responsive

---

## 🎉 You're Ready!

Once all tests pass, your CRM is production-ready!

Next steps:
- [ ] Decide whether to replace old CRM or keep both
- [ ] Train users on new features
- [ ] Monitor for issues
- [ ] Plan future enhancements

**Happy CRM-ing! 🚀**
