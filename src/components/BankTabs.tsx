import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";

export const BANKS = [
  { value: "xp1", label: "XP1 Pessoal" },
  { value: "xp2", label: "XP2 Compartilhado" },
  { value: "inter", label: "Inter" },
  { value: "mercadopago", label: "Mercado Pago" },
  { value: "all", label: "Todos" },
];

interface BankTabsProps {
  children: (selectedBank: string) => React.ReactNode;
}

export function BankTabs({ children }: BankTabsProps) {
  const [selectedBank, setSelectedBank] = useState("all");

  return (
    <Tabs.Root value={selectedBank} onValueChange={setSelectedBank}>
      <Tabs.List className="flex gap-2 mb-4 md:mb-6 bg-white p-2 rounded-xl shadow-md overflow-x-auto scrollbar-hide">
        {BANKS.map((bank) => (
          <Tabs.Trigger
            key={bank.value}
            value={bank.value}
            className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-xs md:text-sm transition-all duration-200 whitespace-nowrap ${
              selectedBank === bank.value
                ? "bg-primary text-white shadow-md"
                : "bg-gray-50 text-text-dark hover:bg-primary/10 hover:text-primary active:bg-primary/20"
            }`}
          >
            {bank.label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
      <Tabs.Content value={selectedBank}>{children(selectedBank)}</Tabs.Content>
    </Tabs.Root>
  );
}
