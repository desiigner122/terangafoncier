import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Linkedin, 
  MapPin, 
  Phone, 
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Shield,
  Award,
  Zap,
  Globe,
  Users,
  TrendingUp,
  ArrowRight
} from 'lucide-react';

const logoUrl = "/images/logo.png";

const ModernFooter = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    {
      title: "Solutions Populaires",
      links: [
        { label: "Acheter un Terrain", path: "/parcelles", icon: MapPin },
        { label: "Terrain Intelligent", path: "/terrain-intelligent/TF-2024-001", icon: Zap, badge: "Nouveau" },
        { label: "Construction Distance", path: "/solutions/construction-distance", icon: Globe, badge: "Diaspora" },
        { label: "Investissement Sécurisé", path: "/solutions/investisseurs", icon: TrendingUp },
        { label: "Vendre Rapidement", path: "/solutions/vendeurs", icon: Users },
      ]
    },
    {
      title: "Professionnels",
      links: [
        { label: "Banques & Financement", path: "/banques", icon: Award },
        { label: "Promoteurs Immobiliers", path: "/promoteurs", icon: Users },
        { label: "Agents Fonciers", path: "/agents-fonciers", icon: Users },
        { label: "Notaires", path: "/notaires", icon: Shield },
        { label: "Rejoignez-Nous", path: "/rejoignez-nous", icon: ArrowRight, badge: "Recrutement" },
      ]
    },
    {
      title: "Ressources",
      links: [
        { label: "Comment ça Marche", path: "/how-it-works", icon: null },
        { label: "Guide Diaspora", path: "/guide-diaspora", icon: null },
        { label: "Carte Interactive", path: "/map", icon: null },
        { label: "Blog & Actualités", path: "/blog", icon: null },
        { label: "Support Client", path: "/contact", icon: null },
      ]
    },
    {
      title: "Légal & Sécurité",
      links: [
        { label: "À Propos", path: "/about", icon: null },
        { label: "Conditions d'Utilisation", path: "/legal", icon: null },
        { label: "Politique de Confidentialité", path: "/privacy", icon: null },
        { label: "Protection Anti-Fraude", path: "/#anti-fraude", icon: Shield },
        { label: "FAQ", path: "/faq", icon: null },
      ]
    }
  ];

  const stats = [
    { label: "Terrains Vérifiés", value: "2,500+", icon: Shield },
    { label: "Clients Satisfaits", value: "1,200+", icon: Users },
    { label: "Transactions Sécurisées", value: "800+", icon: Award },
    { label: "Professionnels Partenaires", value: "150+", icon: TrendingUp }
  ];

  const socialLinks = [
    { platform: "LinkedIn", url: "https://linkedin.com/company/terangafoncier", icon: Linkedin },
    { platform: "Facebook", url: "https://facebook.com/terangafoncier", icon: Facebook },
    { platform: "Twitter", url: "https://twitter.com/terangafoncier", icon: Twitter },
    { platform: "Instagram", url: "https://instagram.com/terangafoncier", icon: Instagram },
    { platform: "YouTube", url: "https://youtube.com/@terangafoncier", icon: Youtube },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Section des statistiques */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-2">
                  <stat.icon className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section principale */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Logo et description */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src={logoUrl} 
                alt="Teranga Foncier" 
                className="w-10 h-10"
              />
              <div>
                <span className="text-xl font-bold text-white">Teranga Foncier</span>
                <div className="text-xs text-primary">La référence du foncier au Sénégal</div>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              La première plateforme digitale sécurisée pour l'achat, la vente et la gestion de terrains au Sénégal. 
              Nous connectons particuliers, professionnels et institutions pour des transactions foncières transparentes.
            </p>

            {/* Contact CEO */}
            <div className="bg-gray-800 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-white mb-3">Contact Direct CEO</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <span className="text-gray-300">Abdoulaye Diémé, CEO</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href="tel:+221775934241" className="text-gray-300 hover:text-primary transition-colors">
                    +221 77 593 42 41
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:palaye122@gmail.com" className="text-gray-300 hover:text-primary transition-colors">
                    palaye122@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux */}
            <div>
              <h4 className="font-semibold text-white mb-3">Suivez-nous</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Liens rapides */}
          {quickLinks.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path} 
                      className="group flex items-center gap-2 text-gray-300 hover:text-primary transition-colors"
                    >
                      {link.icon && <link.icon className="h-4 w-4" />}
                      <span className="text-sm">{link.label}</span>
                      {link.badge && (
                        <Badge variant="secondary" className="text-xs bg-primary/20 text-primary border-primary/30">
                          {link.badge}
                        </Badge>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Restez Informé</h3>
              <p className="text-gray-300 text-sm">Recevez nos dernières offres de terrains et actualités du foncier</p>
            </div>
            
            <div className="flex gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="Votre email"
                className="flex-1 md:w-64 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white YOUR_API_KEY-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <Button className="px-6 bg-primary hover:bg-primary/90">
                S'abonner
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright et mentions légales */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm">
              Â© {currentYear} Teranga Foncier. Tous droits réservés. 
              <span className="mx-2">â€¢</span>
              Fait avec â¤ï¸ au Sénégal
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link to="/legal" className="text-gray-400 hover:text-primary transition-colors">
                Mentions Légales
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                Confidentialité
              </Link>
              <Link to="/cookie-policy" className="text-gray-400 hover:text-primary transition-colors">
                Cookies
              </Link>
              <div className="flex items-center gap-1 text-gray-400">
                <Shield className="h-4 w-4" />
                <span>Site Sécurisé SSL</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ModernFooter;

