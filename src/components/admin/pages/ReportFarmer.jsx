import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, ChevronLeft, ChevronRight, Check, Clock, MoreHorizontal, ArrowLeft } from 'lucide-react';

const ReportFarmer = () => {
  const navigate = useNavigate();
  const [selectedFarmer, setSelectedFarmer] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [currentPage, setCurrentPage] = useState(1);

  const farmers = [
    {
      id: '1786447854',
      name: 'Vijayakumar',
      products: ['Ladies Finger', 'Drumstick'],
      quantity: '18 KG',
      totalValue: '₹18,090',
      paid: '₹18,090',
      pending: '₹0',
      status: 'paid'
    },
    {
      id: '9876543210',
      name: 'Ramesh Kumar',
      products: ['Karpooravalli', 'Nendiran'],
      quantity: '27 KG',
      totalValue: '₹17,006',
      paid: '₹14,006',
      pending: '₹3,000',
      status: 'pending'
    },
    {
      id: '5656989893',
      name: 'Suresh Babu',
      products: ['Tomato', 'Carrot'],
      quantity: '45 KG',
      totalValue: '₹45,371',
      paid: '₹45,371',
      pending: '₹0',
      status: 'paid'
    },
    {
      id: '9123456789',
      name: 'Murali Krishna',
      products: ['Peas', 'Cabbage'],
      quantity: '33 KG',
      totalValue: '₹19,800',
      paid: '₹10,350',
      pending: '₹9,450',
      status: 'pending'
    },
    {
      id: '9445566778',
      name: 'Arun Prakash',
      products: ['Corn', 'Broccoli'],
      quantity: '52 KG',
      totalValue: '₹34,120',
      paid: '₹34,120',
      pending: '₹0',
      status: 'paid'
    }
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <button onClick={() => navigate('/reports')} className="flex items-center gap-2 text-[#0D5C4D] hover:text-[#0a6354] mb-4 transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="text-sm font-medium">Back to Reports</span>
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="md:col-span-1">
          <button className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-300 transition-colors">
            <span className="text-gray-700 text-sm">All Farmers</span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="md:col-span-1">
          <button className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-left flex items-center justify-between hover:border-gray-300 transition-colors">
            <span className="text-gray-700 text-sm">This Month</span>
            <ChevronDown className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <div className="md:col-span-1 flex justify-end">
          <button className="w-full md:w-auto bg-emerald-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0] rounded-2xl p-6 text-[#0D5C4D]">
          <div className="text-sm font-medium mb-2 opacity-90">Total Farmers</div>
          <div className="text-4xl font-bold mb-2">48</div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/60 text-[#0D5C4D]">Active suppliers</div>
        </div>
        <div className="bg-gradient-to-r from-[#6EE7B7] to-[#34D399] rounded-2xl p-6 text-[#0D5C4D]">
          <div className="text-sm font-medium mb-2 opacity-90">Total Supply</div>
          <div className="text-4xl font-bold mb-2">750 KG</div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/60 text-[#0D5C4D]">This Month</div>
        </div>
        <div className="bg-gradient-to-r from-[#10B981] to-[#059669] rounded-2xl p-6 text-white">
          <div className="text-sm font-medium mb-2 opacity-90">Total Payout</div>
          <div className="text-4xl font-bold mb-2">₹78,090</div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">Goods value</div>
        </div>
        <div className="bg-gradient-to-r from-[#047857] to-[#065F46] rounded-2xl p-6 text-white">
          <div className="text-sm font-medium mb-2 opacity-90">Pending Dues</div>
          <div className="text-4xl font-bold mb-2">₹12,450</div>
          <div className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-white/20 text-white">To be settled</div>
        </div>
      </div>

      {/* Farmers Table */}
      <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#D4F4E8]">
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Farmer Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Products</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Quantity</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Total Value</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Paid</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Pending</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Status</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((farmer, index) => (
                <tr key={farmer.id} className={`border-b border-[#D0E0DB] hover:bg-[#F0F4F3] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F3]/30'}`}>
                  <td className="px-6 py-4">
                    <div className="font-semibold text-[#0D5C4D]">{farmer.name}</div>
                    <div className="text-xs text-[#6B8782]">ID: {farmer.id}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {farmer.products.map((product, idx) => (
                        <span key={idx} className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#D4F4E8] text-[#047857]">{product}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#0D5C4D]">{farmer.quantity}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#0D5C4D]">{farmer.totalValue}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#047857]">{farmer.paid}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-red-600">{farmer.pending}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${farmer.status === 'paid' ? 'bg-[#4ED39A] text-white' : 'bg-red-500 text-white'}`}>
                      <div className="w-2 h-2 rounded-full bg-white"></div>
                      {farmer.status === 'paid' ? 'Paid' : 'Pending'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
          <div className="text-sm text-[#6B8782]">Showing 5 of 48 farmers</div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">&lt;</button>
            <button className="px-4 py-2 rounded-lg font-medium bg-[#0D8568] text-white">1</button>
            <button className="px-4 py-2 rounded-lg font-medium text-[#6B8782] hover:bg-[#D0E0DB]">2</button>
            <button className="px-4 py-2 rounded-lg font-medium text-[#6B8782] hover:bg-[#D0E0DB]">3</button>
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">...</button>
            <button className="px-4 py-2 rounded-lg font-medium text-[#6B8782] hover:bg-[#D0E0DB]">10</button>
            <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportFarmer;