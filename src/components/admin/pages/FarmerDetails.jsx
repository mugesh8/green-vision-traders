import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, TrendingUp, Package, ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFarmerById } from '../../../api/farmerApi';
import { getAllProducts } from '../../../api/productApi';
import { BASE_URL } from '../../../config/config';

const FarmerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);

  const handleBackClick = () => {
    navigate('/farmers');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmerResponse, productsResponse] = await Promise.all([
          getFarmerById(id),
          getAllProducts(1, 100)
        ]);
        
        const farmerData = farmerResponse.data;
        const allProducts = productsResponse.data || [];
        
        let productIds = [];
        if (typeof farmerData.product_list === 'string') {
          try {
            productIds = JSON.parse(farmerData.product_list);
          } catch (e) {
            productIds = [];
          }
        } else if (Array.isArray(farmerData.product_list)) {
          productIds = farmerData.product_list;
        }
        
        // Ensure productIds is always an array
        if (!Array.isArray(productIds)) {
          productIds = [];
        }
        
        const productMap = {};
        allProducts.forEach(p => {
          productMap[p.pid] = p.product_name;
        });
        
        const productList = productIds.map(id => ({
          product_id: id,
          product_name: productMap[id] || `Product ${id}`
        }));
        
        setFarmer({ ...farmerData, product_list: productList });
        setProducts(allProducts);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [id]);

  if (!farmer) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading farmer details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Farmers</span>
          </button>
        </div>
      </div>

      {/* Tab Buttons */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button className="px-6 py-2.5 bg-[#0D7C66] text-white rounded-lg font-medium transition-colors shadow-sm">
          Personal Info
        </button>
        <button 
          onClick={() => navigate(`/farmers/${id}/orders`)}
          className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Order List
        </button>
        <button 
          onClick={() => navigate(`/farmers/${id}/payout`)}
          className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Payout
        </button>
      </div>

      <div className="rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-24 h-24 bg-teal-800 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            {farmer?.profile_image ? (
              <img 
                src={`${BASE_URL}${farmer.profile_image}`}
                alt={farmer?.farmer_name || 'Farmer'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : null}
            {!farmer?.profile_image && (
              <span className="text-white text-3xl font-bold">{farmer?.farmer_name?.substring(0, 2).toUpperCase() || 'FR'}</span>
            )}
          </div>
          
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{farmer?.farmer_name || 'N/A'}</h2>
            <p className="text-gray-600 mb-2">Farmer ID: {farmer?.registration_number || 'N/A'}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-red-500">🛒</span>
                Member since January 15, 2024
              </span>
              <span>•</span>
              <span>Last updated: Oct 28, 2025</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="bg-teal-50 text-teal-700 px-4 py-1 rounded-full text-sm font-medium border border-teal-200">
              {farmer?.type || 'Farmer'}
            </span>
            <span className={`px-4 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${
              farmer?.status === 'active' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                farmer?.status === 'active' ? 'bg-green-500' : 'bg-red-500'
              }`}></span>
              {farmer?.status === 'active' ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-teal-50 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Phone className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-800">Contact Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Phone Number</p>
              <p className="text-gray-800">{farmer?.phone || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Email Address</p>
              <p className="text-teal-600">{farmer?.email || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Alternate Contact</p>
              <p className="text-gray-800">{farmer?.secondary_phone || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-800">Business Details</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Assigned Products</p>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(farmer?.product_list) && farmer.product_list.length > 0 ? farmer.product_list.map((item, index) => (
                  <span key={index} className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm">
                    {item.product_name}
                  </span>
                )) : <span className="text-gray-500">No products assigned</span>}
              </div>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Contact Person</p>
              <p className="text-gray-800">{farmer?.contact_person || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">Location Details</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Region</p>
              <p className="text-gray-800">{farmer?.city}, {farmer?.state}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Full Address</p>
              <p className="text-gray-800">{farmer?.address || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-teal-50 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">⭐</span>
            <h3 className="text-lg font-semibold text-gray-800">Performance Rating</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="relative w-40 h-40">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="#14b8a6"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${(4.8 / 5) * 439.8} 439.8`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-teal-600">{farmer?.rating || '0.0'}</span>
                <span className="text-sm text-gray-500">/5.0</span>
              </div>
            </div>
            <p className="text-gray-600 font-medium mt-4">{farmer?.ratingText || 'No Rating'}</p>
            <p className="text-sm text-gray-500 mt-1">Based on {farmer?.reviewCount || 0} reviews</p>
          </div>
        </div>

        <div className="bg-teal-50 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-800">Orders Summary</h3>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold text-teal-600 mb-2">{farmer?.totalOrders || 0}</div>
            <p className="text-gray-600 mb-6">Total Completed Orders</p>
            
            <div className="w-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">On-Time Delivery</span>
                <span className="font-semibold text-green-600">{farmer?.onTimeDelivery || '0%'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Revenue</span>
                <span className="font-semibold text-gray-800">{farmer?.revenue || '₹0'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-teal-50 rounded-lg shadow-sm p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Quality Score</p>
          <p className="text-3xl font-bold text-teal-600">{farmer?.qualityScore || '0/10'}</p>
        </div>
        
        <div className="bg-teal-50 rounded-lg shadow-sm p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Response Time</p>
          <p className="text-3xl font-bold text-teal-600">{farmer?.responseTime || 'N/A'}</p>
        </div>
        
        <div className="bg-teal-50 rounded-lg shadow-sm p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Supply Reliability</p>
          <p className="text-3xl font-bold text-teal-600">{farmer?.supplyReliability || '0%'}</p>
        </div>
        
        <div className="bg-teal-50 rounded-lg shadow-sm p-6 text-center">
          <p className="text-sm text-gray-500 mb-2">Active Since</p>
          <p className="text-3xl font-bold text-teal-600">{farmer?.activeSince || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default FarmerDetails;
