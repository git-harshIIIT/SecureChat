import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'
import { getSender, getSenderFull } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import ProfileModal from './miscellaneous/ProfileModal'
import UpdateGroupChatModal from './miscellaneous/UpdateGroupChatModal'
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../animations/typing.json"
import loadingMessage from "../animations/loading.json"
import UserBadgeItem from './UserAvatar/UserBadgeItem'
import UserListItem from './UserAvatar/UserListItem'
import "./style.css"

const ENDPOINT = "https://securechatbackend.onrender.com"
var socket, selectedChatCompare


const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notification, setNotification } = ChatState()
    const [messages, setMessages] = useState([])
    const [loading, setLoading] = useState(false)
    const [newMessage, setNewMessage] = useState()
    const [socketConnected, setSocketConnected] = useState(false)
    const [typing, setTyping] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const [groupChatName, setGroupChatName] = useState()
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [renameLoading, setRenameLoading] = useState(false)

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        redererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    const loadingMes = {
        loop: true,
        autoplay: true,
        animationData: loadingMessage,
        redererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    }

    const [showModal, setShowModal] = useState(false);

    const modalRef = useRef(null);

    const [showModalGroup, setShowModalGroup] = useState(false);

    const modalRefGroup = useRef(null);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const openModalGroup = () => {
        // const modalButton = ref.current;
        // if (modalButton) {
        //     modalButton.click();
        // }
        setShowModalGroup(true);
    };

    const closeModalGroup = () => {
        setShowModalGroup(false);
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on('typing', () => setIsTyping(true))
        socket.on('stop typing', () => setIsTyping(false))
    }, []);

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            console.log("Only Admin can remove")
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`https://securechatbackend.onrender.com/api/chat/groupremove`, {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)

            user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            fetchMessages()
            setLoading(false)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            console.log("User already in Group")
            return
        }
        if (selectedChat.groupAdmin._id !== user._id) {
            console.log("Only Admin can Add")
            return
        }
        try {
            setLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`https://securechatbackend.onrender.com/api/chat/groupadd`, {
                chatId: selectedChat._id,
                userId: user1._id
            }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setLoading(false)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
    }

    const handleRename = async () => {
        console.log("No name found")
        if (!groupChatName) {
            return
        }
        try {
            setRenameLoading(true)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.put(`https://securechatbackend.onrender.com/api/chat/rename`, {
                chatId: selectedChat._id,
                chatName: groupChatName
            }, config)
            setSelectedChat(data)
            setFetchAgain(!fetchAgain)
            setRenameLoading(false)
            console.log(data)
        } catch (error) {
            console.log(error)
        }
        setGroupChatName("")
    }

    const handleSearch = async (query) => {
        setSearch(query)
        if (!search) {
            console.log("hey")
        } else {
            try {
                setLoading(true)
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                }

                const response = await axios.get(`https://securechatbackend.onrender.com/api/user?search=${search}`, config)
                setSearchResult(response.data)
                console.log(response.data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
    }


    const fetchMessages = async () => {
        if (!selectedChat) {
            return
        }
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }
            setLoading(true)
            const { data } = await axios.get(`https://securechatbackend.onrender.com/api/message/${selectedChat._id}`, config)
            setMessages(data)
            setLoading(false)
            socket.emit('join chat', selectedChat._id)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        fetchMessages()
        selectedChatCompare = selectedChat
    }, [selectedChat])

    useEffect(() => {
        socket.on('message Recieved', (newMessageRecieved) => {
            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notification.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notification])
                    setFetchAgain(!fetchAgain)
                }
            } else {
                setMessages([...messages, newMessageRecieved])
            }
        })
    })

    const sendMessage = async (event) => {
        if (event.key === 'Enter' && newMessage) {
            event.preventDefault();
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`
                    }
                }
                setNewMessage("")
                const { data } = await axios.post("https://securechatbackend.onrender.com/api/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id
                    }, config)
                console.log(data)
                socket.emit("newMessage", data)
                setMessages([...messages, data])
            } catch (error) {
                console.log(error)
            }
        }
    }

    const typingHandler = (e) => {
        setNewMessage(e.target.value)
        if (!socketConnected) return
        if (!typing) {
            setTyping(true)
            socket.emit('typing', selectedChat._id)
        }
        let lastTypingTime = new Date().getTime()
        var timerLength = 1500
        setTimeout(() => {
            var timeNow = new Date().getTime()
            var timeDiff = timeNow - lastTypingTime
            if (timeDiff >= timerLength && typing) {
                socket.emit('stop typing', selectedChat._id)
                setTyping(false)
            }
        }, timerLength)
    }




    const firstStyle = {
        fontSize: { base: "28px", md: "30px" },
        padding: 3,
        width: "100%",
        fontFamily: "Work sans",
        justifyContent: { base: "space-between" },
        alignItems: "center"
    }

    const chatContainerStyle = {
        height: "550px",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column-reverse",
        justifyContent: "flex-end"
    };


    const chatContentStyle = {
        flexGrow: 1,
        overflowY: "auto",

    };


    return (
        <>
            {selectedChat ? (
                <>
                    <span style={firstStyle}>
                        {!selectedChat.isGroupChat ? (
                            <>
                                <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ paddingLeft: 10, }}>{getSender(user, selectedChat.users)}</span>
                                    <img src={require('./info.png')} alt="Bootstrap" width="35" height="35" style={{ cursor: "pointer", margin: "0 10px 0 0" }} onClick={openModal} />
                                </div>
                                <div >
                                    {showModal && <ProfileModal ref={modalRef} closeModal={closeModal} user={getSenderFull(user, selectedChat.users)} />}
                                </div>
                                <div>
                                    <div style={{ ...chatContainerStyle, backgroundColor: "#E8E8E8", borderRadius: 10 }}>
                                    {/* <div className='messages'> */}
                                        <div style={chatContentStyle}>
                                        {/* <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}> */}
                                            {loading ? (
                                                <Lottie
                                                    options={loadingMes}
                                                    width={100}
                                                    style={{ justifyContent: "center" }}
                                                >
                                                </Lottie>
                                            ) : (
                                                <div  style={{ display: 'flex', flexDirection: "column", justifyContent: "flex-end" }}>
                                                    <ScrollableChat messages={messages} />
                                                    {isTyping ? <div>
                                                        <Lottie
                                                            options={defaultOptions}
                                                            width={70}
                                                            style={{ marginBottom: 15, marginLeft: 0 }}
                                                        />
                                                    </div> : <></>}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <form >
                                    <div>

                                        <input onKeyDown={sendMessage} placeholder='Enter a Message...' style={{ width: "100%", backgroundColor: "#E0E0E0", borderRadius: 10 }} onChange={typingHandler} value={newMessage} />
                                    </div>

                                </form>
                            </>
                        ) : (
                            <>
                                {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                                    <span style={{ paddingLeft: 10 }}><b>{selectedChat.chatName.toUpperCase()}</b></span>
                                    <img src={require('./info.png')} alt="Bootstrap" width="35" height="35" style={{ cursor: "pointer", margin: "0 10px 0 0" }} onClick={openModalGroup} />
                                </div> */}
                                {/* <div>
                                    <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal2">
                                        Launch demo modal
                                    </button>
                                    <div
                                        className="modal fade"
                                        id="exampleModal2"
                                        tabIndex="-1"
                                        aria-labelledby="exampleModalLabel"
                                        aria-hidden="true"
                                    >
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header" >
                                                    <div >
                                                        <span className="modal-title fs-5" id="exampleModalLabel" >{selectedChat.chatName}</span>
                                                    </div>
                                                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModalGroup}></button>
                                                </div>
                                                <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", display: "flex", justifyContent: "center" }}>
                                                    {selectedChat.users.map((u) => (
                                                        <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                                                    ))}
                                                </div>
                                                <div>
                                                    <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", display: "flex", justifyContent: "space-between" }}>
                                                        <input style={{ width: "350px" }} type="text" className="form-control" placeholder='Chat Name' id="exampleInputPassword1" onChange={(e) => { setGroupChatName(e.target.value) }} />
                                                        <button id="test" style={{ borderRadius: 10, backgroundColor: "#7dc7d5" }} onClick={() => handleRename()} ref={ref}>Update Name</button>
                                                    </div>
                                                    <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", justifyContent: "center" }}>
                                                        <input type="text" placeholder='Add User to Group' className="form-control" id="exampleInputPassword1" value={search} onChange={(e) => handleSearch(e.target.value)} />
                                                    </div>
                                                    <div style={{ margin: "0px" }}>
                                                        {loading ? <div>Loading</div> : (
                                                            searchResult?.slice(0, 4).map((user) => (
                                                                <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                                                            ))
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="modal-footer">
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleRemove(user)}>Leave Group</button>
                                                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => console.log("exit")}>Close</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                <div>
                                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                                        <span style={{ paddingLeft: 10 }}><b>{selectedChat.chatName.toUpperCase()}</b></span>
                                        <img
                                            src={require('./info.png')}
                                            alt="Bootstrap"
                                            width="35"
                                            height="35"
                                            style={{ cursor: "pointer", margin: "0 10px 0 0" }}
                                            onClick={openModalGroup}
                                        />
                                    </div>
                                    <div>
                                        {showModalGroup && (
                                            <div>
                                                <div className="modal fade show" tabIndex="-1" role="dialog" style={{ display: "block" }}>
                                                    <div className="modal-dialog">
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <div>
                                                                    <span className="modal-title fs-5" id="exampleModalLabel">{selectedChat.chatName}</span>
                                                                </div>
                                                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModalGroup}></button>
                                                            </div>
                                                            <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", display: "flex", justifyContent: "center" }}>
                                                                {selectedChat.users.map((u) => (
                                                                    <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
                                                                ))}
                                                            </div>
                                                            <div>
                                                                <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", display: "flex", justifyContent: "space-between" }}>
                                                                    <input style={{ width: "350px" }} type="text" className="form-control" placeholder='Chat Name' id="exampleInputPassword1" onChange={(e) => { setGroupChatName(e.target.value) }} />
                                                                    <button id="test" style={{ borderRadius: 10, backgroundColor: "#7dc7d5" }} onClick={() => handleRename()}>Update Name</button>
                                                                </div>
                                                                <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", justifyContent: "center" }}>
                                                                    <input type="text" placeholder='Add User to Group' className="form-control" id="exampleInputPassword1" value={search} onChange={(e) => handleSearch(e.target.value)} />
                                                                </div>
                                                                <div style={{ margin: "0px" }}>
                                                                    {loading ? <div>Loading</div> : (
                                                                        searchResult?.slice(0, 4).map((user) => (
                                                                            <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                                                                        ))
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleRemove(user)}>Leave Group</button>
                                                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => console.log("exit")}>Close</button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="modal-backdrop fade show"></div>
                                            </div>
                                        )}
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-primary d-none"
                                                data-bs-toggle="modal"
                                                data-bs-target="#exampleModal2"
                                                ref={modalRefGroup}
                                            >
                                                Launch demo modal
                                            </button>
                                            <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                                {/* Modal content */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div style={{ ...chatContainerStyle, backgroundColor: "#E8E8E8", borderRadius: 10 }}>
                                        <div style={chatContentStyle}>
                                            {loading ? (
                                                <Lottie
                                                    options={loadingMes}
                                                    width={100}
                                                    style={{ justifyContent: "center" }}
                                                >
                                                </Lottie>
                                            ) : (
                                                <div style={{ display: 'flex', flexDirection: "column" }}>
                                                    <ScrollableChat messages={messages} />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <form >
                                        {isTyping ? <div>
                                            <Lottie
                                                options={defaultOptions}
                                                width={70}
                                                style={{ marginBottom: 15, marginLeft: 0 }}
                                            />
                                        </div> : <></>}
                                        <input onKeyDown={sendMessage} placeholder='Enter a Message...' style={{ width: "100%", backgroundColor: "#E0E0E0", borderRadius: 10 }} onChange={typingHandler} value={newMessage} />
                                    </form>
                                </div>
                            </>
                        )}

                    </span>


                </>
            ) : (
                <div style={{ display: 'flex', alignItems: "center", justifyContent: "center", height: "100%" }}>
                    <span style={{ fontSize: "30px", fontFamily: "Work sans" }}>Click on a User to Start Chatting</span>
                </div>
            )}
        </>
    )
}

export default SingleChat