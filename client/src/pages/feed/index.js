import {useRouter} from "next/router";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {profileFetch} from "@/config/redux/action/userAction";
import ClientLayout from "@/Layout/ClientLayout";
import style from "./style.module.css";
import {getRandomPost} from "@/config/redux/action/postAction";
import {PostContainer} from "@/pages/postContainer";

export default function Feed(){

    const router = useRouter();
    const dispatch = useDispatch();
    const authState= useSelector((state)=>state.auth);
    const postState = useSelector((state)=>state.posts);
    const { randPosts, isLoading } =  useSelector((state)=>state.posts);

    useEffect(() => {
        dispatch(getRandomPost());
        dispatch(profileFetch());

    }, [dispatch]);

    useEffect(() => {
        if (authState.profileFetched) {
            router.push("/feed");
        } else if(authState.profileFetched === false) {
            router.push("/");
        }
    }, [authState.profileFetched]);

    useEffect(() => {
        const handleScroll = () => {
            const bottom =
                window.innerHeight + window.scrollY >= document.body.offsetHeight - 10;

            if (bottom && !isLoading) {
                dispatch(getRandomPost());
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [dispatch, isLoading]);


    return(<ClientLayout>

     <div className={style.mainContainer}>
         <div className={style.wrapperDiv}>
             <div className={style.storiesContainer}>
                 its a stories container
             </div>
             <div className={style.postContainer}>
                 <PostContainer data={randPosts} />
             </div>
         </div>
     </div>
    </ClientLayout>)
}