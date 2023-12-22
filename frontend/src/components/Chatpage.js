import React, { useEffect, useState } from 'react'
import { ChatState } from "../Context/ChatProvider"
import ChatBox from './ChatBox'
import SideDrawer from './miscellaneous/SideDrawer'
import MyChats from './MyChats'

const Chatpage = () => {

  // const refresh = ()=>{
  //   // localStorage.setItem("rel  oad")
  //   window.location.reload(false);
  // }

  // useEffect=(()=>{
  //   refresh()
  // },[])

  // useEffect(() => {
  //   window.location.reload();
  //   console.log('Page refreshed automatically');
  // }, []);

  
  // const [count,setCount] = useState(0)
  // const refresh = (count) => {
  //   if(count===0){
  //     setTimeout(() => {
  //       window.location.reload();
  //       setCount(1)
  //     }, 1500);
  //   }
  // }
  
  // useEffect(() => {
  //   refresh(count);
  // }, []);


  const [fetchAgain, setFetchAgain] = useState(false)

  const Upperstyle = {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
    // margin: "60px 0px 50px 300px",
    padding: "10px"
  }
  const { user } = ChatState()
  return (
    // <div style={{width:"100%"}}>
    //   {user && <SideDrawer />}
    //   <div style={Upperstyle}>
    //     {user && <MyChats fetchAgain={fetchAgain}/>}
    //     {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>}

    //   </div>
    // </div>
    <div style={{ width: "100%" }}>
      {user ? <SideDrawer /> : null}
      <div style={Upperstyle}>
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
      </div>
    </div>
  )
}

export default Chatpage