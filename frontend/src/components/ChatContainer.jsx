import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Form } from 'react-bootstrap';
import { useApi, useAuth } from '../hooks/index.jsx';

const Messages = ({ author, message }) => (
  <div className="text-break mb-2">
    <b>{author}</b>
    {`: ${message}`}
  </div>
);

const ChatContainer = () => {
  const { t } = useTranslation();
  const { addMessage } = useApi();
  const { user } = useAuth();
  const currentUser = user.username;

  const { messages } = useSelector((store) => store.messagesReducer);
  const { currentChannelId, channels } = useSelector((state) => state.channelsReducer);
  const currentChanel = channels.find(({ id }) => currentChannelId === id);
  const filteredMaeesnge = messages.filter(({ channelId }) => channelId === currentChannelId);
  const nameChannel = currentChanel ? `# ${filter.clean(currentChanel.name)}` : '# general';

  const input = useRef(null);
  useEffect(() => input.current.focus(), []);

  const formik = useFormik({
    initialValues: {
      body: '',
    },
    validationSchema: yup.object({
      body: yup.string().required(),
    }),
    onSubmit: async ({ body }) => {
      try {
        await addMessage(filter.clean(body), currentUser, currentChannelId);
        formik.values.body = '';
      } catch {
        if (err.isAxiosError) { // eslint-disable-line
          toast.error(t('errors.network'));
        } else {
          toast.error(t('errors.unknown'));
        }
      }
    },
  });

  return (
    <div className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>{nameChannel}</b>
          </p>
          <span className="text-muted">{`${filteredMaeesnge.length} ${t('chat.messageCount', { count: filteredMaeesnge.length })}`}</span>
        </div>
        <div id="messages-box" className="chat-messages overflow-auto px-5">
          {filteredMaeesnge.map(({
            text, username, channelId, id,
          }) => (
            <Messages
              key={id}
              message={text}
              author={username}
              channelId={channelId}
            />
          ))}
        </div>
        <div className="mt-auto px-5 py-3">
          <Form noValidate="" className="py-1 border rounded-2" onSubmit={formik.handleSubmit}>
            <Form.Group className="input-group has-validation">
              <Form.Control
                name="body"
                aria-label={t('chat.newMessage')}
                placeholder={t('chat.enterMessage')}
                className="border-0 p-0 ps-2 form-control"
                value={formik.values.body}
                onChange={formik.handleChange}
                ref={input}
              />
              <button type="submit" disabled={formik.values.body === ''} className="btn btn-group-vertical">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                  <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
                </svg>
                <span className="visually-hidden">{t('channel.send')}</span>
              </button>
            </Form.Group>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default ChatContainer;
