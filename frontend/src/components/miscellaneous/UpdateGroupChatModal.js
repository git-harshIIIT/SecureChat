// import React, { useRef, forwardRef, useEffect, useState } from 'react'
// import { ChatState } from '../../Context/ChatProvider'
// import UserBadgeItem from '../UserAvatar/UserBadgeItem'
// import axios from 'axios'
// import UserListItem from '../UserAvatar/UserListItem'
// // import Lottie from 'react-lottie'
// // import loadingMessage from "./animations/loading.json"


// const UpdateGroupChatModal = forwardRef((props, ref) => {
//     const { setFetchAgain, fetchAgain,fetchMessages } = props

//     const [groupChatName, setGroupChatName] = useState()
//     const [search, setSearch] = useState("")
//     const [searchResult, setSearchResult] = useState([])
//     const [loading, setLoading] = useState(false)
//     const [renameLoading, setRenameLoading] = useState(false)

//     const { user, selectedChat, setSelectedChat } = ChatState()

//     const loadingMes = {
//         loop: true,
//         autoplay: true,
//         animationData: loadingMessage,
//         redererSettings: {
//             preserveAspectRatio: "xMidYMid slice"
//         }
//     }

//     const handleRemove = async(user1) => {
//         if(selectedChat.groupAdmin._id !== user._id && user1._id !== user._id){
//             console.log("Only Admin can remove")
//             return
//         }
//         try {
//             setLoading(true)
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${user.token}`
//                 }
//             }

//             const { data } = await axios.put(`https://securechatbackend.onrender.com/api/chat/groupremove`, {
//                 chatId: selectedChat._id,
//                 userId: user1._id
//             }, config)

//             user1._id === user._id ? setSelectedChat() : setSelectedChat(data)
//             setFetchAgain(!fetchAgain)
//             fetchMessages() 
//             setLoading(false)
//             console.log(data)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleAddUser = async (user1) =>{
//         if(selectedChat.users.find((u)=>u._id===user1._id)){
//             console.log("User already in Group")
//             return
//         }
//         if(selectedChat.groupAdmin._id !== user._id){
//             console.log("Only Admin can Add")
//             return
//         }
//         try {
//             setLoading(true)
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${user.token}`
//                 }
//             }

//             const { data } = await axios.put(`https://securechatbackend.onrender.com/api/chat/groupadd`, {
//                 chatId: selectedChat._id,
//                 userId: user1._id
//             }, config)
//             setSelectedChat(data)
//             setFetchAgain(!fetchAgain)
//             setLoading(false)
//             console.log(data)
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     const handleRename = async () => {
//         console.log("No name found")
//         if (!groupChatName) {
//             return
//         }
//         try {
//             setRenameLoading(true)
//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${user.token}`
//                 }
//             }

//             const { data } = await axios.put(`https://securechatbackend.onrender.com/api/chat/rename`, {
//                 chatId: selectedChat._id,
//                 chatName: groupChatName
//             }, config)
//             setSelectedChat(data)
//             setFetchAgain(!fetchAgain)
//             setRenameLoading(false)
//             console.log(data)
//         } catch (error) {
//             console.log(error)
//         }
//         setGroupChatName("")
//     }

//     const handleSearch = async (query) => {
//         setSearch(query)
//         if (!search) {
//             console.log("hey")
//         } else {
//             try {
//                 setLoading(true)
//                 const config = {
//                     headers: {
//                         Authorization: `Bearer ${user.token}`
//                     }
//                 }

//                 const response = await axios.get(`https://securechatbackend.onrender.com/api/user?search=${search}`, config)
//                 setSearchResult(response.data)
//                 console.log(response.data)
//                 setLoading(false)
//             } catch (error) {
//                 console.log(error)
//             }
//         }
//     }

//     useEffect(() => {
//         if (ref && ref.current) {
//             ref.current.click();
//         }
//     }, [ref]);
//     return (
//         <div onClick={props.closeModalGroup}>
//             <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal2">
//                 Launch demo modal
//             </button>
//             <div className="modal fade" id="exampleModal2" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
//                 <div className="modal-dialog">
//                     <div className="modal-content">
//                         <div className="modal-header" >
//                             <div >
//                                 <span className="modal-title fs-5" id="exampleModalLabel" >{selectedChat.chatName}</span>
//                             </div>
//                             <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={props.closeModalGroup}></button>
//                         </div>
//                         <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", display: "flex", justifyContent: "center" }}>
//                             {selectedChat.users.map((u) => (
//                                 <UserBadgeItem key={u._id} user={u} handleFunction={() => handleRemove(u)} />
//                             ))}
//                         </div>
//                         <div>
//                             <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", display: "flex", justifyContent: "space-between" }}>
//                                 <input style={{ width: "350px" }} type="text" className="form-control" placeholder='Chat Name' id="exampleInputPassword1" onChange={(e) => { setGroupChatName(e.target.value) }} />
//                                 <button id="test" style={{ borderRadius: 10, backgroundColor: "#7dc7d5" }} onClick={() => handleRename()} ref={props.modalRefGroup}>Update Name</button>
//                             </div>
//                             <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", justifyContent: "center" }}>
//                                 <input type="text" placeholder='Add User to Group' className="form-control" id="exampleInputPassword1" value={search} onChange={(e) => handleSearch(e.target.value)} />
//                             </div>
//                             <div style={{ margin: "0px" }}>
//                                 {loading ? <Lottie
//                                         options={loadingMes}
//                                         width={100}
//                                         style={{justifyContent:"center"}}
//                                         >
//                                         </Lottie> : (
//                                     searchResult?.slice(0, 4).map((user) => (
//                                         <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
//                                     ))
//                                 )}
//                             </div>
//                         </div>
//                         <div className="modal-footer">
//                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => handleRemove(user)}>Leave Group</button>
//                             <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={() => console.log("exit")}>Close</button>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// })

// export default UpdateGroupChatModal