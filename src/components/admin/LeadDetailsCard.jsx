import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Mail,
  Phone,
  User,
  MapPin,
  MessageSquare,
  Tag,
  AlertCircle,
  Calendar,
  Globe
} from 'lucide-react';

const LeadDetailsCard = ({ lead }) => {
  if (!lead) return null;

  // Mapper urgency levels
  const urgencyColors = {
    low: 'bg-green-100 text-green-800',
    normal: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800'
  };

  const urgencyLabels = {
    low: 'Basse - 48h',
    normal: 'Normale - 24h',
    high: 'Élevée - 4h',
    urgent: 'Urgente - Immédiate'
  };

  // Mapper category
  const categoryIcons = {
    blockchain: '🔗',
    investment: '💰',
    diaspora: '🌍',
    construction: '🏗️',
    technical: '🛠️',
    partnership: '🤝',
    other: '📝'
  };

  const categoryLabels = {
    blockchain: 'Blockchain/NFT',
    investment: 'Opportunités Investissement',
    diaspora: 'Services Diaspora',
    construction: 'Suivi Construction',
    technical: 'Support Technique',
    partnership: 'Partenariats',
    other: 'Autre'
  };

  return (
    <div className="space-y-4">
      {/* Contact Info */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
          <CardTitle className="text-lg">Informations de Contact</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="flex items-start gap-3">
              <User className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">NOM COMPLET</p>
                <p className="text-sm font-medium text-gray-900">{lead.full_name || 'N/A'}</p>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">EMAIL</p>
                <p className="text-sm font-medium text-gray-900">
                  <a href={`mailto:${lead.email}`} className="text-blue-600 hover:underline">
                    {lead.email || 'N/A'}
                  </a>
                </p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-blue-600 mt-1" />
              <div>
                <p className="text-xs text-gray-500 font-semibold">TÉLÉPHONE</p>
                <p className="text-sm font-medium text-gray-900">
                  <a href={`tel:${lead.phone}`} className="text-blue-600 hover:underline">
                    {lead.phone || 'N/A'}
                  </a>
                </p>
              </div>
            </div>

            {/* Company */}
            {lead.company && (
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 text-blue-600 mt-1" />
                <div>
                  <p className="text-xs text-gray-500 font-semibold">ENTREPRISE</p>
                  <p className="text-sm font-medium text-gray-900">{lead.company}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Request Details */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
          <CardTitle className="text-lg">Détails de la Demande</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-2">SUJET</p>
            <p className="text-sm font-medium text-gray-900 bg-gray-50 p-3 rounded">
              {lead.subject || 'N/A'}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500 font-semibold mb-2">MESSAGE</p>
            <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded whitespace-pre-wrap">
              {lead.message || 'N/A'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2">CATÉGORIE</p>
              {lead.category ? (
                <Badge className="bg-purple-100 text-purple-800 border-0 py-2 px-3">
                  <span className="mr-2">{categoryIcons[lead.category] || '📝'}</span>
                  {categoryLabels[lead.category] || lead.category}
                </Badge>
              ) : (
                <p className="text-sm text-gray-500">Non spécifiée</p>
              )}
            </div>

            {/* Urgency */}
            <div>
              <p className="text-xs text-gray-500 font-semibold mb-2">URGENCE</p>
              <Badge className={`${urgencyColors[lead.urgency] || 'bg-gray-100 text-gray-800'} border-0 py-2 px-3`}>
                <AlertCircle className="h-4 w-4 mr-2" />
                {urgencyLabels[lead.urgency] || lead.urgency}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="border-0 shadow-md">
        <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
          <CardTitle className="text-lg">Informations Supplémentaires</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-gray-500 font-semibold">SOURCE</p>
              <p className="text-gray-900 capitalize">{lead.source || 'N/A'}</p>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold">STATUT</p>
              <Badge className="bg-blue-100 text-blue-800 border-0">
                {lead.status || 'N/A'}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold">PRIORITÉ</p>
              <Badge className="bg-amber-100 text-amber-800 border-0">
                {lead.priority || 'N/A'}
              </Badge>
            </div>

            <div>
              <p className="text-xs text-gray-500 font-semibold">CRÉÉ LE</p>
              <p className="text-gray-900">
                {lead.created_at ? new Date(lead.created_at).toLocaleDateString('fr-FR') : 'N/A'}
              </p>
            </div>

            {lead.property_interest && (
              <div>
                <p className="text-xs text-gray-500 font-semibold">INTÉRÊT PROPRIÉTÉ</p>
                <p className="text-gray-900">{lead.property_interest}</p>
              </div>
            )}

            {lead.budget_range && (
              <div>
                <p className="text-xs text-gray-500 font-semibold">BUDGET</p>
                <p className="text-gray-900">{lead.budget_range}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      {lead.notes && (
        <Card className="border-0 shadow-md">
          <CardHeader className="bg-yellow-50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Notes Internes
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-900 bg-yellow-50 p-3 rounded whitespace-pre-wrap">
              {lead.notes}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeadDetailsCard;
