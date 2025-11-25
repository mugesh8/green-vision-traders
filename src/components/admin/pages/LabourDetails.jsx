import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, TrendingUp, Package, ArrowLeft, User, Calendar, Clock } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const LabourDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [labour, setLabour] = useState(null);

  const handleBackClick = () => {
    navigate('/labours');
  };

  const labourData = {
    '1': {
      id: 'LAB-001',
      name: 'Laksmi',
      phone: '+91 98765 43210',
      aadhaarNumber: '1234 5678 9012',
      dateOfBirth: '15/08/1985',
      gender: 'Female',
      bloodGroup: 'B+',
      address: '123 Labour Colony, Coimbatore District, Tamil Nadu - 641001, India',
      department: 'Packing',
      dailyWage: '₹650',
      joiningDate: '15/01/2024',
      status: 'Present'
    },
    '2': {
      id: 'LAB-002',
      name: 'Reka',
      phone: '+91 98765 43211',
      aadhaarNumber: '2345 6789 0123',
      dateOfBirth: '22/03/1990',
      gender: 'Female',
      bloodGroup: 'A+',
      address: '456 Worker Street, Coimbatore District, Tamil Nadu - 641002, India',
      department: 'Loading',
      dailyWage: '₹700',
      joiningDate: '20/02/2024',
      status: 'Present'
    },
    '3': {
      id: 'LAB-003',
      name: 'Janani',
      phone: '+91 98765 43212',
      aadhaarNumber: '3456 7890 1234',
      dateOfBirth: '10/12/1988',
      gender: 'Female',
      bloodGroup: 'O+',
      address: '789 Worker Colony, Coimbatore District, Tamil Nadu - 641003, India',
      department: 'Sorting',
      dailyWage: '₹600',
      joiningDate: '05/03/2024',
      status: 'Absent'
    },
    '4': {
      id: 'LAB-004',
      name: 'Selvi',
      phone: '+91 98765 43213',
      aadhaarNumber: '4567 8901 2345',
      dateOfBirth: '25/06/1992',
      gender: 'Female',
      bloodGroup: 'AB+',
      address: '321 Labour Street, Coimbatore District, Tamil Nadu - 641004, India',
      department: 'Packing',
      dailyWage: '₹700',
      joiningDate: '12/02/2024',
      status: 'Present'
    },
    '5': {
      id: 'LAB-005',
      name: 'Rani',
      phone: '+91 98765 43214',
      aadhaarNumber: '5678 9012 3456',
      dateOfBirth: '18/09/1987',
      gender: 'Female',
      bloodGroup: 'B-',
      address: '654 Worker Avenue, Coimbatore District, Tamil Nadu - 641005, India',
      department: 'Loading',
      dailyWage: '₹620',
      joiningDate: '28/01/2024',
      status: 'Present'
    },
    '6': {
      id: 'LAB-006',
      name: 'Apsara',
      phone: '+91 98765 43215',
      aadhaarNumber: '6789 0123 4567',
      dateOfBirth: '03/04/1991',
      gender: 'Female',
      bloodGroup: 'A-',
      address: '987 Labour Colony, Coimbatore District, Tamil Nadu - 641006, India',
      department: 'Sorting',
      dailyWage: '₹680',
      joiningDate: '15/03/2024',
      status: 'Half Day'
    }
  };

  useEffect(() => {
    const fetchLabour = () => {
      const labourInfo = labourData[id];
      if (labourInfo) {
        setLabour(labourInfo);
      }
    };

    fetchLabour();
  }, [id]);

  if (!labour) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading labour details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
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
      </div>

      {/* Labour Profile Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-teal-700 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-3xl font-bold">{labour?.name?.substring(0, 2).toUpperCase() || 'LB'}</span>
          </div>
          
          {/* Labour Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{labour?.name || 'N/A'}</h2>
            <p className="text-gray-600 mb-2">Labour ID: {labour?.id || 'N/A'}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <span className="text-red-500">👷</span>
                Joined on {labour?.joiningDate || 'N/A'}
              </span>
              <span>•</span>
              <span>Last updated: Oct 28, 2025</span>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-col gap-2">
            <span className="bg-teal-50 text-teal-700 px-4 py-1 rounded-full text-sm font-medium border border-teal-200">
              {labour?.department || 'Worker'}
            </span>
            <span className={`px-4 py-1 rounded-full text-sm font-medium border flex items-center gap-2 ${
              labour?.status === 'Present' 
                ? 'bg-green-50 text-green-700 border-green-200' 
                : labour?.status === 'Absent'
                ? 'bg-red-50 text-red-700 border-red-200'
                : 'bg-orange-50 text-orange-700 border-orange-200'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                labour?.status === 'Present' ? 'bg-green-500' : 
                labour?.status === 'Absent' ? 'bg-red-500' : 'bg-orange-500'
              }`}></span>
              {labour?.status || 'Unknown'}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Personal Information */}
        <div className="bg-teal-50 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-800">Personal Information</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Full Name</p>
              <p className="text-gray-800">{labour?.name || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Mobile Number</p>
              <p className="text-gray-800">{labour?.phone || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Aadhaar Number</p>
              <p className="text-gray-800">{labour?.aadhaarNumber || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Date of Birth</p>
              <p className="text-gray-800">{labour?.dateOfBirth || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Gender</p>
              <p className="text-gray-800">{labour?.gender || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Blood Group</p>
              <p className="text-gray-800">{labour?.bloodGroup || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Work Details */}
        <div className="bg-teal-50 rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <h3 className="text-lg font-semibold text-gray-800">Work Details</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Department</p>
              <span className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                {labour?.department || 'N/A'}
              </span>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Daily Wage</p>
              <p className="text-gray-800 font-semibold">{labour?.dailyWage || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-1">Joining Date</p>
              <p className="text-gray-800">{labour?.joiningDate || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Section */}
      <div className="bg-teal-50 rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="w-5 h-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-800">Address Details</h3>
        </div>
        
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-1">Full Address</p>
          <p className="text-gray-800">{labour?.address || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default LabourDetails;
            