import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, TrendingUp, Package, ArrowLeft, Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFarmerById } from '../../../api/farmerApi';
import { getAllProducts } from '../../../api/productApi';
import { createVegetableAvailability, getVegetableAvailabilityByFarmer, updateVegetableAvailability, deleteVegetableAvailability } from '../../../api/vegetableAvailabilityApi';
import { BASE_URL } from '../../../config/config';

const FarmerDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('personal');
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    vegetable_name: '',
    from_date: '',
    to_date: '',
    status: 'Available'
  });

  const handleBackClick = () => {
    navigate('/farmers');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [farmerResponse, productsResponse, availabilityResponse] = await Promise.all([
          getFarmerById(id),
          getAllProducts(1, 100),
          getVegetableAvailabilityByFarmer(id)
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
        setAvailabilities(availabilityResponse.data || []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [id]);

  const handleAdd = () => {
    setModalMode('add');
    setFormData({ vegetable_name: '', from_date: '', to_date: '', status: 'Available' });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setModalMode('edit');
    setSelectedItem(item);
    setFormData({
      vegetable_name: item.vegetable_name,
      from_date: item.from_date,
      to_date: item.to_date,
      status: item.status
    });
    setShowModal(true);
  };

  const handleView = (item) => {
    setModalMode('view');
    setSelectedItem(item);
    setFormData({
      vegetable_name: item.vegetable_name,
      from_date: item.from_date,
      to_date: item.to_date,
      status: item.status
    });
    setShowModal(true);
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this availability?')) {
      try {
        await deleteVegetableAvailability(itemId);
        // Refresh data
        const availabilityResponse = await getVegetableAvailabilityByFarmer(id);
        setAvailabilities(availabilityResponse.data || []);
      } catch (error) {
        console.error('Failed to delete:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        farmer_id: id,
        farmer_name: farmer?.farmer_name,
        ...formData
      };

      if (modalMode === 'add') {
        await createVegetableAvailability(data);
      } else if (modalMode === 'edit') {
        await updateVegetableAvailability(selectedItem.id, data);
      }

      setShowModal(false);
      // Refresh data
      const availabilityResponse = await getVegetableAvailabilityByFarmer(id);
      setAvailabilities(availabilityResponse.data || []);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

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
        <button
          onClick={() => setActiveTab('personal')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm ${activeTab === 'personal'
            ? 'bg-[#0D7C66] text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
        >
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
        <button
          onClick={() => setActiveTab('availability')}
          className={`px-6 py-2.5 rounded-lg font-medium transition-colors shadow-sm ${activeTab === 'availability'
            ? 'bg-[#0D7C66] text-white'
            : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
        >
          Vegetable Availability
        </button>
      </div>

      {activeTab === 'personal' && (
        <>
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
                <span className={`px-4 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${farmer?.status === 'active'
                  ? 'bg-green-50 text-green-700 border-green-200'
                  : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                  <span className={`w-2 h-2 rounded-full ${farmer?.status === 'active' ? 'bg-green-500' : 'bg-red-500'
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
        </>
      )}

      {activeTab === 'availability' && (
        <>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Vegetable Availability - {farmer?.farmer_name}</h2>
              <button
                onClick={handleAdd}
                className="flex items-center gap-2 px-4 py-2 bg-[#0D7C66] text-white rounded-lg hover:bg-[#0a6352] transition-colors"
              >
                <Plus className="w-5 h-5" />
                Add Availability
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Vegetable Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">From Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">To Date</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {availabilities.length > 0 ? availabilities.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">{item.vegetable_name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.from_date}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{item.to_date}</td>
                      <td className="px-4 py-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'Available'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                          }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleView(item)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1 text-teal-600 hover:bg-teal-50 rounded"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        No availability records found. Click "Add Availability" to create one.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {modalMode === 'add' ? 'Add' : modalMode === 'edit' ? 'Edit' : 'View'} Vegetable Availability
                </h3>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Vegetable Name</label>
                      <select
                        value={formData.vegetable_name}
                        onChange={(e) => setFormData({ ...formData, vegetable_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                        disabled={modalMode === 'view'}
                      >
                        <option value="">Select Vegetable</option>
                        {products.map((product) => (
                          <option key={product.pid} value={product.product_name}>
                            {product.product_name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">From Date</label>
                      <input
                        type="date"
                        value={formData.from_date}
                        onChange={(e) => setFormData({ ...formData, from_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">To Date</label>
                      <input
                        type="date"
                        value={formData.to_date}
                        onChange={(e) => setFormData({ ...formData, to_date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                        disabled={modalMode === 'view'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                        required
                        disabled={modalMode === 'view'}
                      >
                        <option value="Available">Available</option>
                        <option value="Unavailable">Unavailable</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    {modalMode !== 'view' && (
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-[#0D7C66] text-white rounded-lg hover:bg-[#0a6352] transition-colors"
                      >
                        {modalMode === 'add' ? 'Add' : 'Update'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      {modalMode === 'view' ? 'Close' : 'Cancel'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default FarmerDetails;
