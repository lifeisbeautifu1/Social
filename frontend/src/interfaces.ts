export interface IUser {
  _id: string;
  profilePicture: string;
  coverPicture: string;
  username: string;
  desc: string;
  city: string;
  from: string;
  relationship: 1 | 2 | 3;
  following: IUser[];
  followers: IUser[];
  friends: IUser[];
  friendRequests: IFriendRequest[];
  token: string;
}

export interface IFriendRequest {
  _id: string;
  from: IUser;
  to: IUser;
  createdAt: string;
}

export interface IPost {
  _id: string;
  desc: string;
  img: string;
  updatedAt: string;
  createdAt: string;
  author: IUser;
  likes: string[];
  comments: IComment[];
}

export interface IComment {
  _id: string;
  author: IUser;
  body: string;
  postId: string;
  createdAt: string;
}

export interface IConversation {
  _id: string;
  members: IUser[];
}

export interface IMessage {
  _id: string;
  conversationId: string;
  text: string;
  sender: IUser;
  createdAt: string;
}

export interface IOnlineUser {
  userId: string;
  socketId: string;
}

export interface IError {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface ServerToClientEvents {
  getUsers: (users: IOnlineUser[]) => void;
  getMessage: () => void;
  getRequest: () => void;
  typing: () => void;
  stopTyping: () => void;
}

export interface ClientToServerEvents {
  addUser: (userId: string) => void;
  sendMessage: (receiverId: string) => void;
  sendRequest: (receiverId: string) => void;
  typing: (receiverId: string) => void;
  stopTyping: (receiverId: string) => void;
}

