import React, { useState, useEffect } from 'react';
import { FaUsers, FaEye, FaEdit, FaBan, FaUserCheck, FaSearch, FaUserPlus, FaChartLine } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    dateRange: ''
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    newUsers: 0,
    bannedUsers: 0
  });

  // Charger les utilisateurs
  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, [currentPage, searchTerm, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Simulation des données utilisateurs
      const mockUsers = [
        {
          id: 1,
          first_name: 'Admin',
          last_name: 'Teranga',
          email: 'admin@teranga.com',
          phone: '+221 77 123 4567',
          role: 'admin',
          status: 'active',
          created_at: '2024-01-01T00:00:00Z',
          last_login: '2024-01-15T10:30:00Z',
          properties_count: 0,
          transactions_count: 25
        },
        {
          id: 2,
          first_name: 'Jean',
          last_name: 'Dupont',
          email: 'jean@example.com',
          phone: '+221 77 987 6543',
          role: 'particulier',
          status: 'active',
          created_at: '2024-01-10T00:00:00Z',
          last_login: '2024-01-14T15:45:00Z',
          properties_count: 3,
          transactions_count: 7
        },
        {
          id: 3,
          first_name: 'Marie',
          last_name: 'Martin',
          email: 'marie@agence.com',
          phone: '+221 76 555 4444',
          role: 'agence',
          status: 'active',
          created_at: '2024-01-05T00:00:00Z',
          last_login: '2024-01-13T09:20:00Z',
          properties_count: 12,
          transactions_count: 18
        },
        {
          id: 4,
          first_name: 'Pierre',
          last_name: 'Diallo',
          email: 'pierre@example.com',
          phone: '+221 78 111 2222',
          role: 'particulier',
          status: 'inactive',
          created_at: '2024-01-08T00:00:00Z',
          last_login: '2024-01-10T12:00:00Z',
          properties_count: 1,
          transactions_count: 2
        },
        {
          id: 5,
          first_name: 'Fatou',
          last_name: 'Sow',
          email: 'fatou@banque.com',
          phone: '+221 77 333 5555',
          role: 'banque',
          status: 'active',
          created_at: '2024-01-12T00:00:00Z',
          last_login: '2024-01-15T08:15:00Z',
          properties_count: 0,
          transactions_count: 45
        }
      ];

      // Filtrer selon les critères
      let filteredUsers = mockUsers;
      
      if (searchTerm) {
        filteredUsers = filteredUsers.filter(user => 
          user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (filters.role) {
        filteredUsers = filteredUsers.filter(user => user.role === filters.role);
      }

      if (filters.status) {
        filteredUsers = filteredUsers.filter(user => user.status === filters.status);
      }

      setUsers(filteredUsers);
      setTotalPages(Math.ceil(filteredUsers.length / 10));
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      // Simulation des statistiques
      setStats({
        totalUsers: 245,
        activeUsers: 189,
        newUsers: 12,
        bannedUsers: 3
      });
    } catch (error) {
      console.error('Erreur stats:', error);
    }
  };

  // Changer le statut d'un utilisateur
  const changeUserStatus = async (userId, newStatus) => {
    try {
      // Simulation de l'API call
      const updatedUsers = users.map(user => 
        user.id === userId ? { ...user, status: newStatus } : user
      );
      setUsers(updatedUsers);
      
      toast.success(`Utilisateur ${newStatus === 'active' ? 'activé' : 'désactivé'} avec succès`);
      
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de la modification du statut');
    }
  };

  // Ouvrir le modal utilisateur
  const openUserModal = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const getRoleBadge = (role) => {
    const badges = {
      'admin': 'bg-purple-100 text-purple-800',
      'agence': 'bg-blue-100 text-blue-800',
      'particulier': 'bg-green-100 text-green-800',
      'banque': 'bg-yellow-100 text-yellow-800'
    };

    return badges[role] || badges.particulier;
  };

  const getStatusBadge = (status) => {
    const badges = {
      'active': 'bg-green-100 text-green-800',
      'inactive': 'bg-gray-100 text-gray-800',
      'banned': 'bg-red-100 text-red-800'
    };

    return badges[status] || badges.inactive;
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <FaUserCheck className="w-4 h-4" />;
      case 'agence':
        return <FaUsers className="w-4 h-4" />;
      case 'banque':
        return <FaChartLine className="w-4 h-4" />;
      default:
        return <FaUsers className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des utilisateurs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600">
              Gérez les comptes utilisateurs et leurs permissions
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <FaUserPlus className="mr-2" />
              Nouvel utilisateur
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Utilisateurs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUsers className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs Actifs</p>
              <p className="text-2xl font-bold text-green-600">{stats.activeUsers}</p>
            </div>
            <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Nouveaux (30j)</p>
              <p className="text-2xl font-bold text-blue-600">{stats.newUsers}</p>
            </div>
            <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaUserPlus className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Utilisateurs Bannis</p>
              <p className="text-2xl font-bold text-red-600">{stats.bannedUsers}</p>
            </div>
            <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
              <FaBan className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres et recherche */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <select
            value={filters.role}
            onChange={(e) => setFilters({...filters, role: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="agence">Agence</option>
            <option value="particulier">Particulier</option>
            <option value="banque">Banque</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="banned">Banni</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters({...filters, dateRange: e.target.value})}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Toutes les dates</option>
            <option value="today">Aujourd'hui</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Utilisateurs ({users.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rôle
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Propriétés
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dernière connexion
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-medium text-sm">
                          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-xs text-gray-400">{user.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadge(user.role)}`}>
                      {getRoleIcon(user.role)}
                      <span className="ml-1 capitalize">{user.role}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(user.status)}`}>
                      {user.status === 'active' ? '🟢' : user.status === 'banned' ? '🔴' : '🟡'}
                      <span className="ml-1 capitalize">{user.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.properties_count} propriétés
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Jamais'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openUserModal(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <FaEye className="w-4 h-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <FaEdit className="w-4 h-4" />
                      </button>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => changeUserStatus(user.id, 'inactive')}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FaBan className="w-4 h-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => changeUserStatus(user.id, 'active')}
                          className="text-green-600 hover:text-green-900"
                        >
                          <FaUserCheck className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Précédent
              </button>
              
              <span className="text-sm text-gray-700">
                Page {currentPage} sur {totalPages}
              </span>
              
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Suivant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal détails utilisateur */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Détails de l'utilisateur
              </h3>
              <button
                onClick={() => setShowUserModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Informations personnelles</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Nom:</strong> {selectedUser.first_name} {selectedUser.last_name}</div>
                  <div><strong>Email:</strong> {selectedUser.email}</div>
                  <div><strong>Téléphone:</strong> {selectedUser.phone}</div>
                  <div><strong>Rôle:</strong> {selectedUser.role}</div>
                  <div><strong>Statut:</strong> {selectedUser.status}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-3">Activité</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Inscription:</strong> {new Date(selectedUser.created_at).toLocaleDateString()}</div>
                  <div><strong>Dernière connexion:</strong> {selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleDateString() : 'Jamais'}</div>
                  <div><strong>Propriétés:</strong> {selectedUser.properties_count}</div>
                  <div><strong>Transactions:</strong> {selectedUser.transactions_count}</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Modifier
              </button>
              <button
                onClick={() => setShowUserModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;