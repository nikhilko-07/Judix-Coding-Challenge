import ClientLayout from "@/Layout/ClientLayout";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {getOwnProfile, updateProfileData, updateProfilePicture} from "@/config/redux/action/userAction";
import style from "./style.module.css";
import JoinedDays from "@/Components/JoinedDate";
import { Calendar, MapPin } from "lucide-react";
import { Post } from "@/Components/Post";
import {getPostInfo} from "@/config/redux/action/postAction";

export default function Profile() {
  const userState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const { savedPostData } = postState;
  const dispatch = useDispatch();

  const [window, setWindow] = useState(false);
  const [editWindow, setEditWindow] = useState(false);
  const [data, setData] = useState("");
  const [ownPosts, setOwnPosts] = useState(true);
  const { ownProfileData,ownSavedPosts } = userState || {};
  const followersCount = ownProfileData?.followers?.length || 0;
  const followingCount = ownProfileData?.following?.length || 0;
  const postCount = ownProfileData?.ownPosts?.length || 0;
  const { getOwnPosts } = userState || {};
  const [name, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    dispatch(getOwnProfile());
  }, []);
  const updateData = ()=>{
    dispatch(updateProfileData({name, bio, location}));
    setUsername("");
    setBio("");
    setLocation("");
  };
  // useEffect(() => {
  //   if (!ownSavedPosts) return;
  //   if (Array.isArray(ownSavedPosts)) {
  //     ownSavedPosts.forEach(id => dispatch(getSavedPostInfo(id)));
  //   }
  // }, [ownSavedPosts]);

  return (
    <ClientLayout>
      <div className={style.mainContainer}>
        <div className={style.wrapperDiv}>
          <div
            className={style.profileContainer}
            style={{ overflow: "hidden" }}
          >
            {ownProfileData ? (
              <div className={style.userInfoDiv}>
                <div className={style.imageContainer}>
                  <input
                      onChange={(e) => {
                        dispatch(updateProfilePicture(e.target.files[0]));
                      }}
                      hidden
                      type={"file"}
                      id={"profilePictureUpload"}
                  />
                  <label className={style.profilePic} htmlFor={"profilePictureUpload"}>

                  <img
                    className={style.profilePicture}
                    src={ownProfileData?.profilePicture}
                    alt="profile"
                  />
                  </label>
                </div>
                <div className={style.infoContainer}>
                  <h1>{ownProfileData.name}</h1>

                  <div>
                    <span>{postCount} posts</span>
                    <span>&nbsp;&nbsp;{followersCount} followers</span>
                    <span>&nbsp;&nbsp;{followingCount} following</span>
                  </div>

                  <div>
                    <div className={style.bio}>{ownProfileData.bio}</div>
                    <hr />
                    <div className={style.details}>
                      <MapPin
                        size={10}
                        strokeWidth={1.5}
                        className="text-gray-500"
                      />
                      <span>{ownProfileData.location}</span>&nbsp; &nbsp;
                      <Calendar
                        size={10}
                        strokeWidth={1.5}
                        className="text-gray-500"
                      />
                      <span>
                        Joined&nbsp;
                        <JoinedDays date={ownProfileData.createdAt} /> days ago
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Loading...</p>
            )}
            <div className={style.btnContainer}>
              <button onClick={()=> setEditWindow(true)}>Edit Profile</button>
              <button onClick={()=> setOwnPosts(true)}>Your posts</button>
              <button onClick={()=>{
                 setOwnPosts(false)
              }}>Saved posts</button>
            </div>
          </div>
          {ownPosts ? (<div className={style.postContainer}>
            {getOwnPosts && getOwnPosts.length > 0 ? (
              getOwnPosts.map((post) => {
                return (
                  post.images &&
                  post.images.length > 0 && (
                    <img
                        style={{cursor:"pointer"}}
                      onClick={() => {
                        setData(post);
                        setWindow(true);
                        dispatch(getPostInfo(post._id))
                      }}
                      className={style.postsImage}
                      key={post._id}
                      src={post.images[0].path}
                      alt="post"
                    />
                  )
                );
              })
            ) : (
              <p>No Posts Yet.</p>
            )}
          </div>) : (<div className={style.postContainer}>

            {savedPostData.map((post, i) => (
                <div key={i} style={{ borderBottom: "1px solid #ddd", padding: 10 }}>
                  <h1>{post.content}</h1>
                  {/*<img*/}
                  {/*            onClick={() => {*/}
                  {/*              setData(post);*/}
                  {/*              setWindow(true);*/}
                  {/*            }}*/}
                  {/*            className={style.postsImage}*/}
                  {/*            key={post._id}*/}
                  {/*            src={post.images[0].path}*/}
                  {/*            alt="saved post"*/}
                  {/*        />*/}
                </div>
            ))}
          </div>)}
          {window && (
            <div className={style.overlay}>
              <div className={style.modal}>
                <Post  data={data}  closeModal={() => setWindow(false)}/>
                <button
                  className={style.closeBtn}
                  onClick={() => setWindow(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          {editWindow && (<div className={style.overlay}>
            <div className={style.modal}>
              <button
                  className={style.closeBtn}
                  onClick={() => setEditWindow(false)}
              >
                ✕
              </button>
              <div className={style.editContainer}>
                <input value={name} onChange={(e)=>setUsername(e.target.value)} name={"username"} placeholder={"UserName"}/>
                <input value={bio} onChange={(e)=>setBio(e.target.value)} name={"bio"} placeholder={"Bio"}/>
                <input value={location} onChange={(e)=>setLocation(e.target.value)} name={"location"} placeholder={"Location"}/>
              </div>
              <div className={style.btnContainer}>
                <button onClick={()=>{updateData()}}>Update</button>
              </div>
            </div>
          </div>)}
        </div>
      </div>
    </ClientLayout>
  );
}
