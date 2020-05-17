import React, { useState, useMemo, useEffect, useCallback } from 'react'
import ReactStreetview from 'react-google-streetview';
import { apiKey } from '../config';
import { Card, Button, FormControl, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { useGoogleMaps } from './GoogleMapsContext';
import { PanoData } from '../types';
import { saveJson } from '../logic/saveJson';
import ReactJson from 'react-json-view'

type InfoType = object | JSX.Element

type Props = {
  initialData?: PanoData,
  setData: (data: PanoData) => void
}

export const Pano: React.FunctionComponent<Props> = ({ initialData, setData }) => {
    const [ position, setPosition ] = useState(initialData?.position);
    const [ pov, setPov ] = useState(initialData?.pov);
    const [ elevationData, setElevationData ] = useState(initialData?.elevation)
    const [ getPosition, setGetPosition ] = useState();
    const [ typeInfo, setTypeInfo ] = useState('text')
    const [ info, setInfo ] = useState<InfoType>(<></>)
    const { state: { elevation } } = useGoogleMaps()

    const onChangePosition = (event: any) => {
      console.log(event)
      setGetPosition(event)
      setPosition({
        lat: event.lat(),
        lng: event.lng()
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      console.log(position)
      setPosition(position)
    }

    const onEnter = (e: any) => {
      e.key === 'Enter' && positionInputOnChange(e)
    }

    const generateInfo = useCallback((type: string) => {
      if (!position || !elevationData || !pov) return <></>;

      setData({ position, pov, elevation: elevationData})
      const lat = position?.lat
      const lng = position?.lng
      const pitch = pov?.pitch || 0
      const heading = pov?.heading || 0
      const elevation = elevationData?.elevation
      const resolution = elevationData?.resolution

      switch (type) {
        case 'text': {
          return <div>
            <div>Lat: {lat}</div>
            <div>Lng: {lng}</div>
            <div>Pitch: {pitch}</div>
            <div>Heading {heading}</div>
            <div>Elevation {elevation}</div>
            <div>Resolution: {resolution}</div>
          </div>
        }
        case 'json': {
          const id = new Date().toISOString()
          return { 
            id,
            inputData: 
            { position,
              pitch,
              heading,
              elevation,
              resolution
            }
          };
        }
      }

      return <></>
    }, [elevationData, position, pov, setData])

    const typeInfoHandle = (event: any) => {
      const value = event.target.value;
      value && setTypeInfo(value)
    }

    useEffect(() => {
      const info = generateInfo(typeInfo)
      setInfo(info)
    }, [generateInfo, typeInfo])

    useEffect(() =>{
      getPosition && elevation.getElevationForLocations({ locations: [ getPosition ] }, 
        ([ value ]: any[]) => setElevationData(value))
    }, [elevation, getPosition])

    const viewPano = useMemo(() => <ReactStreetview
      apiKey={apiKey}
      streetViewPanoramaOptions={{
        position: position
      }}
      onPositionChanged={onChangePosition}
      onPovChanged={onChangePov}
    />, [ onChangePov, position])

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
              <ToggleButtonGroup className="ml-4 col-md-4 col-sm-12" type='radio' name='info-type' onClick={typeInfoHandle} value={typeInfo}>
                <ToggleButton variant='outline-warning' value='text'>Text</ToggleButton>
                <ToggleButton variant='outline-warning' value='json'>Json</ToggleButton>
              </ToggleButtonGroup>
              <Button className='col-md-4 col-sm-12' variant="light" onClick={() => saveJson(JSON.stringify(generateInfo('json') as any, null, '\t'))}>Save to JSON</Button>
            </Card.Title>
            <Card.Footer>
              {typeInfo === 'text' ? info : <ReactJson src={info} />}
            </Card.Footer>
          </Card.Body>
        </Card>
			</div>
		);
}