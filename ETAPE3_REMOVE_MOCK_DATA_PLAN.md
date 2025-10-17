# 📋 ÉTAPE 3: Remove Mock Data - DETAILED PLAN

**Objective**: Replace all mock data with real database queries  
**Estimated Duration**: 3-4 hours  
**Priority**: 🔴 CRITICAL - User-facing features

---

## 📍 Phase 1: Audit Existing Mock Data

### Task 1.1: Find all mock data locations
```
Files with mock data:
1. NotificationService.js - Lines ~50-150 (MOCK_NOTIFICATIONS array)
2. VendeurMessages.jsx - Mock conversations hardcoded
3. ParticulierMessages.jsx - Mock conversations hardcoded
4. Sidebar badges - Hardcoded numbers (0, 1, 2, etc.)
```

### Task 1.2: Identify corresponding DB tables
```
Mock → Real Table
├── MOCK_NOTIFICATIONS → notifications table
├── Mock messages → messages table
├── Mock conversations → Could use custom threads table
└── Hardcoded counts → Queries on requests/purchase_cases
```

---

## 🔨 Phase 2: NotificationService.js Refactor

### Current State (MOCK)
```javascript
const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'order_accepted', title: 'Votre commande a été acceptée', ... },
  { id: '2', type: 'payment_received', title: 'Paiement reçu', ... },
  // ... many mock items
];

getAllNotifications() {
  return MOCK_NOTIFICATIONS; // ❌ MOCK
}
```

### Target State (REAL)
```javascript
async getAllNotifications(userId, limit = 50) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data || [];
}
```

### Changes Needed in NotificationService.js

**1. Add real data methods**:
```javascript
// Replace mock with real queries
async getNotifications(userId, filter = null) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (filter === 'unread') {
    query = query.eq('is_read', false);
  }
  if (filter === 'today') {
    query = query.gte('created_at', /* today's date */);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

async markAsRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId);
  if (error) throw error;
}

async deleteNotification(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .delete()
    .eq('id', notificationId);
  if (error) throw error;
}
```

**2. Update notification creation** (Called when vendor accepts):
```javascript
// In handleAccept() in VendeurPurchaseRequests.jsx:
async createNotification(buyerId, type, data) {
  const { error } = await supabase
    .from('notifications')
    .insert({
      user_id: buyerId,
      type: type, // 'request_accepted', 'payment_required', etc.
      title: data.title,
      message: data.message,
      action_url: data.action_url,
      is_read: false,
      created_at: new Date().toISOString()
    });
  
  if (error) throw error;
}
```

### Database Schema Check

**notifications table should have**:
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  type VARCHAR(50), -- 'request_accepted', 'payment_due', etc.
  title TEXT,
  message TEXT,
  action_url TEXT, -- URL to navigate to when clicked
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now(),
  
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES profiles(id)
);
```

**If table doesn't exist**, create it with the SQL above.

---

## 💬 Phase 3: Messages System Refactor

### Current State (MOCK)
```javascript
// VendeurMessages.jsx
const MOCK_CONVERSATIONS = [
  { id: 1, name: 'Jean Dupont', lastMessage: '...', ... },
  { id: 2, name: 'Marie Sy', lastMessage: '...', ... },
];
```

### Target State (REAL)
```javascript
// Load from messages table
const conversations = supabase
  .from('messages')
  .select('*, profiles!sender_id(first_name, last_name, email)')
  .eq('recipient_id', userId)
  .order('created_at', { ascending: false });
```

### Database Schema

**messages table should have**:
```sql
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  sender_id UUID REFERENCES profiles(id),
  recipient_id UUID REFERENCES profiles(id),
  conversation_id UUID, -- To group messages in threads
  subject TEXT,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT now(),
  
  CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES profiles(id),
  CONSTRAINT fk_recipient FOREIGN KEY (recipient_id) REFERENCES profiles(id)
);
```

**If table doesn't exist**, create it.

### Changes to VendeurMessages.jsx

**1. Replace mock with real query**:
```javascript
const loadMessages = async () => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        id,
        conversation_id,
        subject,
        body,
        sender_id,
        is_read,
        created_at,
        profiles:sender_id(id, first_name, last_name, email)
      `)
      .eq('recipient_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Group by conversation
    const grouped = groupByConversation(data);
    setConversations(grouped);
  } catch (error) {
    console.error('❌ Erreur chargement messages:', error);
  }
};
```

**2. Add subscribe to new messages**:
```javascript
useEffect(() => {
  if (user) {
    loadMessages();
    
    // Subscribe to new messages
    const unsubscribe = RealtimeSyncService.subscribeToMessages(
      user.id,
      (payload) => {
        console.log('📨 Nouveau message reçu');
        loadMessages(); // Reload
      }
    );
    
    return unsubscribe;
  }
}, [user]);
```

### Changes to ParticulierMessages.jsx
Same approach as VendeurMessages.jsx

---

## 📊 Phase 4: Sidebar Badges

### Current State (MOCK)
```javascript
// In sidebar rendering
<Badge>{0}</Badge> {/* Hardcoded 0 */}
<Badge>{1}</Badge> {/* Hardcoded 1 */}
```

