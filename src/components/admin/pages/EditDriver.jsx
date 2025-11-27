import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Upload, Eye, EyeOff, ChevronRight, ArrowLeft } from 'lucide-react';
import { getDriverById, updateDriver } from '../../../api/driverApi';

const EditDriver = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    driver_id: '',
    driver_name: '',
    phone_number: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pin_code: '',
    password: '',
    license_number: '',
    vehicle_type: '',
    vehicle_number: '',
    capacity: '',
    insurance_number: '',
    insurance_expiry_date: '',
    vehicle_condition: 'Good',
    delivery_type: 'Collection Delivery',
    status: 'Available'
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [driverImage, setDriverImage] = useState(null);
  const [driverIdProof, setDriverIdProof] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDriverData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching driver with ID:', id);
        
        if (!id) {
          throw new Error('No driver ID provided');
        }
        
        // Log the actual ID being used
        console.log('Actual driver ID being fetched:', id);
        
        const response = await getDriverById(id);
        console.log('API Response:', response);
        
        // Handle different response structures
        const driver = response.data || response;
        
        // Check if we got valid driver data
        if (!driver || (typeof driver === 'object' && Object.keys(driver).length === 0)) {
          throw new Error('No driver data found');
        }
        
        // Map API response to form data structure with comprehensive field mapping
        setFormData({
          driver_id: driver.driver_id || driver.id || driver.did || driver._id || id || '',
          driver_name: driver.driver_name || driver.name || '',
          phone_number: driver.phone_number || driver.phone || '',
          email: driver.email || '',
          address: driver.address || '',
          city: driver.city || '',
          state: driver.state || '',
          pin_code: driver.pin_code || driver.pincode || '',
          password: '', // Don't populate password field for security reasons
          license_number: driver.license_number || driver.license || '',
          vehicle_type: driver.vehicle_type || driver.vehicleType || '',
          vehicle_number: driver.vehicle_number || driver.vehicleNumber || '',
          capacity: driver.capacity || '',
          insurance_number: driver.insurance_number || driver.insuranceNumber || '',
          insurance_expiry_date: driver.insurance_expiry_date || driver.insuranceExpiryDate || '',
          vehicle_condition: driver.vehicle_condition || driver.vehicleCondition || 'Good',
          delivery_type: driver.delivery_type || driver.deliveryType || 'Collection Delivery',
          status: driver.status || 'Available'
        });
      } catch (error) {
        console.error('Error fetching driver data:', error);
        setError(error.message || 'Failed to load driver data. Please try again.');
        // If it's a 404 error, provide more specific guidance
        if (error.message && error.message.includes('404')) {
          setError(`Driver with ID "${id}" not found. This may be due to an ID format mismatch between frontend and backend.`);
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDriverData();
    } else {
      // If no ID provided, redirect to drivers list
      navigate('/drivers');
    }
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      if (type === 'driver_image') {
        setDriverImage(file);
      } else {
        setDriverIdProof(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (key !== 'password' || formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });
      
      if (driverImage) formDataToSend.append('driver_image', driverImage);
      if (driverIdProof) formDataToSend.append('driver_id_proof', driverIdProof);
      
      await updateDriver(id, formDataToSend);
      navigate('/drivers');
    } catch (error) {
      console.error('Error updating driver:', error);
      setError(error.message || 'Failed to update driver. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/drivers')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Driver Management</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-lg text-gray-600">Loading driver data...</div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
            <div className="text-red-700 font-medium">{error}</div>
            <button
              onClick={() => navigate('/drivers')}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Drivers
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
            
            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="text-red-700">{error}</div>
              </div>
            )}
            
            {/* Personal Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Driver ID */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Driver ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="driver_id"
                    value={formData.driver_id}
                    onChange={handleInputChange}
                    placeholder="Enter driver ID"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                {/* Driver Name */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Driver Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="driver_name"
                    value={formData.driver_name}
                    onChange={handleInputChange}
                    placeholder="Enter driver full name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Email Address */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="driver@email.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Enter new password (leave blank to keep current)"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none text-sm cursor-pointer"
                    >
                      <option value="Available">Available</option>
                      <option value="On Trip">On Trip</option>
                      <option value="Break">Break</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none rotate-90" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Address */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* State */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Pin Code */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Pin Code
                  </label>
                  <input
                    type="text"
                    name="pin_code"
                    value={formData.pin_code}
                    onChange={handleInputChange}
                    placeholder="Enter pin code"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* License Number */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    License Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="license_number"
                    value={formData.license_number}
                    onChange={handleInputChange}
                    placeholder="Enter license number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                {/* Insurance Number */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Insurance Number
                  </label>
                  <input
                    type="text"
                    name="insurance_number"
                    value={formData.insurance_number}
                    onChange={handleInputChange}
                    placeholder="Enter insurance number"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Vehicle Information Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Vehicle Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Vehicle Type */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Vehicle Type <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_type"
                    value={formData.vehicle_type}
                    onChange={handleInputChange}
                    placeholder="Enter vehicle type"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                {/* Vehicle Number */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Vehicle Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="vehicle_number"
                    value={formData.vehicle_number}
                    onChange={handleInputChange}
                    placeholder="TN 00 AA 0000"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    required
                  />
                </div>

                {/* Capacity */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Capacity (Tons) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Enter capacity"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Insurance Expiry Date */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Insurance Expiry Date
                  </label>
                  <input
                    type="date"
                    name="insurance_expiry_date"
                    value={formData.insurance_expiry_date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  />
                </div>

                {/* Vehicle Condition */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Vehicle Condition
                  </label>
                  <div className="relative">
                    <select
                      name="vehicle_condition"
                      value={formData.vehicle_condition}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none text-sm cursor-pointer"
                    >
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Poor">Poor</option>
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none rotate-90" />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Assignment Section */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Delivery Assignment <span className="text-red-500">*</span>
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Select the type of deliveries this driver will handle
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Collection Delivery */}
                <label className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.delivery_type === 'Collection Delivery' 
                    ? 'border-teal-600 bg-teal-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="delivery_type"
                    value="Collection Delivery"
                    checked={formData.delivery_type === 'Collection Delivery'}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-teal-600 focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">Collection Delivery</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Collect vegetables from farmers, suppliers and deliver to packing centers
                    </div>
                  </div>
                </label>

                {/* Airport Delivery */}
                <label className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.delivery_type === 'Airport Delivery' 
                    ? 'border-teal-600 bg-teal-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="delivery_type"
                    value="Airport Delivery"
                    checked={formData.delivery_type === 'Airport Delivery'}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-teal-600 focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">Airport Delivery</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Pick up from packing centers and deliver to airports for shipment
                    </div>
                  </div>
                </label>

                {/* Both Types */}
                <label className={`relative flex items-start p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.delivery_type === 'Both Types' 
                    ? 'border-teal-600 bg-teal-50' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}>
                  <input
                    type="radio"
                    name="delivery_type"
                    value="Both Types"
                    checked={formData.delivery_type === 'Both Types'}
                    onChange={handleInputChange}
                    className="mt-1 w-5 h-5 text-teal-600 focus:ring-2 focus:ring-teal-500"
                  />
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900">Both Types</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Handle both collection and airport deliveries as needed
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* File Uploads */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Document Uploads</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Upload Driver Image */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Upload Driver Image
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        id="driverImageUpload"
                        onChange={(e) => handleFileUpload('driver_image', e)}
                        accept=".jpg,.jpeg,.png,.gif"
                        className="hidden"
                      />
                      <label
                        htmlFor="driverImageUpload"
                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-gray-600" />
                      </label>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => document.getElementById('driverImageUpload').click()}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Upload Image
                      </button>
                      {driverImage && (
                        <p className="text-xs text-green-600 mt-2 font-medium">
                          ✓ {driverImage.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Upload ID Proof */}
                <div>
                  <label className="block text-sm text-gray-700 mb-2">
                    Upload ID Proof
                  </label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <input
                        type="file"
                        id="idProofUpload"
                        onChange={(e) => handleFileUpload('driver_id_proof', e)}
                        accept=".jpg,.jpeg,.png,.gif"
                        className="hidden"
                      />
                      <label
                        htmlFor="idProofUpload"
                        className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-gray-600" />
                      </label>
                    </div>
                    <div>
                      <button
                        type="button"
                        onClick={() => document.getElementById('idProofUpload').click()}
                        className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Upload Image
                      </button>
                      {driverIdProof && (
                        <p className="text-xs text-green-600 mt-2 font-medium">
                          ✓ {driverIdProof.name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/drivers')}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-lg text-sm font-medium transition-colors shadow-sm"
              >
                Update Driver
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditDriver;