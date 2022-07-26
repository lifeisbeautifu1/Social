import { Share, Post } from './';
import { useEffect } from 'react';
import { useAppSelector } from '../hooks';
import { useDispatch } from 'react-redux';
import { init } from '../features/posts/postsSlice';
import axios from 'axios';

type FeedProps = {
  profile?: boolean;
  userId?: string;
};

const Feed: React.FC<FeedProps> = ({ profile, userId }) => {
  const { user } = useAppSelector((state) => state.user);
  const { posts } = useAppSelector((state) => state.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get(
        profile ? `/posts/all/${userId}` : `/posts/timeline/${user?._id}`
      );
      dispatch(init(data));
    };
    fetchPosts();
  }, [userId, profile, dispatch, user]);

  return (
    <div className="feed">
      <div className="feed__wrapper">
        {!profile && <Share />}
        {user._id === userId && <Share />}

        {posts.map((p) => (
          <Post key={p?._id} post={p} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
