//This file contains code that pulls the google maps api
//This was made with help from this site: https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#1 and asking Chatgpt to simplify and breakdown its contents for me
import React, {useState, useEffect, useRef} from 'react';
import {APIProvider, Map, AdvancedMarker} from '@vis.gl/react-google-maps';

function MapFunction({filters=[]}, setUniqueTypes, viewParkDetails) {
  //The info panel code was made with help from https://developers.google.com/maps/documentation/javascript/infowindows#maps_infowindow_simple-javascript
  // and asking Chatgpt "how can I make the sidepanel pull the info of the selected POI?"
  const [pois, setPois] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);
  //This code gets the users location to start the map at, and if the location is not found, it will start the map at the useState location
  const [userLocation, setUserLocation] = useState({lat: 52.8866, lng:-118.10222}
  );

  //https://developers.google.com/maps/documentation/utilities/polylineutility & https://developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

  //This code gets the users location with permission on load and was made with help from https://developers.google.com/maps/documentation/javascript/geolocation, https://developers.google.com/maps/documentation/geolocation/overview
  //and the code snippets provided by VS code"
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (error) => {
          console.warn("Geolocation failed, using default:", error);
        }
      );
    }
    //The empty [] at the end means that this code will only run once when the use first renders the map
  }, []);

    //This code grabs each non-null unique sub-type of location from each of the API's, this was made with help by asking GPT "For a filter, how do I ensure I only get one of every non-null subtype
    // from Accommodation_Type, Principal_type, Facility_Type_Installation, and the Label_e_5k_less, Label_e_20k_5k, Label_e_100k_20k, Label_e_100k_plus"
    //The Boolean removes any null/undefined/empty values, and new set() ensures only 1 of each subtype appears
    const getUniqueSubTypes = (data, property) => {
      const values = data.map(f => f.properties?.[property]).filter(Boolean);
      return [...new Set(values)];
    };

  //Pulling the API's urls rather than hardcoding the files into the system allows for cleaner integration and ensures the latest versions of the API's are pulled, as some are updated weekly
  //This was written with help from ChatGPT when asked "How do I integrate these GEOJson api's into the google map api?"
  useEffect(() => {
    async function loadData() {
      const urls = [
        //National park urls in order - POI - Place name - Facilities - Trails - Accommodations
        "https://opendata.arcgis.com/datasets/dff0acc0f20c4666a253860f6444bb43_0.geojson",
        "https://opendata.arcgis.com/datasets/1769ca13cd044206ba59aa1b0bc84356_0.geojson",
        "https://opendata.arcgis.com/datasets/28b55decfac848c782819b1706e58aa1_0.geojson",
        "https://opendata.arcgis.com/datasets/76e8ea9ddd5b4a67862b57bd450810ce_0.geojson",
        "https://opendata.arcgis.com/datasets/85d09f00b6454413bd51dea2846d9d98_0.geojson"
      ];

      try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const datasets = await Promise.all(responses.map(r => r.json()));

        const allPois = datasets.flatMap((data, datasetIndex) =>
          data.features
          .filter(f => f.geometry?.coordinates?.length === 2 &&
            //This line filters out any POIs without either english or french names and only shows 5k_less trails by default
            (f.properties?.Name_e || f.properties?.Nom_f) &&
            (f.properties?.Label_e_5k_less))
          .map((f, idx) => ({
            //${} inserts the value of a variable/expression into the string
            id: f.id || `${datasetIndex}-${idx}`,
            name: f.properties?.Name_e || f.properties?.Nom_f || "Unnamed POI",
            description: f.properties?.Description || f.properties?.description || "No description",
            location: {
              lat: parseFloat(f.geometry.coordinates[1]),
              lng: parseFloat(f.geometry.coordinates[0])
            },
            properties: f.properties,
            reviews: []
          }))
        );

        setPois(allPois);
      } catch (err) {
        console.error("Error loading datasets:", err);
      }

      //The following code extracts the unique sub-types for use in the front-end filter and was made with the help of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set,
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter, and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
      const accommodationTypes = getUniqueSubTypes(allPois, 'Accommodation_Type');
      const principalTypes = getUniqueSubTypes(allPois, 'Principal_type');
      const facilityTypes = getUniqueSubTypes(allPois, 'Facility_Type_Installation');
      // This code is the same but for trail distances
      const trailDistanceFields = ['Label_e_5k_less', 'Label_e_20k_5k', 'Label_e_100k_20k', 'Label_e_100k_plus'];
      const trailDistance = trailDistanceFields.flatMap(field => getUniqueSubTypes(allPois, field));
      
      setUniqueTypes({
        Accommodation_Type: accommodationTypes,
        Principal_type: principalTypes,
        Facility_Type_Installation: facilityTypes,
        TrailDistance: trailDistance
      });
    }

    loadData();
  }, [setUniqueTypes]);

  //This code was made with help from gpt 
  // after having gpt check the code for bugs and having it ask if I wanted to have the markers place dynamicaly based on the filter settings and me responding "Doesn't it already do that?"
  const filteredPois = filters.length
  ? pois.filter(poi =>
    filters.some(f =>
      poi.properties?.Accommodation_Type === f ||
      poi.properties?.Principal_type === f ||
      poi.properties?.Facility_Type_Installation === f ||
      ['Label_e_5k_less', 'Label_e_20k_5k', 'Label_e_100k_20k', 'Label_e_100k_plus'].some(label => poi.properties?.[label] === f)
    )
  )
  :pois;

    //https://developers.google.com/maps/documentation/routes/compute-route-directions
    async function computeRoute({origin, destination, travelMode = "DRIVE"}) {
       try {
        const response = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: "POST",
            headers: {
              //https://cloud.google.com/docs/authentication/api-keys-use#node.js
              "Content-Type": "application/json",
              "X-Goog-Api-Key":"AIzaSyDDrM5Er5z9ZF0qWdP4QLDEcgpfqGdgwBI",
              "X-Goog-FieldMask":"routes.distanceMeters,routes.duration,routes.polyline.encodedPolyline",
            },
            body: JSON.stringify({
              origin: {location:{ latLng: origin}},
              destination: {location: { latLng: destination}},
              travelMode,
            }),
          }
        );
        
        const data = await response.json();
        
        if (!response.ok){
          throw new Error(data.error?.message || "Failed to fetch route");}
          
          const route = data.routes[0];
          const polyline = route.polyline.encodedPolyline;
          //As seen here https://developers.google.com/maps/documentation/routes/compute_route_directions google maps api uses meters for distance
          //this ensures the distance is instead mesured in kilometers to 2 decimal places
          const distance = (route.distanceMeters / 1000).toFixed(2);
          const duration = route.duration;
          routeData = {polyline, distance, duration};

          return {polyline, distance, duration};
        } catch (error) {
          console.error("There was an error when computing a route:", error);
          return null;
        }}
        
        return (
        <div>
          <div style={{width:'100%', height:'700px'}}>
            <APIProvider apiKey="AIzaSyDDrM5Er5z9ZF0qWdP4QLDEcgpfqGdgwBI">
              <Map
              center={userLocation}
              defaultZoom={10}
              mapId='456dc2bedf64a06c67cc63ea'>
                
                {filteredPois
                .filter(poi => !isNaN(poi.location.lat) && !isNaN(poi.location.lng))
                .map(poi => (
                <AdvancedMarker
                key={poi.id}
                position={poi.location}
                onClick={() => {setSelectedPOI(poi);
                  viewParkDetails?.(poi);
                }}
                />
              ))}
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}

export default MapFunction;
