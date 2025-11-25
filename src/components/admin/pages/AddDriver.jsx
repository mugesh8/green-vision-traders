import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Eye, EyeOff, ChevronRight, ArrowLeft } from 'lucide-react';

const AddDriver = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    driverName: '',
    phoneNumber: '',
    email: '',
    address: '',
    password: '',
    licenseNumber: '',
    vehicleType: '',
    vehicleNumber: '',
    capacity: '',
    insuranceNumber: '',
    insuranceExpiry: '',
    vehicleCondition: 'Good',
    deliveryType: 'collection',
    isActive: true
  });

  const [showPassword, setShowPassword] = useState(false);
  const [licenseImage, setLicenseImage] = useState(null);
  const [idProof, setIdProof] = useState(null);
  const [vehicleTypes, setVehicleTypes] = useState([
    'tata-ace',
    'mahindra-bolero', 
    'ashok-leyland',
    'eicher-pro',
    'tata-407'
  ]);
  const [showNewVehicleInput, setShowNewVehicleInput] = useState(false);
  const [newVehicleType, setNewVehicleType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'vehicleType' && value === 'add-new') {
      setShowNewVehicleInput(true);
      setFormData(prev => ({ ...prev, [name]: '' }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
      if (name === 'vehicleType') {
        setShowNewVehicleInput(false);
      }
    }
  };

  const handleAddNewVehicleType = () => {
    if (newVehicleType.trim()) {
      const newType = newVehicleType.trim().toLowerCase().replace(/\s+/g, '-');
      setVehicleTypes(prev => [...prev, newType]);
      setFormData(prev => ({ ...prev, vehicleType: newType }));
      setShowNewVehicleInput(false);
      setNewVehicleType('');
    }
  };

  const handleFileUpload = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      if (type === 'license') {
        setLicenseImage(file);
      } else {
        setIdProof(file);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    navigate('/drivers');
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

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          
          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Driver Name */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Driver Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="driverName"
                  value={formData.driverName}
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
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+91"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  required
                />
              </div>

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
                    placeholder="Enter Password"
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

              {/* License Number */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  License Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  placeholder="Enter license number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                  required
                />
              </div>
            </div>

            {/* File Uploads */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Upload License Image */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Upload License Image
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="licenseUpload"
                      onChange={(e) => handleFileUpload('license', e)}
                      accept=".jpg,.jpeg,.png,.gif"
                      className="hidden"
                    />
                    <label
                      htmlFor="licenseUpload"
                      className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
                    >
                      <Upload className="w-6 h-6 text-gray-600" />
                    </label>
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => document.getElementById('licenseUpload').click()}
                      className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Upload Image
                    </button>
                    {licenseImage ? (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        ✓ {licenseImage.name}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">
                        Upload a license image: JPG, PNG or GIF. Max 2MB.
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload ID Proof */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Upload Id Proof
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <input
                      type="file"
                      id="idProofUpload"
                      onChange={(e) => handleFileUpload('idProof', e)}
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
                    {idProof ? (
                      <p className="text-xs text-green-600 mt-2 font-medium">
                        ✓ {idProof.name}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-500 mt-2">
                        Upload an ID proof: JPG, PNG or GIF. Max 2MB.
                      </p>
                    )}
                  </div>
                </div>
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
                {!showNewVehicleInput ? (
                  <div className="relative">
                    <select
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none text-sm text-gray-500 cursor-pointer"
                      required
                    >
                      <option value="">Select vehicle type</option>
                      {vehicleTypes.map(type => (
                        <option key={type} value={type}>
                          {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                      ))}
                      <option value="add-new">+ Add New Vehicle Type</option>
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none rotate-90" />
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newVehicleType}
                      onChange={(e) => setNewVehicleType(e.target.value)}
                      placeholder="Enter new vehicle type"
                      className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                      onKeyPress={(e) => e.key === 'Enter' && handleAddNewVehicleType()}
                    />
                    <button
                      type="button"
                      onClick={handleAddNewVehicleType}
                      className="px-4 py-2.5 bg-teal-600 text-white rounded-lg text-sm hover:bg-teal-700 transition-colors"
                    >
                      Add
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewVehicleInput(false);
                        setNewVehicleType('');
                      }}
                      className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Vehicle Number */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Vehicle Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="vehicleNumber"
                  value={formData.vehicleNumber}
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
              {/* Insurance Number */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Insurance Number
                </label>
                <input
                  type="text"
                  name="insuranceNumber"
                  value={formData.insuranceNumber}
                  onChange={handleInputChange}
                  placeholder="Enter insurance number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm"
                />
              </div>

              {/* Insurance Expiry Date */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Insurance Expiry Date
                </label>
                <input
                  type="text"
                  name="insuranceExpiry"
                  value={formData.insuranceExpiry}
                  onChange={handleInputChange}
                  placeholder="DD/MM/YYYY"
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
                    name="vehicleCondition"
                    value={formData.vehicleCondition}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none text-sm cursor-pointer"
                  >
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
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
                formData.deliveryType === 'collection' 
                  ? 'border-teal-600 bg-teal-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="deliveryType"
                  value="collection"
                  checked={formData.deliveryType === 'collection'}
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
                formData.deliveryType === 'airport' 
                  ? 'border-teal-600 bg-teal-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="deliveryType"
                  value="airport"
                  checked={formData.deliveryType === 'airport'}
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
                formData.deliveryType === 'both' 
                  ? 'border-teal-600 bg-teal-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}>
                <input
                  type="radio"
                  name="deliveryType"
                  value="both"
                  checked={formData.deliveryType === 'both'}
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

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
            {/* Driver Status Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-700 font-medium">Driver Status</span>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                  formData.isActive ? 'bg-teal-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${formData.isActive ? 'text-teal-600' : 'text-gray-500'}`}>
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
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
                Add Driver
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDriver;