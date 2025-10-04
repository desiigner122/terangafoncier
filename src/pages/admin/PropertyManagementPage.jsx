import React, { useState, useEffect } from 'react';
import { FaHome, FaCheckCircle, FaTimesCircle, FaClock, FaUser, FaMapMarkerAlt, FaEye, FaEdit } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const PropertyManagementPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState('');
  const [comments, setComments] = useState('');

  // Charger les propriétés en attente
  useEffect(() => {
    fetchPendingProperties();
  }, [currentPage]);

  const fetchPendingProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/admin/properties/pending-approval?page=${currentPage}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (result.success) {
        setProperties(result.data);
        setTotalPages(result.meta.pagination.pages);
      } else {
        toast.error('Erreur lors du chargement des propriétés');
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  // Approuver/rejeter une propriété
  const handleApproval = async () => {
    if (!selectedProperty || !approvalAction) return;

    try {
      const response = await fetch(`http://localhost:3000/api/admin/properties/approve/${selectedProperty.id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: approvalAction,
          comments
        })
      });

      const result = await response.json();

      if (result.success) {
        toast.success(result.data.message);
        setShowApprovalModal(false);
        setSelectedProperty(null);
        setComments('');
        fetchPendingProperties(); // Recharger la liste
      } else {
        toast.error(result.error.message);
      }
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors de l\'approbation');
    }
  };

  // Ouvrir le modal d'approbation
  const openApprovalModal = (property, action) => {
    setSelectedProperty(property);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const getStatusBadge = (status) => {
    const badges = {
      'pending_approval': 'bg-yellow-100 text-yellow-800',
      'active': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800',
      'inactive': 'bg-gray-100 text-gray-800'
    };

    return badges[status] || badges.inactive;
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending_approval':
        return <FaClock className="w-4 h-4" />;
      case 'active':
        return <FaCheckCircle className="w-4 h-4" />;
      case 'rejected':
        return <FaTimesCircle className="w-4 h-4" />;
      default:
        return <FaClock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des propriétés...</p>
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
              Gestion des Propriétés
            </h1>
            <p className="text-gray-600">
              Approuvez ou rejetez les nouvelles propriétés soumises
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                En attente: {properties.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des propriétés */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Propriétés en attente d'approbation
          </h3>
        </div>

        {properties.length === 0 ? (
          <div className="p-8 text-center">
            <FaHome className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune propriété en attente
            </h3>
            <p className="text-gray-600">
              Toutes les propriétés ont été traitées.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {properties.map((property) => (
              <div key={property.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h4 className="text-lg font-semibold text-gray-900 mr-3">
                        {property.title}
                      </h4>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(property.status)}`}>
                        {getStatusIcon(property.status)}
                        <span className="ml-1">En attente</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <FaUser className="w-4 h-4 mr-2" />
                        {property.owner_first_name} {property.owner_last_name}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <FaMapMarkerAlt className="w-4 h-4 mr-2" />
                        {property.location}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Prix:</strong> {property.price?.toLocaleString()} FCFA
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Surface:</strong> {property.surface} m²
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Type:</strong> {property.type}
                      </div>
                      <div className="text-sm text-gray-600">
                        <strong>Soumis le:</strong> {new Date(property.created_at).toLocaleDateString()}
                      </div>
                    </div>

                    {property.description && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {property.description}
                        </p>
                      </div>
                    )}

                    <div className="flex items-center text-sm text-gray-500">
                      <span>Contact: {property.owner_email}</span>
                      {property.owner_phone && (
                        <span className="ml-4">Tél: {property.owner_phone}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 ml-6">
                    <button
                      onClick={() => openApprovalModal(property, 'approve')}
                      className="flex items-center px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <FaCheckCircle className="w-4 h-4 mr-2" />
                      Approuver
                    </button>
                    <button
                      onClick={() => openApprovalModal(property, 'reject')}
                      className="flex items-center px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
                    >
                      <FaTimesCircle className="w-4 h-4 mr-2" />
                      Rejeter
                    </button>
                    <button className="flex items-center px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                      <FaEye className="w-4 h-4 mr-2" />
                      Détails
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

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

      {/* Modal d'approbation */}
      {showApprovalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {approvalAction === 'approve' ? 'Approuver' : 'Rejeter'} la propriété
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Propriété: <strong>{selectedProperty?.title}</strong>
              </p>
              <p className="text-sm text-gray-600">
                Propriétaire: <strong>{selectedProperty?.owner_first_name} {selectedProperty?.owner_last_name}</strong>
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Commentaires {approvalAction === 'reject' && <span className="text-red-500">*</span>}
              </label>
              <textarea
                value={comments}
                onChange={(e) => setComments(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={
                  approvalAction === 'approve' 
                    ? "Commentaires optionnels..."
                    : "Expliquez la raison du rejet..."
                }
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedProperty(null);
                  setComments('');
                }}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleApproval}
                disabled={approvalAction === 'reject' && !comments.trim()}
                className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors ${
                  approvalAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {approvalAction === 'approve' ? 'Approuver' : 'Rejeter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagementPage;