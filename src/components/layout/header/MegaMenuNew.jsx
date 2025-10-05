import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Globe, Building, Shield, ArrowRight, Phone, Mail, Clock, X } from 'lucide-react';

const MegaMenuNew = ({ isOpen, onClose }) => {
  // Détecter si on est sur mobile/tablette
  const isMobile = window.innerWidth <= 1024;

  // Empêcher le scroll du body quand le menu est ouvert sur mobile
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, isMobile]);

  if (!isOpen) return null;

  // Version Mobile/Tablette: Overlay plein écran avec priorité absolue
  if (isMobile) {
    return (
      <div className="mobile-mega-menu-overlay">
        <div className="mobile-mega-menu-backdrop" onClick={onClose}></div>
        <div className="mobile-mega-menu-container">
          <div className="mobile-mega-menu-header">
            <h2 className="text-xl font-bold text-white">Nos Solutions</h2>
            <button 
              onClick={onClose} 
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Fermer le menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="mobile-mega-menu-content">
            {/* Accordéon mobile optimisé */}
            <div className="space-y-3">
              <details className="mobile-menu-section">
                <summary className="mobile-menu-summary">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span>Solutions Particuliers</span>
                </summary>
                <div className="mobile-menu-items">
                  <Link to="/solutions/particuliers/achat-terrain" onClick={onClose} className="mobile-menu-item">
                    <div>
                      <div className="font-medium text-white">Achat de Terrain</div>
                      <div className="text-sm text-gray-300">Trouvez le terrain idéal</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link to="/solutions/particuliers/vente-propriete" onClick={onClose} className="mobile-menu-item">
                    <div>
                      <div className="font-medium text-white">Vente de Propriété</div>
                      <div className="text-sm text-gray-300">Vendez au meilleur prix</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link to="/solutions/particuliers/conseil-juridique" onClick={onClose} className="mobile-menu-item">
                    <div>
                      <div className="font-medium text-white">Conseil Juridique</div>
                      <div className="text-sm text-gray-300">Expertise juridique</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </details>

              <details className="mobile-menu-section">
                <summary className="mobile-menu-summary">
                  <Globe className="w-5 h-5 text-green-400" />
                  <span>Solutions Diaspora</span>
                </summary>
                <div className="mobile-menu-items">
                  <Link to="/solutions/diaspora/investissement" onClick={onClose} className="mobile-menu-item">
                    <div>
                      <div className="font-medium text-white">Investissement Immobilier</div>
                      <div className="text-sm text-gray-300">Investissez depuis l'étranger</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link to="/solutions/diaspora/gestion-patrimoine" onClick={onClose} className="mobile-menu-item">
                    <div>
                      <div className="font-medium text-white">Gestion de Patrimoine</div>
                      <div className="text-sm text-gray-300">Gérez vos biens à distance</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </details>

              <details className="mobile-menu-section">
                <summary className="mobile-menu-summary">
                  <Building className="w-5 h-5 text-purple-400" />
                  <span>Solutions Entreprises</span>
                </summary>
                <div className="mobile-menu-items">
                  <Link to="/solutions/entreprises/terrain-commercial" onClick={onClose} className="mobile-menu-item">
                    <div>
                      <div className="font-medium text-white">Terrain Commercial</div>
                      <div className="text-sm text-gray-300">Espaces pour entreprises</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link to="/solutions/entreprises/bureaux" onClick={onClose} className="mobile-menu-item">
                    <div>
                      <div className="font-medium text-white">Location de Bureaux</div>
                      <div className="text-sm text-gray-300">Bureaux modernes</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </details>

              <details className="mobile-menu-section">
                <summary className="mobile-menu-summary">
                  <Shield className="w-5 h-5 text-red-400" />
                  <span>Services Légaux</span>
                </summary>
                <div className="mobile-menu-items">
                  <Link to="/solutions/legaux/notariat" onClick={onClose} className="mobile-menu-item">
                    <div>
                      <div className="font-medium text-white">Services Notariaux</div>
                      <div className="text-sm text-gray-300">Actes et certifications</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                  <Link to="/solutions/legaux/titre-foncier" onClick={onClose} className="mobile-menu-item">
                    <div>
                      <div className="font-medium text-white">Titre Foncier</div>
                      <div className="text-sm text-gray-300">Sécurisez vos droits</div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                  </Link>
                </div>
              </details>
            </div>

            <div className="mobile-menu-footer">
              <Link
                to="/contact"
                onClick={onClose}
                className="mobile-contact-button"
              >
                Contactez-nous <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Version Desktop: Layout étiré avec largeur maximale
  return (
    <div className="desktop-mega-menu-overlay">
      <div className="desktop-mega-menu-container">
        <div className="desktop-mega-menu-panel">
          <div className="desktop-mega-menu-header">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nos Solutions Complètes</h2>
            <p className="text-gray-600">Des services fonciers adaptés à tous vos besoins</p>
          </div>
          
          <div className="desktop-mega-menu-content">
            <div className="desktop-mega-menu-grid">
              {/* Column 1: Particuliers */}
              <div className="desktop-mega-menu-column">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                  <h3 className="font-bold text-gray-900 text-lg">Solutions Particuliers</h3>
                </div>
                
                <Link to="/solutions/particuliers/achat-terrain" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Achat de Terrain</div>
                    <div className="text-sm text-gray-600">Trouvez le terrain idéal pour votre projet</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
                
                <Link to="/solutions/particuliers/vente-propriete" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Vente de Propriété</div>
                    <div className="text-sm text-gray-600">Vendez au meilleur prix du marché</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
                
                <Link to="/solutions/particuliers/conseil-juridique" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Conseil Juridique</div>
                    <div className="text-sm text-gray-600">Expertise juridique personnalisée</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
              </div>

              {/* Column 2: Diaspora */}
              <div className="desktop-mega-menu-column">
                <div className="flex items-center gap-2 mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                  <h3 className="font-bold text-gray-900 text-lg">Solutions Diaspora</h3>
                </div>
                
                <Link to="/solutions/diaspora/investissement" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Investissement Immobilier</div>
                    <div className="text-sm text-gray-600">Investissez depuis l'étranger en toute sécurité</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
                
                <Link to="/solutions/diaspora/gestion-patrimoine" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Gestion de Patrimoine</div>
                    <div className="text-sm text-gray-600">Gérez vos biens à distance</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
                
                <Link to="/solutions/diaspora/accompagnement" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Accompagnement Complet</div>
                    <div className="text-sm text-gray-600">Support personnalisé 24/7</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
              </div>

              {/* Column 3: Entreprises */}
              <div className="desktop-mega-menu-column">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-6 h-6 text-purple-600" />
                  <h3 className="font-bold text-gray-900 text-lg">Solutions Entreprises</h3>
                </div>
                
                <Link to="/solutions/entreprises/terrain-commercial" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Terrain Commercial</div>
                    <div className="text-sm text-gray-600">Espaces stratégiques pour entreprises</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
                
                <Link to="/solutions/entreprises/bureaux" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Location de Bureaux</div>
                    <div className="text-sm text-gray-600">Bureaux modernes et équipés</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
                
                <Link to="/solutions/entreprises/conseil-strategique" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Conseil Stratégique</div>
                    <div className="text-sm text-gray-600">Optimisez vos investissements</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
              </div>

              {/* Column 4: Services Légaux */}
              <div className="desktop-mega-menu-column">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-6 h-6 text-red-600" />
                  <h3 className="font-bold text-gray-900 text-lg">Services Légaux</h3>
                </div>
                
                <Link to="/solutions/legaux/notariat" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Services Notariaux</div>
                    <div className="text-sm text-gray-600">Actes authentiques et certifications</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
                
                <Link to="/solutions/legaux/titre-foncier" className="desktop-mega-menu-item">
                  <div>
                    <div className="font-semibold text-gray-900">Titre Foncier</div>
                    <div className="text-sm text-gray-600">Sécurisez définitivement vos droits</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                </Link>
                
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span className="font-semibold text-sm">Urgence Juridique</span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">Support disponible 24h/24</p>
                  <Link to="/contact-urgence" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                    Contactez maintenant →
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Bottom action bar */}
            <div className="desktop-mega-menu-footer">
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Lun-Ven 8h-18h</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  <span>+221 33 123 45 67</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  <span>palaye122@gmail.com</span>
                </div>
              </div>
              <Link
                to="/contact"
                className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold"
              >
                Contactez-nous <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MegaMenuNew;