### Target State (REAL)
```javascript
const [stats, setStats] = useState({
  pending: 0,
  accepted: 0,
  processing: 0,
  completed: 0
});

useEffect(() => {
  loadStats();
}, [user]);

const loadStats = async () => {
  try {
    // Get all requests/transactions for this user
    const { data: requests } = await supabase
      .from('requests')
      .select('id')
      .eq('user_id', user.id);
    
    const requestIds = requests?.map(r => r.id) || [];
    
    if (requestIds.length === 0) {
      setStats({ pending: 0, accepted: 0, processing: 0, completed: 0 });
      return;
    }
    
    // Get purchase_cases status
    const { data: cases } = await supabase
      .from('purchase_cases')
      .select('status')
      .in('request_id', requestIds);
    
    // Calculate stats
    const newStats = {
      pending: requestIds.length - (cases?.length || 0), // No case = pending
      accepted: cases?.filter(c => c.status === 'preliminary_agreement').length || 0,
      processing: cases?.filter(c => 
        ['contract_preparation', 'legal_verification', 'document_audit'].includes(c.status)
      ).length || 0,
      completed: cases?.filter(c => c.status === 'completed').length || 0
    };
    
    setStats(newStats);
  } catch (error) {
    console.error('❌ Erreur loading stats:', error);
  }
};

// In render
<Badge>{stats.pending}</Badge>
<Badge>{stats.accepted}</Badge>
<Badge>{stats.processing}</Badge>
<Badge>{stats.completed}</Badge>
```

---

## 🔄 Phase 5: Integration with Existing Services

### Notifications Integration

**When vendor accepts request** (in VendeurPurchaseRequests.jsx):
```javascript
// After creating purchase_case
await NotificationService.createNotification({
  user_id: buyer.id,
  type: 'request_accepted',
  title: `Votre demande pour ${parcel.title} a été acceptée!`,
  message: `Le vendeur ${seller.first_name} a accepté votre demande.`,
  action_url: `/particulier/mes-achats`
});
```

**When buyer makes request** (in ParcelDetailPage or BuyerOfferModal):
```javascript
// After creating transaction/request
await NotificationService.createNotification({
  user_id: parcel.seller_id,
  type: 'new_request',
  title: `Nouvelle demande pour ${parcel.title}`,
  message: `${buyer.first_name} ${buyer.last_name} a fait une offre`,
  action_url: `/vendeur/demandes`
});
```

### Messages Integration

**When parties communicate**:
```javascript
const sendMessage = async (recipientId, subject, body) => {
  const { error } = await supabase
    .from('messages')
    .insert({
      sender_id: user.id,
      recipient_id: recipientId,
      conversation_id: generateConversationId(user.id, recipientId),
      subject,
      body,
      created_at: new Date().toISOString()
    });
  
  if (error) throw error;
  
  // Send notification too
  await NotificationService.createNotification({
    user_id: recipientId,
    type: 'new_message',
    title: `Nouveau message: ${subject}`,
    message: `De: ${user.first_name}`,
    action_url: `/messages`
  });
};
```

---

## ✅ Checklist: ÉTAPE 3 Tasks

- [ ] **Audit Phase**
  - [ ] Identify all mock data locations
  - [ ] Create list of corresponding DB tables
  - [ ] Check if DB tables exist (notifications, messages)

- [ ] **NotificationService Refactor**
  - [ ] Remove MOCK_NOTIFICATIONS constant
  - [ ] Add getNotifications(userId, filter)
  - [ ] Add createNotification(data)
  - [ ] Add markAsRead(notificationId)
  - [ ] Add deleteNotification(notificationId)
  - [ ] Update all notification creation calls

- [ ] **Messages System**
  - [ ] Refactor VendeurMessages.jsx
  - [ ] Refactor ParticulierMessages.jsx
  - [ ] Add message sending functionality
  - [ ] Add real-time message subscription
  - [ ] Update styles for real data (if needed)

- [ ] **Sidebar Badges**
  - [ ] Create stats loading function
  - [ ] Connect to purchase_cases counts
  - [ ] Update badge rendering
  - [ ] Add to both acheteur and vendeur sidebars

- [ ] **Testing**
  - [ ] Vendor creates notification when accepting
  - [ ] Notifications appear in real-time
  - [ ] Messages load from DB
  - [ ] Badges update correctly
  - [ ] No console errors

- [ ] **Commit**
  - [ ] Commit with clear message
  - [ ] Document changes in ÉTAPE3_MOCK_REMOVAL_COMPLETE.md

---

## 📊 Estimated Breakdown

| Task | Duration | Difficulty |
|------|----------|------------|
| NotificationService refactor | 45 min | Medium |
| VendeurMessages refactor | 45 min | Medium |
| ParticulierMessages refactor | 45 min | Medium |
| Sidebar badges | 30 min | Easy |
| Testing & debugging | 30 min | Medium |
| **TOTAL** | **3.5 hours** | — |

---

## 💡 Tips & Tricks

1. **Keep mock data temporarily** - Don't delete MOCK_* until confirmed real data works
2. **Add feature flags** - Use URL param to toggle mock vs real data
3. **Test in browser** - F12 → Network tab to see queries
4. **Supabase Studio** - Check data in real database
5. **Real-time preview** - Open two browser tabs, see updates immediately

---

## 🚀 After ÉTAPE 3

Once mock data is removed:
- ✅ ÉTAPE 4: Add buyer sidebar badges (uses real data)
- ✅ ÉTAPE 5: Complete parcel → payment workflow
- ✅ Full system test
- ✅ Ready for Phase 3 implementation

---

**Next**: Start with NotificationService.js refactor (least dependencies)
