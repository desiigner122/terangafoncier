import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Image } from 'lucide-react';

const VendeurPhotos = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestion des Photos</h1>
        <p className="text-gray-600 mt-1">Gérez les photos de vos propriétés</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Camera className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Module de gestion des photos
            </h3>
            <p className="text-gray-600">
              Cette fonctionnalité sera bientôt disponible
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendeurPhotos;