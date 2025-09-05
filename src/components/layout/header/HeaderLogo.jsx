import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const logoUrl = "/teranga-foncier-logo.svg";

const HeaderLogo = ({ isScrolled, onClick }) => {
  return (
    <Link to="/" className="flex items-center gap-2 flex-shrink-0 relative" onClick={onClick}>
      <img src={logoUrl} alt="Logo Teranga Foncier" className="h-14 w-auto" />
      <div className="hidden sm:block">
        <div className="text-xl font-bold text-primary flex items-center gap-2">
          TERANGA FONCIER
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full animate-pulse border border-primary/20">
            🌍 Diaspora
          </span>
        </div>
        <div className="text-xs text-muted-foreground">Investissez en Toute Sécurité, Vendez en Toute Confiance</div>
      </div>
    </Link>
  );
};

export default HeaderLogo;