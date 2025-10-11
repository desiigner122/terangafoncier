# 🚀 IMPLÉMENTATION COMPLÈTE - DASHBOARD ADMIN

**Date**: 9 octobre 2025  
**Fichier**: `CompleteSidebarAdminDashboard.jsx`  
**État**: En cours d'implémentation complète

---

## 📋 CHECKLIST IMPLÉMENTATION

### ✅ PHASE 1: CORRECTIONS URGENTES (En cours)

#### 1. Supprimer Données Mockées
- [ ] Ligne 1992-1993: "Nouveaux ce Mois: 147" → Calculer depuis Supabase
- [ ] Ligne 2002-2003: "Taux d'Engagement: 78%" → Calculer depuis activité
- [ ] Créer fonction `getStatusColor(status)` pour les badges
- [ ] Créer fonction `formatCurrency(amount)` pour l'affichage
- [ ] Vérifier tous les hardcoded et les remplacer

#### 2. Implémenter Actions Utilisateurs
- [ ] `suspendUser(userId, reason)` - Suspendre avec raison
- [ ] `reactivateUser(userId)` - Réactiver utilisateur
- [ ] `deleteUser(userId)` - Supprimer avec confirmation
- [ ] `changeUserRole(userId, newRole)` - Changer rôle
- [ ] `sendEmailToUser(userId, template)` - Envoyer email
- [ ] Log toutes les actions dans `admin_actions`

#### 3. Améliorer render Functions Existants
- [ ] `renderUsers()` - Ajouter recherche, filtres, actions fonctionnelles
- [ ] `renderProperties()` - Ajouter édition, suppression, featured
- [ ] `renderTransactions()` - Ajouter filtres date, export
- [ ] `renderReports()` - Ajouter workflow complet (approve/reject/delete)
- [ ] `renderSupport()` - Créer système tickets complet
- [ ] `renderAudit()` - Charger logs depuis DB

---

### 🆕 PHASE 2: NOUVELLES PAGES (À faire)

#### 4. Page Notifications (renderNotifications)
```javascript
const renderNotifications = () => {
  // État
  const [notifications, setNotifications] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  
  // Charger notifications
  useEffect(() => {
    loadNotifications();
  }, []);
  
  const loadNotifications = async () => {
    const { data } = await supabase
      .from('admin_notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);
    setNotifications(data);
  };
  
  // Actions
  const markAsRead = async (notificationId) => {
    await supabase
      .from('admin_notifications')
      .update({ read: true })
      .eq('id', notificationId);
    loadNotifications();
  };
  
  // UI
  return (
    <div>
      <h2>Centre de Notifications</h2>
      <div>Filtres: Tout | Nouveau | Lu</div>
      <div>
        {notifications.map(notif => (
          <Card key={notif.id}>
            <Badge>{notif.type}</Badge>
            <h3>{notif.title}</h3>
            <p>{notif.message}</p>
            <Button onClick={() => markAsRead(notif.id)}>
              Marquer comme lu
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
};
```

