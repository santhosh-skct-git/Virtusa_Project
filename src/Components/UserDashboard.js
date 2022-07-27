
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import { Navbar, Nav, Container, Button, Modal } from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles/dashboard.css'
import Offcanvas from 'react-bootstrap/Offcanvas';
import { TiThMenu } from "react-icons/ti";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'
import { BsPersonCircle } from "react-icons/bs";
import emailjs from 'emailjs-com';
import './Styles/UserDashboard.css'



function UserDashboard() {
  const [show, setShow] = useState(false);
  const [infoshow, setInfoShow] = useState(false);
  const [mailshow, setMailShow] = useState(false);
  const [userDetails, setUserDetails] = useState({});
  const userid = localStorage.getItem('userid');
  let history = useHistory();
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const handleInfoClose = () => setInfoShow(false);
  const handleInfoShow = () => setInfoShow(true);
  const handleMailClose = () => setMailShow(false);
  const handleMailShow = () => setMailShow(true);


  function sendEmail(e) {
    e.preventDefault();

    emailjs.sendForm('service_evj23ns', 'template_vk919xl', e.target, 'GjWUPvhF7OiW-0lS8')
      .then((result) => {
        window.location.reload()
      }, (error) => {
        console.log(error.text);
      });
  }
  const handleChange = (event, field) => {
    setUserDetails({
      ...userDetails,
      [field]: event.target.value,
    })
  }

  const handleEdit = (userid) => {
    console.log(userDetails);
    axios.put(`http://localhost:8080/updateUserById/${userid}`, userDetails, {
      headers: {
        Authorization: localStorage.getItem("token")
      }

    }).then((res) => {
      console.log(res);
      toast.success('Updated Successfully', {
        position: "top-center",
        closeOnClick: true,
        progress: undefined,
        autoClose: 5000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true
      })
      setTimeout(() => {

        window.location.reload();
      }, 3000)
    }).catch((err) => {
      console.log(err)

    })
  }

  useEffect(() => {
    axios.get(`http://localhost:8080/getUserById/${userid}`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then((response) => {
      console.log(response);
      setUserDetails(response.data)
    })
      .catch((err) => {
        console.log(err);
      })
  }, [])

  return <div><ToastContainer /><Navbar   >

    <Navbar.Brand href="/home" style={{ color: 'white' }}>Travel Yaari</Navbar.Brand>

    {/* <Nav className="me-auto">
        <Nav.Link href="/user/home" style={{ color: 'white', marginRight: '35px' }}>Home</Nav.Link>
        <Nav.Link href="/user/dashboard" style={{ color: 'white', marginRight: '35px' }}>Dashboard</Nav.Link>
        <Nav.Link href="/user/booking" style={{ color: 'white', marginRight: '35px' }}>My Booking</Nav.Link>
        <Nav.Link href="/user/review" style={{ color: 'white', marginRight: '35px' }}>Reviews</Nav.Link>
      </Nav> */}
    <Container style={{ marginLeft: '65%' }}>
      <Nav >
        <a className="btn" onClick={handleShow}  ><TiThMenu /></a>

        <Navbar.Toggle />
        <Navbar.Offcanvas show={show} onHide={handleClose} className="" placement="end" style={{  width: '20%' }}>
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Welcome !!!</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav.Link id="menu" className="btn" href="/user/home" >Home</Nav.Link>
            <Nav.Link id="menu" className="btn" href="/user/dashboard" >Dashboard</Nav.Link>
            <Nav.Link id="menu" className="btn" href="/user/booking" >My Booking</Nav.Link>

            <Nav.Link id="menu" className="btn" onClick={handleInfoShow}>My info</Nav.Link>

            <Nav.Link id="menu" className="btn" onClick={handleMailShow}>Contact us</Nav.Link>
            <Nav.Link id="menu" className="btn" href="/user/review">Reviews</Nav.Link>
            <Nav.Link id="logoutMenu" className="btn" href="/user/login" onClick={() => {
              localStorage.clear();
              history.push("/user/login")
            }}>Logout</Nav.Link>


          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Nav>
    </Container>


  </Navbar>
    <Modal show={infoshow}>
      <Modal.Header ><Modal.Title style={{ marginLeft: '200px' }}><BsPersonCircle size={60} /></Modal.Title>  </Modal.Header>
      <Modal.Body>
        <div style={{ marginLeft: '150px' }}>

          <label htmlFor="username">UserName</label>
          <div className="col-sm-8">
            <input id="username" name="username" className="form-control" placeholder="Enter User name" value={userDetails.username || ''}
            ></input>
          </div>
          <label htmlFor="email">Email</label>
          <div className="col-sm-8">
            <input id="email" name="email" placeholder="Enter email id" className="form-control" value={userDetails.email || ''} onChange={(e) => {
              handleChange(e, "email")
            }} ></input>
          </div>
          <label htmlFor="mobileNumber">Mobile Number</label>
          <div className="col-sm-8">
            <input id="mobileNumber" name="mobileNumber" placeholder="Enter mobile number" className="form-control" value={userDetails.mobileNumber || ''} onChange={(e) => {
              handleChange(e, "mobileNumber")
            }} ></input>
          </div>
          <Button className="btn btn-warning" onClick={handleInfoClose} style={{ marginTop: "35px" }}>Cancel</Button>
          <Button onClick={() => { handleEdit(userDetails.id) }} style={{ marginTop: "35px", marginLeft: '60px' }}>Update</Button>
        </div>
      </Modal.Body>
    </Modal>
    <Modal show={mailshow} onHide={handleMailClose}>
      <Modal.Header closeButton></Modal.Header>
      <Modal.Body>
        <form onSubmit={sendEmail} style={{ marginLeft: '10%' }}>
          <label htmlFor="username">UserName</label>
          <div className="col-sm-8">
            <input id="username" name="username" className="form-control" placeholder="Enter User name" value={userDetails.username || ''}
            ></input>
          </div>

          <label htmlFor="email">Email</label>
          <div className="col-sm-8">
            <input id="email" name="email" placeholder="Enter email id" className="form-control" value={userDetails.email} readOnly ></input>
          </div>

          <textarea className='form-control' name='message' placeholder='Write your message here' style={{ marginTop: "35px", width: '80%', height: '90px' }}></textarea>

          <Button onClick={handleMailClose} style={{ marginTop: "35px", marginLeft: '50px' }}>Cancel</Button>
          <Button type='submit' onclick={sendEmail} style={{ marginTop: "35px", marginLeft: '50px' }}>Send</Button>
        </form>
      </Modal.Body>
    </Modal>
  </div>


}

export default UserDashboard;
