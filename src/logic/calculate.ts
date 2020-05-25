import { InputPanoData, InitialData } from './../types';
import { treemap_calculator } from './calculator';

type Data = {
  firstPanoData?: InputPanoData,
  secondPanoData?: InputPanoData
}

type InputData = {
  latC_d: number,
  longC_d: number,
  azCA_d: number,
  latB_d: number,
  longB_d: number,
  azBA_d:number
};

export const calculate = ({ firstPanoData, secondPanoData }: Data) => {
  try {
    if (!firstPanoData || !secondPanoData)
      throw new Error('Input data is empty')

    console.log(firstPanoData, secondPanoData)

    const { position: { lat: latC_d, lng: longC_d }, pov: { heading: azCA_d } } = firstPanoData
    const { position: { lat: latB_d, lng: longB_d }, pov: { heading: azBA_d } } = secondPanoData
    const inputData: InputData = {
      latC_d,
      longC_d,
      azCA_d,
      latB_d,
      longB_d,
      azBA_d
    }
    const { lat_A_d, long_A_d, a_r, b_r, c_r } = treemap_calculator(inputData)
    return {
      id: new Date().toISOString(),
      user_id: 'Name',
      session_id: 'Test',
      outputData: {
        position: {
          latAndLong: `${lat_A_d}, ${long_A_d}`,
          lat_A_d,
          long_A_d
        },
        a_r,
        b_r,
        c_r
      },
      inputData: {
        firstPanoData,
        secondPanoData
      }
    } as InitialData
  } catch (err) {
    console.log(err.message)
    return { error: err.message }
  }

    
  };