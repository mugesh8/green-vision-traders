import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Check, ChevronDown } from 'lucide-react';
import { updateStage2Assignment, getOrderAssignment } from '../../../api/orderAssignmentApi';
import { getAllLabours } from '../../../api/labourApi';

const OrderAssignCreateStage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const orderData = location.state?.orderData;
  const [packagingStatus, setPackagingStatus] = useState('Quality Check Completed');
  const [netWeight, setNetWeight] = useState('400 kg');
  const [grossWeight, setGrossWeight] = useState('470 kg');
  const [packageCount, setPackageCount] = useState('15 Packages');
  const [selectedLabour, setSelectedLabour] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('Temperature control required. Maintain 2-4°C during transport...');
  const [labours, setLabours] = useState([]);

  // Load labours and existing assignment data
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load active labours only
        const labourResponse = await getAllLabours(1, 1000);
        const activeLabours = (labourResponse.data || []).filter(labour => labour.status === 'Active');
        setLabours(activeLabours);
        
        // Load existing assignment data if available
        const assignmentResponse = await getOrderAssignment(id);
        const assignmentData = assignmentResponse.data;
        
        if (assignmentData.packaging_status) {
          setPackagingStatus(assignmentData.packaging_status);
        }
        if (assignmentData.net_weight) {
          setNetWeight(assignmentData.net_weight);
        }
        if (assignmentData.gross_weight) {
          setGrossWeight(assignmentData.gross_weight);
        }
        if (assignmentData.package_count) {
          setPackageCount(assignmentData.package_count);
        }
        if (assignmentData.labour_id) {
          setSelectedLabour(assignmentData.labour_id);
        }
        if (assignmentData.special_instructions) {
          setSpecialInstructions(assignmentData.special_instructions);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [id]);

  const handleConfirmAndDispatch = async () => {
    try {
      const stage2Data = {
        packagingStatus,
        netWeight,
        grossWeight,
        packageCount,
        labourId: selectedLabour,
        specialInstructions
      };
      
      const response = await updateStage2Assignment(id, stage2Data);
      console.log('Stage 2 saved:', response);
      
      // Navigate to Stage 3
      navigate(`/order-assign/stage3/${id}`, { state: { orderData, stage2Data } });
    } catch (error) {
      console.error('Error saving stage 2:', error);
      alert('Failed to save stage 2 assignment. Please try again.');
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
            <p className="text-xs text-gray-500 mb-1">Total Products</p>
            <p className="text-sm font-medium text-gray-900">{orderData?.items?.length || 0} Items</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
           <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${orderData?.order_status === 'pending' ? 'bg-purple-100 text-purple-700' :
              orderData?.order_status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                orderData?.order_status === 'delivered' ? 'bg-emerald-600 text-white' :
                  'bg-gray-100 text-gray-700'
              }`}>
              {orderData?.order_status ? orderData.order_status.charAt(0).toUpperCase() + orderData.order_status.slice(1) : 'N/A'}
            </span>
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
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors">
          Stage 2: Packaging
        </button>
      </div>

      {/* Stage 2 Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Stage 2: Packaging & Quality Check</h2>
        <p className="text-sm text-gray-600 mb-6">Manage packaging and quality check process</p>

        {/* Stage 1 Completion Status */}
        <div className="bg-emerald-50 border-l-4 border-emerald-600 p-4 mb-6">
          <h3 className="text-sm font-semibold text-emerald-900 mb-2">Stage 1 Completion Status</h3>
          <div className="flex items-start gap-2">
            <Check className="w-4 h-4 text-emerald-700 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-emerald-800">All products collected and delivered to packaging location</p>
          </div>
        </div>

        {/* Packaging & Quality Check */}
        <h3 className="text-base font-semibold text-gray-900 mb-4">Packaging Details</h3>
        
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
            <label className="text-sm font-medium text-gray-700 mb-2 block">Labour Name</label>
            <div className="relative">
              <select
                value={selectedLabour}
                onChange={(e) => setSelectedLabour(e.target.value)}
                className="w-full appearance-none px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white"
              >
                <option value="">Select Labour</option>
                {labours.map(labour => (
                  <option key={labour.lid} value={labour.lid}>{labour.full_name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Net Weight</label>
            <input
              type="text"
              value={netWeight}
              onChange={(e) => setNetWeight(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Gross Weight</label>
            <input
              type="text"
              value={grossWeight}
              onChange={(e) => setGrossWeight(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">Package Count</label>
            <input
              type="text"
              value={packageCount}
              onChange={(e) => setPackageCount(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <label className="text-sm font-medium text-gray-700 mb-2 block">Special Instructions / Notes</label>
        <textarea
          rows="3"
          placeholder="Temperature control required. Maintain 2-4°C during transport..."
          value={specialInstructions}
          onChange={(e) => setSpecialInstructions(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button 
          onClick={() => navigate(`/order-assign/stage1/${id}`, { state: { orderData } })}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleConfirmAndDispatch}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors"
        >
          Confirm & Dispatch
        </button>
      </div>
    </div>
  );
};

export default OrderAssignCreateStage2;
