import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
       const res = await axios.get(`http://localhost:5000/api/verify/${token}`);
if (res.status === 200) {
  toast.success(res.data.message); // “Email təsdiqləndi!”
  navigate('/');
}

      } catch (err) {
        console.error(err.response?.data || err.message);
        toast.error('Təsdiqləmə zamanı xəta baş verdi.');
      } finally {
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  if (loading) return <p>Yüklənir...</p>;

  return null;
};

export default VerifyEmail;
