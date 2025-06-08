import { Link, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

export default function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">🍽 HybridFood</Link>
<div className="space-x-4">
  <Link to="/restaurants" className="hover:underline">Restoranlar</Link>
  {user ? (
    <>
      <span>Salam, {user.name} 👋</span>
      <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Çıxış</button>
    </>
  ) : (
    <>
      <Link to="/login" className="hover:underline">Daxil ol</Link>
      <Link to="/register" className="hover:underline">Qeydiyyat</Link>
    </>
  )}
</div>

    </nav>
  );
}
