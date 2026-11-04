import React, { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toast } from 'sonner';
import { 
  // Navigation Icons
  Home,
  Users,
  Building2,
  DollarSign,
  BarChart3,
  Flag,
  Settings,
  Bell,
  LogOut,
  User,
  
  // Content Icons
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  PieChart,
  Globe,
  Eye,
  Edit,
  Trash2,
  Plus,
  Download,
  Filter,
  Search,
  UserCheck,
  UserX,
  Crown,
  FileText,
  MessageSquare,
  Activity,
  Target,
  Zap,
  Database,
  Server,
  Wifi,
  HardDrive,
  Cpu,
  MemoryStick,
  Monitor,
  Lock,
  Unlock,
  Mail,
  BookOpen,
  
  // UI Icons
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { exportToCSV, formatCurrency, logAdminAction } from './adminUtils';
import { logger } from '@/lib/logger';

/** Section « Commissions » du tableau de bord administrateur. */
const AdminCommissionsSection = ({ dashboardData, user }) => {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCommissions();
  }, [filter]);

  const loadCommissions = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blockchain_transactions')
        .select('*')
        .eq('status', 'completed')
        .order('created_at', { ascending: false }).limit(500);

      if (filter === 'pending') {
        query = query.eq('commission_paid', false);
      } else if (filter === 'paid') {
        query = query.eq('commission_paid', true);
      }

      const { data, error } = await query;
      if (error) throw error;

      const commissionsData = data?.map(t => ({
        id: t.id,
        date: t.created_at,
        property: t.properties?.title || 'N/A',
        owner: t.properties?.owner?.name || 'N/A',
        ownerEmail: t.properties?.owner?.email || 'N/A',
        amount: parseFloat(t.amount || 0),
        commission: parseFloat(t.amount || 0) * (dashboardData.stats.totalCommissions / dashboardData.stats.monthlyRevenue || 0.05),
        status: t.commission_paid ? 'paid' : 'pending'
      })) || [];

      setCommissions(commissionsData);
    } catch (error) {
      logger.error('Erreur chargement commissions:', error);
      toast.error('Erreur chargement');
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async (transactionId) => {
    try {
      await supabase
        .from('blockchain_transactions')
        .update({ 
          commission_paid: true, 
          commission_paid_at: new Date().toISOString() 
        })
        .eq('id', transactionId);

      await logAdminAction(user?.id, 'commission_paid', transactionId, 'transaction', {});
      toast.success('Commission marquée comme payée');
      loadCommissions();
    } catch (error) {
      toast.error('Erreur');
    }
  };

  const totalCommissions = commissions.reduce((sum, c) => sum + c.commission, 0);
  const pendingPayments = commissions.filter(c => c.status === 'pending').length;
  const totalPaid = commissions.filter(c => c.status === 'paid').reduce((sum, c) => sum + c.commission, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestion des Commissions</h2>
        <div className="flex space-x-2">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="all">Toutes</option>
            <option value="pending">En attente</option>
            <option value="paid">Payées</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => exportToCSV(commissions, 'commissions')}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Total Commissions</p>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(totalCommissions)}</p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Paiements en attente</p>
                <p className="text-2xl font-bold text-orange-600">{pendingPayments}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Commissions Payées</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalPaid)}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propriété</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propriétaire</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commission</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {commissions.map((comm) => (
                    <tr key={comm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {new Date(comm.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-sm">{comm.property}</td>
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <p className="font-medium">{comm.owner}</p>
                          <p className="text-xs text-gray-500">{comm.ownerEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {formatCurrency(comm.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        {formatCurrency(comm.commission)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={comm.status === 'paid' ? 'bg-green-500' : 'bg-orange-500'}>
                          {comm.status === 'paid' ? 'Payé' : 'En attente'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {comm.status === 'pending' && (
                          <Button 
                            size="sm"
                            onClick={() => markAsPaid(comm.id)}
                          >
                            Marquer payé
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
      )}
    </div>
  );
};

export default AdminCommissionsSection;
