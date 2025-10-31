import ClientLayout from "@/Layout/ClientLayout";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getOwnProfile, profileFetch} from "@/config/redux/action/userAction";
import style from "./style.module.css";
import JoinedDays from "@/Components/JoinedDate";
import {Calendar, MapPin, Pointer} from "lucide-react";
import {getRandomPost} from "@/config/redux/action/postAction";

export default function Profile(){

    const userState = useSelector((state) => state.auth);
    const dispatch = useDispatch();


    const { getUserName } = userState || {};
    const { ownProfileData } = userState || {};
    const followersCount = ownProfileData?.followers?.length || 0;
    const followingCount = ownProfileData?.following?.length || 0;
    const postCount = ownProfileData?.ownPosts?.length || 0;
    const { getOwnPosts } = userState || {};
    useEffect(() => {
        dispatch(getOwnProfile());
    }, []);




    return (<ClientLayout>
        <div className={style.mainContainer}>
            <div className={style.wrapperDiv}>
                <div className={style.profileContainer} style={{ overflow:"hidden"}}>
                    {ownProfileData ?(
                        <img
                            src={ownProfileData?.backgroundImage}
                            alt="profile"
                            style={{width:"100%", height:"50%", objectFit:"cover"}}
                        />
                    ) : (
                        <p>Loading background...</p>
                    )}
                    { ownProfileData ?(
                        <img
                            src={ownProfileData?.profilePicture}
                            alt="profile"
                            style={{width:"10%", objectFit:"cover", borderRadius:"50%"}}
                        />
                    ) : (
                        <p>Loading background...</p>
                    )}

                    {ownProfileData ? (
                        <div className={style.userInfoDiv}>
                            <h1>{getUserName.name}</h1>

                            <div>
                                <div>
                                    {ownProfileData.bio}
                                </div>
                                <hr/>
                                <div>
                                    <MapPin size={16} strokeWidth={1.5} className="text-gray-500"/><span>{ownProfileData.location}</span>&nbsp;
                                    <Calendar size={16} strokeWidth={1.5} className="text-gray-500" /><span>Joined&nbsp;<JoinedDays date={ownProfileData.createdAt}/> days ago</span>
                                </div>
                            </div>
                            <hr/>
                            <div>
                                <span>{postCount}</span>
                                <span>{followersCount}</span>
                                <span>{followingCount}</span>
                            </div>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <div className={style.postContainer} >
                    {getOwnPosts && getOwnPosts.length > 0 ? (
                        getOwnPosts.map((post) => {
                            return (
                                post.images &&
                                post.images.length > 0 && (
                                    <img
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
                </div>
            </div>
        </div>
    </ClientLayout>)
}