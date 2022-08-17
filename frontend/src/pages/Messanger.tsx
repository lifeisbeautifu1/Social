import { Conversation, Message } from '../components';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState, useRef } from 'react';
import Picker from 'emoji-picker-react';
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
  const [showPicker, setShowPicker] = useState(false);
  const { user } = useAppSelector((state) => state.user);
  const {
    conversations,
    selectedConversation,
    messages,
    refetchMessages,
    isTyping,
  } = useAppSelector((state) => state.conversations);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLInputElement>(null);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState<IUser | null>(null);
  const [filter, setFilter] = useState('');

  const [typing, setTyping] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);

  const onEmojiClick = (event: any, emojiObject: any) => {
    setNewMessage(newMessage + emojiObject.emoji);
  };

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
        const { data } = await axios.get('/conversations');
        dispatch(setConversations(data));
        setFilteredConversations(data);
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
  }, [selectedConversation, dispatch, refetchMessages, user._id]);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    try {
      const { data } = await axios.post('/messages/', {
        sender: user._id,
        receiver: receiver?._id!,
        text: newMessage,
        conversationId: selectedConversation?._id,
      });
      dispatch(addMessage(data));

      socket?.current?.emit('sendMessage', receiver?._id!);
      socket?.current?.emit('stopTyping', receiver?._id!);
    } catch (error) {
      console.log(error);
    }
    setNewMessage('');
  };
  const handleFilter = async () => {
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
  useEffect(() => {
    handleFilter();
  }, [filter]);
  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="flex w-full md:w-[70%] mx-auto">
      <div className="w-[350px] p-4 sticky top-[0px]">
        <div>
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search dialogs"
            className="w-full shadow my-4 p-2 rounded text-sm border border-gray-200 outline-none"
          />
        </div>
        {filteredConversations &&
          filteredConversations.map((c) => (
            <Conversation key={c._id} conversation={c} />
          ))}
      </div>
      <div className="w-full">
        {selectedConversation ? (
          <>
            <div className="messanger overflow-scroll">
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
              className="relative mt-4 border-t border-gray-200 flex items-center py-3 px-4 bg-gray-100 gap-2 text-gray-500"
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 cursor-pointer hover:text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                />
              </svg>
              <input
                placeholder="Write something"
                value={newMessage}
                ref={textareaRef}
                onChange={handleTyping}
                className="border border-gray-200 rounded-md px-4 py-2 outline-none w-full resize-none text-sm"
              />
              <span
                className="absolute top-5 right-14"
                onClick={() => setShowPicker(!showPicker)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="cursor-pointer h-6 w-6 text-gray-500 hover:text-gray-700"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </span>
              {showPicker && (
                <div className="absolute left-[50%] bottom-4">
                  <Picker onEmojiClick={onEmojiClick} />
                </div>
              )}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 cursor-pointer hover:text-gray-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                />
              </svg>
            </form>{' '}
          </>
        ) : (
          <span className="messanger__select-text">
            Select chat to send messages
          </span>
        )}
      </div>
      {/* <div className="messanger__online">
        <ChatOnline onlineUsers={onlineUsers} />
      </div> */}
    </div>
  );
};

export default Messanger;
