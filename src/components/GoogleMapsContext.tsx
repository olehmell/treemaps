import React, { useState, createContext, useContext } from 'react';
import { GoogleApiWrapper } from 'google-maps-react'
import { apiKey } from '../config';

export type GoogleMapsState = {
  google: any,
  elevation: any,
  inputData: any
}

function functionStub () {
  throw new Error('Function needs to be set in GoogleMapsProvider')
}

export type GoogleMapsContextProps = {
  state: GoogleMapsState
  setData: (data: any) => void
}

const contextStub: GoogleMapsContextProps = {
  state: {} as GoogleMapsState,
  setData: functionStub
}

export const GoogleMapsContext = createContext<GoogleMapsContextProps>(contextStub)

type GoogleApiWrapperProps = {
  google: any
}

export function GoogleMapsProvider (props: React.PropsWithChildren<GoogleApiWrapperProps>) {
  const { google } = props;
  // eslint-disable-next-line new-parens
  const elevation = new google.maps.ElevationService
  const [ state, setState ] = useState<GoogleMapsState>({
    google: google,
    elevation: elevation,
    inputData: {}
  })

  const contextValue = {
    state,
    setData: (data: any) => setState({ ...state, inputData: data })
  }
  return <GoogleMapsContext.Provider value={contextValue}>{props.children}</GoogleMapsContext.Provider>
}

export function useGoogleMaps () {
  return useContext(GoogleMapsContext)
}

export default GoogleApiWrapper({
  apiKey: apiKey
})(GoogleMapsProvider)