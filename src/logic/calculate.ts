import { InitialData, Image, ResultData } from './../types';
import { treemap_calculator } from './calculator';

type Data = {
  firstImageData?: Image,
  secondImageData?: Image
}

type InputData = {
  latC_d: number,
  longC_d: number,
  azCA_d: number,
  latB_d: number,
  longB_d: number,
  azBA_d:number
};

export const calculate = ({ firstImageData, secondImageData }: Data) => {
  try {
    if (!firstImageData || !secondImageData)
      throw new Error('Input data is empty')

    console.log(firstImageData, secondImageData)

    const { geometry: {  coordinates: [ latC_d, longC_d ] }, trees: [ { az: azCA_d, imTrKey: im0TrKey } ], properties: { key: im0Key } } = firstImageData
    const { geometry: {  coordinates: [ latB_d, longB_d ] }, trees: [ { az: azBA_d, imTrKey: im1TrKey } ], properties: { key: im1Key } } = secondImageData

    const inputData: InputData = {
      latC_d,
      longC_d,
      azCA_d,
      latB_d,
      longB_d,
      azBA_d
    }

    console.log(inputData)

    return {
      pair: {
        im0Key,
        im1Key,
        treePairs: [
          { 
            im0TrKey,
            im1TrKey,
            trKey: `${im0TrKey}_${im1TrKey}_${new Date().getMilliseconds()}`,
            coord_2: treemap_calculator(inputData)
          }
        ]
      },
      imgs: [ firstImageData, secondImageData ]
    } as ResultData
  } catch (err) {
    console.log(err.message)
    return { error: err.message }
  }

    
  };