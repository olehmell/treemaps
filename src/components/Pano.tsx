import React, { useState, useEffect, useCallback } from 'react'
import { Card, Button, FormControl, ToggleButtonGroup, ToggleButton, ButtonGroup } from 'react-bootstrap'
import { Image, PanoType, Pov, Properties } from '../types';
import { saveJson } from '../logic/saveJson';
import ReactJson from 'react-json-view'
import JsonLoadFileInput from './JsonLoadFileInput';
import 'mapillary-js/dist/mapillary.min.css';
import { Viewer, TagComponent } from 'mapillary-js';
import { deg2rad } from '../logic/calculator'

type Props = {
  initialData?: Image,
  setData: (data: Image) => void
}

const initImg = {
  properties: { 'test': 'test' } as any,
  geometry: {
    coordinates: []
  },
  camH: '0',
  trees: [ {} as any ]
} as Image

export const Pano: React.FunctionComponent<Props> = ({ initialData: imageData = initImg, setData }) => {
  const [uniqKey] = useState(`mappilary-js-${new Date().getTime()}`)
  const [tagComponent, setTagComponent] = useState<any>();
  const [viewer, setViewer] = useState<any>()

  const [ properties, setProperties ] = useState<Properties>()
  const [ coordinates, setCoordinates ] = useState<number[]>()
  const [ xAndY, setXAndY ] = useState<number[]>()

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
      console.log(e)
      const { computedLatLon, ca, capturedAt, key, pano, sequenceKey, userKey } = e
      const { lat, lon } = computedLatLon
      setCoordinates([ lat, lon ])
      setProperties({ ca, capturedAt, key, pano, sequenceKey, userKey })
    });
    // Create and add editable tags based on created geometry type
    var createdIndex = 0;
    tagComponent.on(TagComponent.TagComponent.geometrycreated, function (geometry: any) {
      var id = "id-" + createdIndex++;

      var tag;
      console.log(geometry)
      if (geometry instanceof TagComponent.RectGeometry) {
        tag = new TagComponent.OutlineTag(id, geometry, { editable: true, text: "rect" });
        const [ x0, y0, x1, y1 ] = geometry.rect
        setXAndY([
          (x0 + x1)/2,
          (y0 + y1)/2,
        ])
      } else if (geometry instanceof TagComponent.PointGeometry) {
        tag = new TagComponent.SpotTag(id, geometry, { editable: true, text: "point" });
        const [ x0, y0 ] = geometry.point
        setXAndY([ x0, y0 ])
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
    setCoordinates([ pos.lat, pos.lng ])
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

  useEffect(() => {
    if (!properties || !xAndY || !coordinates) return 

    const [ x, y ] = xAndY
    const az = deg2rad((0.5 - x)*180)
    const pitch = deg2rad((y - 0.5)*360)
    const { userKey, key, sequenceKey } = properties

    setData({
      properties: properties,
      geometry: { coordinates },
      trees: [ { az, pitch, isPlaneHoriz: false, imTrKey: `${key}_${userKey}_${sequenceKey}` } ],
      camH: '0'
    })
  }, [ properties, xAndY, coordinates ])

  const onSelectInitialFile = (res: Image) => {
    setData(res)
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
            <ButtonGroup>
              <JsonLoadFileInput onChange={onSelectInitialFile} />
              <Button variant="light" onClick={() => saveJson(imageData, 'imageData')}>Save to JSON</Button>
            </ButtonGroup>
          </Card.Title>
          <Card.Footer>
            <ReactJson src={imageData} />
          </Card.Footer>
        </Card.Body>
      </Card>
    </div>
  );
}