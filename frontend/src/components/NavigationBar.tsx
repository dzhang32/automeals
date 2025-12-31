interface NavigationBarProps {
  onSearch: (query: string) => void;
}

export default function NavigationBar({ onSearch }: NavigationBarProps) {
  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <span className="navbar-brand fw-bold">automeals</span>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <div className="me-auto"></div>
          <div className="d-flex" role="search">
            <input
              className="form-control"
              type="search"
              placeholder="Search recipes..."
              aria-label="Search recipes"
              onChange={(e) => onSearch(e.target.value)}
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
