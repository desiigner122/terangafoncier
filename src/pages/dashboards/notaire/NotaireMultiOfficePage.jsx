import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Users, FileText, TrendingUp, Clock } from 'lucide-react';

const NotaireMultiOfficePage = () => {
  // Multi-bureaux : aucune table dédiée dans le schéma Supabase actuel.
  // Pas de fabrication de bureaux/statistiques : état honnête "bientôt disponible".
  const upcomingCapabilities = [
    {
      icon: Building2,
      title: 'Bureaux & succursales',
      description: 'Rattachez plusieurs études et succursales à un même compte notarial.'
    },
    {
      icon: Users,
      title: 'Équipes par bureau',
      description: 'Gérez notaires, clercs et assistants affectés à chaque bureau.'
    },
    {
      icon: FileText,
      title: 'Activité consolidée',
      description: 'Suivez les actes et dossiers de tous vos bureaux au même endroit.'
    },
    {
      icon: TrendingUp,
      title: 'Performance par bureau',
      description: 'Comparez le volume et les revenus de chaque bureau une fois les données disponibles.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <Building2 className="text-cyan-600" size={32} />
            Gestion Multi-Bureaux
          </h1>
          <p className="text-slate-600 mt-1">Pilotez tous vos bureaux depuis un seul tableau de bord</p>
        </div>
      </motion.div>

      {/* État "bientôt disponible" — pas de données réelles pour le multi-bureaux */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md border border-slate-200 p-10 text-center mb-6"
      >
        <div className="inline-flex items-center justify-center bg-cyan-100 p-4 rounded-2xl mb-4">
          <Clock className="text-cyan-600" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Bientôt disponible</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">
          La gestion multi-bureaux n'est pas encore activée sur votre espace. Cette fonctionnalité
          permettra de rattacher plusieurs études et d'en suivre l'activité dès qu'elle sera prête.
        </p>
        <span className="inline-flex items-center gap-2 mt-5 px-4 py-2 bg-slate-100 text-slate-500 rounded-full text-sm font-medium">
          Aucun bureau configuré
        </span>
      </motion.div>

      {/* Aperçu éditorial des capacités à venir (contenu statique, pas de métrique) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {upcomingCapabilities.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-md border border-slate-200"
          >
            <div className="bg-cyan-100 p-3 rounded-lg w-fit mb-3">
              <item.icon className="text-cyan-600" size={24} />
            </div>
            <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
            <p className="text-sm text-slate-600">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotaireMultiOfficePage;
