import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DriverLocalPickups = () => {
  const navigate = useNavigate();
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndKmModal, setShowEndKmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startKm, setStartKm] = useState('');
  const [endKm, setEndKm] = useState('');

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
            onClick={() => handleEndKmClick(order)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors"
          >
            Complete
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
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/drivers')}
            className="flex items-center gap-2 text-[#0D5C4D] hover:text-[#0a6354] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Driver Management</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          <button
            onClick={() => navigate('/drivers/1')}
            className="px-6 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 whitespace-nowrap"
          >
            Driver Details
          </button>
          <button
            className="px-6 py-2.5 rounded-lg font-medium transition-all text-sm whitespace-nowrap bg-[#0D7C66] text-white shadow-md"
          >
            Local Pickups
          </button>
          <button
            onClick={() => navigate('/drivers/1/airport')}
            className="px-6 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 whitespace-nowrap"
          >
            Line Airport
          </button>
          <button
            onClick={() => navigate('/fuel-expense-management')}
            className="px-6 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 whitespace-nowrap"
          >
            Fuel Expenses
          </button>
          <button
            onClick={() => navigate('/excess-km-management')}
            className="px-6 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 whitespace-nowrap"
          >
            Excess KM
          </button>
          <button
            onClick={() => navigate('/advance-pay-management')}
            className="px-6 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 whitespace-nowrap"
          >
            Advance Pay
          </button>
          <button
            onClick={() => navigate('/remarks-management')}
            className="px-6 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 whitespace-nowrap"
          >
            Remarks
          </button>
          <button
            onClick={() => navigate('/drivers/1/daily-payout')}
            className="px-6 py-2.5 rounded-lg font-medium transition-all text-sm bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 whitespace-nowrap"
          >
            Daily Payout
          </button>
        </div>

        {/* Content Area */}
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
    </div>
  );
};

export default DriverLocalPickups;
