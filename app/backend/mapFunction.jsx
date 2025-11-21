//This file contains code that pulls the google maps api
//This was made with help from this site: https://developers.google.com/codelabs/maps-platform/maps-platform-101-react-js#1 and asking Chatgpt to simplify and breakdown its contents for me
import React, {useState, useEffect, useRef} from 'react';
import {APIProvider, Map as GoogleMap, AdvancedMarker, useMap} from '@vis.gl/react-google-maps';
const uniqueArray = (arr) => [...new Set(arr)];

//This code was made with help from https://developers.google.com/maps/documentation/javascript/events#map_events
//https://developers-dot-devsite-v2-prod.appspot.com/maps/documentation/javascript/reference/coordinates#LatLngBounds
//and asking GPT to help me debug my code
function MapContent({filteredPois, setVisiblePois, viewParkDetails}) {
  const map = useMap();
  const [visiblePoisLocal, setVisiblePoisLocal] = useState([]);

  useEffect(() => {
    const updateVisiblePois = () => {
      if (!map) return;
      const bounds = map.getBounds();
      const visible = filteredPois.filter(poi =>
        bounds.contains(new google.maps.LatLng(poi.location.lat, poi.location.lng))
      );
      setVisiblePoisLocal(visible);
    };

    updateVisiblePois();
    const listener = map.addListener('idle', updateVisiblePois);
    return () => google.maps.event.removeListener(listener);
  }, [map, filteredPois, setVisiblePois]);

  return (
    <>
      {visiblePoisLocal.map(poi => (
        <AdvancedMarker
        key={poi.id}
        position={poi.location}
        onClick={() => viewParkDetails?.(poi)} />
      ))}
    </>
  );
}
//https://developers.google.com/maps/documentation/routes/compute_route_directions#node.js, https://developers.google.com/maps/documentation/javascript/examples/directions-travel-modes
//https://visgl.github.io/react-google-maps/examples/directions
function RouteHandler({computeRouteRef, travelMode, userLocation, onRouteSummary}) {
  const map = useMap();
  const directionsRendererRef = useRef(null);
  const [routePois, setRoutePois] = useState([]);

  useEffect(() => {
    if (!map) return;

    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new google.maps.DirectionsRenderer({
        suppressMarkers: false,
        preserveViewport: true,
      });
      directionsRendererRef.current.setMap(map);
    }

    const directionsService = new google.maps.DirectionsService();

    if (computeRouteRef) {
      computeRouteRef.current = (poiInput, mode = travelMode) => {
        const poiArray = Array.isArray(poiInput) ? poiInput : [poiInput];

        //This was written with help from gpt after I asked it to help me
        //make my code capable of routing both single and multi leg routes
        const origin = {lat: userLocation.lat, lng: userLocation.lng};
        const destination = poiArray[poiArray.length -1].location;
        const waypoints = poiArray.slice(0, -1).map(poi => ({
          location: poi.location,
          stopover: true
        }));

        return new Promise((resolve, reject) => {
          const directionsService = new google.maps.DirectionsService();
          directionsService.route({
            origin,
            destination,
            //https://developers.google.com/maps/documentation/javascript/legacy/directions#Waypoints
            waypoints,
            travelMode: google.maps.TravelMode[mode?.toUpperCase()],
            },
            (result, status) => {
              if (status === "OK") {
                directionsRendererRef.current.setDirections(result);
                
                const legs = result.routes[0].legs.map((leg) => ({
                  start: leg.start_address,
                  end: leg.end_address,
                  distanceText: leg.distance.text,
                  durationText: leg.duration.text,
                  distanceValue: leg.distance.value,
                  durationValue: leg.duration.value
                }));

                const totalDistance = legs.reduce((sum, leg) => sum + leg.distanceValue, 0);
                const totalDuration = legs.reduce((sum, leg) => sum + leg.durationValue, 0);
                
                if (typeof onRouteSummary === "function") {
                  onRouteSummary({legs, totalDistance, totalDuration});
                }

                resolve({
                  distance: totalDistance / 1000,
                  duration: totalDuration / 60,
                });
              } else {
                reject(status);
              }
            }
          );
        });
      };
    }
  }, [map, computeRouteRef, travelMode, userLocation]);

  return null;
}

