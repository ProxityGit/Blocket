import { useNavigate } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export default function Breadcrumbs({ items }) {
  const navigate = useNavigate();

  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
      >
        <Home size={16} />
        <span>Inicio</span>
      </button>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight size={16} className="text-slate-400 dark:text-slate-600" />
          {item.path && index < items.length - 1 ? (
            <button
              onClick={() => navigate(item.path)}
              className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors"
            >
              {item.label}
            </button>
          ) : (
            <span className="text-slate-900 dark:text-white font-medium">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
