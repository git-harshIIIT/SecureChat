import React from 'react'
import { ChatState } from '../../Context/ChatProvider'

const UserListItem = ({user,handleFunction}) => {
    const style = {
        backgroundColor:"#E8E8E8",
        borderRadius:15,
        marginBottom:"5px",
        width:"10rem",
        display:"flex"
    }
  return (
    <div className='cotainer-fluid'>
        <button id='searchResult' className="border border-4" onClick={handleFunction} style={style}>
            <div>
                <img src={user.pic}  width="30" height="30"/>
            </div>
            <div>
                {user.name}
            </div>
        </button>
    </div>
  )
}

export default UserListItem