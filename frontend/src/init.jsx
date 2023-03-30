import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/collapse';
import 'bootstrap/js/dist/dropdown';
import 'bootstrap/js/dist/modal';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Provider as RollbarProvide, ErrorBoundary } from '@rollbar/react';
import filter from 'leo-profanity';

import App from './components/App';
import resources from './locales/index.js';
import store from './slices/store.js';
import { actions as messagesActions } from './slices/messagesSlice.js';
import { actions as channelsActions } from './slices/channelsSlice.js';
import ApiContext from './hooks/ApiContextProvider.jsx';

const init = async (socket) => {
  filter.add(filter.getDictionary('ru'));

  const emittingEvents = (evens, arg) => new Promise((resolve, reject) => {
    socket.emit(evens, arg, (response) => (response.status === 'ok' ? resolve(response.data) : reject()));
  });

  const addMessage = (text, username, channelId) => emittingEvents('newMessage', { text, username, channelId });

  const addChannel = (name) => emittingEvents('newChannel', { name });

  const removeChannel = (id) => emittingEvents('removeChannel', { id });

  const renameChannel = (name, id) => emittingEvents('renameChannel', { name, id });

  socket.on('newMessage', (payload) => {
    store.dispatch(messagesActions.addMessage(payload));
  });
  socket.on('newChannel', (payload) => {
    store.dispatch(channelsActions.addChannel(payload));
  });
  socket.on('removeChannel', (payload) => {
    store.dispatch(channelsActions.removeChannel(payload));
  });
  socket.on('renameChannel', (payload) => {
    store.dispatch(channelsActions.renameChannel(payload));
  });

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_SECRET_CODE,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: 'production',
    },
  };

  const i18n = i18next.createInstance();

  await i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'ru',
      fallbackLng: 'ru',
    });

  const api = {
    addMessage,
    addChannel,
    removeChannel,
    renameChannel,
  };

  return (
    <RollbarProvide config={rollbarConfig}>
      <ErrorBoundary>
        <Provider store={store}>
          <ApiContext.Provider value={api}>
            <BrowserRouter>
              <I18nextProvider i18n={i18n}>
                <App />
              </I18nextProvider>
            </BrowserRouter>
          </ApiContext.Provider>
        </Provider>
      </ErrorBoundary>
    </RollbarProvide>
  );
};

export default init;
