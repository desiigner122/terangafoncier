import React, { useState, useEffect } from 'react';
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
import { useCRM } from '@/hooks/useCRM';

const CRMPageNew = () => {
  const [activeTab, setActiveTab] = useState('overview');

  // Modals state
  const [showContactForm, setShowContactForm] = useState(false);
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [showDealForm, setShowDealForm] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedDeal, setSelectedDeal] = useState(null);
  const [importing, setImporting] = useState(false);

  // CRM Hook
  const {
    contacts,
    deals,
    activities,
    stats,
    loading,
    error,
    fetchContacts,
    addContact,
    updateContact,
    deleteContact,
    fetchDeals,
    addDeal,
    updateDeal,
    moveDeal,
    deleteDeal,
    fetchActivities,
    fetchStats,
    clearError,
  } = useCRM();

  // Load initial data
  useEffect(() => {
    fetchContacts();
    fetchDeals();
    fetchActivities();
    fetchStats();
  }, []);

  // Handle contact form save
  const handleSaveContact = async (formData, contactId) => {
    try {
      if (contactId) {
        await updateContact(contactId, formData);
      } else {
        await addContact(formData);
      }
      setShowContactForm(false);
      setSelectedContact(null);
      await fetchContacts();
    } catch (err) {
      console.error('Error saving contact:', err);
    }
  };

  // Handle deal form save
  const handleSaveDeal = async (formData, dealId) => {
    try {
      if (dealId) {
        await updateDeal(dealId, formData);
      } else {
        await addDeal(formData);
      }
      setShowDealForm(false);
      setSelectedDeal(null);
      await fetchDeals();
    } catch (err) {
      console.error('Error saving deal:', err);
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
    try {
      setImporting(true);
      const result = await CRMBuyerIntegrationService.syncBuyersFromPlatform();
      alert(`✅ ${result?.created || 0} acheteur(s) créé(s), ${result?.updated || 0} mis à jour`);
      await fetchContacts();
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

  // Calculate pipeline total
  const pipelineTotal = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);

  // Average deal size
  const avgDealSize = deals.length > 0 ? pipelineTotal / deals.length : 0;

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
                      {
                        activities.filter(
                          (a) =>
                            a.type === 'task' &&
                            new Date(a.scheduled_date).toDateString() ===
                              new Date().toDateString()
                        ).length
                      }
                    </p>
                    <p className="text-sm text-gray-600 mt-2">
                      activités planifiées
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
