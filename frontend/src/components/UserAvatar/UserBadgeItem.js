import React from 'react'

const UserBadgeItem = ({user,handleFunction}) => {
    const style= {
        margin:"5px",
        padding:5,
        borderRadius:10,
        variant:'solid',
        backgroundColor:"#5f94ae",
        cursor:"pointer"
    }
  return (
    <div style={style} onClick={handleFunction}>
        {user.name}
        <img style={{margin:"2px"}}src={require('./cross.png')} alt="Bootstrap" width="15" height="15" />
    </div>
  )
}

export default UserBadgeItem