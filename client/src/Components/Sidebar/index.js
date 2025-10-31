import React, {useEffect} from "react";
import { CirclePlus, HomeIcon, LogOut, MessageCircle, Search, User2Icon, Users } from "lucide-react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import {useDispatch, useSelector} from "react-redux";
import {getOwnProfile} from "@/config/redux/action/userAction";

export default function Sidebar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const authState = useSelector(state => state.auth);

    const currentPath = router.pathname;

    const handleClick = (path) => {
        router.push(path);
    };

    useEffect(() => {
        dispatch(getOwnProfile());
    },[])
    return (
            <div className={styles.mainContainer}>
                <div className={styles.startDiv}>
                    <Image className={styles.logo} src={logo} alt="logo" />
                </div>

                <div className={styles.midDiv}>
                    <button
                        className={`${styles.btn} ${currentPath === "/feed" ? styles.activeBtn : ""}`}
                        onClick={() => handleClick("/feed")}
                    >
                        <HomeIcon /> Feed
                    </button>

                    <button
                        className={`${styles.btn} ${currentPath === "/messages" ? styles.activeBtn : ""}`}
                        onClick={() => handleClick("/Messages")}
                    >
                        <MessageCircle /> Messages
                    </button>

                    <button
                        className={`${styles.btn} ${currentPath === "/discover" ? styles.activeBtn : ""}`}
                        onClick={() => handleClick("/Discover")}
                    >
                        <Search /> Discover
                    </button>

                    <button
                        className={`${styles.btn} ${currentPath === "/Profile" ? styles.activeBtn : ""}`}
                        onClick={() => handleClick("/Profile")}
                    >
                        <User2Icon /> Profile
                    </button>

                    <button
                        style={{ color: "white" }}
                        className={`${styles.btn} ${styles.createPost}`}
                        onClick={() => handleClick("/create-post")}
                    >
                        <CirclePlus /> Create Post
                    </button>
                </div>

                <div className={styles.endDiv}>
                    {authState ? (
                        <p>{authState.getUserName.name}</p>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <button className={styles.logOutBtn} onClick={()=>{
                        localStorage.removeItem("token");
                        router.push("/");
                    }}>
                        <LogOut />
                    </button>
                </div>
            </div>

    );
}
