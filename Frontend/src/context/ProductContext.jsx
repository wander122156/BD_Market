import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCatalogItems, fetchCatalogTypes } from '../api/catalogApi';
import { API_BASE } from '../api/config';

const ProductContext = createContext();

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

function mapCatalogItemToProduct(dto, typeMap) {
  const pictureUri = dto.pictureUri || '';
  const image = pictureUri.startsWith('http') ? pictureUri : `${API_BASE}${pictureUri}`;
  const category = (typeMap && typeMap[dto.catalogTypeId]) || 'General';
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description || '',
    price: Number(dto.price),
    originalPrice: Number(dto.price),
    image,
    category,
    catalogTypeId: dto.catalogTypeId,
    catalogBrandId: dto.catalogBrandId,
    rating: 4,
    reviews: 0,
    inStock: true,
    deliveryTime: '2-4 hours',
  };
}

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['All']);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  const loadProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const [catalogRes, typesRes] = await Promise.all([
        fetchCatalogItems({ pageSize: 500, pageIndex: 0 }),
        fetchCatalogTypes(),
      ]);
      const typeMap = {};
      (typesRes.catalogTypes || []).forEach((t) => { typeMap[t.id] = t.name; });
      setCategories(['All', ...(typesRes.catalogTypes || []).map((t) => t.name)]);
      const list = (catalogRes.catalogItems || []).map((d) => mapCatalogItemToProduct(d, typeMap));
      setProducts(list);
    } catch (e) {
      setProductsError(e.message || 'Ошибка загрузки каталога');
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const addProduct = (productData) => {
    const newProduct = {
      id: Date.now(),
      ...productData,
      rating: productData.rating || 4.0,
      reviews: productData.reviews || 0,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      deliveryTime: productData.deliveryTime || '2-4 hours',
    };
    setProducts((prev) => [...prev, newProduct]);
    return newProduct;
  };

  const updateProduct = (id, updatedData) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === Number(id) ? { ...p, ...updatedData } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== Number(id)));
  };

  const getProductById = (id) => {
    const num = Number(id);
    return products.find((p) => p.id === num);
  };

  const getCategories = () => categories;

  const value = {
    products,
    categories,
    productsLoading,
    productsError,
    refetchProducts: loadProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getCategories,
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
