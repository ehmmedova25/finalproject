import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AddLocation.module.css";
import { useSelector } from "react-redux";

const AddLocation = () => {
  const [value, setValue] = useState("");
  const [label, setLabel] = useState("");
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token, user } = useSelector((state) => state.auth);

  const fetchLocations = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/locations");
      setLocations(res.data);
    } catch (err) {
      console.error("Lokasiyalar yüklənmədi:", err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!value || !label) return alert("Dəyərləri doldurun!");

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:5000/api/locations",
        { value, label },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setValue("");
      setLabel("");
      fetchLocations();
    } catch (err) {
      alert(err.response?.data?.message || "Əlavə olunmadı!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Silmək istədiyinizə əminsiniz?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/locations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchLocations();
    } catch (err) {
      alert("Silinmə zamanı xəta!");
    }
  };

  return (
    <div className={styles.container}>
      <h2>📍 Lokasiya İdarəetməsi</h2>

      <form className={styles.form} onSubmit={handleAdd}>
        <input
          type="text"
          placeholder="value (məs: Baku)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <input
          type="text"
          placeholder="label (məs: Bakı)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? "Əlavə olunur..." : "Əlavə et"}
        </button>
      </form>

      <ul className={styles.list}>
        {locations.map((loc) => (
          <li key={loc._id}>
            <span>
              {loc.label} ({loc.value})
            </span>
            <button onClick={() => handleDelete(loc._id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddLocation;
