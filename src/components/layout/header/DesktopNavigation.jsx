import React, { forwardRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { 
  Building, 
  Landmark, 
  Leaf, 
  Banknote, 
  TrendingUp, 
  Users, 
  Scale, 
  FileSignature, 
  AlertTriangle, 
  LifeBuoy, 
  Globe, 
  Plane, 
  Home,
  ChevronDown,
  MapPin,
  Eye,
  Shield,
  CreditCard,
  Smartphone,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

const solutions = [
  { title: 'Banques & Finances', href: '/solutions/banques', description: 'Évaluez les garanties et analysez les risques fonciers.', icon: Banknote },
  { title: 'Promoteurs', href: '/solutions/promoteurs', description: 'Identifiez des opportunités et suivez vos projets.', icon: Building },
  { title: 'Investisseurs', href: '/solutions/investisseurs', description: 'Suivez votre portefeuille et détectez les meilleures opportunités.', icon: TrendingUp },
  { title: 'Vendeurs', href: '/solutions/vendeurs', description: 'Vendez votre bien rapidement au meilleur prix et en toute sécurité.', icon: Users },
  { title: 'Agriculteurs', href: '/solutions/agriculteurs', description: 'Gérez vos parcelles, suivez la météo et analysez vos sols.', icon: Leaf },
];

// NOUVELLES SOLUTIONS DIASPORA
const diasporaSolutions = [
  { title: 'Construction à Distance', href: '/solutions/construction-distance', description: 'Pilotez votre projet de construction depuis l\'étranger.', icon: Home, isNew: true },
  { title: 'Investissement Diaspora', href: '/solutions/diaspora-investment', description: 'Investissez dans l\'immobilier sénégalais en toute sécurité.', icon: Globe, isNew: true },
  { title: 'Suivi de Projet Live', href: '/solutions/project-monitoring', description: 'Surveillez vos travaux en temps réel avec rapports photo/vidéo.', icon: Plane, isNew: true },
];

const ecosystem = [
  { title: 'Mairies', href: '/login?role=Mairie', description: 'Gérez le cadastre et les permis de votre commune.', icon: Landmark },
  { title: 'Notaires', href: '/login?role=Notaire', description: 'Authentifiez les actes et consultez les archives.', icon: Scale },
  { title: 'Agents Immobiliers', href: '/login?role=Agent Foncier', description: 'Gérez vos clients, mandats et visites.', icon: Users },
  { title: 'Particuliers', href: '/register', description: 'Trouvez et achetez le terrain de vos rêves en toute sécurité.', icon: Users },
];

const resources = [
  { title: 'Comment ça Marche ?', href: '/how-it-works', description: 'Notre processus de vérification et d\'achat, étape par étape.', icon: FileSignature },
  { title: 'À Propos de Nous', href: '/about', description: 'Découvrez notre mission, notre vision et l\'équipe.', icon: LifeBuoy },
  { title: 'Lutte Contre la Fraude', href: '/#anti-fraude', description: 'Comment nous vous protégeons des arnaques foncières.', icon: AlertTriangle },
]

const DesktopNavigation = ({ isScrolled }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const useDarkText = isScrolled;

  const navLinkClass = ({ isActive }) =>
    cn(
      'px-4 py-2 text-sm font-medium rounded-md transition-colors',
      isActive
        ? 'text-primary bg-primary/10'
        : useDarkText ? 'text-gray-700 hover:text-primary hover:bg-gray-50' : 'text-gray-900 hover:text-primary hover:bg-white/10'
    );

  const handleMouseEnter = (dropdownName) => {
    setActiveDropdown(dropdownName);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  return (
    <div className="hidden lg:flex items-center gap-1">
      {/* Navigation principale */}
      <NavLink to="/" className={navLinkClass} end>
        Accueil
      </NavLink>
      
      <NavLink to="/parcelles" className={navLinkClass}>
        Terrains
      </NavLink>

      {/* Solutions Dropdown */}
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter('solutions')}
        onMouseLeave={handleMouseLeave}
      >
        <button className="px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 text-gray-900 hover:text-primary hover:bg-white/10">
          Solutions
          <ChevronDown className="h-4 w-4" />
        </button>

        {activeDropdown === 'solutions' && (
          <div className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-white shadow-2xl rounded-xl border border-gray-100 z-50 -translate-x-1/4">
            <div className="p-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Pour Particuliers */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Pour Particuliers
                  </h3>
                  <div className="space-y-2">
                    {solutions.slice(0, 3).map((item) => (
                      <Link 
                        key={item.title}
                        to={item.href}
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                      >
                        <item.icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 group-hover:text-primary">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Pour Diaspora */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Globe className="h-4 w-4 text-emerald-600" />
                    Diaspora
                    <Badge className="bg-emerald-100 text-emerald-700 text-xs">Nouveau</Badge>
                  </h3>
                  <div className="space-y-2">
                    {diasporaSolutions.map((item) => (
                      <Link 
                        key={item.title}
                        to={item.href}
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-emerald-50 transition-colors group"
                      >
                        <item.icon className="h-4 w-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 flex items-center gap-1">
                            {item.title}
                            {item.isNew && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>}
                          </div>
                          <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Pour Professionnels */}
                <div>
                  <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Building className="h-4 w-4 text-blue-600" />
                    Professionnels
                  </h3>
                  <div className="space-y-2">
                    {solutions.slice(3).map((item) => (
                      <Link 
                        key={item.title}
                        to={item.href}
                        className="flex items-start gap-2 p-2 rounded-lg hover:bg-blue-50 transition-colors group"
                      >
                        <item.icon className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600">
                            {item.title}
                          </div>
                          <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">Prêt à commencer ?</h4>
                    <p className="text-xs text-gray-600">Découvrez la solution qui vous convient</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="text-xs">
                      <Link to="/contact">Parler à un expert</Link>
                    </Button>
                    <Button size="sm" asChild className="text-xs">
                      <Link to="/register">Commencer</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Écosystème Dropdown */}
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter('ecosystem')}
        onMouseLeave={handleMouseLeave}
      >
        <button className="px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 text-gray-900 hover:text-primary hover:bg-white/10">
          Écosystème
          <ChevronDown className="h-4 w-4" />
        </button>

        {activeDropdown === 'ecosystem' && (
          <div className="absolute top-full left-0 mt-2 w-screen max-w-3xl bg-white shadow-2xl rounded-xl border border-gray-100 z-50 -translate-x-1/3">
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {ecosystem.map((item) => (
                  <Link 
                    key={item.title}
                    to={item.href}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-primary">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </div>
                      <div className="text-xs text-primary mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        En savoir plus <ArrowRight className="h-2 w-2" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Ressources Dropdown */}
      <div 
        className="relative"
        onMouseEnter={() => handleMouseEnter('resources')}
        onMouseLeave={handleMouseLeave}
      >
        <button className="px-4 py-2 text-sm font-medium rounded-md transition-colors flex items-center gap-1 text-gray-900 hover:text-primary hover:bg-white/10">
          Ressources
          <ChevronDown className="h-4 w-4" />
        </button>

        {activeDropdown === 'resources' && (
          <div className="absolute top-full right-0 mt-2 w-72 bg-white shadow-2xl rounded-xl border border-gray-100 z-50">
            <div className="p-3">
              <div className="space-y-1">
                {resources.map((item) => (
                  <Link 
                    key={item.title}
                    to={item.href}
                    className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <item.icon className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 group-hover:text-primary">
                        {item.title}
                      </div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">
                        {item.description}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              
              <div className="mt-3 pt-3 border-t border-gray-100">
                <Link 
                  to="/contact"
                  className="flex items-center justify-between p-2 bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors group"
                >
                  <div>
                    <div className="text-sm font-medium text-primary">Besoin d'aide ?</div>
                    <div className="text-xs text-gray-600">Contactez notre équipe</div>
                  </div>
                  <ArrowRight className="h-3 w-3 text-primary" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <NavLink to="/contact" className={navLinkClass}>
        Contact
      </NavLink>

      {/* Boutons d'authentification */}
      <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
        <Button variant="ghost" size="sm" asChild className="text-gray-900 hover:text-primary hover:bg-primary/5 px-3 py-2 text-sm">
          <Link to="/login">Connexion</Link>
        </Button>
        <Button size="sm" asChild className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-4 py-2 text-sm">
          <Link to="/register">S'inscrire</Link>
        </Button>
      </div>
    </div>
  );
};
export default DesktopNavigation;