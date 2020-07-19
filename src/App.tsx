import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.scss';
import { Pano } from './components/Pano';
import { Button } from 'react-bootstrap';
import { Image, ImagePair, ResultData } from './types';
import { saveJson } from './logic/saveJson'
import ReactJson from 'react-json-view';
import { calculate } from './logic/calculate';
import JsonLoadFileInput from './components/JsonLoadFileInput';

function App() {
  const [ firstImageData, setFirstData ] = useState<Image>()
  const [ secondImageData, setSecondData ] = useState<Image>()
  const [ calculateData, setCalculateData ] = useState<ResultData>()

  const onSelectInitialFile = (res: ResultData) => {
    console.log(res)
    const { imgs: [ firstImageData, secondImageData ] } = res;
    firstImageData && setFirstData(firstImageData)
    secondImageData && setSecondData(secondImageData)
    
    res && setCalculateData(res)
  }

  return (
    <div className='w-100 h-100'>
      <div className="maps-module d-flex">
        <Pano initialData={firstImageData} setData={setFirstData} />
        <Pano initialData={secondImageData} setData={setSecondData} />
      </div>
      <div className='CalculatePanel'>
          <div className='d-flex m-1 my-2 w-100 justify-content-between'>
            <JsonLoadFileInput onChange={onSelectInitialFile}/>
            <Button
              className='calculate'
              onClick={() => {
                console.log('Calculating...')
                const res = calculate({ firstImageData, secondImageData })
                res && setCalculateData(res as ResultData)
              }}
            >Calculate</Button>
            <Button variant="light" onClick={() => saveJson(calculateData, 'resultData')}>Save to JSON</Button>
          </div>
          {calculateData && <ReactJson src={calculateData} />}
      </div>
    </div>
  );
}

export default () => <App />;
