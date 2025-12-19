import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Download, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { getAllStock } from '../../../api/orderAssignmentApi';

const StockManagement = () => {
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [productFilter, setProductFilter] = useState('All Products');
  const [dateFilter, setDateFilter] = useState('Last 7 days');
  const [currentPage, setCurrentPage] = useState(1);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        const response = await getAllStock();
        if (response.success) {
          setStockData(response.data || []);
        }
      } catch (error) {
        console.error('Error fetching stock:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStock();
  }, []);

  const summaryCards = [
    { title: 'Total Stock Items', value: stockData.length, bgColor: 'bg-[#D4F4E8]', textColor: 'text-[#0D7C66]' },
    { title: 'Pending Reassignment', value: stockData.length, bgColor: 'bg-[#B8F3DC]', textColor: 'text-[#0D7C66]' },
    { title: 'Total Weight', value: `${stockData.reduce((sum, item) => sum + (parseFloat(item.quantity) || 0), 0).toFixed(1)} Kg`, bgColor: 'bg-[#1CB68B]', textColor: 'text-white' },
    { title: 'Average Age', value: '2.3 Days', bgColor: 'bg-[#0D7C66]', textColor: 'text-white' }
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
          <div key={index} className={`${card.bgColor} rounded-2xl p-6 shadow-sm`}>
            <p className={`text-sm font-medium mb-2 ${card.textColor} opacity-90`}>
              {card.title}
            </p>
            <p className={`text-4xl font-bold ${card.textColor}`}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B8782]" size={20} />
          <input
            type="text"
            placeholder="Search products, orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-[#F0F4F3] border-none rounded-xl text-[#0D5C4D] placeholder-[#6B8782] focus:outline-none focus:ring-2 focus:ring-[#0D8568]"
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="appearance-none px-4 py-3 pr-10 bg-[#F0F4F3] border-none rounded-xl text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] cursor-pointer"
            >
              <option>All Types</option>
              <option>Farmer</option>
              <option>Supplier</option>
              <option>Third Party</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B8782] w-4 h-4 pointer-events-none" />
          </div>
          <button className="px-6 py-3 border border-[#0D7C66] text-[#0D7C66] rounded-xl hover:bg-[#0D7C66] hover:text-white transition-colors font-medium flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#D4F4E8]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                  Order ID
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                  Products
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                  Quantity
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#6B8782]">
                    Loading stock data...
                  </td>
                </tr>
              ) : stockData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#6B8782]">
                    No stock data available
                  </td>
                </tr>
              ) : (
                stockData.map((item, index) => (
                  <tr key={item.sid || index} className={`border-b border-[#D0E0DB] hover:bg-[#F0F4F3] transition-colors ${
                    index % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F3]/30'
                  }`}>
                    <td className="px-6 py-4 text-sm font-medium text-[#0D5C4D]">
                      {item.order_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B8782]">
                      {item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#D4F4E8] text-[#047857]">
                        {item.type || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#0D5C4D]">
                      {item.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-[#6B8782]">
                      {item.products || 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-[#047857]">
                      {item.quantity ? `${item.quantity} kg` : 'N/A'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
          <div className="text-sm text-[#6B8782]">
            Showing page {currentPage} of 1
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button 
              className="px-4 py-2 rounded-lg font-medium bg-[#0D8568] text-white"
            >
              1
            </button>
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={currentPage >= 1}
              className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockManagement;