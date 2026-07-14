import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, Link, Database, Hash, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabaseClient';

const BlockchainWidget = ({ type = 'overview' }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    const loadBlockchainData = async () => {
      setLoading(true);
      try {
        const { data: txs, error: txError } = await supabase
          .from('blockchain_transactions')
          .select('id, transaction_hash, status, block_number, created_at, properties(title, name, location, city)')
          .order('created_at', { ascending: false })
          .limit(5);

        if (txError) throw txError;

        const { count: certCount, error: certError } = await supabase
          .from('blockchain_certificates')
          .select('id', { count: 'exact', head: true });

        if (certError) throw certError;

        const maxBlock = (txs || []).reduce(
          (max, t) => (t.block_number && t.block_number > max ? t.block_number : max),
          0
        );

        setData({
          blockHeight: maxBlock,
          activeNodes: certCount || 0,
          transactions: (txs || []).map((t) => ({
            id: t.id,
            hash: t.transaction_hash,
            type: 'PROPERTY_TRANSACTION',
            property: {
              title: t.properties?.title || t.properties?.name || 'Propriété',
              location: t.properties?.location || t.properties?.city || ''
            },
            status: t.status
          }))
        });
      } catch (error) {
        console.error('Erreur chargement données blockchain:', error);
        setData({ blockHeight: 0, activeNodes: 0, transactions: [] });
      } finally {
        setLoading(false);
      }
    };

    loadBlockchainData();
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
            <div className="text-xs text-gray-500">Certificats émis</div>
          </div>
        </div>
        {data?.transactions?.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            Aucune transaction blockchain enregistrée
          </p>
        )}
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
