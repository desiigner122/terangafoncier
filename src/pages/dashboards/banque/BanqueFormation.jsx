import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  GraduationCap, 
  Book, 
  Video, 
  FileText, 
  Users, 
  Award, 
  Play,
  Download,
  Star,
  Clock,
  CheckCircle,
  Search,
  Filter,
  Plus,
  Eye,
  BookOpen,
  Headphones,
  Monitor,
  Smartphone,
  Globe,
  MessageCircle,
  HelpCircle,
  Phone,
  Mail,
  Calendar,
  Target,
  Trophy,
  Zap,
  Shield,
  Lock,
  Settings,
  Activity,
  TrendingUp,
  BarChart3,
  PieChart,
  Database,
  Code,
  Terminal,
  Briefcase
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const BanqueFormation = () => {
  const [formations, setFormations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [userProgress, setUserProgress] = useState({});

  // Données de formation simulées
  useEffect(() => {
    const mockFormations = [
      {
        id: 1,
        title: 'Maîtrise de la Plateforme TerangaChain',
        category: 'blockchain',
        type: 'Cours interactif',
        description: 'Formation complète sur l\'utilisation de la blockchain TerangaChain pour les opérations bancaires',
        duration: 240,
        difficulty: 'intermédiaire',
        instructor: 'Dr. Aminata Diallo',
        rating: 4.8,
        students: 156,
        modules: 8,
        progress: 65,
        status: 'en cours',
        image: '/api/placeholder/300/200',
        features: ['Certification', 'Support 24/7', 'Exercices pratiques'],
        objectives: [
          'Comprendre les fondamentaux de TerangaChain',
          'Effectuer des transactions sécurisées',
          'Gérer les certificats fonciers',
          'Optimiser les processus bancaires'
        ]
      },
      {
        id: 2,
        title: 'KYC et Conformité Réglementaire',
        category: 'compliance',
        type: 'Formation certifiante',
        description: 'Processus KYC automatisé et respect des réglementations bancaires UEMOA',
        duration: 180,
        difficulty: 'avancé',
        instructor: 'Maître Ousmane Ba',
        rating: 4.9,
        students: 203,
        modules: 6,
        progress: 100,
        status: 'terminé',
        image: '/api/placeholder/300/200',
        features: ['Certification officielle', 'Cas pratiques', 'Quiz interactifs'],
        objectives: [
          'Maîtriser les exigences KYC',
          'Identifier les risques de blanchiment',
          'Appliquer les procédures de conformité',
          'Gérer les signalements'
        ]
      },
      {
        id: 3,
        title: 'Intelligence Artificielle Bancaire',
        category: 'ai',
        type: 'Masterclass',
        description: 'Utilisation de l\'IA pour le scoring crédit et l\'analyse des risques',
        duration: 300,
        difficulty: 'expert',
        instructor: 'Prof. Fatou Sow',
        rating: 4.7,
        students: 89,
        modules: 10,
        progress: 0,
        status: 'non commencé',
        image: '/api/placeholder/300/200',
        features: ['Laboratoire IA', 'Projets réels', 'Mentorat'],
        objectives: [
          'Développer des modèles de scoring',
          'Analyser les patterns de risque',
          'Optimiser les décisions crédit',
          'Implémenter l\'IA éthique'
        ]
      },
      {
        id: 4,
        title: 'Gestion de Portefeuille Immobilier',
        category: 'immobilier',
        type: 'Formation pratique',
        description: 'Évaluation et gestion des garanties immobilières dans le crédit bancaire',
        duration: 120,
        difficulty: 'intermédiaire',
        instructor: 'Ibrahima Ndiaye',
        rating: 4.6,
        students: 134,
        modules: 5,
        progress: 30,
        status: 'en cours',
        image: '/api/placeholder/300/200',
        features: ['Visites terrain', 'Outils d\'évaluation', 'Réseau expert'],
        objectives: [
          'Évaluer la valeur des biens',
          'Analyser les risques immobiliers',
          'Optimiser les garanties',
          'Gérer les contentieux'
        ]
      },
      {
        id: 5,
        title: 'Services Bancaires Diaspora',
        category: 'diaspora',
        type: 'Spécialisation',
        description: 'Services bancaires adaptés aux besoins de la diaspora africaine',
        duration: 150,
        difficulty: 'intermédiaire',
        instructor: 'Aïssatou Diop',
        rating: 4.8,
        students: 98,
        modules: 6,
        progress: 0,
        status: 'non commencé',
        image: '/api/placeholder/300/200',
        features: ['Études de cas', 'Témoignages', 'Réseautage'],
        objectives: [
          'Comprendre les besoins diaspora',
          'Proposer des solutions adaptées',
          'Gérer les transferts internationaux',
          'Développer la clientèle'
        ]
      },
      {
        id: 6,
        title: 'Cybersécurité Bancaire',
        category: 'securite',
        type: 'Formation critique',
        description: 'Protection des systèmes bancaires contre les cybermenaces',
        duration: 200,
        difficulty: 'avancé',
        instructor: 'Moussa Traoré',
        rating: 4.9,
        students: 67,
        modules: 7,
        progress: 45,
        status: 'en cours',
        image: '/api/placeholder/300/200',
        features: ['Simulations d\'attaque', 'Outils pro', 'Certification'],
        objectives: [
          'Identifier les vulnérabilités',
          'Implémenter des protections',
          'Réagir aux incidents',
          'Former les équipes'
        ]
      }
    ];

    const mockUserProgress = {
      totalFormations: 6,
      formationsTerminees: 1,
      formationsEnCours: 3,
      heuresFormation: 420,
      certificationsObtenues: 2,
      niveau: 'Intermédiaire'
    };

    setFormations(mockFormations);
    setUserProgress(mockUserProgress);
  }, []);

  const getCategoryIcon = (category) => {
    const icons = {
      blockchain: Database,
      compliance: Shield,
      ai: Zap,
      immobilier: Briefcase,
      diaspora: Globe,
      securite: Lock
    };
    return icons[category] || Book;
  };

  const getCategoryColor = (category) => {
    const colors = {
      blockchain: 'bg-purple-100 text-purple-800',
      compliance: 'bg-green-100 text-green-800',
      ai: 'bg-blue-100 text-blue-800',
      immobilier: 'bg-orange-100 text-orange-800',
      diaspora: 'bg-indigo-100 text-indigo-800',
      securite: 'bg-red-100 text-red-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      débutant: 'text-green-600',
      intermédiaire: 'text-yellow-600',
      avancé: 'text-orange-600',
      expert: 'text-red-600'
    };
    return colors[difficulty] || 'text-gray-600';
  };

  const getStatusColor = (status) => {
    const colors = {
      'non commencé': 'bg-gray-100 text-gray-800',
      'en cours': 'bg-blue-100 text-blue-800',
      'terminé': 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const filteredFormations = formations.filter(formation => {
    const matchesSearch = formation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formation.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || formation.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center">
            <GraduationCap className="h-8 w-8 mr-3 text-blue-600" />
            Formation & Support
          </h2>
          <p className="text-gray-600 mt-1">
            Centre de formation et ressources pour maximiser votre expertise bancaire
          </p>
        </div>
        
        <div className="flex items-center space-x-3 mt-4 lg:mt-0">
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Planifier
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Certificats
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Demander Formation
          </Button>
        </div>
      </div>

      {/* Statistiques d'apprentissage */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Formations</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.totalFormations}</p>
              </div>
              <Book className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.formationsTerminees}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.formationsEnCours}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Heures</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.heuresFormation}h</p>
              </div>
              <Clock className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Certificats</p>
                <p className="text-2xl font-bold text-gray-900">{userProgress.certificationsObtenues}</p>
              </div>
              <Award className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Niveau</p>
                <p className="text-lg font-bold text-gray-900">{userProgress.niveau}</p>
              </div>
              <Target className="h-8 w-8 text-indigo-600" />
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
                  <SelectItem value="blockchain">Blockchain</SelectItem>
                  <SelectItem value="compliance">Conformité</SelectItem>
                  <SelectItem value="ai">Intelligence Artificielle</SelectItem>
                  <SelectItem value="immobilier">Immobilier</SelectItem>
                  <SelectItem value="diaspora">Diaspora</SelectItem>
                  <SelectItem value="securite">Sécurité</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Input
                placeholder="Rechercher une formation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-80"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des formations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredFormations.map((formation) => {
          const IconComponent = getCategoryIcon(formation.category);
          
          return (
            <motion.div
              key={formation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-t-lg flex items-center justify-center">
                    <IconComponent className="h-12 w-12 text-white" />
                  </div>
                  <Badge 
                    className={`absolute top-2 right-2 ${getStatusColor(formation.status)}`}
                  >
                    {formation.status}
                  </Badge>
                </div>
                
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg line-clamp-2">{formation.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {formation.type} • {formation.modules} modules
                      </CardDescription>
                    </div>
                    <Badge className={getCategoryColor(formation.category)}>
                      {formation.category}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {formation.description}
                  </p>
                  
                  {/* Instructeur et évaluation */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {formation.instructor.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-gray-600">{formation.instructor}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-medium">{formation.rating}</span>
                      <span className="text-gray-500">({formation.students})</span>
                    </div>
                  </div>
                  
                  {/* Durée et difficulté */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{Math.floor(formation.duration / 60)}h {formation.duration % 60}min</span>
                    </div>
                    
                    <span className={`font-medium ${getDifficultyColor(formation.difficulty)}`}>
                      {formation.difficulty}
                    </span>
                  </div>
                  
                  {/* Progression */}
                  {formation.progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progression</span>
                        <span className="font-medium">{formation.progress}%</span>
                      </div>
                      <Progress value={formation.progress} className="h-2" />
                    </div>
                  )}
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-1">
                    {formation.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2 pt-2 border-t">
                    {formation.status === 'non commencé' ? (
                      <Button className="flex-1">
                        <Play className="h-4 w-4 mr-2" />
                        Commencer
                      </Button>
                    ) : formation.status === 'en cours' ? (
                      <Button className="flex-1">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Continuer
                      </Button>
                    ) : (
                      <Button variant="outline" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Revoir
                      </Button>
                    )}
                    
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Support et aide */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageCircle className="h-5 w-5 mr-2" />
              Support en Direct
            </CardTitle>
            <CardDescription>
              Assistance technique 24/7
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-2" />
              +221 33 123 45 67
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Mail className="h-4 w-4 mr-2" />
              support@teranga-bank.sn
            </Button>
            <Button className="w-full">
              <MessageCircle className="h-4 w-4 mr-2" />
              Chat en direct
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Base de Connaissances
            </CardTitle>
            <CardDescription>
              Guides et documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <FileText className="h-4 w-4 mr-2" />
              Guides utilisateur
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Video className="h-4 w-4 mr-2" />
              Tutoriels vidéo
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Code className="h-4 w-4 mr-2" />
              Documentation API
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Communauté
            </CardTitle>
            <CardDescription>
              Échangez avec d'autres utilisateurs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <MessageCircle className="h-4 w-4 mr-2" />
              Forum communauté
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="h-4 w-4 mr-2" />
              Webinaires
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Trophy className="h-4 w-4 mr-2" />
              Concours & défis
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BanqueFormation;