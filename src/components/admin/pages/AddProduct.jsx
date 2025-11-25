import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import { createCategory, getAllCategories, updateCategory, deleteCategory } from '../../../api/categoryApi';
import { createProduct, getAllProducts, updateProduct, deleteProduct } from '../../../api/productApi';

const AddProduct = () => {
  const [activeTab, setActiveTab] = useState('product');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [deletingIndex, setDeletingIndex] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [vegetables, setVegetables] = useState([]);

  const getStatusColor = (status) => {
    return status === 'Active' 
      ? 'bg-[#4ED39A] text-white' 
      : 'bg-yellow-500 text-white';
  };

  const handleEdit = (index) => {
    setEditingIndex(index);
    setEditFormData({ ...vegetables[index] });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      await updateProduct(vegetables[editingIndex].pid, formData);
      alert('Product updated successfully!');
      setShowEditModal(false);
      fetchProducts();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryEdit = (index) => {
    setEditingIndex(index);
    setEditFormData({ ...categories[index] });
    setShowEditModal(true);
  };

  const handleCategoryEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      await updateCategory(categories[editingIndex].cid, formData);
      alert('Category updated successfully!');
      setShowEditModal(false);
      fetchCategories();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update category');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (index) => {
    setDeletingIndex(index);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (activeTab === 'product') {
      try {
        await deleteProduct(vegetables[deletingIndex].pid);
        alert('Product deleted successfully!');
        setShowDeleteModal(false);
        setDeletingIndex(null);
        fetchProducts();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete product');
        setShowDeleteModal(false);
      }
    } else {
      try {
        await deleteCategory(categories[deletingIndex].cid);
        alert('Category deleted successfully!');
        setShowDeleteModal(false);
        setDeletingIndex(null);
        fetchCategories();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete category');
        setShowDeleteModal(false);
      }
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories(1, 100);
      setCategories(response.data || []);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts(currentPage, 10);
      const products = response.data || [];
      const productsWithCategory = products.map(product => {
        return { ...product, categoryName: product.category?.categoryname || 'N/A' };
      });
      setVegetables(productsWithCategory);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    if (activeTab === 'product') {
      fetchProducts();
    }
  }, [activeTab, currentPage]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.target);
      if (activeTab === 'category') {
        await createCategory(formData);
        alert('Category created successfully!');
        fetchCategories();
      } else {
        await createProduct(formData);
        alert('Product created successfully!');
        fetchProducts();
      }
      setShowAddModal(false);
      e.target.reset();
    } catch (error) {
      alert(error.response?.data?.message || `Failed to create ${activeTab}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6">
          <button 
            onClick={() => setActiveTab('product')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all text-sm ${activeTab === 'product' ? 'bg-[#0D7C66] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            Add Product
          </button>
          <button 
            onClick={() => setActiveTab('category')}
            className={`px-5 py-2.5 rounded-lg font-medium transition-all text-sm ${activeTab === 'category' ? 'bg-[#0D7C66] text-white shadow-md' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
          >
            Add Category
          </button>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#6B8782]" />
            <input
              type="text"
              placeholder="Search vegetables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#F0F4F3] border-none rounded-xl text-[#0D5C4D] placeholder-[#6B8782] focus:outline-none focus:ring-2 focus:ring-[#0D8568] text-sm"
            />
          </div>

          {/* Add Button */}
          <button 
            onClick={() => setShowAddModal(true)}
            className="px-5 py-2.5 bg-[#0D7C66] hover:bg-[#0a6354] text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 shadow-sm text-sm whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            {activeTab === 'product' ? 'Add Product' : 'Add Category'}
          </button>
        </div>

        {/* Product Table */}
        {activeTab === 'product' && (
        <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#D4F4E8]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                    Image
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                    Vegetable Name
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                    Category
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                    Unit
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                    Current Rate (₹/KG)
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {vegetables.map((vegetable, index) => (
                  <tr key={vegetable.pid} className={`border-b border-[#D0E0DB] hover:bg-[#F0F4F3] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F3]/30'}`}>
                    <td className="px-6 py-4">
                      {vegetable.product_image ? (
                        <img src={`http://localhost:8000${vegetable.product_image}`} alt={vegetable.product_name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">No Image</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-[#0D5C4D]">{vegetable.product_name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#0D5C4D]">{vegetable.categoryName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#0D5C4D]">{vegetable.unit}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#0D5C4D]">{vegetable.current_price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-500">
                        {new Date(vegetable.updatedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1 w-fit ${vegetable.product_status === 'active' ? 'bg-[#4ED39A]' : 'bg-yellow-500'} text-white`}>
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        {vegetable.product_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(index)}
                          className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(index)}
                          className="px-4 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
            <div className="text-sm text-[#6B8782]">
              Showing {vegetables.length} products
            </div>

            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
                &lt;
              </button>

              <button className="px-4 py-2 rounded-lg font-medium bg-[#0D8568] text-white">
                1
              </button>

              <button className="px-4 py-2 rounded-lg font-medium text-[#6B8782] hover:bg-[#D0E0DB]">
                2
              </button>

              <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
                ...
              </button>

              <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">
                &gt;
              </button>
            </div>
          </div>
        </div>
        )}

        {/* Category Table */}
        {activeTab === 'category' && (
        <div className="bg-white rounded-2xl overflow-hidden border border-[#D0E0DB]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#D4F4E8]">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Image</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Category Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Description</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-[#0D5C4D]">Action</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.cid} className={`border-b border-[#D0E0DB] hover:bg-[#F0F4F3] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#F0F4F3]/30'}`}>
                    <td className="px-6 py-4">
                      {category.category_image ? (
                        <img src={`http://localhost:8000${category.category_image}`} alt={category.categoryname} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 text-xs">No Image</div>
                      )}
                    </td>
                    <td className="px-6 py-4 font-semibold text-[#0D5C4D]">{category.categoryname}</td>
                    <td className="px-6 py-4 text-sm text-[#0D5C4D]">{category.categorydescription}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${category.category_status === 'active' ? 'bg-[#4ED39A]' : 'bg-yellow-500'} text-white flex items-center gap-1 w-fit`}>
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        {category.category_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleCategoryEdit(index)}
                          className="px-4 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-gray-50 transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(index)}
                          className="px-4 py-1.5 bg-red-100 text-red-700 rounded-lg text-xs font-medium hover:bg-red-200 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-6 py-4 bg-[#F0F4F3] border-t border-[#D0E0DB]">
            <div className="text-sm text-[#6B8782]">Showing {categories.length} categories</div>
            <div className="flex items-center gap-2">
              <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">&lt;</button>
              <button className="px-4 py-2 rounded-lg font-medium bg-[#0D8568] text-white">1</button>
              <button className="px-3 py-2 text-[#6B8782] hover:bg-[#D0E0DB] rounded-lg transition-colors">&gt;</button>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0D5C4D]">{activeTab === 'product' ? 'Add Product' : 'Add Category'}</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {activeTab === 'category' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                    <input type="text" name="categoryname" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea name="categorydescription" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm" rows="3"></textarea>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <input type="file" name="category_image" accept="image/*" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select name="category_status" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input type="text" name="product_name" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select name="category_id" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm" required>
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.cid} value={cat.cid}>{cat.categoryname}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <input type="file" name="product_image" accept="image/*" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                    <input type="text" name="unit" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
                    <input type="number" step="0.01" name="current_price" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select name="product_status" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              )}
              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={loading} className="flex-1 px-6 py-2.5 bg-[#0D7C66] hover:bg-[#0a6354] text-white font-semibold rounded-lg transition-colors disabled:opacity-50">
                  {loading ? 'Adding...' : 'Add'}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#0D5C4D]">Edit Product</h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={activeTab === 'product' ? handleEditSubmit : handleCategoryEditSubmit} className="space-y-4">
              {activeTab === 'category' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category Name</label>
                    <input
                      type="text"
                      name="categoryname"
                      value={editFormData.categoryname}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <input
                      type="text"
                      name="categorydescription"
                      value={editFormData.categorydescription}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <input type="file" name="category_image" accept="image/*" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      name="category_status"
                      value={editFormData.category_status}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </>
              ) : (
                <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                <input
                  type="text"
                  name="product_name"
                  value={editFormData.product_name || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category_id"
                  value={editFormData.category_id || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat.cid} value={cat.cid}>{cat.categoryname}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                <input type="file" name="product_image" accept="image/*" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                <input
                  type="text"
                  name="unit"
                  value={editFormData.unit || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Price</label>
                <input
                  type="number"
                  step="0.01"
                  name="current_price"
                  value={editFormData.current_price || ''}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="product_status"
                  value={editFormData.product_status || 'active'}
                  onChange={handleEditChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0D7C66] text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
                </>
              )}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-2.5 bg-[#0D7C66] hover:bg-[#0a6354] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-[#0D5C4D] mb-3">Confirm Delete</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this {activeTab === 'product' ? 'product' : 'category'}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDelete}
                className="flex-1 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddProduct;
