import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart, updateCartItem } from "../../redux/reducers/cartSlice";
import { FaTrash } from "react-icons/fa";
import styles from "./Cart.module.css";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom"; 

const Cart = () => {
  const navigate = useNavigate(); 

  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
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
  };

  const totalPrice = items.reduce((acc, item) => {
    const price = item.product.discountPrice || item.product.price;
    return acc + price * item.quantity;
  }, 0);

  const handleCheckout = async () => {
    try {
      const savedCustomerInfo = JSON.parse(localStorage.getItem("customerInfo"));

      if (!savedCustomerInfo || !savedCustomerInfo.name) {
        alert("Zəhmət olmasa çatdırılma məlumatlarını doldurun.");
        return;
      }

      const res = await axiosInstance.post("/payment/create-checkout-session", {
        items,
        customerInfo: savedCustomerInfo,
      });

      if (res.data.url) {
        window.location.href = res.data.url;
      }
    } catch (error) {
      console.error("Ödəniş xətası:", error.message);
      alert("Ödəniş zamanı xəta baş verdi.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2>Səbət</h2>
      {items.length === 0 ? (
        <p>Səbət boşdur.</p>
      ) : (
        <>
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item._id} className={styles.item}>
                <img src={item.product.images[0]} alt={item.product.name} />
                <div>
                  <h3>{item.product.name}</h3>
                  <p>{item.product.description}</p>
                  <div className={styles.quantity}>
                    <button onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}>+</button>
                  </div>
                  <p>Qiymət: {(item.product.discountPrice || item.product.price).toFixed(2)} ₼</p>
                  <button onClick={() => handleRemove(item.product._id)}>
                    <FaTrash /> Sil
                  </button>
                </div>
              </li>
            ))}
          </ul>
          <h3>Cəmi: {totalPrice.toFixed(2)} ₼</h3>
         <button onClick={() => navigate("/checkout")} className={styles.checkoutBtn}>
  Səbəti Təsdiqlə
</button>

        </>
      )}
    </div>
  );
};

export default Cart;
