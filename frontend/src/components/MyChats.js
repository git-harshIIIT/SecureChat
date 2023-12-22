import axios from 'axios'
import React, { useState, useEffect, useRef } from 'react'
import { getSender } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'
import ChatLoading from './ChatLoading'
import GroupChatModal from './miscellaneous/GroupChatModal'
import UserBadgeItem from './UserAvatar/UserBadgeItem'
import UserListItem from './UserAvatar/UserListItem'

const MyChats = ({fetchAgain}) => {

  const ref = useRef(null);

  const openModal = () => {
    ref.current.click()
  };

  const [loggedUser, setLoggedUser] = useState()
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState()

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`
        },
      }
      const response = await axios.get("https://securechatbackend.onrender.com/api/chat", config)
      setChats(response.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchChats()
  }, [fetchAgain])

  const [groupChatName, setGroupChatName] = useState()
  const [selectedUsers, setSelectedUsers] = useState([])
  const [search, setSearch] = useState("")
  const [searchResult, setSearchResult] = useState([])
  const [loading, setLoading] = useState(false)


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
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
  }

  const handleGroup = (userToAdd) =>{
    if(selectedUsers.includes(userToAdd)){
      console.log("user already in group")
      return
    }

    setSelectedUsers([...selectedUsers,userToAdd])
  }

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async()=>{
    if(!groupChatName || !selectedUsers){
      console.log("Please fill the fields to create a new Chat ")
      return
    }
    try {
      setLoading(true)
        const config = {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }

        const {data} = await axios.post(`https://securechatbackend.onrender.com/api/chat/group`,{
          name: groupChatName,
          users:JSON.stringify(selectedUsers.map((u)=> u._id))
        },config)

        setChats([data,...chats])
    } catch (error) {
      console.log(error)
    }
  }
  const bottomEl = useRef(null);

  const scrollToBottom = () => {
    bottomEl?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const selectToBottom = (chat) =>{
    scrollToBottom()
    setSelectedChat(chat)
  }

  const style = {
    minHeight: "70vh",
    minWidth: "60vh",
    backgroundColor: "white",
    backgroundSize: "contain",
    backgroundPosition: "center",
    borderRadius: 15
  }

  return (
    <div style={style}>
      <div className='chatHead' style={{ display: "flex", justifyContent: "space-between", margin: "20px" }}>
        <div className='container me-auto'>
          My Chats
        </div>
        <button className='container ms-auto' onClick={openModal} style={{ backgroundColor: "#f0ffa9", margin: "0 0 0 40px", borderRadius: 20 }}>
          New Chat +
        </button>
        <div>
          {/* {showModal && <GroupChatModal ref={modalRef} closeModal={closeModal} user={user} />} */}
        </div>
      </div>
      <div className='allChats' style={{ display: "flex", flexDirection: "column", }}>
        {chats ? (
          <div className="vstack gap-3" style={{overflow:"auto", height:"575px"}}>
            {chats.map((chat) => (
              <div className="p-2" key={chat._id} onClick={()=>selectToBottom(chat)} style={{ cursor: "pointer" }}>
                <div style={{ borderStyle: "solid", borderRadius: 15, padding: "10px", backgroundColor: `${selectedChat === chat ? "#9292b6" : "#e6e8e0"}`, color: `${selectedChat === chat ? "white" : "black"}` }}>
                  {!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                  {chat.latestMessage && (
                  <div fontSize="xs">{chat.isGroupChat?<b>{chat.latestMessage.sender.name} : </b>:<></>}
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </div>
                  )}
                  </div>
              </div>
            ))}
          </div>
        ) : (
          <ChatLoading />
        )}
      </div>
      <div>
        <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
          Launch demo modal
        </button>
        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h1 className="modal-title fs-5" id="exampleModalLabel">Create New Group</h1>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    {/* <label htmlFor="title" className="form-label">Title</label> */}
                    <input type="text" placeholder='Chat Name' className="form-control" id="etext" name="etitle" aria-describedby="emailHelp" onChange={(e) => { setGroupChatName(e.target.value) }} />
                    <div id="emailHelp" className="form-text"></div>
                  </div>
                  <div className="mb-3">
                    {/* <label htmlFor="description" className="form-label">Description</label> */}
                    <input type="text" placeholder='Add Users eg: Raj,Tushar' className="form-control" id="edescription" name="edescription" value={search} onChange={(e) => handleSearch(e.target.value)} />
                  </div>
                </form>
                <div style={{display:'flex'}}>
                  {selectedUsers.map((u)=>(
                    <UserBadgeItem key={user._id} user = {u} handleFunction={()=>handleDelete(u)}/>
                  ))}
                </div>
                <div style={{ margin: "0px" }}>
                  {loading ? <div>Loading</div> : (
                    searchResult?.slice(0,4).map((user) => (
                      <UserListItem key={user._id} user={user} handleFunction={() => handleGroup(user)} />
                    ))
                  )}
                </div>
              </div>
              <div className="modal-footer">
                {/* <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button> */}
                <button type="button" className="btn btn-primary" onClick={handleSubmit} data-bs-dismiss="modal">Create Group</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MyChats