function normalizeOption(str) {
  if (typeof str !== "string") return str;
  const parts = [
    ...new Set(
      str
        .split("/")
        .map((s) => s.trim())
        .filter(Boolean)
    ),
  ];
  return parts.join(" / ");
}

function MapFunction({filters=[], setUniqueTypes, viewParkDetails, computeRouteRef, travelMode, favorites, onRouteSummary}) {
  //The info panel code was made with help from https://developers.google.com/maps/documentation/javascript/infowindows#maps_infowindow_simple-javascript
  //and asking Chatgpt "how can I make the sidepanel pull the info of the selected POI?"
  const [pois, setPois] = useState([]);
  const [selectedPOI, setSelectedPOI] = useState(null);
  //This code gets the users location to start the map at, and if the location is not found, it will start the map at the useState location
  const [userLocation, setUserLocation] = useState({lat: 52.8866, lng:-118.10222});
  const [routeData, setRouteData] = useState(null);
  const favoriteFilterSelected = filters.includes("Favorites");
  const nonFavoriteFilters = filters.filter(f => f !== "Favorites");

  //https://developers.google.com/maps/documentation/utilities/polylineutility & https://developers.google.com/maps/documentation/javascript/reference/polygon#Polyline
  const mapRef = useRef(null);
  const polylineRef = useRef(null);

      //This code ensures each location grabbed has a unique name to help avaiod overcrowding of markers
    const getUniquePOINames = (pois) => {
      const seen = new Set();
      return pois.filter(poi => {
        if (seen.has(poi.name)) return false;
        seen.add(poi.name);                   
        return true;
      });
    };

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
    //from Accommodation_Type, Principal_type, Facility_Type_Installation, and the Label_e_5k_less, Label_e_20k_5k, Label_e_100k_20k, Label_e_100k_plus"
    //The Boolean removes any null/undefined/empty values, and new set() ensures only 1 of each subtype appears
    const getUniqueSubTypes = (data, property) => {
      const values = data.map(f => f.properties?.[property]).filter(Boolean);
      return [...new Set(values)];
    };

    console.log("MapFunction props:", {filters, setUniqueTypes, viewParkDetails});
        
        const directionsServiceRef = useRef(null);
        const directionsRendererRef = useRef(null);
        
        useEffect(() => {
          if (!mapRef.current?.map) return;
          const map = mapRef.current.map;
          
          directionsServiceRef.current = new google.maps.DirectionsService();
          directionsRendererRef.current = new google.maps.DirectionsRenderer();
          directionsRendererRef.current.setMap(map);

          //if (computeRouteRef){
          //  computeRouteRef.current = computeRoute;
          //}
        }, [mapRef.current?.map]);

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
        "https://opendata.arcgis.com/datasets/85d09f00b6454413bd51dea2846d9d98_0.geojson",
        //Provincial park urls in order - Saskatchewan
        "https://geohub.saskatchewan.ca/api/download/v1/items/2dcf3ee92e2c4d25a109eeac74f085af/geojson?layers=4"
      ];

      //https://developer.mozilla.org/en-US/docs/Web/API/Window/fetch, https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
      //https://developers.google.com/maps/documentation/javascript/best-practices#optimize-performance
      const allPois = [];

      for (const [i, url] of urls.entries()) {
        try {
          console.log(`Fetching dataset ${i + 1}/${urls.length}...`);
          const response = await fetch(url, { signal: AbortSignal.timeout(25000) }); //This will cause any pull longer than 25 seconds to abort
          if (!response.ok) throw new Error(`Failed to load ${url}: ${response.status}`);

          const data = await response.json();
          console.log(`Succesfully loaded dataset ${i + 1}: ${data.features?.length || 0} features`);

          //This code processes a GeoJSON dataset (data.features) to extract valid Points of Interest (POIs).
          //1. It first checks that 'data.features' exists; if not, it defaults to an empty array.
          //2. It filters out invalid entries — only keeping features with valid [longitude, latitude] coordinates
          //and at least one name field (English, French, or fallback label).
          //3. For each valid feature, it constructs a standardized POI object containing:
          //- a unique id (using the feature's own id or a generated one),
          //- a name (from 'Name_e', 'Nom_f', or a fallback "Unnamed POI"),
          //- a description (from available description or URL fields, or a default "No description"),
          //- a location object with numeric lat/lng parsed from the geometry coordinates,
          //- the raw 'properties' object from the source data for future reference,
          //- and an empty 'reviews' array placeholder for user-generated content.
          //The final result is an array of clean, usable POI objects for display or mapping.
          let filteredPois = nonFavoriteFilters.length
          const pois = (data.features || [])
            .filter(f => 
              (f.geometry?.type === "Point" && f.geometry?.coordinates?.length === 2) ||
              (f.geometry?.type === "Polygon" && f.geometry?.coordinates?.[0]?.[0]?.length === 2) &&
              (f.properties?.Name_e || f.properties?.Nom_f || f.properties?.Label_e_5k_less || f.properties?.Lable_e_20k_5k || f.properties?.Label_e_100k_20k || f.properties?.Label_e_100k_plus || f.properties?.PARKNM))
            .map((f, idx) => ({
              id: f.id || `${i}-${idx}`,
              name: f.properties?.Name_e || f.properties?.Nom_f || f.properties.PARKNM || "Unnamed POI",
              description: f.properties?.Description || f.properties?.description || f.properties?.URL_e || "No description",
              location: {
                lat: f.geometry.type === "Polygon"
                ? parseFloat(f.geometry.coordinates[0][0][1])
                : parseFloat(f.geometry.coordinates[1]),
                lng: f.geometry.type === "Polygon"
                ? parseFloat(f.geometry.coordinates[0][0][0])
                : parseFloat(f.geometry.coordinates[0])
              },
              properties: f.properties,
              reviews: []
            }));

          allPois.push(...pois);
          
          const uniquePois = getUniquePOINames(allPois);

          setPois(uniquePois);

          //This adds a small delay to the site to avoid overloading it
          await new Promise(res => setTimeout(res, 1500));
        } catch (err) {
          console.error(`There was an error loading dataset ${i + 1}:`, err);
        }
      }

      console.log(`All datasets loaded: ${allPois.length} POIs`);

      //The following code extracts the unique sub-types for use in the front-end filter and was made with the help of https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set,
      //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter, and https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
      const accommodationTypes = getUniqueSubTypes(allPois, 'Accommodation_Type');
      const conciscodeTypes = getUniqueSubTypes(allPois, "CONCISCODE");
      const principalTypes = getUniqueSubTypes(allPois, 'Principal_type');
      const facilityTypes = getUniqueSubTypes(allPois, 'Facility_Type_Installation');
      const PARKTYPE = getUniqueSubTypes(allPois, 'PARKTYPE');
      //This code is the same but for trail distances
      const trailDistanceFields = ['Label_e_5k_less', 'Label_e_20k_5k', 'Label_e_100k_20k', 'Label_e_100k_plus'];
      const trailDistance = uniqueArray(
        trailDistanceFields.flatMap(field => getUniqueSubTypes(allPois, field))
      );

      if (typeof setUniqueTypes === "function"){
        setUniqueTypes({
          CONCISCODE: uniqueArray(conciscodeTypes),
          Accommodation_Type: uniqueArray(accommodationTypes),
          Principal_type: uniqueArray(principalTypes),
          Facility_Type_Installation: uniqueArray(facilityTypes),
          PARKTYPE: uniqueArray(PARKTYPE),
          TrailDistance: trailDistance
        });
      }}

    loadData();
  }, []);

  //This code was made with help from gpt 
  //after having gpt check the code for bugs and having it ask if I wanted to have the markers place dynamicaly based on the filter settings and me responding "Doesn't it already do that?"
  let filteredPois;

  if (favoriteFilterSelected && nonFavoriteFilters.length === 0) {
    filteredPois = pois.filter(poi => favorites?.includes(poi.id));
  } else {
    filteredPois = nonFavoriteFilters.length
    ? pois.filter(poi =>{
      const poiValues = [
        poi.properties?.Accommodation_Type,
        poi.properties?.Principal_type,
        poi.properties?.Facility_Type_Installation,
        poi.properties?.CONCISCODE,
        poi.properties?.PARKTYPE,
        poi.properties?.Label_e_5k_less,
        poi.properties?.Label_e_20k_5k,
        poi.properties?.Label_e_100k_20k,
        poi.properties?.Label_e_100k_plus
      ].filter(Boolean)
      .flatMap(val => Array.isArray(val) ? val : [val])
      .map(val => normalizeOption(String(val)));

      return nonFavoriteFilters.some(filter => poiValues.includes(filter));
  })
  
  :pois;

   if (favoriteFilterSelected && favorites?.length) {
    const favoritePois = pois.filter(poi => favorites.includes(poi.id));
    const seen = new Set(filteredPois.map(poi => poi.id));
    filteredPois = [
      ...filteredPois,
      ...favoritePois.filter(poi => !seen.has(poi.id))
    ];
  }
}

  //This code de-duplicates markers by id, ensuring that even if a marker is in both Favorites and another filter,
  //the marker will only render once
  if (favoriteFilterSelected && favorites?.length) {
  const favoritePois = pois.filter(poi => favorites.includes(poi.id));
  const combined = [...filteredPois, ...favoritePois];
  filteredPois = Array.from(
    combined.reduce((map, poi) => map.set(poi.id, poi), new Map()).values()
  );
}

  console.log("Filters active:", filters);
  console.log("Number of POIs loaded:", pois.length);
  console.log("Number of POIs shown after filtering:", filteredPois.length);  

    const [routedPOI, setRoutedPOI] = useState(null);

  //This code drops the current route if it is to a location that gets filtered out
  useEffect(() => {
    if (routedPOI && !filteredPois.some(p => p.id === routedPOI.id)) {
      directionsRendererRef.current?.setDirections({ routes: [] });
      setRoutedPOI(null);
    }
  }, [filteredPois, routedPOI]);

        console.log("=== Rendering POIs ===");
        filteredPois.forEach(poi => {
        });

        return (
        <div>
          <div className='h-screen w-full'>
            <APIProvider apiKey="AIzaSyDDrM5Er5z9ZF0qWdP4QLDEcgpfqGdgwBI">
              <GoogleMap
              ref={mapRef}
              defaultCenter={userLocation}
              defaultZoom={10}
              mapId='456dc2bedf64a06c67cc63ea'>

              <MapContent
                filteredPois={filteredPois}
                viewParkDetails={viewParkDetails}
              />
              
              {/*https://visgl.github.io/react-google-maps/docs/api-reference/components/advanced-marker, https://developers.google.com/maps/documentation/javascript/geolocation#maps_map_geolocation-javascript*/}
              <AdvancedMarker
              position={userLocation}
              title="Your Location">
                <div
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'blue',
                  border: '2px solid white',
                }}/>
              </AdvancedMarker>
              <RouteHandler
              computeRouteRef={computeRouteRef}
              travelMode={travelMode}
              userLocation={userLocation}
              onRouteSummary={onRouteSummary}
              />
          </GoogleMap>
        </APIProvider>
      </div>
      
      </div>
  );
}

export default MapFunction;