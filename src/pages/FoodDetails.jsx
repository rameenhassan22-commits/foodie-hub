import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchMealById } from "../features/meals/mealsSlice";
import { addToCart } from "../features/cart/cartSlice";
import Loader from "../components/Loader";
import ErrorMessage from "../components/ErrorMessage";

const FoodDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { selected, detailStatus, error } = useSelector((s) => s.meals);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchMealById(id));
  }, [id, dispatch]);

  if (detailStatus === "loading") return <Loader label="Loading meal..." />;
  if (detailStatus === "failed")
    return (
      <ErrorMessage
        message={error}
        onRetry={() => dispatch(fetchMealById(id))}
      />
    );
  if (!selected) return null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) dispatch(addToCart(selected));
    navigate("/cart");
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <button
        onClick={() => navigate(-1)}
        className="text-orange-600 text-sm mb-4 hover:underline"
      >
        ← Back
      </button>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid md:grid-cols-2">
        <img
          src={selected.image}
          alt={selected.name}
          className="w-full h-72 md:h-full object-cover"
        />
        <div className="p-6 md:p-8 flex flex-col">
          <span className="text-xs uppercase tracking-wider text-orange-600 font-bold">
            {selected.category}
          </span>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
            {selected.name}
          </h1>
          <p className="text-sm text-gray-500 mt-1">🌍 {selected.area} cuisine</p>
          <p className="text-3xl font-bold text-orange-600 mt-4">
            ${selected.price.toFixed(2)}
          </p>

          <div className="flex items-center gap-3 mt-6">
            <label className="text-sm text-gray-600 font-medium">Quantity</label>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 bg-gray-50 hover:bg-gray-100 text-lg"
              >
                −
              </button>
              <span className="w-12 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 bg-gray-50 hover:bg-gray-100 text-lg"
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleAdd}
            className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl shadow-md transition active:scale-95"
          >
            Add {qty} to Cart
          </button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-3">Ingredients</h2>
          <ul className="space-y-1.5 text-sm text-gray-700">
            {selected.ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-orange-500">•</span> {ing}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <h2 className="font-bold text-lg mb-3">Instructions</h2>
          <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed">
            {selected.instructions}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodDetails;