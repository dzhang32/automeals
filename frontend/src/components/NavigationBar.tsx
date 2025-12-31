import { Link, useLocation } from "react-router-dom";

interface NavigationBarProps {
  onSearch: (query: string) => void;
}

export default function NavigationBar({ onSearch }: NavigationBarProps) {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <Link className="navbar-brand fw-bold" to="/">
          automeals
        </Link>
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
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/" ? "active fw-semibold" : ""}`}
                aria-current={location.pathname === "/" ? "page" : undefined}
                to="/"
              >
                Explore
              </Link>
            </li>
            <li className="nav-item">
              <Link
                className={`nav-link ${location.pathname === "/plan" ? "active fw-semibold" : ""}`}
                aria-current={location.pathname === "/plan" ? "page" : undefined}
                to="/plan"
              >
                Plan
              </Link>
            </li>
          </ul>

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
