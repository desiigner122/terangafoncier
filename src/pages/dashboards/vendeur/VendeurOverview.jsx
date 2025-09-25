import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Building, Users, MessageSquare } from 'lucide-react';

const VendeurOverview = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Vue d'ensemble</h1>
        <p className="text-gray-600 mt-1">Tableau de bord principal de votre activité</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Biens</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
              <Building className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vues Total</p>
                <p className="text-2xl font-bold text-green-600">3,247</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Visiteurs</p>
                <p className="text-2xl font-bold text-purple-600">1,892</p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-orange-600">24</p>
              </div>
              <MessageSquare className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendeurOverview;