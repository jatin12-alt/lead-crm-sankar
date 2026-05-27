import React from 'react';
import { Search, Filter, Download } from 'lucide-react';

const SearchBar = ({ 
  searchTerm, 
  onSearchChange, 
  filterSource, 
  onFilterChange,
  onExportCSV 
}) => {
  return (
    <div className="search-bar-premium-container">
      <div className="search-inputs-group">
        <div className="search-input-wrapper-floating">
          <Search size={16} className="search-icon-svg" />
          <input 
            type="text" 
            placeholder="Search leads by name..." 
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="premium-search-input"
          />
        </div>
        
        <div className="filter-select-wrapper">
          <Filter size={14} className="filter-icon-svg" />
          <select 
            value={filterSource} 
            onChange={(e) => onFilterChange(e.target.value)}
            className="premium-filter-select"
          >
            <option value="All">All Acquisition Sources</option>
            <option value="Call">Calls</option>
            <option value="WhatsApp">WhatsApp Messages</option>
            <option value="Field">Field Operations</option>
          </select>
        </div>
      </div>

      <button className="btn-secondary-action" onClick={onExportCSV} title="Export Directory to Excel / CSV">
        <Download size={16} />
        <span>Export Directory</span>
      </button>
    </div>
  );
};

export default SearchBar;
