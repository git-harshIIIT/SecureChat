import React from 'react'
import { ChatState } from '../Context/ChatProvider'
import SingleChat from './SingleChat'


const ChatBox = ({fetchAgain,setFetchAgain}) => {
  const {selectedChat} = ChatState()
  return (
    <div style={{display:{base:selectedChat ? "flex":"none"},
    minHeight: "85vh",
    minWidth: "135vh",
    backgroundColor: "white",
    backgroundSize: "contain",
    backgroundPosition: "center",
    borderRadius: 15,
    justifyContent:"center"}}>
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>
    </div>
  )
}

export default ChatBox