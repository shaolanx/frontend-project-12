import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/index.jsx';
import routes from '../routes.js';

const Layout = () => {
  const { logOut, user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleClick = () => {
    logOut();
    navigate(routes.loginPadePath(), { replace: true });
  };

  return (
    <nav className="shadow-sm navbar navbar-expand-lg navbar-light bg-white">
      <div className="container">
        <Link className="navbar-brand" to={routes.chatPadePath()}>Hexlet Chat</Link>
        {user && <button type="button" className="btn btn-primary" onClick={handleClick}>{t('chat.logOff')}</button>}
      </div>
    </nav>
  );
};

export default Layout;
