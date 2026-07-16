import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Clock, Star, ChevronRight, Users } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import { supabase } from '@/lib/supabaseClient';

const NotaireELearningPage = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) loadELearningData();
  }, [user]);

  const loadELearningData = async () => {
    setIsLoading(true);
    try {
      // Cours de formation (table réelle elearning_courses)
      const { data, error } = await supabase
        .from('elearning_courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Erreur chargement E-Learning:', error);
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  };

  // NOTE: le suivi de progression personnel (heures, certifications, cours en cours)
  // n'a pas encore de table dédiée -> on affiche uniquement les métriques réelles
  // disponibles et un état honnête pour le reste.
  const statsDisplay = [
    { label: 'Cours disponibles', value: courses.length },
    { label: 'Heures de formation', value: '—' },
    { label: 'Certifications', value: '—' },
    { label: 'En cours', value: '—' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
          <BookOpen className="text-purple-600" size={32} />
          E-Learning & Formation
        </h1>
        <p className="text-slate-600 mt-1">Développez vos compétences professionnelles</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statsDisplay.map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl p-4 shadow-md">
            <p className="text-sm text-slate-600">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Cours */}
      {isLoading ? (
        <div className="bg-white rounded-xl p-12 shadow-md text-center text-slate-500">
          Chargement des formations...
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-xl p-12 shadow-md text-center">
          <BookOpen size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-700 font-semibold">Aucune formation disponible pour le moment</p>
          <p className="text-slate-500 text-sm mt-1">Le catalogue de cours sera bientôt disponible.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {courses.map((course, index) => (
            <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all">
              <div className="h-40 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center overflow-hidden">
                {course.image_url ? (
                  <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
                ) : (
                  <Play size={48} className="text-white" />
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  {course.category && (
                    <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded">{course.category}</span>
                  )}
                  {course.rating != null && (
                    <div className="flex items-center gap-1">
                      <Star size={16} className="text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold">{course.rating}</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">{course.title}</h3>
                {course.instructor && <p className="text-sm text-slate-600 mb-3">{course.instructor}</p>}
                <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                  {course.duration != null && <span className="flex items-center gap-1"><Clock size={14} />{course.duration} h</span>}
                  {course.modules_count != null && <span>{course.modules_count} modules</span>}
                  {course.difficulty && <span>{course.difficulty}</span>}
                  {course.students_count != null && <span className="flex items-center gap-1"><Users size={14} />{course.students_count}</span>}
                </div>
                {course.progress > 0 && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-600">Progression</span>
                      <span className="font-semibold">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                )}
                <div className="flex items-center justify-end">
                  <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                    {course.progress > 0 ? 'Continuer' : 'Commencer'}
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotaireELearningPage;
