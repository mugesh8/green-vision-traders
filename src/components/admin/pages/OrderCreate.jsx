import React, { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';

const NewOrder = () => {
  const [formData, setFormData] = useState({
    customerName: '',
    customerId: '',
    phoneNumber: '',
    email: '',
    alternateContact: '',
    deliveryAddress: '',
    neededByDate: '',
    preferredTime: '',
    priority: 'Normal',
  });

  const [products, setProducts] = useState([
    {
      id: 1,
      productName: '',
      numBoxes: 0,
      packingType: '',
      netWeight: '',
      grossWeight: '',
      marketPrice: '',
    },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProductChange = (id, field, value) => {
    setProducts((prev) =>
      prev.map((product) =>
        product.id === id ? { ...product, [field]: value } : product
      )
    );
  };

  const addProduct = () => {
    const newProduct = {
      id: products.length + 1,
      productName: '',
      numBoxes: 0,
      packingType: '',
      netWeight: '',
      grossWeight: '',
      marketPrice: '',
    };
    setProducts([...products, newProduct]);
  };

  const removeProduct = (id) => {
    if (products.length > 1) {
      setProducts(products.filter((product) => product.id !== id));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);
    console.log('Products:', products);
    // Handle form submission logic here
  };

  const handleCancel = () => {
    // Handle cancel logic (e.g., redirect or reset form)
    console.log('Form cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 ">
              Customer Information
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Customer ID
                </label>
                <input
                  type="text"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleInputChange}
                  placeholder="e.g., CLI-089"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                />
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                  required
                />
              </div>
              <div className="md:col-span-2 lg:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="customer@example.com"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2 lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alternate Contact
                </label>
                <input
                  type="tel"
                  name="alternateContact"
                  value={formData.alternateContact}
                  onChange={handleInputChange}
                  placeholder="Alternate phone number"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 ">
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
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Needed By Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="neededByDate"
                    value={formData.neededByDate}
                    onChange={handleInputChange}
                    placeholder="DD/MM/YYYY"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Delivery Time
                  </label>
                  <div className="relative">
                    <select
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent appearance-none bg-white"
                    >
                      <option value="">Select time slot</option>
                      <option value="morning">Morning (6AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 4PM)</option>
                      <option value="evening">Evening (4PM - 8PM)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <input
                    type="text"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    placeholder="Normal"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 ">
              Products
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      No of Boxes/Bags
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Type of Packing
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Net Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Gross Weight
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Market Price
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
                          type="text"
                          value={product.productName}
                          onChange={(e) =>
                            handleProductChange(product.id, 'productName', e.target.value)
                          }
                          placeholder="Select or type product"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={product.numBoxes}
                          onChange={(e) =>
                            handleProductChange(product.id, 'numBoxes', e.target.value)
                          }
                          placeholder="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="relative">
                          <select
                            value={product.packingType}
                            onChange={(e) =>
                              handleProductChange(product.id, 'packingType', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent appearance-none bg-white"
                          >
                            <option value="">e.g., 30Kg Box</option>
                            <option value="30kg">30Kg Box</option>
                            <option value="20kg">20Kg Box</option>
                            <option value="10kg">10Kg Bag</option>
                          </select>
                          <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={product.netWeight}
                          onChange={(e) =>
                            handleProductChange(product.id, 'netWeight', e.target.value)
                          }
                          placeholder="kg (auto)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={product.grossWeight}
                          onChange={(e) =>
                            handleProductChange(product.id, 'grossWeight', e.target.value)
                          }
                          placeholder="kg (auto)"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={product.marketPrice}
                          onChange={(e) =>
                            handleProductChange(product.id, 'marketPrice', e.target.value)
                          }
                          placeholder="₹0.00"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] focus:border-transparent"
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
              onClick={handleCancel}
              className="px-8 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-2.5 bg-[#0D7C66] text-white rounded-lg hover:bg-[#0a6252] transition-colors duration-200 font-medium"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewOrder;