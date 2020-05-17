import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';
import { Pano } from './components/Pano';
import GoogleMapsWrapper from './components/GoogleMapsContext'
import { Button, FormControl, FormLabel, Alert } from 'react-bootstrap';
import { PanoData } from './types';
import { saveJson } from './logic/saveJson'
import ReactJson from 'react-json-view';
import { calculate } from './logic/calculate';
import { parseJsonFromFile } from './logic/parseInputData';

function App() {
  const [ firstPanoData, setFirstData ] = useState<PanoData>()
  const [ secondPanoData, setSecondData ] = useState<PanoData>()
  const [ calculateData, setCalculateData ] = useState<object | null>(null)

  const onSelectInitialFile = async (e: any) => {
    const file = e.target.files[0];
    const res = await parseJsonFromFile(file)
    console.log(res)
  }

  return (
    <div className='w-100'> 
      <div className="maps-module d-flex">
        <Pano initialData={firstPanoData} setData={setFirstData} />
        <Pano initialData={secondPanoData} setData={setSecondData} />
      </div>
      <div className='d-block'>
          <div className='d-flex m-1 my-2 w-50 justify-content-between'>
          <FormLabel htmlFor="fileUpload" style={{ cursor: "pointer" }}>
            <div className='btn btn-light'>Add file</div>
              <FormControl
                  id="fileUpload"
                  type="file"
                  accept=".json"
                  onChange={onSelectInitialFile}
                  style={{ display: "none" }}
              />
          </FormLabel>
            <Button
              className='calculate'
              onClick={() => {
                console.log('Calculating...')
                const res = calculate({ firstPanoData, secondPanoData })
                res && setCalculateData(res)
              }}
            >Calculate</Button>
            <Button variant="light" onClick={() => saveJson(JSON.stringify(calculateData, null, '\t'))}>Save to JSON</Button>
          </div>
          {calculateData && <ReactJson src={calculateData} />}
      </div>
    </div>
  );
}

export default () => <GoogleMapsWrapper><App /></GoogleMapsWrapper>;
