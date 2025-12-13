import { Carousel } from "@/Components/carousel";
import {
  Bookmark,
  Flag,
  HeartIcon,
  MessageCircleIcon,
  PlaneIcon,
  SendIcon,
  TrashIcon,
} from "lucide-react";
import style from "./style.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getOwnProfile } from "@/config/redux/action/userAction";
import {
  deletePost,
  getRandomPost,
  incrementLikes,
  savedPost,
} from "@/config/redux/action/postAction";
import { CommentBox } from "@/Components/commentBox";
import {router} from "next/client";

export const PostContainer = ({ data }) => {
  const dispatch = useDispatch();
  const [openCommentPostId, setOpenCommentPostId] = useState(null);
  const authState = useSelector((state) => state.auth);
  const { ownProfileData } = authState || {};
  useEffect(() => {
    dispatch(getOwnProfile());
  }, [dispatch]);

  const handledeletePost = async (data) => {
    await dispatch(deletePost(data));
    dispatch(getRandomPost());
  };

  return (
    <div>
      {Array.isArray(data) ? (
        data.map((post, idx) => (
          <div key={idx} className={style.postContainer}>
            <div className={style.userContainer}>
              <img
                  style={{cursor:"pointer"}}
                  className={style.profilePicture}
                src={post.user.profilePicture}
                onClick={()=> {router.push(`UserProfile/${post?.user?.userId}`)}}
              />
              <p>{post.user.name}</p>
              <p>{post.user.followers.length}&nbsp;followers</p>
              {post.userId === ownProfileData.userId && (
                <button
                  className={style.trashBtn}
                  onClick={() => {
                    handledeletePost(post._id);
                  }}
                >
                  <TrashIcon />
                </button>
              )}
            </div>
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              <Carousel>
                {post?.images?.map((s, i) => (
                  <img
                    key={i}
                    src={s.path}
                    alt={post?.content}
                    style={{
                      width: "100%",
                      height: "100%",
                      overflow: "hidden",
                      gap: "10px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      boxShadow: "0 0 5px rgba(0,0,0,0.2)",
                    }}
                  />
                ))}
              </Carousel>

              <div className={style.btnContainer}>
                <button
                  className={style.likeBtn}
                  onClick={() => {
                    dispatch(incrementLikes(post._id));
                  }}
                >
                  <HeartIcon />
                </button>
                <button
                  className={style.cmtBtn}
                  onClick={() => setOpenCommentPostId(post._id)}
                >
                  <MessageCircleIcon />
                </button>
                <button className={style.shareBtn}>
                  <SendIcon />
                </button>
                <button onClick={()=>{dispatch(savedPost(post._id))}} className={style.savedBtn}>
                  <Bookmark />
                </button>
              </div>
              <div className={style.content}>
                <p>@{post.user.name}</p>&nbsp;<p>{post?.content}</p>
              </div>
              <div></div>
            </div>
            {openCommentPostId === post._id && (
              <CommentBox
                data={post._id}
                onClose={() => setOpenCommentPostId(null)}
              />
            )}
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </div>
  );
};
