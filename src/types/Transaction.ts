export interface Transaction {
  id: number;
  titulo: string;
  valor: number;
  tipo: "entrada" | "saida";
  categoria: string;
  data: string;
  banco: string;
}
