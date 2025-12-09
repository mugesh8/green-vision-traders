import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { ChevronDown, Edit2, X, MapPin, Check } from 'lucide-react';
import { getAssignmentOptions, updateStage1Assignment, getOrderAssignment } from '../../../api/orderAssignmentApi';
import { getOrderById } from '../../../api/orderApi';
import { getAllFarmers } from '../../../api/farmerApi';
import { getAllSuppliers } from '../../../api/supplierApi';
import { getAllThirdParties } from '../../../api/thirdPartyApi';
import { getAllLabours } from '../../../api/labourApi';
import { getAllDrivers } from '../../../api/driverApi';

const OrderAssignCreateStage1 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const orderData = location.state?.orderData;
  const [assignmentOptions, setAssignmentOptions] = useState({
    farmers: [],
    suppliers: [],
    thirdParties: [],
    labours: [],
    drivers: []
  });
  const [productRows, setProductRows] = useState([]);
  const [deliveryRoutes, setDeliveryRoutes] = useState([]);
  const [orderDetails, setOrderDetails] = useState(orderData || null);
  const [selectedType, setSelectedType] = useState('Box');

  // Update selectedType when orderDetails changes
  useEffect(() => {
    if (orderDetails?.items?.length > 0) {
      const packing = orderDetails.items[0].packing_type || "";

      // Check if it has weight (e.g., contains "kg")
      const hasWeight = /\d+\s*kg/i.test(packing);

      if (hasWeight) {
        // Determine if Box or Bag
        if (/box/i.test(packing)) {
          setSelectedType("Box");
          return;
        }
        if (/bag/i.test(packing)) {
          setSelectedType("Bag");
          return;
        }
      }
    }
    // Default to Box if we can't determine
    setSelectedType("Box");
  }, [orderDetails]);

  // Load assignment options and existing assignment data
  useEffect(() => {
    const loadAssignmentData = async () => {
      try {
        // Load order details if not passed in location state
        if (!orderDetails) {
          try {
            const orderResponse = await getOrderById(id);
            setOrderDetails(orderResponse.data);
          } catch (error) {
            console.error('Error loading order details:', error);
          }
        }

        // Load dropdown options from respective APIs
        const [farmersRes, suppliersRes, thirdPartiesRes, laboursRes, driversRes] = await Promise.all([
          getAllFarmers(),
          getAllSuppliers(),
          getAllThirdParties(),
          getAllLabours(),
          getAllDrivers()
        ]);

        setAssignmentOptions({
          farmers: farmersRes.data || [],
          suppliers: suppliersRes.data || [],
          thirdParties: thirdPartiesRes.data || [],
          labours: laboursRes.data || [],
          drivers: driversRes.data || []
        });

        // Load existing assignment data if available
        try {
          const assignmentResponse = await getOrderAssignment(id);
          const assignmentData = assignmentResponse.data;

          // Set collection type if available
          if (assignmentData.collection_type) {
            setSelectedType(assignmentData.collection_type);
          }

          // Initialize product rows based on order items
          let items = [];
          if (assignmentData.order && assignmentData.order.items) {
            items = assignmentData.order.items;
          } else if (orderDetails && orderDetails.items) {
            items = orderDetails.items;
          } else {
            // If no items found, we can't initialize the form
            console.warn('No order items found for assignment');
            return;
          }

          if (items.length > 0) {
            const rows = items.map((item, index) => ({
              id: item.oiid,
              product: (item.product || item.product_name || '')?.replace(/^\d+\s*-\s*/, ''),
              product_name: (item.product_name || item.product || '')?.replace(/^\d+\s*-\s*/, ''),
              quantity: `${item.net_weight || 0} kg`,
              net_weight: parseFloat(item.net_weight) || 0,
              assignedTo: '', // Will be populated from assignment data
              entityType: '', // New field for entity type selection
              assignedQty: parseFloat(item.net_weight) || 0,
              tapeType: '',
              labour: '',
              status: 'Unassigned',
              statusColor: 'bg-red-100 text-red-700',
              canEdit: true,
            }));

            // Populate with existing assignment data if available
            if (assignmentData.product_assignments && Array.isArray(assignmentData.product_assignments)) {
              assignmentData.product_assignments.forEach(assignment => {
                const rowIndex = rows.findIndex(row => row.id === assignment.product_id);
                if (rowIndex !== -1) {
                  rows[rowIndex].assignedTo = assignment.assigned_to?.name || '';
                  rows[rowIndex].entityType = assignment.assigned_to?.type || '';
                  rows[rowIndex].assignedQty = assignment.assigned_qty || 0;
                  rows[rowIndex].tapeType = assignment.tape_type || '';
                  rows[rowIndex].labour = assignment.labour || '';
                  rows[rowIndex].status = 'Assigned';
                  rows[rowIndex].statusColor = 'bg-emerald-100 text-emerald-700';
                }
              });
            }

            setProductRows(rows);
          }

          // Initialize delivery routes
          if (assignmentData.delivery_routes) {
            setDeliveryRoutes(assignmentData.delivery_routes);
          } else {
            // Create default routes based on product assignments
            const defaultRoutes = [];
            setDeliveryRoutes(defaultRoutes);
          }
        } catch (assignmentError) {
          console.error('Error loading assignment data:', assignmentError);
          // If there's no existing assignment, we'll initialize with order items only
          await initializeFromOrderItems();
        }
      } catch (error) {
        console.error('Error loading assignment data:', error);
        // If all else fails, try to initialize from order items
        await initializeFromOrderItems();
      }
    };

    loadAssignmentData();
  }, [id, orderDetails]);

  const initializeFromOrderItems = async () => {
    let items = [];
    if (orderDetails && orderDetails.items) {
      items = orderDetails.items;
    }

    if (items.length > 0) {
      const rows = items.map((item, index) => ({
        id: item.oiid,
        product: (item.product || item.product_name || '')?.replace(/^\d+\s*-\s*/, ''),
        product_name: (item.product_name || item.product || '')?.replace(/^\d+\s*-\s*/, ''),
        quantity: `${item.net_weight || 0} kg`,
        net_weight: parseFloat(item.net_weight) || 0,
        assignedTo: '', // Will be populated from assignment data
        entityType: '', // New field for entity type selection
        assignedQty: parseFloat(item.net_weight) || 0,
        tapeType: '',
        labour: '',
        status: 'Unassigned',
        statusColor: 'bg-red-100 text-red-700',
        canEdit: true,
      }));
      setProductRows(rows);
    }

    // Initialize with empty delivery routes
    setDeliveryRoutes([]);
  };

  const handleSaveStage1 = async () => {
    try {
      const stage1Data = {
        collectionType: selectedType,
        productAssignments: productRows,
        deliveryRoutes: deliveryRoutes
      };

      const response = await updateStage1Assignment(id, stage1Data);
      console.log('Stage 1 saved:', response);

      // Navigate to stage 2
      navigate(`/order-assign/stage2/${id}`, { state: { orderData: orderDetails } });
    } catch (error) {
      console.error('Error saving stage 1:', error);
      alert('Failed to save stage 1 assignment. Please try again.');
    }
  };

  // Populate dropdown options for "Labour" field
  const renderLabourOptions = () => {
    return assignmentOptions.labours.map(labour => (
      <option key={`labour-${labour.lid}`} value={labour.full_name}>
        {labour.full_name}
      </option>
    ));
  };

  // Populate dropdown options for "Driver" field
  const renderDriverOptions = () => {
    return assignmentOptions.drivers.map(driver => (
      <option key={`driver-${driver.did}`} value={`${driver.driver_name} - ${driver.driver_id}`}>
        {driver.driver_name} - {driver.driver_id}
      </option>
    ));
  };

  // Create display rows with remaining quantities as separate rows
  const getDisplayRows = () => {
    const displayRows = [];
    
    productRows.forEach((row, index) => {
      // Add the main row
      displayRows.push({
        ...row,
        displayIndex: index,
        isRemaining: false
      });
      
      // If there's remaining quantity, add a separate row for it
      if (row.assignedQty > 0 && row.assignedQty < row.net_weight) {
        displayRows.push({
          id: `${row.id}-remaining`,
          product: row.product,
          product_name: row.product_name,
          quantity: `${row.net_weight - row.assignedQty} kg`,
          net_weight: row.net_weight - row.assignedQty,
          assignedTo: '',
          entityType: '',
          assignedQty: 0,
          tapeType: '',
          labour: '',
          status: 'Unassigned',
          statusColor: 'bg-red-100 text-red-700',
          canEdit: true,
          displayIndex: index,
          isRemaining: true,
          originalRowIndex: index
        });
      }
    });
    
    return displayRows;
  };

  const displayRows = getDisplayRows();

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">

      {/* Order Information Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Order ID</p>
            <p className="text-sm font-semibold text-gray-900">{orderDetails?.oid || id}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Customer Name</p>
            <p className="text-sm font-medium text-gray-900">{orderDetails?.customer_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Total Products</p>
            <p className="text-sm font-medium text-gray-900">{orderDetails?.items?.length || 0} Items</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${orderDetails?.order_status === 'pending' ? 'bg-purple-100 text-purple-700' :
              orderDetails?.order_status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                orderDetails?.order_status === 'delivered' ? 'bg-emerald-600 text-white' :
                  'bg-gray-100 text-gray-700'
              }`}>
              {orderDetails?.order_status ? orderDetails.order_status.charAt(0).toUpperCase() + orderDetails.order_status.slice(1) : 'N/A'}
            </span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Order Type</p>
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              {(() => {
                const packing = orderDetails?.items?.[0]?.packing_type || "";

                // Check if it has weight (e.g., contains "kg")
                const hasWeight = /\d+\s*kg/i.test(packing);

                if (hasWeight) {
                  // Determine if Box or Bag
                  if (/box/i.test(packing)) return "Box Type";
                  if (/bag/i.test(packing)) return "Bag Type";
                }
                return packing || "N/A";
              })()}
            </span>
          </div>
        </div>
      </div>

      {/* Stage Tabs */}
      <div className="mb-6 flex flex-col sm:flex-row gap-3">
        <button className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors">
          Stage 1: Product Collection
        </button>
        <button
          onClick={() => navigate(`/order-assign/stage2/${id}`, { state: { orderData: orderDetails } })}
          className="px-6 py-3 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          Stage 2: Packaging to Airport
        </button>
      </div>

      {/* Stage 1 Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-2">
          <h2 className="text-lg font-semibold text-gray-900">Stage 1: Product Collection from Sources(Box/Bag)</h2>
          <div className="relative">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="appearance-none px-4 py-2 pr-10 bg-white border-2 border-emerald-600 text-emerald-700 rounded-lg font-medium cursor-pointer hover:bg-emerald-50 transition-colors outline-none"
            >
              <option value="Box">Box</option>
              <option value="Bag">Bag</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-6">Assign order products to farmers, suppliers, and third parties for collection and delivery to packaging location</p>

        {/* Product Table - Desktop */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Product</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Quantity Needed</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned Qty</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Tape Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Labour</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayRows.map((row, index) => (
                <tr key={row.id} className={`hover:bg-gray-50 transition-colors ${row.isRemaining ? 'bg-yellow-50' : ''}`}>
                  <td className="px-4 py-4">
                    <span className="text-sm font-medium text-gray-900">
                      {(row.product_name || row.product)?.replace(/^\d+\s*-\s*/, '')}
                    </span>
                    {row.isRemaining && (
                      <span className="block text-xs text-yellow-700 italic mt-1">
                        Remaining Quantity
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">{row.quantity}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="space-y-2">
                      {/* Entity Type Selection */}
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        value={row.entityType || ''}
                        onChange={(e) => {
                          const updatedRows = [...productRows];
                          const targetIndex = row.isRemaining ? row.originalRowIndex : row.displayIndex;
                          updatedRows[targetIndex].entityType = e.target.value;
                          updatedRows[targetIndex].assignedTo = ''; // Reset assignedTo when entity type changes
                          setProductRows(updatedRows);
                        }}
                      >
                        <option value="">Select entity type...</option>
                        <option value="farmer">Farmer</option>
                        <option value="supplier">Supplier</option>
                        <option value="thirdParty">Third Party</option>
                      </select>

                      {/* Entity Selection based on type */}
                      {row.entityType && (
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                          value={row.assignedTo}
                          onChange={(e) => {
                            const updatedRows = [...productRows];
                            const targetIndex = row.isRemaining ? row.originalRowIndex : row.displayIndex;
                            updatedRows[targetIndex].assignedTo = e.target.value;

                            // Automatically set tape color and location details based on selected entity
                            if (row.entityType === 'farmer') {
                              const selectedFarmer = assignmentOptions.farmers.find(farmer => farmer.farmer_name === e.target.value);
                              if (selectedFarmer) {
                                updatedRows[targetIndex].tapeType = selectedFarmer.tape_color || '';

                                // Update delivery route with farmer's address details
                                const routeIndex = deliveryRoutes.findIndex(route => route.sourceId === `farmer-${selectedFarmer.fid}`);
                                if (routeIndex === -1) {
                                  // Add new delivery route if not exists
                                  const newRoute = {
                                    sourceId: `farmer-${selectedFarmer.fid}`,
                                    location: selectedFarmer.farmer_name,
                                    address: `${selectedFarmer.address}, ${selectedFarmer.city}, ${selectedFarmer.state} - ${selectedFarmer.pin_code}`,
                                    products: `${row.product_name || row.product} (${row.net_weight}kg)`,
                                    distance: '5.2 km', // This would typically come from a distance calculation API
                                    deliveryType: 'Collection Delivery',
                                    assignedDriver: '',
                                  };
                                  setDeliveryRoutes(prev => [...prev, newRoute]);
                                } else {
                                  // Update existing route with product information
                                  const updatedRoutes = [...deliveryRoutes];
                                  const existingProducts = updatedRoutes[routeIndex].products || '';
                                  const newProductInfo = `${row.product_name || row.product} (${row.net_weight}kg)`;
                                  updatedRoutes[routeIndex].products = existingProducts ? 
                                    `${existingProducts}\n${newProductInfo}` : newProductInfo;
                                  setDeliveryRoutes(updatedRoutes);
                                }
                              }
                            } else if (row.entityType === 'supplier') {
                              const selectedSupplier = assignmentOptions.suppliers.find(supplier => supplier.supplier_name === e.target.value);
                              if (selectedSupplier) {
                                updatedRows[targetIndex].tapeType = selectedSupplier.tape_color || '';

                                // Update delivery route with supplier's address details
                                const routeIndex = deliveryRoutes.findIndex(route => route.sourceId === `supplier-${selectedSupplier.sid}`);
                                if (routeIndex === -1) {
                                  // Add new delivery route if not exists
                                  const newRoute = {
                                    sourceId: `supplier-${selectedSupplier.sid}`,
                                    location: selectedSupplier.supplier_name,
                                    address: `${selectedSupplier.address}, ${selectedSupplier.city}, ${selectedSupplier.state} - ${selectedSupplier.pin_code}`,
                                    products: `${row.product_name || row.product} (${row.net_weight}kg)`,
                                    distance: '5.2 km', // This would typically come from a distance calculation API
                                    deliveryType: 'Collection Delivery',
                                    assignedDriver: '',
                                  };
                                  setDeliveryRoutes(prev => [...prev, newRoute]);
                                } else {
                                  // Update existing route with product information
                                  const updatedRoutes = [...deliveryRoutes];
                                  const existingProducts = updatedRoutes[routeIndex].products || '';
                                  const newProductInfo = `${row.product_name || row.product} (${row.net_weight}kg)`;
                                  updatedRoutes[routeIndex].products = existingProducts ? 
                                    `${existingProducts}\n${newProductInfo}` : newProductInfo;
                                  setDeliveryRoutes(updatedRoutes);
                                }
                              }
                            } else if (row.entityType === 'thirdParty') {
                              const selectedThirdParty = assignmentOptions.thirdParties.find(thirdParty => thirdParty.third_party_name === e.target.value);
                              if (selectedThirdParty) {
                                updatedRows[targetIndex].tapeType = selectedThirdParty.tape_color || '';

                                // Update delivery route with third party's address details
                                const routeIndex = deliveryRoutes.findIndex(route => route.sourceId === `thirdParty-${selectedThirdParty.tpid}`);
                                if (routeIndex === -1) {
                                  // Add new delivery route if not exists
                                  const newRoute = {
                                    sourceId: `thirdParty-${selectedThirdParty.tpid}`,
                                    location: selectedThirdParty.third_party_name,
                                    address: `${selectedThirdParty.address}, ${selectedThirdParty.city}, ${selectedThirdParty.state} - ${selectedThirdParty.pin_code}`,
                                    products: `${row.product_name || row.product} (${row.net_weight}kg)`,
                                    distance: '5.2 km', // This would typically come from a distance calculation API
                                    deliveryType: 'Collection Delivery',
                                    assignedDriver: '',
                                  };
                                  setDeliveryRoutes(prev => [...prev, newRoute]);
                                } else {
                                  // Update existing route with product information
                                  const updatedRoutes = [...deliveryRoutes];
                                  const existingProducts = updatedRoutes[routeIndex].products || '';
                                  const newProductInfo = `${row.product_name || row.product} (${row.net_weight}kg)`;
                                  updatedRoutes[routeIndex].products = existingProducts ? 
                                    `${existingProducts}\n${newProductInfo}` : newProductInfo;
                                  setDeliveryRoutes(updatedRoutes);
                                }
                              }
                            }

                            setProductRows(updatedRows);
                          }}
                        >
                          <option value="">Select {row.entityType}...</option>
                          {row.entityType === 'farmer' && assignmentOptions.farmers.map(farmer => (
                            <option key={`farmer-${farmer.fid}`} value={farmer.farmer_name}>
                              {farmer.farmer_name}
                            </option>
                          ))}
                          {row.entityType === 'supplier' && assignmentOptions.suppliers.map(supplier => (
                            <option key={`supplier-${supplier.sid}`} value={supplier.supplier_name}>
                              {supplier.supplier_name}
                            </option>
                          ))}
                          {row.entityType === 'thirdParty' && assignmentOptions.thirdParties.map(thirdParty => (
                            <option key={`thirdParty-${thirdParty.tpid}`} value={thirdParty.third_party_name}>
                              {thirdParty.third_party_name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="number"
                      value={row.assignedQty || ''}
                      placeholder="0"
                      onChange={(e) => {
                        const updatedRows = [...productRows];
                        const targetIndex = row.isRemaining ? row.originalRowIndex : row.displayIndex;
                        updatedRows[targetIndex].assignedQty = e.target.value;
                        setProductRows(updatedRows);
                      }}
                      className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="text"
                      value={row.tapeType}
                      placeholder="Tape type"
                      onChange={(e) => {
                        const updatedRows = [...productRows];
                        const targetIndex = row.isRemaining ? row.originalRowIndex : row.displayIndex;
                        updatedRows[targetIndex].tapeType = e.target.value;
                        setProductRows(updatedRows);
                      }}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      readOnly={!!row.assignedTo} // Make readonly when assignedTo is selected
                    />
                  </td>
                  <td className="px-4 py-4">
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      value={row.labour}
                      onChange={(e) => {
                        const updatedRows = [...productRows];
                        const targetIndex = row.isRemaining ? row.originalRowIndex : row.displayIndex;
                        updatedRows[targetIndex].labour = e.target.value;
                        setProductRows(updatedRows);
                      }}
                    >
                      <option value="">Select labour...</option>
                      {renderLabourOptions()}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${row.statusColor}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      {row.canEdit ? (
                        <>
                          <button className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                            Assign
                          </button>
                          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                            Assign
                          </button>
                          <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium hover:bg-yellow-200 transition-colors">
                            Add to Stock
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Product Cards - Mobile */}
        <div className="lg:hidden space-y-4">
          {displayRows.map((row, index) => (
            <div key={row.id} className={`border border-gray-200 rounded-lg p-4 ${row.isRemaining ? 'bg-yellow-50' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {(row.product_name || row.product || 'Not Assigned')?.replace(/^\d+\s*-\s*/, '')}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{row.quantity}</p>
                  {row.isRemaining && (
                    <p className="text-xs text-yellow-700 italic mt-1">
                      Remaining Quantity
                    </p>
                  )}
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${row.statusColor}`}>
                  {row.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Assigned To</label>
                  <div className="space-y-2">
                    {/* Entity Type Selection */}
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      value={row.entityType || ''}
                      onChange={(e) => {
                        const updatedRows = [...productRows];
                        const targetIndex = row.isRemaining ? row.originalRowIndex : row.displayIndex;
                        updatedRows[targetIndex].entityType = e.target.value;
                        updatedRows[targetIndex].assignedTo = ''; // Reset assignedTo when entity type changes
                        setProductRows(updatedRows);
                      }}
                    >
                      <option value="">Select entity type...</option>
                      <option value="farmer">Farmer</option>
                      <option value="supplier">Supplier</option>
                      <option value="thirdParty">Third Party</option>
                    </select>

                    {/* Entity Selection based on type */}
                    {row.entityType && (
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        value={row.assignedTo}
                        onChange={(e) => {
                          const updatedRows = [...productRows];
                          const targetIndex = row.isRemaining ? row.originalRowIndex : row.displayIndex;
                          updatedRows[targetIndex].assignedTo = e.target.value;

                          // Automatically set tape color and location details based on selected entity
                          if (row.entityType === 'farmer') {
                            const selectedFarmer = assignmentOptions.farmers.find(farmer => farmer.farmer_name === e.target.value);
                            if (selectedFarmer) {
                              updatedRows[targetIndex].tapeType = selectedFarmer.tape_color || '';

                              // Update delivery route with farmer's address details
                              const routeIndex = deliveryRoutes.findIndex(route => route.sourceId === `farmer-${selectedFarmer.fid}`);
                              if (routeIndex === -1) {
                                // Add new delivery route if not exists
                                const newRoute = {
                                  sourceId: `farmer-${selectedFarmer.fid}`,
                                  location: selectedFarmer.farmer_name,
                                  address: `${selectedFarmer.address}, ${selectedFarmer.city}, ${selectedFarmer.state} - ${selectedFarmer.pin_code}`,
                                  products: `${row.product_name || row.product} (${row.net_weight}kg)`,
                                  distance: '5.2 km', // This would typically come from a distance calculation API
                                  deliveryType: 'Collection Delivery',
                                  assignedDriver: '',
                                };
                                setDeliveryRoutes(prev => [...prev, newRoute]);
                              } else {
                                // Update existing route with product information
                                const updatedRoutes = [...deliveryRoutes];
                                const existingProducts = updatedRoutes[routeIndex].products || '';
                                const newProductInfo = `${row.product_name || row.product} (${row.net_weight}kg)`;
                                updatedRoutes[routeIndex].products = existingProducts ? 
                                  `${existingProducts}\n${newProductInfo}` : newProductInfo;
                                setDeliveryRoutes(updatedRoutes);
                              }
                            }
                          } else if (row.entityType === 'supplier') {
                            const selectedSupplier = assignmentOptions.suppliers.find(supplier => supplier.supplier_name === e.target.value);
                            if (selectedSupplier) {
                              updatedRows[targetIndex].tapeType = selectedSupplier.tape_color || '';

                              // Update delivery route with supplier's address details
                              const routeIndex = deliveryRoutes.findIndex(route => route.sourceId === `supplier-${selectedSupplier.sid}`);
                              if (routeIndex === -1) {
                                // Add new delivery route if not exists
                                const newRoute = {
                                  sourceId: `supplier-${selectedSupplier.sid}`,
                                  location: selectedSupplier.supplier_name,
                                  address: `${selectedSupplier.address}, ${selectedSupplier.city}, ${selectedSupplier.state} - ${selectedSupplier.pin_code}`,
                                  products: `${row.product_name || row.product} (${row.net_weight}kg)`,
                                  distance: '5.2 km', // This would typically come from a distance calculation API
                                  deliveryType: 'Collection Delivery',
                                  assignedDriver: '',
                                };
                                setDeliveryRoutes(prev => [...prev, newRoute]);
                              } else {
                                // Update existing route with product information
                                const updatedRoutes = [...deliveryRoutes];
                                const existingProducts = updatedRoutes[routeIndex].products || '';
                                const newProductInfo = `${row.product_name || row.product} (${row.net_weight}kg)`;
                                updatedRoutes[routeIndex].products = existingProducts ? 
                                  `${existingProducts}\n${newProductInfo}` : newProductInfo;
                                setDeliveryRoutes(updatedRoutes);
                              }
                            }
                          } else if (row.entityType === 'thirdParty') {
                            const selectedThirdParty = assignmentOptions.thirdParties.find(thirdParty => thirdParty.third_party_name === e.target.value);
                            if (selectedThirdParty) {
                              updatedRows[targetIndex].tapeType = selectedThirdParty.tape_color || '';

                              // Update delivery route with third party's address details
                              const routeIndex = deliveryRoutes.findIndex(route => route.sourceId === `thirdParty-${selectedThirdParty.tpid}`);
                              if (routeIndex === -1) {
                                // Add new delivery route if not exists
                                const newRoute = {
                                  sourceId: `thirdParty-${selectedThirdParty.tpid}`,
                                  location: selectedThirdParty.third_party_name,
                                  address: `${selectedThirdParty.address}, ${selectedThirdParty.city}, ${selectedThirdParty.state} - ${selectedThirdParty.pin_code}`,
                                  products: `${row.product_name || row.product} (${row.net_weight}kg)`,
                                  distance: '5.2 km', // This would typically come from a distance calculation API
                                  deliveryType: 'Collection Delivery',
                                  assignedDriver: '',
                                };
                                setDeliveryRoutes(prev => [...prev, newRoute]);
                              } else {
                                // Update existing route with product information
                                const updatedRoutes = [...deliveryRoutes];
                                const existingProducts = updatedRoutes[routeIndex].products || '';
                                const newProductInfo = `${row.product_name || row.product} (${row.net_weight}kg)`;
                                updatedRoutes[routeIndex].products = existingProducts ? 
                                  `${existingProducts}\n${newProductInfo}` : newProductInfo;
                                setDeliveryRoutes(updatedRoutes);
                              }
                            }
                          }

                          setProductRows(updatedRows);
                        }}
                      >
                        <option value="">Select {row.entityType}...</option>
                        {row.entityType === 'farmer' && assignmentOptions.farmers.map(farmer => (
                          <option key={`farmer-${farmer.fid}`} value={farmer.farmer_name}>
                            {farmer.farmer_name}
                          </option>
                        ))}
                        {row.entityType === 'supplier' && assignmentOptions.suppliers.map(supplier => (
                          <option key={`supplier-${supplier.sid}`} value={supplier.supplier_name}>
                            {supplier.supplier_name}
                          </option>
                        ))}
                        {row.entityType === 'thirdParty' && assignmentOptions.thirdParties.map(thirdParty => (
                          <option key={`thirdParty-${thirdParty.tpid}`} value={thirdParty.third_party_name}>
                            {thirdParty.third_party_name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Assigned Qty</label>
                    <input
                      type="number"
                      value={row.assignedQty || ''}
                      placeholder="0"
                      onChange={(e) => {
                        const updatedRows = [...productRows];
                        const targetIndex = row.isRemaining ? row.originalRowIndex : row.displayIndex;
                        updatedRows[targetIndex].assignedQty = e.target.value;
                        setProductRows(updatedRows);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 block mb-1">Tape Type</label>
                    <input
                      type="text"
                      value={row.tapeType}
                      placeholder="Type"
                      onChange={(e) => {
                        const updatedRows = [...productRows];
                        const targetIndex = row.isRemaining ? row.originalRowIndex : row.displayIndex;
                        updatedRows[targetIndex].tapeType = e.target.value;
                        setProductRows(updatedRows);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      readOnly={!!row.assignedTo} // Make readonly when assignedTo is selected
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Labour</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={row.labour}
                    onChange={(e) => {
                      const updatedRows = [...productRows];
                      const targetIndex = row.isRemaining ? row.originalRowIndex : row.displayIndex;
                      updatedRows[targetIndex].labour = e.target.value;
                      setProductRows(updatedRows);
                    }}
                  >
                    <option value="">Select labour...</option>
                    {renderLabourOptions()}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium">
                  Assign
                </button>
                {row.canEdit ? (
                  <>
                    <button className="p-2 border border-emerald-600 text-emerald-600 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-red-600 text-red-600 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <button className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium">
                    Add to Stock
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery Routes Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Delivery Routes to Packaging Location</h2>
        <p className="text-sm text-gray-600 mb-4">Assign separate drivers for each farmer/supplier location</p>

        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-2 block">Packaging Destination</label>
          <div className="flex items-center gap-3 p-4 border-2 border-emerald-600 rounded-lg bg-emerald-50">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <span className="text-sm font-medium text-emerald-900">Central Packaging Warehouse, Industrial Area</span>
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-4">Driver Assignment & Delivery Routes</h3>
        <p className="text-sm text-gray-600 mb-4">Assign separate drivers for each farmer/supplier location to deliver to packaging</p>

        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pickup From</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Products</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Distance</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Delivery Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Assigned Driver</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Pickup Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {deliveryRoutes.map((route, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-gray-900">{route.location}</p>
                    <p className="text-xs text-gray-500">{route.address}</p>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm text-gray-900 whitespace-pre-line">{route.products}</p>
                  </td>
                  <td className="px-4 py-4">
                    <span className="text-sm text-gray-900">{route.distance}</span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="relative">
                      <select
                        className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        value={route.deliveryType}
                        onChange={(e) => {
                          const updatedRoutes = [...deliveryRoutes];
                          updatedRoutes[index].deliveryType = e.target.value;
                          setDeliveryRoutes(updatedRoutes);
                        }}
                      >
                        <option value="Collection Delivery">Local Pickups</option>
                        <option value="Airport Delivery">Line Airport</option>
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <select
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                      value={route.driver}
                      onChange={(e) => {
                        const updatedRoutes = [...deliveryRoutes];
                        updatedRoutes[index].driver = e.target.value;
                        setDeliveryRoutes(updatedRoutes);
                      }}
                    >
                      <option value="">Select driver...</option>
                      {assignmentOptions.drivers && assignmentOptions.drivers.map(driver => (
                        <option key={`driver-${driver.did}`} value={`${driver.driver_name} - ${driver.driver_id}`}>
                          {driver.driver_name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-4">
                    <input
                      type="date"
                      value={route.pickupDate}
                      onChange={(e) => {
                        const updatedRoutes = [...deliveryRoutes];
                        updatedRoutes[index].pickupDate = e.target.value;
                        setDeliveryRoutes(updatedRoutes);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    />
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button className="px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium hover:bg-emerald-50 transition-colors">
                        Assign
                      </button>
                      {route.isAssigned && (
                        <>
                          <button className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-4">
          {deliveryRoutes.map((route, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-900">{route.location}</p>
                <p className="text-xs text-gray-500 mt-1">{route.address}</p>
                <p className="text-sm text-gray-700 mt-2">{route.products}</p>
                <p className="text-xs text-gray-500 mt-1">Distance: {route.distance}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Delivery Type</label>
                  <div className="relative">
                    <select
                      className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg text-sm"
                      value={route.deliveryType}
                      onChange={(e) => {
                        const updatedRoutes = [...deliveryRoutes];
                        updatedRoutes[index].deliveryType = e.target.value;
                        setDeliveryRoutes(updatedRoutes);
                      }}
                    >
                      <option value="Collection Delivery">Collection Delivery</option>
                      <option value="Airport Delivery">Airport Delivery</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Assigned Driver</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    value={route.driver}
                    onChange={(e) => {
                      const updatedRoutes = [...deliveryRoutes];
                      updatedRoutes[index].driver = e.target.value;
                      setDeliveryRoutes(updatedRoutes);
                    }}
                  >
                    <option value="">Select driver...</option>
                    {assignmentOptions.drivers && assignmentOptions.drivers.map(driver => (
                      <option key={`driver-${driver.did}`} value={`${driver.driver_name} - ${driver.driver_id}`}>
                        {driver.driver_name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Pickup Date</label>
                  <input
                    type="text"
                    value={route.pickupDate}
                    placeholder="dd/mm/yyyy"
                    onChange={(e) => {
                      const updatedRoutes = [...deliveryRoutes];
                      updatedRoutes[index].pickupDate = e.target.value;
                      setDeliveryRoutes(updatedRoutes);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <button className="flex-1 px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg text-sm font-medium">
                  Assign
                </button>
                {route.isAssigned && (
                  <>
                    <button className="p-2 border border-emerald-600 text-emerald-600 rounded-lg">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 border border-red-600 text-red-600 rounded-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3">
        <button className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSaveStage1}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium shadow-sm hover:bg-emerald-700 transition-colors"
        >
          Save Stage 1
        </button>
      </div>
    </div>
  );
};

export default OrderAssignCreateStage1;