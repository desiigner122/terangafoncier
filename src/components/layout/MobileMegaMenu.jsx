import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  Building, 
  Landmark, 
  TrendingUp, 
  Users, 
  Banknote, 
  Scale, 
  MapPin, 
  Globe, 
  Target, 
  ShieldCheck, 
  FileText, 
  BarChart3, 
  Settings, 
  UserCheck, 
  ArrowRight, 
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const MobileMegaMenu = ({ isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState(null);

  const menuSections = [
    {
      title: 'Solutions',
      key: 'solutions',
      icon: Building,
      subsections: [
        {
          title: 'Professionnels',
          items: [
            { title: 'Banques & Finances', icon: Banknote, href: '/solutions/banques', badge: 'Populaire' },
            { title: 'Promoteurs', icon: Building, href: '/solutions/promoteurs' },
            { title: 'Investisseurs', icon: TrendingUp, href: '/solutions/investisseurs', badge: 'Nouveau' },
            { title: 'Notaires', icon: Scale, href: '/solutions/notaires' }
          ]
        },
        {
          title: 'Institutions',
          items: [
            { title: 'Agents Fonciers', icon: Landmark, href: '/solutions/agents-fonciers' },
            { title: 'Collectivités', icon: Users, href: '/solutions/collectivites' }
          ]
        }
      ]
    },
    {
      title: 'Diaspora',
      key: 'diaspora',
      icon: Globe,
      badge: 'Spécial',
      subsections: [
        {
          title: 'Services',
          items: [
            { title: 'Construction à Distance', icon: Building, href: '/solutions/diaspora/construction', badge: 'Recommandé' },
            { title: 'Investissement Foncier', icon: TrendingUp, href: '/solutions/diaspora/investissement' },
            { title: 'Suivi de Projets', icon: Target, href: '/solutions/diaspora/suivi' }
          ]
        },
        {
          title: 'Outils',
          items: [
            { title: 'Carte Interactive', icon: MapPin, href: '/carte-interactive', badge: 'Nouveau' },
            { title: 'Guide Investissement', icon: FileText, href: '/guide-investissement' },
            { title: 'Calculateur ROI', icon: BarChart3, href: '/calculateur-roi' }
          ]
        }
      ]
    },
    {
      title: 'Carte Interactive',
      key: 'carte',
      icon: MapPin,
      subsections: [
        {
          title: 'Exploration',
          items: [
            { title: 'Vue d\'ensemble', icon: Globe, href: '/carte-interactive' },
            { title: 'Terrains Disponibles', icon: MapPin, href: '/carte-interactive?filter=terrains' },
            { title: 'Projets en Cours', icon: Building, href: '/carte-interactive?filter=projets' }
          ]
        },
        {
          title: 'Analyse',
          items: [
            { title: 'Prix du Marché', icon: BarChart3, href: '/carte-interactive?view=prix' },
            { title: 'Zones d\'Investissement', icon: TrendingUp, href: '/carte-interactive?view=investissement', badge: 'Populaire' }
          ]
        }
      ]
    }
  ];

  const toggleSection = (key) => {
    setActiveSection(activeSection === key ? null : key);
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
          
          {/* Menu */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-emerald-600 to-teal-600">
              <div className="text-white">
                <h2 className="font-bold text-lg">Menu</h2>
                <p className="text-emerald-100 text-sm">Teranga Foncier</p>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Navigation */}
            <div className="p-4">
              {/* Lien rapide vers la page d'accueil */}
              <Link
                to="/"
                onClick={handleLinkClick}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors mb-4 border-b"
              >
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Building className="h-4 w-4 text-emerald-600" />
                </div>
                <span className="font-medium text-gray-900">Accueil</span>
              </Link>

              {/* Sections du menu */}
              <div className="space-y-2">
                {menuSections.map((section) => (
                  <div key={section.key}>
                    <button
                      onClick={() => toggleSection(section.key)}
                      className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <section.icon className="h-5 w-5 text-emerald-600" />
                        <span className="font-medium text-gray-900">{section.title}</span>
                        {section.badge && (
                          <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                            {section.badge}
                          </Badge>
                        )}
                      </div>
                      <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${
                        activeSection === section.key ? 'rotate-180' : ''
                      }`} />
                    </button>

                    <AnimatePresence>
                      {activeSection === section.key && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="ml-8 mt-2 space-y-3">
                            {section.subsections.map((subsection, subIndex) => (
                              <div key={subIndex}>
                                <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                                  {subsection.title}
                                </h4>
                                <div className="space-y-1">
                                  {subsection.items.map((item, itemIndex) => (
                                    <Link
                                      key={itemIndex}
                                      to={item.href}
                                      onClick={handleLinkClick}
                                      className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50 transition-colors group"
                                    >
                                      <div className="flex items-center space-x-2">
                                        <item.icon className="h-4 w-4 text-gray-400 group-hover:text-emerald-600" />
                                        <span className="text-sm text-gray-700 group-hover:text-emerald-700">
                                          {item.title}
                                        </span>
                                        {item.badge && (
                                          <Badge variant="outline" className="text-xs">
                                            {item.badge}
                                          </Badge>
                                        )}
                                      </div>
                                      <ChevronRight className="h-3 w-3 text-gray-400 group-hover:text-emerald-600" />
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>

              {/* Section rapide Diaspora */}
              <div className="mt-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg border border-emerald-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Globe className="h-5 w-5 text-emerald-600" />
                  <h4 className="font-semibold text-emerald-900">Spécial Diaspora</h4>
                </div>
                <p className="text-sm text-emerald-700 mb-3">
                  Investissez au Sénégal depuis l'étranger en toute sécurité.
                </p>
                <div className="space-y-2">
                  <Link
                    to="/carte-interactive"
                    onClick={handleLinkClick}
                    className="block"
                  >
                    <Button variant="outline" size="sm" className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                      <MapPin className="h-4 w-4 mr-2" />
                      Carte Interactive
                    </Button>
                  </Link>
                  <Link
                    to="/solutions/diaspora/construction"
                    onClick={handleLinkClick}
                    className="block"
                  >
                    <Button variant="outline" size="sm" className="w-full border-emerald-300 text-emerald-700 hover:bg-emerald-100">
                      <Building className="h-4 w-4 mr-2" />
                      Construction Distance
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Liens directs */}
              <div className="mt-6 pt-4 border-t space-y-2">
                <Link
                  to="/contact"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <UserCheck className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-gray-700">Contact</span>
                </Link>
                
                <Link
                  to="/about"
                  onClick={handleLinkClick}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-gray-700">À propos</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMegaMenu;
