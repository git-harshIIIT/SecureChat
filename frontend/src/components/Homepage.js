import React,{useEffect} from 'react'
import Login from './Authentication/Login'
import Signup from './Authentication/Signup'
import {useNavigate} from 'react-router-dom'


const Homepage = () => {
  let navigate = useNavigate()

  useEffect(()=>{
    const userInfo = JSON.parse(localStorage.getItem("userInfo"))
    if(userInfo){
        navigate('/chat')
    }
},[navigate])



  const Upperstyle = {
    display: "flex",
    justifyContent: "center",
    padding: 1,
    background: "white",
    width: "50%",
    margin: "60px 0px 50px 300px",
    borderRadius: 20,
    borderWidth: "1px"
  }
  const lowerstyle = {
    background: "white",
    width: "50%",
    margin: "60px 0px 50px 300px",
    padding: 1,
    borderRadius: 5,
    borderWidth: "1px"
  }
  return (
    <div className='container-xl'>
      <div style={Upperstyle}>
        <h3 style={{ fontFamily: "Times New Roman" }}>Secure-Chat</h3>
      </div>
      <div style={lowerstyle}>
        {/* <ul className="nav nav-pills" >
          <li className="nav-item" style={{ width: "50%", borderRadius: 20, borderWidth: "1px" }}>
            <a className={`nav-link ${active === false ? "active" : ""}`} onClick={active === true ? activeHandler : dontHandler} aria-current="page" href="#">Login</a>
          </li>
          <li className="nav-item" style={{ width: "50%", borderRadius: 20, borderWidth: "1px" }}>
            <a className={`nav-link ${active === false ? "" : "active"}`} href="#" onClick={active === false ? activeHandler : dontHandler}>SignUp</a>
          </li>
        </ul> */}
        <ul className="nav nav-tabs" id="myTab" role="tablist">
          <li className="nav-item" role="presentation" style={{ width: "50%", borderRadius: 20, borderWidth: "1px" }}>
            <button className="nav-link active" id="home-tab" data-bs-toggle="tab" data-bs-target="#home-tab-pane" type="button" role="tab" aria-controls="home-tab-pane" aria-selected="true">Login</button>
          </li>
          <li className="nav-item" role="presentation" style={{ width: "50%", borderRadius: 20, borderWidth: "1px" }}>
            <button className="nav-link" id="profile-tab" data-bs-toggle="tab" data-bs-target="#profile-tab-pane" type="button" role="tab" aria-controls="profile-tab-pane" aria-selected="false">Signup</button>
          </li>
        </ul>
        <div className="tab-content" id="myTabContent">
          <div className="tab-pane fade show active" id="home-tab-pane" role="tabpanel" aria-labelledby="home-tab" tabIndex="0"><Login/></div>
          <div className="tab-pane fade" id="profile-tab-pane" role="tabpanel" aria-labelledby="profile-tab" tabIndex="0"><Signup/></div>
        </div>
      </div>
    </div>
  )
}

export default Homepage