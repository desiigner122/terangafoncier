import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderLogo from '@/components/layout/header/HeaderLogo';
import DesktopNavigation from '@/components/layout/header/DesktopNavigation';
import MobileMenuButton from '@/components/layout/header/MobileMenuButton';
import AuthSection from '@/components/layout/header/AuthSection';
import MobileMenu from '@/components/layout/header/MobileMenu';
import DashboardMenu from '@/components/layout/header/DashboardMenu';
import { cn } from '@/lib/utils';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const isDashboard = location.pathname.startsWith('/admin') ||
                      location.pathname.startsWith('/agent') ||
                      location.pathname.match(/\/dashboard(\/|$)/);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const hasBackground = isDashboard || isScrolled || isMenuOpen;

  return (
    <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20",
        hasBackground ? 'bg-background/95 border-b backdrop-blur-sm shadow-sm' : 'bg-transparent border-b border-transparent',
    )}>
      <nav className="container mx-auto px-4 h-full flex items-center justify-between">
        <div className="flex items-center">
            {isDashboard && (
                 <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="md:hidden mr-2"
                  aria-label="Toggle sidebar"
                >
                  <Menu className="h-6 w-6" />
                </Button>
            )}
            <HeaderLogo isScrolled={hasBackground} />
        </div>
        
        <div className="hidden md:flex flex-grow justify-center">
           {isDashboard ? <DashboardMenu /> : <DesktopNavigation isScrolled={hasBackground} />}
        </div>

        <div className="flex items-center gap-3">
          <AuthSection isScrolled={hasBackground} />
          <div className="md:hidden">
            <MobileMenuButton isMenuOpen={isMenuOpen} isScrolled={hasBackground} onClick={toggleMenu} />
          </div>
        </div>
      </nav>

       <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} isDashboard={isDashboard} />
    </header>
  );
};

export default Header;