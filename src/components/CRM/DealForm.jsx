import React, { useState, useEffect } from 'react';
import { X, Loader2, AlertCircle, Calendar } from 'lucide-react';

const DealForm = ({ isOpen, onClose, deal = null, contacts = [], onSave, isLoading = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    contact_id: '',
    value: 0,
    stage: 'Prospection',
    probability: 0,
    expected_close_date: '',
    description: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [localLoading, setLocalLoading] = useState(false);

  const stages = [
    'Prospection',
    'Qualification',
    'Proposition',
    'Négociation',
    'Fermeture',
  ];

  // Populate form if editing an existing deal
  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title || '',
        contact_id: deal.contact_id || '',
        value: deal.value || 0,
        stage: deal.stage || 'Prospection',
        probability: deal.probability || 0,
        expected_close_date: deal.expected_close_date || '',
        description: deal.description || '',
        notes: deal.notes || '',
      });
    } else {
      resetForm();
    }
    setErrors({});
  }, [deal, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      contact_id: '',
      value: 0,
      stage: 'Prospection',
      probability: 0,
      expected_close_date: '',
      description: '',
      notes: '',
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Deal title is required';
    }

    if (!formData.contact_id) {
      newErrors.contact_id = 'Please select a contact';
    }

    if (formData.value < 0) {
      newErrors.value = 'Value cannot be negative';
    }

    if (formData.probability < 0 || formData.probability > 100) {
      newErrors.probability = 'Probability must be between 0 and 100';
    }

    if (formData.expected_close_date && isNaN(new Date(formData.expected_close_date).getTime())) {
      newErrors.expected_close_date = 'Invalid date format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'value' || name === 'probability'
          ? parseFloat(value) || 0
          : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLocalLoading(true);

    try {
      await onSave(formData, deal?.id);
      resetForm();
      onClose();
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to save deal' });
    } finally {
      setLocalLoading(false);
    }
  };

  if (!isOpen) return null;

  const loading = isLoading || localLoading;
  const isEditing = !!deal;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Deal' : 'New Deal'}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Submit Error */}
          {errors.submit && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
              <AlertCircle size={20} />
              <span>{errors.submit}</span>
            </div>
          )}

          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Title */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                disabled={loading}
                placeholder="e.g., Property Acquisition - Downtown Plot"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-1">{errors.title}</p>
              )}
            </div>

            {/* Contact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact *
              </label>
              <select
                name="contact_id"
                value={formData.contact_id}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                <option value="">Select a contact</option>
                {contacts.map((contact) => (
                  <option key={contact.id} value={contact.id}>
                    {contact.name} ({contact.company || 'N/A'})
                  </option>
                ))}
              </select>
              {errors.contact_id && (
                <p className="text-red-600 text-sm mt-1">{errors.contact_id}</p>
              )}
            </div>

            {/* Stage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pipeline Stage
              </label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>
                    {stage}
                  </option>
                ))}
              </select>
            </div>

            {/* Value */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deal Value (CFA)
              </label>
              <input
                type="number"
                name="value"
                value={formData.value}
                onChange={handleChange}
                disabled={loading}
                placeholder="0"
                min="0"
                step="1000"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {errors.value && (
                <p className="text-red-600 text-sm mt-1">{errors.value}</p>
              )}
            </div>

            {/* Probability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Win Probability (%)
              </label>
              <input
                type="number"
                name="probability"
                value={formData.probability}
                onChange={handleChange}
                disabled={loading}
                placeholder="0"
                min="0"
                max="100"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {errors.probability && (
                <p className="text-red-600 text-sm mt-1">{errors.probability}</p>
              )}
            </div>

            {/* Expected Close Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expected Close Date
              </label>
              <div className="relative">
                <Calendar
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                />
                <input
                  type="date"
                  name="expected_close_date"
                  value={formData.expected_close_date}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
              </div>
              {errors.expected_close_date && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.expected_close_date}
                </p>
              )}
            </div>
          </div>

          {/* Full Width Fields */}
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              disabled={loading}
              placeholder="Provide details about this deal..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              disabled={loading}
              placeholder="Internal notes about this deal..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:cursor-not-allowed resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Saving...
                </>
              ) : (
                isEditing ? 'Update Deal' : 'Create Deal'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DealForm;
