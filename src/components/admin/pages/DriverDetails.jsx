import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ChevronDown, ArrowLeft } from 'lucide-react';

const DriverDetailsPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('collection');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('Today');
  const [showStartModal, setShowStartModal] = useState(false);
  const [showExpensesModal, setShowExpensesModal] = useState(false);
  const [showEndKmModal, setShowEndKmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startKm, setStartKm] = useState('');
  const [endKm, setEndKm] = useState('');
  const [expenseData, setExpenseData] = useState({
    fuelType: 'Petrol',
    petrolBunkName: 'Indian Oil Petroleum',
    unitPrice: '',
    litre: ''
  });

  const driverInfo = {
    name: 'Rajesh Pandey',
    id: 'DRV-001',
    phone: '+91 98765 43210',
    email: 'rajesh.pandey@email.com',
    status: 'Available',
    vehicle: {
      name: 'Tata Ace',
      number: 'TN 01 AB 1234',
      capacity: '1 Ton'
    },
    stats: {
      todayHours: '8.5 hrs',
      totalDeliveries: '247',
      rating: '4.8'
    }
  };

  const [orders, setOrders] = useState([
    {
      id: 'ORD-2024-A2431',
      type: 'Local Pickup',
      pickup: { name: 'Kumar Farm', location: 'Thanjavur District' },
      dropoff: { name: 'Warehouse A', location: 'Packing Center' },
      time: '08:30 AM',
      timeAgo: '2 hrs ago',
      status: 'Delivered',
      weight: '450 kg'
    },
    {
      id: 'ORD-2024-A2432',
      type: 'Local Pickup',
      pickup: { name: 'Ravi Suppliers', location: 'Trichy Market' },
      dropoff: { name: 'Warehouse A', location: 'Packing Center' },
      time: '10:15 AM',
      timeAgo: '45 mins ago',
      status: 'In Transit',
      weight: '320 kg'
    },
    {
      id: 'ORD-2024-A2433',
      type: 'Local Pickup',
      pickup: { name: 'Senthil Farm', location: 'Kumbakonam' },
      dropoff: { name: 'Warehouse B', location: 'Packing Center' },
      time: '12:00 PM',
      timeAgo: 'Scheduled',
      status: 'Collected',
      weight: '500 kg'
    },
    {
      id: 'ORD-2024-A2434',
      type: 'Local Pickup',
      pickup: { name: 'Murugan Vendors', location: 'Karur' },
      dropoff: { name: 'Warehouse A', location: 'Packing Center' },
      time: '07:00 AM',
      timeAgo: '4 hrs ago',
      status: 'Expenses',
      weight: '380 kg'
    },
    {
      id: 'ORD-2024-A2435',
      type: 'Local Pickup',
      pickup: { name: 'Lakshmi Farm', location: 'Perambalur' },
      dropoff: { name: 'Warehouse B', location: 'Packing Center' },
      time: '02:30 PM',
      timeAgo: 'Upcoming',
      status: 'Assigned',
      weight: '600 kg'
    }
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
      case 'Completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'In Transit':
        return 'bg-blue-100 text-blue-700';
      case 'Collected':
        return 'bg-purple-100 text-purple-700';
      case 'Expenses':
        return 'bg-orange-100 text-orange-700';
      case 'Assigned':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
  };

  const handleStartClick = (order) => {
    setSelectedOrder(order);
    setShowStartModal(true);
  };

  const handleStartSubmit = () => {
    if (!startKm) return;
    handleStatusChange(selectedOrder.id, 'In Transit');
    setShowStartModal(false);
    setStartKm('');
    setSelectedOrder(null);
  };

  const handleExpensesClick = (order) => {
    setSelectedOrder(order);
    setShowExpensesModal(true);
  };

  const handleExpensesSubmit = () => {
    if (!expenseData.petrolBunkName || !expenseData.unitPrice || !expenseData.litre) return;
    handleStatusChange(selectedOrder.id, 'Expenses');
    setShowExpensesModal(false);
    setExpenseData({ fuelType: 'Petrol', petrolBunkName: '', unitPrice: '', litre: '' });
    setSelectedOrder(null);
  };

  const handleEndKmClick = (order) => {
    setSelectedOrder(order);
    setShowEndKmModal(true);
  };

  const handleEndKmSubmit = () => {
    if (!endKm) return;
    handleStatusChange(selectedOrder.id, 'Completed');
    setShowEndKmModal(false);
    setEndKm('');
    setSelectedOrder(null);
  };

  const calculateTotal = () => {
    const total = (parseFloat(expenseData.unitPrice) || 0) * (parseFloat(expenseData.litre) || 0);
    return total.toFixed(2);
  };

  const getActionButton = (order) => {
    switch (order.status) {
      case 'Assigned':
        return (
          <button
            onClick={() => handleStartClick(order)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg text-xs font-medium hover:bg-teal-700 transition-colors"
          >
            Start
          </button>
        );
      case 'In Transit':
        return (
          <button
            onClick={() => handleStatusChange(order.id, 'Collected')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors"
          >
            Mark Collected
          </button>
        );
      case 'Collected':
        return (
          <button
            onClick={() => handleStatusChange(order.id, 'Delivered')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg text-xs font-medium hover:bg-purple-700 transition-colors"
          >
            Mark Delivered
          </button>
        );
      case 'Delivered':
        return (
          <button
            onClick={() => handleExpensesClick(order)}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-xs font-medium hover:bg-orange-700 transition-colors"
          >
            Expenses
          </button>
        );
      case 'Expenses':
        return (
          <button
            onClick={() => handleEndKmClick(order)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
          >
            Complete
          </button>
        );
      case 'Completed':
        return (
          <span className="text-xs text-gray-500 font-medium">Completed</span>
        );
      default:
        return null;
    }
  };

  const totalWeight = orders.reduce((sum, order) => {
    return sum + parseInt(order.weight);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
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
                RP
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{driverInfo.name}</h1>
                <p className="text-sm text-gray-600 mb-2">
                  {driverInfo.id} • {driverInfo.phone}
                </p>
                <p className="text-sm text-gray-500 mb-2">{driverInfo.email}</p>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  {driverInfo.status}
                </span>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-auto">
              {/* Vehicle Info */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Vehicle</div>
                <div className="font-bold text-gray-900 text-lg italic">{driverInfo.vehicle.name}</div>
                <div className="text-xs text-gray-600">{driverInfo.vehicle.number} • {driverInfo.vehicle.capacity}</div>
              </div>

              {/* Today's Hours */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Today's Hours</div>
                <div className="font-bold text-teal-700 text-2xl">{driverInfo.stats.todayHours}</div>
              </div>

              {/* Total Deliveries */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Total Deliveries</div>
                <div className="font-bold text-gray-900 text-2xl">{driverInfo.stats.totalDeliveries}</div>
              </div>

              {/* Rating */}
              <div>
                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Rating</div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-2xl">{driverInfo.stats.rating}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
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
              onClick={() => setActiveTab('collection')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all text-sm ${
                activeTab === 'collection'
                  ? 'bg-[#0D7C66] text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              Local Pickups
            </button>
            <button
              onClick={() => navigate('/drivers/DRV-001/airport')}
              className="px-5 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            >
              Line Airport
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
                  <option>Completed</option>
                  <option>In Transit</option>
                  <option>Pending</option>
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
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Pickup Location</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Dropoff</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Weight</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Actions</th>
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
                      <div className="font-medium text-[#0D5C4D] text-sm">{order.dropoff.name}</div>
                      <div className="text-xs text-[#6B8782]">{order.dropoff.location}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0D5C4D] text-sm">{order.time}</div>
                      <div className="text-xs text-[#6B8782]">{order.timeAgo}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-[#0D5C4D] text-sm">{order.weight}</div>
                    </td>
                    <td className="px-6 py-4">
                      {getActionButton(order)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
            <div className="text-sm text-[#6B8782]">
              Showing {orders.length} orders for today
            </div>
            <div className="text-sm font-semibold text-[#0D5C4D]">
              Total Weight: <span className="text-[#0D7C66]">{totalWeight.toLocaleString()} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Start Kilometer Modal */}
      {showStartModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Start Journey</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">Start Kilometer</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={startKm}
                  onChange={(e) => setStartKm(e.target.value)}
                  placeholder="Enter kilometer"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">km</span>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowStartModal(false);
                  setStartKm('');
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleStartSubmit}
                disabled={!startKm}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Kilometer Modal */}
      {showEndKmModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-gray-900 mb-4">End Journey</h3>
            <div className="mb-4">
              <label className="block text-sm text-gray-700 mb-2">End Kilometer</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={endKm}
                  onChange={(e) => setEndKm(e.target.value)}
                  placeholder="Enter kilometer"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <span className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700">km</span>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowEndKmModal(false);
                  setEndKm('');
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEndKmSubmit}
                disabled={!endKm}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expenses Modal */}
      {showExpensesModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Add Expenses</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">Fuel Type</label>
                <select
                  value={expenseData.fuelType}
                  onChange={(e) => setExpenseData({ ...expenseData, fuelType: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Petrol">Petrol</option>
                  <option value="Diesel">Diesel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Petrol Bunk Name</label>
                <select
                  value={expenseData.petrolBunkName}
                  onChange={(e) => setExpenseData({ ...expenseData, petrolBunkName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="Indian Oil Petroleum">Indian Oil Petroleum</option>
                  <option value="Bharat Petroleum">Bharat Petroleum</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Unit Price</label>
                <input
                  type="number"
                  value={expenseData.unitPrice}
                  onChange={(e) => setExpenseData({ ...expenseData, unitPrice: e.target.value })}
                  placeholder="Enter unit price"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Litre</label>
                <input
                  type="number"
                  value={expenseData.litre}
                  onChange={(e) => setExpenseData({ ...expenseData, litre: e.target.value })}
                  placeholder="Enter litres"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-2">Total Amount</label>
                <input
                  type="text"
                  value={calculateTotal()}
                  readOnly
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-700"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowExpensesModal(false);
                  setExpenseData({ fuelType: 'Petrol', petrolBunkName: 'Indian Oil Petroleum', unitPrice: '', litre: '' });
                  setSelectedOrder(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleExpensesSubmit}
                disabled={!expenseData.petrolBunkName || !expenseData.unitPrice || !expenseData.litre}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:opacity-50"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverDetailsPage;