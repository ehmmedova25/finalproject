import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeFromCart,
  updateCartItem,
} from "../../redux/reducers/cartSlice";
import { FaTrash } from "react-icons/fa";
import styles from "./Cart.module.css";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading, error } = useSelector((state) => state.cart);
  const { customerInfo } = useSelector((state) => state.checkout);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(items));
  }, [items]);

  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem({ productId, quantity }));
  };

  const handleRemove = (productId) => {
    dispatch(removeFromCart(productId));
    toast.info("Məhsul səbətdən silindi.");
  };

  const totalPrice = items.reduce((acc, item) => {
    const price = item?.product?.discountPrice ?? item?.product?.price ?? 0;
    return acc + price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    if (!customerInfo || !customerInfo.name) {
      toast.error("Zəhmət olmasa çatdırılma məlumatlarını doldurun.");
      navigate("/checkout");
      return;
    }

    try {
      const res = await axiosInstance.post("/payment/create-checkout-session", {
        items,
        customerInfo,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (err) {
      console.error("Ödəniş xətası:", err.message);
      toast.error("Ödəniş zamanı xəta baş verdi.");
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p>Xəta: {error}</p>;
  if (!items || items.length === 0) return <p>Səbət boşdur.</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Səbət</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item._id} className={styles.item}>
            <img
              src={item?.product?.images?.[0]}
              alt={item?.product?.name}
              className={styles.image}
            />
            <div className={styles.details}>
              <h3>{item?.product?.name}</h3>
              <p>{item?.product?.description}</p>
              <div className={styles.quantity}>
                <button
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity - 1)
                  }
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(item.product._id, item.quantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <p className={styles.price}>
                Qiymət:{" "}
                {(
                  item?.product?.discountPrice ??
                  item?.product?.price ??
                  0
                ).toFixed(2)}{" "}
                ₼
              </p>
              <button
                onClick={() => handleRemove(item.product._id)}
                className={styles.removeBtn}
              >
                <FaTrash /> Sil
              </button>
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.summary}>
        <h3>Cəmi məbləğ: {totalPrice.toFixed(2)} ₼</h3>
        <button onClick={handleCheckout} className={styles.checkoutBtn}>
          Səbəti Təsdiqlə
        </button>
      </div>
    </div>
  );
};

export default Cart;
  