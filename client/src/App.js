import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './App.css';
import Calendar from './components/Calendar/Calendar'
// import TodoApp from './components/Todos/TodoApp'
import AddEvent from './components/AddEvent/AddEvent'
import Header from './components/Header/Header'
import DashBoard from './components/DashBoard/DashBoard'
import EventDialog from './components/EventDialog/EventDialog'
import { BrowserRouter as Router, Route} from "react-router-dom";

function App() {
  const [eventList, setEventList] = useState([])
  const [score, setScore] = useState(100);
  const [isLoaded, setReadyStatus] = useState(false);
  const [clickedEvent, setClickedEvent] = useState({extendedProps: {}});
  const [openEditForm, setOpenEditForm] = useState(false);

  let handleEventClick= ({event}) => {
    setClickedEvent(event);
    setOpenEditForm(true);
  }

  const handleClose = () => {
    setOpenEditForm(false);
  };
  
  useEffect(() => {
    let eventsPromise = fetch('/api/events')
      .then(res => res.json())
    let scorePromise = fetch('api/score')
      .then(res => res.json())
    
    Promise.all([eventsPromise, scorePromise])
      .then(([eventList, scoreObj]) => {
        setEventList(eventList);
        setScore(scoreObj.score);
        setReadyStatus(true);
      })
      .catch(err => console.log(err));
}, []);

  const taskDashBoard = eventList.filter(task => task.show);
  // function addTask(title, desp, start, end) {
  //   const newTask = { id: nanoid(9), name: title, description: desp, completed: false, startTime: start, endTime: end };
  //   setTaskList([...eventList, newTask]);
  // }

  return isLoaded? (
    <Router>
      <Route path="/" exact render={props => (
        <Container fluid>
          <Row className="App-header">
            <Header />
          </Row>
          <Row>
            <Col xs={9} className="Calendar">
              <Calendar tasks={eventList} onEventClick={handleEventClick}/>
            </Col>
            <Col xs={3} className="Dashboard">
              <DashBoard tasks={taskDashBoard} score={score}/>
            </Col>        
          </Row>
          <div>
            <EventDialog open={openEditForm} onClose={handleClose} event={clickedEvent} />
          </div>
        </Container>
      )} />
      <Route path="/addevent" render={
        props => <AddEvent/>
      } />
      {/* <Route path="/editevent" render={
        props => {}
      } /> */}
    </Router>    
  ) : <Calendar tasks={eventList}/>;
}

export default App;
