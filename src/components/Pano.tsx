import React, { useState, useMemo, useEffect, useCallback } from 'react'
import ReactStreetview from 'react-google-streetview';
import { apiKey } from '../config';
import { Card, Button, FormControl, ToggleButtonGroup, ToggleButton } from 'react-bootstrap'
import { saveAs, encodeBase64 } from '@progress/kendo-file-saver';
import { useGoogleMaps } from './GoogleMapsContext';

type Position = {
  lat: number,
  lng: number
}

type Pov = {
  pitch: string,
  heading: string
}

type ElevationData = {
  elevation: number,
  resolution: number
}

type InfoType = string | JSX.Element

export const Pano = () => {
    const [ position, setPosition ] = useState<Position>();
    const [ pov, setPov ] = useState<Pov>();
    const [ elevationData, setElevationData ] = useState<ElevationData>()
    const [ getPosition, setGetPosition ] = useState();
    const [ typeInfo, setTypeInfo ] = useState('text')
    const [ info, setInfo ] = useState<InfoType>('')
    const { state: { elevation } } = useGoogleMaps()

    const onChangePosition = (event: any) => {
      console.log(event)
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
      console.log(position)
      setPosition(position)
    }

    const onEnter = (e: any) => {
      e.key === 'Enter' && positionInputOnChange(e)
    }

    const generateInfo = useCallback((type: string) => {
      let info: InfoType = ''

      if (!position && !elevationData) return info;

      const lat = position?.lat
      const lng = position?.lng
      const pitch = pov?.pitch || 0
      const heading = pov?.heading || 0
      const elevation = elevationData?.elevation
      const resolution = elevationData?.resolution

      switch (type) {
        case 'text': {
          info = <>
            <div>Lat: {lat}</div>
            <div>Lng: {lng}</div>
            <div>Pitch: {pitch}</div>
            <div>Heading {heading}</div>
            <div>Elevation {elevation}</div>
            <div>Resolution: {resolution}</div>
          </>
          break;
        }
        case 'json': {
          const json = { position, pitch, heading, elevation, resolution };
          info = JSON.stringify(json, null, '\t')
          break;
        }
      }
      return info
    }, [elevationData, position, pov])

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

    const saveJson = () => {
      const dataURI = "data:text/json;base64," + encodeBase64(generateInfo('json') as string);
      const fileName = `${new Date().toISOString()}.json`
      saveAs(dataURI, fileName)
    }

    const viewPano = useMemo(() => <ReactStreetview
      apiKey={apiKey}
      streetViewPanoramaOptions={{
        position: position
      }}
      onPositionChanged={onChangePosition}
      onPovChanged={onChangePov}
    />, [ position ])

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
              className='col-4'
              onBlur={positionInputOnChange}
              onDragEnter={positionInputOnChange}
              onKeyDown={onEnter}
              />
              <ToggleButtonGroup className="ml-4" type='radio' name='info-type' onClick={typeInfoHandle} value={typeInfo}>
                <ToggleButton value='text'>Text</ToggleButton>
                <ToggleButton value='json'>Json</ToggleButton>
              </ToggleButtonGroup>
              <Button className='col-4' variant="secondary" onClick={saveJson}>Save to JSON</Button>
            </Card.Title>
            <Card.Text>
              {info}
            </Card.Text>
          </Card.Body>
        </Card>
			</div>
		);
}