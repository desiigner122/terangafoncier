import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  ChevronDown, 
  Building, 
  TrendingUp, 
  Users, 
  Banknote, 
  Scale, 
  MapPin, 
  Globe, 
  Target, 
  ShieldCheck, 
  FileText, 
  Settings, 
  UserCheck, 
  ArrowRight, 
  Phone, 
  Heart
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MegaMenu = () => {
  const [activeMenu, setActiveMenu] = useState(null);

  const handleMouseEnter = (key) => {
    setActiveMenu(key);
  };

  const handleMouseLeave = () => {
    setActiveMenu(null);
  };

  const professionnelsContent = {
    sections: [
      {
        title: 'Partenaires Financiers',
        items: [
          {
            title: 'Banques',
            description: 'Partenariats financiers, API intégration, ROI +34%',
            href: '/banques',
            icon: Banknote,
            badge: 'ROI +34%',
            color: 'from-emerald-500 to-teal-500'
          },
          {
            title: 'Promoteurs',
            description: 'Booster vos ventes, réseau diaspora 15K+',
            href: '/promoteurs',
            icon: Building,
            badge: '+245% ventes',
            color: 'from-indigo-500 to-purple-500'
          }
        ]
      },
      {
        title: 'Professionnels du Foncier',
        items: [
          {
            title: 'Notaires',
            description: 'Digitaliser votre étude, croissance +156%',
            href: '/notaires',
            icon: Scale,
            badge: 'Digital',
            color: 'from-purple-500 to-indigo-500'
          },
          {
            title: 'Géomètres',
            description: 'Équipements fournis, missions +234%',
            href: '/geometres',
            icon: Target,
            badge: 'Équipements',
            color: 'from-orange-500 to-red-500'
          },
          {
            title: 'Agents Fonciers',
            description: 'Territoire exclusif, revenus +278%',
            href: '/agents-fonciers',
            icon: UserCheck,
            badge: 'Territoire',
            color: 'from-pink-500 to-rose-500'
          }
        ]
      },
      {
        title: 'Vente & Investissement',
        items: [
          {
            title: 'Vendeurs',
            description: 'Vendre votre bien, prix optimisé +34%',
            href: '/vendeurs',
            icon: Users,
            badge: 'IA Estimation',
            color: 'from-yellow-500 to-orange-500'
          },
          {
            title: 'Diaspora',
            description: 'Investir depuis l\'étranger, suivi 24/7',
            href: '/diaspora',
            icon: Globe,
            badge: '25 pays',
            color: 'from-blue-500 to-cyan-500'
          }
        ]
      }
    ]
  };

  const solutionsContent = {
    sections: [
      {
        title: 'Pour Particuliers',
        items: [
          {
            title: 'Acheter un Terrain',
            icon: MapPin,
            description: 'Trouvez et achetez votre terrain avec paiements échelonnés',
            href: '/parcelles',
            badge: 'Recherche',
            color: 'from-blue-500 to-cyan-500'
          },
          {
            title: 'Blockchain NFT',
            icon: ShieldCheck,
            description: 'Propriétés tokenisées NFT avec sécurité blockchain',
            href: '/solutions/blockchain',
            badge: '🆕 Nouveau',
            color: 'from-yellow-500 to-orange-500'
          },
          {
            title: 'Demandes Communales',
            icon: Building,
            description: 'Demandez un terrain communal auprès des mairies',
            href: '/demande-terrain-communal',
            badge: 'Populaire',
            color: 'from-emerald-500 to-teal-500'
          },
          {
            title: 'Construction à Distance',
            icon: UserCheck,
            description: 'Construisez au Sénégal avec suivi temps réel',
            href: '/solutions/construction-distance',
            badge: 'Temps Réel',
            color: 'from-purple-500 to-indigo-500'
          }
        ]
      },
      {
        title: 'Solutions Spécialisées',
        items: [
          {
            title: 'Agriculteurs',
            icon: Settings,
            description: 'Gestion des terres agricoles avec IoT',
            href: '/solutions/agriculteurs',
            badge: 'IoT',
            color: 'from-green-500 to-emerald-500'
          },
          {
            title: 'Investisseurs',
            icon: TrendingUp,
            description: 'Investissement terrain avec ROI calculé',
            href: '/solutions/investisseurs',
            badge: 'ROI',
            color: 'from-indigo-500 to-purple-500'
          },
          {
            title: 'Notaires',
            icon: Scale,
            description: 'Actes blockchain et archivage sécurisé',
            href: '/solutions/notaires',
            badge: '🆕 Blockchain',
            color: 'from-purple-500 to-pink-500'
          },
          {
            title: 'Banques',
            icon: Banknote,
            description: 'Solutions financement et smart contracts',
            href: '/solutions/banques',
            badge: 'Finance',
            color: 'from-blue-500 to-indigo-500'
          }
        ]
      }
    ],
    featured: {
      title: 'Avantages Plateforme',
      description: 'Pourquoi choisir Teranga Foncier ?',
      items: [
        {
          title: 'Paiements Échelonnés',
          icon: Banknote,
          href: '/avantages/paiements'
        },
        {
          title: 'Suivi Temps Réel',
          icon: Target,
          href: '/avantages/suivi'
        },
        {
          title: 'Sécurité Juridique',
          icon: ShieldCheck,
          href: '/avantages/securite'
        }
      ]
    }
  };

  const aboutContent = {
    sections: [
      {
        title: 'Découvrir',
        items: [
          {
            title: 'Notre Histoire',
            icon: Heart,
            description: '15 ans au service du foncier sénégalais',
            href: '/about',
            badge: null,
            color: 'from-pink-500 to-rose-500'
          },
          {
            title: 'Comment ça marche',
            icon: Settings,
            description: 'Guide complet de la plateforme',
            href: '/how-it-works',
            badge: 'Guide',
            color: 'from-blue-500 to-cyan-500'
          },
          {
            title: 'FAQ',
            icon: FileText,
            description: 'Réponses aux questions fréquentes',
            href: '/faq',
            badge: null,
            color: 'from-emerald-500 to-teal-500'
          }
        ]
      },
      {
        title: 'Support',
        items: [
          {
            title: 'Contact',
            icon: Phone,
            description: 'Contactez notre équipe',
            href: '/contact',
            badge: 'Support 24/7',
            color: 'from-orange-500 to-red-500'
          },
          {
            title: 'Blog',
            icon: FileText,
            description: 'Actualités et guides immobiliers',
            href: '/blog',
            badge: 'Nouveau',
            color: 'from-purple-500 to-indigo-500'
          }
        ]
      }
    ]
  };

  const menuItems = [
    {
      title: 'Terrains',
      key: 'terrains',
      href: '/parcelles',
      content: null
    },
    {
      title: 'Carte',
      key: 'carte',
      href: '/map',
      content: null
    },
    {
      title: 'Professionnels',
      key: 'professionnels',
      content: professionnelsContent
    },
    {
      title: 'Solutions',
      key: 'solutions',
      content: solutionsContent
    },
    {
      title: 'À propos',
      key: 'about',
      content: aboutContent
    },
    {
      title: 'Rejoignez-nous',
      key: 'join',
      href: '/rejoignez-nous',
      content: null,
      special: true
    }
  ];

  const renderMegaMenuContent = (content) => {
    if (!content) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-200 z-50"
        onMouseEnter={() => setActiveMenu(activeMenu)}
        onMouseLeave={handleMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {content.sections?.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
                      {section.title}
                    </h3>
                    <div className="space-y-3">
                      {section.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          to={item.href}
                          className="group block p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <div className="flex items-start space-x-3">
                            {item.icon && (
                              <div className={`w-8 h-8 rounded-lg bg-gradient-to-r ${item.color || 'from-blue-500 to-cyan-500'} flex items-center justify-center flex-shrink-0`}>
                                {React.createElement(item.icon, { className: "w-4 h-4 text-white" })}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                                  {item.title}
                                </p>
                                {item.badge && (
                                  <Badge variant="secondary" className="text-xs">
                                    {item.badge}
                                  </Badge>
                                )}
                              </div>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                                  {item.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {content.featured && (
              <div className="lg:col-span-1">
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {content.featured.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {content.featured.description}
                    </p>
                    <div className="space-y-3">
                      {content.featured.items.map((item, index) => (
                        <Link
                          key={index}
                          to={item.href}
                          className="flex items-center space-x-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          {React.createElement(item.icon, { className: "w-4 h-4" })}
                          <span>{item.title}</span>
                          <ArrowRight className="w-3 h-3" />
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <nav className="relative">
      <div className="flex items-center space-x-8">
        {menuItems.map((item) => (
          <div
            key={item.key}
            className="relative"
            onMouseEnter={() => handleMouseEnter(item.key)}
            onMouseLeave={handleMouseLeave}
          >
            {item.href ? (
              <Link
                to={item.href}
                className={`flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md ${
                  item.special 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <span>{item.title}</span>
                {item.content && <ChevronDown className="w-4 h-4" />}
              </Link>
            ) : (
              <button
                className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200 rounded-md"
              >
                <span>{item.title}</span>
                {item.content && <ChevronDown className="w-4 h-4" />}
              </button>
            )}

            <AnimatePresence>
              {activeMenu === item.key && item.content && renderMegaMenuContent(item.content)}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </nav>
  );
};

export default MegaMenu;
