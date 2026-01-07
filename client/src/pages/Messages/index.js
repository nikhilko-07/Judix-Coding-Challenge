import ClientLayout from "@/Layout/ClientLayout";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { searchUser } from "@/config/redux/action/userAction";
import style from "./style.module.css";
import socket from "@/pages/socket/socket";

export default function Messages() {
    const dispatch = useDispatch();

    // ✅ FIX: get token separately
    const { searchResult, searchLoading, user, token } = useSelector(
        (state) => state.auth
    );

    const [query, setQuery] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");

    /* =======================
       🔍 SEARCH USERS
    ======================== */
    useEffect(() => {
        if (!query.trim()) return;

        const delay = setTimeout(() => {
            dispatch(searchUser(query));
        }, 400);

        return () => clearTimeout(delay);
    }, [query, dispatch]);

    /* =======================
       🔌 JOIN SOCKET (MY ID)
    ======================== */
    useEffect(() => {
        if (user?._id) {
            socket.emit("join", user._id);
        }
    }, [user]);


    const makeConnection = (name)=>{
        socket.emit("join", name);
        console.log("Joined user",name);
    }
    const sendMessage = ()=>{
        socket.emit("sendMessage",newMessage, selectedUser.id )
    }

    return (
        <ClientLayout>
            <div className={style.messageWrapper}>
                {/* ================= LEFT PANEL ================= */}
                <div className={style.Querywrapper}>
                    <div className={style.queryContainer}>
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Search users..."
                        />
                    </div>

                    <div className={style.usersList}>
                        {searchLoading ? null : searchResult.length > 0 ? (
                            searchResult.map((u) => (
                                <div
                                    key={u._id}
                                    className={style.users}
                                    onClick={() =>
                                        {
                                            setSelectedUser({
                                                id: u.userId,
                                                name: u.name,
                                                profilePicture: u.profilePicture,
                                            })
                                            makeConnection(u.name)
                                        }
                                    }
                                >
                                    <img width={40} src={u.profilePicture} />
                                    <p>{u.name}</p>
                                </div>
                            ))
                        ) : (
                            query && <p>No user found</p>
                        )}
                    </div>
                </div>

                {/* ================= RIGHT CHAT PANEL ================= */}
                <div className={style.messageContainer}>
                    {/* HEADER */}
                    <div className={style.userMessageHeader}>
                        {selectedUser ? (
                            <div className={style.userDetails}>
                                <img src={selectedUser.profilePicture} />
                                <p>{selectedUser.name}</p>
                            </div>
                        ) : (
                            <p>Please select a user</p>
                        )}
                    </div>

                    {/* CHAT MESSAGES */}
                    <div className={style.chatsContainer}>
                        {messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={
                                    msg.sender._id === user?._id
                                        ? style.myMessage
                                        : style.theirMessage
                                }
                            >
                                {msg.content}
                            </div>
                        ))}
                    </div>

                    {/* INPUT */}
                    {selectedUser && (
                        <div className={style.chatInput}>
                            <input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                            />
                            <button onClick={sendMessage}>Send</button>
                        </div>
                    )}
                </div>
            </div>
        </ClientLayout>
    );
}
