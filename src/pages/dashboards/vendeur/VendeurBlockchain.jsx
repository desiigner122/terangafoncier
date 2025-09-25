import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Network, Shield, Bitcoin } from 'lucide-react';

const VendeurBlockchain = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Blockchain & NFT</h1>
        <p className="text-gray-600 mt-1">Gestion des actifs numériques et tokenisation</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="text-center py-12">
            <Network className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Module Blockchain
            </h3>
            <p className="text-gray-600">
              Fonctionnalités blockchain et NFT en développement
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VendeurBlockchain;