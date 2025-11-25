import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Check, ChevronDown, Edit2, X, AlertCircle } from 'lucide-react';

const OrderAssignCreateStage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const orderData = location.state?.orderData;
  const [packagingStatus, setPackagingStatus] = useState('Quality Check Completed');
  const [packagingDate, setPackagingDate] = useState('14/12/2024');

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Order Information Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="text-sm font-semibold text-gray-900">{orderData?.id || id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Customer Name</p>
            <p className="text-sm font-medium text-gray-900">{orderData?.customer?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Needed By Date</p>
            <p className="text-sm font-medium text-gray-900">15/12/2024</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Products</p>
            <p className="text-sm font-medium text-gray-900">{orderData?.products?.length || 0} Items</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
              Packed
            </span>
          </div>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <button className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2">
          <Check className="w-5 h-5" />
          Stage 1: Collected
        </button>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors">
          Stage 2: Packaging to Airport
        </button>
      </div>

      {/* Stage 2 Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Stage 2: Transport from Packaging to Airport</h2>
        <p className="text-sm text-gray-600 mb-6">Manage final delivery from packaging location to airport for export shipment</p>

        {/* Stage 1 Completion Status */}
        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 mb-6">
          <h3 className="text-sm font-semibold text-emerald-900 mb-2">Stage 1 Completion Status</h3>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-emerald-800">All products collected and delivered to packaging location</p>
          </div>
          <div className="flex items-start gap-2 mt-2">
            <Check className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-emerald-800">Received at: Central Packaging Warehouse - 13/12/2024, 10:30 AM</p>
          </div>
        </div>

        {/* Packaging & Quality Check */}
        <h3 className="text-base font-semibold text-gray-900 mb-4">Packaging & Quality Check</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Packaging Status</label>
            <div className="relative">
              <select
                value={packagingStatus}
                onChange={(e) => setPackagingStatus(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              >
                <option>Quality Check Completed</option>
                <option>In Progress</option>
                <option>Pending</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Packaging Date</label>
            <div className="relative">
              <select
                value={packagingDate}
                onChange={(e) => setPackagingDate(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              >
                <option>14/12/2024</option>
                <option>15/12/2024</option>
                <option>16/12/2024</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Ready for Dispatch</label>
            <input
              type="text"
              value="14/12/2024, 2:00 PM"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Net Weight</label>
            <input
              type="text"
              value="400 kg"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Gross Weight</label>
            <input
              type="text"
              value="470 kg"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Package Count</label>
            <input
              type="text"
              value="15 Packages"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Airport Delivery Assignment */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Airport Delivery Assignment</h3>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-12 gap-4 mb-6">
            <div className="col-span-3">
              <label className="text-xs font-semibold text-gray-700 uppercase mb-2 block">Pickup Location</label>
              <div>
                <p className="text-sm font-medium text-gray-900">Central Packaging Warehouse</p>
                <p className="text-xs text-gray-500">Industrial Area, Sector 5</p>
              </div>
            </div>

            <div className="col-span-3">
              <label className="text-xs font-semibold text-gray-700 uppercase mb-2 block">Destination</label>
              <div>
                <p className="text-sm font-medium text-gray-900">International Airport</p>
                <p className="text-xs text-gray-500">Cargo Terminal 2</p>
              </div>
            </div>

            <div className="col-span-3">
              <label className="text-xs font-semibold text-gray-700 uppercase mb-2 block">Assigned Driver</label>
              <div className="relative">
                <select className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
                  <option>Ramesh Kumar - DRV-445</option>
                  <option>Suresh Patel - DRV-223</option>
                  <option>Vikram Singh - DRV-334</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
              </div>
            </div>

            <div className="col-span-3">
              <label className="text-xs font-semibold text-gray-700 uppercase mb-2 block">Action</label>
              <div className="flex items-center gap-2">
                <button className="p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-600">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-red-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden space-y-4 mb-6">
          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase mb-2 block">Pickup Location</label>
            <p className="text-sm font-medium text-gray-900">Central Packaging Warehouse</p>
            <p className="text-xs text-gray-500">Industrial Area, Sector 5</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase mb-2 block">Destination</label>
            <p className="text-sm font-medium text-gray-900">International Airport</p>
            <p className="text-xs text-gray-500">Cargo Terminal 2</p>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-700 uppercase mb-2 block">Assigned Driver</label>
            <div className="relative">
              <select className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white">
                <option>Ramesh Kumar - DRV-445</option>
                <option>Suresh Patel - DRV-223</option>
                <option>Vikram Singh - DRV-334</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex-1 p-2.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors border-2 border-emerald-600 font-medium">
              <Edit2 className="w-4 h-4 inline-block mr-2" />
              Edit
            </button>
            <button className="flex-1 p-2.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors border-2 border-red-600 font-medium">
              <X className="w-4 h-4 inline-block mr-2" />
              Remove
            </button>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Special Instructions / Notes</label>
          <textarea
            rows="3"
            placeholder="Temperature control required. Maintain 2-4°C during transport..."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
            defaultValue="Temperature control required. Maintain 2-4°C during transport..."
          />
        </div>

        {/* Important Information Box */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-semibold text-blue-900 mb-1">Important Information</h4>
              <p className="text-sm text-blue-800 mb-1">Ensure all customs documentation is prepared</p>
              <p className="text-sm text-blue-800 mb-1">Export clearance scheduled for 15/12/2024, 8:00 AM</p>
              <p className="text-sm text-blue-800">Flight: AI-456 to Dubai International</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button 
          onClick={() => navigate(`/order-assign/stage1/${id}`, { state: { orderData } })}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors">
          Confirm & Dispatch
        </button>
      </div>
    </div>
  );
};

export default OrderAssignCreateStage2;