import { FaHeart, FaShoppingCart } from "react-icons/fa";

function Header({
  search, setSearch,
  cartCount, wishlistCount,
  onShowSidebar, onShowCart, onShowWishlist, onLogoClick,
  sidebarVisible
}) {
  return (
    <header className="header">
      <div className="header-inner">
        <span className="header-logo" onClick={onLogoClick} role="button" tabIndex={0}>Shopzcart</span>
        <div className="header-controls">
          {/* Always show sidebar toggle on mobile */}
          {!sidebarVisible && (
            <button className="sidebar-btn" aria-label="Show filters" onClick={onShowSidebar}>☰</button>
          )}
          <input
            type="search"
            value={search}
            aria-label="Search products"
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products"
          />
          <button aria-label="Show cart" onClick={onShowCart}>
            Cart {cartCount > 0 && <sup>{cartCount}</sup>}
          </button>
          <button aria-label="Show wishlist" onClick={onShowWishlist}>
            Wishlist {wishlistCount > 0 && <sup>{wishlistCount}</sup>}
          </button>
        </div>
      </div>
    </header>
  );
}


export default Header;