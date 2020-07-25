export type Position = {
    latAndLong?: string,
    lat: number,
    lng: number
  }
  
export type Pov = {
  pitch: number,
  heading: number
}

export type Properties = {
  ca: number,
  capturedAt: string,
  key: string,
  pano: true,
  sequenceKey: string,
  userKey: string
}

export type InputPanoData = {
  position: Position,
  pov: Pov
}

export type PanoType = {
  id: string,
  inputData: InputPanoData
}

export type CoordTwo = {
  latA_d: number,
  longA_d: number,
  a_r: number,
  b_r: number,
  c_r: number
}

export type InitialData = {
  id: string,
  user_id: string,
  session_id: string,
  inputData: {
    firstImageData: InputPanoData,
    secondImageData: InputPanoData
  },
  outputData?: CoordTwo
}

export type TreeRt = {
  RtM: number[],
  RtCr?: number[],
  imTrKey: string,
}

export type TreeSizes = {
  width: number,
  height: number,
  widthCr: number,
}

export type Tree = {
  az: number,
  pitch: number,
  imTrKey: string,
  sizes?: TreeSizes,
  isPlaneHoriz: boolean,
  coord_1?: {
    latA_r: number,
    longA_r: number,
    latA_d: number,
    longA_d: number 
  }
}

export type Image = {
  properties: Properties,
  geometry: {
    coordinates: number[]
  },
  camH: number,
  trees: Tree[]
}

export type TreePair = {
  im0TrKey: string,
  im1TrKey: string,
  trKey: string,
  sizes?: TreeSizes,
  coord_2: CoordTwo
}

export type ImagePair = {
  im0Key: string,
  im1Key: string,
  treePairs: TreePair[]
}

export type ResultData = {
  pair: ImagePair,
  imgs: Image[] 
}
