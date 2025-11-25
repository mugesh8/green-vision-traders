import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreVertical, Eye, Edit, Trash2 } from 'lucide-react';
import ConfirmDeleteModal from '../../common/ConfirmDeleteModal';
import { getAllThirdParties } from '../../../api/thirdPartyApi';

const ThirdPartyManagement = () => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, thirdPartyId: null, thirdPartyName: '' });
  const [thirdParties, setThirdParties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch third parties data from API
  useEffect(() => {
    const fetchThirdParties = async () => {
      try {
        setLoading(true);
        const response = await getAllThirdParties();
        console.log('API Response:', response);
        if (response.success) {
          setThirdParties(response.data);
        } else {
          setError(response.message || 'Failed to fetch third parties');
        }
      } catch (err) {
        console.error('Error fetching third parties:', err);
        setError(err.message || 'An error occurred while fetching third parties');
      } finally {
        setLoading(false);
      }
    };

    fetchThirdParties();
  }, []);

  const toggleDropdown = (thirdPartyId, event) => {
    if (openDropdown === thirdPartyId) {
      setOpenDropdown(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 128 // 128px is dropdown width (w-32)
      });
      setOpenDropdown(thirdPartyId);
    }
  };

  const handleAction = (action, thirdPartyId, thirdPartyName) => {
    setOpenDropdown(null);
    if (action === 'view') {
      navigate(`/third-party/${thirdPartyId}`);
    } else if (action === 'edit') {
      navigate(`/third-party/${thirdPartyId}/edit`);
    } else if (action === 'delete') {
      setDeleteModal({ isOpen: true, thirdPartyId, thirdPartyName });
    }
  };

  // Transform API data to match component structure
  const transformThirdPartiesData = (apiData) => {
    return apiData.map(thirdParty => ({
      id: thirdParty.tpid,
      name: thirdParty.third_party_name,
      thirdPartyId: `ID: TP-${String(thirdParty.tpid).padStart(3, '0')}`,
      // Use profile image if available, otherwise generate avatar
      profileImage: thirdParty.profile_image,
      avatar: thirdParty.third_party_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase(),
      products: thirdParty.detailed_products?.map(product => ({
        name: product.product_name,
        color: 'bg-[#D4F4E8] text-[#047857]'
      })) || [],
      contact: `+91 ${thirdParty.phone}`,
      email: thirdParty.email,
      location: `${thirdParty.city}, ${thirdParty.state}`,
      status: thirdParty.status.charAt(0).toUpperCase() + thirdParty.status.slice(1),
      dues: '₹0' // This would need to be calculated based on actual data
    }));
  };

  // Calculate statistics based on fetched data
  const calculateStats = (data) => {
    if (!data || data.length === 0) return [];
    
    const activeCount = data.filter(tp => tp.status === 'active').length;
    const totalCount = data.length;
    
    return [
      { label: 'Total Third Party', value: totalCount.toString(), change: '+12%', color: 'bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0]' },
      { label: 'Active Third Party', value: activeCount.toString(), change: '+8%', color: 'bg-gradient-to-r from-[#6EE7B7] to-[#34D399]' },
      { label: 'Pending Payouts', value: '₹12.4 L', change: '24 Third Party', color: 'bg-gradient-to-r from-[#10B981] to-[#059669]' },
      { label: 'Total Paid (Month)', value: '₹2.8 L', change: '156 Transactions', color: 'bg-gradient-to-r from-[#047857] to-[#065F46]' }
    ];
  };

  const transformedThirdParties = transformThirdPartiesData(thirdParties);
  const stats = calculateStats(thirdParties);

  // Show loading state
  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-[#0D5C4D]">Loading third parties...</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-red-800 text-center">
            <h3 className="font-bold text-lg mb-2">Error Loading Data</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="flex items-center justify-end mb-6">
        <button 
          onClick={() => navigate('/third-party/add')}
          className="bg-[#0D7C66] hover:bg-[#0a6354] text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Third Party
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.color} rounded-2xl p-6 ${index === 2 || index === 3 ? 'text-white' : 'text-[#0D5C4D]'}`}
          >
            <div className="text-sm font-medium mb-2 opacity-90">{stat.label}</div>
            <div className="text-4xl font-bold mb-2">{stat.value}</div>
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${index === 2 || index === 3 ? 'bg-white/20 text-white' : 'bg-white/60 text-[#0D5C4D]'}`}>
              {stat.change}
            </div>
          </div>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B8782]" size={20} />
        <input
          type="text"
          placeholder="Search third party by name, contact, or location..."
          className="w-full pl-12 pr-4 py-3 bg-[#F0F4F3] border-none rounded-xl text-[#0D5C4D] placeholder-[#6B8782] focus:outline-none focus:ring-2 focus:ring-[#0D8568]"
        />
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#D4F4E8]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Third Party Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Product List</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Dues</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Action</th>
              </tr>
            </thead>
            <tbody>
              {transformedThirdParties.map((thirdParty, index) => (
                <tr 
                  key={thirdParty.id} 
                  className={`border-b border-[#D0E0DB] hover:bg-[#F0F4F3] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F3]/30'}`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#B8F4D8] flex items-center justify-center text-[#0D5C4D] font-semibold text-sm">
                        {thirdParty.profileImage ? (
                          <img 
                            src={`http://localhost:8000${thirdParty.profileImage}`} 
                            alt={thirdParty.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              // Fallback to avatar if image fails to load
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          thirdParty.avatar
                        )}
                      </div>
                      <div>
                        <div className="font-semibold text-[#0D5C4D]">{thirdParty.name}</div>
                        <div className="text-xs text-[#6B8782]">{thirdParty.thirdPartyId}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {thirdParty.products.map((product, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#D4F4E8] text-[#047857]"
                        >
                          {product.name}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-[#0D5C4D]">{thirdParty.contact}</div>
                    <div className="text-xs text-[#6B8782]">{thirdParty.email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-[#0D5C4D]">{thirdParty.location}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${thirdParty.status === 'Active' ? 'bg-[#4ED39A] text-white' : 'bg-red-500 text-white'}`}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      {thirdParty.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className={`text-sm font-semibold ${thirdParty.dues === '₹0' ? 'text-[#047857]' : 'text-red-600'}`}>
                      {thirdParty.dues}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(thirdParty.id, e);
                      }}
                      className="text-[#6B8782] hover:text-[#0D5C4D] transition-colors p-1 hover:bg-[#F0F4F3] rounded"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
          <div className="text-sm text-[#6B8782]">
            Showing {transformedThirdParties.length} of {transformedThirdParties.length} third party
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
              &lt;
            </button>
            <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#0D8568] text-white">
              1
            </button>
            <button className="px-4 py-2 rounded-lg font-medium transition-colors text-[#6B8782] hover:bg-[#D0E0DB]">
              2
            </button>
            <button className="px-4 py-2 rounded-lg font-medium transition-colors text-[#6B8782] hover:bg-[#D0E0DB]">
              3
            </button>
            <button className="px-4 py-2 rounded-lg font-medium transition-colors text-[#6B8782] hover:bg-[#D0E0DB]">
              4
            </button>
            <button className="px-4 py-2 rounded-lg font-medium transition-colors text-[#6B8782] hover:bg-[#D0E0DB]">
              5
            </button>
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
              ...
            </button>
            <button className="px-4 py-2 rounded-lg font-medium transition-colors text-[#6B8782] hover:bg-[#D0E0DB]">
              10
            </button>
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Dropdown Menu - Fixed Position Outside Table */}
      {openDropdown && (
        <div 
          ref={dropdownRef}
          className="fixed w-32 bg-white rounded-lg shadow-lg border border-[#D0E0DB] py-1 z-[100]"
          style={{ 
            top: `${dropdownPosition.top}px`, 
            left: `${dropdownPosition.left}px` 
          }}
        >
          <button
            onClick={() => handleAction('view', openDropdown)}
            className="w-full text-left px-4 py-2 text-sm text-[#0D5C4D] hover:bg-[#F0F4F3] transition-colors flex items-center gap-2"
          >
            <Eye size={14} />
            View
          </button>
          <button
            onClick={() => handleAction('edit', openDropdown)}
            className="w-full text-left px-4 py-2 text-sm text-[#0D5C4D] hover:bg-[#F0F4F3] transition-colors flex items-center gap-2"
          >
            <Edit size={14} />
            Edit
          </button>
          <button
            onClick={() => handleAction('delete', openDropdown, 
              transformedThirdParties.find(tp => tp.id === openDropdown)?.name)}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#F0F4F3] transition-colors flex items-center gap-2"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      )}

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, thirdPartyId: null, thirdPartyName: '' })}
        onConfirm={() => {
          console.log('Deleting third party:', deleteModal.thirdPartyId);
          setDeleteModal({ isOpen: false, thirdPartyId: null, thirdPartyName: '' });
        }}
        title="Delete Third Party"
        message={`Are you sure you want to delete ${deleteModal.thirdPartyName}? This action cannot be undone.`}
      />
    </div>
  );
};

export default ThirdPartyManagement;