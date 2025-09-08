import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  ArrowRight,
  Blocks,
  Database,
  Cpu,
  Lock,
  Coins,
  Fingerprint,
  Smartphone,
  CreditCard,
  FileCheck,
  Rocket,
  Brain,
  Eye,
  Sparkles,
  Scale,
  BookOpen,
  Building2
} from 'lucide-react';

const logoUrl = "https://horizons-cdn.hostinger.com/bcc20f7d-f81b-4a6f-9229-7d6ba486204e/6e6f6bf058d3590fd198aa8fadf9d2dd.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    {
      title: "🏠 Solutions",
      links: [
        { label: "Terrains Communaux", path: "/terrains-communaux", icon: Building2 },
        { label: "Vendeurs Particuliers", path: "/vendeurs-particuliers", icon: Users },
        { label: "Vendeurs Professionnels", path: "/vendeurs-professionnels", icon: Rocket },
        { label: "Promoteurs", path: "/promoteurs", icon: Building2, badge: "Nouveau" },
        { label: "Construction Diaspora", path: "/construction-diaspora", icon: Globe },
        { label: "Carte Interactive", path: "/map", icon: MapPin },
      ]
    },
    {
      title: "🏛️ Professionnels",
      links: [
        { label: "Banques", path: "/banques", icon: CreditCard },
        { label: "Agents Fonciers", path: "/agents-fonciers", icon: Shield },
        { label: "Notaires", path: "/notaires", icon: FileCheck },
        { label: "Rejoindre l'Équipe", path: "/careers", icon: Users },
        { label: "Partenaires", path: "/partners", icon: TrendingUp },
      ]
    },
    {
      title: "� Informations",
      links: [
        { label: "À Propos", path: "/about", icon: Eye },
        { label: "Contact", path: "/contact", icon: Mail },
        { label: "Blog", path: "/blog", icon: FileCheck },
        { label: "Centre d'Aide", path: "/help", icon: Shield },
        { label: "FAQ", path: "/faq", icon: Sparkles },
      ]
    },
    {
      title: "🔒 Légal & Foncier",
      links: [
        { label: "Mentions Légales", path: "/legal", icon: FileCheck },
        { label: "Politique de Confidentialité", path: "/privacy", icon: Lock },
        { label: "Conditions d'Utilisation", path: "/terms", icon: Shield },
        { label: "Documents Fonciers", path: "/documents-fonciers", icon: FileText },
        { label: "Lois Foncières", path: "/lois-foncieres", icon: Scale },
        { label: "Guides & Tutoriels", path: "/guides-tutoriels", icon: BookOpen },
      ]
    }
  ];

  const blockchainStats = [
    { label: "Transactions Blockchain", value: "5,847+", icon: Blocks, trend: "+23%" },
    { label: "Terrains Vérifiés", value: "2,500+", icon: Shield, trend: "+12%" },
    { label: "Smart Contracts", value: "1,250+", icon: Cpu, trend: "+45%" },
    { label: "Utilisateurs Crypto", value: "892+", icon: Coins, trend: "+67%" },
    { label: "Partenaires Certifiés", value: "150+", icon: Fingerprint, trend: "+8%" },
    { label: "NFT Propriétés", value: "734+", icon: Sparkles, trend: "+89%" }
  ];

  const socialLinks = [
    { platform: "LinkedIn", url: "https://linkedin.com/company/terangafoncier", icon: Linkedin },
    { platform: "Facebook", url: "https://facebook.com/terangafoncier", icon: Facebook },
    { platform: "Twitter", url: "https://twitter.com/terangafoncier", icon: Twitter },
    { platform: "Instagram", url: "https://instagram.com/terangafoncier", icon: Instagram },
    { platform: "YouTube", url: "https://youtube.com/@terangafoncier", icon: Youtube },
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white relative overflow-hidden">
      {/* Particules de fond blockchain */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 border border-blue-500 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-24 h-24 border border-purple-500 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-32 w-16 h-16 border border-teal-500 rounded-full animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-16 w-20 h-20 border border-blue-500 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Section des statistiques blockchain */}
      <div className="border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent mb-2">
              🚀 Écosystème Blockchain en Temps Réel
            </h3>
            <p className="text-gray-300">Données vérifiées et transparentes</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {blockchainStats.map((stat, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-purple-400/30 transition-all duration-300 group">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg group-hover:scale-110 transition-transform">
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-xs text-gray-400 mb-2">{stat.label}</div>
                  <div className="text-xs text-green-400 font-semibold">{stat.trend}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section principale */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Logo et description blockchain */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <img 
                  src={logoUrl} 
                  alt="Teranga Foncier" 
                  className="w-12 h-12 rounded-lg"
                />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  Teranga Foncier
                </span>
                <div className="text-xs bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-semibold">
                  🔗 Blockchain Immobilier Sénégal
                </div>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              🚀 La première plateforme blockchain immobilière du Sénégal. Transactions sécurisées, 
              vérification automatisée et smart contracts pour un immobilier transparent et fiable.
            </p>

            {/* Badges de certification */}
            <div className="flex flex-wrap gap-2 mb-6">
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
                <Blocks className="w-3 h-3 mr-1" />
                Blockchain Verified
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 hover:bg-purple-500/30">
                <Cpu className="w-3 h-3 mr-1" />
                IA Powered
              </Badge>
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30 hover:bg-teal-500/30">
                <Shield className="w-3 h-3 mr-1" />
                Crypto Secure
              </Badge>
            </div>

            {/* Contact CEO avec thème blockchain */}
            <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/30 transition-all duration-300">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Rocket className="w-4 h-4 text-purple-400" />
                Contact CEO Blockchain
              </h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="text-white font-medium">Abdoulaye Diémé</div>
                    <div className="text-purple-300 text-xs">CEO & Blockchain Architect</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                  <a href="tel:+221775934241" className="text-gray-300 hover:text-blue-400 transition-colors">
                    +221 77 593 42 41
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-teal-500 rounded-full flex items-center justify-center">
                    <Mail className="h-4 w-4 text-white" />
                  </div>
                  <a href="mailto:contact@terangafoncier.com" className="text-gray-300 hover:text-purple-400 transition-colors">
                    contact@terangafoncier.com
                  </a>
                </div>
              </div>
            </div>

            {/* Réseaux sociaux blockchain */}
            <div>
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Globe className="w-4 h-4 text-teal-400" />
                Communauté Blockchain
              </h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/10 hover:border-purple-400/50 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 group"
                  >
                    <social.icon className="h-5 w-5 text-gray-300 group-hover:text-purple-400 transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Liens rapides blockchain */}
          {quickLinks.map((section, index) => (
            <div key={index} className="lg:col-span-1">
              <h3 className="font-semibold text-white mb-4 text-sm">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      to={link.path} 
                      className="group flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-all duration-300 text-sm"
                    >
                      {link.icon && (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <link.icon className="h-3 w-3 group-hover:scale-110 transition-transform" />
                        </div>
                      )}
                      <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
                      {link.badge && (
                        <Badge className="text-xs bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30">
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

      {/* Newsletter Blockchain */}
      <div className="border-t border-white/10 bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm relative z-10">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
              <Brain className="w-6 h-6 text-purple-400" />
              Newsletter Blockchain IA
            </h3>
            <p className="text-gray-300 text-sm">
              🚀 Recevez les dernières innovations blockchain, analyses IA du marché et opportunités exclusives
            </p>
          </div>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  placeholder="votre.email@blockchain.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
                />
              </div>
              <Button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Rejoindre
              </Button>
            </div>
            <p className="text-xs text-gray-400 mt-3 text-center">
              🔒 Vos données sont protégées par blockchain • Désabonnement en un clic
            </p>
          </div>
        </div>
      </div>

      {/* Copyright blockchain */}
      <div className="border-t border-white/10 bg-black/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-gray-400 text-sm flex items-center gap-2">
              <Blocks className="w-4 h-4 text-blue-400" />
              © {currentYear} Teranga Foncier Blockchain. Tous droits réservés. 
              <span className="mx-2">•</span>
              <span className="flex items-center gap-1">
                Fait avec 💜 au Sénégal 
                <Database className="w-3 h-3 text-purple-400 ml-1" />
              </span>
            </div>
            
            <div className="flex items-center gap-6 text-sm">
              <Link to="/legal" className="text-gray-400 hover:text-blue-400 transition-colors flex items-center gap-1">
                <FileCheck className="w-3 h-3" />
                Smart Contracts
              </Link>
              <Link to="/privacy" className="text-gray-400 hover:text-purple-400 transition-colors flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Crypto Privacy
              </Link>
              <Link to="/cookie-policy" className="text-gray-400 hover:text-teal-400 transition-colors flex items-center gap-1">
                <Cpu className="w-3 h-3" />
                IA Cookies
              </Link>
              <div className="flex items-center gap-2 text-gray-400">
                <div className="flex items-center gap-1">
                  <Shield className="h-3 w-3 text-green-400" />
                  <span className="text-xs">SSL Blockchain</span>
                </div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Site Ultra-Sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;