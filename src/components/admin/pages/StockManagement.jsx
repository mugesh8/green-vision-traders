import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const StockManagement = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [productFilter, setProductFilter] = useState('All Products');
  const [dateFilter, setDateFilter] = useState('Last 7 days');
  const [currentPage, setCurrentPage] = useState(1);

  // Sample data
  const stockData = [
    {
      id: 1,
      product: 'Mango (Alphonso)',
      orderId: '#ORD-2024-1089',
      quantity: '20 kg',
      orderType: 'BOX',
      dateAdded: '15/12/2024',
      daysInStock: '2 days',
      status: 'Pending'
    },
    {
      id: 2,
      product: 'Potato (White)',
      orderId: '#ORD-2024-1089',
      quantity: '150 kg',
      orderType: 'BOX',
      dateAdded: '15/12/2024',
      daysInStock: '2 days',
      status: 'Pending'
    },
    {
      id: 3,
      product: 'Cabbage (Green)',
      orderId: '#ORD-2024-1145',
      quantity: '15 kg',
      orderType: 'BAG',
      dateAdded: '16/12/2024',
      daysInStock: '1 day',
      status: 'Pending'
    },
    {
      id: 4,
      product: 'Capsicum (Mixed)',
      orderId: '#ORD-2024-1145',
      quantity: '40 kg',
      orderType: 'BAG',
      dateAdded: '16/12/2024',
      daysInStock: '1 day',
      status: 'Pending'
    },
    {
      id: 5,
      product: 'Tomato (Hybrid)',
      orderId: '#ORD-2024-1098',
      quantity: '35 kg',
      orderType: 'BOX',
      dateAdded: '14/12/2024',
      daysInStock: '3 days',
      status: 'Aging'
    },
    {
      id: 6,
      product: 'Onion (Red)',
      orderId: '#ORD-2024-1102',
      quantity: '25 kg',
      orderType: 'BAG',
      dateAdded: '13/12/2024',
      daysInStock: '4 days',
      status: 'Reassigned'
    },
    {
      id: 7,
      product: 'Carrot (Orange)',
      orderId: '#ORD-2024-1078',
      quantity: '18 kg',
      orderType: 'BOX',
      dateAdded: '17/12/2024',
      daysInStock: 'Today',
      status: 'Pending'
    },
    {
      id: 8,
      product: 'Cucumber (Fresh)',
      orderId: '#ORD-2024-1056',
      quantity: '45 kg',
      orderType: 'BOX',
      dateAdded: '12/12/2024',
      daysInStock: '5 days',
      status: 'Critical'
    }
  ];

  const summaryCards = [
    { title: 'Total Stock Items', value: '86', bgColor: 'bg-emerald-100' },
    { title: 'Pending Reassignment', value: '72', bgColor: 'bg-emerald-200' },
    { title: 'Total Weight', value: '425 Kg', bgColor: 'bg-emerald-500 text-white' },
    { title: 'Average Age', value: '2.3 Days', bgColor: 'bg-emerald-700 text-white' }
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedItems(stockData.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-100 text-amber-700';
      case 'Aging':
        return 'bg-pink-100 text-pink-700';
      case 'Reassigned':
        return 'bg-blue-100 text-blue-700';
      case 'Critical':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getOrderTypeStyle = (type) => {
    switch (type) {
      case 'BOX':
        return 'bg-emerald-100 text-emerald-700';
      case 'BAG':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getActionButton = (status, item) => {
    if (status === 'Reassigned') {
      return (
        <button className="px-4 py-1.5 text-sm text-gray-400 border border-gray-300 rounded-md">
          Assigned
        </button>
      );
    }
    if (status === 'Critical' || status === 'Aging') {
      return (
        <button 
          onClick={() => navigate(`/stock/${item.id}`, { state: { stockData: item } })}
          className="px-4 py-1.5 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
        >
          Urgent
        </button>
      );
    }
    return (
      <button 
        onClick={() => navigate(`/stock/${item.id}`, { state: { stockData: item } })}
        className="px-4 py-1.5 text-sm text-emerald-600 border border-emerald-600 rounded-md hover:bg-emerald-50 transition-colors"
      >
        Reassign
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {summaryCards.map((card, index) => (
          <div key={index} className={`${card.bgColor} rounded-lg p-6 shadow-sm`}>
            <h3 className={`text-sm font-medium mb-2 ${card.bgColor.includes('text-white') ? 'text-white' : 'text-gray-600'}`}>
              {card.title}
            </h3>
            <p className={`text-3xl font-bold ${card.bgColor.includes('text-white') ? 'text-white' : 'text-gray-900'}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filters and Actions */}
      <div className="bg-white rounded-lg shadow-sm mb-6 p-4">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto flex-1">
            {/* Search */}
            <div className="relative flex-1 sm:flex-initial sm:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products, orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none w-full sm:w-40 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white cursor-pointer"
              >
                <option>All Status</option>
                <option>Pending</option>
                <option>Aging</option>
                <option>Critical</option>
                <option>Reassigned</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Product Filter */}
            <div className="relative">
              <select
                value={productFilter}
                onChange={(e) => setProductFilter(e.target.value)}
                className="appearance-none w-full sm:w-40 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white cursor-pointer"
              >
                <option>All Products</option>
                <option>Vegetables</option>
                <option>Fruits</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Date Filter */}
            <div className="relative">
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="appearance-none w-full sm:w-40 px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white cursor-pointer"
              >
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full lg:w-auto">
            <button className="flex-1 lg:flex-initial px-6 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 transition-colors font-medium">
              Reassign Selected
            </button>
            <button className="flex-1 lg:flex-initial px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={selectedItems.length === stockData.length}
                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Order Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date Added
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Days in Stock
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {stockData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-4 py-4 text-sm text-blue-600 hover:text-blue-800 cursor-pointer">
                    {item.orderId}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-md ${getOrderTypeStyle(item.orderType)}`}>
                      {item.orderType}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-900">
                    {item.dateAdded}
                  </td>
                  <td className="px-4 py-4 text-sm">
                    <span className={`${
                      item.daysInStock === 'Today' ? 'text-emerald-600' :
                      parseInt(item.daysInStock) <= 2 ? 'text-amber-600' :
                      'text-red-600'
                    }`}>
                      {item.daysInStock}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`inline-block px-3 py-1 text-xs font-medium rounded-md ${getStatusStyle(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {getActionButton(item.status, item)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-4 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-600">
            Showing 6 of 248 Farmers
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            </button>
            <button className="px-3 py-1.5 bg-emerald-600 text-white rounded-md font-medium">
              1
            </button>
            <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              2
            </button>
            <span className="px-3 py-1.5 text-gray-500">...</span>
            <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              9
            </button>
            <button className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors">
              10
            </button>
            <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <ChevronRight className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;