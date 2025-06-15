import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import axios from '../../api/axios';

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Yoxlanılır...');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get('token');
      if (!token) {
        setMessage('Doğrulama tokeni tapılmadı.');
        return;
      }

      try {
        const res = await axios.get(`/verify-email?token=${token}`);
        setMessage(res.data.message);
        setSuccess(true);
      } catch (err) {
        setMessage(err.response?.data?.message || 'Doğrulama zamanı xəta baş verdi.');
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Email Doğrulama</h2>
      <p style={{ color: success ? 'green' : 'red' }}>{message}</p>
    </div>
  );
};

export default VerifyEmailPage;
