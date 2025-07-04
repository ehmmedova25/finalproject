import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProducts, deleteProduct } from "../../../redux/reducers/productSlice";
import { Link } from "react-router-dom";
import styles from "./MyProducts.module.css";
import { toast } from "react-toastify";

const MyProducts = () => {
  const dispatch = useDispatch();
  const { myProducts, loading, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchMyProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!window.confirm("Məhsulu silmək istədiyinizə əminsiniz?")) return;

    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success("Məhsul silindi");
    } catch {
      toast.error("Silinərkən xəta baş verdi");
    }
  };

  if (loading) return <p>Yüklənir...</p>;
  if (error) return <p>Xəta: {error}</p>;

  if (myProducts.length === 0) return <p>Hələlik məhsul əlavə etməmisiniz.</p>;

  return (
    <div className={styles.container}>
      <h2>Mənim Məhsullarım</h2>
      <div className={styles.grid}>
        {myProducts.map((product) => (
          <div key={product._id} className={styles.card}>
            <img src={product.images[0]} alt={product.name} />
            <h3>{product.name}</h3>
            <p>{product.description?.substring(0, 80)}...</p>
            <div className={styles.actions}>
             <Link to={`/dashboard/admin/edit-product/${product._id}`} className={styles.editBtn}>
  Redaktə et
</Link>

              <button
                onClick={() => handleDelete(product._id)}
                className={styles.deleteBtn}
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyProducts;
