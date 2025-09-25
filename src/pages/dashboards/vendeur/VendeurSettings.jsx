import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, User, Bell } from 'lucide-react';

const VendeurSettings = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="text-gray-600 mt-1">Configurez votre compte et vos préférences</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Paramètres du compte
            </h3>
            <p className="text-gray-600">
              Interface de paramètres en développement
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendeurSettings;