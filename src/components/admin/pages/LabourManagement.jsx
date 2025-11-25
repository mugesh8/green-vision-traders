import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  MoreVertical,
  ChevronDown,
  Search,
  Calendar,
  X
} from 'lucide-react';

const LabourManagement = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('labourList');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [filters, setFilters] = useState({
    status: 'All',
    workType: 'All',
    location: 'All'
  });
  const [isWorkAssignmentModalOpen, setIsWorkAssignmentModalOpen] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleAction = (action, labourId) => {
    if (action === 'view') {
      navigate(`/labour/${labourId}`);
    } else if (action === 'edit') {
      navigate(`/labour/${labourId}/edit`);
    } else {
      console.log(`${action} action for labour ${labourId}`);
    }
    setOpenDropdown(null);
  };

  const stats = [
    { 
      label: 'Total Third Party', 
      value: '248', 
      color: 'bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0]',
      textColor: 'text-[#0D5C4D]'
    },
    { 
      label: 'Active Third Party', 
      value: '42', 
      color: 'bg-gradient-to-r from-[#6EE7B7] to-[#34D399]',
      textColor: 'text-[#0D5C4D]'
    },
    { 
      label: 'Pending Payouts', 
      value: '₹3.56 L', 
      color: 'bg-gradient-to-r from-[#10B981] to-[#059669]',
      textColor: 'text-white'
    },
    { 
      label: 'Totally Paid(Month)', 
      value: '₹15.6 L', 
      color: 'bg-gradient-to-r from-[#047857] to-[#065F46]',
      textColor: 'text-white'
    }
  ];

  // Labour data
  const labours = [
    {
      id: 1,
      labourId: 'LAB-001',
      name: 'Laksmi',
      avatar: 'RM',
      avatarBg: 'bg-teal-700',
      orderId: 'ORD-2024-1345',
      phone: '+91 98765 43210',
      status: 'Present',
      statusColor: 'bg-[#10B981]',
      dailyWage: '₹650'
    },
    {
      id: 2,
      labourId: 'LAB-002',
      name: 'Reka',
      avatar: 'SK',
      avatarBg: 'bg-teal-800',
      orderId: 'ORD-2024-1344',
      phone: '+91 98765 43211',
      status: 'Present',
      statusColor: 'bg-[#10B981]',
      dailyWage: '₹700'
    },
    {
      id: 3,
      labourId: 'LAB-003',
      name: 'Janani',
      avatar: 'AP',
      avatarBg: 'bg-teal-600',
      orderId: 'Not Assigned',
      phone: '+91 98765 43212',
      status: 'Absent',
      statusColor: 'bg-red-500',
      dailyWage: '₹600'
    },
    {
      id: 4,
      labourId: 'LAB-004',
      name: 'Selvi',
      avatar: 'MV',
      avatarBg: 'bg-teal-700',
      orderId: 'ORD-2024-1342',
      phone: '+91 98765 43213',
      status: 'Present',
      statusColor: 'bg-[#10B981]',
      dailyWage: '₹700'
    },
    {
      id: 5,
      labourId: 'LAB-005',
      name: 'Rani',
      avatar: 'LP',
      avatarBg: 'bg-teal-700',
      orderId: 'ORD-2024-1341',
      phone: '+91 98765 43214',
      status: 'Present',
      statusColor: 'bg-[#10B981]',
      dailyWage: '₹620'
    },
    {
      id: 6,
      labourId: 'LAB-006',
      name: 'Apsara',
      avatar: 'KS',
      avatarBg: 'bg-teal-800',
      orderId: 'Not Assigned',
      phone: '+91 98765 43215',
      status: 'Half Day',
      statusColor: 'bg-orange-500',
      dailyWage: '₹680'
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Tabs and Add Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTabChange('labourList')}
            className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
              activeTab === 'labourList'
                ? 'bg-[#0D7C66] text-white'
                : 'bg-[#D4F4E8] text-[#0D5C4D] hover:bg-[#B8F4D8]'
            }`}
          >
            Labour List
          </button>
          <button
            onClick={() => navigate('/labour/attendance')}
            className="px-6 py-2.5 rounded-lg font-medium text-sm transition-colors bg-[#D4F4E8] text-[#0D5C4D] hover:bg-[#B8F4D8]"
          >
            Attendance
          </button>
          <button
            onClick={() => setIsWorkAssignmentModalOpen(true)}
            className="px-6 py-2.5 rounded-lg font-medium text-sm transition-colors bg-[#D4F4E8] text-[#0D5C4D] hover:bg-[#B8F4D8]"
          >
            Work Assignment
          </button>
        </div>

        <button 
          onClick={() => navigate('/labour/add')}
          className="bg-[#0D7C66] hover:bg-[#0a6354] text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Labour
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.color} rounded-2xl p-6 ${stat.textColor}`}
          >
            <div className="text-sm font-medium mb-2 opacity-90">{stat.label}</div>
            <div className="text-4xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-[#D0E0DB]">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-sm text-[#6B8782] font-medium">Filter by:</span>
          
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <div className="relative">
              <select
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
                className="appearance-none bg-white border border-[#D0E0DB] rounded-lg px-4 py-2 pr-10 text-sm text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] cursor-pointer"
              >
                <option value="All">Status: All</option>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Half Day">Half Day</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B8782] pointer-events-none" size={16} />
            </div>

            {/* Work Type Filter */}
            <div className="relative">
              <select
                value={filters.workType}
                onChange={(e) => setFilters({...filters, workType: e.target.value})}
                className="appearance-none bg-white border border-[#D0E0DB] rounded-lg px-4 py-2 pr-10 text-sm text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] cursor-pointer"
              >
                <option value="All">Work Type: All</option>
                <option value="Packing">Packing</option>
                <option value="Loading">Loading</option>
                <option value="Sorting">Sorting</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B8782] pointer-events-none" size={16} />
            </div>

            {/* Location Filter */}
            <div className="relative">
              <select
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
                className="appearance-none bg-white border border-[#D0E0DB] rounded-lg px-4 py-2 pr-10 text-sm text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] cursor-pointer"
              >
                <option value="All">Location: All</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Madurai">Madurai</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B8782] pointer-events-none" size={16} />
            </div>
          </div>
        </div>
      </div>

      {/* Labour Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="bg-[#D4F4E8]">
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">Labour Id</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">Name</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">Order Id</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">Phone</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">Status</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">Daily Wage</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">Action</th>
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
                      <div className="text-sm font-medium text-[#0D5C4D]">{labour.labourId}</div>
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm font-medium text-[#0D5C4D]">{labour.name}</div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className={`text-sm ${labour.orderId === 'Not Assigned' ? 'text-[#6B8782]' : 'text-[#0D5C4D]'}`}>
                      {labour.orderId}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm text-[#6B8782]">{labour.phone}</div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit text-white ${labour.statusColor}`}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      {labour.status}
                    </span>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="text-sm font-semibold text-[#0D5C4D]">
                      {labour.dailyWage}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className="relative" ref={openDropdown === labour.id ? dropdownRef : null}>
                      <button 
                        onClick={() => setOpenDropdown(openDropdown === labour.id ? null : labour.id)}
                        className="text-[#6B8782] hover:text-[#0D5C4D] transition-colors p-1 hover:bg-[#F0F4F3] rounded"
                      >
                        <MoreVertical size={20} />
                      </button>
                      
                      {openDropdown === labour.id && (
                        <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-[#D0E0DB] py-1 z-10">
                          <button
                            onClick={() => handleAction('view', labour.id)}
                            className="w-full text-left px-4 py-2 text-sm text-[#0D5C4D] hover:bg-[#F0F4F3] transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleAction('edit', labour.id)}
                            className="w-full text-left px-4 py-2 text-sm text-[#0D5C4D] hover:bg-[#F0F4F3] transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleAction('delete', labour.id)}
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

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 sm:px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
          <div className="text-sm text-[#6B8782]">
            Showing 6 of 248 Labours
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
              &lt;
            </button>
            <button className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors bg-[#10B981] text-white">
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
            <button className="px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors text-[#6B8782] hover:bg-[#D0E0DB]">
              10
            </button>
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>

      {/* Work Assignment Modal */}
      <WorkAssignmentModal 
        isOpen={isWorkAssignmentModalOpen}
        onClose={() => setIsWorkAssignmentModalOpen(false)}
      />
    </div>
  );
};

// Work Assignment Modal Component
const WorkAssignmentModal = ({ isOpen, onClose }) => {
  const [selectedDate, setSelectedDate] = useState('Today, Nov 06 2025');
  const [filters, setFilters] = useState({
    assignment: 'All',
    location: 'All'
  });
  const [searchQuery, setSearchQuery] = useState('');
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
    }
  ];

  const handleUpdateAssignment = (labour) => {
    setSelectedLabour(labour);
    setIsUpdateModalOpen(true);
  };

  const handleAssignWork = (labour) => {
    setSelectedLabour(labour);
    setIsAssignModalOpen(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-[#0D5C4D]">Work Assignment</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Date Picker and Search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative">
              <button className="bg-white border border-[#D0E0DB] rounded-lg px-4 py-2.5 text-sm text-[#0D5C4D] flex items-center gap-2">
                <Calendar size={16} className="text-red-500" />
                {selectedDate}
              </button>
            </div>
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
                    <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">ACTION</th>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourManagement;