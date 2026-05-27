import React from 'react';
import { Users, UserCheck, UserPlus, HelpCircle, Phone, MessageSquare, MapPin } from 'lucide-react';

const Dashboard = ({ leads }) => {
  const total = leads.length;
  const converted = leads.filter(l => l.status === 'Converted').length;
  const interested = leads.filter(l => l.status === 'Interested').length;
  
  // Calculate Conversion Rate
  const conversionRate = total > 0 ? Math.round((converted / total) * 100) : 0;

  // Calculate Source Distribution
  const callCount = leads.filter(l => l.source === 'Call').length;
  const whatsappCount = leads.filter(l => l.source === 'WhatsApp').length;
  const fieldCount = leads.filter(l => l.source === 'Field').length;

  const getPercentage = (count) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-grid">
        <div className="dashboard-card primary-gradient">
          <div className="card-icon-wrapper">
            <Users size={24} />
          </div>
          <div className="card-content">
            <h3>Total Leads</h3>
            <p className="card-value">{total}</p>
          </div>
        </div>

        <div className="dashboard-card success-gradient">
          <div className="card-icon-wrapper">
            <UserCheck size={24} />
          </div>
          <div className="card-content">
            <h3>Converted</h3>
            <p className="card-value">{converted}</p>
          </div>
        </div>

        <div className="dashboard-card warning-gradient">
          <div className="card-icon-wrapper">
            <UserPlus size={24} />
          </div>
          <div className="card-content">
            <h3>Interested</h3>
            <p className="card-value">{interested}</p>
          </div>
        </div>
      </div>

      <div className="analytics-section">
        {/* Conversion Rate Card */}
        <div className="analytics-card conversion-card">
          <div className="analytics-card-header">
            <h4>Conversion Efficiency</h4>
            <span className="badge-rate">{conversionRate}%</span>
          </div>
          <p className="subtitle">Percentage of leads successfully converted</p>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${conversionRate}%` }}
            ></div>
          </div>
          <div className="progress-details">
            <span>0%</span>
            <span>Target: 50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Source Distribution Card */}
        <div className="analytics-card sources-card">
          <h4>Lead Acquisition Channels</h4>
          <p className="subtitle">Where your leads are coming from</p>
          <div className="source-distribution">
            <div className="source-stat-item">
              <div className="source-label">
                <span className="source-icon-badge call-color"><Phone size={14} /></span>
                <span>Call ({callCount})</span>
              </div>
              <div className="source-percentage-bar">
                <div className="source-fill call-color-bg" style={{ width: `${getPercentage(callCount)}%` }}></div>
                <span className="source-percentage-text">{getPercentage(callCount)}%</span>
              </div>
            </div>

            <div className="source-stat-item">
              <div className="source-label">
                <span className="source-icon-badge whatsapp-color"><MessageSquare size={14} /></span>
                <span>WhatsApp ({whatsappCount})</span>
              </div>
              <div className="source-percentage-bar">
                <div className="source-fill whatsapp-color-bg" style={{ width: `${getPercentage(whatsappCount)}%` }}></div>
                <span className="source-percentage-text">{getPercentage(whatsappCount)}%</span>
              </div>
            </div>

            <div className="source-stat-item">
              <div className="source-label">
                <span className="source-icon-badge field-color"><MapPin size={14} /></span>
                <span>Field ({fieldCount})</span>
              </div>
              <div className="source-percentage-bar">
                <div className="source-fill field-color-bg" style={{ width: `${getPercentage(fieldCount)}%` }}></div>
                <span className="source-percentage-text">{getPercentage(fieldCount)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
