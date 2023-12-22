import React, { useRef, forwardRef, useEffect } from 'react'

const ProfileModal = forwardRef((props, ref) => {
    useEffect(() => {
        if (ref && ref.current) {
            ref.current.click();
        }
    }, [ref]);
    return (
        <div onClick={props.closeModal}>
            <button type="button" ref={ref} className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal1">
                Launch demo modal
            </button>
            <div className="modal fade" id="exampleModal1" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            {console.log("hey")}
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header" >
                            <div style={{ fontSize: "100px", fontFamily: "Work sans", display: "flex", justifyContent: "center" }}>
                            <h1 className="modal-title fs-5" id="exampleModalLabel" >{props.user.name}</h1>
                            </div>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={props.closeModal}></button>
                        </div>
                        <div className="modal-body" style={{ fontSize: "10px", fontFamily: "Work sans", display: "flex", justifyContent: "center" }}>
                            <a className="navbar-brand" href="#">
                                <img src={props.user.pic} alt="Bootstrap" width="100" height="100" />
                            </a>
                        </div>
                        <div style={{ fontSize: "100px", fontFamily: "Work sans", display: "flex", justifyContent: "center" }}>
                            <h5>{props.user.email}</h5>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={props.closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
})

export default ProfileModal