import React from 'react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const logoUrl = "https://horizons-cdn.hostinger.com/bcc20f7d-f81b-4a6f-9229-7d6ba486204e/6e6f6bf058d3590fd198aa8fadf9d2dd.png";

const HeaderLogo = ({ isScrolled, onClick }) => {
  return (
    <Link to="/" className="flex items-center gap-2 flex-shrink-0" onClick={onClick}>
      <img src={logoUrl} alt="Logo Teranga Foncier" className="h-14 w-auto" />
      <div className="hidden sm:block">
        <div className="text-xl font-bold text-primary">TERANGA FONCIER</div>
        <div className="text-xs text-muted-foreground">Investissez en Toute Sécurité, Vendez en Toute Confiance</div>
      </div>
    </Link>
  );
};

export default HeaderLogo;