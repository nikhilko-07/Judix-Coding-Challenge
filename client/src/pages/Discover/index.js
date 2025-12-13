import { getRandMedia } from "@/config/redux/action/postAction";
import ClientLayout from "@/Layout/ClientLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import style from "./style.module.css";
import { searchUser } from "@/config/redux/action/userAction";
import { Post } from "@/Components/Post";
import {router} from "next/client";

export default function Discover() {
  const dispatch = useDispatch();
  const postState = useSelector((state) => state.posts);
  const { isLoading } = useSelector((state) => state.posts);
  const { searchResult, searchLoading } = useSelector((state) => state.auth);

  const [query, setQuery] = useState("");
  const [postWindow, setWindow] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);

  const { randMedia, mediaFetched } = postState || [];
  useEffect(() => {
    dispatch(getRandMedia());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;

      if (bottom && !isLoading) {
        dispatch(getRandMedia());
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [dispatch, isLoading]);

  useEffect(() => {
    if (query.trim === "") return;
    const delayDebounce = setTimeout(() => {
      dispatch(searchUser(query));
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query, dispatch]);
  return (
    <ClientLayout>
      <div className={style.wrapperDiv}>
        <div className={style.queryContainer}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search User"
          />
          <div style={{ marginTop: "10px", width: "100%" , maxHeight:"150px", overflowY:"auto", position:"relative"}}>
            {searchLoading ? (
              <p></p>
            ) : searchResult.length > 0 ? (
              searchResult.map((user) => (
                <div style={{cursor:"pointer"}} onClick={()=> {router.push(`UserProfile/${user.userId}`)}} className={style.usersFetch} key={user._id}>
                  <img
                    src={user.profilePicture}
                    alt={user.username}
                    style={{ borderRadius: "50%" }}
                  />
                  <span>{user.name}</span>
                </div>
                
              ))
            ) : (
              query && (
                <p
                  style={{
                    padding: "2",
                    color: "gray",
                    backgroundColor: "white",
                    paddingLeft: "2.5%",
                  }}
                >
                  No users found
                </p>
              )
            )}
            
          </div>
        </div>

        {mediaFetched ? (
          <div
            className={style.card}
            style={{
              width: "60%",
              height: "100%",
            }}
          >
         {randMedia.length > 0 ? (
  <div className={style.cards}>
    {randMedia.map((data, i) => (
      <div
        className={style.imageDiv}
        key={i}
        onClick={() => {
          setSelectedPost(data);
          setWindow(true);
        }}
      >
        <img src={data.images[0].path} alt={`media-${i}`} />
      </div>
    ))}

    {postWindow && selectedPost && (
      <div className={style.overlay}>
        <div className={style.modal}>
          <Post data={selectedPost} closeModal={() => setWindow(false)} />
          <button
            className={style.closeBtn}
            onClick={() => setWindow(false)}
          >
            ✕
          </button>
        </div>
      </div>
    )}
  </div>
) : (
  <div
    style={{
      width: "60%",
      textAlign: "center",
      color: "gray",
      fontSize: "1.2rem",
    }}
  >
    No media found
  </div>
)}
          </div>
        ) : (
          <div
            style={{
              width: "60%",
              textAlign: "center",
              color: "gray",
              fontSize: "1.2rem",
            }}
          >
            No media available yet
          </div>
        )}
      </div>
    </ClientLayout>
  );
}
