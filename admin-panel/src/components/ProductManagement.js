import React, { useState, useEffect } from 'react';
import './ProductManagement.css';
import { productAPI, categoryAPI } from '../services/api';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    description: '',
    stock: '',
    image: ''
  });

  // Fetch products and categories
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Error fetching products: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data.data);
      
      // If no categories exist, create default ones
      if (response.data.data.length === 0) {
        await createDefaultCategories();
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const createDefaultCategories = async () => {
    const defaultCategories = [
      { name: 'Electronics', description: 'Electronic products' },
      { name: 'Clothing', description: 'Clothing and apparel' },
      { name: 'Food', description: 'Food items' },
      { name: 'Books', description: 'Books and literature' }
    ];

    for (const cat of defaultCategories) {
      try {
        await categoryAPI.create(cat);
      } catch (error) {
        console.error('Error creating default category:', error);
      }
    }
    
    // Refresh categories
    const response = await categoryAPI.getAll();
    setCategories(response.data.data);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const productData = {
        name: formData.name,
        categoryId: formData.categoryId,
        price: parseFloat(formData.price),
        description: formData.description,
        stock: parseInt(formData.stock) || 0,
        image: formData.image
      };

      if (editingProduct) {
        // Update existing product
        await productAPI.update(editingProduct._id, productData);
        alert('Product updated successfully!');
      } else {
        // Create new product
        await productAPI.create(productData);
        alert('Product created successfully!');
      }

      // Reset form and refresh products
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      categoryId: product.categoryId._id || product.categoryId,
      price: product.price.toString(),
      description: product.description || '',
      stock: product.stock.toString(),
      image: product.image || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setLoading(true);
      await productAPI.delete(id);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error deleting product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      price: '',
      description: '',
      stock: '',
      image: ''
    });
    setEditingProduct(null);
    setShowModal(false);
  };

  const openAddModal = () => {
    resetForm();
    setShowModal(true);
  };

  return (
    <div className="product-management">
      <div className="header-actions">
        <h2>Products</h2>
        <button className="btn btn-primary" onClick={openAddModal}>
          + Add New Product
        </button>
      </div>

      {loading && products.length === 0 ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">No products found. Add your first product!</td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id.substring(0, 8)}...</td>
                    <td>{product.name}</td>
                    <td>{product.categoryId?.name || 'N/A'}</td>
                    <td>${product.price}</td>
                    <td>{product.stock}</td>
                    <td className="description-cell">{product.description || 'N/A'}</td>
                    <td>
                      <button 
                        className="btn btn-edit" 
                        onClick={() => handleEdit(product)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-delete" 
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Add/Edit Product */}
      {showModal && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
              <button className="close-btn" onClick={resetForm}>×</button>
            </div>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-cancel" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-submit" disabled={loading}>
                  {loading ? 'Saving...' : editingProduct ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;


