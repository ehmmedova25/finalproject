import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser(formData)).then((res) => {
      if (res.meta.requestStatus === 'fulfilled') {
        navigate('/');
      }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4 text-center">Giriş</h2>
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" onChange={handleChange} className="w-full p-2 border rounded" placeholder="Email" />
        <input type="password" name="password" onChange={handleChange} className="w-full p-2 border rounded" placeholder="Şifrə" />
        <button type="submit" disabled={loading} className="w-full py-2 bg-green-600 text-white rounded">
          {loading ? 'Yüklənir...' : 'Daxil ol'}
        </button>
      </form>
    </div>
  );
}
