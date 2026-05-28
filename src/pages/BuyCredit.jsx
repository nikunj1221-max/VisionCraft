import React, { useContext } from "react";
import { assets, plans } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const BuyCredit = () => {
  const { user, backendUrl, token, setShowLogin, loadCreditsData } = useContext(AppContext);
  const navigate = useNavigate();

  const initPay = async (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Credits Payment",
      description: "Credits Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log("Razorpay success:", response);
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verify-razor",
            { razorpay_order_id: response.razorpay_order_id },
            { headers: { token } }
          );
          if (data.success) {
            toast.success("Payment successful!");
            loadCreditsData();
            navigate("/result");
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          toast.error("Payment verification failed");
        }
      },
      theme: {
        color: "#0f172a",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  }

    const paymentRazorpay = async (planId) => {
      try {
        if (!user) {
          setShowLogin(true);
          return;
        }

        const { data } = await axios.post(
          backendUrl + "/api/user/pay-razor",
          { planId },
          { headers: { token } }
        );

        if (data.success) {
          initPay(data.order);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message || "Payment failed");
      }
    };

    return (
      <motion.div
        initial={{ opacity: 0.2, y: 100 }}
        transition={{ duration: 1 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="min-h-[80vh] text-center pt-14 mb-10 px-4 md:px-8"
      >
        <div className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2 shadow-sm border border-gray-200 mb-4">
          <span className="text-sm font-semibold text-slate-500">Our Plans</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-semibold text-slate-900 mb-10">
          Choose the plan
        </h1>

        <div className="flex flex-wrap justify-center gap-6 max-w-6xl mx-auto">
          {plans.map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className={`w-full sm:w-[320px] bg-white border rounded-2xl p-8 shadow-sm hover:shadow-lg text-left ${
                item.id === "Advanced" ? "border-blue-600/30 shadow-blue-100" : "border-gray-200"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <img width={40} src={assets.logo_icon} alt={`${item.id} icon`} />
                <span className="text-sm text-gray-500 font-medium">{item.credits} credits</span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-2">{item.id}</h2>
              <p className="text-sm text-slate-600 mb-6">{item.desc}</p>

              <div className="text-4xl font-extrabold text-slate-900 mb-6">
                ${item.price}
                <span className="text-lg font-medium text-slate-500"> / {item.credits}</span>
              </div>

              <button
                onClick={() => paymentRazorpay(item.id)}
                className={`w-full rounded-lg py-3 text-sm font-semibold transition-all duration-300 ${
                  item.id === "Advanced"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-slate-900 text-white hover:bg-slate-800"
                }`}
              >
                Purchase
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  };

  export default BuyCredit;

