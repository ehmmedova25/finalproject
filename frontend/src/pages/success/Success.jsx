// ✅ Success.jsx (təkmilləşdirilmiş versiya)
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";
import { clearCart } from "../../redux/reducers/cartSlice";
import { clearCustomerInfo } from "../../redux/reducers/checkoutSlice";
import { toast } from "react-toastify";

const Success = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);

  useEffect(() => {
    console.log("✅ SUCCESS PAGE OPENED");

    const savedItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    const savedCustomerInfo = JSON.parse(localStorage.getItem("customerInfo")) || {};

    console.log("📦 cartItems:", savedItems);
    console.log("👤 customerInfo:", savedCustomerInfo);

    const createOrder = async () => {
      try {
        console.log("🚀 Creating order...");
        
        // Sifarişi backend-də yarat
        const response = await axios.post("/orders", {
          items: savedItems,
          customerInfo: savedCustomerInfo,
        });

        console.log("✅ Order created successfully:", response.data);

        // Redux state-ni təmizlə
        dispatch(clearCart());
        dispatch(clearCustomerInfo());
        
        // LocalStorage-ni təmizlə
        localStorage.removeItem("cartItems");
        localStorage.removeItem("customerInfo");
        
        setLoading(false);
        setOrderCreated(true);

        toast.success("✅ Sifarişiniz uğurla qeydə alındı!");

        // 3 saniyə sonra my-orders səhifəsinə yönləndir
        setTimeout(() => {
          navigate("/my-orders");
        }, 3000);

      } catch (error) {
        console.error("❌ Sifariş yaradılarkən xəta:", error.response?.data?.message || error.message);
        setLoading(false);
        
        toast.error("❌ Sifariş yaradılarkən xəta baş verdi!");
        
        // Xəta olduqda da səbəti təmizlə (çünki ödəniş edilib)
        dispatch(clearCart());
        localStorage.removeItem("cartItems");
        localStorage.removeItem("customerInfo");
        
        // Ana səhifəyə yönləndir
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };

    // Yalnız məlumatlar varsa sifariş yarat
    if (savedItems.length > 0 && savedCustomerInfo.name) {
      createOrder();
    } else {
      console.warn("⚠️ Boş məlumat gəldi, sifariş yaradılmadı. Redirect to my-orders...");
      setLoading(false);
      
      // Səbəti təmizlə
      dispatch(clearCart());
      
      // My-orders səhifəsinə yönləndir
      setTimeout(() => {
        navigate("/my-orders");
      }, 2000);
    }
  }, [dispatch, navigate]);

  return (
    <div style={{ 
      textAlign: "center", 
      marginTop: "100px", 
      padding: "20px",
      minHeight: "60vh",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center"
    }}>
      {loading ? (
        <div>
          <div style={{ 
            fontSize: "48px", 
            marginBottom: "20px",
            animation: "spin 1s linear infinite"
          }}>
            ⏳
          </div>
          <h2 style={{ color: "#333", marginBottom: "10px" }}>
            Sifarişiniz işlənir...
          </h2>
          <p style={{ color: "#666", fontSize: "16px" }}>
            Zəhmət olmasa gözləyin
          </p>
        </div>
      ) : orderCreated ? (
        <div>
          <div style={{ fontSize: "72px", marginBottom: "20px" }}>
            ✅
          </div>
          <h1 style={{ color: "#28a745", marginBottom: "15px" }}>
            Ödəniş uğurla tamamlandı!
          </h1>
          <p style={{ color: "#666", fontSize: "18px", marginBottom: "10px" }}>
            🎉 Sifarişiniz qeydə alındı
          </p>
          <p style={{ color: "#666", fontSize: "16px" }}>
            3 saniyə içində sifarişlər səhifəsinə yönləndiriləcəksiniz...
          </p>
        </div>
      ) : (
        <div>
          <div style={{ fontSize: "72px", marginBottom: "20px" }}>
            ❌
          </div>
          <h1 style={{ color: "#dc3545", marginBottom: "15px" }}>
            Xəta baş verdi
          </h1>
          <p style={{ color: "#666", fontSize: "16px" }}>
            Ana səhifəyə yönləndiriləcəksiniz...
          </p>
        </div>
      )}
      
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Success;
