import { useState } from 'react';
import axios from '../../api/axios';
import { useNavigate } from 'react-router';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Xəta baş verdi');
    }
  };

  return (
    <div>
      <h2>Qeydiyyat</h2>
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Ad" onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Şifrə" onChange={handleChange} required />
        <button type="submit">Qeydiyyat</button>
      </form>
    </div>
  );
};

export default RegisterPage;
