import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMeals,
  fetchMealsByCategory,
} from "../features/meals/mealsSlice";
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

const ITEMS_PER_PAGE = 8;

const Menu = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.meals);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(ITEMS_PER_PAGE);

  // Initial load
  useEffect(() => {
    if (status === "idle") dispatch(fetchMeals("chicken"));
  }, [status, dispatch]);

  // Reset "visible" whenever items change (new fetch)
  useEffect(() => {
    setVisible(ITEMS_PER_PAGE);
  }, [items]);

  const handleCategoryChange = (c) => {
    setCategory(c);
    if (c === "All") {
      dispatch(fetchMeals("chicken"));
    } else {
      dispatch(fetchMealsByCategory(c));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      setCategory("All");
      dispatch(fetchMeals(search.trim()));
    }
  };

  const visibleItems = items.slice(0, visible);
  const hasMore = visible < items.length;

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
            onClick={() => handleCategoryChange(c)}
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
          onRetry={() =>
            category === "All"
              ? dispatch(fetchMeals("chicken"))
              : dispatch(fetchMealsByCategory(category))
          }
        />
      )}

      {status === "succeeded" && items.length === 0 && (
        <p className="text-center text-gray-500 py-16">
          No meals found. Try a different category or search term.
        </p>
      )}

      {status === "succeeded" && items.length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-gray-500">
              Showing {visibleItems.length} of {items.length} meals
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleItems.map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-10">
              <button
                onClick={() => setVisible((v) => v + ITEMS_PER_PAGE)}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium text-sm px-6 py-2.5 rounded-lg shadow-md transition active:scale-95"
              >
                Load More ↓
              </button>
              <p className="text-xs text-gray-400 mt-2">
                {items.length - visible} more available
              </p>
            </div>
          )}

          {!hasMore && (
            <p className="text-center text-gray-400 text-sm mt-10">
              🎉 You've seen all {items.length} meals!
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default Menu;