**Tables Supabase nécessaires**:
```sql
CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id),
  type TEXT, -- 'new_user', 'new_property', 'new_report', 'new_ticket'
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### 5. Page Analytics (renderAnalytics)
```javascript
const renderAnalytics = () => {
  const [chartData, setChartData] = useState({
    userGrowth: [],
    revenueGrowth: [],
    topProperties: []
  });
  
  useEffect(() => {
    loadAnalytics();
  }, []);
  
  const loadAnalytics = async () => {
    // Charger données des 12 derniers mois
    const { data: users } = await supabase
      .from('profiles')
      .select('created_at')
      .gte('created_at', getLast12MonthsDate());
    
    const { data: transactions } = await supabase
      .from('blockchain_transactions')
      .select('amount, created_at')
      .gte('created_at', getLast12MonthsDate());
    
    // Grouper par mois
    const usersByMonth = groupByMonth(users);
    const revenueByMonth = groupRevenueByMonth(transactions);
    
    setChartData({
      userGrowth: usersByMonth,
      revenueGrowth: revenueByMonth
    });
  };
  
  return (
    <div>
      <h2>Analytics Avancées</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <h3>Croissance Utilisateurs</h3>
          {/* Chart.js ou Recharts */}
          <LineChart data={chartData.userGrowth} />
        </Card>
        <Card>
          <h3>Évolution Revenus</h3>
          <BarChart data={chartData.revenueGrowth} />
        </Card>
      </div>
      
      <Card>
        <h3>Top Propriétés</h3>
        <table>
          {/* Top 10 propriétés par vues/transactions */}
        </table>
      </Card>
      
      <Card>
        <h3>Prévisions IA</h3>
        <p>Revenus prévus mois prochain: XX FCFA</p>
        <p>Nouveaux utilisateurs attendus: XX</p>
      </Card>
    </div>
  );
};
```

**Bibliothèques à installer**:
```bash
npm install recharts
# OU
npm install chart.js react-chartjs-2
```

#### 6. Page Settings (renderSettings)
```javascript
const renderSettings = () => {
  const [settings, setSettings] = useState({
    platformName: 'Teranga Foncier',
    commissionRate: 5,
    maintenanceMode: false,
    emailNotifications: true,
    autoApproval: false,
    maxUploadSize: 10
  });
  
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    const { data } = await supabase
      .from('platform_settings')
      .select('*')
      .single();
    if (data) setSettings(data);
  };
  
  const saveSettings = async () => {
    setLoading(true);
    try {
      await supabase
        .from('platform_settings')
        .upsert(settings);
      
      // Log action
      await logAdminAction('settings_updated', null, 'settings', settings);
      
      toast.success('Paramètres sauvegardés');
    } catch (error) {
      toast.error('Erreur sauvegarde');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <h2>Paramètres Plateforme</h2>
      
      <Card>
        <h3>Général</h3>
        <Input
          label="Nom de la plateforme"
          value={settings.platformName}
          onChange={(e) => setSettings({...settings, platformName: e.target.value})}
        />
        
        <Input
          type="number"
          label="Taux de commission (%)"
          value={settings.commissionRate}
          onChange={(e) => setSettings({...settings, commissionRate: e.target.value})}
        />
      </Card>
      
      <Card>
        <h3>Mode Maintenance</h3>
        <Switch
          checked={settings.maintenanceMode}
          onCheckedChange={(checked) => setSettings({...settings, maintenanceMode: checked})}
        />
        <p>Activer le mode maintenance (seuls les admins peuvent accéder)</p>
      </Card>
      
      <Card>
        <h3>Notifications Email</h3>
        <Switch
          checked={settings.emailNotifications}
          onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
        />
      </Card>
      
      <Card>
        <h3>Validation Automatique</h3>
        <Switch
          checked={settings.autoApproval}
          onCheckedChange={(checked) => setSettings({...settings, autoApproval: checked})}
        />
        <p className="text-sm text-gray-600">
          Approuver automatiquement les propriétés d'utilisateurs vérifiés
        </p>
      </Card>
      
      <Button onClick={saveSettings} disabled={loading}>
        {loading ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
      </Button>
    </div>
  );
};
```

**Table Supabase**:
```sql
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_name TEXT DEFAULT 'Teranga Foncier',
  commission_rate DECIMAL DEFAULT 5.0,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  auto_approval BOOLEAN DEFAULT FALSE,
  max_upload_size INTEGER DEFAULT 10,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);
