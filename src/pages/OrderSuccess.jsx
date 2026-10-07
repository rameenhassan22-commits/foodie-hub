import { useParams, Link } from "react-router-dom";
import { useSelector } from "react-redux";

const OrderSuccess = () => {
  const { id } = useParams();
  const order = useSelector((s) => s.orders.items.find((o) => o.id === id));

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 text-center">
        <p className="text-6xl mb-3">🎉</p>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-gray-600 mb-1">
          Order ID: <span className="font-mono text-orange-600">{id}</span>
        </p>
        {order && (
          <>
            <p className="text-gray-600 mb-1">
              Total: <strong>${order.total.toFixed(2)}</strong>
            </p>
            <p className="text-gray-600 mb-1">
              Payment:{" "}
              <strong>
                {order.customer.paymentMethod === "cod"
                  ? "Cash on Delivery"
                  : "Card on Delivery"}
              </strong>
            </p>
            <p className="text-gray-600 mb-5">
              Delivering to{" "}
              <strong>
                {order.customer.address}, {order.customer.city}
              </strong>
            </p>
          </>
        )}
        <Link
          to="/menu"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-medium px-8 py-3 rounded-xl shadow-md transition"
        >
          Order More →
        </Link>
      </div>
    </div>
  );
};

export default OrderSuccess;