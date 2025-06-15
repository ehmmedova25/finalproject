import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slices/authSlice';
import { useNavigate } from 'react-router';
import GoogleLoginButton from '../../components/googleloginbutton/GoogleLoginButton';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector(state => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginUser({ email, password }));
    if (result.meta.requestStatus === 'fulfilled') {
      navigate('/profile');
    }
  };

  return (
    <div>
      <h2>Daxil ol</h2>
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Şifrə" required />
        <button type="submit" disabled={loading}>{loading ? 'Yüklənir...' : 'Daxil ol'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <GoogleLoginButton />
    </div>
  );
};

export default LoginPage;
