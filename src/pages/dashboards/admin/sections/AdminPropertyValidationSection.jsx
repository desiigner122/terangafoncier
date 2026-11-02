import React, { useState, useEffect, Suspense } from 'react';
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

/** Section « PropertyValidation » du tableau de bord administrateur. */
const AdminPropertyValidationSection = ({ realProperties, propertiesLoading, approveProperty, rejectProperty, deleteProperty, refetchProperties, refetchStats }) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // ⭐ UTILISE realProperties du hook - filtre les propriétés en attente
  const pendingProperties = realProperties?.filter(p => p.verification_status === 'pending') || [];

  const handleApprove = async (propertyId) => {
    await approveProperty(propertyId);
    refetchProperties();
    refetchStats(); // Refresh dashboard stats
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.error('Veuillez saisir une raison');
      return;
    }

    await rejectProperty(selectedProperty.id, rejectionReason);
    setShowRejectModal(false);
    setRejectionReason('');
    setSelectedProperty(null);
    refetchProperties();
    refetchStats(); // Refresh dashboard stats
  };

  const handleDelete = async (propertyId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?')) {
      await deleteProperty(propertyId);
      refetchProperties();
      refetchStats();
    }
  };

  if (propertiesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des propriétés...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Validation des Propriétés</h2>
          <p className="text-muted-foreground">
            {pendingProperties.length} propriété{pendingProperties.length > 1 ? 's' : ''} en attente d'approbation
          </p>
        </div>
        <Button onClick={refetchProperties} variant="outline">
          <Activity className="h-4 w-4 mr-2" />
          Actualiser
        </Button>
      </div>

      {pendingProperties.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Aucune propriété en attente</h3>
            <p className="text-muted-foreground">
              Toutes les propriétés ont été traitées.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {pendingProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden">
              <div className="md:flex">
                {/* Image */}
                <div className="md:w-64 h-48 md:h-auto relative bg-gray-100">
                  {property.images && property.images.length > 0 ? (
                    <img 
                      src={property.images[0]} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="h-16 w-16 text-gray-300" />
                    </div>
                  )}
                </div>

                {/* Détails */}
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold mb-2">{property.title}</h3>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {property.location || 'Aucune localisation'}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <Badge variant="outline">{property.type || 'Type non défini'}</Badge>
                        <span className="text-2xl font-bold text-primary">
                          {property.price ? `${property.price.toLocaleString()} FCFA` : 'Prix non défini'}
                        </span>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(property.created_at).toLocaleDateString('fr-FR')}
                    </Badge>
                  </div>

                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {property.description || 'Aucune description'}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(property.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approuver
                    </Button>
                    <Button
                      onClick={() => {
                        setSelectedProperty(property);
                        setShowRejectModal(true);
                      }}
                      variant="destructive"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Rejeter
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => handleDelete(property.id)}
                      className="text-red-600 border-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Supprimer
                    </Button>
                    <Button variant="outline" asChild>
                      <a href={`/properties/${property.id}`} target="_blank" rel="noopener noreferrer">
                        <Eye className="h-4 w-4 mr-2" />
                        Voir détails
                      </a>
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal de rejet */}
      {showRejectModal && selectedProperty && (
        <Dialog open={showRejectModal} onOpenChange={setShowRejectModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejeter la propriété</DialogTitle>
              <DialogDescription>
                Indiquez la raison du rejet de "{selectedProperty.title}"
              </DialogDescription>
            </DialogHeader>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Raison du rejet..."
              rows={4}
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowRejectModal(false)}>
                Annuler
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleReject}
                disabled={actionLoading || !rejectionReason.trim()}
              >
                Confirmer le rejet
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminPropertyValidationSection;
