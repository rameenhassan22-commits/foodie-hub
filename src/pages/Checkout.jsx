import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";
import { selectCartTotal, clearCart } from "../features/cart/cartSlice";
import { placeOrder } from "../features/orders/ordersSlice";

const schema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  phone: z.string().regex(/^[0-9+\-\s]{7,15}$/, "Enter a valid phone number"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(10, "Address must be at least 10 characters"),
  city: z.string().min(2, "City is required"),
  zip: z.string().regex(/^\d{4,6}$/, "Enter a valid ZIP/postal code"),
  paymentMethod: z.enum(["cod", "card"], {
    errorMap: () => ({ message: "Choose a payment method" }),
  }),
  notes: z.string().optional(),
});

const Checkout = () => {
  const items = useSelector((s) => s.cart.items);
  const subtotal = useSelector(selectCartTotal);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const delivery = subtotal > 30 ? 0 : 3;
  const tax = subtotal * 0.05;
  const total = subtotal + delivery + tax;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: "cod" },
  });

  const paymentMethod = watch("paymentMethod");

  if (items.length === 0) return <Navigate to="/cart" replace />;

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 900));
    const order = {
      id: `ORD-${Date.now()}`,
      customer: data,
      items,
      total,
      placedAt: new Date().toISOString(),
    };
    dispatch(placeOrder(order));
    dispatch(clearCart());
    navigate(`/order-success/${order.id}`);
  };

  const Input = ({ label, name, type = "text", ...rest }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        {...register(name)}
        {...rest}
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
      />
      {errors[name] && (
        <p className="text-red-500 text-xs mt-1">{errors[name].message}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 grid md:grid-cols-3 gap-6">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="md:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-800">Checkout</h1>

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide pt-2">
          Delivery Information
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="Full Name" name="fullName" placeholder="Jane Doe" />
          <Input label="Phone" name="phone" placeholder="+92 300 1234567" />
        </div>
        <Input
          label="Email"
          name="email"
          type="email"
          placeholder="jane@mail.com"
        />
        <Input
          label="Address"
          name="address"
          placeholder="House #, Street, Area"
        />
        <div className="grid md:grid-cols-2 gap-4">
          <Input label="City" name="city" placeholder="Lahore" />
          <Input label="ZIP / Postal Code" name="zip" placeholder="54000" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Order notes (optional)
          </label>
          <textarea
            {...register("notes")}
            rows={2}
            placeholder="Extra spicy, no onions, etc."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />
        </div>

        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide pt-2">
          Payment Method
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <label
            className={`cursor-pointer border-2 rounded-xl p-4 text-center transition ${
              paymentMethod === "cod"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <input
              type="radio"
              value="cod"
              {...register("paymentMethod")}
              className="hidden"
            />
            <p className="text-2xl mb-1">💵</p>
            <p className="text-sm font-medium">Cash on Delivery</p>
          </label>
          <label
            className={`cursor-pointer border-2 rounded-xl p-4 text-center transition ${
              paymentMethod === "card"
                ? "border-orange-500 bg-orange-50"
                : "border-gray-200 hover:border-orange-300"
            }`}
          >
            <input
              type="radio"
              value="card"
              {...register("paymentMethod")}
              className="hidden"
            />
            <p className="text-2xl mb-1">💳</p>
            <p className="text-sm font-medium">Card on Delivery</p>
          </label>
        </div>
        {errors.paymentMethod && (
          <p className="text-red-500 text-xs">{errors.paymentMethod.message}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 rounded-xl shadow-md disabled:opacity-50 transition active:scale-95 mt-2"
        >
          {isSubmitting
            ? "Placing order..."
            : `Place Order • $${total.toFixed(2)}`}
        </button>
      </form>

      <aside className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-fit sticky top-24">
        <h2 className="font-bold text-lg mb-4">Your Order</h2>
        <div className="space-y-3 mb-3 max-h-52 overflow-y-auto pr-1">
          {items.map((i) => (
            <div key={i.id} className="flex gap-2 text-sm">
              <img
                src={i.image}
                alt={i.name}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="truncate text-gray-700 font-medium">{i.name}</p>
                <p className="text-xs text-gray-500">× {i.qty}</p>
              </div>
              <span className="font-medium">
                ${(i.price * i.qty).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
        <hr className="my-4 border-dashed" />
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Delivery</span>
            <span>
              {delivery === 0 ? (
                <span className="text-emerald-600">Free</span>
              ) : (
                `$${delivery.toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Tax (5%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span className="text-orange-600">${total.toFixed(2)}</span>
        </div>
      </aside>
    </div>
  );
};

export default Checkout;