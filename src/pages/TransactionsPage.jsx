
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
// useToast import supprimÃ© - utilisation window.safeGlobalToast
import { 
  Receipt, 
  Download, 
  Filter, 
  Banknote
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/SupabaseAuthContext';
import { LoadingSpinner } from '@/components/ui/spinner';
import { supabase } from '@/lib/supabaseClient';

const formatPrice = (price) => new Intl.NumberFormat('fr-SN', { style: 'currency', currency: 'XOF' }).format(price);

const getStatusBadge = (status) => {
  switch (status) {
    case 'paid': return <Badge variant="success">Payé</Badge>;
    case 'pending': return <Badge variant="warning">En attente</Badge>;
    case 'failed': return <Badge variant="destructive">Échoué</Badge>;
    default: return <Badge variant="secondary">{status}</Badge>;
  }
};

const TransactionsPage = () => {
  // toast remplacÃ© par window.safeGlobalToast
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
        if (!user) return;
        setLoading(true);
        const { data, error } = await supabase
            .from('transactions')
            .select('*, requests(parcels(id, name))')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });
        
        if (error) {
            console.error("Error fetching transactions:", error);
            window.safeGlobalToast({ title: "Erreur", description: "Impossible de charger vos transactions.", variant: "destructive" });
        } else {
            setTransactions(data);
        }
        setLoading(false);
    };
    fetchTransactions();
  }, [user, toast]);

  const handlePayment = (transactionId) => {
    navigate(`/payment/${transactionId}`);
  };

  const handleDownloadInvoice = (transactionId) => {
    window.safeGlobalToast({
      title: "Téléchargement de la facture...",
      description: `La facture pour la transaction ${transactionId} est en cours de génération.`,
    });
  };

  if (loading) {
    return <div className="flex items-center justify-center h-full"><LoadingSpinner size="large" /></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-8 px-4"
    >
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center"><Receipt className="mr-2 h-8 w-8"/>Mes Transactions</h1>
          <p className="text-muted-foreground">Consultez l'historique de vos paiements et factures.</p>
        </div>
        <Button variant="outline">
          <Filter className="mr-2 h-4 w-4"/> Filtrer les transactions
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historique des paiements</CardTitle>
          <CardDescription>Retrouvez ici toutes les transactions effectuées sur la plateforme.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Date</th>
                  <th className="text-left py-3 px-4 font-semibold">Description</th>
                  <th className="text-left py-3 px-4 font-semibold">Montant</th>
                  <th className="text-left py-3 px-4 font-semibold">Statut</th>
                  <th className="text-right py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => (
                  <tr key={tx.id} className="border-b hover:bg-muted/30">
                    <td className="py-4 px-4 text-sm">{new Date(tx.created_at).toLocaleDateString('fr-FR')}</td>
                    <td className="py-4 px-4">
                      <p className="font-medium">{tx.description}</p>
                      {tx.requests?.parcels?.id && <Link to={`/parcelles/${tx.requests.parcels.id}`} className="text-xs text-primary hover:underline">Voir la parcelle</Link>}
                    </td>
                    <td className="py-4 px-4 font-mono text-sm">{formatPrice(tx.amount)}</td>
                    <td className="py-4 px-4">{getStatusBadge(tx.status)}</td>
                    <td className="py-4 px-4 text-right space-x-2">
                      {tx.status === 'pending' && (
                        <Button size="sm" onClick={() => handlePayment(tx.id)}>
                          <Banknote className="mr-2 h-4 w-4"/> Payer maintenant
                        </Button>
                      )}
                      {tx.status === 'paid' && (
                        <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(tx.id)}>
                          <Download className="mr-2 h-4 w-4"/> Facture
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TransactionsPage;

