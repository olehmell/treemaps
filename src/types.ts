export type Position = {
    lat: number,
    lng: number
  }
  
export type Pov = {
  pitch: number,
  heading: number
}

export type ElevationData = {
  elevation: number,
  resolution: number
}


export type PanoData = { 
  position: Position,
  pov: Pov,
  elevation: ElevationData
}

export type InputData = {
  latC_d: number,
  longC_d: number,
  azCA_d: number,
  latB_d: number,
  longB_d: number,
  azBA_d:number
};

export type OutputData = {
  lat_A_d: number,
  long_A_d: number,
  a_r: number,
  b_r: number,
  c_r: number
}

export type InitialData = {
  inputData: PanoData | InputData,
  outputData?: OutputData
}