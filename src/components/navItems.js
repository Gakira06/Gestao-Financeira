import { BarChart3, CalendarCheck, CreditCard, Database } from "lucide-react";

export const navItems = [
  { to: "/", label: "Dashboard", short: "Início", icon: BarChart3 },
  { to: "/rotina", label: "Rotina", short: "Rotina", icon: CalendarCheck },
  { to: "/financas", label: "Finanças", short: "Finanças", icon: CreditCard },
  { to: "/cadastros", label: "Cadastros", short: "Dados", icon: Database },
];
