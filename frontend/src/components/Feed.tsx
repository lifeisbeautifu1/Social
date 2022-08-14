import { Share, Post } from './';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { addPosts, setNumberOfPages } from '../features/posts/postsSlice';
import { init } from '../features/posts/postsSlice';
import { useQuery } from '../config/utils';
import axios from 'axios';
import { ClientToServerEvents, ServerToClientEvents } from '../interfaces';
import { Socket } from 'socket.io-client';

type FeedProps = {
  profile?: boolean;
  userId?: string;
  scrollable?: boolean;
  socket: React.MutableRefObject<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>;
};

const Feed: React.FC<FeedProps> = ({ profile, userId, scrollable, socket }) => {
  const { user } = useAppSelector((state) => state.user);
  const { posts, numberOfPages } = useAppSelector((state) => state.posts);
  const dispatch = useAppDispatch();
  const query = useQuery();
  const page = query.get('page') || 1;

  const [currentPage, setCurrentPage] = useState(+page);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data } = await axios.get(
        profile
          ? `/posts/all/${userId}`
          : `/posts/timeline/?userId=${user?._id}&page=${page}`
      );
      if (profile) {
        dispatch(init(data));
      } else {
        dispatch(init(data.posts));
        dispatch(setNumberOfPages(data.numberOfPages));
      }
    };
    fetchPosts();
  }, [userId, profile, dispatch, user, page]);

  const handleScroll = async (e: any) => {
    let triggerHeight = e.target.scrollTop + e.target.offsetHeight;
    // console.log(Math.floor(triggerHeight), e.target.scrollHeight);
    if (Math.floor(triggerHeight) + 1 >= +e.target.scrollHeight) {
      if (currentPage + 1 <= numberOfPages) {
        setCurrentPage(currentPage + 1);
        try {
          const { data } = await axios.get(
            `/posts/timeline?userId=${user?._id}&page=${currentPage + 1}`
          );
          // console.log(data.posts);
          dispatch(addPosts(data.posts));
        } catch (error) {
          console.log(error);
        }
      }
    }
  };

  return (
    <div
      className={scrollable ? 'feed scrollable' : 'feed'}
      onScroll={handleScroll}
    >
      <div className="feed__wrapper">
        {!profile && <Share />}
        {user._id === userId && <Share />}

        <div className="posts__container">
          {posts.map((p) => (
            <Post key={p?._id} post={p} socket={socket} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;

