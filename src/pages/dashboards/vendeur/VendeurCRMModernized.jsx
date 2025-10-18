/**
 * VENDEUR CRM MODERNISÉ - VERSION COMPLÈTE
 * Gestion complète des prospects avec pipeline, interactions et analytics
 * Corrigé avec bonnes colonnes Supabase
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, UserPlus, Phone, Mail, MapPin, Calendar, DollarSign,
  TrendingUp, Star, Search, Eye, Edit, Clock, CheckCircle,
  Target, Award, Activity, FileText, Filter, MoreVertical,
  MessageSquare, Video, Send, Brain, Sparkles, Zap, Shield,
  Plus, X, ChevronDown, ChevronUp, AlertCircle, Loader
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'react-hot-toast';

const VendeurCRMModernized = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('pipeline'); // pipeline, contacts, interactions
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showInteractionDialog, setShowInteractionDialog] = useState(false);
  const [interactions, setInteractions] = useState([]);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    hot: 0,
    warm: 0,
    cold: 0,
    converted: 0,
    avgScore: 0,
    conversionRate: 0,
    totalValue: 0
  });

  useEffect(() => {
    if (user) {
      loadCRMData();
    }
  }, [user]);

  useEffect(() => {
    filterContacts();
  }, [contacts, searchTerm, statusFilter]);

  const loadCRMData = async () => {
    try {
      setLoading(true);

      // Charger les contacts
      const { data: contactsData, error: contactsError } = await supabase
        .from('crm_contacts')
        .select('*')
        .eq('user_id', user.id)
        .order('score', { ascending: false });

      if (contactsError) throw contactsError;

      setContacts(contactsData || []);
      console.log('✅ Contacts chargés:', contactsData?.length);

      // Charger les activités
      if (contactsData && contactsData.length > 0) {
        const contactIds = contactsData.map(c => c.id);
        const { data: interactionsData } = await supabase
          .from('crm_activities')
          .select('*')
          .in('contact_id', contactIds)
          .order('created_at', { ascending: false });

        setInteractions(interactionsData || []);
      }

      // Calculer les stats
      const total = contactsData?.length || 0;
      const hot = contactsData?.filter(c => c.status === 'hot').length || 0;
      const warm = contactsData?.filter(c => c.status === 'warm').length || 0;
      const cold = contactsData?.filter(c => c.status === 'cold').length || 0;
      const converted = contactsData?.filter(c => c.status === 'converted').length || 0;
      const avgScore = total > 0 ? Math.round(contactsData.reduce((sum, c) => sum + (c.score || 0), 0) / total) : 0;
      const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;
      const totalValue = contactsData?.reduce((sum, c) => sum + ((c.budget_max || 0) + (c.budget_min || 0)) / 2, 0) || 0;

      setStats({
        total,
        hot,
        warm,
        cold,
        converted,
        avgScore,
        conversionRate,
        totalValue
      });

    } catch (error) {
      console.error('❌ Erreur CRM:', error);
      toast.error('Erreur lors du chargement du CRM');
    } finally {
      setLoading(false);
    }
  };

  const filterContacts = () => {
    let filtered = [...contacts];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(c =>
        (c.first_name?.toLowerCase().includes(search)) ||
        (c.last_name?.toLowerCase().includes(search)) ||
        (c.email?.toLowerCase().includes(search)) ||
        (c.company?.toLowerCase().includes(search))
      );
    }

    setFilteredContacts(filtered);
  };

  const handleAddContact = async (formData) => {
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .insert([{
          user_id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          company: formData.company,
          status: 'new',
          score: 50,
          priority: 'medium',
          source: formData.source || 'website',
          notes: formData.notes
        }]);

      if (error) throw error;

      toast.success('Contact ajouté avec succès');
      loadCRMData();
      setShowAddDialog(false);
    } catch (error) {
      console.error('Erreur ajout contact:', error);
      toast.error('Erreur lors de l\'ajout');
    }
  };

  const handleUpdateStatus = async (contactId, newStatus) => {
    try {
      const { error } = await supabase
        .from('crm_contacts')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', contactId);

      if (error) throw error;

      toast.success('Statut mis à jour');
      loadCRMData();
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleAddInteraction = async (contactId, type, content) => {
    try {
      const { error } = await supabase
        .from('crm_activities')
        .insert([{
          contact_id: contactId,
          user_id: user.id,
          type: type,
          title: content,
          description: content,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      toast.success('Interaction enregistrée');
      loadCRMData();
      setShowInteractionDialog(false);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'enregistrement');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      hot: 'bg-red-100 text-red-800',
      warm: 'bg-yellow-100 text-yellow-800',
      cold: 'bg-gray-100 text-gray-800',
      new: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      lost: 'bg-slate-100 text-slate-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      urgent: 'border-l-4 border-l-red-500 bg-red-50',
      high: 'border-l-4 border-l-orange-500 bg-orange-50',
      medium: 'border-l-4 border-l-yellow-500 bg-yellow-50',
      low: 'border-l-4 border-l-green-500 bg-green-50'
    };
    return colors[priority] || 'border-l-4 border-l-gray-500 bg-gray-50';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader className="w-12 h-12 animate-spin mx-auto mb-4 text-orange-600" />
          <p className="text-gray-600">Chargement du CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">CRM Vendeur</h1>
          <p className="text-gray-600 mt-2">Gestion complète de vos prospects et clients</p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-orange-600 hover:bg-orange-700">
              <UserPlus className="w-4 h-4" />
              Nouveau Contact
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Ajouter un nouveau contact</DialogTitle>
            </DialogHeader>
            <AddContactForm onSubmit={handleAddContact} onClose={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Contacts</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hot (Chauds)</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{stats.hot}</p>
              </div>
              <Target className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Conversion</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{stats.conversionRate}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Score Moyen</p>
                <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.avgScore}</p>
              </div>
              <Award className="w-8 h-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {['pipeline', 'contacts', 'interactions'].map(tab => (
          <Button
            key={tab}
            variant={activeTab === tab ? 'default' : 'outline'}
            onClick={() => setActiveTab(tab)}
            className={activeTab === tab ? 'bg-orange-600 hover:bg-orange-700' : ''}
          >
            {tab === 'pipeline' ? '📊 Pipeline' : tab === 'contacts' ? '👥 Contacts' : '💬 Interactions'}
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="flex-1">
          <Input
            placeholder="Rechercher un contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="new">Nouveau</SelectItem>
            <SelectItem value="hot">Chaud</SelectItem>
            <SelectItem value="warm">Tiède</SelectItem>
            <SelectItem value="cold">Froid</SelectItem>
            <SelectItem value="converted">Converti</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Content by Tab */}
      {activeTab === 'pipeline' && <PipelineView contacts={filteredContacts} onStatusChange={handleUpdateStatus} getStatusColor={getStatusColor} />}
      {activeTab === 'contacts' && <ContactsListView contacts={filteredContacts} onSelectContact={setSelectedContact} getStatusColor={getStatusColor} getPriorityColor={getPriorityColor} />}
      {activeTab === 'interactions' && <InteractionsView interactions={interactions} contacts={contacts} />}

      {/* Contact Details Sidebar */}
      {selectedContact && (
        <ContactDetailsSidebar
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onStatusChange={handleUpdateStatus}
          onAddInteraction={handleAddInteraction}
          getStatusColor={getStatusColor}
        />
      )}
    </div>
  );
};

