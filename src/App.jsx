import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "./firebase";
import Auth from "./components/Auth";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import CategoryChart from "./components/CategoryChart";
import CategoryManager from "./components/CategoryManager";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import BottomNav from "./components/BottomNav";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [categoryDocs, setCategoryDocs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "expenses"),
      where("uid", "==", user.uid),
      orderBy("date", "desc"),
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsubscribe;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "categories"), where("uid", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setCategoryDocs(
        snapshot.docs.map((d) => ({ id: d.id, name: d.data().name })),
      );
    });
    return unsubscribe;
  }, [user]);

  const filteredExpenses = expenses.filter((exp) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return true;
    return (
      exp.note?.toLowerCase().includes(term) ||
      exp.category?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (!user) return <Auth />;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div id="top" className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Header user={user} />
        <StatCards expenses={expenses} />
        <div id="chart">
          <CategoryChart expenses={expenses} />
        </div>
        <CategoryManager categoryDocs={categoryDocs} />
        <div id="add-expense">
          <ExpenseForm categoryDocs={categoryDocs} />
        </div>
        <ExpenseList
          expenses={filteredExpenses}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalCount={expenses.length}
        />
      </div>
      <BottomNav
        onAddClick={() =>
          document
            .getElementById("add-expense")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      />
    </div>
  );
}

export default App;
