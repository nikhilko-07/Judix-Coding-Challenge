import ClientLayout from "@/Layout/ClientLayout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getFollowersList, getFollowingList,
  getOwnProfile, getOwnSavedPosts,
  updateProfileData,
  updateProfilePicture
} from "@/config/redux/action/userAction";
import style from "./style.module.css";
import JoinedDays from "@/Components/JoinedDate";
import { Calendar, MapPin } from "lucide-react";
import { Post } from "@/Components/Post";
import {getPostInfo} from "@/config/redux/action/postAction";
import {router} from "next/client";

export default function Profile() {
  const userState = useSelector((state) => state.auth);
  const postState = useSelector((state) => state.posts);
  const { savedPostsFetched ,savedPostsData} = userState;
  const { getFollowerListData, getFollowingListData} = userState;
  const dispatch = useDispatch();

  const [window, setWindow] = useState(false);
  const [editWindow, setEditWindow] = useState(false);
  const [data, setData] = useState("");
  const [ownPosts, setOwnPosts] = useState(true);
  const { ownProfileData  } = userState || {};
  const followersCount = ownProfileData?.followers?.length || 0;
  const followingCount = ownProfileData?.following?.length || 0;
  const postCount = ownProfileData?.ownPosts?.length || 0;
  const [followWindow, setFollowWindow] = React.useState(false);
  const [followingWindow, setFollowingWindow] = React.useState(false);
  const [followersWindow, setFollowersWindow] = React.useState(false);
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
                    <span style={{cursor:"pointer"}}  onClick={()=>{
                      setFollowWindow(true)
                      setFollowersWindow(true)
                      dispatch(getFollowersList(ownProfileData?._id))
                    }}>&nbsp;&nbsp;{followersCount} followers</span>
                    <span style={{cursor:"pointer"}} onClick={()=> {
                      setFollowWindow(true)
                      setFollowingWindow(true)
                      dispatch(getFollowingList(ownProfileData?._id))
                    }}>&nbsp;&nbsp;{followingCount} following</span>
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
                dispatch(getOwnSavedPosts())
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
            {savedPostsFetched && savedPostsData.length > 0 ? (
                savedPostsData.map((post) => {
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
          {followWindow && (
              <div
                  style={{
                    position: "fixed",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    zIndex: 999,
                    width: 300,
                    height: 300,
                    background: "white",
                    borderRadius: 10,
                    padding: 20,
                    boxShadow: "0 0 20px rgba(0,0,0,0.2)"
                  }}
              >
                <div style={{ position: "relative" }}>
                  <div className={style.listheader}>{followersWindow  && followWindow ? <p>Followers</p> : <p>Following</p>}</div>
                  <button
                      className={style.listCloseBtn}
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0
                      }}
                      onClick={() => {
                        setFollowWindow(false)
                        setFollowingWindow(false)
                        setFollowersWindow(false)
                      }}
                  >
                    X
                  </button>
                  <div className={style.followPersonContainer}>
                    {followersWindow ? getFollowerListData?.length > 0 ? getFollowerListData?.map((item) => (
                        <div onClick={() => {
                          router.push(`/UserProfile/${item?.userId}`)
                          setFollowWindow(false)
                          setFollowingWindow(false)
                          setFollowersWindow(false)
                        }} className={style.followersListStyle} key={item.userId}  style={{display: "flex", gap: "10px", marginBottom: "10px", cursor:"pointer"}}>
                          <img
                              src={item.profilePicture}
                              alt={item.name}
                              width={40}
                              height={40}
                              style={{borderRadius: "50%"}}
                          />
                          <p>{item.name}</p>
                        </div>
                    )) : (<></>) : getFollowingListData?.length > 0 ? getFollowingListData?.map((item) => (
                        <div onClick={() => {
                          router.push(`/UserProfile/${item?.userId}`)
                          setFollowWindow(false)
                          setFollowingWindow(false)
                          setFollowersWindow(false)
                        }}  key={item.userId} style={{display: "flex", gap: "10px", marginBottom: "10px", cursor:"pointer"}}>
                          <img
                              src={item.profilePicture}
                              alt={item.name}
                              width={40}
                              height={40}
                              style={{borderRadius: "50%"}}
                          />
                          <p>{item.name}</p>
                        </div>
                    )) : (<></>)  }
                  </div>

                </div>
              </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
}
