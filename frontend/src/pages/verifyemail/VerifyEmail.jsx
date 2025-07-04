import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/verify/${token}`);
        toast.success(res.data.message);
        navigate('/home');
      } catch (err) {
        toast.error('Təsdiqləmə uğursuz oldu');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [token, navigate]);

  if (loading) return <p>Yüklənir...</p>;

  return null;
};

export default VerifyEmail;
