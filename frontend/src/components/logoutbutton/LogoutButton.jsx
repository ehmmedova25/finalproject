import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import axios from "../../api/axios";
import { logout } from "../../redux/slices/authSlice";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout", {}, { withCredentials: true });
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error("Çıxış zamanı xəta:", err.message);
    }
  };

  return (
    <button onClick={handleLogout} style={{ padding: "10px 20px", marginTop: "20px" }}>
      Çıxış et
    </button>
  );
};

export default LogoutButton;
