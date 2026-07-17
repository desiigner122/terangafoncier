import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Users,
  TrendingUp,
  Target,
  Loader2,
  AlertCircle,
  Download,
  RefreshCw,
} from 'lucide-react';
import ContactForm from '@/components/CRM/ContactForm';
import ContactList from '@/components/CRM/ContactList';
import ContactDetailsModal from '@/components/CRM/ContactDetailsModal';
import DealForm from '@/components/CRM/DealForm';
import KanbanBoard from '@/components/CRM/KanbanBoard';
import StatsCard from '@/components/CRM/StatsCard';
import ActivityTimeline from '@/components/CRM/ActivityTimeline';
import CRMBuyerIntegrationService from '@/services/CRMBuyerIntegrationService';
import VendeurSupabaseService from '@/services/VendeurSupabaseService';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

// Normalize a real crm_contacts row for the (unmodified) CRM widgets.
// Only real columns exist: id, owner_id, name, email, phone, company,
// status, temperature, score, created_at, updated_at.
const normalizeContact = (c) => ({
  ...c,
  name: c.name || '',
  email: c.email || '',
  status: c.status || 'prospect',
  score: c.score ?? 0,
});

// Normalize a real crm_deals row. Real columns: id, contact_id, owner_id,
// title, amount, stage, created_at. The Kanban card UI (out of scope for
// this pass) still expects `value`, `probability` and `expected_close_date`
// props that have no backing column in the real schema — we alias `value`
// to the real `amount`, and use an honest "—" / null placeholder for the
// two fields that cannot be sourced from real data instead of inventing
// numbers.
const normalizeDeal = (d) => ({
  ...d,
  value: d.amount ?? 0,
  stage: d.stage || 'Prospection',
  probability: '—',
  expected_close_date: null,
});

// Normalize a real crm_activities row. Real columns: id, contact_id,
// owner_id, type, prospect, action, created_at. The timeline UI expects
// `title`/`description` — map them to the closest real fields instead of
// leaving fabricated text.
const normalizeActivity = (a) => ({
  ...a,
  title: a.prospect || null,
  description: a.action || null,
});

