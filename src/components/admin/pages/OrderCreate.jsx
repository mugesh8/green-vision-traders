import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { createOrder, createDraft, getDraftById, updateDraft, deleteDraft, getOrderById, updateOrder } from '../../../api/orderApi';
import { getAllProducts } from '../../../api/productApi';
import { getBoxesAndBags } from '../../../api/inventoryApi';

const NewOrder = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
    phoneNumber: '',
    order_id: '',
    deliveryAddress: ''
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      productId: '',
      productName: '',
      numBoxes: '',
      packingType: '',
      netWeight: '',
      grossWeight: '',
      boxWeight: '',
      boxCapacity: '',
      marketPrice: '',
      totalAmount: '',
    },
  ]);

  const [allProducts, setAllProducts] = useState([]);
  const [packingOptions, setPackingOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState({});
  const [suggestionValue, setSuggestionValue] = useState({});
  const suggestionsRef = useRef(null);
  const [showProductSuggestions, setShowProductSuggestions] = useState({});
  const [productSuggestionValue, setProductSuggestionValue] = useState({});
  const productSuggestionsRef = useRef(null);
  const [suggestionPosition, setSuggestionPosition] = useState({});
  const inputRefs = useRef({});
  const [draftId, setDraftId] = useState(null);
  const [orderId, setOrderId] = useState(null);

  // Helper function to format number of boxes/bags for API
  const formatNumBoxesForAPI = (value, packingType) => {
    if (value === null || value === undefined || value === "") return "";

    const num = parseFloat(value);
    if (isNaN(num)) return "";

    const cleanNum = num % 1 === 0 ? parseInt(num) : num;

    if (packingType) {
      const lowerPacking = packingType.toLowerCase();

      if (lowerPacking.includes("box")) {
        return cleanNum === 1 ? `${cleanNum}box` : `${cleanNum}boxes`;
      }

      if (lowerPacking.includes("bag")) {
        return cleanNum === 1 ? `${cleanNum}bag` : `${cleanNum}bags`;
      }
    }

    return cleanNum.toString();
  };

  // Load draft or order from backend on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const draftIdFromUrl = urlParams.get('draftId');
    const orderIdFromUrl = urlParams.get('orderId');

    if (draftIdFromUrl) {
      const loadDraft = async () => {
        try {
          const response = await getDraftById(draftIdFromUrl);
          if (response.success && response.data) {
            const draft = response.data;
            setDraftId(draft.did);
            setFormData({
              customerName: draft.customer_name || '',
              customerId: draft.customer_id || '',
              phoneNumber: draft.phone_number || '',
              order_id: '',
              deliveryAddress: draft.delivery_address || ''
            });

            const draftProducts = draft.draft_data?.products || [];
            const formattedProducts = draftProducts.map((product, index) => ({
              id: index + 1,
              productId: product.productId || '',
              productName: product.productName || '',
              numBoxes: product.numBoxes || '',
              packingType: product.packingType || '',
              netWeight: product.netWeight || '',
              grossWeight: product.grossWeight || '',
              boxWeight: product.boxWeight || '',
              boxCapacity: '',
              marketPrice: product.marketPrice || '',
              totalAmount: product.totalAmount || '',
            }));

            setProducts(formattedProducts.length > 0 ? formattedProducts : [{
              id: 1,
              productId: '',
              productName: '',
              numBoxes: '',
              packingType: '',
              netWeight: '',
              grossWeight: '',
              boxWeight: '',
              boxCapacity: '',
              marketPrice: '',
              totalAmount: '',
            }]);
          }
        } catch (error) {
          console.error('Error loading draft:', error);
        }
      };

      loadDraft();
    } else if (orderIdFromUrl) {
      const loadOrder = async () => {
        try {
          const response = await getOrderById(orderIdFromUrl);
          if (response.success && response.data) {
            const order = response.data;
            setOrderId(order.oid);
            setFormData({
              customerName: order.customer_name || '',
              customerId: order.customer_id || '',
              phoneNumber: order.phone_number || '',
              order_id: order.oid || '',
              deliveryAddress: order.delivery_address || ''
            });

            const orderItems = order.items || [];
            const formattedProducts = orderItems.map((item, index) => {
              // Extract numeric value from num_boxes (e.g., "4boxes" -> "4")
              let numBoxes = item.num_boxes || '';
              if (typeof numBoxes === 'string') {
                const match = numBoxes.match(/^(\d+(?:\.\d+)?)/);
                numBoxes = match ? match[1] : '';
              }

              return {
                id: index + 1,
                productId: item.product_id || item.product?.split(' - ')[0] || '',
                productName: item.product || `${item.product_id} - ${item.product_name}` || '',
                numBoxes: numBoxes,
                packingType: item.packing_type || '',
                netWeight: item.net_weight || '',
                grossWeight: item.gross_weight || '',
                boxWeight: item.box_weight || '',
                boxCapacity: '',
                marketPrice: item.market_price || '',
                totalAmount: item.total_price || '',
              };
            });

            setProducts(formattedProducts.length > 0 ? formattedProducts : [{
              id: 1,
              productId: '',
              productName: '',
              numBoxes: '',
              packingType: '',
              netWeight: '',
              grossWeight: '',
              boxWeight: '',
              boxCapacity: '',
              marketPrice: '',
              totalAmount: '',
            }]);
          }
        } catch (error) {
          console.error('Error loading order:', error);
        }
      };

      loadOrder();
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getAllProducts(1, 1000);
        const activeProducts = (response.data || []).filter(p => p.product_status === 'active');
        setAllProducts(activeProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchPackingOptions = async () => {
      try {
        const items = await getBoxesAndBags();
        setPackingOptions(items);
      } catch (error) {
        console.error('Error fetching packing options:', error);
      }
    };

    fetchPackingOptions();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (productSuggestionsRef.current && !productSuggestionsRef.current.contains(event.target)) {
        setShowProductSuggestions({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Extract box capacity from packing type name (e.g., "5kg Box" -> 5)
  const getBoxCapacity = (packingType) => {
    if (!packingType) return 0;
    const match = packingType.match(/(\d+(?:\.\d+)?)\s*kg/i);
    return match ? parseFloat(match[1]) : 0;
  };

  const handleProductChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((product) => {
        if (product.id === id) {
          const updatedProduct = { ...product, [field]: value };

          // When product ID changes, populate product name and market price
          if (field === 'productId') {
            const selectedProduct = allProducts.find(p => p.pid === parseInt(value));
            if (selectedProduct) {
              updatedProduct.productName = `${selectedProduct.pid} - ${selectedProduct.product_name}`;
              updatedProduct.marketPrice = selectedProduct.current_price || 0;
            } else {
              updatedProduct.productName = '';
              updatedProduct.marketPrice = '';
            }
          }

          // Handle product name suggestions
          if (field === 'productName') {
            const matchingProduct = allProducts.find(p =>
              `${p.pid} - ${p.product_name}`.toLowerCase() === value.toLowerCase() ||
              p.product_name.toLowerCase() === value.toLowerCase()
            );

            if (matchingProduct) {
              updatedProduct.productId = matchingProduct.pid.toString();
              updatedProduct.productName = `${matchingProduct.pid} - ${matchingProduct.product_name}`;
              updatedProduct.marketPrice = matchingProduct.current_price || 0;
            }

            if (value.length > 0) {
              const inputEl = inputRefs.current[id];
              if (inputEl) {
                const rect = inputEl.getBoundingClientRect();
                setSuggestionPosition(prev => ({
                  ...prev,
                  [id]: {
                    top: rect.bottom + window.scrollY,
                    left: rect.left + window.scrollX,
                    width: rect.width
                  }
                }));
              }
              setShowProductSuggestions(prev => ({ ...prev, [id]: true }));
              setProductSuggestionValue(prev => ({ ...prev, [id]: value }));
            } else {
              setShowProductSuggestions(prev => ({ ...prev, [id]: false }));
            }
          }

          // When packing type changes, get actual box weight from inventory and calculate net weight
          if (field === 'packingType') {
            const selectedPacking = packingOptions.find(item => item.name === value);

            if (selectedPacking) {
              const actualBoxWeight = parseFloat(selectedPacking.weight) || 0;
              const boxCapacity = getBoxCapacity(selectedPacking.name);

              updatedProduct.boxWeight = actualBoxWeight.toFixed(2);
              updatedProduct.boxCapacity = boxCapacity.toString();

              const numBoxes = parseFloat(updatedProduct.numBoxes) || 0;

              // Calculate net weight from number of boxes if available
              if (boxCapacity > 0 && numBoxes > 0) {
                const calculatedNetWeight = numBoxes * boxCapacity;
                updatedProduct.netWeight = calculatedNetWeight.toFixed(2);
                updatedProduct.grossWeight = (calculatedNetWeight + (numBoxes * actualBoxWeight)).toFixed(2);

                // Calculate total amount
                const marketPrice = parseFloat(updatedProduct.marketPrice) || 0;
                updatedProduct.totalAmount = (calculatedNetWeight * marketPrice).toFixed(2);
              }
            }
          }

          // When net weight changes, calculate numBoxes based on box capacity
          if (field === 'netWeight') {
            const netWeight = parseFloat(updatedProduct.netWeight) || 0;
            const boxWeight = parseFloat(updatedProduct.boxWeight) || 0;
            const boxCapacity = parseFloat(updatedProduct.boxCapacity) || 0;
            const marketPrice = parseFloat(updatedProduct.marketPrice) || 0;

            if (boxCapacity > 0 && netWeight > 0) {
              const numBoxes = netWeight / boxCapacity;
              updatedProduct.numBoxes = numBoxes.toFixed(2);
              updatedProduct.grossWeight = (netWeight + (numBoxes * boxWeight)).toFixed(2);
            }

            updatedProduct.totalAmount = (netWeight * marketPrice).toFixed(2);
          }

          // When number of boxes changes, recalculate net weight based on box capacity
          if (field === 'numBoxes') {
            updatedProduct.numBoxes = value;
            const numBoxes = parseFloat(value) || 0;
            const boxWeight = parseFloat(updatedProduct.boxWeight) || 0;
            const boxCapacity = parseFloat(updatedProduct.boxCapacity) || 0;
            const marketPrice = parseFloat(updatedProduct.marketPrice) || 0;

            // Calculate net weight from number of boxes and box capacity
            if (numBoxes > 0 && boxCapacity > 0) {
              const calculatedNetWeight = numBoxes * boxCapacity;
              updatedProduct.netWeight = calculatedNetWeight.toFixed(2);
              updatedProduct.grossWeight = (calculatedNetWeight + (numBoxes * boxWeight)).toFixed(2);

              // Calculate total amount
              updatedProduct.totalAmount = (calculatedNetWeight * marketPrice).toFixed(2);
            } else if (numBoxes > 0 && boxWeight > 0) {
              // If no box capacity, just update gross weight
              const netWeight = parseFloat(updatedProduct.netWeight) || 0;
              updatedProduct.grossWeight = (netWeight + (numBoxes * boxWeight)).toFixed(2);
            }
          }

          // When gross weight changes, recalculate net weight
          if (field === 'grossWeight') {
            const grossWeight = parseFloat(updatedProduct.grossWeight) || 0;
            const boxWeight = parseFloat(updatedProduct.boxWeight) || 0;
            const numBoxes = parseFloat(updatedProduct.numBoxes) || 0;

            // Total Box Weight = Number of Boxes * Box Weight
            const totalBoxWeight = numBoxes * boxWeight;

            // Net Weight = Gross Weight - Total Box Weight
            const netWeight = (grossWeight - totalBoxWeight);
            updatedProduct.netWeight = netWeight.toFixed(2);

            // Recalculate total amount
            const marketPrice = parseFloat(updatedProduct.marketPrice) || 0;
            updatedProduct.totalAmount = (netWeight * marketPrice).toFixed(2);
          }

          // When market price changes, recalculate total amount
          if (field === 'marketPrice') {
            const netWeight = parseFloat(updatedProduct.netWeight) || 0;
            const marketPrice = parseFloat(updatedProduct.marketPrice) || 0;
            updatedProduct.totalAmount = (netWeight * marketPrice).toFixed(2);
          }

          return updatedProduct;
        }
        return product;
      })
    );
  };

  const selectSuggestion = (id, value) => {
    handleProductChange(id, 'packingType', value);
    setShowSuggestions(prev => ({ ...prev, [id]: false }));
  };

  const selectProductSuggestion = (id, product) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const netWeight = parseFloat(p.netWeight) || 0;
          const marketPrice = product.current_price || 0;
          const totalAmount = (netWeight * marketPrice).toFixed(2);

          return {
            ...p,
            productId: product.pid.toString(),
            productName: `${product.pid} - ${product.product_name}`,
            marketPrice: marketPrice.toString(),
            totalAmount: totalAmount
          };
        }
        return p;
      })
    );
    setShowProductSuggestions(prev => ({ ...prev, [id]: false }));
  };

  const addProduct = () => {
    const newProduct = {
      id: products.length + 1,
      productId: '',
      productName: '',
      numBoxes: '',
      packingType: '',
      netWeight: '',
      grossWeight: '',
      boxWeight: '',
      boxCapacity: '',
      marketPrice: '',
      totalAmount: '',
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }

    if (!formData.deliveryAddress.trim()) {
      newErrors.deliveryAddress = 'Delivery address is required';
    }

    const invalidProducts = products.filter(product => {
      return (
        !product.productId ||
        !product.productName ||
        !product.packingType ||
        product.netWeight === '' || product.netWeight === null || product.netWeight === undefined ||
        product.marketPrice === '' || product.marketPrice === null || product.marketPrice === undefined
      );
    });

    if (invalidProducts.length > 0) {
      newErrors.products = 'Please select products from the dropdown. Type the product name and click on a suggestion.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveDraft = async () => {
    try {
      const draftData = {
        customerName: formData.customerName,
        customerId: formData.customerId || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        deliveryAddress: formData.deliveryAddress,
        products: products.map(product => {
          let numBoxesValue = product.numBoxes;

          if (typeof numBoxesValue === 'string') {
            const match = numBoxesValue.match(/^(\d+(?:\.\d+)?)/);
            numBoxesValue = match ? match[1] : '0';
          }

          const numBoxesNumeric = parseFloat(numBoxesValue) || 0;

          return {
            productId: parseInt(product.productId),
            productName: product.productName,
            numBoxes: formatNumBoxesForAPI(numBoxesNumeric, product.packingType),
            packingType: product.packingType,
            netWeight: product.netWeight.toString(),
            grossWeight: product.grossWeight.toString(),
            boxWeight: product.boxWeight.toString(),
            marketPrice: parseFloat(product.marketPrice),
            totalAmount: parseFloat(product.totalAmount) || 0
          };
        })
      };

      let response;
      if (draftId) {
        response = await updateDraft(draftId, draftData);
      } else {
        response = await createDraft(draftData);
      }

      if (response.success) {
        setDraftId(response.data.did);

        const userChoice = window.confirm(
          "Draft saved successfully!"
        );

        if (userChoice) {
          navigate('/orders?tab=drafts');
        }
      } else {
        alert("Failed to save draft: " + response.message);
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      alert("Failed to save draft. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName: formData.customerName,
        customerId: formData.customerId || undefined,
        phoneNumber: formData.phoneNumber || undefined,
        deliveryAddress: formData.deliveryAddress,
        products: products.map(product => {
          let numBoxesValue = product.numBoxes;

          if (typeof numBoxesValue === 'string') {
            const match = numBoxesValue.match(/^(\d+(?:\.\d+)?)/);
            numBoxesValue = match ? match[1] : '0';
          }

          const numBoxesNumeric = parseFloat(numBoxesValue) || 0;

          return {
            productId: parseInt(product.productId),
            numBoxes: formatNumBoxesForAPI(numBoxesNumeric, product.packingType),
            packingType: product.packingType,
            netWeight: product.netWeight.toString(),
            grossWeight: product.grossWeight.toString(),
            boxWeight: product.boxWeight.toString(),
            marketPrice: parseFloat(product.marketPrice)
          };
        })
      };

      let response;
      if (orderId) {
        response = await updateOrder(orderId, orderData);
      } else {
        response = await createOrder(orderData);
      }

      if (response.success) {
        if (draftId) {
          try {
            await deleteDraft(draftId);
          } catch (error) {
            console.error("Error deleting draft:", error);
          }
        }

        setFormData({
          customerName: "",
          customerId: "",
          phoneNumber: "",
          order_id: "",
          deliveryAddress: ""
        });

        setProducts([
          {
            id: 1,
            productId: "",
            productName: "",
            numBoxes: "",
            packingType: "",
            netWeight: "",
            grossWeight: "",
            boxWeight: "",
            boxCapacity: "",
            marketPrice: "",
            totalAmount: "",
          },
        ]);

        setDraftId(null);
        setOrderId(null);

        const userChoice = window.confirm(
          orderId
            ? "Order updated successfully!\n\nGo to Orders page?"
            : "Order created successfully!\n\nGo to Orders page?"
        );

        if (userChoice) {
          navigate("/orders");
        }
      } else {
        alert(
          (orderId ? "Failed to update order: " : "Failed to create order: ") +
          response.message
        );
      }
    } catch (error) {
      console.error("Error saving order:", error);

      alert(
        (orderId ? "Error updating order: " : "Error creating order: ") +
        error.message
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
      navigate('/orders');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              {orderId ? 'Edit Order' : 'Customer Information'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter customer or store name"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent ${errors.customerName ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder="+91 XXXXX XXXXX"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {errors.phoneNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.phoneNumber}</p>
                )}
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Delivery Details
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Delivery Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleInputChange}
                  placeholder="Enter complete delivery address with landmark"
                  rows="3"
                  className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent resize-none ${errors.deliveryAddress ? 'border-red-500' : 'border-gray-300'
                    }`}
                  required
                />
                {errors.deliveryAddress && (
                  <p className="mt-1 text-sm text-red-500">{errors.deliveryAddress}</p>
                )}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Products
            </h2>
            {errors.products && (
              <p className="mt-2 text-sm text-red-500">{errors.products}</p>
            )}
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full min-w-[1000px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type of Packing
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Box Weight (kg)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Net Weight (kg)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      No of Boxes/Bags
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gross Weight (kg)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Market Price (₹)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Total Amount (₹)
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-100">
                      <td className="px-4 py-3">
                        <input
                          ref={(el) => (inputRefs.current[product.id] = el)}
                          type="text"
                          value={product.productName}
                          onChange={(e) => handleProductChange(product.id, 'productName', e.target.value)}
                          placeholder="Type product name"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                        {showProductSuggestions[product.id] && allProducts.length > 0 && suggestionPosition[product.id] && createPortal(
                          <div
                            ref={productSuggestionsRef}
                            style={{
                              position: 'absolute',
                              top: `${suggestionPosition[product.id].top}px`,
                              left: `${suggestionPosition[product.id].left}px`,
                              width: `${suggestionPosition[product.id].width}px`,
                              minWidth: '250px',
                              zIndex: 9999
                            }}
                            className="mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto"
                          >
                            {allProducts.map((prod) => (
                              <button
                                key={prod.pid}
                                type="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                                onClick={() => selectProductSuggestion(product.id, prod)}
                              >
                                {prod.pid} - {prod.product_name}
                              </button>
                            ))}
                          </div>,
                          document.body
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={product.packingType}
                          onChange={(e) => handleProductChange(product.id, 'packingType', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        >
                          <option value="">Select packing</option>
                          {packingOptions.map((item) => (
                            <option key={item.id} value={item.name}>
                              {item.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={product.boxWeight}
                          onChange={(e) =>
                            handleProductChange(product.id, 'boxWeight', e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={product.netWeight}
                          onChange={(e) =>
                            handleProductChange(product.id, 'netWeight', e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={product.numBoxes}
                          onChange={(e) => handleProductChange(product.id, 'numBoxes', e.target.value)}
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={product.grossWeight}
                          onChange={(e) =>
                            handleProductChange(product.id, 'grossWeight', e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={product.marketPrice}
                          onChange={(e) =>
                            handleProductChange(product.id, 'marketPrice', e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          step="0.01"
                          value={product.totalAmount}
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent bg-gray-50 cursor-not-allowed"
                          readOnly
                        />
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => removeProduct(product.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-150"
                          disabled={products.length === 1}
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="button"
              onClick={addProduct}
              className="mt-4 px-6 py-2.5 border-2 border-[#0D7C66] text-[#0D7C66] rounded-lg hover:bg-[#0D7C66] hover:text-white transition-colors duration-200 font-medium"
            >
              + Add Product
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4">
            <button
              type="button"
              onClick={saveDraft}
              className="px-8 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium"
              disabled={isSubmitting}
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#0D7C66] text-white rounded-lg hover:bg-[#0a6252] transition-colors duration-200 font-medium disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? (orderId ? 'Updating...' : 'Creating...') : (orderId ? 'Update Order' : 'Create Order')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;