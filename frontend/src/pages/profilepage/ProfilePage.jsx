import { useEffect, useState } from 'react';
import axios from '../../api/axios';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/user/profile');
        setProfile(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div>
      <h2>Profil</h2>
      {profile ? (
        <div>
          <p>Ad: {profile.name}</p>
          <p>Email: {profile.email}</p>
        </div>
      ) : (
        <p>Yüklənir...</p>
      )}
    </div>
  );
};

export default ProfilePage;
