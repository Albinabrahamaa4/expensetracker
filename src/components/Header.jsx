import { motion } from "framer-motion";
import { signOut } from "firebase/auth";
import { LogOut } from "lucide-react";
import { auth } from "../firebase";

export default function Header({ user }) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const getDisplayName = () => {
    if (user.displayName) return user.displayName.split(" ")[0]; // Google sign-in
    if (user.email) return user.email.split("@")[0]; // Email/password sign-in
    if (user.phoneNumber) return user.phoneNumber; // Phone sign-in
    return "Guest"; // Anonymous sign-in
  };

  const firstName = getDisplayName();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-neutral-800 rounded-2xl px-5 py-6 sm:px-8 sm:py-8 mb-6 relative overflow-hidden"
    >
      <div className="flex justify-between items-start relative z-10">
        <div>
          <p className="text-neutral-500 text-xs sm:text-sm">{today}</p>
          <h1 className="text-2xl sm:text-4xl font-semibold text-white mt-1">
            Welcome back,
          </h1>
          <h1 className="text-2xl sm:text-4xl font-semibold text-indigo-400 italic">
            {firstName}
          </h1>
        </div>
        <button
          onClick={() => signOut(auth)}
          className="flex items-center gap-1.5 bg-neutral-800/80 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs sm:text-sm px-3 py-2 rounded-lg transition-colors"
        >
          <LogOut size={14} />
          <span className="hidden sm:inline">Log Out</span>
        </button>
      </div>
    </motion.div>
  );
}
