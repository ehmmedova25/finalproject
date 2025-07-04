import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../../../redux/reducers/orderSlice";
import styles from './MyOrders.module.css';

const MyOrders = () => {
  const dispatch = useDispatch();
  const { myOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending": return "#ffc107";
      case "confirmed": return "#17a2b8";
      case "preparing": return "#fd7e14";
      case "shipped": return "#6f42c1";
      case "delivered": return "#28a745";
      case "cancelled": return "#dc3545";
      default: return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending": return "Gözləmədə";
      case "confirmed": return "Təsdiqləndi";
      case "preparing": return "Hazırlanır";
      case "shipped": return "Yola salındı";
      case "delivered": return "Çatdırıldı";
      case "cancelled": return "Ləğv edildi";
      default: return status;
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p className={styles.error}>Xəta: {error}</p>;

  return (
    <div className={styles.container}>
      <h2>📦 Mənim Sifarişlərim</h2>

      {myOrders.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Hələlik heç bir sifarişiniz yoxdur.</p>
          <a href="/shop">Alış-verişə başla</a>
        </div>
      ) : (
        <div className={styles.ordersList}>
          {myOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <h3>Sifariş #{order._id.slice(-8)}</h3>
                <span 
                  className={styles.status}
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusText(order.status)}
                </span>
              </div>
              
              <div className={styles.orderDetails}>
                <div className={styles.customerInfo}>
                  <h4>Çatdırılma məlumatları:</h4>
                  <p><strong>Ad:</strong> {order.customerInfo.name}</p>
                  <p><strong>Telefon:</strong> {order.customerInfo.phone}</p>
                  <p><strong>Ünvan:</strong> {order.customerInfo.address}</p>
                  <p><strong>Çatdırılma:</strong> {order.customerInfo.deliveryMethod === "delivery" ? "Çatdırılma" : "Götürmə"}</p>
                </div>

                <div className={styles.items}>
                  <h4>Məhsullar:</h4>
                <ul>
  {order.items?.filter(i => i.product).map((item) => (
    <li key={item._id}>
      <img 
        src={item.product.images?.[0]} 
        alt={item.product.name}
        className={styles.productImage}
      />
      <div>
        <span className={styles.productName}>{item.product.name}</span>
        <span className={styles.quantity}>x{item.quantity}</span>
        <span className={styles.price}>{item.price.toFixed(2)} ₼</span>
      </div>
    </li>
  ))}
</ul>

                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.total}>
                    <strong>Cəmi: {order.totalAmount.toFixed(2)} ₼</strong>
                  </div>
                  <div className={styles.date}>
                    {new Date(order.createdAt).toLocaleDateString('az-AZ')}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
