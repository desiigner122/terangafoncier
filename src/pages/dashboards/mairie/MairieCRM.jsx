import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  Activity,
  FileText,
  Home,
  UserCheck,
  Loader2
} from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/UnifiedAuthContext';

const MairieCRM = ({ dashboardStats }) => {
  const { user } = useAuth();
  const ownerId = user?.id;

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Chargement des contacts réels depuis crm_contacts (owner_id = mairie connectée)
  useEffect(() => {
    if (!ownerId) return;
    let active = true;

    const load = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('crm_contacts')
          .select('id, name, email, phone, company, status, created_at')
          .eq('owner_id', ownerId)
          .order('created_at', { ascending: false });

        if (!active) return;
        if (error) {
          console.error('Erreur chargement crm_contacts:', error);
          setContacts([]);
        } else {
          setContacts(data || []);
        }
      } catch (err) {
        if (active) {
          console.error('Erreur chargement crm_contacts:', err);
          setContacts([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [ownerId]);

  // Statistiques dérivées des vraies données
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const crmStats = {
    totalContacts: contacts.length,
    activeContacts: contacts.filter((c) => (c.status || '').toLowerCase() === 'active').length,
    prospects: contacts.filter((c) => (c.status || '').toLowerCase() === 'prospect').length,
    newThisMonth: contacts.filter((c) => {
      if (!c.created_at) return false;
      const d = new Date(c.created_at);
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
    }).length
  };

  // Filtrage des contacts (recherche + statut réel)
  const filteredContacts = contacts.filter((contact) => {
    const name = (contact.name || '').toLowerCase();
    const email = (contact.email || '').toLowerCase();
    const company = (contact.company || '').toLowerCase();
    const term = searchTerm.toLowerCase();
    const matchesSearch = name.includes(term) || email.includes(term) || company.includes(term);
    const matchesFilter =
      filterStatus === 'all' || (contact.status || '').toLowerCase() === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status) => {
    switch ((status || '').toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'prospect': return 'bg-blue-100 text-blue-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const ContactCard = ({ contact, onClick }) => {
    const Icon = contact.company ? Building2 : Home;

    return (
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="cursor-pointer"
        onClick={() => onClick(contact)}
      >
        <Card className="h-full hover:shadow-lg transition-all duration-300 border-l-4 border-l-teal-500">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-teal-100 p-2 rounded-lg">
                  <Icon className="h-5 w-5 text-teal-600" />
                </div>
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {contact.name || 'Sans nom'}
                  </CardTitle>
                  {contact.company && (
                    <CardDescription className="mt-1">
                      {contact.company}
                    </CardDescription>
                  )}
                </div>
              </div>
              <Badge className={`text-xs ${getStatusColor(contact.status)}`}>
                {contact.status || '—'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="space-y-3">
              {contact.email && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{contact.email}</span>
                </div>
              )}

              {contact.phone && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="h-4 w-4" />
                  <span>{contact.phone}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t">
                <span className="text-xs text-gray-500">
                  {contact.created_at
                    ? `Ajouté le ${new Date(contact.created_at).toLocaleDateString('fr-FR')}`
                    : '—'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header avec statistiques CRM (dérivées des vraies données) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Total Contacts</p>
                  <p className="text-2xl font-bold text-blue-900">
                    {loading ? '—' : crmStats.totalContacts}
                  </p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Contacts Actifs</p>
                  <p className="text-2xl font-bold text-green-900">
                    {loading ? '—' : crmStats.activeContacts}
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Prospects</p>
                  <p className="text-2xl font-bold text-purple-900">
                    {loading ? '—' : crmStats.prospects}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Nouveaux ce mois</p>
                  <p className="text-2xl font-bold text-orange-900">
                    {loading ? '—' : crmStats.newThisMonth}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-teal-600" />
            <span>Gestion des Relations Communales</span>
          </CardTitle>
          <CardDescription>
            Gérez les relations avec citoyens, entreprises et administrés
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Rechercher un contact..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex space-x-2">
              <Button
                variant={filterStatus === 'all' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('all')}
                size="sm"
              >
                Tous
              </Button>
              <Button
                variant={filterStatus === 'active' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('active')}
                size="sm"
              >
                Actifs
              </Button>
              <Button
                variant={filterStatus === 'prospect' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('prospect')}
                size="sm"
              >
                Prospects
              </Button>
              <Button
                variant={filterStatus === 'inactive' ? 'default' : 'outline'}
                onClick={() => setFilterStatus('inactive')}
                size="sm"
              >
                Inactifs
              </Button>
            </div>
          </div>

          {/* Liste des contacts */}
          {loading ? (
            <div className="flex items-center justify-center py-12 text-gray-500">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              <span>Chargement des contacts...</span>
            </div>
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                layout
              >
                {filteredContacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onClick={setSelectedContact}
                  />
                ))}
              </motion.div>

              {filteredContacts.length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    {contacts.length === 0
                      ? 'Aucun contact enregistré pour le moment'
                      : 'Aucun contact ne correspond à votre recherche'}
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-teal-50 to-teal-100">
            <CardContent className="p-6 text-center">
              <Plus className="h-8 w-8 text-teal-600 mx-auto mb-3" />
              <h3 className="font-semibold text-teal-900 mb-2">Nouveau Contact</h3>
              <p className="text-sm text-teal-700">Ajouter un citoyen, entreprise ou association</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-6 text-center">
              <FileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-blue-900 mb-2">Rapport CRM</h3>
              <p className="text-sm text-blue-700">Générer rapport d'activité mensuel</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-purple-900 mb-2">Planifier Réunion</h3>
              <p className="text-sm text-purple-700">Organiser rencontre avec parties prenantes</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default MairieCRM;
