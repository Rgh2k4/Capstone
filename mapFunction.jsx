//This file contains code that pulls the google maps api
//This was made with help from this site: https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#1 and asking Chatgpt to simplify and breakdown its contents for me
import React from 'react';
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';

const POIS = [
  { id: 'placeholder location', location: {lat: 52.90477, lng: -118.08845}},
  { id: 'second placeholer', name: '2nd placeholder', description:'this pull is different', location: {lat: 52, lng: -119}}
  //This will evetually pull all POI's lat and long from the park api's
];

function parkMap({onPOIClick}) {
  //The info panel code was made with help from https://developers.google.com/maps/documentation/javascript/infowindows#maps_infowindow_simple-javascript
  // and asking Chatgpt "how can I make the sidepanel pull the info of the selected POI?"
  const [selectedPOI, setSelectedPOI] = useState(null);

  return (
    <div>
      <div>
        <APIProvider apiKey="AIzaSyDDrM5Er5z9ZF0qWdP4QLDEcgpfqGdgwBI">
          <Map
          defaultCenter={{lat: 52.88660, lng: -118.10222}}
          defaultZoom={10}>
            {POIS.map(poi => (
              <AdvancedMarker
              key={poi.id}
              position={poi.location}
              onClick={() => setSelectedPOI(poi)}
                if (onPOIClick) onPOIClick(poi));
            />
          ))}
        </Map>
      </APIProvider>
    </div>
    {/*Sidepanel info*/}
    <div
    style={{
      width: '300px',
      background: '#f0f0f0',
      padding: '16px',
      overflowY: 'auto',
    }}>
      {selectedPOI ? (
          <>
            <h2>{selectedPOI.name}</h2>
            <p>{selectedPOI.description}</p>
            <h3>Reviews</h3>
            {selectedPOI.reviews.length > 0 ? (
              <ul>
                {selectedPOI.reviews.map((review, index) => (
                  <li key={index}>{review}</li>
                ))}
              </ul>
            ) : (
              <p>No reviews yet</p>
            )}
          </>
        ) : (
          <p>Click a marker to see details</p>
        )}
      </div>
    </div>
  );
}

export default parkMap;
