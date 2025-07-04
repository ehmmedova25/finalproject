import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import styles from "./CheckoutForm.module.css";

const CheckoutForm = () => {
  const { items } = useSelector((state) => state.cart);

  const initialValues = {
    name: "",
    email: "",
    address: "",
    city: "",
    prefix: "+994",
    phone: "",
    deliveryMethod: "delivery",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Ad tələb olunur"),
    email: Yup.string().email("Etibarlı email daxil edin").required("Email tələb olunur"),
    address: Yup.string().required("Ünvan tələb olunur"),
    city: Yup.string().required("Şəhər tələb olunur"),
    prefix: Yup.string().required("Prefiks tələb olunur"),
    phone: Yup.string()
      .matches(/^\d{9}$/, "9 rəqəmli telefon nömrəsi daxil edin (501234567)")
      .required("Telefon nömrəsi tələb olunur"),
    deliveryMethod: Yup.string()
      .oneOf(["delivery", "pickup"], "Çatdırılma növü mütləqdir")
      .required("Çatdırılma növü tələb olunur"),
  });

  const onSubmit = async (values, { setSubmitting }) => {
    try {
      if (!items || items.length === 0) {
        toast.error("Səbətiniz boşdur!");
        return;
      }

      const customerInfo = {
        name: values.name,
        email: values.email,
        address: values.address,
        city: values.city,
        phone: `${values.prefix}${values.phone}`,
        deliveryMethod: values.deliveryMethod, 
      };

      console.log("🛒 Sending to payment:", { items, customerInfo });

      localStorage.setItem("cartItems", JSON.stringify(items));
      localStorage.setItem("customerInfo", JSON.stringify(customerInfo));

      const res = await axiosInstance.post("/payment/create-checkout-session", {
        items,
        customerInfo,
      });

      if (res.data.url) {
        console.log("✅ Redirecting to Stripe:", res.data.url);
        window.location.href = res.data.url;
      } else {
        throw new Error("Stripe URL alınmadı");
      }
    } catch (error) {
      console.error("❌ Ödəniş xətası:", error.response?.data || error.message);
      toast.error("Ödəniş zamanı xəta baş verdi!");
    } finally {
      setSubmitting(false);
    }
  };

  if (!items || items.length === 0) {
    return (
      <div className={styles.container}>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <h2>🛒 Səbətiniz boşdur</h2>
          <p>Ödəniş etmək üçün əvvəlcə məhsulları səbətə əlavə edin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h2>Çatdırılma Məlumatları</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {({ isSubmitting }) => (
          <Form className={styles.form}>
            <label>Ad Soyad *</label>
            <Field name="name" type="text" placeholder="Adınızı və soyadınızı daxil edin" />
            <ErrorMessage name="name" component="div" className={styles.error} />

            <label>Email *</label>
            <Field name="email" type="email" placeholder="email@example.com" />
            <ErrorMessage name="email" component="div" className={styles.error} />

            <label>Ünvan *</label>
            <Field name="address" type="text" placeholder="Tam ünvanınızı daxil edin" />
            <ErrorMessage name="address" component="div" className={styles.error} />

            <label>Şəhər *</label>
            <Field name="city" type="text" placeholder="Şəhərinizi daxil edin" />
            <ErrorMessage name="city" component="div" className={styles.error} />

            <label>Telefon Nömrəsi *</label>
            <div className={styles.phoneGroup}>
              <Field as="select" name="prefix">
                <option value="+994">🇦🇿 +994</option>
                <option value="+90">🇹🇷 +90</option>
                <option value="+1">🇺🇸 +1</option>
              </Field>
              <Field
                name="phone"
                type="tel"
                placeholder="501234567"
                maxLength="9"
              />
            </div>
            <ErrorMessage name="phone" component="div" className={styles.error} />

            <label>Çatdırılma növü *</label>
            <Field as="select" name="deliveryMethod">
              <option value="delivery">Çatdırılma</option>
              <option value="pickup">Götürmə</option>
            </Field>
            <ErrorMessage name="deliveryMethod" component="div" className={styles.error} />

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Yönləndirilir..." : "Ödəniş et 💳"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default CheckoutForm;
