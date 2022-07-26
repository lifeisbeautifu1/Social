export interface IUser {
  _id: string;
  profilePicture?: string;
  coverPicture?: string;
  username?: string;
  desc?: string;
  city?: string;
  from?: string;
  relationship?: 1 | 2 | 3;
  following?: string[];
  followers?: string[];
}

export interface IPost {
  _id?: string;
  desc?: string;
  img?: string;
  updatedAt?: string;
  createdAt?: string;
  userId?: string;
  likes?: string[];
  // comment?: number;
}
