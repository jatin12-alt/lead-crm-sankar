import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import LeadForm from './components/LeadForm';
import LeadTable from './components/LeadTable';
import SearchBar from './components/SearchBar';
import EditLeadModal from './components/EditLeadModal';

const API_URL = 'http://localhost:5000/api/leads';

function App() {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSource, setFilterSource] = useState('All');
  const [loading, setLoading] = useState(true);
  
  // Modal Editing States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await axios.get(API_URL);
      setLeads(response.data);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (leadData) => {
    try {
      const response = await axios.post(API_URL, leadData);
      setLeads([response.data, ...leads]);
    } catch (error) {
      console.error('Error adding lead:', error);
      alert('Failed to add lead. Please check if the backend server is running.');
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, { status: newStatus });
      setLeads(leads.map(lead => lead.id === id ? response.data : lead));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleUpdateLeadDetails = async (id, updatedDetails) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedDetails);
      setLeads(leads.map(lead => lead.id === id ? response.data : lead));
    } catch (error) {
      console.error('Error updating lead details:', error);
      alert('Failed to update lead details.');
    }
  };

  const handleDeleteLead = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this lead?')) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        setLeads(leads.filter(lead => lead.id !== id));
      } catch (error) {
        console.error('Error deleting lead:', error);
      }
    }
  };

  const handleEditClick = (lead) => {
    setSelectedLead(lead);
    setIsEditModalOpen(true);
  };

  // Convert leads array to CSV file and trigger download
  const handleExportCSV = () => {
    if (leads.length === 0) {
      alert('There is no lead directory data available to export.');
      return;
    }

    const headers = ['ID', 'Name', 'Phone', 'Email', 'Source', 'Status', 'Notes', 'Created At'];
    const csvRows = [
      headers.join(','), // Header row
      ...leads.map(lead => {
        return [
          lead.id,
          `"${lead.name.replace(/"/g, '""')}"`,
          `"${lead.phone}"`,
          `"${lead.email || ''}"`,
          `"${lead.source}"`,
          `"${lead.status}"`,
          `"${(lead.notes || '').replace(/"/g, '""')}"`,
          `"${new Date(lead.created_at).toLocaleString()}"`
        ].join(',');
      })
    ];

    const csvContent = "data:text/csv;charset=utf-8," + csvRows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Leads_Directory_Export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter leads based on search term and source filter
  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSource = filterSource === 'All' || lead.source === filterSource;
    return matchesSearch && matchesSource;
  });

  return (
    <div className="app-container">
      <header className="app-header-premium">
        <div className="header-flex-wrapper">
          <div>
            <h1>Scale CRM</h1>
            <p className="header-subtitle">Intelligent Lead & Relationship Operations</p>
          </div>
          <div className="header-badge">
            <span className="live-pulse"></span>
            <span>Live Workspace</span>
          </div>
        </div>
      </header>
      
      <main className="app-main-premium">
        {loading ? (
          <div className="premium-loading-spinner">
            <div className="spinner-arc"></div>
            <span>Synchronizing Database...</span>
          </div>
        ) : (
          <>
            <Dashboard leads={leads} />
            
            <div className="crm-layout-grid">
              <div className="sidebar-form-panel">
                <LeadForm onAddLead={handleAddLead} />
              </div>
              
              <div className="main-directory-panel">
                <div className="directory-header-controls">
                  <h2>Operational Directory</h2>
                  <SearchBar 
                    searchTerm={searchTerm} 
                    onSearchChange={setSearchTerm}
                    filterSource={filterSource}
                    onFilterChange={setFilterSource}
                    onExportCSV={handleExportCSV}
                  />
                </div>
                
                <LeadTable 
                  leads={filteredLeads} 
                  onUpdateStatus={handleUpdateStatus}
                  onDeleteLead={handleDeleteLead}
                  onEditClick={handleEditClick}
                />
              </div>
            </div>
          </>
        )}
      </main>

      {/* Full Details & Edit Modal */}
      <EditLeadModal
        lead={selectedLead}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedLead(null);
        }}
        onUpdateLead={handleUpdateLeadDetails}
      />
    </div>
  );
}

export default App;
