import React from 'react';
import { X, Mail, Phone, MapPin, Briefcase, Calendar, Award, Tag } from 'lucide-react';

const ContactDetailsModal = ({ isOpen, onClose, contact = null }) => {
  if (!isOpen || !contact) return null;

  const getStatusColor = (status) => {
    const colors = {
      prospect: 'bg-blue-100 text-blue-800',
      lead: 'bg-yellow-100 text-yellow-800',
      client: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-green-600';
    if (score >= 60) return 'from-yellow-400 to-yellow-600';
    if (score >= 40) return 'from-orange-400 to-orange-600';
    return 'from-red-400 to-red-600';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6 flex items-start justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
              {contact.name?.charAt(0)?.toUpperCase() || 'C'}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{contact.name}</h2>
              <p className="text-blue-100 text-sm">{contact.company || 'Company not set'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition text-white"
            title="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Status & Score Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-gray-600 font-medium mb-3">Status</p>
              <span className={`inline-block px-4 py-2 rounded-lg font-semibold text-sm ${getStatusColor(contact.status)}`}>
                {contact.status.charAt(0).toUpperCase() + contact.status.slice(1)}
              </span>
            </div>

            {/* Score */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-gray-600 font-medium mb-3">Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-3 bg-gradient-to-r ${getScoreColor(contact.score)}`}
                      style={{ width: `${(contact.score || 0) / 100 * 100}%` }}
                    />
                  </div>
                </div>
                <span className="font-bold text-lg text-gray-900 min-w-fit">{contact.score || 0}/100</span>
              </div>
            </div>

            {/* Created Date */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6 border border-slate-200">
              <p className="text-sm text-gray-600 font-medium mb-3">Created</p>
              <p className="text-gray-900 font-medium">{formatDate(contact.created_at || new Date())}</p>
            </div>
          </div>

          {/* Contact Information */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contact.email && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Email</p>
                  <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline break-all">
                    {contact.email}
                  </a>
                </div>
              )}
              {contact.phone && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </p>
                  <a href={`tel:${contact.phone}`} className="text-blue-600 hover:underline">
                    {contact.phone}
                  </a>
                </div>
              )}
              {contact.location && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Location
                  </p>
                  <p className="text-gray-700">{contact.location}</p>
                </div>
              )}
              {contact.role && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2 flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    Role
                  </p>
                  <p className="text-gray-700">{contact.role}</p>
                </div>
              )}
            </div>
          </div>

          {/* Additional Details */}
          <div className="border-t border-slate-200 pt-6">
            <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-600" />
              Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contact.source && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Source</p>
                  <p className="text-gray-700 font-medium capitalize">{contact.source}</p>
                </div>
              )}
              {contact.source && (
                <div>
                  <p className="text-sm text-gray-600 font-medium mb-2">Type</p>
                  <p className="text-gray-700 font-medium capitalize">{contact.source}</p>
                </div>
              )}
            </div>
          </div>

          {/* Interests */}
          {contact.interests && contact.interests.length > 0 && (
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-purple-600" />
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {contact.interests.map((interest, i) => (
                  <span key={i} className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-medium text-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {contact.tags && contact.tags.length > 0 && (
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <Tag className="w-5 h-5 text-indigo-600" />
                Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag, i) => (
                  <span key={i} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full font-medium text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {contact.notes && (
            <div className="border-t border-slate-200 pt-6">
              <h3 className="font-bold text-lg text-gray-900 mb-4">Notes</h3>
              <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{contact.notes}</p>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="border-t border-slate-200 pt-6">
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition shadow-lg hover:shadow-xl"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactDetailsModal;
