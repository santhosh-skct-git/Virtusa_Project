import { React, useEffect, useState } from "react"
import { Table, Button, Modal} from "react-bootstrap"
import ReactPaginate from "react-paginate";
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
  const [reviewPageNumber,setReviewPageNumber] =useState(0);
  const reviewsPerPage=5;
  const reviewsVisited=reviewPageNumber*reviewsPerPage;
  const handleClick = value => {
    setCurrentValue(value)
  
  }
  const onSubmit = () => {
    setShow(false)
    const data = {
     
      username: localStorage.getItem("username"),
      desc: description,
      rating: currentValue
    }
    
        axios.post("http://localhost:8080/addreview", data, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then((res) => {
    
      toast.success("Review submitted successfully")
      setTimeout(()=>{
        window.location.reload();
      },3000)
      
    }).catch((err) => {
      toast.error("Review not added")
      console.log(err)
    })
  }

  const reviewsChangePage=({selected})=>{
    setReviewPageNumber(selected);
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
      
       setReview(res.data)
})
      .catch((err) =>
        console.log(err))
  }, []);
  const reviewCount =Math.ceil(review.length/reviewsPerPage)


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
          review?.slice(reviewsVisited, reviewsVisited + reviewsPerPage).map((rev) => {
           
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
        <tr> <td colSpan={3} ><ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={reviewCount}
        onPageChange={reviewsChangePage}
        containerClassName={"reviewsPageBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      /></td></tr>
      </tfoot>
      
    </Table>
  
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton><Modal.Title>Hello {name}</Modal.Title></Modal.Header>
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