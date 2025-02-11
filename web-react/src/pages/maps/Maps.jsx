import { HeadingPrimary } from 'components/HeadingPrimary/HeadingPrimary'
import React from 'react'
import { Container } from 'react-bootstrap'
import { useLoadScript } from '@react-google-maps/api'
import Map from './Map'
import { useState } from 'react'

const Maps = () => {
  const [libraries] = useState(['places'])
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  })
  if (isLoaded) {
    return (
      <Container>
        <HeadingPrimary>Maps</HeadingPrimary>
        The Maps Feature is still being worked on. Will update soon!
      </Container>
    )
  }

  if (!isLoaded) {
    return <div>Loading...</div>
  }

  return (
    <Container>
      <HeadingPrimary>Maps</HeadingPrimary>
      <Map />
    </Container>
  )
}

export default Maps