```

#### 7. Page Content Management (renderContent)
```javascript
const renderContent = () => {
  const [activeContentTab, setActiveContentTab] = useState('blog');
  const [blogPosts, setBlogPosts] = useState([]);
  const [showEditor, setShowEditor] = useState(false);
  const [currentPost, setCurrentPost] = useState(null);
  
  useEffect(() => {
    loadBlogPosts();
  }, []);
  
  const loadBlogPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .order('created_at', { ascending: false });
    setBlogPosts(data || []);
  };
  
  const createPost = () => {
    setCurrentPost({
      title: '',
      content: '',
      excerpt: '',
      featured_image: '',
      status: 'draft',
      author_id: user.id
    });
    setShowEditor(true);
  };
  
  const savePost = async (post) => {
    if (post.id) {
      await supabase
        .from('blog_posts')
        .update(post)
        .eq('id', post.id);
    } else {
      await supabase
        .from('blog_posts')
        .insert(post);
    }
    loadBlogPosts();
    setShowEditor(false);
  };
  
  const deletePost = async (postId) => {
    if (confirm('Supprimer ce post ?')) {
      await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);
      loadBlogPosts();
    }
  };
  
  const publishPost = async (postId) => {
    await supabase
      .from('blog_posts')
      .update({ status: 'published', published_at: new Date() })
      .eq('id', postId);
    loadBlogPosts();
    toast.success('Post publié');
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2>Gestion Contenu</h2>
        <Button onClick={createPost}>
          <Plus className="mr-2" />
          Nouveau Post
        </Button>
      </div>
      
      {/* Tabs: Blog, Pages, FAQ */}
      <div className="tabs">
        <button onClick={() => setActiveContentTab('blog')}>Blog</button>
        <button onClick={() => setActiveContentTab('pages')}>Pages</button>
        <button onClick={() => setActiveContentTab('faq')}>FAQ</button>
      </div>
      
      {activeContentTab === 'blog' && (
        <div className="grid gap-4">
          {blogPosts.map(post => (
            <Card key={post.id}>
              <div className="flex justify-between">
                <div>
                  <h3>{post.title}</h3>
                  <p className="text-sm text-gray-600">{post.excerpt}</p>
                  <Badge>{post.status}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => {
                    setCurrentPost(post);
                    setShowEditor(true);
                  }}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  {post.status === 'draft' && (
                    <Button size="sm" onClick={() => publishPost(post.id)}>
                      Publier
                    </Button>
                  )}
                  <Button size="sm" variant="destructive" onClick={() => deletePost(post.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
      
      {showEditor && (
        <BlogEditor
          post={currentPost}
          onSave={savePost}
          onCancel={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};
```

**Table Supabase**:
```sql
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft', -- 'draft', 'published', 'archived'
  author_id UUID REFERENCES profiles(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 8. Page Commissions (renderCommissions)
```javascript
const renderCommissions = () => {
  const [commissions, setCommissions] = useState([]);
  const [totalCommissions, setTotalCommissions] = useState(0);
  const [pendingPayments, setPendingPayments] = useState(0);
  
  useEffect(() => {
    loadCommissions();
  }, []);
  
  const loadCommissions = async () => {
    // Charger toutes les transactions avec commissions
    const { data: transactions } = await supabase
      .from('blockchain_transactions')
      .select(`
        *,
        properties (
          id,
          title,
          price,
          owner:profiles!properties_owner_id_fkey (
            id,
            name,
            email
          )
        )
      `)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });
    
    // Calculer commissions
    const commissionsData = transactions.map(t => ({
      id: t.id,
      date: t.created_at,
      property: t.properties?.title,
      owner: t.properties?.owner?.name,
      amount: parseFloat(t.amount),
      commission: parseFloat(t.amount) * 0.05, // 5%
      status: t.commission_paid ? 'paid' : 'pending'
    }));
    
    setCommissions(commissionsData);
    setTotalCommissions(commissionsData.reduce((sum, c) => sum + c.commission, 0));
    setPendingPayments(commissionsData.filter(c => c.status === 'pending').length);
  };
  
  const markAsPaid = async (transactionId) => {
    await supabase
      .from('blockchain_transactions')
      .update({ commission_paid: true, commission_paid_at: new Date() })
      .eq('id', transactionId);
    
    toast.success('Commission marquée comme payée');
    loadCommissions();
  };
  
  return (
    <div>
      <h2>Gestion des Commissions</h2>
      
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <h3>Total Commissions</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalCommissions)}</p>
        </Card>
        <Card>
          <h3>Paiements en attente</h3>
          <p className="text-3xl font-bold text-orange-600">{pendingPayments}</p>
        </Card>
        <Card>
          <h3>Taux Commission</h3>
          <p className="text-3xl font-bold">5%</p>
        </Card>
      </div>
      
      <Card>
        <table className="w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>Propriété</th>
              <th>Propriétaire</th>
              <th>Montant Transaction</th>
              <th>Commission</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {commissions.map(comm => (
              <tr key={comm.id}>
                <td>{new Date(comm.date).toLocaleDateString('fr-FR')}</td>
                <td>{comm.property}</td>
                <td>{comm.owner}</td>
                <td>{formatCurrency(comm.amount)}</td>
                <td className="font-bold">{formatCurrency(comm.commission)}</td>
                <td>
                  <Badge className={comm.status === 'paid' ? 'bg-green-500' : 'bg-orange-500'}>
                    {comm.status === 'paid' ? 'Payé' : 'En attente'}
                  </Badge>
                </td>
                <td>
                  {comm.status === 'pending' && (
                    <Button size="sm" onClick={() => markAsPaid(comm.id)}>
                      Marquer payé
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      
      <Button onClick={() => exportToCSV(commissions, 'commissions')}>
        <Download className="mr-2" />
        Exporter CSV
      </Button>
    </div>
  );
};
```

---

### 🔧 PHASE 3: UTILITAIRES ET HELPERS

#### Fonctions Utilitaires Manquantes
```javascript
// Couleur selon statut
const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-500',
    inactive: 'bg-gray-400',
    suspended: 'bg-red-500',
    pending: 'bg-orange-500',
    verified: 'bg-blue-500',
    rejected: 'bg-red-600'
  };
  return colors[status] || 'bg-gray-400';
};

// Format monnaie
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF', // Franc CFA
    minimumFractionDigits: 0
  }).format(amount);
};

// Log action admin
const logAdminAction = async (actionType, targetId, targetType, details) => {
  try {
    await supabase.from('admin_actions').insert({
      admin_id: user.id,
      action_type: actionType,
      target_id: targetId,
      target_type: targetType,
      details: details,
      ip_address: await getClientIP(),
      created_at: new Date()
    });
  } catch (error) {
    console.error('Erreur log action:', error);
  }
};

// Export CSV
const exportToCSV = (data, filename) => {
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map(row => Object.values(row).join(',')).join('\n');
  const csv = `${headers}\n${rows}`;
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString()}.csv`;
  a.click();
};

// Grouper par mois (pour analytics)
const groupByMonth = (data) => {
  const grouped = {};
  data.forEach(item => {
    const month = new Date(item.created_at).toLocaleDateString('fr-FR', { year: 'numeric', month: 'short' });
    grouped[month] = (grouped[month] || 0) + 1;
  });
  return Object.entries(grouped).map(([month, count]) => ({ month, count }));
};

// Calculer nouveaux utilisateurs ce mois
const calculateNewUsersThisMonth = (users) => {
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  return users.filter(u => new Date(u.created_at) >= startOfMonth).length;
};

// Calculer taux d'engagement
const calculateEngagementRate = (users, transactions) => {
  const activeUsers = users.filter(u => 
    transactions.some(t => t.user_id === u.id)
  ).length;
  return users.length > 0 ? Math.round((activeUsers / users.length) * 100) : 0;
};
```

#### Actions Utilisateurs
```javascript
// Suspendre utilisateur
const suspendUser = async (userId, reason) => {
  try {
    await supabase
      .from('profiles')
      .update({ 
        status: 'suspended', 
        suspended_at: new Date(),
        suspension_reason: reason
      })
      .eq('id', userId);
    
    // Log action
    await logAdminAction('user_suspended', userId, 'user', { reason });
    
    // Envoyer email notification
    await sendEmail(userId, 'account_suspended', { reason });
    
    toast.success('Utilisateur suspendu');
    loadRealData();
  } catch (error) {
    toast.error('Erreur suspension');
  }
};

// Réactiver utilisateur
const reactivateUser = async (userId) => {
  try {
    await supabase
      .from('profiles')
      .update({ 
        status: 'active', 
        suspended_at: null,
        suspension_reason: null
      })
      .eq('id', userId);
    
    await logAdminAction('user_reactivated', userId, 'user', {});
    await sendEmail(userId, 'account_reactivated', {});
    
    toast.success('Utilisateur réactivé');
    loadRealData();
  } catch (error) {
    toast.error('Erreur réactivation');
  }
};

// Changer rôle
const changeUserRole = async (userId, newRole) => {
  try {
    await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId);
    
    await logAdminAction('user_role_changed', userId, 'user', { newRole });
    
    toast.success(`Rôle changé: ${newRole}`);
    loadRealData();
  } catch (error) {
    toast.error('Erreur changement rôle');
  }
};

// Supprimer utilisateur
const deleteUser = async (userId) => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.')) {
    return;
  }
  
  try {
    // Supprimer d'abord toutes les données liées
    await supabase.from('properties').delete().eq('owner_id', userId);
    await supabase.from('user_subscriptions').delete().eq('user_id', userId);
    
    // Puis supprimer le profil
    await supabase.from('profiles').delete().eq('id', userId);
    
    await logAdminAction('user_deleted', userId, 'user', {});
    
    toast.success('Utilisateur supprimé');
    loadRealData();
  } catch (error) {
    toast.error('Erreur suppression');
  }
};
```

---

### 📊 PHASE 4: MISE À JOUR NAVIGATION

#### Ajouter Nouvelles Pages au Menu
```javascript
const navigationItems = [
  // ... pages existantes
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Centre de notifications',
    badge: dashboardData.stats.notifications > 0 ? dashboardData.stats.notifications.toString() : null,
    badgeColor: 'bg-blue-500',
    isInternal: true
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'Analytics avancées',
    isInternal: true
  },
  {
    id: 'content',
    label: 'Contenu',
    icon: FileText,
    description: 'Gestion blog et pages',
    badge: dashboardData.stats.totalBlogs > 0 ? dashboardData.stats.totalBlogs.toString() : null,
    badgeColor: 'bg-purple-500',
    isInternal: true
  },
  {
    id: 'commissions',
    label: 'Commissions',
    icon: DollarSign,
    description: 'Gestion commissions',
    badge: dashboardData.stats.pendingPayments > 0 ? dashboardData.stats.pendingPayments.toString() : null,
    badgeColor: 'bg-yellow-500',
    isInternal: true
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: Settings,
    description: 'Configuration plateforme',
    isInternal: true
  }
];
```

#### Mise à Jour renderContent()
```javascript
const renderContent = () => {
  switch (activeTab) {
    case 'overview':
      return <ModernAdminOverview ... />;
    case 'validation':
      return renderPropertyValidation();
    case 'users':
      return renderUsers();
    case 'properties':
      return renderProperties();
    case 'transactions':
      return renderTransactions();
    case 'subscriptions':
      return renderSubscriptions();
    case 'financial':
      return renderFinancial();
    case 'reports':
      return renderReports();
    case 'support':
      return renderSupport();
    case 'audit':
      return renderAudit();
    case 'system':
      return renderSystem();
    // NOUVELLES PAGES
    case 'notifications':
      return renderNotifications();
    case 'analytics':
      return renderAnalytics();
    case 'content':
      return renderContent();
    case 'commissions':
      return renderCommissions();
    case 'settings':
      return renderSettings();
    default:
      return <div>Page non trouvée</div>;
  }
};
```

---

## 🗃️ TABLES SUPABASE À CRÉER

### Migration SQL Complète
```sql
-- 1. Admin Actions (Log toutes actions)
CREATE TABLE admin_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_id UUID,
  target_type TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_date ON admin_actions(created_at DESC);

-- 2. Support Tickets
CREATE TABLE support_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open', -- 'open', 'in_progress', 'closed'
  priority TEXT DEFAULT 'normal', -- 'urgent', 'normal', 'low'
  category TEXT,
  assigned_to UUID REFERENCES profiles(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  closed_at TIMESTAMP
);

CREATE TABLE ticket_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ticket_id UUID REFERENCES support_tickets(id) ON DELETE CASCADE,
  author_id UUID REFERENCES profiles(id),
  message TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Admin Notifications
CREATE TABLE admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Blog Posts
CREATE TABLE blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  featured_image TEXT,
  status TEXT DEFAULT 'draft',
  author_id UUID REFERENCES profiles(id),
  published_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Platform Settings
CREATE TABLE platform_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform_name TEXT DEFAULT 'Teranga Foncier',
  commission_rate DECIMAL DEFAULT 5.0,
  maintenance_mode BOOLEAN DEFAULT FALSE,
  email_notifications BOOLEAN DEFAULT TRUE,
  auto_approval BOOLEAN DEFAULT FALSE,
  max_upload_size INTEGER DEFAULT 10,
  updated_at TIMESTAMP DEFAULT NOW(),
  updated_by UUID REFERENCES profiles(id)
);

-- 6. Report Actions
CREATE TABLE report_actions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  report_id UUID,
  property_id UUID REFERENCES properties(id),
  admin_id UUID REFERENCES profiles(id),
  action TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ajouter colonnes manquantes à blockchain_transactions
ALTER TABLE blockchain_transactions ADD COLUMN IF NOT EXISTS commission_paid BOOLEAN DEFAULT FALSE;
ALTER TABLE blockchain_transactions ADD COLUMN IF NOT EXISTS commission_paid_at TIMESTAMP;

-- Ajouter colonnes manquantes à profiles
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspended_at TIMESTAMP;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS suspension_reason TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_login TIMESTAMP;
```

---

## ✅ CHECKLIST FINALE

### Tests Essentiels
- [ ] Dashboard charge toutes les données réelles
- [ ] Aucune donnée mockée visible
- [ ] Toutes les pages accessibles
- [ ] Tous les boutons fonctionnels
- [ ] Recherche fonctionne
- [ ] Filtres fonctionnent
- [ ] Export CSV fonctionne
- [ ] Actions utilisateurs (suspend, delete, role) fonctionnent
- [ ] Système tickets opérationnel
- [ ] Notifications en temps réel
- [ ] Logs admin enregistrés
- [ ] Pas d'erreurs console

### Performance
- [ ] Temps de chargement < 2s
- [ ] Pas de freeze UI
- [ ] Pagination sur grandes listes
- [ ] Optimisation requêtes Supabase
- [ ] Caching intelligent

### Sécurité
- [ ] Vérifier role admin avant actions
- [ ] Confirmer actions destructives
- [ ] Log toutes actions sensibles
- [ ] Protéger endpoints API
- [ ] Validation côté serveur

---

*Document d'implémentation - À utiliser comme guide de développement*
