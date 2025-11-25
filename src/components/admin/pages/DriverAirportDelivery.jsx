import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';

const DriverAirportDeliveryPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('airport');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today');

  const driverInfo = {
    name: 'Suresh Kumar',
    id: 'DRV-002',
    phone: '+91 98765 43211',
    email: 'suresh.kumar@email.com',
    status: 'On Trip',
    vehicle: {
      name: 'Mahindra Bolero',
      number: 'TN 02 CD 5678',
      capacity: '1.5 Ton'
    },
    stats: {
      todayHours: '6.0 hrs',
      airportTrips: '184',
      rating: '4.9'
    }
  };

  const orders = [
    {
      id: 'APT-2024-A3421',
      type: 'Airport Delivery',
      pickup: { name: 'Warehouse A', location: 'Main Packing Center' },
      airport: { name: 'Chennai Airport', terminal: 'Terminal 2 - Cargo' },
      flightTime: '02:30 PM',
      timeInfo: '30 mins left',
      status: 'In Transit',
      weight: '850 kg'
    },
    {
      id: 'APT-2024-A3420',
      type: 'Airport Delivery',
      pickup: { name: 'Warehouse B', location: 'North Packing Center' },
      airport: { name: 'Chennai Airport', terminal: 'Terminal 2 - Cargo' },
      flightTime: '11:45 AM',
      timeInfo: 'Departed 2 hrs ago',
      status: 'Delivered',
      weight: '920 kg'
    },
    {
      id: 'APT-2024-A3419',
      type: 'Airport Delivery',
      pickup: { name: 'Warehouse C', location: 'South Processing Unit' },
      airport: { name: 'Trichy Airport', terminal: 'Domestic Cargo' },
      flightTime: '04:15 PM',
      timeInfo: 'Scheduled',
      status: 'Loading',
      weight: '650 kg'
    },
    {
      id: 'APT-2024-A3418',
      type: 'Airport Delivery',
      pickup: { name: 'Warehouse A', location: 'Main Packing Center' },
      airport: { name: 'Coimbatore Airport', terminal: 'International Cargo' },
      flightTime: '08:30 AM',
      timeInfo: 'Departed 5 hrs ago',
      status: 'Delivered',
      weight: '1100 kg'
    },
    {
      id: 'APT-2024-A3417',
      type: 'Airport Delivery',
      pickup: { name: 'Warehouse B', location: 'North Packing Center' },
      airport: { name: 'Chennai Airport', terminal: 'Terminal 2 - Cargo' },
      flightTime: '06:00 PM',
      timeInfo: 'Evening Flight',
      status: 'Assigned',
      weight: '780 kg'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Loading':
        return 'bg-yellow-100 text-yellow-700';
      case 'Assigned':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const totalWeight = orders.reduce((sum, order) => {
    return sum + parseInt(order.weight);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/drivers')}
            className="flex items-center gap-2 text-[#0D5C4D] hover:text-[#0a6354] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Driver Management</span>
          </button>
        </div>
        
        {/* Driver Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Avatar and Basic Info */}
            <div className="flex items-center gap-4 flex-1">
              <div className="w-20 h-20 bg-teal-700 rounded-full flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                SK
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{driverInfo.name}</h1>
                <p className="text-sm text-gray-600 mb-2">
                  {driverInfo.id} • {driverInfo.phone}
                </p>
                <p className="text-sm text-gray-500 mb-2">{driverInfo.email}</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                  {driverInfo.status}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-auto">
              {/* Vehicle Info */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Vehicle</div>
                <div className="font-bold text-gray-900 text-lg">{driverInfo.vehicle.name}</div>
                <div className="text-xs text-gray-600">{driverInfo.vehicle.number} • {driverInfo.vehicle.capacity}</div>
              </div>

              {/* Today's Hours */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Today's Hours</div>
                <div className="font-bold text-teal-700 text-2xl">{driverInfo.stats.todayHours}</div>
              </div>

              {/* Airport Trips */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Airport Trips</div>
                <div className="font-bold text-teal-700 text-2xl">{driverInfo.stats.airportTrips}</div>
              </div>

              {/* Rating */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Rating</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-teal-700 text-2xl">{driverInfo.stats.rating}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 5 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/drivers/DRV-002')}
              className="px-5 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            >
              Collection Orders
            </button>
            <button
              onClick={() => setActiveTab('airport')}
              className={`px-6 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'airport'
                  ? 'bg-teal-700 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Airport Delivery
            </button>
          </div>

          {/* Filters */}
          <div className="flex gap-3 w-full sm:w-auto">
            {/* Status Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <div className="text-xs text-[#6B8782] mb-1 font-medium">Status: {statusFilter}</div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D0E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent appearance-none bg-white text-sm font-medium text-[#0D5C4D] cursor-pointer"
                >
                  <option>All</option>
                  <option>Delivered</option>
                  <option>In Transit</option>
                  <option>Loading</option>
                  <option>Assigned</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B8782] pointer-events-none" />
              </div>
            </div>

            {/* Date Filter */}
            <div className="relative flex-1 sm:flex-initial min-w-[140px]">
              <div className="text-xs text-[#6B8782] mb-1 font-medium">Date: {dateFilter}</div>
              <div className="relative">
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-[#D0E0DB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent appearance-none bg-white text-sm font-medium text-[#0D5C4D] cursor-pointer"
                >
                  <option>Today</option>
                  <option>Yesterday</option>
                  <option>This Week</option>
                  <option>This Month</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#6B8782] pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#D4F4E8]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Order ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Pickup (Packing Center)</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Airport</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Flight Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Weight</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className={`border-b border-[#D0E0DB] hover:bg-[#F0F4F3] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F3]/30'}`}>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0D5C4D] text-sm">{order.id}</div>
                      <div className="text-xs text-[#6B8782]">{order.type}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0D5C4D] text-sm">{order.pickup.name}</div>
                      <div className="text-xs text-[#6B8782]">{order.pickup.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-[#0D5C4D] text-sm">{order.airport.name}</div>
                      <div className="text-xs text-[#6B8782]">{order.airport.terminal}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0D5C4D] text-sm">{order.flightTime}</div>
                      <div className={`text-xs ${
                        order.timeInfo.includes('left') 
                          ? 'text-orange-600 font-medium' 
                          : 'text-[#6B8782]'
                      }`}>
                        {order.timeInfo}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0D5C4D] text-sm">{order.weight}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
            <div className="text-sm text-[#6B8782]">
              Showing {orders.length} airport delivery orders for today
            </div>
            <div className="text-sm font-semibold text-[#0D5C4D]">
              Total Cargo: <span className="text-[#0D7C66]">{totalWeight.toLocaleString()} kg</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverAirportDeliveryPage;