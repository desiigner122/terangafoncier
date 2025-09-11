import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  LogOut, 
  Users, 
  Menu, 
  X, 
  Home
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { useAuth } from '@/contexts/TempSupabaseAuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import MobileDrawer from '@/components/ui/mobile-drawer';

const logoUrl = "/teranga-foncier-logo.svg";

// Configuration sidebar simplifiée
const getSimpleSidebarConfig = (role) => {
  const baseConfig = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { href: '/profile', label: 'Profil', icon: User },
    { href: '/settings', label: 'Paramètres', icon: Settings }
  ];

  if (role === 'admin') {
    return [
      { href: '/admin', label: 'Admin Dashboard', icon: LayoutDashboard, end: true },
      { href: '/admin/users', label: 'Utilisateurs', icon: Users },
      { href: '/admin/settings', label: 'Configuration', icon: Settings },
      ...baseConfig
    ];
  }

  return baseConfig;
};

const NavItem = ({ item, active, onClick }) => (
  <div 
    className={cn(
      "flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150 group relative cursor-pointer",
      active
        ? "bg-blue-500 text-white shadow-lg"
        : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
    )}
    onClick={onClick}
  >
    <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
    <span className="truncate">{item.label}</span>
  </div>
);

const SimpleNavItem = ({ item, onNavigate }) => {
  return (
    <NavLink to={item.href} end={item.end} onClick={onNavigate}>
      {({ isActive }) => <NavItem item={item} active={isActive} />}
    </NavLink>
  );
};

// Composant Sidebar principal
const SidebarContent = ({ onNavigate }) => {
  const { user, profile, signOut } = useAuth();
  const [sidebarConfig, setSidebarConfig] = useState([]);

  useEffect(() => {
    if (profile?.role) {
      setSidebarConfig(getSimpleSidebarConfig(profile.role));
    } else {
      setSidebarConfig(getSimpleSidebarConfig('particulier'));
    }
  }, [profile]);

  const handleSignOut = () => {
    signOut();
    if (onNavigate) onNavigate();
  };

  return (
    <div className="flex flex-col h-full bg-white text-gray-900 border-r">
      {/* Header */}
      <div className="flex items-center justify-center h-16 md:h-20 border-b px-4">
        <Link to="/" className="flex items-center space-x-2 group" onClick={onNavigate}>
          <img src={logoUrl} alt="Logo Teranga Foncier" className="h-8 md:h-12 w-auto" />
        </Link>
      </div>
      
      {/* Profile Section */}
      {profile && (
        <div className="p-3 md:p-4 text-center border-b">
          <Avatar className="mx-auto h-12 md:h-16 w-12 md:w-16 mb-2 border-2 border-blue-500">
            <AvatarImage src={profile.avatar_url} />
            <AvatarFallback className="bg-blue-100 text-blue-600 text-sm md:text-base">
              {profile.full_name ? profile.full_name.charAt(0) : 'U'}
            </AvatarFallback>
          </Avatar>
          <p className="font-semibold text-gray-900 text-sm md:text-base truncate">
            {profile.full_name || 'Utilisateur'}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {user?.email}
          </p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-2 md:p-3 space-y-1 overflow-y-auto">
        {sidebarConfig.map((item, index) => (
          <SimpleNavItem key={item.href || index} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* Footer Actions */}
      {user && (
        <div className="p-2 md:p-3 mt-auto border-t space-y-2">
          <Button 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-red-400 hover:bg-red-50 hover:text-red-500 text-xs md:text-sm" 
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
    <aside className="hidden md:flex w-64 lg:w-72 flex-col h-full">
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
const SidebarResponsive = () => {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default SidebarResponsive;
export { MobileSidebar };
