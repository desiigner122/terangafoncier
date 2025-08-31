import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeaderLogo from '@/components/layout/header/HeaderLogo';
import DesktopNavigation from '@/components/layout/header/DesktopNavigation';
import MobileMenuButton from '@/components/layout/header/MobileMenuButton';
import AuthSection from '@/components/layout/header/AuthSection';
import MobileMenu from '@/components/layout/header/MobileMenu';
import { cn } from '@/lib/utils';

const Header = ({ children, isDashboard, isSolutionDashboard }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const isDashboardLayout = isDashboard || isSolutionDashboard;
  
  const hasBackground = true;
  
  return (
    <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 h-20",
        hasBackground || isMenuOpen ? 'bg-background/95 border-b backdrop-blur-sm shadow-sm' : 'bg-transparent border-b border-transparent',
        isMenuOpen && 'shadow-lg'
    )}>
      <nav className="container mx-auto px-4 h-full flex items-center">
        <div className="flex-shrink-0">
          {children || <HeaderLogo isScrolled={hasBackground} />}
        </div>
        
        <div className="flex-grow flex justify-center">
           {!isDashboardLayout && <DesktopNavigation isScrolled={hasBackground} />}
        </div>

        <div className="flex items-center gap-3 flex-shrink-0">
          <AuthSection isScrolled={hasBackground} />
          {!isDashboardLayout && <MobileMenuButton isMenuOpen={isMenuOpen} isScrolled={hasBackground} onClick={toggleMenu} />}
        </div>
      </nav>

      {!isDashboardLayout && <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />}
    </header>
  );
};

export default Header;