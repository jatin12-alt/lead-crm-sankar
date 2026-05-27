import React, { useState } from 'react';
import { Trash2, Edit, ChevronDown, ChevronUp, Phone, Mail, MessageSquare, Calendar, FileText } from 'lucide-react';

const LeadTable = ({ leads, onUpdateStatus, onDeleteLead, onEditClick }) => {
  const [expandedRows, setExpandedRows] = useState({});

  const toggleRow = (id) => {
    setExpandedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Get initials for Avatar
  const getInitials = (name) => {
    if (!name) return 'L';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Generate nice avatar background color based on name string hash
  const getAvatarBgColor = (name) => {
    const colors = [
      '#6366f1', // Indigo
      '#ec4899', // Pink
      '#f59e0b', // Amber
      '#10b981', // Emerald
      '#3b82f6', // Blue
      '#8b5cf6', // Violet
      '#f43f5e', // Rose
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // Clean phone number for WhatsApp linking
  const cleanPhone = (phone) => {
    return phone.replace(/[^\d+]/g, '');
  };

  if (leads.length === 0) {
    return (
      <div className="empty-state premium-card">
        <div className="empty-icon-badge">🔍</div>
        <h3>No matching leads found</h3>
        <p>Try adjusting your search criteria or register a new lead using the form.</p>
      </div>
    );
  }

  return (
    <div className="table-container premium-card">
      <table className="lead-table">
        <thead>
          <tr>
            <th></th>
            <th>Lead Profile</th>
            <th>Contact Channels</th>
            <th>Acquisition Channel</th>
            <th>Lead Status</th>
            <th className="actions-header">Quick Tools</th>
          </tr>
        </thead>
        <tbody>
          {leads.map(lead => {
            const isExpanded = expandedRows[lead.id];
            const cleanPhoneNumber = cleanPhone(lead.phone);
            
            return (
              <React.Fragment key={lead.id}>
                {/* Main Row */}
                <tr className={`lead-row ${isExpanded ? 'row-expanded-active' : ''}`}>
                  <td className="expander-cell" onClick={() => toggleRow(lead.id)}>
                    <button className="btn-toggle-row">
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </td>
                  
                  <td className="profile-cell" onClick={() => toggleRow(lead.id)}>
                    <div className="lead-profile-wrapper">
                      <div 
                        className="profile-avatar" 
                        style={{ backgroundColor: getAvatarBgColor(lead.name) }}
                      >
                        {getInitials(lead.name)}
                      </div>
                      <div className="profile-info">
                        <span className="profile-name">{lead.name}</span>
                        {lead.email ? (
                          <span className="profile-email">{lead.email}</span>
                        ) : (
                          <span className="profile-email-placeholder">No Email provided</span>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="contact-cell">
                    <div className="contact-actions-row">
                      {/* Call Action */}
                      <a 
                        href={`tel:${cleanPhoneNumber}`} 
                        className="contact-action-btn phone-link" 
                        title="Click to Call"
                      >
                        <Phone size={14} />
                        <span>{lead.phone}</span>
                      </a>
                      
                      {/* WhatsApp Action */}
                      <a 
                        href={`https://wa.me/${cleanPhoneNumber.startsWith('+') ? cleanPhoneNumber : `+91${cleanPhoneNumber}`}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="contact-action-btn whatsapp-link" 
                        title="Open WhatsApp Chat"
                      >
                        <MessageSquare size={14} />
                      </a>
                      
                      {/* Email Action */}
                      {lead.email && (
                        <a 
                          href={`mailto:${lead.email}`} 
                          className="contact-action-btn email-link" 
                          title="Send Email"
                        >
                          <Mail size={14} />
                        </a>
                      )}
                    </div>
                  </td>
                  
                  <td>
                    <span className={`source-badge badge-${lead.source.toLowerCase()}`}>
                      {lead.source}
                    </span>
                  </td>
                  
                  <td>
                    <select 
                      className={`status-select status-${lead.status.replace(/\s+/g, '-').toLowerCase()}`}
                      value={lead.status}
                      onChange={(e) => onUpdateStatus(lead.id, e.target.value)}
                    >
                      <option value="Interested">Interested</option>
                      <option value="Not Interested">Not Interested</option>
                      <option value="Converted">Converted</option>
                    </select>
                  </td>
                  
                  <td className="actions-cell">
                    <div className="action-button-group">
                      <button 
                        className="btn-icon btn-edit" 
                        onClick={() => onEditClick(lead)}
                        title="Edit Details"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        className="btn-icon btn-danger" 
                        onClick={() => onDeleteLead(lead.id)}
                        title="Delete Lead"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>

                {/* Expanded Details Row */}
                {isExpanded && (
                  <tr className="expanded-details-row">
                    <td colSpan="6">
                      <div className="expanded-details-container">
                        <div className="details-header-row">
                          <span className="details-label"><FileText size={14} /> Interaction Log & Notes</span>
                          <span className="details-date">
                            <Calendar size={14} /> Added on: {new Date(lead.created_at).toLocaleDateString(undefined, { 
                              year: 'numeric', 
                              month: 'short', 
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="details-notes-card">
                          {lead.notes ? (
                            <p className="notes-content">{lead.notes}</p>
                          ) : (
                            <p className="notes-placeholder">No interaction logs have been registered for this lead yet. You can add notes by clicking the Edit button.</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default LeadTable;
