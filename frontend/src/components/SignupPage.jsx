import React, { useState, useRef, useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

import signup from '../images/login.jpg';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes';

const SignupPage = () => {
  const { t } = useTranslation();
  const { logIn } = useAuth();
  const navigate = useNavigate();
  const [userAlreadyExists, setUsedAlreadyExists] = useState(false);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .trim()
        .min(3, t('signup.usernameConstraints'))
        .max(20, t('signup.usernameConstraints'))
        .required(t('signup.requiredField')),
      password: yup
        .string()
        .min(6, t('signup.passwordConstraints'))
        .required(t('signup.requiredField')),
      confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], t('signup.confirmPasswordConstraints')),
    }),
    onSubmit: async ({ username, password }) => {
      setUsedAlreadyExists(false);
      try {
        const { data } = await axios.post(routes.signupPath(), { username, password });
        logIn(data);
        navigate(routes.chatPadePath(), { replace: true });
      } catch (err) {
        if (err.response?.status === 409) { // eslint-disable-line
          setUsedAlreadyExists(true);
          return;
        }

        if (err.isAxiosError) { // eslint-disable-line
          toast.error(t('errors.network'));
        } else {
          toast.error(t('errors.unknown'));
        }
      }
    },
  });

  const input = useRef(null);
  useEffect(() => input.current.focus(), []);

  return (
    <div className="row justify-content-center align-content-center h-100">
      <div className="col-12 col-md-8 col-xxl-6">
        <div className="card shadow-sm">
          <div className="card-body d-flex flex-column flex-md-row justify-content-around align-items-center p-5">
            <div>
              <img src={signup} className="rounded-circle" alt={t('signup.header')} />
            </div>
            <Form className="w-50" onSubmit={formik.handleSubmit}>
              <h1 className="text-center mb-4">{t('signup.header')}</h1>
              <Form.Group className="form-floating mb-3">
                <Form.Control
                  placeholder={t('signup.usernameConstraints')}
                  name="username"
                  autoComplete="username"
                  required
                  id="username"
                  className="form-control"
                  ref={input}
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    (formik.errors.username && formik.touched.username)
                    || userAlreadyExists || false
                  }
                />
                <Form.Label className="form-label" htmlFor="username">{t('signup.username')}</Form.Label>
                <Form.Control.Feedback type="invalid" className="invalid-tooltip">{formik.errors.username}</Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="form-floating mb-3">
                <Form.Control
                  placeholder={t('signup.passwordConstraints')}
                  name="password"
                  aria-describedby="passwordHelpBlock"
                  required
                  autoComplete="new-password"
                  type="password"
                  id="password"
                  className="form-control"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    (formik.errors.password && formik.touched.password)
                    || userAlreadyExists || false
                  }
                />
                <Form.Control.Feedback type="invalid" className="invalid-tooltip">{formik.errors.password}</Form.Control.Feedback>
                <Form.Label className="form-label" htmlFor="password">{t('signup.password')}</Form.Label>
              </Form.Group>
              <Form.Group className="form-floating mb-4">
                <Form.Control
                  placeholder={t('signup.confirmPasswordConstraints')}
                  name="confirmPassword"
                  required
                  autoComplete="new-password"
                  type="password"
                  id="confirmPassword"
                  className="form-control"
                  value={formik.values.confirmPassword}
                  onChange={formik.handleChange}
                  isInvalid={formik.errors.confirmPassword || userAlreadyExists || false}
                />
                <Form.Control.Feedback type="invalid" className="invalid-tooltip">{formik.errors.confirmPassword || (userAlreadyExists && t('signup.alreadyExists'))}</Form.Control.Feedback>
                <Form.Label className="form-label" htmlFor="confirmPassword">{t('signup.confirmPassword')}</Form.Label>
              </Form.Group>
              <button type="submit" disabled={formik.isSubmitting} className="w-100 btn btn-outline-primary">{t('signup.register')}</button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
