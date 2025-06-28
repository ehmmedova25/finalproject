import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./Register.module.css"


const Register = () => {
  const navigate = useNavigate();

  const initialValues = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
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
    role: Yup.string().oneOf(['user', 'seller']),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await axios.post('http://localhost:5000/api/register', values);
      toast.success(response.data.message);
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-container">
      <h2>Qeydiyyat</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Ad:</label>
              <Field type="text" name="firstName" />
              <ErrorMessage name="firstName" component="div" />
            </div>

            <div>
              <label>Soyad:</label>
              <Field type="text" name="lastName" />
              <ErrorMessage name="lastName" component="div" />
            </div>

            <div>
              <label>İstifadəçi adı:</label>
              <Field type="text" name="username" />
              <ErrorMessage name="username" component="div" />
            </div>

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

            <div>
              <label>Təkrar şifrə:</label>
              <Field type="password" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" />
            </div>

            <div>
              <label>Rol:</label>
              <Field as="select" name="role">
                <option value="user">Müştəri</option>
                <option value="seller">Aşbaz</option>
              </Field>
              <ErrorMessage name="role" component="div" />
            </div>

            <button type="submit" disabled={isSubmitting}>Qeydiyyatdan keç</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default Register;
