import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Building, 
  Landmark, 
  Leaf, 
  Banknote, 
  TrendingUp, 
  ChevronDown, 
  ChevronRight, 
  Scale, 
  Users, 
  FileSignature, 
  AlertTriangle, 
  Sprout, 
  Home, 
  Globe, 
  Plane
} from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/SupabaseAuthContext';

const publicNavItems = [
  { title: 'Accueil', href: '/' },
  { title: 'Terrains', href: '/parcelles' },
  { title: 'Carte', href: '/map' },
  { title: 'Comment ça marche', href: '/how-it-works' },
  { title: 'Contact', href: '/contact' },
];

const dashboardNavItems = [
    { title: 'Tableau de Bord', href: '/dashboard' },
    { title: 'Mes Demandes', href: '/my-requests' },
    { title: 'Mes Favoris', href: '/favorites' },
    { title: 'Messagerie', href: '/messaging' },
    { title: 'Profil', href: '/profile' },
]

const solutions = [
  { title: 'Banques & Finances', href: '/solutions/banques', description: 'Évaluez les garanties et analysez les risques fonciers.', icon: Banknote },
  { title: 'Promoteurs', href: '/solutions/promoteurs', description: 'Identifiez des opportunités et suivez vos projets de construction.', icon: Building },
  { title: 'Investisseurs', href: '/solutions/investisseurs', description: 'Suivez votre portefeuille et détectez les meilleures opportunités.', icon: TrendingUp },
  { title: 'Agriculteurs', href: '/solutions/agriculteurs', description: 'Gérez vos parcelles, suivez la météo et analysez vos sols.', icon: Leaf },
];

const diasporaSolutions = [
  { title: 'Construction à Distance', href: '/solutions/construction-distance', description: 'Pilotez votre projet depuis l\'étranger.', icon: Home, isNew: true },
  { title: 'Investissement Diaspora', href: '/solutions/diaspora-investment', description: 'Investissez dans l\'immobilier sénégalais.', icon: Globe, isNew: true },
  { title: 'Suivi Projet Live', href: '/solutions/project-monitoring', description: 'Surveillez vos travaux en temps réel.', icon: Plane, isNew: true },
];

const CollapsibleMobileMenu = ({ title, items, onClose }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const mobileNavLinkClass = (isActive) =>
    `block px-4 py-3 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${isActive ? 'bg-accent text-accent-foreground' : 'text-foreground'}`;
  
  return (
    <Collapsible open={isSubMenuOpen} onOpenChange={setIsSubMenuOpen}>
      <CollapsibleTrigger className="w-full">
        <div className={cn(mobileNavLinkClass(false), "flex justify-between items-center")}>
          <span>{title}</span>
          {isSubMenuOpen ? <ChevronDown className="h-5 w-5"/> : <ChevronRight className="h-5 w-5"/>}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4 border-l-2 ml-4 border-primary/50">
        {items.map(item => (
           <NavLink key={item.href} to={item.href} className={({isActive}) => mobileNavLinkClass(isActive)} onClick={onClose}>
             <div className="flex items-center gap-3">
              <item.icon className="h-5 w-5 text-primary"/>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{item.title}</p>
                  {item.isNew && <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>}
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
             </div>
          </NavLink>
        ))}
      </CollapsibleContent>
    </Collapsible>
  )
}

const MobileMenu = ({ isOpen, onClose, isDashboard }) => {
  const auth = useAuth();
  const user = auth?.user;
  
  const mobileNavLinkClass = (isActive) =>
    `block px-4 py-3 rounded-md text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${isActive ? 'bg-accent text-accent-foreground' : 'text-foreground'}`;

  const navItems = isDashboard ? [...dashboardNavItems, ...publicNavItems] : publicNavItems;
  
  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed top-20 left-0 right-0 bg-background border-t shadow-lg max-h-[calc(100vh-5rem)] overflow-y-auto z-40">
      <div className="container mx-auto px-4 space-y-2 py-4">
        {navItems.map(item => (
            <NavLink key={item.href} to={item.href} className={({isActive}) => mobileNavLinkClass(isActive)} onClick={onClose} end={item.href === '/'}>{item.title}</NavLink>
        ))}
        
        <CollapsibleMobileMenu title="Solutions" items={solutions} onClose={onClose} />
        
        <CollapsibleMobileMenu 
          title={
            <div className="flex items-center gap-2">
              Solutions Diaspora 
              <Badge variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">Nouveau</Badge>
            </div>
          } 
          items={diasporaSolutions} 
          onClose={onClose} 
        />

        <div className="border-t pt-4 mt-4 space-y-3">
          {!user ? (
            <Button variant="outline" className="w-full" size="sm" asChild onClick={onClose}>
              <Link to="/login">Connexion</Link>
            </Button>
          ) : (
             <Button size="sm" className="w-full" asChild variant="default" onClick={onClose}>
                <Link to="/dashboard">Mon Espace</Link>
              </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;