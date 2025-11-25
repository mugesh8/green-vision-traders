import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Camera, Calendar, ArrowLeft } from 'lucide-react';

const EditLabour = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Pre-filled form data (in real app, fetch from API based on id)
  const [formData, setFormData] = useState({
    fullName: 'Rani',
    labourId: 'LAB-2024-008',
    mobileNumber: '9977665545',
    aadhaarNumber: '986756431234',
    dateOfBirth: '1996-09-09',
    gender: 'Female',
    bloodGroup: 'B+',
    address: '',
    department: '',
    dailyWage: '',
    joiningDate: ''
  });

  const [photoPreview, setPhotoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your form submission logic here
    // After successful update, navigate back
    navigate('/labours');
  };

  const handleCancel = () => {
    navigate('/labours');
  };

  const handleBackClick = () => {
    navigate('/labours');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header Section with Back Button */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={handleBackClick}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Labours</span>
          </button>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#0D5C4D] mb-1">Edit Labour</h1>
        <p className="text-sm text-[#6B8782]">Edit labour to the system</p>
      </div>

      {/* Form Container */}
      <div className="bg-white rounded-2xl border border-[#D0E0DB] p-6 sm:p-8">
        <form onSubmit={handleSubmit}>
          {/* Personal Information Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#0D5C4D] mb-6 italic">Personal Information</h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Photo Upload */}
              <div className="lg:col-span-12 xl:col-span-2 flex justify-center lg:justify-start">
                <div className="relative">
                  <input
                    type="file"
                    id="photo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                  <label
                    htmlFor="photo-upload"
                    className="w-32 h-32 rounded-full border-4 border-dashed border-[#D0E0DB] bg-[#F0F4F3] flex flex-col items-center justify-center cursor-pointer hover:bg-[#E5EBE9] transition-colors"
                  >
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <>
                        <Camera className="w-8 h-8 text-[#6B8782] mb-2" />
                        <span className="text-xs text-[#6B8782] font-medium">Upload Photo</span>
                      </>
                    )}
                  </label>
                </div>
              </div>

              {/* Form Fields */}
              <div className="lg:col-span-12 xl:col-span-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Full Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter full name"
                      className="w-full px-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Labour ID */}
                  <div>
                    <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                      Labour ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="labourId"
                      value={formData.labourId}
                      className="w-full px-4 py-2.5 bg-[#F0F4F3] border border-[#D0E0DB] rounded-lg text-[#6B8782] cursor-not-allowed"
                      disabled
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 10-digit mobile number"
                      maxLength="10"
                      pattern="[0-9]{10}"
                      className="w-full px-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent"
                      required
                    />
                  </div>

                  {/* Aadhaar Number */}
                  <div>
                    <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                      Aadhaar Number
                    </label>
                    <input
                      type="text"
                      name="aadhaarNumber"
                      value={formData.aadhaarNumber}
                      onChange={handleInputChange}
                      placeholder="Enter 12-digit Aadhaar number"
                      maxLength="12"
                      pattern="[0-9]{12}"
                      className="w-full px-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent"
                    />
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                      Date of Birth <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        placeholder="DD/MM/YYYY"
                        className="w-full px-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent"
                        required
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B8782] pointer-events-none" size={18} />
                    </div>
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                      Gender <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent appearance-none cursor-pointer"
                        required
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-[#6B8782]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Blood Group */}
                  <div>
                    <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                      Blood Group
                    </label>
                    <div className="relative">
                      <select
                        name="bloodGroup"
                        value={formData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent appearance-none cursor-pointer"
                      >
                        <option value="">Select blood group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-[#6B8782]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="mt-6">
                  <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter complete address"
                    rows="4"
                    className="w-full px-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent resize-none"
                    required
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

          {/* Work Details Section */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-[#0D5C4D] mb-6 italic">Work Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Department */}
              <div>
                <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                  Department <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent appearance-none cursor-pointer"
                    required
                  >
                    <option value="">Select department</option>
                    <option value="packing">Packing</option>
                    <option value="loading">Loading</option>
                    <option value="unloading">Unloading</option>
                    <option value="sorting">Sorting</option>
                  </select>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                    <svg className="w-4 h-4 text-[#6B8782]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-red-500 mt-1 italic">* Packing or Loading/Unloading department</p>
              </div>

              {/* Daily Wage */}
              <div>
                <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                  Daily Wage <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#6B8782] font-medium">₹</span>
                  <input
                    type="number"
                    name="dailyWage"
                    value={formData.dailyWage}
                    onChange={handleInputChange}
                    placeholder="Enter daily wage"
                    min="0"
                    step="1"
                    className="w-full pl-8 pr-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              {/* Joining Date */}
              <div>
                <label className="block text-sm font-medium text-[#0D5C4D] mb-2">
                  Joining Date <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="joiningDate"
                    value={formData.joiningDate}
                    onChange={handleInputChange}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-4 py-2.5 bg-white border border-[#D0E0DB] rounded-lg text-[#0D5C4D] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#0D8568] focus:border-transparent"
                    required
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#6B8782] pointer-events-none" size={18} />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              className="w-full sm:w-auto px-8 py-2 bg-white border border-[#D0E0DB] text-[#0D5C4D] rounded-lg font-medium hover:bg-[#F0F4F3] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-[#0D7C66] hover:bg-[#0a6354] text-white px-4 sm:px-6 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors shadow-sm"
            >
              Save Labour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLabour;