import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const initialValues = { email: '' };

  const validationSchema = Yup.object({
    email: Yup.string().email('Email düzgün deyil').required('Email tələb olunur'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axiosInstance.post('/auth/forgot-password', values);
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Şifrəni unutmusunuz?</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Email:</label>
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>Link göndər</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ForgotPassword;
