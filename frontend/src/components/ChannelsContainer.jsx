import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import filter from 'leo-profanity';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as modalActions } from '../slices/modalSlice.js';

const Channels = ({
  name, id, isCurrent, removable,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classButtons = cn('w-100', 'rounded-0', 'text-start', 'text-truncate', 'btn', { 'btn-secondary': isCurrent });
  const dropDownButtonClass = cn('flex-grow-0', 'dropdown-toggle', 'dropdown-toggle-split', 'btn', { 'btn-secondary': isCurrent });
  const nameChanel = filter.clean(name);

  const handleClick = (channelId) => () => {
    dispatch(channelsActions.switchChannel(channelId));
  };

  const handleClickRemove = (channelId) => () => {
    dispatch(modalActions.openModal({ modalType: 'removeCannel', channelId }));
  };

  const handleClickRename = (channelId) => () => {
    dispatch(modalActions.openModal({ modalType: 'renameCannel', channelId }));
  };

  return (
    <li className="nav-item w-100">
      <div role="group" className="d-flex dropdown btn-group">
        <button type="button" className={classButtons} onClick={handleClick(id)}>
          <span className="me-1">#</span>
          {nameChanel}
        </button>
        {removable && (
          <>
            <button type="button" aria-expanded="false" className={dropDownButtonClass} data-bs-toggle="dropdown">
              <span className="visually-hidden">{t('channel.channelMenu')}</span>
            </button>
            <div className="dropdown-menu">
              <button type="button" className="dropdown-item" href="#" onClick={handleClickRemove(id)}>{t('channel.remove')}</button>
              <button type="button" className="dropdown-item" href="#" onClick={handleClickRename(id)}>{t('channel.rename')}</button>
            </div>
          </>
        )}
      </div>
    </li>
  );
};

const ChannelsContainer = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channelsReducer);

  const handleClickAdd = () => {
    dispatch(modalActions.openModal({ modalType: 'addChannel' }));
  };

  return (
    <div className="col-4 col-md-2 border-end px-0 bg-light flex-column h-100 d-flex">
      <div className="d-flex mt-1 justify-content-between mb-2 ps-4 pe-2 p-4">
        <b>{t('channel.header')}</b>
        <button type="button" className="p-0 text-primary btn btn-group-vertical" onClick={handleClickAdd}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul id="channels-box" className="nav flex-column nav-pills nav-fill px-2 mb-3 overflow-auto h-100 d-block">
        {channels.map(({ name, id, removable }) => (
          <Channels
            key={id}
            name={name}
            id={id}
            isCurrent={(currentChannelId === id)}
            removable={removable}
          />
        ))}
      </ul>
    </div>
  );
};

export default ChannelsContainer;
