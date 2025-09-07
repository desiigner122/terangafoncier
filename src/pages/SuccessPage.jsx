import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { 
  CheckCircle, 
  ArrowRight, 
  Home, 
  Phone, 
  Mail, 
  MessageCircle,
  Download,
  FileText,
  Calendar,
  Users
} from 'lucide-react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  const nextSteps = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Confirmation par email",
      description: "Vous recevrez un email de confirmation dans les 5 prochaines minutes",
      action: "Vérifier votre boîte mail"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Appel de suivi",
      description: "Notre équipe vous contactera sous 24h pour finaliser votre demande",
      action: "Gardez votre téléphone à portée"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Documentation",
      description: "Préparez vos documents pour accélérer le processus",
      action: "Télécharger la checklist"
    },
    {
      icon: <Calendar className="w-6 h-6" />,
      title: "Rendez-vous",
      description: "Un rendez-vous sera programmé selon votre disponibilité",
      action: "Consulter votre agenda"
    }
  ];

  const quickActions = [
    {
      icon: <Home className="w-5 h-5" />,
      title: "Retour à l'accueil",
      description: "Explorez d'autres opportunités",
      link: "/",
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Nos partenaires",
      description: "Découvrez notre réseau",
      link: "/partners",
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <MessageCircle className="w-5 h-5" />,
      title: "Support client",
      description: "Besoin d'aide immédiate ?",
      link: "/contact",
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Guide d'achat",
      description: "Téléchargez notre guide complet",
      link: "/guides",
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white">
      <Helmet>
        <title>Demande envoyée avec succès ! | Teranga Foncier</title>
        <meta name="description" content="Votre demande a été envoyée avec succès. Notre équipe vous contactera sous 24h pour vous accompagner dans votre projet foncier." />
      </Helmet>

      <motion.div 
        className="container mx-auto px-4 py-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <motion.div 
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.div
            className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-8"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Félicitations !
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-4 max-w-3xl mx-auto">
            Votre demande a été envoyée avec succès
          </p>
          
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Notre équipe d'experts en immobilier foncier vous contactera sous <span className="font-semibold text-green-600">24 heures</span> pour vous accompagner dans votre projet.
          </p>
        </motion.div>

        {/* Prochaines étapes */}
        <motion.div 
          className="mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Prochaines étapes
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {nextSteps.map((step, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4 mx-auto">
                  <div className="text-blue-600">
                    {step.icon}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-center text-sm">
                  {step.description}
                </p>
                
                <div className="text-center">
                  <span className="inline-flex items-center text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {step.action}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Actions rapides */}
        <motion.div 
          className="mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            En attendant, explorez
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="group block"
              >
                <motion.div
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full"
                  variants={itemVariants}
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <div className={`flex items-center justify-center w-12 h-12 ${action.color} rounded-xl mb-4 mx-auto text-white transition-colors`}>
                    {action.icon}
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center group-hover:text-blue-600 transition-colors">
                    {action.title}
                  </h3>
                  
                  <p className="text-gray-600 text-center text-sm mb-4">
                    {action.description}
                  </p>
                  
                  <div className="flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Contact d'urgence */}
        <motion.div 
          className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-center text-white"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-bold mb-4">
            Besoin d'une assistance immédiate ?
          </h3>
          
          <p className="text-lg mb-6 opacity-90">
            Notre équipe est disponible pour répondre à toutes vos questions
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="tel:+221775934241"
              className="inline-flex items-center gap-2 bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              <Phone className="w-5 h-5" />
              +221 77 593 42 41
            </a>
            
            <a 
              href="mailto:contact@terangafoncier.com"
              className="inline-flex items-center gap-2 bg-white bg-opacity-20 text-white px-6 py-3 rounded-xl font-semibold hover:bg-opacity-30 transition-colors"
            >
              <Mail className="w-5 h-5" />
              contact@terangafoncier.com
            </a>
          </div>
        </motion.div>

        {/* Message de remerciement */}
        <motion.div 
          className="text-center mt-12"
          variants={itemVariants}
        >
          <p className="text-lg text-gray-600">
            Merci de votre confiance en 
            <span className="font-semibold text-blue-600"> Teranga Foncier</span>
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Votre partenaire de confiance pour l'immobilier foncier au Sénégal
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
