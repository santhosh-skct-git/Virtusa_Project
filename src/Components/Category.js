import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import { useHistory } from 'react-router-dom'
import AdminDashboard from './AdminDashboard'
import './Styles/Category.css'
function Category() {
    const history = useHistory()

    const handleType = (e) => {
        const category = e.target.value;
        localStorage.setItem("vehicleType", category);
        history.push("/admin/addVehicle")
    }
    return (
        <div id="categoryBody">
            <AdminDashboard />
            <Row style={{
                display: "flex",

            }}>
                <Col  >
                    <Card id="categoryCard"  >
                        <Card.Img src='https://pbs.twimg.com/media/ENbbJ_dUYAEEscq.jpg'>

                        </Card.Img>
                        <Card.Footer>

                            <Button value="Sleeper" onClick={(e) => { handleType(e) }} id="categoryBtn">Add Sleeper</Button>
                        </Card.Footer>

                    </Card>
                </Col>
                <Col >
                    <Card id="categoryCard">
                        <Card.Img src='https://4.imimg.com/data4/RJ/KH/GLADMIN-3691662/113-500x500.jpg' style={{ height: '12em' }}></Card.Img>
                        <Card.Footer>
                            <Button value="Semi-Sleeper" onClick={(e) => { handleType(e) }} id="categoryBtn">Add Semi-Sleeper</Button>
                        </Card.Footer>

                    </Card>
                </Col>
                <Col  >
                    <Card id="categoryCard">
                        <Card.Img src='https://5.imimg.com/data5/ANDROID/Default/2021/7/XT/QG/MH/33998868/product-jpeg-500x500.jpg' style={{ height: '12em' }}>

                        </Card.Img>
                        <Card.Footer>
                            <Button value="Seater" onClick={(e) => { handleType(e) }} id="categoryBtn"> Add Seater</Button>
                        </Card.Footer>

                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default Category