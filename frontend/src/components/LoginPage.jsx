import React, { useState, useRef, useEffect } from 'react';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { Form } from 'react-bootstrap';
import axios from 'axios';
import { toast } from 'react-toastify';

import login from '../images/login.jpg';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [authFailed, setAuthFailed] = useState(false);
  const { logIn } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    validationSchema: yup.object({
      username: yup.string().trim().required(),
      password: yup.string().required(),
    }),
    onSubmit: async (values) => {
      setAuthFailed(false);
      try {
        const { data } = await axios.post(routes.loginPath(), values);
        logIn(data);
        navigate(routes.chatPadePath(), { replace: true });
      } catch (err) {
        if (err.response?.status === 401) { // eslint-disable-line
          setAuthFailed(true);
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
    <div className="container-fluid h-100">
      <div className="row justify-content-center align-content-center h-100">
        <div className="col-12 col-md-8 col-xxl-6">
          <div className="card shadow-sm">
            <div className="card-body row p-5">
              <div className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img src={login} className="rounded-circle" alt="Войти" />
              </div>
              <Form className="col-12 col-md-6 mt-3 mt-mb-0" onSubmit={formik.handleSubmit}>
                <h1 className="text-center mb-4">{t('login.header')}</h1>
                <Form.Group className="form-floating mb-3">
                  <Form.Control
                    name="username"
                    autoComplete="username"
                    required=""
                    placeholder={t('login.username')}
                    id="username"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.username}
                    isInvalid={authFailed}
                    ref={input}
                  />
                  <Form.Label className="form-label" htmlFor="username">{t('login.username')}</Form.Label>
                </Form.Group>
                <Form.Group className="form-floating mb-4">
                  <Form.Control
                    name="password"
                    autoComplete="current-password"
                    required=""
                    placeholder={t('login.password')}
                    type="password"
                    id="password"
                    className="form-control"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                    isInvalid={authFailed}
                  />
                  <Form.Label className="form-label" htmlFor="password">{t('login.password')}</Form.Label>
                  <Form.Control.Feedback type="invalid">{t('login.authFailed')}</Form.Control.Feedback>
                </Form.Group>
                <button type="submit" disabled={formik.isSubmitting} className="w-100 mb-3 btn btn-outline-primary">{t('login.submit')}</button>
              </Form>
            </div>
            <div className="card-footer p-4">
              <div className="text-center">
                <span>{t('login.newToChat')}</span>
                <Link to={routes.signupPadePath()}>{t('login.signup')}</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
