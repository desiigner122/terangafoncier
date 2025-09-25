import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, Send } from 'lucide-react';

const VendeurMessages = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Gérez vos conversations avec les clients</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Système de messagerie
            </h3>
            <p className="text-gray-600">
              Module de messagerie bientôt disponible
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendeurMessages;