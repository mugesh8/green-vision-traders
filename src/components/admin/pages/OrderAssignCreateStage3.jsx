import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Check, ChevronDown, Truck } from 'lucide-react';
import { getAllDrivers } from '../../../api/driverApi';
import { updateStage3Assignment } from '../../../api/orderAssignmentApi';

const OrderAssignCreateStage3 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const orderData = location.state?.orderData;
  const stage2Data = location.state?.stage2Data;
  
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [selectedDriverInfo, setSelectedDriverInfo] = useState(null);

  // Load available drivers
  useEffect(() => {
    const loadDrivers = async () => {
      try {
        const response = await getAllDrivers(1, 1000);
        const availableDrivers = response.data.filter(driver => driver.status === 'available');
        setDrivers(availableDrivers);
      } catch (error) {
        console.error('Error loading drivers:', error);
      }
    };
    
    loadDrivers();
  }, []);

  // Update selected driver info when driver changes
  useEffect(() => {
    if (selectedDriver) {
      const driver = drivers.find(d => d.did === selectedDriver);
      setSelectedDriverInfo(driver);
    } else {
      setSelectedDriverInfo(null);
    }
  }, [selectedDriver, drivers]);

  const handleConfirmAssignment = async () => {
    try {
      const stage3Data = {
        driverId: selectedDriver
      };
      
      await updateStage3Assignment(id, stage3Data);
      alert('Driver assigned successfully!');
      navigate('/order-assign');
    } catch (error) {
      console.error('Error assigning driver:', error);
      alert('Failed to assign driver. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Order Information Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="text-sm font-semibold text-gray-900">{orderData?.id || id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Customer Name</p>
            <p className="text-sm font-medium text-gray-900">{orderData?.customer_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Net Weight</p>
            <p className="text-sm font-medium text-gray-900">{stage2Data?.netWeight || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Package Count</p>
            <p className="text-sm font-medium text-gray-900">{stage2Data?.packageCount || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <button 
          onClick={() => navigate(`/order-assign/stage1/${id}`, { state: { orderData } })}
          className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2"
        >
          <Check className="w-5 h-5" />
          Stage 1: Collected
        </button>
        <button 
          onClick={() => navigate(`/order-assign/stage2/${id}`, { state: { orderData } })}
          className="px-6 py-3 bg-white border-2 border-emerald-600 text-emerald-700 rounded-lg font-medium hover:bg-emerald-50 transition-colors flex items-center gap-2"
        >
          <Check className="w-5 h-5" />
          Stage 2: Packaging
        </button>
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors">
          Stage 3: Driver Assignment
        </button>
      </div>

      {/* Driver Assignment Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Stage 3: Assign Driver for Airport Delivery</h2>
        <p className="text-sm text-gray-600 mb-6">Select an available driver for airport delivery</p>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Select Driver</label>
          <div className="relative">
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
            >
              <option value="">Select a driver</option>
              {drivers.map(driver => (
                <option key={driver.did} value={driver.did}>
                  {driver.name} - {driver.driver_id}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
          </div>
        </div>

        {/* Driver Vehicle Information */}
        {selectedDriverInfo && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-6 h-6 text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">Driver & Vehicle Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Driver Name</p>
                <p className="text-sm font-medium text-gray-900">{selectedDriverInfo.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Driver ID</p>
                <p className="text-sm font-medium text-gray-900">{selectedDriverInfo.driver_id}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Phone Number</p>
                <p className="text-sm font-medium text-gray-900">{selectedDriverInfo.phone_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">License Number</p>
                <p className="text-sm font-medium text-gray-900">{selectedDriverInfo.license_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Vehicle Number</p>
                <p className="text-sm font-medium text-gray-900">{selectedDriverInfo.vehicle_number || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Vehicle Type</p>
                <p className="text-sm font-medium text-gray-900">{selectedDriverInfo.vehicle_type || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Vehicle Capacity</p>
                <p className="text-sm font-medium text-gray-900">{selectedDriverInfo.vehicle_capacity || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Status</p>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                  {selectedDriverInfo.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button 
          onClick={() => navigate(`/order-assign/stage2/${id}`, { state: { orderData } })}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirmAssignment}
          disabled={!selectedDriver}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Confirm Assignment
        </button>
      </div>
    </div>
  );
};

export default OrderAssignCreateStage3;
