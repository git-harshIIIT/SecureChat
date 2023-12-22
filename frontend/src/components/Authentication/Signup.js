import React, { useState } from 'react'
import {Navigate, useNavigate} from 'react-router-dom'

const SignUp = () => {
    let navigate = useNavigate()
    const [Cname,setName] = useState('')
    const [Cemail,setEmail] = useState('')
    const [Cpassword,setPassword] = useState('')
    const [confirmPassword,setConfirmPass] = useState('')
    const [Cpic,setPic] = useState()

    const picHandler = (pics)=>{
        if(pics === undefined){
            return
        }
        if (pics.type === "image/jpeg" || pics.type === "image/png"){
            const data = new FormData();
            data.append('file',pics)
            data.append("upload_preset","chatApp")
            data.append("cloud_name",'dutkjmh3l')
            fetch("https://api.cloudinary.com/v1_1/dutkjmh3l/image/upload",{
                method:"POST",
                body: data
            }).then((res)=>res.json()).then(data=>{
                setPic(data.url.toString())
                console.log(data.url.toString())
            })
            .catch((err)=>{
                console.log(err)
            })
        }else{
            console.log(pics.type)
        }
    }

    const submitHandler = async(e)=>{
        e.preventDefault()
        if(Cpassword!==confirmPassword){
            console.log("Please recheck your password")
            return
        }
        try {
            const response = await fetch("https://securechatbackend.onrender.com/api/user",{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({name:Cname,email:Cemail,password:Cpassword,pic:Cpic})
            })
            const json = await response.json()
            console.log(json)
            console.log("successfully Registered")
            navigate('/chat')
        } catch (error) {
            console.log(`${error}`)
        }

    }
    return (
        <div className='container'><form onSubmit={submitHandler}>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Name</label>
                <input type="text" className="form-control" id="name" onChange={(e)=>{setName(e.target.value)}} required />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                <input type="email" className="form-control" id="email" aria-describedby="emailHelp" onChange={(e)=>{setEmail(e.target.value)}} required/>
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" onChange={(e)=>{setPassword(e.target.value)}} required />
            </div>
            <div className="mb-3">
                <label htmlFor="exampleInputPassword1" className="form-label" >Confirm Password</label>
                <input type="password" className="form-control" id="cpassword" onChange={(e)=>{setConfirmPass(e.target.value)}} required />
            </div>
            <div>
            <label htmlFor="exampleInputPassword1" className="form-label" >Upload your picture</label>
            </div>
            <div className="input-group">
                <div><input type="file" className="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" onChange={(e)=>{picHandler(e.target.files[0])}} aria-label="Upload" /></div>
            </div>
            <button style={{ margin: "15px 0 5px 0" }} type="submit"  className="btn btn-primary">Submit</button>
        </form></div>
    )
}

export default SignUp