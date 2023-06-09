import axios from 'axios';
import React, { useEffect, useState } from 'react';
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

  const [loaded, setLoadStatus] = useState(true);

  useEffect(() => {
    axios.get(routes.dataPath(), { headers: getAuthHeader() })
      .then(({ data }) => {
        dispatch(channelsActions.setInitialChannels(data));
        dispatch(messagesActions.setInitialMessages(data));
        setLoadStatus(false);
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

  const dataUnLoaded = (
    <div className="h-100 d-flex justify-content-center align-items-center">
      <div role="status" className="spinner-border text-primary">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );

  const dataLoaded = (
    <div className="container h-100 my-4 overflow-hidden rounded shadow">
      <div className="row h-100 bg-white flex-md-row">
        <ChannelsContainer />
        <ChatContainer />
        <ModalContainer />
      </div>
    </div>
  );

  return loaded === true ? dataUnLoaded : dataLoaded;
};

export default MainPage;
