import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSellerOrders,
  updateOrderStatus,
} from "../../redux/reducers/orderSlice";
import styles from "./SellerOrders.module.css";

const SellerOrders = () => {
  const dispatch = useDispatch();
  const { sellerOrders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchSellerOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, status) => {
    dispatch(updateOrderStatus({ id: orderId, status })).then(() => {
      dispatch(fetchSellerOrders()); 
    });
  };

  return (
    <div className={styles.container}>
      <h2>📦 Satılan Sifarişlər</h2>
      {loading ? (
        <p>Yüklənir...</p>
      ) : sellerOrders.length === 0 ? (
        <p>Sifariş yoxdur</p>
      ) : (
        <div className={styles.ordersGrid}>
          {sellerOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <p><strong>Alıcı:</strong> {order.user.firstName} {order.user.lastName}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Tarix:</strong> {new Date(order.createdAt).toLocaleString()}</p>

              <div className={styles.itemsList}>
                {order.items.map((item, i) => (
                  <div key={i} className={styles.item}>
                    <img src={item.product.images[0]} alt={item.product.name} />
                    <div>
                      <p>{item.product.name}</p>
                      <p>Miqdar: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>

              {order.status !== "delivered" && (
                <button
                  className={styles.deliverBtn}
                  onClick={() => handleStatusChange(order._id, "delivered")}
                >
                  ✅ Çatdırıldı kimi işarələ
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
