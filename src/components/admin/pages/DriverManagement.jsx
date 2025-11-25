import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Plus, ChevronLeft, ChevronRight, MoreVertical } from 'lucide-react';
import ConfirmDeleteModal from '../../common/ConfirmDeleteModal';

const DriverManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [vehicleFilter, setVehicleFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, driverId: null, driverName: '' });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const drivers = [
    {
      id: 'DRV-001',
      name: 'Rajesh Pandey',
      phone: '+91 98765 43210',
      initial: 'RP',
      color: 'bg-teal-700',
      vehicle: { name: 'Tata Ace', number: 'TN 01 AB 1234', capacity: '1 Ton' },
      deliveryType: 'Collection',
      status: 'Available',
      workingHours: '8.5 hrs'
    },
    {
      id: 'DRV-002',
      name: 'Suresh Kumar',
      phone: '+91 98765 43211',
      initial: 'SK',
      color: 'bg-teal-700',
      vehicle: { name: 'Mahindra Bolero', number: 'TN 02 CD 9876', capacity: '1.5 Ton' },
      deliveryType: 'Airport Delivery',
      status: 'On Trip',
      workingHours: '6.0 hrs'
    },
    {
      id: 'DRV-003',
      name: 'Arun Menon',
      phone: '+91 98765 43212',
      initial: 'AM',
      color: 'bg-teal-700',
      vehicle: { name: 'Ashok Leyland', number: 'TN 03 EF 4512', capacity: '3 Ton' },
      deliveryType: 'Collection',
      status: 'Available',
      workingHours: '7.2 hrs'
    },
    {
      id: 'DRV-004',
      name: 'Vijay Narayanan',
      phone: '+91 98765 43213',
      initial: 'VN',
      color: 'bg-teal-700',
      vehicle: { name: 'Eicher Pro 3015', number: 'TN 04 GH 3456', capacity: '3 Ton' },
      deliveryType: 'Airport Delivery',
      status: 'Available',
      workingHours: '5.8 hrs'
    },
    {
      id: 'DRV-005',
      name: 'Karthik Prasad',
      phone: '+91 98765 43214',
      initial: 'KP',
      color: 'bg-teal-700',
      vehicle: { name: 'Tata 407', number: 'TN 05 IJ 7890', capacity: '2.5 Ton' },
      deliveryType: 'Collection',
      status: 'Break',
      workingHours: '4.0 hrs'
    },
    {
      id: 'DRV-006',
      name: 'Muthu Selvam',
      phone: '+91 98765 43215',
      initial: 'MS',
      color: 'bg-teal-700',
      vehicle: { name: 'Mahindra Pickup', number: 'TN 06 KL 2345', capacity: '1 Ton' },
      deliveryType: 'Airport Delivery',
      status: 'On Trip',
      workingHours: '9.0 hrs'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-100 text-emerald-700';
      case 'On Trip':
        return 'bg-red-100 text-red-700';
      case 'Break':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case 'Available':
        return 'bg-emerald-500';
      case 'On Trip':
        return 'bg-red-500';
      case 'Break':
        return 'bg-amber-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getDeliveryTypeColor = (type) => {
    switch (type) {
      case 'Collection':
        return 'bg-blue-100 text-blue-700';
      case 'Airport Delivery':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all text-sm ${activeTab === 'all' ? 'bg-[#0D7C66] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            All Drivers
          </button>
          <button
            onClick={() => navigate('/drivers/DRV-001')}
            className="px-5 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          >
            Collection Drivers
          </button>
          <button
            onClick={() => navigate('/drivers/DRV-001/airport')}
            className="px-5 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
          >
            Airport Delivery
          </button>
        </div>

        <button 
          onClick={() => navigate('/drivers/add')}
          className="px-5 py-2.5 bg-[#0D7C66] hover:bg-[#0a6354] text-white rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm text-sm"
        >
          <Plus className="w-4 h-4" />
          Add Driver
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-[#D0E0DB] p-4 mb-6">
        <div className="flex flex-col gap-4">
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B8782]" />
            <input
              type="text"
              placeholder="Search driver by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-[#D0E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent text-sm bg-[#F0F4F3]"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 min-w-0">
              <div className="text-xs text-[#6B8782] mb-1 font-medium">Status: {statusFilter}</div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D0E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent appearance-none bg-white text-sm font-medium text-[#0D5C4D] cursor-pointer"
                >
                  <option>All</option>
                  <option>Available</option>
                  <option>On Trip</option>
                  <option>Break</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B8782] pointer-events-none" />
              </div>
            </div>

            <div className="relative flex-1 min-w-0">
              <div className="text-xs text-[#6B8782] mb-1 font-medium">Vehicle: {vehicleFilter}</div>
              <div className="relative">
                <select
                  value={vehicleFilter}
                  onChange={(e) => setVehicleFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D0E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent appearance-none bg-white text-sm font-medium text-[#0D5C4D] cursor-pointer"
                >
                  <option>All</option>
                  <option>Tata Ace</option>
                  <option>Mahindra Bolero</option>
                  <option>Ashok Leyland</option>
                  <option>Eicher Pro</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B8782] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drivers Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#D4F4E8]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Driver Info</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Vehicle Details</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Delivery Type</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Working Hours</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Action</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, index) => (
                <tr key={index} className={`border-b border-[#D0E0DB] hover:bg-[#F0F4F3] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F3]/30'}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#B8F4D8] flex items-center justify-center text-[#0D5C4D] font-semibold text-sm">
                        {driver.initial}
                      </div>
                      <div>
                        <div className="font-semibold text-[#0D5C4D]">{driver.name}</div>
                        <div className="text-xs text-[#6B8782]">{driver.id} • {driver.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-[#0D5C4D]">{driver.vehicle.name}</div>
                    <div className="text-xs text-[#6B8782]">{driver.vehicle.number} • {driver.vehicle.capacity}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#D4F4E8] text-[#047857]">
                      {driver.deliveryType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${driver.status === 'Available' ? 'bg-[#4ED39A] text-white' : driver.status === 'On Trip' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'}`}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      {driver.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-[#0D5C4D]">{driver.workingHours}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative dropdown-container">
                      <button
                        onClick={() => setOpenDropdown(openDropdown === driver.id ? null : driver.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                      
                      {openDropdown === driver.id && (
                        <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[120px]">
                          <button
                            onClick={() => {
                              navigate(`/drivers/${driver.id}`);
                              setOpenDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              navigate(`/drivers/${driver.id}/edit`);
                              setOpenDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeleteModal({ isOpen: true, driverId: driver.id, driverName: driver.name });
                              setOpenDropdown(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg"
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

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
          <div className="text-sm text-[#6B8782]">
            Showing 6 of 298 drivers
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

      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, driverId: null, driverName: '' })}
        onConfirm={() => {
          console.log('Deleting driver:', deleteModal.driverId);
          setDeleteModal({ isOpen: false, driverId: null, driverName: '' });
        }}
        title="Delete Driver"
        message={`Are you sure you want to delete ${deleteModal.driverName}? This action cannot be undone.`}
      />
    </div>
  );
};

export default DriverManagement;