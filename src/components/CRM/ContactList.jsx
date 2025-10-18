import React, { useState, useEffect } from 'react';
import {
  Edit2,
  Trash2,
  Eye,
  Mail,
  Phone,
  Plus,
  Search,
  Loader2,
  AlertCircle,
} from 'lucide-react';

const ContactList = ({
  contacts = [],
  isLoading = false,
  onEdit,
  onDelete,
  onAdd,
  onView,
}) => {
  const [filteredContacts, setFilteredContacts] = useState(contacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  // Extract unique statuses and roles from contacts
  const statuses = ['all', ...new Set(contacts.map((c) => c.status))];
  const roles = ['all', ...new Set(contacts.map((c) => c.role).filter(Boolean))];

  // Filter contacts based on search and filters
  useEffect(() => {
    let filtered = contacts;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (contact) =>
          contact.name.toLowerCase().includes(term) ||
          contact.email.toLowerCase().includes(term) ||
          contact.phone?.toLowerCase().includes(term) ||
          contact.company?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((contact) => contact.status === statusFilter);
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((contact) => contact.role === roleFilter);
    }

    setFilteredContacts(filtered);
  }, [contacts, searchTerm, statusFilter, roleFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to delete contact');
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      prospect: 'bg-blue-100 text-blue-800',
      lead: 'bg-yellow-100 text-yellow-800',
      client: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Contacts</h2>
          <button
            onClick={onAdd}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            New Contact
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search by name, email, phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {roles.map((role) => (
              <option key={role} value={role}>
                {role === 'all' ? 'All Roles' : role}
              </option>
            ))}
          </select>

          {/* Result Count */}
          <div className="flex items-center justify-end text-sm text-gray-600 px-4 py-2">
            {filteredContacts.length} of {contacts.length} contacts
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-blue-600" />
            <span className="ml-3 text-gray-600">Loading contacts...</span>
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                ? 'No contacts match your filters'
                : 'No contacts yet. Create your first contact!'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Company
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Score
                </th>
                <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredContacts.map((contact) => (
                <tr
                  key={contact.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* Name */}
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {contact.name}
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Mail size={16} />
                      {contact.email}
                    </a>
                  </td>

                  {/* Phone */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {contact.phone ? (
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-blue-600 hover:underline flex items-center gap-1"
                      >
                        <Phone size={16} />
                        {contact.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>

                  {/* Company */}
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {contact.company || '-'}
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                        contact.status
                      )}`}
                    >
                      {contact.status.charAt(0).toUpperCase() +
                        contact.status.slice(1)}
                    </span>
                  </td>

                  {/* Score */}
                  <td className="px-6 py-4 text-sm font-semibold">
                    <span className={getScoreColor(contact.score)}>
                      {contact.score || 0}/100
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => onView(contact.id)}
                        title="View"
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onEdit(contact)}
                        title="Edit"
                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(contact.id)}
                        disabled={deletingId === contact.id}
                        title="Delete"
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingId === contact.id ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ContactList;
