// src/components/Breadcrumb.tsx
import { useNavigate } from "react-router-dom";

type Crumb = {
  label: string;
  path?: string;
};

interface BreadcrumbProps {
  items: Crumb[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [], className = "" }) => {
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    // Only intercept left clicks without modifier keys
    if (e.button === 0 && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      e.preventDefault();
      navigate(path);
    }
    // For right-clicks, middle-clicks, and ctrl+clicks, let the browser handle it naturally
    // The href attribute will ensure proper URL navigation
  };

  return (
    <nav className={`text-sm text-black/70 mb-4 ${className}`} aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={`breadcrumb-${idx}`}>
          {item.path ? (
            <a
              href={item.path}
              onClick={(e) => handleClick(e, item.path!)}
              className="hover:text-gold transition-colors duration-200 cursor-pointer"
              // Ensure proper link behavior for accessibility
              role="link"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(item.path!);
                }
              }}
            >
              {item.label}
            </a>
          ) : (
            <span className="text-gold font-bold" aria-current="page">
              {item.label}
            </span>
          )}
          {idx < items.length - 1 && (
            <span className="mx-1" aria-hidden="true">
              ›
            </span>
          )}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;