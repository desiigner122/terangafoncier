import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Video, 
  Plus, 
  Calendar,
  Users,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  Monitor,
  Settings,
  Clock,
  BarChart
} from 'lucide-react';
import { useAuth } from '@/contexts/UnifiedAuthContext';
import NotaireSupabaseService from '@/services/NotaireSupabaseService';

const NotaireVisioPage = () => {
  const { user } = useAuth();
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [scheduledMeetings, setScheduledMeetings] = useState([]);
  const [meetingHistory, setMeetingHistory] = useState([]);
  const [stats, setStats] = useState({
    totalMeetings: 0,
    totalHours: 0,
    avgParticipants: 0,
    recordings: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) loadVisioData();
  }, [user]);

  const loadVisioData = async () => {
    setIsLoading(true);
    try {
      const result = await NotaireSupabaseService.getVideoMeetings(user.id);
      if (result.success) {
        const meetings = result.data || [];
        
        // Separate scheduled and past meetings
        const now = new Date();
        const scheduled = meetings.filter(m => new Date(m.date) >= now);
        const history = meetings.filter(m => new Date(m.date) < now);
        
        setScheduledMeetings(scheduled);
        setMeetingHistory(history);
        
        // Calculate stats
        const totalMeetings = history.length;
        const totalMinutes = history.reduce((sum, m) => sum + (m.duration || 0), 0);
        const totalParticipants = history.reduce((sum, m) => sum + (m.participants_count || 0), 0);
        const recordings = history.filter(m => m.has_recording).length;
        
        setStats({
          totalMeetings: totalMeetings,
          totalHours: Math.round(totalMinutes / 60),
          avgParticipants: totalMeetings > 0 ? (totalParticipants / totalMeetings).toFixed(1) : 0,
          recordings: recordings
        });
      }
    } catch (error) {
      console.error('Erreur chargement Visio:', error);
      setScheduledMeetings([]);
      setMeetingHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const statsDisplay = [
    { label: 'Réunions ce mois', value: stats.totalMeetings, icon: Calendar, color: 'blue' },
    { label: 'Heures totales', value: stats.totalHours, icon: Clock, color: 'green' },
    { label: 'Participants moyens', value: stats.avgParticipants, icon: Users, color: 'purple' },
    { label: 'Enregistrements', value: stats.recordings, icon: Video, color: 'red' }
  ];

  const startInstantMeeting = () => {
    setIsInMeeting(true);
  };

  const endMeeting = () => {
    setIsInMeeting(false);
    setAudioEnabled(true);
    setVideoEnabled(true);
    setScreenSharing(false);
  };

  if (isInMeeting) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col">
        {/* Video Area */}
        <div className="flex-1 relative">
          {/* Main video */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <Video size={64} className="mx-auto mb-4 opacity-50" />
                <p className="text-lg opacity-75">Réunion en cours...</p>
                {!videoEnabled && <p className="text-sm opacity-50 mt-2">Caméra désactivée</p>}
              </div>
            </div>
          </div>

          {/* Participant thumbnails */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            {[1, 2].map((participant) => (
              <div key={participant} className="w-32 h-24 bg-slate-700 rounded-lg border-2 border-slate-600 flex items-center justify-center">
                <Users size={24} className="text-slate-400" />
              </div>
            ))}
          </div>

          {/* Meeting info */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 backdrop-blur-sm text-white px-4 py-2 rounded-lg">
            <p className="text-sm">Réunion instantanée</p>
            <p className="text-xs opacity-75">2 participants</p>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-800 p-6">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-4 rounded-full transition-all ${
                audioEnabled
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {audioEnabled ? (
                <Mic size={24} className="text-white" />
              ) : (
                <MicOff size={24} className="text-white" />
              )}
            </button>

            <button
              onClick={() => setVideoEnabled(!videoEnabled)}
              className={`p-4 rounded-full transition-all ${
                videoEnabled
                  ? 'bg-slate-700 hover:bg-slate-600'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {videoEnabled ? (
                <Video size={24} className="text-white" />
              ) : (
                <VideoOff size={24} className="text-white" />
              )}
            </button>

            <button
              onClick={() => setScreenSharing(!screenSharing)}
              className={`p-4 rounded-full transition-all ${
                screenSharing
                  ? 'bg-blue-600 hover:bg-blue-700'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
            >
              <Monitor size={24} className="text-white" />
            </button>

            <button
              onClick={endMeeting}
              className="p-4 rounded-full bg-red-600 hover:bg-red-700 transition-all"
            >
              <PhoneOff size={24} className="text-white" />
            </button>

            <button className="p-4 rounded-full bg-slate-700 hover:bg-slate-600 transition-all">
              <Settings size={24} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
              <Video className="text-blue-600" size={32} />
              Visioconférence
            </h1>
            <p className="text-slate-600 mt-1">
              Organisez et rejoignez des réunions virtuelles
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={startInstantMeeting}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Video size={20} />
            Réunion instantanée
          </motion.button>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {statsDisplay.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-4 shadow-md border border-slate-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">{stat.label}</p>
                <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
              </div>
              <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                <stat.icon className={`text-${stat.color}-600`} size={24} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Réunions planifiées */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-md border border-slate-200 p-6 mb-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Calendar size={24} className="text-blue-600" />
            Réunions Planifiées
          </h2>
          <button className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm font-medium">
            <Plus size={18} />
            Planifier une réunion
          </button>
        </div>
        
        <div className="space-y-3">
          {scheduledMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="border-2 border-slate-200 rounded-lg p-4 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 mb-2">{meeting.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600">
                    <span className="flex items-center gap-1">
                      <Calendar size={16} />
                      {new Date(meeting.date).toLocaleDateString('fr-FR')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={16} />
                      {meeting.time} ({meeting.duration} min)
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={16} />
                      {meeting.participants.length} participants
                    </span>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Rejoindre
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Historique */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-md border border-slate-200 p-6"
      >
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Clock size={24} className="text-slate-600" />
          Historique des Réunions
        </h2>
        
        <div className="space-y-3">
          {meetingHistory.map((meeting) => (
            <div
              key={meeting.id}
              className="border border-slate-200 rounded-lg p-4 hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-800">{meeting.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mt-1">
                    <span>{new Date(meeting.date).toLocaleDateString('fr-FR')}</span>
                    <span>{meeting.duration} min</span>
                    <span>{meeting.participants} participants</span>
                    {meeting.recording && (
                      <span className="text-red-600 flex items-center gap-1">
                        <Video size={14} />
                        Enregistré
                      </span>
                    )}
                  </div>
                </div>
                {meeting.recording && (
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Voir l'enregistrement
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default NotaireVisioPage;
