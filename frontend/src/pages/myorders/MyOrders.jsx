import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../redux/reducers/orderSlice";
import styles from "./MyOrders.module.css";

const MyOrders = () => {
  const dispatch = useDispatch();
  const { myOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>📦 Mənim Sifarişlərim</h1>
      {loading ? (
        <p>Yüklənir...</p>
      ) : myOrders.length === 0 ? (
        <p>Sifarişiniz yoxdur.</p>
      ) : (
        <div className={styles.ordersGrid}>
          {myOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <p>
                <strong>Status:</strong>{" "}
                {order.status === "delivered" ? (
                  <span style={{ color: "green" }}>🚚 Çatdırıldı</span>
                ) : order.status === "processing" ? (
                  <span style={{ color: "orange" }}>🔄 Hazırlanır</span>
                ) : (
                  <span style={{ color: "gray" }}>⌛ Gözləyir</span>
                )}
              </p>
              <p><strong>Tarix:</strong> {new Date(order.createdAt).toLocaleString()}</p>
              <p><strong>Ad:</strong> {order.customerInfo.name}</p>
              <p><strong>Ünvan:</strong> {order.customerInfo.address}</p>

              <div className={styles.itemsList}>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <img src={item.product.images[0]} alt={item.product.name} />
                    <div>
                      <p>{item.product.name}</p>
                      <p>Qiymət: ${item.product.price}</p>
                      <p>Miqdar: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
