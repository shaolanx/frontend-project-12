/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { actions as channelsActions } from './channelsSlice';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setInitialMessages(state, { payload }) {
      const { messages } = payload;
      state.messages = messages;
    },
    addMessage(state, { payload }) {
      state.messages.push(payload);
    },
    extraReducers: (builder) => {
      builder.addCase(channelsActions.removeChannel, (state, { payload }) => {
        const { id } = payload;
        const newMessange = state.messages.filter(({ channelId }) => channelId !== id);
        state.messages = newMessange;
      });
    },
  },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
