import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthProvider';
import { 
  User, 
  LogOut, 
  Settings, 
  ChevronDown, 
  Menu, 
  X,
  Building2,
  Coins,
  Users,
  TrendingUp,
  Shield,
  FileText,
  Home,
  Search,
  Bell,
  Calculator,
  MapPin,
  Briefcase,
  Scale,
  Hammer,
  Banknote,
  Zap,
  Blocks,
  Database,
  Cpu,
  Brain,
  Sparkles,
  Rocket,
  Eye,
  BookOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const ModernHeader = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const menuItems = [
    {
      label: 'Terrains',
      href: '/terrains',
      key: 'terrains'
    },
    {
      label: 'Carte',
      href: '/carte',
      key: 'carte'
    },
    {
      label: 'Projets & Demandes',
      key: 'projects',
      hasDropdown: true,
      sections: [
        {
          title: 'Construction Blockchain',
          items: [
            { label: 'Projets Promoteurs', href: '/promoters-projects', icon: Building2, description: 'Nouveaux projets immobiliers avec blockchain', isNew: true },
            { label: 'Demandes Construction', href: '/promoter-requests', icon: Hammer, description: 'Demandes de particuliers pour construire', isNew: true },
            { label: 'Guide Projets', href: '/guide-projets', icon: BookOpen, description: 'Comment ça marche avec la blockchain' },
            { label: 'Guide Demandes', href: '/guide-demandes', icon: FileText, description: 'Processus de demande expliqué' }
          ]
        }
      ]
    },
    {
      label: 'Solutions',
      key: 'solutions',
      hasDropdown: true,
      sections: [
        {
          title: 'Particuliers & Professionnels',
          items: [
            { label: 'Particuliers', href: '/solutions/particuliers', icon: Home, description: 'Acheteurs & Vendeurs' },
            { label: 'Agents Fonciers', href: '/solutions/agents', icon: Briefcase, description: 'Outils de vente avancés' },
            { label: 'Géomètres', href: '/solutions/geometres', icon: MapPin, description: 'Cartographie intelligente' },
            { label: 'Notaires', href: '/solutions/notaires', icon: Scale, description: 'Services blockchain', isNew: true },
            { label: 'Banques', href: '/solutions/banques', icon: Banknote, description: 'Financement sécurisé' }
          ]
        }
      ]
    },
    {
      label: 'Blockchain',
      key: 'blockchain',
      hasDropdown: true,
      sections: [
        {
          title: 'Innovations',
          items: [
            { label: 'FonctionnalitÃ©s AvancÃ©es', href: '/fonctionnalites-avancees', icon: Zap, description: 'IA, Blockchain & Analytics', isNew: true },
            { label: 'Solutions Blockchain', href: '/solutions/blockchain', icon: Shield, description: 'Technologie rÃ©volutionnaire', isNew: true },
            { label: 'NFT PropriÃ©tÃ©s', href: '/nft-properties', icon: Coins, description: 'Tokenisation des biens immobiliers' },
            { label: 'Smart Contracts', href: '/smart-contracts', icon: FileText, description: 'Contrats intelligents automatisÃ©s' },
            { label: 'Escrow DÃ©centralisÃ©', href: '/escrow', icon: Shield, description: 'SÃ©questre sÃ©curisÃ© blockchain' }
          ]
        }
      ]
    },
    {
      label: 'Outils',
      key: 'tools',
      hasDropdown: true,
      sections: [
        {
          title: 'Calculateurs & Outils',
          items: [
            { label: 'Estimation de prix', href: '/tools/price-calculator', icon: Calculator, description: 'IA de prÃ©diction des prix' },
            { label: 'Carte interactive', href: '/tools/map', icon: MapPin, description: 'Explorez les terrains disponibles' },
            { label: 'Analyses de marchÃ©', href: '/tools/market-analysis', icon: TrendingUp, description: 'Tendances et insights' },
            { label: 'VÃ©rificateur de propriÃ©tÃ©', href: '/tools/property-verification', icon: Shield, description: 'VÃ©rifiez l\'authenticitÃ© des titres fonciers' }
          ]
        }
      ]
    }
  ];

  const dashboardPath = user?.profile?.role ? `/dashboard/${user.profile.role.toLowerCase()}` : '/dashboard';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Teranga Foncier
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Plateforme Blockchain</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center space-x-8" ref={dropdownRef}>
            {menuItems.map((item) => (
              <div key={item.key} className="relative">
                {item.hasDropdown ? (
                  <button
                    className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      activeDropdown === item.key
                        ? 'text-blue-600 bg-blue-50'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                    onMouseEnter={() => setActiveDropdown(item.key)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${
                      activeDropdown === item.key ? 'rotate-180' : ''
                    }`} />
                  </button>
                ) : (
                  <Link
                    to={item.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 transition-colors"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {item.hasDropdown && activeDropdown === item.key && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-[600px] bg-white rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden z-50"
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <div className="p-6">
                        <div className="grid grid-cols-1 gap-6">
                          {item.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex}>
                              <h3 className="text-sm font-semibold text-gray-900 mb-3 px-3">
                                {section.title}
                              </h3>
                              <div className="grid grid-cols-2 gap-2">
                                {section.items.map((subItem, subIndex) => (
                                  <Link
                                    key={subIndex}
                                    to={subItem.href}
                                    className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                                    onClick={() => setActiveDropdown(null)}
                                  >
                                    <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                                      <subItem.icon className="w-4 h-4 text-blue-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center space-x-2">
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                          {subItem.label}
                                        </p>
                                        {subItem.isNew && (
                                          <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                                            Nouveau
                                          </Badge>
                                        )}
                                      </div>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {subItem.description}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Search */}
                <Button variant="ghost" size="sm" className="hidden md:flex">
                  <Search className="w-4 h-4" />
                </Button>

                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative hidden md:flex">
                  <Bell className="w-4 h-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </Button>

                {/* Dashboard Link */}
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate(dashboardPath)}
                  className="hidden md:flex"
                >
                  Dashboard
                </Button>

                {/* User Menu */}
                <div className="relative">
                  <button
                    className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-50 transition-colors"
                    onClick={() => setActiveDropdown(activeDropdown === 'user' ? null : 'user')}
                  >
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {profile?.nom?.charAt(0) || user?.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === 'user' && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200/50 overflow-hidden"
                      >
                        <div className="p-4 border-b border-gray-100">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={profile?.avatar_url} />
                              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                                {profile?.nom?.charAt(0) || 'U'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-gray-900">
                                {profile?.nom || 'Utilisateur'}
                              </p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                              {profile?.role && (
                                <Badge variant="outline" className="text-xs mt-1">
                                  {profile.role}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <Link
                            to="/profile"
                            className="flex items-center space-x-3 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <User className="w-4 h-4" />
                            <span>Mon Profil</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center space-x-3 w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <Settings className="w-4 h-4" />
                            <span>ParamÃ¨tres</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-3 w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>DÃ©connexion</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
                <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <Link to="/register">S'inscrire</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden border-t border-gray-200/50 overflow-hidden"
            >
              <div className="py-4 space-y-2">
                {menuItems.map((item) => (
                  <div key={item.key}>
                    <button
                      className="flex items-center justify-between w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setActiveDropdown(activeDropdown === item.key ? null : item.key)}
                    >
                      <span className="font-medium">{item.label}</span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        activeDropdown === item.key ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    <AnimatePresence>
                      {activeDropdown === item.key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="bg-gray-50 overflow-hidden"
                        >
                          {item.sections.map((section, sectionIndex) => (
                            <div key={sectionIndex} className="px-4 py-2">
                              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                                {section.title}
                              </h4>
                              {section.items.map((subItem, subIndex) => (
                                <Link
                                  key={subIndex}
                                  to={subItem.href}
                                  className="flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                                  onClick={() => {
                                    setIsMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  <subItem.icon className="w-4 h-4" />
                                  <span>{subItem.label}</span>
                                  {subItem.isNew && (
                                    <Badge className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                                      Nouveau
                                    </Badge>
                                  )}
                                </Link>
                              ))}
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default ModernHeader;

