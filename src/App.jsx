import React, { useEffect, useState } from "react";
import Header from "./components/Header";
import Filters from "./components/Filters";
import ProductCard from "./components/ProductCard";
import Footer from "./components/Footer";
import "./App.css";

// --- Responsive Hook ---
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 900);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return isMobile;
}

// --- Modal Component ---
function Modal({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <strong>{title}</strong>
          <button className="close-btn" aria-label="Close modal" onClick={onClose}>×</button>
        </div>
        <div className="modal-content">{children}</div>
      </div>
    </>
  );
}

function App() {
  // UI state
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showCart, setShowCart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  // Responsive (single-truth for all screen logic!)
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  useEffect(() => {
    setSidebarOpen(!isMobile); // open sidebar on desktop, closed on mobile by default
  }, [isMobile]);

  // API fetch
  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(setProducts);
    fetch("https://fakestoreapi.com/products/categories")
      .then(res => res.json())
      .then(setCategories);
  }, []);

  // Prevent scroll on modal open
  useEffect(() => {
    if (showCart || showWishlist) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }
  }, [showCart, showWishlist]);

  // Handlers
  function addToCart(product) {
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id);
      if (idx === -1) return [...prev, { ...product, quantity: 1 }];
      return prev.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  }

  function toggleWishlist(product) {
    setWishlist(prev =>
      prev.some(item => item.id === product.id)
        ? prev.filter(item => item.id !== product.id)
        : [...prev, product]
    );
  }

  function handleLogoClick() {
    setCategory("");
    setSearch("");
    setSidebarOpen(!isMobile);
  }

  const filteredProducts = products.filter(
    p => (!category || p.category === category) &&
      p.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <Header
        search={search}
        setSearch={setSearch}
        cartCount={cart.reduce((s, i) => s + i.quantity, 0)}
        wishlistCount={wishlist.length}
        onShowSidebar={() => setSidebarOpen(true)}
        onShowCart={() => setShowCart(true)}
        onShowWishlist={() => setShowWishlist(true)}
        onLogoClick={handleLogoClick}
        sidebarVisible={sidebarOpen}
      />

      <div className="main-content">
        {/* Sidebar always visible on desktop, toggled on mobile */}
        {sidebarOpen && (
          <Filters
            categories={categories}
            setCategory={setCategory}
            category={category}
            onClose={isMobile ? () => setSidebarOpen(false) : undefined}
          />
        )}

        {/* Backdrop for mobile sidebar */}
        {isMobile && sidebarOpen && (
          <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
        )}

        <div className="product-grid">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => addToCart(product)}
              onToggleWishlist={() => toggleWishlist(product)}
              isWished={wishlist.some(item => item.id === product.id)}
            />
          ))}
        </div>
      </div>

      {/* Cart Modal */}
      <Modal open={showCart} title="Your Cart" onClose={() => setShowCart(false)}>
        {cart.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <div className="modal-list">
            {cart.map(item => (
              <div key={item.id} className="modal-row">
                <img src={item.image} alt={item.title} />
                <span className="modal-title">{item.title}</span>
                <span className="modal-qty">x{item.quantity}</span>
                <span className="modal-price">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Wishlist Modal */}
      <Modal open={showWishlist} title="Your Wishlist" onClose={() => setShowWishlist(false)}>
        {wishlist.length === 0 ? (
          <p>No items in wishlist.</p>
        ) : (
          <div className="modal-list">
            {wishlist.map(item => (
              <div key={item.id} className="modal-row">
                <img src={item.image} alt={item.title} />
                <span className="modal-title">{item.title}</span>
                <span className="modal-price">${item.price}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Footer />
    </div>
  );
}

export default App;
