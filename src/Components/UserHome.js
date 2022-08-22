import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import UserDashboard from './UserDashboard';
import axios from 'axios'
import ReactStars from "react-rating-stars-component";
import ReactPaginate from "react-paginate";
import { BsSearch } from 'react-icons/bs'
import './Styles/UserHome.css'
import { Card, Row, Col, Accordion, Modal, Form,  Button } from 'react-bootstrap';
import Marquee from "react-fast-marquee";

function UserHome() {
  const [show, setShow] = useState(false)
  const [review, setReview] = useState([])
 
  const [rate, setRate] = useState(0)
  const history = useHistory();
  const [posts, setPosts] = useState([])
  const [buses, setBuses] = useState([])
   const [busesFrom, setBusesFrom] = useState('')
  const [busesTo, setBusesTo] = useState('')
   const [busesType, setBusesType] = useState('Seater')
  const [description, setDescription] = useState()
  const username = localStorage.getItem("username")
  const [busName, setBusName] = useState()
  const [pageNumber,setPageNumber]=useState(0);
  const cardsPerPage = 4;
  const pagesVisited = pageNumber * cardsPerPage;
  
  useEffect(() => {
    axios.get('http://localhost:8080/vehicles', {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => {
      
        setPosts(res.data)
        setBuses(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  
  const handleShow = (id, name) => {
   localStorage.setItem("busid",id)
    setShow(true)
    setBusName(name)
    axios.get(`http://localhost:8080/getbyvid/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then((res) => {
      
      setReview(res.data)
      
    })
      .catch((err) =>
        console.log(err))
  }
  const handleReview = () => {
    const data = {
      
      username: localStorage.getItem("username"),
      desc: description,
      vid: localStorage.getItem("busid"),
      rating: rate
    }
    
    axios.post("http://localhost:8080/addreview", data, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then((res) => {
      
      window.location.reload();
    }).catch((err) => {
      console.log(err)
    })
  }
  const handleClose = () => {
    setShow(false)

  }
  useEffect(() => {
    document.title = "TravelYaari  ||  User";
  }, []);

  const onBookSubmit = (id) => {
    localStorage.setItem("busiduser", id);
    history.push("/user/dashboard")
  }

  
   

const handleSearch=()=>{
  
  if(busesFrom && !busesTo){
    
  const searchBus=posts.filter(bus=>bus.vehicleFrom.includes(busesFrom) &&bus.vehicleType===busesType )
  setBuses(searchBus);
  }
  else if(!busesFrom && busesTo){
    
    const searchBus=posts.filter(bus=>bus.vehicleTo.includes(busesTo)&&bus.vehicleType===busesType )
    setBuses(searchBus);
  }
  else if(busesFrom && busesTo){
    const searchBus=posts.filter(bus=>bus.vehicleFrom.includes(busesFrom) && bus.vehicleTo.includes(busesTo) &&bus.vehicleType===busesType )
    setBuses(searchBus);
  }
  else
  setBuses(posts)
 
  
}

  const ratingChanged = (newRating) => {
    setRate(newRating)
  };

  const pageCount = Math.ceil(buses.length / cardsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
 
  return <div id="userhome">
    <UserDashboard />

    <div className="col-sm-6">

      <div className="input-group" style={{ marginLeft: '45%', marginTop: '5%' }} >
        <span className="input-group-text">From</span>
        <input type="text" className="form-control" id="searchFrom"
          placeholder="Enter from place..." onChange={e=>{
            setBusesFrom(e.currentTarget.value)
          }} />
        <span className="input-group-text">
          To
        </span>
        <input type="text" className="form-control" id="searchTo"
          placeholder="Enter to place..." onChange={e=>{
            setBusesTo(e.currentTarget.value)
          }} />
          <span className="input-group-text">
          Type
        </span>
        <select className='form-select' id="category" name="category" onChange={(e)=>{setBusesType(e.currentTarget.value)
       }}>
      <option value='Seater'>Seater</option>
      <option value="Semi-Sleeper">Semi-Sleeper</option>
      <option value="Sleeper">Sleeper</option>
     
      
     </select>
       
      <span  className="input-group-text" >
        <Button onClick={handleSearch}><BsSearch/></Button>
        </span>
     
      
    
    </div>
    
    </div>

      
    <Row>
      {
        buses?.slice(pagesVisited, pagesVisited + cardsPerPage).map((post) => {
          return (

            <Col xs={12} md={4} lg={3} key={post.id} >

              <Card id="user_card" >
                <Marquee gradient={false}   loop={1} speed={120} ><Card.Img variant="top" id="bus_img" style={{ width: '100%', height: '150px' }} src={post.vehicleImageURL} /></Marquee>

                <Accordion>
                  <Accordion.Header ><h6 style={{ color: "red" }}>{post.vehicleName}({post.vehicleType})</h6></Accordion.Header>
                  <Accordion.Body>
                    <Card.Text>Vehicle Name :{post.vehicleName}</Card.Text>
                    <Card.Text>Vehicle Timing :{post.vehicleTiming}</Card.Text>
                    <Card.Text>From  :{post.vehicleFrom}</Card.Text>
                    <Card.Text>To :{post.vehicleTo}</Card.Text>
                    <Card.Text>Vehicle Fare :{post.price} INR</Card.Text>
                    <Card.Text style={{ color: 'red' }}>Vehicle Description :{post.vehicleDescription}</Card.Text>
                  </Accordion.Body>
                </Accordion>

                <Card.Footer>
                  <button className="btn btn-success" id="bookbutton" style={{ float: 'right' }} onClick={() => {
                    onBookSubmit(post.id);
                  }}>Book</button>
                  <Button id="addRevbtn" style={{ float: 'left' }} onClick={() => { handleShow(post.id, post.vehicleName) }}>Review</Button>
                </Card.Footer>
              </Card>
            </Col>)
        })
      }
     
    </Row>
    <Modal show={show} >
      <Modal.Header>{busName} Reviews</Modal.Header>
      <Modal.Body>
        <Accordion>
          <Accordion.Header>See all reviews</Accordion.Header>
          <Accordion.Body >
            <Row>
              {
                review?.map((post) => {

                  return (

                    <div>
                      <Card id="vehicleReview" border="primary"  >
                        <Card.Header>{post.username}   </Card.Header>
                        <Card.Body>
                          <div style={{ float: 'right' }}>
                            <ReactStars
                              count={post.rating}
                              size={30}
                              color="#ffd700"

                            />
                          </div>
                          <p style={{ marginTop: '2%' }}>
                            {post.desc}
                          </p>
                        </Card.Body>
                      </Card>

                    </div>
                  )

                })

              }

            </Row>
          </Accordion.Body>
        </Accordion>
        <Accordion>
          <Accordion.Header>Add your reviews</Accordion.Header>
          <Accordion.Body >
          <Form>
        
        <label>{username}</label>
        <textarea className='form-control' placeholder='Please give your valuable feedback here...' style={{ width: '80%',height:'45%',marginLeft:'5%'}} onChange={(e) => {
          setDescription(e.target.value);
        }} value={description} />

        <div style={{ marginLeft:'5%',marginTop:'3%'}}>
        <ReactStars
          count={5}
          size={30}
          onChange={ratingChanged}
          activeColor="#ffd700"
          
        />,
        </div>
    
  
    <button className='btn btn-success' style={{marginLeft:"15px"}} onClick={() => { handleReview() }}>Submit</button>
    <button className='btn btn-info' style={{marginLeft:"15px"}} onClick={() => { handleClose() }}>Close</button>
    </Form>
  
          </Accordion.Body>
        </Accordion>
        <Modal.Footer style={{justifyContent:'center'}}>
         <button className='btn btn-secondary'  onClick={() => { handleClose() }}>Go back</button>
         </Modal.Footer>
        </Modal.Body>
    
    </Modal>

    <ReactPaginate
        previousLabel={"<"}
        nextLabel={">"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"paginationBttns"}
        previousLinkClassName={"previousBttn"}
        nextLinkClassName={"nextBttn"}
        disabledClassName={"paginationDisabled"}
        activeClassName={"paginationActive"}
      />
  </div>

}

export default UserHome;
