import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Link, Database, Hash, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BlockchainWidget = ({ type = 'overview' }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData({
        blockHeight: 245678,
        activeNodes: 127,
        transactions: [
          {
            id: 'tx_001',
            hash: '0xprop123abc',
            type: 'PROPERTY_REGISTRATION',
            property: { title: 'Villa Almadies', location: 'Dakar' },
            status: 'confirmed'
          }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>Connexion blockchain...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-600" />
          TerangaChain Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-xl font-bold">{data?.blockHeight}</div>
            <div className="text-xs text-gray-500">Blocs</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">{data?.activeNodes}</div>
            <div className="text-xs text-gray-500">Nœuds</div>
          </div>
        </div>
        {data?.transactions?.map(tx => (
          <div key={tx.id} className="border rounded p-3 mb-2">
            <div className="flex justify-between items-center">
              <div>
                <div className="font-medium">{tx.property.title}</div>
                <div className="text-sm text-gray-600">{tx.property.location}</div>
              </div>
              <Badge className="bg-green-100 text-green-800">
                {tx.status}
              </Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default BlockchainWidget;
