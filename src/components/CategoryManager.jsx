import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Plus, Trash2, Tag } from "lucide-react";
import { db, auth } from "../firebase";

export default function CategoryManager({ categoryDocs }) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    const name = newCategoryName.trim();
    if (!name) return;
    if (categoryDocs.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
      setNewCategoryName("");
      return;
    }
    setAdding(true);
    try {
      await addDoc(collection(db, "categories"), {
        uid: auth.currentUser.uid,
        name,
        createdAt: serverTimestamp(),
      });
      setNewCategoryName("");
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (categoryDocs.length <= 1) return; // keep at least one category available
    await deleteDoc(doc(db, "categories", id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 sm:p-6 mb-6"
    >
      <h2 className="text-white font-medium mb-4 flex items-center gap-2">
        <Tag size={16} className="text-neutral-500" />
        Categories
      </h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="New category name"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="flex-1 min-w-0 bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-white placeholder-neutral-500 outline-none focus:border-indigo-500 transition-colors"
        />
        <button
          type="submit"
          disabled={adding}
          className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm rounded-lg px-3 py-2 shrink-0 transition-colors"
        >
          <Plus size={16} />
          Add
        </button>
      </form>

      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {categoryDocs.map((c) => (
            <motion.span
              key={c.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex items-center gap-1.5 bg-indigo-500/15 text-indigo-300 text-sm pl-3 pr-1.5 py-1.5 rounded-full"
            >
              {c.name}
              <button
                onClick={() => handleDelete(c.id)}
                disabled={categoryDocs.length <= 1}
                className="hover:bg-indigo-500/25 disabled:opacity-30 disabled:cursor-not-allowed rounded-full p-1 transition-colors"
                title={
                  categoryDocs.length <= 1
                    ? "You need at least one category"
                    : "Delete category"
                }
              >
                <Trash2 size={12} />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      {categoryDocs.length <= 1 && (
        <p className="text-neutral-600 text-xs mt-3">
          You need at least one category — add another before deleting this one.
        </p>
      )}
    </motion.div>
  );
}
