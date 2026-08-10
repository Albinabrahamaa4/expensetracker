import { motion, AnimatePresence } from "framer-motion";
import { doc, deleteDoc } from "firebase/firestore";
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Film,
  Circle,
  Trash2,
  Search,
  X,
} from "lucide-react";
import { db } from "../firebase";

const CATEGORY_META = {
  Food: { icon: Utensils, color: "bg-orange-500/15 text-orange-400" },
  Transport: { icon: Car, color: "bg-blue-500/15 text-blue-400" },
  Shopping: { icon: ShoppingBag, color: "bg-pink-500/15 text-pink-400" },
  Bills: { icon: Receipt, color: "bg-red-500/15 text-red-400" },
  Entertainment: { icon: Film, color: "bg-purple-500/15 text-purple-400" },
  Other: { icon: Circle, color: "bg-neutral-500/15 text-neutral-400" },
};

export default function ExpenseList({
  expenses,
  searchTerm,
  setSearchTerm,
  totalCount,
}) {
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "expenses", id));
  };

  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden mb-24 sm:mb-0">
      <div className="px-5 py-4 border-b border-neutral-800 space-y-3">
        <h2 className="text-white font-medium">Recent Transactions</h2>
        {totalCount > 0 && (
          <div className="relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
            />
            <input
              type="text"
              placeholder="Search by note or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-9 pr-9 py-2 text-sm text-white placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X size={15} />
              </button>
            )}
          </div>
        )}
      </div>

      {expenses.length === 0 ? (
        <div className="text-center text-neutral-500 py-12">
          {totalCount === 0
            ? "No expenses yet — add your first one above."
            : `No results for "${searchTerm}"`}
        </div>
      ) : (
        <AnimatePresence>
          {expenses.map((exp) => {
            const meta = CATEGORY_META[exp.category] || CATEGORY_META.Other;
            const Icon = meta.icon;
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between gap-3 px-5 py-4 border-b border-neutral-800 last:border-b-0"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${meta.color}`}
                  >
                    <Icon size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm truncate">
                      {exp.note || exp.category}
                    </p>
                    <p className="text-neutral-500 text-xs">{exp.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-white font-medium">
                    -${exp.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(exp.id)}
                    className="text-neutral-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      )}
    </div>
  );
}
