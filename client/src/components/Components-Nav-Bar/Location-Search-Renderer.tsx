import React, { useState, useEffect } from "react";
import LocationConverter from "./Location-Converter";

const LocationSearchRenderer: React.FC = () => {
  const [currentLocation, setCurrentLocation] = useState({
    latitude : "",
    longitude: "",
  });

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Here you can use latitude and longitude to fetch location details using reverse geocoding API
          setCurrentLocation({ latitude: latitude.toString(), longitude: longitude.toString() });
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation({ latitude: "", longitude: "" });
        }
      );
    } else {
      setCurrentLocation({ latitude: "", longitude: "" });
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div>
      <LocationConverter
        latitude={currentLocation?.latitude}
        longitude={currentLocation?.longitude}
      />
    </div>
  );
};

export default LocationSearchRenderer;
