// src/pages/oauth/OAuthSuccessPage.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { setAccessToken } from '../../redux/slices/authSlice';

const OAuthSuccessPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      dispatch(setAccessToken(token));
      localStorage.setItem('accessToken', token);
      navigate('/profile');
    } else {
      navigate('/login');
    }
  }, [dispatch, navigate]);

  return <p>Yönləndirilir...</p>;
};

export default OAuthSuccessPage;
