import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { LayoutGrid, User, LogOut, Settings, Bell, MessageSquare } from 'lucide-react';
import { useAuth } from '@/context/SupabaseAuthContext';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui/spinner';

const getInitials = (nameOrEmail) => {
  if (!nameOrEmail) return '??';
  const name = nameOrEmail.includes('@') ? nameOrEmail.split('@')[0] : nameOrEmail;
  const parts = name.split(' ');
  if (parts.length > 1) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const AuthSection = ({ isScrolled }) => {
  const { user, profile, signOut, loading } = useAuth();
  const { pathname } = window.location;
  const isHomePage = pathname === '/';
  
  const useLightButtons = isHomePage && !isScrolled;

  if (loading) {
    return <LoadingSpinner size="small" />;
  }

  const unreadNotifications = 0; 
  const unreadMessages = 0;

  return (
    <div className="flex items-center gap-2 md:gap-3">
      {user && profile ? (
        <>
          <Button variant="ghost" size="icon" className="relative h-10 w-10" asChild>
            <Link to="/messaging">
              <MessageSquare className="h-5 w-5" />
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
              )}
            </Link>
          </Button>

          <Button variant="ghost" size="icon" className="relative h-10 w-10" asChild>
            <Link to="/notifications">
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute top-1 right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
              )}
            </Link>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border-2 border-transparent hover:border-primary transition-colors">
                  <AvatarImage src={profile.avatar_url || `https://avatar.vercel.sh/${user.email}.png`} alt={profile.full_name || user.email} />
                  <AvatarFallback>{getInitials(profile.full_name || user.email)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="font-semibold truncate">{profile.full_name || user.email}</p>
                <p className="text-xs text-muted-foreground font-normal capitalize">{profile.user_type || profile.role}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard"><LayoutGrid className="mr-2 h-4 w-4" /> Tableau de Bord</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile"><User className="mr-2 h-4 w-4" /> Mon Profil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings"><Settings className="mr-2 h-4 w-4" /> Paramètres</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/40">
                <LogOut className="mr-2 h-4 w-4" /> Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <div className="hidden md:flex items-center gap-3">
          <Button
            variant="ghost"
            className={cn(
                "hover:bg-primary/10",
                useLightButtons ? 'text-white hover:text-white hover:bg-white/20' : 'text-foreground'
            )}
            size="sm"
            asChild
          >
            <Link to="/login">Connexion</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default AuthSection;
