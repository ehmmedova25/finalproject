import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/reducers/authSlice';
import { GoogleLogin } from '@react-oauth/google';
import axiosInstance from '../../api/axiosInstance';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

 const handleGoogleLogin = async (credentialResponse) => {
  try {
    const res = await axiosInstance.post('/auth/google-login', {
      token: credentialResponse.credential,
    });

    const { token, user } = res.data;

    dispatch(setUser({ token, user }));

    toast.success('Google ilə daxil oldunuz!');
    navigate('/');
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
      const res = await axiosInstance.post('/auth/login', values);
      dispatch(setUser(res.data.user));
      toast.success('Uğurla daxil oldunuz!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Daxil ol</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
