import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRestaurants, clearRestaurants } from '../features/restaurant/restaurantSlice';

export default function Restaurants() {
  const [location, setLocation] = useState('');
  const dispatch = useDispatch();
  const { items, loading, error } = useSelector((state) => state.restaurant);

  useEffect(() => {
    if (location.trim() === '') {
      dispatch(clearRestaurants());
    } else {
      dispatch(fetchRestaurants(location));
    }
  }, [location]);

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">📍 Şəhərə görə restoran axtar</h2>

      <input
        type="text"
        placeholder="Məs: Baku, Ganja, Sumqayıt..."
        className="border border-gray-300 p-2 w-full mb-6 rounded shadow-sm"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />

      {loading && <p className="text-gray-600 text-center">Yüklənir...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {items.length > 0 && (
        <ul className="space-y-4">
          {items.map((restaurant) => (
            <li key={restaurant._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{restaurant.name}</h3>
              <p className="text-gray-700">{restaurant.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
