import {createContext, useContext, useState, useEffect, useCallback} from 'react';

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
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:5064/api';

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/catalog-items`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      console.log('Backend response:', data);

      // Backend может вернуть: data.catalogItems или data.CatalogItems
      let items = data.catalogItems || data.CatalogItems || [];

      if (!Array.isArray(items)) {
        console.error('Items is not an array:', items);
        items = [];
      }

      console.log('Raw items:', items);

      const mappedProducts = items.map(item => ({
        id: item.id,
        name: item.name || 'Unknown Product',
        description: item.description || 'No description available',
        price: parseFloat(item.price) || 0,  // ← Конвертируем в число
        originalPrice: parseFloat(item.price) * 1.2 || 0,  // ← Добавляем 20%
        image: item.pictureUri
            ? `http://localhost:5064${item.pictureUri}`
            : null,
        category: item.catalogTypeId || 1,
        categoryId: item.catalogTypeId,
        brandId: item.catalogBrandId,
        rating: 4.0,
        reviews: 0,
        inStock: true,
        deliveryTime: '2-4 hours'
      }));

      console.log('Mapped products:', mappedProducts);
      setProducts(mappedProducts);

    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/catalog-types`);
      const data = await response.json();
      setCategories(data.catalogTypes || data.CatalogTypes || []);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

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

  const value = {
    products,
    categories,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    fetchProducts, // Чтобы можно было перезагрузить
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
