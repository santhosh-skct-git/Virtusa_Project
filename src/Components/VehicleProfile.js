import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './Styles/vehicleprofile.css'
import { BiPencil, BiTrash } from "react-icons/bi";
import { Card, Row, Col, Modal, Form, Accordion, Button } from 'react-bootstrap';
import AdminDashboard from './AdminDashboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReactPaginate from "react-paginate";

function VehicleProfile() {
  const history =useHistory();
  const [show, setShow] = useState(false);
  const [busdetails, setBusdetails] = useState({});
  const [pageNumber,setPageNumber]=useState(0);
  const cardsPerPage = 4;
  const pagesVisited = pageNumber * cardsPerPage;
  const handleClose = () => setShow(false);
  const handleShow = (id) => {
    setShow(true);
    axios.get(`http://localhost:8080/getVehicleById/${id}`,{
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then((response) => {
        setBusdetails(response.data);
      })
  };
  const handleChange = (event, field) => {
    setBusdetails({
      ...busdetails,
      [field]: event.target.value,
    })
  }
 
  const onSubmitEdit = (id) => {
    setShow(false);
   
    axios.put(`http://localhost:8080/updateVehicleById/${id}`, busdetails, {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    }).then((response) => {
      
      toast.success('👍 Vehicle info edited', {
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
      },3000)
      
    })
  }

  const handleOnClickDelete = async (data) => {
    if (window.confirm('Are you sure you want to delete?')) {
      axios.delete(`http://localhost:8080/deleteVehicleById/${data}`, {
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }
      )
        .then((response) => {
       
          setTimeout(()=>{
            window.location.reload();
          },3000)
        

        })
      toast.success('👍 Deleted Successfully', {
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


  
  const [posts, setPosts] = useState([])
  useEffect(() => {
    document.title = "TravelYaari  ||  VehicleProfile";
    axios.get("http://localhost:8080/admin/vehicles", {
      headers: {
        Authorization: localStorage.getItem("token")
      }
    })
      .then(res => {
      
        setPosts(res.data)
      })
      .catch(err => {

        console.log(err)
        if(err.response.status===403){
          setTimeout(()=>{
            history.push("/user/home");
          },2000)
        }
      })
  }, [])
  const pageCount = Math.ceil(posts.length / cardsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };
  return <div id="vehiclebody">

    <AdminDashboard />

    <Card.Body >

      <Row>
        {
          posts?.slice(pagesVisited, pagesVisited + cardsPerPage).map((post) => {

            return (

              <Col xs={12} md={4} lg={3} key={post.id}>

                <Card id="user_card" border="dark">
                  <Card.Img variant="top" id="bus_img" style={{ width: '100%', height: '150px' }} src={post.vehicleImageURL} />
                  <Accordion>

                    <Accordion.Header>{post.vehicleName}</Accordion.Header>
                    <Accordion.Body id='bus_body'>

                      <Card.Text>Vehicle Name :{post.vehicleName}</Card.Text>
                      <Card.Text>Vehicle Time :{post.vehicleTiming}</Card.Text>
                      <Card.Text>From  :{post.vehicleFrom}</Card.Text>
                      <Card.Text>To :{post.vehicleTo}</Card.Text>
                      <Card.Text>Fare :{post.price}</Card.Text>
                      <Card.Text style={{ color: 'red' }}>Description :{post.vehicleDescription}</Card.Text>

                    </Accordion.Body>

                  </Accordion>
                  <Card.Footer>
                    <Button id="editBus" className="btn btn-success
                      " onClick={() => { handleShow(post.id) }}><BiPencil /></Button>
                    <Button id="deleteBus" className="btn btn-warning" onClick={() => handleOnClickDelete(post.id)} ><BiTrash /></Button>
                    <ToastContainer />
                  </Card.Footer>
                </Card>

              </Col>
            )

          })

        }

      </Row>

    </Card.Body>

    <Modal show={show} onHide={handleClose}>
     
      <Modal.Header closeButton><div style={{ marginLeft: '35%' }}><h3>Edit Vehicle </h3></div></Modal.Header>
      <Form id="vehicleEditForm">
        <Modal.Body>
          <label htmlFor='vehicleName'>Vehicle Name</label>
          <div className="col-sm-6">
            <Form.Control id='vehicleName' name='vehicleName' placeholder='Enter the name' className='form-control' value={busdetails.vehicleName}
              onChange={(e) => {
                handleChange(e, "vehicleName")
              }} required />
       
          </div>

          <label htmlFor='vehicleTiming'>Available Time</label>
          <div className="col-sm-6">
            <Form.Control type='time' id='vehicleTiming' name='vehicleTiming' placeholder='Enter the Available Timing' className='form-control'
              onChange={(e) => {
                handleChange(e, "vehicleTiming")
              }}
              value={busdetails.vehicleTiming} />
          
          </div>

          <label htmlFor='vehicleFrom'>From</label>
          <div className="col-sm-6">
            <Form.Control type='text' id='vehicleTo ' name='vehicleFrom' placeholder='Enter from place' className='form-control'
              onChange={(e) => {
                handleChange(e, "vehicleFrom")
              }} value={busdetails.vehicleFrom} />
        
          </div>

          <label htmlFor='vehicleTo'>To</label>
          <div className="col-sm-6">
            <Form.Control type='text' id='vehicleTo ' name='vehicleTo' placeholder='Enter to place' className='form-control'
              onChange={(e) => {
                handleChange(e, "vehicleTo")
              }} value={busdetails.vehicleTo} />
          
          </div>




          <label htmlFor='vehicleImageURL'>Select Image</label>
          <div className="col-sm-6">
            <Form.Control type='text' id='vehicleImageURL' name='vehicleImageURL' placeholder='Enter the Image Url' className='form-control'
              onChange={(e) => {
                handleChange(e, "vehicleImageURL")
              }}
              value={busdetails.vehicleImageURL} />
        
          </div>

          <label htmlFor='price'>Fare</label>
          <div className="col-sm-6">
            <Form.Control type='text' id='price' name='price' placeholder='Enter the fare per person' className='form-control'
              onChange={(e) => {
                handleChange(e, "price")
              }} value={busdetails.price} />
       
          </div>

          <label htmlFor='capacity'>Occupancy</label>
          <div className="col-sm-6">
            <Form.Control type='text' id='capacity' name='capacity' placeholder='Enter no of capacity' className='form-control'
              onChange={(e) => {
                handleChange(e, "capacity")
              }} value={busdetails.capacity} />
          
          </div>

          <label htmlFor='vehicleDescription'>Description</label>
          <div className="col-sm-6">
            <Form.Control as='textarea' type='text' id='vehicleDescription' name='vehicleDescription' placeholder='Description' className='form-control'
              onChange={(e) => {
                handleChange(e, "vehicleDescription")
              }}
              value={busdetails.vehicleDescription} />
           
          </div>
        </Modal.Body>

      </Form>
      <Modal.Footer>
        <Button type="submit" className='btn btn-warning' onClick={() => { handleClose() }} style={{ float: 'left' }} >Close</Button>
        <Button type='submit' className='btn btn-primary' id='addButton' onClick={(e) => {
          e.preventDefault();
          onSubmitEdit(busdetails.id);
        }} style={{ margin: '5px' }}>Update</Button>

      </Modal.Footer>
     
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

export default VehicleProfile;
