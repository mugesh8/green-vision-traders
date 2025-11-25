import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, MoreVertical } from 'lucide-react';
import ConfirmDeleteModal from '../../common/ConfirmDeleteModal';
import { getAllVendors } from '../../../api/vendorApi';

const VendorDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, vendorId: null, vendorName: '' });
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch vendors from API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const response = await getAllVendors(1, 100); // Fetch first 100 vendors
        setVendors(response.data || []);
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAction = (action, vendor) => {
    if (action === 'view') {
      // Navigate based on vendor type
      if (vendor.vendor_type === 'farmer') {
        navigate(`/farmers/${vendor.fid}`);
      } else if (vendor.vendor_type === 'supplier') {
        navigate(`/suppliers/${vendor.sid}`);
      } else if (vendor.vendor_type === 'third party') {
        navigate(`/third-party/${vendor.tpid}`);
      }
    } else if (action === 'edit') {
      // Navigate to edit based on vendor type
      if (vendor.vendor_type === 'farmer') {
        navigate(`/farmers/${vendor.fid}/edit`);
      } else if (vendor.vendor_type === 'supplier') {
        navigate(`/suppliers/${vendor.sid}/edit`);
      } else if (vendor.vendor_type === 'third party') {
        navigate(`/third-party/${vendor.tpid}/edit`);
      }
    } else if (action === 'delete') {
      setDeleteModal({ isOpen: true, vendor, vendorName: vendor.name || vendor.farmer_name || vendor.supplier_name || vendor.third_party_name });
    }
    setOpenDropdown(null);
  };

  // Transform vendor data for display
  const transformVendorData = (vendor) => {
    // Determine vendor type and ID
    let vendorType = vendor.vendor_type || 'Unknown';
    let vendorId = '';
    let vendorName = '';
    let contact = '';
    let email = '';
    let location = '';
    let products = [];
    
    if (vendor.vendor_type === 'farmer') {
      vendorType = 'Farmer';
      vendorId = vendor.fid || '';
      vendorName = vendor.farmer_name || vendor.name || 'Unknown Farmer';
      contact = vendor.phone || vendor.primary_phone || '';
      email = vendor.email || '';
      location = `${vendor.city || ''}, ${vendor.state || ''}`;
      products = vendor.detailed_products || vendor.products || [];
    } else if (vendor.vendor_type === 'supplier') {
      vendorType = 'Supplier';
      vendorId = vendor.sid || '';
      vendorName = vendor.supplier_name || vendor.name || 'Unknown Supplier';
      contact = vendor.phone || vendor.primary_phone || '';
      email = vendor.email || '';
      location = `${vendor.city || ''}, ${vendor.state || ''}`;
      products = vendor.detailed_products || vendor.products || [];
    } else if (vendor.vendor_type === 'third party') {
      vendorType = 'Third Party';
      vendorId = vendor.tpid || '';
      vendorName = vendor.third_party_name || vendor.name || 'Unknown Third Party';
      contact = vendor.phone || vendor.primary_phone || '';
      email = vendor.email || '';
      location = `${vendor.city || ''}, ${vendor.state || ''}`;
      products = vendor.detailed_products || vendor.products || [];
    }

    return {
      ...vendor,
      vendorType,
      vendorId: `ID: ${vendorId}`,
      name: vendorName,
      contact,
      email,
      location,
      products: products.map(product => ({
        name: product.product_name || product.name || 'Unknown Product',
        color: 'bg-[#D4F4E8] text-[#047857]'
      })),
      performance: vendor.performance || 'N/A',
      status: vendor.status || 'Active'
    };
  };

  // Transform all vendors
  const transformedVendors = vendors.map(transformVendorData);

  // Filter vendors based on search query
  const filteredVendors = transformedVendors.filter(vendor => {
    const searchLower = searchQuery.toLowerCase();
    return (
      vendor.name.toLowerCase().includes(searchLower) ||
      vendor.contact.toLowerCase().includes(searchLower) ||
      vendor.email.toLowerCase().includes(searchLower) ||
      vendor.location.toLowerCase().includes(searchLower) ||
      vendor.vendorType.toLowerCase().includes(searchLower)
    );
  });

  // Calculate stats
  const farmerCount = vendors.filter(v => v.vendor_type === 'farmer').length;
  const supplierCount = vendors.filter(v => v.vendor_type === 'supplier').length;
  const thirdPartyCount = vendors.filter(v => v.vendor_type === 'third party').length;
  const totalCount = vendors.length;

  const stats = [
    { label: 'Total Vendors', value: totalCount.toString(), change: '', color: 'bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0]' },
    { label: 'Farmers', value: farmerCount.toString(), change: '', color: 'bg-gradient-to-r from-[#6EE7B7] to-[#34D399]' },
    { label: 'Suppliers', value: supplierCount.toString(), change: '', color: 'bg-gradient-to-r from-[#10B981] to-[#059669]' },
    { label: 'Third Party', value: thirdPartyCount.toString(), change: '', color: 'bg-gradient-to-r from-[#047857] to-[#065F46]' }
  ];

  if (loading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-[#0D5C4D]">Loading vendors...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800 text-sm">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header with Add Button */}
      <div className="flex items-center justify-end mb-6">
        <button
          onClick={() => navigate('/vendors/add')}
          className="bg-[#0D7C66] hover:bg-[#0a6354] text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Vendor
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`${stat.color} rounded-2xl p-6 ${index === 2 || index === 3 ? 'text-white' : 'text-[#0D5C4D]'
              }`}
          >
            <div className="text-sm font-medium mb-2 opacity-90">{stat.label}</div>
            <div className="text-4xl font-bold mb-2">{stat.value}</div>
            {stat.change && (
              <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${index === 2 || index === 3
                  ? 'bg-white/20 text-white'
                  : 'bg-white/60 text-[#0D5C4D]'
                }`}>
                {stat.change}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B8782]" size={20} />
        <input
          type="text"
          placeholder="Search vendors by name, contact, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-[#F0F4F3] border-none rounded-xl text-[#0D5C4D] placeholder-[#6B8782] focus:outline-none focus:ring-2 focus:ring-[#0D8568]"
        />
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#D4F4E8]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Vendor Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Product List</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Location</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Performance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredVendors.map((vendor, index) => (
                <tr
                  key={`${vendor.vendor_type}-${vendor.vendorId}`}
                  className={`border-b border-[#D0E0DB] hover:bg-[#F0F4F3] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F3]/30'
                    }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#B8F4D8] flex items-center justify-center text-[#0D5C4D] font-semibold text-sm">
                        {vendor.profile_image ? (
                          <img
                            src={`http://localhost:8000${vendor.profile_image}`}
                            alt={vendor.name}
                            className="w-10 h-10 rounded-full object-cover"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : (
                          <span>{vendor.name.substring(0, 2).toUpperCase()}</span>
                        )}
                        <span className="hidden">{vendor.name.substring(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-[#0D5C4D]">{vendor.name}</div>
                        <div className="text-xs text-[#6B8782]">{vendor.registration_number || vendor.vendorId}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#D4F4E8] text-[#047857] whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px]">
                      {vendor.vendorType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {vendor.products.slice(0, 2).map((product, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#D4F4E8] text-[#047857]"
                        >
                          {product.name}
                        </span>
                      ))}
                      {vendor.products.length > 2 && (
                        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#D4F4E8] text-[#047857]">
                          +{vendor.products.length - 2} more
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-[#0D5C4D]">{vendor.contact}</div>
                    <div className="text-xs text-[#6B8782]">{vendor.email}</div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-[#0D5C4D]">{vendor.location}</div>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${vendor.performance === 'Excellent' ? 'bg-[#4ED39A] text-white' :
                        vendor.performance === 'Good' ? 'bg-[#4ED39A] text-white' :
                          vendor.performance === 'Average' ? 'bg-amber-500 text-white' :
                            'bg-gray-500 text-white'
                      }`}>
                      {vendor.performance}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${vendor.status === 'Active' ? 'bg-[#4ED39A] text-white' : 'bg-red-500 text-white'
                      }`}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      {vendor.status}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="relative" ref={openDropdown === `${vendor.vendor_type}-${vendor.vendorId}` ? dropdownRef : null}>
                      <button
                        onClick={() => setOpenDropdown(openDropdown === `${vendor.vendor_type}-${vendor.vendorId}` ? null : `${vendor.vendor_type}-${vendor.vendorId}`)}
                        className="text-[#6B8782] hover:text-[#0D5C4D] transition-colors p-1 hover:bg-[#F0F4F3] rounded"
                      >
                        <MoreVertical size={20} />
                      </button>

                      {openDropdown === `${vendor.vendor_type}-${vendor.vendorId}` && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-[#D0E0DB] py-1 z-10">
                          <button
                            onClick={() => handleAction('view', vendor)}
                            className="w-full text-left px-4 py-2 text-sm text-[#0D5C4D] hover:bg-[#F0F4F3] transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleAction('edit', vendor)}
                            className="w-full text-left px-4 py-2 text-sm text-[#0D5C4D] hover:bg-[#F0F4F3] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleAction('delete', vendor)}
                            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#F0F4F3] transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredVendors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-[#6B8782]">No vendors found matching your search criteria.</div>
          </div>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
          <div className="text-sm text-[#6B8782]">
            Showing {filteredVendors.length} of {totalCount} vendors
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
              &lt;
            </button>
            <button className="px-4 py-2 rounded-lg font-medium transition-colors bg-[#0D8568] text-white">
              1
            </button>
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, vendor: null, vendorName: '' })}
        onConfirm={() => {
          console.log('Deleting vendor:', deleteModal.vendor);
          setDeleteModal({ isOpen: false, vendor: null, vendorName: '' });
        }}
        title="Delete Vendor"
        message={`Are you sure you want to delete ${deleteModal.vendorName}? This action cannot be undone.`}
      />
    </div>
  );
};

export default VendorDashboard;