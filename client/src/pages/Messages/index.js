import ClientLayout from "@/Layout/ClientLayout";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getAllUsers, searchUser} from "@/config/redux/action/userAction";
import style from "./style.module.css";


export default function Messages(){
    const dispatch = useDispatch()
    const userState = useSelector(state => state.auth);
    const { searchResult, searchLoading } = userState;
    const [query, setQuery] = useState("");

    useEffect(() => {
        if(query.trim === "")return;
        const delayBousnce = setTimeout(() => {
            dispatch(searchUser(query))
        },400);
        return () => clearTimeout(delayBousnce);
    }, [query, dispatch])

    return(<ClientLayout>
        <div className={style.messageWrapper}>
            <div className={style.Querywrapper}>
                <div className={style.queryContainer}>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search..."/>
                </div>
                <div className={style.usersList}>
                    {searchLoading ? (<></>) : searchResult.length > 0 ? (
                        searchResult.map((user)=>(
                            <div className={style.users} key={user.id}>
                                <div>
                                    <img  src={user.profilePicture}/>
                                </div>
                                <div>
                                    <p>{user.name}</p>
                                </div>
                            </div>
                        ))
                    ):(
                        query && (<p>
                            No user Found
                        </p>)
                    )}
                </div>
            </div>
        </div>
    </ClientLayout>)


}