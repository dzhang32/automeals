interface NavigationBarProps {
  onSearch: (query: string) => void;
}

export default function NavigationBar({ onSearch }: NavigationBarProps) {
  return (
    <nav className="navbar">
      <div className="container-fluid px-4">
        <span className="navbar-brand">automeals</span>
        <div className="d-flex align-items-center">
          <input
            className="form-control"
            type="search"
            placeholder="Search recipes..."
            aria-label="Search recipes"
            onChange={(e) => onSearch(e.target.value)}
            style={{ width: "280px" }}
          />
        </div>
      </div>
    </nav>
  );
}
