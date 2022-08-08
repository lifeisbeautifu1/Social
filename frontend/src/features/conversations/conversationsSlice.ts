import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IConversation, IMessage } from '../../interfaces';

type initialStateType = {
  conversations: IConversation[];
  selectedConversation: IConversation | null;
  messages: IMessage[];
  refetchMessages: boolean;
  isTyping: boolean;
};

const initialState: initialStateType = {
  conversations: [],
  selectedConversation: null,
  messages: [],
  refetchMessages: false,
  isTyping: false,
};

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
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
    setRefetchMessages: (state) => {
      state.refetchMessages = !state.refetchMessages;
    },
  },
});

export const {
  setConversations,
  selectConversation,
  setMessages,
  addMessage,
  setRefetchMessages,
  setIsTyping,
} = conversationsSlice.actions;

export default conversationsSlice.reducer;
