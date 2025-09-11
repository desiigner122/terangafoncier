import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  DollarSign, 
  Building2, 
  Settings, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Hammer, 
  Calculator, 
  Users, 
  Clock, 
  AlertCircle, 
  TrendingUp, 
  Eye
} from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const RemoteConstructionFeesManager = () => {
  const [fees, setFees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFeeDialog, setShowFeeDialog] = useState(false);
  const [editingFee, setEditingFee] = useState(null);
  const [newFee, setNewFee] = useState({
    fee_type: '',
    construction_type: 'all',
    fee_structure: {},
    description: '',
    applicable_regions: ['all'],
    min_budget: '',
    max_budget: ''
  });

  useEffect(() => {
    loadFeesAndProjects();
  }, []);

  const loadFeesAndProjects = async () => {
    try {
      // Charger les frais existants
      const { data: feesData, error: feesError } = await supabase
        .from('remote_construction_fees')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (feesError) throw feesError;
      setFees(feesData || []);

      // Charger les projets de construction à distance
      const { data: projectsData, error: projectsError } = await supabase
        .from('remote_construction_projects')
        .select(`
          *,
          client:client_id(first_name, last_name, email),
          promoteur:promoteur_id(first_name, last_name, company_name)
        `)
        .order('created_at', { ascending: false });

      if (projectsError) throw projectsError;
      setProjects(projectsData || []);

    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFee = async () => {
    try {
      const feeData = {
        ...newFee,
        fee_structure: JSON.stringify(newFee.fee_structure),
        applicable_regions: JSON.stringify(newFee.applicable_regions),
        min_budget: newFee.min_budget ? parseInt(newFee.min_budget) : null,
        max_budget: newFee.max_budget ? parseInt(newFee.max_budget) : null
      };

      if (editingFee) {
        // Mise à jour
        const { error } = await supabase
          .from('remote_construction_fees')
          .update(feeData)
          .eq('id', editingFee.id);
        
        if (error) throw error;
      } else {
        // Création
        const { error } = await supabase
          .from('remote_construction_fees')
          .insert([feeData]);
        
        if (error) throw error;
      }

      setShowFeeDialog(false);
      setEditingFee(null);
      setNewFee({
        fee_type: '',
        construction_type: 'all',
        fee_structure: {},
        description: '',
        applicable_regions: ['all'],
        min_budget: '',
        max_budget: ''
      });
      loadFeesAndProjects();

    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    }
  };

  const handleEditFee = (fee) => {
    setEditingFee(fee);
    setNewFee({
      fee_type: fee.fee_type,
      construction_type: fee.construction_type || 'all',
      fee_structure: typeof fee.fee_structure === 'string' ? JSON.parse(fee.fee_structure) : fee.fee_structure,
      description: fee.description || '',
      applicable_regions: typeof fee.applicable_regions === 'string' ? JSON.parse(fee.applicable_regions) : fee.applicable_regions || ['all'],
      min_budget: fee.min_budget?.toString() || '',
      max_budget: fee.max_budget?.toString() || ''
    });
    setShowFeeDialog(true);
  };

  const handleDeleteFee = async (feeId) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce barème de frais ?')) return;

    try {
      const { error } = await supabase
        .from('remote_construction_fees')
        .update({ is_active: false })
        .eq('id', feeId);

      if (error) throw error;
      loadFeesAndProjects();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const getFeeTypeLabel = (type) => {
    const labels = {
      'management_fee': 'Frais de Gestion',
      'supervision_fee': 'Supervision Technique',
      'reporting_fee': 'Reporting & FileTextation',
      'coordination_fee': 'Coordination Équipes',
      'diaspora_premium': 'Services Premium Diaspora'
    };
    return labels[type] || type;
  };

  const getStatusBadge = (status) => {
    const variants = {
      'planification': { variant: 'secondary', color: 'bg-gray-100 text-gray-800' },
      'fondations': { variant: 'secondary', color: 'bg-blue-100 text-blue-800' },
      'construction': { variant: 'default', color: 'bg-emerald-100 text-emerald-800' },
      'finition': { variant: 'secondary', color: 'bg-orange-100 text-orange-800' },
      'termine': { variant: 'secondary', color: 'bg-green-100 text-green-800' }
    };
    return variants[status] || { variant: 'outline', color: '' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-lg">
            <Hammer className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestion Construction à Distance</h1>
            <p className="text-gray-600">Configuration des frais et suivi projets diaspora</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => setShowFeeDialog(true)}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Barème
          </Button>
        </div>
      </motion.div>

      <Tabs defaultValue="fees" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fees" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Frais & Barèmes
          </TabsTrigger>
          <TabsTrigger value="projects" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Projets Actifs
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Onglet Frais */}
        <TabsContent value="fees" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {fees.map((fee) => (
              <motion.div
                key={fee.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{getFeeTypeLabel(fee.fee_type)}</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditFee(fee)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteFee(fee.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <CardDescription>{fee.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Structure des frais */}
                      <div className="space-y-2">
                        {fee.fee_structure && Object.entries(
                          typeof fee.fee_structure === 'string' 
                            ? JSON.parse(fee.fee_structure) 
                            : fee.fee_structure
                        ).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-sm">
                            <span className="capitalize">{key.replace('_', ' ')}:</span>
                            <span className="font-medium">
                              {key.includes('percentage') ? `${value}%` : 
                               key.includes('fee') || key.includes('cost') ? `${parseInt(value) / 1000}k XOF` : 
                               value}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Type de construction */}
                      <div className="flex justify-between text-sm">
                        <span>Type construction:</span>
                        <Badge variant="secondary">
                          {fee.construction_type === 'all' ? 'Tous types' : fee.construction_type}
                        </Badge>
                      </div>

                      {/* Budget minimum/maximum */}
                      {(fee.min_budget || fee.max_budget) && (
                        <div className="text-xs text-gray-600 p-2 bg-gray-50 rounded">
                          Budget: {fee.min_budget ? `${fee.min_budget / 1000000}M` : '0'} - {fee.max_budget ? `${fee.max_budget / 1000000}M XOF` : '∞'}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Projets */}
        <TabsContent value="projects" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.project_id}</CardTitle>
                        <CardDescription>
                          {project.client?.first_name} {project.client?.last_name} - {project.client_country}
                        </CardDescription>
                      </div>
                      <Badge className={getStatusBadge(project.status).color}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Progression */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progression:</span>
                          <span className="font-medium">{project.progression}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${project.progression}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Budget */}
                      <div className="flex justify-between text-sm">
                        <span>Budget:</span>
                        <span className="font-medium">
                          {project.budget_utilise / 1000000}M / {project.budget_total / 1000000}M XOF
                        </span>
                      </div>

                      {/* Phase actuelle */}
                      <div className="flex justify-between text-sm">
                        <span>Phase:</span>
                        <span className="font-medium">{project.phase_actuelle}</span>
                      </div>

                      {/* Promoteur */}
                      <div className="flex justify-between text-sm">
                        <span>Promoteur:</span>
                        <span className="font-medium text-xs">
                          {project.promoteur?.company_name || 
                           `${project.promoteur?.first_name} ${project.promoteur?.last_name}`}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Détails
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1">
                          <Calculator className="h-3 w-3 mr-1" />
                          Frais
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Onglet Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-600" />
                  Projets Totaux
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{projects.length}</div>
                <p className="text-sm text-gray-600">+2 ce mois</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                  Revenus Frais
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">25.8M</div>
                <p className="text-sm text-gray-600">XOF (3 mois)</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Clients Diaspora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">47</div>
                <p className="text-sm text-gray-600">8 pays</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Temps Moyen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600">18</div>
                <p className="text-sm text-gray-600">mois/projet</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog pour créer/modifier un frais */}
      <Dialog open={showFeeDialog} onOpenChange={setShowFeeDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingFee ? 'Modifier le Barème' : 'Nouveau Barème de Frais'}
            </DialogTitle>
            <DialogDescription>
              Configurez les frais pour les projets de construction à distance
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4">
            {/* Type de frais */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fee_type">Type de frais</Label>
                <Select value={newFee.fee_type} onValueChange={(value) => setNewFee({...newFee, fee_type: value})}>
                  <SelectTrigger>
                    <SelectValue YOUR_API_KEY="Sélectionnez un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="management_fee">Frais de Gestion</SelectItem>
                    <SelectItem value="supervision_fee">Supervision Technique</SelectItem>
                    <SelectItem value="reporting_fee">Reporting & FileTextation</SelectItem>
                    <SelectItem value="coordination_fee">Coordination Équipes</SelectItem>
                    <SelectItem value="diaspora_premium">Services Premium Diaspora</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="construction_type">Type de construction</Label>
                <Select value={newFee.construction_type} onValueChange={(value) => setNewFee({...newFee, construction_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tous types</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="duplex">Duplex</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="social">Logement social</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Structure des frais */}
            <div>
              <Label>Structure des frais</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="percentage">Pourcentage (%)</Label>
                  <Input
                    id="percentage"
                    type="number"
                    YOUR_API_KEY="ex: 8"
                    value={newFee.fee_structure.percentage || ''}
                    onChange={(e) => setNewFee({
                      ...newFee, 
                      fee_structure: {...newFee.fee_structure, percentage: e.target.value}
                    })}
                  />
                </div>
                <div>
                  <Label htmlFor="base_fee">Frais de base (XOF)</Label>
                  <Input
                    id="base_fee"
                    type="number"
                    YOUR_API_KEY="ex: 500000"
                    value={newFee.fee_structure.base_fee || ''}
                    onChange={(e) => setNewFee({
                      ...newFee, 
                      fee_structure: {...newFee.fee_structure, base_fee: e.target.value}
                    })}
                  />
                </div>
              </div>
            </div>

            {/* Budget min/max */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min_budget">Budget minimum (XOF)</Label>
                <Input
                  id="min_budget"
                  type="number"
                  YOUR_API_KEY="ex: 10000000"
                  value={newFee.min_budget}
                  onChange={(e) => setNewFee({...newFee, min_budget: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="max_budget">Budget maximum (XOF)</Label>
                <Input
                  id="max_budget"
                  type="number"
                  YOUR_API_KEY="ex: 100000000"
                  value={newFee.max_budget}
                  onChange={(e) => setNewFee({...newFee, max_budget: e.target.value})}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                YOUR_API_KEY="Description des frais..."
                value={newFee.description}
                onChange={(e) => setNewFee({...newFee, description: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowFeeDialog(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Annuler
            </Button>
            <Button
              onClick={handleSaveFee}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="h-4 w-4 mr-2" />
              {editingFee ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RemoteConstructionFeesManager;
