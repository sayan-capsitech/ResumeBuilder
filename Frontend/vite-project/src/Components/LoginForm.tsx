/* eslint-disable @typescript-eslint/no-explicit-any */
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { TextField, PrimaryButton, Stack } from "@fluentui/react";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  password: Yup.string()
    .min(3, "Password must be at least 3 characters")
    .required("Password is required"),
});
const LoginForm = () => {
  const navigate = useNavigate();
  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const response = await axios.post(
        "http://localhost:5232/api/Login/validate",
        values
      );
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem("token", token);
        navigate("/dashboard"); // Navigate to dashboard
      }
    } catch (error:any) {
      if (error.response?.status === 401) {
        alert(error.response.data.message || "Invalid credentials");
      } else {
        alert("An error occurred. Please try again later.");
      }
      console.log("Error :", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "91vh",
        backgroundColor: "#d5eeff",
        padding: "40px",
      }}
    >
      <Stack
        style={{
          padding: 20,
          width: "350px",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          borderRadius: 8,
          backgroundColor: "#ffffff",
        }}
        tokens={{ childrenGap: 20 }}
      >
        <h2 style={{ textAlign: "center", color: "#0078d4", marginBottom: 10 }}>
          Login
        </h2>
        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched }) => (
            <Form>
              <Stack tokens={{ childrenGap: 15 }}>
                {/* Username Field */}
                <Field name="username">
                  {({ field }: any) => (
                    <TextField
                      label="Username"
                      {...field}
                      errorMessage={
                        touched.username && errors.username
                          ? errors.username
                          : undefined
                      }
                      required
                    />
                  )}
                </Field>
                {/* Password Field */}
                <Field name="password">
                  {({ field }: any) => (
                    <TextField
                      label="Password"
                      type="password"
                      {...field}
                      errorMessage={
                        touched.password && errors.password
                          ? errors.password
                          : undefined
                      }
                      required
                    />
                  )}
                </Field>
                {/* Submit Button */}
                <PrimaryButton
                  type="submit"
                  text="Login"
                  style={{ width: "100%" }}
                />
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </div>
  );
};
export default LoginForm;