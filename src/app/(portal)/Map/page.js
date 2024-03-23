"use client"
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader, DistanceMatrixService } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 10,
  lng: 10
};

const predefinedLocations = [
  { lat: 10.01, lng: 10.01, name: "Location 1" },
  { lat: 10.02, lng: 10.02, name: "Location 2" },
  // Add more predefined locations here
];

const proximityThreshold = 0.05; // in degrees, roughly 50 meters

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`,
    libraries: ['places']
  });

  const [path, setPath] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [distance, setDistance] = useState('');
  const [duration, setDuration] = useState('');
  const [visitedLocations, setVisitedLocations] = useState([]);
  const [tripStarted, setTripStarted] = useState(false);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [map, setMap] = useState(null);

  let watchId;

  const reverseGeocode = (geocoder, location, setLocationName) => {
    geocoder.geocode({ 'location': location }, function(results, status) {
        if (status === 'OK') {
            if (results[0]) {
                console.log('Address:', results[0].formatted_address);
                setLocationName(results[0].formatted_address); // Update state or handle the address string as needed
            } else {
                console.error('No results found');
            }
        } else {
            console.error('Geocoder failed due to: ' + status);
        }
    });
};

useEffect(() => {
  if (!isLoaded) {
    return; // Do not proceed if Google Maps API has not loaded
  }

  const geocoder = new google.maps.Geocoder();

  if (startLocation) {
    geocoder.geocode({ location: startLocation }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log("start address converted")
          setStartAddress(results[0].formatted_address);
        } else {
          console.log('No address found for start location');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }

  if (endLocation) {
    geocoder.geocode({ location: endLocation }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          console.log("end address converted")
          setEndAddress(results[0].formatted_address);
        } else {
          console.log('No address found for end location');
        }
      } else {
        console.error('Geocoder failed due to: ' + status);
      }
    });
  }
}, [startLocation, endLocation]); // Depend on startLocation and endLocation

useEffect(() => {
  if (map && startLocation) {
    // Center the map on the new start location
    map.panTo(startLocation);
  }
}, [startLocation, map]);


  useEffect(() => {
    // Check for visited predefined locations whenever the path updates
    const checkVisitedLocations = () => {
      const visited = predefinedLocations.filter(loc => 
        path.some(pathPoint => 
          Math.abs(pathPoint.lat - loc.lat) < proximityThreshold && 
          Math.abs(pathPoint.lng - loc.lng) < proximityThreshold
        )
      );
      setVisitedLocations(visited);
    };

    checkVisitedLocations();
  }, [path]);

  // const startGeoTracking = () => {
  //   // Check permission status
  //   navigator.permissions.query({ name: 'geolocation' }).then(function(permissionStatus) {
  //     console.log('Geolocation permission state is:', permissionStatus.state);
  
  //     // Handle each permission state
  //     if (permissionStatus.state === 'granted') {
  //       // Permission already granted, start tracking directly
  //       startTracking();
  //     } else if (permissionStatus.state === 'prompt') {
  //       // Permission not yet granted or denied, try to start tracking and let the browser ask the user
  //       startTracking();
  //     } else if (permissionStatus.state === 'denied') {
  //       // Permission was denied, alert the user that location access is required
  //       alert('Location access was denied. Please allow location access to use this feature.');
  //     }
  //   });
  // };

  const startTracking = () => {
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(position => {
        const { latitude, longitude } = position.coords;
        setPath(prevPath => [...prevPath, { lat: latitude, lng: longitude }]);
        if (!startLocation) {
          setStartLocation({ lat: latitude, lng: longitude }); 
        }
      }, (error) => {
        console.log(error);
      }, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
      setTripStarted(true);
      // if (isLoaded) {
      //   const geocoder = new google.maps.Geocoder();
      //   reverseGeocode(geocoder, startLocation, setStartAddress);
      // }
      // reverseGeocode(startLocation, setStartAddress);
    }
  };

  const stopTracking = () => {
    navigator.geolocation.clearWatch(watchId);
    const lastPathPoint = path[path.length - 1];
    setEndLocation(lastPathPoint);
    setTripStarted(false);

    // Calculate distance and time using DistanceMatrixService here
    // This example assumes you will trigger this calculation separately
    calculateDistanceAndTime(startLocation, lastPathPoint);
    // if (isLoaded) {
    //   const geocoder = new google.maps.Geocoder();
    //   reverseGeocode(geocoder, endLocation, setEndAddress);
    // }
    // reverseGeocode(endLocation, setEndAddress);
  };

  const calculateDistanceAndTime = (startLoc, endLoc) => {
    if (!startLoc || !endLoc) return;

    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [startLoc],
        destinations: [endLoc],
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          const results = response.rows[0].elements[0];
          setDistance(results.distance.text);
          setDuration(results.duration.text);
        }
      }
    );
  };

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
        onLoad={setMap}
      >
          {startLocation && (
            <Marker
              position={startLocation}
              label="Start"
            />
          )}
        {path && <Polyline path={path} options={{ strokeColor: "#FF0000" }} />}
      </GoogleMap>
      <button onClick={!tripStarted ? startTracking : stopTracking}>
        {!tripStarted ? 'Start' : 'Stop'}
      </button>
      <div>
        {startLocation && <p>Start Location: {`${startLocation.lat}, ${startLocation.lng}`}</p>}
        {startAddress && <p>Start Address: {startAddress}</p>}
        {endLocation && <p>End Location: {`${endLocation.lat}, ${endLocation.lng}`}</p>}
        {endAddress && <p>End Address: {endAddress}</p>}
        {distance && <p>Distance: {distance}</p>}
        {duration && <p>Time: {duration}</p>}
        <h3>Visited Locations:</h3>
        {visitedLocations.length > 0 ? (
          <ul>
            {visitedLocations.map((loc, index) => (
              <li key={index}>{loc.name}</li>
            ))}
          </ul>
        ) : (
          <p>No predefined locations visited.</p>
        )}
      </div>
      {/* This part is for demonstration. In a real app, you should handle API calls to your backend here */}
      {/* {tripEnded && <button onClick={saveTripDetails}>Save Trip Details</button>} */}
    </div>
  ) : <></>;
};

export default MapComponent;

// import React from 'react'

// export default function page() {
//   return (
//     <div>page</div>
//   )
// }

// "use client"
// import React, {useState} from 'react';
// import { GoogleMap, LoadScript, Marker  } from "@react-google-maps/api";

// const MapComponent = () => {
//   const [currentLocation, setCurrentLocation] = useState({lat: -34.397, lng: 150.644}); // Default location
//   const [markers, setMarkers] = useState([]);
//   const mapContainerStyle = {
//     width: '100vw',
//     height: '50vh',
//   };
//   const center = {
//     lat: -34.397,
//     lng: 150.644,
//   };
//   const zoom = 8;

  
//   // Function to get the current location
//   const locateCurrentPosition = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(position => {
//         const currentPos = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setCurrentLocation(currentPos);
//         setMarkers([...markers, currentPos]); // Update the map center
//       }, (error) => {
//         console.error("Error Getting Your Position", error);
//         // Handle location error (e.g., user denied location access)
//       });
//     } else {
//       // Browser doesn't support Geolocation
//       alert("Your browser does not support Geolocation!");
//     }
//   };

//   return (
//     <div>
//       <LoadScript googleMapsApiKey= {process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
//         <GoogleMap
//           mapContainerStyle={mapContainerStyle}
//           center={currentLocation}
//           zoom={zoom}
//         >
//           {markers.map((location, index) => (
//             <Marker key={index} position={location} />
//           ))}
//           {/* Add markers or other components here */}
//         </GoogleMap>
//       </LoadScript>
//       <button onClick={locateCurrentPosition} className='btn bg-blue-400'>Start</button>
//     </div>
//   );
// }

// export default MapComponent;


// import React, { useState, useEffect } from 'react';
// import { GoogleMap, LoadScript, Marker, Polyline } from "@react-google-maps/api";

// const MapComponent = () => {
//   const [currentLocation, setCurrentLocation] = useState({ lat: -34.397, lng: 150.644 });
//   const [markers, setMarkers] = useState([]);
//   const [path, setPath] = useState([]);
//   const [tripStarted, setTripStarted] = useState(false);
  
//   // New state hooks for additional functionalities
//   const [startLocation, setStartLocation] = useState(null);
//   const [endLocation, setEndLocation] = useState(null);
//   // Assume more state hooks here for addresses, distance, duration, etc.

//   const mapContainerStyle = { width: '100vw', height: '50vh' };
//   const zoom = 8;
  
//   // Function to start tracking
//   const startTracking = () => {
//     setTripStarted(true);
//     if (navigator.geolocation) {
//       navigator.geolocation.getCurrentPosition(position => {
//         const newPos = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setStartLocation(newPos);
//         setCurrentLocation(newPos);
//         setMarkers(prev => [...prev, newPos]);
//         setPath(prev => [...prev, newPos]);
//         // Additional logic to track path continuously goes here
//       }, (error) => console.error("Error Getting Your Position", error));
//     } else {
//       alert("Your browser does not support Geolocation!");
//     }
//   };

//   // Simplified function to stop tracking (for brevity)
//   const stopTracking = () => {
//     setTripStarted(false);
//     // Logic to stop tracking and set end location
//   };

//   // More functionality (reverse geocoding, distance and duration calculation, etc.) would be added here
  
//   return (
//     <div>
//       <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}>
//         <GoogleMap
//           mapContainerStyle={mapContainerStyle}
//           center={currentLocation}
//           zoom={zoom}
//         >
//           {markers.map((location, index) => (
//             <Marker key={index} position={location} />
//           ))}
//           <Polyline path={path} options={{ strokeColor: "#FF0000" }} />
//           {/* Additional map components like Marker for start/end locations */}
//         </GoogleMap>
//       </LoadScript>
//       <button onClick={!tripStarted ? startTracking : stopTracking} className='btn bg-blue-400'>
//         {!tripStarted ? 'Start' : 'Stop'}
//       </button>
//     </div>
//   );
// };

// export default MapComponent;