import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Users, Globe, Building, Shield, Home, MapPin, Eye, Smartphone, FileSignature, Banknote, Scale } from 'lucide-react';

export default function MegaMenu({ open = false, onClose = () => {} }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024); // Include tablets
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    function onDoc(e) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) {
        setMobileOpen(false);
        onClose();
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [onClose]);

  const visible = open || mobileOpen;

  return (
    <div ref={ref} className={`mega-menu-container ${visible ? 'show' : 'hide'}`} aria-hidden={!visible}>
      {/* backdrop for mobile/tablet overlay */}
      {isMobile && (
        <div
          className={`mega-menu-backdrop ${visible ? 'show' : ''}`}
          onClick={() => {
            setMobileOpen(false);
            onClose();
          }}
          aria-hidden={!visible}
        />
      )}

      <div className={`mega-menu-panel ${visible ? 'show' : 'hide'}`} role="menu" aria-label="Mega menu — Solutions">
        <div className="mega-menu-header">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <h3 className="text-lg font-semibold text-gray-900">Nos Solutions</h3>
            <p className="text-sm text-gray-600 mt-1">Choisissez la solution adaptée à vos besoins</p>
          </div>
        </div>

        <div className="mega-menu-content">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <div className="mega-menu-grid">
              <div className="mega-menu-column">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Users className="h-4 w-4 text-primary" /> Particuliers</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/solutions/particuliers" className="mega-menu-item" role="menuitem">
                      <div className="mega-menu-icon bg-blue-100"><Home className="h-4 w-4 text-blue-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Achat de Terrain</div>
                        <div className="mega-menu-description">Trouver et acheter un terrain vérifié</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/villes" className="mega-menu-item">
                      <div className="mega-menu-icon bg-green-100"><MapPin className="h-4 w-4 text-green-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Demandes Communales</div>
                        <div className="mega-menu-description">Terrains via mairies</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/parcels" className="mega-menu-item">
                      <div className="mega-menu-icon bg-purple-100"><Eye className="h-4 w-4 text-purple-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Catalogue Vérifié</div>
                        <div className="mega-menu-description">Parcelles certifiées</div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mega-menu-column">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Globe className="h-4 w-4 text-emerald-600" /> Diaspora <span className="ml-2 text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Nouveau</span></h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/diaspora" className="mega-menu-item">
                      <div className="mega-menu-icon bg-emerald-100"><Globe className="h-4 w-4 text-emerald-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Investissement à Distance</div>
                        <div className="mega-menu-description">Achetez depuis l'étranger</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/construction" className="mega-menu-item">
                      <div className="mega-menu-icon bg-orange-100"><Smartphone className="h-4 w-4 text-orange-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Construction Temps Réel</div>
                        <div className="mega-menu-description">Suivez vos travaux</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/diaspora/guide" className="mega-menu-item">
                      <div className="mega-menu-icon bg-blue-100"><FileSignature className="h-4 w-4 text-blue-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Guide Diaspora</div>
                        <div className="mega-menu-description">Conseils & démarches</div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mega-menu-column">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Building className="h-4 w-4 text-blue-600" /> Professionnels</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/promoteurs" className="mega-menu-item">
                      <div className="mega-menu-icon bg-blue-100"><Building className="h-4 w-4 text-blue-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Promoteurs</div>
                        <div className="mega-menu-description">Gestion de projets</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/banques" className="mega-menu-item">
                      <div className="mega-menu-icon bg-green-100"><Banknote className="h-4 w-4 text-green-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Banques</div>
                        <div className="mega-menu-description">Financement foncier</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/notaires" className="mega-menu-item">
                      <div className="mega-menu-icon bg-purple-100"><Scale className="h-4 w-4 text-purple-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Notaires</div>
                        <div className="mega-menu-description">Authentification</div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="mega-menu-column">
                <h4 className="text-sm font-semibold mb-2 flex items-center gap-2"><Shield className="h-4 w-4 text-purple-600" /> Services</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/geometres" className="mega-menu-item">
                      <div className="mega-menu-icon bg-indigo-100"><Users className="h-4 w-4 text-indigo-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Géomètres</div>
                        <div className="mega-menu-description">Bornage & mesures</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/agents-fonciers" className="mega-menu-item">
                      <div className="mega-menu-icon bg-pink-100"><Users className="h-4 w-4 text-pink-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Agents Fonciers</div>
                        <div className="mega-menu-description">Accompagnement</div>
                      </div>
                    </Link>
                  </li>
                  <li>
                    <Link to="/carte-interactive" className="mega-menu-item">
                      <div className="mega-menu-icon bg-teal-100"><MapPin className="h-4 w-4 text-teal-600" /></div>
                      <div className="mega-menu-text">
                        <div className="mega-menu-title">Carte Interactive</div>
                        <div className="mega-menu-description">Explorez les zones</div>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile/Tablet accordion layout */}
            {isMobile && (
              <div className="md:hidden">
                <div className="space-y-2">
                  {[
                    { id: 'part', title: 'Particuliers', icon: Users, items: [
                      { title: 'Achat de Terrain', href: '/solutions/particuliers', description: 'Trouvez votre terrain idéal' },
                      { title: 'Demandes Communales', href: '/villes', description: 'Terrains via mairies' },
                      { title: 'Catalogue Vérifié', href: '/parcels', description: 'Parcelles certifiées' }
                    ]},
                    { id: 'dias', title: 'Diaspora', icon: Globe, items: [
                      { title: 'Investissement à Distance', href: '/diaspora', description: 'Achetez depuis l\'étranger' },
                      { title: 'Construction Temps Réel', href: '/construction', description: 'Suivez vos travaux' },
                      { title: 'Guide Diaspora', href: '/diaspora/guide', description: 'Conseils & démarches' }
                    ]},
                    { id: 'pro', title: 'Professionnels', icon: Building, items: [
                      { title: 'Promoteurs', href: '/promoteurs', description: 'Gestion de projets' },
                      { title: 'Banques', href: '/banques', description: 'Financement foncier' },
                      { title: 'Notaires', href: '/notaires', description: 'Authentification' }
                    ]},
                    { id: 'serv', title: 'Services', icon: Shield, items: [
                      { title: 'Géomètres', href: '/geometres', description: 'Bornage & mesures' },
                      { title: 'Agents Fonciers', href: '/agents-fonciers', description: 'Accompagnement' },
                      { title: 'Carte Interactive', href: '/carte-interactive', description: 'Explorez les zones' }
                    ]}
                  ].map((sec) => (
                    <details key={sec.id} className="bg-white border rounded-lg">
                      <summary className="p-3 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center"><sec.icon className="h-4 w-4 text-primary" /></div>
                          <span className="font-medium">{sec.title}</span>
                        </div>
                        <span className="text-sm text-gray-500">Voir</span>
                      </summary>
                      <div className="p-3 border-t">
                        <ul className="space-y-2">
                          {sec.items.map((item, idx) => (
                            <li key={idx}>
                              <Link to={item.href} className="block p-2 rounded hover:bg-gray-50" onClick={onClose}>
                                <div className="font-medium text-sm">{item.title}</div>
                                <div className="text-xs text-gray-600">{item.description}</div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 pt-4 border-t">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">Découvrez toutes nos solutions</div>
                <div className="flex gap-2">
                  <Link to="/solutions" className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">Voir toutes</Link>
                  <Link to="/register" className="px-4 py-2 text-sm bg-primary text-white rounded-md hover:bg-primary/90 transition-colors">Commencer</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
