import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Play, Award, Clock, Star, ChevronRight, Download } from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';

const NotaireELearningPage = () => {
  const { user } = useAuth();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    hoursCompleted: 0,
    certificates: 0,
    inProgress: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) loadELearningData();
  }, [user]);

  const loadELearningData = async () => {
    setIsLoading(true);
    try {
      // Load available courses
      const coursesResult = await NotaireSupabaseService.getELearningCourses();
      if (coursesResult.success) {
        setCourses(coursesResult.data || []);
      }

      // Load user's enrollments
      const enrollmentsResult = await NotaireSupabaseService.getCourseEnrollments(user.id);
      if (enrollmentsResult.success) {
        const enrollmentsData = enrollmentsResult.data || [];
        setEnrollments(enrollmentsData);
        
        // Calculate stats
        const inProgress = enrollmentsData.filter(e => e.progress > 0 && e.progress < 100).length;
        const completed = enrollmentsData.filter(e => e.progress === 100).length;
        const totalHours = enrollmentsData.reduce((sum, e) => sum + (e.hours_completed || 0), 0);
        
        setStats({
          coursesEnrolled: enrollmentsData.length,
          hoursCompleted: totalHours,
          certificates: completed,
          inProgress: inProgress
        });
      }
    } catch (error) {
      console.error('Erreur chargement E-Learning:', error);
      setCourses([]);
      setEnrollments([]);
    } finally {
      setIsLoading(false);
    }
  };

  const statsDisplay = [
    { label: 'Cours suivis', value: stats.coursesEnrolled, color: 'blue' },
    { label: 'Heures complétées', value: stats.hoursCompleted, color: 'green' },
    { label: 'Certifications', value: stats.certificates, color: 'purple' },
    { label: 'En cours', value: stats.inProgress, color: 'orange' }
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {courses.map((course, index) => (
          <motion.div key={course.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-all">
            <div className="h-40 bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center">
              <Play size={48} className="text-white" />
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between mb-2">
                <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded">{course.category}</span>
                <div className="flex items-center gap-1">
                  <Star size={16} className="text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{course.rating}</span>
                </div>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">{course.title}</h3>
              <p className="text-sm text-slate-600 mb-3">{course.instructor}</p>
              <div className="flex items-center gap-4 text-xs text-slate-600 mb-4">
                <span className="flex items-center gap-1"><Clock size={14} />{course.duration}</span>
                <span>{course.lessons} leçons</span>
                <span>{course.level}</span>
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
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-slate-800">{course.price.toLocaleString()} FCFA</span>
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2">
                  {course.progress > 0 ? 'Continuer' : 'Commencer'}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default NotaireELearningPage;
