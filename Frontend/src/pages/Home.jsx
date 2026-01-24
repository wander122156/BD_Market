import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import { useSearch } from '../context/SearchContext';
import '../styles/Home.css';

export default function Home() {
  const { products, categories } = useProducts();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { searchQuery } = useSearch();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [sortBy, setSortBy] = useState('default');
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // Calculate max price from products
  useEffect(() => {
    if (products.length > 0) {
      const maxProductPrice = Math.max(...products.map(p => p.price));
      setMaxPrice(Math.ceil(maxProductPrice));
    }
  }, [products]);

  // Shuffle products for random display
  useEffect(() => {
    if (products.length > 0) {
      const shuffled = [...products].sort(() => Math.random() - 0.5);
      setDisplayedProducts(shuffled);
    }
  }, [products]);

  const filteredProducts = displayedProducts.filter((product) => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleMinPriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setMinPrice(value >= 0 ? value : 0);
  };

  const handleMaxPriceChange = (e) => {
    const value = parseFloat(e.target.value) || 0;
    setMaxPrice(value >= 0 ? value : 0);
  };

  const handleMinPriceFocus = (e) => {
    setMinPrice('');
  };

  const handleMaxPriceFocus = (e) => {
    setMaxPrice('');
  };

  return (
    <div className="home">
      <div className="home-layout">
        {/* Left Sidebar - Categories */}
        <aside className="categories-sidebar">
          <h3>Product Categories</h3>
          <div className="categories-list">
            <button
              key="All"
              className={`category-item ${selectedCategory === 'All' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('All')}
            >
              All
            </button>
            {categories
                .filter(cat => cat && typeof cat === 'object' && cat.name !== 'All')
                .map((category) => (
                    <button
                        key={category.id}
                        className={`category-item ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </button>
                ))
            }
          </div>

          {/* Filters */}
          <div className="filters-section">
            <h3>Filters</h3>
            <div className="filter-group">
              <label>Price Range</label>
              <div className="price-inputs">
                <div className="price-input-group">
                  <label htmlFor="min-price">Min ($)</label>
                  <input
                    id="min-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={minPrice || ''}
                    onChange={handleMinPriceChange}
                    onFocus={handleMinPriceFocus}
                    className="price-input"
                    placeholder="0"
                  />
                </div>
                <div className="price-input-group">
                  <label htmlFor="max-price">Max ($)</label>
                  <input
                    id="max-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={maxPrice || ''}
                    onChange={handleMaxPriceChange}
                    onFocus={handleMaxPriceFocus}
                    className="price-input"
                    placeholder="1500"
                  />
                </div>
              </div>
            </div>
            <div className="filter-group">
              <label>Sort By</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="default">Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Name: A to Z</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="home-main">
          {/* Products Grid */}
          <div className="products-section">
            <div className="products-header">
              <h2>
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Products'}
              </h2>
              <p className="results-count">{sortedProducts.length} products found</p>
            </div>
            
            {sortedProducts.length > 0 ? (
              <div className="products-container">
                {sortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No products found. Try adjusting your search or filters.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
