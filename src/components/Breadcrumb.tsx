import { Link } from "react-router-dom";

type Crumb = {
  label: string;
  path?: string; // optional, no link if not given
};

interface BreadcrumbProps {
  items: Crumb[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="text-sm text-black/70 mb-4">
      {items.map((item, idx) => (
        <span key={idx}>
          {item.path ? (
            <Link to={item.path} className="hover:text-gold transition-colors duration-200">
              {item.label}
            </Link>
          ) : (
            <span className="text-gold">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="mx-1">›</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
