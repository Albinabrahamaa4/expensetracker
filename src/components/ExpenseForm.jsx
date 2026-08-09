import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db, auth } from "../firebase";

export default function ExpenseForm({ categoryDocs }) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [saving, setSaving] = useState(false);

  const categoryNames = categoryDocs.map((c) => c.name);

  // Keep selected category valid as the list changes
  useEffect(() => {
    if (categoryNames.length === 0) {
      setCategory("");
    } else if (!categoryNames.includes(category)) {
      setCategory(categoryNames[0]);
    }
  }, [categoryNames, category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "expenses"), {
        uid: auth.currentUser.uid,
        amount: parseFloat(amount),
        category,
        note,
        date,
        createdAt: serverTimestamp(),
      });
      setAmount("");
      setNote("");
    } catch (err) {
      console.error("Error adding expense:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8"
    >
      <h2 className="text-white font-medium mb-4">Add Expense</h2>
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <input
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          disabled={categoryNames.length === 0}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 transition-colors disabled:opacity-50"
        >
          {categoryNames.length === 0 ? (
            <option>Add a category first</option>
          ) : (
            categoryNames.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))
          )}
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white outline-none focus:border-indigo-500 transition-colors"
        />
        <input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={saving || !category}
        className="mt-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium rounded-lg px-5 py-2.5 transition-colors"
      >
        {saving ? "Adding..." : "Add Expense"}
      </motion.button>
    </motion.form>
  );
}
