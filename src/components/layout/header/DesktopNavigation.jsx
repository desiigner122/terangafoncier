import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Building,
  Banknote,
  Users,
  Scale,
  FileSignature,
  Globe,
  Home,
  ChevronDown,
  MapPin,
  Eye,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import MegaMenuNew from './MegaMenuNew';

const DesktopNavigation = ({ isScrolled = false }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  // simple theme decision — adjust if your app uses a proper theme hook
  const useDarkText = !isScrolled;

  const handleMouseEnter = (key) => setActiveDropdown(key);
  const handleMouseLeave = () => setActiveDropdown(null);

  const navLinkClass = cn(
    'px-4 py-2 text-sm font-medium rounded-md transition-all duration-300',
    useDarkText ? 'text-gray-700 hover:text-primary hover:bg-gray-50' : 'text-gray-900 hover:text-primary hover:bg-white/10'
  );

  const ecosystem = [
    { title: 'Promoteurs', href: '/promoteurs', description: 'Gestion de projets', icon: Building },
    { title: 'Banques', href: '/banques', description: 'Financement foncier', icon: Banknote },
    { title: 'Notaires', href: '/notaires', description: 'Authentification', icon: Scale },
  ];

  const resources = [
    { title: 'Guides', href: '/guides', description: "Guides d'utilisation et démarches", icon: FileSignature },
    { title: 'Blog', href: '/blog', description: 'Articles et retours d’expérience', icon: Globe },
  ];

  return (
    <div className="flex items-center gap-2">
      {/* Solutions dropdown using MegaMenu component */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter('solutions')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center gap-1',
            useDarkText ? 'text-gray-700 hover:text-primary hover:bg-gray-50' : 'text-gray-900 hover:text-primary hover:bg-white/10',
            activeDropdown === 'solutions' && 'text-primary bg-primary/10'
          )}
        >
          Solutions
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', activeDropdown === 'solutions' && 'rotate-180')} />
        </button>

  <MegaMenuNew isOpen={activeDropdown === 'solutions'} onClose={() => setActiveDropdown(null)} />
      </div>

      {/* Écosystème dropdown */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter('ecosystem')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center gap-1',
            useDarkText ? 'text-gray-700 hover:text-primary hover:bg-gray-50' : 'text-gray-900 hover:text-primary hover:bg-white/10',
            activeDropdown === 'ecosystem' && 'text-primary bg-primary/10'
          )}
        >
          Écosystème
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', activeDropdown === 'ecosystem' && 'rotate-180')} />
        </button>

        <div
          className={cn(
            'absolute top-full left-1/2 transform -translate-x-1/2 mt-2 transition-all duration-300 ease-out z-[9999]',
            activeDropdown === 'ecosystem' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
          )}
        >
          <div className="w-[600px] bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Notre Écosystème</h3>
              <p className="text-sm text-gray-600 mt-1">Partenaires et acteurs de la chaîne foncière</p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-4">
                {ecosystem.map((item) => (
                  <Link
                    key={item.title}
                    to={item.href}
                    className="flex items-start gap-3 p-4 rounded-lg hover:bg-gray-50 transition-colors group border border-gray-100 hover:border-primary/20"
                  >
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900 group-hover:text-primary">{item.title}</div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</div>
                      <div className="text-xs text-primary mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">Accéder <ArrowRight className="h-3 w-3" /></div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ressources dropdown */}
      <div
        className="relative"
        onMouseEnter={() => handleMouseEnter('resources')}
        onMouseLeave={handleMouseLeave}
      >
        <button
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-all duration-300 flex items-center gap-1',
            useDarkText ? 'text-gray-700 hover:text-primary hover:bg-gray-50' : 'text-gray-900 hover:text-primary hover:bg-white/10',
            activeDropdown === 'resources' && 'text-primary bg-primary/10'
          )}
        >
          Ressources
          <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', activeDropdown === 'resources' && 'rotate-180')} />
        </button>

        <div
          className={cn(
            'absolute top-full right-0 mt-2 transition-all duration-300 ease-out z-[9999]',
            activeDropdown === 'resources' ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-2 pointer-events-none'
          )}
        >
          <div className="w-80 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900">Ressources</h3>
              <p className="text-sm text-gray-600 mt-1">Guides et informations utiles</p>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                {resources.map((item) => (
                  <Link key={item.title} to={item.href} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors group">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-primary">{item.title}</div>
                      <div className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</div>
                    </div>
                  </Link>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <Link to="/contact" className="flex items-center justify-between p-3 bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg hover:from-primary/10 hover:to-blue-100 transition-colors group">
                  <div>
                    <div className="text-sm font-medium text-primary">Besoin d'aide ?</div>
                    <div className="text-xs text-gray-600">Contactez notre équipe</div>
                  </div>
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <NavLink to="/contact" className={navLinkClass}>
        Contact
      </NavLink>

      {/* Auth buttons */}
      <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
        <Button variant="ghost" size="sm" asChild className={cn('px-3 py-2 text-sm', useDarkText ? 'text-gray-700 hover:text-primary hover:bg-gray-50' : 'text-gray-900 hover:text-primary hover:bg-primary/5')}>
          <Link to="/login">Mon Compte</Link>
        </Button>
        <Button size="sm" asChild className="bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 text-white px-4 py-2 text-sm">
          <Link to="/register">S'inscrire</Link>
        </Button>
      </div>
    </div>
  );
};

export default DesktopNavigation;