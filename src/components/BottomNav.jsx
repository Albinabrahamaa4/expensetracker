import { motion } from "framer-motion";
import { Home, Plus, PieChart } from "lucide-react";

export default function BottomNav({ onAddClick }) {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="sm:hidden fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 flex items-center justify-around py-3 px-6 z-50"
    >
      <button
        onClick={() => scrollTo("top")}
        className="flex flex-col items-center gap-1 text-neutral-400"
      >
        <Home size={20} />
        <span className="text-[10px]">Home</span>
      </button>
      <button
        onClick={onAddClick}
        className="bg-indigo-600 text-white rounded-full p-3 -mt-6 shadow-lg shadow-indigo-600/30"
      >
        <Plus size={22} />
      </button>
      <button
        onClick={() => scrollTo("chart")}
        className="flex flex-col items-center gap-1 text-neutral-400"
      >
        <PieChart size={20} />
        <span className="text-[10px]">Insights</span>
      </button>
    </motion.div>
  );
}
