import { React, useEffect, useState } from "react"
import { Table, Button, Modal} from "react-bootstrap"

import UserDashboard from "./UserDashboard";
import './Styles/UserReviews.css'
import axios from "axios";
import ReactStars from "react-rating-stars-component";

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function UserReviews() {
  
  const name = localStorage.getItem("username")
  const [description, setDescription] = useState("");
  const [review, setReview] = useState([])
  const [show, setShow] = useState(false)
  const [currentValue, setCurrentValue] = useState('');
  
  const handleClick = value => {
    setCurrentValue(value)
    console.log(currentValue)
  }
  const onSubmit = () => {
    setShow(false)
    const data = {
      userid: localStorage.getItem("userid"),
      username: localStorage.getItem("username"),
      desc: description,
      rating: currentValue
    }
    console.log(data)
        axios.post("http://localhost:8080/addreview", data, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then((res) => {
      console.log(res)
      toast.success("Review submitted successfully")
      setTimeout(()=>{
        window.location.reload();
      },3000)
      
    }).catch((err) => {
      toast.error("Review not added")
      console.log(err)
    })
  }



  const handleShow = () => {
    setShow(true)
  }
  const handleClose = () => {
    setShow(false)
  }
  useEffect(() => {
    document.title = "TravelYaari  ||  Review";
  }, []);
  useEffect(() => {
    axios.get("http://localhost:8080/reviews", {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then((res) => {
      console.log(res.data)
       setReview(res.data)
})
      .catch((err) =>
        console.log(err))
  }, []);
  // console.log(des)
  return <div id="reviewbody">
    <UserDashboard />
    <ToastContainer/>
    <Table striped bordered hover id="reviewtable">
      <thead>
        <tr>
          <th>UserName</th>
          <th>Review</th>
          <th>Rating</th>
        </tr>
      </thead>
      <tbody>
        {
          review?.map((rev) => {
           
            return (
              <tr key={rev.id}>
                <td>{rev.username}</td>
                <td>{rev.desc}</td>
                <td><ReactStars
                count={parseInt(rev.rating)}
                size={30}
                color="#ffd700"
                /></td>
              </tr>
            )
            
          })
        }

      </tbody>
      <tfoot>
        <tr><td colSpan={3} ><Button style={{ marginLeft: '40%' }} onClick={() => { handleShow() }}>Add my review</Button></td></tr>

      </tfoot>
    </Table>
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>Hello {name}</Modal.Header>
      <Modal.Body>
      <form style={{ marginLeft: '10%' }}>
        <label>Rating :</label>
      <ReactStars
              count={5}
              size={30}
              onChange={handleClick}
              activeColor="#ffd700"
            />,
          
            <textarea className='form-control' placeholder='Share your experience with us...' style={{  width: '80%', height: '90px' }} onChange={(e) => {
              setDescription(e.target.value);
            }} value={description} required='true'/>


           
      
        </form>
        <button className='btn btn-success' onClick={() => { onSubmit() }} id="reviewBtn">Submit</button>
        
       
      </Modal.Body>
    </Modal>
  </div>

}
export default UserReviews;