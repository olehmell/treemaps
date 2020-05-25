import React, { useState } from 'react'
import { Position } from '../types'
import { useGoogleMaps } from './GoogleMapsContext'
import { Map, Marker } from 'google-maps-react';

type Props = {
    position: Position
    onClick?: (pos: Position) => void
}

export const NavigationMap: React.FunctionComponent<Props> = ({ position, onClick }) => {
    const { state: { google } } = useGoogleMaps()

    const getMarker = (pos: Position) => <Marker
      key={pos.lat + pos.lng}
      position={pos}
      icon={{
        url: "treeIcon.png",
        anchor: new google.maps.Point(32,32),
        scaledSize: new google.maps.Size(32,32)
      }}
    />

    const [ markers, setMarkers ] = useState([ getMarker(position) ])

    const onMapClick = (_mapProps: any, _map: any, clickEvent: any) => {
      const { latLng: { lat, lng } } = clickEvent;
      const pos = {
        lat: lat(),
        lng: lng()
      }
      setMarkers([ ...markers, getMarker(pos) ])
      onClick && onClick(pos)
    }

    const containerStyle = {
      position: 'relative',  
      width: '40%',
      height: '35%',
      bottom: '15.5rem',
      zIndex: '100'
    }

    return (
        <Map
          containerStyle={containerStyle}
          mapTypeControl={false}
          streetViewControl={false}
          google={google}
          zoom={14}
          initialCenter={position}
          onClick={onMapClick}
        >
          {markers}
        </Map>
    );
}