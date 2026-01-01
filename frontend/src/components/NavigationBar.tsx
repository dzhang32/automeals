interface NavigationBarProps {
  onSearch: (query: string) => void;
}

export default function NavigationBar({ onSearch }: NavigationBarProps) {
  return (
    <nav className="navbar">
      <div className="w-full px-4 flex items-center justify-between">
        <span className="navbar-brand">automeals</span>
        <div className="flex items-center">
          <input
            className="form-input w-[280px]"
            type="search"
            placeholder="Search recipes..."
            aria-label="Search recipes"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
    </nav>
  );
}
