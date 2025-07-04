import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styles from './Register.module.css';


const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validationSchema = Yup.object({
    firstName: Yup.string().required('Ad tələb olunur'),
    lastName: Yup.string().required('Soyad tələb olunur'),
    username: Yup.string().required('İstifadəçi adı tələb olunur'),
    email: Yup.string().email('Email düzgün deyil').required('Email tələb olunur'),
    password: Yup.string().min(6, 'Minimum 6 simvol').required('Şifrə tələb olunur'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Şifrələr uyğun deyil')
      .required('Təkrar şifrə tələb olunur'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axiosInstance.post('/auth/register', values);
      toast.success(res.data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Qeydiyyat</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <div><label>Ad:</label><Field type="text" name="firstName" /><ErrorMessage name="firstName" component="div" /></div>
            <div><label>Soyad:</label><Field type="text" name="lastName" /><ErrorMessage name="lastName" component="div" /></div>
            <div><label>İstifadəçi adı:</label><Field type="text" name="username" /><ErrorMessage name="username" component="div" /></div>
            <div><label>Email:</label><Field type="email" name="email" /><ErrorMessage name="email" component="div" /></div>
            <div><label>Şifrə:</label><Field type="password" name="password" /><ErrorMessage name="password" component="div" /></div>
            <div><label>Təkrar şifrə:</label><Field type="password" name="confirmPassword" /><ErrorMessage name="confirmPassword" component="div" /></div>
            <button type="submit" disabled={isSubmitting}>Qeydiyyatdan keç</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
