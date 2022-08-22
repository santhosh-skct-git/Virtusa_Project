import React, { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard'
import './Styles/Usersprofile.css'
import { Button, Modal, Form, ModalHeader, ModalBody } from 'react-bootstrap'
import { Table } from 'react-bootstrap'
import axios from 'axios'
import { BiPencil, BiTrash } from "react-icons/bi";
import {CgList} from "react-icons/cg"
import { toast, ToastContainer } from 'react-toastify'
import ReactPaginate from "react-paginate";
import { useHistory } from 'react-router-dom'


function UsersProfile() {
    const history=useHistory()
    const [infoshow, setInfoShow] = useState(false)
    const [bookingShow,setBookingShow] =useState(false)
    const [userDetails, setUserDetails] = useState({})
    const [userBooking,setUserBooking]=useState([])
    const [userName,setUserName]=useState("")
    const [pageNumber,setPageNumber]=useState(0);
    const [ticketsPageNumber,setticketsPageNumber]=useState(0);
    const cardsPerPage = 5;
    const ticketsPerPage =5;
    const pagesVisited = pageNumber * cardsPerPage;
    const ticketsVisited=ticketsPageNumber*ticketsPerPage;
    const handleShow = (id) => {

        setInfoShow(true);
        axios.get(`http://localhost:8080/getUserById/${id}`, {
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }).then((response) => {
            
            setUserDetails(response.data)
        })
            .catch((err) => {
                console.log(err);
            })


    }
    const EditSubmit = (userid) => {
       
        axios.put(`http://localhost:8080/updateUserById/${userid}`,userDetails,{
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }).then((response) => {
           
            toast.success('Updated Successfully', {
                position: "top-center",
                closeOnClick: true,
                progress: undefined,
                autoClose: 5000,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: true
            })
            window.location.reload();
        })
            .error((err) => {
                console.log(err)

            })
    }
    const handleChange = (event, field) => {
        setUserDetails({
            ...userDetails,
            [field]: event.target.value,
        })
    }
   
  
    const onClickDelete = async (data) => {
        if (window.confirm('Are you sure?')) {
            axios.delete(`http://localhost:8080/deleteUserById/${data}`, {
                headers: {
                    Authorization: localStorage.getItem("token")
                }
            }
            ).then((response) => {
                toast.success('Deleted Successfully', {
                    position: "top-center",
                    closeOnClick: true,
                    progress: undefined,
                    autoClose: 3000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true
                })
                setTimeout(()=>{
                    window.location.reload();
                },3000)
               
            })
        }
        
    }
    const [posts, setPost] = useState([])
    useEffect(() => {
        axios.get("http://localhost:8080/allUsers", {
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }).then((res) => {
          
            setPost(res.data)
        })
            .catch((err) =>{
                console.log(err)
                if(err.response.status===403){
                    setTimeout(()=>{
                      history.push("/user/home");
                    },2000)
                  }
                })
    }, [])
    const handleClose=()=>{
        setBookingShow(false)
        setInfoShow(false)
    }
    const onshowHistory =(id,name)=>{
       
        setBookingShow(true);
        setUserName(name);
        axios.get(`http://localhost:8080/getbyuserid/${id}`
        ).then((response)=>{
           
           
            setUserBooking(response.data)
          
        }).catch(err=>{
            setBookingShow(false)
            toast.warn('No bookings so far :(', {
                closeOnClick: true,
                progress: undefined,
                autoClose: 2000,
                hideProgressBar: true,
                
            })
            console.log(err)
        })
    }
   
    const pageCount = Math.ceil(posts.length / cardsPerPage);
    const ticketCount =Math.ceil(userBooking.length/ticketsPerPage)

    const changePage = ({ selected }) => {
      setPageNumber(selected);
    };
    const ticketsChangePage=({selected})=>{
        setticketsPageNumber(selected);
    }
    return <div id="usersbody" >
        <AdminDashboard />


        <Table  bordered hover  id="usertable" >
            <thead>
                <tr >
                    <th>User Name</th>
                    <th>Email id</th>
                    <th>Mobile number</th>

                    <th>Edit</th>
                    <th>Delete</th>
                    <th>Bookings</th>
                </tr>
            </thead>
            <tbody>

                {
                    posts?.slice(pagesVisited, pagesVisited + cardsPerPage).map((post) => {
                        return (
                            <tr key={post.id} id="userrow">
                                <td>{post.username}</td>
                                <td>{post.email}</td>
                                <td>{post.mobileNumber}</td>

                                <td><Button onClick={() => { handleShow(post.id) }} id="edituserbtn"><BiPencil /> </Button></td>
                                <td><Button className="btn btn-warning" onClick={() => { onClickDelete(post.id) }} id="deleteuserbtn"><BiTrash /></Button></td>
                                <td><Button className="btn btn-secondary" onClick={() => { onshowHistory(post.id,post.username) }} id="ticketuserbtn"><CgList /></Button></td>
                            </tr>
                        )
                    })
                }
            </tbody>
        </Table>

        <ToastContainer />

        <Modal show={infoshow} onHide={handleClose}>
            <ModalHeader ><div style={{ marginLeft: '35%' }}><h3>User Details</h3></div></ModalHeader>
            <Form id="userEditForm">
                <Modal.Body>
                    <label htmlFor="username">UserName</label>
                    <div className="col-sm-6">
                        <Form.Control id="username" name="username" placeholder="Enter User name" value={userDetails.username || ''} onChange={(e) => {
                            handleChange(e, "username")
                        }} ></Form.Control>
                    </div>
                    <label htmlFor="email">Email</label>
                    <div className="col-sm-6">
                        <Form.Control id="email" name="email" placeholder="Enter email id" value={userDetails.email || ''} onChange={(e) => {
                            handleChange(e, "email")
                        }} ></Form.Control>
                    </div>
                    <label htmlFor="mobileNumber">Mobile Number</label>
                    <div className="col-sm-6">
                        <Form.Control id="mobileNumber" name="mobileNumber" placeholder="Enter mobile number" value={userDetails.mobileNumber || ''} onChange={(e) => {
                            handleChange(e, "mobileNumber")
                        }} ></Form.Control>
                    </div>

                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn btn-warning" onClick={() => { setInfoShow(false) }}>Cancel</Button>
                    <Button onClick={() => { EditSubmit(userDetails.id) }}>Update</Button>

                </Modal.Footer>

            </Form>

        </Modal>
        <Modal show={bookingShow} onHide={handleClose} size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>
           <Modal.Header><Modal.Title>{userName}'s Booking History</Modal.Title></Modal.Header>
            <ModalBody>
                <Table bordered hover style={{justifyContent:'center'}}>
                    <thead>
                        <th>Date</th>
                        <th>Vehicle_Name</th>
                        <th>From</th>
                        <th>To</th>
                        <th>No.of Persons</th>
                    </thead>
                    <tbody>
                    {
                    userBooking.slice(ticketsVisited, ticketsVisited + ticketsPerPage).map((booking) => {
                        return (
                            <tr key={booking.id} >
                                <td>{booking.date}</td>
                                <td>{booking.vehicleName}</td>
                                
                                <td>{booking.from}</td>
                                <td>{booking.to}</td>
                                <td>{booking.noOfPersons}</td>
                             
                              
                            </tr>
                        )
                    })
                }          
                    </tbody>
                </Table>
            </ModalBody>
            <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={ticketCount}
        onPageChange={ticketsChangePage}
        containerClassName={"ticketsBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    

        </Modal>

        <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns1"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
    </div>
}
export default UsersProfile;