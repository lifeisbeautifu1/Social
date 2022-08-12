import { Conversation, Message, ChatOnline } from '../components';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';
import {
  ServerToClientEvents,
  ClientToServerEvents,
  IUser,
  IConversation,
} from '../interfaces';
import {
  setOnlineUsers,
  deleteNotifications,
} from '../features/user/userSlice';
import {
  setConversations,
  setMessages,
  addMessage,
} from '../features/conversations/conversationsSlice';
import axios from 'axios';
import { Socket } from 'socket.io-client';
import animationData from '../animations/typing.json';
import Lottie from 'react-lottie';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};

type MessagerProps = {
  socket: React.MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
};

const Messanger: React.FC<MessagerProps> = ({ socket }) => {
  const dispatch = useDispatch();
  const { user, onlineUsers } = useAppSelector((state) => state.user);
  const {
    conversations,
    selectedConversation,
    messages,
    refetchMessages,
    isTyping,
  } = useAppSelector((state) => state.conversations);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState<IUser | null>(null);
  const [filter, setFilter] = useState('');

  const [typing, setTyping] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);

  const [filteredConversations, setFilteredConversations] = useState<
    IConversation[]
  >([]);

  useEffect(() => {
    socket?.current?.emit('addUser', user._id);
    socket?.current?.on('getUsers', (users) => {
      dispatch(setOnlineUsers(users));
    });
  }, [user, socket, dispatch]);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axios.get('/conversations', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        dispatch(setConversations(data));
        setFilteredConversations(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchConversations();
  }, [dispatch, user._id, user.token]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (selectedConversation) {
          const { data } = await axios.get(
            '/messages/' + selectedConversation?._id,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          dispatch(setMessages(data));
          const otherUser = selectedConversation.members.find(
            (m) => m._id !== user._id
          );
          // @ts-ignore
          dispatch(deleteNotifications(otherUser._id));
          setReceiver(
            selectedConversation?.members.find((m) => user._id !== m._id)!
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMessages();
    textareaRef?.current?.focus();
  }, [selectedConversation, dispatch, refetchMessages, user._id, user.token]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    try {
      const { data } = await axios.post(
        '/messages/',
        {
          sender: user._id,
          receiver: receiver?._id!,
          text: newMessage,
          conversationId: selectedConversation?._id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      dispatch(addMessage(data));

      socket?.current?.emit('sendMessage', receiver?._id!);
      socket?.current?.emit('stopTyping', receiver?._id!);
    } catch (error) {
      console.log(error);
    }
    setNewMessage('');
  };
  const handleFilter = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (filter) {
      setFilteredConversations(
        conversations.filter((c) => {
          const otherUser = c.members.find(
            (member) => member.username !== user.username
          );
          console.log(otherUser);
          if (otherUser) {
            const exp = new RegExp(filter, 'i');

            return otherUser.username.match(exp);
          }
          return true;
        })
      );
    } else {
      setFilteredConversations(conversations);
    }
  };
  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
    if (!typing) {
      setTyping(true);
      socket?.current?.emit('typing', receiver?._id!);
    }
    const lastTypingTime = new Date().getTime();
    const timerLength = 3000;
    setTimeout(() => {
      const timeNow = new Date().getTime();
      const timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        setTyping(false);
        socket?.current?.emit('stopTyping', receiver?._id!);
      }
    }, timerLength);
  };
  return (
    <div className="messanger">
      <div className="messanger__menu">
        <form onSubmit={handleFilter}>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search for friends"
            className="messanger__input--menu"
          />
        </form>
        {filteredConversations &&
          filteredConversations.map((c) => (
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
            {isTyping && (
              <div className="messanger__typing-animation">
                <Lottie options={defaultOptions} width={70} />
              </div>
            )}
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
                ref={textareaRef}
                onChange={handleTyping}
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
  );
};

export default Messanger;
