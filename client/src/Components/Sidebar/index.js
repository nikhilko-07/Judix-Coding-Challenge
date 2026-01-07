import React from "react";
import {
    CirclePlus,
    HomeIcon,
    LogOut,
    MessageCircle,
    Search,
    User2Icon,
} from "lucide-react";
import logo from "@/assets/logo.png";
import Image from "next/image";
import styles from "./style.module.css";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

export default function Sidebar() {
    const router = useRouter();
    const authState = useSelector((state) => state.auth);
    const currentPath = router.pathname;

    const handleClick = (path) => {
        router.push(path);
    };

    return (
        <>
            <nav className={styles.mainContainer}>
                {/* LOGO (DESKTOP ONLY) */}
                <div className={styles.startDiv}>
                    <Image className={styles.logo} src={logo} alt="logo" />
                </div>

                {/* NAV BUTTONS */}
                <div className={styles.midDiv}>
                    <button
                        className={`${styles.btn} ${
                            currentPath === "/feed" ? styles.activeBtn : ""
                        }`}
                        onClick={() => handleClick("/feed")}
                    >
                        <HomeIcon />
                        <span className={styles.label}>Feed</span>
                    </button>

                    <button
                        className={`${styles.btn} ${
                            currentPath === "/Messages" ? styles.activeBtn : ""
                        }`}
                        onClick={() => handleClick("/Messages")}
                    >
                        <MessageCircle />
                        <span className={styles.label}>Messages</span>
                    </button>

                    <button
                        className={`${styles.btn} ${
                            currentPath === "/Discover" ? styles.activeBtn : ""
                        }`}
                        onClick={() => handleClick("/Discover")}
                    >
                        <Search />
                        <span className={styles.label}>Discover</span>
                    </button>

                    <button
                        className={`${styles.btn} ${
                            currentPath === "/Profile" ? styles.activeBtn : ""
                        }`}
                        onClick={() => handleClick("/Profile")}
                    >
                        <User2Icon />
                        <span className={styles.label}>Profile</span>
                    </button>

                    <button
                        className={`${styles.btn} ${styles.createPost}`}
                        onClick={() => handleClick("/createPost")}
                    >
                        <CirclePlus />
                        <span className={styles.label}>Create</span>
                    </button>
                </div>

                {/* USER INFO (DESKTOP ONLY) */}
                <div className={styles.endDiv}>
                    {authState ? (
                        <p className={styles.username}>
                            {authState.ownProfileData.name}
                        </p>
                    ) : (
                        <p>Loading...</p>
                    )}
                    <button
                        className={styles.logOutBtn}
                        onClick={() => {
                            localStorage.removeItem("token");
                            router.push("/");
                        }}
                    >
                        <LogOut />
                    </button>
                </div>
            </nav>

            {/* SPACE FOR MOBILE BOTTOM NAV */}
            <div className={styles.bottomSpace} />
        </>
    );
}
