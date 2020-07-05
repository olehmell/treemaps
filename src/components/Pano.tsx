import React, { useState, useEffect, useCallback } from 'react'
import { Card, Button, FormControl, ToggleButtonGroup, ToggleButton, ButtonGroup } from 'react-bootstrap'
import { InputPanoData, PanoType, Pov } from '../types';
import { saveJson } from '../logic/saveJson';
import ReactJson from 'react-json-view'
import JsonLoadFileInput from './JsonLoadFileInput';
import { ViewInputData } from './ViewIntupData'
import 'mapillary-js/dist/mapillary.min.css';
import { Viewer, TagComponent } from 'mapillary-js';
import { deg2rad, mapillary2deg } from '../logic/calculator'

type Props = {
  initialData?: InputPanoData,
  setData: (data: InputPanoData) => void
}

type Position = {
  lat: number,
  lon: number
}

export const Pano: React.FunctionComponent<Props> = ({ initialData, setData }) => {
  const [position, setPosition] = useState(initialData?.position);
  const [pov, setPov] = useState(initialData?.pov);
  const [typeInfo, setTypeInfo] = useState('text')
  const [info, setInfo] = useState<PanoType>()

  const [uniqKey] = useState(`mappilary-js-${new Date().getTime()}`)
  const [tagComponent, setTagComponent] = useState<any>();
  const [viewer, setViewer] = useState<any>()

  const changeMode = useCallback(
    (tagMode: any) => {
      tagComponent.changeMode(tagMode);
    },
    [tagComponent]
  )

  useEffect(() => {
    // Retrieve tag component
    const viewer = new Viewer(
      uniqKey,
      "QjI1NnU0aG5FZFZISE56U3R5aWN4Zzo3NTM1MjI5MmRjODZlMzc0",
      "ImB-gdHNAI1sgU9lwf1UCg",
      {
        component: {
          cover: false,
          tag: true,
        },
      }
    )

    const tagComponent = viewer.getComponent("tag");
    setTagComponent(tagComponent)
    setViewer(viewer)

    viewer.on(Viewer.nodechanged, (e: any) => { 
      console.log('NodeChanged', e)
      const { lat, lon } = e.computedLatLon
      setPosition({ lat, lng: lon })
    });
    // Create and add editable tags based on created geometry type
    viewer.getPosition().then(({ lat, lon }: Position) => { setPosition({ lat, lng: lon }) });
    var createdIndex = 0;
    tagComponent.on(TagComponent.TagComponent.geometrycreated, function (geometry: any) {
      var id = "id-" + createdIndex++;

      var tag;
      console.log(geometry)
      if (geometry instanceof TagComponent.RectGeometry) {
        tag = new TagComponent.OutlineTag(id, geometry, { editable: true, text: "rect" });
        const [ x0, y0, x1, y1 ] = geometry.rect
        onChangePov({
          pitch: x0 + x1/2,
          heading: y0 + y1/2
        })
      } else if (geometry instanceof TagComponent.PointGeometry) {
        tag = new TagComponent.SpotTag(id, geometry, { editable: true, text: "point" });
        const [ x0, y0 ] = geometry.point
        onChangePov({ pitch: x0, heading: y0 })
      } else if (geometry instanceof TagComponent.PolygonGeometry) {
        tag = new TagComponent.OutlineTag(id, geometry, { editable: true, text: "polygon" });
      } else {
        throw new Error("Unsupported geometry type");
      }

      var onTagGeometryChanged = function (tag: { id: any; geometry: any; }) { console.log(tag.id, tag.geometry); };
      tag.on(TagComponent.OutlineTag.geometrychanged, onTagGeometryChanged);

      tagComponent.add([tag]);
    });

    // Tags are related to a specific node, remove them when node changes
    viewer.on(Viewer.nodechanged, function () {
      tagComponent.removeAll();
    });

    window.addEventListener("resize", function () { viewer.resize(); });
  }, [uniqKey])

  const positionInputOnChange = (event: any) => {
    const value = event.target.value;
    const [lan, lng] = value.split(',');
    const pos = {
      lat: parseFloat(lan),
      lng: parseFloat(lng)
    }
    setPosition(pos)
    viewer.moveCloseTo(pos.lat, pos.lng)
  }

  const onEnterPosition = (e: any) => {
    e.key === 'Enter' && positionInputOnChange(e)
  }

  const keyInputOnChange = (event: any) => {
    const value = event.target.value;
    viewer.moveToKey(value)
  }

  const onEnterKey = (e: any) => {
    e.key === 'Enter' && keyInputOnChange(e)
  }

  const onChangePov = ({ pitch, heading }: Pov) => {
    const pov = {
      pitch: deg2rad(mapillary2deg(pitch)),
      heading: deg2rad(mapillary2deg(heading))
    }
    console.log('POV:', pov)
    setPov(pov)
  }

  const generateInfo = useCallback(() => {
    console.log(position, pov)
    if (!position || !pov) return;

    setData({
      position: {
        latAndLong: `${position.lat}, ${position.lng}`,
        ...position
      }, pov
    })

    const id = new Date().toISOString()
    return {
      id,
      inputData:
      {
        position,
        pov
      }
    } as PanoType;
  }, [position, pov, setData])

  const typeInfoHandle = (event: any) => {
    const value = event.target.value;
    value && setTypeInfo(value)
  }

  useEffect(() => {
    const info = generateInfo()
    setInfo(info)
  }, [generateInfo])

  const onSelectInitialFile = (res: PanoType) => {
    const { inputData: { position, pov } } = res
    setPosition(position)
    setPov(pov)
  }

  return (
    <div
      style={{
        width: '50%'
      }}>
      <div className='map-container'>
        <div id={uniqKey} style={{ height: '100%' }}></div>
        <div className="button-container">
          <button onClick={() => changeMode(TagComponent.TagMode.CreatePoint)}>Create point</button>
          <button onClick={() => changeMode(TagComponent.TagMode.CreateRect)}>Create rectangle</button>
          <button onClick={() => changeMode(TagComponent.TagMode.CreateRectDrag)}>Create rectangle drag</button>
          <button onClick={() => changeMode(TagComponent.TagMode.Default)}>Stop creating</button>
          <input
            onBlur={keyInputOnChange}
            onDragEnter={keyInputOnChange}
            onKeyDown={onEnterKey}
            placeholder='Enter key'
          />
        </div>
      </div>
      <Card>
        <Card.Body>
          <Card.Title className='d-flex justify-content-between'>
            <FormControl
              className='col-md-4 col-sm-12'
              onBlur={positionInputOnChange}
              onDragEnter={positionInputOnChange}
              onKeyDown={onEnterPosition}
              placeholder='00.12345, 00.12345'
            />
            <ToggleButtonGroup className="ml-4 col-md-2 col-sm-12" type='radio' name='info-type' vertical onClick={typeInfoHandle} value={typeInfo}>
              <ToggleButton variant='outline-warning' value='text'>Text</ToggleButton>
              <ToggleButton variant='outline-warning' value='json'>Json</ToggleButton>
            </ToggleButtonGroup>
            <ButtonGroup vertical className='col-md-4 col-sm-12'>
              <JsonLoadFileInput onChange={onSelectInitialFile} />
              <Button variant="light" onClick={() => saveJson(info, 'inputData')}>Save to JSON</Button>
            </ButtonGroup>
          </Card.Title>
          <Card.Footer>
            {typeInfo === 'text' ? <ViewInputData inputData={info} /> : <ReactJson src={info} />}
          </Card.Footer>
        </Card.Body>
      </Card>
    </div>
  );
}