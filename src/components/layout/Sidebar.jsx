
import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  MapPin, 
  Settings, 
  LogOut, 
  Users, 
  UserCheck, 
  BarChart, 
  FileSignature, 
  FileCheck as FileCheckIcon, 
  LifeBuoy, 
  UploadCloud, 
  Building, 
  LandPlot, 
  Heart, 
  Bell, 
  Banknote, 
  TrendingUp, 
  Leaf, 
  Briefcase, 
  ChevronDown, 
  ChevronRight, 
  MessageSquare, 
  Home
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getSidebarConfig } from './sidebarConfig';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/customSupabaseClient';
import BecomeSellerButton from '@/components/auth/BecomeSellerButton';

const logoUrl = "/images/logo.png";

const NavItem = ({ item, active, hasNotification }) => (
  <div className={cn(
    "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150 group relative",
    active
      ? "bg-sidebar-active text-sidebar-active-foreground shadow-lg"
      : "text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-hover-bg"
  )}>
    <item.icon className="mr-3 h-5 w-5" />
    {item.label}
    {hasNotification && (
      <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
      </span>
    )}
  </div>
);

const SimpleNavItem = ({ item, hasNotification }) => {
  return (
    <NavLink to={item.href} end={item.end}>
      {({ isActive }) => <NavItem item={item} active={isActive} hasNotification={hasNotification} />}
    </NavLink>
  );
};

const CollapsibleNavItem = ({ item, hasNotification }) => {
  const location = useLocation();
  const isSectionActive = (paths) => paths.some(path => location.pathname.startsWith(path));
  
  const [isOpen, setIsOpen] = useState(isSectionActive(item.subItems.map(sub => sub.href)));

  useEffect(() => {
    setIsOpen(isSectionActive(item.subItems.map(sub => sub.href)));
  }, [location.pathname, item.subItems]);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
      <CollapsibleTrigger className="w-full">
        <NavItem item={item} active={isOpen} hasNotification={hasNotification} />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pt-1">
        {item.subItems.map(subItem => (
          <NavLink key={subItem.href} to={subItem.href} className={({isActive}) => cn(
            "flex items-center pl-10 pr-3 py-2 text-xs font-medium rounded-md transition-all duration-150 group",
            isActive
              ? "bg-sidebar-hover-bg text-sidebar-foreground"
              : "text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-hover-bg/60"
          )} end={subItem.end}>
            {subItem.label}
          </NavLink>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

const Sidebar = () => {
    const { user, profile, signOut } = useAuth();
    const sidebarConfig = getSidebarConfig(profile);
    const [notifications, setNotifications] = useState({
      general: 0,
      requests: 0,
    });

    useEffect(() => {
        const fetchNotificationsCount = async () => {
            if (user) {
                // FIX: Utiliser 'read' au lieu de 'is_read' pour correspondre � la structure DB
                const { count: generalCount } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('read', false);
                const { count: requestsCount } = await supabase.from('requests').select('*', { count: 'exact', head: true }).eq('user_id', user.id).in('status', ['En cours', 'Nouvelle']);
                setNotifications({
                    general: generalCount || 0,
                    requests: requestsCount || 0,
                });
            }
        };
        fetchNotificationsCount();
    }, [user]);
    
  return (
    <aside className="flex flex-col h-full bg-sidebar-bg text-sidebar-foreground">
      <div className="flex items-center justify-center h-20 border-b border-sidebar-hover-bg shrink-0 px-4">
          <Link to="/" className="flex items-center space-x-2 group">
             <img src={logoUrl} alt="Logo Teranga Foncier" className="h-12 w-auto" />
          </Link>
      </div>
      
      {profile && (
        <div className="p-4 text-center border-b border-sidebar-hover-bg">
          <Avatar className="mx-auto h-16 w-16 mb-2 border-2 border-sidebar-active">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-sidebar-hover-bg text-sidebar-foreground">{profile.full_name ? profile.full_name.charAt(0) : 'U'}</AvatarFallback>
          </Avatar>
          <p className="font-semibold text-sidebar-foreground">{profile.full_name}</p>
          <p className="text-xs text-sidebar-muted-foreground">{user?.email}</p>
        </div>
      )}

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {sidebarConfig.map((item, index) => {
            if (item.isSeparator) {
                return <hr key={`sep-${index}`} className="my-2 border-sidebar-hover-bg" />;
            }
            if(item.isHeader) {
                return <p key={item.label} className="px-3 pt-2 pb-1 text-xs font-semibold uppercase text-sidebar-muted-foreground tracking-wider">{item.label}</p>
            }
            
            let hasNotification = false;
            if (item.href === '/notifications') hasNotification = notifications.general > 0;
            if (item.href === '/my-requests') hasNotification = notifications.requests > 0;

            if (item.subItems) {
              return <CollapsibleNavItem key={item.label} item={item} hasNotification={hasNotification} />;
            }
            return <SimpleNavItem key={item.href} item={item} hasNotification={hasNotification} />;
        })}
      </nav>

       {user && (
         <div className="p-3 mt-auto border-t border-sidebar-hover-bg shrink-0 space-y-2">
              {/* Bouton Devenir Vendeur pour les particuliers */}
              <BecomeSellerButton 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
              />
              
              <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-500/20 hover:text-red-300" onClick={signOut}>
                  <LogOut className="mr-3 h-5 w-5" />
                  D�connexion
              </Button>
         </div>
       )}
    </aside>
  );
};

export default Sidebar;
