import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { Check, ChevronDown, Package, User } from 'lucide-react';
import { updateStage2Assignment, getOrderAssignment, getAvailableStock } from '../../../api/orderAssignmentApi';
import { getAllLabours } from '../../../api/labourApi';
import { getPresentLaboursToday } from '../../../api/labourAttendanceApi';
import { getAllFarmers } from '../../../api/farmerApi';
import { getAllSuppliers } from '../../../api/supplierApi';
import { getAllThirdParties } from '../../../api/thirdPartyApi';
import { getTapes } from '../../../api/inventoryApi';

const OrderAssignCreateStage2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const orderData = location.state?.orderData;
  const [productRows, setProductRows] = useState([]);
  const [labours, setLabours] = useState([]);
  const [availableStock, setAvailableStock] = useState({});
  const [packagingStatuses, setPackagingStatuses] = useState({});
  const [tapes, setTapes] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown !== null && !event.target.closest('.labour-dropdown')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Load labours and assignment data from Stage 1
  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch available stock and tapes
        try {
          const [stockResponse, tapesResponse] = await Promise.all([
            getAvailableStock(),
            getTapes()
          ]);
          if (stockResponse.success) {
            setAvailableStock(stockResponse.data);
          }
          if (tapesResponse.success) {
            setTapes(tapesResponse.data || []);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }

        // Load assignment data from Stage 1
        const assignmentResponse = await getOrderAssignment(id);
        const assignmentData = assignmentResponse.data;

        console.log('Full assignment data:', assignmentData);

        // Load present labours from attendance
        try {
          const today = new Date().toISOString().split('T')[0];
          const attendanceResponse = await getPresentLaboursToday(today);
          console.log('Full attendance response:', attendanceResponse);

          // Handle different response structures
          let allAttendance = [];
          if (attendanceResponse.data?.data) {
            allAttendance = attendanceResponse.data.data;
          } else if (Array.isArray(attendanceResponse.data)) {
            allAttendance = attendanceResponse.data;
          } else if (attendanceResponse.data) {
            allAttendance = [attendanceResponse.data];
          }

          console.log('All attendance records:', allAttendance);

          // Extract labours from nested structure
          let presentLabours = [];
          if (allAttendance.length > 0 && allAttendance[0].labours) {
            presentLabours = allAttendance[0].labours.filter(labour =>
              labour.attendance_status && labour.attendance_status.toLowerCase() === 'present'
            );
          }

          console.log('Present labours:', presentLabours);
          setLabours(presentLabours);
        } catch (err) {
          console.error('Error loading present labours:', err);
        }

        // Initialize product rows from Stage 1 data
        if (assignmentData.order && assignmentData.order.items) {
          const rows = [];

          // Parse product_assignments once
          let assignments = [];
          if (assignmentData.product_assignments) {
            try {
              assignments = typeof assignmentData.product_assignments === 'string'
                ? JSON.parse(assignmentData.product_assignments)
                : assignmentData.product_assignments;
            } catch (e) {
              console.error('Error parsing product_assignments:', e);
            }
          }

          // Create individual rows for each vendor assignment
          assignmentData.order.items.forEach((item) => {
            const itemAssignments = assignments.filter(pa => pa.id == item.oiid || pa.id === String(item.oiid));

            if (itemAssignments.length > 0) {
              // Create separate row for each vendor
              itemAssignments.forEach((assignment, idx) => {
                const row = {
                  id: `${item.oiid}-${idx}`,
                  oiid: item.oiid,
                  product: (item.product_name || item.product || '').replace(/^\d+\s*-\s*/, ''),
                  quantity: `${item.net_weight || 0} kg`,
                  pickedQuantity: parseFloat(assignment.assignedQty) || 0,
                  entityType: assignment.entityType || '',
                  entityName: assignment.assignedTo || '',
                  wastage: '',
                  reuse: '',
                  packedAmount: '',
                  tapeColor: '',
                  labour: [],
                  status: 'pending',
                  isFirstVendor: idx === 0,
                  vendorCount: itemAssignments.length,
                  vendorIndex: idx
                };
                rows.push(row);
              });
            } else {
              // No assignment, create default row
              rows.push({
                id: `${item.oiid}-0`,
                oiid: item.oiid,
                product: (item.product_name || item.product || '').replace(/^\d+\s*-\s*/, ''),
                quantity: `${item.net_weight || 0} kg`,
                pickedQuantity: '',
                entityType: '',
                entityName: '',
                wastage: '',
                reuse: '',
                tapeColor: '',
                labour: [],
                status: 'pending',
                isFirstVendor: true,
                vendorCount: 0,
                vendorIndex: 0
              });
            }
          });

          // Load Stage 2 data if exists from stage2_summary_data
          if (assignmentData.stage2_summary_data) {
            try {
              const stage2Summary = typeof assignmentData.stage2_summary_data === 'string'
                ? JSON.parse(assignmentData.stage2_summary_data)
                : assignmentData.stage2_summary_data;

              console.log('Parsed stage2_summary_data:', stage2Summary);

              if (stage2Summary.labourAssignments && stage2Summary.labourAssignments.length > 0) {
                // Create a map of product assignments from labour assignments
                const assignmentMap = {};
                
                stage2Summary.labourAssignments.forEach(labourAssignment => {
                  const labourName = labourAssignment.labour;
                  
                  labourAssignment.assignments.forEach(assignment => {
                    const key = `${assignment.oiid}-${assignment.entityName}`;
                    
                    if (!assignmentMap[key]) {
                      assignmentMap[key] = {
                        wastage: assignment.wastage,
                        reuse: assignment.reuse,
                        packedAmount: assignment.packedAmount,
                        status: assignment.status,
                        tapeColor: assignment.tapeColor,
                        labours: []
                      };
                    }
                    
                    // Add labour to the list if not already present
                    if (!assignmentMap[key].labours.includes(labourName)) {
                      assignmentMap[key].labours.push(labourName);
                    }
                  });
                });

                console.log('Assignment map:', assignmentMap);

                // Apply the data to rows
                rows.forEach((row) => {
                  const key = `${row.oiid}-${row.entityName}`;
                  const stage2Data = assignmentMap[key];
                  
                  if (stage2Data) {
                    row.wastage = stage2Data.wastage || '';
                    row.reuse = stage2Data.reuse || '';
                    row.packedAmount = stage2Data.packedAmount || '';
                    row.status = stage2Data.status || 'pending';
                    
                    if (row.isFirstVendor) {
                      row.labour = stage2Data.labours || [];
                      row.tapeColor = stage2Data.tapeColor || '';
                    }
                  }
                });
              }
            } catch (e) {
              console.error('Error parsing stage2_summary_data:', e);
            }
          }

          setProductRows(rows);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };

    loadData();
  }, [id]);

  const handleSaveStage2 = async () => {
    // Validate that all products have labour assigned (check only first vendor row)
    const firstVendorRows = productRows.filter(row => row.isFirstVendor);
    const missingLabour = firstVendorRows.filter(row => !row.labour || row.labour.length === 0);
    if (missingLabour.length > 0) {
      alert(`Please assign labour for: ${missingLabour.map(r => r.product).join(', ')}`);
      return;
    }

    try {
      // Prepare product assignments for backend
      const productAssignments = productRows.map(row => {
        const firstVendorRow = productRows.find(r => r.oiid === row.oiid && r.isFirstVendor);
        return {
          id: row.oiid,
          product: row.product,
          entityType: row.entityType,
          entityName: row.entityName,
          pickedQuantity: parseFloat(row.pickedQuantity) || 0,
          wastage: parseFloat(row.wastage) || 0,
          packedAmount: parseFloat(row.packedAmount) || 0,
          reuse: row.isFirstVendor ? (parseFloat(row.reuse) || 0) : 0,
          tapeColor: firstVendorRow?.tapeColor || '',
          labourId: firstVendorRow?.labour?.map(l => {
            const labour = labours.find(lab => lab.labour_name === l);
            return labour?.labour_id;
          }).filter(Boolean).join(',') || '',
          labourName: firstVendorRow?.labour?.join(', ') || '',
          status: row.status || 'pending'
        };
      });

      // Group products by labour for summary
      const groupedByLabour = {};
      productRows.forEach(row => {
        if (row.labour && row.labour.length > 0) {
          const labourNames = Array.isArray(row.labour) ? row.labour : [row.labour];
          labourNames.forEach(labourName => {
            if (!groupedByLabour[labourName]) {
              groupedByLabour[labourName] = [];
            }
            groupedByLabour[labourName].push(row);
          });
        }
      });

      // Generate summary data
      const labourAssignments = Object.entries(groupedByLabour).map(([labourName, rows]) => {
        const selectedLabour = labours.find(l => l.full_name === labourName);
        const totalPicked = rows.reduce((sum, r) => sum + (parseFloat(r.pickedQuantity) || 0), 0);
        const totalWastage = rows.reduce((sum, r) => sum + (parseFloat(r.wastage) || 0), 0);
        const totalReuse = rows.reduce((sum, r) => sum + (parseFloat(r.reuse) || 0), 0);

        return {
          labour: labourName,
          labourId: selectedLabour?.lid || null,
          totalPicked: parseFloat(totalPicked.toFixed(2)),
          totalWastage: parseFloat(totalWastage.toFixed(2)),
          totalReuse: parseFloat(totalReuse.toFixed(2)),
          assignments: rows.map(r => ({
            product: r.product,
            entityType: r.entityType,
            entityName: r.entityName,
            tapeColor: r.tapeColor,
            pickedQuantity: parseFloat(r.pickedQuantity) || 0,
            wastage: parseFloat(r.wastage) || 0,
            reuse: parseFloat(r.reuse) || 0,
            packedAmount: parseFloat(r.packedAmount) || 0,
            status: r.status || 'pending',
            oiid: r.oiid
          }))
        };
      });

      const summaryData = {
        labourAssignments,
        totalPicked: parseFloat(productRows.reduce((sum, r) => sum + (parseFloat(r.pickedQuantity) || 0), 0).toFixed(2)),
        totalWastage: parseFloat(productRows.reduce((sum, r) => sum + (parseFloat(r.wastage) || 0), 0).toFixed(2)),
        totalReuse: parseFloat(productRows.reduce((sum, r) => sum + (parseFloat(r.reuse) || 0), 0).toFixed(2)),
        totalLabours: Object.keys(groupedByLabour).length,
        totalProducts: productRows.length
      };

      // Format data for backend - match new backend structure
      const stage2Data = {
        productAssignments,
        summaryData
      };

      const response = await updateStage2Assignment(id, stage2Data);

      if (response.success) {
        alert('Stage 2 saved successfully! Stock has been updated.');
        navigate(`/order-assign/stage3/${id}`, { state: { orderData } });
      } else {
        alert('Stage 2 saved but there might be issues: ' + (response.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error saving stage 2:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save stage 2 assignment';
      alert(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Order Information Table */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Order Information</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Order ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Customer Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Phone Number</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Delivery Address</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Products</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-4 py-3 text-sm text-left text-gray-900">{orderData?.oid || id}</td>
                <td className="px-4 py-3 text-sm text-left text-gray-900">{orderData?.customer_name || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-left text-gray-900">{orderData?.phone_number || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-left text-gray-900">{orderData?.delivery_address || 'N/A'}</td>
                <td className="px-4 py-3 text-sm text-left text-gray-900">{orderData?.items?.length || 0} Items</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${orderData?.order_status === 'pending' ? 'bg-purple-100 text-purple-700' :
                    orderData?.order_status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                      orderData?.order_status === 'delivered' ? 'bg-emerald-600 text-white' :
                        'bg-gray-100 text-gray-700'
                    }`}>
                    {orderData?.order_status ? orderData.order_status.charAt(0).toUpperCase() + orderData.order_status.slice(1) : 'N/A'}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
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
        <p className="text-sm text-gray-600 mb-6">Assign labour and track wastage for each product</p>

        {/* Product Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity Needed</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Picked Quantity</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Entity Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Wastage</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Revised Picked</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Entity Stock</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Packed Amount</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Total Packing</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Reuse</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Select Tape</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Select Labour</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {productRows.map((row, index) => {
                const firstVendorIndex = productRows.findIndex(r => r.oiid === row.oiid);
                const sameProductRows = productRows.filter(r => r.oiid === row.oiid);
                const rowSpan = sameProductRows.length;
                
                return (
                  <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                    {row.isFirstVendor && (
                      <td className="px-4 py-4" rowSpan={rowSpan}>
                        <span className="text-sm font-medium text-gray-900">{row.product}</span>
                      </td>
                    )}
                    {row.isFirstVendor && (
                      <td className="px-4 py-4" rowSpan={rowSpan}>
                        <span className="text-sm text-gray-900">{row.quantity}</span>
                      </td>
                    )}
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{row.pickedQuantity || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{row.entityType || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-gray-900">{row.entityName || '-'}</span>
                    </td>
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={row.wastage}
                        placeholder="Enter wastage"
                        onChange={(e) => {
                          const updatedRows = [...productRows];
                          updatedRows[index].wastage = e.target.value;
                          setProductRows(updatedRows);
                        }}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm font-semibold text-blue-600">
                        {(() => {
                          const picked = parseFloat(row.pickedQuantity) || 0;
                          const wastage = parseFloat(row.wastage) || 0;
                          const revised = picked - wastage;
                          return revised > 0 ? `${revised.toFixed(2)} kg` : '-';
                        })()}
                      </span>
                    </td>
                    {row.isFirstVendor && (
                      <td className="px-4 py-4" rowSpan={rowSpan}>
                        <div className="flex items-center gap-2">
                          {(() => {
                            const productName = row.product?.replace(/^\d+\s*-\s*/, '');
                            const entityStock = availableStock[productName] || 0;
                            return (
                              <>
                                <span className={`text-sm font-semibold ${entityStock > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                  {entityStock > 0 ? `${entityStock.toFixed(2)} kg` : 'No stock'}
                                </span>
                                {entityStock > 0 && (
                                  <div className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                    Available
                                  </div>
                                )}
                              </>
                            );
                          })()}
                        </div>
                      </td>
                    )}
                    <td className="px-4 py-4">
                      <input
                        type="text"
                        value={row.packedAmount}
                        placeholder="Enter packed amount"
                        onChange={(e) => {
                          const updatedRows = [...productRows];
                          updatedRows[index].packedAmount = e.target.value;
                          setProductRows(updatedRows);
                        }}
                        className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      />
                    </td>
                    {row.isFirstVendor && (
                      <td className="px-4 py-4" rowSpan={rowSpan}>
                        {(() => {
                          const sameProductRows = productRows.filter(r => r.oiid === row.oiid);
                          const totalPacked = sameProductRows.reduce((sum, r) => sum + (parseFloat(r.packedAmount) || 0), 0);
                          const reuse = parseFloat(row.reuse) || 0;
                          const totalPacking = totalPacked + reuse;
                          const needed = parseFloat(row.quantity) || 0;
                          const exceeds = totalPacking > needed;
                          return (
                            <div>
                              <span className={`text-sm font-semibold ${exceeds ? 'text-red-600' : 'text-emerald-600'}`}>
                                {totalPacking.toFixed(2)} kg
                              </span>
                              {exceeds && (
                                <div className="text-xs text-red-600 mt-1">⚠ Exceeds needed qty</div>
                              )}
                            </div>
                          );
                        })()}
                      </td>
                    )}
                    {row.isFirstVendor && (
                      <td className="px-4 py-4" rowSpan={rowSpan}>
                        <input
                          type="text"
                          value={row.reuse}
                          placeholder="Enter reuse"
                          onChange={(e) => {
                            const updatedRows = [...productRows];
                            sameProductRows.forEach(r => {
                              const idx = productRows.findIndex(pr => pr.id === r.id);
                              updatedRows[idx].reuse = e.target.value;
                            });
                            setProductRows(updatedRows);
                          }}
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        />
                      </td>
                    )}
                    {row.isFirstVendor && (
                      <td className="px-4 py-4" rowSpan={rowSpan}>
                        <div className="relative" style={{ minWidth: '150px' }}>
                          <input
                            type="text"
                            readOnly
                            value={row.tapeColor || ''}
                            placeholder="Select tape..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white cursor-pointer"
                            onClick={() => document.getElementById(`tape-select-${firstVendorIndex}`).click()}
                          />
                          <select
                            id={`tape-select-${firstVendorIndex}`}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={row.tapeColor}
                            onChange={(e) => {
                              const updatedRows = [...productRows];
                              sameProductRows.forEach(r => {
                                const idx = productRows.findIndex(pr => pr.id === r.id);
                                updatedRows[idx].tapeColor = e.target.value;
                              });
                              setProductRows(updatedRows);
                            }}
                          >
                            <option value="">Select tape...</option>
                            {tapes.map(tape => (
                              <option key={tape.iid} value={tape.color}>
                                {tape.color}
                              </option>
                            ))}
                          </select>
                        </div>
                      </td>
                    )}
                    {row.isFirstVendor && (
                      <td className="px-4 py-4" rowSpan={rowSpan}>
                        <div className="relative labour-dropdown">
                          <button
                            type="button"
                            onClick={() => setOpenDropdown(openDropdown === firstVendorIndex ? null : firstVendorIndex)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white flex items-center justify-between"
                          >
                            <span className="truncate">
                              {row.labour && row.labour.length > 0 ? `${row.labour.length} selected` : 'Select labour...'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          </button>
                          {openDropdown === firstVendorIndex && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                              {labours.map(labour => (
                                <label key={labour.lid} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={row.labour.includes(labour.full_name)}
                                    onChange={(e) => {
                                      const updatedRows = [...productRows];
                                      const newLabour = e.target.checked
                                        ? [...row.labour, labour.full_name]
                                        : row.labour.filter(l => l !== labour.full_name);
                                      sameProductRows.forEach(r => {
                                        const idx = productRows.findIndex(pr => pr.id === r.id);
                                        updatedRows[idx].labour = newLabour;
                                      });
                                      setProductRows(updatedRows);
                                    }}
                                    className="mr-2"
                                  />
                                  <span className="text-sm">{labour.full_name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        {row.labour && row.labour.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {row.labour.map((lab, idx) => (
                              <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
                                {lab}
                              </span>
                            ))}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Product Cards - Mobile */}
        <div className="lg:hidden space-y-4">
          {(() => {
            const groupedProducts = {};
            productRows.forEach(row => {
              if (!groupedProducts[row.oiid]) {
                groupedProducts[row.oiid] = [];
              }
              groupedProducts[row.oiid].push(row);
            });

            return Object.values(groupedProducts).map((vendorRows, groupIndex) => {
              const firstRow = vendorRows[0];
              return (
                <div key={firstRow.oiid} className="border-2 border-emerald-200 rounded-lg p-4 bg-emerald-50">
                  <div className="mb-3 pb-3 border-b-2 border-emerald-300">
                    <p className="text-sm font-semibold text-gray-900">{firstRow.product}</p>
                    <p className="text-xs text-gray-500 mt-1">Quantity Needed: {firstRow.quantity}</p>
                  </div>

                  {/* Vendor-specific data */}
                  <div className="space-y-3 mb-4">
                    {vendorRows.map((row, vendorIndex) => {
                      const rowIndex = productRows.findIndex(r => r.id === row.id);
                      return (
                        <div key={row.id} className="bg-white rounded-lg p-3 border border-gray-300">
                          <p className="text-xs font-semibold text-emerald-700 mb-2">Vendor {vendorIndex + 1}</p>
                          <div className="space-y-2">
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Picked Quantity</label>
                              <p className="text-sm text-gray-900">{row.pickedQuantity || '-'}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Entity Type</label>
                              <p className="text-sm text-gray-900">{row.entityType || '-'}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Name</label>
                              <p className="text-sm text-gray-900">{row.entityName || '-'}</p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Entity Stock</label>
                              <div className="flex items-center gap-2">
                                {(() => {
                                  const productName = row.product?.replace(/^\d+\s*-\s*/, '');
                                  const entityStock = availableStock[productName] || 0;
                                  return (
                                    <>
                                      <span className={`text-sm font-semibold ${entityStock > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                                        {entityStock > 0 ? `${entityStock.toFixed(2)} kg` : 'No stock'}
                                      </span>
                                      {entityStock > 0 && (
                                        <div className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-xs font-medium">
                                          Available
                                        </div>
                                      )}
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Wastage</label>
                              <input
                                type="text"
                                value={row.wastage}
                                placeholder="Enter wastage"
                                onChange={(e) => {
                                  const updatedRows = [...productRows];
                                  updatedRows[rowIndex].wastage = e.target.value;
                                  setProductRows(updatedRows);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Revised Picked Quantity</label>
                              <p className="text-sm font-semibold text-blue-600">
                                {(() => {
                                  const picked = parseFloat(row.pickedQuantity) || 0;
                                  const wastage = parseFloat(row.wastage) || 0;
                                  const revised = picked - wastage;
                                  return revised > 0 ? `${revised.toFixed(2)} kg` : '-';
                                })()}
                              </p>
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Packed Amount (kg)</label>
                              <input
                                type="text"
                                value={row.packedAmount}
                                placeholder="Enter packed amount"
                                onChange={(e) => {
                                  const updatedRows = [...productRows];
                                  updatedRows[rowIndex].packedAmount = e.target.value;
                                  setProductRows(updatedRows);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Total Packing</label>
                              {(() => {
                                const totalPacked = vendorRows.reduce((sum, r) => sum + (parseFloat(r.packedAmount) || 0), 0);
                                const reuse = parseFloat(row.reuse) || 0;
                                const totalPacking = totalPacked + reuse;
                                const needed = parseFloat(row.quantity) || 0;
                                const exceeds = totalPacking > needed;
                                return (
                                  <div>
                                    <p className={`text-sm font-semibold ${exceeds ? 'text-red-600' : 'text-emerald-600'}`}>
                                      {totalPacking.toFixed(2)} kg
                                    </p>
                                    {exceeds && (
                                      <p className="text-xs text-red-600 mt-1">⚠ Exceeds needed quantity</p>
                                    )}
                                  </div>
                                );
                              })()}
                            </div>
                            <div>
                              <label className="text-xs text-gray-500 block mb-1">Reuse</label>
                              <input
                                type="text"
                                value={row.reuse}
                                placeholder="Enter reuse"
                                onChange={(e) => {
                                  const updatedRows = [...productRows];
                                  updatedRows[rowIndex].reuse = e.target.value;
                                  setProductRows(updatedRows);
                                }}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Common fields for all vendors */}
                  <div className="bg-white rounded-lg p-3 border-2 border-emerald-400">
                    <p className="text-xs font-semibold text-emerald-700 mb-3">Common for all vendors</p>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Select Tape</label>
                        <div className="relative">
                          <input
                            type="text"
                            readOnly
                            value={firstRow.tapeColor || ''}
                            placeholder="Select tape..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white cursor-pointer"
                            onClick={() => document.getElementById(`tape-select-mobile-${groupIndex}`).click()}
                          />
                          <select
                            id={`tape-select-mobile-${groupIndex}`}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            value={firstRow.tapeColor}
                            onChange={(e) => {
                              const updatedRows = [...productRows];
                              vendorRows.forEach(r => {
                                const idx = productRows.findIndex(pr => pr.id === r.id);
                                updatedRows[idx].tapeColor = e.target.value;
                              });
                              setProductRows(updatedRows);
                            }}
                          >
                            <option value="">Select tape...</option>
                            {tapes.map(tape => (
                              <option key={tape.iid} value={tape.color}>
                                {tape.color}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs text-gray-500 block mb-1">Select Labour (Multiple)</label>
                        <div className="relative labour-dropdown">
                          <button
                            type="button"
                            onClick={() => setOpenDropdown(openDropdown === `mobile-${groupIndex}` ? null : `mobile-${groupIndex}`)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-left bg-white flex items-center justify-between"
                          >
                            <span className="truncate">
                              {firstRow.labour && firstRow.labour.length > 0 ? `${firstRow.labour.length} selected` : 'Select labour...'}
                            </span>
                            <ChevronDown className="w-4 h-4 text-gray-600" />
                          </button>
                          {openDropdown === `mobile-${groupIndex}` && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                              {labours.map(labour => (
                                <label key={labour.lid} className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={firstRow.labour.includes(labour.full_name)}
                                    onChange={(e) => {
                                      const updatedRows = [...productRows];
                                      const newLabour = e.target.checked
                                        ? [...firstRow.labour, labour.full_name]
                                        : firstRow.labour.filter(l => l !== labour.full_name);
                                      vendorRows.forEach(r => {
                                        const idx = productRows.findIndex(pr => pr.id === r.id);
                                        updatedRows[idx].labour = newLabour;
                                      });
                                      setProductRows(updatedRows);
                                    }}
                                    className="mr-2"
                                  />
                                  <span className="text-sm">{labour.full_name}</span>
                                </label>
                              ))}
                            </div>
                          )}
                        </div>
                        {firstRow.labour && firstRow.labour.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {firstRow.labour.map((lab, idx) => (
                              <span key={idx} className="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs">
                                {lab}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </div>

      {/* Summary Section - Grouped by Labour */}
      {productRows.some(row => row.labour) && (
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl shadow-sm p-6 mb-6 border-2 border-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Packaging Summary</h2>
              <p className="text-sm text-gray-600">Products grouped by assigned labour</p>
            </div>
          </div>

          {/* Desktop Summary */}
          <div className="hidden lg:block space-y-6">
            {(() => {
              const groupedByLabour = {};
              productRows.forEach(row => {
                if (row.labour) {
                  if (!groupedByLabour[row.labour]) {
                    groupedByLabour[row.labour] = [];
                  }
                  groupedByLabour[row.labour].push(row);
                }
              });

              return Object.entries(groupedByLabour).map(([labourName, rows]) => {
                const totalWastage = rows.reduce((sum, r) => sum + (parseFloat(r.wastage) || 0), 0);
                const totalReuse = rows.reduce((sum, r) => sum + (parseFloat(r.reuse) || 0), 0);
                const totalPicked = rows.reduce((sum, r) => sum + (parseFloat(r.pickedQuantity) || 0), 0);

                return (
                  <div key={labourName} className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-emerald-300">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4">
                      <div className="flex items-center gap-3 text-white">
                        <User className="w-6 h-6" />
                        <div>
                          <h3 className="text-lg font-bold">{labourName}</h3>
                          <p className="text-sm text-emerald-100">{rows.length} Products</p>
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-emerald-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Product</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Entity Type</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Entity Name</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Tape Color</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Picked Qty</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Wastage</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Revised Picked</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Packed Amount</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Reuse</th>
                            <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {rows.map((row, idx) => (
                            <tr key={idx} className="hover:bg-emerald-50 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                  <span className="text-sm font-medium text-gray-900">{row.product}</span>
                                </div>
                              </td>
                              <td className="px-4 py-3">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 capitalize">
                                  {row.entityType || '-'}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-900">{row.entityName || '-'}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-900">{row.tapeColor || '-'}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm font-semibold text-gray-900">{row.pickedQuantity || 0} kg</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-900">{row.wastage || 0} kg</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm font-semibold text-blue-600">
                                  {((parseFloat(row.pickedQuantity) || 0) - (parseFloat(row.wastage) || 0)).toFixed(2)} kg
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-900">{row.packedAmount || 0} kg</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="text-sm text-gray-900">{row.reuse || 0} kg</span>
                              </td>
                              <td className="px-4 py-3">
                                <select
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                  value={row.status || 'pending'}
                                  onChange={(e) => {
                                    const updatedRows = [...productRows];
                                    const rowIndex = productRows.findIndex(r => r.id === row.id);
                                    if (rowIndex !== -1) {
                                      updatedRows[rowIndex].status = e.target.value;
                                      setProductRows(updatedRows);
                                    }
                                  }}
                                >
                                  <option value="pending">Pending</option>
                                  <option value="packing">Packing in Process</option>
                                  <option value="completed">Completed</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot className="bg-emerald-100 border-t-2 border-emerald-300">
                          <tr>
                            <td colSpan="4" className="px-4 py-3 text-right">
                              <span className="text-sm font-bold text-gray-900">Labour Total:</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold text-emerald-700">{totalPicked.toFixed(2)} kg</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold text-red-700">{totalWastage.toFixed(2)} kg</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold text-blue-700">{(totalPicked - totalWastage).toFixed(2)} kg</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-bold text-blue-700">{totalReuse.toFixed(2)} kg</span>
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Mobile Summary */}
          <div className="lg:hidden space-y-6">
            {(() => {
              const groupedByLabour = {};
              productRows.forEach(row => {
                if (row.labour) {
                  if (!groupedByLabour[row.labour]) {
                    groupedByLabour[row.labour] = [];
                  }
                  groupedByLabour[row.labour].push(row);
                }
              });

              return Object.entries(groupedByLabour).map(([labourName, rows]) => {
                const totalWastage = rows.reduce((sum, r) => sum + (parseFloat(r.wastage) || 0), 0);
                const totalReuse = rows.reduce((sum, r) => sum + (parseFloat(r.reuse) || 0), 0);
                const totalPicked = rows.reduce((sum, r) => sum + (parseFloat(r.pickedQuantity) || 0), 0);

                return (
                  <div key={labourName} className="bg-white rounded-lg shadow-sm overflow-hidden border-2 border-emerald-300">
                    <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-3">
                      <div className="flex items-center gap-2 text-white">
                        <User className="w-5 h-5" />
                        <div>
                          <h3 className="text-base font-bold">{labourName}</h3>
                          <p className="text-xs text-emerald-100">{rows.length} Products</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 space-y-3">
                      {rows.map((row, idx) => (
                        <div key={idx} className="border border-gray-200 rounded-lg p-3">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                                <span className="text-sm font-semibold text-gray-900">{row.product}</span>
                              </div>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-100 text-emerald-800 capitalize">
                              {row.entityType || '-'}
                            </span>
                          </div>

                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Entity Name:</span>
                              <span className="text-gray-900">{row.entityName || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tape Color:</span>
                              <span className="text-gray-900">{row.tapeColor || '-'}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                              <span className="text-gray-700">Picked:</span>
                              <span className="font-semibold text-gray-900">{row.pickedQuantity || 0} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Wastage:</span>
                              <span className="text-gray-900">{row.wastage || 0} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Revised Picked:</span>
                              <span className="font-semibold text-blue-600">{((parseFloat(row.pickedQuantity) || 0) - (parseFloat(row.wastage) || 0)).toFixed(2)} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Packed Amount:</span>
                              <span className="text-gray-900">{row.packedAmount || 0} kg</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-700">Reuse:</span>
                              <span className="text-gray-900">{row.reuse || 0} kg</span>
                            </div>
                            <div className="pt-2 border-t border-gray-200">
                              <label className="block text-xs font-semibold text-gray-700 mb-1">Status</label>
                              <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                value={row.status || 'pending'}
                                onChange={(e) => {
                                  const updatedRows = [...productRows];
                                  const rowIndex = productRows.findIndex(r => r.id === row.id);
                                  if (rowIndex !== -1) {
                                    updatedRows[rowIndex].status = e.target.value;
                                    setProductRows(updatedRows);
                                  }
                                }}
                              >
                                <option value="pending">Pending</option>
                                <option value="packing">Packing in Process</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))}

                      <div className="bg-emerald-100 rounded-lg p-3 border-2 border-emerald-300">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-900">Total Picked:</span>
                            <span className="font-bold text-emerald-700">{totalPicked.toFixed(2)} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-900">Total Wastage:</span>
                            <span className="font-bold text-red-700">{totalWastage.toFixed(2)} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-900">Total Revised:</span>
                            <span className="font-bold text-blue-700">{(totalPicked - totalWastage).toFixed(2)} kg</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-bold text-gray-900">Total Reuse:</span>
                            <span className="font-bold text-blue-700">{totalReuse.toFixed(2)} kg</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              });
            })()}
          </div>

          {/* Grand Total Section */}
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6 border-2 border-emerald-600">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">Overall Summary</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-600 rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Picked</p>
                    <p className="text-lg font-bold text-gray-900">
                      {productRows.reduce((sum, r) => sum + (parseFloat(r.pickedQuantity) || 0), 0).toFixed(2)} kg
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-600 rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Wastage</p>
                    <p className="text-lg font-bold text-gray-900">
                      {productRows.reduce((sum, r) => sum + (parseFloat(r.wastage) || 0), 0).toFixed(2)} kg
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Package className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Total Reuse</p>
                    <p className="text-lg font-bold text-gray-900">
                      {productRows.reduce((sum, r) => sum + (parseFloat(r.reuse) || 0), 0).toFixed(2)} kg
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button
          onClick={() => navigate(`/order-assign/stage1/${id}`, { state: { orderData } })}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Back
        </button>
        <button
          onClick={handleSaveStage2}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors"
        >
          Save Stage 2
        </button>
      </div>
    </div>
  );
};

export default OrderAssignCreateStage2;