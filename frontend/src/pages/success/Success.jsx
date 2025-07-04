import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";
import { clearCustomerInfo } from "../../redux/reducers/checkoutSlice";
import { toast } from "react-toastify";
import { clearCart, fetchCart } from "../../redux/reducers/cartSlice";

const Success = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    const savedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const savedCustomerInfo = JSON.parse(localStorage.getItem("customerInfo")) || {};

    const createOrder = async () => {
      try {
        if (savedItems.length === 0 || !savedCustomerInfo.name) {
          throw new Error("Sifariş məlumatları boşdur");
        }

        const response = await axios.post("/orders", {
          items: savedItems,
          customerInfo: savedCustomerInfo,
        });

        dispatch(clearCart());
        dispatch(clearCustomerInfo());
        
        try {
          await axios.delete("/cart/clear");
        } catch (clearError) {
          console.warn("Səbət təmizlənərkən xəta:", clearError);
        }

        dispatch(fetchCart());
        
        localStorage.removeItem("cartItems");
        localStorage.removeItem("customerInfo");

        setOrderCreated(true);
        setLoading(false);
        toast.success("Sifarişiniz uğurla qeydə alındı!");

        setTimeout(() => {
          navigate("/my-orders");
        }, 3000);
      } catch (error) {
        setLoading(false);
        toast.error("Sifariş yaradılarkən xəta baş verdi!");
        console.error("Sifariş xətası:", error);
        
        dispatch(clearCart());
        dispatch(clearCustomerInfo());
        localStorage.removeItem("cartItems");
        localStorage.removeItem("customerInfo");
        
        setTimeout(() => navigate("/"), 3000);
      }
    };

    createOrder();
  }, [dispatch, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: 100, minHeight: "60vh", padding: 20 }}>
      {loading ? (
        <>
          <div style={{ fontSize: 48, marginBottom: 20, animation: "spin 1s linear infinite" }}>⏳</div>
          <h2>Sifarişiniz işlənir...</h2>
          <p>Zəhmət olmasa gözləyin</p>
          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </>
      ) : orderCreated ? (
        <>
          <div style={{ fontSize: 72, marginBottom: 20 }}>✅</div>
          <h1 style={{ color: "#28a745", marginBottom: 15 }}>Ödəniş uğurla tamamlandı!</h1>
          <p>🎉 Sifarişiniz qeydə alındı və səbətiniz təmizləndi</p>
          <p>3 saniyə içində sifarişlər səhifəsinə yönləndiriləcəksiniz...</p>
        </>
      ) : (
        <>
          <div style={{ fontSize: 72, marginBottom: 20 }}>❌</div>
          <h1 style={{ color: "#dc3545", marginBottom: 15 }}>Xəta baş verdi</h1>
          <p>Ana səhifəyə yönləndiriləcəksiniz...</p>
        </>
      )}
    </div>
  );
};

export default Success;
