import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, ChevronDown, Plus, X } from 'lucide-react';

const WorkAssignment = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('workAssignment');
  const [selectedDate, setSelectedDate] = useState('Today, Nov 06 2025');
  const [filters, setFilters] = useState({
    assignment: 'All',
    location: 'All'
  });
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedLabour, setSelectedLabour] = useState(null);

  const labours = [
    {
      id: 1,
      name: 'Rajesh Murugan',
      labourId: 'LAB-001',
      phone: '+91 98765 43210',
      avatar: 'RM',
      avatarBg: 'bg-teal-700',
      orderId: 'ORD - 2024-A2431',
      status: 'Assigned',
      statusColor: 'bg-[#10B981]',
      location: 'Warehouse A',
      todayHours: '6.5 hrs',
      hoursColor: 'text-[#0D7C66]',
      actionType: 'update'
    },
    {
      id: 2,
      name: 'Senthil Kumar',
      labourId: 'LAB-002',
      phone: '+91 98765 43211',
      avatar: 'SK',
      avatarBg: 'bg-teal-800',
      orderId: 'ORD - 2024-A2432',
      status: 'Not Assigned',
      statusColor: 'bg-red-500',
      location: 'Dock B',
      todayHours: '8.5 hrs',
      hoursColor: 'text-[#0D7C66]',
      actionType: 'update'
    },
    {
      id: 3,
      name: 'Anitha Prabhu',
      labourId: 'LAB-003',
      phone: '+91 98765 43212',
      avatar: 'AP',
      avatarBg: 'bg-teal-600',
      orderId: 'ORD - 2024-A2433',
      status: 'Assigned',
      statusColor: 'bg-[#10B981]',
      location: '--',
      todayHours: '0 hrs',
      hoursColor: 'text-[#6B8782]',
      actionType: 'assign'
    },
    {
      id: 4,
      name: 'Muthu Vel',
      labourId: 'LAB-004',
      phone: '+91 98765 43213',
      avatar: 'MV',
      avatarBg: 'bg-teal-700',
      orderId: 'ORD - 2024-A2434',
      status: 'Not Assigned',
      statusColor: 'bg-red-500',
      location: 'Dock A',
      todayHours: '7.0 hrs',
      hoursColor: 'text-[#0D7C66]',
      actionType: 'update'
    },
    {
      id: 5,
      name: 'Lakshmi Priya',
      labourId: 'LAB-005',
      phone: '+91 98765 43214',
      avatar: 'LP',
      avatarBg: 'bg-teal-700',
      orderId: 'ORD - 2024-A2435',
      status: 'Assigned',
      statusColor: 'bg-[#10B981]',
      location: 'Warehouse B',
      todayHours: '5.0 hrs',
      hoursColor: 'text-[#0D7C66]',
      actionType: 'update'
    },
    {
      id: 6,
      name: 'Kumar Selvam',
      labourId: 'LAB-006',
      phone: '+91 98765 43215',
      avatar: 'KS',
      avatarBg: 'bg-teal-800',
      orderId: 'ORD - 2024-A2431',
      status: 'Not Assigned',
      statusColor: 'bg-red-500',
      location: 'Dock C',
      todayHours: '3.5 hrs',
      hoursColor: 'text-[#0D7C66]',
      actionType: 'update'
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'labourList') {
      navigate('/labour');
    } else if (tab === 'attendance') {
      navigate('/labour/attendance');
    }
  };

  const handleUpdateAssignment = (labour) => {
    setSelectedLabour(labour);
    setIsUpdateModalOpen(true);
  };

  const handleAssignWork = (labour) => {
    setSelectedLabour(labour);
    setIsAssignModalOpen(true);
  };

  const handleBulkAssignment = () => {
    console.log('Open bulk assignment modal');
    // Add bulk assignment logic here
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Tabs and Bulk Assignment Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTabChange('labourList')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'labourList'
                ? 'bg-[#10B981] text-white'
                : 'bg-[#D4F4E8] text-[#0D5C4D] hover:bg-[#B8F4D8]'
            }`}
          >
            Labour List
          </button>
          <button
            onClick={() => handleTabChange('attendance')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'attendance'
                ? 'bg-[#10B981] text-white'
                : 'bg-[#D4F4E8] text-[#0D5C4D] hover:bg-[#B8F4D8]'
            }`}
          >
            Attendance
          </button>
          <button
            onClick={() => handleTabChange('workAssignment')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'workAssignment'
                ? 'bg-[#0D7C66] text-white'
                : 'bg-[#D4F4E8] text-[#0D5C4D] hover:bg-[#B8F4D8]'
            }`}
          >
            Work Assignment
          </button>
        </div>

        <button 
          onClick={handleBulkAssignment}
          className="bg-[#10B981] hover:bg-[#059669] text-white px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus className="w-4 h-4" />
          Bulk Assignment
        </button>
      </div>

      {/* Date Picker and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Date Picker */}
        <div className="relative">
          <button className="bg-white border border-[#D0E0DB] rounded-lg px-4 py-2.5 text-sm text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] flex items-center gap-2 w-full sm:w-auto justify-center">
            <Calendar size={16} className="text-red-500" />
            {selectedDate}
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B8782]" size={20} />
          <input
            type="text"
            placeholder="Search labour by name or ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D8568]"
          />
        </div>

        {/* Assignment Filter */}
        <div className="relative">
          <select
            value={filters.assignment}
            onChange={(e) => setFilters({...filters, assignment: e.target.value})}
            className="appearance-none bg-white border border-[#D0E0DB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] cursor-pointer min-w-[160px]"
          >
            <option value="All">Assignment: All</option>
            <option value="Assigned">Assigned</option>
            <option value="Not Assigned">Not Assigned</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B8782] pointer-events-none" size={16} />
        </div>

        {/* Location Filter */}
        <div className="relative">
          <select
            value={filters.location}
            onChange={(e) => setFilters({...filters, location: e.target.value})}
            className="appearance-none bg-white border border-[#D0E0DB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] cursor-pointer min-w-[140px]"
          >
            <option value="All">Location: All</option>
            <option value="Warehouse A">Warehouse A</option>
            <option value="Warehouse B">Warehouse B</option>
            <option value="Dock A">Dock A</option>
            <option value="Dock B">Dock B</option>
            <option value="Dock C">Dock C</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B8782] pointer-events-none" size={16} />
        </div>
      </div>

      {/* Work Assignment Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-[#D4F4E8]">
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">LABOUR INFO</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">ORDER ID</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">STATUS</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">LOCATION</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">TODAY'S HOURS</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">CHANGE ASSIGNMENT</th>
              </tr>
            </thead>
            <tbody>
              {labours.map((labour, index) => (
                <tr 
                  key={labour.id} 
                  className={`border-b border-[#D0E0DB] hover:bg-[#F0F4F3] transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F3]/30'
                  }`}
                >
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full ${labour.avatarBg} flex items-center justify-center text-white font-semibold text-sm flex-shrink-0`}>
                        {labour.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#0D5C4D]">{labour.name}</div>
                        <div className="text-xs text-[#6B8782]">{labour.labourId} • {labour.phone}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-[#0D5C4D]">{labour.orderId}</div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit text-white ${labour.statusColor}`}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      {labour.status}
                    </span>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className={`text-sm ${labour.location === '--' ? 'text-[#6B8782]' : 'text-[#0D5C4D]'}`}>
                      {labour.location}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className={`text-sm font-semibold ${labour.hoursColor}`}>
                      {labour.todayHours}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    {labour.actionType === 'update' && (
                      <button
                        onClick={() => handleUpdateAssignment(labour)}
                        className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Update Assignment
                      </button>
                    )}
                    {labour.actionType === 'assign' && (
                      <button
                        onClick={() => handleAssignWork(labour)}
                        className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Assign Work
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
          <div className="text-sm text-[#6B8782]">
            Showing 6 of 248 Labours
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
              &lt;
            </button>
            <button className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors bg-[#0D7C66] text-white">
              1
            </button>
            <button className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-[#6B8782] hover:bg-[#D0E0DB]">
              2
            </button>
            <button className="hidden sm:block px-4 py-2 rounded-lg font-medium transition-colors text-[#6B8782] hover:bg-[#D0E0DB]">
              ...
            </button>
            <button className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-[#6B8782] hover:bg-[#D0E0DB]">
              9
            </button>
            <button className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors bg-[#0D7C66] text-white">
              10
            </button>
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Update Assignment Modal */}
      <UpdateAssignmentModal 
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        labourData={selectedLabour}
      />

      {/* Assign Work Modal */}
      <AssignWorkModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        labourData={selectedLabour}
      />
    </div>
  );
};

// Update Assignment Modal Component
const UpdateAssignmentModal = ({ isOpen, onClose, labourData }) => {
  const [formData, setFormData] = useState({
    orderIds: ['Ord-101', 'Ord-192', 'Ord-908'],
    workload: 'Normal, Heavy',
    location: 'Warehouse A',
    status: 'Assigned',
    actualHours: '6.5',
    notes: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const removeOrderId = (orderToRemove) => {
    setFormData(prev => ({
      ...prev,
      orderIds: prev.orderIds.filter(order => order !== orderToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Update Assignment:', formData);
    onClose();
  };

  if (!isOpen || !labourData) return null;

  const getOrderColor = (order) => {
    if (order.includes('101')) return { bg: 'bg-blue-100', text: 'text-blue-700' };
    if (order.includes('192')) return { bg: 'bg-green-100', text: 'text-green-700' };
    if (order.includes('908')) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-gray-100', text: 'text-gray-700' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-t-2xl px-6 py-4 flex items-center justify-center relative">
          <h2 className="text-xl sm:text-2xl font-bold text-white italic">Update Assignment</h2>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Labour Info */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">Labour</label>
            <div className="flex items-center gap-3 p-3 bg-[#F0F4F3] rounded-lg border border-[#D0E0DB]">
              <div className={`w-12 h-12 rounded-full ${labourData.avatarBg} flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}>
                {labourData.avatar}
              </div>
              <div>
                <div className="text-base font-semibold text-[#0D5C4D]">{labourData.name}</div>
                <div className="text-sm text-[#6B8782]">{labourData.labourId} • {labourData.phone}</div>
              </div>
            </div>
          </div>

          {/* Order ID */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">Order ID</label>
            <div className="flex flex-wrap gap-2 p-3 bg-white rounded-lg border border-[#D0E0DB] min-h-[52px]">
              {formData.orderIds.map((order, index) => {
                const colors = getOrderColor(order);
                return (
                  <span
                    key={index}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${colors.bg} ${colors.text}`}
                  >
                    {order}
                    <button
                      type="button"
                      onClick={() => removeOrderId(order)}
                      className="hover:opacity-70 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Workload */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">
              Workload <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="workload"
              value={formData.workload}
              onChange={handleInputChange}
              placeholder="Normal, Heavy"
              className="w-full px-4 py-3 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">
              Location <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent appearance-none cursor-pointer"
                required
              >
                <option value="">Select location</option>
                <option value="Warehouse A">Warehouse A</option>
                <option value="Warehouse B">Warehouse B</option>
                <option value="Dock A">Dock A</option>
                <option value="Dock B">Dock B</option>
                <option value="Dock C">Dock C</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-[#6B8782]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">
              Status <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                className="w-full px-4 py-3 pl-8 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent appearance-none cursor-pointer"
                required
              >
                <option value="Assigned">Assigned</option>
                <option value="Not Assigned">Not Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-[#10B981]"></div>
              </div>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-[#6B8782]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Actual Hours */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">Actual Hours</label>
            <input
              type="text"
              name="actualHours"
              value={formData.actualHours}
              onChange={handleInputChange}
              placeholder="0.0"
              className="w-full px-4 py-3 bg-white border border-[#D0E0DB] rounded-lg text-[#10B981] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent font-medium"
            />
            {formData.actualHours && (
              <p className="text-xs text-[#10B981] mt-1 font-medium">{formData.actualHours} hrs</p>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Update notes..."
              rows="4"
              className="w-full px-4 py-3 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent resize-none"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white border border-[#D0E0DB] text-[#0D5C4D] rounded-lg font-semibold hover:bg-[#F0F4F3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold transition-colors shadow-sm italic"
            >
              Update Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Assign Work Modal Component
const AssignWorkModal = ({ isOpen, onClose, labourData }) => {
  const [formData, setFormData] = useState({
    orderId: '',
    selectedOrders: ['Ord-101', 'Ord-192', 'Ord-908'],
    workload: '',
    location: '',
    estimatedHours: '',
    workDate: '',
    notes: ''
  });

  const [showOrderDropdown, setShowOrderDropdown] = useState(false);

  const availableOrders = [
    'ORD-2024-A2431',
    'ORD-2024-A2432',
    'ORD-2024-A2433',
    'ORD-2024-A2434',
    'ORD-2024-A2435'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleOrderSelect = (order) => {
    if (!formData.selectedOrders.includes(order)) {
      setFormData(prev => ({
        ...prev,
        selectedOrders: [...prev.selectedOrders, order],
        orderId: ''
      }));
    }
    setShowOrderDropdown(false);
  };

  const removeSelectedOrder = (orderToRemove) => {
    setFormData(prev => ({
      ...prev,
      selectedOrders: prev.selectedOrders.filter(order => order !== orderToRemove)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Assign Work:', formData);
    onClose();
  };

  if (!isOpen || !labourData) return null;

  const getOrderColor = (order) => {
    if (order.includes('101')) return { bg: 'bg-blue-100', text: 'text-blue-700' };
    if (order.includes('192')) return { bg: 'bg-green-100', text: 'text-green-700' };
    if (order.includes('908')) return { bg: 'bg-yellow-100', text: 'text-yellow-700' };
    return { bg: 'bg-purple-100', text: 'text-purple-700' };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-t-2xl px-6 py-4 flex items-center justify-center relative">
          <h2 className="text-xl sm:text-2xl font-bold text-white italic">Assign Work</h2>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Select Labour */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">
              Select Labour <span className="text-red-500">*</span>
            </label>
            <div className="flex items-center gap-3 p-3 bg-[#F0F4F3] rounded-lg border border-[#D0E0DB]">
              <div className={`w-12 h-12 rounded-full ${labourData.avatarBg} flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}>
                {labourData.avatar}
              </div>
              <div>
                <div className="text-base font-semibold text-[#0D5C4D]">{labourData.name}</div>
                <div className="text-sm text-[#6B8782]">{labourData.labourId} • {labourData.phone}</div>
              </div>
            </div>
          </div>

          {/* Order ID */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">
              Order ID <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                onFocus={() => setShowOrderDropdown(true)}
                placeholder="Enter order ID (e.g., ORD-2024-A2431)"
                className="w-full px-4 py-3 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-[#6B8782]" />
              </div>

              {/* Dropdown */}
              {showOrderDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#D0E0DB] rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                  {availableOrders
                    .filter(order => 
                      order.toLowerCase().includes(formData.orderId.toLowerCase()) &&
                      !formData.selectedOrders.includes(order)
                    )
                    .map((order, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleOrderSelect(order)}
                        className="w-full text-left px-4 py-3 hover:bg-[#F0F4F3] transition-colors text-[#0D5C4D]"
                      >
                        {order}
                      </button>
                    ))
                  }
                </div>
              )}
            </div>

            {/* Selected Orders */}
            {formData.selectedOrders.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.selectedOrders.map((order, index) => {
                  const colors = getOrderColor(order);
                  return (
                    <span
                      key={index}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-2 ${colors.bg} ${colors.text}`}
                    >
                      {order}
                      <button
                        type="button"
                        onClick={() => removeSelectedOrder(order)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Workload */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">
              Workload <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="workload"
                value={formData.workload}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent appearance-none cursor-pointer"
                required
              >
                <option value="">Normal, Heavy</option>
                <option value="Light">Light</option>
                <option value="Normal">Normal</option>
                <option value="Heavy">Heavy</option>
                <option value="Normal, Heavy">Normal, Heavy</option>
              </select>
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <ChevronDown className="w-4 h-4 text-[#6B8782]" />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Select location"
              className="w-full px-4 py-3 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
              required
            />
          </div>

          {/* Estimated Hours */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">Estimated Hours</label>
            <input
              type="text"
              name="estimatedHours"
              value={formData.estimatedHours}
              onChange={handleInputChange}
              placeholder="Enter estimated hours"
              className="w-full px-4 py-3 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
            />
          </div>

          {/* Work Date */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">
              Work Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                name="workDate"
                value={formData.workDate}
                onChange={handleInputChange}
                placeholder="Select date"
                className="w-full px-4 py-3 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-[#0D5C4D] mb-3 italic">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes..."
              rows="4"
              className="w-full px-4 py-3 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#10B981] focus:border-transparent resize-none"
            ></textarea>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-white border border-[#D0E0DB] text-[#0D5C4D] rounded-lg font-semibold hover:bg-[#F0F4F3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg font-semibold transition-colors shadow-sm italic"
            >
              Assign Work
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WorkAssignment;