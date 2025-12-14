import ClientLayout from "@/Layout/ClientLayout";
import {useDispatch, useSelector} from "react-redux";
import {
    FollowMethodAction,
    getFollowersList, getFollowingList,
    getOwnProfile,
    getUserProfileAction
} from "@/config/redux/action/userAction";
import React, {useEffect, useState} from "react";
import style from "./style.module.css";
import JoinedDays from "@/Components/JoinedDate";
import {Calendar, MapPin} from "lucide-react";
import {getPostInfo, getPostPictures} from "@/config/redux/action/postAction";
import {router} from "next/client";
import {Post} from "@/Components/Post";

export default function UserProfile({ _id }) {
    const dispatch = useDispatch();
    const [data, setData] = useState("");
    const [window, setWindow] = useState(false);
    const userState = useSelector((state) => state.auth);
    const {getUserProfileData, ownProfileData, getFollowerListData, getFollowingListData} = userState;
    const postState = useSelector((state) => state.posts);
    const { postPictures} = postState;
    useEffect(() => {
        dispatch(getUserProfileAction(_id));
    },[_id])

    useEffect(() => {
        if (getUserProfileData?.userId) {
            dispatch(getPostPictures(getUserProfileData.userId));
            dispatch(getOwnProfile());
        }
    }, [getUserProfileData?.userId]);
    const [followWindow, setFollowWindow] = React.useState(false);
    const [followingWindow, setFollowingWindow] = React.useState(false);
    const [followersWindow, setFollowersWindow] = React.useState(false);
    const ownUserId = ownProfileData?.userId;
    const ownProfileId = ownProfileData?._id;
    const isFollowing = getUserProfileData?.followers.includes(ownProfileId);


    const ownProfileIsChecking = ownUserId === getUserProfileData?.userId;
    return (
        <ClientLayout>
            <div className={style.mainContainer}>
                <div className={style.wrapperDiv}>
                    <div className={style.UserContainer}>
                        <div className={style.userProfileContainer}>
                            <div>
                                <img  className={style.userProfilePic} src={getUserProfileData?.profilePicture}/>
                            </div>
                           <div className={style.userInfoContainer}>
                               <span className={style.userName}>{getUserProfileData?.name}</span>
                               <div className={style.followBtn}>
                                   <span>{getUserProfileData?.ownPosts?.length} posts</span>
                                   <button onClick={()=> {
                                       setFollowWindow(true)
                                       setFollowersWindow(true)
                                       dispatch(getFollowersList(getUserProfileData?._id))
                                   }
                                   }>{getUserProfileData?.followers?.length} followers</button>
                                   <button onClick={()=> {
                                       setFollowWindow(true)
                                       setFollowingWindow(true)
                                       dispatch(getFollowingList(getUserProfileData?._id))
                                   }}>{getUserProfileData?.following?.length} following</button>
                               </div>
                               <div>
                                   <span>{getUserProfileData?.bio}</span>
                                   <hr/>
                                   <MapPin
                                       size={10}
                                       strokeWidth={1.5}
                                       className="text-gray-500"
                                   />

                                   <span>{getUserProfileData?.location}</span>
                                   &nbsp;
                                   &nbsp;
                                   <Calendar
                                       size={10}
                                       strokeWidth={1.5}
                                       className="text-gray-500"
                                   />
                                   &nbsp;
                                   <span>Joined <JoinedDays date={getUserProfileData?.createdAt} /> days ago</span>
                               </div>
                           </div>
                        </div>
                        {ownProfileIsChecking ? <></>: <div className={style.btnContainer}>
                            <button onClick={async ()=> {
                                await dispatch(FollowMethodAction(getUserProfileData?.userId))
                                await dispatch(getUserProfileAction(_id));
                            }}>{isFollowing ? "Unfollow" : "Follow"}</button>
                            <button>Message</button>
                        </div>}
                    </div>

                    <div>
                        {postPictures?.length > 0 ? (
                            <div className={style.postContainer}>
                                {postPictures.map((post, index) => (
                                    <img onClick={() => {
                                        setData(post);
                                        setWindow(true);
                                        dispatch(getPostInfo(post._id))
                                    }} className={style.postImage} key={index} src={post?.images?.[0]?.path} />
                                ))}
                            </div>
                        ) : (
                            <p>There is no Post.</p>
                        )}
                    </div>
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
                                            console.log(item.userId)
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

                </div>
            </div>
        </ClientLayout>
    );
}

export async function getServerSideProps(context) {
    const { _id } = context.query;
    return { props: { _id } };
}
