import React from 'react'
import { PanoType } from '../types';

type Props = {
    inputData?: PanoType
}

export const ViewInputData: React.FunctionComponent<Props> = ({ inputData }) => {
    if (!inputData) return null;

    const { inputData: { position, pov, elevation } } = inputData;

    return <>
        <div>Lat: {position.lat}</div>
        <div>Long: {position.lng}</div>
        <div>Pitch: {pov.pitch}</div>
        <div>Heading: {pov.heading}</div>
        <div>Elevation: {elevation.elevation}</div>
        <div>Resolution: {elevation.resolution}</div>
    </>
}