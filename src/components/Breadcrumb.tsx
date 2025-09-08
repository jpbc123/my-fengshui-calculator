// Replace your Breadcrumb component with:
import { Link } from "react-router-dom";

type Crumb = {
  label: string;
  path?: string;
};

interface BreadcrumbProps {
  items: Crumb[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items = [], className = "" }) => {
  return (
    <nav className={`text-sm text-black/70 mb-4 ${className}`}>
      {items.map((item, idx) => (
        <span key={`breadcrumb-${idx}`}>
          {item.path ? (
            <Link 
              to={item.path} 
              className="hover:text-gold transition-colors duration-200"
              onContextMenu={(e) => e.stopPropagation()}
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gold font-bold">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="mx-1">›</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;