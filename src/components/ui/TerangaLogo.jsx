import React from 'react';

const TerangaLogo = ({ className = "w-12 h-12", showText = false }) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative ${className}`}>
        {/* Baobab Tree */}
        <svg viewBox="0 0 300 300" className="w-full h-full">
          {/* Tree trunk */}
          <path
            d="M140 250 L140 180 Q145 175 150 180 L150 250"
            fill="#8B4513"
            stroke="#A0522D"
            strokeWidth="2"
          />
          
          {/* Tree crown */}
          <circle cx="145" cy="120" r="60" fill="#FFA500" opacity="0.9" />
          <circle cx="125" cy="100" r="45" fill="#FFB347" opacity="0.8" />
          <circle cx="165" cy="100" r="45" fill="#FFB347" opacity="0.8" />
          <circle cx="145" cy="80" r="35" fill="#FFC649" opacity="0.9" />
          
          {/* Branches */}
          <path d="M145 180 Q120 160 100 140" stroke="#8B4513" strokeWidth="3" fill="none" />
          <path d="M145 180 Q170 160 190 140" stroke="#8B4513" strokeWidth="3" fill="none" />
          <path d="M145 180 Q130 150 110 120" stroke="#8B4513" strokeWidth="2" fill="none" />
          <path d="M145 180 Q160 150 180 120" stroke="#8B4513" strokeWidth="2" fill="none" />
          
          {/* Buildings in background */}
          <rect x="200" y="200" width="30" height="50" fill="#1E40AF" />
          <rect x="235" y="190" width="35" height="60" fill="#1E40AF" />
          <rect x="275" y="180" width="25" height="70" fill="#1E40AF" />
          
          {/* Building tops */}
          <polygon points="200,200 215,190 230,200" fill="#FFFFFF" />
          <polygon points="235,190 252.5,180 270,190" fill="#FFFFFF" />
          <polygon points="275,180 287.5,170 300,180" fill="#FFFFFF" />
          
          {/* Golden geometric element (diamond/crystal) */}
          <polygon 
            points="80,220 95,200 110,220 95,240" 
            fill="#FFD700" 
            stroke="#FFA500" 
            strokeWidth="2"
          />
          <polygon 
            points="85,220 95,210 105,220 95,230" 
            fill="#FFED4E"
          />
          
          {/* Roots */}
          <path d="M140 250 Q120 260 100 270" stroke="#8B4513" strokeWidth="2" fill="none" />
          <path d="M150 250 Q170 260 190 270" stroke="#8B4513" strokeWidth="2" fill="none" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="font-bold text-xl" style={{ color: '#8B4513' }}>TERANGA</span>
            <span className="font-bold text-xl" style={{ color: '#FFA500' }}>FONCIER</span>
          </div>
          <div className="text-xs text-gray-600 mt-1 leading-tight">
            <div>Investissez en Toute Sécurité,</div>
            <div>Vendez en Toute Confiance</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerangaLogo;