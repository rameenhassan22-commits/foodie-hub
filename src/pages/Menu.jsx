import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMeals } from "../features/meals/mealsSlice";
import FoodCard from "../components/FoodCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const CATEGORIES = [
  "All",
  "Beef",
  "Chicken",
  "Dessert",
  "Pasta",
  "Seafood",
  "Vegetarian",
  "Breakfast",
];

const Menu = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.meals);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    if (status === "idle") dispatch(fetchMeals("chicken"));
  }, [status, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) dispatch(fetchMeals(search.trim()));
  };

  const filtered = items.filter(
    (f) => category === "All" || f.category === category
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Our Menu</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search meals (pizza, pasta, curry...)"
          className="flex-1 border border-gray-200 bg-gray-50 rounded-lg px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="submit"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-6 rounded-lg transition"
        >
          Search
        </button>
      </form>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition ${
              category === c
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-200 hover:border-orange-300"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {status === "loading" && <Loader label="Loading menu..." />}
      {status === "failed" && (
        <ErrorMessage
          message={error}
          onRetry={() => dispatch(fetchMeals("chicken"))}
        />
      )}
      {status === "succeeded" && filtered.length === 0 && (
        <p className="text-center text-gray-500 py-16">
          No meals match your filter. Try something else.
        </p>
      )}
      {status === "succeeded" && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((f) => (
            <FoodCard key={f.id} food={f} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;