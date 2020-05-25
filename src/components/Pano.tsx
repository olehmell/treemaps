import React, { useState, useMemo, useEffect, useCallback } from 'react'
import ReactStreetview from 'react-google-streetview';
import { apiKey } from '../config';
import { Card, Button, FormControl, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { useGoogleMaps } from './GoogleMapsContext';
import { InputPanoData, PanoType } from '../types';
import { saveJson } from '../logic/saveJson';
import ReactJson from 'react-json-view'
import JsonLoadFileInput from './JsonLoadFileInput';
import { ViewInputData } from './ViewIntupData' 
import { NavigationMap } from './NavMap';

type Props = {
  initialData?: InputPanoData,
  setData: (data: InputPanoData) => void
}

export const Pano: React.FunctionComponent<Props> = ({ initialData, setData }) => {
    const [ position, setPosition ] = useState(initialData?.position);
    const [ pov, setPov ] = useState(initialData?.pov);
    const [ elevationData, setElevationData ] = useState(initialData?.elevation)
    const [ getPosition, setGetPosition ] = useState();
    const [ typeInfo, setTypeInfo ] = useState('text')
    const [ info, setInfo ] = useState<PanoType>()
    const { state: { elevation } } = useGoogleMaps()

    const onChangePosition = (event: any) => {
      setGetPosition(event)
      setPosition({
        lat: event.lat(),
        lng: event.lng()
      })
    }

    const onChangePov = (event: any) => {
      setPov({
        pitch: event.pitch,
        heading: event.heading
      })
    }

    const positionInputOnChange = (event: any) => {
      const value = event.target.value;
      const [ lan, lng ] = value.split(',');
      const position = {
        lat: parseFloat(lan),
        lng: parseFloat(lng)
      }
      setPosition(position)
    }

    const onEnter = (e: any) => {
      e.key === 'Enter' && positionInputOnChange(e)
    }

    const generateInfo = useCallback(() => {
      if (!position || !elevationData || !pov) return;

      setData({ position: {
        latAndLong: `${position.lat}, ${position.lng}`,
        ...position
      }, pov, elevation: elevationData})

          const id = new Date().toISOString()
          return {
            id,
            inputData: 
            { position,
              pov,
              elevation: elevationData
            }
          } as PanoType;
      }, [elevationData, position, pov, setData])

    const typeInfoHandle = (event: any) => {
      const value = event.target.value;
      value && setTypeInfo(value)
    }

    useEffect(() => {
      const info = generateInfo()
      setInfo(info)
    }, [ generateInfo ])

    useEffect(() =>{
      getPosition && elevation.getElevationForLocations({ locations: [ getPosition ] }, 
        ([ value ]: any[]) => setElevationData(value))
    }, [elevation, getPosition])

    const viewPano = useMemo(() => {
      const initPosition = position || initialData?.position
      const initPov = pov || initialData?.pov
      if (!initPosition) return null;

      return <><ReactStreetview
        apiKey={apiKey}
        streetViewPanoramaOptions={{
          position: initPosition,
          pov: initPov
        }}
        onPositionChanged={onChangePosition}
        onPovChanged={onChangePov}
      />
      <NavigationMap position={initPosition} onClick={(pos) => setPosition(pos)}/>
      </>
  }, [ position, pov, initialData ])

    const onSelectInitialFile = (res: PanoType) => {
      const { inputData: { position, pov, elevation } } = res
      setPosition(position)
      setPov(pov)
      setElevationData(elevation)
    }

		return (
      <div
      style={{
        width: '50%'
			}}>
        <div className='marker'></div>
        <div className='pano'>{viewPano}</div>
        <Card>
          <Card.Body>
            <Card.Title className='d-flex justify-content-between'>
              <FormControl
                className='col-md-4 col-sm-12'
                onBlur={positionInputOnChange}
                onDragEnter={positionInputOnChange}
                onKeyDown={onEnter}
                placeholder='00.12345, 00.12345'
              />
              <ToggleButtonGroup className="ml-4 col-md-2 col-sm-12" type='radio' name='info-type' vertical onClick={typeInfoHandle} value={typeInfo}>
                <ToggleButton variant='outline-warning' value='text'>Text</ToggleButton>
                <ToggleButton variant='outline-warning' value='json'>Json</ToggleButton>
              </ToggleButtonGroup>
              <JsonLoadFileInput onChange={onSelectInitialFile}/>
              <Button className='col-md-2 col-sm-12' variant="light" onClick={() => saveJson(info, 'inputData')}>Save to JSON</Button>
            </Card.Title>
            <Card.Footer>
              {typeInfo === 'text' ? <ViewInputData inputData={info} /> : <ReactJson src={info} />}
            </Card.Footer>
          </Card.Body>
        </Card>
			</div>
		);
}