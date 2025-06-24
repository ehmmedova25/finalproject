import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/reducers/authSlice';
import { jwtDecode } from 'jwt-decode'; 
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();const handleGoogleLogin = async (credentialResponse) => {
  try {
    const res = await axios.post('http://localhost:5000/api/google-login', {
      token: credentialResponse.credential,
    });
    const { token } = res.data;
    const decodedUser = jwtDecode(token);
    dispatch(setUser({ user: decodedUser, token }));
    localStorage.setItem('token', token);
    toast.success('Google ilə daxil oldunuz!');
    navigate('/dashboard');
  } catch (err) {
    toast.error('Google login uğursuz oldu');
  }
};


  const initialValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Email düzgün deyil').required('Email tələb olunur'),
    password: Yup.string().required('Şifrə tələb olunur'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', values);
      const { token } = res.data;
      const decodedUser = jwtDecode(token);
      dispatch(setUser({ user: decodedUser, token }));
      localStorage.setItem('token', token);
      toast.success('Uğurla daxil oldunuz!');
      navigate('/home');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Daxil ol</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <div>
              <label>Şifrə:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>Daxil ol</button>
          </Form>
        )}
      </Formik>
<GoogleLogin
  onSuccess={handleGoogleLogin}
  onError={() => toast.error('Google login uğursuz oldu')}
/>
    </div>
  );
};






export default Login;

