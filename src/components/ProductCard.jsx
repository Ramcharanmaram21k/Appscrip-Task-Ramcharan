function ProductCard({ product, onAddToCart, onToggleWishlist, isWished }) {
  return (
    <div className="product-card">
      <button
        className="wishlist-btn"
        aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
        onClick={onToggleWishlist}
      >
        {isWished ? "❤️" : "🤍"}
      </button>
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      <p>${product.price}</p>
      <button className="cart-btn" onClick={onAddToCart}>Add to Cart</button>
    </div>
  );
}

export default ProductCard;