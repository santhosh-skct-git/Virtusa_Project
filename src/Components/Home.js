import React,{useEffect} from 'react';
import { Button } from 'react-bootstrap';
import './Styles/Home.css';
import { useHistory } from 'react-router-dom';

const Home = () => {
  const history =useHistory()
  useEffect(() => {
    document.title = "TravelYaari  || Home";
  },[]);
  return (
    <div className='home-container'>
      <video src='/videos/video1.mp4' autoPlay  loop muted />
      <h1>Travel Booking Yaari</h1>
      <p>THE BEST BUS FOR THE BEST PEOPLE!!!</p>
      <br></br>
      <div>
      <Button
         id="homeLgnBtn" onClick={() => { history.push("/user/login") }}
        >
          LOG IN
        </Button>
        <Button
          id="homeSgnupBtn"
          onClick={() => { history.push("/register") }}
        >
          SIGN UP 
        </Button>
        </div>
    </div>
  );
};

export default Home;