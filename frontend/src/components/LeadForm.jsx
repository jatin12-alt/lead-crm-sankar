import React, { useState } from 'react';
import { UserPlus, User, Phone, Mail, FileText } from 'lucide-react';

const LeadForm = ({ onAddLead }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    source: 'Call',
    notes: ''
  });
  const [error, setError] = useState('');

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
    
    onAddLead(formData);
    setFormData({ name: '', phone: '', email: '', source: 'Call', notes: '' });
  };

  return (
    <div className="lead-form-container premium-card">
      <div className="card-header-with-icon">
        <div className="header-icon-badge">
          <UserPlus size={20} />
        </div>
        <div>
          <h2>Create New Lead</h2>
          <p className="card-subtext">Add details to register a fresh lead</p>
        </div>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="premium-form">
        <div className="form-group-floating">
          <label htmlFor="name"><User size={14} className="input-icon" /> Full Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="form-group-floating">
          <label htmlFor="phone"><Phone size={14} className="input-icon" /> Phone Number *</label>
          <input 
            type="text" 
            id="phone" 
            name="phone" 
            value={formData.phone} 
            onChange={handleChange}
            placeholder="+1 (234) 567-8900"
            required
          />
        </div>

        <div className="form-group-floating">
          <label htmlFor="email"><Mail size={14} className="input-icon" /> Email Address</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange}
            placeholder="john.doe@company.com"
          />
        </div>
        
        <div className="form-group-floating">
          <label htmlFor="source">Acquisition Source *</label>
          <select 
            id="source" 
            name="source" 
            value={formData.source} 
            onChange={handleChange}
          >
            <option value="Call">Call</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Field">Field</option>
          </select>
        </div>

        <div className="form-group-floating">
          <label htmlFor="notes"><FileText size={14} className="input-icon" /> Initial Interaction Notes</label>
          <textarea 
            id="notes" 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange}
            placeholder="Write details about their requirements, context, or budget details..."
            rows="3"
          ></textarea>
        </div>
        
        <button type="submit" className="btn-primary-gradient">
          <UserPlus size={18} /> Register Lead
        </button>
      </form>
    </div>
  );
};

export default LeadForm;
