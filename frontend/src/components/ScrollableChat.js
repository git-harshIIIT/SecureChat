import React from 'react'
import ScrollableFeed from "react-scrollable-feed"
import { isLastMessage, isSameSender, isSameSenderMargin, isSameUser } from '../config/ChatLogics'
import { ChatState } from '../Context/ChatProvider'

const ScrollableChat = ({ messages }) => {
    const check = (senderId, userId) => {
        return senderId === userId ? "#BEE3F8" : "#B9F5D0";
      };
    const { user } = ChatState()
    return (
        <ScrollableFeed>
            {messages && messages.map((m, i) => <div style={{ display: "flex" }} key={m._id}>
                    {(isSameSender(messages, m, i, user._id) || isLastMessage(messages, i, user._id))&&
                    (<img src={m.sender.pic} width="20" height="20" alt="Nf" data-bs-toggle="tooltip" data-bs-html="true" data-bs-title={m.sender.name} style={{cursor:"pointer"}}/>)}
                    <div style={{marginBottom:isSameUser(messages,m,i,user._id)?10:15,marginLeft:isSameSenderMargin(messages,m,i,user._id)}}>
                    <span style={{backgroundColor : check(m.sender._id,user._id),borderRadius:"20px",margin:"0 0 0 5px",padding:"5px 15px", maxWidth:"75%"}}>{m.content}</span>
                    </div>
            </div>)}
        </ScrollableFeed>
    )
}

export default ScrollableChat