// Composants auxiliaires
const AddContactForm = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    source: 'website',
    notes: ''
  });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Prénom</Label>
          <Input
            value={formData.firstName}
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
          />
        </div>
        <div>
          <Label>Nom</Label>
          <Input
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
          />
        </div>
      </div>
      <div>
        <Label>Email</Label>
        <Input
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>
      <div>
        <Label>Téléphone</Label>
        <Input
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <div>
        <Label>Entreprise</Label>
        <Input
          value={formData.company}
          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
        />
      </div>
      <div>
        <Label>Source</Label>
        <Select value={formData.source} onValueChange={(value) => setFormData({ ...formData, source: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="website">Site Web</SelectItem>
            <SelectItem value="phone">Téléphone</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="referral">Recommandation</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Notes</Label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Ajouter des notes..."
        />
      </div>
      <div className="flex gap-2 justify-end pt-4">
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={() => onSubmit(formData)} className="bg-orange-600 hover:bg-orange-700">
          Ajouter
        </Button>
      </div>
    </div>
  );
};

const PipelineView = ({ contacts, onStatusChange, getStatusColor }) => {
  const stages = ['new', 'contacted', 'hot', 'warm', 'cold', 'negotiating', 'converted', 'lost'];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
      {stages.map(stage => {
        const stageContacts = contacts.filter(c => c.status === stage);
        return (
          <Card key={stage} className="min-h-96">
            <CardHeader className="pb-2">
              <p className="text-sm font-semibold text-gray-600 capitalize">{stage}</p>
              <p className="text-2xl font-bold text-gray-900">{stageContacts.length}</p>
            </CardHeader>
            <CardContent className="space-y-2">
              {stageContacts.map(contact => (
                <div key={contact.id} className={`p-2 rounded-lg text-xs ${getStatusColor(stage)}`}>
                  <p className="font-semibold">{contact.first_name} {contact.last_name}</p>
                  <p className="opacity-75">{contact.score}/100</p>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const ContactsListView = ({ contacts, onSelectContact, getStatusColor, getPriorityColor }) => {
  return (
    <div className="space-y-3">
      {contacts.map(contact => (
        <motion.div
          key={contact.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg cursor-pointer transition-all hover:shadow-md ${getPriorityColor(contact.priority || 'medium')}`}
          onClick={() => onSelectContact(contact)}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold text-gray-900">{contact.first_name} {contact.last_name}</p>
              <p className="text-sm text-gray-600">{contact.company}</p>
              <div className="flex gap-2 mt-2">
                {contact.email && <a href={`mailto:${contact.email}`} className="text-xs text-blue-600 hover:underline">{contact.email}</a>}
                {contact.phone && <a href={`tel:${contact.phone}`} className="text-xs text-blue-600 hover:underline">{contact.phone}</a>}
              </div>
            </div>
            <div className="text-right">
              <Badge className={getStatusColor(contact.status)}>
                {contact.status}
              </Badge>
              <p className="text-xs text-gray-600 mt-1">{contact.score || 0}/100</p>
            </div>
          </div>
        </motion.div>
      ))}
      {contacts.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Aucun contact trouvé</p>
        </div>
      )}
    </div>
  );
};

const InteractionsView = ({ interactions, contacts }) => {
  const contactsMap = Object.fromEntries(contacts.map(c => [c.id, c]));

  return (
    <div className="space-y-3">
      {interactions.slice(0, 20).map(interaction => {
        const contact = contactsMap[interaction.contact_id];
        return (
          <Card key={interaction.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{contact?.first_name} {contact?.last_name}</p>
                  <p className="text-sm text-gray-600 capitalize">{interaction.interaction_type}</p>
                  <p className="text-sm text-gray-700 mt-2">{interaction.content}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(interaction.created_at).toLocaleString('fr-FR')}</p>
                </div>
                <Badge variant="outline">{interaction.interaction_type}</Badge>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

const ContactDetailsSidebar = ({ contact, onClose, onStatusChange, onAddInteraction, getStatusColor }) => {
  const [interactionType, setInteractionType] = useState('note');
  const [interactionContent, setInteractionContent] = useState('');

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 100 }}
      className="fixed right-0 top-0 h-screen w-96 bg-white shadow-lg z-50 overflow-y-auto"
    >
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">{contact.first_name} {contact.last_name}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-gray-600">Statut</Label>
          <Select value={contact.status} onValueChange={(value) => onStatusChange(contact.id, value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">Nouveau</SelectItem>
              <SelectItem value="hot">Chaud</SelectItem>
              <SelectItem value="warm">Tiède</SelectItem>
              <SelectItem value="cold">Froid</SelectItem>
              <SelectItem value="converted">Converti</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Informations</Label>
          {contact.email && <div className="text-sm"><p className="text-gray-600">Email:</p><p className="text-gray-900">{contact.email}</p></div>}
          {contact.phone && <div className="text-sm"><p className="text-gray-600">Téléphone:</p><p className="text-gray-900">{contact.phone}</p></div>}
          {contact.company && <div className="text-sm"><p className="text-gray-600">Entreprise:</p><p className="text-gray-900">{contact.company}</p></div>}
        </div>

        <div className="space-y-2">
          <Label>Ajouter une interaction</Label>
          <Select value={interactionType} onValueChange={setInteractionType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="call">Appel</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="meeting">Réunion</SelectItem>
              <SelectItem value="note">Note</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            placeholder="Description..."
            value={interactionContent}
            onChange={(e) => setInteractionContent(e.target.value)}
          />
          <Button
            onClick={() => {
              onAddInteraction(contact.id, interactionType, interactionContent);
              setInteractionContent('');
            }}
            className="w-full bg-orange-600 hover:bg-orange-700"
          >
            Enregistrer
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default VendeurCRMModernized;
