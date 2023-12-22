import React, { useRef, forwardRef, useEffect, useState } from 'react'
import { ChatState } from '../../Context/ChatProvider';
import axios from "axios"


const GroupChatModal = forwardRef((props, ref) => {
    useEffect(() => {
        if (ref && ref.current) {
            ref.current.click();
        }
    }, [ref]);

    const [groupChatName, setGroupChatName] = useState()
    const [selectedUsers, setSelectedUsers] = useState([])
    const [search, setSearch] = useState("")
    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)

    const { user, chats, setChats } = ChatState()

    const handleSearch= async ()=>{
        if(!search){
          console.log("hey")
        }else{
          try {
            setLoading(true)
            const config = {
              headers:{
                Authorization:`Bearer ${user.token}`
              }
            }
    
            const response = await axios.get(`https://securechatbackend.onrender.com/api/user?search=${search}`,config)
            setSearchResult(response)
            console.log(response)
            setLoading(false)
          } catch (error) {
            console.log(error)
          }
        }
      }

    const handleSubmit = () => {
    }

    return (
        <div onClick={props.closeModal}>
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header" >
                            <div style={{ fontSize: "100px", fontFamily: "Work sans", display: "flex", justifyContent: "center" }}>
                                <h1 className="modal-title fs-5" id="exampleModalLabel" >Create New Group</h1>
                            </div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={props.closeModal}></button>
                        </div>
                        <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", justifyContent: "center" }}>
                            <input type="text" className="form-control" id="exampleInputPassword1" onChange={(e) => { setGroupChatName(e.target.value) }} />
                        </div>
                        <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", justifyContent: "center" }}>
                            <input type="text" className="form-control" id="exampleInputPassword1" value={search} onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div style={{ fontSize: "10px", fontFamily: "Work sans", display: "flex", justifyContent: "center" }}>

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={handleSubmit}>Close</button>
                        </div>
                            <button type="button" onClick={console.log("aya")}>Search</button>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default GroupChatModal