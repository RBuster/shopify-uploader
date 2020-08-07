import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Uploader} from './components/uploader/uploader'
import Container from 'react-bootstrap/Container'

function App() {
  return (
    <Container className="App" fluid>
      <Uploader/>
    </Container>
  );
}

export default App;
