import ClientLayout from "@/Layout/ClientLayout";
import {useDispatch, useSelector} from "react-redux";
import {getUserProfileAction} from "@/config/redux/action/userAction";
import {useEffect} from "react";
import style from "./style.module.css";
import JoinedDays from "@/Components/JoinedDate";
import {Calendar, MapPin} from "lucide-react";
import {getPostPictures} from "@/config/redux/action/postAction";

export default function UserProfile({ _id }) {
    const dispatch = useDispatch();
    const userState = useSelector((state) => state.auth);
    const {getUserProfileData} = userState;
    const postState = useSelector((state) => state.posts);
    const { postPictures} = postState;
    useEffect(() => {
        dispatch(getUserProfileAction(_id));
    },[_id])

    useEffect(() => {
        if (getUserProfileData?.userId) {
            dispatch(getPostPictures(getUserProfileData.userId));
        }
    }, [getUserProfileData?.userId]);
    {console.log(getUserProfileData)}
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
                                   <button >{getUserProfileData?.followers?.length} followers</button>
                                   <button>{getUserProfileData?.following?.length} following</button>
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
                        <div className={style.btnContainer}>
                            <button>Follow</button>
                            <button>Message</button>
                        </div>
                    </div>

                    <div>
                        {postPictures?.length > 0 ? (
                            <div className={style.postContainer}>
                                {postPictures.map((post, index) => (
                                    <img className={style.postImage} key={index} src={post?.images?.[0]?.path} />
                                ))}
                            </div>
                        ) : (
                            <p>There is no Post.</p>
                        )}
                    </div>

                </div>
            </div>
        </ClientLayout>
    );
}

export async function getServerSideProps(context) {
    const { _id } = context.query;
    return { props: { _id } };
}
