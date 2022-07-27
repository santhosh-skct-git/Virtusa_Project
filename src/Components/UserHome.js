import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import UserDashboard from './UserDashboard';
import axios from 'axios'
import ReactStars from "react-rating-stars-component";
import ReactPaginate from "react-paginate";
import { BsSearch } from 'react-icons/bs'

import './Styles/UserHome.css'
import { Card, Row, Col, Accordion, Modal, Form, FormGroup, Button } from 'react-bootstrap';
function UserHome() {
  const [show, setShow] = useState(false)
  const [review, setReview] = useState([])
 
  const [rate, setRate] = useState(0)
  const history = useHistory();
  const [posts, setPosts] = useState([])
  const [buses, setBuses] = useState([])
   const [busesFrom, setBusesFrom] = useState('')
  const [busesTo, setBusesTo] = useState('')
   const [busesType, setBusesType] = useState('')
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
        console.log(res)
        setPosts(res.data)
        setBuses(res.data)
      })
      .catch(err => {
        console.log(err)
      })
  }, [])

  
  const handleShow = (id, name) => {
    localStorage.setItem("busid", id);
    setShow(true)
    setBusName(name)
    axios.get(`http://localhost:8080/getbyvid/${id}`, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then((res) => {
      console.log(res.data)
      setReview(res.data)

    })
      .catch((err) =>
        console.log(err))
  }
  const handleReview = () => {
    const data = {
      userid: localStorage.getItem("userid"),
      username: localStorage.getItem("username"),
      desc: description,
      vid: localStorage.getItem("busid"),
      rating: rate
    }
    console.log(data)
    axios.post("http://localhost:8080/addreview", data, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then((res) => {
      console.log(res)
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

  
    // const handleSearchFrom = event => {
    //   const valueFrom = event.target.value.toLowerCase();
    
      
    //   const searchBus = buses.filter(
    //     bus => (`${bus.vehicleFrom}`.toLowerCase().includes(valueFrom))
    //   );
    //   setBuses(searchBus)
      
    // }
    // const handleSearchTo = event => {
    //   const valueTo = event.target.value.toLowerCase();
     
    //   const searchBusTo = buses.filter(
    //     bus => (`${bus.vehicleTo}`.toLowerCase().includes(valueTo))
    //   );
    
    //   setBuses(searchBusTo)
    // }
 

//  const handleSelect = (e)=>{
  
//   console.log(e.currentTarget.value)
//   const category =e.currentTarget.value;
 
//   const searchType =buses.filter(
//     bus=>(bus.vehicleType.includes(category) )
//   )
//   setBuses(searchType)
//  }

const handleSearch=()=>{
  
  if(busesFrom && !busesTo){
    
  const searchBus=posts.filter(bus=>bus.vehicleFrom.includes(busesFrom) )
  setBuses(searchBus);
  }
  else if(!busesFrom && busesTo){
    
    const searchBus=posts.filter(bus=>bus.vehicleTo.includes(busesTo))
    setBuses(searchBus);
  }
  else if(busesFrom && busesTo){
    const searchBus=posts.filter(bus=>bus.vehicleFrom.includes(busesFrom) && bus.vehicleTo===busesTo)
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
          {/* <span className="input-group-text">
          Type
        </span>
        <select className='form-control' id="category" name="category" onChange={(e)=>{setBusesType(e.currentTarget.value)
        console.log(busesType)}}>
      <option value="">All</option>
      <option value="Sleeper">Sleeper</option>
      <option value="Semi-Sleeper">Semi-Sleeper</option>
      <option value='Seater'>Seater</option>
     </select>
        */}
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
                <Card.Img variant="top" id="bus_img" style={{ width: '100%', height: '150px' }} src={post.vehicleImageURL} />

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
      </Modal.Body>
      <Modal.Footer>
        <Form>
          <FormGroup as={Row}>
            <label>{username}</label>
            <textarea className='form-control' placeholder='Please give your valuable feedback here...' style={{ width: '80%', marginLeft: '3%' }} onChange={(e) => {
              setDescription(e.target.value);
            }} value={description} />


            <ReactStars
              count={5}
              size={30}
              onChange={ratingChanged}
              activeColor="#ffd700"
            />,
          </FormGroup>
        </Form>
        <button className='btn btn-success' onClick={() => { handleReview() }}>Submit</button>
        <button className='btn btn-info' onClick={() => { handleClose() }}>Close</button>
      </Modal.Footer>

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
