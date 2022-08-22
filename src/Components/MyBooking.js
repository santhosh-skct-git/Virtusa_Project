import React, { useEffect, useState } from 'react'
import UserDashboard from './UserDashboard';
import { Table, Button, Modal } from 'react-bootstrap'
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import './Styles/booking.css'
import './Styles/mybooking.css'
import ModalHeader from 'react-bootstrap/esm/ModalHeader';
import ReactPaginate from "react-paginate";

function MyBooking() {

    const [posts, setPost] = useState([]);
    const [show, setShow] = useState(false);
    const userid = localStorage.getItem("userid");
    const currentDate = new Date().toISOString().substr(0, 10);
    const [bookingPage,setBookingPage]=useState(0);
    const bookingPerPage=5;
    const bookingVisted =bookingPage *bookingPerPage;
    
    const handleCancel = (id, bookingDate) => {
        if (bookingDate > currentDate) {

            if (window.confirm('Are you sure of cancelling the ticket?')) {

                axios.delete(`http://localhost:8080/deleteBookingById/${id}`, {
                    headers: {
                        Authorization: localStorage.getItem("token")
                    }
                }).then((response) => {
                    toast.success('Cancelled successfully', {
                        position: "top-center",
                        closeOnClick: true,
                        progress: undefined,
                        autoClose: 5000,
                        hideProgressBar: true,
                        pauseOnHover: true,
                        draggable: true
                    })
                    setTimeout(()=>{
                        window.location.reload();
                    },2000)
                   
                })
            }
        }
        else {
            toast.error('Sorry ,You can cancel the ticket only before booking date', {
                position: "top-center",
                closeOnClick: true,
                progress: undefined,
                autoClose: 5000,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: true
            })
        }
    }
    useEffect(() => {
        document.title = "TravelYaari  ||  MyBooking";
    }, []);
    useEffect(() => {
        axios.get(`http://localhost:8080/getbyuserid/${userid}`).then((res) => {
            
            setPost(res.data)
        })
            .catch((err) =>
                console.log(err))
    }, [])
    const [data, setData] = useState({});
    const handleShow = (posts, id) => {
        setShow(true);
        setData((prev) => ({
            ...prev,
            date: posts.date,
            from: posts.from,
            id: posts.id,
            noOfPersons: posts.noOfPersons,
            pricePerHead: posts.pricePerHead,
            to: posts.to,
            userid: posts.userid,
            vehicleName: posts.vehicleName,
            vehicleTiming: posts.vehicleTiming
        }))
    };
    
    const handleClose = () => setShow(false);

    const showAmount = (data) => {
        return data.pricePerHead * data.noOfPersons;
    }
    localStorage.getItem("username")
    const bookingCount =Math.ceil(posts.length/bookingPerPage);
    const bookingsChangePage=({selected})=>{
        setBookingPage(selected);
    }



    return <div id="bgimg">

        <UserDashboard />


        <Table bordered hover variant="light" id="bookingtable" >
            <thead>
                <tr>
                    <th>Booked on</th>
                    <th>View ticket</th>
                    <th>Cancel ticket</th>
                </tr>
            </thead>
            <tbody>
                {
                    posts?.slice(bookingVisted,bookingVisted+bookingPerPage).map((post, index) => {
                        return <tr key={post.id}>
                            <td>{post.date}</td>

                            <td><Button className='btn btn-info' id='viewTicketbtn' onClick={() => { handleShow(post) }}>ViewTicket</Button></td>
                            <td><Button className='btn btn-warning' id='cancelTicketbtn' onClick={() => { handleCancel(post.id, post.date) }}>Cancel Booking</Button></td>
                        </tr>
                    })
                }


            </tbody>
            <tfoot>
                <tr>
                    <td colSpan={3}>
                    <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={bookingCount}
        onPageChange={bookingsChangePage}
        containerClassName={"bookingsPageBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />

                    </td>
                </tr>
            </tfoot>

        </Table>
        
        <ToastContainer />
        <Modal show={show} dialogclassNameName="modal-100w" onHide={handleClose} >
            <div className="wrapper bg-white">
                <form id="viewticket">
                    <ModalHeader> <h2>Booking Details</h2></ModalHeader>

                    <div className="form-group d-sm-flex margin">
                        <div className="d-flex align-items-center flex-fill me-sm-1 my-sm-0 my-4 border-bottom position-relative">
                            <input type="text" required placeholder="Busname" value={data.vehicleName} className="form-control" disabled />
                            <div className="label" id="busname"></div> <span className="fas fa-dot-circle "></span>
                        </div>

                    </div>
                   
                    <div className="form-group d-sm-flex margin">
                        <div className="d-flex align-items-center flex-fill me-sm1 my-sm-0 border-bottom position-relative">  <input type="text" required placeholder="From Date" value={data.date} className="form-control" />
                        <div className="label" id="from"></div>
                        </div>

                    </div>
                
                    <div className="form-group d-sm-flex margin">
                        <div className="form-group border-bottom  position-relative"> <input type="text" value={data.from} required placeholder="From place" className="form-control" />
                            <div className="label" id="fromplace"></div> <span className="fas fa-users text-muted"></span>
                        </div>
                        <div className="form-group border-bottom  position-relative"> <input type="text" value={data.to} required placeholder="To place" className="form-control" />
                            <div className="label" id="toplace"></div> <span className="fas fa-users text-muted"></span>
                        </div>
                    </div>
                    <div className="form-group d-sm-flex margin">
                        <div className="form-group border-bottom  position-relative"> <input type="text" value={data.noOfPersons} required placeholder="Number of persons" className="form-control" />
                            <div className="label" id="person"></div> <span className="fas fa-users text-muted"></span>
                        </div>
                        <div className="form-group border-bottom  position-relative"> <input type="text" required placeholder="Total amount" value={showAmount(data)} className="form-control" />
                            <div className="label" id="price"></div> <span className="fas fa-users text-muted"></span>
                        </div>
                    </div>
                    <div className="form-group my-3">
                        <div className="btn btn-primary rounded-0 d-flex justify-content-center text-center p-3" onClick={handleClose}>Close </div>
                    </div>
                </form>
            </div>

        </Modal>
    </div>
}
export default MyBooking;
