import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function Menu() {
  const { id } = useParams(); 
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await axios.get(`/api/restaurants/${id}/menu`);
        setMenu(res.data);
        setLoading(false);
      } catch (err) {
        setError('Menyu yüklənərkən xəta baş verdi');
        setLoading(false);
      }
    };
    fetchMenu();
  }, [id]);

  if (loading) return <p className="text-center mt-10">Yüklənir...</p>;
  if (error) return <p className="text-red-500 text-center mt-10">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">📋 Menyu</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {menu.map((dish, index) => (
          <div key={index} className="border rounded p-4 shadow-sm">
            <img src={dish.image} alt={dish.name} className="w-full h-48 object-cover rounded mb-4" />
            <h3 className="text-lg font-semibold">{dish.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{dish.description}</p>
            <p className="font-bold text-blue-600">{dish.price} AZN</p>
            <button className="mt-3 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              ➕ Səbətə əlavə et
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
