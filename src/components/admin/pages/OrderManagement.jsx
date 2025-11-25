import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';

const OrderManagement = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [timeFilter, setTimeFilter] = useState('All Time');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [productFilter, setProductFilter] = useState('Product Type');

  const statsCards = [
    { title: 'Total Orders', value: '142', bgColor: 'bg-[#D4F4E8]', textColor: 'text-[#0D7C66]' },
    { title: 'Created', value: '28', bgColor: 'bg-[#B8F3DC]', textColor: 'text-[#0D7C66]' },
    { title: 'Assigned', value: '45', bgColor: 'bg-[#7FE5B8]', textColor: 'text-[#0D7C66]' },
    { title: 'In Transit', value: '51', bgColor: 'bg-[#1CB68B]', textColor: 'text-white' },
    { title: 'Delivered', value: '18', bgColor: 'bg-[#0D7C66]', textColor: 'text-white' },
  ];

  const orders = [
    {
      id: 'ORD-1001',
      customer: 'Fresh Mart Store',
      boxes: '50 boxes',
      packing: 'Single Farmer',
      netWeight: '25 kg',
      grossWeight: '27 kg',
      total: '1350 kg',
      marketPrice: '₹67,500',
    },
    {
      id: 'ORD-1002',
      customer: 'Organic Valley Store',
      boxes: '100 bags',
      packing: 'Red',
      netWeight: '50 kg',
      grossWeight: '52 kg',
      total: '5200 kg',
      marketPrice: '₹1,56,000',
    },
    {
      id: 'ORD-1003',
      customer: 'VV Vegie Store',
      boxes: '75 bags',
      packing: 'Green',
      netWeight: '30 kg',
      grossWeight: '31 kg',
      total: '2325 kg',
      marketPrice: '₹69,750',
    },
    {
      id: 'ORD-1004',
      customer: 'Farm Fresh Retails',
      boxes: '40 boxes',
      packing: 'Brown',
      netWeight: '20 kg',
      grossWeight: '22 kg',
      total: '880 kg',
      marketPrice: '₹52,800',
    },
    {
      id: 'ORD-1005',
      customer: 'Green Basket Co.',
      boxes: '60 boxes',
      packing: 'Red',
      netWeight: '15 kg',
      grossWeight: '16 kg',
      total: '960 kg',
      marketPrice: '₹28,800',
    },
    {
      id: 'ORD-1006',
      customer: "Nature's Bounty",
      boxes: '80 boxes',
      packing: 'Single Farmer',
      netWeight: '12 kg',
      grossWeight: '13 kg',
      total: '1040 kg',
      marketPrice: '₹41,600',
    },
    {
      id: 'ORD-1007',
      customer: 'Urban Green Store',
      boxes: '30 bags',
      packing: 'Red',
      netWeight: '10 kg',
      grossWeight: '10.5 kg',
      total: '315 kg',
      marketPrice: '₹23,625',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-end mb-6">
          <button 
            onClick={() => navigate('/orders/create')}
            className="bg-[#0D7C66] hover:bg-[#0a6252] text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <span className="text-xl">+</span> New Order
          </button>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID, customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
              <span className="text-gray-700">{timeFilter}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
              <span className="text-gray-700">{statusFilter}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors duration-200">
              <span className="text-gray-700">{productFilter}</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>
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

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Order ID
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
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Market Prize
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#0D7C66] uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.boxes}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.packing}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.netWeight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.grossWeight}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.total}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {order.marketPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    <button className="p-1 hover:bg-gray-100 rounded transition-colors duration-150">
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">Showing 6 of 248 Labours</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
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
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors duration-150 ${
                currentPage === 2
                  ? 'bg-[#0D7C66] text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setCurrentPage(2)}
            >
              2
            </button>
            <span className="px-2 text-gray-500">...</span>
            <button
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors duration-150 ${
                currentPage === 9
                  ? 'bg-[#0D7C66] text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setCurrentPage(9)}
            >
              9
            </button>
            <button
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors duration-150 ${
                currentPage === 10
                  ? 'bg-[#0D7C66] text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
              onClick={() => setCurrentPage(10)}
            >
              10
            </button>
            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-150"
            >
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;