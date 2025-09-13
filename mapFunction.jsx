//This file contains code that pulls the google maps api
//This was made with help from this site: https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#1 and asking Chatgpt to simplify and breakdown its contents for me
import React from 'react';
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';

const POIS = [
  { id: 'placeholder location', location: {lat: 52.90477, lng: -118.08845} },
  //This will evetually pull all POI's lat and long from the park api's
];

function parkMap() {
  return (
    <APIProvider apiKey="AIzaSyDDrM5Er5z9ZF0qWdP4QLDEcgpfqGdgwBI">
      <Map
        defaultCenter={{lat: 52.88660, lng: -118.10222}}
        defaultZoom={10}>
        {POIS.map(poi => (
          <AdvancedMarker
            key={poi.id}
            position={poi.location}
          />
        ))}
      </Map>
    </APIProvider>
  );
}

export default parkMap;
