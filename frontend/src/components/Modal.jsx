import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import * as yup from 'yup';

import { useApi } from '../hooks/index.jsx';
import { actions as modalActions } from '../slices/modalSlice.js';
import { actions as channelsActions } from '../slices/channelsSlice.js';

const AddChannelModal = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { addChannel } = useApi();
  const { channels } = useSelector((state) => state.channelsReducer);
  const { show } = useSelector((state) => state.modalReducer);
  const namesChannels = channels.map(({ name }) => name);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      name: '',
    },
    validationSchema: yup.object({
      name: yup.string().required(t('channel.requiredField')).notOneOf(namesChannels, t('channel.feedback')),
    }),
    validateOnChange: false,
    onSubmit: async ({ name }) => {
      try {
        const { id } = await addChannel(name);
        dispatch(channelsActions.switchChannel(id));
        dispatch(modalActions.closeModal());
        toast.success(t('channel.created'));
      } catch {
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
    <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered tabIndex="-1" style={{ display: 'block' }}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title h4">{t('channel.addChannel')}</Modal.Title>
        <button type="button" aria-label="Close" data-bs-dismiss="modal" className="btn btn-close" onClick={handleClose} />
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Form className="" onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              name="name"
              id="name"
              className="mb-2 form-control"
              value={formik.values.name}
              onChange={formik.handleChange}
              ref={input}
              isInvalid={formik.errors.name}
            />
            <Form.Label className="visually-hidden" htmlFor="name">{t('channel.nameChannel')}</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button type="button" disabled={formik.isSubmitting} className="me-2 btn btn-secondary" onClick={handleClose}>{t('channel.cancel')}</Button>
              <Button type="submit" disabled={formik.isSubmitting} className="btn btn-primary">{t('channel.send')}</Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const RenameCannel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { renameChannel } = useApi();
  const { channelId, show } = useSelector((state) => state.modalReducer);
  const { channels } = useSelector((state) => state.channelsReducer);
  const namesChannels = channels.map(({ name }) => name);
  const currentChannel = channels.find(({ id }) => id === channelId);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      name: currentChannel.name,
    },
    validationSchema: yup.object({
      name: yup.string().required(t('channel.requiredField')).notOneOf(namesChannels, t('channel.feedback')),
    }),
    validateOnChange: false,
    onSubmit: async ({ name }) => {
      try {
        await renameChannel(name, channelId);
        dispatch(modalActions.closeModal());
        toast.success(t('channel.renamed'));
      } catch {
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
  useEffect(() => input.current.select(), []);

  return (
    <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered tabIndex="-1" style={{ display: 'block' }}>
      <Modal.Header className="modal-header">
        <Modal.Title className="modal-title h4">{t('channel.renameChannel')}</Modal.Title>
        <button type="button" aria-label="Close" data-bs-dismiss="modal" onClick={handleClose} className="btn btn-close" />
      </Modal.Header>
      <Modal.Body className="modal-body">
        <Form className="" onSubmit={formik.handleSubmit}>
          <Form.Group>
            <Form.Control
              name="name"
              id="name"
              className="mb-2 form-control"
              value={formik.values.name}
              onChange={formik.handleChange}
              ref={input}
              isInvalid={formik.errors.name}
            />
            <Form.Label className="visually-hidden" htmlFor="name">{t('channel.nameChannel')}</Form.Label>
            <Form.Control.Feedback type="invalid">{formik.errors.name}</Form.Control.Feedback>
            <div className="d-flex justify-content-end">
              <Button type="button" disabled={formik.isSubmitting} className="me-2 btn btn-secondary" onClick={handleClose}>{t('channel.cancel')}</Button>
              <Button type="submit" disabled={formik.isSubmitting} className="btn btn-primary">{t('channel.send')}</Button>
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

const RemoveChannel = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { removeChannel } = useApi();
  const { channelId, show } = useSelector((state) => state.modalReducer);
  const [loadingStatus, setLoadingStatus] = useState(false);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleRemove = async () => {
    await removeChannel(channelId);
    dispatch(modalActions.closeModal());
    setLoadingStatus(true);
    toast.success(t('channel.removed'));
  };

  return (
    <Modal show={show} aria-labelledby="contained-modal-title-vcenter" centered tabIndex="-1" style={{ display: 'block' }}>
      <Modal.Header className="modal-header">
        <div className="modal-title h4">{t('channel.removeChannel')}</div>
        <button type="button" aria-label="Close" data-bs-dismiss="modal" className="btn btn-close" onClick={handleClose} />
      </Modal.Header>
      <Modal.Body className="modal-body">
        <p className="lead">{t('channel.truly')}</p>
        <div className="d-flex justify-content-end">
          <button type="button" className="me-2 btn btn-secondary" disabled={loadingStatus} onClick={handleClose}>{t('channel.cancel')}</button>
          <button type="button" className="btn btn-danger" disabled={loadingStatus} onClick={handleRemove}>{t('channel.remove')}</button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

const listModal = {
  addChannel: AddChannelModal,
  removeCannel: RemoveChannel,
  renameCannel: RenameCannel,
};

const ModalContainer = () => {
  const { modalType } = useSelector((state) => state.modalReducer);
  const ActiveModal = listModal[modalType];
  return modalType ? <ActiveModal /> : '';
};

export default ModalContainer;
