export type Position = {
    latAndLong?: string,
    lat: number,
    lng: number
  }
  
export type Pov = {
  pitch: number,
  heading: number
}


export type InputPanoData = {
  position: Position,
  pov: Pov
}

export type PanoType = {
  id: string,
  inputData: InputPanoData
}

export type OutputData = {
  position: {
    latAndLong: string,
    lat_A_d: number,
    long_A_d: number,
  }
  a_r: number,
  b_r: number,
  c_r: number
}

export type InitialData = {
  id: string,
  user_id: string,
  session_id: string,
  inputData: {
    firstPanoData: InputPanoData,
    secondPanoData: InputPanoData
  },
  outputData?: OutputData
}