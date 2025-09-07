import React from 'react';
import { Link } from 'react-router-dom';
import { Building } from 'lucide-react';
import { cn } from '@/lib/utils';

const logoUrl = "/teranga-foncier-logo.svg";

const HeaderLogo = ({ isScrolled, onClick }) => {
  return (
    <Link to="/" className="flex items-center gap-3 flex-shrink-0 relative group" onClick={onClick}>
      {/* Icon Logo */}
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 via-green-500 to-red-500 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
          <Building className="w-5 h-5 text-white" />
        </div>
        
        {/* Text Logo */}
        <div className="hidden sm:block">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-green-400 to-red-400 bg-clip-text text-transparent">
              TERANGA FONCIER
            </span>
            <span className="text-xs bg-gradient-to-r from-blue-500 to-purple-500 text-white px-2 py-0.5 rounded-full animate-pulse border border-blue-400/20 shadow-sm">
              🌍 Blockchain
            </span>
          </div>
          <div className={cn(
            "text-xs transition-colors duration-300",
            isScrolled ? "text-slate-300" : "text-white/80"
          )}>
            Investissez en Toute Sécurité • Blockchain Sénégal
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HeaderLogo;