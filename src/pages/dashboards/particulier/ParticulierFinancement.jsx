import React, { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  CreditCard,
  DollarSign,
  PieChart,
  Calculator,
  TrendingUp,
  Building2,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText,
  Plus,
  ArrowRight,
  Banknote,
  Percent,
  Calendar,
  Target,
  Award,
  Shield,
  Info,
  ExternalLink,
  Download,
  Upload,
  Search,
  Filter,
  Sparkles,
  Zap
} from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { toast } from 'react-hot-toast';

const ParticulierFinancement = () => {
  const { user, profile } = useOutletContext();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('simulation');
  const [loading, setLoading] = useState(true);
  const [demandes, setDemandes] = useState([]);
  const [partenaires, setPartenaires] = useState([]);
  const [showSimulationDialog, setShowSimulationDialog] = useState(false);
  const [showDemandeDialog, setShowDemandeDialog] = useState(false);
  
  // Simulation de prêt
  const [simulation, setSimulation] = useState({
    montant: '',
    duree: '20',
    tauxInteret: '7.5',
    apportPersonnel: '',
    typeFinancement: 'credit_immobilier'
  });
  
  const [resultatSimulation, setResultatSimulation] = useState(null);
  
  // Nouvelle demande de financement
  const [nouvelleDemande, setNouvelleDemande] = useState({
    montant: '',
    duree: '',
    typeFinancement: '',
    revenus: '',
    charges: '',
    apport: '',
    objetFinancement: '',
    partenaire: '',
    documents: []
  });

  useEffect(() => {
    loadFinancementData();
  }, [user]);

  const loadFinancementData = async () => {
    try {
      setLoading(true);
      
      // Charger les données de financement (mode démo pour l'instant)
      setDemandes([
        {
          id: 'fin-1',
          montant: 45000000,
          duree: 20,
          type: 'credit_immobilier',
          status: 'en_cours',
          partenaire: 'CBAO Groupe Attijariwafa Bank',
          taux: 7.5,
          mensualite: 362500,
          created_at: new Date().toISOString(),
          objet: 'Acquisition terrain + construction maison individuelle',
          documents_requis: 8,
          documents_fournis: 5
        },
        {
          id: 'fin-2',
          montant: 25000000,
          duree: 15,
          type: 'credit_terrain',
          status: 'approuve',
          partenaire: 'Banque de l\'Habitat du Sénégal',
          taux: 6.8,
          mensualite: 228400,
          created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          objet: 'Acquisition terrain communal Parcelles Assainies',
          documents_requis: 6,
          documents_fournis: 6
        }
      ]);

      setPartenaires([
        {
          id: 'cbao',
          nom: 'CBAO Groupe Attijariwafa Bank',
          logo: '/logos/cbao.png',
          taux_min: 6.5,
          taux_max: 8.5,
          duree_max: 25,
          montant_max: 100000000,
          apport_min: 20,
          specialites: ['Crédit immobilier', 'Crédit terrain', 'Crédit construction'],
          avantages: ['Taux préférentiel fonctionnaires', 'Assurance décès incluse', 'Frais de dossier réduits'],
          contact: 'financement@cbao.sn',
          note: 4.3
        },
        {
          id: 'bhs',
          nom: 'Banque de l\'Habitat du Sénégal',
          logo: '/logos/bhs.png',
          taux_min: 5.8,
          taux_max: 7.8,
          duree_max: 20,
          montant_max: 75000000,
          apport_min: 15,
          specialites: ['Habitat social', 'Crédit terrain communal', 'Rénovation'],
          avantages: ['Spécialiste habitat', 'Accompagnement personnalisé', 'Partenaire zones communales'],
          contact: 'credit@bhs.sn',
          note: 4.1
        },
        {
          id: 'sgbs',
          nom: 'Société Générale de Banques au Sénégal',
          logo: '/logos/sgbs.png',
          taux_min: 7.0,
          taux_max: 9.0,
          duree_max: 25,
          montant_max: 150000000,
          apport_min: 25,
          specialites: ['Crédit haut de gamme', 'Investissement locatif', 'Construction sur-mesure'],
          avantages: ['Financements élevés', 'Conseil patrimonial', 'Service premium'],
          contact: 'immobilier@sgbs.sn',
          note: 4.0
        }
      ]);

    } catch (error) {
      console.error('Erreur chargement financement:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculerSimulation = () => {
    const montant = parseFloat(simulation.montant) || 0;
    const dureeAnnees = parseInt(simulation.duree) || 20;
    const tauxAnnuel = parseFloat(simulation.tauxInteret) || 7.5;
    const apport = parseFloat(simulation.apportPersonnel) || 0;
    
    if (montant <= 0 || dureeAnnees <= 0) {
      toast.error('Veuillez saisir un montant et une durée valides');
      return;
    }

    const montantEmprunte = montant - apport;
    const tauxMensuel = tauxAnnuel / 100 / 12;
    const nombreMensualites = dureeAnnees * 12;
    
    const mensualite = (montantEmprunte * tauxMensuel * Math.pow(1 + tauxMensuel, nombreMensualites)) / 
                      (Math.pow(1 + tauxMensuel, nombreMensualites) - 1);
    
    const coutTotal = mensualite * nombreMensualites;
    const interetsTotal = coutTotal - montantEmprunte;
    
    const tauxEndettement = (mensualite / (profile?.revenus_mensuels || 500000)) * 100;
    
    setResultatSimulation({
      montantEmprunte,
      mensualite,
      coutTotal,
      interetsTotal,
      tauxEndettement,
      faisable: tauxEndettement <= 33
    });
  };

  const soumettreDemandeFinancement = async () => {
    try {
      if (!nouvelleDemande.montant || !nouvelleDemande.duree || !nouvelleDemande.typeFinancement) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }

      // Mode démo
      const nouvelleDem = {
        id: `fin-${Date.now()}`,
        montant: parseFloat(nouvelleDemande.montant),
        duree: parseInt(nouvelleDemande.duree),
        type: nouvelleDemande.typeFinancement,
        status: 'nouveau',
        partenaire: nouvelleDemande.partenaire,
        taux: 0,
        mensualite: 0,
        created_at: new Date().toISOString(),
        objet: nouvelleDemande.objetFinancement,
        documents_requis: 8,
        documents_fournis: 0
      };
      
      setDemandes(prev => [nouvelleDem, ...prev]);
      toast.success('Demande de financement soumise avec succès');
      
      setNouvelleDemande({
        montant: '',
        duree: '',
        typeFinancement: '',
        revenus: '',
        charges: '',
        apport: '',
        objetFinancement: '',
        partenaire: '',
        documents: []
      });
      setShowDemandeDialog(false);

    } catch (error) {
      console.error('Erreur soumission demande:', error);
      toast.error('Erreur lors de la soumission de la demande');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      nouveau: { color: 'bg-blue-100 text-blue-800', label: 'Nouveau' },
      en_cours: { color: 'bg-orange-100 text-orange-800', label: 'En cours' },
      approuve: { color: 'bg-green-100 text-green-800', label: 'Approuvé' },
      refuse: { color: 'bg-red-100 text-red-800', label: 'Refusé' },
      attente_documents: { color: 'bg-yellow-100 text-yellow-800', label: 'Documents requis' }
    };
    
    const config = statusConfig[status] || statusConfig.nouveau;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatMontant = (montant) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(montant);
  };

  const getTypeFinancementLabel = (type) => {
    const types = {
      credit_immobilier: 'Crédit Immobilier',
      credit_terrain: 'Crédit Terrain',
      credit_construction: 'Crédit Construction',
      credit_renovation: 'Crédit Rénovation',
      investissement_locatif: 'Investissement Locatif'
    };
    return types[type] || type;
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-40 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Solutions de Financement</h2>
          <p className="text-slate-600">Simulez, comparez et obtenez votre financement immobilier</p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowSimulationDialog(true)}
          >
            <Calculator className="h-4 w-4 mr-2" />
            Simulation
          </Button>
          
          <Dialog open={showDemandeDialog} onOpenChange={setShowDemandeDialog}>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Nouvelle Demande
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nouvelle demande de financement</DialogTitle>
                <DialogDescription>
                  Remplissez ce formulaire pour soumettre une demande de financement à nos partenaires bancaires.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Montant souhaité (FCFA) *</label>
                    <Input
                      type="number"
                      placeholder="Ex: 25000000"
                      value={nouvelleDemande.montant}
                      onChange={(e) => setNouvelleDemande(prev => ({ ...prev, montant: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Durée (années) *</label>
                    <Select value={nouvelleDemande.duree} onValueChange={(value) => setNouvelleDemande(prev => ({ ...prev, duree: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir la durée" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 ans</SelectItem>
                        <SelectItem value="15">15 ans</SelectItem>
                        <SelectItem value="20">20 ans</SelectItem>
                        <SelectItem value="25">25 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Type de financement *</label>
                    <Select value={nouvelleDemande.typeFinancement} onValueChange={(value) => setNouvelleDemande(prev => ({ ...prev, typeFinancement: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Type de crédit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="credit_immobilier">Crédit Immobilier</SelectItem>
                        <SelectItem value="credit_terrain">Crédit Terrain</SelectItem>
                        <SelectItem value="credit_construction">Crédit Construction</SelectItem>
                        <SelectItem value="credit_renovation">Crédit Rénovation</SelectItem>
                        <SelectItem value="investissement_locatif">Investissement Locatif</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Revenus mensuels (FCFA) *</label>
                    <Input
                      type="number"
                      placeholder="Ex: 750000"
                      value={nouvelleDemande.revenus}
                      onChange={(e) => setNouvelleDemande(prev => ({ ...prev, revenus: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Charges mensuelles (FCFA)</label>
                    <Input
                      type="number"
                      placeholder="Ex: 150000"
                      value={nouvelleDemande.charges}
                      onChange={(e) => setNouvelleDemande(prev => ({ ...prev, charges: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Apport personnel (FCFA)</label>
                    <Input
                      type="number"
                      placeholder="Ex: 5000000"
                      value={nouvelleDemande.apport}
                      onChange={(e) => setNouvelleDemande(prev => ({ ...prev, apport: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Partenaire bancaire préféré</label>
                    <Select value={nouvelleDemande.partenaire} onValueChange={(value) => setNouvelleDemande(prev => ({ ...prev, partenaire: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir une banque" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Pas de préférence</SelectItem>
                        {partenaires.map(p => (
                          <SelectItem key={p.id} value={p.nom}>{p.nom}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Objet du financement *</label>
                    <Textarea
                      placeholder="Décrivez brièvement votre projet (acquisition, construction, rénovation...)"
                      rows={3}
                      value={nouvelleDemande.objetFinancement}
                      onChange={(e) => setNouvelleDemande(prev => ({ ...prev, objetFinancement: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDemandeDialog(false)}>
                  Annuler
                </Button>
                <Button onClick={soumettreDemandeFinancement}>
                  Soumettre la demande
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Demandes Actives</p>
                <p className="text-3xl font-bold text-slate-900">{demandes.filter(d => ['nouveau', 'en_cours'].includes(d.status)).length}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Montant Total Demandé</p>
                <p className="text-2xl font-bold text-slate-900">
                  {formatMontant(demandes.reduce((sum, d) => sum + d.montant, 0))}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Taux Moyen Obtenu</p>
                <p className="text-3xl font-bold text-slate-900">
                  {demandes.filter(d => d.taux > 0).length > 0 
                    ? (demandes.filter(d => d.taux > 0).reduce((sum, d) => sum + d.taux, 0) / demandes.filter(d => d.taux > 0).length).toFixed(1)
                    : '0'}%
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Percent className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="simulation">Simulation</TabsTrigger>
          <TabsTrigger value="demandes">Mes Demandes</TabsTrigger>
          <TabsTrigger value="partenaires">Partenaires</TabsTrigger>
          <TabsTrigger value="conseils">Conseils</TabsTrigger>
        </TabsList>

        {/* Tab Simulation */}
        <TabsContent value="simulation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Simulateur de Crédit Immobilier
              </CardTitle>
              <CardDescription>
                Calculez vos mensualités et évaluez votre capacité d'emprunt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Montant du projet (FCFA)</label>
                    <Input
                      type="number"
                      placeholder="Ex: 30000000"
                      value={simulation.montant}
                      onChange={(e) => setSimulation(prev => ({ ...prev, montant: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Durée de remboursement</label>
                    <Select value={simulation.duree} onValueChange={(value) => setSimulation(prev => ({ ...prev, duree: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10 ans</SelectItem>
                        <SelectItem value="15">15 ans</SelectItem>
                        <SelectItem value="20">20 ans</SelectItem>
                        <SelectItem value="25">25 ans</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Taux d'intérêt annuel (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="Ex: 7.5"
                      value={simulation.tauxInteret}
                      onChange={(e) => setSimulation(prev => ({ ...prev, tauxInteret: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Apport personnel (FCFA)</label>
                    <Input
                      type="number"
                      placeholder="Ex: 6000000"
                      value={simulation.apportPersonnel}
                      onChange={(e) => setSimulation(prev => ({ ...prev, apportPersonnel: e.target.value }))}
                    />
                  </div>

                  <Button onClick={calculerSimulation} className="w-full">
                    <Calculator className="h-4 w-4 mr-2" />
                    Calculer
                  </Button>
                </div>

                {resultatSimulation && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg">Résultats de la simulation</h4>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="text-sm font-medium">Montant emprunté</span>
                        <span className="font-bold text-blue-900">
                          {formatMontant(resultatSimulation.montantEmprunte)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Mensualité</span>
                        <span className="font-bold text-green-900">
                          {formatMontant(resultatSimulation.mensualite)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                        <span className="text-sm font-medium">Coût total du crédit</span>
                        <span className="font-bold text-orange-900">
                          {formatMontant(resultatSimulation.coutTotal)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                        <span className="text-sm font-medium">Intérêts totaux</span>
                        <span className="font-bold text-red-900">
                          {formatMontant(resultatSimulation.interetsTotal)}
                        </span>
                      </div>

                      <div className={`flex justify-between items-center p-3 rounded-lg ${
                        resultatSimulation.faisable ? 'bg-green-50' : 'bg-red-50'
                      }`}>
                        <span className="text-sm font-medium">Taux d'endettement</span>
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${
                            resultatSimulation.faisable ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {resultatSimulation.tauxEndettement.toFixed(1)}%
                          </span>
                          {resultatSimulation.faisable ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className={`p-4 rounded-lg ${
                      resultatSimulation.faisable ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        {resultatSimulation.faisable ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-red-600" />
                        )}
                        <span className={`font-medium ${
                          resultatSimulation.faisable ? 'text-green-900' : 'text-red-900'
                        }`}>
                          {resultatSimulation.faisable ? 'Financement faisable' : 'Financement risqué'}
                        </span>
                      </div>
                      <p className={`text-sm ${
                        resultatSimulation.faisable ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {resultatSimulation.faisable 
                          ? 'Votre taux d\'endettement est dans les normes bancaires (≤33%).'
                          : 'Votre taux d\'endettement dépasse 33%. Réduisez le montant ou augmentez la durée.'
                        }
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Mes Demandes */}
        <TabsContent value="demandes" className="space-y-6">
          {demandes.length > 0 ? (
            <div className="space-y-4">
              {demandes.map((demande) => (
                <motion.div
                  key={demande.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-lg transition-all duration-200">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <CreditCard className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">
                                {getTypeFinancementLabel(demande.type)}
                              </h3>
                              <p className="text-sm text-slate-500">
                                {demande.partenaire}
                              </p>
                            </div>
                            {getStatusBadge(demande.status)}
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-xs text-slate-500">Montant</p>
                              <p className="font-semibold">{formatMontant(demande.montant)}</p>
                            </div>
                            <div>
                              <p className="text-xs text-slate-500">Durée</p>
                              <p className="font-semibold">{demande.duree} ans</p>
                            </div>
                            {demande.taux > 0 && (
                              <div>
                                <p className="text-xs text-slate-500">Taux</p>
                                <p className="font-semibold">{demande.taux}%</p>
                              </div>
                            )}
                            {demande.mensualite > 0 && (
                              <div>
                                <p className="text-xs text-slate-500">Mensualité</p>
                                <p className="font-semibold">{formatMontant(demande.mensualite)}</p>
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-slate-600 mb-3">{demande.objet}</p>

                          <div className="flex items-center gap-4 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Créé le {new Date(demande.created_at).toLocaleDateString('fr-FR')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              <span>{demande.documents_fournis}/{demande.documents_requis} documents</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            Voir détails
                            <ArrowRight className="h-3 w-3 ml-1" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <CreditCard className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Aucune demande de financement
                </h3>
                <p className="text-slate-500 mb-6">
                  Commencez par simuler votre crédit puis soumettez une demande
                </p>
                <Button onClick={() => setShowDemandeDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nouvelle demande
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab Partenaires */}
        <TabsContent value="partenaires" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {partenaires.map((partenaire) => (
              <motion.div
                key={partenaire.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{partenaire.nom}</CardTitle>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Award 
                              key={i} 
                              className={`h-4 w-4 ${i < Math.floor(partenaire.note) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                          <span className="text-sm text-slate-500 ml-1">({partenaire.note})</span>
                        </div>
                      </div>
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-slate-500">Taux</p>
                        <p className="font-semibold">{partenaire.taux_min}% - {partenaire.taux_max}%</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Durée max</p>
                        <p className="font-semibold">{partenaire.duree_max} ans</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Montant max</p>
                        <p className="font-semibold">{formatMontant(partenaire.montant_max)}</p>
                      </div>
                      <div>
                        <p className="text-slate-500">Apport min</p>
                        <p className="font-semibold">{partenaire.apport_min}%</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Spécialités</p>
                      <div className="flex flex-wrap gap-1">
                        {partenaire.specialites.map((spec, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-slate-700 mb-2">Avantages</p>
                      <ul className="space-y-1">
                        {partenaire.avantages.slice(0, 2).map((avantage, index) => (
                          <li key={index} className="text-xs text-slate-600 flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {avantage}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-4 border-t space-y-2">
                      <Button 
                        className="w-full" 
                        onClick={() => {
                          setNouvelleDemande(prev => ({ ...prev, partenaire: partenaire.nom }));
                          setShowDemandeDialog(true);
                        }}
                      >
                        Faire une demande
                      </Button>
                      <Button variant="outline" size="sm" className="w-full">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        En savoir plus
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Tab Conseils */}
        <TabsContent value="conseils" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green-600" />
                  Conseils pour optimiser votre dossier
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Préparez un apport conséquent</h4>
                      <p className="text-sm text-slate-600">Un apport de 20% minimum améliore vos conditions</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Stabilisez vos revenus</h4>
                      <p className="text-sm text-slate-600">CDI ou revenus réguliers depuis 3 mois minimum</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Réduisez vos charges</h4>
                      <p className="text-sm text-slate-600">Soldez vos crédits en cours si possible</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium">Soignez votre épargne</h4>
                      <p className="text-sm text-slate-600">Montrez une capacité d'épargne régulière</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Documents généralement requis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Pièce d'identité et état civil</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">3 derniers bulletins de salaire</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Contrat de travail</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">3 derniers relevés bancaires</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Avis d'imposition N-1</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Justificatifs de l'apport</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-sm">Compromis de vente ou devis</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="outline" className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger la checklist complète
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-600" />
                Calculateurs et outils utiles
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex-col">
                  <Calculator className="h-6 w-6 mb-2" />
                  <span className="text-sm">Capacité d'emprunt</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <PieChart className="h-6 w-6 mb-2" />
                  <span className="text-sm">Répartition budget</span>
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  <span className="text-sm">Évolution taux</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog simulation rapide */}
      <Dialog open={showSimulationDialog} onOpenChange={setShowSimulationDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Simulation Rapide</DialogTitle>
            <DialogDescription>
              Calculez rapidement vos mensualités
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Montant (FCFA)</label>
              <Input
                type="number"
                value={simulation.montant}
                onChange={(e) => setSimulation(prev => ({ ...prev, montant: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Durée</label>
              <Select value={simulation.duree} onValueChange={(value) => setSimulation(prev => ({ ...prev, duree: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 ans</SelectItem>
                  <SelectItem value="20">20 ans</SelectItem>
                  <SelectItem value="25">25 ans</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSimulationDialog(false)}>
              Fermer
            </Button>
            <Button onClick={() => {
              calculerSimulation();
              setShowSimulationDialog(false);
              setActiveTab('simulation');
            }}>
              Calculer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ParticulierFinancement;
