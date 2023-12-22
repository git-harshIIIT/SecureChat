import React, { useState, useRef } from 'react'
import { ChatState } from "../../Context/ChatProvider"
import ProfileModal from './ProfileModal'
import { useNavigate } from 'react-router-dom'
import Drawer from 'react-modern-drawer'
import 'react-modern-drawer/dist/index.css'
import axios from "axios"
import ChatLoading from '../ChatLoading'
import UserListItem from '../UserAvatar/UserListItem'
import { getSender } from '../../config/ChatLogics'
import NotificationBadge from "react-notification-badge"
// import NotificationBadge from 'react-notification-badge/lib/components/NotificationBadge'


const SideDrawer = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const toggleDrawer = () => {
    setIsOpen((prevState) => !prevState)
  }
  let navigate = useNavigate()

  const { user, setSelectedChat, chats, setChats, notification, setNotification } = ChatState()
  const Upperstyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    // margin: "60px 0px 50px 300px",
    padding: "10px"
  }
  const [showModal, setShowModal] = useState(false);

  const modalRef = useRef(null);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const logoutHandler = () => {
    localStorage.removeItem('userInfo')
    navigate('/')

  }
  const accessChat = async (userId) => {
    try {
      setLoadingChat(true)
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`
        },
      }

      const { data } = await axios.post("https://securechatbackend.onrender.com/api/chat", { userId }, config)

      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats])
      setSelectedChat(data)
      setLoadingChat(false)
    } catch (error) {
      console.log(error)
    }
  }
  const handleSearch = async () => {
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
        setSearchResult(response)
        setResult(response.data)
        console.log(response)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }
  }
  const [result, setResult] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState();
  return (
    <div>
      <nav className="navbar navbar-expand-sm navbar-light bg-light" style={{borderRadius:15}}>
        <div className="container-fluid">
          <div className="collapse navbar-collapse " id="navbarSupportedContent">
            <form className="d-flex me-auto">
              <input className="form-control me-2" type="search" placeholder="Search User" onClick={toggleDrawer} aria-label="Search" />
            </form>
            <div className="mx-auto">
              {/* <a className="navbar-brand " href="#">Secure-Chat</a> */}
              <img src={require('./secureChat.png')} alt="Bootstrap" width="150" height="45" />
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
            </div>
            <div className="ms-auto dropstart">
              <button style={{ border: "none" }} className="navbar-brand position-relative" data-bs-toggle="dropdown" aria-expanded="false" href="#">
                <img src={require('./notification1.png')} alt="Bootstrap" width="30" height="30" />
                <span class="position-absolute top-2 start-90 translate-middle badge rounded-pill bg-danger" style={{fontSize:"10px"}}>
                  {notification.length}
                </span>
              </button>
              {/* <ul className="dropdown-menu">
                <li><a className="dropdown-item">{!notification.length && "No New Messages"}
                {notification.map(notif =>{
                  {notif.chat.isGroupChat?`New Message in ${notif.chat.chatName}`:`New Message from ${getSender(user,notif.chat.users)}`}
                })}</a></li>
              </ul> */}
              <ul className="dropdown-menu">
                <a className="dropdown-item">
                  {!notification.length ? (
                    <li>"No New Messages"</li>
                  ) : (
                    notification.map((notif) =>
                      notif.chat.isGroupChat
                        ? <li onClick={() => {
                          setSelectedChat(notif.chat)
                          setNotification(notification.filter((n) => n !== notif))
                        }}>`New Message in {notif.chat.chatName}</li>
                        : <li onClick={() => {
                          setSelectedChat(notif.chat)
                          setNotification(notification.filter((n) => n !== notif))
                        }}>`New Message from {getSender(user, notif.chat.users)}</li>
                    )
                  )}
                </a>
              </ul>
            </div>
            <div className="dropdown dropstart">
              <button style={{borderRadius:15}} className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                <img style={{ borderRadius: 20, borderWidth: "1px" }} src={user.pic} alt="Bootstrap" width="30" height="30" />
              </button>
              <ul className="dropdown-menu">
                <li><a className="dropdown-item" onClick={openModal} href="#exampleModal">My Profile</a></li>
                <li><a className="dropdown-item" href="#" onClick={logoutHandler}>Log out</a></li>
              </ul>
              <div>
                {showModal && <ProfileModal ref={modalRef} closeModal={closeModal} user={user} />}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <Drawer
        open={isOpen}
        onClose={toggleDrawer}
        direction='left'
        className='bla bla bla'
      >
        <div style={{ margin: "20px" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <h5>Search User</h5>
          </div>
          <div style={{ margin: "10px", display: "flex", justifyContent: "center" }}>
            <input style={{borderRadius:15,padding:5}} className="drawerInput" type="search" placeholder="Username" value={search} onChange={(e) => { setSearch(e.target.value) }} aria-label="Search" />
            <button style={{width:50 , border:"none"}} className="btn btn-outline-success" type="submit" onClick={handleSearch}>
              <img src={require('./search.png')} alt="Bootstrap" width="30" height="30" />
            </button>
          </div>
          <div style={{ margin: "0px" }}>
            {loading ? <ChatLoading /> : (
              result?.map((user) => (
                <UserListItem key={user._id} user={user} handleFunction={() => accessChat(user._id)} />

              ))
            )}
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default SideDrawer