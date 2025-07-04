import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus,
} from "../../../../redux/reducers/orderSlice";
import styles from "./Allorders.module.css";

const AllOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "confirmed":
        return "#17a2b8";
      case "preparing":
        return "#fd7e14";
      case "shipped":
        return "#6f42c1";
      case "delivered":
        return "#28a745";
      case "cancelled":
        return "#dc3545";
      default:
        return "#6c757d";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "Gözləmədə";
      case "confirmed":
        return "Təsdiqləndi";
      case "preparing":
        return "Hazırlanır";
      case "shipped":
        return "Yola salındı";
      case "delivered":
        return "Çatdırıldı";
      case "cancelled":
        return "Ləğv edildi";
      default:
        return status;
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p className={styles.error}>Xəta: {error}</p>;
  if (orders.length === 0)
    return <p>Heç bir sifariş tapılmadı.</p>;

  return (
    <div className={styles.container}>
      <h2>📦 Bütün Sifarişlər</h2>

      <div className={styles.ordersList}>
        {orders.map((order) => (
          <div key={order._id} className={styles.orderCard}>
            <div className={styles.orderHeader}>
              <div className={styles.orderInfo}>
                <h3>Sifariş #{order._id.slice(-8)}</h3>
                <p className={styles.orderDate}>
                  {new Date(order.createdAt).toLocaleDateString("az-AZ", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className={styles.statusContainer}>
                <span
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {getStatusText(order.status)}
                </span>
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className={styles.statusSelect}
                >
                  <option value="pending">Gözləmədə</option>
                  <option value="confirmed">Təsdiqləndi</option>
                  <option value="preparing">Hazırlanır</option>
                  <option value="shipped">Yola salındı</option>
                  <option value="delivered">Çatdırıldı</option>
                  <option value="cancelled">Ləğv edildi</option>
                </select>
              </div>
            </div>

            <div className={styles.orderContent}>
              <div className={styles.customerSection}>
                <h4>👤 Müştəri məlumatları</h4>
                <div className={styles.customerGrid}>
                  <div className={styles.customerInfo}>
                    <p><strong>Ad:</strong> {order.customerInfo.name}</p>
                    <p><strong>Email:</strong> {order.customerInfo.email}</p>
                    <p><strong>Telefon:</strong> {order.customerInfo.phone}</p>
                  </div>
                  <div className={styles.deliveryInfo}>
                    <p><strong>Ünvan:</strong> {order.customerInfo.address}</p>
                    <p><strong>Şəhər:</strong> {order.customerInfo.city}</p>
                    <p><strong>Çatdırılma:</strong>
                      <span className={`${styles.deliveryMethod} ${order.customerInfo.deliveryMethod === "delivery" ? styles.delivery : styles.pickup}`}>
                        {order.customerInfo.deliveryMethod === "delivery"
                          ? "🚚 Çatdırılma"
                          : "🏪 Götürmə"}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className={styles.productsSection}>
                <h4>📦 Məhsullar</h4>
                <div className={styles.productsList}>
                  {order.items
                    .filter(item => item.product) 
                    .map((item) => (
                      <div key={item._id} className={styles.productItem}>
                        <img
                          src={item.product.images?.[0]}
                          alt={item.product.name}
                          className={styles.productImage}
                        />
                        <div className={styles.productDetails}>
                          <h5>{item.product.name}</h5>
                          <p className={styles.productPrice}>
                            {item.quantity} x {item.price.toFixed(2)} ₼ ={" "}
                            {(item.quantity * item.price).toFixed(2)} ₼
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div className={styles.totalSection}>
                <h4>
                  Cəmi məbləğ:{" "}
                  <span className={styles.totalAmount}>
                    {order.totalAmount.toFixed(2)} ₼
                  </span>
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllOrders;
