import { Home, BarChart2, Tag, List } from "lucide-react";
import { NavLink } from "react-router-dom";

const menu = [
  { icon: <Home size={24} />, label: "Dashboard", to: "/" },
  { icon: <List size={24} />, label: "Transações", to: "/transacoes" },
  { icon: <BarChart2 size={24} />, label: "Relatórios", to: "/relatorios" },
  { icon: <Tag size={24} />, label: "Categorias", to: "/categorias" },
];

export function Sidebar() {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col h-screen w-20 bg-white border-r border-gray-200 shadow-lg py-8 px-2 fixed left-0 top-0 z-30">
        <div className="flex flex-col gap-8 items-center">
          {menu.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-text-light hover:text-primary focus:text-primary transition-colors focus:outline-none ${
                  isActive ? "text-primary font-bold" : ""
                }`
              }
              title={item.label}
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="flex justify-around items-center py-2">
          {menu.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-4 py-2 text-text-light transition-colors ${
                  isActive ? "text-primary font-bold" : ""
                }`
              }
            >
              {item.icon}
              <span className="text-xs font-medium">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
}
