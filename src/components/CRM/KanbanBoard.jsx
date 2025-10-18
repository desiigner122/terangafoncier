import React, { useState } from 'react';
import { GripVertical, Plus, Trash2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const KanbanBoard = ({ deals = [], contacts = [], onMoveDeal, onEditDeal, onDeleteDeal, onAddDeal, isLoading = false }) => {
  const [draggedDeal, setDraggedDeal] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const stages = [
    'Prospection',
    'Qualification',
    'Proposition',
    'Négociation',
    'Fermeture',
  ];

  const stageColors = {
    Prospection: { bg: 'bg-blue-50', border: 'border-blue-200', label: 'bg-blue-100 text-blue-800' },
    Qualification: { bg: 'bg-purple-50', border: 'border-purple-200', label: 'bg-purple-100 text-purple-800' },
    Proposition: { bg: 'bg-yellow-50', border: 'border-yellow-200', label: 'bg-yellow-100 text-yellow-800' },
    Négociation: { bg: 'bg-orange-50', border: 'border-orange-200', label: 'bg-orange-100 text-orange-800' },
    Fermeture: { bg: 'bg-green-50', border: 'border-green-200', label: 'bg-green-100 text-green-800' },
  };

  const getContactName = (contactId) => {
    const contact = contacts.find((c) => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  const getDealsByStage = (stage) => {
    return deals.filter((deal) => deal.stage === stage);
  };

  const handleDragStart = (e, deal) => {
    setDraggedDeal(deal);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e, targetStage) => {
    e.preventDefault();

    if (!draggedDeal || draggedDeal.stage === targetStage) {
      setDraggedDeal(null);
      return;
    }

    try {
      await onMoveDeal(draggedDeal.id, targetStage);
    } catch (error) {
      console.error('Failed to move deal:', error);
    } finally {
      setDraggedDeal(null);
    }
  };

  const handleDeleteDeal = async (dealId) => {
    if (!window.confirm('Are you sure you want to delete this deal?')) {
      return;
    }

    setDeletingId(dealId);
    try {
      await onDeleteDeal(dealId);
    } catch (error) {
      console.error('Failed to delete deal:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('fr-SN', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-6 overflow-x-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Pipeline Kanban</h2>
          <button
            onClick={onAddDeal}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            <Plus size={20} />
            New Deal
          </button>
        </div>
        <p className="text-sm text-gray-600">
          Drag deals between stages to update their status
        </p>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-5 gap-4 min-w-full">
        <AnimatePresence>
          {stages.map((stage) => {
            const stageDeals = getDealsByStage(stage);
            const colors = stageColors[stage];

            return (
              <motion.div
                key={stage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className={`${colors.bg} border-2 ${colors.border} rounded-lg p-4 min-h-[600px] flex flex-col`}
              >
                {/* Stage Header */}
                <div className={`${colors.label} px-3 py-2 rounded-lg mb-4 text-center font-semibold text-sm`}>
                  {stage}
                </div>

                {/* Drop Zone */}
                <div
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, stage)}
                  className="flex-1 space-y-3 overflow-y-auto"
                >
                  <AnimatePresence>
                    {stageDeals.length === 0 ? (
                      <div className="flex items-center justify-center h-32 text-gray-400">
                        <p className="text-sm text-center">Drop deals here</p>
                      </div>
                    ) : (
                      stageDeals.map((deal) => (
                        <motion.div
                          key={deal.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          draggable
                          onDragStart={(e) => handleDragStart(e, deal)}
                          className={`bg-white border border-gray-200 rounded-lg p-3 cursor-move shadow-sm hover:shadow-md transition-all ${
                            draggedDeal?.id === deal.id ? 'opacity-50' : ''
                          }`}
                        >
                          {/* Drag Handle */}
                          <div className="flex items-start gap-2 mb-2">
                            <GripVertical size={16} className="text-gray-400 flex-shrink-0 mt-1" />
                            <div className="flex-1 min-w-0">
                              {/* Title */}
                              <h3 className="font-semibold text-gray-900 text-sm truncate">
                                {deal.title}
                              </h3>
                              {/* Contact */}
                              <p className="text-xs text-gray-600 truncate">
                                {getContactName(deal.contact_id)}
                              </p>
                            </div>
                          </div>

                          {/* Value & Probability */}
                          <div className="space-y-1 mb-3">
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">Value:</span>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(deal.value)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-600">Probability:</span>
                              <span className={`font-semibold ${
                                deal.probability >= 70
                                  ? 'text-green-600'
                                  : deal.probability >= 40
                                  ? 'text-yellow-600'
                                  : 'text-red-600'
                              }`}>
                                {deal.probability}%
                              </span>
                            </div>
                          </div>

                          {/* Expected Close Date */}
                          {deal.expected_close_date && (
                            <div className="text-xs text-gray-500 mb-3 pb-3 border-b border-gray-100">
                              {new Date(deal.expected_close_date).toLocaleDateString('fr-FR')}
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex gap-2">
                            <button
                              onClick={() => onEditDeal(deal)}
                              className="flex-1 px-2 py-1 text-xs bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors font-medium"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteDeal(deal.id)}
                              disabled={deletingId === deal.id}
                              className="px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            >
                              {deletingId === deal.id ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </AnimatePresence>
                </div>

                {/* Stage Stats */}
                <div className="mt-4 pt-4 border-t border-gray-300 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Deals: {stageDeals.length}</span>
                    <span>
                      Total:{' '}
                      {formatCurrency(
                        stageDeals.reduce((sum, deal) => sum + deal.value, 0)
                      )}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {isLoading && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg">
          <Loader2 size={18} className="animate-spin" />
          <span>Updating deals...</span>
        </div>
      )}
    </div>
  );
};

export default KanbanBoard;
