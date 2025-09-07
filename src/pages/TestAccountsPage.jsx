import React from 'react';
import { useAuth } from '@/contexts/AuthProvider';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Shield, 
  MapPin, 
  Building, 
  Calculator, 
  Banknote, 
  Home, 
  TrendingUp, 
  Users, 
  Globe,
  Copy,
  CheckCircle
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast-simple';

const TestAccountsPage = () => {
  const { login } = useAuth();
  const [copiedEmail, setCopiedEmail] = React.useState(null);

  const testAccounts = [
    {
      email: 'admin@test.com',
      password: 'test123',
      role: 'admin',
      name: 'Maître Aminata Sall',
      title: 'Notaire Principal',
      description: 'Accès complet au système - Gestion des utilisateurs et supervision',
      icon: Shield,
      color: 'bg-red-500',
      features: ['Gestion utilisateurs', 'Supervision générale', 'Rapports avancés']
    },
    {
      email: 'agent@test.com',
      password: 'test123',
      role: 'agent_foncier',
      name: 'Moussa Diallo',
      title: 'Agent Foncier',
      description: 'Gestion des transactions immobilières et accompagnement clients',
      icon: User,
      color: 'bg-blue-500',
      features: ['Transactions immobilières', 'Gestion clients', 'Estimations']
    },
    {
      email: 'mairie@test.com',
      password: 'test123',
      role: 'mairie',
      name: 'Mairie de Dakar',
      title: 'Services Municipaux',
      description: 'Gestion administrative et délivrance de documents officiels',
      icon: Building,
      color: 'bg-green-500',
      features: ['Documents officiels', 'Autorisations', 'Urbanisme']
    },
    {
      email: 'geometre@test.com',
      password: 'test123',
      role: 'geometre',
      name: 'Fatou Ndiaye',
      title: 'Géomètre Expert',
      description: 'Mesures et délimitations de terrains, expertise technique',
      icon: Calculator,
      color: 'bg-yellow-500',
      features: ['Mesures terrain', 'Plans techniques', 'Délimitations']
    },
    {
      email: 'banque@test.com',
      password: 'test123',
      role: 'banque',
      name: 'Banque Atlantique',
      title: 'Institution Bancaire',
      description: 'Services financiers et crédits immobiliers',
      icon: Banknote,
      color: 'bg-purple-500',
      features: ['Crédits immobiliers', 'Évaluations', 'Financement']
    },
    {
      email: 'vendeur-particulier@test.com',
      password: 'test123',
      role: 'vendeur_particulier',
      name: 'Ibrahima Sarr',
      title: 'Vendeur Particulier',
      description: 'Vente de propriétés personnelles et familiales',
      icon: Home,
      color: 'bg-orange-500',
      features: ['Vente propriétés', 'Gestion annonces', 'Négociations']
    },
    {
      email: 'promoteur@test.com',
      password: 'test123',
      role: 'promoteur',
      name: 'SOGEA Sénégal',
      title: 'Promoteur Immobilier',
      description: 'Développement de projets immobiliers de grande envergure',
      icon: Building,
      color: 'bg-indigo-500',
      features: ['Projets immobiliers', 'Développement', 'Construction']
    },
    {
      email: 'investisseur@test.com',
      password: 'test123',
      role: 'investisseur',
      name: 'Capital Invest Sénégal',
      title: 'Investisseur',
      description: 'Investissements stratégiques et opportunités de marché',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      features: ['Investissements', 'Opportunités', 'Portefeuille']
    },
    {
      email: 'particulier@test.com',
      password: 'test123',
      role: 'particulier',
      name: 'Aminata Diop',
      title: 'Particulier',
      description: 'Recherche et achat de propriétés pour usage personnel',
      icon: Users,
      color: 'bg-pink-500',
      features: ['Recherche propriétés', 'Favoris', 'Comparaisons']
    },
    {
      email: 'diaspora@test.com',
      password: 'test123',
      role: 'diaspora',
      name: 'Mamadou Ba',
      title: 'Diaspora Sénégalaise',
      description: 'Investissement depuis l\'étranger avec accompagnement spécialisé',
      icon: Globe,
      color: 'bg-cyan-500',
      features: ['Investissement diaspora', 'Suivi à distance', 'Conseil spécialisé']
    }
  ];

  const handleQuickLogin = async (account) => {
    try {
      await login(account.email, account.password);
      toast({
        title: "Connexion réussie",
        description: `Connecté en tant que ${account.name}`,
      });
    } catch (error) {
      toast({
        title: "Erreur de connexion",
        description: "Impossible de se connecter avec ce compte",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    setCopiedEmail(text);
    setTimeout(() => setCopiedEmail(null), 2000);
    toast({
      title: "Copié",
      description: `${type} copié dans le presse-papiers`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Comptes de Test - Teranga Foncier
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Explorez la plateforme avec différents types d'utilisateurs. 
            Chaque compte offre des fonctionnalités spécifiques selon le rôle.
          </p>
        </div>

        {/* Test Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testAccounts.map((account, index) => {
            const IconComponent = account.icon;
            return (
              <Card key={index} className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <div className={`absolute top-0 left-0 right-0 h-1 ${account.color}`}></div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${account.color} text-white`}>
                      <IconComponent size={20} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {account.title}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{account.name}</p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {account.description}
                  </p>
                  
                  {/* Credentials */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span className="text-xs font-medium text-gray-700">Email:</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600 font-mono">{account.email}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(account.email, 'Email')}
                          className="h-6 w-6 p-0"
                        >
                          {copiedEmail === account.email ? 
                            <CheckCircle size={12} className="text-green-500" /> : 
                            <Copy size={12} />
                          }
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                      <span className="text-xs font-medium text-gray-700">Mot de passe:</span>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600 font-mono">test123</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard('test123', 'Mot de passe')}
                          className="h-6 w-6 p-0"
                        >
                          <Copy size={12} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      Fonctionnalités principales
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {account.features.map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Quick Login Button */}
                  <Button 
                    onClick={() => handleQuickLogin(account)}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <User size={16} className="mr-2" />
                    Connexion Rapide
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              💡 Informations importantes
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>• Tous les comptes utilisent le mot de passe : <code className="bg-gray-100 px-2 py-1 rounded">test123</code></p>
              <p>• Chaque rôle offre des fonctionnalités et un dashboard spécifiques</p>
              <p>• Les données sont simulées pour la démonstration</p>
              <p>• Utilisez "Connexion Rapide" ou copiez les identifiants manuellement</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAccountsPage;