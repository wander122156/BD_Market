import { createContext, useContext, useState, useEffect } from 'react';
import { products as initialProducts, categories } from '../data/products';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);

  // Load products from localStorage on mount, or use initial products
  useEffect(() => {
    const savedProducts = localStorage.getItem('products');
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    } else {
      // Initialize with default products if no saved products
      setProducts(initialProducts);
      localStorage.setItem('products', JSON.stringify(initialProducts));
    }
  }, []);

  // Save products to localStorage whenever they change
  useEffect(() => {
    if (products.length > 0) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products]);

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData,
      rating: productData.rating || 4.0,
      reviews: productData.reviews || 0,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      deliveryTime: productData.deliveryTime || '2-4 hours'
    };
    setProducts([...products, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    setProducts(products.map(product =>
      product.id === id ? { ...product, ...updatedData } : product
    ));
  };

  const deleteProduct = (id) => {
    setProducts(products.filter(product => product.id !== id));
  };

  const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
  };

  const getCategories = () => {
    return categories;
  };

  const value = {
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getCategories,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
