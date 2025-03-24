import React from 'react';
import PropTypes from 'prop-types';

const TabPanel = ({ tabs, activeTab, onTabChange, children }) => {
  return (
    <>
      <div className="flex mb-4" role="tablist">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`px-4 py-2 mr-2 rounded-t-lg transition-all duration-200 ${
              activeTab === tab.id 
              ? 'bg-white border-t border-l border-r border-gray-300 font-semibold' 
              : 'bg-gray-300 text-gray-600 hover:bg-gray-200'
            }`}
            onClick={() => onTabChange(tab.id)}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`${tab.id}-panel`}
            id={`${tab.id}-tab`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {children}
    </>
  );
};

TabPanel.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired
    })
  ).isRequired,
  activeTab: PropTypes.string.isRequired,
  onTabChange: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default TabPanel;
