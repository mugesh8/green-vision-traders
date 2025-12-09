import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { createOrder, createDraft, getDraftById, updateDraft, deleteDraft, getOrderById, updateOrder } from '../../../api/orderApi'; // Import the order and draft APIs
import { getAllProducts } from '../../../api/productApi'; // Import the product API

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
      numBoxes: '', // This will store only the numeric value
      packingType: '',
      netWeight: '',
      grossWeight: '',
      boxWeight: '',
      marketPrice: '',
      totalAmount: '',
    },
  ]);

  const [allProducts, setAllProducts] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState({});
  const [suggestionValue, setSuggestionValue] = useState({});
  const suggestionsRef = useRef(null);
  const [showProductSuggestions, setShowProductSuggestions] = useState({});
  const [productSuggestionValue, setProductSuggestionValue] = useState({});
  const productSuggestionsRef = useRef(null);
  const [draftId, setDraftId] = useState(null); // Track current draft ID
  const [orderId, setOrderId] = useState(null); // Track current order ID for editing

  // Helper function to format number of boxes/bags with units for display
  const formatNumBoxes = (value, packingType) => {
    if (value === null || value === undefined || value === "") return "";

    const num = parseFloat(value);
    if (isNaN(num)) return "";

    // Convert 1.00 → 1, 2.00 → 2
    const cleanNum = num % 1 === 0 ? parseInt(num) : num;

    if (packingType) {
      const lowerPacking = packingType.toLowerCase();

      if (lowerPacking.includes("box")) {
        return cleanNum === 1 ? `${cleanNum} box` : `${cleanNum} boxes`;
      }

      if (lowerPacking.includes("bag")) {
        return cleanNum === 1 ? `${cleanNum} bag` : `${cleanNum} bags`;
      }
    }

    return cleanNum.toString();
  };

  // Helper function to format number of boxes/bags for API (without spaces and lowercase)
  const formatNumBoxesForAPI = (value, packingType) => {
    if (value === null || value === undefined || value === "") return "";

    const num = parseFloat(value);
    if (isNaN(num)) return "";

    // Convert 1.00 → 1, 2.00 → 2
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

  // Helper function to parse numeric value from input
  const parseNumBoxes = (value) => {
    if (!value) return "";
  
    // Remove words
    const cleaned = value.replace(/boxes|box|bags|bag/gi, "").trim();
  
    const num = parseFloat(cleaned);
    return isNaN(num) ? "" : num;
  };

  // Load draft or order from backend on component mount
  useEffect(() => {
    // Check if we're loading a specific draft or order
    const urlParams = new URLSearchParams(window.location.search);
    const draftIdFromUrl = urlParams.get('draftId');
    const orderIdFromUrl = urlParams.get('orderId');
    
    if (draftIdFromUrl) {
      // Load the specific draft
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
            
            // Load products from draft_data
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
      // Load the specific order for editing
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
            
            // Load products from order items
            const orderItems = order.items || [];
            const formattedProducts = orderItems.map((item, index) => ({
              id: index + 1,
              productId: item.product_id || item.product?.split(' - ')[0] || '', // Extract product ID from "1 - Carrot"
              productName: item.product || `${item.product_id} - ${item.product_name}` || '', // Use the product field if available
              numBoxes: item.num_boxes || '',
              packingType: item.packing_type || '',
              netWeight: item.net_weight || '',
              grossWeight: item.gross_weight || '',
              boxWeight: item.box_weight || '',
              marketPrice: item.market_price || '',
              totalAmount: item.total_price || '',
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

  // Fetch all products when component mounts
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

  // Close suggestions when clicking outside
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

  // Close product suggestions when clicking outside
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
            // Check if the value matches a product exactly
            const matchingProduct = allProducts.find(p =>
              `${p.pid} - ${p.product_name}`.toLowerCase() === value.toLowerCase() ||
              p.product_name.toLowerCase() === value.toLowerCase()
            );

            if (matchingProduct) {
              // If we find an exact match, set the product ID
              updatedProduct.productId = matchingProduct.pid.toString();
              updatedProduct.productName = `${matchingProduct.pid} - ${matchingProduct.product_name}`;
              updatedProduct.marketPrice = matchingProduct.current_price || 0;
            }

            // Show suggestions if there's text
            if (value.length > 0) {
              setShowProductSuggestions(prev => ({ ...prev, [id]: true }));
              setProductSuggestionValue(prev => ({ ...prev, [id]: value }));
            } else {
              setShowProductSuggestions(prev => ({ ...prev, [id]: false }));
            }
          }

          // Extract numeric value from packing type (e.g., "30kg" -> 30)
          const getPackingWeight = (packingType) => {
            if (!packingType) return 0;
            // Match patterns like "30kg", "30 kg", "30", etc.
            const match = packingType.match(/(\d+(?:\.\d+)?)\s*(?:kg)?/i);
            return match ? parseFloat(match[1]) : 0;
          };

          // Handle packing type suggestions
          if (field === 'packingType') {
            const numericMatch = value.match(/^(\d+(?:\.\d+)?)$/);
            if (numericMatch) {
              setShowSuggestions(prev => ({ ...prev, [id]: true }));
              setSuggestionValue(prev => ({ ...prev, [id]: numericMatch[1] }));
            } else {
              setShowSuggestions(prev => ({ ...prev, [id]: false }));
            }
          }

          // Perform calculations when relevant fields change
          if (field === 'netWeight' || field === 'packingType') {
            const netWeight = parseFloat(updatedProduct.netWeight) || 0;
            const packingWeight = getPackingWeight(updatedProduct.packingType);

            // Calculate number of boxes: Number of Boxes = Net Weight ÷ Packing Weight
            if (packingWeight > 0) {
              updatedProduct.numBoxes = (netWeight / packingWeight).toFixed(2);
            } else {
              updatedProduct.numBoxes = '';
            }

            // Recalculate other values
            const numBoxes = parseFloat(updatedProduct.numBoxes) || 0;

            // Total Box Weight = Number of Boxes * Packing Weight
            const totalBoxWeight = numBoxes * packingWeight;
            updatedProduct.boxWeight = packingWeight.toFixed(2);

            // Gross Weight = Net Weight + Total Box Weight
            updatedProduct.grossWeight = (netWeight + totalBoxWeight).toFixed(2);
          }

          // When gross weight changes, recalculate net weight
          if (field === 'grossWeight') {
            const grossWeight = parseFloat(updatedProduct.grossWeight) || 0;
            const packingWeight = getPackingWeight(updatedProduct.packingType);
            const numBoxes = parseFloat(updatedProduct.numBoxes) || 0;

            // Total Box Weight = Number of Boxes * Packing Weight
            const totalBoxWeight = numBoxes * packingWeight;

            // Net Weight = Gross Weight - Total Box Weight
            updatedProduct.netWeight = (grossWeight - totalBoxWeight).toFixed(2);
          }

          // When number of boxes changes, recalculate weights
          if (field === 'numBoxes') {
            // Parse the input to get the numeric value
            const numBoxesValue = parseFloat(value) || 0;
            // Store only the numeric value in state
            updatedProduct.numBoxes = numBoxesValue.toFixed(2);

            const packingWeight = getPackingWeight(updatedProduct.packingType);

            // Total Box Weight = Number of Boxes * Packing Weight
            const totalBoxWeight = numBoxesValue * packingWeight;
            updatedProduct.boxWeight = packingWeight.toFixed(2);

            // If net weight exists, recalculate gross weight
            const netWeight = parseFloat(updatedProduct.netWeight) || 0;
            updatedProduct.grossWeight = (netWeight + totalBoxWeight).toFixed(2);
          }

          // When box weight is manually changed, recalculate gross weight
          if (field === 'boxWeight') {
            const boxWeight = parseFloat(updatedProduct.boxWeight) || 0;
            const numBoxes = parseFloat(updatedProduct.numBoxes) || 0;
            const netWeight = parseFloat(updatedProduct.netWeight) || 0;

            // Gross Weight = Net Weight + (Box Weight * Number of Boxes)
            const totalBoxWeight = boxWeight * numBoxes;
            updatedProduct.grossWeight = (netWeight + totalBoxWeight).toFixed(2);
          }

          // Calculate total amount when net weight or market price changes
          if (field === 'netWeight' || field === 'marketPrice') {
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

    // Validate products - only check if essential fields are filled
    const invalidProducts = products.filter(product => {
      return (
        !product.productId ||
        !product.productName ||
        !product.packingType ||
        product.numBoxes === '' || product.numBoxes === null || product.numBoxes === undefined ||
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

  // Save draft to backend
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

      // reset form
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
          marketPrice: "",
          totalAmount: "",
        },
      ]);

      setDraftId(null);
      setOrderId(null);

      /** ----------------------------
       * SUCCESS CONFIRMATION POPUP
       * ---------------------------- */
      const userChoice = window.confirm(
        orderId
          ? "Order updated successfully!\n\nGo to Orders page?"
          : "Order created successfully!\n\nGo to Orders page?"
      );

      if (userChoice) {
        // OK → navigate
        navigate("/orders");
      }
      // Cancel → Stay on the same page
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
      // Don't clear draft on cancel - it should persist
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
                      No of Boxes/Bags
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
                      <td className="px-4 py-3 relative">
                        <div className="relative" ref={showProductSuggestions[product.id] ? productSuggestionsRef : null}>
                          <input
                            type="text"
                            value={product.productName}
                            onChange={(e) => handleProductChange(product.id, 'productName', e.target.value)}
                            placeholder="Type product name"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                          />
                          {showProductSuggestions[product.id] && allProducts.length > 0 && (
                            <div className="absolute z-[100] mt-1 left-0 w-full min-w-[250px] bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
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
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={formatNumBoxes(product.numBoxes, product.packingType)}
                          onChange={(e) => {
                            const parsedValue = parseNumBoxes(e.target.value);
                            handleProductChange(product.id, 'numBoxes', parsedValue);
                          }}
                          placeholder={product.packingType ?
                            (product.packingType.toLowerCase().includes('box') ? 'e.g., 1 box' :
                              product.packingType.toLowerCase().includes('bag') ? 'e.g., 1 bag' : '0')
                            : '0'}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3 relative">
                        <div className="relative" ref={showSuggestions[product.id] ? suggestionsRef : null}>
                          <input
                            type="text"
                            value={product.packingType}
                            onChange={(e) =>
                              handleProductChange(product.id, 'packingType', e.target.value)
                            }
                            placeholder="e.g., 30kg Box"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                          />
                          {showSuggestions[product.id] && (
                            <div className="absolute z-[100] mt-1 left-0 w-full min-w-[180px] bg-white border border-gray-300 rounded-lg shadow-lg">
                              <button
                                type="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                                onClick={() => selectSuggestion(product.id, `${suggestionValue[product.id]}kg Box`)}
                              >
                                {suggestionValue[product.id]}kg Box
                              </button>
                              <button
                                type="button"
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
                                onClick={() => selectSuggestion(product.id, `${suggestionValue[product.id]}kg Bag`)}
                              >
                                {suggestionValue[product.id]}kg Bag
                              </button>
                            </div>
                          )}
                        </div>
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
                          onChange={(e) =>
                            handleProductChange(product.id, 'totalAmount', e.target.value)
                          }
                          placeholder="0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
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