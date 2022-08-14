import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { IConversation, IMessage } from '../../interfaces';
import axios from 'axios';

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

export const fetchAndSetConversation = createAsyncThunk(
  '/conversations/fetchAndSetConversation',
  async (conversationId: any, thunkAPI) => {
    try {
      const { data } = await axios.get('/conversations/' + conversationId);
      return data;
    } catch (error) {
      thunkAPI.rejectWithValue(error);
    }
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchAndSetConversation.fulfilled, (state, action) => {
      state.selectedConversation = action.payload;
    });
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
