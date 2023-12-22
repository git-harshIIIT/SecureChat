import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  let navigate = useNavigate()
  const [Cemail, setEmail] = useState('')
  const [Cpassword, setPassword] = useState('')

  const submitHandler = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch("https://securechatbackend.onrender.com/api/user/login", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: Cemail, password: Cpassword })
      })
      const json = await response.json()
      console.log(json)
      localStorage.setItem("userInfo", JSON.stringify(json));
      {
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div className="toast-header">
            <img src="..." className="rounded me-2" alt="..." />
            <strong className="me-auto">Bootstrap</strong>
            <small>11 mins ago</small>
            <button type="button" className="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div className="toast-body">
            Hello, world! This is a toast message.
          </div>
        </div>
      </div>
      }
      navigate('/chat')
    } catch (error) {
      console.log(`${error}`)
    }

  }


  return (
    <div className='container my-2'><form onSubmit={submitHandler}>
      <div className="mb-3">
        <label for="exampleInputEmail1" className="form-label" >Email address</label>
        <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" onChange={(e) => { setEmail(e.target.value) }} required />
        <div id="emailHelp" className="form-text"></div>
      </div>
      <div className="mb-3">
        <label for="exampleInputPassword1" className="form-label">Password</label>
        <input type="password" className="form-control" id="exampleInputPassword1" onChange={(e) => { setPassword(e.target.value) }} required />
      </div>
      <button style={{ margin: "0 0 5px 0" }} type="submit" className="btn btn-primary">Submit</button>
    </form></div>
  )
}

export default Login