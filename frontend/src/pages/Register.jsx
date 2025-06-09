import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', form);
      toast.success('Qeydiyyat uğurla tamamlandı!');
      console.log(res.data);
    } catch (error) {
      const msg = error.response?.data?.message || 'Xəta baş verdi';
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Qeydiyyat</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="text" name="name" placeholder="Ad" className="border p-2 w-full rounded" onChange={handleChange} />
        <input type="email" name="email" placeholder="Email" className="border p-2 w-full rounded" onChange={handleChange} />
        <input type="password" name="password" placeholder="Şifrə" className="border p-2 w-full rounded" onChange={handleChange} />
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded">Qeydiyyat</button>
      </form>
    </div>
  );
}
