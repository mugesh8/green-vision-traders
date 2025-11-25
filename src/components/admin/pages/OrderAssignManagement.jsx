import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronRight, ChevronLeft } from 'lucide-react';

const OrderAssignManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const stats = [
    { label: 'Total Orders', value: '142', bgColor: 'bg-emerald-50', textColor: 'text-emerald-900' },
    { label: 'Created', value: '28', bgColor: 'bg-emerald-100', textColor: 'text-emerald-900' },
    { label: 'Assigned', value: '45', bgColor: 'bg-emerald-200', textColor: 'text-emerald-900' },
    { label: 'In Transit', value: '51', bgColor: 'bg-emerald-500', textColor: 'text-white' },
    { label: 'Delivered', value: '18', bgColor: 'bg-[#0D7C66]', textColor: 'text-white' },
  ];

  const orders = [
    {
      id: 'ORD-2024-1345',
      customer: { name: 'Fresh Mart Store', code: 'CLI-088' },
      products: [
        { name: 'Tomato', color: 'bg-yellow-100 text-yellow-800' },
        { name: 'Carrot', color: 'bg-blue-100 text-blue-800' },
      ],
      more: 2,
      assignedTo: { name: 'Green Fields Farm', code: 'VEN-001' },
      driver: { name: 'Raj Kumar', code: 'DRV-023' },
      amount: '₹24,500',
      status: 'Assigned',
      statusColor: 'bg-emerald-100 text-emerald-700',
    },
    {
      id: 'ORD-2024-1344',
      customer: { name: 'Organic Valley Store', code: 'CLI-045' },
      products: [
        { name: 'Lettuce', color: 'bg-green-100 text-green-800' },
        { name: 'Onion', color: 'bg-pink-100 text-pink-800' },
      ],
      more: 0,
      assignedTo: { name: 'Organic Valley Farm', code: 'VEN-003' },
      driver: { name: 'Amit Singh', code: 'DRV-015' },
      amount: '₹18,200',
      status: 'In Transit',
      statusColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 'ORD-2024-1343',
      customer: { name: 'Super Veggies Ltd', code: 'CLI-112' },
      products: [
        { name: 'Capsicum', color: 'bg-red-100 text-red-800' },
        { name: 'Potato', color: 'bg-purple-100 text-purple-800' },
      ],
      more: 0,
      assignedTo: { name: 'Not Assigned', code: '' },
      driver: { name: 'Not Assigned', code: '' },
      amount: '₹31,750',
      status: 'Created',
      statusColor: 'bg-purple-100 text-purple-700',
    },
    {
      id: 'ORD-2024-1342',
      customer: { name: 'Farm Fresh Retail', code: 'CLI-078' },
      products: [
        { name: 'Corn', color: 'bg-yellow-100 text-yellow-800' },
        { name: 'Broccoli', color: 'bg-green-100 text-green-800' },
      ],
      more: 1,
      assignedTo: { name: 'Harvest Supply', code: 'VEN-008' },
      driver: { name: 'Priya Sharma', code: 'DRV-041' },
      amount: '₹15,900',
      status: 'Collected',
      statusColor: 'bg-gray-700 text-white',
    },
    {
      id: 'ORD-2024-1341',
      customer: { name: 'Green Basket Co.', code: 'CLI-156' },
      products: [
        { name: 'Beetroot', color: 'bg-pink-100 text-pink-800' },
        { name: 'Chili', color: 'bg-orange-100 text-orange-800' },
      ],
      more: 0,
      assignedTo: { name: 'Agri Logistics', code: 'VEN-004' },
      driver: { name: 'Vikram Reddy', code: 'DRV-037' },
      amount: '₹27,300',
      status: 'Delivered',
      statusColor: 'bg-emerald-600 text-white',
    },
    {
      id: 'ORD-2024-1340',
      customer: { name: "Nature's Bounty", code: 'CLI-203' },
      products: [
        { name: 'Garlic', color: 'bg-blue-100 text-blue-800' },
        { name: 'Ginger', color: 'bg-indigo-100 text-indigo-800' },
      ],
      more: 3,
      assignedTo: { name: 'Fresh Produce Hub', code: 'VEN-012' },
      driver: { name: 'Suresh Patel', code: 'DRV-042' },
      amount: '₹22,450',
      status: 'Packed',
      statusColor: 'bg-yellow-100 text-yellow-700',
    },
    {
      id: 'ORD-2024-1339',
      customer: { name: 'Urban Greens Store', code: 'CLI-187' },
      products: [
        { name: 'Peas', color: 'bg-green-100 text-green-800' },
        { name: 'Cabbage', color: 'bg-red-100 text-red-800' },
      ],
      more: 0,
      assignedTo: { name: 'Green Fields Farm', code: 'VEN-001' },
      driver: { name: 'Raj Kumar', code: 'DRV-023' },
      amount: '₹19,800',
      status: 'Delivered',
      statusColor: 'bg-emerald-600 text-white',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
          {/* Search */}
          <div className="relative flex-1 lg:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex gap-3 flex-wrap sm:flex-nowrap">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
              <span className="text-sm font-medium text-gray-700">All Time</span>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
              <span className="text-sm font-medium text-gray-700">All Status</span>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors whitespace-nowrap">
              <span className="text-sm font-medium text-gray-700">Product Type</span>
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Export Button */}
        <button className="px-6 py-2.5 border-2 border-emerald-600 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium whitespace-nowrap">
          Export
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-xl p-6`}>
            <p className={`text-sm font-medium ${stat.textColor} opacity-80 mb-2`}>{stat.label}</p>
            <p className={`text-4xl font-bold ${stat.textColor}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Assigned To
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Driver
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
                      <p className="text-xs text-gray-500">{order.customer.code}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {order.products.map((product, idx) => (
                        <span
                          key={idx}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${product.color}`}
                        >
                          {product.name}
                        </span>
                      ))}
                      {order.more > 0 && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                          +{order.more}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`text-sm font-medium ${order.assignedTo.code ? 'text-gray-900' : 'text-gray-500 italic'}`}>
                        {order.assignedTo.name}
                      </p>
                      {order.assignedTo.code && (
                        <p className="text-xs text-gray-500">{order.assignedTo.code}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className={`text-sm font-medium ${order.driver.code ? 'text-gray-900' : 'text-gray-500 italic'}`}>
                        {order.driver.name}
                      </p>
                      {order.driver.code && (
                        <p className="text-xs text-gray-500">{order.driver.code}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${order.statusColor}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button 
                      onClick={() => navigate(`/order-assign/stage1/${order.id}`, { state: { orderData: order } })}
                      className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                      Assign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-4 py-4 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Showing <span className="font-medium">6</span> of <span className="font-medium">248</span> Orders
            </p>
            <div className="flex items-center gap-2">
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <button className="w-10 h-10 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors">
                1
              </button>
              <button className="w-10 h-10 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                2
              </button>
              <span className="px-2 text-gray-600">...</span>
              <button className="w-10 h-10 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                9
              </button>
              <button className="w-10 h-10 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                10
              </button>
              <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderAssignManagement;