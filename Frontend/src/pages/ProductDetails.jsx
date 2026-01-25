import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import '../styles/ProductDetails.css';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { user, reviews, addReview } = useUser();
  const product = getProductById(id);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  if (!product) {
    return (
      <div className="product-details">
        <div className="not-found">
          <h2>Product not found</h2>
          <button onClick={() => navigate('/')}>Go to Home</button>
        </div>
      </div>
    );
  }

  const productReviews = reviews.filter(r => r.productId === product.id);
  const averageRating = productReviews.length > 0
    ? productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length
    : product.rating;

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product);
    navigate('/cart');
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    addReview({
      productId: product.id,
      productName: product.name,
      rating: reviewData.rating,
      comment: reviewData.comment
    });
    setReviewData({ rating: 5, comment: '' });
    setShowReviewForm(false);
    alert('Review submitted successfully!');
  };

  return (
    <div className="product-details">
      <div className="product-details-container">
        <div className="product-image-section">
          <img 
            src={product.image} 
            alt={product.name} 
            className="product-detail-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/500x500?text=No+Image';
            }}
          />
          {discount > 0 && <span className="discount-badge-large">-{discount}% OFF</span>}
        </div>

        <div className="product-info-section">
          <h1 className="product-detail-name">{product.name}</h1>
          <div className="product-detail-rating">
            <span className="stars-large">{'★'.repeat(Math.floor(averageRating))}</span>
            <span className="rating-text-large">{averageRating.toFixed(1)} ({productReviews.length || product.reviews} reviews)</span>
          </div>
          
          <div className="product-detail-price">
            <span className="current-price-large">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="original-price-large">${product.originalPrice.toFixed(2)}</span>
                <span className="savings">You save ${(product.originalPrice - product.price).toFixed(2)}</span>
              </>
            )}
          </div>

          <div className="delivery-info-card">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <div>
              <strong>Same-Day Delivery</strong>
              <p>Get it delivered in {product.deliveryTime}</p>
            </div>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-actions">
            <button 
              className="add-to-cart-btn-large"
              onClick={handleAddToCart}
              disabled={!product.inStock}
            >
              Add to Cart
            </button>
            <button 
              className="buy-now-btn"
              onClick={handleBuyNow}
              disabled={!product.inStock}
            >
              Buy Now
            </button>
          </div>

          {!product.inStock && (
            <div className="out-of-stock-message">
              This product is currently out of stock.
            </div>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>Customer Reviews</h2>
          {user && (
            <button 
              className="add-review-btn"
              onClick={() => {
                if (!user) {
                  navigate('/login');
                } else {
                  setShowReviewForm(!showReviewForm);
                }
              }}
            >
              {showReviewForm ? 'Cancel' : 'Write a Review'}
            </button>
          )}
        </div>

        {showReviewForm && user && (
          <form className="review-form" onSubmit={handleReviewSubmit}>
            <div className="form-group">
              <label>Rating *</label>
              <div className="rating-input">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`star-btn ${reviewData.rating >= star ? 'active' : ''}`}
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label>Your Review *</label>
              <textarea
                value={reviewData.comment}
                onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                rows="4"
                placeholder="Share your experience with this product..."
                required
              />
            </div>
            <button type="submit" className="submit-review-btn">Submit Review</button>
          </form>
        )}

        {!user && (
          <p className="login-prompt">
            <Link to="/login">Sign in</Link> to write a review
          </p>
        )}

        <div className="reviews-list">
          {productReviews.length === 0 ? (
            <p className="no-reviews">No reviews yet. Be the first to review this product!</p>
          ) : (
            productReviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="reviewer-info">
                    <strong>{review.userName}</strong>
                    <span className="review-date">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="review-rating">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
