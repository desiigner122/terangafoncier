# CRM Component Build Plan

## ✅ Database Setup Complete
All 4 tables created successfully:
- `crm_contacts` ✅
- `crm_deals` ✅
- `crm_activities` ✅
- `crm_tasks` ✅

---

## 📋 Phase 2: Component Development

### Timeline: ~10-12 hours total

### Core Components to Build (in order):

#### 1. **ContactForm.jsx** (1.5 hours)
- Modal form for creating/editing contacts
- Fields: name, email, phone, role, company, location, status, interests, notes, tags
- Form validation
- Integration with `useCRM.addContact` and `updateContact`
- Modal open/close handlers

#### 2. **DealForm.jsx** (1.5 hours)
- Modal form for deals
- Fields: title, contact_id (dropdown), value, stage, probability, expected_close_date
- Date picker for expected_close_date
- Validation for required fields
- Integration with `useCRM.addDeal` and `updateDeal`

#### 3. **ContactList.jsx** (1.5 hours)
- Table view of all contacts
- Columns: Name, Email, Phone, Status, Score, Actions
- Filters: Status dropdown, Role dropdown, Search input
- Action buttons: Edit, Delete, View, Call, Email
- Pagination if needed
- Integration with `useCRM.fetchContacts`, `deleteContact`, `updateContact`

#### 4. **KanbanBoard.jsx** (2 hours)
- Drag-and-drop pipeline visualization
- 5 columns: Prospection, Qualification, Proposition, Négociation, Fermeture
- Deal cards showing: title, value, probability, contact name
- Drag to move deals between stages
- Integration with `useCRM.moveDeal`
- Uses `@dnd-kit` or `react-beautiful-dnd`

#### 5. **StatsCard.jsx** (1 hour)
- Reusable KPI card component
- Displays: value, label, icon, trend
- Dashboard cards: Total Contacts, Leads, Clients, Pipeline Value, Avg Deal Size
- Integration with `useCRM.fetchStats`

#### 6. **ActivityTimeline.jsx** (1.5 hours)
- Timeline view of activities
- Filter by contact or deal
- Shows: type icon, title, outcome, date, created_by
- Activity types: call, email, meeting, note, task
- Color coding by type
- Integration with `useCRM.fetchActivities`

#### 7. **CRMPageNew.jsx** (2 hours)
- Main page assembling all components
- Tabs: Overview, Contacts, Deals, Tasks, Activities
- Dashboard layout with stats and recent activity
- Navigation between sections
- Loading and error states
- Integration with entire `useCRM` hook

---

## 🎯 Next Immediate Steps

### 1. Test Database with Sample Data (10 min)
```sql
INSERT INTO crm_contacts (name, email, phone, role, company, location, status, score)
VALUES ('Test Contact', 'test@example.com', '+221770000000', 'Decision Maker', 'Test Corp', 'Dakar', 'prospect', 75);

INSERT INTO crm_deals (title, contact_id, value, stage, probability)
VALUES ('Test Deal', (SELECT id FROM crm_contacts LIMIT 1), 500000, 'Prospection', 30);
```

### 2. Create ContactForm Component
- Start with basic modal
- Add form fields
- Connect to CRMService via useCRM

### 3. Create ContactList Component
- Table with sample data
- Add filters
- Connect CRUD operations

### 4. Build KanbanBoard
- Most complex component
- Requires drag-drop library

### 5. Assemble into CRMPageNew
- Tabs and navigation
- State management

---

## 📦 Dependencies Already Installed
- ✅ React 18.2.0
- ✅ Framer Motion
- ✅ Shadcn UI
- ✅ Lucide React Icons
- ✅ Tailwind CSS

### May Need to Install
- `@dnd-kit/core` - For drag-drop (Kanban)
- `@dnd-kit/utilities`
- `@dnd-kit/sortable`
- `@dnd-kit/backends`
- `date-fns` - For date formatting (already might be installed)

---

## 🚀 Recommended Build Order

**Day 1:**
1. ✅ Database setup (DONE!)
2. Test with sample data
3. Build ContactForm
4. Build ContactList

**Day 2:**
1. Build DealForm
2. Build KanbanBoard
3. Build StatsCard

**Day 3:**
1. Build ActivityTimeline
2. Build CRMPageNew (main page)
3. Integration testing

---

## 💡 Key Integration Points

Each component will use `useCRM` hook:

```javascript
const {
  contacts, deals, activities, stats,
  loading, error,
  fetchContacts, addContact, updateContact, deleteContact,
  fetchDeals, addDeal, updateDeal, moveDeal,
  fetchActivities, addActivity,
  fetchStats
} = useCRM();
```

---

## ✨ Success Criteria

✅ All 4 tables created with RLS policies
✅ CRMService integrated with Supabase
✅ useCRM hook working with sample data
✅ ContactList displays all contacts
✅ ContactForm creates new contacts
✅ KanbanBoard moves deals between stages
✅ Dashboard shows statistics
✅ Activities timeline displays logs
✅ Full CRUD operations functional
✅ Replace old CRMPage with CRMPageNew

---

## 📝 Notes

- RLS policies allow authenticated users to access all CRM data
- Each table has proper indexes for performance
- Timestamps auto-populate (created_at, updated_at)
- Foreign keys handle cascade deletes
- Arrays and JSONB fields support flexible data storage

---

**Status: Phase 1 Complete ✅ | Phase 2 Starting 🚀**
