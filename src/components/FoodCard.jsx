import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

const FoodCard = ({ food }) => {
  const dispatch = useDispatch();

  return (
    <div className="group bg-white rounded-xl border-2 border-gray-100 hover:border-orange-200 shadow-sm hover:shadow-xl overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 animate-fadeInUp">
      <div className="h-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400" />

      <Link to={`/meal/${food.id}`} className="relative overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        <span className="absolute top-2 left-2 bg-white/95 backdrop-blur text-[10px] uppercase tracking-wider text-orange-600 font-bold px-2 py-0.5 rounded-full shadow-sm border border-orange-100">
          {food.category}
        </span>
      </Link>

      <div className="p-3.5 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/meal/${food.id}`}>
            <h3 className="font-semibold text-gray-800 text-sm leading-snug hover:text-orange-600 line-clamp-2 min-h-[2.4rem]">
              {food.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-500 mt-1">🌍 {food.area} cuisine</p>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200">
          <span className="text-base font-bold text-gray-900">
            ${food.price.toFixed(2)}
          </span>
          <button
            onClick={() => dispatch(addToCart(food))}
            className="bg-orange-500 hover:bg-orange-600 text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg transition-all active:scale-95 shadow-sm"
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;