import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';
import { useAuth } from '../hooks/index.jsx';
import ChannelsContainer from './ChannelsContainer.jsx';
import ChatContainer from './ChatContainer.jsx';
import ModalContainer from './Modal.jsx';
import routes from '../routes.js';

const MainPage = () => {
  const { getAuthHeader, logOut } = useAuth();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(routes.dataPath(), { headers: getAuthHeader() })
      .then(({ data }) => {
        dispatch(channelsActions.setInitialChannels(data));
        dispatch(messagesActions.setInitialMessages(data));
      })
      .catch((err) => {
        const trowAxiosError = () => {
          const errorMessage = err.isAxiosError ? 'network' : 'unknown';
          return toast.error(t(`errors.${errorMessage}`));
        };
        const returnToLoginPage = () => {
          logOut();
          navigate(routes.loginPagePath(), { replace: true });
        };
        const trowErr = err.response?.status === 401 ? returnToLoginPage() : trowAxiosError(err);
        trowErr();
      });
  });

  return (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="d-flex position-absolute justify-content-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Загрузка...</span>
        </div>
      </div>
      <div className="row h-100 bg-white flex-md-row">
        <ChannelsContainer />
        <ChatContainer />
        <ModalContainer />
      </div>
    </div>
  );
};

export default MainPage;
