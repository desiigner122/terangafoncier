import React from 'react';
import { Link } from 'react-router-dom';

// Utiliser le logo PNG fourni tel quel (sans vectorisation ni modifications)
const logoUrl = "/images/logo.png";

const HeaderLogo = ({ onClick }) => {
  return (
    <Link to="/" className="flex items-center gap-3 flex-shrink-0" onClick={onClick}>
      <img
        src={logoUrl}
        alt="Teranga Foncier"
        className="h-10 w-auto object-contain"
        draggable={false}
      />
    </Link>
  );
};

export default HeaderLogo;