import React, { useState, useEffect, useCallback } from 'react'
import { Card, Button, FormControl, ButtonGroup } from 'react-bootstrap'
import { Image, Properties, TreeRt, Tree, TreeSizes } from '../types';
import { saveJson } from '../logic/saveJson';
import ReactJson from 'react-json-view'
import JsonLoadFileInput from './JsonLoadFileInput';
import 'mapillary-js/dist/mapillary.min.css';
import { Viewer, TagComponent } from 'mapillary-js';
import { ctg, reckon, rad2deg } from '../logic/calculator'
import { useMerasurementTypeContext } from './TypeContext';

type Props = {
  initialData?: Image,
  setData: (data: Image) => void
}

const initImg = {
  properties: { 'test': 'test' } as any,
  geometry: {
    coordinates: []
  },
  camH: 2,
  trees: [ {} as any ]
} as Image


export const calculateCoord1 = ([ lat, lon ]: number[], dist: number, az_d: number) => {
  const { latA_r, longA_r } = reckon(lat, lon, dist, az_d);
  return {
    is_Plane_Horiz: true,
    coord_1: {
      latA_r,
      longA_r,
      latA_d: rad2deg(latA_r),
      longA_d: rad2deg(longA_r)
    }
  }
}

export const Pano: React.FunctionComponent<Props> = ({ initialData = initImg, setData }) => {
  const [uniqKey] = useState(`mappilary-js-${new Date().getTime()}`)
  const [tagComponent, setTagComponent] = useState<any>();
  const [viewer, setViewer] = useState<any>()
  const [ camH ] = useState(initialData.camH)
  const [ properties, setProperties ] = useState<Properties>(initialData.properties)
  const [ coordinates, setCoordinates ] = useState<number[]>(initialData.geometry.coordinates)

  const { userKey, key, sequenceKey } = properties || {} as any
  const imTrKey = `${key}_${userKey}_${sequenceKey}`

  const [ calculateCr, setCalculateCr ] = useState(false)

  const [ trees, setTrees ] = useState<TreeRt[]>([])

  const {
    isTwoWindowsType
  } = useMerasurementTypeContext();

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
      key || 'hxMfoRUF9RkUYV2Y2VWM9k',
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
      console.log('nodechanged', e)
      const { computedLatLon, originalLatLon, ca, capturedAt, key, pano, sequenceKey, userKey } = e
      const { lat, lon } = computedLatLon || originalLatLon
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

        const coord = geometry.rect;
        const lastTree = trees.pop()
        console.log(lastTree)

        if (!lastTree) {
          trees.push({
            imTrKey,
            RtM: coord
          })
        } else {
          const isRtCr = lastTree.RtCr
          console.log(isRtCr)
          if (isRtCr) {
            trees.push(...[ lastTree, {
              imTrKey,
              RtM: coord
            } ])
          } else {
            lastTree.RtCr = coord
            trees.push(lastTree)
          }
        }
        
        console.log(trees)

        setTrees([ ...trees ])

      } else if (geometry instanceof TagComponent.PointGeometry) {
        tag = new TagComponent.SpotTag(id, geometry, { editable: true, text: "point" });
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
  }, [ uniqKey, isTwoWindowsType ])

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
    if (!properties || !coordinates) return 

    const treesData: Tree[] = trees.map(({ RtM, RtCr }) => {
      const [ x0, y0, x1, y1 ] = RtM
      const [ crX0, crX1, crY0 ] = RtCr || []
      const x = (x0 + x1)/2
      const y = (y0 + y1)/2
      const az_d = (x - 0.5)*360 + properties.ca
      const pitch_d = (0.5 - y)*180
      const dist = camH * ctg(pitch_d);
      console.log('dist', dist)
      const coordResult = isTwoWindowsType ? { isPlaneHoriz: false, imTrKey } : calculateCoord1(coordinates, dist, az_d)
      // Tr_W = 2*Math.Pi*dist*abs(Tr_Unbound.Rt.Rt0.x0 - Tr_Unbound.Rt.Rt0.x1);
      const sizes: TreeSizes = {
        width: Math.abs(2*Math.PI*dist*Math.abs(x0 - x1)),
        height: Math.abs(dist*(Math.tan(crY0) - Math.tan(y1))),
        widthCr: Math.abs(2*Math.PI*dist*Math.abs(crX0 - crX1))
      }
      // Tr_Cr = 2*Math.Pi*dist*abs(Tr_Unbound.Rt.Rt1.x0 - Tr_Unbound.Rt.Rt1.x1);
      // Tr_H = dist*(tg(Tr_Unbound.Rt.Rt1.y0) - tg(Tr_Unbound.Rt.Rt0.y1));
      return { az_d, pitch_d, ...coordResult, sizes } as any
    })

    setData({
      properties: properties,
      geometry: { coordinates },
      trees: treesData,
      camH
    })
  }, [properties, coordinates, setData, initialData.camH, camH, isTwoWindowsType, imTrKey, trees])

  const onSelectInitialFile = (res: Image) => {
    setData(res)
  }

  return (
    <div className='pano'>
      <div className='map-container'>
        <div id={uniqKey} style={{ height: '100%' }}></div>
        <ButtonGroup className='nav-button-container'>
          {/* <Button variant="light" onClick={() => changeMode(TagComponent.TagMode.CreatePoint)}>Точка</Button> */}
          <Button variant="light" onClick={() => { 
            changeMode(TagComponent.TagMode.CreateRect)
            setCalculateCr(true)
          }} disabled={calculateCr}>Позначити стовбур</Button>
          <Button  variant="light" onClick={() => { 
            changeMode(TagComponent.TagMode.CreateRect)
            setCalculateCr(false)
          }} disabled={!calculateCr}>Позначити крону</Button>
          <Button  variant="light" onClick={() => changeMode(TagComponent.TagMode.Default)}>Відмітити</Button>
          <JsonLoadFileInput onChange={onSelectInitialFile} />
          <Button variant="light" onClick={() => saveJson(initialData, 'imageData')}>Зберегти JSON</Button>
        </ButtonGroup>
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
            <FormControl
              className='col-md-4 col-sm-12'
              onBlur={keyInputOnChange}
              onDragEnter={keyInputOnChange}
              onKeyDown={onEnterKey}
              placeholder='Enter key'
            />
          </Card.Title>
          <Card.Footer>
            <ReactJson src={initialData} />
          </Card.Footer>
        </Card.Body>
      </Card>
    </div>
  );
}