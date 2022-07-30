import { createSlice } from '@reduxjs/toolkit';
import { IConversation, IMessage } from '../../interfaces';

type initialStateType = {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  messages: IMessage[];
};

const initialState: initialStateType = {
  conversations: [],
  selectedConversation: null,
  messages: [],
};

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    selectConversation: (state, action) => {
      state.selectedConversation = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
  },
});

export const { setConversations, selectConversation, setMessages, addMessage } =
  conversationsSlice.actions;

export default conversationsSlice.reducer;
