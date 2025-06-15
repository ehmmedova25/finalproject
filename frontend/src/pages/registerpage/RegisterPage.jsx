import axios from "../../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/auth/register", formData, { withCredentials: true });
      console.log("✅ Server cavabı:", res.data);

      localStorage.setItem("accessToken", res.data.accessToken);
      navigate("/profile");
    } catch (err) {
      console.error("Register error:", err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Qeydiyyat zamanı xəta baş verdi.");
      }
    }
  };

  return (
    <div>
      <h2>Qeydiyyat</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Ad" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Şifrə" onChange={handleChange} required />
        <button type="submit">Qeydiyyatdan keç</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default RegisterPage;
