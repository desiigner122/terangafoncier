import React from 'react';
    import { NavLink } from 'react-router-dom';
    import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Settings
} from 'lucide-react';
    import { cn } from '@/lib/utils';
    import { useAuth } from '@/contexts/AuthProvider';

    const DashboardMenu = () => {
        const { profile } = useAuth();
        
        if(!profile) return null;

        let navItems = [];
        if (profile.role === 'Admin') {
            navItems = [
                { href: '/admin', label: 'Vue d\'ensemble', icon: LayoutDashboard },
                { href: '/admin/users', label: 'Utilisateurs', icon: Users },
                { href: '/admin/parcels', label: 'Annonces', icon: MapPin },
                { href: '/admin/settings', label: 'Paramètres', icon: Settings },
            ];
        } else if (profile.role === 'Mairie') {
            navItems = [
                 { href: '/dashboard/land-management', label: 'Gestion Foncière', icon: MapPin },
                 { href: '/dashboard/mairie-requests', label: 'Demandes Citoyens', icon: Users },
                 { href: '/dashboard/cadastre', label: 'Cadastre', icon: LayoutDashboard },
                 { href: '/settings', label: 'Paramètres', icon: Settings },
            ];
        } else {
            navItems = [
                { href: '/dashboard', label: 'Vue d\'ensemble', icon: LayoutDashboard },
                { href: '/my-requests', label: 'Mes Demandes', icon: Users },
                { href: '/parcelles', label: 'Terrains', icon: MapPin },
                { href: '/settings', label: 'Paramètres', icon: Settings },
            ];
        }
        
        return (
            <div className="hidden md:flex items-center space-x-2">
                {navItems.map(item => (
                    <NavLink 
                        key={item.href}
                        to={item.href}
                        className={({ isActive }) => cn(
                            "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                            isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground'
                        )}
                    >
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                    </NavLink>
                ))}
            </div>
        );
    };

    export default DashboardMenu;