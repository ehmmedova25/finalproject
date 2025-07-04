import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrders,
  updateOrderStatus
} from "../../../redux/reducers/orderSlice";


import styles from "./AllOrders.module.css";

const AllOrders = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  return (
    <div className={styles.wrapper}>
      <h2>Bütün Sifarişlər</h2>
      {loading ? (
        <p>Yüklənir...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Müştəri</th>
              <th>Məhsullar</th>
              <th>Status</th>
              <th>Tarix</th>
              <th>Yenilə</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  {order.user.firstName} {order.user.lastName}
                  <br />
                  <small>{order.user.email}</small>
                </td>
                <td>
                  {order.items.map((item) => (
                    <div key={item._id}>
                      {item.product.name} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="pending">Gözləyir</option>
                    <option value="processing">Hazırlanır</option>
                    <option value="delivered">Çatdırıldı</option>
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    onClick={() =>
                      handleStatusChange(order._id, order.status)
                    }
                  >
                    Saxla
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllOrders;
