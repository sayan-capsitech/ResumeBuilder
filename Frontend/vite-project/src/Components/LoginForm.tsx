import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { TextField, PrimaryButton, Stack } from '@fluentui/react';

const validationSchema = Yup.object({
  username: Yup.string().required('Username is required'),
  password: Yup.string()
    .min(3, 'Password must be at least 3 characters')
    .required('Password is required'),
});
const LoginForm = ({ onLoginSuccess}) => {
    
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '91vh', backgroundColor: '#d5eeff', padding:'40px'}}>
      <Stack
        style={{ padding: 20,  width: '350px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', borderRadius: 8, backgroundColor: '#ffffff' }}
        tokens={{ childrenGap: 20 }}
      >
        <h2 style={{ textAlign: 'center', color: '#0078d4', marginBottom: 10 }}>Login</h2>
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={(values) => {
            if (values.username === 'admin' && values.password === '123') {
              onLoginSuccess();
            //   navigate('/dashboard');
            } else {
              alert('Invalid credentials');
            }
          }}
        >
          {({ errors, touched }) => (
            <Form>
              <Stack tokens={{ childrenGap: 15 }}>
                <Field name="username">
                  {({ field }) => (
                    <TextField
                      label="Username"
                      {...field}
                      errorMessage={touched.username && errors.username}
                      required
                    />
                  )}
                </Field>
                <Field name="password">
                  {({ field }) => (
                    <TextField
                      label="Password"
                      type="password"
                      {...field}
                      errorMessage={touched.password && errors.password}
                      required
                    />
                  )}
                </Field>
                <PrimaryButton type="submit" text="Login" style={{ width: '100%' }} />
              </Stack>
            </Form>
          )}
        </Formik>
      </Stack>
    </div>
  );
};
export default LoginForm;