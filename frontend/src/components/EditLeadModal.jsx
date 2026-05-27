import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const EditLeadModal = ({ lead, isOpen, onClose, onUpdateLead }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Call',
    status: 'Interested',
    notes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        phone: lead.phone || '',
        email: lead.email || '',
        source: lead.source || 'Call',
        status: lead.status || 'Interested',
        notes: lead.notes || ''
      });
    }
  }, [lead]);

  if (!isOpen || !lead) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim() || !formData.source) {
      setError('Name, Phone, and Source are required fields.');
      return;
    }
    onUpdateLead(lead.id, formData);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Lead Details</h2>
          <button className="btn-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-name">Name *</label>
              <input
                type="text"
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="edit-phone">Phone *</label>
              <input
                type="text"
                id="edit-phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edit-email">Email Address</label>
              <input
                type="email"
                id="edit-email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@mail.com"
              />
            </div>
            <div className="form-group flex-row-layout">
              <div className="form-group-sub">
                <label htmlFor="edit-source">Source *</label>
                <select
                  id="edit-source"
                  name="source"
                  value={formData.source}
                  onChange={handleChange}
                >
                  <option value="Call">Call</option>
                  <option value="WhatsApp">WhatsApp</option>
                  <option value="Field">Field</option>
                </select>
              </div>
              <div className="form-group-sub">
                <label htmlFor="edit-status">Status *</label>
                <select
                  id="edit-status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Interested">Interested</option>
                  <option value="Not Interested">Not Interested</option>
                  <option value="Converted">Converted</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="edit-notes">Interaction Notes</label>
            <textarea
              id="edit-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Add key insights, next follow-up dates, or discussion summaries..."
            ></textarea>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              <Check size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeadModal;
