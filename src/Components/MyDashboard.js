import React, { useEffect, useState } from 'react'
import UserDashboard from './UserDashboard';
import { Card, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify'
import { useHistory } from 'react-router-dom'
import {
    Formik,
    Form,
    Field,
    ErrorMessage,



} from 'formik'
import * as Yup from 'yup'
import './Styles/mydashboard.css'
import Validation from "./Validation.js";
import Marquee from "react-fast-marquee";
function MyDashboard() {
    const history = useHistory()


    const yesterday = new Date(Date.now() - 86400000);
    const busid = localStorage.getItem("busiduser");
    const [passengers, setPassengers] = React.useState('1');
    const [busdetails, setBusdetails] = React.useState({});
    const [allBuses, setAllBuses] = useState([]);
    const [name, setName] = React.useState();
    const [Age, setAge] = React.useState();
    const [travelDate, setTravelDate] = useState("");
    const [Error, setError] = React.useState({
        name: "",
        age: ""
    })

    const initialValues = {
        ticketInfo: [{ name: '', age: '', gender: '' }],
        fillFromDate: '',
        enterNoTicket: '1',

    }

    const validationSchema = Yup.object({
        fillFromDate: Yup.date().required('*Required').nullable().min(yesterday, '*Date cannot be in past'),
    })

    const onSubmit = async (data, onSubmitProps) => {

        const data1 = {
            vehicleName: busdetails.vehicleName,
            vehicleTiming: busdetails.vehicleTiming,
            pricePerHead: busdetails.price,
            noOfPersons: data.enterNoTicket,
            date: data.fillFromDate,
            from: busdetails.vehicleFrom,
            to: busdetails.vehicleTo,
            userid: localStorage.getItem("userid"),
            vehicleid: busid
        }
        axios.post(`http://localhost:8080/addBooking`, data1, {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }).then((response) => {

            console.log(response)
            toast.success('👍 Booked Successfully', {
                position: "top-center",
                closeOnClick: true,
                progress: undefined,
                autoClose: false,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: true
            })
            localStorage.removeItem("busiduser")
            setTimeout(() => {
                history.push("/user/booking")
            }, 3000);


        }).catch((err) => {
            console.log(err);
            toast.error('👎 Failed to book!!!', {
                position: "top-center",
                closeOnClick: true,
                progress: undefined,
                autoClose: 5000,
                hideProgressBar: true,
                pauseOnHover: true,
                draggable: true
            })
        })

        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()


    }

    useEffect(() => {

        axios.get(`http://localhost:8080/getVehicleById/${busid}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        }).then((response) => {
            setBusdetails(response.data);
        })
            .catch((err) => {

                console.log(err);
                toast.warn("Kindly select your bus in order to book tickets ");
                setTimeout(() => {
                    history.push("/user/home");
                }, 5000)
            })
    }, [])

    useEffect(() => {
        axios.get(`http://localhost:8080/getAllBookingsByVid/${busid}`, {
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        }).then((response) => {
            console.log(response)
            setAllBuses(response.data);
        })
            .catch((err) => {
                console.log(err);
            })
    }, [])
    useEffect(() => {
        document.title = "TravelYaari  ||  MyDashboard";
    }, []);



    var fields = [];
    for (let i = 1; i <= passengers; i++) {
        const index = i;
        fields.push(

            <div className="col-sm-9" key={i}>

                <label>Passenger {i}</label>
                <Row>
                    <Col>
                        <input type="text" id={"name" + index} className='form-control' required={true}
                            onChange={e => {
                                const n = e.currentTarget.value
                                setName(n)

                                setError({
                                    ...Error,
                                    name: (Validation.fullname(e.target.value) ? "" : "*Invalid Name")
                                });
                            }
                            } placeholder="Enter Name" />
                        <div id="error">{Error.name}</div>
                    </Col>
                    <Col>
                        <input type="number" id="age" className='form-control' placeholder="Enter Age" required={true}
                            onChange={(e) => {
                                setAge(e.target.value);
                                setError({
                                    ...Error,
                                    age: (Validation.age(e.target.value) ? "" : "*Invalid Age")
                                });
                            }
                            }
                        />
                        <div id="error">{Error.age}</div>
                    </Col>
                    <Col>
                        <select className="form-select" placeholder="Select Gender"  >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                    </Col>
                </Row>
            </div>

        )

    }

    const currentTravelBus = allBuses.filter(bus => bus.date === travelDate);
    const seatsBooked = currentTravelBus.map(seat => Number(seat.noOfPersons))
    const totalseatsBooked = (seatsBooked.reduce((total, currentItem) => total = total + currentItem, 0));
    const seatsAvailable = busdetails.capacity - totalseatsBooked
    const checkSeatAvailability = (reqSeats) => {

        if (reqSeats > seatsAvailable) {
            toast.warn(`Sorry only ${seatsAvailable} seat available`)
            setTimeout(() => {
                window.location.reload();
            }, 3000)
        }
    }


    return <div id="mybooking" >
        <UserDashboard />
        <Card id='bookcard' style={{ color: 'black' }} >
            <Marquee> <div style={{ marginLeft: '30%', marginTop: '2%', color: 'red' }}>
                <h3><em>Book your ticket here</em></h3>
            </div>
            </Marquee>
            <Formik initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}>
                <Form id="ticketBookingForm">

                    <label htmlFor='vehicleName' style={{ marginTop: '5%' }}>Vehicle Name</label>
                    <div className="col-sm-9">
                        <Field
                            type='text'
                            id='vehicleName'
                            name='vehicleName'
                            placeholder='Enter the name'
                            className='form-control'
                            value={busdetails.vehicleName} />
                        <ErrorMessage name='vehicleName' >
                            {msg => <div className='error'>{msg}</div>}
                        </ErrorMessage>
                    </div>
                    <Row>
                        <Col>
                            <label htmlFor='vehicleFrom' >From place</label>
                            <div className="col-sm-6" >
                                <Field
                                    type='text'
                                    id='vehicleFrom'
                                    name='vehicleFrom'
                                    placeholder='Enter the from '
                                    className='form-control'
                                    value={busdetails.vehicleFrom} />

                                <ErrorMessage name='vehicleFrom' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>
                        </Col>
                        <Col>
                            <label htmlFor='vehicleTo' >To place</label>
                            <div className="col-sm-6" >
                                <Field
                                    type='text'
                                    id='vehicleTo'
                                    name='vehicleTo'
                                    placeholder='Enter to'
                                    className='form-control'
                                    value={busdetails.vehicleTo} />
                                <ErrorMessage name='vehicleTo' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>
                        </Col>

                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor='time'>Time</label>
                            <div className="col-sm-6">
                                <Field
                                    type='text'

                                    id='time'
                                    name='time'
                                    placeholder='time'
                                    className='form-control'
                                    value={busdetails.vehicleTiming} />
                                <ErrorMessage name='time' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>

                            </div>
                        </Col>
                        <Col>

                            <label htmlFor='price' >Price per head</label>
                            <div className="col-sm-6">
                                <Field
                                    type='text'
                                    id='price'
                                    name='price'
                                    placeholder='Enter the fare per person'
                                    className='form-control'
                                    value={busdetails.price} />
                                <ErrorMessage name='price' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <label htmlFor='fillFromDate' >Date</label>
                            <div className="col-sm-6">
                                <Field
                                    type='Date'
                                    id='fillFromDate'
                                    name='fillFromDate'
                                    placeholder='Date'
                                    className='form-control'
                                    onSelect={(e) => {
                                        const date = (e.currentTarget.value);
                                        setTravelDate(date);

                                    }} />
                                <p style={{ color: 'red' }}>{seatsAvailable} seats available </p>
                                <ErrorMessage name='fillFromDate' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>
                        </Col>
                        <Col>
                            <label htmlFor='enterNoTicket' >No.of person</label>
                            <div className="col-sm-6">
                                <Field
                                    type='text'
                                    as='select'
                                    id='enterNoTicket'
                                    name='enterNoTicket'
                                    placeholder='Enter no of person'
                                    className='form-select'
                                    onInput={(e) => {
                                        const passenger = (e.currentTarget.value);
                                        setPassengers(passenger);
                                        checkSeatAvailability(passenger)
                                    }}
                                    value={passengers}
                                >
                                    <option id='enterNoTicket' value="1">1</option>
                                    <option id='enterNoTicket' value="2">2</option>
                                    <option id='enterNoTicket' value="3">3</option>
                                    <option id='enterNoTicket' value="4">4</option>
                                    <option id='enterNoTicket' value="5">5</option>
                                </Field>
                                <ErrorMessage name='enterNoTicket'>
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>
                        </Col>
                    </Row>


                    <div>

                        {
                            fields.map((field) => (
                                <div>{field} </div>
                            ))
                        }


                    </div>


                    <button type='submit' className='btn btn-success' id='addbookingbtn' >Book</button>
                    <ToastContainer />

                </Form>
            </Formik>

        </Card>
    </div>
}
export default MyDashboard;