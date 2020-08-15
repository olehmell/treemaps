import { Image, ResultData, TreeSizes } from './../types';
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

    const { geometry: {  coordinates: [ latC_d, longC_d ] }, trees: firstImTrees, properties: { key: im0Key } } = firstImageData
    const { geometry: {  coordinates: [ latB_d, longB_d ] }, trees: secondImTrees, properties: { key: im1Key } } = secondImageData

    const treePairs = firstImTrees.map(( { az_d: azCA_d, imTrKey: im0TrKey, sizes: firstSizes = {} as TreeSizes }, i) => {
      const { az_d: azBA_d, imTrKey: im1TrKey, sizes: secondSizes = {} as TreeSizes } = secondImTrees[i] || {} as any
      const inputData: InputData = {
        latC_d,
        longC_d,
        azCA_d,
        latB_d,
        longB_d,
        azBA_d
      }

      const coord_2 = treemap_calculator(inputData)

      const sizes: TreeSizes = {
        width: (firstSizes.width - secondSizes.width)/2,
        widthCr: (firstSizes.widthCr - secondSizes.widthCr)/2,
        height: (firstSizes.height - secondSizes.height)/2
      }

      // TODO calculate width and height
      return {
        im0TrKey,
        im1TrKey,
        trKey: `${im0TrKey}_${im1TrKey}_${new Date().getMilliseconds()}`,
        coord_2,
        sizes
      }
    })

    return {
      pair: {
        im0Key,
        im1Key,
        treePairs
      },
      imgs: [firstImageData, secondImageData]
    } as ResultData
  } catch (err) {
    console.log(err.message)
    return { error: err.message }
  }

    
  };