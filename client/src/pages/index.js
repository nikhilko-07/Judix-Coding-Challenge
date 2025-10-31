import bgImg from "@/assets/bgimg.png";
import Logo from "@/assets/logo.png";
import group from "@/assets/group.png";
import {Star} from "lucide-react";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Image from "next/image";
import styles from "./home.module.css";
import {useDispatch, useSelector} from "react-redux";
import {loginUser, profileFetch, registerUser} from "@/config/redux/action/userAction";

export default function Home() {


  const[isLoggedIn, setIsLoggedIn] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state)=>state.auth);

  const[name, setName] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  useEffect(() => {
    dispatch(profileFetch())
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token && authState.profileFetched === true) {
      router.push("/feed");
    } else if (!token && authState.profileFetched === false) {
      router.push("/");
    }
  }, [authState.profileFetched]);


  const handleLogin = async ()=>{
    await dispatch(loginUser({email, password}));
    // await router.push("/feed");
  }
  const handleRegister = ()=>{
    dispatch(registerUser({email, password, name}));
  }
  return (
      <div className={styles.layoutcontainer}>
        <Image src={bgImg} alt="" className={styles.backgroundimg} />
        {/* Left side */}
        <div className={styles.leftcolumn}>
          <Image src={Logo} alt="" className={styles.logoimg}/>
          <div>
            <div className={styles.headericons}>
              <Image src={group} alt="" className={styles.groupimg}/>
              <div>
                <div className={styles.starsrow}>
                  {Array(5).fill(0).map((_, i) => (<Star key={i} className={styles.staricon}/>))}
                </div>
                <p>Used by 12k+ developers</p>
              </div>
            </div>
            <h1 className={styles.gradientheading}>More than just friends truly connect</h1>
            <p className={styles.description}>connect with global community on ping.</p>
          </div>
          <span className={styles.placeholder}></span>
        </div>
        <div className={styles.rightcolumn}>
          <div className={styles.formwrapper}>
            <div className={styles.formcontent}>
              <div className={styles.formheader}>
                <h1>{isLoggedIn ? "Sign in" : "Sign up"}</h1>
                <span>Welcome back! Please {isLoggedIn ? "Sign in" : "Sign up"} to continue</span>
              </div>
              <div className={styles.formfields}>
                {
                  !isLoggedIn ? (
                      <>
                        <input onChange={(e)=> setName(e.target.value)} placeholder="Name"/>
                        <input onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
                        <input onChange={(e)=>setPassword(e.target.value)} type="password"  placeholder="Password"/>
                      </>
                  ) : (<>
                    <input onChange={(e)=>setEmail(e.target.value)} placeholder="Email"/>
                    <input onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="Password"/></>)
                }              </div>
              <div className={styles.formactions}>
                <button className={styles.gradientbutton} onClick={isLoggedIn ? handleLogin : handleRegister}>continue</button>
              </div>
              <div className={styles.formlinks}>
                {isLoggedIn ? (<p>if you not have an account.</p>) : (<p>if you have already an account.</p>)}<a style={{color:"blue", cursor:"pointer"}} onClick={()=>(setIsLoggedIn(!isLoggedIn))}>{isLoggedIn ? (<div>Create Account.</div>) : (<div>Login</div>)}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

  );

}
