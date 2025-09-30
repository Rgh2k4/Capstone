//This file contains code that pulls the google maps api
//This was made with help from this site: https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#1 and asking Chatgpt to simplify and breakdown its contents for me
import React, {useState, useEffect} from 'react';
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';

function ParkMap({viewParkDetails}) {
  //The info panel code was made with help from https://developers.google.com/maps/documentation/javascript/infowindows#maps_infowindow_simple-javascript
  // and asking Chatgpt "how can I make the sidepanel pull the info of the selected POI?"
  const [pois, setPois] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);

  //Pulling the API's urls rather than hardcoding the files into the system allows for cleaner integration and ensures the latest versions of the API's are pulled, as some are updated weekly
  //This was written with help from ChatGPT when asked "How do I integrate these GEOJson api's into the google map api?"
  /*useEffect(() => {
    async function loadData() {
      const urls = [
        //National park urls in order - POI - Place name - Facilities - Trails - Accommodations
        "https://opendata.arcgis.com/datasets/dff0acc0f20c4666a253860f6444bb43_0.geojson",
        "https://opendata.arcgis.com/datasets/1769ca13cd044206ba59aa1b0bc84356_0.geojson",
        "https://opendata.arcgis.com/datasets/28b55decfac848c782819b1706e58aa1_0.geojson",
        "https://opendata.arcgis.com/datasets/76e8ea9ddd5b4a67862b57bd450810ce_0.geojson",
        "https://opendata.arcgis.com/datasets/85d09f00b6454413bd51dea2846d9d98_0.geojson"
      ];
      */
  useEffect(() => {
    async function loadData() {
      const urls = [
        //National park urls in order - POI - Place name - Facilities - Trails - Accommodations
        "https://opendata.arcgis.com/datasets/dff0acc0f20c4666a253860f6444bb43_0.geojson"
      ];

      try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const datasets = await Promise.all(responses.map(r => r.json()));

        const allPois = datasets.flatMap((data, datasetIndex) =>
          data.features
          .filter(f => f.geometry?.coordinates?.length === 2)
          .map((f, idx) => ({
            //${} inserts the value of a variable/expression into the string
            id: f.id || `${datasetIndex}-${idx}`,
            name: f.properties?.Name_e || f.properties?.Nom_f || "Unnamed POI",
            description: f.properties?.Description || f.properties?.description || "No description",
            location: {
              lat: parseFloat(f.geometry.coordinates[1]),
              lng: parseFloat(f.geometry.coordinates[0])
            },
            reviews: []
          }))
        );

        setPois(allPois);
      } catch (err) {
        console.error("Error loading datasets:", err);
      }
    }

    loadData();
  }, []);

  return (
    <div>
      <div className="h-screen w-screen overflow-y-hidden overflow-x-hidden">
        <APIProvider apiKey="AIzaSyDDrM5Er5z9ZF0qWdP4QLDEcgpfqGdgwBI">
          <Map
          defaultCenter={{lat: 52.88660, lng: -118.10222}}
          defaultZoom={10}
          mapId='456dc2bedf64a06c67cc63ea'>

            {pois
              .filter(poi => !isNaN(poi.location.lat) && !isNaN(poi.location.lng))
              .map(poi => (
              <AdvancedMarker
              key={poi.id}
              position={poi.location}
              onClick={() => viewParkDetails(poi)}
            />
          ))}
        </Map>
      </APIProvider>
    </div>
    </div>
  );
}


export default ParkMap;
