import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, ChevronDown } from 'lucide-react';

const LabourAttendance = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('attendance');
  const [selectedDate, setSelectedDate] = useState('Today, Nov 06 2025');
  const [filters, setFilters] = useState({
    status: 'All',
    workType: 'All'
  });
  const [searchQuery, setSearchQuery] = useState('');

  const stats = [
    { 
      label: 'Total Registered', 
      value: '142', 
      color: 'bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0]',
      textColor: 'text-[#0D5C4D]'
    },
    { 
      label: 'Present', 
      value: '28', 
      color: 'bg-gradient-to-r from-[#6EE7B7] to-[#34D399]',
      textColor: 'text-[#0D5C4D]'
    },
    { 
      label: 'Absent', 
      value: '45', 
      color: 'bg-gradient-to-r from-[#6EE7B7] to-[#34D399]',
      textColor: 'text-[#0D5C4D]'
    },
    { 
      label: 'Not Marked Yet', 
      value: '18', 
      color: 'bg-gradient-to-r from-[#047857] to-[#065F46]',
      textColor: 'text-white'
    }
  ];

  const labours = [
    {
      id: 1,
      name: 'Rajesh Murugan',
      labourId: 'LAB-001',
      phone: '+91 98765 43210',
      avatar: 'RM',
      avatarBg: 'bg-teal-700',
      workType: 'Packing',
      workTypeBg: 'bg-blue-100',
      workTypeText: 'text-blue-700',
      checkIn: '06:15 AM',
      checkOut: '--:-- --',
      status: 'Present',
      statusColor: 'bg-[#10B981]',
      action: 'checkout'
    },
    {
      id: 2,
      name: 'Senthil Kumar',
      labourId: 'LAB-002',
      phone: '+91 98765 43211',
      avatar: 'SK',
      avatarBg: 'bg-teal-800',
      workType: 'Loading',
      workTypeBg: 'bg-yellow-100',
      workTypeText: 'text-yellow-700',
      checkIn: '06:00 AM',
      checkOut: '02:30 PM',
      status: 'Present',
      statusColor: 'bg-[#10B981]',
      action: 'completed'
    },
    {
      id: 3,
      name: 'Anitha Prabhu',
      labourId: 'LAB-003',
      phone: '+91 98765 43212',
      avatar: 'AP',
      avatarBg: 'bg-teal-600',
      workType: 'Packing',
      workTypeBg: 'bg-blue-100',
      workTypeText: 'text-blue-700',
      checkIn: '--:-- --',
      checkOut: '--:-- --',
      status: 'Absent',
      statusColor: 'bg-red-500',
      action: 'markPresent'
    },
    {
      id: 4,
      name: 'Muthu Vel',
      labourId: 'LAB-004',
      phone: '+91 98765 43213',
      avatar: 'MV',
      avatarBg: 'bg-teal-700',
      workType: 'Unloading',
      workTypeBg: 'bg-yellow-100',
      workTypeText: 'text-yellow-700',
      checkIn: '06:45 AM',
      checkOut: '--:-- --',
      status: 'Present',
      statusColor: 'bg-[#10B981]',
      action: 'checkout'
    },
    {
      id: 5,
      name: 'Lakshmi Priya',
      labourId: 'LAB-005',
      phone: '+91 98765 43214',
      avatar: 'LP',
      avatarBg: 'bg-teal-700',
      workType: 'Packing',
      workTypeBg: 'bg-blue-100',
      workTypeText: 'text-blue-700',
      checkIn: '07:00 AM',
      checkOut: '--:-- --',
      status: 'Present',
      statusColor: 'bg-[#10B981]',
      action: 'checkout'
    },
    {
      id: 6,
      name: 'Kumar Selvam',
      labourId: 'LAB-006',
      phone: '+91 98765 43215',
      avatar: 'KS',
      avatarBg: 'bg-teal-800',
      workType: 'Loading',
      workTypeBg: 'bg-yellow-100',
      workTypeText: 'text-yellow-700',
      checkIn: '11:30 AM',
      checkOut: '--:-- --',
      status: 'Half Day',
      statusColor: 'bg-orange-500',
      action: 'checkout'
    }
  ];

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'labourList') {
      navigate('/labours');
    } else if (tab === 'workAssignment') {
      navigate('/labours/work-assignment');
    }
  };

  const handleAction = (action, labourId) => {
    console.log(`${action} for labour ${labourId}`);
    // Add your action logic here
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
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
              ? 'bg-[#0D7C66] text-white'
              : 'bg-[#D4F4E8] text-[#0D5C4D] hover:bg-[#B8F4D8]'
          }`}
        >
          Attendance
        </button>
        <button
          onClick={() => handleTabChange('workAssignment')}
          className={`px-6 py-2.5 rounded-lg font-medium text-sm transition-colors ${
            activeTab === 'workAssignment'
              ? 'bg-[#10B981] text-white'
              : 'bg-[#D4F4E8] text-[#0D5C4D] hover:bg-[#B8F4D8]'
          }`}
        >
          Work Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className={`${stat.color} rounded-2xl p-6 ${stat.textColor}`}
          >
            <div className="text-sm font-medium mb-2 opacity-90">{stat.label}</div>
            <div className="text-3xl sm:text-4xl font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B8782]" size={20} />
          <input
            type="text"
            placeholder="Search labour..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D8568]"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <select
            value={filters.status}
            onChange={(e) => setFilters({...filters, status: e.target.value})}
            className="appearance-none bg-white border border-[#D0E0DB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] cursor-pointer min-w-[140px]"
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
            className="appearance-none bg-white border border-[#D0E0DB] rounded-lg px-4 py-2.5 pr-10 text-sm text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] cursor-pointer min-w-[150px]"
          >
            <option value="All">Work Type: All</option>
            <option value="Packing">Packing</option>
            <option value="Loading">Loading</option>
            <option value="Unloading">Unloading</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B8782] pointer-events-none" size={16} />
        </div>

        {/* Date Picker */}
        <div className="relative">
          <button className="bg-white border border-[#D0E0DB] rounded-lg px-4 py-2.5 text-sm text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] flex items-center gap-2 min-w-[180px]">
            <Calendar size={16} className="text-red-500" />
            {selectedDate}
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="bg-[#D4F4E8]">
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">LABOUR INFO</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">WORK TYPE</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">CHECK-IN TIME</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">CHECK-OUT TIME</th>
                <th className="px-4 sm:px-6 py-4 text-left text-xs sm:text-sm font-semibold text-[#0D5C4D]">STATUS</th>
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
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${labour.workTypeBg} ${labour.workTypeText}`}>
                      {labour.workType}
                    </span>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className={`text-sm font-medium ${labour.checkIn === '--:-- --' ? 'text-[#6B8782]' : 'text-[#10B981]'}`}>
                      {labour.checkIn}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <div className={`text-sm font-medium ${labour.checkOut === '--:-- --' ? 'text-[#6B8782]' : 'text-red-500'}`}>
                      {labour.checkOut}
                    </div>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 w-fit text-white ${labour.statusColor}`}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      {labour.status}
                    </span>
                  </td>

                  <td className="px-4 sm:px-6 py-4">
                    {labour.action === 'checkout' && (
                      <button
                        onClick={() => handleAction('checkout', labour.id)}
                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Mark Checkout
                      </button>
                    )}
                    {labour.action === 'completed' && (
                      <button
                        className="px-4 py-2 bg-[#E5E7EB] text-[#6B8782] rounded-lg text-xs font-medium cursor-not-allowed"
                        disabled
                      >
                        Completed
                      </button>
                    )}
                    {labour.action === 'markPresent' && (
                      <button
                        onClick={() => handleAction('markPresent', labour.id)}
                        className="px-4 py-2 bg-[#10B981] hover:bg-[#059669] text-white rounded-lg text-xs font-medium transition-colors"
                      >
                        Mark Present
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
            Showing 1-6 of 128 labours
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
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabourAttendance;