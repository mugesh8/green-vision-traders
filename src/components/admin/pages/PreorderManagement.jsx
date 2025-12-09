import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';
import { getAllPreorders, deletePreorder } from '../../../api/orderApi'; // Assuming you'll create this API endpoint
import ConfirmDeleteModal from '../../common/ConfirmDeleteModal';

const PreorderManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [productFilter, setProductFilter] = useState('Product Type');
  const [showTimeFilter, setShowTimeFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showProductFilter, setShowProductFilter] = useState(false);
  
  // Filter options
  const timeFilterOptions = ['All Time', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'This Month', 'Last Month'];
  const statusFilterOptions = ['All Status', 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  const productFilterOptions = ['Product Type', 'Tomato', 'Potato', 'Onion', 'Carrot', 'Cabbage', 'Capsicum'];
  const [preorders, setPreorders] = useState([]); // State for preorders
  const [filteredPreorders, setFilteredPreorders] = useState([]); // State for filtered preorders
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, preorderId: null });

  // Fetch preorders when component mounts
  useEffect(() => {
    const fetchPreorders = async () => {
      try {
        setLoading(true);
        // TODO: Implement the actual API call for preorders
        const response = await getAllPreorders();
        if (response.success) {
          // Transform the data to match the existing structure
          const transformedPreorders = response.data.map(preorder => ({
            id: preorder.pid, // Assuming preorder ID field is 'pid'
            customer: preorder.customer_name,
            boxes: preorder.items[0]?.num_boxes || 'N/A',
            packing: preorder.items.map(item => item.packing_type).filter(Boolean)[0] || 'N/A',
            netWeight: preorder.items.reduce((sum, item) => sum + (parseFloat(item.net_weight) || 0), 0) + ' kg',
            grossWeight: preorder.items.reduce((sum, item) => sum + (parseFloat(item.gross_weight) || 0), 0) + ' kg',
            total: '₹' + preorder.items.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0).toLocaleString(),
            marketPrice: '₹' + (preorder.items[0]?.market_price || '0'),
            status: preorder.order_status || 'pending',
            products: preorder.items.map(item => item.product).filter(Boolean),
            createdAt: preorder.createdAt,
            updatedAt: preorder.updatedAt
          }));
          setPreorders(transformedPreorders);
        } else {
          setError('Failed to fetch preorders');
        }
      } catch (err) {
        setError('Error fetching preorders: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPreorders();
  }, []);

  // Filter the preorders based on filters and search query
  useEffect(() => {
    // Filter preorders
    let filtered = [...preorders];
    
    // Apply time filter
    filtered = filterByDateRange(filtered, timeFilter);
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(preorder => 
        preorder.id.toLowerCase().includes(query) ||
        preorder.customer.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'All Status') {
      const statusValue = statusFilter.toLowerCase();
      filtered = filtered.filter(preorder => 
        preorder.status && preorder.status.toLowerCase() === statusValue
      );
    }
    
    // Apply product filter
    if (productFilter !== 'Product Type') {
      filtered = filtered.filter(preorder => 
        preorder.products && preorder.products.includes(productFilter)
      );
    }
    
    setFilteredPreorders(filtered);
  }, [preorders, searchQuery, statusFilter, productFilter]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
      
      // Close filter dropdowns when clicking outside
      if (showTimeFilter || showStatusFilter || showProductFilter) {
        const timeFilterButton = event.target.closest('[data-filter="time"]');
        const statusFilterButton = event.target.closest('[data-filter="status"]');
        const productFilterButton = event.target.closest('[data-filter="product"]');
        
        if (!timeFilterButton && !statusFilterButton && !productFilterButton) {
          setShowTimeFilter(false);
          setShowStatusFilter(false);
          setShowProductFilter(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showTimeFilter, showStatusFilter, showProductFilter]);

  const toggleDropdown = (preorderId, event) => {
    if (openDropdown === preorderId) {
      setOpenDropdown(null);
    } else {
      const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right + window.scrollX - 128 // 128px is dropdown width (w-32)
      });
      setOpenDropdown(preorderId);
    }
  };

  const handleDeletePreorder = async (preorderId) => {
    try {
      await deletePreorder(preorderId);
      // Refresh the preorders list after deletion
      const response = await getAllPreorders();
      if (response.success) {
        const transformedPreorders = response.data.map(preorder => ({
          id: preorder.pid,
          customer: preorder.customer_name,
          boxes: preorder.items[0]?.num_boxes || 'N/A',
          packing: preorder.items.map(item => item.packing_type).filter(Boolean)[0] || 'N/A',
          netWeight: preorder.items.reduce((sum, item) => sum + (parseFloat(item.net_weight) || 0), 0) + ' kg',
          grossWeight: preorder.items.reduce((sum, item) => sum + (parseFloat(item.gross_weight) || 0), 0) + ' kg',
          total: '₹' + preorder.items.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0).toLocaleString(),
          marketPrice: '₹' + (preorder.items[0]?.market_price || '0'),
          status: preorder.order_status || 'pending',
          products: preorder.items.map(item => item.product).filter(Boolean),
          createdAt: preorder.createdAt,
          updatedAt: preorder.updatedAt
        }));
        setPreorders(transformedPreorders);
      }
    } catch (err) {
      console.error('Error deleting preorder:', err);
      setError('Error deleting preorder: ' + err.message);
    }
    setOpenDropdown(null);
  };

  const handleAction = (action, preorderId) => {
    if (action === 'view') {
      navigate(`/preorders/${preorderId}`);
    } else if (action === 'edit') {
      // Navigate to the preorder creation page with preorder ID for editing
      navigate(`/preorders/create?preorderId=${preorderId}`);
    } else if (action === 'convert') {
      // Convert preorder to order
      navigate(`/orders/create?fromPreorder=${preorderId}`);
    } else if (action === 'delete') {
      // Open delete confirmation modal
      setDeleteModal({ isOpen: true, preorderId });
    }
    setOpenDropdown(null);
  };

  // Helper function to filter by date range
  const filterByDateRange = (preorders, timeFilter) => {
    if (timeFilter === 'All Time') return preorders;
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timeFilter) {
      case 'Today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Yesterday':
        startDate.setDate(now.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Last 7 Days':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'Last 30 Days':
        startDate.setDate(now.getDate() - 30);
        break;
      case 'This Month':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'Last Month':
        startDate.setMonth(now.getMonth() - 1);
        startDate.setDate(1);
        break;
      default:
        return preorders;
    }
    
    return preorders.filter(preorder => {
      // Note: We need createdAt/updatedAt fields in preorder objects for this to work
      const preorderDate = new Date(preorder.createdAt || preorder.updatedAt || now);
      return preorderDate >= startDate;
    });
  };

  const statsCards = [
    { title: 'Total Preorders', value: (filteredPreorders.length > 0 ? filteredPreorders : preorders).length, bgColor: 'bg-[#D4F4E8]', textColor: 'text-[#0D7C66]' },
    { title: 'Created', value: '28', bgColor: 'bg-[#B8F3DC]', textColor: 'text-[#0D7C66]' },
    { title: 'Confirmed', value: '45', bgColor: 'bg-[#7FE5B8]', textColor: 'text-[#0D7C66]' },
    { title: 'In Progress', value: '51', bgColor: 'bg-[#1CB68B]', textColor: 'text-white' },
    { title: 'Completed', value: '18', bgColor: 'bg-[#0D7C66]', textColor: 'text-white' },
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-xl">Loading preorders...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-end mb-6">
          <button 
            onClick={() => navigate('/preorders/create')}
            className="bg-[#0D7C66] hover:bg-[#0a6252] text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="text-xl">+</span> New Preorder
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by preorder ID, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            {/* Time Filter Dropdown */}
            <div className="relative">
              <button 
                data-filter="time"
                onClick={() => {
                  setShowTimeFilter(!showTimeFilter);
                  setShowStatusFilter(false);
                  setShowProductFilter(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-gray-700">{timeFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              
              {showTimeFilter && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {timeFilterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setTimeFilter(option);
                        setShowTimeFilter(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Status Filter Dropdown */}
            <div className="relative">
              <button 
                data-filter="status"
                onClick={() => {
                  setShowStatusFilter(!showStatusFilter);
                  setShowTimeFilter(false);
                  setShowProductFilter(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-gray-700">{statusFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              
              {showStatusFilter && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {statusFilterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setStatusFilter(option);
                        setShowStatusFilter(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product Filter Dropdown */}
            <div className="relative">
              <button 
                data-filter="product"
                onClick={() => {
                  setShowProductFilter(!showProductFilter);
                  setShowTimeFilter(false);
                  setShowStatusFilter(false);
                }}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="text-gray-700">{productFilter}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
              
              {showProductFilter && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                  {productFilterOptions.map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setProductFilter(option);
                        setShowProductFilter(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <button className="px-6 py-2.5 border border-[#0D7C66] text-[#0D7C66] rounded-lg hover:bg-[#0D7C66] hover:text-white transition-colors duration-200 font-medium">
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {statsCards.map((card, index) => (
            <div
              key={index}
              className={`${card.bgColor} rounded-xl p-6 shadow-sm`}
            >
              <p className={`text-sm font-medium ${card.textColor} opacity-90 mb-2`}>
                {card.title}
              </p>
              <p className={`text-4xl font-bold ${card.textColor}`}>{card.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Preorders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Preorder ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  No of Boxes/Bag
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Type of Packing
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Net Weight
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Gross Weight
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Market Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(filteredPreorders.length > 0 ? filteredPreorders : preorders).map((preorder, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {preorder.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {preorder.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {preorder.boxes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {preorder.packing}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {preorder.netWeight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {preorder.grossWeight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {preorder.marketPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {preorder.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleDropdown(preorder.id, e);
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

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">Showing {(filteredPreorders.length > 0 ? filteredPreorders : preorders).length} of {preorders.length} Preorders</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors duration-150 ${
                currentPage === 1
                  ? 'bg-[#0D7C66] text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setCurrentPage(1)}
            >
              1
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
              disabled={true}
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
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
          <>
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
              onClick={() => handleAction('convert', openDropdown)}
              className="w-full text-left px-4 py-2 text-sm text-[#0D5C4D] hover:bg-[#F0F4F3] transition-colors flex items-center gap-2"
            >
              <Edit size={14} />
              Convert to Order
            </button>
            <button
              onClick={() => handleAction('delete', openDropdown)}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#F0F4F3] transition-colors flex items-center gap-2"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </>
        </div>
      )}

      {/* Delete Preorder Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, preorderId: null })}
        onConfirm={async () => {
          try {
            await handleDeletePreorder(deleteModal.preorderId);
            setDeleteModal({ isOpen: false, preorderId: null });
          } catch (error) {
            console.error('Failed to delete preorder:', error);
          }
        }}
        title="Delete Preorder"
        message="Are you sure you want to delete this preorder? This action cannot be undone."
      />
    </div>
  );
};

export default PreorderManagement;