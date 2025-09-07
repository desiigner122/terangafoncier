import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, Link } from 'react-router-dom';
import { 
  Menu, X, ChevronDown, Home, Users, Building2, MapPin,
  Globe, Shield, Zap, Cpu, Network, Wallet, TrendingUp,
  BarChart3, Settings, User, LogOut, Bell, Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const BlockchainHeader = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/agent') ||
                      location.pathname.match(/\/dashboard(\/|$)/);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigationItems = [
    {
      label: 'Accueil',
      href: '/',
      icon: Home,
      active: location.pathname === '/'
    },
    {
      label: 'Terrains',
      icon: MapPin,
      dropdown: [
        { label: 'Terrains Communaux', href: '/terrains-communaux', icon: Building2 },
        { label: 'Vendeurs Particuliers', href: '/vendeurs-particuliers', icon: Users },
        { label: 'Vendeurs Professionnels', href: '/vendeurs-professionnels', icon: Building2 },
        { label: 'Projets Diaspora', href: '/construction-diaspora', icon: Globe }
      ]
    },
    {
      label: 'Villes',
      href: '/villes',
      icon: Building2,
      active: location.pathname === '/villes'
    },
    {
      label: 'Blockchain',
      icon: Network,
      dropdown: [
        { label: 'Registre Foncier', href: '/blockchain/registre', icon: Shield },
        { label: 'Smart Contracts', href: '/blockchain/contracts', icon: Cpu },
        { label: 'Transactions', href: '/blockchain/transactions', icon: Zap },
        { label: 'NFT Terrains', href: '/blockchain/nft', icon: TrendingUp }
      ]
    }
  ];

  const handleDropdownToggle = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  return (
    <>
      {/* Particles Background Effect */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900"></div>
        <div className="absolute inset-0 opacity-50">
          <div 
            className="w-full h-full opacity-20"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          isScrolled || isDashboard
            ? 'bg-slate-900/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl shadow-cyan-500/10'
            : 'bg-gradient-to-r from-slate-900/80 via-blue-900/80 to-slate-900/80 backdrop-blur-lg'
        )}
      >
        {/* Animated Top Border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>

        <nav className="container mx-auto px-4 h-20 flex items-center justify-between relative">
          
          {/* Logo Section */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <Link to="/" className="flex items-center space-x-3">
              {/* Blockchain Logo */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/25">
                  <Network className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              
              <div className="hidden md:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Teranga Foncier
                </h1>
                <p className="text-xs text-slate-300 -mt-1">Blockchain Registry</p>
              </div>
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigationItems.map((item, index) => (
              <div key={item.label} className="relative">
                {item.dropdown ? (
                  <motion.div
                    className="relative"
                    onMouseEnter={() => setActiveDropdown(index)}
                    onMouseLeave={() => setActiveDropdown(null)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        "text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg",
                        activeDropdown === index && "bg-slate-800/50 text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      <ChevronDown className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        activeDropdown === index ? "rotate-180" : ""
                      )} />
                    </Button>

                    <AnimatePresence>
                      {activeDropdown === index && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-full left-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-slate-700/50 rounded-xl shadow-2xl shadow-cyan-500/10 p-2"
                        >
                          {item.dropdown.map((dropdownItem) => (
                            <Link
                              key={dropdownItem.href}
                              to={dropdownItem.href}
                              className="flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 group"
                            >
                              <dropdownItem.icon className="h-4 w-4 text-cyan-400 group-hover:text-cyan-300" />
                              <span className="text-sm">{dropdownItem.label}</span>
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ) : (
                  <Link to={item.href}>
                    <Button
                      variant="ghost"
                      className={cn(
                        "text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 flex items-center space-x-2 px-4 py-2 rounded-lg",
                        item.active && "bg-slate-800/50 text-white"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-3">
            
            {/* Search */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="hidden md:block"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
              >
                <Search className="h-4 w-4" />
              </Button>
            </motion.div>

            {/* Notifications */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 relative"
              >
                <Bell className="h-4 w-4" />
                <Badge className="absolute -top-1 -right-1 w-5 h-5 p-0 bg-red-500 text-white text-xs flex items-center justify-center">
                  3
                </Badge>
              </Button>
            </motion.div>

            {/* Wallet Connect */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center space-x-2">
                <Wallet className="h-4 w-4" />
                <span className="hidden md:inline">Connecter Wallet</span>
              </Button>
            </motion.div>

            {/* User Menu */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <Button
                variant="ghost"
                size="sm"
                className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300 w-10 h-10 rounded-full p-0"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-white" />
                </div>
              </Button>
            </motion.div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <motion.div
                whileTap={{ scale: 0.9 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all duration-300"
                >
                  {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </motion.div>
            </div>
          </div>
        </nav>

        {/* Status Bar */}
        <div className="bg-slate-800/50 border-t border-slate-700/30 px-4 py-2">
          <div className="container mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4 text-slate-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>Réseau: Actif</span>
              </div>
              <div className="flex items-center space-x-1">
                <Zap className="h-3 w-3 text-yellow-400" />
                <span>Gas: 0.002 ETH</span>
              </div>
              <div className="flex items-center space-x-1">
                <BarChart3 className="h-3 w-3 text-cyan-400" />
                <span>Block: #18,542,673</span>
              </div>
            </div>
            <div className="text-slate-400">
              <span className="text-cyan-400">TerCoin:</span> 1 TER = 650 FCFA
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" onClick={() => setIsMenuOpen(false)} />
            
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-80 bg-slate-800/95 backdrop-blur-xl border-r border-slate-700/50 shadow-2xl pt-24 px-6"
            >
              <div className="space-y-4">
                {navigationItems.map((item, index) => (
                  <div key={item.label}>
                    {item.dropdown ? (
                      <div>
                        <Button
                          variant="ghost"
                          onClick={() => handleDropdownToggle(index)}
                          className="w-full justify-start text-slate-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 flex items-center space-x-3 px-4 py-3 rounded-lg"
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            activeDropdown === index ? "rotate-180" : ""
                          )} />
                        </Button>
                        
                        <AnimatePresence>
                          {activeDropdown === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="ml-4 mt-2 space-y-1 overflow-hidden"
                            >
                              {item.dropdown.map((dropdownItem) => (
                                <Link
                                  key={dropdownItem.href}
                                  to={dropdownItem.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="flex items-center space-x-3 px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-700/30 rounded-md transition-all duration-200"
                                >
                                  <dropdownItem.icon className="h-4 w-4 text-cyan-400" />
                                  <span className="text-sm">{dropdownItem.label}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-300",
                          item.active && "bg-slate-700/50 text-white"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile Bottom Actions */}
              <div className="absolute bottom-6 left-6 right-6 space-y-3">
                <Button className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-medium py-3 rounded-lg shadow-lg shadow-cyan-500/25 transition-all duration-300 flex items-center justify-center space-x-2">
                  <Wallet className="h-4 w-4" />
                  <span>Connecter Wallet</span>
                </Button>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50">
                    <Settings className="h-4 w-4 mr-2" />
                    Paramètres
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-slate-600 text-slate-300 hover:text-white hover:bg-slate-700/50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BlockchainHeader;
