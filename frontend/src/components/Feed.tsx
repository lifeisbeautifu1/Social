import { Share, Post } from './';
import { Posts } from '../data';

const Feed = () => {
  return (
    <div className="feed">
      <div className="feed__wrapper">
        <Share />
        {Posts.map((p) => (
          <Post key={p?.id} post={p} />
        ))}
      </div>
    </div>
  );
};

export default Feed;
