import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = {
  Food: "#fb923c",
  Transport: "#60a5fa",
  Shopping: "#f472b6",
  Bills: "#f87171",
  Entertainment: "#c084fc",
  Other: "#9ca3af",
};

export default function CategoryChart({ expenses }) {
  const totals = {};
  expenses.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  });

  const data = Object.entries(totals).map(([name, value]) => ({ name, value }));
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-6 text-center text-neutral-500 text-sm">
        Add expenses to see your category breakdown
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 mb-6"
    >
      <h2 className="text-white font-medium mb-4">Spending by Category</h2>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="w-48 h-48 relative shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[entry.name] || COLORS.Other}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-neutral-500 text-xs">Total</p>
            <p className="text-white text-lg font-semibold">
              ${total.toFixed(0)}
            </p>
          </div>
        </div>
        <div className="w-full space-y-2">
          {data
            .sort((a, b) => b.value - a.value)
            .map((d) => (
              <div
                key={d.name}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: COLORS[d.name] || COLORS.Other }}
                  />
                  <span className="text-neutral-300">{d.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-white font-medium">
                    ${d.value.toFixed(2)}
                  </span>
                  <span className="text-neutral-500 ml-2">
                    {((d.value / total) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </motion.div>
  );
}
