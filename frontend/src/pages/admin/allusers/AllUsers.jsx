import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUser, clearError } from "../../../redux/reducers/adminSlice";
import styles from "./AllUsers.module.css";

const AllUsers = () => {
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      alert(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("İstifadəçini silmək istədiyinizə əminsiniz?")) {
      dispatch(deleteUser(id));
    }
  };

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Bütün İstifadəçilər</h2>

      {loading && <p>Yüklənir...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loading && users.length === 0 && <p>Heç bir istifadəçi yoxdur.</p>}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>#</th>
            <th>Ad</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Yaradılma</th>
            <th>Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, idx) => (
            <tr key={user._id}>
              <td>{idx + 1}</td>
              <td>{user.firstName} {user.lastName}</td>
              <td>{user.email}</td>
              <td>
                <span className={`${styles.role} ${styles[user.role]}`}>
                  {user.role}
                </span>
              </td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleDelete(user._id)}
                  className={styles.btnDeletes}
                >
                  Sil
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
