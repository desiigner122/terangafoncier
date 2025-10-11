// Composant de test simple pour AdminLeadsList sans appels Supabase
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const AdminLeadsListTest = () => {
  const [leads] = useState([
    {
      id: '1',
      payload: {
        name: 'Jean Dupont',
        email: 'jean@test.com',
        message: 'Intéressé par une villa à Dakar',
        phone: '+221 77 123 45 67'
      },
      status: 'new',
      source: 'contact_form',
      created_at: new Date().toISOString()
    },
    {
      id: '2', 
      payload: {
        name: 'Marie Martin',
        email: 'marie@test.com',
        message: 'Question sur les prix des appartements',
        phone: '+221 76 987 65 43'
      },
      status: 'contacted',
      source: 'contact_form',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new': return 'bg-blue-500';
      case 'contacted': return 'bg-yellow-500';
      case 'converted': return 'bg-green-500';
      case 'lost': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Leads Marketing (Test)</h1>
          <p className="text-gray-500 mt-1">Données de test - Sidebar intégrée</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{leads.length}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Nouveaux</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">
              {leads.filter(l => l.status === 'new').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Contactés</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-yellow-600">
              {leads.filter(l => l.status === 'contacted').length}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Convertis</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {leads.filter(l => l.status === 'converted').length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {leads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{lead.payload.name}</h3>
                      <Badge className={`${getStatusColor(lead.status)} text-white`}>
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      📧 {lead.payload.email}
                    </p>
                    {lead.payload.phone && (
                      <p className="text-sm text-gray-600 mb-2">
                        📱 {lead.payload.phone}
                      </p>
                    )}
                    <p className="text-sm text-gray-700">
                      {lead.payload.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(lead.created_at).toLocaleDateString('fr-FR')} à {new Date(lead.created_at).toLocaleTimeString('fr-FR')}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Contacter
                    </Button>
                    <Button size="sm">
                      Voir détails
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Sidebar Integration */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <p className="text-green-800 font-medium">
              ✅ Sidebar intégrée - Plus de double sidebar !
            </p>
          </div>
          <p className="text-green-700 text-sm mt-2">
            Cette page utilise maintenant le système outlet de CompleteSidebarAdminDashboard
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLeadsListTest;