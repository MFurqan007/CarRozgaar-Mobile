// "use client"
// import React, { useState, useEffect } from 'react';
// import { GoogleMap, Marker, Polyline, useJsApiLoader, DistanceMatrixService } from '@react-google-maps/api';

// const containerStyle = {
//   width: '100%',
//   height: '400px'
// };

// const center = {
//   lat: 10,
//   lng: 10
// };

// const predefinedLocations = [
//   { lat: 10.01, lng: 10.01, name: "Location 1" },
//   { lat: 10.02, lng: 10.02, name: "Location 2" },
//   // Add more predefined locations here
// ];

// const proximityThreshold = 0.05; // in degrees, roughly 50 meters

// const MapComponent = () => {
//   const { isLoaded } = useJsApiLoader({
//     id: 'google-map-script',
//     googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`,
//     libraries: ['places']
//   });

//   const [path, setPath] = useState([]);
//   const [startLocation, setStartLocation] = useState(null);
//   const [endLocation, setEndLocation] = useState(null);
//   const [distance, setDistance] = useState('');
//   const [duration, setDuration] = useState('');
//   const [visitedLocations, setVisitedLocations] = useState([]);
//   const [tripStarted, setTripStarted] = useState(false);
//   const [startAddress, setStartAddress] = useState('');
//   const [endAddress, setEndAddress] = useState('');
//   const [map, setMap] = useState(null);

//   let watchId;

//   const reverseGeocode = (geocoder, location, setLocationName) => {
//     geocoder.geocode({ 'location': location }, function(results, status) {
//         if (status === 'OK') {
//             if (results[0]) {
//                 console.log('Address:', results[0].formatted_address);
//                 setLocationName(results[0].formatted_address); // Update state or handle the address string as needed
//             } else {
//                 console.error('No results found');
//             }
//         } else {
//             console.error('Geocoder failed due to: ' + status);
//         }
//     });
// };

// useEffect(() => {
//   if (!isLoaded) {
//     return; // Do not proceed if Google Maps API has not loaded
//   }

//   const geocoder = new google.maps.Geocoder();

//   if (startLocation) {
//     geocoder.geocode({ location: startLocation }, (results, status) => {
//       if (status === 'OK') {
//         if (results[0]) {
//           console.log("start address converted")
//           setStartAddress(results[0].formatted_address);
//         } else {
//           console.log('No address found for start location');
//         }
//       } else {
//         console.error('Geocoder failed due to: ' + status);
//       }
//     });
//   }

//   if (endLocation) {
//     geocoder.geocode({ location: endLocation }, (results, status) => {
//       if (status === 'OK') {
//         if (results[0]) {
//           console.log("end address converted")
//           setEndAddress(results[0].formatted_address);
//         } else {
//           console.log('No address found for end location');
//         }
//       } else {
//         console.error('Geocoder failed due to: ' + status);
//       }
//     });
//   }
// }, [startLocation, endLocation]); // Depend on startLocation and endLocation

// useEffect(() => {
//   if (map && startLocation) {
//     // Center the map on the new start location
//     map.panTo(startLocation);
//   }
// }, [startLocation, map]);


//   useEffect(() => {
//     // Check for visited predefined locations whenever the path updates
//     const checkVisitedLocations = () => {
//       const visited = predefinedLocations.filter(loc => 
//         path.some(pathPoint => 
//           Math.abs(pathPoint.lat - loc.lat) < proximityThreshold && 
//           Math.abs(pathPoint.lng - loc.lng) < proximityThreshold
//         )
//       );
//       setVisitedLocations(visited);
//     };

//     checkVisitedLocations();
//   }, [path]);

//   // const startGeoTracking = () => {
//   //   // Check permission status
//   //   navigator.permissions.query({ name: 'geolocation' }).then(function(permissionStatus) {
//   //     console.log('Geolocation permission state is:', permissionStatus.state);
  
//   //     // Handle each permission state
//   //     if (permissionStatus.state === 'granted') {
//   //       // Permission already granted, start tracking directly
//   //       startTracking();
//   //     } else if (permissionStatus.state === 'prompt') {
//   //       // Permission not yet granted or denied, try to start tracking and let the browser ask the user
//   //       startTracking();
//   //     } else if (permissionStatus.state === 'denied') {
//   //       // Permission was denied, alert the user that location access is required
//   //       alert('Location access was denied. Please allow location access to use this feature.');
//   //     }
//   //   });
//   // };

//   const startTracking = () => {
//     if (navigator.geolocation) {
//       watchId = navigator.geolocation.watchPosition(position => {
//         const { latitude, longitude } = position.coords;
//         setPath(prevPath => [...prevPath, { lat: latitude, lng: longitude }]);
//         if (!startLocation) {
//           setStartLocation({ lat: latitude, lng: longitude }); 
//         }
//       }, (error) => {
//         console.log(error);
//       }, {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0
//       });
//       setTripStarted(true);
//       // if (isLoaded) {
//       //   const geocoder = new google.maps.Geocoder();
//       //   reverseGeocode(geocoder, startLocation, setStartAddress);
//       // }
//       // reverseGeocode(startLocation, setStartAddress);
//     }
//   };

//   const stopTracking = () => {
//     navigator.geolocation.clearWatch(watchId);
//     const lastPathPoint = path[path.length - 1];
//     setEndLocation(lastPathPoint);
//     setTripStarted(false);

//     // Calculate distance and time using DistanceMatrixService here
//     // This example assumes you will trigger this calculation separately
//     calculateDistanceAndTime(startLocation, lastPathPoint);
//     // if (isLoaded) {
//     //   const geocoder = new google.maps.Geocoder();
//     //   reverseGeocode(geocoder, endLocation, setEndAddress);
//     // }
//     // reverseGeocode(endLocation, setEndAddress);
//   };

//   const calculateDistanceAndTime = (startLoc, endLoc) => {
//     if (!startLoc || !endLoc) return;

//     const service = new google.maps.DistanceMatrixService();
//     service.getDistanceMatrix(
//       {
//         origins: [startLoc],
//         destinations: [endLoc],
//         travelMode: 'DRIVING',
//       },
//       (response, status) => {
//         if (status === 'OK') {
//           const results = response.rows[0].elements[0];
//           setDistance(results.distance.text);
//           setDuration(results.duration.text);
//         }
//       }
//     );
//   };

//   return isLoaded ? (
//     <div>
//       <GoogleMap
//         mapContainerStyle={containerStyle}
//         center={center}
//         zoom={10}
//         onLoad={setMap}
//       >
//           {startLocation && (
//             <Marker
//               position={startLocation}
//               label="Start"
//             />
//           )}
//         {path && <Polyline path={path} options={{ strokeColor: "#FF0000" }} />}
//       </GoogleMap>
//       <button onClick={!tripStarted ? startTracking : stopTracking}>
//         {!tripStarted ? 'Start' : 'Stop'}
//       </button>
//       <div>
//         {startLocation && <p>Start Location: {`${startLocation.lat}, ${startLocation.lng}`}</p>}
//         {startAddress && <p>Start Address: {startAddress}</p>}
//         {endLocation && <p>End Location: {`${endLocation.lat}, ${endLocation.lng}`}</p>}
//         {endAddress && <p>End Address: {endAddress}</p>}
//         {distance && <p>Distance: {distance}</p>}
//         {duration && <p>Time: {duration}</p>}
//         <h3>Visited Locations:</h3>
//         {visitedLocations.length > 0 ? (
//           <ul>
//             {visitedLocations.map((loc, index) => (
//               <li key={index}>{loc.name}</li>
//             ))}
//           </ul>
//         ) : (
//           <p>No predefined locations visited.</p>
//         )}
//       </div>
//       {/* This part is for demonstration. In a real app, you should handle API calls to your backend here */}
//       {/* {tripEnded && <button onClick={saveTripDetails}>Save Trip Details</button>} */}
//     </div>
//   ) : <></>;
// };

// export default MapComponent;

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


// Updates
"use client"
import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, Polyline, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 10,
  lng: 10
};

const locations = ["F11 Markaz, Islamabad","Pha Flats Street 97 g-11/3, Islamabad","F10 Markaz, Islamabad", "G9 Markaz, Islamabad", "F7 Markaz, Islamabad"];

const MapComponent = () => {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: `${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}`,
    libraries: ['places']
  });

  const youAreHereIcon = {
    url: 'https://maps.gstatic.com/mapfiles/ms2/micons/blue.png', // Blue marker
  };

  const startIcon = {
    url: 'https://maps.gstatic.com/mapfiles/ms2/micons/green.png', // Green marker
  };

  const endIcon = {
    url: 'https://maps.gstatic.com/mapfiles/ms2/micons/red.png', // Red marker
  };

  const locationIcon = {
    url: 'https://maps.gstatic.com/mapfiles/ms2/micons/purple.png', // Yellow marker
  };

  const [startPosition, setStartPosition] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [path, setPath] = useState([]);
  const [hotspotmarkers, setHotspotMarkers] = useState([]);
  const [startAddress, setStartAddress] = useState('');
  const [endAddress, setEndAddress] = useState('');
  const [watchId, setWatchId] = useState(null);
  const [showSubmit, setShowSubmit] = useState(false);

  const geocodeLocations = async () => {
    if (!window.google) return; // Check if Google Maps API is loaded
    const geocoder = new window.google.maps.Geocoder();
    const newMarkers = [];
  
    for (const location of locations) {
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === window.google.maps.GeocoderStatus.OK) {
          if (results[0]) {
            const { location } = results[0].geometry;
            newMarkers.push({
              lat: location.lat(),
              lng: location.lng(),
              label: results[0].formatted_address, // Corrected label assignment
            });
            // Update the state inside the callback
            setHotspotMarkers((currentMarkers) => [
              ...currentMarkers,
              {
                lat: location.lat(),
                lng: location.lng(),
                label: results[0].formatted_address,
              },
            ]);
          } else {
            console.error('No results found for:', location);
          }
        } else {
          console.error('Geocoder failed due to:', status);
        }
      });
    }
  };
  


  // Convert coordinates to a place name
  const reverseGeocode = async (location) => {
    const geocoder = new window.google.maps.Geocoder();
    return new Promise((resolve, reject) => {
      geocoder.geocode({ 'location': location }, (results, status) => {
        if (status === 'OK') {
          if (results[0]) {
            resolve(results[0].formatted_address);
          } else {
            reject('No results found');
          }
        } else {
          reject('Geocoder failed due to: ' + status);
        }
      });
    });
  };

  const setStart = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const startPos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setStartPosition(startPos);
        setCurrentPosition(startPos); // Initially, current position is the same as start position

        // Optionally, convert start position to address
        const address = await reverseGeocode(startPos);
        setStartAddress(address);
      }, (error) => {
        console.error("Error Getting Start Position", error);
      }, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      });
    }
  };

  useEffect(() => {
    const startTracking = () => {
      if (navigator.geolocation && startPosition && watchId === null) {
        const id = navigator.geolocation.watchPosition((position) => {
          const newPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(newPos);
          setPath(prevPath => [...prevPath, newPos]);
        }, (error) => {
          console.error("Error While Tracking", error);
        }, {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        });
  
        setWatchId(id); // Save watchId to state to manage tracking status
      }
    };
  
    if (startPosition) {
      startTracking();
    }
  
    // Cleanup function to stop tracking when component unmounts or before restarting
    // return () => {
    //   if (watchId !== null) {
    //     navigator.geolocation.clearWatch(watchId);
    //   }
    // };
  }, [startPosition]); // 

  // Stop tracking
  const stopTracking = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      if (path.length > 0) {
        const address = await reverseGeocode(path[path.length - 1]);
        setEndAddress(address);
      }
      setShowSubmit(true); 
    }
  };
  const calculateRevenue = (distance, time, passedHotspot) => {
    const baseRatePerKm = 1; // Base rate per kilometer
    const timeRatePerMinute = 0.1; // Rate per minute of travel time
    let bonusAmount = 0; // Bonus amount for passing through hotspot
    let revenue = distance * baseRatePerKm + time * timeRatePerMinute;
    if (passedHotspot) {
      bonusAmount = 5.0;
      revenue += bonusAmount;
    }
    return revenue;
  };

  const isWithinRadius = (path, marker, radius) => {
    const hotspotLatLng = new google.maps.LatLng(marker.lat, marker.lng);
    return path.some(point => {
      const pointLatLng = new google.maps.LatLng(point.lat, point.lng);
      return google.maps.geometry.spherical.computeDistanceBetween(pointLatLng, hotspotLatLng) < radius;
    });
  };

  const handleSubmit = () => {
    if (!startPosition || !currentPosition) {
      alert("Start or end position is missing.");
      return;
    }
  
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [startPosition],
        destinations: [currentPosition],
        travelMode: 'DRIVING',
      },
      (response, status) => {
        if (status === 'OK') {
          const results = response.rows[0].elements[0];
          const distance = results.distance.text;
          const duration = results.duration.text;
  
          let passedHotspot = false;
          hotspotmarkers.forEach((marker) => {
            if (isWithinRadius(path, marker, 500)) {
              passedHotspot = true;
            }
          });

          const revenue = calculateRevenue(distance, duration, passedHotspot);

          alert(`Distance: ${results.distance.text}, Time: ${results.duration.text}, Start: ${startAddress}, End: ${endAddress}, Revenue: ${revenue}`);
  
          // Reset state here
          resetState();
        } else {
          console.error('Distance Matrix request failed due to ' + status);
        }
      }
    );
  };
  
  const resetState = () => {
    setStartPosition(null);
    setCurrentPosition(null);
    setPath([]);
    setShowSubmit(false);
    // Re-fetch the current location and set it as the center of the map
    getCurrentLocation();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      }, (error) => {
        console.error("Error Getting Your Position", error);
      }, {
        enableHighAccuracy: true, // Request higher accuracy
        timeout: 10000, // Maximum time allowed to try obtaining a location (in milliseconds)
        maximumAge: 0 // Maximum age of a cached location that is acceptable to return (in milliseconds)
      });
    }
  };
  // Get current position once on component mount
  useEffect(() => {
    getCurrentLocation()
  }, []);

  useEffect(() => {
    if (isLoaded) {
      geocodeLocations();
    }
  }, [isLoaded]);

  window.addEventListener('beforeunload', function (e) {
    // Cancel the event
    e.preventDefault();
    // Chrome requires returnValue to be set
    e.returnValue = '';
  });

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentPosition || center}
        zoom={10}
      >
        {currentPosition && (
          <Marker position={currentPosition} label="C" icon={youAreHereIcon}/>
        )}
        {path.length > 0 && (
          <>
            <Marker position={path[0]} label="Start" icon={startIcon}/>
            <Marker position={path[path.length - 1]} label="End" icon={endIcon} />
            <Polyline path={path} options={{ strokeColor: "#FF0000" }} />
          </>
        )}
        {hotspotmarkers.map((marker, index) => (
          <Marker key={index} position={{ lat: marker.lat, lng: marker.lng }} label={"H"} icon={locationIcon}/>
        ))}
      </GoogleMap>
      <div className='py-2 w-full border-2 border-black px-4 flex justify-between'>
        <button className='btn bg-red-300' onClick={setStart}>Start</button>
        <button className='btn bg-blue-300' onClick={stopTracking}>Stop</button>
      </div>
      {showSubmit && <button onClick={handleSubmit} className='btn btn-wide mt-4'>Submit</button>}
      <div>
        <p>Start: {startAddress}</p>
        <p>End: {endAddress}</p>
        <h3>Path Coordinates:</h3>
        <ul>
          {path.map((coord, index) => (
            <li key={index}>{`Lat: ${coord.lat}, Lng: ${coord.lng}`}</li>
          ))}
        </ul>
      </div>
    </div>
  ) : <></>;
};

export default MapComponent;

