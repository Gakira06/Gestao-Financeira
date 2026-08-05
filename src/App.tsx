import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Dashboard } from "./pages/Dashboard";
import { TransactionListPage } from "./pages/TransactionList";
import { Relatorios } from "./pages/Relatorios";
import { Categorias } from "./pages/Categorias";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transacoes" element={<TransactionListPage />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/categorias" element={<Categorias />} />
      </Routes>
    </BrowserRouter>
  );
}
