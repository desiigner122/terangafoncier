import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, 
  Search, 
  Book, 
  FileText, 
  Video, 
  MessageCircle,
  ChevronDown,
  ChevronRight,
  Mail,
  Phone
} from 'lucide-react';

const NotaireHelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [expandedFAQ, setExpandedFAQ] = useState(null);

  const categories = [
    { id: 'all', name: 'Tout', icon: Book },
    { id: 'getting-started', name: 'Démarrage', icon: FileText },
    { id: 'features', name: 'Fonctionnalités', icon: Video },
    { id: 'billing', name: 'Facturation', icon: FileText },
    { id: 'technical', name: 'Technique', icon: HelpCircle }
  ];

  const articles = [
    {
      id: 1,
      title: 'Guide de démarrage rapide',
      category: 'getting-started',
      content: 'Ce guide vous aidera à configurer votre compte et à commencer à utiliser la plateforme.',
      readTime: '5 min',
      views: 1234
    },
    {
      id: 2,
      title: 'Comment créer un acte notarié',
      category: 'features',
      content: 'Tutoriel complet pour créer et gérer vos actes notariés sur la plateforme.',
      readTime: '10 min',
      views: 2456
    },
    {
      id: 3,
      title: 'Comprendre la facturation',
      category: 'billing',
      content: 'Tout ce que vous devez savoir sur la facturation et les abonnements.',
      readTime: '7 min',
      views: 567
    }
  ];

  const faqItems = [
    {
      id: 1,
      question: 'Comment réinitialiser mon mot de passe ?',
      answer: 'Cliquez sur "Mot de passe oublié" sur la page de connexion, puis suivez les instructions envoyées par email.'
    },
    {
      id: 2,
      question: 'Puis-je ajouter plusieurs utilisateurs ?',
      answer: 'Oui, selon votre plan d\'abonnement. Le plan Pro permet jusqu\'à 10 utilisateurs.'
    },
    {
      id: 3,
      question: 'Comment exporter mes données ?',
      answer: 'Rendez-vous dans Paramètres > Export de données pour télécharger toutes vos données.'
    }
  ];

  const videoTutorials = [
    {
      id: 1,
      title: 'Introduction à la plateforme',
      duration: '5:30',
      thumbnail: '/videos/intro.jpg'
    },
    {
      id: 2,
      title: 'Gestion des clients avec le CRM',
      duration: '12:45',
      thumbnail: '/videos/crm.jpg'
    },
    {
      id: 3,
      title: 'Utilisation de la blockchain',
      duration: '8:20',
      thumbnail: '/videos/blockchain.jpg'
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <HelpCircle className="text-blue-600" size={32} />
          Centre d'Aide
        </h1>
        <p className="text-slate-600 mt-1">
          Documentation, tutoriels et FAQ
        </p>
      </motion.div>

      {/* Barre de recherche */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Rechercher dans l'aide..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg shadow-lg"
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-md border border-slate-200 p-4"
          >
            <h3 className="font-semibold text-slate-800 mb-4">Catégories</h3>
            <div className="space-y-2">
              {categories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{category.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200">
              <h3 className="font-semibold text-slate-800 mb-4">Besoin d'aide ?</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
                  <Mail size={18} />
                  <span className="text-sm">Envoyer un email</span>
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
                  <Phone size={18} />
                  <span className="text-sm">Appeler le support</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Contenu principal */}
        <div className="lg:col-span-3 space-y-6">
          {/* Articles */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-md border border-slate-200 p-6"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Book size={24} className="text-blue-600" />
              Articles d'aide
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredArticles.map((article) => (
                <motion.div
                  key={article.id}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedArticle(article)}
                  className="p-4 border-2 border-slate-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                >
                  <h3 className="font-semibold text-slate-800 mb-2">{article.title}</h3>
                  <p className="text-sm text-slate-600 mb-3">{article.content}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>{article.readTime} de lecture</span>
                    <span>{article.views} vues</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-md border border-slate-200 p-6"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <MessageCircle size={24} className="text-blue-600" />
              Questions Fréquentes
            </h2>
            <div className="space-y-3">
              {faqItems.map((faq) => (
                <div
                  key={faq.id}
                  className="border border-slate-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="font-medium text-slate-800 text-left">{faq.question}</span>
                    {expandedFAQ === faq.id ? (
                      <ChevronDown size={20} className="text-slate-600" />
                    ) : (
                      <ChevronRight size={20} className="text-slate-600" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="p-4 bg-white">
                      <p className="text-slate-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tutoriels Vidéo */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-md border border-slate-200 p-6"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Video size={24} className="text-blue-600" />
              Tutoriels Vidéo
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {videoTutorials.map((video) => (
                <motion.div
                  key={video.id}
                  whileHover={{ scale: 1.05 }}
                  className="cursor-pointer group"
                >
                  <div className="relative bg-slate-200 rounded-lg aspect-video mb-2 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 group-hover:bg-opacity-60 transition-all">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                        <Video size={32} className="text-blue-600 ml-1" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <h3 className="font-semibold text-slate-800 text-sm">{video.title}</h3>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal Article */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-8 max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-4">{selectedArticle.title}</h2>
            <div className="flex items-center gap-4 text-sm text-slate-600 mb-6">
              <span>{selectedArticle.readTime} de lecture</span>
              <span>•</span>
              <span>{selectedArticle.views} vues</span>
            </div>
            <div className="prose max-w-none">
              <p className="text-slate-700 leading-relaxed">{selectedArticle.content}</p>
            </div>
            <button
              onClick={() => setSelectedArticle(null)}
              className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Fermer
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default NotaireHelpPage;
