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
  Home, 
  Menu, 
  X, 
  ChevronLeft
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { getSidebarConfig } from './sidebarConfig';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/customSupabaseClient';
import BecomeSellerButton from '@/components/auth/BecomeSellerButton';
import MobileDrawer from '@/components/ui/mobile-drawer';

const logoUrl = "/teranga-foncier-logo.svg";

const NavItem = ({ item, active, hasNotification, onClick }) => (
  <div 
    className={cn(
      "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150 group relative cursor-pointer",
      active
        ? "bg-sidebar-active text-sidebar-active-foreground shadow-lg"
        : "text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-hover-bg"
    )}
    onClick={onClick}
  >
    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
    <span className="truncate">{item.label}</span>
    {hasNotification && (
      <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
      </span>
    )}
  </div>
);

const SimpleNavItem = ({ item, hasNotification, onNavigate }) => {
  return (
    <NavLink to={item.href} end={item.end} onClick={onNavigate}>
      {({ isActive }) => <NavItem item={item} active={isActive} hasNotification={hasNotification} />}
    </NavLink>
  );
};

const CollapsibleNavItem = ({ item, hasNotification, onNavigate }) => {
  const location = useLocation();
  const isSectionActive = (paths) => paths.some(path => location.pathname.startsWith(path));
  
  const [isOpen, setIsOpen] = useState(isSectionActive(item.subItems.map(sub => sub.href)));

  useEffect(() => {
    setIsOpen(isSectionActive(item.subItems.map(sub => sub.href)));
  }, [location.pathname, item.subItems]);

  const sectionActive = isSectionActive(item.subItems.map(sub => sub.href));

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full">
        <div className={cn(
          "flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150 w-full",
          sectionActive
            ? "bg-sidebar-active text-sidebar-active-foreground shadow-lg"
            : "text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-hover-bg"
        )}>
          <div className="flex items-center">
            <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
            <span className="truncate">{item.label}</span>
            {hasNotification && (
              <span className="ml-2 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
              </span>
            )}
          </div>
          {isOpen ? <ChevronDown className="h-4 w-4 flex-shrink-0" /> : <ChevronRight className="h-4 w-4 flex-shrink-0" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-1 pt-1">
        {item.subItems.map((subItem) => (
          <NavLink key={subItem.href} to={subItem.href} end={subItem.end} onClick={onNavigate}>
            {({ isActive }) => (
              <div className={cn(
                "flex items-center px-6 py-2 text-sm rounded-md transition-all duration-150 ml-6",
                isActive
                  ? "bg-sidebar-active text-sidebar-active-foreground"
                  : "text-sidebar-muted-foreground hover:text-sidebar-foreground hover:bg-sidebar-hover-bg"
              )}>
                <subItem.icon className="mr-3 h-4 w-4 flex-shrink-0" />
                <span className="truncate">{subItem.label}</span>
              </div>
            )}
          </NavLink>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

// Composant Sidebar principal
const SidebarContent = ({ onNavigate }) => {
  const { user, profile, signOut } = useAuth();
  const [notifications, setNotifications] = useState({ general: 0, requests: 0 });
  const [sidebarConfig, setSidebarConfig] = useState([]);

  useEffect(() => {
    if (user && profile) {
      setSidebarConfig(getSidebarConfig({ role: profile.role }));
    }
  }, [user, profile]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user) return;
      
      try {
        // Mock notifications - Supabase désactivé
        console.log('SidebarResponsive: Mock loading notifications for user:', user.id);
        
        setNotifications({
          general: 0,
          requests: 0
        });
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    };

    loadNotifications();
  }, [user]);

  const handleSignOut = () => {
    signOut();
    if (onNavigate) onNavigate();
  };

  return (
    <div className="flex flex-col h-full bg-sidebar-bg text-sidebar-foreground">
      {/* Header */}
      <div className="flex items-center justify-center h-16 md:h-20 border-b border-sidebar-hover-bg shrink-0 px-4">
        <Link to="/" className="flex items-center space-x-2 group" onClick={onNavigate}>
          <img src={logoUrl} alt="Logo Teranga Foncier" className="h-8 md:h-12 w-auto" />
        </Link>
      </div>
      
      {/* Profile Section */}
      {profile && (
        <div className="p-3 md:p-4 text-center border-b border-sidebar-hover-bg">
          <Avatar className="mx-auto h-12 md:h-16 w-12 md:w-16 mb-2 border-2 border-sidebar-active">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-sidebar-hover-bg text-sidebar-foreground text-sm md:text-base">
              {profile.full_name ? profile.full_name.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
          <p className="font-semibold text-sidebar-foreground text-sm md:text-base truncate">
            {profile.full_name}
          </p>
          <p className="text-xs text-sidebar-muted-foreground truncate">
            {user?.email}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-3 space-y-1 overflow-y-auto">
        {sidebarConfig.map((item, index) => {
          if (item.isSeparator) {
            return <hr key={`sep-${index}`} className="my-2 border-sidebar-hover-bg" />;
          }
          if (item.isHeader) {
            return (
              <p key={item.label} className="px-3 pt-2 pb-1 text-xs font-semibold uppercase text-sidebar-muted-foreground tracking-wider">
                {item.label}
              </p>
            );
          }
          
          let hasNotification = false;
          if (item.href === '/notifications') hasNotification = notifications.general > 0;
          if (item.href === '/my-requests') hasNotification = notifications.requests > 0;

          if (item.subItems) {
            return <CollapsibleNavItem key={item.label} item={item} hasNotification={hasNotification} onNavigate={onNavigate} />;
          }
          return <SimpleNavItem key={item.href} item={item} hasNotification={hasNotification} onNavigate={onNavigate} />;
        })}
      </nav>

      {/* Footer Actions */}
      {user && (
        <div className="p-2 md:p-3 mt-auto border-t border-sidebar-hover-bg shrink-0 space-y-2">
          <BecomeSellerButton 
            variant="outline" 
            size="sm" 
            className="w-full justify-start border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white text-xs md:text-sm"
          />
          
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-red-400 hover:bg-red-500/20 hover:text-red-300 text-xs md:text-sm" 
            onClick={handleSignOut}
          >
            <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
            Déconnexion
          </Button>
        </div>
      )}
    </div>
  );
};

// Sidebar Desktop
const DesktopSidebar = () => {
  return (
    <aside className="hidden md:flex w-64 lg:w-72 flex-col h-screen fixed left-0 top-16 bg-sidebar border-r border-sidebar-border">
      <SidebarContent />
    </aside>
  );
};

// Mobile Sidebar avec MobileDrawer
const MobileSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = () => {
    setIsOpen(false);
  };

  return (
    <>
      <Button variant="ghost" size="sm" className="md:hidden p-2" onClick={() => setIsOpen(true)}>
        <Menu className="h-5 w-5" />
        <span className="sr-only">Ouvrir le menu</span>
      </Button>
      
      <MobileDrawer isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <SidebarContent onNavigate={handleNavigate} />
      </MobileDrawer>
    </>
  );
};

// Composant principal Sidebar
const Sidebar = () => {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;
export { MobileSidebar };
