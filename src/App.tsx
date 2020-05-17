import React from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import { Pano } from './components/Pano';
import GoogleMapsWrapper from './components/GoogleMapsContext'
import { Button } from 'react-bootstrap';


function App() {
  const dataURI = "data:text/json;base64," + encodeBase64("Hello World!");
  return (
    <div className='w-100'> 
      <div className="maps-module row">
        <Pano />
        <Pano />
      </div>
      <div className='d-flex justify-content-center'>
        <Button className='calculate'>Calculate</Button>
      </div>
    </div>
  );
}

export default () => <GoogleMapsWrapper><App /></GoogleMapsWrapper>;
