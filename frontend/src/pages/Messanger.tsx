import { Navbar, Conversation, Message, ChatOnline } from '../components';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';
import { ServerToClientEvents, ClientToServerEvents } from '../interfaces';
import {
  setConversations,
  setMessages,
  addMessage,
} from '../features/conversations/conversationsSlice';
import axios from 'axios';
import { IOnlineUser } from '../interfaces';
import { io, Socket } from 'socket.io-client';

const Messanger = () => {
  const dispatch = useDispatch();
  const { user } = useAppSelector((state) => state.user);
  const { conversations, selectedConversation, messages } = useAppSelector(
    (state) => state.conversations
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [refetchMessages, setRefetchMessages] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<IOnlineUser[]>([]);
  const socket = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);
  useEffect(() => {
    socket?.current?.on('getMessage', () => {
      setRefetchMessages(!refetchMessages);
    });
  });
  useEffect(() => {
    socket.current = io('http://localhost:8900');
  }, []);

  useEffect(() => {
    socket?.current?.emit('addUser', user._id);
    socket?.current?.on('getUsers', (users) => {
      setOnlineUsers(users);
    });
  }, [user]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get('/conversations/' + user?._id);
        dispatch(setConversations(data));
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [dispatch, user._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (selectedConversation) {
          const { data } = await axios.get(
            '/messages/' + selectedConversation?._id
          );
          dispatch(setMessages(data));
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
  }, [selectedConversation, dispatch, refetchMessages]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    try {
      const { data } = await axios.post('/messages/', {
        sender: user._id,
        text: newMessage,
        conversationId: selectedConversation?._id,
      });
      dispatch(addMessage(data));
      const receiver = selectedConversation?.members.find(
        (m) => user._id !== m._id
      );
      socket?.current?.emit('sendMessage', receiver?._id!);
    } catch (error) {
      console.log(error);
    }
    setNewMessage('');
  };
  return (
    <>
      <Navbar />
      <div className="messanger">
        <div className="messanger__menu">
          <input
            type="text"
            placeholder="Search for friends"
            className="messanger__input--menu"
          />
          {conversations &&
            conversations.map((c) => (
              <Conversation key={c._id} conversation={c} />
            ))}
        </div>
        <div className="messanger__box">
          {selectedConversation ? (
            <>
              <div className="messanger__box--top">
                {messages &&
                  messages.map((m) => (
                    <Message
                      key={m._id}
                      message={m}
                      own={m.sender._id === user._id}
                    />
                  ))}
                <div ref={scrollRef}></div>
              </div>
              <form
                className="messanger__box--bottom"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
              >
                <textarea
                  placeholder="Write something"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSend();
                  }}
                  className="messanger__input--message"
                />
                <button type="submit" className="messanger__btn--submit">
                  Send
                </button>
              </form>{' '}
            </>
          ) : (
            <span className="messanger__select-text">
              Select chat to send messages
            </span>
          )}
        </div>
        <div className="messanger__online">
          <ChatOnline onlineUsers={onlineUsers} />
        </div>
      </div>
    </>
  );
};

export default Messanger;
