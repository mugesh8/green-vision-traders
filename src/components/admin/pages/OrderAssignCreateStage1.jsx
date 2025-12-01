import React, { useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronDown, Edit2, X, MapPin } from 'lucide-react';

const OrderAssignCreateStage1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const orderData = location.state?.orderData;
  const [selectedType, setSelectedType] = useState('Box');
  const [deliveryType, setDeliveryType] = useState('Local Pickups');

  const productRows = [
    {
      product: 'Mango (Alphonso)',
      quantity: '50 kg',
      remaining: '20 kg',
      assignedTo: 'Raju Farms',
      assignedQty: 30,
      tapeType: 'SINGLE FARMER',
      labour: 'Mahen',
      status: 'Partial',
      statusColor: 'bg-blue-100 text-blue-700',
      canEdit: true,
    },
    {
      product: '',
      quantity: '',
      remaining: '20 kg',
      assignedTo: '',
      assignedQty: 0,
      tapeType: '',
      labour: '',
      status: 'Unassigned',
      statusColor: 'bg-red-100 text-red-700',
      canEdit: false,
    },
    {
      product: 'Carrot (Orange)',
      quantity: '100 kg',
      remaining: '',
      assignedTo: 'Kumar Vegetables',
      assignedQty: 100,
      tapeType: 'RED',
      labour: '',
      status: 'Assigned',
      statusColor: 'bg-emerald-100 text-emerald-700',
      canEdit: true,
    },
    {
      product: 'Tomato (Hybrid)',
      quantity: '75 kg',
      remaining: '',
      assignedTo: 'Fresh Produce Ltd',
      assignedQty: 75,
      tapeType: 'BROWN',
      labour: '',
      status: 'Assigned',
      statusColor: 'bg-emerald-100 text-emerald-700',
      canEdit: true,
    },
    {
      product: 'Potato (White)',
      quantity: '150 kg',
      remaining: '',
      assignedTo: '',
      assignedQty: 0,
      tapeType: '',
      labour: '',
      status: 'Unassigned',
      statusColor: 'bg-red-100 text-red-700',
      canEdit: false,
    },
    {
      product: 'Spinach (Fresh)',
      quantity: '25 kg',
      remaining: '',
      assignedTo: 'Organic Greens Co.',
      assignedQty: 25,
      tapeType: 'RED',
      labour: '',
      status: 'Assigned',
      statusColor: 'bg-emerald-100 text-emerald-700',
      canEdit: true,
    },
  ];

  const deliveryRoutes = [
    {
      location: 'Raju Farms',
      address: 'Village Road, Dist: 40km',
      products: 'Mango (50kg)',
      distance: '45 km',
      driver: 'Select Driver',
      pickupDate: 'dd/mm/yyyy',
      deliveryType: 'Local Pickups',
      isAssigned: false,
    },
    {
      location: 'Kumar Vegetables',
      address: 'Market Area, Dist: 10km',
      products: 'Carrot (100kg)',
      distance: '15 km',
      driver: 'Rajesh - DRV-205',
      pickupDate: '12/12/2024',
      deliveryType: 'Line Airport',
      isAssigned: true,
    },
    {
      location: 'Fresh Produce Ltd',
      address: 'Industrial Zone, Dist: 20km',
      products: 'Tomato (75kg)\nSpinach (25kg)',
      distance: '28 km',
      driver: 'Arun - DRV-318',
      pickupDate: '12/12/2024',
      deliveryType: 'Local Pickups',
      isAssigned: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Order Information Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
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
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${orderData?.statusColor || 'bg-purple-100 text-purple-700'}`}>
              {orderData?.status || 'Created'}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Order Type</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              BOX TYPE
            </span>
          </div>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors">
          Stage 1: Product Collection
        </button>
        <button className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors">
          Stage 2: Packaging to Airport
        </button>
      </div>

      {/* Stage 1 Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Stage 1: Product Collection from Sources(Box/Bag)</h2>
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 bg-white border-2 border-emerald-600 text-emerald-700 rounded-lg font-medium cursor-pointer hover:bg-emerald-50 transition-colors outline-none"
            >
              <option value="Box">Box</option>
              <option value="Bag">Bag</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">Assign order products to farmers, suppliers, and third parties for collection and delivery to packaging location</p>

        {/* Product Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity Needed</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned Qty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tape Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Labour</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productRows.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900">{row.product}</span>
                    {row.remaining && (
                      <span className="block text-xs text-gray-500 italic mt-1">Remaining {row.remaining}</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">{row.quantity}</span>
                  </td>
                  <td className="px-4 py-4">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                      <option>{row.assignedTo || 'Select farmer/supplier...'}</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={row.assignedQty || ''}
                      placeholder="0"
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={row.tapeType}
                      placeholder="Type labour"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={row.labour}
                      placeholder="Type labour"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {row.canEdit ? (
                        <>
                          <button className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                            Assign
                          </button>
                          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                            Assign
                          </button>
                          <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors">
                            Add to Stock
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Product Cards - Mobile */}
        <div className="lg:hidden space-y-4">
          {productRows.map((row, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">{row.product || 'Not Assigned'}</p>
                  <p className="text-xs text-gray-500 mt-1">{row.quantity}</p>
                  {row.remaining && (
                    <p className="text-xs text-gray-500 italic mt-1">Remaining {row.remaining}</p>
                  )}
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${row.statusColor}`}>
                  {row.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Assigned To</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>{row.assignedTo || 'Select farmer/supplier...'}</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Assigned Qty</label>
                    <input
                      type="number"
                      value={row.assignedQty || ''}
                      placeholder="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Tape Type</label>
                    <input
                      type="text"
                      value={row.tapeType}
                      placeholder="Type"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Labour</label>
                  <input
                    type="text"
                    value={row.labour}
                    placeholder="Type labour"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium">
                  Assign
                </button>
                {row.canEdit ? (
                  <>
                    <button className="p-2 border border-emerald-600 text-emerald-600 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-red-600 text-red-600 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
                    Add to Stock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Routes Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Delivery Routes to Packaging Location</h2>
        <p className="text-sm text-gray-600 mb-4">Assign separate drivers for each farmer/supplier location</p>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Packaging Destination</label>
          <div className="flex items-center gap-3 p-4 border-2 border-emerald-600 rounded-lg bg-emerald-50">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <span className="text-sm font-medium text-emerald-900">Central Packaging Warehouse, Industrial Area</span>
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-4">Driver Assignment & Delivery Routes</h3>
        <p className="text-sm text-gray-600 mb-4">Assign separate drivers for each farmer/supplier location to deliver to packaging</p>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pickup From</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Products</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Distance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Delivery Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned Driver</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pickup Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliveryRoutes.map((route, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-900">{route.location}</p>
                    <p className="text-xs text-gray-500">{route.address}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-900 whitespace-pre-line">{route.products}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">{route.distance}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative">
                      <select className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                        <option value="Local Pickups" selected={route.deliveryType === 'Local Pickups'}>Local Pickups</option>
                        <option value="Line Airport" selected={route.deliveryType === 'Line Airport'}>Line Airport</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                      <option>{route.driver}</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                      <option>{route.pickupDate}</option>
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                        Assign
                      </button>
                      {route.isAssigned && (
                        <>
                          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {deliveryRoutes.map((route, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-900">{route.location}</p>
                <p className="text-xs text-gray-500 mt-1">{route.address}</p>
                <p className="text-sm text-gray-700 mt-2">{route.products}</p>
                <p className="text-xs text-gray-500 mt-1">Distance: {route.distance}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Delivery Type</label>
                  <div className="relative">
                    <select className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm">
                      <option value="Local Pickups" selected={route.deliveryType === 'Local Pickups'}>Local Pickups</option>
                      <option value="Line Airport" selected={route.deliveryType === 'Line Airport'}>Line Airport</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Assigned Driver</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>{route.driver}</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Pickup Date</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                    <option>{route.pickupDate}</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium">
                  Assign
                </button>
                {route.isAssigned && (
                  <>
                    <button className="p-2 border border-emerald-600 text-emerald-600 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-red-600 text-red-600 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button 
          onClick={() => navigate(`/order-assign/stage2/${id}`, { state: { orderData } })}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors"
        >
          Save Stage 1
        </button>
      </div>
    </div>
  );
};

export default OrderAssignCreateStage1;
