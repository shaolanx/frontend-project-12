import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import error from '../images/404Error.svg';
import routes from '../routes.js';

const ErrorPage = () => {
  const { t } = useTranslation();
  return (
    <div className="text-center">
      <img alt={t('errors.pageNotFound')} className="img-fluid h-25" src={error} />
      <h1 className="h4 text-muted">{t('errors.pageNotFound')}</h1>
      <p className="text-muted">
        {t('errors.go')}
        <Link to={routes.chatPadePath()}>{` ${t('errors.homePage')}`}</Link>
      </p>
    </div>
  );
};

export default ErrorPage;
