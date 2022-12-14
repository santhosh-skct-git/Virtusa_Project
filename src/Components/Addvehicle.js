
import React, { useEffect } from 'react';
import { Card } from 'react-bootstrap'
import axios from "axios";
import { useHistory } from 'react-router-dom'
import {
    Formik,
    Form,
    Field,
    ErrorMessage
} from 'formik'
import * as Yup from 'yup'
import './Styles/Addvehicle.css'
import AdminDashboard from './AdminDashboard'
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Addvehicle() {
    const history = useHistory()
    const vehicleType=localStorage.getItem("vehicleType");
    const initialValues = {
        vehicleName: '',
        vehicleTiming: '',
        vehicleFrom: '',
        vehicleTo: '',
        vehicleImageURL: '',
        price: '',
        capacity: '',
        vehicleDescription: '',
        vehicleType:''
    }
    const validationSchema = Yup.object({
        vehicleName: Yup.string().required('*Required'),
        vehicleTiming: Yup.string().required('*Required'),
        vehicleFrom: Yup.string().required('*Required'),
        vehicleTo: Yup.string().required('*Required'),
        vehicleImageURL: Yup.string().required('*Required'),
        price: Yup.number().typeError('*You must specify a number').required('*Required'),
        capacity: Yup.number().typeError('*You must specify a number').required('*Required').max(50, '*Should be less than 50'),
        vehicleDescription: Yup.string().required('*Required'),
    })
    const onSubmit = async (data, onSubmitProps) => {
        const data1 = {
            vehicleName: data.vehicleName,
            vehicleTiming: data.vehicleTiming.toString(),
            vehicleFrom: data.vehicleFrom,
            vehicleTo: data.vehicleTo,
            vehicleImageURL: data.vehicleImageURL,
            price: data.price,
            capacity: data.capacity,
            vehicleDescription: data.vehicleDescription,
            vehicleType:vehicleType
        }
      
       

        axios.post('http://localhost:8080/addvehicle', data1,{
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }).then(
            (response) => {
              
                toast.success('???? Added Successfully', {
                    position: "top-center",
                    closeOnClick: true,
                    progress: undefined,
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true
                })
                setTimeout(()=>{
                    history.push('/admin/vehicleprofile')
                },3000)
                localStorage.removeItem("vehicleType")

            }, (error) => {
                console.log(error);
                toast.error('???? Failed to add vehicle!!!', {
                    position: "top-center",
                    closeOnClick: true,
                    progress: undefined,
                    autoClose: 5000,
                    hideProgressBar: true,
                    pauseOnHover: true,
                    draggable: true
                })
               
            }
        )
        
        onSubmitProps.setSubmitting(false)
        onSubmitProps.resetForm()
    }
    useEffect(() => {
      const category= localStorage.getItem("vehicleType")
        if(!category){
            
                toast.warn("Please select the vehicle type to add");
                setTimeout(()=>{
                    history.push("/category")
                },2000)
        }
    }, [])
    useEffect(() => {
        document.title = "TravelYaari  ||  AddVehicle";
    }, []);
    return <div id="cardbody">
        <image src="D:\frontend\src\Components\Styles\admin.jpg"/>
        <AdminDashboard />
                    <Card id='addcard' style={{  color: 'white' }}>
                    <Card.Title style={{ textAlign: 'center' }}><h2>Add</h2></Card.Title>
                    <Card.Body >
                    <Formik initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={onSubmit}>
                        <Form id="form" >

                        <label htmlFor='vehicleType' >Vehicle Type</label>
                            <div className="col-sm-6">
                                <Field
                                    type="text"
                                    id='vehicleType'
                                    name='vehicleType'
                                    placeholder='Enter the Type'
                                    value={vehicleType}
                                    className='form-control' />

                                       
                              
                            </div>


                            <label htmlFor='vehicleName' >Vehicle Name</label>
                            <div className="col-sm-6">
                                <Field
                                    type='text'
                                    id='vehicleName'
                                    name='vehicleName'
                                    placeholder='Enter the name'
                                    className='form-control' />
                                <ErrorMessage name='vehicleName' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>



                            <label htmlFor='vehicleFrom'>From</label>
                            <div className="col-sm-6">
                                <Field
                                    type='text'
                                    id='vehicleFrom'
                                    name='vehicleFrom'
                                    placeholder='Enter the from '
                                    className='form-control' />
                                <ErrorMessage name='vehicleFrom' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>

                            <label htmlFor='vehicleTo'>To</label>
                            <div className="col-sm-6">
                                <Field
                                    type='text'
                                    id='vehicleTo'
                                    name='vehicleTo'
                                    placeholder='Enter to'
                                    className='form-control' />
                                <ErrorMessage name='vehicleTo' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>

                            <label htmlFor='vehicleTiming'>Available Time</label>
                            <div className="col-sm-6">
                                <Field
                                    type='time'

                                    id='vehicleTiming'
                                    name='vehicleTiming'
                                    placeholder='Enter the Available Timing'
                                    className='form-control' />
                                <ErrorMessage name='vehicleTiming' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>

                            <label htmlFor='vehicleImageURL'>Select the Image</label>
                            <div className="col-sm-6">
                                <Field
                                    type='text'
                                    id='vehicleImageURL'
                                    name='vehicleImageURL'
                                    placeholder='Enter the Image Url'
                                    className='form-control' />
                                <ErrorMessage name='vehicleImageURL' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>

                            <label htmlFor='price'>Fare</label>
                            <div className="col-sm-6">
                                <Field
                                    type='text'
                                    id='price'
                                    name='price'
                                    placeholder='Enter the fare per person'
                                    className='form-control' />
                                <ErrorMessage name='price' >
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>

                            <label htmlFor='capacity'>Occupancy</label>
                            <div className="col-sm-6">
                                <Field
                                    type='text'
                                    id='capacity'
                                    name='capacity'
                                    placeholder='Enter no of capacity'
                                    className='form-control' />
                                <ErrorMessage name='capacity'>
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>

                            <label htmlFor='vehicleDescription'>Description</label>
                            <div className="col-sm-6">
                                <Field
                                    as='textarea'
                                    type='text'
                                    id='vehicleDescription'
                                    name='vehicleDescription'
                                    placeholder='Description'
                                    className='form-control' />
                                <ErrorMessage name='vehicleDescription'>
                                    {msg => <div className='error'>{msg}</div>}
                                </ErrorMessage>
                            </div>
                            <button type='submit' className='btn btn-primary' id='addButton' >Add</button>
                            <ToastContainer/>

                        </Form>
                    </Formik>
                    </Card.Body>
                    </Card>
                </div>
}

export default Addvehicle;
