import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const initialValues = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(6, "Minimum 6 simvol olmalıdır")
      .required("Şifrə tələb olunur"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Şifrələr uyğun deyil")
      .required("Təsdiq şifrə tələb olunur"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axiosInstance.post(`/auth/reset-password/${token}`, values);
      toast.success(res.data.message);
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Xəta baş verdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Yeni şifrə təyin et</h2>
      <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
        {({ isSubmitting }) => (
          <Form>
            <div>
              <label>Yeni Şifrə:</label>
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" />
            </div>
            <div>
              <label>Şifrəni Təsdiqlə:</label>
              <Field type="password" name="confirmPassword" />
              <ErrorMessage name="confirmPassword" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>Yenilə</button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default ResetPassword;
