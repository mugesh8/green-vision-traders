import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../../api/orderApi';

const PreOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderById(id);
        if (response.success) {
          setOrder(response.data);
        } else {
          setError('Failed to fetch order');
        }
      } catch (err) {
        setError('Error fetching order: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-xl">Loading order details...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-xl text-red-500">Order not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Pre Order Details</h1>
          <button
            onClick={() => navigate(-1)}
            className="bg-[#0D7C66] hover:bg-[#0a6252] text-white px-4 py-2 rounded-lg font-bold transition-colors duration-200"
          >
            Back
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Order Information</h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray mb-3">Customer Details</h3>
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-bold text-gray-900 w-32">Order ID:</span>
                  <span className="text-gray-800">{order.oid}</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-gray w-32">Customer:</span>
                  <span className="text-gray-800">{order.customer_name}</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-gray w-32">Phone:</span>
                  <span className="text-gray-800">{order.phone_number || 'N/A'}</span>
                </div>
              </div>
            </div>
            
            <div><br />
              {/* <h3 className="text-lg font-bold text-gray-700 mb-3">Delivery Information</h3> */}
              <div className="space-y-2">
                <div className="flex">
                  <span className="font-bold text-gray w-32">Customer ID:</span>
                  <span className="text-gray-800">{order.customer_id || 'N/A'}</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-gray w-32">Address:</span>
                  <span className="text-gray-800">{order.delivery_address}</span>
                </div>
                <div className="flex">
                  <span className="font-bold text-gray w-32">Status:</span>
                  <span className="text-gray-800 capitalize">{order.order_status}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden mt-6">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Order Items</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#0D7C66] uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#0D7C66] uppercase tracking-wider">Boxes/Qty</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#0D7C66] uppercase tracking-wider">Packing Type</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#0D7C66] uppercase tracking-wider">Net Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#0D7C66] uppercase tracking-wider">Gross Weight</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#0D7C66] uppercase tracking-wider">Market Price</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#0D7C66] uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#0D7C66] uppercase tracking-wider">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-bold text-[#0D7C66] uppercase tracking-wider">Assigned Qty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {order.items && order.items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.num_boxes || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.packing_type || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.net_weight ? `${item.net_weight} kg` : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">{item.gross_weight ? `${item.gross_weight} kg` : 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">₹{item.market_price || '0.00'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800">₹{parseFloat(item.total_price || 0).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-end">
              <div className="w-64">
                <div className="flex justify-between py-2">
                  <span className="font-bold text-gray">Subtotal:</span>
                  <span className="text-gray-800">
                    ₹{order.items ? order.items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0).toFixed(2) : '0.00'}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-t border-gray-300">
                  <span className="font-bold text-gray-800">Total Amount:</span>
                  <span className="font-bold text-gray-800">₹{order.total_amount || '0.00'}</span>
                </div>
              </div>
            </div>
          </div> */}
        </div>

        {/* <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={() => navigate(`/orders/create?orderId=${order.oid}`)}
            className="bg-[#0D7C66] hover:bg-[#0af6252] text-white px-6 py-2.5 rounded-lg font-bold transition-colors duration-200"
          >
            Convert to Order
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default PreOrder;