const CRMPageNew = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Modals state
  const [showContactForm, setShowContactForm] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showDealForm, setShowDealForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [importing, setImporting] = useState(false);

  // Real CRM data (Supabase) — scoped to the current user via owner_id
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [activities, setActivities] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const clearError = () => setError(null);

  const fetchAll = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    setError(null);
    try {
      const [contactsRes, dealsRes, activitiesRes, tasksRes] = await Promise.all([
        VendeurSupabaseService.getCrmContacts(user.id),
        VendeurSupabaseService.getCrmDeals(user.id),
        VendeurSupabaseService.getCrmActivities(user.id, 50),
        VendeurSupabaseService.getCrmTasks(user.id),
      ]);

      if (contactsRes.success) {
        setContacts((contactsRes.data || []).map(normalizeContact));
      } else {
        setError(contactsRes.error || 'Erreur de chargement des contacts');
      }

      if (dealsRes.success) {
        setDeals((dealsRes.data || []).map(normalizeDeal));
      } else if (!contactsRes.error) {
        setError(dealsRes.error || 'Erreur de chargement des offres');
      }

      if (activitiesRes.success) {
        setActivities((activitiesRes.data || []).map(normalizeActivity));
      }

      if (tasksRes.success) {
        setTasks(tasksRes.data || []);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  // Load initial data
  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Handle contact form save — direct Supabase write using only real
  // crm_contacts columns (name, email, phone, company, status, score).
  // Fields collected by ContactForm that have no real column (role,
  // location, interests, notes, tags, source) are intentionally dropped
  // rather than sent to a non-existent column.
  const handleSaveContact = async (formData, contactId) => {
    if (!user?.id) return;
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        status: formData.status || 'prospect',
        score: formData.score ?? 0,
      };

      if (contactId) {
        const { error: updateErr } = await supabase
          .from('crm_contacts')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', contactId)
          .eq('owner_id', user.id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('crm_contacts')
          .insert({ ...payload, owner_id: user.id });
        if (insertErr) throw insertErr;
      }
      setShowContactForm(false);
      setSelectedContact(null);
      await fetchAll();
    } catch (err) {
      console.error('Error saving contact:', err);
      setError(err.message);
    }
  };

  // Handle deal form save — direct Supabase write using only real
  // crm_deals columns (title, contact_id, amount, stage). `value` from
  // DealForm is mapped to the real `amount` column; probability,
  // expected_close_date, description and notes have no real column and
  // are intentionally dropped.
  const handleSaveDeal = async (formData, dealId) => {
    if (!user?.id) return;
    try {
      const payload = {
        title: formData.title,
        contact_id: formData.contact_id || null,
        amount: formData.value ?? 0,
        stage: formData.stage || 'Prospection',
      };

      if (dealId) {
        const { error: updateErr } = await supabase
          .from('crm_deals')
          .update(payload)
          .eq('id', dealId)
          .eq('owner_id', user.id);
        if (updateErr) throw updateErr;
      } else {
        const { error: insertErr } = await supabase
          .from('crm_deals')
          .insert({ ...payload, owner_id: user.id });
        if (insertErr) throw insertErr;
      }
      setShowDealForm(false);
      setSelectedDeal(null);
      await fetchAll();
    } catch (err) {
      console.error('Error saving deal:', err);
      setError(err.message);
    }
  };

  // Delete a contact (owner-scoped since RLS does not filter by owner_id)
  const deleteContact = async (contactId) => {
    if (!user?.id) return;
    try {
      const { error: deleteErr } = await supabase
        .from('crm_contacts')
        .delete()
        .eq('id', contactId)
        .eq('owner_id', user.id);
      if (deleteErr) throw deleteErr;
      setContacts((prev) => prev.filter((c) => c.id !== contactId));
    } catch (err) {
      console.error('Error deleting contact:', err);
      setError(err.message);
    }
  };

  // Move a deal to a new pipeline stage (Kanban drag & drop)
  const moveDeal = async (dealId, newStage) => {
    if (!user?.id) return;
    try {
      const { error: moveErr } = await supabase
        .from('crm_deals')
        .update({ stage: newStage })
        .eq('id', dealId)
        .eq('owner_id', user.id);
      if (moveErr) throw moveErr;
      setDeals((prev) =>
        prev.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d))
      );
    } catch (err) {
      console.error('Error moving deal:', err);
      setError(err.message);
    }
  };

  // Delete a deal (owner-scoped since RLS does not filter by owner_id)
  const deleteDeal = async (dealId) => {
    if (!user?.id) return;
    try {
      const { error: deleteErr } = await supabase
        .from('crm_deals')
        .delete()
        .eq('id', dealId)
        .eq('owner_id', user.id);
      if (deleteErr) throw deleteErr;
      setDeals((prev) => prev.filter((d) => d.id !== dealId));
    } catch (err) {
      console.error('Error deleting deal:', err);
      setError(err.message);
    }
  };

  // Handle open contact form
  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setShowContactForm(true);
  };

  const handleAddContact = () => {
    setSelectedContact(null);
    setShowContactForm(true);
  };

  // Handle view contact details
  const handleViewContact = (id) => {
    const contact = contacts.find((c) => c.id === id);
    if (contact) {
      setSelectedContact(contact);
      setShowContactDetails(true);
    }
  };

  // Handle open deal form
  const handleEditDeal = (deal) => {
    setSelectedDeal(deal);
    setShowDealForm(true);
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setShowDealForm(true);
  };

  // Handle import buyers
  const handleImportBuyers = async () => {
    if (!user?.id) return;
    try {
      setImporting(true);
      const result = await CRMBuyerIntegrationService.syncBuyersFromPlatform(user.id);
      alert(`✅ ${result?.created || 0} acheteur(s) créé(s), ${result?.updated || 0} mis à jour`);
      await fetchAll();
    } catch (error) {
      console.error('Import error:', error);
      alert('❌ Erreur lors de l\'import: ' + (error.message || 'Unknown error'));
    } finally {
      setImporting(false);
    }
  };

  // Build contacts map for activity timeline
  const contactsMap = {};
  contacts.forEach((contact) => {
    contactsMap[contact.id] = contact;
  });

  // Calculate pipeline total (deal.value is aliased from the real `amount` column)
  const pipelineTotal = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  // Average deal size
  const avgDealSize = deals.length > 0 ? pipelineTotal / deals.length : 0;

  // Tasks due today — sourced from the real crm_tasks table (due_date),
  // not from a fabricated activity field.
  const todayStr = new Date().toDateString();
  const tasksDueToday = tasks.filter(
    (t) => t.due_date && new Date(t.due_date).toDateString() === todayStr
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord CRM</h1>
              <p className="text-gray-600 mt-1">
                Gérez vos contacts, offres et activités
              </p>
            </div>
            <button
              onClick={handleImportBuyers}
              disabled={importing}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {importing ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  En cours d'import...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Importer les acheteurs
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-red-800 font-medium">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800 font-medium"
            >
              Fermer
            </button>
          </div>
        )}

        {/* Tabs Navigation */}
        <div className="mb-6 flex gap-2 border-b border-gray-200">
          {[
            { id: 'overview', label: 'Aperçu', icon: BarChart3 },
            { id: 'contacts', label: 'Contacts', icon: Users },
            { id: 'deals', label: 'Offres', icon: TrendingUp },
            { id: 'activities', label: 'Activités', icon: Target },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-3 font-medium border-b-2 transition-colors ${
                activeTab === id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading && activeTab === 'overview' ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Chargement des données CRM...</span>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatsCard
                    label="Contacts Total"
                    value={contacts.length}
                    icon={Users}
                    bgColor="bg-blue-50"
                    iconColor="text-blue-600"
                  />
                  <StatsCard
                    label="Leads"
                    value={contacts.filter((c) => c.status === 'lead').length}
                    icon={Target}
                    bgColor="bg-yellow-50"
                    iconColor="text-yellow-600"
                  />
                  <StatsCard
                    label="Valeur du Pipeline"
                    value={`${(pipelineTotal / 1000000).toFixed(1)}M`}
                    icon={TrendingUp}
                    bgColor="bg-green-50"
                    iconColor="text-green-600"
                  />
                  <StatsCard
                    label="Taille Moyenne Offre"
                    value={`${(avgDealSize / 1000000).toFixed(1)}M`}
                    icon={BarChart3}
                    bgColor="bg-purple-50"
                    iconColor="text-purple-600"
                  />
                </div>

                {/* Recent Activity */}
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">
                    Activités Récentes
                  </h2>
                  <ActivityTimeline
                    activities={activities.slice(0, 5)}
                    contacts={contactsMap}
                    isLoading={loading}
                  />
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Offres Actives
                    </h3>
                    <p className="text-3xl font-bold text-blue-600">
                      {deals.length}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {deals.filter((d) => d.stage !== 'Fermeture').length}{' '}
                      toujours en pipeline
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Taux de Clients
                    </h3>
                    <p className="text-3xl font-bold text-green-600">
                      {contacts.length > 0
                        ? Math.round(
                            (contacts.filter((c) => c.status === 'client')
                              .length /
                              contacts.length) *
                              100
                          )
                        : 0}
                      %
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {contacts.filter((c) => c.status === 'client').length} de{' '}
                      {contacts.length} contacts
                    </p>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Tâches Aujourd'hui
                    </h3>
                    <p className="text-3xl font-bold text-orange-600">
                      {tasksDueToday}
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      {tasks.length} tâche(s) au total
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Contacts Tab */}
            {activeTab === 'contacts' && (
              <ContactList
                contacts={contacts}
                isLoading={loading}
                onAdd={handleAddContact}
                onEdit={handleEditContact}
                onDelete={deleteContact}
                onView={handleViewContact}
              />
            )}

            {/* Deals Tab */}
            {activeTab === 'deals' && (
              <KanbanBoard
                deals={deals}
                contacts={contacts}
                isLoading={loading}
                onAddDeal={handleAddDeal}
                onEditDeal={handleEditDeal}
                onMoveDeal={moveDeal}
                onDeleteDeal={deleteDeal}
              />
            )}

            {/* Activities Tab */}
            {activeTab === 'activities' && (
              <ActivityTimeline
                activities={activities}
                contacts={contactsMap}
                isLoading={loading}
                filter="all"
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <ContactForm
        isOpen={showContactForm}
        onClose={() => {
          setShowContactForm(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
        onSave={handleSaveContact}
        isLoading={loading}
      />

      <ContactDetailsModal
        isOpen={showContactDetails}
        onClose={() => {
          setShowContactDetails(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
      />

      <DealForm
        isOpen={showDealForm}
        onClose={() => {
          setShowDealForm(false);
          setSelectedDeal(null);
        }}
        deal={selectedDeal}
        contacts={contacts}
        onSave={handleSaveDeal}
        isLoading={loading}
      />
    </div>
  );
};

// Export CRMPageModernNew as alias for CRMPageNew with improved modal
const CRMPageModernNew = CRMPageNew;

export default CRMPageNew;
export { CRMPageModernNew };
