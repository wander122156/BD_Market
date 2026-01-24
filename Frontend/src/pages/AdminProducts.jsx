import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useProducts } from '../context/ProductContext';
import '../styles/AdminProducts.css';

export default function AdminProducts() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { products, addProduct, updateProduct, deleteProduct, categories } = useProducts();
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'Electronics',
    description: '',
    rating: '',
    reviews: '',
    inStock: true,
    deliveryTime: '2-4 hours'
  });

  // Check if user is admin
  if (!user || !user.isAdmin) {
    return (
      <div className="admin-access-denied">
        <h2>Access Denied</h2>
        <p>You must be an administrator to access this page.</p>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      rating: formData.rating ? parseFloat(formData.rating) : 4.0,
      reviews: formData.reviews ? parseInt(formData.reviews) : 0,
      inStock: formData.inStock === 'true' || formData.inStock === true,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }

    resetForm();
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : '',
      image: product.image,
      category: product.category,
      description: product.description,
      rating: product.rating ? product.rating.toString() : '',
      reviews: product.reviews ? product.reviews.toString() : '',
      inStock: product.inStock,
      deliveryTime: product.deliveryTime || '2-4 hours'
    });
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: '',
      originalPrice: '',
      image: '',
      category: 'Electronics',
      description: '',
      rating: '',
      reviews: '',
      inStock: true,
      deliveryTime: '2-4 hours'
    });
    setEditingProduct(null);
    setShowForm(false);
  };

  return (
    <div className="admin-products">
      <div className="admin-products-container">
        <div className="admin-header">
          <h1>Admin Product Management</h1>
          <button className="add-product-btn" onClick={() => { resetForm(); setShowForm(true); }}>
            + Add New Product
          </button>
        </div>

        {showForm && (
          <div className="product-form-container">
            <div className="product-form-card">
              <div className="form-header">
                <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button className="close-btn" onClick={resetForm}>×</button>
              </div>
              <form onSubmit={handleSubmit} className="product-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Product Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      required
                    >
                      {categories.filter(cat => cat !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      required
                      placeholder="79.99"
                    />
                  </div>
                  <div className="form-group">
                    <label>Original Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.originalPrice}
                      onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                      placeholder="99.99 (optional)"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Image URL *</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      required
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div className="form-group">
                    <label>Delivery Time *</label>
                    <input
                      type="text"
                      value={formData.deliveryTime}
                      onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                      required
                      placeholder="2-4 hours"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Rating</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="5"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      placeholder="4.5 (optional)"
                    />
                  </div>
                  <div className="form-group">
                    <label>Number of Reviews</label>
                    <input
                      type="number"
                      min="0"
                      value={formData.reviews}
                      onChange={(e) => setFormData({ ...formData, reviews: e.target.value })}
                      placeholder="234 (optional)"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>In Stock *</label>
                  <select
                    value={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.value === 'true' })}
                    required
                  >
                    <option value={true}>Yes</option>
                    <option value={false}>No</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows="4"
                    placeholder="Enter product description"
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button type="button" onClick={resetForm} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="products-table-container">
          <h2>All Products ({products.length})</h2>
          {products.length === 0 ? (
            <div className="empty-state">
              <p>No products found. Add your first product!</p>
            </div>
          ) : (
            <div className="products-grid">
              {products.map((product) => (
                <div key={product.id} className="product-card-admin">
                  <div className="product-image-admin">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="product-info-admin">
                    <h3>{product.name}</h3>
                    <p className="product-category">{product.category}</p>
                    <p className="product-price">${product.price}</p>
                    {product.originalPrice && (
                      <p className="product-original-price">${product.originalPrice}</p>
                    )}
                    <p className="product-description">{product.description}</p>
                    <div className="product-meta">
                      <span className={product.inStock ? 'in-stock' : 'out-of-stock'}>
                        {product.inStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <span>Rating: {product.rating}</span>
                      <span>{product.reviews} reviews</span>
                    </div>
                  </div>
                  <div className="product-actions-admin">
                    <button onClick={() => handleEdit(product)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
