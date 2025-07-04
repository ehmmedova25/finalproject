import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser, loadUser } from "../../redux/reducers/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import axiosInstance from "../../api/axiosInstance";
import styles from "./Login.module.css";
import { Link } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const redirectByRole = (user) => {
    if (user.role === "admin") navigate("/dashboard/admin");
    else navigate("/dashboard/user");
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axiosInstance.post("/auth/google-login", {
        token: credentialResponse.credential,
      });

      const { token, user } = res.data;
      dispatch(setUser({ token, user }));
      await dispatch(loadUser());
      toast.success("Google ilə daxil oldunuz!");
      redirectByRole(user);
    } catch (err) {
      toast.error("Google login uğursuz oldu");
      console.error(err);
    }
  };

  const initialValues = { email: "", password: "" };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Email düzgün deyil")
      .required("Email tələb olunur"),
    password: Yup.string().required("Şifrə tələb olunur"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const res = await axiosInstance.post("/auth/login", values);
      const { token, user } = res.data;
      dispatch(setUser({ token, user }));
      await dispatch(loadUser());
      toast.success("Uğurla daxil oldunuz!");
      redirectByRole(user);
    } catch (err) {
      toast.error(err.response?.data?.message || "Xəta baş verdi");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formBox}>
        <h2 className={styles.title}>Daxil ol</h2>
        <p className={styles.subtext}>
          Yüzlərlə resept və ev yeməyi sizi gözləyir!
        </p>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className={styles.form}>
              <div className={styles.fieldGroup}>
                <Field type="email" name="email" placeholder="Email" />
                <ErrorMessage
                  name="email"
                  component="div"
                  className={styles.error}
                />
              </div>
              <div className={styles.fieldGroup}>
                <Field type="password" name="password" placeholder="Şifrə" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className={styles.error}
                />
              </div>

              <div style={{ textAlign: "right", marginTop: "0.5rem" }}>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: "0.9rem",
                    color: "#555",
                    textDecoration: "underline",
                  }}
                >
                  Şifrəni unutdun?
                </Link>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={styles.submitBtn}
              >
                Daxil ol
              </button>
            </Form>
          )}
        </Formik>

        <div className={styles.divider}>və ya</div>

        <div className={styles.googleLogin}>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => toast.error("Google login uğursuz oldu")}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
