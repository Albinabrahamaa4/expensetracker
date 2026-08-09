import { motion } from "framer-motion";
import { Wallet, TrendingUp, Receipt } from "lucide-react";

export default function StatCards({ expenses }) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    const now = new Date();
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    );
  });
  const monthTotal = thisMonth.reduce((sum, e) => sum + e.amount, 0);

  const avg = expenses.length ? total / expenses.length : 0;

  const cards = [
    {
      label: "Total Spent",
      value: `$${total.toFixed(2)}`,
      icon: Wallet,
      color: "from-indigo-600 to-indigo-800",
    },
    {
      label: "This Month",
      value: `$${monthTotal.toFixed(2)}`,
      icon: TrendingUp,
      color: "from-emerald-600 to-emerald-800",
    },
    {
      label: "Avg. per Expense",
      value: `$${avg.toFixed(2)}`,
      icon: Receipt,
      color: "from-amber-600 to-amber-800",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className={`bg-gradient-to-br ${card.color} rounded-2xl p-5`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-white/70 text-xs sm:text-sm">{card.label}</p>
              <p className="text-white text-2xl sm:text-3xl font-semibold mt-1">
                {card.value}
              </p>
            </div>
            <card.icon className="text-white/60" size={20} />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
