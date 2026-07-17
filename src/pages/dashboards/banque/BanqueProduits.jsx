import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Package, 
  CreditCard, 
  Home, 
  Car, 
  Briefcase, 
  GraduationCap,
  Smartphone,
  Globe,
  Plus,
  Edit,
  Trash2,
  Eye,
  Search,
  Filter,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Percent,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
  Target,
  Award,
  Settings,
  Download,
  Upload,
  BarChart3,
  Activity,
  Zap,
  Shield,
  Lock,
  FileText,
  Send,
  Receipt,
  Wallet
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const BanqueProduits = () => {
  const { user } = useAuth();
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Produits bancaires réels (bank_products filtré par bank_id)
  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    const fetchProduits = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('bank_products')
          .select('id, name, type, description, interest_rate, min_amount, max_amount, duration_months, status, created_at')
          .eq('bank_id', user.id)
          .order('created_at', { ascending: false });
        if (error) throw error;

        const mapped = (data || []).map((p) => ({
          id: p.id,
          name: p.name || 'Produit sans nom',
          // Pas de colonne 'category' dans bank_products : on dérive la catégorie du type
          category: (p.type || '').toLowerCase(),
          type: p.type || '—',
          description: p.description || '',
          taux: p.interest_rate ?? null,
          dureeMax: p.duration_months ?? null,
          montantMin: p.min_amount ?? null,
          montantMax: p.max_amount ?? null,
          status: p.status || 'active',
          dateCreation: p.created_at ? new Date(p.created_at) : null
        }));

        if (!cancelled) setProduits(mapped);
      } catch (e) {
        console.error('Erreur chargement bank_products:', e);
        if (!cancelled) setProduits([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchProduits();
    return () => { cancelled = true; };
  }, [user?.id]);

  const getCategoryIcon = (category) => {
    const c = (category || '').toLowerCase();
    if (c.includes('immo')) return Home;
    if (c.includes('epargne') || c.includes('épargne')) return Wallet;
    if (c.includes('auto')) return Car;
    if (c.includes('pro') || c.includes('entrep')) return Briefcase;
    if (c.includes('edu') || c.includes('étud') || c.includes('etud')) return GraduationCap;
    if (c.includes('carte')) return CreditCard;
    return Package;
  };

  const getCategoryColor = (category) => {
    const c = (category || '').toLowerCase();
    if (c.includes('immo')) return 'bg-blue-100 text-blue-800';
    if (c.includes('epargne') || c.includes('épargne')) return 'bg-green-100 text-green-800';
    if (c.includes('auto')) return 'bg-purple-100 text-purple-800';
    if (c.includes('pro') || c.includes('entrep')) return 'bg-orange-100 text-orange-800';
    if (c.includes('edu') || c.includes('étud') || c.includes('etud')) return 'bg-indigo-100 text-indigo-800';
    if (c.includes('carte')) return 'bg-pink-100 text-pink-800';
    return 'bg-gray-100 text-gray-800';
  };

  const formatMontant = (montant) => {
    if (montant === null || montant === undefined) return '—';
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0
    }).format(montant);
  };

  // Catégories réellement présentes dans les données (dérivées du type)
  const categories = Array.from(
    new Set(produits.map((p) => p.category).filter(Boolean))
  );

  const filteredProduits = produits.filter(produit => {
    const matchesSearch = produit.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (produit.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || produit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Statistiques réelles dérivées de bank_products
  const produitsActifs = produits.filter((p) => p.status === 'active').length;
  const tauxValues = produits.map((p) => p.taux).filter((t) => t !== null && t !== undefined);
  const tauxMoyen = tauxValues.length
    ? tauxValues.reduce((sum, t) => sum + Number(t), 0) / tauxValues.length
    : null;
  const montantMaxGlobal = produits.reduce(
    (max, p) => (p.montantMax != null && p.montantMax > max ? p.montantMax : max),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <Package className="h-8 w-8 mr-3 text-blue-600" />
            Produits Bancaires
          </h2>
          <p className="text-gray-600 mt-1">
            Gérez votre gamme de produits et services bancaires
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau Produit
          </Button>
        </div>
      </div>

      {/* Statistiques globales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produits Total</p>
                <p className="text-2xl font-bold text-gray-900">{produits.length}</p>
              </div>
              <Package className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Produits Actifs</p>
                <p className="text-2xl font-bold text-gray-900">{produitsActifs}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Taux Moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tauxMoyen !== null ? `${tauxMoyen.toFixed(1)}%` : '—'}
                </p>
              </div>
              <Percent className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Montant Max</p>
                <p className="text-2xl font-bold text-gray-900">
                  {montantMaxGlobal > 0 ? formatMontant(montantMaxGlobal) : '—'}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filtrer par catégorie..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les catégories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des produits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProduits.map((produit) => {
          const IconComponent = getCategoryIcon(produit.category);
          
          return (
            <motion.div
              key={produit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getCategoryColor(produit.category)}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{produit.name}</CardTitle>
                        <CardDescription className="text-sm">
                          {produit.type} • {produit.category}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant={produit.status === 'active' ? 'default' : 'secondary'}>
                      {produit.status === 'active' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {produit.description}
                  </p>
                  
                  {/* Métriques clés (colonnes réelles de bank_products) */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Taux</p>
                      <p className="font-medium">
                        {produit.taux !== null ? `${produit.taux}%` : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Durée</p>
                      <p className="font-medium">
                        {produit.dureeMax !== null ? `${produit.dureeMax} mois` : '—'}
                      </p>
                    </div>
                  </div>

                  {/* Montants */}
                  {(produit.montantMin !== null || produit.montantMax !== null) && (
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-xs text-gray-500 mb-1">Plage de financement</p>
                      <p className="text-sm font-medium">
                        {formatMontant(produit.montantMin)} - {formatMontant(produit.montantMax)}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {produit.dateCreation
                        ? `Créé le ${produit.dateCreation.toLocaleDateString('fr-FR')}`
                        : ''}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {loading && (
        <Card>
          <CardContent className="p-8 text-center text-gray-500">
            Chargement des produits...
          </CardContent>
        </Card>
      )}

      {!loading && filteredProduits.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedCategory !== 'all'
                ? 'Aucun produit ne correspond à votre recherche.'
                : 'Commencez par créer votre premier produit bancaire.'}
            </p>
            <Button onClick={() => setShowAddModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un produit
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BanqueProduits;