import './App.css';
import { Container, Row, Button, Navbar, ListGroup } from 'react-bootstrap';
import Webcam from 'react-webcam';
import React, { Component } from "react";
import BoxCanvas from "components/boxcanvas";
import takeAttendance from 'utils/takeattendance';

export default class App extends Component  {
  // constants for video and box canvas
  static WIDTH = 1000;
  static HEIGHT = 600;

  constructor(props) {
    super(props);
    this.webcamRef = React.createRef();
  }

  state = {
    ready: false,
    bounding_boxes: [],
    labels: [],
  }

  videoConstraints = {
    width: App.WIDTH,
    height: App.HEIGHT,
    facingMode: "user"
  };

  onCapture = async (image) => {
    fetch(image)
    .then(res => res.blob())
    .then(async blob => {
        const file = new File([blob], "filename", { type: "image/jpeg" })
        const startTime = new Date();
        const result = await takeAttendance(file);
        const endTime = new Date();
        const timeTaken = (endTime.getTime() - startTime.getTime())/1000; // in seconds
        console.log("Time taken: " + timeTaken + " seconds");
        const { bounding_boxes, labels  } = result;
        if (this.state.ready) {
            this.setState({ bounding_boxes, labels })
        }
    })
  }
  
  capture = async () => {
    if (this.webcamRef && this.webcamRef.current) {
      if (this.state.ready) {
        const imageSrc = this.webcamRef.current.getScreenshot(); // base 64 output
        this.onCapture(imageSrc);
        setTimeout(() => {
            this.capture();
        }, 1000);
      }
    } else {
        alert("Please enable your webcam.");
    }
  }

  startCapture = () => {
    this.setState({ ready: true }, () => {
      this.capture();
    });
  }

  stopCapture = () => {
    this.setState({ ready: false, bounding_boxes: [], labels: [] });
  }

  render() {
    return (
      <Container fluid>
        <Navbar bg="light">
          <Navbar.Brand href="/">A10dance CCTV Stimulation</Navbar.Brand>
        </Navbar>
        <Container className="p-3 justify-content-center">
          <ListGroup className="py-3">
            <ListGroup.Item active>
              A10dance guide
            </ListGroup.Item>
            <ListGroup.Item>
              1. Log into the admin portal "here" and create an account, then register a student with your id, name, class and a profile photo of yourself
            </ListGroup.Item>
            <ListGroup.Item>
              2. Our stimulation for CCTV is "here", use the stimulation to start detecting yourself through your webcam. Your attendance will be taken as well.
            </ListGroup.Item>
            <ListGroup.Item>
              3. You will see your attendance recorded at the admin portal under {'Classes > Select your class'}, the color of your name will be in green and the reporting time will be shown.
            </ListGroup.Item>
          </ListGroup>
          <Container className="p-0 position-relative">
            <Webcam
              audio={false}
              height={App.HEIGHT}
              ref={this.webcamRef}
              screenshotFormat="image/jpeg"
              width={App.WIDTH}
              videoConstraints={this.videoConstraints}
              style={{ transform: 'scaleX(-1)' }}
            />
            <BoxCanvas
              bounding_boxes={this.state.bounding_boxes} 
              labels={this.state.labels}
              height={App.HEIGHT}
              width={App.WIDTH}
              style={ { position: 'absolute', left: '0px', top: '0px' } }
            />
          </Container>
          <Row className="p-3">
            <Button variant="danger" onClick={this.stopCapture}>Stop Detection</Button>&nbsp;
            <Button variant="primary" onClick={this.startCapture}>Start Detection</Button>
          </Row>
        </Container>
      </Container> 
    )
  };
}