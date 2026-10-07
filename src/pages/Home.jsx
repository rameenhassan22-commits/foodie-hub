import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMeals } from "../features/meals/mealsSlice";
import FoodCard from "../components/FoodCard";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const Home = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((s) => s.meals);

  useEffect(() => {
    if (status === "idle") dispatch(fetchMeals("chicken"));
  }, [status, dispatch]);

  return (
    <div>
      {/* HERO */}
      <section className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="inline-block bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-medium mb-3">
              🚀 Delivered in 30 minutes
            </span>
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3">
              Delicious food,
              <br />
              delivered to your door
            </h1>
            <p className="text-white/90 text-sm md:text-base mb-6 max-w-md">
              Order from our curated menu of world cuisines. Fresh, hot, and fast.
            </p>
            <Link
              to="/menu"
              className="inline-block bg-white text-orange-600 font-semibold text-sm px-6 py-3 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all"
            >
              Browse Menu →
            </Link>
          </div>
          <div className="hidden md:flex justify-center">
            <div className="text-[180px] leading-none drop-shadow-2xl">🍕</div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800">
              Featured Dishes
            </h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Popular picks from our kitchen
            </p>
          </div>
          <Link
            to="/menu"
            className="text-sm text-orange-600 hover:underline font-medium"
          >
            View all →
          </Link>
        </div>

        {status === "loading" && <Loader label="Loading meals..." />}
        {status === "failed" && (
          <ErrorMessage
            message={error}
            onRetry={() => dispatch(fetchMeals("chicken"))}
          />
        )}
        {status === "succeeded" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.slice(0, 8).map((f) => (
              <FoodCard key={f.id} food={f} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;