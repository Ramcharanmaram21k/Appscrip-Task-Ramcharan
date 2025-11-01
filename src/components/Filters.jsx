function Filters({ categories, setCategory, category, onClose }) {
  return (
    <aside className="filters" role="complementary">
      <div className="filters-header">
        <h2>Categories</h2>
        {onClose && (
          <button className="close-btn" aria-label="Close filters" onClick={onClose}>×</button>
        )}
      </div>
      <ul>
        <li>
          <button
            className={category === "" ? "active" : ""}
            onClick={() => setCategory("")}
          >
            All
          </button>
        </li>
        {categories.map(cat => (
          <li key={cat}>
            <button
              className={cat === category ? "active" : ""}
              onClick={() => setCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Filters;