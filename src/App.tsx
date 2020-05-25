import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';
import { Pano } from './components/Pano';
import GoogleMapsWrapper from './components/GoogleMapsContext'
import { Button } from 'react-bootstrap';
import { InputPanoData, InitialData } from './types';
import { saveJson } from './logic/saveJson'
import ReactJson from 'react-json-view';
import { calculate } from './logic/calculate';
import JsonLoadFileInput from './components/JsonLoadFileInput';

function App() {
  const [ firstPanoData, setFirstData ] = useState<InputPanoData>()
  const [ secondPanoData, setSecondData ] = useState<InputPanoData>()
  const [ calculateData, setCalculateData ] = useState<InitialData>()

  const onSelectInitialFile = (res: InitialData) => {
    console.log(res)
    const { inputData: { firstPanoData, secondPanoData } } = res;
    firstPanoData && setFirstData(firstPanoData)
    secondPanoData && setSecondData(secondPanoData)
    
    res && setCalculateData(res)
  }

  return (
    <div className='w-100'>
      <div className="maps-module d-flex">
        <Pano initialData={firstPanoData} setData={setFirstData} />
        <Pano initialData={secondPanoData} setData={setSecondData} />
      </div>
      <div className='d-block'>
          <div className='d-flex m-1 my-2 w-50 justify-content-between'>
            <JsonLoadFileInput onChange={onSelectInitialFile}/>
            <Button
              className='calculate'
              onClick={() => {
                console.log('Calculating...')
                const res = calculate({ firstPanoData, secondPanoData })
                res && setCalculateData(res as InitialData)
              }}
            >Calculate</Button>
            <Button variant="light" onClick={() => saveJson(calculateData, 'resultData')}>Save to JSON</Button>
          </div>
          {calculateData && <ReactJson src={calculateData} />}
      </div>
    </div>
  );
}

export default () => <GoogleMapsWrapper><App /></GoogleMapsWrapper>;
